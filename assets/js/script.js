(() => {
  const documentElement = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  const closeMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mobileMenu.hidden = true;
    body.classList.remove('menu-open');
  };

  const openMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    mobileMenu.hidden = false;
    body.classList.add('menu-open');
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  revealItems.forEach((item) => {
    const delay = Number(item.dataset.revealDelay || 0);
    item.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.14,
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const syncMobileState = () => {
    if (window.innerWidth > 980) closeMobileMenu();
  };

  window.addEventListener('resize', syncMobileState, { passive: true });

  documentElement.classList.add('js-ready');
})();
