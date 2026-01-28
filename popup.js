document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["glow.css"]
    });

    chrome.tabs.sendMessage(tab.id, {
      type: "SET_GLOW",
      color: btn.dataset.color
    });
  });
});