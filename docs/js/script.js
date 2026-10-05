/* --- Javascript --- */

'use strict';

/* --- Mobile menu --- */

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

function closeMenu() {
  mainNav.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});



/* --- Close menu when a link is tapped --- */

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});



/* --- Close menu when clicking outside --- */

document.addEventListener('click', (event) => {
  const isClickInsideNav = mainNav.contains(event.target) || navToggle.contains(event.target);

  if (!isClickInsideNav && mainNav.classList.contains('open')) {
    closeMenu();
  }
});



/* --- Close menu with the Escape key --- */

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mainNav.classList.contains('open')) {
    closeMenu();
    navToggle.focus(); // return keyboard users to the button they opened it with
  }
});



/* --- Theme switcher: Light / System / Dark --- */
// "System" removes data-theme so the CSS follows the device setting.
// The saved choice is applied by a small script in <head> before the page is drawn.

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
const themeButtons = themeMenu.querySelectorAll('[data-theme-choice]');

function showThemeChoice(choice) {
  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.themeChoice === choice);
  });
}

function setTheme(choice) {
  if (choice === 'light' || choice === 'dark') {
    root.dataset.theme = choice;
  } else {
    delete root.dataset.theme;
  }

  try {
    if (choice === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', choice);
    }
  } catch (error) {
    // Private browsing can block storage; the theme still changes for this visit
  }

  showThemeChoice(choice);
}

function closeThemeMenu() {
  themeMenu.hidden = true;
  themeToggle.setAttribute('aria-expanded', 'false');
}

themeToggle.addEventListener('click', () => {
  const willOpen = themeMenu.hidden;
  themeMenu.hidden = !willOpen;
  themeToggle.setAttribute('aria-expanded', willOpen);
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setTheme(button.dataset.themeChoice);
    closeThemeMenu();
    themeToggle.focus();
  });
});

document.addEventListener('click', (event) => {
  if (!themeMenu.hidden && !themeMenu.contains(event.target) && !themeToggle.contains(event.target)) {
    closeThemeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !themeMenu.hidden) {
    closeThemeMenu();
    themeToggle.focus();
  }
});

showThemeChoice(root.dataset.theme || 'system');



/* --- Header shadow and active nav link while scrolling --- */

const siteHeader = document.querySelector('.site-header');
const sections = [...navLinks].map((link) => document.querySelector(link.hash));

function updateOnScroll() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 10);

  // The active section is the lowest one whose top has passed 40% of the screen height
  const marker = window.innerHeight * 0.4;
  let current = null;
  let currentTop = -Infinity;

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top <= marker && top > currentTop) {
      current = section;
      currentTop = top;
    }
  });

  // At the very bottom, the last link wins even if its section is short
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) {
    current = sections[sections.length - 1];
  }

  navLinks.forEach((link) => {
    const isActive = current !== null && link.hash === '#' + current.id;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('scroll', updateOnScroll, { passive: true });
window.addEventListener('resize', updateOnScroll);
updateOnScroll();



/* --- Fade content in as it scrolls into view --- */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-header, .feature-card, .collection-card, .cta-container, .contact-item, .contact-map').forEach((el) => {
    // Only hide things that start below the screen, so nothing visible blinks on load
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });
}



/* --- WhatsApp chat button: close on outside click or Escape --- */

const waWidget = document.getElementById('wa-widget');

document.addEventListener('click', (event) => {
  if (waWidget.open && !waWidget.contains(event.target)) {
    waWidget.open = false;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && waWidget.open) {
    waWidget.open = false;
    waWidget.querySelector('summary').focus();
  }
});



/* --- Auto-update footer year --- */

document.getElementById('current-year').textContent = new Date().getFullYear();
