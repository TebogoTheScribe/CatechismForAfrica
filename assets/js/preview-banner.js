(function () {
  var host = (location.hostname || "").toLowerCase();
  if (host === "catechism-for-africa.netlify.app" || host === "www.catechism-for-africa.netlify.app") return;
  if (host.indexOf("deploy-preview") === -1 && host.indexOf("preview-") !== 0 && host !== "localhost" && host !== "127.0.0.1") return;
  var bar = document.createElement("div");
  bar.className = "preview-banner is-visible";
  bar.setAttribute("role", "status");
  bar.textContent = "Preview — this is not the live site. Nothing here is published until Tebogo approves it.";
  var nav = document.getElementById("navbar") || document.querySelector(".navbar");
  if (nav && nav.parentNode) {
    nav.parentNode.insertBefore(bar, nav.nextSibling);
  } else {
    document.body.insertBefore(bar, document.body.firstChild);
  }
})();
