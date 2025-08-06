// DOM elements
const lizardButton = document.getElementById('lizardButton');
const lizardSound = document.getElementById('lizardSound');
const counter = document.getElementById('counter');
const particlesContainer = document.getElementById('particles');

// Utility buttons
const soundToggle = document.getElementById('soundToggle');
const resetGame = document.getElementById('resetGame');
const shareScore = document.getElementById('shareScore');
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const modalClose = document.querySelector('.modal-close');

// Achievement elements
const achievements = {
    10: document.getElementById('achievement-10'),
    100: document.getElementById('achievement-100'),
    1000: document.getElementById('achievement-1000')
};

// Game state
let gameState = {
    lizardCount: parseInt(localStorage.getItem('lizardCount') || '0'),
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    unlockedAchievements: JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
};

// Audio management
let audioPool = [];
let currentAudioIndex = 0;
const AUDIO_POOL_SIZE = 10;

// Particle system
let particles = [];
const MAX_PARTICLES = 15;

// Initialize particle system
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 3;
    const delay = Math.random() * 2;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${animationDuration}s;
        animation-delay: ${delay}s;
    `;
    
    particlesContainer.appendChild(particle);
    particles.push(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            particles = particles.filter(p => p !== particle);
        }
    }, (animationDuration + delay) * 1000);
}

function maintainParticles() {
    while (particles.length < MAX_PARTICLES) {
        createParticle();
    }
}

// Audio system
function createAudioPool() {
    audioPool = [];
    for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
        const audio = new Audio();
        audio.src = 'lizard-button.mp3';
        audio.preload = 'auto';
        audio.volume = 0.6;
        audio.onerror = () => console.log('Audio file not found, using fallback');
        audioPool.push(audio);
    }
}

// Fallback beep sound
function createBeepSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return function playBeep() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    } catch (error) {
        return () => {};
    }
}

const playBeep = createBeepSound();

// Play lizard sound
function playLizardSound() {
    if (!gameState.soundEnabled) return;
    
    try {
        if (audioPool.length > 0) {
            const audio = audioPool[currentAudioIndex];
            currentAudioIndex = (currentAudioIndex + 1) % audioPool.length;
            
            audio.currentTime = 0;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(() => playBeep());
            }
        } else {
            playBeep();
        }
    } catch (error) {
        playBeep();
    }
}

// Achievement system
function checkAchievements() {
    const achievementLevels = [10, 100, 1000];
    
    achievementLevels.forEach(level => {
        if (gameState.lizardCount >= level && !gameState.unlockedAchievements.includes(level)) {
            unlockAchievement(level);
        }
    });
}

function unlockAchievement(level) {
    gameState.unlockedAchievements.push(level);
    localStorage.setItem('unlockedAchievements', JSON.stringify(gameState.unlockedAchievements));
    
    const achievement = achievements[level];
    if (achievement) {
        achievement.classList.add('unlocked');
        
        // Show achievement notification
        showAchievementNotification(level);
        
        // Special effects for major achievements
        if (level === 100) {
            triggerCelebration();
        } else if (level === 1000) {
            triggerEpicCelebration();
        }
    }
}

function showAchievementNotification(level) {
    const notification = document.createElement('div');
    const achievementTexts = {
        10: 'First 10 Lizards!',
        100: 'Century Achievement!',
        1000: 'Lizard King Unlocked!'
    };
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 15px 20px;
            color: #00ff00;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 5px 20px rgba(0, 255, 0, 0.3);
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
        ">
            🏆 ${achievementTexts[level]}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Celebration effects
function triggerCelebration() {
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 4000);
    
    // Create multiple floating texts
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createFloatingText('🎉'), i * 150);
    }
}

function triggerEpicCelebration() {
    // Epic celebration with screen shake and multiple effects
    document.body.style.animation = 'rainbow 3s infinite, shake 0.5s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 6000);
    
    // Create massive floating text celebration
    const celebrationTexts = ['👑', '🦎', '⭐', '🎊', '🎉'];
    for (let i = 0; i < 20; i++) {
        const text = celebrationTexts[Math.floor(Math.random() * celebrationTexts.length)];
        setTimeout(() => createFloatingText(text), i * 100);
    }
}

// Enhanced floating text
function createFloatingText(text = 'LIZARD') {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.cssText = `
        position: fixed;
        color: #00ff00;
        font-weight: 900;
        font-size: ${Math.random() * 1 + 1.2}rem;
        pointer-events: none;
        z-index: 1000;
        text-shadow: 0 0 10px #00ff00;
        animation: floatUp 1.5s ease-out forwards;
    `;
    
    // Position randomly around the button
    const buttonRect = lizardButton.getBoundingClientRect();
    const randomX = buttonRect.left + (Math.random() * buttonRect.width);
    const randomY = buttonRect.top + (Math.random() * buttonRect.height);
    
    floatingText.style.left = randomX + 'px';
    floatingText.style.top = randomY + 'px';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 1500);
}

// Main game logic
function handleLizardClick() {
    // Increment counter
    gameState.lizardCount++;
    counter.textContent = gameState.lizardCount.toLocaleString();
    
    // Save progress
    localStorage.setItem('lizardCount', gameState.lizardCount.toString());
    
    // Play sound
    playLizardSound();
    
    // Check achievements
    checkAchievements();
    
    // Visual effects
    createFloatingText();
    
    // Button animation
    lizardButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        lizardButton.style.transform = '';
    }, 100);
    
    // Special effects at certain milestones
    if (gameState.lizardCount % 50 === 0) {
        triggerMilestoneEffect();
    }
}

function triggerMilestoneEffect() {
    // Create burst of particles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createParticle(), i * 50);
    }
}

// Utility button functions
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    localStorage.setItem('soundEnabled', gameState.soundEnabled.toString());
    
    soundToggle.classList.toggle('active', gameState.soundEnabled);
    soundToggle.querySelector('.btn-icon').textContent = gameState.soundEnabled ? '🔊' : '🔇';
    
    if (gameState.soundEnabled) {
        playLizardSound();
    }
}

function resetGameProgress() {
    if (confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
        gameState.lizardCount = 0;
        gameState.unlockedAchievements = [];
        
        localStorage.setItem('lizardCount', '0');
        localStorage.setItem('unlockedAchievements', '[]');
        
        counter.textContent = '0';
        
        // Reset achievements
        Object.values(achievements).forEach(achievement => {
            achievement.classList.remove('unlocked');
        });
        
        // Show reset confirmation
        createFloatingText('RESET!');
    }
}

function shareScore() {
    const shareText = `I just tapped ${gameState.lizardCount.toLocaleString()} lizards in the ultimate lizard tapping game! Can you beat my score? 🦎`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Tap the Lizard - My Score',
            text: shareText,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(`${shareText} ${window.location.href}`).then(() => {
            createFloatingText('COPIED!');
        });
    } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText} ${window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        createFloatingText('COPIED!');
    }
}

function showInfo() {
    infoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideInfo() {
    infoModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Privacy and contact functions (placeholder)
function showPrivacy() {
    alert('Privacy Policy: This game stores your progress locally in your browser. No personal data is collected or shared.');
}

function showContact() {
    alert('Contact: This is a demo game. For inquiries, please visit the GitHub repository.');
}

// Initialize game
function initializeGame() {
    // Set initial counter
    counter.textContent = gameState.lizardCount.toLocaleString();
    
    // Initialize sound toggle
    soundToggle.classList.toggle('active', gameState.soundEnabled);
    soundToggle.querySelector('.btn-icon').textContent = gameState.soundEnabled ? '🔊' : '🔇';
    
    // Initialize achievements
    gameState.unlockedAchievements.forEach(level => {
        const achievement = achievements[level];
        if (achievement) {
            achievement.classList.add('unlocked');
        }
    });
    
    // Create audio pool
    createAudioPool();
    
    // Start particle system
    maintainParticles();
    setInterval(maintainParticles, 2000);
}

// Event listeners
lizardButton.addEventListener('click', handleLizardClick);
lizardButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleLizardClick();
});

// Utility button events
soundToggle.addEventListener('click', toggleSound);
resetGame.addEventListener('click', resetGameProgress);
shareScore.addEventListener('click', shareScore);
infoBtn.addEventListener('click', showInfo);

// Modal events
modalClose.addEventListener('click', hideInfo);
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        hideInfo();
    }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleLizardClick();
    } else if (e.code === 'Escape' && infoModal.style.display === 'flex') {
        hideInfo();
    }
});

// Prevent context menu on long press
lizardButton.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add CSS animations for special effects
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(additionalStyles);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGame);

// Enable audio context on first user interaction
const enableAudio = () => {
    if (window.AudioContext || window.webkitAudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
};

document.addEventListener('click', enableAudio);
document.addEventListener('touchstart', enableAudio);

// Add global functions for footer links
window.showPrivacy = showPrivacy;
window.showContact = showContact;

// Performance monitoring
let lastFrameTime = performance.now();
function monitorPerformance() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    
    // If frame rate drops significantly, reduce particle count
    if (deltaTime > 32 && particles.length > 5) { // Less than 30 FPS
        const particleToRemove = particles.shift();
        if (particleToRemove && particleToRemove.parentNode) {
            particleToRemove.parentNode.removeChild(particleToRemove);
        }
    }
    
    lastFrameTime = currentTime;
    requestAnimationFrame(monitorPerformance);
}

requestAnimationFrame(monitorPerformance);