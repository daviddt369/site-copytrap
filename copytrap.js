;(function () {
  "use strict";

  function normalizeHost(host) {
    return String(host || "")
      .toLowerCase()
      .replace(/^www\./, "")
      .trim();
  }

  function parseHostFromUrl(url) {
    if (!url) return "";
    try {
      return normalizeHost(new URL(url, window.location.origin).hostname);
    } catch (error) {
      return "";
    }
  }

  function splitHosts(value) {
    return String(value || "")
      .split(",")
      .map(normalizeHost)
      .filter(Boolean);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function findScriptTag() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i -= 1) {
      if (scripts[i].src && scripts[i].src.indexOf("copytrap") !== -1) {
        return scripts[i];
      }
    }
    return null;
  }

  var currentHost = normalizeHost(window.location.hostname);
  var localHosts = ["localhost", "127.0.0.1", "0.0.0.0"];
  var script = findScriptTag();
  var canonicalEl = document.querySelector('link[rel="canonical"]');
  var ogUrlEl = document.querySelector('meta[property="og:url"]');

  var manualHosts = splitHosts(script && script.dataset.allowedHosts);
  var canonicalHost = parseHostFromUrl(canonicalEl && canonicalEl.href);
  var ogHost = parseHostFromUrl(ogUrlEl && ogUrlEl.content);
  var originalUrl =
    (script && script.dataset.originalUrl) ||
    (canonicalEl && canonicalEl.href) ||
    (ogUrlEl && ogUrlEl.content) ||
    "/";
  var redirectDelay = Number(script && script.dataset.redirectDelay) || 5000;
  var mode = String((script && script.dataset.mode) || "hard").toLowerCase();
  var authorName = String((script && script.dataset.authorName) || "").trim();
  var authorPitch = String((script && script.dataset.authorPitch) || "").trim();
  var authorLink = String((script && script.dataset.authorLink) || "").trim();
  var authorLinkText = String((script && script.dataset.authorLinkText) || "").trim();

  var allowedHosts = Array.from(
    new Set(
      manualHosts
        .concat([canonicalHost, ogHost])
        .map(normalizeHost)
        .filter(Boolean)
    )
  );

  var isAllowed =
    localHosts.indexOf(currentHost) !== -1 ||
    !allowedHosts.length ||
    allowedHosts.indexOf(currentHost) !== -1;

  window.__copytrap = {
    allowed: isAllowed,
    currentHost: currentHost,
    allowedHosts: allowedHosts.slice(),
    originalUrl: originalUrl,
    mode: mode
  };

  if (isAllowed) {
    return;
  }

  document.documentElement.classList.add("copytrap-locked");

  var robotsMeta = document.createElement("meta");
  robotsMeta.name = "robots";
  robotsMeta.content = "noindex, nofollow, noarchive";
  document.head.appendChild(robotsMeta);

  var lockStyle = document.createElement("style");
  lockStyle.id = "copytrap-style";
  lockStyle.textContent =
    "html.copytrap-locked, html.copytrap-locked body {" +
    "margin:0 !important;" +
    "padding:0 !important;" +
    "min-height:100% !important;" +
    "background:#070707 !important;" +
    "color:#fff !important;" +
    "font-family:Arial,Helvetica,sans-serif !important;" +
    "}" +
    "html.copytrap-locked body > :not(.copytrap-overlay) {" +
    "display:none !important;" +
    "}" +
    ".copytrap-overlay {" +
    "position:fixed;" +
    "inset:0;" +
    "z-index:2147483647;" +
    "display:flex;" +
    "align-items:center;" +
    "justify-content:center;" +
    "padding:24px;" +
    "background:radial-gradient(circle at top, rgba(180,24,24,.38), transparent 34%), #070707;" +
    "}" +
    ".copytrap-box {" +
    "width:min(860px,100%);" +
    "padding:40px 28px;" +
    "border:2px solid rgba(255,72,72,.75);" +
    "border-radius:22px;" +
    "background:rgba(18,18,18,.96);" +
    "box-shadow:0 0 60px rgba(255,40,40,.24);" +
    "text-align:center;" +
    "}" +
    ".copytrap-badge {" +
    "display:inline-block;" +
    "margin-bottom:14px;" +
    "padding:8px 12px;" +
    "border-radius:999px;" +
    "background:#2a0f0f;" +
    "color:#ff8c8c;" +
    "font-size:12px;" +
    "font-weight:700;" +
    "letter-spacing:.08em;" +
    "text-transform:uppercase;" +
    "}" +
    ".copytrap-box h1 {" +
    "margin:0 0 14px;" +
    "font-size:clamp(30px,6vw,56px);" +
    "line-height:1.05;" +
    "color:#ff4b4b;" +
    "}" +
    ".copytrap-box p {" +
    "margin:10px 0;" +
    "font-size:clamp(18px,2.6vw,24px);" +
    "line-height:1.45;" +
    "color:#f5f5f5;" +
    "}" +
    ".copytrap-box a {" +
    "display:inline-block;" +
    "margin-top:20px;" +
    "padding:14px 20px;" +
    "border-radius:14px;" +
    "background:#ff4b4b;" +
    "color:#fff;" +
    "font-weight:700;" +
    "text-decoration:none;" +
    "}" +
    ".copytrap-small {" +
    "margin-top:18px;" +
    "font-size:13px;" +
    "line-height:1.6;" +
    "color:#9a9a9a;" +
    "word-break:break-word;" +
    "}" +
    ".copytrap-author {" +
    "margin-top:22px;" +
    "padding-top:20px;" +
    "border-top:1px solid rgba(255,255,255,.12);" +
    "}" +
    ".copytrap-author-title {" +
    "margin:0 0 8px;" +
    "font-size:16px;" +
    "font-weight:700;" +
    "color:#fff;" +
    "}" +
    ".copytrap-author-text {" +
    "margin:0;" +
    "font-size:15px;" +
    "line-height:1.55;" +
    "color:#d6d6d6;" +
    "}" +
    ".copytrap-author-link {" +
    "display:inline-flex;" +
    "align-items:center;" +
    "justify-content:center;" +
    "margin-top:14px;" +
    "padding:12px 16px;" +
    "border-radius:12px;" +
    "background:#ffffff;" +
    "color:#111;" +
    "font-size:15px;" +
    "font-weight:700;" +
    "text-decoration:none;" +
    "}" +
    ".copytrap-timer {" +
    "margin-top:18px;" +
    "font-size:15px;" +
    "color:#cfcfcf;" +
    "}";
  document.head.appendChild(lockStyle);

  function silenceTracking() {
    window.dataLayer = [];
    window.gtag = function () {};
    window.fbq = function () {};
    window.ym = function () {};
    window.ttq = window.ttq || {};
    window.ttq.track = function () {};
    window.ttq.page = function () {};
    window.plausible = function () {};

    if (navigator.sendBeacon) {
      navigator.sendBeacon = function () {
        return false;
      };
    }
  }

  function stopInteraction(event) {
    var target = event.target;
    if (target && target.closest && target.closest(".copytrap-box a")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  function buildOverlay() {
    if (document.querySelector(".copytrap-overlay")) {
      return;
    }

    var hostList = allowedHosts.length ? allowedHosts.join(", ") : "unknown";
    var delaySeconds = Math.max(1, Math.round(redirectDelay / 1000));
    var authorHtml = "";

    if (authorName || authorPitch || authorLink) {
      authorHtml =
        '<div class="copytrap-author">' +
        (authorName
          ? '<div class="copytrap-author-title">Разработчик: ' +
            escapeHtml(authorName) +
            "</div>"
          : "") +
        (authorPitch
          ? '<p class="copytrap-author-text">' + escapeHtml(authorPitch) + "</p>"
          : "") +
        (authorLink
          ? '<a class="copytrap-author-link" href="' +
            escapeHtml(authorLink) +
            '">' +
            escapeHtml(authorLinkText || "Написать в WhatsApp") +
            "</a>"
          : "") +
        "</div>";
    }

    var overlay = document.createElement("div");
    overlay.className = "copytrap-overlay";
    overlay.innerHTML =
      '<div class="copytrap-box">' +
      '<div class="copytrap-badge">Copytrap active</div>' +
      "<h1>Нелегальная копия сайта</h1>" +
      "<p>Этот сайт открыт не на исходном домене и заблокирован автоматически.</p>" +
      "<p>Через <strong>" +
      delaySeconds +
      "</strong> сек. откроется оригинал.</p>" +
      '<a href="' +
      escapeHtml(originalUrl) +
      '">Перейти на оригинальный сайт</a>' +
      '<div class="copytrap-timer" id="copytrap-timer">Редирект через ' +
      delaySeconds +
      " сек.</div>" +
      authorHtml +
      '<div class="copytrap-small">allowed-hosts: ' +
      escapeHtml(hostList) +
      "<br>current-host: " +
      escapeHtml(currentHost) +
      "</div>" +
      "</div>";

    if (mode === "soft") {
      overlay.style.background = "rgba(7, 7, 7, 0.84)";
    }

    document.body.appendChild(overlay);

    var timerEl = document.getElementById("copytrap-timer");
    var endsAt = Date.now() + redirectDelay;
    var timerId = window.setInterval(function () {
      var leftMs = Math.max(0, endsAt - Date.now());
      var leftSec = Math.max(0, Math.ceil(leftMs / 1000));
      if (timerEl) {
        timerEl.textContent = "Редирект через " + leftSec + " сек.";
      }
      if (leftMs <= 0) {
        window.clearInterval(timerId);
      }
    }, 250);
  }

  silenceTracking();

  document.addEventListener("click", stopInteraction, true);
  document.addEventListener("submit", stopInteraction, true);

  function activateLock() {
    buildOverlay();
    window.setTimeout(function () {
      window.location.replace(originalUrl);
    }, Math.max(1000, redirectDelay));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activateLock, { once: true });
  } else {
    activateLock();
  }
})();
