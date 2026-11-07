(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Header: solid on scroll ---------- */
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  var sticky = document.querySelector(".sticky-cta");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-solid", y > 24);
    if (sticky) {
      var threshold = hero ? hero.offsetHeight * 0.7 : 400;
      var nearForm = false;
      var form = document.getElementById("quote");
      if (form) {
        var r = form.getBoundingClientRect();
        nearForm = r.top < window.innerHeight && r.bottom > 0;
      }
      sticky.classList.toggle("is-shown", y > threshold && !nearForm);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var mnav = document.getElementById("mobile-nav");
  function setMenu(open) {
    if (!toggle || !mnav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav.classList.toggle("is-open", open);
    mnav.inert = !open;
    header.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var first = mnav.querySelector("a"); if (first) first.focus(); }
  }
  if (toggle && mnav) {
    mnav.inert = true;
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    mnav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024) setMenu(false); });
  }

  /* ---------- Services dropdown ---------- */
  document.querySelectorAll(".has-menu").forEach(function (item) {
    var btn = item.querySelector(".nav-menu-btn");
    function set(open) { item.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(!item.classList.contains("is-open")); });
    item.addEventListener("mouseenter", function () { btn.setAttribute("aria-expanded", "true"); });
    item.addEventListener("mouseleave", function () { set(false); });
    document.addEventListener("click", function (e) { if (!item.contains(e.target)) set(false); });
    item.addEventListener("keydown", function (e) { if (e.key === "Escape") { set(false); btn.focus(); } });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-img, .steps");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Before / after ---------- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var range = ba.querySelector("input[type=range]");
    if (!range) return;
    function set() { ba.style.setProperty("--pos", range.value + "%"); }
    range.addEventListener("input", set);
    set();
  });

  /* ---------- Gallery filters ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var target = document.getElementById(group.getAttribute("data-filter-group"));
    if (!target) return;
    var chips = group.querySelectorAll("[data-filter]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        target.querySelectorAll(".g-item").forEach(function (item) {
          var cats = (item.getAttribute("data-cat") || "").split(" ");
          item.hidden = !(f === "all" || cats.indexOf(f) > -1);
        });
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("[data-lb-caption]");
    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lbImg.src = btn.getAttribute("data-lightbox");
        lbImg.alt = btn.querySelector("img") ? btn.querySelector("img").alt : "";
        lbCap.textContent = btn.getAttribute("data-caption") || "";
        lb.showModal();
      });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest(".lightbox__close")) lb.close();
    });
  } else {
    document.querySelectorAll("[data-lightbox]").forEach(function (b) { b.style.cursor = "default"; });
  }

  /* ---------- Scene tabs (permanent page) ---------- */
  document.querySelectorAll("[data-presets]").forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll("[role=tab]"));
    var nodes = wrap.querySelectorAll(".node");
    var halos = wrap.querySelectorAll(".halo");
    var panel = wrap.querySelector("[role=tabpanel]");
    var cap = wrap.querySelector(".scene-caption");
    function select(i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      var cols = tabs[i].getAttribute("data-colors").split(",");
      nodes.forEach(function (n, k) { n.setAttribute("fill", cols[k % cols.length]); });
      halos.forEach(function (n, k) { n.setAttribute("fill", cols[k % cols.length]); });
      if (panel) panel.setAttribute("aria-labelledby", tabs[i].id);
      if (cap) cap.textContent = tabs[i].getAttribute("data-caption");
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); select((i + 1) % n, true); }
        if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); select((i - 1 + n) % n, true); }
        if (k === "Home") { e.preventDefault(); select(0, true); }
        if (k === "End") { e.preventDefault(); select(n - 1, true); }
      });
    });
  });

  /* ---------- Quote form ---------- */
  var form = document.querySelector("form[data-quote-form]");
  if (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector("button[type=submit]");
    var preset = new URLSearchParams(window.location.search).get("service");
    function preselect(v) {
      var radio = v && form.querySelector('input[name="service"][value="' + v + '"]');
      if (radio) radio.checked = true;
    }
    preselect(preset);
    document.querySelectorAll("[data-service]").forEach(function (a) {
      a.addEventListener("click", function () { preselect(a.getAttribute("data-service")); });
    });

    function showStatus(kind, html) {
      status.className = "form-status is-shown form-status--" + kind;
      status.innerHTML = html;
      status.setAttribute("tabindex", "-1");
      status.focus({ preventScroll: false });
    }

    function validate() {
      var ok = true;
      form.querySelectorAll("[data-required]").forEach(function (el) {
        var field = el.closest(".field");
        var err = field && field.querySelector(".error");
        var msg = "";
        var val = (el.value || "").trim();
        if (el.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = "Please enter a valid email address.";
        if (el.type === "tel" && val && val.replace(/\D/g, "").length < 10) msg = "Please enter a phone number with area code.";
        if (!val) msg = "This field is required.";
        el.setAttribute("aria-invalid", msg ? "true" : "false");
        if (err) err.textContent = msg;
        if (msg && ok) { el.focus(); ok = false; }
      });
      var files = form.querySelector('input[type="file"]');
      if (files && files.files) {
        var total = 0;
        for (var i = 0; i < files.files.length; i++) total += files.files[i].size;
        var ferr = files.closest(".field").querySelector(".error");
        if (files.files.length > 5 || total > 10 * 1024 * 1024) {
          ferr.textContent = "Please attach up to 5 photos, 10 MB total.";
          if (ok) files.focus();
          ok = false;
        } else if (ferr) ferr.textContent = "";
      }
      return ok;
    }

    function mailtoFallback(fd) {
      var lines = ["Quote request", ""];
      ["name", "email", "phone", "location", "service", "details"].forEach(function (k) {
        var v = fd.get(k); if (v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v);
      });
      return "mailto:" + (cfg.businessEmail || "") + "?subject=" + encodeURIComponent("Lighting quote request") + "&body=" + encodeURIComponent(lines.join("\n"));
    }
    function contactLine() {
      return 'Call <a href="tel:' + cfg.phoneHref + '">' + cfg.phoneDisplay + '</a> or email <a href="mailto:' + cfg.businessEmail + '">' + cfg.businessEmail + "</a>.";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp input").value) return; // bot
      if (!validate()) return;
      var fd = new FormData(form);
      fd.delete("company_website");

      if (!cfg.formEndpoint) {
        showStatus("warn",
          "<strong>Your request has not been sent.</strong> Online quote requests aren't connected yet. " +
          '<a href="' + mailtoFallback(fd) + '">Send these details by email</a> instead, or ' + contactLine().charAt(0).toLowerCase() + contactLine().slice(1));
        return;
      }

      submit.disabled = true;
      var label = submit.innerHTML;
      submit.textContent = "Sending…";
      fetch(cfg.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
          showStatus("ok", "<strong>Thank you — your request was received.</strong> We'll be in touch to schedule your consultation.");
        })
        .catch(function () {
          showStatus("err", "<strong>Something went wrong and your request was not sent.</strong> Please try again, or " + contactLine().charAt(0).toLowerCase() + contactLine().slice(1));
        })
        .then(function () { submit.disabled = false; submit.innerHTML = label; });
    });

    form.querySelectorAll("[data-required]").forEach(function (el) {
      el.addEventListener("blur", function () {
        if (el.getAttribute("aria-invalid") === "true" && el.value.trim()) {
          el.setAttribute("aria-invalid", "false");
          var err = el.closest(".field").querySelector(".error"); if (err) err.textContent = "";
        }
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
