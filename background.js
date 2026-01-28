chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "glowcue-root",
    title: "GlowCue",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "glowcue-off",
    parentId: "glowcue-root",
    title: "🟢 Clear",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "glowcue-yellow",
    parentId: "glowcue-root",
    title: "🟡 Warning",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "glowcue-red",
    parentId: "glowcue-root",
    title: "🔴 Time up",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  let color = null;

  if (info.menuItemId === "glowcue-off") color = "off";
  if (info.menuItemId === "glowcue-yellow") color = "yellow";
  if (info.menuItemId === "glowcue-red") color = "red";

  if (!color) return;

  // Ensure content script exists
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  }).catch(() => {});

  await chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["glow.css"]
  }).catch(() => {});

  chrome.tabs.sendMessage(tab.id, {
    type: "SET_GLOW",
    color
  });
});