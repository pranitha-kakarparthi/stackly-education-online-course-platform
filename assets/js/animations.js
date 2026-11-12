/**
 * Stackly Learn - High-Impact Lightweight Animation Engine
 * Powered by GSAP & ScrollTrigger with Accessibility & Performance Controls
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Animation System
  function initAnimations() {
    if (prefersReducedMotion) {
      console.log('Reduced motion preferred: animations disabled for accessibility.');
      document.documentElement.classList.add('reduced-motion');
      // Ensure all hidden/reveal elements are visible
      document.querySelectorAll('.kinetic-word, .scroll-reveal, .self-drawing-path').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.strokeDashoffset = '0';
      });
      initBackToTop();
      return;
    }

    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Falling back to CSS transitions.');
      initBackToTop();
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initKineticTypography();
    initScrollytelling();
    initParallaxDepth();
    initSelfDrawingSVG();
    initInteractiveMascot();
    initTactileInteractions();
    initBackToTop();
    initStaggeredWordReveal();
    initTypewriterEffect();
    initWordRotationFlip();
    initMaskedSlideUp();
    initKineticBadges();
  }

  // 1. KINETIC TYPOGRAPHY (Hero Section Staggered Masked Reveal)
  function initKineticTypography() {
    const headlines = document.querySelectorAll('.kinetic-headline');
    headlines.forEach(headline => {
      // Split words into masked wrappers if not already done
      if (!headline.classList.contains('is-split')) {
        const text = headline.textContent.trim();
        const words = text.split(/\s+/);
        headline.innerHTML = '';
        words.forEach(word => {
          const wrapper = document.createElement('span');
          wrapper.className = 'kinetic-word-mask';
          const inner = document.createElement('span');
          inner.className = 'kinetic-word';
          inner.textContent = word;
          
          // Check for highlight words
          if (word.toLowerCase().includes('succeed') || word.toLowerCase().includes('grow') || word.toLowerCase().includes('future') || word.toLowerCase().includes('empowering') || word.toLowerCase().includes('interactive')) {
            inner.classList.add('text-gradient-highlight');
          }

          wrapper.appendChild(inner);
          headline.appendChild(wrapper);
          headline.appendChild(document.createTextNode(' '));
        });
        headline.classList.add('is-split');
      }

      const words = headline.querySelectorAll('.kinetic-word');
      gsap.fromTo(
        words,
        { y: '115%', opacity: 0, rotate: 2 },
        {
          y: '0%',
          opacity: 1,
          rotate: 0,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.065,
          delay: 0.2
        }
      );
    });

    // Subtitle & CTAs fade-up
    gsap.fromTo(
      '.hero-fade-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
        stagger: 0.12,
        delay: 0.55
      }
    );
  }

  // 2. SCROLLYTELLING (Sequential Module & Card Reveals)
  function initScrollytelling() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Feature & Course Cards Reveal
    const revealSections = document.querySelectorAll('.stagger-reveal-group, .courses-grid, .features-grid, .bento-grid');
    revealSections.forEach(section => {
      const cards = section.querySelectorAll('.bento-card, .course-card, .feature-card, .stagger-item');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true
            },
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            stagger: 0.1
          }
        );
      }
    });

    // Single item scroll reveals
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      gsap.fromTo(
        el,
        { y: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    });
  }

  // 3. PARALLAX DEPTH (Floating Shapes & Background Orbs)
  function initParallaxDepth() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Parallax background floating shapes
    document.querySelectorAll('.parallax-shape').forEach((shape, index) => {
      const speed = (index % 2 === 0 ? 1 : -1) * (15 + (index * 8));
      gsap.to(shape, {
        scrollTrigger: {
          trigger: shape.closest('section') || document.body,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        },
        y: speed,
        ease: 'none'
      });
    });

    // Hero background subtle zoom parallax (multi-page support)
    const heroBgs = document.querySelectorAll('.hero-parallax-bg');
    heroBgs.forEach((heroBg) => {
      const section = heroBg.closest('section') || heroBg.parentElement;
      gsap.to(heroBg, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        yPercent: 14,
        scale: 1.05,
        ease: 'none'
      });
    });
  }

  // 4. SELF-DRAWING LINE ART (Roadmap & Journey Path)
  function initSelfDrawingSVG() {
    if (typeof ScrollTrigger === 'undefined') return;

    const paths = document.querySelectorAll('.self-drawing-path');
    paths.forEach(path => {
      const length = path.getTotalLength ? path.getTotalLength() : 800;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      gsap.to(path, {
        scrollTrigger: {
          trigger: path.closest('svg') || path,
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: 1.5
        },
        strokeDashoffset: 0,
        ease: 'power1.inOut'
      });
    });
  }

  // 5. INTERACTIVE MASCOT (Floating Idle Motion & Reactive Physics)
  function initInteractiveMascot() {
    const mascot = document.getElementById('interactive-mascot');
    if (!mascot) return;

    // Smooth idle bobbing animation
    gsap.to(mascot, {
      y: -8,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Soft eye / accessory floating
    const mascotElements = mascot.querySelectorAll('.mascot-part-float');
    mascotElements.forEach((part, i) => {
      gsap.to(part, {
        y: -3,
        duration: 1.8 + (i * 0.3),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    // Interactive Hover & Click Physics
    let isBouncing = false;
    const speechBubble = document.getElementById('mascot-speech-bubble');

    mascot.addEventListener('mouseenter', () => {
      if (isBouncing) return;
      gsap.to(mascot, {
        scale: 1.08,
        rotate: 4,
        duration: 0.35,
        ease: 'back.out(2)'
      });
      if (speechBubble) {
        gsap.to(speechBubble, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' });
      }
    });

    mascot.addEventListener('mouseleave', () => {
      if (isBouncing) return;
      gsap.to(mascot, {
        scale: 1,
        rotate: 0,
        duration: 0.45,
        ease: 'power2.out'
      });
    });

    mascot.addEventListener('click', () => {
      isBouncing = true;
      gsap.timeline({
        onComplete: () => { isBouncing = false; }
      })
      .to(mascot, { scale: 0.92, rotate: -6, duration: 0.12, ease: 'power1.in' })
      .to(mascot, { scale: 1.15, rotate: 8, duration: 0.28, ease: 'elastic.out(1.2, 0.4)' })
      .to(mascot, { scale: 1, rotate: 0, duration: 0.4, ease: 'power2.out' });

      if (speechBubble) {
        const compliments = [
          "Ready to conquer your next lesson? 🚀",
          "Knowledge is your greatest superpower! 💡",
          "You're doing fantastic! Keep leveling up! ⭐",
          "120k+ learners are coding right now! 🔥"
        ];
        const randomQuote = compliments[Math.floor(Math.random() * compliments.length)];
        const textSpan = speechBubble.querySelector('.speech-text');
        if (textSpan) textSpan.textContent = randomQuote;
        gsap.fromTo(speechBubble, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
      }
    });
  }

  // 6. TACTILE MICRO-INTERACTIONS (Buttons & Cards Physics)
  function initTactileInteractions() {
    // Magnetic Spring Scale on Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.03, duration: 0.25, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, { scale: 0.97, duration: 0.1, ease: 'power1.in' });
      });
      btn.addEventListener('mouseup', () => {
        gsap.to(btn, { scale: 1.03, duration: 0.18, ease: 'back.out(2)' });
      });
    });

    // Course Cards Elevation & Border Glow
    const courseCards = document.querySelectorAll('.course-card, .bento-card');
    courseCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -6,
          duration: 0.35,
          ease: 'power2.out',
          boxShadow: '0 20px 35px -10px rgba(13, 148, 136, 0.18)'
        });
        const img = card.querySelector('img');
        if (img) {
          gsap.to(img, { scale: 1.04, duration: 0.4, ease: 'power2.out' });
        }
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        });
        const img = card.querySelector('img');
        if (img) {
          gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
        }
      });
    });

    // Animated Progress Bar Fills on Scroll
    const progressBars = document.querySelectorAll('.animated-progress-fill');
    progressBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-progress') || '75%';
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              once: true
            },
            width: targetWidth,
            duration: 1.2,
            ease: 'power2.out'
          }
        );
      } else {
        bar.style.width = targetWidth;
      }
    });
  }

  // 8. STAGGERED WORD / LETTER REVEAL
  function initStaggeredWordReveal() {
    const staggerEls = document.querySelectorAll('.stagger-words-reveal');
    staggerEls.forEach((el, elIndex) => {
      // If not already split into word wrappers
      if (!el.classList.contains('is-split')) {
        const textNodes = Array.from(el.childNodes);
        const fragment = document.createDocumentFragment();

        textNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(/(\s+)/);
            words.forEach(word => {
              if (word.trim().length === 0) {
                fragment.appendChild(document.createTextNode(word));
              } else {
                const wrap = document.createElement('span');
                wrap.className = 'stagger-word-wrap';
                const inner = document.createElement('span');
                inner.className = 'stagger-word-inner';
                inner.textContent = word;
                wrap.appendChild(inner);
                fragment.appendChild(wrap);
              }
            });
          } else {
            fragment.appendChild(node.cloneNode(true));
          }
        });

        el.innerHTML = '';
        el.appendChild(fragment);
        el.classList.add('is-split');
      }

      const inners = el.querySelectorAll('.stagger-word-inner');
      if (typeof gsap !== 'undefined') {
        gsap.to(inners, {
          y: '0%',
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.045,
          delay: 0.15 + (elIndex * 0.1)
        });
      } else {
        inners.forEach((item, i) => {
          setTimeout(() => {
            item.classList.add('is-revealed');
          }, 150 + (i * 45));
        });
      }
    });
  }

  // 9. TYPEWRITER EFFECT WITH BLINKING CURSOR
  function initTypewriterEffect() {
    const typewriterEls = document.querySelectorAll('.hero-typewriter');
    typewriterEls.forEach(el => {
      let words = [];
      try {
        const raw = el.getAttribute('data-typewriter-words');
        words = JSON.parse(raw);
      } catch (e) {
        words = ['Applied AI', 'Full-Stack Web', 'UI/UX Design', 'Cloud Systems'];
      }

      if (!words || words.length === 0) return;

      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      const typingSpeed = 80;
      const deletingSpeed = 40;
      const pauseEnd = 2000;
      const pauseStart = 400;

      const textSpan = el.querySelector('.hero-typewriter-text') || el;
      let cursorSpan = el.querySelector('.typewriter-cursor');
      if (!cursorSpan) {
        cursorSpan = document.createElement('span');
        cursorSpan.className = 'typewriter-cursor';
        cursorSpan.textContent = '|';
        cursorSpan.setAttribute('aria-hidden', 'true');
        el.appendChild(cursorSpan);
      }

      function typeCycle() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
          charIndex--;
          textSpan.textContent = currentWord.substring(0, charIndex);
        } else {
          charIndex++;
          textSpan.textContent = currentWord.substring(0, charIndex);
        }

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
          delay = pauseEnd;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = pauseStart;
        }

        setTimeout(typeCycle, delay);
      }

      setTimeout(typeCycle, 600);
    });
  }

  // 10. WORD ROTATION / 3D FLIP ANIMATION
  function initWordRotationFlip() {
    const flipWrappers = document.querySelectorAll('.word-flip-carousel');
    if (!flipWrappers.length) return;

    flipWrappers.forEach(carousel => {
      const inner = carousel.querySelector('.flip-words-inner');
      const words = Array.from(carousel.querySelectorAll('.flip-word'));
      if (!inner || words.length <= 1) return;

      let currentIndex = 0;
      const totalWords = words.length;

      // Accurately measure and dynamically apply width to carousel with safety padding
      function syncCarouselWidth(index) {
        const activeWord = words[index];
        if (!activeWord) return;
        
        // Measure unclipped rendered content width
        const rect = activeWord.getBoundingClientRect();
        const measuredWidth = Math.ceil(rect.width) || activeWord.scrollWidth || activeWord.offsetWidth;
        if (measuredWidth > 0) {
          // Add 8px safety buffer for font kerning, bold font weight, and italic terminals
          carousel.style.width = (measuredWidth + 8) + 'px';
        }
      }

      // Initial active state synchronization
      words.forEach((w, i) => {
        if (i === 0) {
          w.classList.add('active');
        } else {
          w.classList.remove('active');
        }
      });

      // Synchronize immediately and after web fonts settle
      syncCarouselWidth(0);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => syncCarouselWidth(0));
      }
      setTimeout(() => syncCarouselWidth(0), 60);
      setTimeout(() => syncCarouselWidth(0), 300);

      window.addEventListener('resize', () => {
        syncCarouselWidth(currentIndex);
      });

      setInterval(() => {
        currentIndex = (currentIndex + 1) % totalWords;
        inner.style.transform = `translateY(-${currentIndex * 1.25}em)`;
        
        words.forEach((w, i) => {
          if (i === currentIndex) {
            w.classList.add('active');
          } else {
            w.classList.remove('active');
          }
        });

        syncCarouselWidth(currentIndex);
      }, 2600);
    });
  }

  // 11. SMOOTH SLIDE-UP / MASKED TEXT REVEAL
  function initMaskedSlideUp() {
    const maskedTexts = document.querySelectorAll('.masked-reveal-text');
    if (maskedTexts.length === 0) return;

    if (typeof gsap !== 'undefined') {
      gsap.to(maskedTexts, {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.3
      });
    } else {
      maskedTexts.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('is-revealed');
        }, 200 + (index * 120));
      });
    }
  }

  // 12. KINETIC BADGES HOVER & TILT REACTION
  function initKineticBadges() {
    const badges = document.querySelectorAll('.kinetic-highlight-badge');
    badges.forEach(badge => {
      badge.addEventListener('mousemove', (e) => {
        const rect = badge.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        badge.style.transform = `translate(${x * 0.1}px, ${y * 0.1 - 3}px)`;
      });

      badge.addEventListener('mouseleave', () => {
        badge.style.transform = '';
      });
    });
  }

  // 7. BACK TO TOP BUTTON HANDLER
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top-btn';
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Scroll to top');
      btn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // Export to window
  window.StacklyAnimations = {
    init: initAnimations
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
