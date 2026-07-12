# STATE.md — petshop.lt migracija · MASTER INDEKSAS

> **Šitą failą Claude skaito PIRMĄ kiekvieną sesiją.** Tai indeksas + darbo taisyklės, ne turinio saugykla. Turinys — kituose failuose, čia tik nuorodos.
> Paskutinį kartą atnaujinta: **2026-07-12** (po S175 /sunims/ landing).

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

**Migracija ~85%. Internal launch 2026-10-01, kontraktinis 2026-10-15.**

`/sunims/` landing — **BAIGTAS ir gyvas** (dev): kategorijos + Atrinktos rotacija + maisto mygtukai + mobile filtrų fix. `/maistas-sunims/` — baigtas (Sausas/Konservai/Visas).

**Kitas žingsnis:** tas pats landing karkasas → **Katėms** (tada Graužikams/Paukščiams/Žuvims). Reikės: katių pool 20 į `petshop_atrinktos_pool()`, katės kategorijos webp, term_id į `petshop_landing_map()`.

**Atviri MVP likučiai** (nekritiška): žr. deployment_log S175 „MVP LIKUČIAI".

---

## 2. AKTYVU DABAR → nuorodos (repo `raimis079-creator/petshop-bridge`)

| Kas | Kur repo |
|---|---|
| Atrinktos modulis (snippet #685) | `moduliai/atrinktos-modulis-v1.php` |
| /sunims/ landing (snippet #688) | `moduliai/kategorijos-landing-v1.php` |
| Atrinktos pool 20 | `moduliai/sunims-pool20.json` |
| Kategorijų webp (8) + mapping | `assets/sunims-kategorijos/` + `MAPPING.md` |
| Šios sesijos sprendimai (S175 A–G) | `dokumentai/deployment_log_v1_3_45.md` |
| Maisto mygtukai (#692), Mobile fix (#693) | kodas snippet'uose serveryje; santrauka S175-E/G |

---

## 3. IŠORINIAI DOKUMENTAI → nuorodos + VERSIJOS

| Dokumentas | Versija | Kur | Ką laiko |
|---|---|---|---|
| **TŽ MASTER** | **v1.56** | `dokumentai/TZ_MASTER_v1_56.docx` | Spec — *ką statom* (+ „Papildyta" versijų istorija) |
| **deployment_log** | **v1.3.45** | `dokumentai/deployment_log_v1_3_45.md` | S-numeruota deploy istorija — *kas pastatyta + kodėl* (iki S175) |
| Rašymo tiltas (runbook) | — | projekto failas | Tilto mechanika |
| Dropship pajamų architektūra | — | projekto failas | Strategija |
| Rinkiniai / Build-a-box strategija | — | projekto failas | Strategija |

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

**Šios sesijos (S175):** #685 (Atrinktos modulis) · #688 (Landing) · #692 (Maisto mygtukai) · #693 (Mobile filtrų fix)

**Buvę:** #329 (Filtrai PILNAS v14) · #332 (Filtrų Kontekstas v19) · #492/#493 (Filtrų Atidarymas) · #512 (Aprašymų Accordion) · #461 (Rikiavimas) · #565 (VF Sync) · #239 (Disable Image Sizes) · #648/#653 (sąskaitos)

**Backup optionai (jei reikia atkurti):** `ps_sidebars_widgets_backup` (Footer 1 widgetai) · `ps_vetdiet_revert_log` (pa_speciali_mityba).

---

## 6. DIZAINO SISTEMA

#2D5F3F primary žalia · #A8C9A0 accent · Inter · #E67E22 sale badge · 8px radius · sage žalias + eukalipto kategorijų iliustracijos (B variantas).
