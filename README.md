# 🦎 Tap the Lizard - LIZARD LIZARD LIZARD

A fun, meme-style web page inspired by the viral "Lizard Lizard Lizard" meme from Disney's Elio movie post-credits scene. Click or tap the lizard button to hear the robotic "LIZARD" sound and watch your count grow!

## Features

- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Instant Audio**: No delay audio playback using audio pooling technique
- **Visual Effects**: 
  - Glowing neon text animations
  - Floating "LIZARD" text on each click
  - Button press animations
  - Easter eggs at high click counts (100+ and 500+)
- **Mobile Optimized**: 
  - Touch-friendly interactions
  - Prevents double-tap zoom
  - Optimized for various screen sizes
- **Keyboard Support**: Press spacebar or enter to activate
- **Accessibility**: Respects reduced motion preferences

## How to Use

1. Open `index.html` in any modern web browser
2. Click, tap, or press spacebar on the lizard button
3. Hear the robotic "LIZARD" sound and watch the counter increase
4. Enjoy the meme experience!

## Files

- `index.html` - Main web page
- `style.css` - Styling with neon green theme and animations  
- `script.js` - JavaScript for interactions and audio
- `lizard-button.mp3` - Generated robotic "LIZARD" sound effect

## Technical Details

- Uses Web Audio API for low-latency audio playback
- Audio pooling prevents delays on rapid clicking
- Fallback beep sound if main audio fails to load
- CSS animations with hardware acceleration
- Mobile-first responsive design approach

## Browser Compatibility

Works in all modern browsers that support:
- Web Audio API
- CSS3 animations
- ES6 JavaScript features

## Running Locally

Simply open `index.html` in your browser, or serve via HTTP:

```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Meme Origin

Based on the "Lizard Lizard Lizard" meme from Disney Pixar's 2025 film *Elio* post-credits scene, which became viral on TikTok as a greenscreen template for repetitive action jokes.

---

**Tap responsibly! 🦎**