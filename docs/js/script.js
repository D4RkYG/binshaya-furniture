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

  document.querySelectorAll('.section-header, .feature-card, .collection-card, .cta-container').forEach((el) => {
    // Only hide things that start below the screen, so nothing visible blinks on load
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });
}



/* --- Auto-update footer year --- */

document.getElementById('current-year').textContent = new Date().getFullYear();
