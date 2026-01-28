(() => {
  if (!window.__trafficGlowOverlay) {
    const overlay = document.createElement("div");
    overlay.id = "traffic-glow-overlay";

    // Find slide wrapper if present
    const slideWrapper = document.querySelector(".slide-wrapper");

    if (slideWrapper) {
      // Ensure positioning context
      const computed = window.getComputedStyle(slideWrapper);
      if (computed.position === "static") {
        slideWrapper.style.position = "relative";
      }

      overlay.style.position = "absolute";
      overlay.style.inset = "0";

      slideWrapper.appendChild(overlay);
    } else {
      // Fallback: whole page
      overlay.style.position = "fixed";
      overlay.style.inset = "0";

      document.body.appendChild(overlay);
    }

    window.__trafficGlowOverlay = overlay;
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "SET_GLOW") return;

    const overlay = window.__trafficGlowOverlay;
    overlay.className = "";

    if (msg.color === "off") {
      overlay.style.opacity = "0";
      return;
    }

    overlay.style.opacity = "1";

    if (msg.color === "yellow") {
      overlay.classList.add("glow-yellow");
    } else if (msg.color === "red") {
      overlay.classList.add("glow-red");
    }
  });
})();