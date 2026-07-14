# STATE.md — petshop.lt migracija · MASTER INDEKSAS

> **Šitą failą Claude skaito PIRMĄ kiekvieną sesiją.** Tai indeksas + darbo taisyklės, ne turinio saugykla. Turinys — kituose failuose, čia tik nuorodos.
> Paskutinį kartą atnaujinta: **2026-07-14 vakaras** (po S191 — Pet Profile anketa (M7) gyva: ps_pets, REST CRUD, partial update, IDOR apsauga, pet_profile event'ai, 8/8 testų).

---

## 0. DARBO TAISYKLĖS (galioja VISADA — skaityk prieš dirbdamas)

- **„Darom lėtai, bet tvarkingai"** — tikslumas svarbiau už greitį.
- **Recon prieš veiksmą.** Niekada nespėti (ypač mappingo — 2× painiojosi). Tikrinti turinį/HTML/DB, ne prielaidas.
- **Vizuali/empirinė verifikacija prieš raportuojant „padaryta".** Dry-run skaičiai negarantuoja. Screenshot / HTML / DB patikra.
- **Kodas: full-file rewrites.** Jokių partial patch'ų, net 1 eilutės. Vienas pilnas failas per deploy.
- **Dokumentai: tik pilni failai, tik po darbo** (ne fragmentai, ne mid-conversation). Versijuoti (v1.3.45, ne perrašyti seno).
- **Deploy: dry-run → Raimis review → apply.** Destruktyviems — „taip" patvirtinimas + backup.
- **Anti-rabbit-hole:** po 2–3 fail'ų STOP + įvardink + siūlyk alternatyvą. Nemėtyti 10+ runs ant vienos detalės.
- **Komunikacija: lietuvių, terse.** Iš minimalaus prompto Claude išplečia pats.
- **Patvirtinta → IŠKART į repo/STATE** (ne sesijos gale — langas gali baigtis anksčiau).
- **Klaidas pripažinti tiesiai**, ne teisintis. Jei recon rodo neatitikimą — sakyk Raimiui prieš „padaryta".

**Sesijos pradžios protokolas:** (1) perskaityk STATE.md; (2) patikrink versijas §3 (ar TŽ/deployment_log repo = naujausi, jei abejoji — paklausk Raimio); (3) prisijunk prie tilto (§4 mechanika); (4) tęsk nuo §1.

---

## 1. KUR SUSTOTA

**Migracija ~87%. Internal launch 2026-10-01, kontraktinis 2026-10-15.**

**VISOS 5 RŪŠYS BAIGTOS ir gyvos** (dev): `/sunims/` (#70, 8 kort.), `/katems/` (#77, 8 kort.), `/grauzikams/` (#87, 4 kort.), `/pauksciams/` (#89, 3 kort.), `/zuvims/` (#93, 3 kort.). Landing epika UŽBAIGTA.

Karkasas pilnai config-driven, patikrintas 5 rūšims:
- Kortelių tinklelis: `pcl-cats-c{N}` klasė, N=min(kortelių,4) — 3/4/8 kortelių automatiškai.
- Maisto mygtukai (#692): tik jei yra maisto grupė (šunys 71/72/73, katės 78/81/79).
- „Rinkitės pagal poreikį": tik jei config turi `food_id` (šunys/katės).
- „Atrinktos": tik jei rūšis turi pool (visos turi; guard'as jei tuščia).

**ESP/EMAIL PLATFORMA IŠSPRĘSTA (S180):** TŽ §4 vykdymo platforma = **Sender.net** (buvo Brevo, TŽ v1.44). Sprendimas pagrįstas: kainų korekcija (~5× pigiau nei Brevo), šildyta paskyra su verifikuotu petshop.lt domenu, LT įmonė+SMS. Sender POC: **8 testų → 5 žali, 3 geltoni, 0 raudonų** (geltoni sutampa su architektūra — Sender=kvailas vykdytojas). Sender techniškai TINKA mūsų ESP-nepriklausomai architektūrai.

**ETAPO A EIGA (S182):** Petshop ESP **v0.2.0 GYVAS dev'e** — `wp-content/plugins/petshop-esp/` (5 failai, 1213 eilučių PHP). Blokai 1+2 (M1+M2) BAIGTI: `Petshop_Sender_Adapter` (realūs HTTP kvietimai — upsert_contact, emit_event, transactional email, health, is_operational) + `Petshop_ESP_Retry_Queue` (Action Scheduler backoff 1min/5min/30min/2h/6h/24h+jitter, 7 bandymai→DLQ). Empiriškai patvirtinta su REALIU Sender API: 11/11 PASS — kontaktas sukurtas Sender pusėje (PS_ORDER_COUNT=7, PS_PET_SPECIES=dog read-back OK), event realiai iškeliavo ("Event created"), pilnas async srautas ps_emit_event→log→AS→worker→sent veikia. Tokenai WP options (base64). Failai repo: `plugins/petshop-esp/`.

**ARCHITEKTŪROS SPRENDIMAI UŽRAKINTI (2026-07-14 sesija):**
- **Email atskyrimas (C hibridas):** transakciniai teisiniai (new_order, invoice, processing) → WC/SMTP; lifecycle/marketing → Sender. Vienas išsiuntimo pranešimas (`customer_completed_order`) perkeltas į Sender kaip post-purchase serijos pradžią.
- **Prenumeratos modulis:** dvi ašys (siuntos kontrolė × mokėjimo mechanika), NE viena dilema. Launch default: `confirm_required + token charge`. Dunning retry mūsų pusėje. Detalės: `dokumentai/prenumerata_uzrakinta_2026-07-14.md`.
- **Architektūros žemėlapis:** 16 modulių, 9 naujos DB lentelės — `plugins/petshop-esp/` (M1+M2) šiuo metu tik viena baigta.

**Blokas 0 (dev valymas):** ✅ #713 deaktyvuotas, ✅ 2 Sender webhook.site webhookai ištrinti, ⚠️ 4 testiniai Sender kontaktai soft-deleted (Sender API elgesys — lieka DB kaip unsubscribed, kvotos nepaimta).

**Blokas 3/M3 BAIGTA (S183):** 26 PS_ contact attributes **VISI Sender pusėje** (23 sukurti + 3 iš POC, 0 dublikatų). Kūrimo endpoint `POST /fields {title,type}`. Sender tipai tik text/number/date (category→text, boolean→text "true"/"false"). Pilnas mapping su Sender ID + kas rašo + kur skaitoma: `plugins/petshop-esp/docs/attributes.md`.

**Blokas 4/M4 BAIGTA (S184):** ESP **v0.3.0 gyvas** — consent sync + webhook receiver (8 failai, 1802 eil.). `ps_consent_log` lentelė (teisinis irodymas, niekada netrinam). Woo→Sender consent push + Sender→Woo webhook. Public API `ps_set_marketing_consent()`, `ps_get_marketing_consent()`. Webhook `/petshop/v1/sender-webhook` su HMAC verify. Empiriškai 11/11 + end-to-end (realus HTTP POST→consent atsinaujino source=webhook; blogas parašas→401). **Sender webhook 1aKjne ACTIVE** (topic subscribers/unsubscribed → dev URL). **Webhook secret dev:** `uD5RdRkIjPorxrlouQDahacEyHxxoEO0TcemLKnX`. **POC #4 UŽBAIGTA:** patvirtinta kad Sender fire'ina webhook TIK ant realiu user veiksmu (ne API) — receiver paruoštas, produkcijoje veiks natūraliai.

**Kitas žingsnis (Blokas 5 / M5):** Google Identity + dedup (9 uzduotys). Google login (PS_LOGIN_METHOD), legacy email susiejimas (PS_LEGACY_EMAIL_LINKED, PS_LEGACY_LINK_PROMPT_SHOWN), magic link verify (PS_EMAIL_VERIFIED), identity merge (PS_IDENTITY_MERGED_AT). Login plugin dev'e NERA — reikes sprendimo (Google OAuth). ps_identity_links lentele.

**RECON PATVIRTINTA (v0.2.0 pradžioje):** Sender `/account/fields` NEVEIKIA (404) — PS_ reikšmes skaitom per subscriber `columns[]`. `POST /subscribers` ant egzistuojančio → HTTP 200 (upsert saugus be tikrinimo). Rate limit 300/min. Status modelis: `{email:marketing, temail:transactional}`.

**Paraleliai (Raimio pusėje):** Paysera kortelių priėmimo aktyvavimas projektui 191898 (bazinis sluoksnis prieš recurring).

**Atviri MVP likučiai** (nekritiška): poreikio filtrai, CTA telefonas — žr. deployment_log S175. Probe snippetų valymas — neišvalyta.

---

## 2. AKTYVU DABAR → nuorodos (repo `raimis079-creator/petshop-bridge`)

| Kas | Kur repo |
|---|---|
| Atrinktos modulis (snippet #685) | `moduliai/atrinktos-modulis-v1.php` |
| /sunims/ landing (snippet #688) | `moduliai/kategorijos-landing-v1.php` |
| Atrinktos pool (5 rūšys) | `moduliai/{sunims-pool20,katems-pool20,grauzikams-pool12}.json` (paukščių/žuvų pool inline #685) |
| Kategorijų webp (5 rūšys) | `assets/{sunims(8),katems(8),grauzikams(4),pauksciams(3),zuvims(3)}-kategorijos/` |
| Maisto mygtukai v2 (#692) | `moduliai/maisto-mygtukai-v2.php` |
| Šios sesijos sprendimai (S175 A–G) | `dokumentai/deployment_log_v1_3_45.md` |
| Maisto mygtukai (#692), Mobile fix (#693) | kodas snippet'uose serveryje; santrauka S175-E/G |

---

## 3. IŠORINIAI DOKUMENTAI → nuorodos + VERSIJOS

| Dokumentas | Versija | Kur | Ką laiko |
|---|---|---|---|
| **TŽ MASTER** | **v1.58** | `dokumentai/TZ_MASTER_v1_58.docx` | Spec — *ką statom* (v1.58 = ESP Brevo→Sender + POC) |
| **architektūra v2** | **v2** | `dokumentai/architektura_v2.md` | Provider-neutralus pamatas + 16 modulių priklausomybės (S185, pakeičia v1) |
| **event registry** | **v1** | `dokumentai/events/EVENTS.md` + 13 `.schema.json` | Kanoninis 13 P0 event sąrašas + JSON schemos (S185) |
| **deployment_log** | **v1.3.58** | `dokumentai/deployment_log_v1_3_58.md` | S-numeruota deploy istorija — *kas pastatyta + kodėl* (iki S191) |
| Rašymo tiltas (runbook) | — | projekto failas | Tilto mechanika |
| Dropship pajamų architektūra | — | projekto failas | Strategija |
| Rinkiniai / Build-a-box strategija | — | projekto failas | Strategija |
| **Architektūros žemėlapis** | v1 | `/mnt/user-data/outputs/architektura_v1.md` (Raimio PC) | 16 modulių + 9 DB lentelės + priklausomybės |
| **Prenumeratos sprendimas UŽRAKINTA** | 2026-07-14 | `dokumentai/prenumerata_uzrakinta_2026-07-14.md` | Dvi ašys, launch default, dunning mūsų pusėje |
| **Etapo A planas v2** | v2 | `/mnt/user-data/outputs/etapas_A_planas_v2.md` (Raimio PC) | 12 žingsnių pagal priklausomybes |

**Dviguba apskaita:** Raimis laiko TŽ + deployment_log PC; Claude — repo. Claude rašo tik ką pats generuoja; Raimio rankinius keitimus įkelia gavęs. Niekada abu aklai vienu metu.

---

## 4. TILTO MECHANIKA (kaip viskas vykdoma)

- Repo `raimis079-creator/petshop-bridge`, workflow ID `298960963`, branch `main`.
- Pattern: rašyk `.mjs` → base64 PUT į `screenshot.mjs` (fetch SHA pirma) → dispatch (inputs: url, browser [0=curl ~25s, 1=Playwright ~110s]) → poll run → runner rašo į `analize/` (putText) ar `screenshots/` (putBinary) → skaityk atgal (CDN lag, dideli >1MB failai per `/git/blobs/{SHA}`).
- `api()` curl BŪTINA `--max-time` (kitaip didelis POST užstringa → workflow in_progress amžinai).
- WP auth: `WP_USER`, `WP_APP_PASS` (`.replace(/\s+/g,'')`) env. dev.avesa.lt tik su `-k` (TLS). Token probe snippetams: `cmplz_6680aa2a42151d54fa8d64ec`.
- Operaciniai snippetai: `scope='global'` + `wp_loaded` + early-exit + token check. Probe: deaktyvuoti/ištrinti po naudojimo.
- Code Snippets REST DELETE NEVEIKIA → trink iš DB `gaj6_snippets`. UPDATE per REST POST /snippets/{id} VEIKIA.
- Sandbox pasiekia TIK github/pypi/npm. PHP lint: `apt install php-cli` po `apt update`.

---

## 5. NELIESTI — live snippetai (produkcija)

**Landing sistema (S175–S178, VISOS 5 rūšys):** #685 (Atrinktos modulis — 5 rūšių pool) · #688 (Landing — parent 70/77/87/89/93; grid+poreikis+atrinktos config-driven) · #692 (Maisto mygtukai v2 — šunims+katėms) · #693 (Mobile filtrų fix)

**Post-launch klaidų taisymai (S179):** #705 v2 (Nuotraukų vienodinimas — WC loop + build-a-box) · #707 v2 (UI lokalizacija EN→LT — gettext + widget_title) · #709 v2 (Build-a-box apatinio bloko slėpimas: MNM žinutė + container kiekis; scope `body.petshop-choice-page`)
Katės media ID: maistas 34623, kraikai 34624, tualetai 34625, skanėstai 34626, žaislai 34627, draskyklės 34628, dubenėliai 34629, vitaminai 34630.
Graužikų media ID: pašaras 34631, skanėstai 34632, narvai 34633, kraikas/šienas 34634.
Paukščių media ID: lesalas 34635, skanėstai 34636, aksesuarai 34637.
Žuvų media ID: akvariumo maistas 34638, tvenkinių 34639, įranga 34640.

**Buvę:** #329 (Filtrai PILNAS v14) · #332 (Filtrų Kontekstas v19) · #492/#493 (Filtrų Atidarymas) · #512 (Aprašymų Accordion) · #461 (Rikiavimas) · #565 (VF Sync) · #239 (Disable Image Sizes) · #648/#653 (sąskaitos)

**Backup optionai (jei reikia atkurti):** `ps_sidebars_widgets_backup` (Footer 1 widgetai) · `ps_vetdiet_revert_log` (pa_speciali_mityba).

**ESP/Sender (S181):** `petshop-esp` v0.1.0 plugin **AKTYVUS** dev'e (`wp-content/plugins/petshop-esp/`) — interface + event log + public API `ps_emit_event()`. Failai repo `plugins/petshop-esp/`. Lentelė `gaj6_ps_event_log` migruota (12 stulpelių + 5 indeksai, UNIQUE event_id+adapter). #713 „Sender Webhook Receiver v1" DEAKTYVUOTAS (bus perkeltas į plugin v0.3.0). Sender pusėje: PS_TEST grupė (bDxp2q), 3 PS_ custom fields, testiniai kontaktai soft-deleted, webhook.site webhookai IŠTRINTI. Sender account azv2GY, domenas petshop.lt (id eE9p2l) verifikuotas. Tokens GitHub secrets: SENDER_MARKETING_TOKEN, SENDER_TRANSACTIONAL_TOKEN.

---

## 6. DIZAINO SISTEMA

#2D5F3F primary žalia · #A8C9A0 accent · Inter · #E67E22 sale badge · 8px radius · sage žalias + eukalipto kategorijų iliustracijos (B variantas).
