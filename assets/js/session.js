/* Session page: video versions and the slide carousel.
   Each session page keeps its sources in the JSON block #session-media.
   A version uses youtubeId when that field is set, otherwise file.
   Set youtubeId to an 11-character id to swap a self-hosted file for an unlisted YouTube embed. */
(function () {
    var BLOCKED_IDS = { dQw4w9WgXcQ: true };

    function trim(value) {
        return String(value == null ? "" : value).replace(/^\s+|\s+$/g, "");
    }

    function validYouTubeId(value) {
        var id = trim(value);
        if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return "";
        if (BLOCKED_IDS[id]) return "";
        return id;
    }

    function readConfig() {
        var node = document.getElementById("session-media");
        if (!node) return null;
        try {
            return JSON.parse(node.textContent);
        } catch (err) {
            return null;
        }
    }

    function clear(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
    }

    function initMenu() {
        var menuBtn = document.getElementById("menuBtn");
        var navbar = document.getElementById("navbar");
        if (menuBtn) {
            menuBtn.addEventListener("click", function () {
                var nav = document.getElementById("navLinks");
                if (!nav) return;
                var open = nav.classList.toggle("show");
                menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }
        window.addEventListener("scroll", function () {
            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 10);
        });
        document.addEventListener("click", function (event) {
            if (navbar && !event.target.closest(".navbar")) {
                var nav = document.getElementById("navLinks");
                if (nav) nav.classList.remove("show");
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
            }
            if (event.target.closest("#navLinks a")) {
                var openNav = document.getElementById("navLinks");
                if (openNav) openNav.classList.remove("show");
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    function fallback(message) {
        var box = document.createElement("div");
        box.className = "session-fallback";
        var text = document.createElement("p");
        text.textContent = message;
        box.appendChild(text);
        return box;
    }

    function mountYouTube(stage, version, title) {
        var iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + version.youtubeId + "?rel=0";
        iframe.title = version.label + ". " + title;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        stage.appendChild(iframe);
    }

    function mountFile(stage, version, poster, title) {
        var video = document.createElement("video");
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.poster = poster || "";
        video.setAttribute("aria-label", version.label + ". " + title);
        var source = document.createElement("source");
        source.src = version.file;
        source.type = "video/mp4";
        video.appendChild(source);
        if (version.captions) {
            var track = document.createElement("track");
            track.kind = "captions";
            track.label = "English";
            track.srclang = "en";
            track.src = version.captions;
            video.appendChild(track);
        }
        stage.appendChild(video);
        video.load();

        if (!poster) return;
        var cover = document.createElement("button");
        cover.type = "button";
        cover.className = "session-poster-btn";
        cover.setAttribute("aria-label", "Play " + version.label);
        var img = document.createElement("img");
        img.src = poster;
        img.alt = "";
        var icon = document.createElement("span");
        icon.className = "session-play-icon";
        icon.setAttribute("aria-hidden", "true");
        cover.appendChild(img);
        cover.appendChild(icon);
        cover.addEventListener("click", function () {
            cover.hidden = true;
            var started = video.play();
            if (started && started.catch) {
                started.catch(function () { cover.hidden = false; });
            }
        });
        video.addEventListener("pause", function () {
            if (video.currentTime < 0.25 && !video.seeking) cover.hidden = false;
        });
        stage.appendChild(cover);
    }

    function initPlayer(config) {
        var root = document.getElementById("sessionPlayer");
        var tabs = document.getElementById("versionTabs");
        var stage = document.getElementById("playerStage");
        var note = document.getElementById("versionNote");
        if (!root || !tabs || !stage || !config || !config.versions || !config.versions.length) return;

        var versions = config.versions.map(function (version) {
            return {
                id: trim(version.id),
                label: trim(version.label) || "Version",
                file: trim(version.file),
                youtubeId: validYouTubeId(version.youtubeId),
                captions: trim(version.captions),
                note: trim(version.note)
            };
        });
        var poster = trim(config.poster);
        var title = trim(config.title) || "Session video";
        var current = 0;

        versions.forEach(function (version, index) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "version-tab";
            button.id = "version-tab-" + (version.id || index);
            button.setAttribute("role", "tab");
            button.setAttribute("aria-controls", "playerStage");
            button.setAttribute("data-version", version.id || String(index));
            button.textContent = version.label;
            button.addEventListener("click", function () {
                select(index);
            });
            tabs.appendChild(button);
        });

        function buttons() {
            return tabs.querySelectorAll('[role="tab"]');
        }

        function select(index) {
            if (index < 0 || index >= versions.length) return;
            current = index;
            var version = versions[index];
            var tabButtons = buttons();
            Array.prototype.forEach.call(tabButtons, function (button, buttonIndex) {
                var selected = buttonIndex === index;
                button.setAttribute("aria-selected", selected ? "true" : "false");
                button.tabIndex = selected ? 0 : -1;
            });
            stage.setAttribute("aria-labelledby", tabButtons[index].id);
            if (note) note.textContent = version.note || "";
            clear(stage);
            if (version.youtubeId) {
                mountYouTube(stage, version, title);
            } else if (version.file) {
                mountFile(stage, version, poster, title);
            } else {
                stage.appendChild(fallback("This version is not linked yet. Add a youtubeId or a file path in the session media config."));
            }
        }

        tabs.addEventListener("keydown", function (event) {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
            event.preventDefault();
            var next = current;
            if (event.key === "ArrowRight") next = (current + 1) % versions.length;
            if (event.key === "ArrowLeft") next = (current - 1 + versions.length) % versions.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = versions.length - 1;
            select(next);
            var tabButtons = buttons();
            if (tabButtons[next]) tabButtons[next].focus();
        });

        select(0);
    }

    function initSlides() {
        var root = document.getElementById("slideshow");
        var track = document.getElementById("slideshowTrack");
        var countEl = document.getElementById("slideCount");
        var prevBtn = document.getElementById("slidePrev");
        var nextBtn = document.getElementById("slideNext");
        var fullBtn = document.getElementById("slideFull");
        if (!root || !track || !prevBtn || !nextBtn) return;

        var slides = track.querySelectorAll("figure");
        var total = slides.length;
        var index = 0;
        if (!total) return;

        root.classList.add("is-ready");

        function loadAround(centre) {
            [centre - 1, centre, centre + 1].forEach(function (itemIndex) {
                if (itemIndex < 0 || itemIndex >= total) return;
                var img = slides[itemIndex].querySelector("img");
                if (!img) return;
                var pending = img.getAttribute("data-src");
                if (pending && !img.getAttribute("src")) img.setAttribute("src", pending);
            });
        }

        function go(nextIndex) {
            if (nextIndex < 0 || nextIndex >= total) return;
            index = nextIndex;
            track.style.transform = "translateX(" + (-100 * index) + "%)";
            Array.prototype.forEach.call(slides, function (slide, slideIndex) {
                var current = slideIndex === index;
                slide.setAttribute("aria-hidden", current ? "false" : "true");
                if ("inert" in slide) {
                    if (current) slide.removeAttribute("inert");
                    else slide.setAttribute("inert", "");
                }
            });
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === total - 1;
            if (countEl) countEl.textContent = "Slide " + (index + 1) + " of " + total;
            loadAround(index);
        }

        prevBtn.addEventListener("click", function () { go(index - 1); });
        nextBtn.addEventListener("click", function () { go(index + 1); });

        var startX = 0;
        var startY = 0;
        var viewport = root.querySelector(".slideshow-viewport");
        if (viewport) {
            viewport.addEventListener("touchstart", function (event) {
                if (!event.touches || !event.touches.length) return;
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
            }, { passive: true });
            viewport.addEventListener("touchend", function (event) {
                if (!event.changedTouches || !event.changedTouches.length) return;
                var dx = event.changedTouches[0].clientX - startX;
                var dy = event.changedTouches[0].clientY - startY;
                if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
                go(dx < 0 ? index + 1 : index - 1);
            }, { passive: true });
        }

        root.addEventListener("keydown", function (event) {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            event.preventDefault();
            if (event.key === "ArrowLeft") go(index - 1);
            if (event.key === "ArrowRight") go(index + 1);
        });

        function fullscreenElement() {
            return document.fullscreenElement || document.webkitFullscreenElement || null;
        }

        function syncFullLabel() {
            if (!fullBtn) return;
            var on = fullscreenElement() === root;
            fullBtn.textContent = on ? "Exit full screen" : "Full screen";
            fullBtn.setAttribute("aria-pressed", on ? "true" : "false");
        }

        if (fullBtn) {
            if (!root.requestFullscreen && !root.webkitRequestFullscreen) {
                fullBtn.hidden = true;
            } else {
                fullBtn.addEventListener("click", function () {
                    if (fullscreenElement() === root) {
                        if (document.exitFullscreen) document.exitFullscreen();
                        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    } else if (root.requestFullscreen) {
                        root.requestFullscreen();
                    } else if (root.webkitRequestFullscreen) {
                        root.webkitRequestFullscreen();
                    }
                });
                document.addEventListener("fullscreenchange", syncFullLabel);
                document.addEventListener("webkitfullscreenchange", syncFullLabel);
                syncFullLabel();
            }
        }

        go(0);
    }

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initPlayer(readConfig());
        initSlides();
    });
})();
