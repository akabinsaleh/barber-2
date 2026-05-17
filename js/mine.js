// ============================================================
// Maqaṣṣ Atelier — My Bookings
// Reads from localStorage, groups upcoming/past, supports the
// 3-state cancel-confirmation pattern with 5s auto-revert.
// Tolerates both new (serviceIds[]) and old (serviceId) shapes
// per BRIEF.md persistence section.
// ============================================================

import { SERVICES, BARBERS, getService, getBarber, formatPrice } from './data.js';
import { getLang, t, MONTHS_LONG, WEEKDAYS } from './i18n.js';

const STORAGE_KEY = 'bookings';

function readBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw);
    return Array.isArray(all) ? all : [];
  } catch {
    return [];
  }
}

function writeBookings(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

function deleteBooking(id) {
  const all = readBookings().filter(b => b.id !== id);
  writeBookings(all);
}

// Normalize: support both new (serviceIds array) and old (serviceId string) shapes
function getServiceIds(b) {
  if (Array.isArray(b.serviceIds)) return b.serviceIds;
  if (typeof b.serviceId === 'string') return [b.serviceId];
  return [];
}

function bookingTotal(b) {
  return getServiceIds(b).reduce((sum, id) => {
    const svc = getService(id);
    return sum + (svc ? svc.price : 0);
  }, 0);
}

function bookingDateObj(b) {
  // b.date is "YYYY-MM-DD", b.time is "HH:MM"
  return new Date(`${b.date}T${b.time || '00:00'}:00`);
}

function isUpcoming(b) {
  const when = bookingDateObj(b);
  // 1 hour grace — appointments still showing as upcoming until they're past
  return when.getTime() + 60 * 60 * 1000 >= Date.now();
}

function formatBookingDate(b, lang) {
  const d = bookingDateObj(b);
  const weekday = WEEKDAYS[lang][d.getDay()];
  const month = MONTHS_LONG[lang][d.getMonth()];
  const day = d.getDate();
  const time = b.time || '';
  // EN: "Sun · 26 May · 11:00"   AR: "أحد · ٢٦ مايو · ١١:٠٠"
  return `${weekday} · ${day} ${month} · ${time}`;
}

function serviceNames(b, lang) {
  const ids = getServiceIds(b);
  return ids
    .map(id => getService(id))
    .filter(Boolean)
    .map(s => s[lang].name)
    .join(' · ');
}

function barberName(b, lang) {
  const barber = getBarber(b.barberId);
  return barber ? barber[lang].name : '—';
}

// ——— Cancel-with-confirmation pattern ————————————————————————————
// State machine per card: idle → confirming → (commit | revert)
// Auto-revert after 5s.
function attachCancelHandler(card, id) {
  const cancelBtn = card.querySelector('[data-cancel]');
  const keepBtn   = card.querySelector('[data-keep]');
  let timer = null;

  function reset() {
    card.classList.remove('is-confirming');
    cancelBtn.dataset.state = 'idle';
    cancelBtn.querySelector('[data-cancel-label]').textContent = t('mine.cancel');
    keepBtn.hidden = true;
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function arm() {
    card.classList.add('is-confirming');
    cancelBtn.dataset.state = 'confirming';
    cancelBtn.querySelector('[data-cancel-label]').textContent = t('mine.cancel.confirm');
    keepBtn.hidden = false;
    if (timer) clearTimeout(timer);
    timer = setTimeout(reset, 5000);
  }

  cancelBtn.addEventListener('click', () => {
    if (cancelBtn.dataset.state === 'confirming') {
      deleteBooking(id);
      // Optimistic UI — animate card out, then re-render
      card.style.transition = 'opacity 320ms cubic-bezier(0.32,0.72,0,1), transform 320ms cubic-bezier(0.32,0.72,0,1), max-height 320ms cubic-bezier(0.32,0.72,0,1)';
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px)';
      setTimeout(render, 320);
    } else {
      arm();
    }
  });
  keepBtn.addEventListener('click', reset);
  reset();
}

// ——— Render ————————————————————————————————————————————————————

function bookingCardHTML(b, i, lang) {
  const ids = getServiceIds(b);
  const count = ids.length;
  const summary = count === 1
    ? serviceNames(b, lang)
    : `${count} ${count > 1 ? t('mine.services') : t('mine.service')}`;

  return `
    <div class="booking-row reveal" data-card-id="${b.id}">
      <span class="booking-row__num">${String(i + 1).padStart(2, '0')}</span>
      <div class="booking-row__date">${formatBookingDate(b, lang)}</div>
      <div class="booking-row__meta">
        <div><strong>${summary}</strong></div>
        <div>${t('mine.with')} <strong>${barberName(b, lang)}</strong> · ${formatPrice(bookingTotal(b), lang)}</div>
      </div>
      <div class="booking-row__id">${b.id}</div>
      <div class="booking-row__actions">
        <button class="btn btn--quiet btn--small" data-cancel data-state="idle">
          <span data-cancel-label>${t('mine.cancel')}</span>
        </button>
        <button class="btn btn--ghost btn--small" data-keep hidden>
          ${t('mine.cancel.keep')}
        </button>
      </div>
    </div>
  `;
}

function emptyHTML() {
  return `
    <div class="mine-empty reveal">
      <span class="mine-empty__id">[ 00 ] // EMPTY STATE</span>
      <h2>${t('mine.empty.title')}</h2>
      <p>${t('mine.empty.sub')}</p>
      <div>
        <a href="book.html" class="btn btn--primary btn--xl">
          <span>${t('mine.empty.cta')}</span>
          <span class="arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>
  `;
}

function render() {
  const root = document.getElementById('mine-root');
  if (!root) return;
  const lang = getLang();
  const all = readBookings().slice().sort((a, b) => bookingDateObj(a) - bookingDateObj(b));

  if (all.length === 0) {
    root.innerHTML = `<div class="shell">${emptyHTML()}</div>`;
    const countEl = document.getElementById('mine-count');
    if (countEl) countEl.textContent = '00 · RESERVATIONS';
    requestAnimationFrame(() => root.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in')));
    return;
  }

  const upcoming = all.filter(isUpcoming);
  const past     = all.filter(b => !isUpcoming(b)).reverse();

  let html = '';
  if (upcoming.length) {
    html += `<div class="shell"><h2 class="mine-group__heading">${t('mine.upcoming')} · ${String(upcoming.length).padStart(2, '0')}</h2></div>
      <div class="mine-list">${upcoming.map((b, i) => bookingCardHTML(b, i, lang)).join('')}</div>`;
  }
  if (past.length) {
    html += `<div class="shell" style="margin-block-start: var(--s-9);"><h2 class="mine-group__heading">${t('mine.past')} · ${String(past.length).padStart(2, '0')}</h2></div>
      <div class="mine-list" style="opacity: 0.55;">${past.map((b, i) => bookingCardHTML(b, i, lang)).join('')}</div>`;
  }
  root.innerHTML = html;

  // Update the count chip in header
  const total = all.length;
  const countEl = document.getElementById('mine-count');
  if (countEl) countEl.textContent = `${String(total).padStart(2, '0')} · ${total === 1 ? 'RESERVATION' : 'RESERVATIONS'}`;

  // Wire cancel handlers + reveal
  root.querySelectorAll('[data-card-id]').forEach(card => {
    attachCancelHandler(card, card.dataset.cardId);
  });
  requestAnimationFrame(() => root.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('is-in'), i * 60);
  }));
}

render();
window.addEventListener('languagechange', render);
