
  
  
  
  
  // Loading screen logic
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('loaded');
  }
  
  // Verzögern Sie die Cursor-Initialisierung, um sicherzustellen, dass GSAP geladen ist
setTimeout(() => {
  if (window.gsap) {
    initCursor(window.gsap);
  } else {
    import("/node_modules/gsap/dist/gsap.min.js")
  .then(() => {
    if (window.gsap) {
      initCursor(window.gsap);
    } else {
      console.error("GSAP not found after import");
    }
  })
  .catch(() => {
    console.error("GSAP could not be loaded");
  });
  }
}, 500);
  
  // Setup sidebar and scrolling effects
  setupSidebar();
  setupSmoothScrolling();

// Wir warten, bis das gesamte HTML geladen ist. Das ist besser als ein fester Timeout.
document.addEventListener('DOMContentLoaded', () => {
  // Prüfen, ob das GSAP-Objekt vom CDN-Skript global verfügbar gemacht wurde.
  if (typeof gsap !== 'undefined') {
    // Wenn ja, führen wir alle unsere Initialisierungsfunktionen aus.
    initCursor();
    setupSidebar();
    setupSmoothScrolling();
    
    // Loading screen logic
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('loaded');
    }

  } else {
    // Wenn GSAP nicht gefunden wurde, geben wir eine klare Fehlermeldung aus.
    console.error("GSAP konnte nicht vom CDN geladen werden. Cursor-Animationen sind deaktiviert.");
  }
});


// Custom cursor initialization function
function initCursor() {
  // HINWEIS: Wir greifen hier direkt auf das globale 'gsap'-Objekt zu.
  // Du musst es nicht mehr als Parameter übergeben.
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
  const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const screenWidth = window.innerWidth;
  
  // Device has mouse capability if it has fine pointer control AND hover capability
  // This works for: desktop PCs, laptops (even with touchscreen), tablets with mouse
  // Excludes: pure touch devices (smartphones, tablets without mouse)
  const hasMouseCapability = hasPointer && hasHover;
  


  // Check if GSAP is working properly
  const gsapWorking = typeof gsap !== 'undefined' && gsap.to;
  
  
  // Force enable for testing - remove this later
  const forceEnable = screenWidth >= 1000; // Temporary force enable for laptop screens
  
  // Only enable custom cursor if device has mouse capability and GSAP is working
  if ((hasMouseCapability || forceEnable) && gsapWorking) {
    // Hide the default cursor everywhere with !important override
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
    
    // Make sure cursor is visible with force styles
    mouseCursor.style.display = 'block';
    mouseCursor.style.visibility = 'visible';
    mouseCursor.style.opacity = '1';
    mouseCursor.style.pointerEvents = 'none';
    mouseCursor.style.position = 'fixed';
    mouseCursor.style.zIndex = '9999';
    mouseCursor.style.width = '20px';
    mouseCursor.style.height = '20px';
    mouseCursor.style.border = '3px solid white';
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


    const cursor = (e) => {
      try {
        gsap.to(mouseCursor, {
          duration: 0.2,
          x: e.clientX,
          y: e.clientY,
        });
      } catch (error) {
        console.error("GSAP cursor animation error:", error);
      }
    };
    window.addEventListener("mousemove", cursor);

    // Add hover effects to all interactive elements
    interactiveElements.forEach((element, index) => {
      element.addEventListener("mouseenter", () => {
        try {
          gsap.to(mouseCursor, {
            duration: 0.2,
            scale: 2.5,
          });
          mouseCursor.classList.add('hover');
        } catch (error) {
          console.error("GSAP element hover error:", error);
        }
      });
      element.addEventListener("mouseleave", () => {
        try {
          gsap.to(mouseCursor, {
            duration: 0.2,
            scale: 1,
          });
          mouseCursor.classList.remove('hover');
        } catch (error) {
          console.error("GSAP element leave error:", error);
        }
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
    // For devices without mouse capability or when GSAP doesn't work
    
    // Ensure the cursor element is hidden
    if (mouseCursor) {
      mouseCursor.style.display = 'none';
    }
    
    // Make sure default cursor is visible
    document.body.style.cursor = 'default';
    
    // If GSAP is not working, log the issue
    if (!gsapWorking) {
      console.warn('GSAP not available - falling back to default cursor');
    }
    
    if (!hasMouseCapability) {
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
