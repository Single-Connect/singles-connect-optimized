# Single-Connect Optimierung - TODO Liste

## Phase 1: Design-System ✅ ABGESCHLOSSEN
- [x] Farbenfrohe Icons für Navigation (Gifts, Pläne, Berater, Produkte, Shop, Heute, Astrologie, Erfolge)
- [x] Fliegende Herzen-Animation auf allen Seiten
- [x] Bessere Typografie und Lesbarkeit (Poppins Font, Pink/Purple/Orange Theme)
- [x] Responsive Design optimiert
- [x] Gradient Backgrounds und Animationen

## Phase 2: Profil-Bearbeitung ✅ IN ARBEIT
- [x] Profil-Seite erstellt
- [x] Geburtsdatum editierbar (mit Datepicker)
- [x] Sternzeichen automatisch berechnet (Krebs ♋)
- [x] Alter automatisch berechnet
- [x] Name editierbar
- [x] Bio editierbar
- [x] Interessen/Hobbys editierbar
- [x] tRPC Backend-Integration
- [ ] Profilbild hochladen (S3 Integration) - TODO
- [ ] Haarfarbe, Größe, Gewicht editierbar - TODO
- [ ] Herkunft editierbar - TODO

## Phase 3: Intelligenter Produkt-Berater
- [ ] AI-Integration (OpenAI GPT-4)
- [ ] Kontext-bewusste Produktempfehlungen
- [ ] Affiliate-Links Integration (Amazon, Douglas, Zalando)
- [ ] Produkt-Kategorien (Kosmetik, Mode, Geschenke, Elektronik)
- [ ] Personalisierte Empfehlungen basierend auf Alter, Geschlecht, Interessen
- [ ] Chat-Historie speichern
- [ ] Produkt-Bilder anzeigen

## Phase 4: Geschenke-Shop
- [ ] Geschenke-Katalog erstellen
- [ ] Blumen (Fleurop Integration)
- [ ] Pralinen/Schokolade
- [ ] Schmuck
- [ ] Parfüm
- [ ] Teddybären
- [ ] Digitale Geschenke (Spotify, Netflix, Amazon Gutscheine)
- [ ] Geschenk-Versand-Integration
- [ ] Geschenk-Historie
- [ ] Geschenk-Benachrichtigungen

## Phase 5: Trainings- und Ernährungspläne
- [ ] Bessere Lesbarkeit (dunkle Schrift auf hellem Hintergrund)
- [ ] Farbige Akzente
- [ ] Icons für Übungen und Mahlzeiten
- [ ] Fortschritts-Tracking
- [ ] Kalender-Ansicht
- [ ] PDF-Export

## Phase 6: Gamification
- [ ] Daily Login Rewards (Coins)
- [ ] Streak Counter (Tage in Folge eingeloggt)
- [ ] Level-System (XP sammeln)
- [ ] Achievements/Badges (z.B. "Erste Match", "10 Swipes", "Profil vervollständigt")
- [ ] Challenges (z.B. "Swipe 10 Profile heute")
- [ ] Leaderboards (optional, nur für Interessierte)
- [ ] Punkte-System
- [ ] Unlockable Content

## Phase 7: Social Features
- [ ] Stories (wie Instagram)
- [ ] Voice Messages
- [ ] Video-Calls (WebRTC)
- [ ] Gemeinsame Playlists
- [ ] Spiele (Wahrheit oder Pflicht, Quizze)
- [ ] Live-Events

## Phase 8: Push-Benachrichtigungen
- [ ] Neue Matches
- [ ] Neue Nachrichten
- [ ] Jemand hat dich geliked
- [ ] Daily Reminder
- [ ] Event-Erinnerungen
- [ ] Geschenke erhalten

## Phase 9: Monetarisierung
- [ ] Affiliate-Links Tracking
- [ ] Geschenke-Provision (10-20% Markup)
- [ ] Premium-Features (Unbegrenzte Swipes, Boost, Super-Likes)
- [ ] Event-Tickets
- [ ] Werbung (optional, nur für Free-User)

## Phase 10: Admin-Dashboard
- [ ] Nutzer-Verwaltung
- [ ] VIP-Status vergeben
- [ ] Coins hinzufügen
- [ ] Statistiken (Neue Nutzer, Nachrichten, Umsatz)
- [ ] VIP-Codes erstellen und verwalten
- [ ] Content-Moderation

## Datenbank-Schema ✅ ABGESCHLOSSEN
- [x] users Tabelle erweitert (43 Spalten: birth_date, zodiac_sign, profile_photo_url, coins, level, xp, etc.)
- [x] gifts Tabelle (11 Spalten)
- [x] achievements Tabelle (9 Spalten)
- [x] daily_rewards Tabelle (6 Spalten)
- [x] products Tabelle (12 Spalten)
- [x] chat_history Tabelle (6 Spalten)
- [x] swipes Tabelle (5 Spalten)
- [x] matches Tabelle (5 Spalten)
- [x] vip_codes Tabelle (9 Spalten)
- [x] activities Tabelle (17 Spalten)
- [x] activity_participants Tabelle (5 Spalten)
- [x] notifications Tabelle (8 Spalten)

## Technische Verbesserungen
- [ ] S3 File Upload für Profilbilder
- [ ] OpenAI API Integration
- [ ] Affiliate-Links Tracking
- [ ] WebRTC für Video-Calls
- [ ] Push-Notifications (Web Push API)
- [ ] Caching optimieren
- [ ] Performance-Optimierung
- [ ] SEO-Optimierung

## Testing
- [ ] Profil-Bearbeitung testen
- [ ] Produkt-Berater testen
- [ ] Geschenke-Shop testen
- [ ] Gamification testen
- [ ] Mobile Responsive testen
- [ ] Cross-Browser Testing

## Deployment
- [ ] GitHub Repository erstellen
- [ ] Vercel Deployment
- [ ] Domain konfigurieren (single-connect.com)
- [ ] SSL-Zertifikat
- [ ] Supabase Verbindung
- [ ] Environment Variables setzen

---

**Status:** 🚀 IN ARBEIT - Phase 1 & 2 teilweise abgeschlossen
**Erstellt am:** 16.11.2025
**Letzte Aktualisierung:** 16.11.2025 23:30 Uhr

**Fertiggestellt:**
- ✅ Datenbank-Schema (12 Tabellen)
- ✅ Design-System (Pink/Purple/Orange)
- ✅ Fliegende Herzen-Animation
- ✅ Landing Page
- ✅ Swipe-Seite
- ✅ Profil-Seite mit Bearbeitung
- ✅ tRPC Backend (Profile, Swipe, Coins, Admin)

**Als Nächstes (DIESE NACHT!):**
- [x] Gamification-System (Daily Rewards, Achievements, Levels, Streak)
- [x] Chat-System mit Echtzeit-Nachrichten
- [x] Matches-Übersicht und Match-Details
- [x] Compatibility Quiz (10 Fragen)
- [ ] Premium-Features (Who Liked Me, Boost, Unlimited Swipes) - IN ARBEIT
- [ ] Advanced Filters (Religion, Kinder, etc.) - TODO
- [ ] Question Game (Spielerisch kennenlernen) - TODO
- [ ] Admin-Account mit unbegrenztem Zugriff - IN ARBEIT
- [ ] Deployment auf www.single-connect.com - TODO


---

## 🚨 KRITISCHE BUGS (SOFORT FIXEN!) 🚨

- [x] **Landing Page: Fake-Statistiken entfernen** (10.000+ Singles, 50.000+ Matches, 1.000+ Events, 98% Zufriedenheit)
- [x] **Landing Page: Durch ehrliche Marketing-Texte oder Ziele ersetzen**
- [ ] **Passwort-Registrierung: "Password does not match" Fehler beheben**
- [ ] **Admin-Zugang: Sicherstellen dass paco.miguel.hartmann@gmx.at Admin-Rechte bekommt**
- [ ] **Registrierung testen: Für normale Kunden funktionsfähig machen**
- [ ] **OAuth Redirect-URI: Alle 4 Domains registrieren**

**Hinzugefügt am:** 20.11.2025 01:05 Uhr
- [ ] **KRITISCH: www.single-connect.com leitet direkt zu Manus OAuth statt Landing Page zu zeigen**
