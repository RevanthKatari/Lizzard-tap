// DOM elements
const lizardButton = document.getElementById('lizardButton');
const lizardSound = document.getElementById('lizardSound');
const counter = document.getElementById('counter');

// State
let lizardCount = 0;
let audioPool = [];
let currentAudioIndex = 0;

// Create multiple audio instances for rapid playback without delay
function createAudioPool() {
    const poolSize = 10; // Create 10 audio instances
    audioPool = [];
    
    for (let i = 0; i < poolSize; i++) {
        const audio = new Audio();
        
        // Try to load from multiple sources
        audio.src = 'lizard-button.mp3';
        
        // Fallback to a simple beep sound if no audio file is found
        audio.onerror = () => {
            // Create a simple beep using Web Audio API as fallback
            createBeepSound();
        };
        
        audio.preload = 'auto';
        audio.volume = 0.7;
        audioPool.push(audio);
    }
}

// Create a simple beep sound using Web Audio API as fallback
function createBeepSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        return function playBeep() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    } catch (error) {
        console.log('Web Audio API not supported');
        return () => {}; // Return empty function if Web Audio API is not supported
    }
}

// Fallback beep function
const playBeep = createBeepSound();

// Play lizard sound
function playLizardSound() {
    try {
        // Try to play from audio pool first
        if (audioPool.length > 0) {
            const audio = audioPool[currentAudioIndex];
            currentAudioIndex = (currentAudioIndex + 1) % audioPool.length;
            
            // Reset audio to beginning and play
            audio.currentTime = 0;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play failed, using beep fallback');
                    playBeep();
                });
            }
        } else {
            // Fallback to beep sound
            playBeep();
        }
    } catch (error) {
        console.log('Audio error, using beep fallback');
        playBeep();
    }
}

// Handle button click/tap
function handleLizardClick() {
    // Increment counter
    lizardCount++;
    counter.textContent = lizardCount;
    
    // Play sound
    playLizardSound();
    
    // Add visual feedback
    lizardButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        lizardButton.style.transform = '';
    }, 100);
    
    // Create floating "LIZARD" text effect
    createFloatingText();
}

// Create floating text effect
function createFloatingText() {
    const floatingText = document.createElement('div');
    floatingText.textContent = 'LIZARD';
    floatingText.style.cssText = `
        position: fixed;
        color: #00ff00;
        font-weight: 900;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 1000;
        text-shadow: 0 0 10px #00ff00;
        animation: floatUp 1s ease-out forwards;
    `;
    
    // Position randomly around the button
    const buttonRect = lizardButton.getBoundingClientRect();
    const randomX = buttonRect.left + (Math.random() * buttonRect.width);
    const randomY = buttonRect.top + (Math.random() * buttonRect.height);
    
    floatingText.style.left = randomX + 'px';
    floatingText.style.top = randomY + 'px';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 1000);
}

// Add floating animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

// Event listeners
lizardButton.addEventListener('click', handleLizardClick);
lizardButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent double-firing on mobile
    handleLizardClick();
});

// Keyboard support (spacebar)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleLizardClick();
    }
});

// Initialize audio pool when page loads
document.addEventListener('DOMContentLoaded', () => {
    createAudioPool();
    
    // Enable audio context on first user interaction (required by browsers)
    const enableAudio = () => {
        // Try to resume audio context if it's suspended
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }
        
        // Remove the listener after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
    };
    
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
});

// Prevent context menu on long press (mobile)
lizardButton.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add some easter eggs for high counts
function checkForEasterEggs() {
    if (lizardCount === 100) {
        document.body.style.animation = 'rainbow 1s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
    
    if (lizardCount === 500) {
        // Crazy mode - rapid fire lizards
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createFloatingText(), i * 100);
        }
    }
}

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Update the click handler to include easter eggs
const originalHandler = handleLizardClick;
handleLizardClick = function() {
    originalHandler();
    checkForEasterEggs();
};