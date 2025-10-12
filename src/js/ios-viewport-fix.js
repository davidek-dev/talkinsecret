// iOS Safari URL-Bar Handler
// Verhindert dass Content unter der URL-Bar verschwindet

(function() {
  // Nur für iOS Safari ausführen
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (!isIOS) return;

  function updateViewportHeight() {
    // Berechne die tatsächliche Viewport-Höhe
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Für Safari: Berücksichtige die URL-Bar
    const realVh = window.visualViewport ? window.visualViewport.height * 0.01 : vh;
    document.documentElement.style.setProperty('--real-vh', `${realVh}px`);
  }

  // Initial setzen
  updateViewportHeight();

  // Bei Resize und Scroll aktualisieren
  window.addEventListener('resize', updateViewportHeight);
  window.addEventListener('orientationchange', updateViewportHeight);
  
  // Für iOS Safari URL-Bar
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateViewportHeight);
    window.visualViewport.addEventListener('scroll', updateViewportHeight);
  }

  // Nach kurzer Verzögerung nochmal aktualisieren (für langsame Geräte)
  setTimeout(updateViewportHeight, 500);
})();
