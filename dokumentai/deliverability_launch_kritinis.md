# Email deliverability — LAUNCH KRITINIS (S189)

**Statusas:** Atviras klausimas, reikia sprendimo prieš launch (2026-10-01).
**Aptikta:** S189 E2E teste — Sender transactional laiškas nuėjo į SPAM (terra@gyvunai.lt / Gmail).

---

## Kas jau GERAI (patvirtinta recon)

### Sender domeno autentifikacija — VISKAS ŽALIA
- `domain_verified: 1` ✅
- `spf_verified: 1` ✅
- `dkim_verified: 1` ✅
- `dmarc: 1` ✅
- SPF įrašas: `v=spf1 a mx include:spf.serveriai.lt include:mailgun.org include:spf.sendersrv.com include:sendersrv.com ~all`
- Domenas: petshop.lt (id eE9p2l), pradėtas 2026-01-04

**Išvada:** spam NE dėl SPF/DKIM/DMARC — tie sukonfigūruoti teisingai.

### WP Mail SMTP (kritinis kelias) — PATVIRTINTA SVARU
- Mailer: smtp ✅
- Host: isopas.serveriai.lt:465 SSL ✅
- From: Petshop.lt <terra@petshop.lt> ✅
- Testinis "užsakymo patvirtinimo" laiškas išsiųstas (wp_mail_sent: true)
- Testinis "uzsakymo patvirtinimo" laiskas -> ATEJO I INBOX (2026-07-14 patvirtino Raimis)

**KRITINE ISVADA:** C-hibrido routing veikia. Kritiniai laiskai (uzsakymai, magic link,
slaptazodzio atkurimas, saskaitos) per SMTP eina i INBOX. Sender spam problema licia
TIK marketinga/lifecycle. Deliverability rizika: nuo kritinio sumazinta iki vidutinio.

---

## Galimos spam priežastys (Sender pusė)

1. **Naujo domeno reputacija.** petshop.lt per Sender pradėtas 2026-01, maža siuntimo istorija. Gmail "nepasitiki" naujais siuntėjais — reikia warm-up (palaipsniui didinti siuntimo apimtį).

2. **Tracking subdomenas nesukonfigūruotas:**
   - `has_tracking_cname: 0`
   - `subdomain_ssl_working: false`
   - Sender rekomenduoja tracking CNAME (pvz. link.petshop.lt) — be jo nuorodos rodo sendersrv.com domeną, kas mažina pasitikėjimą.

3. **Testinio laiško turinys.** Pirmas testas buvo primityvus (`<p>test</p>`, subject "E2E test") — spam filtrai baudžia tuščią/testinį turinį. Realūs laiškai su normaliu turiniu gali elgtis geriau.

---

## Sprendimo planas (prieš launch)

### P0 — Patvirtinti routing ATLIKTA (2026-07-14)
- [x] SMTP "uzsakymo patvirtinimo" laiskas -> INBOX
- Rezultatas: C-hibrido routing apsaugo kritinius laiskus. Sender spam = tik marketingas.

### P1 — Sender tracking subdomenas
- [ ] Sukonfigūruoti tracking CNAME (link.petshop.lt → sendersrv.com) per serveriai.lt DNS
- [ ] Patikrinti kad subdomain_ssl_working tampa true

### P1 — Warm-up strategija (rugpjūtis-rugsėjis)
- Launch bangų planas kaip tik tinka warm-up'ui: canary30 → founding213 → aktyviausi718 → banga1 → banga2
- Palaipsniui didinama apimtis natūraliai šildo domeną
- Nesiųsti didelės masės iškart (spam trigger)

### P2 — Postmaster tools
- [ ] Google Postmaster Tools (postmaster.google.com) — petshop.lt domeno reputacijos monitoringas
- [ ] Microsoft SNDS (jei daug outlook/hotmail klientų)

### P2 — Turinio higienos
- Vengti spam trigger žodžių subject'e (NEMOKAMAI, !!!, VIP)
- Text + HTML versijos (ne tik HTML)
- Aiškus unsubscribe (Sender prideda automatiškai)
- Tinkamas text/image santykis

---

## Ryšys su email routing sprendimu (C hibridas)

M�sų anksčiau užrakintas sprendimas KAIP TIK apsaugo kritinius laiškus:
- **WC → SMTP** (isopas.serveriai.lt): užsakymai, magic link, password reset, sąskaitos
- **Sender**: marketingas, lifecycle, refill priminimai

Jei SMTP deliverability gera (P0 patikra), tada:
- Kritiniai laiškai (klientas PRIVALO gauti) — saugūs per SMTP
- Sender spam problema — tik marketingui, sprendžiama warm-up'u + tracking subdomenu

Tai sumažina spam problemos kritiškumą — bet TIK jei SMTP kelias švarus.
