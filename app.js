/**
 * EduNexus - Modern Educational Platform
 * Direct algorithmic mapping of Telegram Bot (Python) to Interactive Web Application
 * Features:
 * - Empty fresh database (All example courses removed as requested)
 * - In-App Interactive Quiz / Test Builder for Teachers in Add Course wizard
 * - Interactive Quiz Runner for Students on the website with scoring and instant review
 * - Multi-language (UZ / RU / EN)
 * - Exact Bot Onboarding Flow (Language -> Auth choice -> Role & Register/Login -> Main Menu)
 */

// ==========================================================================
// 1. Storage Management & Clean Database
// ==========================================================================

const STORAGE_KEYS = {
  ACCOUNTS: 'edunexus_accounts_v3',
  SESSION: 'edunexus_session_v3',
  SUBSCRIPTIONS: 'edunexus_subscriptions_v3',
  COURSES: 'edunexus_courses_v3',
  LESSONS: 'edunexus_lessons_v3',
  NOTIFICATIONS: 'edunexus_notifications_v3',
  THEME: 'edunexus_theme_v3'
};

// Clean up any old sample courses from previous versions as requested
['edunexus_courses_v1', 'edunexus_courses_v2', 'edunexus_lessons_v1', 'edunexus_lessons_v2'].forEach(key => {
  localStorage.removeItem(key);
});

// Seed accounts for easy testing (Teacher & Student)
const DEFAULT_ACCOUNTS = {
  'azam_ustoz': {
    password: 'password123',
    role: "O'qituvchi",
    tg_id: 1001,
    tg_profile: '@azam_coder',
    avatar: 'A'
  },
  'dilnoza_ustoz': {
    password: 'password123',
    role: "O'qituvchi",
    tg_id: 1002,
    tg_profile: '@dilnoza_ielts',
    avatar: 'D'
  },
  'bobur_talaba': {
    password: 'password123',
    role: "O'quvchi",
    tg_id: 2001,
    tg_profile: '@bobur_student',
    avatar: 'B'
  }
};

const DEFAULT_SUBSCRIPTIONS = {
  'azam_ustoz': ['bobur_talaba'],
  'dilnoza_ustoz': ['bobur_talaba']
};

// CLEAN DATABASE: All example courses and lessons removed!
const DEFAULT_COURSES = [];
const DEFAULT_LESSONS = [];

// Persistent Stores
let accountsDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) || DEFAULT_ACCOUNTS;
let subscriptionsDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) || DEFAULT_SUBSCRIPTIONS;
let coursesDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES)) || DEFAULT_COURSES;
let lessonsDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS)) || DEFAULT_LESSONS;
let notificationsDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];

let session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION)) || {
  loggedInUser: null,
  lang: 'uz'
};

function saveState() {
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accountsDb));
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptionsDb));
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(coursesDb));
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessonsDb));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationsDb));
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

// ==========================================================================
// 2. Multilingual Internationalization (i18n)
// ==========================================================================

const TRANSLATIONS = {
  uz: {
    tagline: "Ta'lim Platformasi",
    nav_view_courses: "📚 Kurslarni ko'rish",
    nav_view_lessons: "🎬 Darslarni ko'rish",
    nav_search: "🔍 Qidiruv",
    nav_add_course: "➕ Kurs qo'shish",
    nav_add_lesson: "🎬 Dars qo'shish",
    nav_profile: "👤 Profil",
    nav_logout: "🚪 Chiqish",
    hero_badge: "Telegram Bot Algoritmi Bilan Moslashtirilgan Web Platforma",
    hero_title_1: "Ilm oling, dars bering va",
    hero_title_2: "Kelajakni birgalikda quring!",
    hero_subtitle: "EduNexus telegram bot kodi va algoritmlari asosida yaratilgan interaktiv bilim makoni. YouTube video darslari, saytda yechiladigan test topshiriqlari va o'qituvchilar obunasi.",
    search_heading: "Qidiruv Tizimi",
    search_bot_prompt: "Qidirayotgan kurs nomi, dars sarlavhasi, kalit so'z yoki o'qituvchi username'ini kiriting:",
    cat_all: "Barchasi",
    cat_it: "IT & Dasturlash",
    cat_exact: "Aniq fanlar",
    cat_languages: "Tillar",
    cat_design: "Dizayn",
    stat_courses: "Faol Kurslar",
    stat_lessons: "Video Darslar",
    stat_teachers: "Ustozlar",
    stat_students: "O'quvchilar",
    courses_heading: "Barcha Kurslar",
    courses_subheading: "Chuqurlashtirilgan video darslar, interaktiv test topshiriqlari va o'quv dasturlari",
    lessons_heading: "Barcha Video Darslar",
    lessons_subheading: "O'qituvchilar tomonidan joylangan mustaqil mavzudagi amaliy darsliklar",
    notifications_title: "Bildirishnomalar",
    clear_all: "Tozalash",
    no_notifications: "Hozircha yangi bildirishnomalar yo'q",
    add_course_title: "Yangi Kurs Qo'shish",
    add_course_desc: "Telegram botdagi kabi tartibda video darslik va saytda yechiladigan test topshiriqlarini qo'shing.",
    step_name: "Nomi",
    step_video: "Video Link",
    step_summary: "Tushuncha",
    label_course_title: "Kurs Nomi",
    hint_course_title: "Kurs mavzusini aniq va tushunarli ifodalang.",
    label_category: "Kategoriya",
    label_video_link: "YouTube Video Havolasi",
    hint_video_link: "Bot qoidasi: Faqat to'g'ri va avval qo'shilmagan YouTube havolasi qabul qilinadi.",
    label_summary: "Matnli tushuncha / Qisqacha mazmun / Key words",
    hint_summary: "O'quvchilar ushbu kursdan nimalarni o'rganishini yoritib bering.",
    confirm_publish_title: "E'lon qilishga tayyormisiz?",
    confirm_publish_desc: "Ushbu kurs chop etilgach, sizga obuna bo'lgan barcha o'quvchilarga bir zumda avtomatik bildirishnoma jo'natiladi!",
    btn_next: "Keyingisi",
    btn_back: "Orqaga",
    btn_publish_course: "Kursni Nashr Qilish",
    add_lesson_title: "Yangi Video Dars Qo'shish",
    add_lesson_desc: "2 bosqichda amaliy yoki nazariy video darsingizni joylang.",
    step_lesson_name: "Dars Nomi",
    label_lesson_title: "Dars Nomi (Sarlavhasi)",
    btn_publish_lesson: "Darsni Saqlash",
    course_summary_title: "Matnli tushuncha / Key words:",
    footer_desc: "Telegram bot algoritmi asosida moslashtirilgan interaktiv zamonaviy ta'lim veb platformasi.",
    subscribe_btn: "Obuna bo'lish",
    subscribed_btn: "Obunadasiz (Bekor qilish)",
    watch_btn: "Tomosha qilish"
  },
  ru: {
    tagline: "Образовательная Платформа",
    nav_view_courses: "📚 Просмотр курсов",
    nav_view_lessons: "🎬 Просмотр уроков",
    nav_search: "🔍 Поиск",
    nav_add_course: "➕ Добавить курс",
    nav_add_lesson: "🎬 Добавить урок",
    nav_profile: "👤 Профиль",
    nav_logout: "🚪 Выход",
    hero_badge: "Адаптированная веб-платформа по алгоритмам Telegram бота",
    hero_title_1: "Обучайтесь, преподавайте и",
    hero_title_2: "Создавайте будущее вместе!",
    hero_subtitle: "Интерактивная образовательная среда на базе кода и алгоритмов Telegram бота EduNexus. Видеоуроки YouTube, встроенные тесты и подписка на учителей.",
    search_heading: "Система Поиска",
    search_bot_prompt: "Введите название курса, урока, ключевое слово или имя преподавателя:",
    cat_all: "Все",
    cat_it: "ИТ и Программирование",
    cat_exact: "Точные науки",
    cat_languages: "Языки",
    cat_design: "Дизайн",
    stat_courses: "Активные Курсы",
    stat_lessons: "Видеоуроки",
    stat_teachers: "Преподаватели",
    stat_students: "Ученики",
    courses_heading: "Все Курсы",
    courses_subheading: "Углубленные видеоуроки, интерактивные тестовые задания и программы",
    lessons_heading: "Все Видеоуроки",
    lessons_subheading: "Практические видеоуроки, опубликованные нашими преподавателями",
    notifications_title: "Уведомления",
    clear_all: "Очистить",
    no_notifications: "Новых уведомлений пока нет",
    add_course_title: "Добавить Новый Курс",
    add_course_desc: "Опубликуйте видеокурс и встроенные тесты для проверки знаний прямо на сайте.",
    step_name: "Название",
    step_video: "Видео",
    step_summary: "Описание",
    label_course_title: "Название курса",
    hint_course_title: "Укажите четкое и понятное название курса.",
    label_category: "Категория",
    label_video_link: "Ссылка на видео YouTube",
    hint_video_link: "Правило бота: принимаются только валидные и уникальные ссылки YouTube.",
    label_summary: "Текстовое пояснение / Конспект / Key words",
    hint_summary: "Опишите, чему научатся студенты на этом курсе.",
    confirm_publish_title: "Готовы к публикации?",
    confirm_publish_desc: "После публикации всем вашим подписчикам мгновенно придет уведомление!",
    btn_next: "Далее",
    btn_back: "Назад",
    btn_publish_course: "Опубликовать Курс",
    add_lesson_title: "Добавить Новый Урок",
    add_lesson_desc: "Опубликуйте отдельный видеоурок в 2 простых шага.",
    step_lesson_name: "Название урока",
    label_lesson_title: "Название урока",
    btn_publish_lesson: "Сохранить Урок",
    course_summary_title: "Конспект / Ключевые понятия:",
    footer_desc: "Современная веб-платформа онлайн обучения на базе алгоритмов Telegram бота.",
    subscribe_btn: "Подписаться",
    subscribed_btn: "Вы подписаны (Отписаться)",
    watch_btn: "Смотреть"
  },
  en: {
    tagline: "Learning Platform",
    nav_view_courses: "📚 View Courses",
    nav_view_lessons: "🎬 View Lessons",
    nav_search: "🔍 Search",
    nav_add_course: "➕ Add Course",
    nav_add_lesson: "🎬 Add Lesson",
    nav_profile: "👤 Profile",
    nav_logout: "🚪 Log out",
    hero_badge: "Adapted Web Platform Based on Telegram Bot Algorithms",
    hero_title_1: "Learn, Teach and",
    hero_title_2: "Build the Future Together!",
    hero_subtitle: "Interactive learning platform powered by EduNexus telegram bot code and algorithms. YouTube video lessons, interactive in-app quizzes, and teacher subscriptions.",
    search_heading: "Search System",
    search_bot_prompt: "Enter course name, lesson title, keyword, or instructor username:",
    cat_all: "All",
    cat_it: "IT & Coding",
    cat_exact: "Exact Sciences",
    cat_languages: "Languages",
    cat_design: "Design",
    stat_courses: "Active Courses",
    stat_lessons: "Video Lessons",
    stat_teachers: "Instructors",
    stat_students: "Students",
    courses_heading: "All Courses",
    courses_subheading: "Comprehensive syllabus, interactive test quizzes, and full curricula",
    lessons_heading: "All Video Lessons",
    lessons_subheading: "Standalone practical video lectures uploaded by instructors",
    notifications_title: "Notifications",
    clear_all: "Clear All",
    no_notifications: "No new notifications yet",
    add_course_title: "Add New Course",
    add_course_desc: "Publish your video course and attach interactive test questions for students to solve directly on the site.",
    step_name: "Title",
    step_video: "Video Link",
    step_summary: "Summary",
    label_course_title: "Course Title",
    hint_course_title: "Provide a clear and descriptive title for your course.",
    label_category: "Category",
    label_video_link: "YouTube Video Link",
    hint_video_link: "Bot Rule: Only valid and non-duplicate YouTube links are accepted.",
    label_summary: "Summary / Notes / Keywords",
    hint_summary: "Explain what students will learn from this course.",
    confirm_publish_title: "Ready to publish?",
    confirm_publish_desc: "Once published, all your subscribers will receive an instant notification!",
    btn_next: "Next",
    btn_back: "Back",
    btn_publish_course: "Publish Course",
    add_lesson_title: "Add New Video Lesson",
    add_lesson_desc: "Publish an individual video lesson in 2 simple steps.",
    step_lesson_name: "Lesson Title",
    label_lesson_title: "Lesson Title",
    btn_publish_lesson: "Save Lesson",
    course_summary_title: "Summary / Key Words:",
    footer_desc: "Modern educational web platform powered by the EduNexus Telegram bot architecture.",
    subscribe_btn: "Subscribe",
    subscribed_btn: "Subscribed (Cancel)",
    watch_btn: "Watch"
  }
};

function getTranslation(key) {
  const currentLang = session.lang || 'uz';
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
         (TRANSLATIONS['uz'] && TRANSLATIONS['uz'][key]) || key;
}

function applyLanguage(lang) {
  session.lang = lang;
  saveState();

  const flagIcons = { uz: '🇺🇿', ru: '🇷🇺', en: '🇬🇧' };
  const labels = { uz: 'UZ', ru: 'RU', en: 'EN' };

  document.getElementById('currentLangIcon').textContent = flagIcons[lang] || '🇺🇿';
  document.getElementById('currentLangLabel').textContent = labels[lang] || 'UZ';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = getTranslation(key);
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    el.placeholder = getTranslation(key);
  });

  updatePortalTexts();
  renderApp();
}

function updatePortalTexts() {
  const lang = session.lang || 'uz';

  const authPrompt = {
    uz: `Til tanlandi: O'zbekcha 🇺🇿<br><br><strong>Davom etish uchun tanlang:</strong>`,
    ru: `Язык выбран: Русский 🇷🇺<br><br><strong>Выберите действие:</strong>`,
    en: `Language selected: English 🇬🇧<br><br><strong>Select an option:</strong>`
  };

  const regTitle = {
    uz: `📝 Ro'yxatdan o'tish (Sign Up)`,
    ru: `📝 Регистрация (Sign Up)`,
    en: `📝 Register (Sign Up)`
  };

  const loginTitle = {
    uz: `🔑 Tizimga kirish (Sign In)`,
    ru: `🔑 Вход (Sign In)`,
    en: `🔑 Login (Sign In)`
  };

  const regPrompt = {
    uz: `<strong>Rolingizni tanlang:</strong>`,
    ru: `<strong>Выберите вашу роль:</strong>`,
    en: `<strong>Select your role:</strong>`
  };

  const loginPrompt = {
    uz: `<strong>Botdagi username'ingizni kiriting:</strong>`,
    ru: `<strong>Введите ваш username в боте:</strong>`,
    en: `<strong>Enter your bot username:</strong>`
  };

  document.getElementById('pAuthChoicePrompt').innerHTML = authPrompt[lang] || authPrompt['uz'];
  document.getElementById('pRegisterTitle').textContent = regTitle[lang] || regTitle['uz'];
  document.getElementById('pLoginTitle').textContent = loginTitle[lang] || loginTitle['uz'];
  document.getElementById('pRegPrompt').innerHTML = regPrompt[lang] || regPrompt['uz'];
  document.getElementById('pLoginPrompt').innerHTML = loginPrompt[lang] || loginPrompt['uz'];
}

// ==========================================================================
// 3. Helper & Validation Functions (Matching EduNexusbot.txt)
// ==========================================================================

function extractYouTubeId(url) {
  if (!url) return null;
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

function isDuplicateLink(url) {
  const newVideoId = extractYouTubeId(url);
  if (!newVideoId) return false;

  for (const course of coursesDb) {
    if (extractYouTubeId(course.link) === newVideoId) return true;
  }
  for (const lesson of lessonsDb) {
    if (extractYouTubeId(lesson.link) === newVideoId) return true;
  }
  return false;
}

function notifySubscribers(teacherUsername, title, isCourse) {
  const subscribers = subscriptionsDb[teacherUsername] || [];
  if (subscribers.length === 0) return;

  const teacher = accountsDb[teacherUsername];
  const teacherTg = teacher ? teacher.tg_profile : `@${teacherUsername}`;
  const contentType = isCourse ? 'yangi kurs va test topshiriqlari' : 'yangi dars';

  const notifObj = {
    id: Date.now() + Math.random(),
    teacherUsername,
    teacherTg,
    title,
    contentType,
    timestamp: new Date().toISOString(),
    read: false
  };

  notificationsDb.unshift(notifObj);
  saveState();

  if (session.loggedInUser && subscribers.includes(session.loggedInUser)) {
    showToast(
      `🔔 ${teacherUsername} (${teacherTg})`,
      `${contentType.toUpperCase()}: ${title}`,
      'info'
    );
  }

  updateNotificationBadge();
  renderNotificationsList();
}

function toggleSubscription(teacherUsername) {
  if (!session.loggedInUser) {
    openPortalStep('pStepAuthChoice');
    showToast("Eslatma", "Obuna bo'lish uchun avval tizimga kiring!", "info");
    return;
  }

  if (session.loggedInUser === teacherUsername) {
    showToast("Ogohlantirish", "O'zingizga obuna bo'la olmaysiz!", "error");
    return;
  }

  if (!subscriptionsDb[teacherUsername]) {
    subscriptionsDb[teacherUsername] = [];
  }

  const index = subscriptionsDb[teacherUsername].indexOf(session.loggedInUser);
  const teacher = accountsDb[teacherUsername];
  const teacherTg = teacher ? teacher.tg_profile : `@${teacherUsername}`;

  if (index > -1) {
    subscriptionsDb[teacherUsername].splice(index, 1);
    saveState();
    showToast("❌ EduNexus", `${teacherUsername} (${teacherTg}) dan obuna bekor qilindi.`, "info");
  } else {
    subscriptionsDb[teacherUsername].push(session.loggedInUser);
    saveState();
    showToast("✅ EduNexus", `${teacherUsername} (${teacherTg}) ga muvaffaqiyatli obuna bo'ldingiz!`, "success");
  }

  renderApp();
}

function isSubscribedTo(teacherUsername) {
  if (!session.loggedInUser) return false;
  return (subscriptionsDb[teacherUsername] || []).includes(session.loggedInUser);
}

// ==========================================================================
// 4. Portal Onboarding Flow (Exact Bot Sequence)
// ==========================================================================

function openPortalStep(stepId) {
  const portal = document.getElementById('botWelcomePortal');
  portal.classList.add('active');

  portal.querySelectorAll('.portal-step').forEach(step => {
    step.classList.remove('active');
  });

  const activeStep = document.getElementById(stepId);
  if (activeStep) {
    activeStep.classList.add('active');
  }
}

function closePortal() {
  const portal = document.getElementById('botWelcomePortal');
  portal.classList.remove('active');
}

function initOnboardingPortal() {
  document.querySelectorAll('.lang-card').forEach(card => {
    card.addEventListener('click', () => {
      const selectedLang = card.getAttribute('data-set-lang');
      applyLanguage(selectedLang);
      openPortalStep('pStepAuthChoice');
    });
  });

  document.getElementById('btnChooseRegister').addEventListener('click', () => {
    openPortalStep('pStepRegister');
  });

  document.getElementById('btnChooseLogin').addEventListener('click', () => {
    openPortalStep('pStepLogin');
  });

  document.getElementById('btnBackToLang').addEventListener('click', () => {
    openPortalStep('pStepLang');
  });

  document.getElementById('btnBackToAuthChoiceFromReg').addEventListener('click', () => {
    openPortalStep('pStepAuthChoice');
  });

  document.getElementById('btnBackToAuthChoiceFromLogin').addEventListener('click', () => {
    openPortalStep('pStepAuthChoice');
  });

  document.querySelectorAll('#pStepRegister .role-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#pStepRegister .role-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  document.getElementById('pDemoTeacherBtn').addEventListener('click', () => {
    document.getElementById('pLoginUsername').value = 'azam_ustoz';
    document.getElementById('pLoginPassword').value = 'password123';
  });

  document.getElementById('pDemoStudentBtn').addEventListener('click', () => {
    document.getElementById('pLoginUsername').value = 'bobur_talaba';
    document.getElementById('pLoginPassword').value = 'password123';
  });

  document.getElementById('portalRegisterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const role = document.querySelector('input[name="pRegRole"]:checked').value;
    const username = document.getElementById('pRegUsername').value.trim();
    const tgProfile = document.getElementById('pRegTgProfile').value.trim();
    const password = document.getElementById('pRegPassword').value.trim();

    const usernameRegex = /^[A-Za-z0-9_]{3,32}$/;
    if (!usernameRegex.test(username)) {
      showToast("❌ Xatolik", "Username 3-32 ta belgi (harf, raqam yoki pastki chiziq) dan iborat bo'lishi shart!", "error");
      return;
    }

    if (accountsDb[username]) {
      showToast("❌ Username band", "Bu username allaqachon mavjud! Boshqa username kiriting.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("❌ Xavfsizlik", "Parol kamida 6 ta belgidan iborat bo'lishi kerak!", "error");
      return;
    }

    const formattedTg = tgProfile.startsWith('@') ? tgProfile : `@${tgProfile}`;

    accountsDb[username] = {
      password,
      role,
      tg_id: Date.now(),
      tg_profile: formattedTg,
      avatar: username[0].toUpperCase()
    };

    session.loggedInUser = username;
    saveState();
    closePortal();

    showToast("🎉 Muvaffaqiyatli ro'yxatdan o'tdingiz!", `👤 Bot Username: ${username}\n📌 Rolingiz: ${role}`, "success");
    renderApp();
  });

  document.getElementById('portalLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('pLoginUsername').value.trim();
    const password = document.getElementById('pLoginPassword').value.trim();

    if (!accountsDb[username]) {
      showToast("❌ Username topilmadi!", "Username bazada mavjud emas! Qayta kiriting yoki ro'yxatdan o'ting.", "error");
      return;
    }

    if (accountsDb[username].password !== password) {
      showToast("❌ Parol noto'g'ri!", "Kiritilgan parol xato! Qayta urinib ko'ring.", "error");
      return;
    }

    session.loggedInUser = username;
    saveState();
    closePortal();

    const role = accountsDb[username].role;
    showToast("✅ Xush kelibsiz!", `${username}! Rolingiz: ${role}`, "success");
    renderApp();
  });
}

// ==========================================================================
// 5. Main UI & Navigation Engine
// ==========================================================================

let activeTab = 'courses';
let activeCategory = 'all';
let searchCategoryMode = 'courses';

function renderApp() {
  updateNavState();
  updateAuthWidget();
  updateStats();
  renderCoursesList();
  renderLessonsList();
  renderProfile();
  updateNotificationBadge();
  renderNotificationsList();
}

function updateNavState() {
  const currentUser = accountsDb[session.loggedInUser];
  const isTeacher = currentUser && currentUser.role === "O'qituvchi";
  const isLoggedIn = !!currentUser;

  document.querySelectorAll('.teacher-only').forEach(el => {
    el.style.display = isTeacher ? 'inline-flex' : 'none';
  });

  document.querySelectorAll('.auth-only').forEach(el => {
    el.style.display = isLoggedIn ? 'inline-flex' : 'none';
  });

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === activeTab);
  });

  const paneMap = {
    'courses': 'paneCourses',
    'lessons': 'paneLessons',
    'search': 'paneSearch',
    'add-course': 'paneAddCourse',
    'add-lesson': 'paneAddLesson',
    'profile': 'paneProfile'
  };

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePaneId = paneMap[activeTab] || 'paneCourses';
  const activePane = document.getElementById(activePaneId);
  if (activePane) activePane.classList.add('active');

  const heroBadge = document.getElementById('heroWelcomeUserBadge');
  if (currentUser) {
    heroBadge.textContent = `${currentUser.role}: ${session.loggedInUser} (${currentUser.tg_profile})`;
  } else {
    heroBadge.textContent = getTranslation('hero_badge');
  }
}

function updateAuthWidget() {
  const container = document.getElementById('authWidget');
  const currentUser = accountsDb[session.loggedInUser];

  if (currentUser) {
    const roleName = currentUser.role === "O'qituvchi" ? "Ustoz" : "O'quvchi";
    container.innerHTML = `
      <div class="user-badge" id="currentUserBadge" title="${currentUser.tg_profile}">
        <div class="user-avatar">${currentUser.avatar || currentUser.role[0]}</div>
        <div class="user-info-text">
          <span class="user-display-name">${session.loggedInUser}</span>
          <span class="user-role-tag">${roleName}</span>
        </div>
      </div>
      <button class="logout-btn" id="logoutBtn" title="Chiqish (Logout)">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>${getTranslation('nav_logout')}</span>
      </button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('currentUserBadge').addEventListener('click', () => switchTab('profile'));
  } else {
    container.innerHTML = `
      <button class="primary-btn glow-btn" id="portalOpenBtn" style="padding: 0.5rem 1.15rem; font-size: 0.88rem;">
        <i class="fa-solid fa-right-to-bracket"></i>
        <span>Kirish / Ro'yxatdan o'tish</span>
      </button>
    `;
    document.getElementById('portalOpenBtn').addEventListener('click', () => openPortalStep('pStepLang'));
  }
}

function updateStats() {
  document.getElementById('statCoursesCount').textContent = coursesDb.length;
  document.getElementById('statLessonsCount').textContent = lessonsDb.length;
  
  const teachersCount = Object.values(accountsDb).filter(a => a.role === "O'qituvchi").length;
  const studentsCount = Object.values(accountsDb).filter(a => a.role === "O'quvchi").length;

  document.getElementById('statTeachersCount').textContent = teachersCount;
  document.getElementById('statStudentsCount').textContent = studentsCount;

  document.getElementById('coursesCountBadge').textContent = `${coursesDb.length} ta kurs`;
  document.getElementById('lessonsCountBadge').textContent = `${lessonsDb.length} ta dars`;
}

function renderCoursesList() {
  const grid = document.getElementById('coursesGrid');
  const currentUser = accountsDb[session.loggedInUser];
  const isTeacher = currentUser && currentUser.role === "O'qituvchi";

  const courses = activeCategory === 'all' 
    ? coursesDb 
    : coursesDb.filter(c => c.category === activeCategory);

  // If clean empty database
  if (courses.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-graduation-cap"></i>
        <h3>Hozircha birorta kurs mavjud emas</h3>
        <p>Barcha namuna kurslar o'chirildi. O'qituvchi sifatida birinchi video darslik va saytda yechiladigan test topshiriqlarini qo'shing!</p>
        ${isTeacher ? `
          <button class="primary-btn glow-btn" style="margin-top: 1.5rem;" onclick="switchTab('add-course')">
            <i class="fa-solid fa-circle-plus"></i>
            <span>Yangi Kurs va Test Qo'shish</span>
          </button>
        ` : `
          <p style="margin-top: 1rem; color: var(--accent-cyan); font-weight: 600;">O'qituvchilar tez orada yangi kurs va testlarni joylaydi.</p>
        `}
      </div>
    `;
    return;
  }

  grid.innerHTML = courses.map(course => {
    const videoId = extractYouTubeId(course.link) || 'dQw4w9WgXcQ';
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const isSubbed = isSubscribedTo(course.author);
    const subLabel = isSubbed ? getTranslation('subscribed_btn') : getTranslation('subscribe_btn');
    const subClass = isSubbed ? 'subscribed' : '';
    const authorAcc = accountsDb[course.author] || { avatar: course.author[0].toUpperCase() };
    const quizCount = (course.quiz && course.quiz.length) || 0;

    return `
      <article class="card-item" data-course-id="${course.id}">
        <div class="card-media" onclick="openVideoPlayer(${course.id}, 'course')">
          <img class="card-thumb-img" src="${thumbUrl}" alt="${escapeHtml(course.title)}" loading="lazy">
          <div class="card-badges-top">
            <span class="badge-tag ${course.category}">${course.category}</span>
            <span class="badge-tag" style="background: rgba(16, 185, 129, 0.9);"><i class="fa-solid fa-list-check"></i> ${quizCount} ta test</span>
          </div>
          <div class="card-play-overlay">
            <div class="play-circle"><i class="fa-solid fa-play"></i></div>
          </div>
        </div>

        <div class="card-body">
          <div class="card-instructor-row">
            <div class="instructor-info">
              <div class="instructor-avatar">${authorAcc.avatar || 'U'}</div>
              <div class="instructor-text">
                <span class="instructor-name">
                  ${escapeHtml(course.author)}
                  <i class="fa-solid fa-circle-check" style="color: #38bdf8; font-size: 0.75rem;"></i>
                </span>
                <span class="instructor-tg">${escapeHtml(course.tg_profile)}</span>
              </div>
            </div>
            
            <button class="sub-toggle-btn ${subClass}" onclick="toggleSubscription('${escapeHtml(course.author)}')">
              <i class="fa-solid ${isSubbed ? 'fa-bell-slash' : 'fa-bell'}"></i>
              <span>${subLabel}</span>
            </button>
          </div>

          <h3 class="card-title" onclick="openVideoPlayer(${course.id}, 'course')">
            ${escapeHtml(course.title)}
          </h3>

          <p class="card-summary-snippet">
            ${escapeHtml(course.summary)}
          </p>

          <div class="card-footer">
            <button class="secondary-btn" style="padding: 0.5rem 0.9rem; font-size: 0.82rem;" onclick="openVideoPlayer(${course.id}, 'course')">
              <i class="fa-solid fa-play"></i>
              <span>${getTranslation('watch_btn')}</span>
            </button>
            <button class="primary-btn glow-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="openQuizModal(${course.id})">
              <i class="fa-solid fa-list-check"></i>
              <span>🎯 Testni ishlash (${quizCount})</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderLessonsList() {
  const grid = document.getElementById('lessonsGrid');
  const currentUser = accountsDb[session.loggedInUser];
  const isTeacher = currentUser && currentUser.role === "O'qituvchi";
  const lessons = lessonsDb;

  if (lessons.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-film"></i>
        <h3>Hozircha birorta alohida dars mavjud emas</h3>
        <p>Barcha namuna darslar o'chirildi. O'qituvchi sifatida yangi amaliy dars yuklashingiz mumkin.</p>
        ${isTeacher ? `
          <button class="primary-btn glow-btn" style="margin-top: 1.5rem;" onclick="switchTab('add-lesson')">
            <i class="fa-solid fa-video"></i>
            <span>Yangi Dars Qo'shish</span>
          </button>
        ` : ''}
      </div>
    `;
    return;
  }

  grid.innerHTML = lessons.map(lesson => {
    const videoId = extractYouTubeId(lesson.link) || 'dQw4w9WgXcQ';
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const isSubbed = isSubscribedTo(lesson.author);
    const subLabel = isSubbed ? getTranslation('subscribed_btn') : getTranslation('subscribe_btn');
    const subClass = isSubbed ? 'subscribed' : '';
    const authorAcc = accountsDb[lesson.author] || { avatar: lesson.author[0].toUpperCase() };

    return `
      <article class="card-item" data-lesson-id="${lesson.id}">
        <div class="card-media" onclick="openVideoPlayer(${lesson.id}, 'lesson')">
          <img class="card-thumb-img" src="${thumbUrl}" alt="${escapeHtml(lesson.title)}" loading="lazy">
          <div class="card-badges-top">
            <span class="badge-tag ${lesson.category}">${lesson.category}</span>
            <span class="badge-tag"><i class="fa-solid fa-video"></i> Video</span>
          </div>
          <div class="card-play-overlay">
            <div class="play-circle"><i class="fa-solid fa-play"></i></div>
          </div>
        </div>

        <div class="card-body">
          <div class="card-instructor-row">
            <div class="instructor-info">
              <div class="instructor-avatar">${authorAcc.avatar || 'U'}</div>
              <div class="instructor-text">
                <span class="instructor-name">${escapeHtml(lesson.author)}</span>
                <span class="instructor-tg">${escapeHtml(lesson.tg_profile)}</span>
              </div>
            </div>

            <button class="sub-toggle-btn ${subClass}" onclick="toggleSubscription('${escapeHtml(lesson.author)}')">
              <i class="fa-solid ${isSubbed ? 'fa-bell-slash' : 'fa-bell'}"></i>
              <span>${subLabel}</span>
            </button>
          </div>

          <h3 class="card-title" onclick="openVideoPlayer(${lesson.id}, 'lesson')">
            ${escapeHtml(lesson.title)}
          </h3>

          <div class="card-footer" style="margin-top: 1rem;">
            <button class="primary-btn glow-btn full-width" onclick="openVideoPlayer(${lesson.id}, 'lesson')">
              <i class="fa-solid fa-circle-play"></i>
              <span>${getTranslation('watch_btn')}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================================================
// 6. Dedicated Bot Search Engine
// ==========================================================================

function initSearchEngine() {
  const searchInput = document.getElementById('dedicatedSearchInput');
  const clearBtn = document.getElementById('clearDedicatedSearchBtn');
  const searchBtn = document.getElementById('btnDedicatedSearch');
  const modeCoursesBtn = document.getElementById('searchModeCourses');
  const modeLessonsBtn = document.getElementById('searchModeLessons');

  modeCoursesBtn.addEventListener('click', () => {
    modeCoursesBtn.classList.add('active');
    modeLessonsBtn.classList.remove('active');
    searchCategoryMode = 'courses';
    performSearch();
  });

  modeLessonsBtn.addEventListener('click', () => {
    modeLessonsBtn.classList.add('active');
    modeCoursesBtn.classList.remove('active');
    searchCategoryMode = 'lessons';
    performSearch();
  });

  searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'inline-block' : 'none';
    performSearch();
  });

  searchBtn.addEventListener('click', performSearch);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    performSearch();
  });
}

function performSearch() {
  const query = document.getElementById('dedicatedSearchInput').value.trim().toLowerCase();
  const resultsArea = document.getElementById('searchResultsArea');

  if (!query) {
    resultsArea.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-keyboard"></i>
        <h3>Qidiruv so'zini kiriting</h3>
        <p>Yuqoridagi maydonga kalit so'z yozing va Telegram bot formatidagi natijalarni ko'ring.</p>
      </div>
    `;
    return;
  }

  if (searchCategoryMode === 'courses') {
    const results = coursesDb.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.summary.toLowerCase().includes(query) ||
      course.author.toLowerCase().includes(query) ||
      course.tg_profile.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      resultsArea.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-exclamation"></i>
          <h3>'${escapeHtml(query)}' bo'yicha hech qanday kurs topilmadi.</h3>
        </div>
      `;
      return;
    }

    resultsArea.innerHTML = `
      <div style="margin-bottom: 1.25rem; font-weight: 700; color: var(--text-muted);">
        🔍 Qidiruv natijalari (${results.length} ta kurs topildi):
      </div>
      ${results.map((course, idx) => {
        const isSubbed = isSubscribedTo(course.author);
        const quizCount = (course.quiz && course.quiz.length) || 0;
        return `
          <div class="bot-result-card">
            <div class="bot-result-header">📚 Kurs #${idx + 1}: ${escapeHtml(course.title)}</div>
            <div class="bot-result-row">👨‍🏫 <strong>O'qituvchi (Bot Username):</strong> <code>${escapeHtml(course.author)}</code></div>
            <div class="bot-result-row">💬 <strong>O'qituvchi (Telegram):</strong> ${escapeHtml(course.tg_profile)}</div>
            <div class="bot-result-row">🎬 <strong>Video darslik:</strong> <a href="javascript:void(0)" onclick="openVideoPlayer(${course.id}, 'course')" style="color: #38bdf8; text-decoration: underline;">Darsni tomosha qilish ▶️</a></div>
            <div class="bot-result-row">📖 <strong>Matnli tushuncha / Key words:</strong><br>${escapeHtml(course.summary)}</div>
            <div class="bot-result-row">🎯 <strong>Saytdagi Test topshiriqlari:</strong> <strong>${quizCount} ta test savoli mavjud</strong></div>
            <div class="bot-result-actions">
              <button class="primary-btn glow-btn" onclick="openQuizModal(${course.id})">
                <i class="fa-solid fa-list-check"></i> Testni saytda yechish (${quizCount})
              </button>
              <button class="secondary-btn" onclick="openVideoPlayer(${course.id}, 'course')">
                <i class="fa-solid fa-play"></i> Video dars
              </button>
              <button class="sub-toggle-btn ${isSubbed ? 'subscribed' : ''}" onclick="toggleSubscription('${escapeHtml(course.author)}')">
                <i class="fa-solid ${isSubbed ? 'fa-bell-slash' : 'fa-bell'}"></i>
                <span>${isSubbed ? '❌ Obunani bekor qilish' : '🔔 Obuna bo\'lish'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    `;
  } else {
    const results = lessonsDb.filter(lesson => 
      lesson.title.toLowerCase().includes(query) ||
      lesson.author.toLowerCase().includes(query) ||
      lesson.tg_profile.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      resultsArea.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-exclamation"></i>
          <h3>'${escapeHtml(query)}' bo'yicha hech qanday dars topilmadi.</h3>
        </div>
      `;
      return;
    }

    resultsArea.innerHTML = `
      <div style="margin-bottom: 1.25rem; font-weight: 700; color: var(--text-muted);">
        🎬 Qidiruv natijalari (${results.length} ta dars topildi):
      </div>
      ${results.map((lesson, idx) => {
        const isSubbed = isSubscribedTo(lesson.author);
        return `
          <div class="bot-result-card">
            <div class="bot-result-header">🎬 Dars #${idx + 1}: ${escapeHtml(lesson.title)}</div>
            <div class="bot-result-row">👨‍🏫 <strong>O'qituvchi (Bot Username):</strong> <code>${escapeHtml(lesson.author)}</code></div>
            <div class="bot-result-row">💬 <strong>O'qituvchi (Telegram):</strong> ${escapeHtml(lesson.tg_profile)}</div>
            <div class="bot-result-row">🎬 <strong>Video dars:</strong> <a href="javascript:void(0)" onclick="openVideoPlayer(${lesson.id}, 'lesson')" style="color: #38bdf8; text-decoration: underline;">Videoni ko'rish ▶️</a></div>
            <div class="bot-result-actions">
              <button class="primary-btn" onclick="openVideoPlayer(${lesson.id}, 'lesson')">
                <i class="fa-solid fa-play"></i> Tomosha qilish
              </button>
              <button class="sub-toggle-btn ${isSubbed ? 'subscribed' : ''}" onclick="toggleSubscription('${escapeHtml(lesson.author)}')">
                <i class="fa-solid ${isSubbed ? 'fa-bell-slash' : 'fa-bell'}"></i>
                <span>${isSubbed ? '❌ Obunani bekor qilish' : '🔔 Obuna bo\'lish'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    `;
  }
}

// ==========================================================================
// 7. INTERACTIVE QUIZ RUNNER (Students solve tests on the website!)
// ==========================================================================

let activeQuiz = {
  course: null,
  currentIndex: 0,
  userAnswers: {},
  isFinished: false
};

function openQuizModal(courseId) {
  const course = coursesDb.find(c => c.id === courseId);
  if (!course) return;

  if (!course.quiz || course.quiz.length === 0) {
    showToast("Eslatma", "Ushbu kursda hali test topshiriqlari mavjud emas. O'qituvchi tez orada savollar qo'shadi.", "info");
    return;
  }

  activeQuiz = {
    course,
    currentIndex: 0,
    userAnswers: {},
    isFinished: false
  };

  document.getElementById('quizModalCourseTitle').textContent = course.title;
  document.getElementById('quizCourseBadge').textContent = course.category.toUpperCase();
  document.getElementById('quizActiveView').style.display = 'block';
  document.getElementById('quizResultView').style.display = 'none';

  renderCurrentQuizQuestion();
  document.getElementById('quizModal').classList.add('open');
}

function closeQuizModal() {
  document.getElementById('quizModal').classList.remove('open');
}

function renderCurrentQuizQuestion() {
  const { course, currentIndex, userAnswers } = activeQuiz;
  const questions = course.quiz;
  const currentQ = questions[currentIndex];

  const total = questions.length;
  const trackerText = `Savol ${currentIndex + 1} / ${total}`;
  document.getElementById('quizQuestionTracker').textContent = trackerText;
  document.getElementById('quizCurrentNum').textContent = `${currentIndex + 1}-Savol:`;
  document.getElementById('quizQuestionText').textContent = currentQ.question;

  // Progress Bar percentage
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);
  document.getElementById('quizProgressBar').style.width = `${progressPercent}%`;

  // Options list
  const optionsList = document.getElementById('quizOptionsList');
  const selectedOpt = userAnswers[currentIndex];

  const letters = ['A', 'B', 'C', 'D'];
  optionsList.innerHTML = currentQ.options.map((optText, optIdx) => {
    const isSelected = selectedOpt === optIdx;
    return `
      <div class="quiz-option-card ${isSelected ? 'selected' : ''}" onclick="selectQuizOption(${optIdx})">
        <div class="quiz-opt-marker">${letters[optIdx]}</div>
        <div class="quiz-opt-text">${escapeHtml(optText)}</div>
      </div>
    `;
  }).join('');

  // Previous button visibility
  const prevBtn = document.getElementById('btnQuizPrev');
  prevBtn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';

  // Next / Finish button label
  const nextBtn = document.getElementById('btnQuizNext');
  if (currentIndex === total - 1) {
    nextBtn.innerHTML = `<span>Testni Yakunlash</span> <i class="fa-solid fa-circle-check"></i>`;
  } else {
    nextBtn.innerHTML = `<span>Keyingisi</span> <i class="fa-solid fa-arrow-right"></i>`;
  }
}

function selectQuizOption(optIdx) {
  activeQuiz.userAnswers[activeQuiz.currentIndex] = optIdx;
  renderCurrentQuizQuestion();
}

function nextQuizQuestion() {
  const { course, currentIndex, userAnswers } = activeQuiz;
  if (userAnswers[currentIndex] === undefined) {
    showToast("Eslatma", "Iltimos, davom etishdan oldin variantlardan birini tanlang!", "info");
    return;
  }

  if (currentIndex < course.quiz.length - 1) {
    activeQuiz.currentIndex += 1;
    renderCurrentQuizQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuizQuestion() {
  if (activeQuiz.currentIndex > 0) {
    activeQuiz.currentIndex -= 1;
    renderCurrentQuizQuestion();
  }
}

function finishQuiz() {
  const { course, userAnswers } = activeQuiz;
  const questions = course.quiz;
  let correctCount = 0;

  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctIndex) {
      correctCount += 1;
    }
  });

  const percent = Math.round((correctCount / questions.length) * 100);

  document.getElementById('quizActiveView').style.display = 'none';
  document.getElementById('quizResultView').style.display = 'block';

  document.getElementById('quizScorePercent').textContent = `${percent}%`;
  document.getElementById('quizScoreFraction').textContent = `${correctCount} / ${questions.length} to'g'ri`;

  const circle = document.getElementById('quizScoreCircle');
  const title = document.getElementById('quizResultTitle');
  const desc = document.getElementById('quizResultDesc');

  if (percent >= 80) {
    circle.style.borderColor = 'var(--accent-emerald)';
    title.textContent = "Ajoyib natija! 🏆";
    desc.textContent = "Siz ushbu kurs mavzularini va test topshiriqlarini yuqori darajada o'zlashtirdingiz!";
  } else if (percent >= 50) {
    circle.style.borderColor = 'var(--accent-cyan)';
    title.textContent = "Yaxshi natija! 🎯";
    desc.textContent = "Test savollarining aksariyatiga to'g'ri javob berdingiz. Yana ham yaxshiroq natija uchun darsni qayta ko'rib chiqishingiz mumkin.";
  } else {
    circle.style.borderColor = 'var(--accent-amber)';
    title.textContent = "Mavzuni takrorlang! 📚";
    desc.textContent = "Test savollarida xatolar mavjud. Video darslikni diqqat bilan ko'rib, testni qaytadan yechishni tavsiya qilamiz.";
  }

  // Render question-by-question review
  const letters = ['A', 'B', 'C', 'D'];
  const reviewContainer = document.getElementById('quizReviewContainer');
  reviewContainer.innerHTML = questions.map((q, idx) => {
    const studentChoice = userAnswers[idx];
    const isCorrect = studentChoice === q.correctIndex;
    const studentText = studentChoice !== undefined ? `${letters[studentChoice]}) ${q.options[studentChoice]}` : "Javob berilmadi";
    const correctText = `${letters[q.correctIndex]}) ${q.options[q.correctIndex]}`;

    return `
      <div class="quiz-review-item ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="review-q-title">${idx + 1}. ${escapeHtml(q.question)}</div>
        <div class="review-answers">
          <span class="your-pick">Sizning javobingiz: <strong>${escapeHtml(studentText)}</strong></span>
          ${!isCorrect ? `<span class="correct-ans">To'g'ri javob: <strong>${escapeHtml(correctText)}</strong></span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  showToast("🎉 Test Yakunlandi!", `Sizning natijangiz: ${correctCount}/${questions.length} (${percent}%)`, "success");
}

function retakeQuiz() {
  activeQuiz.currentIndex = 0;
  activeQuiz.userAnswers = {};
  document.getElementById('quizResultView').style.display = 'none';
  document.getElementById('quizActiveView').style.display = 'block';
  renderCurrentQuizQuestion();
}

// ==========================================================================
// 8. Multi-step Course Wizard with Quiz Builder
// ==========================================================================

let courseWizard = {
  step: 1,
  title: '',
  category: 'it',
  link: '',
  summary: '',
  tasks: '',
  quiz: [] // Added test questions
};

function updateCourseWizardUI() {
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`cStep${i}`);
    const lineEl = document.getElementById(`cLine${i}`);
    if (stepEl) {
      stepEl.classList.toggle('active', i === courseWizard.step);
      stepEl.classList.toggle('completed', i < courseWizard.step);
    }
    if (lineEl) {
      lineEl.classList.toggle('active', i < courseWizard.step);
    }
    const stageEl = document.getElementById(`cStage${i}`);
    if (stageEl) {
      stageEl.classList.toggle('active', i === courseWizard.step);
    }
  }
}

function renderCourseWizardQuizList() {
  const container = document.getElementById('builderQuizList');
  const countBadge = document.getElementById('builderQuestionsCountBadge');
  countBadge.textContent = `${courseWizard.quiz.length} ta savol qo'shildi`;

  if (courseWizard.quiz.length === 0) {
    container.innerHTML = `
      <div class="empty-state-sm" style="text-align: center; padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
        <i class="fa-solid fa-clipboard-question" style="font-size: 2rem; color: var(--text-dim); margin-bottom: 0.5rem;"></i>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Hozircha birorta savol qo'shilmadi. Quyidagi forma orqali test savollarini kiriting.</p>
      </div>
    `;
    return;
  }

  const letters = ['A', 'B', 'C', 'D'];
  container.innerHTML = courseWizard.quiz.map((q, idx) => `
    <div class="quiz-added-item">
      <div class="quiz-item-content">
        <div class="quiz-item-title">${idx + 1}-Savol: ${escapeHtml(q.question)}</div>
        <div class="quiz-item-correct-badge">
          <i class="fa-solid fa-circle-check"></i> To'g'ri javob: ${letters[q.correctIndex]}) ${escapeHtml(q.options[q.correctIndex])}
        </div>
      </div>
      <button type="button" class="quiz-item-del-btn" onclick="removeQuestionFromCourseWizard(${idx})" title="Savolni o'chirish">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

function removeQuestionFromCourseWizard(index) {
  courseWizard.quiz.splice(index, 1);
  renderCourseWizardQuizList();
}

function initCourseWizard() {
  const titleInput = document.getElementById('courseTitleInput');
  const categorySelect = document.getElementById('courseCategorySelect');
  const videoInput = document.getElementById('courseVideoInput');
  const summaryInput = document.getElementById('courseSummaryInput');
  const tasksInput = document.getElementById('courseTasksInput');
  const previewBox = document.getElementById('courseVideoPreviewBox');
  const previewThumb = document.getElementById('coursePreviewThumb');
  const previewId = document.getElementById('coursePreviewId');

  document.getElementById('courseNextTo2').addEventListener('click', () => {
    const title = titleInput.value.trim();
    if (!title) {
      showToast("Xatolik", "Iltimos, kurs nomini kiriting!", "error");
      titleInput.focus();
      return;
    }
    courseWizard.title = title;
    courseWizard.category = categorySelect.value;
    courseWizard.step = 2;
    updateCourseWizardUI();
  });

  document.getElementById('courseBackTo1').addEventListener('click', () => {
    courseWizard.step = 1;
    updateCourseWizardUI();
  });

  videoInput.addEventListener('input', () => {
    const url = videoInput.value.trim();
    const vidId = extractYouTubeId(url);
    if (vidId) {
      previewBox.style.display = 'flex';
      previewThumb.src = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      previewId.textContent = `YouTube Video ID: ${vidId}`;
    } else {
      previewBox.style.display = 'none';
    }
  });

  document.getElementById('courseNextTo3').addEventListener('click', () => {
    const url = videoInput.value.trim();
    if (!isValidYouTubeUrl(url)) {
      showToast("❌ Noto'g'ri havola!", "Iltimos, haqiqiy YouTube havolasini kiriting.", "error");
      videoInput.focus();
      return;
    }
    if (isDuplicateLink(url)) {
      showToast("⚠️ Takroriy havola!", "Bu video havola allaqachon bazaga qo'shilgan!", "error");
      videoInput.focus();
      return;
    }
    courseWizard.link = url;
    courseWizard.step = 3;
    updateCourseWizardUI();
  });

  document.getElementById('courseBackTo2').addEventListener('click', () => {
    courseWizard.step = 2;
    updateCourseWizardUI();
  });

  document.getElementById('courseNextTo4').addEventListener('click', () => {
    const summary = summaryInput.value.trim();
    if (!summary || summary.length < 10) {
      showToast("Xatolik", "Matnli tushuncha kamida 10 ta belgidan iborat bo'lishi kerak.", "error");
      summaryInput.focus();
      return;
    }
    courseWizard.summary = summary;
    courseWizard.step = 4;
    updateCourseWizardUI();
  });

  document.getElementById('courseBackTo3').addEventListener('click', () => {
    courseWizard.step = 3;
    updateCourseWizardUI();
  });

  // Adding test question into the quiz builder
  document.getElementById('btnAddQuestionToQuiz').addEventListener('click', () => {
    const qText = document.getElementById('qInputQuestion').value.trim();
    const opt0 = document.getElementById('qInputOpt0').value.trim();
    const opt1 = document.getElementById('qInputOpt1').value.trim();
    const opt2 = document.getElementById('qInputOpt2').value.trim();
    const opt3 = document.getElementById('qInputOpt3').value.trim();
    const correctIdx = parseInt(document.querySelector('input[name="qCorrectRadio"]:checked').value, 10);

    if (!qText) {
      showToast("Xatolik", "Iltimos, savol matnini kiriting!", "error");
      document.getElementById('qInputQuestion').focus();
      return;
    }

    if (!opt0 || !opt1 || !opt2 || !opt3) {
      showToast("Xatolik", "Barcha 4 ta variant (A, B, C, D) kiritilishi shart!", "error");
      return;
    }

    courseWizard.quiz.push({
      id: Date.now() + Math.random(),
      question: qText,
      options: [opt0, opt1, opt2, opt3],
      correctIndex: correctIdx
    });

    // Clear inputs for next question
    document.getElementById('qInputQuestion').value = '';
    document.getElementById('qInputOpt0').value = '';
    document.getElementById('qInputOpt1').value = '';
    document.getElementById('qInputOpt2').value = '';
    document.getElementById('qInputOpt3').value = '';
    document.querySelector('input[name="qCorrectRadio"][value="0"]').checked = true;

    renderCourseWizardQuizList();
    showToast("✅ Savol qo'shildi", `Kursga ${courseWizard.quiz.length}-savol muvaffaqiyatli qo'shildi.`, "success");
  });

  // Final Form Submit: Save full course with attached quiz!
  document.getElementById('addCourseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tasksUrl = tasksInput.value.trim() || "https://t.me/edunexus_community";

    const currentTeacher = accountsDb[session.loggedInUser];
    const newCourse = {
      id: Date.now(),
      title: courseWizard.title,
      link: courseWizard.link,
      summary: courseWizard.summary,
      tasks: tasksUrl,
      quiz: [...courseWizard.quiz],
      author: session.loggedInUser,
      tg_profile: currentTeacher ? currentTeacher.tg_profile : `@${session.loggedInUser}`,
      category: courseWizard.category,
      createdAt: new Date().toISOString(),
      views: 0
    };

    coursesDb.unshift(newCourse);
    saveState();

    notifySubscribers(session.loggedInUser, newCourse.title, true);
    showToast("🎉 Tabriklaymiz!", `'${newCourse.title}' kursi va ${newCourse.quiz.length} ta test topshirig'i muvaffaqiyatli saqlandi!`, "success");

    document.getElementById('addCourseForm').reset();
    previewBox.style.display = 'none';
    courseWizard = { step: 1, title: '', category: 'it', link: '', summary: '', tasks: '', quiz: [] };
    renderCourseWizardQuizList();
    updateCourseWizardUI();
    switchTab('courses');
  });
}

// ==========================================================================
// 9. Lesson Wizard
// ==========================================================================

let lessonWizard = { step: 1, title: '', category: 'it', link: '' };

function updateLessonWizardUI() {
  for (let i = 1; i <= 2; i++) {
    const stepEl = document.getElementById(`lStep${i}`);
    const lineEl = document.getElementById(`lLine${i}`);
    if (stepEl) {
      stepEl.classList.toggle('active', i === lessonWizard.step);
      stepEl.classList.toggle('completed', i < lessonWizard.step);
    }
    if (lineEl) {
      lineEl.classList.toggle('active', i < lessonWizard.step);
    }
    const stageEl = document.getElementById(`lStage${i}`);
    if (stageEl) {
      stageEl.classList.toggle('active', i === lessonWizard.step);
    }
  }
}

function initLessonWizard() {
  const titleInput = document.getElementById('lessonTitleInput');
  const catSelect = document.getElementById('lessonCategorySelect');
  const videoInput = document.getElementById('lessonVideoInput');
  const previewBox = document.getElementById('lessonVideoPreviewBox');
  const previewThumb = document.getElementById('lessonPreviewThumb');
  const previewId = document.getElementById('lessonPreviewId');

  document.getElementById('lessonNextTo2').addEventListener('click', () => {
    const title = titleInput.value.trim();
    if (!title) {
      showToast("Xatolik", "Iltimos, dars nomini kiriting!", "error");
      titleInput.focus();
      return;
    }
    lessonWizard.title = title;
    lessonWizard.category = catSelect.value;
    lessonWizard.step = 2;
    updateLessonWizardUI();
  });

  document.getElementById('lessonBackTo1').addEventListener('click', () => {
    lessonWizard.step = 1;
    updateLessonWizardUI();
  });

  videoInput.addEventListener('input', () => {
    const url = videoInput.value.trim();
    const vidId = extractYouTubeId(url);
    if (vidId) {
      previewBox.style.display = 'flex';
      previewThumb.src = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      previewId.textContent = `YouTube Video ID: ${vidId}`;
    } else {
      previewBox.style.display = 'none';
    }
  });

  document.getElementById('addLessonForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const url = videoInput.value.trim();
    if (!isValidYouTubeUrl(url)) {
      showToast("❌ Noto'g'ri havola!", "Iltimos, haqiqiy YouTube havolasini kiriting.", "error");
      videoInput.focus();
      return;
    }
    if (isDuplicateLink(url)) {
      showToast("⚠️ Takroriy havola!", "Bu video havola allaqachon bazaga qo'shilgan!", "error");
      videoInput.focus();
      return;
    }

    const currentTeacher = accountsDb[session.loggedInUser];
    const newLesson = {
      id: Date.now(),
      title: lessonWizard.title,
      link: url,
      author: session.loggedInUser,
      tg_profile: currentTeacher ? currentTeacher.tg_profile : `@${session.loggedInUser}`,
      category: lessonWizard.category,
      createdAt: new Date().toISOString(),
      views: 0
    };

    lessonsDb.unshift(newLesson);
    saveState();

    notifySubscribers(session.loggedInUser, newLesson.title, false);
    showToast("🎉 Tabriklaymiz!", `'${newLesson.title}' darsi muvaffaqiyatli saqlandi!`, "success");

    document.getElementById('addLessonForm').reset();
    previewBox.style.display = 'none';
    lessonWizard = { step: 1, title: '', category: 'it', link: '' };
    updateLessonWizardUI();
    switchTab('lessons');
  });
}

// ==========================================================================
// 10. Profile Dashboard
// ==========================================================================

function renderProfile() {
  const container = document.getElementById('profileContainer');
  const user = accountsDb[session.loggedInUser];

  if (!user) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-user-lock"></i>
        <h3>Siz tizimga kirmagansiz</h3>
        <p>Profilni ko'rish uchun /start tugmasini bosing yoki tizimga kiring.</p>
        <button class="primary-btn glow-btn" style="margin-top: 1.5rem;" onclick="openPortalStep('pStepLang')">
          <i class="fa-solid fa-rotate-left"></i>
          <span>/start</span>
        </button>
      </div>
    `;
    return;
  }

  const isTeacher = user.role === "O'qituvchi";
  const myCourses = coursesDb.filter(c => c.author === session.loggedInUser);
  const myLessons = lessonsDb.filter(l => l.author === session.loggedInUser);
  const mySubscribers = subscriptionsDb[session.loggedInUser] || [];
  
  const subscribedTeachers = Object.keys(subscriptionsDb).filter(teacher => 
    subscriptionsDb[teacher].includes(session.loggedInUser)
  );

  container.innerHTML = `
    <div class="profile-hero-card">
      <div class="profile-main-meta">
        <div class="profile-avatar-lg">${user.avatar || session.loggedInUser[0].toUpperCase()}</div>
        <div class="profile-info-block">
          <h2>${escapeHtml(session.loggedInUser)}</h2>
          <div class="profile-tags-row">
            <span class="role-badge ${isTeacher ? 'teacher' : 'student'}">
              ${isTeacher ? "👨‍🏫 O'qituvchi (Teacher)" : "👨‍🎓 O'quvchi (Student)"}
            </span>
            <span class="tg-tag"><i class="fa-brands fa-telegram"></i> ${escapeHtml(user.tg_profile)}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.5rem;">
            🔑 Parol: <code>${escapeHtml(user.password)}</code>
          </div>
        </div>
      </div>

      <div class="profile-hero-stats">
        ${isTeacher ? `
          <div class="stat-item">
            <span class="stat-number">${myCourses.length}</span>
            <span class="stat-label">Kurslarim</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">${myLessons.length}</span>
            <span class="stat-label">Darslarim</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">${mySubscribers.length}</span>
            <span class="stat-label">Obunachilar</span>
          </div>
        ` : `
          <div class="stat-item">
            <span class="stat-number">${subscribedTeachers.length}</span>
            <span class="stat-label">Obunalarim</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">${coursesDb.length}</span>
            <span class="stat-label">Mavjud Kurslar</span>
          </div>
        `}
      </div>
    </div>

    <div class="profile-sub-tabs">
      ${isTeacher ? `
        <button class="profile-tab-btn active" data-ptab="my-courses">
          <i class="fa-solid fa-book-bookmark"></i> 📚 Siz joylagan kurslar (${myCourses.length})
        </button>
        <button class="profile-tab-btn" data-ptab="my-lessons">
          <i class="fa-solid fa-video"></i> 🎬 Siz joylagan darslar (${myLessons.length})
        </button>
        <button class="profile-tab-btn" data-ptab="my-students">
          <i class="fa-solid fa-users"></i> 👥 Sizning o'quvchilaringiz (${mySubscribers.length})
        </button>
      ` : `
        <button class="profile-tab-btn active" data-ptab="my-subscriptions">
          <i class="fa-solid fa-bell"></i> 🔔 Obunalarim (O'qituvchilar) (${subscribedTeachers.length})
        </button>
      `}
    </div>

    <div class="profile-tab-bodies">
      ${isTeacher ? `
        <div class="profile-tab-content active" id="ptabMyCourses">
          <div class="grid-layout">
            ${myCourses.length > 0 ? myCourses.map((course, idx) => `
              <div class="card-item">
                <div class="card-media" onclick="openVideoPlayer(${course.id}, 'course')">
                  <img class="card-thumb-img" src="https://img.youtube.com/vi/${extractYouTubeId(course.link)}/hqdefault.jpg">
                </div>
                <div class="card-body">
                  <h4 class="card-title">📚 Kurs #${idx + 1}: ${escapeHtml(course.title)}</h4>
                  <p class="card-summary-snippet">${escapeHtml(course.summary)}</p>
                  <div style="font-size: 0.82rem; color: var(--accent-emerald); font-weight: 600; margin-bottom: 0.85rem;">
                    🎯 ${(course.quiz && course.quiz.length) || 0} ta test topshirig'i biriktirilgan
                  </div>
                  <div class="card-footer">
                    <button class="primary-btn glow-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openQuizModal(${course.id})">
                      <i class="fa-solid fa-play"></i> Testni yechish
                    </button>
                    <button class="secondary-btn" style="color: var(--accent-red); padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="deleteCourse(${course.id})">
                      <i class="fa-solid fa-trash"></i> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            `).join('') : '<p class="empty-state">📚 Siz hali hech qanday kurs joylamagansiz.</p>'}
          </div>
        </div>

        <div class="profile-tab-content" id="ptabMyLessons">
          <div class="grid-layout">
            ${myLessons.length > 0 ? myLessons.map((lesson, idx) => `
              <div class="card-item">
                <div class="card-media" onclick="openVideoPlayer(${lesson.id}, 'lesson')">
                  <img class="card-thumb-img" src="https://img.youtube.com/vi/${extractYouTubeId(lesson.link)}/hqdefault.jpg">
                </div>
                <div class="card-body">
                  <h4 class="card-title">🎬 Dars #${idx + 1}: ${escapeHtml(lesson.title)}</h4>
                  <div class="card-footer">
                    <button class="secondary-btn" style="color: var(--accent-red); padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="deleteLesson(${lesson.id})">
                      <i class="fa-solid fa-trash"></i> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            `).join('') : '<p class="empty-state">🎬 Siz hali hech qanday dars joylamagansiz.</p>'}
          </div>
        </div>

        <div class="profile-tab-content" id="ptabMyStudents">
          ${mySubscribers.length > 0 ? `
            <table class="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bot Username</th>
                  <th>Telegram Profili</th>
                  <th>Holati</th>
                </tr>
              </thead>
              <tbody>
                ${mySubscribers.map((stUsername, index) => {
                  const student = accountsDb[stUsername] || {};
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td><strong>${escapeHtml(stUsername)}</strong></td>
                      <td><a href="https://t.me/${(student.tg_profile || '').replace('@','')}" target="_blank" style="color: #38bdf8;">${escapeHtml(student.tg_profile || 'Noma\'lum')}</a></td>
                      <td><span class="badge-tag" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">Faol O'quvchi</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : '<p class="empty-state">👥 Hozircha sizga hech kim obuna bo\'lmagan.</p>'}
        </div>
      ` : `
        <div class="profile-tab-content active" id="ptabMySubscriptions">
          <div class="grid-layout">
            ${subscribedTeachers.length > 0 ? subscribedTeachers.map((tUsername, idx) => {
              const teacher = accountsDb[tUsername] || {};
              const tCourses = coursesDb.filter(c => c.author === tUsername);
              return `
                <div class="card-item" style="padding: 1.5rem;">
                  <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="instructor-avatar" style="width: 48px; height: 48px; font-size: 1.2rem;">${teacher.avatar || tUsername[0].toUpperCase()}</div>
                    <div>
                      <h4 style="font-size: 1.15rem; margin-bottom: 0.2rem;">${idx + 1}. ${escapeHtml(tUsername)}</h4>
                      <span style="color: var(--text-dim); font-size: 0.85rem;"><i class="fa-brands fa-telegram"></i> ${escapeHtml(teacher.tg_profile)}</span>
                    </div>
                  </div>
                  <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                    Ushbu o'qituvchi jami <strong>${tCourses.length} ta kurs</strong> joylagan.
                  </p>
                  <button class="primary-btn full-width" onclick="toggleSubscription('${escapeHtml(tUsername)}')">
                    <i class="fa-solid fa-bell-slash"></i>
                    <span>Obunani Bekor Qilish</span>
                  </button>
                </div>
              `;
            }).join('') : '<p class="empty-state">🔔 Siz hali hech qanday o\'qituvchiga obuna bo\'lmagansiz.</p>'}
          </div>
        </div>
      `}
    </div>
  `;

  container.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-ptab');
      const tabMap = {
        'my-courses': 'ptabMyCourses',
        'my-lessons': 'ptabMyLessons',
        'my-students': 'ptabMyStudents',
        'my-subscriptions': 'ptabMySubscriptions'
      };

      container.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));
      const activeContent = document.getElementById(tabMap[targetTab]);
      if (activeContent) activeContent.classList.add('active');
    });
  });
}

function deleteCourse(courseId) {
  if (confirm("Rostdan ham ushbu kursni o'chirmoqchimisiz?")) {
    coursesDb = coursesDb.filter(c => c.id !== courseId);
    saveState();
    showToast("EduNexus", "Kurs muvaffaqiyatli o'chirildi.", "info");
    renderApp();
  }
}

function deleteLesson(lessonId) {
  if (confirm("Rostdan ham ushbu darsni o'chirmoqchimisiz?")) {
    lessonsDb = lessonsDb.filter(l => l.id !== lessonId);
    saveState();
    showToast("EduNexus", "Dars muvaffaqiyatli o'chirildi.", "info");
    renderApp();
  }
}

function handleLogout() {
  if (confirm("Rostdan ham tizimdan chiqmoqchimisiz?")) {
    session.loggedInUser = null;
    saveState();
    showToast("🔒 EduNexus", "Akkauntdan chiqdingiz. Qaytadan kirish uchun tilni tanlang.", "info");
    renderApp();
    openPortalStep('pStepLang');
  }
}

// ==========================================================================
// 11. Video Player Modal
// ==========================================================================

function openVideoPlayer(itemId, type) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const title = document.getElementById('modalVideoTitle');
  const categoryTag = document.getElementById('modalCategoryTag');
  const authorTag = document.getElementById('modalAuthorTag');
  const summarySection = document.getElementById('modalSummarySection');
  const summaryText = document.getElementById('modalSummaryText');
  const taskBtn = document.getElementById('modalTaskLinkBtn');
  const subBtn = document.getElementById('modalSubscribeBtn');

  let item = null;
  if (type === 'course') {
    item = coursesDb.find(c => c.id === itemId);
    if (!item) return;

    summarySection.style.display = 'block';
    summaryText.textContent = item.summary;
    taskBtn.style.display = 'inline-flex';
    taskBtn.onclick = () => {
      closeVideoPlayer();
      openQuizModal(item.id);
    };

    item.views = (item.views || 0) + 1;
    saveState();
  } else {
    item = lessonsDb.find(l => l.id === itemId);
    if (!item) return;

    summarySection.style.display = 'none';
    taskBtn.style.display = 'none';
    item.views = (item.views || 0) + 1;
    saveState();
  }

  const videoId = extractYouTubeId(item.link);
  iframe.src = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';

  title.textContent = item.title;
  categoryTag.textContent = item.category;
  categoryTag.className = `badge-tag ${item.category}`;
  authorTag.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i> Ustoz: <strong>${escapeHtml(item.author)}</strong> (${escapeHtml(item.tg_profile)})`;

  const isSubbed = isSubscribedTo(item.author);
  subBtn.className = `subscribe-action-btn ${isSubbed ? 'active' : ''}`;
  subBtn.innerHTML = `
    <i class="fa-solid ${isSubbed ? 'fa-bell-slash' : 'fa-bell'}"></i>
    <span>${isSubbed ? getTranslation('subscribed_btn') : getTranslation('subscribe_btn')}</span>
  `;

  subBtn.onclick = () => {
    toggleSubscription(item.author);
    const newSubState = isSubscribedTo(item.author);
    subBtn.className = `subscribe-action-btn ${newSubState ? 'active' : ''}`;
    subBtn.innerHTML = `
      <i class="fa-solid ${newSubState ? 'fa-bell-slash' : 'fa-bell'}"></i>
      <span>${newSubState ? getTranslation('subscribed_btn') : getTranslation('subscribe_btn')}</span>
    `;
  };

  modal.classList.add('open');
}

function closeVideoPlayer() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  iframe.src = '';
  modal.classList.remove('open');
}

// ==========================================================================
// 12. Notifications & Helpers
// ==========================================================================

function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  const unreadCount = notificationsDb.filter(n => !n.read).length;
  if (unreadCount > 0) {
    badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderNotificationsList() {
  const list = document.getElementById('notificationList');
  if (notificationsDb.length === 0) {
    list.innerHTML = `
      <div class="empty-state-sm" style="text-align: center; padding: 1.5rem 0.5rem; color: var(--text-dim);">
        <i class="fa-regular fa-bell-slash" style="font-size: 1.75rem; margin-bottom: 0.5rem;"></i>
        <p style="font-size: 0.85rem;">${getTranslation('no_notifications')}</p>
      </div>
    `;
    return;
  }

  list.innerHTML = notificationsDb.map(n => `
    <div class="notif-item">
      <div class="notif-icon-box">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>
      <div class="notif-body">
        <div class="notif-content-title">${escapeHtml(n.teacherUsername)} (${escapeHtml(n.teacherTg)})</div>
        <div class="notif-content-desc">Yangi ${n.contentType}: <strong>${escapeHtml(n.title)}</strong></div>
        <span class="notif-time">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  `).join('');
}

function clearAllNotifications() {
  notificationsDb = [];
  saveState();
  updateNotificationBadge();
  renderNotificationsList();
  showToast("Bildirishnomalar", "Barcha bildirishnomalar tozalandi.", "info");
}

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-exclamation',
    info: 'fa-solid fa-bell'
  };

  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconMap[type] || 'fa-solid fa-bell'}"></i>
    </div>
    <div class="toast-body">
      <h4 class="toast-title">${escapeHtml(title)}</h4>
      <p class="toast-msg">${escapeHtml(message)}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function switchTab(tabName) {
  activeTab = tabName;
  updateNavState();
}

// ==========================================================================
// 13. Global Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });

  document.getElementById('restartFlowBtn').addEventListener('click', () => {
    openPortalStep('pStepLang');
  });

  const langBtn = document.getElementById('langSelectBtn');
  const langDropdownWrapper = langBtn.closest('.dropdown-wrapper');
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdownWrapper.classList.toggle('open');
  });

  document.querySelectorAll('#langDropdown .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const selectedLang = item.getAttribute('data-lang');
      applyLanguage(selectedLang);
      langDropdownWrapper.classList.remove('open');
    });
  });

  const notifBtn = document.getElementById('notificationBtn');
  const notifDropdownWrapper = notifBtn.closest('.dropdown-wrapper');
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdownWrapper.classList.toggle('open');
    notificationsDb.forEach(n => n.read = true);
    saveState();
    updateNotificationBadge();
  });

  document.getElementById('clearNotifsBtn').addEventListener('click', clearAllNotifications);

  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-wrapper.open').forEach(w => w.classList.remove('open'));
  });

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
      document.getElementById('mobileDrawer').classList.remove('open');
    });
  });

  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('mobileDrawer').classList.toggle('open');
  });

  document.getElementById('brandLogo').addEventListener('click', () => {
    switchTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('#coursesCategoryPills .cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#coursesCategoryPills .cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderCoursesList();
    });
  });

  // Modal events
  document.getElementById('closeVideoModalBtn').addEventListener('click', closeVideoPlayer);
  document.getElementById('videoModal').addEventListener('click', (e) => {
    if (e.target.id === 'videoModal') closeVideoPlayer();
  });

  document.getElementById('closeQuizModalBtn').addEventListener('click', closeQuizModal);
  document.getElementById('btnQuizCloseDone').addEventListener('click', closeQuizModal);
  document.getElementById('quizModal').addEventListener('click', (e) => {
    if (e.target.id === 'quizModal') closeQuizModal();
  });

  document.getElementById('btnQuizNext').addEventListener('click', nextQuizQuestion);
  document.getElementById('btnQuizPrev').addEventListener('click', prevQuizQuestion);
  document.getElementById('btnQuizRetake').addEventListener('click', retakeQuiz);

  // Initialize subsystems
  initOnboardingPortal();
  initSearchEngine();
  initCourseWizard();
  initLessonWizard();

  if (!session.loggedInUser) {
    openPortalStep('pStepLang');
  } else {
    closePortal();
  }

  applyLanguage(session.lang || 'uz');
});
