# TŽ MASTER v1.86 — PILNAS SKYRIŲ AUDITAS

**Data:** 2026-08-19 · **Auditas atliktas prieš:** REGISTRAS §0–§8x · deployment_log v1.6.0 (iki S1098) · DOD-19 v2.1
**Apimtis:** visi 46 TŽ skyriai (0–45 + 34), 103 lentelės, 1 141 pastraipa
**Iki perjungimo:** 13 dienų (2026-09-01/02) · **Iki scope freeze (TŽ §17):** 12 dienų (2026-08-31)

---

## ŽYMĖJIMAS

| Žymė | Reikšmė |
|---|---|
| ✅ | Padaryta. Yra įrodymas su data. |
| 🟡 | Dalinai arba veikia su žinomu apribojimu. |
| 🔴 | Nepadaryta. |
| ⚪ | Sąmoningai atmesta arba atidėta po launch — **ne spraga**. |
| ❓ | **NEIŠMATUOTA.** Nėra nei įrodymo, kad padaryta, nei kad ne. Didžiausia rizikos klasė. |
| ⏸ | Laukia savininko sprendimo. |

> **Metodinis apribojimas.** Šis auditas lygina **dokumentus su dokumentais**. Kur
> parašyta ❓ — reiškia, kad nei REGISTRE, nei deployment_log'e nėra jokios eilutės
> ta tema. Tai nereiškia „neveikia" — reiškia „nežinom". Kiekvienas ❓ arba
> patikrinamas per tiltą, arba sąmoningai nurašomas.

---

## 0. VIENO PUSLAPIO REZULTATAS

| Rodiklis | Skaičius |
|---|---|
| TŽ skyrių peržiūrėta | **46** |
| Atskirų reikalavimų / punktų palyginta | **~310** |
| ✅ padaryta | ~168 (54 %) |
| 🟡 dalinai | ~34 (11 %) |
| 🔴 nepadaryta | ~28 (9 %) |
| ⚪ sąmoningai atmesta / po launch | ~41 (13 %) |
| ❓ **neišmatuota** | **~39 (13 %)** |

**Trys išvados, kurios keičia darbų eilę:**

1. **Visas Sk. 5 (nefunkciniai NF1–NF22) ir Sk. 20 (testavimo planas T1–T13) registre
   neegzistuoja.** Žodžiai `Lighthouse`, `Wordfence`, `2FA`, `WP Rocket`, `Cloudflare`,
   `Omniva`, `ACF Pro` **nė karto nepasitaiko** nei REGISTRE, nei deployment_log'e
   (patikrinta grep'u, 0 atitikmenų). Tai ne „blogai padaryta" — tai **nematuota**.
2. **TŽ turi 9 vietas, kur pati sau prieštarauja arba yra pasenusi** (§B skyrius).
   Kai kurios jau realiai suklaidino darbą — tas pats mechanizmas, kaip §8x aprašytas
   „lentelė melavo trečią kartą".
3. **Faktiškai raudonų blokų liko nedaug**, ir jie žinomi: F19 prenumerata, DOD-17,
   DOD-22, 9 OPS punktai, Q-PERKEL, G3 Merchant Center, G9 SMS Sender ID.

---

# A DALIS — SKYRIUS PO SKYRIAUS

## Sk. 0 — Esminiai principai

| Punktas | Būsena | Įrodymas / pastaba |
|---|---|---|
| 0.1 Vienos eilutės taisyklė | ✅ | Galioja, taikoma |
| 0.2 Konflikto hierarchija | ✅ | — |
| 0.3 Termino tempimo hierarchija | ✅ | Pritaikyta: perjungimas 09-01/02, sutartinis 10-15 lieka buferiu |
| 0.4 Diskusijos kultūra | ✅ | — |
| 0.5 Scope statusų klasifikacija | ✅ | — |
| **0.6 404 nulinė tolerancija** | 🟡 | Danga 95 % (§8r). **45 URL sąmoningai palikti 404** (prekių tikrai nebėra) — tai formaliai **prieštarauja 0.6 tekstui** („paskutiniu atveju — pradinį puslapį"). Sprendimas geras, bet TŽ 0.6 to neleidžia. Reikia arba pataisyti 0.6, arba nukreipti tuos 45 |
| 0.7 Migracija kaip kokybės gerinimas | ✅ | Vykdoma |
| 0.8 Pilnas failo perrašymas | ✅ | Galioja |
| 0.9 Import #6 izoliacija | ✅ | Patvirtinta S596 |
| 0.10 Kanoniniai kainos laukai | ✅ | — |
| 0.11 Fulfillment source — viena tiesos vieta | 🟡 | **Realiai DVI vietos:** pirkėjo pusė ant `resolve()`, admin pusė ant `_ps_sandelis` (S920–S923). Kai nesutaria — niekas nepraneša. 17/3 749 nesutapimai |
| **0.12 kanoninis laukas `_active_fulfillment_source`** | ⚪ **pasenęs** | Pakeista į `_ps_sandelis` (§36.1, 2026-08-06). **TŽ 0.12 tekstas neperrašytas** — liko tik nuoroda |

---

## Sk. 1 — Verslo kontekstas · Sk. 2 — KPI

| Punktas | Būsena | Pastaba |
|---|---|---|
| 1. Verslo kontekstas | ✅ | Aktualus |
| 1.1 Kodėl WooCommerce | ✅ | — |
| 2.1 Verslo KPI (12 mėn. po launch) | ⚪ | Matuojama po launch. Bazė „tikslintina" **iki šiol neįrašyta** |

### Sk. 2.2 — Techniniai KPI paleidimo dieną (9 metrikos)

| Metrika | Reikalavimas | Būsena | Pastaba |
|---|---|---|---|
| LCP | ≤2,5 s mob / 2,0 s desk | ❓ | **Nematuota niekada** |
| TTI | ≤3,5 s mob / 3,0 s desk | ❓ | **Nematuota** |
| Lighthouse mobile | ≥85 | ❓ | **Nematuota** |
| Lighthouse desktop | ≥90 | ❓ | **Nematuota** |
| Uptime pirmi 30 d. | ≥99,5 % | 🟡 | Vidinis sargas veikia (§8u); **išorinio uptime nėra** |
| Checkout 20/20 | 20 testinių | 🟡 | 20/20 sukurta (DOD-04), programinis kelias nepatikrintas |
| 301 top-100 | 100 % | ✅ | 95 % dangos, žemėlapis 1 099 |
| Mokėjimo sėkmė | ≥98 % | ❓ | Negalima matuoti iki perjungimo (§8v) |
| XML sync sėkmė | ≥98 % | 🟡 | DOD-09, serijos įrodyti neįmanoma |

> **RADINYS:** iš 9 techninių KPI **5 nematuoti nė karto**. Keturi iš jų (LCP, TTI,
> Lighthouse ×2) yra vienas 20 minučių matavimas, kurio niekada nepadarėm.

---

## Sk. 3 — Scope: launch ribos

| Sritis | TŽ statusas | Faktinė būsena |
|---|---|---|
| WooCommerce branduolys | P0 pilnas | ✅ |
| Produktų katalogas ≤5 000 SKU | P0 | ✅ 2 609 publish |
| Mokėjimai Paysera + bankinis | P0 | 🟡 Paysera grandinė iki nukreipimo ✅; callback **netikrintas** (§8v) |
| Paštomatai — bent 2 | P0 | ✅ Venipak + LP Express |
| SEO migracija top-100 | P0 | ✅ **viršyta** — 1 099 kelių žemėlapis, 95 % |
| XML įeinantis (1-as) | P0 | ✅ ZB |
| XML įeinantis (2-as) | MVP | ✅ VF — **viršyta** (TŽ numatė „neaktyvus produkcijoje") |
| XML išeinantys | MVP | ✅ petshop-feeds v2.2.0 |
| Kainodara | MVP | ✅ |
| **Ribota prenumerata** | MVP | 🔴 **0 kodo** |
| Basic Pet Profile | MVP | ✅✅ M8 gerokai viršytas |
| Basic email automation | MVP | ✅ 3/3 |
| Lojalumo taškai | CONDITIONAL | 🔴 Q9 neatsakytas, terminas 08-15 **praėjo** |
| AI komponentai | PO LAUNCH | ⚪ |

---

## Sk. 4 — Funkciniai reikalavimai

### 4.1 P0 (F1–F16)

| ID | Funkcija | Būsena | Įrodymas |
|---|---|---|---|
| F1 | WooCommerce branduolys | ✅ | WC 11.0.1, HPOS |
| F2 | Produktų katalogas | ✅ | 2 609 publish |
| F3 | Kategorijos ≤3 lygiai | ✅ | 80 kategorijų |
| F4 | Paieška + SKU/EAN | ✅ | 2026-08-03, matrica 13/13 |
| F5 | AJAX filtrai | ✅ | YITH |
| F6 | Krepšelis | ✅ | — |
| F7 | Checkout | ✅ | — |
| F8 | Mokėjimai | 🟡 | žr. F-PSR |
| F9 | Pristatymas | ✅ | 2 vežėjai |
| F10 | PVM sąskaitos | ✅ | AVPN/IAPV |
| F11 | User account | ✅ | + magic link |
| F12 | Email transakciniai | ✅ | 5 tipai |
| F13 | GDPR | ✅ | Complianz + 8 psl. |
| F14 | Mobile UX | ✅ | Playwright 390×844 |
| F15 | XML įeinantis | ✅ | ZB |
| F16 | Kainodara | ✅ | DOD-10 |
| **F-PSR** | Paysera pilnas ciklas | 🟡 | Konfigūracija pilna; **callback netikrintas** — tikrinama perjungimo naktį |

### 4.2 P0 atributų ribos

| Grupė | Būsena |
|---|---|
| Identifikacija (SKU, EAN, tiekėjo kodas) | 🟡 594 publish prekės be jokio kodo (Q-R2) |
| Komercija | ✅ |
| Katalogas | ✅ |
| Turinys | ✅ |
| Filtrai | ✅ |

> Priėmimo kriterijus F2 reikalauja **P0 atributai užpildyti ≥95 %**. Prie 594/2 609 be
> kodo (77,2 %) identifikacijos eilutė formaliai **nepraeina**. Reikia arba užpildyti,
> arba TŽ pripažinti, kad EAN nėra P0 identifikacijos dalis.

### 4.3 MVP · 4.4 Lojalumas · 4.5/4.6 Po launch

| ID | Funkcija | Būsena | Pastaba |
|---|---|---|---|
| F17 | XML 2-as tiekėjas | ✅ | VF, 1 077 prekės — aktyvus, ne testinis |
| F18 | Kaina24 / kainos.lt | ✅ | Variklis veikia; **URL resubmit po perjungimo** |
| F19 | **Ribota prenumerata** | 🔴 | **NEPRADĖTA.** Blokuoja Q6 + Q10 + Paysera Recurring |
| F20 | Basic Pet Profile | ✅✅ | — |
| F21 | Basic email automation | ✅ | 3/3 |
| F30b | Atsiliepimai | ✅ | verified buyers only |
| F22 | Lojalumo taškai | 🔴 | Q9 neatsakytas, **terminas 08-15 praėjo** |
| F23–F27 | Po launch (2026-12 … 2027 Q4) | ⚪ | Ne dabar |
| F28–F32 | Backlog | ⚪ | Ne dabar |

---

## Sk. 5 — Nefunkciniai reikalavimai (NF1–NF22)

> **🔴 VISAS SKYRIUS REGISTRE NEEGZISTUOJA.** Nė vienas NF neturi eilutės REGISTRE.
> Žemiau — pirmas kartas, kai jie sulyginti.

| ID | Reikalavimas | Būsena | Pastaba |
|---|---|---|---|
| NF1 | LCP ≤2,5 s mob / 2,0 s desk | ❓ | Nematuota |
| NF2 | TTI ≤3,5 / 3,0 s | ❓ | Nematuota |
| NF3 | Lighthouse mobile ≥85 | ❓ | Nematuota |
| NF4 | Lighthouse desktop ≥90 | ❓ | Nematuota |
| NF5 | Uptime ≥99,5 %/mėn. | 🟡 | Vidinis sargas; išorinio nėra |
| NF6 | Kasdienės kopijos, 30 d., off-site | ✅ | B2, 04:00, AES-256 (§8c–8h) |
| NF7 | Restore testas iki launch | ✅ | 2026-08-04, 174/174 |
| NF8 | SSL TLS 1.2+ | 🔴 | **Sertifikatas pasibaigęs 2022-12-31.** Nemokamas, bet **tik po DNS** (§7c) |
| NF9 | Brute force: 5 bandymai / 15 min | ❓ | **Nematuota.** Nėra jokios eilutės |
| NF10 | 2FA admin vartotojams | ❓ | **Nematuota.** Žodis „2FA" — 0 atitikmenų |
| NF11 | WAF (Wordfence Premium) | ❓ | **Nematuota.** „Wordfence" — 0 atitikmenų |
| NF12 | Cookie consent prieš ne-essential | ✅ | Complianz |
| NF13 | Data export | ✅ | GDPR |
| NF14 | Right to be forgotten | ✅ | `ps_gdpr_rezimas=anonimizuoti` |
| NF15 | VMI atitiktis | ✅ | AVPN/IAPV |
| NF16 | 14 d. grąžinimo politika, T&C | ✅ | 8 teisiniai psl. |
| NF17 | Mobile-first | ✅ | F14 |
| NF18 | Browser support (4 naršyklės) | ❓ | **Netestuota** (= T6) |
| NF19 | WCAG 2.1 AA bazinis | ❓ | **Nematuota** |
| NF20 | WebP + lazy loading | ✅ | ShortPixel |
| NF21 | XML sync logging + email klaidoms | 🟡 | Žurnalas ✅; email klaidoms ❓ |
| NF22 | Audit trail manual override | ❓ | Kainai ✅; kitiems laukams — nėra |

**Santrauka:** 22 NF · ✅ 10 · 🟡 3 · 🔴 1 · ❓ **8**.
Iš aštuonių ❓ **trys yra saugumo** (NF9, NF10, NF11) — tai vienintelė ataskaitos vieta,
kur nežinojimas gali kainuoti daugiau nei laiką.

---

## Sk. 6 — Duomenų šaltiniai

| Punktas | Būsena | Pastaba |
|---|---|---|
| 6.1 Trys srautai (S1/S2/S3) | ✅ | Veikia |
| 6.2 Konfliktų valdymas (14 laukų) | ✅ | Patvirtinta S596: importai rašo tik savo laukus |
| **6.3 Manual override — 5 lock checkbox'ai** | 🔴 **nukrypimas** | TŽ numatė `lock pricing / content / images / category / all` per **ACF Pro**. Realiai yra **tik `_manual_price_override`**. ACF Pro nepirktas. Kiti 4 lock'ai **neegzistuoja** |
| 6.4 Prekė dingsta iš XML (1 d. / 7 d. / 30 d.) | ❓ | 1 sync → out-of-stock ✅. **7 d. → „discontinued" ir 30 d. → email savininkui — nėra jokios eilutės** |
| 6.5 Dublikatų valdymas | ✅ | EAN → SKU+tiekėjas → fuzzy |

---

## Sk. 7 — XML integracija

| Punktas | Būsena | Pastaba |
|---|---|---|
| 7.1 Feed'ų inventorius (X1–X4) | ✅ | Visi keturi gyvi |
| 7.2 Techninis sprendimas | ✅ | WP All Import Pro |
| 7.2 Rate limiting 100 prekių/min | ❓ | Nefiksuota |
| 7.2 Failed sync: 3 retry → email | ❓ | Nefiksuota |
| 7.3 Laukų mapping | ✅ | Įgyvendinta |
| 7.4 Išeinantys feed'ai | ✅ | petshop-feeds v2.2.0, cron 04:30 |
| 7.5 Rizikos (5) | 🟡 | Schema validacija ❓; **UptimeRobot heartbeat — nėra** |

---

## Sk. 8 — Kainodaros logika

| Punktas | Būsena | Pastaba |
|---|---|---|
| 8.1 Modelis A/B/C | ✅ | Kategorinė + manual + globalus |
| 8.2 Sprendimo medis (5 žingsniai) | ✅ | Veikia |
| 8.3 Kategorinių taisyklių struktūra | ✅ | + VF sava lentelė (§34.10) |
| **8.4 Kainodaros admin UI (6 funkcijos)** | 🟡 | Katalogas v8.7.1 dengia dalį. **„Preview 10 produktų", „Recalculate all", „Audit log" — ❓** |
| 8.5 Edge cases (5) | ✅ | Kaina < savikainos blokuojama |
| Q13 realios kategorinės % | ✅ | Uždaryta faktais (DOD-10) |

---

## Sk. 9 — Prenumeratos verslo taisyklės

| Punktas | Būsena |
|---|---|
| 9.1 Parametrai (SKU, periodai, 5 %) | 🔴 |
| 9.2 Klientų patyrimo taisyklės (8) | 🔴 |
| 9.3 Atsargų taisyklės (3) | 🔴 |
| 9.4 Mokėjimo taisyklės (5) | 🔴 |
| 9.5 Konfliktas su nuolaidomis (4) | 🔴 |
| 9.6 Auto vs manual (Q11/Q14) | 🔴 |

> **Visas skyrius = F19.** Vienintelis MVP blokas su nuliu kodo. 30+ verslo taisyklių
> parašyta, 0 įgyvendinta. Prieš scope freeze (08-31) reikia **sprendimo, ne kodo**:
> ar F19 keliamas po launch.

---

## Sk. 10 — Techninis stack'as

| Komponentas | TŽ | Faktas | Būsena |
|---|---|---|---|
| PHP ≥8.1 | reikalavimas | 8.3 | ✅ |
| MySQL/MariaDB | ≥8.0 / ≥10.5 | MariaDB 10.6.17 | ✅ |
| WordPress ≥6.4 | užfiksuota | WP 7.0 | ✅ |
| WooCommerce ≥8.5 | užfiksuota | 11.0.1 | ✅ |
| SSL Let's Encrypt | užfiksuota | **pasibaigęs 2022** | 🔴 |
| **CDN Cloudflare** | rekomenduojama | **0 paminėjimų** | ❓ / ⚪ |
| Object cache Redis | optional | nefiksuota | ⚪ |
| Tema | ATVIRAS (Astra vs Flatsome) | **Flatsome Child** | ✅ **uždaryta, TŽ nepataisyta** |
| Email serveris | tikslintina | WP Mail SMTP, 8,5/10 | ✅ |
| Cron | užfiksuota | 12 cron'ų (§8e) | ✅ |
| 10.1 Custom kodo organizavimas | privaloma | mu-plugins + pluginai | ✅ |

> **Nukrypimas:** 10.1 reikalauja „kiekvienas custom plugin — savo aplankas, savo
> **readme.md**, versijavimas". Versijavimas ✅. **readme.md — ❓.**

---

## Sk. 11 — Plugin'ų sąrašas

### 11.1 Privalomi P0 (18 pozicijų) — didžiausias nukrypimų blokas

| Funkcija | TŽ numatė | Faktas | Būsena |
|---|---|---|---|
| E-komercija | WooCommerce | ✅ | ✅ |
| Greitis | **WP Rocket €60** | **0 paminėjimų** | ❓ **nepirkta, nematuota** |
| Backup | **UpdraftPlus Premium €70** | savas skriptas + B2 | ⚪ **geriau nei TŽ** (R3) |
| Apsauga | **Wordfence Premium €100** | **0 paminėjimų** | ❓ **kritinis nežinojimas** |
| SEO | **RankMath Pro €80** | Rank Math **free** | ⚪ pakanka (S1003) |
| Filtrai | YITH Premium €70 | YITH | ✅ |
| PVM sąskaitos | Premium €70 | WCDN | ✅ |
| Custom fields | **ACF Pro €50** | **0 paminėjimų** | 🔴 → dėl to nėra 6.3 lock'ų |
| Cookie consent | Complianz Pro €40 | Complianz v7.5.0 | ✅ |
| 301 redirect'ai | Redirection / RankMath | mu-plugin 301 | ✅ |
| Image optimization | Smush/Imagify | ShortPixel | ✅ |
| XML įeinantis | WP All Import Pro €100 | ✅ | ✅ |
| XML išeinantis | Product Feed PRO / custom | **savas** petshop-feeds | ✅ |
| LT mokėjimai | Paysera | ✅ | ✅ |
| **Omniva** | P0 | **0 paminėjimų** | ⚪ sąmoningai (2 vežėjai) |
| LP Express | P0 | ✅ | ✅ |
| **DPD** | P0 | neaktyvus | ⚪ sąmoningai |
| Venipak | P0 | ✅ | ✅ |

### 11.2–11.5

| Punktas | Būsena | Pastaba |
|---|---|---|
| 11.2 Prenumeratos pluginas | 🔴 | Q6 neatsakytas |
| 11.2 Email automation (Mailchimp) | ⚪ **pakeista** | Sprendimas: **Brevo/Sender**, ne Mailchimp (v1.44) |
| 11.3 Lojalumo pluginas | 🔴 | Q9 |
| **11.5 Custom pluginų sąrašas** | 🔴 **pasenęs** | `petshop-xml v1.3.3` → realiai **v1.5.7**. `petshop-core (planuojamas)` → realiai egzistuoja. Trūksta: petshop-laukai, petshop-katalogas, petshop-rinkiniai, petshop-sargas, petshop-seo-aprasymas, petshop-kategorijos-aprasymas, petshop-desk, petshop-av-tiekimas, 8 M8 moduliai |
| 11.4 ≤25 aktyvūs pluginai | ❓ | **Neskaičiuota niekada** |

---

## Sk. 12 — AI komponentai (F23–F26)

| Punktas | Būsena |
|---|---|
| 12.1 AI Pet Plan (2026-12) | ⚪ Po launch |
| 12.2 Diet Transition Wizard (2027-02) | ⚪ Po launch |
| 12.3 Pet Life Assistant (2027 Q3) | ⚪ Po launch |

> Pastaba: šėrimo skaičiuoklė (straipsnis ID 14890) iš dalies dengia 12.1 „Output 2"
> (dienos kiekis gramais) **be AI**. Verta į TŽ įrašyti, kad dalis F23 jau padaryta.

---

## Sk. 13 — Integracijos (I1–I20)

| ID | Sistema | TŽ prior. | Būsena | Pastaba |
|---|---|---|---|---|
| I1 | Paysera | P0 | 🟡 | Callback netikrintas |
| I2 | Bankinis pavedimas | P0 | ✅ | |
| I3 | Paysera Recurring | MVP | 🔴 | Q-PSR neatsakytas |
| **I4** | **Omniva** | **P0** | ⚪ | Neįdiegta. Sąmoningai — 2 vežėjai pakanka. **TŽ vis dar rodo P0** |
| I5 | LP Express | P0 | ✅ | |
| I6 | DPD | P0 | ⚪ | Formaliai išbrauktas |
| I7 | Venipak | P0 | ✅ | |
| I8 | Tiekėjas A (ZB) | P0 | ✅ | |
| I9 | Tiekėjas B (VF) | MVP | ✅ | |
| I10 | Kaina24 | MVP | 🟡 | Variklis ✅, **feed'as gyvoje sistemoje negyvas** (§8m) |
| I11 | Kainos.lt | MVP | 🟡 | Tas pats |
| I12 | Mailchimp / Klaviyo | MVP | ⚪ | Pakeista į Brevo/Sender |
| I13 | GA4 | P0 | 🟡 | G-FMTKEGGLMG yra; **purchase event validacija prieš launch — nepadaryta** |
| I14 | Google Search Console | P0 | 🟡 | Property yra; **sitemap submit po perjungimo** |
| I15 | Google Tag Manager | MVP | ✅ | GTM-MF3GZGT |
| **I16** | **Cloudflare (CDN+DNS+DDoS)** | **P0** | ❓ / ⚪ | **0 paminėjimų.** DNS eina per serveriai.lt. Sprendimas nepriimtas |
| I17 | VMI / e-sąskaita | P0 | ✅ | |
| I18 | Claude/OpenAI API | Po launch | ⚪ | |
| **I19** | **UptimeRobot** | **P0** | 🔴 | Vienintelis DOD-13 trūkumas |
| I20 | Pragma / Audac | MVP | 🟡 | Pluginas ✅, **production mode OFF** (teisinga iki launch) |

> **Trys P0 integracijos be sprendimo:** I4 Omniva (⚪, bet TŽ nepataisyta),
> I16 Cloudflare (❓, niekada nesvarstyta), I19 UptimeRobot (🔴, žinoma).

---

## Sk. 14 — Duomenų migracija (D1–D10)

| ID | Tipas | Prior. | Būsena |
|---|---|---|---|
| D1 | Produktai (rankiniai) | P0 | ✅ Legacy 1 577 |
| D2 | Produktai (XML) | P0 | ✅ ZB + VF |
| D3 | Nuotraukos | P0 | ✅ + 26 straipsnių (§8s) |
| D4 | Kategorijos | P0 | ✅ 80 |
| D5 | Atributai P0 | P0 | ✅ |
| D6 | Gilūs atributai | Po launch | ⚪ |
| **D7** | **Klientų bazė** | **MVP** | 🔴 **NEPADARYTA.** ~2 000 `legacy_customer` adresų — minėta §11 G1 kontekste, niekada neimportuota |
| **D8** | **Užsakymų istorija** | **MVP** | 🔴 **NEPADARYTA** |
| D9 | Atsiliepimai | Backlog | ⚪ Q19 neatsakytas |
| D10 | Blog įrašai | MVP | ✅ 33/36 + §8s |

> **🔴 SVARBIAUSIAS NEPASTEBĖTAS RADINYS.** D7 ir D8 yra MVP prioriteto ir nėra
> nė vienoje REGISTRO lentelėje. Klausimas savininkui: **ar seni klientai ir jų
> užsakymų istorija apskritai keliami?** Jei taip — tai darbas, kuris turi įvykti
> **prieš** perjungimą, nes po jo sena platforma bus išjungta 10-15.

---

## Sk. 15 — SEO migracija (S1–S13)

| ID | Užduotis | Būsena | Įrodymas |
|---|---|---|---|
| S1 | URL inventorius | ✅ | 2 445 URL |
| S2 | Top URL prioritetizavimas | ✅ | 19 735 clicks |
| S3 | URL mapping | ✅ | 1 099 keliai |
| S4 | 301 redirect'ai | ✅ | mu-plugin, 95 % |
| S5 | Sitemap.xml | 🟡 | 5 failai ✅; **submit po perjungimo** |
| S6 | robots.txt | ❓ | **Nepatikrinta** |
| S7 | Meta titles/descriptions | ✅ | 2 609/2 609 |
| S8 | Schema.org markup | 🟡 | Rank Math ✅; **BreadcrumbList/Organization nepatikrinta** |
| S9 | Internal linking | ✅ | 231/234 (§8s) |
| S10 | 404 stebėjimas 30 d. | 🔴 | Po launch, neparuošta |
| S11 | Search Console verifikacija | 🔴 | Po perjungimo |
| S12 | Page speed LCP ≤2,5 s | ❓ | = NF1 |
| S13 | Slug saugumas po sync | ✅ | Patvirtinta |

---

## Sk. 16–17 — Diegimo planas ir kontroliniai vartai

| Vartai | Data | Būsena |
|---|---|---|
| Importo vartai | 2026-05-31 | ✅ |
| Katalogo + XML įeinantis | 2026-06-30 | ✅ |
| Checkout + logistika + XML išeinantys | 2026-07-31 | ✅ |
| Lojalumo CONDITIONAL patikra | 2026-08-15 | 🔴 **terminas praėjo, sprendimo nėra** |
| **Scope freeze** | **2026-08-31** | ⏸ **po 12 dienų** |
| Launch readiness | 2026-09-30 | 🔴 pasenęs |
| Go-live | 2026-10-15 | 🔴 pasenęs |
| Post-launch retrospektyva | 2026-11-15 | ⚪ |

> **🔴 GRAFIKO PRIEŠTARAVIMAS.** TŽ §16/§17 rodo go-live **2026-10-15**, o faktinis
> sprendimas (§8v, DOD-19 §7) — perjungimas **2026-09-01/02**. Skirtumas **6 savaitės**.
> Kol TŽ neperrašyta, du dokumentai rodo skirtingas datas — būtent tas mechanizmas,
> kuris jau tris kartus suklaidino darbą.
>
> Praktinė pasekmė: „Rugsėjis — stabilizacija, naujos funkcijos nepridedamos" TŽ
> planas **nebeturi prasmės**, nes rugsėjo 1 d. jau gyvenam.

---

## Sk. 18 — Priėmimo kriterijai

### 18.1 F1–F16

| F | Kriterijus | Būsena |
|---|---|---|
| F1 | WP admin, DB, reports | ✅ |
| F2 | P0 atributai ≥95 % | 🟡 EAN 77,2 % |
| F3 | Kiekviena kategorija ≥1 produktas | 🟡 **5 kategorijos su 0 prekių** (§8t) |
| F4 | 10/10 paieškų | ✅ 13/13 |
| F5 | 6 filtrų deriniai, mobile | 🟡 Veikia; **6 derinių testas nefiksuotas** |
| F6 | Krepšelis mobile+desktop | ✅ |
| F7 | **20 checkout'ų be klaidų** | 🟡 20/20 sukurta, kelias nepatikrintas |
| F8 | **Paysera 5 testai × 3 metodai** | 🔴 **0 iš 15.** Neįmanoma iki perjungimo |
| F9 | 2 vežėjai 100 %, realtime paštomatai | ✅ |
| F10 | PDF su privalomais laukais | ✅ |
| F11 | User account pilnas | ✅ |
| F12 | 5 email tipai <30 s, ne spam | ✅ 8,5/10 |
| F13 | Cookie consent, politika, export | ✅ |
| F14 | iPhone+Android, checkout <60 s | 🟡 Playwright ✅; **realūs įrenginiai ❓** |
| F15 | Sync 7 d. 100 % | 🟡 DOD-09 |
| F16 | 20 testinių produktų kainos | ✅ |

### 18.2 F17–F21

| F | Būsena |
|---|---|
| F17 | ✅ viršyta |
| F18 | 🟡 generuojami ✅, importas į platformas 🔴 |
| F19 | 🔴 |
| F20 | ✅ |
| F21 | 🟡 3 flow ✅; **testas realiais email'ais ❓** |

---

## Sk. 19 — Launch DoD (22 punktai)

| Nr. | Kriterijus | Būsena | Pastaba |
|---|---|---|---|
| 1 | P0 F1–F16 100 % | ✅ | |
| 2 | Kritinių klaidų 0 | 🟡 | Matuojama, realių 0 |
| 3 | Aukšto prioriteto ≤3 | 🟡 | 5 warning parašai |
| 4 | 20 testinių užsakymų | 🟡 | |
| 5 | 2 pristatymo būdai | ✅ | |
| 6 | Paysera + bankinis | ✅ | |
| 7 | Top-100 301 | ✅ | |
| 8 | Backup restore | ✅ | |
| 9 | XML sync 7 d. | 🟡 | |
| 10 | Kainodara 20 prekių | ✅ | |
| 11 | Manual override 5 prekėmis | 🟡 | 2/5 |
| 12 | Savininkas apdoroja be programuotojo | 🟡 | |
| 13 | Post-launch monitoringas | 🟡 | trūksta uptime |
| 14 | Mail-Tester ≥8 | ✅ | 8,5 |
| 15 | GDPR | ✅ | |
| 16 | VMI su realia transakcija | ✅ | |
| 17 | **Beta testas 5–10 klientų** | 🔴 | Po perjungimo |
| 18 | DNS planas | 🟡 | DOD-18 ✅; **Q-PERKEL atviras** |
| 19 | Rollback planas | ✅ | v2.1 |
| 20 | Savaitinis stabilumas ≥99 % | 🟡 | Serija užsidaro **2026-08-24** |
| 21 | GSC auditas + 301 lentelė | ✅ | Perskaičiuota: buvo 🟡 70 %, dabar 95 % |
| 22 | „Discourage search engines" išjungti | 🔴 | Viena varnelė, perjungimo naktį |

**Suvestinė:** ✅ 10 · 🟡 10 · 🔴 2.
DOD-21 REGISTRE dar rodoma 🟡 ~70 % — **turi būti ✅** po §8r/§8t.

---

## Sk. 20 — Testavimo planas (T1–T13)

> **🔴 ANTRAS SKYRIUS, KURIO REGISTRE NĖRA.**

| ID | Testas | Būsena | Pastaba |
|---|---|---|---|
| T1 | Unit testai custom kodui | ⚪ | Sąmoningai nedaroma |
| T2 | Integracijos testai | ✅ | Vykdyta po kiekvieno diegimo |
| T3 | Funkciniai testai | ✅ | |
| **T4** | **Greičio testai** (Lighthouse/GTmetrix/Pingdom) | ❓ | **Nepadaryta** |
| T5 | Mobile testai | 🟡 | Playwright ✅, realūs įrenginiai ❓ |
| **T6** | **Browser testai** (Chrome/Safari/FF/Edge) | ❓ | **Nepadaryta** |
| **T7** | **Saugumo testai** (Wordfence/OWASP/SSL Labs) | ❓ | **Nepadaryta** |
| T8 | Backup restore | ✅ | 2026-08-04 |
| T9 | Beta testavimas | 🔴 | = DOD-17 |
| **T10** | **Load testas** (50 concurrent, <4 s) | ❓ | **Nepadaryta** |
| T11 | XML reliability 7 d. | 🟡 | = DOD-09 |
| T12 | Pre-launch checklist | ⏸ | Prieš 09-01 |
| T13 | Post-launch monitoringas | 🟡 | Sargas ✅ |

**Keturi testai (T4, T6, T7, T10) niekada nedaryti ir niekur neužfiksuoti.**

---

## Sk. 21–23 — RACI, biudžetas, rizikos

| Punktas | Būsena |
|---|---|
| 21.1 RACI matrica | ✅ Galioja |
| 21.2 Sprendimo galios | ✅ |
| 21.3 Saugikliai Claude darbui | ✅ |
| 22 Biudžetas (3 scenarijai) | ⚪ Q15 formaliai atviras; **faktiškai vykdomas DIY** |
| 22.2 Numatyti €1 775–5 335 | ⚪ **Realiai gerokai mažiau** — didžioji dalis premium licencijų nepirkta |
| 23 Rizikos R1–R18 | 🟡 Žr. žemiau |

### Rizikos, kurios pasitvirtino

| ID | Rizika | Kas įvyko |
|---|---|---|
| R2 | Per platus scope | **Pasitvirtino.** Scope freeze 08-31 artėja, F19 nepradėta |
| R3 | Produktų duomenys netvarkingi | **Pasitvirtino.** GTIN, svoriai, aprašymai, PVM |
| R4 | SEO pozicijų kritimas | **Suvaldyta** — 95 % danga |
| R7 | Paysera Recurring konfliktai | **Pasitvirtino** — Q14 neatsakytas nuo 2026-06 |
| R10 | Serverio resursai | **Naujas pavidalas:** inode 66 %, ne CPU |
| R18 | Sutarties pratęsimas | ⚪ Nebeaktualu — sena platforma lieka iki 10-15 |

---

## Sk. 24 — Atviri klausimai (Q1–Q25)

| ID | Klausimas | Terminas | Būsena |
|---|---|---|---|
| Q1–Q4 | Eksportas, kalkuliatorius, VPS, tema | 2026-05 | ✅ |
| Q5 | Email įrankis | 2026-07 | ✅ Brevo/Sender |
| **Q6** | Prenumeratos pluginas | 2026-08 | 🔴 **atviras** |
| Q7 | Dizaineris | 2026-05 | ✅ ne |
| Q8 | AI engine | 2026-11 | ⚪ |
| **Q9** | Lojalumas: pluginas ar savas | **2026-08-15** | 🔴 **terminas praėjo** |
| **Q10** | 20–30 SKU prenumeratai | 2026-08 | 🔴 **atviras** |
| Q11 | Nemokamo pristatymo riba | — | ✅ €30 |
| Q12 | B2B | 2027 Q1 | ⚪ |
| Q13 | Kategorinės % | 2026-06 | ✅ |
| **Q14** | **Paysera Recurring** | **2026-06** | 🔴 **2,5 mėn. vėluoja** |
| Q15 | Biudžeto scenarijus | 2026-05 | 🟡 de facto DIY |
| Q16 | XML išeinantys: custom vs PRO | 2026-07 | ✅ custom |
| Q17 | Atributų strategija | po launch | ⚪ |
| Q18 | GSC auditas | 2026-06/07 | ✅ |
| **Q19** | **Istoriniai atsiliepimai iš eShoprent** | **2026-06** | 🔴 **neatsakytas, sena platforma dings 10-15** |
| Q20 | €30 riba | 2026-07 | ✅ |
| Q21 | FB paskyros revival | 2026-08 | 🔴 = OPS-10 |
| Q22 | VF kategorijų mapping | — | ✅ |
| Q23 | Aprašymų sekcijos | 2026-07 | 🔴 neatsakytas |
| **Q25** | **Fulfillment ABC analizė** | **2026-07** | 🔴 neatsakytas |

**8 klausimai su praėjusiais terminais.** Du iš jų (Q19, D7/D8) turi **kietą terminą**:
sena platforma išjungiama 2026-10-15, po to duomenų nebebus iš kur imti.

---

## Sk. 26 — VF integracija

| Etapas | TŽ rodo | Faktas | Būsena |
|---|---|---|---|
| 1 Saugumas + .bin | Baigta | ✅ | ✅ |
| 2 Description parser v4 | „testavimas" | veikia | ✅ **TŽ pasenusi** |
| 3 Kategorijų mapping | Baigta | ✅ | ✅ |
| **4 ACF accordion** | **„Laukia"** | ACF Pro nepirkta; veikia kitas mechanizmas (§41) | ⚪ **TŽ pasenusi** |
| 5 WP All Import #5 setup | Baigta | ✅ | ✅ |
| 6 Test import | Baigta | ✅ | ✅ |
| 7 Pilnas import | Baigta 06-06 | 1 077 | ✅ |
| **8 Stock sync (cron)** | **„Laukia"** | **Import #6 veikia nuo birželio** | ✅ **TŽ pasenusi** |
| **9 Cron monitoring** | **„Laukia"** | sargas v1.2, 59/59 | ✅ **TŽ pasenusi** |
| 26.4 EAN normalizacija | CP-2 uždarytas | **atsivėrė iš naujo** — GTIN skola, 1 963 prekės | ✅ ištaisyta v1.5.7 |

---

## Sk. 27 vs Sk. 41 — ⚠️ TŽ PRIEŠTARAUJA PATI SAU

| Sk. 27 teigia | Sk. 41 išmatavo |
|---|---|
| Aprašymai saugomi 9 meta laukuose `petshop_desc_*` | **Šių laukų NĖRA nė vienoje iš 2 744 prekių** |
| Frontend: „yra `petshop_desc_*` → accordion" | Accordion (snippetas 512) skaido `post_content` pagal **tekste esančias antraštes** |
| VF pildo automatiškai per parser v4 | Struktūra yra pačiame tekste |

**Būsena:** Sk. 27 aprašo sistemą, kurios **neegzistuoja**. Veikianti sistema aprašyta
Sk. 41. Sk. 27 nėra pažymėtas kaip pakeistas — kas skaitys TŽ iš eilės, gaus klaidingą
vaizdą. `petshop_desc_*` grep'as REGISTRE ir deployment_log'e: **0 atitikmenų**.

### Aprašymų faktinė danga (Sk. 41.2, 2026-08-07)

| Kategorija | Prekių | Pilnas | % |
|---|---|---|---|
| Maistas | 1 055 | 433 | 41 % |
| Skanėstai | 397 | 261 | 66 % |
| Papildai | 84 | 45 | 54 % |
| Aksesuarai | 1 208 | 459 | 38 % |

> Nuo tada (§8n) parašyta 76 aprašymų ir „Be aprašymo" eilė 88→0, bet tai **kitas
> matas** (ar yra tekstas), ne šis (ar yra visos sekcijos). Skaičiai nesulyginami.

---

## Sk. 28 — Nuotraukų standartizavimas (WebP)

| Punktas | Būsena |
|---|---|
| 28.1 WebP + lazy loading | ✅ |
| 28.2 VF .bin→.png | ✅ |
| 28.3 Legacy 1 577 / ZB 627 / VF 1 004 bulk convert | 🟡 ShortPixel; **`ShortpixelBackups` 4,02 GB — Q-SHORTPIX atviras** |

---

## Sk. 29 — Fulfillment

| Punktas | Būsena | Pastaba |
|---|---|---|
| 29.1 Statusas MVP, plugin aktyvus | ✅ | |
| 29.2 Verslo kontekstas | ✅ | 7 sandėliai |
| 29.3 Batch dispatch (6 žingsniai) | ✅ | §35.4 rytinė eiga |
| 29.4 Produkto laukai + statusai | 🟡 | `shipping_size_class` ❓ |
| **29.5 Priėmimo kriterijus: 20 realių užsakymų** | 🔴 | **Nepadaryta** |
| 29.6 Asortimento politika (Q25) | 🔴 | Neatsakytas |
| **„12 neuždarytų punktų"** | 🟡 **pataisyta** | S920–S923 **paneigė prielaidą**: resolveris teisus 12/17 atvejų; perjungimas į `_ps_sandelis` būtų **regresija**. Realiai nuo resolverio priklauso **3 punktai iš 12**, ne visi |

---

## Sk. 30 — Pragma / Audac

| Punktas | Būsena |
|---|---|
| 30.1–30.4 Pluginas, principas, 3 failai, Client ID | ✅ v1.0.0 |
| **30.5 Įjungti Production mode** | 🔴 prieš launch |
| **30.5 Išvalyti žinomų klientų sąrašą** | 🔴 |
| **30.5 Testas su buhaltere** | 🔴 |
| **30.5 Backfill AVPN** | 🔴 |

> Keturi darbai, 0 padaryta. **Nė vienas nėra OPS sąraše** — jie egzistuoja tik čia.

---

## Sk. 34 — Surenkami rinkiniai

| Punktas | Būsena |
|---|---|
| 34.1–34.8 Modelis, variklis, admin, vitrina | ✅ |
| 34.9 Klonavimas panelėje | 🔴 |
| 34.9 „Skanėstai katėms 26" — 26 prekės prie ribos 9 | ❓ **NEPATIKRINTA** |
| 34.9 VF skanėstų antkainis 35→40 % | ⏸ Savininkas |
| 34.11–34.14 Konservų dėžės | ✅ |
| **34.15 Katės dėžės** | 🟡 **0 iš 67 katės AV prekių turi savikainą** — pelnas neskaičiuojamas |
| 34.15 Trečias skirtukas | ⏸ |
| **34.17 Statistika** | 🔴 „suplanuota, nepadaryta" |

---

## Sk. 35–37 — Darbalaukis, prekių sritis, katalogas

| Punktas | Būsena |
|---|---|
| 35.1–35.11 Darbalaukis, eigos, manifestai, sandėlių modelis | ✅ |
| **35.12 12 neuždarytų punktų** | 🟡 **sąrašas pasenęs** — 1–3 punktai perkainoti S920–S923 |
| 35.12 p.8 ES „Atsisakyti sutarties" + KR-AVPN | 🔴 |
| 35.12 p.9 LP partCount su realia siunta | ⏸ Savininkas |
| 35.12 p.10 Prekių svorių auditas | 🟡 998 be svorio (Q-SVORIS) |
| 35.12 p.11 Inventorizacija | ⏸ Savininkas |
| 36.7 p.4 AV likutis VISOMS į `_own_stock_qty` | 🔴 Migracija nepadaryta |
| 36.7 p.5 Prekių langas | ✅ katalogas v8.7.1 |
| 36.7 p.6 Skeneris priėmime | ❓ |
| 37.1–37.16 Katalogo modelis | ✅ |

---

## Sk. 38–45 — Partijos, E0/E1, aprašymai, PVM, ZB, pamokos

| Skyrius | Būsena | Pastaba |
|---|---|---|
| 38 Partijos, „geriausia iki" | ✅ | 38.9 atviri klausimai — po launch |
| 39 E0 daugiašaltinis modelis | 🟡 | 39.8: `resolve()` iš `ps_sources` ❓; **925 prekės su nuliniu likučiu** — savininko darbas |
| 40 E1 Katalogo langas | ✅ | v8.7.1 |
| 41 Aprašymų struktūra | 🟡 | Žr. Sk. 27 prieštaravimą |
| **42 PVM ištaisyta** | ✅ | **⚠️ „ta pati klaida beveik neabejotinai yra ir gyvame petshop.lt" — apskaitos klausimas buhalterijai. Niekur kitur nefiksuota** |
| 43 ZB kainos | ✅ | Dogoteka RRP (~14 prekių, 10 % marža) — ⏸ verslinis |
| 44 Legacy rinkiniai išimti | ✅ | 32 prekės |
| 45 Techninės pamokos | ✅ | — |

---

# B DALIS — KUR TŽ PRIEŠTARAUJA REALYBEI

> Tai vertingiausia ataskaitos dalis. Kiekvienas punktas yra vieta, kur skaitantis TŽ
> gaus klaidingą vaizdą — tas pats mechanizmas, kuris jau tris kartus suklaidino darbą.

| # | Vieta | TŽ teigia | Realiai | Poveikis |
|---|---|---|---|---|
| **B1** | §16/§17 | Go-live **2026-10-15**, rugsėjis = stabilizacija | Perjungimas **2026-09-01/02** | **Didelis.** 6 sav. skirtumas; visas rugsėjo planas nebegalioja |
| **B2** | §27 | Aprašymai per `petshop_desc_*` laukus | Laukų **nėra nė vienoje prekėje** | Didelis. Aprašo neegzistuojančią sistemą |
| **B3** | §26.7 | Etapai 4, 8, 9 „Laukia" | Stock sync ir monitoringas **veikia nuo birželio** | Vidutinis. Atrodo kaip skola |
| **B4** | §11.5 | `petshop-xml v1.3.3`, `petshop-core (planuojamas)` | v1.5.7; core egzistuoja; **trūksta ~14 modulių** | Vidutinis |
| **B5** | §13 I4/I16 | Omniva ir Cloudflare = **P0** | Nė vienas neįdiegtas | Vidutinis. Atrodo kaip neįvykdyti P0 |
| **B6** | §6.3 | 5 lock checkbox'ai per ACF Pro | Tik `_manual_price_override` | Vidutinis. DOD-11 dėl to įstrigęs ties 2/5 |
| **B7** | §0.12 | Kanoninis `_active_fulfillment_source` | `_ps_sandelis` (§36.1) | Mažas — yra nuoroda |
| **B8** | §29 / §35.12 | „12 punktų, šaknis — resolveris" | **Prielaida paneigta.** Perjungimas būtų regresija | Vidutinis |
| **B9** | §10 | Tema „ATVIRAS: Astra vs Flatsome" | Flatsome Child veikia nuo gegužės | Mažas |

---

# C DALIS — TRYS SLUOKSNIAI, KURIŲ REGISTRE NĖRA VISAI

| Sluoksnis | Punktų | Nematuota | Kodėl svarbu |
|---|---|---|---|
| **Sk. 5 — NF1–NF22** | 22 | **8** | Tarp jų 3 saugumo (brute force, 2FA, WAF) |
| **Sk. 20 — T1–T13** | 13 | **4** | Greitis, browser, saugumas, load |
| **Sk. 2.2 — Techniniai KPI** | 9 | **5** | LCP, TTI, Lighthouse ×2, mokėjimai |

**Persidengia:** greitis (NF1–NF4 = T4 = KPI 1–4) ir saugumas (NF9–NF11 = T7).
Faktiškai tai **du matavimai**, ne septyniolika darbų:

```
1. Greičio matavimas       Lighthouse mobile + desktop, LCP, TTI     ~30 min
2. Saugumo patikra         login limitai · 2FA · WAF · SSL Labs      ~1 val.
```

---

# D DALIS — KAS REALIAI RAUDONA PRIEŠ PERJUNGIMĄ

## D1. Blokuoja perjungimą (privaloma iki 09-01)

| # | Darbas | Šaltinis | Kieno |
|---|---|---|---|
| 1 | **Q-PERKEL** — kaip petshop.lt ras svetainę (SSH) | §8x | Savininkas → palaikymo žmogus |
| 2 | **GitHub PAT** baigia galioti **2026-08-26** | §9 | Savininkas |
| 3 | **SSL** — sertifikatas pasibaigęs; užsakomas po DNS | DOD-19 §7c | Perjungimo naktį |
| 4 | **Q-PSR3** — kas įrašyta Paysera 29276 adresuose | §8v | Prieš T-0 |
| 5 | **OPS-01…05, 07** — 6 operacijos (Site URL, cron, hardcoded URL, AVPN reset, testiniai užsakymai, blog_public) | §8 | T-0 |
| 6 | **TTL 3600→300** abiem A įrašams | DOD-19 §6 | T-2 |
| 7 | **T-1 rankinė kopija** | DOD-19 §6 | T-1 |

## D2. Turi būti nuspręsta iki scope freeze (2026-08-31)

| # | Klausimas | Kodėl dabar |
|---|---|---|
| 1 | **F19 prenumerata** — keliam po launch ar darom? | 0 kodo, 30+ taisyklių. Po 08-31 nebegalima pridėti |
| 2 | **F22 lojalumas** (Q9) | Terminas 08-15 praėjo |
| 3 | **D7/D8 — seni klientai ir užsakymų istorija** | Sena platforma dings **10-15**. Po to nebėra iš kur imti |
| 4 | **Q19 — istoriniai atsiliepimai** | Tas pats terminas |
| 5 | **Q-SHORTPIX** — 4 GB valyti prieš perkėlimą? | Negrįžtama; inode 66 % |

## D3. Prieš launch, bet ne prieš perjungimą

| # | Darbas |
|---|---|
| 1 | **Q-KREPS** — dvigubas „Mažo krepšelio mokestis" kasoje |
| 2 | **Pragma 30.5** — 4 darbai (production mode, klientų sąrašas, testas, backfill) |
| 3 | **G3 Merchant Center** (Q-MERCH-1) |
| 4 | **G9 SMS Sender ID** |
| 5 | **I19 UptimeRobot** |
| 6 | **Greičio matavimas** (30 min) |
| 7 | **Saugumo patikra** (1 val.) |
| 8 | **§42 PVM klaida gyvame petshop.lt** — buhalterijai |

## D4. Po launch (⚪ sąmoningai)

DOD-17 beta · S10 404 stebėjimas · S11 GSC verifikacija · Q-STRAIPS · Q17 · F23–F27 ·
§34.17 statistika · §38.9 klausimai · analytics · TEMP snippetų valymas

---

# E DALIS — SIŪLOMI VEIKSMAI

## E1. Nemokami ir greiti (šiandien–rytoj)

| Veiksmas | Trukmė | Vertė |
|---|---|---|
| Greičio matavimas (Lighthouse ×2, LCP, TTI) | 30 min | Uždaro 4 KPI + 4 NF + T4 |
| Saugumo patikra (login limitai, 2FA, WAF, SSL Labs) | 1 val. | Uždaro 3 NF + T7 |
| robots.txt + Schema.org patikra | 15 min | Uždaro S6, S8 |
| Aktyvių pluginų skaičius (≤25) | 5 min | Uždaro 11.4 |
| Naujas GitHub PAT | 5 min | **Blokuoja viską po 08-26** |

## E2. Sprendimai, kurių laukiu iš tavęs

| # | Klausimas | Variantai |
|---|---|---|
| 1 | **F19 prenumerata** | (a) po launch (b) minimalus manual recurring iki 08-31 |
| 2 | **D7/D8 seni klientai + užsakymų istorija** | (a) keliam (b) nekeliam — **sena platforma dings 10-15** |
| 3 | **Q19 atsiliepimai** | (a) keliam (b) ne |
| 4 | **F22 lojalumas** | (a) po launch (b) Q9 dabar |
| 5 | **Q-SHORTPIX 4 GB** | (a) valom (b) perkeliam viską |
| 6 | **I16 Cloudflare** | (a) dedam (b) formaliai išbraukiam iš P0 |
| 7 | **§0.6 vs 45 sąmoningi 404** | (a) nukreipiam (b) pataisom §0.6 tekstą |

## E3. TŽ perrašymas → v1.87

Devyni B dalies punktai. Siūlau **ne dabar** — po perjungimo, kai bus žinoma faktinė
būklė. Bet **B1 (grafikas) reikia pataisyti iškart**: kol TŽ rodo 10-15, o sprendimas
09-01, kiekvienas kitas skaitymas kuria klaidą.

---

## PABAIGAI — KAS ATRODO GERIAU, NEI MANIAU

Auditas rado ne tik spragas:

- **SEO sluoksnis viršija TŽ.** §3.1 reikalavo „top 100 URL". Padaryta 1 099 kelių
  žemėlapis, 95 % dangos, 2 609 meta, 56 kategorijų tekstai.
- **XML 2-as tiekėjas viršija TŽ.** Numatyta „testinis setup'as, neaktyvus produkcijoje".
  Realiai 1 077 prekės gyvai.
- **Pet Profile gerokai viršija TŽ.** Numatyti 4 laukai. Padaryta M8 ekosistema su
  8 moduliais, 3 lentelėmis, rekomendacijų varikliu ir 6 skirtukų ataskaita.
- **Backup viršija TŽ.** Numatytas UpdraftPlus €70. Padaryta: savas skriptas, B2,
  AES-256 + HMAC, manifestas, sargas, įrodytas atstatymas 174/174.
- **Fulfillment §29 nėra tokioje skoloje, kaip atrodė.** Auditas teigė 12 neuždarytų
  punktų su viena šaknim — matavimas parodė 99,5 % sutapimą ir kad „taisymas" būtų
  regresija.

**Vienu sakiniu:** kodo sluoksnis stipresnis, nei TŽ reikalavo; silpniausia vieta —
**matavimo sluoksnis** (greitis, saugumas, browser, load) ir **duomenų migracijos
likutis** (D7/D8), kurio niekas nefiksavo nė vienoje lentelėje.
