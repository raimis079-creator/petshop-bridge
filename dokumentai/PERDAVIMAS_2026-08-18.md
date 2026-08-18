# PERDAVIMAS Į NAUJĄ LANGĄ — 2026-08-18 (vakaras, po brendų)

## Pirmi žingsniai

1. Prijungti GitHub PAT (bridge `raimis079-creator/petshop-bridge`, workflow `298960963`)
2. `REGISTRAS.md` **§8m** (GTIN, Google žvalgyba) ir **§8n** (feed'ai, aprašymai, svoriai, brendai, kategorijos)
3. `deployment_log_v1_5_3.md` — [S971–S986] naktis, [S987–S1002] diena

**Dokumentai:** TŽ MASTER v1.79 (nekeista) · deployment_log **v1.5.3** · REGISTRAS su §8m ir §8n

---

## KAS PADARYTA PER PARĄ

```
✅ GTIN: galiojantys 394 → 2 015; šaknis uždaryta (class-vf-import v1.5.7)
✅ Regresijos testas įvyko realiame importe — nauja prekė gimė su 13 zn. GTIN
✅ petshop-feeds v2.2.0: trys kanalai, statiniai failai, cron 04:30, administracija
✅ Aprašymai: katalogo eilė „Be aprašymo" 88 → 0
✅ Svoriai: 740 pakeitimų; 26 kraikai turėjo litrus vietoj kilogramų
✅ Prekių ženklai: 114 priskirta; taksonomija išvalyta (135 ženklai)
✅ Google kategorijos: 55 susietos, feed'e 100 %
```

**Feed'o kandidatuose (2 227): be ženklo 0 · be nei ženklo, nei GTIN 0 · be aprašymo 0**

Kopijos — `uploads/ps-backups/` (sąrašas deployment_log pabaigoje).

---

## PIRMAS DARBAS NAUJAME LANGE — SEO META

**Rasta 2026-08-18, nepradėta. Žr. REGISTRAS §8n „SEO META".**

```
SEO plugino NĖRA · meta description nerodoma · og:title nėra
BET bazėje guli 1 111 title ir 1 075 description (Yoast IR RankMath formatais)
```

Eiga: (1) pasirinkti pluginą — rekomendacija Rank Math; (2) patikrinti, ar tie
1 111 tekstų verti įjungimo (atkeliavo iš senos platformos); (3) likusioms
~1 495 — šablonas, ne rankinis rašymas.

---

## LAUKIA SAVININKO

**Du Google mygtukai** (be jų Q-MERCH-1 stovi):
```
Google Cloud → projektas prefab-envoy-482617-b4 → įjungti Content API for Shopping
Merchant Center → Naudotojai → claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com
```

**Q-VARTAI** — ar publikavimo vartų riba 120 → 90? Pilnumo riba jau 90.

---

## KITAS DARBAS

```
SEO meta                    žr. aukščiau — pirmas
brand = "Array"             ištirta, PALIKTA STEBĖTI (savininko sprendimas)
feed'ų URL po perjungimo    https://petshop.lt/feed/kaina24|kainos|google (OPS-06)
15 prekių be ženklo         grįš į feed'ą, kai atsiras likutis
kosmetika                   stulpelis „Feed'ai" prekių sąraše netelpa
```

---

## KRITINIS KELIAS NEPASIKEITĖ — F-PSR (Paysera)

```
Projektas 29276 · dev režimas testinis, konfigūracija NEBAIGTA · Q-PSR2 laukia
Perjungimo datos fiksuoti negalima, kol neuždaryta.
```

---

## KO NELIESTI BE SAVININKO

```
prekės apskritai · ZB kainos · SEO 44 URL mapinimas
216 prekių, kur _weight jau bruto (Eukanuba 12,220 ir pan.)
8 Churu „4 × 14 g" — bazė teisinga, klydo skaitiklis
publikavimo vartų riba 120 (petshop-vartai.php)
TEST prekės (34942–34948) — savininkas ištrins pats
Google Ads kampanijos
```

---

## TILTO IR KODO PAMOKOS (šios paros)

```
exec() SERVERYJE IŠJUNGTAS → sintaksė: token_get_all($k, TOKEN_PARSE) + catch ParseError

wp-admin per Playwright: logged_in slapuko NEUŽTENKA — reikia ir SECURE_AUTH_COOKIE

GTM_SA_JSON yra JSON BE išorinių riestinių skliaustų: JSON.parse('{'+raw+'}')

update_post_meta grąžina false, kai reikšmė NESIKEIČIA — tai ne klaida

'init' per anksti WooCommerce'ui: wc_get_product() grąžina false → naudoti 'wp_loaded'

HTML esybės tekste: dekoduoti → valyti žymes → dekoduoti

wp_update_term AMPERSANDĄ UŽKODUOJA ATGAL (Hau&Miau grįžo, D&D Home gimė sugadintas)
  → taisyti tik tiesiogine užklausa į terms + clean_term_cache

Katalogo skaičiai remiasi _ps_pilnumas_kodai, ne pačiais laukais → po duomenų
  keitimo perskaičiuoti (Petshop_Pilnumas::perskaiciuoti)

Ta pati riba gali gyventi dviejuose moduliuose (120 simb.: pilnumas IR vartai)

Prieš taisant „klaidas" — patikrinti, ar klysta ne tavo taisyklė (8 Churu, 216 bruto)

Nuorodos žmogui veda į SVETAINĘ, ne į admin — taip greičiau

Google taksonomijos ID imti iš oficialaus failo per tiltą, ne iš atminties

runner.mjs rašyti IŠ NAUJO kiekvienam paleidimui, niekada per sed grandinę
```

---

## APRAŠYMŲ STILIAUS STANDARTAS (iš savininko taisymų)

```
2–3 sakiniai, minimum 90 simbolių
1: kas tai ir kaip atrodo   2: kam tinka (PIRKĖJO nauda)   3: matmenys
Neišvardinti visų detalių · nerašyti poveikio teiginių („valo dantis")
Licencinių personažų neminėti · tik tai, kas matyti nuotraukoje ar pavadinime
```
