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
  const forceEnable = screenWidth >= 1000; // Temporary force enable for laptop screens

  if ((hasMouseCapability || forceEnable) && gsapWorking) {
    document.body.style.cursor = 'none';

    // Add comprehensive CSS to hide all cursor types
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: none !important;
      }
      a, button, input, textarea, select, 
      [role="button"], [onclick], 
      .cursor-pointer, [type="submit"], 
      [type="button"], [type="reset"] {
        cursor: none !important;
      }
      input:focus, textarea:focus, select:focus {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    // Make sure cursor is visible with force styles (wie im alten Code)
    mouseCursor.style.display = 'block';
    mouseCursor.style.visibility = 'visible';
    mouseCursor.style.opacity = '1';
    mouseCursor.style.pointerEvents = 'none';
    mouseCursor.style.position = 'fixed';
    mouseCursor.style.zIndex = '9999';
    mouseCursor.style.width = '20px';
    mouseCursor.style.height = '20px';
    mouseCursor.style.border = '3px solid white';
    mouseCursor.style.background = 'transparent';
    mouseCursor.style.borderRadius = '50%';
    mouseCursor.style.mixBlendMode = 'difference';
    mouseCursor.style.transition = 'width 0.2s, height 0.2s';

    // Select all clickable/interactive elements
    const interactiveElements = document.querySelectorAll(`
      a, button, input, textarea, select,
      [role="button"], [onclick], [tabindex],
      .cursor-pointer, [type="submit"], [type="button"], [type="reset"],
      [data-clickable], .clickable, .btn,
      .play-button, .pause-button, .next-button, .prev-button,
      .volume-control, .progress-bar, .seek-bar,
      .nav-link, .menu-item, .toggle, .switch,
      [href], [data-action], .interactive
    `);

    // Cursor folgt der Maus
    window.addEventListener("mousemove", (e) => {
      gsap.to(mouseCursor, {
        duration: 0.2,
        x: e.clientX,
        y: e.clientY,
      });
    });

    // Add hover effects to all interactive elements
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(mouseCursor, {
          duration: 0.2,
          scale: 2.5,
        });
        mouseCursor.classList.add('hover');
      });
      element.addEventListener("mouseleave", () => {
        gsap.to(mouseCursor, {
          duration: 0.2,
          scale: 1,
        });
        mouseCursor.classList.remove('hover');
      });
    });

    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      const isInteractive = target.matches(`
        a, button, input, textarea, select,
        [role="button"], [onclick], [tabindex],
        .cursor-pointer, [type="submit"], [type="button"], [type="reset"],
        [data-clickable], .clickable, .btn,
        .play-button, .pause-button, .next-button, .prev-button,
        .volume-control, .progress-bar, .seek-bar,
        .nav-link, .menu-item, .toggle, .switch,
        [href], [data-action], .interactive
      `) || target.closest(`
        a, button, input, textarea, select,
        [role="button"], [onclick], [tabindex],
        .cursor-pointer, [type="submit"], [type="button"], [type="reset"],
        [data-clickable], .clickable, .btn,
        .play-button, .pause-button, .next-button, .prev-button,
        .volume-control, .progress-bar, .seek-bar,
        .nav-link, .menu-item, .toggle, .switch,
        [href], [data-action], .interactive
      `);
      if (!isInteractive) {
        gsap.to(mouseCursor, {
          duration: 0.2,
          scale: 1,
        });
        mouseCursor.classList.remove('hover');
      }
    });
  } else {
    // Für Geräte ohne Maus oder wenn GSAP nicht funktioniert
    if (mouseCursor) mouseCursor.style.display = 'none';
    document.body.style.cursor = 'default';
    if (!gsapWorking) {
      console.warn('GSAP not available - falling back to default cursor');
    }
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
      if (pageYOffset >= (sectionTop - sectionHeight/3)) {
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