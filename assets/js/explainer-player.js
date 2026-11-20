/* Mobile / Desktop toggle for explainer YouTube embeds.
   Remembers the same choice as curriculum session videos (cfa-video-format). */
(function () {
  var STORE_KEY = "cfa-video-format";
  var player = document.getElementById("explainerPlayer");
  if (!player) return;

  var sources = {
    mobile: {
      id: player.getAttribute("data-youtube-9x16") || "",
      note: "Mobile: portrait 9:16. Switch to Desktop for the widescreen film."
    },
    desktop: {
      id: player.getAttribute("data-youtube-16x9") || "",
      note: "Desktop: widescreen 16:9. Switch to Mobile for the portrait film."
    }
  };
  var title = player.getAttribute("data-title") || "Explainer";
  var stage = document.getElementById("playerStage");
  var note = document.getElementById("versionNote");
  var tabs = {
    mobile: document.getElementById("tab-mobile"),
    desktop: document.getElementById("tab-desktop")
  };

  function remembered() {
    try {
      var saved = window.localStorage.getItem(STORE_KEY) || "";
      if (saved === "mobile" || saved === "desktop") return saved;
    } catch (err) { /* storage blocked */ }
    return "";
  }

  function remember(mode) {
    try { window.localStorage.setItem(STORE_KEY, mode); } catch (err) { /* storage blocked */ }
  }

  function preferred() {
    var saved = remembered();
    if (saved) return saved;
    var narrow = window.matchMedia && window.matchMedia("(orientation: portrait), (max-width: 760px)").matches;
    return narrow ? "mobile" : "desktop";
  }

  function embed(id, label) {
    stage.innerHTML = "";
    if (!id) {
      var p = document.createElement("p");
      p.textContent = "This film is not linked yet.";
      stage.appendChild(p);
      return;
    }
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
    iframe.title = label + ". " + title;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    stage.appendChild(iframe);
  }

  function apply(mode) {
    var src = sources[mode];
    if (tabs.mobile) tabs.mobile.setAttribute("aria-selected", mode === "mobile" ? "true" : "false");
    if (tabs.desktop) tabs.desktop.setAttribute("aria-selected", mode === "desktop" ? "true" : "false");
    player.classList.toggle("session-player--portrait", mode === "mobile");
    if (note) note.textContent = src.note;
    embed(src.id, mode === "mobile" ? "Mobile" : "Desktop");
    remember(mode);
  }

  if (tabs.mobile) tabs.mobile.addEventListener("click", function () { apply("mobile"); });
  if (tabs.desktop) tabs.desktop.addEventListener("click", function () { apply("desktop"); });
  apply(preferred());
})();
