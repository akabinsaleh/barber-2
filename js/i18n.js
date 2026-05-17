// ============================================================
// Maqaṣṣ Atelier — i18n
// Single dictionary covering every static UI string in EN + AR.
// setLanguage(lang) flips <html lang/dir>, persists to localStorage,
// and re-paints all [data-i18n] elements. Dynamic UI (booking flow,
// service list, etc.) listens for the 'languagechange' event.
// ============================================================

const DICT = {
  // Navigation + global chrome
  'nav.home':      { en: 'Home',         ar: 'الرئيسية' },
  'nav.services':  { en: 'Services',     ar: 'الخدمات' },
  'nav.book':      { en: 'Reserve',      ar: 'احجز' },
  'nav.mine':      { en: 'My Bookings',  ar: 'حجوزاتي' },
  'nav.lang':      { en: 'العربية',      ar: 'English' },
  'nav.skip':      { en: 'Skip to main content', ar: 'تخطّ إلى المحتوى الرئيسي' },

  // Footer
  'footer.hours':     { en: 'Hours',        ar: 'ساعات العمل' },
  'footer.find':      { en: 'Find Us',      ar: 'موقعنا' },
  'footer.contact':   { en: 'Contact',      ar: 'اتصل بنا' },
  'footer.legal':     { en: '© 2026 Maqaṣṣ Atelier · All rights reserved.', ar: '© ٢٠٢٦ مَقَصّ أتيليه · جميع الحقوق محفوظة.' },
  'footer.craft':     { en: 'Est. 2014',    ar: 'تأسس ٢٠١٤' },

  // System bar
  'sys.open':  { en: 'OPEN NOW · UNTIL 21:00',         ar: 'مفتوح الآن · حتى ٢١:٠٠' },
  'sys.loc':   { en: 'RIYADH // 24.7136° N, 46.6753° E', ar: 'الرياض // ٢٤.٧١٣٦° ش، ٤٦.٦٧٥٣° ق' },
  'sys.year':  { en: '[ MAQ // 2026 ]',                 ar: '[ مَقَصّ // ٢٠٢٦ ]' },

  // Home — hero
  'hero.tag':   { en: 'No-fuss · 4 chairs · 12 yrs',    ar: 'بلا رتوش · ٤ كراسي · ١٢ سنة' },
  'hero.line1': { en: 'Cut',                            ar: 'قُصّ' },
  'hero.line2': { en: 'well.',                          ar: 'بإتقان.' },
  'hero.intro': {
    en: 'Four chairs, twelve years, one ritual. We cut hair the way it ought to be cut — unhurried, deliberate, and finished with a hot towel. No mood music, no upsell.',
    ar: 'أربعة كراسي، اثنا عشر عامًا، وطقسٌ واحد. نقصّ الشعر كما يجب أن يُقصّ — دون عجلة، بتأنٍّ، وننهيه بمنشفةٍ ساخنة. لا موسيقى مُتكلَّفة، ولا عروضًا إضافية.'
  },
  'hero.cta.book':  { en: 'Reserve a chair',  ar: 'احجز كرسيًا' },
  'hero.cta.see':   { en: 'See services',     ar: 'تصفّح الخدمات' },

  // Console widget
  'console.head':   { en: '// MENU.txt',       ar: '// القائمة' },
  'console.total':  { en: 'SELECT & BOOK',     ar: 'اختر واحجز' },
  'console.cta':    { en: 'Reserve',           ar: 'احجز' },

  // Home — section heads + CTAs
  'home.barbers.title':   { en: 'The chairs',           ar: 'الكراسي' },
  'home.services.title':  { en: 'What we do',           ar: 'ما نقدّمه' },
  'home.services.cta':    { en: 'Full menu →',          ar: 'القائمة الكاملة ←' },

  'home.cta2.tag':        { en: '04 // BOOK',           ar: '٠٤ // احجز' },
  'home.cta2.title':      { en: 'Walk in. Walk out sharper.', ar: 'ادخل. اخرج أكثر تشذيبًا.' },
  'home.cta2.sub':        { en: 'Pick your barber, your time, your service. Done in under a minute.', ar: 'اختر حلّاقك، وقتك، خدمتك. كل ذلك في أقل من دقيقة.' },
  'home.cta2.button':     { en: 'Start booking',        ar: 'ابدأ الحجز' },

  // Services page
  'services.eyebrow':   { en: 'The menu',             ar: 'القائمة' },
  'services.title':     { en: 'Five services. Pick one, pick a few.', ar: 'خمس خدمات. اختر واحدة، أو عدّة.' },
  'services.duration':  { en: 'min',                  ar: 'دقيقة' },
  'services.book':      { en: 'Reserve',              ar: 'احجز' },

  // Book page
  'book.eyebrow':       { en: 'Reservation',          ar: 'الحجز' },
  'book.title':         { en: 'Pick your chair.',     ar: 'اختر كرسيك.' },
  'book.progress.heading': { en: 'Your Selection',    ar: 'اختياراتك' },
  'book.progress.empty':   { en: 'Not yet chosen',    ar: 'لم يُختر بعد' },
  'book.progress.total':   { en: 'Total',             ar: 'المجموع' },

  'book.step.1.label':  { en: 'Service',               ar: 'الخدمة' },
  'book.step.2.label':  { en: 'Barber',                ar: 'الحلّاق' },
  'book.step.3.label':  { en: 'Date & Time',           ar: 'التاريخ والوقت' },
  'book.step.4.label':  { en: 'Your Details',          ar: 'بياناتك' },

  'book.step.1.title':  { en: 'Choose one or more services.',  ar: 'اختر خدمة أو أكثر.' },
  'book.step.1.hint':   { en: 'Tap to select · combine freely.', ar: 'انقر للاختيار · يمكن الجمع بحريّة.' },

  'book.step.2.title':  { en: 'Whose hands?',                  ar: 'بيدِ من؟' },
  'book.step.2.hint':   { en: 'We advance automatically.',     ar: 'سننتقل تلقائيًا.' },

  'book.step.3.title':  { en: 'When works?',                   ar: 'متى يناسبك؟' },
  'book.step.3.morning':   { en: 'Morning',     ar: 'صباحًا' },
  'book.step.3.afternoon': { en: 'Afternoon',   ar: 'ظهرًا' },
  'book.step.3.evening':   { en: 'Evening',     ar: 'مساءً' },
  'book.step.3.closed':    { en: 'Friday morning · closed', ar: 'صباح الجمعة · مغلق' },

  'book.step.4.title':  { en: 'Just three things.',            ar: 'ثلاثة أمور فقط.' },
  'book.step.4.name':   { en: 'Full name',                     ar: 'الاسم الكامل' },
  'book.step.4.name.ph': { en: 'Faisal Al-Sayed',              ar: 'فيصل السيد' },
  'book.step.4.phone':  { en: 'Phone number',                  ar: 'رقم الهاتف' },
  'book.step.4.phone.ph': { en: '+966 55 123 4567',            ar: '٠٥٥١٢٣٤٥٦٧' },
  'book.step.4.phone.err': { en: 'Please enter a valid phone number.', ar: 'يرجى إدخال رقم هاتف صحيح.' },
  'book.step.4.name.err':  { en: 'Please enter your name.',     ar: 'يرجى إدخال اسمك.' },
  'book.step.4.notes':  { en: 'Notes (optional)',              ar: 'ملاحظات (اختياري)' },
  'book.step.4.notes.ph': { en: 'Anything we should know? Allergies, style preferences…', ar: 'أي شيء ينبغي علينا معرفته؟ حساسية، تفضيلات…' },

  'book.back':          { en: 'Back',                          ar: 'رجوع' },
  'book.continue':      { en: 'Continue',                      ar: 'متابعة' },
  'book.confirm':       { en: 'Confirm Reservation',           ar: 'تأكيد الحجز' },

  // Confirmation
  'book.done.eyebrow':  { en: 'Reserved',                      ar: 'تمّ الحجز' },
  'book.done.title':    { en: "You're on the books.",          ar: 'أنت على القائمة.' },
  'book.done.id':       { en: 'Reference',                     ar: 'الرقم المرجعي' },
  'book.done.sub':      { en: 'We saved this on your device. Bring the reference if you like — we will already know your name.', ar: 'حفظناه على جهازك. أحضر الرقم إن شئت — سنعرف اسمك مسبقًا.' },
  'book.done.cta.another': { en: 'Book another',               ar: 'احجز موعدًا آخر' },
  'book.done.cta.mine':    { en: 'See my bookings',            ar: 'انظر حجوزاتي' },

  // My Bookings
  'mine.eyebrow':       { en: 'Your visits',                   ar: 'زياراتك' },
  'mine.title':         { en: 'My Bookings',                   ar: 'حجوزاتي' },
  'mine.empty.title':   { en: 'No reservations yet.',          ar: 'لا توجد حجوزات بعد.' },
  'mine.empty.sub':     { en: 'Once you book, your appointments live here.', ar: 'بمجرد الحجز، ستظهر مواعيدك هنا.' },
  'mine.empty.cta':     { en: 'Reserve a chair',               ar: 'احجز كرسيًا' },
  'mine.with':          { en: 'With',                          ar: 'مع' },
  'mine.cancel':        { en: 'Cancel',                        ar: 'إلغاء' },
  'mine.cancel.confirm': { en: 'Confirm cancel',               ar: 'تأكيد الإلغاء' },
  'mine.cancel.keep':   { en: 'Keep it',                       ar: 'إبقاء' },
  'mine.upcoming':      { en: 'Upcoming',                      ar: 'القادمة' },
  'mine.past':          { en: 'Past',                          ar: 'السابقة' },
  'mine.services':      { en: 'services',                      ar: 'خدمات' },
  'mine.service':       { en: 'service',                       ar: 'خدمة' },

  // Misc
  'a.barber':           { en: 'barber',                        ar: 'حلّاق' },
  'a.total':            { en: 'Total',                         ar: 'المجموع' },
};

// Months in EN/AR (use for date strip + booking summary)
export const MONTHS = {
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
};
export const WEEKDAYS = {
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  ar: ['أحد','إثن','ثلا','أرب','خمي','جمع','سبت'],
};
export const MONTHS_LONG = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
};

// ——— Public API ———————————————————————————————————————————————

let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en';

export function getLang() { return currentLang; }

export function t(key) {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[currentLang] || entry.en || key;
}

export function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'ar') return;
  currentLang = lang;
  try { localStorage.setItem('lang', lang); } catch {}
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  paint();
  // Notify dynamic UI (service lists, booking flow, etc.)
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

function paint() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    // format: "attr:key" or "attr:key,attr2:key2"
    el.dataset.i18nAttr.split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
}

// Init on import — but DOM may not exist yet, defer to ready
function init() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  paint();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
