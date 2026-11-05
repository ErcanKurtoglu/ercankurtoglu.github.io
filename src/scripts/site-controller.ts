import { translations, type Lang } from '../i18n/translations';

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'tr';
  const stored = localStorage.getItem('site_lang');
  if (stored === 'en' || stored === 'tr') return stored;
  return 'tr';
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

  // Update TR / EN switcher styling
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

export function initSiteControls() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const currentLang = getStoredLang();
  updateLanguageUI(currentLang);

  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((btn) => {
    btn.onclick = () => {
      const targetLang = btn.getAttribute('data-lang') as Lang;
      if (targetLang) setLanguage(targetLang);
    };
  });

  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.onclick = toggleTheme;
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteControls);
  } else {
    initSiteControls();
  }
  // Support Astro view transitions or soft reloads if enabled
  document.addEventListener('astro:page-load', initSiteControls);
}
