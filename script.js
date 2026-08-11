/**
 * Dr. Shana Parween — General Dentist Portfolio
 * Vanilla JavaScript Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. SCROLL PROGRESS INDICATOR & HEADER BACKDROP
     -------------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  const mainHeader = document.getElementById('main-header');

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update top progress bar
    if (scrollProgress && scrollHeight > 0) {
      const progressPercent = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // Toggle header background blur class
    if (mainHeader) {
      if (scrollTop > 40) {
        mainHeader.classList.add('header-scrolled');
      } else {
        mainHeader.classList.remove('header-scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION MENU TOGGLE
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(isOpen) {
    const activeState = typeof isOpen === 'boolean' ? isOpen : !mobileNav.classList.contains('active');
    
    if (activeState) {
      mobileNav.classList.add('active');
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Lock scroll when mobile menu open
    } else {
      mobileNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scroll
    }
  }

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. INTERSECTION OBSERVER FOR SCROLL REVEALS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (revealElements.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // Instantly reveal if reduced motion preferred or browser lacks IntersectionObserver
      revealElements.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12
      });

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  /* --------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function highlightActiveNav() {
    const scrollPosition = window.scrollY + 120; // Offset for header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  /* --------------------------------------------------------------------------
     5. SMOOTH SCROLLING FOR ANCHOR LINKS
     -------------------------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. SUBTLE HERO PORTRAIT PARALLAX
     -------------------------------------------------------------------------- */
  const heroImageWrapper = document.getElementById('hero-image-wrapper');

  if (heroImageWrapper && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const translateY = scrollY * 0.08;
        heroImageWrapper.style.transform = `translateY(${translateY}px)`;
      }
    }, { passive: true });
  }
});
