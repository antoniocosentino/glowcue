# GlowCue

GlowCue is a simple Chrome extension designed for presenters who want to stay on track during timed talks. With just a click or a right-click menu you can signal time warnings directly on your slides using vibrant, animated glows. Perfect for Pitch Slides, Google Slides, Docs, or any web-based presentation tool.


https://github.com/user-attachments/assets/f2fbfa5f-da4b-4fea-ad57-9cb17047f37a



## Features

### Traffic-light-style signaling

- 🟢 Clear
- 🟡 Warning
- 🔴 Time up

### Siri-style glowing overlay

- Subtle, animated, and highly visible
- Works even during screen sharing

### Context menu support

- Right-click anywhere → GlowCue → choose your state
- Perfect for fullscreen presentations

### Optional popup control

- Control your glow from the extension icon
- Simple, intuitive interface

### Slide-scoped glow

- Automatically attaches to .slide-wrapper if present
- Falls back gracefully to the whole page

### Fully lightweight and unobtrusive

- Only shows the glow when needed
- Doesn't interfere with your slides or content

## Development

This extension is built with TypeScript, ESLint, Prettier, and Webpack.

### Setup

```bash
npm install
```

### Development Mode

Run the dev build with watch mode. The extension will be built to the `dist/` folder:

```bash
npm run dev
```

Load the extension in Chrome:
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

The extension will automatically rebuild when you make changes to the source files.

### Production Build

Create an optimized production build in the `build/` folder with a zip file for Chrome Web Store submission:

```bash
npm run build
```

### Code Quality

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Project Structure

```
glowcue/
├── src/              # TypeScript source files
│   ├── background.ts
│   ├── content.ts
│   ├── popup.ts
│   ├── types.ts
│   ├── popup.html
│   └── glow.css
├── dist/             # Development builds (gitignored)
├── build/            # Production builds (gitignored)
├── icons/            # Extension icons
└── manifest.json     # Chrome extension manifest
```
