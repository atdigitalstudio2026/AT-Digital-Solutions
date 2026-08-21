# AT Digital - Sistem Autentikasi Firebase & Cloud Firestore

Sistem autentikasi tingkat produksi (production-ready) yang dibangun menggunakan **Firebase Authentication** dan **Cloud Firestore** dengan arsitektur modular JavaScript ES Module.

---

## 🔒 Prinsip Keamanan Sistem
1. **Single Source of Truth**: Sesi, kredensial, dan otentikasi dikelola langsung oleh Firebase Authentication (`onAuthStateChanged`).
2. **Tanpa Password di Firestore**: Kata sandi dienkripsi dan dikelola secara aman oleh Firebase Auth; tidak ada password/hash/token yang disimpan di database atau `localStorage`.
3. **Penyelarasan Firestore Terenkapsulasi**: Saat user login/register, profil user disimpan pada dokumen `users/{uid}` dengan field `uid`, `displayName`, `email`, `role`, `status`, `createdAt`, `updatedAt`, dan `lastLoginAt`.
4. **Verifikasi Email**: Mendukung alur `sendEmailVerification`, reload status `emailVerified`, dan perlindungan dashboard.
5. **Firestore Security Rules**: User hanya dapat membaca dan memperbarui profil miliknya sendiri (`request.auth.uid == userId`). Penghapusan dokumen dicegah (`allow delete: if false`).

---

## 📁 Struktur File & Direktori

```
/
├── index.html               # Aplikasi Utama / SPA Catalog & Checkout
├── login.html               # Halaman Masuk (Email & Google OAuth)
├── register.html            # Halaman Pendaftaran Akun
├── forgot-password.html     # Halaman Reset Kata Sandi
├── verify-email.html        # Halaman Verifikasi Email
├── dashboard.html           # Dashboard Pengguna Terproteksi
│
├── css/
│   ├── style.css            # Desain dasar, variabel CSS, tombol, alert
│   ├── auth.css             # Desain antarmuka autentikasi SaaS
│   └── dashboard.css        # Desain dashboard
│
├── js/
│   ├── firebase-config.js   # Konfigurasi & Inisialisasi Firebase modular
│   ├── auth.js              # Service autentikasi, sync Firestore, error mapping
│   ├── login.js             # Handler form login & Google Sign-In
│   ├── register.js          # Handler form register & validasi
│   ├── forgot-password.js   # Handler reset password
│   ├── verify-email.js      # Handler email verification & check
│   └── dashboard.js         # Handler dashboard & auth guard
│
├── firestore.rules          # Aturan keamanan database Firestore
└── README.md                # Dokumentasi & Panduan Setup
```

---

## 🛠️ PANDUAN KONFIGURASI FIREBASE & GOOGLE CLOUD OAUTH

Untuk memastikan fitur **Google Sign-In** dan autentikasi berjalan tanpa error `origin_mismatch`:

### 1. Checklist Firebase Console
- [ ] **Google Provider Enabled**: Masuk ke **Authentication > Sign-in method > Google**, pastikan status **Enabled** dan email dukungan proyek telah dipilih.
- [ ] **Email/Password Provider Enabled**: Masuk ke **Authentication > Sign-in method > Email/Password**, pastikan status **Enabled**.
- [ ] **Authorized Domains Benar**: Masuk ke **Authentication > Settings > Authorized domains**, tambahkan seluruh origin domain berikut:
  - `localhost`
  - `ais-dev-nzkql5nbwjiuo2xqdmoqdu-871983252203.asia-southeast1.run.app`
  - `ais-pre-nzkql5nbwjiuo2xqdmoqdu-871983252203.asia-southeast1.run.app`
  - `gen-lang-client-0645438603.firebaseapp.com`
  - Domain kustom Anda (misal: `app.atdigital.id`) jika sudah digunakan.
- [ ] **authDomain Benar**: Nilai `authDomain` di file konfigurasi client harus berupa `gen-lang-client-0645438603.firebaseapp.com` (atau domain hosting Firebase Anda).

---

### 2. Checklist Google Cloud Console (Mengatasi Error `origin_mismatch`)
Error `origin_mismatch` (Error 400) terjadi ketika origin URL browser pengakses belum didaftarkan di OAuth 2.0 Web Client.

1. Buka [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials) pada project `gen-lang-client-0645438603`.
2. Pada bagian **OAuth 2.0 Client IDs**, buka Client bertipe **Web application** (Client ID: `579181577117-d4en2kpiq4kf0e3787454nl4vb3lq84l.apps.googleusercontent.com` atau client yang digunakan Firebase Auth).
3. Di bagian **Authorized JavaScript origins**, tambahkan:
   - `http://localhost:3000` (jika aplikasi dijalankan di port 3000)
   - `http://localhost:5173` (jika aplikasi dijalankan via default Vite)
   - `https://ais-dev-nzkql5nbwjiuo2xqdmoqdu-871983252203.asia-southeast1.run.app`
   - `https://ais-pre-nzkql5nbwjiuo2xqdmoqdu-871983252203.asia-southeast1.run.app`
   - `https://gen-lang-client-0645438603.firebaseapp.com`
4. Di bagian **Authorized redirect URIs**, pastikan URI handler Firebase terdaftar:
   - `https://gen-lang-client-0645438603.firebaseapp.com/__/auth/handler`
5. Klik **Save**. (Catatan: Google Cloud membutuhkan waktu 1-5 menit untuk menyebarkan perubahan origin).

### 3. Deploy Firestore Security Rules
Pastikan aturan berikut telah diterapkan pada menu **Build > Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, update: if isOwner(userId);
      allow create: if isOwner(userId);
      allow delete: if false;

      match /transactions/{transactionId} {
        allow read, write: if isOwner(userId);
      }
      
      match /purchases/{purchaseId} {
        allow read, write: if isOwner(userId);
      }
    }

    match /transactions/{transactionId} {
      allow read, write: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🚀 Alur Kerja Autentikasi

1. **Pendaftaran (Register)**:
   - Pengguna mengisi Nama, Email, dan Password (min. 8 karakter).
   - Akun dibuat via `createUserWithEmailAndPassword()`.
   - Tautan verifikasi dikirim via `sendEmailVerification()`.
   - Dokumen profil disimpan di Firestore `users/{uid}`.
   - Pengguna diarahkan ke `verify-email.html`.

2. **Masuk (Login)**:
   - Masuk via `signInWithEmailAndPassword()` atau `loginWithGoogle()`.
   - Sistem memeriksa status `user.emailVerified`.
   - Jika belum verifikasi, diarahkan ke `verify-email.html`.
   - Jika sudah verifikasi, langsung masuk ke `dashboard.html`.

3. **Proteksi Dashboard**:
   - `requireAuth()` memantau `onAuthStateChanged(auth, ...)`.
   - Jika belum login, dialihkan otomatis ke `login.html`.
   - Logout membersihkan sesi via `signOut(auth)`.
