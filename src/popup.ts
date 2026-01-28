import type { GlowColor, GlowMessage } from './types';

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
    const message: GlowMessage = {
      type: 'SET_GLOW',
      color,
    };

    chrome.tabs.sendMessage(tab.id, message);
  });
});
