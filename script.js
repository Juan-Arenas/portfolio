/**
 * ARENAS — DIGITAL CREATIVE STUDIO
 * Interactive Controller & Dynamic Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header glass blur trigger
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active nav link highlight on scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================
  // 2. MOBILE FULLSCREEN MENU
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a, .mobile-menu-overlay .btn');

  if (mobileToggle && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('open');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // 3. SMOOTH SCROLLING WITH OFFSET
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 4. INTERSECTION OBSERVER FOR FADE-IN
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-fade');
  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 7. MANIFESTO VERBS INTERACTIVITY
  // ==========================================
  const verbs = document.querySelectorAll('.manifesto-verb');
  if (verbs.length > 0) {
    let currentVerb = 0;
    setInterval(() => {
      verbs.forEach(v => v.classList.remove('active'));
      verbs[currentVerb].classList.add('active');
      currentVerb = (currentVerb + 1) % verbs.length;
    }, 1800);
  }

  // ==========================================
  // 7.5. PROJECTS CATEGORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // ==========================================
  // 8. CONTACT FORM SUBMISSION (FORMSPREE)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedbackSuccess = document.getElementById('formSuccess');
  const feedbackError = document.getElementById('formError');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const origBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation:spin 1s linear infinite;width:18px;height:18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
        </svg>
        <span>Enviando...</span>
      `;

      if (feedbackSuccess) feedbackSuccess.style.display = 'none';
      if (feedbackError) feedbackError.style.display = 'none';

      const formData = {
        name: document.getElementById('userName')?.value || '',
        email: document.getElementById('userEmail')?.value || '',
        message: document.getElementById('userMessage')?.value || '',
        _subject: `Consulta Portfolio ARENAS®: ${document.getElementById('userName')?.value || 'Nuevo Lead'}`
      };

      try {
        const response = await fetch('https://formspree.io/f/xgopbylj', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          contactForm.reset();
          if (feedbackSuccess) {
            feedbackSuccess.style.display = 'flex';
            setTimeout(() => {
              feedbackSuccess.style.display = 'none';
            }, 6000);
          }
        } else {
          throw new Error('Servidor devolvió un estado incorrecto.');
        }
      } catch (err) {
        if (feedbackError) {
          feedbackError.style.display = 'flex';
          setTimeout(() => {
            feedbackError.style.display = 'none';
          }, 6000);
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
      }
    });
  }

  // ==========================================
  // 9. BACKGROUND MUSIC AMBIENT TOGGLE
  // ==========================================
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  if (bgMusic && musicToggle) {
    bgMusic.volume = 0.4;
    let isPlaying = false;

    const togglePlayback = () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          isPlaying = true;
          musicToggle.classList.add('playing');
        }).catch(err => {
          console.warn('Reproducción de audio bloqueada hasta interacción directa:', err);
        });
      } else {
        bgMusic.pause();
        isPlaying = false;
        musicToggle.classList.remove('playing');
      }
    };

    musicToggle.addEventListener('click', togglePlayback);
  }
});
