import type { GlowColor, GlowMessage } from './types';

const BASE_TITLES: Record<string, string> = {
  'glowcue-off': '🟢 Clear',
  'glowcue-yellow': '🟡 Warning',
  'glowcue-red': '🔴 Time up',
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'glowcue-root',
    title: 'GlowCue',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    id: 'glowcue-off',
    parentId: 'glowcue-root',
    title: '🟢 Clear',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    id: 'glowcue-yellow',
    parentId: 'glowcue-root',
    title: '🟡 Warning',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    id: 'glowcue-red',
    parentId: 'glowcue-root',
    title: '🔴 Time up',
    contexts: ['all'],
  });
});

async function updateContextMenus(tabId: number) {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const overlay = window.__trafficGlowOverlay;
        if (!overlay || overlay.style.opacity === '0') return 'off';
        if (overlay.classList.contains('glow-yellow')) return 'yellow';
        if (overlay.classList.contains('glow-red')) return 'red';
        return 'off';
      },
    });

    const currentColor = result[0]?.result as GlowColor | undefined;
    const activeMenuId = currentColor
      ? `glowcue-${currentColor}`
      : 'glowcue-off';

    // Update all menu items
    for (const [menuId, baseTitle] of Object.entries(BASE_TITLES)) {
      const title =
        menuId === activeMenuId ? `${baseTitle} (Active)` : baseTitle;
      chrome.contextMenus.update(menuId, { title });
    }
  } catch {
    // Extension might not be injected yet, reset to base titles
    for (const [menuId, baseTitle] of Object.entries(BASE_TITLES)) {
      chrome.contextMenus.update(menuId, { title: baseTitle });
    }
  }
}

// Update context menus when they're about to be shown
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateContextMenus(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    await updateContextMenus(tabId);
  }
});

async function setGlow(tabId: number, color: GlowColor) {
  // Ensure content script exists
  await chrome.scripting
    .executeScript({
      target: { tabId },
      files: ['content.js'],
    })
    .catch(() => {});

  await chrome.scripting
    .insertCSS({
      target: { tabId },
      files: ['glow.css'],
    })
    .catch(() => {});

  const message: GlowMessage = {
    type: 'SET_GLOW',
    color,
  };

  chrome.tabs.sendMessage(tabId, message);

  // Update context menus to reflect the new active state
  await updateContextMenus(tabId);
}

chrome.contextMenus.onClicked.addListener(
  async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (!tab?.id) return;

    let color: GlowColor | null = null;

    if (info.menuItemId === 'glowcue-off') color = 'off';
    if (info.menuItemId === 'glowcue-yellow') color = 'yellow';
    if (info.menuItemId === 'glowcue-red') color = 'red';

    if (!color) return;

    await setGlow(tab.id, color);
  }
);

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  let color: GlowColor | null = null;

  if (command === 'glow-clear') color = 'off';
  if (command === 'glow-warning') color = 'yellow';
  if (command === 'glow-timeup') color = 'red';

  if (!color) return;

  await setGlow(tab.id, color);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SET_GLOW_FROM_POPUP') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.id) {
        setGlow(tab.id, message.color as GlowColor);
      }
    });
  }
});
