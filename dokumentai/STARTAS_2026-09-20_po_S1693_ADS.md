# STARTAS 2026-09-20 po S1693 (Ads langas)

**Ads tema — skaityti kartu:** `dokumentai/ADS_PMAX_bukle_s1677.md` (logika/ekonomika), šis failas (būklė po S1693). Senesnis `STARTAS_2026-09-13_po_S1677_ADS.md` — istorija.

## Būklė gyvai (09-19 22:20)
| Kampanija | ID | Biudžetas | Siūlymas | Būsena |
|---|---|---|---|---|
| **P-max \| LT \| Prekės (MC)** — NAUJA | 24274413499 | **€30/d** | Maks. konversijos vertė, be tROAS | Įgalinta, mokymasis, išteklių grupė peržiūrima |
| P-max \| LT \| petshop.lt (šunys) | 21472017542 | **€10/d** (buvo 20) | **Maks. konversijos vertė, be tikslo** (buvo tROAS 384 %) | Įgalinta |
| P-max\| All LT \| Kačių maistas | 21565450990 | €20/d | tROAS (neliesta) | Įgalinta |
| petshop (brand Search) | — | €8/d | neliesta | Įgalinta |
Viso ~€68/d. Visos 3 senos — NELIESTI 3–4 sav. Spalio 5 d. — lentelė pagal kampaniją (`irankiai/s1693_a.php` / `s1692_d.php`), 4 sav. langas be paskutinių 7 d.

## Nauja retail kampanija — kas nustatyta (Claude sukūrė per Raimio Chrome, Raimis tvirtino sumas)
- Tipas PMax, tikslas Pirkiniai, **MC 5321054797** (CSS Google Shopping), visi sklaidos kanalai; konv. veiksmas — paskyros numatytasis „Įkėlimas neprisijungus" (pagrindinis).
- Vietovė Lietuva (**Buvimas**), kalbos LT+EN; brendų išskyrimų sąrašas **„Savas brendas petshop"** (brendas „Petshop.lt" pateiktas Google bibliotekai — *peržiūrima 4–6 sav.*, iki tol išskyrimas neveikia).
- Išteklių grupė „Visos prekės": tik produktai (feed-only), galutinis URL petshop.lt/, **visi 5 išteklių optimizavimo jungikliai OFF** (teksto tinkinimas, URL išplėtimas, vaizdų/nukreipimo/vaizdo įrašų patobulinimai), signalų/paieškos temų nėra.
- **Įrašų grupių medis** (asset group 6748773259): Visi produktai → a / b / c (custom_label_0), kiekviena skaidyta pagal custom_label_1: **pigu ⊖**, **ne_reklamai ⊖** (tik c), „Visa kita" ● ; d/x ir „Visa kita iš Visi produktai" ⊖. Įtraukta ≈ **957 prekės** (1 869 − 202 − 279 − 369 − 62).
- Google Ads UI pamokos: kampanijos kūrimo juodraštis be tapatybės patvirtinimo neišsisaugo (Raimis pereina „Patvirtinkite, kad tai jūs"); perkrovus be pilno `cmpnInfo` URL juodraštis praranda tipą/MC — pirmas juodraštis (10214600747, „P-max | LT | Prekės (MC)") liko kaip **planuojamas darbas — ištrinti**; įrašų grupių parinkiklis kūrime tik „įtraukti" — išskyrimai daromi po sukūrimo medyje (`aw/listinggroups`).

## Tyrimas (4 subagentai, ~500 šaltinių) — kas mums svarbu
1. **Google EEE 09-17/18 išjungė nemokamus prekių sąrašus** (DMA) — MC 941 nemok. paspaudimų/28 d. (~33/d) dingsta; prekių kortelės Google dabar tik mokamos → retail PMax būtina. Srautas artimiausiomis dienomis dar kris (ne svetainės kaltė). 09-21…25 EK terminas — galimi tolesni Shopping bloko pokyčiai.
2. **08-17 siūlymo taisyklė**: biudžeto ribojamos kampanijos su tCPA/tROAS optimizuoja *į* tikslą → šunų PMax su tROAS 384 % prie realaus ~3,2 gesė pati (€4,5/d iš €20). Pataisyta (tikslas nuimtas).
3. **Shopping skelbimai LT veikia** — MC „Shopping ads" 2 070 Approved (09-17 buvo Limited). Konkurentai dar be feed'ų kampanijų (neverifikuota) — ankstyvas aukcionas.
4. **CSS partneris LT NEGALIMAS** (Google CSS programa 21 šalis, LT nėra) — iki lapkričio nurašyti.
5. Mokymuisi reikia ≥30 konv./30 d. kampanijoje (50–60 gerai); <30 — rezultatai ±100 %. tROAS nedėti iki tol. Praktikų alternatyva mažam biudžetui — Standard Shopping (Max clicks) — laikoma B variantu, jei PMax per 5 d. nespendina.
6. Vėliau: MC **conversational attributes** (6 laukai, feeds v2.6 kandidatas); „naujų klientų" matavimo stulpelis; Product Value Optimization beta (maržos etiketės) — paprašyti kai pasirodys; MC nuotraukos ≥500 px iki 2027-01-31 (270 vnt.); Search Console AI ataskaita; Microsoft Merchant Center nemokami sąrašai (2 val.); kaina24/kainos feed'ų gyvumas — patikrinti (rugpjūtį buvo fatal).
7. AI kanalai: ChatGPT Instant Checkout uždarytas 2026-03; ChatGPT merchant feed — JAV waitlist; ChatGPT Ads self-serve LT galimai nuo 08-31 (ne dabar, <€20/d signalo nėra); llms.txt — nulis įrodymų; Perplexity/Copilot checkout/Google UCP/Customer Reviews — LT nėra. Veikia: Product JSON-LD, neblokuoti OAI-SearchBot/PerplexityBot/ClaudeBot.

## Ekonomika (S1693, `irankiai/s1693_a.php`, read-only)
Po migracijos 09-10…16: šunų PMax €136 → 10,5 konv. (CPA €13, ROAS 3,2); kačių €145 → 8,5 (CPA €17, ROAS 2,5; prieš migraciją 14–16/sav. prie tų pačių išlaidų); brand €22 → 2,9. Ads užsakymo kontribucija €9,1 (54 užs., be siuntos) − siunta ~€2,3 ≈ **€6,8**; CPA pagal gclid 09-13…17 **€11,1** → pirmas užsakymas −€4, atsiperka tik per pakartotinį pirkimą. Lūžis CPA ≤ €7. Raimio sprendimas: rizikuojam dėl naujų klientų — pakartotinį pirkimą darys refill/win-back/RELAUNCH.

## Kitas žingsnis
- **09-20 rytas (Claude, Chrome):** kampanija 24274413499 — būsena (peržiūra baigta?), parodymai/paspaudimai; MC „Ad clicks" > 0; ištrinti seną juodraštį „Planuojami darbai". `ps_fakt_reklama` po 04:20 — nauja eilutė.
- **5 d. taisyklė:** jei retail nespendina (<€10/d) iki 09-24 — Standard Shopping (Max clicks) su tuo pačiu filtru.
- **2 sav. (10-03):** jei CPA ≤ €10 → biudžetas +20 % (€36). Jei CPA > €15 po 3 sav. — mažinti.
- **10-05:** sprendimas dėl senų PMax (katės/šunys) pagal lentelę.
- Kai Google patvirtins brendą „Petshop.lt" (4–6 sav.) — išskyrimas įsijungs pats; iki tol brand paieškos gali nutekėti į PMax.
- Atskiras langas: RELAUNCH 4–5 etapai (DKIM pirma); feeds v2.6 (conversational attributes); kaina24/kainos feed'ų patikra.
