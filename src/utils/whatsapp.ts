export const WHATSAPP_CONFIG = {
  phoneNumber: '6281221594542',
  displayNumber: '+62 812-2159-4542',
  rawNumber: '081221594542',
  email: 'atdigitalstudio2026@gmail.com',
  brandName: 'AT Digital Solution',
  consultantName: 'Tim Konsultan AT Digital Solution',
  operationalHours: 'Senin - Minggu (08.00 - 22.00 WIB)',
  averageResponseTime: '< 5 menit',
  defaultGreeting: 'Halo AT Digital Studio, saya berminat untuk membuat aplikasi, apakah bisa di bantu?'
};

export const QUICK_WHATSAPP_TOPICS = [
  {
    id: 'custom_app',
    icon: '🚀',
    title: 'Pembuatan Aplikasi / Web Kustom',
    message: 'Halo AT Digital Studio, saya berminat untuk membuat aplikasi, apakah bisa di bantu?',
    badge: 'Utama'
  },
  {
    id: 'web_dev',
    icon: '💻',
    title: 'Konsultasi Jasa Web & UI/UX Design',
    message: 'Halo Tim AT Digital Studio, saya ingin konsultasi mengenai pembuatan website & UI/UX modern untuk bisnis saya.',
    badge: 'Populer'
  },
  {
    id: 'software_license',
    icon: '🔑',
    title: 'Tanya Lisensi & Pembelian Software',
    message: 'Halo AT Digital Studio, saya ingin bertanya seputar lisensi software resmi dan metode pembayarannya.',
    badge: 'Instan'
  },
  {
    id: 'custom_feature',
    icon: '⚡',
    title: 'Kustomisasi Fitur & Permintaan Demo',
    message: 'Halo Tim AT Digital Studio, apakah software yang ada bisa dikustomisasi sesuai alur kerja spesifik perusahaan saya?',
    badge: 'Proyek'
  },
  {
    id: 'tech_support',
    icon: '🛠️',
    title: 'Bantuan Teknis & Aktivasi',
    message: 'Halo Tim Support AT Digital Studio, saya membutuhkan bantuan teknis seputar aktivasi lisensi software yang telah saya beli.',
    badge: 'Support'
  }
];

/**
 * Generates direct WhatsApp chat URL with encoded message
 */
export function getWhatsAppUrl(message?: string): string {
  const defaultMsg = WHATSAPP_CONFIG.defaultGreeting;
  const text = encodeURIComponent(message && message.trim() ? message.trim() : defaultMsg);
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${text}`;
}

/**
 * Opens WhatsApp chat in a new browser tab/window
 */
export function openWhatsAppChat(message?: string): void {
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

