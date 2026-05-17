// ============================================================
// Maqaṣṣ Atelier — Booking flow controller
// State machine over 4 steps. Renders step content from data.js,
// validates, persists via submitBooking() (Firebase swap-in marker).
// ============================================================

import { SERVICES, BARBERS, BRAND, getService, getBarber, formatPrice } from './data.js';
import { getLang, t, MONTHS, MONTHS_LONG, WEEKDAYS } from './i18n.js';

// ——— State ————————————————————————————————————————————————————————

const state = {
  step: 1,
  serviceIds: [],
  barberId: null,
  date: null,    // 'YYYY-MM-DD'
  time: null,    // 'HH:MM'
  name: '',
  phone: '',
  notes: '',
};

// Restore service preselection from ?service=<id>
const params = new URLSearchParams(location.search);
const preset = params.get('service');
if (preset && SERVICES.find(s => s.id === preset)) state.serviceIds = [preset];

// ——— Helpers ————————————————————————————————————————————————————

function pad(n) { return n < 10 ? '0' + n : '' + n; }
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseYmd(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function total() {
  return state.serviceIds.reduce((sum, id) => sum + (getService(id)?.price || 0), 0);
}

// ——— Step 1: Services ————————————————————————————————————————————

function renderServices() {
  const lang = getLang();
  const root = document.getElementById('services-pick');
  if (!root) return;
  root.innerHTML = SERVICES.map((s, i) => `
    <button
      class="pick"
      type="button"
      data-svc="${s.id}"
      aria-pressed="${state.serviceIds.includes(s.id)}"
    >
      <div class="pick-row">
        <span class="pick-row__num">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <h3 class="pick-row__name">${s[lang].name}</h3>
          <span class="pick-row__desc">${s[lang].desc}</span>
        </div>
        <div class="pick-row__meta">${s.duration} ${t('services.duration')}</div>
        <div class="pick-row__price">${formatPrice(s.price, lang)}</div>
      </div>
    </button>
  `).join('');

  root.querySelectorAll('[data-svc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.svc;
      const i = state.serviceIds.indexOf(id);
      if (i === -1) state.serviceIds.push(id);
      else state.serviceIds.splice(i, 1);
      btn.setAttribute('aria-pressed', state.serviceIds.includes(id));
      updateProgress();
      updateNav();
    });
  });
}

// ——— Step 2: Barbers (auto-advance) ——————————————————————————————

function renderBarbers() {
  const lang = getLang();
  const root = document.getElementById('barbers-pick');
  if (!root) return;
  root.innerHTML = BARBERS.map(b => `
    <button
      class="barber-pick"
      type="button"
      data-barber="${b.id}"
      aria-pressed="${state.barberId === b.id}"
    >
      <span class="barber-pick__id" aria-hidden="true">${b.initials}</span>
      <div>
        <div class="barber-pick__name">${b[lang].name}</div>
        <div class="barber-pick__spec">${b[lang].specialty}</div>
      </div>
    </button>
  `).join('');

  root.querySelectorAll('[data-barber]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.barberId = btn.dataset.barber;
      root.querySelectorAll('[data-barber]').forEach(b => b.setAttribute('aria-pressed', b.dataset.barber === state.barberId));
      updateProgress();
      // Auto-advance after a brief delay (let the selection animation play)
      setTimeout(() => goToStep(3), 280);
    });
  });
}

// ——— Step 3: Date + Time ————————————————————————————————————————

function buildDays() {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

let cachedDays = null;
function renderDateStrip() {
  const lang = getLang();
  const root = document.getElementById('date-strip');
  if (!root) return;
  cachedDays = cachedDays || buildDays();
  const todayKey = ymd(new Date());

  root.innerHTML = cachedDays.map((d, i) => {
    const key = ymd(d);
    return `
      <button
        class="date-cell ${key === todayKey ? 'is-today' : ''}"
        type="button"
        data-date="${key}"
        aria-pressed="${state.date === key}"
      >
        <span class="date-cell__day">${WEEKDAYS[lang][d.getDay()]}</span>
        <span class="date-cell__num">${d.getDate()}</span>
      </button>
    `;
  }).join('');

  root.querySelectorAll('[data-date]').forEach(c => {
    c.addEventListener('click', () => {
      state.date = c.dataset.date;
      state.time = null;
      root.querySelectorAll('[data-date]').forEach(x => x.setAttribute('aria-pressed', x.dataset.date === state.date));
      // Scroll the strip only (NOT the page) so the picked cell centers in the strip
      centerCellInStrip(root, c);
      renderTimes();
      updateProgress();
      updateNav();
      updateMonthLabel();
    });
  });

  // Arrows: page ~7 days within the strip
  const isRTL = document.documentElement.dir === 'rtl';
  document.querySelector('[data-date-prev]')?.addEventListener('click', () => {
    root.scrollBy({ left: isRTL ?  getCellPage(root) : -getCellPage(root), behavior: 'smooth' });
  });
  document.querySelector('[data-date-next]')?.addEventListener('click', () => {
    root.scrollBy({ left: isRTL ? -getCellPage(root) :  getCellPage(root), behavior: 'smooth' });
  });

  root.addEventListener('scroll', updateMonthLabel, { passive: true });

  // Initial month label
  requestAnimationFrame(updateMonthLabel);
}

function getCellPage(root) {
  const cell = root.querySelector('.date-cell');
  if (!cell) return 200;
  const w = cell.getBoundingClientRect().width;        // cells have no gap (border-only)
  return Math.round(w * 7);                             // ~7 days
}

// Scroll the strip horizontally so the cell centers within it — never scroll the page
function centerCellInStrip(strip, cell) {
  const sRect = strip.getBoundingClientRect();
  const cRect = cell.getBoundingClientRect();
  // Visual delta from cell-center to strip-center; positive = scroll forward (toward end)
  const delta = (cRect.left + cRect.width / 2) - (sRect.left + sRect.width / 2);
  // scrollBy handles RTL correctly when document.dir is set
  strip.scrollBy({ left: delta, behavior: 'smooth' });
}

function updateMonthLabel() {
  const root = document.getElementById('date-strip');
  if (!root || !cachedDays) return;
  const lang = getLang();
  const rootRect = root.getBoundingClientRect();
  const visible = Array.from(root.querySelectorAll('.date-cell')).filter(c => {
    const r = c.getBoundingClientRect();
    return r.right > rootRect.left + 4 && r.left < rootRect.right - 4;
  });
  if (!visible.length) return;
  const monthsInView = new Set();
  visible.forEach(c => {
    const d = parseYmd(c.dataset.date);
    monthsInView.add(d.getMonth());
  });
  const sorted = [...monthsInView].sort((a, b) => a - b);
  const label = sorted.map(m => MONTHS[lang][m]).join(' / ');
  const el = document.getElementById('date-month');
  if (el) el.textContent = lang === 'en' ? label.toUpperCase() : label;
}

function buildSlots() {
  // 10:00 -> 21:00 every 30 min, last slot starts 20:30
  const slots = [];
  for (let h = 10; h < 21; h++) {
    slots.push(`${pad(h)}:00`);
    slots.push(`${pad(h)}:30`);
  }
  slots.push('21:00');
  return slots;
}

function groupSlots(slots) {
  const morning = slots.filter(s => parseInt(s) < 12);
  const afternoon = slots.filter(s => { const h = parseInt(s); return h >= 12 && h < 17; });
  const evening = slots.filter(s => parseInt(s) >= 17);
  return { morning, afternoon, evening };
}

function renderTimes() {
  const root = document.getElementById('time-blocks');
  if (!root) return;
  if (!state.date) { root.innerHTML = ''; return; }

  const d = parseYmd(state.date);
  const isFriday = d.getDay() === 5;
  const todayKey = ymd(new Date());
  const isToday = state.date === todayKey;
  const nowHHMM = isToday ? `${pad(new Date().getHours())}:${pad(new Date().getMinutes())}` : '00:00';

  const slots = buildSlots();
  const { morning, afternoon, evening } = groupSlots(slots);

  function blockHTML(label, list, closedNote) {
    if (!list.length) return '';
    const cells = list.map(slot => {
      const closedForFriday = isFriday && slot < '14:00';
      const inPast = isToday && slot <= nowHHMM;
      const disabled = closedForFriday || inPast;
      return `
        <button class="time-cell" type="button" data-time="${slot}"
                aria-pressed="${state.time === slot}"
                ${disabled ? 'disabled aria-disabled="true"' : ''}>
          ${slot}
        </button>
      `;
    }).join('');
    return `
      <div class="time-block">
        <div class="time-block__label">${label}</div>
        ${isFriday && closedNote ? `<div class="time-closed">${t('book.step.3.closed')}</div>` : `<div class="time-grid">${cells}</div>`}
      </div>
    `;
  }

  root.innerHTML =
    blockHTML(t('book.step.3.morning'), morning, true) +
    blockHTML(t('book.step.3.afternoon'), afternoon, false) +
    blockHTML(t('book.step.3.evening'), evening, false);

  root.querySelectorAll('[data-time]:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      state.time = btn.dataset.time;
      root.querySelectorAll('[data-time]').forEach(b => b.setAttribute('aria-pressed', b.dataset.time === state.time));
      updateProgress();
      updateNav();
    });
  });
}

// ——— Step 4: Form ————————————————————————————————————————————————

function bindForm() {
  const form = document.getElementById('details-form');
  if (!form) return;
  const name = form.elements.name;
  const phone = form.elements.phone;
  const notes = form.elements.notes;

  name.addEventListener('input', () => {
    state.name = name.value.trim();
    document.getElementById('err-name').textContent = '';
    updateProgress();
    updateNav();
  });
  phone.addEventListener('input', () => {
    state.phone = phone.value.trim();
    document.getElementById('err-phone').textContent = '';
    updateNav();
  });
  notes.addEventListener('input', () => { state.notes = notes.value.trim(); });
}

function validatePhone(p) {
  return /^[+\d][\d\s\-]{7,15}$/.test(p);
}

// ——— Step navigation ————————————————————————————————————————————

function showStep(n) {
  document.querySelectorAll('.step').forEach(el => {
    el.classList.toggle('is-active', Number(el.dataset.step) === n);
  });
  document.querySelectorAll('[data-progress-step]').forEach(el => {
    const s = Number(el.dataset.progressStep);
    el.classList.toggle('progress__item--current', s === n);
    if (s === n) el.setAttribute('aria-current', 'step');
    else el.removeAttribute('aria-current');
  });
  const back = document.querySelector('[data-step-back]');
  back.hidden = (n === 1);
  document.getElementById('confirm').classList.remove('is-active');
  document.getElementById('step-actions').style.display = '';
  // Show all steps' parent (in case it was hidden post-confirm)
  document.querySelectorAll('.step').forEach(el => { el.style.display = ''; });
  state.step = n;
  updateNav();
  // Scroll to top of the step on mobile
  document.querySelector(`[data-step="${n}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToStep(n) {
  if (n < 1 || n > 4) return;
  showStep(n);
}

function canAdvance() {
  switch (state.step) {
    case 1: return state.serviceIds.length > 0;
    case 2: return !!state.barberId;
    case 3: return !!state.date && !!state.time;
    case 4: return !!state.name && validatePhone(state.phone);
    default: return false;
  }
}

function updateNav() {
  const next = document.querySelector('[data-step-next]');
  if (!next) return;
  next.disabled = !canAdvance();
  document.getElementById('next-label').textContent =
    state.step === 4 ? t('book.confirm') : t('book.continue');
}

// ——— Progress summary (updates the sidebar live) ————————————————

function updateProgress() {
  const lang = getLang();

  // 1 — services
  const v1 = document.querySelector('[data-progress-value="1"]');
  if (state.serviceIds.length === 0) v1.textContent = t('book.progress.empty');
  else if (state.serviceIds.length === 1) v1.textContent = getService(state.serviceIds[0])[lang].name;
  else v1.textContent = `${state.serviceIds.length} ${t('mine.services')}`;
  setFilled(1, state.serviceIds.length > 0);

  // 2 — barber
  const v2 = document.querySelector('[data-progress-value="2"]');
  v2.textContent = state.barberId ? getBarber(state.barberId)[lang].name : t('book.progress.empty');
  setFilled(2, !!state.barberId);

  // 3 — date & time
  const v3 = document.querySelector('[data-progress-value="3"]');
  if (state.date && state.time) {
    const d = parseYmd(state.date);
    const wk = WEEKDAYS[lang][d.getDay()];
    const mo = MONTHS[lang][d.getMonth()];
    v3.textContent = `${wk} ${d.getDate()} ${mo} · ${state.time}`;
  } else {
    v3.textContent = t('book.progress.empty');
  }
  setFilled(3, !!(state.date && state.time));

  // 4 — name
  const v4 = document.querySelector('[data-progress-value="4"]');
  v4.textContent = state.name || t('book.progress.empty');
  setFilled(4, !!state.name);

  // Total
  document.getElementById('progress-total').textContent = formatPrice(total(), lang);
}

function setFilled(step, filled) {
  const li = document.querySelector(`[data-progress-step="${step}"]`);
  if (li) li.classList.toggle('progress__item--filled', filled);
}

// ——— Submit ————————————————————————————————————————————————————

async function handleConfirm() {
  // Validate again before submit
  const errors = {};
  if (!state.name) errors.name = t('book.step.4.name.err');
  if (!validatePhone(state.phone)) errors.phone = t('book.step.4.phone.err');
  if (Object.keys(errors).length) {
    document.getElementById('err-name').textContent = errors.name || '';
    document.getElementById('err-phone').textContent = errors.phone || '';
    return;
  }

  const booking = {
    serviceIds: state.serviceIds.slice(),
    barberId: state.barberId,
    date: state.date,
    time: state.time,
    name: state.name,
    phone: state.phone,
    notes: state.notes,
  };

  const id = await submitBooking(booking);

  // Confirmation screen
  document.getElementById('confirm-id').textContent = id;
  document.querySelectorAll('.step').forEach(el => el.style.display = 'none');
  document.getElementById('step-actions').style.display = 'none';
  document.getElementById('confirm').classList.add('is-active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// FIREBASE INTEGRATION POINT
// ============================================================
// To swap localStorage for Firebase, replace ONLY the body of
// this function. The signature stays the same: it takes a
// booking object (without id/createdAt) and returns a string id.
//
// Example replacement:
//   import { addDoc, collection } from 'firebase/firestore';
//   import { db } from './firebase.js';
//   async function submitBooking(booking) {
//     const ref = await addDoc(collection(db, 'bookings'), {
//       ...booking,
//       createdAt: new Date().toISOString(),
//     });
//     return ref.id;
//   }
// ============================================================
async function submitBooking(booking) {
  // ── localStorage implementation (prototype only) ──────────
  const id = `BK-${(crypto.randomUUID?.() || Math.random().toString(36).slice(2)).replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  const enriched = { ...booking, id, createdAt: new Date().toISOString() };
  const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
  existing.push(enriched);
  localStorage.setItem('bookings', JSON.stringify(existing));
  return id;
  // ──────────────────────────────────────────────────────────
}

// ——— Wire up ——————————————————————————————————————————————————

function resetFlow() {
  state.step = 1;
  state.serviceIds = [];
  state.barberId = null;
  state.date = null;
  state.time = null;
  state.name = '';
  state.phone = '';
  state.notes = '';
  document.getElementById('details-form').reset();
  document.getElementById('err-name').textContent = '';
  document.getElementById('err-phone').textContent = '';
  renderServices();
  renderBarbers();
  renderTimes();
  updateProgress();
  showStep(1);
}

function init() {
  renderServices();
  renderBarbers();
  renderDateStrip();
  renderTimes();
  bindForm();
  updateProgress();

  document.querySelector('[data-step-back]').addEventListener('click', () => {
    goToStep(Math.max(1, state.step - 1));
  });
  document.querySelector('[data-step-next]').addEventListener('click', () => {
    if (!canAdvance()) return;
    if (state.step === 4) handleConfirm();
    else goToStep(state.step + 1);
  });
  document.getElementById('another-btn').addEventListener('click', resetFlow);

  // Repaint on language change
  window.addEventListener('languagechange', () => {
    renderServices();
    renderBarbers();
    renderDateStrip();
    renderTimes();
    updateProgress();
    updateNav();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
