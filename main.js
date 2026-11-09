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
      if (files && !files.closest("[hidden]") && files.files) {
        var bad = false;
        for (var i = 0; i < files.files.length; i++) if (files.files[i].size > 25 * 1024 * 1024) bad = true;
        var ferr = files.closest(".field").querySelector(".error");
        if (files.files.length > 5 || bad) {
          ferr.textContent = "Please attach up to 5 photos (25 MB max each).";
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

    var worker = (cfg.workerUrl || "").replace(/\/$/, "");
    form.querySelectorAll("[data-worker-only]").forEach(function (el) { el.hidden = !worker; });
    form.querySelectorAll("[data-no-worker]").forEach(function (el) { el.hidden = !!worker; });
    var preview = document.getElementById("ai-preview");

    // Shrink photos in the browser before upload (faster on phones, smaller for the AI).
    function shrink(file, max) {
      return new Promise(function (resolve) {
        if (!file || !/^image\//.test(file.type) || typeof createImageBitmap !== "function") return resolve(file);
        createImageBitmap(file).then(function (bmp) {
          var scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
          var c = document.createElement("canvas");
          c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
          c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
          c.toBlob(function (blob) { resolve(blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file); }, "image/jpeg", 0.85);
        }).catch(function () { resolve(file); });
      });
    }

    function sendEmail(fd) {
      if (!cfg.formEndpoint) return Promise.reject(new Error("no email endpoint"));
      var payload = {};
      fd.forEach(function (v, k) { if (typeof v === "string") payload[k] = v; });
      payload._subject = "New quote request: " + (payload.name || "website") + (payload.service ? " (" + payload.service + ")" : "");
      payload._replyto = payload.email || "";
      payload._template = "table";
      payload._captcha = "false";
      payload._honey = "";
      return fetch(cfg.formEndpoint, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json", Accept: "application/json" } })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) {
          var good = res.ok && (d.success === true || d.success === "true" || d.ok === true || (d.success === undefined && d.ok === undefined));
          if (!good) throw new Error(d.message || "email failed");
        }); });
    }

    function sendAlert(fd, photos) {
      if (!worker) return Promise.reject(new Error("no worker"));
      var body = new FormData();
      fd.forEach(function (v, k) { if (typeof v === "string") body.append(k, v); });
      photos.forEach(function (p) { body.append("photos", p, "photo.jpg"); });
      return fetch(worker + "/quote", { method: "POST", body: body }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (d) { if (!res.ok || !d.ok) throw new Error("alert failed"); });
      });
    }

    function runPreview(photo, service, name) {
      var load = preview.querySelector(".preview__loading"), result = preview.querySelector(".preview__result"), err = preview.querySelector(".preview__error");
      preview.hidden = false; load.hidden = false; result.hidden = true; err.hidden = true;
      var body = new FormData();
      body.append("photo", photo, "house.jpg");
      body.append("service", service === "christmas" ? "christmas" : "permanent");
      body.append("name", name || "");
      fetch(worker + "/preview", { method: "POST", body: body })
        .then(function (res) { return res.json().then(function (d) { if (!res.ok || !d.ok || !d.image) throw new Error(d.error || "preview failed"); return d; }); })
        .then(function (d) {
          result.querySelector("img").src = "data:image/png;base64," + d.image;
          load.hidden = true; result.hidden = false;
          if (!reduceMotion) preview.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function () { load.hidden = true; err.hidden = false; });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp input").value) return; // bot
      if (!validate()) return;
      var fd = new FormData(form);
      fd.delete("company_website");
      fd.delete("photos");
      fd.delete("wants_preview");

      if (!cfg.formEndpoint && !worker) {
        showStatus("warn",
          "<strong>Your request has not been sent.</strong> Online quote requests aren't connected yet. " +
          '<a href="' + mailtoFallback(fd) + '">Send these details by email</a> instead, or ' + contactLine().charAt(0).toLowerCase() + contactLine().slice(1));
        return;
      }

      var fileInput = form.querySelector('input[type="file"]');
      var raw = worker && fileInput && fileInput.files ? Array.prototype.slice.call(fileInput.files, 0, 5) : [];
      var wantsPreview = worker && raw.length && form.querySelector("#f-preview") && form.querySelector("#f-preview").checked;
      var service = fd.get("service") || "permanent";
      var name = fd.get("name");

      submit.disabled = true;
      var label = submit.innerHTML;
      submit.textContent = raw.length ? "Uploading…" : "Sending…";
      Promise.all(raw.map(function (f) { return shrink(f, 1536); }))
        .then(function (photos) {
          var jobs = [sendEmail(fd), sendAlert(fd, photos)];
          return Promise.all(jobs.map(function (p) { return p.then(function () { return true; }, function () { return false; }); }))
            .then(function (results) { return { delivered: results.indexOf(true) > -1, photos: photos }; });
        })
        .then(function (r) {
          if (!r.delivered) throw new Error("not delivered");
          form.reset();
          form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
          showStatus("ok", "<strong>Thank you! Your request was received.</strong> We'll be in touch to schedule your consultation." + (wantsPreview ? " Your lighting preview is being created below." : ""));
          if (wantsPreview) runPreview(r.photos[0], service, name);
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
