/**
 * NOVADEV — script.js
 * Handles:
 *  1. Scroll detection → navbar style change
 *  2. Active-section highlighting via IntersectionObserver
 *  3. Hamburger menu open/close with animations
 *  4. Smooth scrolling to sections
 *  5. Close mobile menu on link click / outside click
 *  6. Form micro-interaction
 */

// ─── Cache DOM references ────────────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const navLinks    = document.querySelectorAll('.nav-link');    // desktop
const mobileLinks = document.querySelectorAll('.mobile-link'); // mobile
const sections    = document.querySelectorAll('section[id]');
const contactForm = document.querySelector('.contact-form');

// ─── 1. SCROLL DETECTION ────────────────────────────────────────────────────
/**
 * When the user scrolls more than 50px:
 *   - Add `.scrolled` class to .navbar
 *   - CSS handles: height ↓, background → glassmorphism, shadow added
 * Transition is smooth via CSS `transition` on `.navbar`
 */
const SCROLL_THRESHOLD = 50;

function handleNavbarScroll() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Use passive listener for performance
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
// Run once on load in case the user refreshes mid-page
handleNavbarScroll();


// ─── 2. ACTIVE-SECTION HIGHLIGHTING ─────────────────────────────────────────
/**
 * IntersectionObserver watches each <section>.
 * When a section is ≥ 40% visible, we mark its corresponding nav link as active.
 * This is more performant than polling scrollY on every scroll event.
 */
const observerOptions = {
  root: null,          // observe relative to viewport
  rootMargin: '-10% 0px -55% 0px',  // trigger when section hits the upper-middle band
  threshold: 0,
};

/**
 * Given a section id, update `.active` class on both desktop and mobile links.
 */
function setActiveLink(sectionId) {
  // Update desktop links
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
  // Update mobile links
  mobileLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // section id matches the data-section attribute on nav links
      setActiveLink(entry.target.id);
    }
  });
}, observerOptions);

// Observe every section
sections.forEach(section => sectionObserver.observe(section));


// ─── 3. HAMBURGER MENU TOGGLE ────────────────────────────────────────────────
/**
 * Toggles the mobile menu open/closed.
 * - Animates hamburger bars → X via CSS (.hamburger[aria-expanded="true"])
 * - Slides in mobile menu via .mobile-menu.open (CSS handles opacity + translateY)
 * - Manages aria attributes for accessibility
 * - Locks body scroll when menu is open to prevent background scroll
 */
function openMobileMenu() {
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMobileMenu() {
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // restore scroll
}

function toggleMobileMenu() {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  isOpen ? closeMobileMenu() : openMobileMenu();
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close menu when clicking outside the navbar area
document.addEventListener('click', (e) => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  if (isOpen && !navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

// Close menu on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
    closeMobileMenu();
    hamburger.focus(); // return focus to toggle button
  }
});


// ─── 4. SMOOTH SCROLLING + CLOSE MOBILE MENU ON LINK CLICK ─────────────────
/**
 * Both desktop and mobile nav links use href="#sectionId".
 * CSS `scroll-behavior: smooth` on <html> handles the animation natively.
 * We intercept the click to:
 *   a) Close the mobile menu (if open)
 *   b) Offset the scroll position to account for the fixed navbar height
 */
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  // Get current navbar height dynamically (changes on scroll)
  const navH = navbar.getBoundingClientRect().height;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

  window.scrollTo({ top: targetTop, behavior: 'smooth' });
}

function handleNavLinkClick(e) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  e.preventDefault();
  const targetId = href.slice(1); // strip the '#'

  closeMobileMenu();
  smoothScrollTo(targetId);
}

// Attach to all links in both desktop and mobile menus
[...navLinks, ...mobileLinks].forEach(link => {
  link.addEventListener('click', handleNavLinkClick);
});

// Handle logo and CTA links the same way
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (!link.classList.contains('nav-link') && !link.classList.contains('mobile-link')) {
    link.addEventListener('click', handleNavLinkClick);
  }
});


// ─── 5. FORM MICRO-INTERACTION ───────────────────────────────────────────────
/**
 * On submit, show a success message with a small animation.
 * In a real project, you'd POST to an API here.
 */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Disable button and show loading state
    btn.disabled = true;
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';

    // Simulate async send (replace with real fetch/axios call)
    setTimeout(() => {
      btn.textContent = '✓ Message sent!';
      btn.style.opacity = '1';
      btn.style.background = '#16a34a'; // green for success

      contactForm.reset();

      // Reset button after a few seconds
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 1200);
  });
}


// ─── 6. INTERSECTION-BASED FADE-IN FOR CARDS ─────────────────────────────────
/**
 * Add a subtle appear animation to grid cards as they scroll into view.
 * Uses IntersectionObserver + CSS class instead of scroll events for performance.
 */
const fadeEls = document.querySelectorAll(
  '.service-card, .portfolio-card, .about-stat, .contact-item'
);

// Inject the reveal CSS dynamically (keeps concerns separated)
const style = document.createElement('style');
style.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Apply initial hidden state
fadeEls.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger delay for grid siblings (max 5 × 80ms = 400ms)
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 80}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stop observing once revealed (one-shot animation)
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => revealObserver.observe(el));


// ─── 7. RESIZE HANDLER ───────────────────────────────────────────────────────
/**
 * If the viewport is resized to desktop width while mobile menu is open,
 * close it and restore body scroll to avoid stuck state.
 */
const MOBILE_BREAKPOINT = 768;

window.addEventListener('resize', () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    closeMobileMenu();
  }
}, { passive: true });