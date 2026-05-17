// ============================================================
// Maqaṣṣ Atelier — Global app behavior
// • Header scroll state (transparent → cream)
// • Active nav highlighting
// • Language toggle wiring
// • Scroll-reveal observer (replaces gsap-scrolltrigger with native IO,
//   keeps the same translateY + blur cascade — high-end-visual rule)
// ============================================================

import { setLanguage, getLang, t } from './i18n.js';

// ——— Header transparent → cream on scroll ————————————————————

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ——— Active nav (matches current page) ————————————————————————

function initActiveNav() {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(a => {
    const target = a.dataset.nav;
    const match =
      (target === 'home'     && (here === '' || here === 'index.html')) ||
      (target === 'services' && here === 'services.html') ||
      (target === 'book'     && here === 'book.html') ||
      (target === 'mine'     && here === 'mine.html');
    if (match) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ——— Language toggle ————————————————————————————————————————

function initLangToggle() {
  const btn = document.querySelector('[data-lang-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    setLanguage(getLang() === 'en' ? 'ar' : 'en');
  });
}

// ——— Scroll-reveal (translateY + blur, staggered) ——————————————

function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ——— Magnetic CTA buttons (subtle pointer tracking) ————————————

function initMagnetic() {
  const els = document.querySelectorAll('[data-magnetic]');
  els.forEach(el => {
    const strength = parseFloat(el.dataset.magnetic) || 12;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// ——— Boot ————————————————————————————————————————————————————

function boot() {
  initHeader();
  initActiveNav();
  initLangToggle();
  initReveal();
  initMagnetic();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// ——— Shared SVG icon snippets (used inline by pages) ——————————

export const ICONS = {
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`,
  scissors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/></svg>`,
  home:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z"/></svg>`,
  menu:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`,
  ticket:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4Z"/><path d="M14 7v10"/></svg>`,
};
