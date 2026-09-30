# 🚀 EduNexus Web — Professional Interactive Learning Platform

EduNexus — Telegram bot (`EduNexusBot`) arxitekturasi va funksional ketma-ketligi asosida to'liq veb platformaga moslashtirilgan zamonaviy ta'lim tizimi.

Ushbu loyiha zamonaviy Cyber-Dark va Glassmorphism dizaynida yaratilgan bo'lib, o'quvchilar va o'qituvchilar uchun qulay, interaktiv va tezkor tajribani taqdim etadi.

---

## ✨ Asosiy Xususiyatlar

### 1. 🌐 Bot Pariteti va Kirish Tizimi (Onboarding)
- **Ko'p tilli qo'llab-quvvatlash**: 🇺🇿 O'zbekcha, 🇷🇺 Русский, 🇬🇧 English.
- **Identifikatsiya**: Kirish (Login) yoki Ro'yxatdan o'tish (Register).
- **Rollarni tanlash**: 👨‍🏫 O'qituvchi (Ustoz) yoki 👨‍🎓 O'quvchi (Talaba).
- **Parol va Tasdiqlash**: Botdagi kabi telefon/foydalanuvchi ma'lumotlari orqali xavfsiz tizim.

### 2. 👨‍🏫 O'qituvchilar uchun (Teacher Studio)
- **Yangi kurs yaratish**: Bosqichma-bosqich (Wizard Stepper: Asosiy ma'lumotlar, rasm, darslar, interaktiv testlar).
- **Darslar qo'shish**: YouTube video havolalari (avtomatik embed qilinadi), matnli qo'llanmalar, fayl yuklash imkoniyatlari.
- **Interaktiv Test Yaratuvchi (Quiz Builder)**: Har bir kursga savollar, 4 ta variant va to'g'ri javobni belgilash. Test topshirish vaqti (Time limit) va o'tish foizi (Passing score).
- **Kurslarni boshqarish**: Darslar ro'yxatini tahrirlash, yangilash va o'chirish.

### 3. 👨‍🎓 O'quvchilar uchun (Student Experience)
- **Kurslar katalogi**: Toifalar (Dasturlash, Dizayn, Fanlar, Xorijiy tillar va h.k.) bo'yicha saralash.
- **Tezkor qidiruv**: Botdagi inline qidiruv kabi kurs nomi va tavsifi bo'yicha qidiruv.
- **Obuna tizimi**: Kursga bitta bosish bilan a'zo bo'lish va o'qishni boshlash.
- **Darslarni tomosha qilish**: Katta video pleyer, dars matnlari, yuklab olinadigan materiallar.
- **Kurs Testlarini Topshirish (Interactive Quiz Runner)**: 
  - Real vaqt taymeri (Countdown timer).
  - Jonli progress bari (Savol 1/N).
  - Natijalar tahlili va sertifikat/ball ko'rsatkichi.
  - Xatolarni ko'rib chiqish va qayta topshirish imkoniyati.

### 4. 🎨 Dizayn va Texnologiyalar
- **Pure Web Standards**: HTML5, Vanilla CSS3, Zamonaviy JavaScript (ES6+).
- **Dizayn uslubi**: Glassmorphism, Floating neon orbs, Micro-animations, responsive layout (Desktop, Planshet, Mobil).
- **Mahalliy ma'lumotlar (Storage)**: `localStorage` orqali to'liq saqlanadi, har bir foydalanuvchi ma'lumoti o'chib ketmaydi.
- **Toza baza**: Namunaviy kurslar yo'q, yangi kurslarni o'zingiz qo'shasiz.

---

## 📂 Fayllar Strukturasi

```bash
edunexus-web/
├── index.html        # Asosiy sahifa, Onboarding portali va Quiz modallari
├── styles.css        # Cyber-Dark & Light UI, animatsiyalar, glassmorphism
├── app.js            # Bot mantig'i, autentifikatsiya, kurslar va test tizimi
└── README.md         # Loyiha hujjatlari
```

---

## 💻 Qanday Ishga Tushiriladi

Loyihani ishga tushirish uchun hech qanday murakkab dependency kerak emas:

```bash
# Oddiy brauzerda ochish:
# index.html faylini ikki marta bosing yoki:

# Python server orqali:
python3 -m http.server 8000

# So'ng brauzeringizda quyidagi manzilga kiring:
http://localhost:8000
```

---

## 👤 Muallif

- **DevAlex7** — [GitHub Profil](https://github.com/DevAlex7)
- **Repository**: [EduNexus](https://github.com/DevAlex7/EduNexus)
