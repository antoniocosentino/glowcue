let overlay = document.getElementById("traffic-glow-overlay");

if (!overlay) {
  overlay = document.createElement("div");
  overlay.id = "traffic-glow-overlay";
  document.body.appendChild(overlay);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "SET_GLOW") return;

  overlay.className = "";

  if (msg.color === "yellow") {
    overlay.classList.add("glow-yellow");
  } else if (msg.color === "red") {
    overlay.classList.add("glow-red");
  }
});