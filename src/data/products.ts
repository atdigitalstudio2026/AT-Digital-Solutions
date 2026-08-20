import { CategoryType, Product, ProductReview } from '../types';

export const CATEGORIES: CategoryType[] = [
  'Semua',
  'Produktivitas',
  'Desain',
  'Developer',
  'Keamanan',
  'Analitik',
  'Keuangan'
];

export const PRODUCTS: Product[] = [
  {
    id: 'nexus-crm',
    name: 'Nexus CRM Enterprise',
    cat: 'Produktivitas',
    price: 850000,
    originalPrice: 1200000,
    rating: 4.85,
    reviewsCount: 214,
    tag: 'best',
    iconLetter: 'N',
    gradient: 'linear-gradient(135deg, #7c5cff, #ff4fd8)',
    accentColor: '#7c5cff',
    tagline: 'Kelola ribuan pelanggan & pipeline penjualan dalam satu dashboard terpusat.',
    desc: 'Nexus CRM membantu tim sales memantau prospek, mengatur pipeline penjualan visual secara instan, dan mengotomatiskan follow-up pesan. Terintegrasi langsung dengan email, WhatsApp API, dan kalender bisnis dengan laporan performa real-time berakurasi tinggi.',
    features: [
      'Pipeline visual drag-and-drop',
      'Otomatisasi follow-up email & chat',
      'Laporan penjualan & proyeksi real-time',
      'Integrasi kalender & sinkronisasi kontak',
      'Multi-user dengan sistem role & perizinan granular'
    ],
    detailedFeatures: [
      { title: 'Otomatisasi Pipeline AI', description: 'Memprediksi konversi prospek berdasarkan interaksi historis.' },
      { title: 'Sinkronisasi Multi-Platform', description: 'Terhubung dengan Gmail, Outlook, Notion, dan webhook kustom.' },
      { title: 'Laporan Eksklusif PDF/Excel', description: 'Ekspor laporan kinerja tim dalam 1-klik untuk rapat eksekutif.' }
    ],
    req: [
      'Windows 10 / 11 (64-bit) atau macOS 12+ (Apple Silicon / Intel)',
      'RAM 4 GB minimum (8 GB direkomendasikan)',
      'Koneksi internet untuk sinkronisasi cloud real-time',
      '2 GB ruang penyimpanan SSD kosong'
    ],
    version: 'v3.4.2',
    platform: 'Web, Windows & macOS',
    fileSize: '142 MB',
    downloadCount: '48.2K+',
    highlights: ['Multi-User Ready', 'Offline Cache', 'AES-256 Cloud Sync'],
    licenseType: 'Lisensi Komersial Seumur Hidup + Update 1 Tahun',
    screenshots: [
      { title: 'Pipeline Kanban Realtime', description: 'Geser deal pelanggan antar tahapan dengan visual responsif.', badge: 'Sales Stage' },
      { title: 'Analitik Revenue & KPI', description: 'Grafik target mingguan dan pencapaian tim penjualan.', badge: 'Analytics' },
      { title: 'Manajemen Kontak Terpadu', description: 'Riwayat interaksi pelanggan dari chat, email, dan telepon.', badge: 'Contact Hub' }
    ]
  },
  {
    id: 'flux-analytics',
    name: 'Flux Business Analytics',
    cat: 'Analitik',
    price: 650000,
    originalPrice: 950000,
    rating: 4.75,
    reviewsCount: 132,
    tag: 'new',
    iconLetter: 'F',
    gradient: 'linear-gradient(135deg, #00e0c6, #7c5cff)',
    accentColor: '#00e0c6',
    tagline: 'Visualisasi data bisnis mentah menjadi dashboard interaktif tanpa coding.',
    desc: 'Flux Analytics mengubah spreadsheet kompleks, CSV, dan database SQL menjadi dashboard visual yang interaktif dan mudah dibaca. Sangat cocok bagi tim manajemen yang membutuhkan wawasan bisnis cepat tanpa perlu merekrut data engineer khusus.',
    features: [
      'Drag-and-drop visual chart & widget builder',
      'Koneksi langsung ke Excel, Google Sheets, PostgreSQL & CSV',
      'Pengiriman laporan otomatis via email/Telegram mingguan',
      'Filter dinamis & multi-dimensional drill-down',
      'Ekspor beresolusi tinggi ke PDF, SVG, dan PNG'
    ],
    detailedFeatures: [
      { title: 'Kalkulasi Otomatis', description: 'Formula cerdas untuk menghitung margin laba, churn, dan LTV secara instan.' },
      { title: 'Mode Presentasi Langsung', description: 'Tampilkan grafik ke layar proyektor dengan tema gelap profesional.' }
    ],
    req: [
      'Windows 10+ / macOS 11+ / Ubuntu 22.04+',
      'RAM 8 GB (direkomendasikan untuk dataset > 500k baris)',
      'Dukungan GPU OpenGL untuk rendering grafik 60fps'
    ],
    version: 'v2.1.0',
    platform: 'Desktop (Win/Mac/Linux)',
    fileSize: '98 MB',
    downloadCount: '31.8K+',
    highlights: ['GPU Acceleration', 'SQL Connectors', 'Zero Data Leak'],
    licenseType: 'Lisensi Perangkat Mandiri (Stand-alone)',
    screenshots: [
      { title: 'Dashboard Pendapatan Dinamis', description: 'Pantau tren penjualan dan produk terlaris secara langsung.', badge: 'Executive View' },
      { title: 'Visual Query Builder', description: 'Bangun query data tanpa perlu menulis sintaks SQL rumit.', badge: 'Query Studio' },
      { title: 'Peta Distribusi Geografis', description: 'Visualisasi sebaran pelanggan di seluruh wilayah Indonesia.', badge: 'Geo Heatmap' }
    ]
  },
  {
    id: 'vortex-suite',
    name: 'Vortex Design Suite Pro',
    cat: 'Desain',
    price: 1200000,
    originalPrice: 1850000,
    rating: 4.92,
    reviewsCount: 341,
    tag: 'best',
    iconLetter: 'V',
    gradient: 'linear-gradient(135deg, #ff4fd8, #ffb84f)',
    accentColor: '#ff4fd8',
    tagline: 'Solusi lengkap desain UI/UX, vektor presisi, dan prototipe interaktif.',
    desc: 'Vortex Design Suite adalah aplikasi desain native berperforma tinggi untuk membuat wireframe, prototipe aplikasi interaktif, aset vektor, dan design system skala enterprise. Dilengkapi ribuan komponen siap pakai dan engine rendering berbasis Vulkan/Metal.',
    features: [
      'Prototipe interaktif dengan animasi fisika realistis',
      'Design System Library dengan 5.000+ komponen modern',
      'Kolaborasi multi-desainer real-time tanpa latensi',
      'Plugin marketplace terbuka & ekstensi kustom',
      'Ekspor kode instan ke Tailwind CSS, React, dan Flutter'
    ],
    detailedFeatures: [
      { title: 'Vector Pen Precision Engine', description: 'Kontrol kurva Bézier matematis dengan snapping sub-piksel.' },
      { title: 'Auto-Layout Responsif', description: 'Desain beradaptasi fleksibel dari mobile ke desktop ultra-wide.' }
    ],
    req: [
      'macOS 12+ (M1/M2/M3 dioptimalkan) atau Windows 11',
      'RAM 8 GB minimum (16 GB disarankan)',
      'GPU Dedicated 2 GB VRAM atau Apple Unified Memory'
    ],
    version: 'v5.2.4',
    platform: 'Desktop (macOS & Windows)',
    fileSize: '310 MB',
    downloadCount: '92.5K+',
    highlights: ['Metal/Vulkan Engine', '60fps Canvas', 'Token Export'],
    licenseType: 'Lisensi Perorangan & Tim Kreatif',
    screenshots: [
      { title: 'Kanvas Desain Infinite', description: 'Kerjakan ratusan artboard dalam satu project tanpa frame drop.', badge: 'Infinite Canvas' },
      { title: 'Design System Token Manager', description: 'Kelola palet warna, tipografi, dan spasi secara terpusat.', badge: 'Tokens' },
      { title: 'Interactive State Machine', description: 'Simulasi alur klik, hover, dan transisi micro-interaction.', badge: 'Prototype' }
    ]
  },
  {
    id: 'pulse-automation',
    name: 'Pulse Workflow Automation',
    cat: 'Produktivitas',
    price: 450000,
    originalPrice: 650000,
    rating: 4.65,
    reviewsCount: 98,
    tag: null,
    iconLetter: 'P',
    gradient: 'linear-gradient(135deg, #7c5cff, #00e0c6)',
    accentColor: '#7c5cff',
    tagline: 'Otomatiskan ratusan tugas berulang di komputer dan cloud tanpa baris kode.',
    desc: 'Pulse Automation memungkinkan tim menyusun alur kerja otomatis — mulai dari pemindahan file massal, parsing data faktur, notifikasi tim, hingga integrasi webhook antar software bisnis — secara mandiri tanpa coding.',
    features: [
      'Visual workflow canvas drag-and-drop',
      '200+ modul integrasi aplikasi (Slack, Notion, Zapier, Webhook)',
      'Trigger berbasis jadwal, perubahan file, atau webhook masuk',
      'Log eksekusi detil dengan kemampuan auto-retry saat koneksi putus'
    ],
    detailedFeatures: [
      { title: 'Pemicu File & Folder Cerdas', description: 'Proses otomatis setiap ada dokumen baru di folder tertentu.' },
      { title: 'Template Bot WhatsApp', description: 'Kirim notifikasi otomatis ke pelanggan saat status pesanan berubah.' }
    ],
    req: [
      'Windows 10+ / macOS 11+ / Linux Server',
      'RAM 4 GB minimum',
      'Koneksi internet background stabil'
    ],
    version: 'v2.6.0',
    platform: 'Web, Windows & macOS',
    fileSize: '85 MB',
    downloadCount: '24.1K+',
    highlights: ['No-Code Workflow', '200+ Integrations', 'Auto-Retry'],
    licenseType: 'Lisensi Bisnis Tanpa Batas Alur Kerja',
    screenshots: [
      { title: 'Visual Workflow Designer', description: 'Hubungkan trigger dan action semudah menyusun puzzle.', badge: 'Builder' },
      { title: 'Real-time Execution Stream', description: 'Pantau status dan kecepatan eksekusi setiap detik.', badge: 'Live Logs' }
    ]
  },
  {
    id: 'orbit-tasks',
    name: 'Orbit Task & Sprint Manager',
    cat: 'Produktivitas',
    price: 350000,
    originalPrice: 500000,
    rating: 4.58,
    reviewsCount: 87,
    tag: null,
    iconLetter: 'O',
    gradient: 'linear-gradient(135deg, #00e0c6, #ffb84f)',
    accentColor: '#00e0c6',
    tagline: 'Manajemen proyek agile & sprint time-tracker ringan untuk tim gesit.',
    desc: 'Orbit membantu tim kecil dan startup mengatur task harian, deadline, sprint mingguan, dan alokasi beban kerja tim dengan tampilan papan Kanban dan timeline Gantt yang sangat ringkas namun bertenaga.',
    features: [
      'Papan Kanban gesit, List view, dan Timeline Gantt',
      'Built-in time tracker terintegrasi per sub-task',
      'Notifikasi deadline pintar via desktop & push alert',
      'Kolaborasi komentar dengan lampiran file dan mention tim'
    ],
    detailedFeatures: [
      { title: 'Matrix Prioritas Eisenhower', description: 'Kelompokkan tugas mendesak vs penting secara visual otomatis.' },
      { title: 'Timesheet & Laporan Jam Kerja', description: 'Hitung total jam kerja per proyek untuk keperluan billing klien.' }
    ],
    req: [
      'Windows 10+ / macOS 11+ / Web Browser Modern',
      'RAM 2 GB minimum',
      '500 MB ruang penyimpanan lokal'
    ],
    version: 'v1.8.4',
    platform: 'Web, Desktop & Mobile',
    fileSize: '62 MB',
    downloadCount: '19.4K+',
    highlights: ['Ultra Lightweight', 'Gantt Chart', 'Pomodoro Timer'],
    licenseType: 'Lisensi Perangkat Tunggal / Tim Kecil',
    screenshots: [
      { title: 'Sprint Board Kanban', description: 'Organisasi backlog, in-progress, dan done dengan drag intuitif.', badge: 'Agile Board' },
      { title: 'Timeline & Dependency Gantt', description: 'Lihat keterikatan antar tugas dan milestone proyek.', badge: 'Gantt View' }
    ]
  },
  {
    id: 'cipher-vpn',
    name: 'Cipher VPN Enterprise Pro',
    cat: 'Keamanan',
    price: 275000,
    originalPrice: 450000,
    rating: 4.88,
    reviewsCount: 456,
    tag: 'best',
    iconLetter: 'C',
    gradient: 'linear-gradient(135deg, #ff4fd8, #7c5cff)',
    accentColor: '#ff4fd8',
    tagline: 'Koneksi terenkripsi berkecepatan 10Gbps untuk tim kerja jarak jauh.',
    desc: 'Cipher VPN Pro memberikan perlindungan enkripsi tingkat perbankan dengan infrastruktur server di 35+ negara, kill-switch instan bila jaringan terputus, perlindungan kebocoran DNS, dan manajemen perizinan tim terpusat.',
    features: [
      'Enkripsi WireGuard & AES-256 militer',
      '35+ lokasi server global berkecepatan tinggi tanpa batas bandwidth',
      'Hardware-level Kill Switch otomatis',
      'Manajemen akses jaringan tim & IP dedicated'
    ],
    detailedFeatures: [
      { title: 'Multi-Hop Double Encryption', description: 'Rute lalu lintas internet melalui dua server terpisah untuk privasi mutlak.' },
      { title: 'Split Tunneling Fleksibel', description: 'Pilih aplikasi mana saja yang menggunakan VPN atau koneksi lokal.' }
    ],
    req: [
      'Windows 10 / 11 / macOS 11+ / Linux / iOS / Android',
      'RAM 2 GB minimum',
      'Koneksi internet broadband'
    ],
    version: 'v4.3.0',
    platform: 'Desktop & Mobile (Multi-OS)',
    fileSize: '45 MB',
    downloadCount: '110K+',
    highlights: ['Zero Logs Policy', '10Gbps Nodes', 'WireGuard Native'],
    licenseType: 'Lisensi 5 Perangkat Sekaligus',
    screenshots: [
      { title: 'Server Selector & Peta Latensi', description: 'Pilih server terdekat dengan ping terendah di bawah 15ms.', badge: 'Global Nodes' },
      { title: 'Traffic Monitor & Kill Switch', description: 'Pantau grafik throughput download/upload secara real-time.', badge: 'Speed Monitor' }
    ]
  },
  {
    id: 'apex-finance',
    name: 'Apex Smart Invoice & Billing',
    cat: 'Keuangan',
    price: 520000,
    originalPrice: 780000,
    rating: 4.70,
    reviewsCount: 165,
    tag: 'new',
    iconLetter: 'A',
    gradient: 'linear-gradient(135deg, #ffb84f, #ff4fd8)',
    accentColor: '#ffb84f',
    tagline: 'Pembuat invoice profesional otomatis dengan pengingat tagihan cerdas.',
    desc: 'Kelola penagihan klien, pembuatan faktur pajak, struk digital, dan pelacakan pembayaran tertunggak secara otomatis. Template faktur yang elegan dan siap cetak atau kirim via email/WhatsApp.',
    features: [
      'Generator invoice multi-mata uang dan multi-pajak',
      'Pengingat jatuh tempo otomatis ke klien',
      'QRIS & Rekening Virtual otomatis di setiap invoice',
      'Laporan arus kas bulanan & rekapitulasi laba-rugi'
    ],
    detailedFeatures: [
      { title: 'Custom Branding Logo', description: 'Sesuaikan kop surat dan warna tema faktur dengan identitas perusahaan.' },
      { title: 'Integrasi Bank Statement', description: 'Rekonsiliasi mutasi rekening otomatis dengan invoice yang terbit.' }
    ],
    req: [
      'Windows 10+ / macOS 11+ / Web Browser',
      'RAM 2 GB minimum',
      'Koneksi internet'
    ],
    version: 'v2.0.8',
    platform: 'Web & Desktop',
    fileSize: '72 MB',
    downloadCount: '18.9K+',
    highlights: ['QRIS Auto-Generate', 'Multi-Currency', 'PDF Export'],
    licenseType: 'Lisensi Perusahaan 1 Tahun Update',
    screenshots: [
      { title: 'Invoice Editor Interaktif', description: 'Ketik langsung di template dokumen dan lihat perubahan instan.', badge: 'Live Editor' },
      { title: 'Cash Flow Dashboard', description: 'Grafik penerimaan kas vs tagihan tertunda.', badge: 'Financials' }
    ]
  },
  {
    id: 'synapse-code',
    name: 'Synapse Developer Suite',
    cat: 'Developer',
    price: 790000,
    originalPrice: 1100000,
    rating: 4.89,
    reviewsCount: 278,
    tag: 'pro',
    iconLetter: 'S',
    gradient: 'linear-gradient(135deg, #00e0c6, #7c5cff)',
    accentColor: '#00e0c6',
    tagline: 'Toolkit developer untuk pengujian API, debugging database, dan Docker monitoring.',
    desc: 'Synapse menyatukan REST/GraphQL API client, database explorer multifungsi (PostgreSQL, MySQL, Redis), log viewer real-time, dan pemantau container Docker dalam satu aplikasi desktop super ringan.',
    features: [
      'API Client super cepat (REST, GraphQL, gRPC, WebSocket)',
      'Database GUI multi-driver dengan tabbed SQL workspace',
      'Docker container health monitor & real-time log tailer',
      'Mock server lokal & generator skenario pengujian'
    ],
    detailedFeatures: [
      { title: 'Zero Latency Startup', description: 'Aplikasi terbuka dalam kurang dari 200 milidetik menggunakan native Rust core.' },
      { title: 'Enkripsi Kredensial', description: 'Menyimpan API keys dan token rahasia di secure keychain lokal.' }
    ],
    req: [
      'Windows 10+ / macOS 11+ / Linux',
      'RAM 4 GB minimum',
      '1 GB ruang SSD'
    ],
    version: 'v3.1.5',
    platform: 'Desktop (Win/Mac/Linux)',
    fileSize: '54 MB',
    downloadCount: '54.6K+',
    highlights: ['Rust Core', 'Multi-DB Client', 'gRPC & REST'],
    licenseType: 'Lisensi Developer Profesional',
    screenshots: [
      { title: 'API Request Studio', description: 'Kirim payload JSON dan inspeksi header respon secara detail.', badge: 'API Tester' },
      { title: 'Universal DB Explorer', description: 'Jalankan query kompleks dengan code completion cerdas.', badge: 'SQL Studio' }
    ]
  }
];

export const TESTIMONIALS: ProductReview[] = [
  {
    id: 'rev-1',
    name: 'Dwi Anggraini',
    role: 'Head of Operations',
    company: 'Nusantara Tech Ventures',
    text: 'Alur kerja tim kami jadi jauh lebih teratur sejak memakai Nexus CRM dan Pulse Automation. Setup awal hanya butuh 10 menit, tanpa perlu konsultasi IT rumit.',
    rating: 5,
    date: '3 hari yang lalu'
  },
  {
    id: 'rev-2',
    name: 'Farrel Nugroho',
    role: 'Lead UI/UX Designer',
    company: 'PixelForge Studio',
    text: 'Vortex Design Suite benar-benar cepat di MacBook M-series. Rendering canvas sangat mulus meski menampung ratusan artboard beresolusi tinggi. Sangat sepadan dengan harganya.',
    rating: 5,
    date: '1 minggu yang lalu'
  },
  {
    id: 'rev-3',
    name: 'Citra Wulandari',
    role: 'VP Marketing & Growth',
    company: 'Karsa Digital Media',
    text: 'Flux Analytics memudahkan eksekutif kami membaca laporan mingguan tanpa harus pusing membuka file Excel puluhan ribu baris. Laporan PDF sekali klik sangat membantu meeting.',
    rating: 5,
    date: '2 minggu yang lalu'
  },
  {
    id: 'rev-4',
    name: 'Budi Santoso',
    role: 'Chief Technology Officer',
    company: 'SatuCloud Solusi',
    text: 'Cipher VPN dan Synapse Developer Suite menjadi aplikasi wajib bagi seluruh developer remote kami. Latensi rendah, aman, dan lisensi instan tanpa ribet.',
    rating: 5,
    date: '3 minggu yang lalu'
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'qris',
    category: 'Instant QR',
    label: 'QRIS Realtime (GoPay, OVO, ShopeePay, BCA Mobile, DANA)',
    description: 'Pindai barcode QRIS langsung dari aplikasi e-wallet apa saja. Terverifikasi instan.',
    badge: 'Proses Instan',
    icon: 'Q'
  },
  {
    id: 'transfer-bca',
    category: 'Virtual Account',
    label: 'BCA Virtual Account',
    description: 'Konfirmasi otomatis 24 jam tanpa perlu upload bukti transfer.',
    badge: 'Otomatis',
    icon: 'BCA'
  },
  {
    id: 'transfer-mandiri',
    category: 'Virtual Account',
    label: 'Mandiri Virtual Account / Livin',
    description: 'Bayar melalui Livin by Mandiri atau ATM terdekat.',
    badge: 'Otomatis',
    icon: 'MDR'
  },
  {
    id: 'transfer-bri',
    category: 'Virtual Account',
    label: 'BRI Virtual Account (BRIVA)',
    description: 'Dapat dibayar dari aplikasi BRImo atau mesin ATM BRI.',
    badge: 'Otomatis',
    icon: 'BRI'
  },
  {
    id: 'card',
    category: 'Kartu',
    label: 'Kartu Kredit / Debit Online (Visa, Mastercard, JCB)',
    description: 'Enkripsi 3D Secure dengan OTP verifikasi bank.',
    badge: '3D Secure',
    icon: 'CARD'
  }
];
