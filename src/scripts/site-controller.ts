import { translations, type Lang } from '../i18n/translations';

export function detectUserLanguage(): Lang {
  if (typeof window === 'undefined') return 'tr';

  // 1. If user previously chose manually, respect their decision 100%
  const manualChoice = localStorage.getItem('site_lang');
  if (manualChoice === 'tr' || manualChoice === 'en') {
    return manualChoice;
  }

  // 2. Check browser language (navigator.language)
  const navLangs = navigator.languages || [navigator.language || ''];
  const isTrLang = navLangs.some((l) => l && l.toLowerCase().startsWith('tr'));

  // 3. Check device timezone (Europe/Istanbul or Turkey)
  let isTrTz = false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Istanbul') || tz === 'Turkey') {
      isTrTz = true;
    }
  } catch (err) {}

  // Turkish browser or Turkey timezone -> Turkish ('tr')
  // Everyone else around the globe -> English ('en')
  return (isTrLang || isTrTz) ? 'tr' : 'en';
}

export function updateLanguageUI(lang: Lang) {
  if (typeof document === 'undefined') return;

  const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  const dict = translations[lang] || translations.tr;

  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // Update TR / EN switcher buttons styling
  const trBtns = document.querySelectorAll<HTMLElement>('#lang-tr-btn');
  const enBtns = document.querySelectorAll<HTMLElement>('#lang-en-btn');

  trBtns.forEach((btn) => {
    if (lang === 'tr') {
      btn.className = 'lang-btn px-2.5 py-1 rounded-full transition-all font-bold bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs';
    } else {
      btn.className = 'lang-btn px-2.5 py-1 rounded-full transition-all font-medium text-neutral-500 hover:text-black dark:hover:text-white';
    }
  });

  enBtns.forEach((btn) => {
    if (lang === 'en') {
      btn.className = 'lang-btn px-2.5 py-1 rounded-full transition-all font-bold bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs';
    } else {
      btn.className = 'lang-btn px-2.5 py-1 rounded-full transition-all font-medium text-neutral-500 hover:text-black dark:hover:text-white';
    }
  });

  document.documentElement.setAttribute('lang', lang);
}

export function setLanguage(lang: Lang) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('site_lang', lang);
  updateLanguageUI(lang);
}

export function toggleTheme() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const isDark = document.documentElement.classList.contains('dark');
  const nextTheme = isDark ? 'light' : 'dark';
  if (nextTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('site_theme', nextTheme);
}

// Background IP Geolocation validation (Async, non-blocking)
function verifyGeoLocation() {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  // If the user already made a manual choice, don't overwrite it
  if (localStorage.getItem('site_lang')) return;

  fetch('https://api.country.is')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && data.country && !localStorage.getItem('site_lang')) {
        const countryLang: Lang = data.country === 'TR' ? 'tr' : 'en';
        const currentLang = document.documentElement.getAttribute('lang');
        if (countryLang !== currentLang) {
          updateLanguageUI(countryLang);
        }
      }
    })
    .catch(() => {
      // Graceful fallback: instant browser/timezone detection remains active
    });
}

export function setLogoVariant(variant: string) {
  if (typeof document === 'undefined') return;
  localStorage.setItem('user_logo_pref', variant);

  // Update header logo slots
  document.querySelectorAll<HTMLElement>('.header-logo-slot').forEach((slot) => {
    if (slot.getAttribute('data-logo-variant') === variant) {
      slot.classList.remove('hidden');
      slot.classList.add('block');
    } else {
      slot.classList.add('hidden');
      slot.classList.remove('block');
    }
  });

  // Update founder logo slots
  document.querySelectorAll<HTMLElement>('.founder-logo-slot').forEach((slot) => {
    if (slot.getAttribute('data-founder-logo-variant') === variant) {
      slot.classList.remove('hidden');
      slot.classList.add('block');
    } else {
      slot.classList.add('hidden');
      slot.classList.remove('block');
    }
  });

  // Update switcher buttons UI
  document.querySelectorAll<HTMLElement>('[data-logo-target]').forEach((btn) => {
    const target = btn.getAttribute('data-logo-target');
    if (target === variant) {
      btn.className = 'logo-pick-btn px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs cursor-pointer transition-all';
    } else {
      btn.className = 'logo-pick-btn px-2.5 py-1 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer transition-all';
    }
  });
}

export function initSiteControls() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // 1. Language Initialization
  const currentLang = detectUserLanguage();
  updateLanguageUI(currentLang);
  verifyGeoLocation();

  // 2. Language Switch Buttons
  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((btn) => {
    btn.onclick = () => {
      const targetLang = btn.getAttribute('data-lang') as Lang;
      if (targetLang) setLanguage(targetLang);
    };
  });

  // 3. Theme Toggle Button
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.onclick = toggleTheme;
  }

  // 4. Live System Theme Listener (Reacts if user changes device theme while browsing, unless manual choice is saved)
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('site_theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }

  // 5. Logo Switcher Initialization
  let savedLogo = localStorage.getItem('user_logo_pref');
  if (!savedLogo || savedLogo === 'slide2') {
    savedLogo = 'slide2-boxed';
  }
  setLogoVariant(savedLogo);

  document.querySelectorAll<HTMLElement>('[data-logo-target]').forEach((btn) => {
    btn.onclick = () => {
      const target = btn.getAttribute('data-logo-target');
      if (target) setLogoVariant(target);
    };
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteControls);
  } else {
    initSiteControls();
  }
  document.addEventListener('astro:page-load', initSiteControls);
}
