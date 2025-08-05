# Music Player Deployment-Checkliste

## Pre-Deployment

- [ ] Audio-Dateien in web-optimierte Formate konvertieren (MP3, OGG, etc.)
- [ ] Album-Artwork (petrichor-cover.jpg) zu /public/images/ hinzufügen
- [ ] Streaming-Service-URLs in der Playlist aktualisieren
- [ ] Alle Funktionen lokal mit `netlify dev` testen
- [ ] Responsive Design auf mobilen Geräten überprüfen
- [ ] Umgebungsvariablen in Netlify konfigurieren (AUDIO_SECRET_KEY, NETLIFY_SITE_URL)
- [ ] Laufzeitfehler in der Konsole überprüfen

## Post-Deployment

- [ ] Audio-Streaming auf verschiedenen Geräten/Browsern testen
- [ ] Netlify-Funktionsprotokolle auf Fehler überprüfen
- [ ] Ladegeschwindigkeit mit großen Audio-Dateien überprüfen
- [ ] SEO-Metadaten korrekt eingerichtet
- [ ] CORS-Header für Audio-Streaming überprüfen
- [ ] Google Analytics (falls verwendet) für Musik-Events überprüfen

## Rechtliche Überlegungen

- [ ] Sicherstellen, dass Rechte zum Streamen der Audio-Dateien vorliegen
- [ ] Gegebenenfalls grundlegendes DRM implementieren
- [ ] Entsprechende Copyright-Hinweise hinzufügen
- [ ] Nutzungsbedingungen für Audio-Streaming einbeziehen

## Browser-Kompatibilität

✅ Chrome/Edge (Chromium)  
✅ Firefox  
✅ Safari (iOS/macOS)  
⚠️ Internet Explorer (eingeschränkte Unterstützung)

## Barrierefreiheit

✅ ARIA-Labels für Screen-Reader  
✅ Tastaturnavigation  
✅ Hochkontrastmodus-Kompatibilität  
✅ Semantische HTML-Struktur  
✅ Fokus-Management

## Fehlerbehebung

Häufige Probleme:
- Audio wird nicht abgespielt: CORS-Header und Dateipfade überprüfen
- Langsames Laden: Audio-Komprimierung und CDN in Betracht ziehen
- Mobile Probleme: Autoplay-Richtlinien auf iOS/Android testen
- Funktions-Timeout: Dateistreaming-Logik optimieren

Debug-Modus:
`?debug=true` zur URL hinzufügen, um die Konsolenprotokollierung im Player zu aktivieren.
