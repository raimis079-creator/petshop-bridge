# PERDAVIMAS Į NAUJĄ LANGĄ — 2026-08-18 (vakaras)

## Pirmi žingsniai

1. Prijungti GitHub PAT (bridge `raimis079-creator/petshop-bridge`, workflow `298960963`)
2. `REGISTRAS.md` **§8m** (GTIN, Google žvalgyba) ir **§8n** (feed'ai, aprašymai, svoriai)
3. `deployment_log_v1_5_3.md` — [S971–S986] naktis, [S987–S1002] diena

**Dokumentai:** TŽ MASTER v1.79 (nekeista) · deployment_log **v1.5.3** · REGISTRAS su §8m ir §8n

---

## KAS PADARYTA PER PARĄ

```
✅ GTIN: galiojantys 394 → 2 015; šaknis uždaryta (class-vf-import v1.5.7)
✅ Regresijos testas įvyko realiame importe (03:32) — nauja prekė gimė su 13 zn. GTIN
✅ petshop-feeds v2.1.0: trys kanalai, statiniai failai, cron 04:30, administracija
✅ Aprašymai: katalogo eilė „Be aprašymo" 88 → 0
✅ Svoriai: 740 pakeitimų; rasta 26 kraikai su litrais vietoj kilogramų
```

Kopijos visiems veiksmams — `uploads/ps-backups/` (sąrašas deployment_log pabaigoje).

---

## LAUKIA SAVININKO

**1. Prekių ženklai** — `prekiu_zenklai_su_pasiulymais_2026-08-18.xlsx`
(114 eilučių, 34 su pasiūlymu ir įrodymu, nuorodos į prekes svetainėje).
Kai grįš užpildytas — priskirti vienu veiksmu su kopija ir patikra.

**2. Du Google mygtukai** (be jų Q-MERCH-1 stovi):
```
Google Cloud → projektas prefab-envoy-482617-b4 → įjungti Content API for Shopping
Merchant Center → Naudotojai → claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com
```

**3. Q-VARTAI** — ar publikavimo vartų riba 120 → 90? Pilnumo riba jau 90,
vartų sąmoningai palikta 120.

---

## KITAS DARBAS

**Google kategorijų mapinimas** — 80 `product_cat` → Google taksonomija.
Feed'as veikia ir be jo, bet su mapinimu reklama tikslesnė.

**Variantinės prekės** — 39 tėvai / 158 variantai eina vienu įrašu su žemiausia
kaina. Kaina24 priimtina, Google — ne visai.

**Nauja skola:** `petshop-xml.php:343,344,513,515` — `Array to string conversion`,
kai tiekėjas atsiunčia `brand` kaip masyvą. Liečia ZB (#2) ir VF (#5).

**Kosmetika:** stulpelis „Feed'ai" prekių sąraše nukrenta į dešinį kraštą.

**Po perjungimo (OPS-06):** paduoti `https://petshop.lt/feed/kaina24|kainos|google`.

---

## KRITINIS KELIAS NEPASIKEITĖ — F-PSR (Paysera)

```
Projektas 29276 · dev režimas testinis, konfigūracija NEBAIGTA · Q-PSR2 laukia
Perjungimo datos fiksuoti negalima, kol neuždaryta.
```

---

## KO NELIESTI BE SAVININKO

```
prekės apskritai · kategorijų mapinimas · ZB kainos · SEO 44 URL
216 prekių, kur _weight jau bruto (Eukanuba 12,220 ir pan.)
8 Churu „4 × 14 g" — bazė teisinga, klydo skaitiklis
publikavimo vartų riba 120 (petshop-vartai.php)
4 TEST prekės (34943, 34945, 34946, 34948) — savininkas ištrins pats
```

---

## TILTO IR KODO PAMOKOS (šios paros)

```
exec() SERVERYJE IŠJUNGTAS → sintaksė: token_get_all($k, TOKEN_PARSE) + catch ParseError

wp-admin per Playwright: logged_in slapuko NEUŽTENKA — reikia ir SECURE_AUTH_COOKIE

GTM_SA_JSON yra JSON BE išorinių riestinių skliaustų: JSON.parse('{'+raw+'}')

update_post_meta grąžina false, kai reikšmė NESIKEIČIA — tai ne klaida

'init' per anksti WooCommerce'ui: wc_get_product() grąžina false → naudoti 'wp_loaded'

HTML esybės: dekoduoti → valyti žymes → dekoduoti. Atvirkščiai &lt;p&gt; atsiverčia į HTML

Katalogo skaičiai remiasi _ps_pilnumas_kodai, ne pačiais laukais. Pakeitus duomenį —
  perskaičiuoti (Petshop_Pilnumas::perskaiciuoti), kitaip ekranas rodo seną tiesą

Ta pati riba gali gyventi dviejuose moduliuose (120 simb.: pilnumas IR vartai)

Prieš taisant „klaidas" — patikrinti, ar klysta ne tavo taisyklė (8 Churu, 216 bruto)

Nuorodos žmogui veda ten, kur GREIČIAU (svetainė), ne kur techniškai teisingiau (admin)

runner.mjs rašyti IŠ NAUJO kiekvienam paleidimui, niekada per sed grandinę
```

---

## APRAŠYMŲ STILIAUS STANDARTAS (iš savininko taisymų, trys raundai)

```
2–3 sakiniai, minimum 90 simbolių
1: kas tai ir kaip atrodo   2: kam tinka (PIRKĖJO nauda)   3: matmenys
Neišvardinti visų detalių · nerašyti poveikio teiginių („valo dantis")
Licencinių personažų neminėti · rašyti tik tai, kas matyti nuotraukoje ar pavadinime
```
