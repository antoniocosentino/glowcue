(() => {
  if (!window.__trafficGlowOverlay) {
    const overlay = document.createElement("div");
    overlay.id = "traffic-glow-overlay";
    document.body.appendChild(overlay);
    window.__trafficGlowOverlay = overlay;
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "SET_GLOW") return;

    const overlay = window.__trafficGlowOverlay;
    overlay.className = "";

    if (msg.color === "yellow") {
      overlay.classList.add("glow-yellow");
    } else if (msg.color === "red") {
      overlay.classList.add("glow-red");
    }
  });
})();