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

## 🛠️ LANGKAH YANG HARUS DILAKUKAN DI FIREBASE CONSOLE

Untuk mengaktifkan seluruh fitur autentikasi di production, pastikan pengaturan berikut telah diaktifkan di [Firebase Console](https://console.firebase.google.com/):

### 1. Aktifkan Sign-in Providers
1. Buka **Firebase Console** > Pilih Project Anda (`gen-lang-client-0645438603` atau project kustom Anda).
2. Masuk ke menu **Build > Authentication > Sign-in method**.
3. **Email/Password**:
   - Klik **Email/Password**.
   - Aktifkan toggle **Enable** pada "Email/Password".
   - Klik **Save**.
4. **Google**:
   - Klik **Google**.
   - Aktifkan toggle **Enable**.
   - Pilih "Project support email" (misalnya: email Anda).
   - Klik **Save**.

### 2. Daftarkan Domain Terotorisasi (Authorized Domains)
Agar login Google dan Firebase Auth tidak diblokir oleh browser:
1. Di **Authentication**, buka tab **Settings** > **Authorized domains**.
2. Klik **Add domain** dan tambahkan:
   - Domain preview Cloud Run / hosting Anda (misalnya: `ais-dev-nzkql5nbwjiuo2xqdmoqdu-871983252203.asia-southeast1.run.app`)
   - `localhost` (sudah ada secara default).
   - Custom domain Anda jika sudah memiliki domain sendiri.

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
