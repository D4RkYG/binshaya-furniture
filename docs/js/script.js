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



/* --- Dropdown menus (language and theme) --- */

const dropdowns = document.querySelectorAll('.dropdown');

function closeDropdown(dropdown) {
  dropdown.querySelector('.dropdown-menu').hidden = true;
  dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');

  toggle.addEventListener('click', () => {
    const willOpen = menu.hidden;
    dropdowns.forEach(closeDropdown); // only one menu open at a time
    menu.hidden = !willOpen;
    toggle.setAttribute('aria-expanded', willOpen);
  });
});

document.addEventListener('click', (event) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  dropdowns.forEach((dropdown) => {
    if (!dropdown.querySelector('.dropdown-menu').hidden) {
      closeDropdown(dropdown);
      dropdown.querySelector('.dropdown-toggle').focus();
    }
  });
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

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setTheme(button.dataset.themeChoice);
    closeDropdown(themeMenu.closest('.dropdown'));
    themeToggle.focus();
  });
});

showThemeChoice(root.dataset.theme || 'system');



/* --- Header shadow and active nav link while scrolling --- */

const siteHeader = document.querySelector('.site-header');
// Only links to a section on this page take part; a link to another page or a missing section is skipped
const sections = [...navLinks]
  .map((link) => link.hash && document.getElementById(link.hash.slice(1)))
  .filter(Boolean);

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
  if (atBottom && sections.length > 0) {
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

  document.querySelectorAll('.section-header, .about-content, .stat, .feature-card, .collection-card, .cta-container, .contact-card').forEach((el) => {
    // Only hide things that start below the screen, so nothing visible blinks on load
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });
}



/* --- Count up the About numbers each time they scroll into view --- */
// The final numbers are written in the page, so they still show without JavaScript or with reduced motion.

const statNumbers = document.querySelectorAll('.stat-number');

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const counters = new Map();

  statNumbers.forEach((el) => {
    const final = el.textContent;
    const target = Number(final.replace(/\D/g, ''));
    let frame = null;

    // Screen readers get the final number; the changing digits are hidden from them
    const finalText = document.createElement('span');
    finalText.className = 'visually-hidden';
    finalText.textContent = final;
    el.after(finalText);
    el.setAttribute('aria-hidden', 'true');

    const start = () => {
      if (frame !== null) return; // already counting (or done) during this visit
      const duration = 1800;
      let startTime = null;

      // Hold the final width so the "+" doesn't shift while counting (measured now, once the fonts have loaded)
      el.textContent = final;
      el.style.minWidth = `${el.offsetWidth}px`;
      el.textContent = '0';

      const step = (time) => {
        if (startTime === null) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // quick start, gentle finish
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (progress < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
    };

    // Back to zero once off screen, ready to count again on the next visit
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = null;
      el.textContent = '0';
    };

    counters.set(el, { start, reset });
    el.textContent = '0';
  });

  // Start when most of a number is on screen; reset only once it has left completely
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const counter = counters.get(entry.target);
      if (entry.intersectionRatio >= 0.6) {
        counter.start();
      } else if (!entry.isIntersecting) {
        counter.reset();
      }
    });
  }, { threshold: [0, 0.6] });

  statNumbers.forEach((el) => countObserver.observe(el));
}



/* --- WhatsApp chat button: close on outside click or Escape --- */

const waWidget = document.getElementById('wa-widget');

document.addEventListener('click', (event) => {
  if (waWidget.open && !waWidget.contains(event.target) && !event.target.closest('[data-open-whatsapp]')) {
    waWidget.open = false;
  }
});

// "Ask on WhatsApp" links on the collection cards open the chat button's list of contacts,
// with a message that names the room (data-whatsapp-message). Without JavaScript they simply jump to the contact section.
const waLinks = [...waWidget.querySelectorAll('.wa-list a')];
const waDefaultHrefs = waLinks.map((a) => a.href);

function setWhatsAppMessage(message) {
  waLinks.forEach((a, i) => {
    const url = new URL(waDefaultHrefs[i]);
    a.href = `${url.origin}${url.pathname}?phone=${url.searchParams.get('phone')}&text=${encodeURIComponent(message)}`;
  });
}

document.querySelectorAll('[data-open-whatsapp]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (link.dataset.whatsappMessage) setWhatsAppMessage(link.dataset.whatsappMessage);
    waWidget.open = true;
    waLinks[0].focus();
  });
});

// Back to the general greeting whenever the list closes
waWidget.addEventListener('toggle', () => {
  if (!waWidget.open) {
    waLinks.forEach((a, i) => {
      a.href = waDefaultHrefs[i];
    });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && waWidget.open) {
    waWidget.open = false;
    waWidget.querySelector('summary').focus();
  }
});



/* --- Showroom open / closed status (Oman time, UTC+4) --- */

const openStatus = document.getElementById('open-status');

if (openStatus) {
  const isArabic = root.lang === 'ar';
  const text = isArabic
    ? { open: 'مفتوح الآن', closed: 'مغلق الآن', closes: 'يغلق الساعة', opens: 'يفتح الساعة', tomorrow: 'غداً', am: 'ص', pm: 'م' }
    : { open: 'Open now', closed: 'Closed now', closes: 'Closes at', opens: 'Opens at', tomorrow: 'tomorrow', am: 'AM', pm: 'PM' };

  // Opening times in minutes after midnight. Friday (day 5) opens in the evening only.
  const regularHours = [[8 * 60, 13 * 60], [16 * 60, 21 * 60]];
  const fridayHours = [[16 * 60, 21 * 60]];
  const hoursFor = (day) => (day === 5 ? fridayHours : regularHours);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours % 12 || 12}:${mins} ${hours < 12 ? text.am : text.pm}`;
  };

  function updateOpenStatus() {
    const now = new Date();
    const omanTime = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000);
    const day = omanTime.getDay();
    const minutes = omanTime.getHours() * 60 + omanTime.getMinutes();
    const today = hoursFor(day);

    const openPeriod = today.find(([open, close]) => minutes >= open && minutes < close);
    const laterToday = today.find(([open]) => open > minutes);

    if (openPeriod) {
      openStatus.textContent = `${text.open} · ${text.closes} ${formatTime(openPeriod[1])}`;
    } else if (laterToday) {
      openStatus.textContent = `${text.closed} · ${text.opens} ${formatTime(laterToday[0])}`;
    } else {
      const tomorrowOpens = hoursFor((day + 1) % 7)[0][0];
      openStatus.textContent = `${text.closed} · ${text.opens} ${formatTime(tomorrowOpens)} ${text.tomorrow}`;
    }

    openStatus.classList.toggle('is-open', Boolean(openPeriod));
    openStatus.classList.toggle('is-closed', !openPeriod);
    openStatus.hidden = false;

    // Highlight today's row in the hours list
    document.querySelectorAll('.hours-list li').forEach((row) => {
      row.classList.toggle('is-today', row.dataset.days.split(',').includes(String(day)));
    });
  }

  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
}



/* --- Copy phone number / email buttons --- */

document.querySelectorAll('[data-copy]').forEach((button) => {
  // Copying needs a secure page (https or localhost); hide the button where it can't work
  if (!navigator.clipboard || !window.isSecureContext) {
    button.hidden = true;
    return;
  }

  const label = button.textContent;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = button.dataset.copied;
      setTimeout(() => {
        button.textContent = label;
      }, 2000);
    } catch (error) {
      button.hidden = true;
    }
  });
});



/* --- Auto-update footer year --- */

document.getElementById('current-year').textContent = new Date().getFullYear();
