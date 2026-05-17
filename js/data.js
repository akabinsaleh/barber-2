// ============================================================
// Maqaṣṣ Atelier — Prototype Data
// All static content (services, barbers, brand). Bilingual.
// ============================================================

export const BRAND = {
  name: { en: 'Maqaṣṣ Atelier', ar: 'مَقَصّ أتيليه' },
  short: { en: 'Maqaṣṣ', ar: 'مَقَصّ' },
  tagline: {
    en: 'A barbershop, sharpened.',
    ar: 'صالون حلاقة، بدقّةٍ مشحوذة.',
  },
  address: {
    en: '14 Olaya Walk · Riyadh',
    ar: '١٤ ممشى العليا · الرياض',
  },
  hours: {
    en: 'Sat–Thu  10:00 — 21:00  ·  Fri  14:00 — 21:00',
    ar: 'السبت–الخميس  ١٠:٠٠ — ٢١:٠٠  ·  الجمعة  ١٤:٠٠ — ٢١:٠٠',
  },
  phone: '+966 11 482 9100',
  established: '2014',
  currency: { en: 'SAR', ar: 'ر.س' },
};

export const SERVICES = [
  {
    id: 'classic',
    en: { name: 'Classic Haircut', desc: 'Shears, taper, hot-towel finish.' },
    ar: { name: 'قصّة كلاسيكية', desc: 'مقص، تدرّج، إنهاء بالمنشفة الساخنة.' },
    duration: 30,
    price: 60,
  },
  {
    id: 'beard',
    en: { name: 'Beard Trim', desc: 'Line-up, shaping, beard oil.' },
    ar: { name: 'تهذيب اللحية', desc: 'تحديد، تشكيل، زيت اللحية.' },
    duration: 20,
    price: 35,
  },
  {
    id: 'shave',
    en: { name: 'Hot Towel Shave', desc: 'Pre-shave oil, hot towels, straight razor.' },
    ar: { name: 'حلاقة بالمنشفة الساخنة', desc: 'زيت ما قبل الحلاقة، مناشف ساخنة، موس مستقيم.' },
    duration: 40,
    price: 75,
  },
  {
    id: 'combo',
    en: { name: 'Hair & Beard', desc: 'The full ritual — cut, trim, finish.' },
    ar: { name: 'شعر ولحية', desc: 'الطقس الكامل — قص، تهذيب، إنهاء.' },
    duration: 50,
    price: 90,
  },
  {
    id: 'kids',
    en: { name: 'Kids Cut', desc: 'Patient, careful, for ages 4 – 12.' },
    ar: { name: 'قصّ الأطفال', desc: 'بصبر وعناية، للأعمار ٤ — ١٢.' },
    duration: 25,
    price: 45,
  },
];

export const BARBERS = [
  {
    id: 'ahmed',
    initials: 'AR',
    en: { name: 'Ahmed Al-Rashid', specialty: 'Master Barber — 12 years' },
    ar: { name: 'أحمد الراشد', specialty: 'حلّاق رئيسي — ١٢ سنة' },
    tilt: -2,
  },
  {
    id: 'khalid',
    initials: 'KM',
    en: { name: 'Khalid Mansour', specialty: 'Classic & Fades' },
    ar: { name: 'خالد منصور', specialty: 'كلاسيكي وفيدز' },
    tilt: 1,
  },
  {
    id: 'yousef',
    initials: 'YI',
    en: { name: 'Yousef Ibrahim', specialty: 'Beard & Shave' },
    ar: { name: 'يوسف إبراهيم', specialty: 'لحية وحلاقة' },
    tilt: -1,
  },
  {
    id: 'omar',
    initials: 'OS',
    en: { name: 'Omar Saleh', specialty: 'Modern Styles' },
    ar: { name: 'عمر صالح', specialty: 'تسريحات حديثة' },
    tilt: 2,
  },
];

// Helpers
export function getService(id) { return SERVICES.find(s => s.id === id); }
export function getBarber(id) { return BARBERS.find(b => b.id === id); }
export function formatPrice(amount, lang) {
  const cur = BRAND.currency[lang];
  return lang === 'ar' ? `${amount} ${cur}` : `${amount} ${cur}`;
}
