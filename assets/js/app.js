var ROUTES = {
    home: "/",
    content: "/content",
    explainers: "/explainers",
    apologetics: "/apologetics",
    about: "/about",
    licensing: "/licensing",
    subscribe: "/subscribe"
};

var CATEGORIES = {
    prayer: "Prayer",
    sacraments: "Sacraments",
    morality: "Morality",
    doctrine: "Doctrine",
    scripture: "Scripture",
    rcia: "RCIA"
};

var ORIGINAL_LABEL = "Original lesson";
var AI_LABEL_DEFAULT = "AI-assisted explainer, reviewed by Tebogo Mokwena";
var BLOCKED_IDS = { dQw4w9WgXcQ: true };

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function pageFromPath(path) {
    var clean = String(path || "/").split("?")[0].replace(/\/+$/, "") || "/";
    var found = "home";
    Object.keys(ROUTES).forEach(function (id) {
        if (ROUTES[id] === clean) found = id;
    });
    return found;
}

function showPage(pageId, options) {
    options = options || {};
    if (!document.getElementById(pageId)) pageId = "home";
    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.toggle("active", page.id === pageId);
    });
    document.querySelectorAll(".nav-links a[data-page]").forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("data-page") === pageId);
    });
    var nav = document.getElementById("navLinks");
    var menuBtn = document.getElementById("menuBtn");
    if (nav) nav.classList.remove("show");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (options.updateHistory !== false) {
        var path = ROUTES[pageId] || "/";
        var current = location.pathname.replace(/\/+$/, "") || "/";
        if (current !== path) history.pushState({ page: pageId }, "", path);
    }
    if (!options.keepScroll) window.scrollTo(0, 0);
    activateEmbeds(pageId);
}

function activateEmbeds(pageId) {
    var root = document.getElementById(pageId);
    if (!root) return;
    root.querySelectorAll("iframe[data-src]").forEach(function (frame) {
        if (frame.getAttribute("src") !== frame.getAttribute("data-src")) {
            frame.setAttribute("src", frame.getAttribute("data-src"));
        }
    });
}

function toggleMenu() {
    var nav = document.getElementById("navLinks");
    var menuBtn = document.getElementById("menuBtn");
    if (!nav || !menuBtn) return;
    var open = nav.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function filterVideos(category, btn) {
    document.querySelectorAll("#lessonFilters .filter-btn").forEach(function (button) {
        button.classList.toggle("active", button === btn);
    });
    document.querySelectorAll("#videosGrid .video-card").forEach(function (card) {
        var show = category === "all" || card.getAttribute("data-category") === category;
        card.hidden = !show;
    });
}

function selectPlan(plan) {
    var select = document.getElementById("planSelect");
    var subscribe = document.getElementById("subscribe");
    if (select) {
        select.value = plan;
        if (select.value !== plan) select.value = "";
    }
    var already = subscribe && subscribe.classList.contains("active");
    if (!already) showPage("subscribe");
    var form = document.getElementById("signupForm");
    window.setTimeout(function () {
        if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
        if (select) select.focus({ preventScroll: true });
    }, already ? 0 : 60);
}

function showToast(message) {
    var toast = document.getElementById("toast");
    var text = document.getElementById("toastMessage");
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.add("show");
    window.setTimeout(function () { toast.classList.remove("show"); }, 5000);
}

function validYouTubeId(value) {
    var id = String(value || "").trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return "";
    if (BLOCKED_IDS[id]) return "";
    return id;
}

function isListed(item) {
    if (!item || !String(item.title || "").trim()) return false;
    return String(item.status || "published").trim() !== "draft";
}

function shouldEmbed(item) {
    if (!isListed(item)) return false;
    if (String(item.status || "published").trim() === "coming_soon") return false;
    return !!validYouTubeId(item.youtube_id);
}

function mediaHtml(item) {
    if (shouldEmbed(item)) {
        var id = validYouTubeId(item.youtube_id);
        var src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
        return '<div class="video-wrapper"><iframe data-src="' + src + '" title="' + escapeHtml(item.title) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
    }
    return '<div class="video-wrapper coming-soon"><div class="coming-soon-overlay"><i class="fas fa-play" aria-hidden="true"></i><span>Coming soon</span><small>The video link is not on the page yet</small></div></div>';
}

function metaHtml(item) {
    var bits = [];
    if (item.duration) bits.push('<span><i class="fas fa-clock" aria-hidden="true"></i> ' + escapeHtml(item.duration) + "</span>");
    if (item.level) bits.push("<span>" + escapeHtml(item.level) + "</span>");
    return bits.length ? '<div class="video-meta">' + bits.join("") + "</div>" : "";
}

function lessonCard(item) {
    var category = CATEGORIES[item.category] || item.category || "Lesson";
    var description = String(item.description || "").trim();
    return '<article class="video-card" data-category="' + escapeHtml(item.category || "") + '">' +
        mediaHtml(item) +
        '<div class="video-info"><span class="origin-label">' + escapeHtml(ORIGINAL_LABEL) + '</span><span class="video-tag">' + escapeHtml(category) + "</span><h3>" + escapeHtml(item.title) + "</h3>" +
        (description ? "<p>" + escapeHtml(description) + "</p>" : "") +
        metaHtml(item) + "</div></article>";
}

function explainerCard(item, label) {
    var description = String(item.description || "").trim();
    return '<article class="video-card">' +
        '<p class="ai-label">' + escapeHtml(label) + "</p>" +
        mediaHtml(item) +
        '<div class="video-info"><span class="video-tag">Explainer</span><h3>' + escapeHtml(item.title) + "</h3>" +
        (description ? "<p>" + escapeHtml(description) + "</p>" : "") +
        '<p>Free to watch.</p>' + metaHtml(item) + "</div></article>";
}

function apologeticsCard(item, label) {
    var description = String(item.description || "").trim();
    var kind = String(item.kind || "video").trim() === "article" ? "article" : "video";
    var ai = item.ai_assisted === true ? '<p class="ai-label">' + escapeHtml(label) + "</p>" : "";
    var body = "";
    if (kind === "article") {
        var text = String(item.body || "").trim();
        body = '<article class="article-card video-card">' + ai +
            '<div class="video-info"><span class="video-tag">Article</span><h3>' + escapeHtml(item.title) + "</h3>" +
            (description ? "<p>" + escapeHtml(description) + "</p>" : "") +
            (text ? '<div class="article-body">' + escapeHtml(text) + "</div>" : "") +
            "</div></article>";
        return body;
    }
    return '<article class="video-card">' + ai + mediaHtml(item) +
        '<div class="video-info"><span class="video-tag">Video</span><h3>' + escapeHtml(item.title) + "</h3>" +
        (description ? "<p>" + escapeHtml(description) + "</p>" : "") +
        metaHtml(item) + "</div></article>";
}

function renderLessons(lessons) {
    var grid = document.getElementById("videosGrid");
    var filters = document.getElementById("lessonFilters");
    if (!grid) return;
    var visible = (lessons || []).filter(isListed);
    var cats = [];
    visible.forEach(function (item) {
        if (item.category && cats.indexOf(item.category) === -1) cats.push(item.category);
    });
    if (filters) {
        var html = '<button type="button" class="filter-btn active" data-filter="all">All lessons</button>';
        cats.forEach(function (cat) {
            html += '<button type="button" class="filter-btn" data-filter="' + escapeHtml(cat) + '">' + escapeHtml(CATEGORIES[cat] || cat) + "</button>";
        });
        filters.innerHTML = html;
    }
    grid.innerHTML = visible.map(lessonCard).join("");
}

function renderExplainers(items, label) {
    var grid = document.getElementById("explainersGrid");
    var empty = document.getElementById("explainersEmpty");
    if (!grid) return;
    var visible = (items || []).filter(isListed);
    grid.innerHTML = visible.map(function (item) { return explainerCard(item, label); }).join("");
    grid.hidden = visible.length === 0;
    if (empty) empty.hidden = visible.length !== 0;
}

function renderApologetics(items, label) {
    var list = document.getElementById("apologeticsList");
    var empty = document.getElementById("apologeticsEmpty");
    if (!list) return;
    var visible = (items || []).filter(isListed);
    list.innerHTML = visible.map(function (item) { return apologeticsCard(item, label); }).join("");
    list.hidden = visible.length === 0;
    if (empty) empty.hidden = visible.length !== 0;
}

function setBind(name, value) {
    if (!value) return;
    document.querySelectorAll('[data-bind="' + name + '"]').forEach(function (el) {
        el.textContent = value;
    });
}

function setHeroTitle(text) {
    var el = document.getElementById("heroTitle");
    if (!el || !text) return;
    var tail = "for Africa";
    if (text.slice(-tail.length) === tail) {
        el.innerHTML = escapeHtml(text.slice(0, -tail.length)) + "<em>" + escapeHtml(tail) + "</em>";
    } else {
        el.textContent = text;
    }
}

function setChannel(url) {
    if (!/^https:\/\/(www\.)?youtube\.com\//.test(url || "")) return;
    document.querySelectorAll("[data-channel]").forEach(function (link) {
        link.setAttribute("href", url);
    });
}

function planChoiceLabel(plan, price) {
    var amount = price.amount || "";
    var period = price.period || "";
    if (plan.id === "free" || amount === "R0") return "Free";
    return plan.name + " — " + amount + period;
}

function renderPricing(pricing) {
    var grid = document.getElementById("pricingGrid");
    var notice = document.getElementById("pricingNotice");
    if (notice && pricing.notice) notice.textContent = pricing.notice;
    var plans = pricing.plans || [];
    if (!grid || !plans.length) return;
    grid.innerHTML = plans.map(function (plan) {
        var prices = plan.prices || [];
        var priceHtml = prices.map(function (price, index) {
            return '<div class="price' + (index ? " price-alt" : "") + '">' + escapeHtml(price.amount || "") +
                (price.period ? "<span>" + escapeHtml(price.period) + "</span>" : "") + "</div>";
        }).join("");
        var features = (plan.features || []).map(function (feature) {
            return '<li><i class="fas fa-check" aria-hidden="true"></i> ' + escapeHtml(feature) + "</li>";
        }).join("");
        var buttons = prices.map(function (price) {
            var label = planChoiceLabel(plan, price);
            return '<button type="button" class="btn ' + (plan.id === "individual" ? "btn-primary" : "btn-dark") + '" data-plan="' + escapeHtml(label) + '">Register interest' + (label === "Free" ? " — Free" : " · " + escapeHtml(label.replace(plan.name + " — ", ""))) + "</button>";
        }).join("");
        return '<article class="pricing-card"><h3>' + escapeHtml(plan.name) + "</h3>" + priceHtml +
            (plan.summary ? '<p class="plan-for">' + escapeHtml(plan.summary) + "</p>" : "") +
            "<ul>" + features + '</ul><div class="plan-actions">' + buttons + "</div></article>";
    }).join("");
    var select = document.getElementById("planSelect");
    if (!select) return;
    var current = select.value;
    var options = '<option value="">Select a plan...</option>';
    plans.forEach(function (plan) {
        (plan.prices || []).forEach(function (price) {
            var label = planChoiceLabel(plan, price);
            options += '<option value="' + escapeHtml(label) + '">' + escapeHtml(label) + "</option>";
        });
    });
    select.innerHTML = options;
    if (current) select.value = current;
}

function applyContent(content) {
    if (content.title) document.title = content.title + (content.tagline ? " | " + content.tagline : "");
    setHeroTitle(content.hero_title);
    setBind("hero_subtitle", content.hero_subtitle);
    setBind("tagline", content.tagline);
    setBind("disclaimer", content.disclaimer);
    setBind("lessons_intro", content.lessons_intro);
    setBind("explainers_intro", content.explainers_intro);
    if (content.about) {
        setBind("about_heading", content.about.heading);
        setBind("about_name", content.about.name);
        setBind("about_role", content.about.role);
        setBind("about_mission", content.about.mission);
        setBind("about_disclaimer", content.about.disclaimer || content.disclaimer);
    }
    if (content.apologetics) {
        setBind("apologetics_title", content.apologetics.title);
        setBind("apologetics_intro", content.apologetics.intro);
    }
    setChannel(content.youtube_channel);
    var label = String(content.ai_label || "").trim() || AI_LABEL_DEFAULT;
    document.querySelectorAll("[data-ai-label]").forEach(function (el) {
        el.textContent = label;
    });
    if (Array.isArray(content.lessons)) renderLessons(content.lessons);
    renderExplainers(content.explainers || [], label);
    renderApologetics((content.apologetics && content.apologetics.items) || [], label);
    activateEmbeds(pageFromPath(location.pathname));
}

function loadSiteContent() {
    Promise.all([
        fetch("/content.json").then(function (res) { return res.ok ? res.json() : null; }),
        fetch("/content/pricing.json").then(function (res) { return res.ok ? res.json() : null; })
    ]).then(function (results) {
        if (results[0]) applyContent(results[0]);
        if (results[1]) renderPricing(results[1]);
    }).catch(function () {
        activateEmbeds(pageFromPath(location.pathname));
    });
}

function handleSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var button = form.querySelector('button[type="submit"]');
    var original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Sending...";
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (res) {
        if (!res.ok) throw new Error("Form was not accepted");
        form.reset();
        var success = form.querySelector(".form-success");
        if (success) success.hidden = false;
        showToast(form.getAttribute("data-success") || "Thank you. Your message has been sent.");
    }).catch(function () {
        showToast("This form could not be sent from this preview. On the live site, Netlify delivers it.");
    }).finally(function () {
        button.disabled = false;
        button.innerHTML = original;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var menuBtn = document.getElementById("menuBtn");
    if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
    var navbar = document.getElementById("navbar");
    window.addEventListener("scroll", function () {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 10);
    });
    document.addEventListener("click", function (event) {
        if (navbar && !event.target.closest(".navbar")) {
            var nav = document.getElementById("navLinks");
            if (nav) nav.classList.remove("show");
            if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
        }
        var filter = event.target.closest("#lessonFilters [data-filter]");
        if (filter) filterVideos(filter.getAttribute("data-filter"), filter);
        var plan = event.target.closest("[data-plan]");
        if (plan) selectPlan(plan.getAttribute("data-plan"));
        if (event.target.closest("#navLinks a")) {
            var openNav = document.getElementById("navLinks");
            if (openNav) openNav.classList.remove("show");
            if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
        }
        var pageLink = event.target.closest("a[data-page]");
        if (pageLink) {
            event.preventDefault();
            showPage(pageLink.getAttribute("data-page"));
        }
    });
    document.querySelectorAll("form[data-netlify]").forEach(function (form) {
        form.addEventListener("submit", handleSubmit);
    });
    var editorLogin = document.getElementById("editorLogin");
    if (editorLogin) {
        editorLogin.addEventListener("click", function (event) {
            if (window.netlifyIdentity) {
                event.preventDefault();
                window.netlifyIdentity.open();
            }
        });
    }
    window.addEventListener("popstate", function () {
        showPage(pageFromPath(location.pathname), { updateHistory: false });
    });
    showPage(pageFromPath(location.pathname), { updateHistory: false });
    loadSiteContent();
});
