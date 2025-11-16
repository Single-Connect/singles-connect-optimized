# Single-Connect Optimierung - TODO Liste

## Phase 1: Design-System ✅ IN ARBEIT
- [ ] Farbenfrohe Icons für Navigation (Gifts, Pläne, Berater, Produkte, Shop, Heute, Astrologie, Erfolge)
- [ ] Fliegende Herzen-Animation auf allen Seiten
- [ ] Bessere Typografie und Lesbarkeit (kein weiß auf weiß)
- [ ] Responsive Design optimieren
- [ ] Navigation-Scroll-Problem beheben

## Phase 2: Profil-Bearbeitung
- [ ] Profilbild hochladen (S3 Integration)
- [ ] Geburtsdatum editierbar (20.07.1988)
- [ ] Sternzeichen editierbar (Krebs)
- [ ] Alter automatisch berechnen
- [ ] Name editierbar
- [ ] Bio editierbar
- [ ] Interessen/Hobbys editierbar
- [ ] Haarfarbe, Größe, Gewicht editierbar
- [ ] Herkunft editierbar
- [ ] Alle Profil-Daten speichern

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

## Datenbank-Schema
- [ ] users Tabelle erweitern (birth_date, zodiac_sign, profile_photo_url)
- [ ] gifts Tabelle (id, sender_id, receiver_id, gift_type, gift_data, created_at)
- [ ] achievements Tabelle (id, user_id, achievement_type, unlocked_at)
- [ ] daily_rewards Tabelle (id, user_id, last_claim_date, streak_count)
- [ ] products Tabelle (id, name, description, price, affiliate_link, category)
- [ ] chat_history Tabelle (id, user_id, message, role, created_at)

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

**Status:** 🚀 IN ARBEIT
**Erstellt am:** 16.11.2025
**Letzte Aktualisierung:** 16.11.2025
