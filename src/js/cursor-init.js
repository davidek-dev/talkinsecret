import gsap from "gsap";

window.addEventListener("DOMContentLoaded", () => {
  initCursor();
  setupSidebar();
  setupSmoothScrolling();
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.classList.add('loaded');
});

// Custom cursor initialization function
function initCursor() {
  const mouseCursor = document.querySelector(".cursor");
  const isNetlifyDev = window.location.port === "8888";
  const debug = window.location.search.includes('cursorDebug=1');
  const forceHover = window.location.search.includes('cursorForceHover=1');
  const BASE_SIZE = 20;
  const HOVER_SCALE = 1.9; // roughly equivalent to 20px -> ~38px visual size

  if (!mouseCursor) {
    console.warn("Cursor element nicht gefunden");
    return;
  }

  // Add dev-mode class if we're in Netlify Dev
  if (isNetlifyDev) {
    document.body.classList.add('dev-mode');
  }

  // Check if the device has mouse/pointer capability
  const hasPointer = window.matchMedia('(pointer: fine)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const screenWidth = window.innerWidth;
  const hasMouseCapability = hasPointer && hasHover;
  const gsapWorking = typeof gsap !== 'undefined' && gsap.to;
  const forceEnable = screenWidth >= 1000; // enable on most desktops

  if (hasMouseCapability || forceEnable) {
    document.body.style.cursor = 'none';

    // Add comprehensive CSS to hide all cursor types
    const style = document.createElement('style');
    style.textContent = `
      #main-content, #main-content * { cursor: none !important; }
      input:focus, textarea:focus, select:focus { cursor: none !important; }
    `;
    document.head.appendChild(style);

  // Make sure cursor is visible with force styles (wie im alten Code)
    mouseCursor.style.display = 'block';
    mouseCursor.style.visibility = 'visible';
    mouseCursor.style.opacity = '1';
    mouseCursor.style.pointerEvents = 'none';
    mouseCursor.style.position = 'fixed';
    mouseCursor.style.zIndex = '9999';
  mouseCursor.style.width = `${BASE_SIZE}px`;
  mouseCursor.style.height = `${BASE_SIZE}px`;
    mouseCursor.style.border = '3px solid white';
    mouseCursor.style.background = 'transparent';
    mouseCursor.style.borderRadius = '50%';
    mouseCursor.style.mixBlendMode = 'difference';
  mouseCursor.style.transition = 'transform 0.2s';
  mouseCursor.style.transform = 'translate(-50%, -50%)';
  mouseCursor.style.transformOrigin = 'center center';
  mouseCursor.style.willChange = 'transform, width, height';

    // Interactive selector and helpers
    const INTERACTIVE_SELECTOR = [
      // Native interactive controls
      'a', 'area', 'button', 'input', 'textarea', 'select', 'label', 'summary', 'details',
      '[role="button"]',
      '[role="link"]',
      // Explicit opt-in via classes/data-attrs
      '.cursor-pointer', '.clickable', '.btn', '.interactive', '[data-clickable]', '[data-action]', '[href]',
      // Player and nav controls used im Projekt
      '.play-button', '.pause-button', '.next-button', '.prev-button',
      '.volume-control', '.progress-bar', '.seek-bar',
      '.nav-link', '.menu-item', '.toggle', '.switch'
    ].join(', ');

    const hasPositiveTabIndex = (el) => {
      const ti = el.getAttribute && el.getAttribute('tabindex');
      return ti !== null && ti !== undefined && ti !== '' && ti !== '-1';
    };

    const isInteractive = (el) => {
      if (!el || !(el instanceof Element)) return false;
      if (el.matches(INTERACTIVE_SELECTOR) || el.closest(INTERACTIVE_SELECTOR)) return true;
      // CSS cursor heuristic
      try {
        const cs = window.getComputedStyle(el);
        if (cs && (cs.cursor === 'pointer' || cs.cursor === 'grab' || cs.cursor === 'crosshair')) return true;
      } catch {}
      // Focusable via positive tabindex
      if (hasPositiveTabIndex(el)) return true;
      return false;
    };

    // Set initial position to center until first move
    const setInitial = () => {
      if (gsapWorking) {
        gsap.set(mouseCursor, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50 });
      } else {
        mouseCursor.style.transform = `translate(calc(${window.innerWidth / 2}px - 50%), calc(${window.innerHeight / 2}px - 50%))`;
      }
    };
    setInitial();

    // Unified move handler with GSAP fallback
    let currentScale = 1;
    const handleMove = (e) => {
      const x = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
      const y = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
      if (gsapWorking) {
        gsap.to(mouseCursor, {
          duration: 0.2,
          x,
          y,
          xPercent: -50,
          yPercent: -50,
          // keep scale consistent with current hover state
          scale: isHover ? HOVER_SCALE : 1,
          overwrite: true,
        });
      } else {
        // Lightweight JS fallback without GSAP
        requestAnimationFrame(() => {
          mouseCursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${currentScale})`;
        });
      }
    };

    // Cursor folgt der Maus (robust auf verschiedenen Browsern)
    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('pointermove', handleMove, { passive: true });

    // Helpers for hover animations with GSAP fallback
    let isHover = false;
    const grow = () => {
      if (isHover) return;
      isHover = true;
      mouseCursor.classList.add('hover');
      if (gsapWorking) {
        gsap.killTweensOf(mouseCursor);
        gsap.to(mouseCursor, { duration: 0.28, ease: 'power2.out', scale: HOVER_SCALE, overwrite: true });
      } else {
        currentScale = HOVER_SCALE;
      }
      if (debug) console.debug('[cursor] grow -> scale', HOVER_SCALE);
    };
    const shrink = () => {
      if (!isHover) return;
      isHover = false;
      mouseCursor.classList.remove('hover');
      if (gsapWorking) {
        gsap.killTweensOf(mouseCursor);
        gsap.to(mouseCursor, { duration: 0.2, ease: 'power2.out', scale: 1, overwrite: true });
      } else {
        currentScale = 1;
      }
      if (debug) console.debug('[cursor] shrink -> scale', 1);
    };

    // Optional: force hover state via query param for debugging
    if (forceHover) {
      grow();
    }

    // Add hover effects to all interactive elements present at init (progressive enhancement)
    document.querySelectorAll(INTERACTIVE_SELECTOR).forEach((element) => {
      element.addEventListener('mouseenter', grow);
      element.addEventListener('mouseleave', (e) => {
        // Only shrink when truly leaving the interactive region
        if (!isInteractive(e.relatedTarget)) shrink();
      });
    });

    // Robust pointer-based delegation for desktop hover
    document.addEventListener('pointerover', (e) => {
      if ((e.target instanceof Element) && !e.target.closest('.cursor') && isInteractive(e.target)) {
        if (debug) console.debug('[cursor] pointerover on', e.target);
        grow();
      }
    }, true);
    document.addEventListener('pointerout', (e) => {
      // Only shrink if we leave all interactive elements
      if (!(e.relatedTarget instanceof Element) || (!e.relatedTarget.closest('.cursor') && !isInteractive(e.relatedTarget))) {
        if (debug) console.debug('[cursor] pointerout -> shrink');
        shrink();
      }
    }, true);

    // Fallback: mouseover/mouseout for environments where pointer events are flaky
    document.addEventListener('mouseover', (e) => {
      if ((e.target instanceof Element) && !e.target.closest('.cursor') && isInteractive(e.target)) {
        if (debug) console.debug('[cursor] mouseover on', e.target);
        grow();
      }
    }, true);
    document.addEventListener('mouseout', (e) => {
      if (!(e.relatedTarget instanceof Element) || (!e.relatedTarget.closest('.cursor') && !isInteractive(e.relatedTarget))) {
        if (debug) console.debug('[cursor] mouseout -> shrink');
        shrink();
      }
    }, true);

    // Continuous check during movement to catch edge cases (e.g., fast moves over nested elements)
    // Continuous check: derive element under pointer using elementFromPoint for accuracy
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX, y = e.clientY;
      const el = document.elementFromPoint(x, y);
      if (el && el.closest && el.closest('.cursor')) return;
      if (isInteractive(el)) {
        if (debug) console.debug('[cursor] move over interactive', el);
        grow();
      } else {
        if (debug) console.debug('[cursor] move over non-interactive', el);
        shrink();
      }
    }, { passive: true });

    // Ensure base size when leaving window or tab loses focus
    window.addEventListener('mouseout', (e) => { if (!e.relatedTarget) shrink(); });
    window.addEventListener('blur', shrink);
  } else {
    // Geräte ohne Maus: Standardcursor verwenden
    if (mouseCursor) mouseCursor.style.display = 'none';
    document.body.style.cursor = 'default';
  }
}

// Sidebar highlight based on scroll position
function setupSidebar() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('#sidebar li');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight/3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(li => {
      li.classList.remove('active');
      if (li.querySelector('a').getAttribute('href') === `#${current}`) {
        li.classList.add('active');
      }
    });
  });
}

// Smooth scrolling for internal links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}