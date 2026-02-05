import type { GlowColor, GlowMessage } from './types';

// Get current active state and highlight the corresponding button
(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab.id) return;

  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const overlay = window.__trafficGlowOverlay;
        if (!overlay || overlay.style.opacity === '0') return 'off';
        if (overlay.classList.contains('glow-yellow')) return 'yellow';
        if (overlay.classList.contains('glow-red')) return 'red';
        return 'off';
      },
    });

    const currentColor = result[0]?.result as GlowColor | undefined;
    if (currentColor) {
      const activeButton = document.querySelector(
        `button[data-color="${currentColor}"]`
      );
      const buttonText = activeButton?.textContent?.replace(/^✔\s*/, '');

      if (activeButton && buttonText) {
        activeButton.textContent = `✔ ${buttonText}`;
      }
    }
  } catch {
    // Extension might not be injected yet, that's okay
  }
})();

document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });

    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['glow.css'],
    });

    const color = btn.dataset.color as GlowColor;
    chrome.runtime.sendMessage({ type: 'SET_GLOW_FROM_POPUP', color });
    window.close();
  });
});
