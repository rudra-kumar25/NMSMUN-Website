/* ==========================================================================
   NMSMUN — shared site script (runs on every page)

   WHAT THIS FILE DOES
   1. Builds the sticky HEADER and the FOOTER from the config below, so they are
      identical on every page. Edit header/footer text in SITE_CONFIG only.
   2. Sets the mobile nav toggle.
   3. Scroll-reveal: fades sections in as they enter the viewport.
   4. Countdown timer on the home page (set the target date in SITE_CONFIG).
   5. Generic helpers for the FAQ accordion, committee filter pills and the
      application form — each only runs if the matching markup is on the page.

   You do NOT need to touch this file to edit page body text — that lives in
   the individual .html files.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SITE CONFIG  — the main things a non-technical editor will change
   -------------------------------------------------------------------------- */
const SITE_CONFIG = {
  shortName: "NMSMUN",
  schoolName: "GEMS New Millennium School, Dubai",
  contactEmail: "secretariat@nmsmun.ae",
  copyrightHolder: "NMSMUN · GEMS New Millennium School",

  /* Countdown target — PLACEHOLDER DATE.
     Replace with the real conference start once confirmed (ISO format,
     local time). While countdownDateIsConfirmed is false the home page shows a
     "DATE TBA" chip; when true it shows the formatted date instead. */
  countdownTargetISO: new Date("1790926200" * 1000).toISOString(),
  countdownDateIsConfirmed: true,    // set to false again if the date changes to unknown

  /* Logo files (in /assets). Swap the files, keep the names — or change here. */
  logoNMSMUN: "assets/logo-nmsmun.png",
  logoGEMS: "assets/logo-gems.png",

  /* Primary navigation. "file" must match the page's filename. */
  nav: [
    { label: "About",       file: "about.html" },
    { label: "Conference",  file: "conference.html" },
    { label: "Resources",   file: "resources.html" },
    { label: "Application",  file: "application.html" },
    { label: "Portal",      file: "portal.html" },
  ],

  /* Social links shown in the footer. Leave href as "#" until the real
     handle exists — icons render greyed-out and unclickable ("Coming soon")
     while href is "#", and turn into live links automatically once you fill
     in the real URL. icon must be a key in SOCIAL_ICONS below. */
  social: [
    { label: "Instagram", href: "https://www.instagram.com/nmsmun", icon: "instagram" },
    { label: "LinkedIn",  href: "#", icon: "linkedin" },
  ],

  /* Footer link columns */
  footerColumns: [
    {
      heading: "Conference",
      links: [
        { label: "Committees",       href: "conference.html" },
        { label: "Schedule",         href: "conference.html#schedule" },
        { label: "Venue & fees",     href: "conference.html#logistics" },
        { label: "Past conferences", href: "conference.html#gallery" },
      ],
    },
    {
      heading: "Delegates",
      links: [
        { label: "Apply",              href: "application.html" },
        { label: "Resources",          href: "resources.html" },
        { label: "Delegate handbook",  href: "resources.html" },
        { label: "Delegate portal",    href: "portal.html" },
      ],
    },
    {
      heading: "NMSMUN",
      links: [
        { label: "About",        href: "about.html" },
        { label: "History",      href: "about.html#history" },
        { label: "Secretariat",  href: "about.html#secretariat" },
        { label: "Contact",      href: "mailto:secretariat@nmsmun.ae" },
      ],
    },
  ],
};

/* Small inline icon set for the footer social row (no external requests —
   the CSP allows no third-party image or icon fonts). */
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/><circle cx="7.5" cy="7.6" r="1" fill="currentColor"/><path d="M7.5 10.6V17M11 17v-4.3c0-1.6 1-2.4 2.2-2.4 1.2 0 1.8.8 1.8 2.4V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function buildFooterSocial() {
  if (!SITE_CONFIG.social || !SITE_CONFIG.social.length) return "";

  const links = SITE_CONFIG.social
    .map((s) => {
      const icon = SOCIAL_ICONS[s.icon] || "";
      const isSoon = !s.href || s.href === "#";
      return isSoon
        ? `<span class="footer-social__link is-soon" aria-disabled="true" title="${s.label} — link coming soon">${icon}</span>`
        : `<a class="footer-social__link" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${SITE_CONFIG.shortName} on ${s.label}">${icon}</a>`;
    })
    .join("");

  return `
    <div class="footer-social">
      <span class="footer-social__label">Follow ${SITE_CONFIG.shortName}</span>
      <div class="footer-social__icons">${links}</div>
    </div>`;
}

/* --------------------------------------------------------------------------
   2. HEADER
   -------------------------------------------------------------------------- */
function currentFile() {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}

function buildHeader() {
  const here = currentFile();
  const navLinks = SITE_CONFIG.nav
    .map((item) => {
      const active = item.file === here ? ' aria-current="page"' : "";
      return `<a href="${item.file}"${active}>${item.label}</a>`;
    })
    .join("");

  return `
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="index.html" aria-label="${SITE_CONFIG.shortName} home"${here === "index.html" ? ' aria-current="page"' : ""}>
        <span class="brand__logos">
          <img src="${SITE_CONFIG.logoNMSMUN}" alt="${SITE_CONFIG.shortName} crest">
          <span class="brand__divider" aria-hidden="true"></span>
          <img src="${SITE_CONFIG.logoGEMS}" alt="GEMS New Millennium School logo">
        </span>
        <span class="brand__text">
          <span class="brand__name">${SITE_CONFIG.shortName}</span>
          <span class="brand__school">${SITE_CONFIG.schoolName}</span>
        </span>
      </a>

      <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>

      <nav class="nav" id="primary-nav" aria-label="Primary">
        ${navLinks}
        <a class="btn btn--primary btn--sm" href="application.html">Apply</a>
      </nav>
    </div>
  </header>`;
}

/* --------------------------------------------------------------------------
   3. FOOTER
   -------------------------------------------------------------------------- */
function buildFooter() {
  const columns = SITE_CONFIG.footerColumns
    .map(
      (col) => `
      <div class="footer-col">
        <h4>${col.heading}</h4>
        <ul>
          ${col.links
            .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
            .join("")}
        </ul>
      </div>`
    )
    .join("");

  const year = new Date().getFullYear();

  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="footer-brand__logos">
            <img src="${SITE_CONFIG.logoNMSMUN}" alt="${SITE_CONFIG.shortName} crest">
            <span class="footer-brand__divider" aria-hidden="true"></span>
            <img src="${SITE_CONFIG.logoGEMS}" alt="GEMS New Millennium School logo">
          </span>
          <p>${SITE_CONFIG.shortName} is the Model United Nations conference hosted by
             GEMS New Millennium School, Dubai — student-led committee debate in
             formal UN procedure.</p>
          ${buildFooterSocial()}
        </div>
        ${columns}
      </div>

      <div class="footer-bottom">
        <span>© ${year} ${SITE_CONFIG.copyrightHolder}. All rights reserved.</span>
        <span>Secretariat: <a href="mailto:${SITE_CONFIG.contactEmail}">${SITE_CONFIG.contactEmail}</a></span>
      </div>
    </div>
  </footer>`;
}

/* --------------------------------------------------------------------------
   4. MOUNT header + footer, wire the mobile toggle
   -------------------------------------------------------------------------- */
function mountChrome() {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.outerHTML = buildHeader();
  if (footerMount) footerMount.outerHTML = buildFooter();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
  }
}

/* --------------------------------------------------------------------------
   4b. HEADER SCROLL SHADOW — the sticky header lifts off the page once
       you've scrolled past it, instead of just ending at a hairline.
   -------------------------------------------------------------------------- */
function initHeaderScrollShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   5. SCROLL-REVEAL — fade + rise as sections enter the viewport
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".section, [data-reveal]");
  targets.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   5b. SCROLL PROGRESS BAR — thin yellow bar tracking page scroll
   -------------------------------------------------------------------------- */
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initScrollProgress() {
  if (REDUCED_MOTION) return;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;
  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? doc.scrollTop / max : 0;
    bar.style.transform = `scaleX(${ratio})`;
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } },
    { passive: true }
  );
  update();
}

/* --------------------------------------------------------------------------
   5b-i. TEXT REVEAL — section titles animate in word by word
         Wraps each word of .section-title in nested spans (outer:
         overflow-hidden window, inner: the word itself) and lets CSS
         transition the inner span up into place once "is-revealed" is
         added. Operates on text nodes only via TreeWalker, so inline markup
         inside a heading (a <br>, say) is left exactly where it is — only
         the words themselves get wrapped.
         .hero-title and .page-banner h1 are handled separately, by the
         typewriter heading effect below — they're the page's headline, so
         they get the more literal "typed in" treatment instead.
   -------------------------------------------------------------------------- */
function wrapWordsForReveal(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim() !== "") textNodes.push(node);
  }

  let i = 0;
  textNodes.forEach((textNode) => {
    const parts = textNode.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (part === "") return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const outer = document.createElement("span");
      outer.className = "reveal-word";
      outer.style.setProperty("--w-i", i++);
      const inner = document.createElement("span");
      inner.className = "reveal-word__inner";
      inner.textContent = part;
      outer.appendChild(inner);
      frag.appendChild(outer);
    });
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function initTextReveal() {
  if (REDUCED_MOTION) return; // leave headings as plain, static text

  const targets = document.querySelectorAll(".section-title");
  if (!targets.length) return;

  targets.forEach((el) => {
    wrapWordsForReveal(el);
    el.classList.add("js-text-reveal");
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   5b-ii. TYPEWRITER — types out [data-typewriter] text a character at a time
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const els = document.querySelectorAll("[data-typewriter]");
  if (!els.length || REDUCED_MOTION) return;

  els.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    el.classList.add("is-typing");
    let i = 0;
    function step() {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(step, 18 + Math.random() * 22);
      } else {
        el.classList.remove("is-typing");
      }
    }
    step();
  });
}

/* --------------------------------------------------------------------------
   5b-iii. TYPEWRITER HEADINGS — types out the page's main heading
           (.hero-title on the home/portal pages, the <h1> inside
           .page-banner everywhere else) a character at a time, same idea as
           the eyebrow typewriter above but line-break aware: a heading can
           contain a hard <br> (the homepage hero splits its title across
           two lines) and the effect needs to reproduce that break at the
           right moment instead of flattening the heading to one line.

           Layout note: the heading is measured and pinned to its natural
           rendered height with an inline min-height before its text is
           cleared, so the surrounding page doesn't jump as the heading
           grows back in line by line — it just fills in inside a
           pre-reserved box. The min-height is released once typing ends.
   -------------------------------------------------------------------------- */
function initTypewriterHeadings() {
  const els = document.querySelectorAll(".hero-title, .page-banner h1");
  if (!els.length || REDUCED_MOTION) return;

  els.forEach((el) => {
    // Split the heading's existing content into logical lines at each
    // <br>, reading text straight from the text nodes so HTML entities
    // (e.g. "&amp;") come through already decoded.
    const lines = [];
    let current = "";
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        current += node.textContent;
      } else if (node.nodeName === "BR") {
        lines.push(current.trim());
        current = "";
      }
    });
    lines.push(current.trim());

    const height = el.getBoundingClientRect().height;
    el.style.minHeight = height + "px";
    el.textContent = "";
    el.classList.add("is-typing");

    let lineIndex = 0;
    let charIndex = 0;
    let lineNode = document.createTextNode("");
    el.appendChild(lineNode);

    function step() {
      const line = lines[lineIndex];
      charIndex++;
      lineNode.textContent = line.slice(0, charIndex);

      if (charIndex < line.length) {
        setTimeout(step, 18 + Math.random() * 22);
        return;
      }

      if (lineIndex < lines.length - 1) {
        lineIndex++;
        charIndex = 0;
        el.appendChild(document.createElement("br"));
        lineNode = document.createTextNode("");
        el.appendChild(lineNode);
        setTimeout(step, 160); // brief pause at the line break
      } else {
        el.classList.remove("is-typing");
        el.style.minHeight = "";
      }
    }

    setTimeout(step, 420); // let the eyebrow above it get a head start
  });
}

/* --------------------------------------------------------------------------
   5c. STAGGERED REVEAL — children of [data-reveal-stagger] cascade in
   -------------------------------------------------------------------------- */
function initStagger() {
  const groups = document.querySelectorAll("[data-reveal-stagger]");
  if (!groups.length) return;

  groups.forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty("--stagger-i", i);
    });
  });

  if (!("IntersectionObserver" in window)) {
    groups.forEach((g) => g.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  groups.forEach((g) => io.observe(g));
}

/* --------------------------------------------------------------------------
   5d. COUNT-UP — [data-count="9"] ticks from 0 to its target when seen
   -------------------------------------------------------------------------- */
function initCountUp() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  function run(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const suffix = el.dataset.countSuffix || "";
    if (REDUCED_MOTION) { el.textContent = target + suffix; return; }

    const duration = 1100;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);           // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   6. COUNTDOWN (home page only)
   -------------------------------------------------------------------------- */
function initCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;

  const target = new Date(SITE_CONFIG.countdownTargetISO).getTime();

  // The chip next to the timer: show the formatted date once it is confirmed
  // in SITE_CONFIG, otherwise leave it reading "Date TBA".
  const dateChip = root.querySelector("[data-cd-tba]");
  if (dateChip && SITE_CONFIG.countdownDateIsConfirmed) {
    dateChip.textContent = new Date(SITE_CONFIG.countdownTargetISO).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );
    dateChip.classList.remove("tba", "tba--on-purple");
    dateChip.classList.add("countdown__date");
  }

  const elDays = root.querySelector('[data-cd="days"]');
  const elHours = root.querySelector('[data-cd="hours"]');
  const elMins = root.querySelector('[data-cd="minutes"]');
  const elSecs = root.querySelector('[data-cd="seconds"]');
  const secTile = elSecs ? elSecs.closest(".countdown__tile") : null;

  function pad(n) { return String(n).padStart(2, "0"); }

  let intervalId = null;
  const labelEl = root.querySelector(".countdown__label");

  function tick() {
    const diff = target - Date.now();
    const clamped = Math.max(diff, 0);
    const d = Math.floor(clamped / 86400000);
    const h = Math.floor((clamped % 86400000) / 3600000);
    const m = Math.floor((clamped % 3600000) / 60000);
    const s = Math.floor((clamped % 60000) / 1000);
    if (elDays) elDays.textContent = pad(d);
    if (elHours) elHours.textContent = pad(h);
    if (elMins) elMins.textContent = pad(m);
    if (elSecs) elSecs.textContent = pad(s);
    if (secTile && !REDUCED_MOTION) {
      secTile.classList.add("is-ticking");
      setTimeout(() => secTile.classList.remove("is-ticking"), 260);
    }

    /* Once the target is reached, stop the interval instead of ticking
       "00:00:00:00" forever, and let the label reflect reality. */
    if (diff <= 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
      if (labelEl) labelEl.textContent = "The conference is underway";
    }
  }

  tick();
  if (target - Date.now() > 0) {
    intervalId = setInterval(tick, 1000);
  } else if (labelEl) {
    labelEl.textContent = "The conference is underway";
  }
}

/* --------------------------------------------------------------------------
   7. FAQ ACCORDION (resources page)
   -------------------------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll(".accordion__item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".accordion__btn");
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      // the "+" icon rotates into a "x" in CSS (.accordion__item.is-open .accordion__icon)
    });
  });
}

/* --------------------------------------------------------------------------
   8. COMMITTEE FILTER PILLS (conference page)
   -------------------------------------------------------------------------- */
function initCommitteeFilter() {
  const pillBar = document.querySelector("[data-filter-pills]");
  if (!pillBar) return;

  const pills = pillBar.querySelectorAll(".pill");
  const cards = document.querySelectorAll("[data-tiers]");

  pills.forEach((pill) => {
    pill.setAttribute("aria-pressed", String(pill.classList.contains("is-active")));
    pill.addEventListener("click", () => {
      pills.forEach((p) => {
        p.classList.remove("is-active");
        p.setAttribute("aria-pressed", "false");
      });
      pill.classList.add("is-active");
      pill.setAttribute("aria-pressed", "true");
      const tier = pill.dataset.tier; // "all" | "junior" | "beginner" | "intermediate" | "advanced"

      cards.forEach((card) => {
        const tiers = card.dataset.tiers.split(" ");
        const match = tier === "all" || tiers.includes(tier);
        card.hidden = !match;
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. APPLICATION FORM (application page)
      Client-side validation + simulated confirmation email.
   -------------------------------------------------------------------------- */
function initApplicationForm() {
  const form = document.getElementById("application-form");
  if (!form) return;

  const REQUIRED = ["fullName", "email", "grade", "committee", "experience"];
  const progressEl = form.querySelector("[data-progress]");
  const resultMount = document.getElementById("application-result");

  /* experience is a set of selectable boxes acting as one radio group */
  const expOptions = form.querySelectorAll(".exp-option");
  expOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      expOptions.forEach((o) => o.classList.remove("is-selected"));
      opt.classList.add("is-selected");
      const input = opt.querySelector("input");
      if (input) input.checked = true;
      clearError(opt.closest(".field"));
      updateProgress();
    });
  });

  function fieldValue(name) {
    if (name === "experience") {
      const checked = form.querySelector('input[name="experience"]:checked');
      return checked ? checked.value : "";
    }
    const el = form.elements[name];
    return el ? el.value.trim() : "";
  }

  function updateProgress() {
    const done = REQUIRED.filter((n) => fieldValue(n) !== "").length;
    if (progressEl) progressEl.textContent = `${done}/${REQUIRED.length} REQUIRED`;
  }

  function clearError(fieldWrap) {
    if (fieldWrap) fieldWrap.classList.remove("has-error");
  }

  /* clear an error as soon as the user edits that field */
  form.addEventListener("input", (e) => {
    const wrap = e.target.closest(".field");
    clearError(wrap);
    updateProgress();
  });
  form.addEventListener("change", updateProgress);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;

    REQUIRED.forEach((name) => {
      const wrap =
        name === "experience"
          ? form.querySelector('[data-field="experience"]')
          : form.elements[name].closest(".field");
      const ok = fieldValue(name) !== "";
      // basic email shape check
      const emailOk =
        name !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue("email"));
      if (!ok || !emailOk) {
        wrap.classList.add("has-error");
        if (!firstBad) firstBad = wrap;
      } else {
        clearError(wrap);
      }
    });

    if (firstBad) {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    /* ---- Build the payload -------------------------------------------- */
    const data = {
      fullName: fieldValue("fullName"),
      email: fieldValue("email"),
      grade: fieldValue("grade"),
      committee: fieldValue("committee"),
      experience: fieldValue("experience"),
      notes: fieldValue("notes"),
    };
    const reference =
      "NMSMUN-" +
      new Date().getFullYear() +
      "-" +
      Math.random().toString(36).slice(2, 7).toUpperCase();

    /* =================================================================
       BACKEND HOOK — REAL EMAIL SENDING GOES HERE.
       Right now this is simulated entirely in the browser. To actually
       send the automatic confirmation email you need a backend endpoint
       (e.g. a serverless function, Formspree, EmailJS, or your own API).

       Example:
         fetch("/api/apply", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ ...data, reference })
         })
           .then(r => r.json())
           .then(() => showConfirmation(data, reference))
           .catch(() => showError());

       Until that exists, we just render the confirmation card below and
       show a PREVIEW of what the email would contain.
       ================================================================= */
    showConfirmation(data, reference);
  });

  function showConfirmation(data, reference) {
    const emailBody =
`To: ${data.email}
From: ${SITE_CONFIG.contactEmail}
Subject: We've received your ${SITE_CONFIG.shortName} application (${reference})

Dear ${data.fullName},

Thank you for applying to ${SITE_CONFIG.shortName}, hosted by ${SITE_CONFIG.schoolName}.

  Reference number : ${reference}
  Grade            : ${data.grade}
  Committee (pref.) : ${data.committee}
  Experience level  : ${data.experience}

Next steps:
  1. Keep this reference number.
  2. We will email you a position-paper brief before the deadline.
  3. Committee allocations are released with the second circular.

Questions: ${SITE_CONFIG.contactEmail}

— The ${SITE_CONFIG.shortName} Secretariat

(This is an automated confirmation. In the live site it is sent by the backend.)`;

    resultMount.innerHTML = `
      <div class="confirm-card" role="status">
        <span class="eyebrow" style="color:var(--yellow-on-white)">Application received</span>
        <h2 class="section-title">Thank you, ${escapeHTML(data.fullName.split(" ")[0])}.</h2>
        <p>Your application has been logged. A confirmation email would now be sent
           automatically to <strong>${escapeHTML(data.email)}</strong>.</p>
        <p style="margin-bottom:6px"><strong>Your reference number</strong></p>
        <p class="confirm-card__ref">${reference}</p>
        <p class="small muted">Preview of the confirmation email:</p>
        <div class="email-preview">${escapeHTML(emailBody)}</div>
      </div>`;
    form.hidden = true;
    resultMount.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  updateProgress();
}

/* --------------------------------------------------------------------------
   9b. CARD TILT + CURSOR SPOTLIGHT
       Cards/portal-cards/info-boxes/stat-tiles/community-tiles tilt a few
       degrees toward the pointer and a soft glow follows it — the CSS vars
       (--tilt-x/y, --spot-x/y) default to flat/centred, so skipping this on
       touch or reduced-motion just leaves the existing hover lift with no
       rotation.
   -------------------------------------------------------------------------- */
function initCardTilt() {
  if (REDUCED_MOTION) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const MAX_TILT = 6; // degrees
  const cards = document.querySelectorAll(".card--hover, .portal-card, .info-box, .stat, .community-tile");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-py * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(px * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty("--spot-x", `${(px + 0.5) * 100}%`);
      card.style.setProperty("--spot-y", `${(py + 0.5) * 100}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

/* --------------------------------------------------------------------------
   9c. HERO / PAGE-BANNER PARALLAX
       The headline block drifts a few px toward the cursor for a touch of
       depth. Desktop pointer only; the CSS vars default to 0px.
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  if (REDUCED_MOTION) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const MAX_SHIFT = 6; // px
  const zones = document.querySelectorAll(".hero, .page-banner");

  zones.forEach((zone) => {
    const content = zone.querySelector(":scope > .container");
    if (!content) return;
    zone.addEventListener("mousemove", (e) => {
      const rect = zone.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      content.style.setProperty("--px", `${(px * MAX_SHIFT).toFixed(2)}px`);
      content.style.setProperty("--py", `${(py * MAX_SHIFT).toFixed(2)}px`);
    });
    zone.addEventListener("mouseleave", () => {
      content.style.setProperty("--px", "0px");
      content.style.setProperty("--py", "0px");
    });
  });
}

/* --------------------------------------------------------------------------
   9d. MAGNETIC BUTTONS
       The main call-to-action buttons drift a few px toward the cursor
       while hovered, then spring back — desktop pointer only, and the CSS
       transition already on .btn (see BUTTONS) handles the spring-back
       easing, so this just sets a transform.
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  if (REDUCED_MOTION) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const MAX = 10; // px
  const buttons = document.querySelectorAll(
    ".btn--primary:not(.btn--sm):not([disabled]), .btn--outline, .btn--outline-light:not(.btn--sm)"
  );

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * MAX;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * MAX;
      btn.style.transform = `translate(${x.toFixed(1)}px, ${(y - 3).toFixed(1)}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* --------------------------------------------------------------------------
   9e. PAGE TRANSITIONS — fade the outgoing page out on internal link clicks
   -------------------------------------------------------------------------- */
function initPageTransitions() {
  if (REDUCED_MOTION) return;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest("a[href]");
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return; // same-page anchor

    e.preventDefault();
    document.body.classList.add("page-exit");
    setTimeout(() => { window.location.href = link.href; }, 200);
  });

  // Restore visibility if the page is served from the back/forward cache
  // still carrying the outgoing fade from before the user navigated away.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) document.body.classList.remove("page-exit");
  });
}

/* --------------------------------------------------------------------------
   10. BOOT
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  mountChrome();
  initHeaderScrollShadow();
  initScrollReveal();
  initScrollProgress();
  initTextReveal();
  initTypewriter();
  initTypewriterHeadings();
  initStagger();
  initCountUp();
  initCountdown();
  initAccordion();
  initCommitteeFilter();
  initApplicationForm();
  initCardTilt();
  initHeroParallax();
  initMagneticButtons();
  initPageTransitions();
});
