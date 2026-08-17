# PERDAVIMAS Į NAUJĄ LANGĄ — 2026-08-18 (naktis)

## Pirmi žingsniai naujame lange

1. Prijungti GitHub PAT (bridge `raimis079-creator/petshop-bridge`, workflow `298960963`)
2. Perskaityti `REGISTRAS.md` **§8m** — visa šios nakties esmė
3. `deployment_log_v1_5_2.md` [S971–S986] — detalės

**Dokumentų būklė:** TŽ MASTER v1.79 (nekeista) · deployment_log **v1.5.2** ·
REGISTRAS su §8m, atnaujintais OPS-06, Q-MERCH-1/2/3, Q-R2.

---

## KAS PADARYTA ŠIĄNAKT

```
✅ Q-MERCH žvalgyba: piltuvelis 2 596 kandidatai, laukų padengimas išmatuotas
✅ RADINYS: Kaina24/Kainos.lt feed'ai NEGYVI (miršta ties 256M)
✅ RADINYS: VF siunčia 12 simbolių barkodus — nukirstas EAN-13 (tiekėjo pusė)
✅ GTIN taisymas: 1 963 prekės · galiojantys 394 → 2 015 · vizualiai patvirtinta
✅ ŠAKNIS: class-vf-import.php v1.5.7 — normalizavimas prieš rašymą
✅ Idempotencija įrodyta: kitas Import #5 nebeperrašinės (965/979)
```

Atsarginės kopijos: `uploads/ps-backups/gtin_backup_20260817_204552.json` ir
`class-vf-import_v156_20260817_211108.php.bak`.

---

## LAUKIA SAVININKO — DU MYGTUKAI (blokuoja Google)

```
1. Google Cloud → projektas prefab-envoy-482617-b4
   → įjungti "Content API for Shopping"
2. Merchant Center → Nustatymai → Naudotojai → pridėti
   claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com
   (Skaitytojo teisių pakanka)
```

Po to per vieną tilto paleidimą matysis: ar paskyra egzistuoja, ar domenas
patvirtintas, kiek prekių, kokie atmetimai istorijoje. Iki tol **Q-MERCH-1
lieka neatsakytas** ir Google darbo tęsti prasmės nedaug.

---

## KITAS DARBAS (eilės tvarka)

**1. Feed'o variklis** — vienas modulis, trys išvestys (Google, Kaina24, Kainos.lt).
```
BŪTINA: paketais (batch), ne posts_per_page=-1 — dabartinis miršta ties 256M
filtras: publish · ne hidden · ne rinkinys · instock (savininko sprendimas)
GTIN: _global_unique_id; jei nėra → brand + mpn(SKU) + identifier_exists:no
variantai: 39 tėvai / 158 variacijos → reikės item_group_id
```

**2. Google kategorijų mapinimas** — 80 `product_cat` → Google taksonomija.
Rankinis vienkartinis darbas, nulis susiejimų šiandien.

**3. Duomenų spragos prieš siuntimą**
```
128 prekės be brendo · 46 be aprašymo · 3 be kainos · 1 352 be svorio
594 prekės be jokio kodo
4 CATIT su 11 ženklų kodais: 19042, 19045, 19048, 19051
```

**Merchant Center jungimas — TIK po perjungimo.** Google tikrina realius prekių
URL ir domeno nuosavybę; dev.avesa.lt yra `noindex`. Domeno patvirtinimą
petshop.lt galima daryti jau dabar — senoji svetainė gyva.

---

## KRITINIS KELIAS NEPASIKEITĖ — F-PSR (Paysera)

```
Projektas 29276 · dev režimas testinis, konfigūracija NEBAIGTA
Q-PSR2 laukia · savininkas 2026-08-17: „nepajungta, nepraeisi"
Perjungimo datos fiksuoti negalima, kol neuždaryta.
```

---

## ATVIRI KLAUSIMAI

```
Q-MERCH-1   ar MC paskyra egzistuoja — laukia dviejų mygtukų aukščiau
Q-PSR2      Paysera patvirtinimas — BLOKUOJA perjungimą
Q-VF-KAT    120 iš 241 kategorijų nesumapinta (682 prekės) — NELENDAM
Q-R7        670 juodraščių užstoja importą — prekybinis sprendimas
Q-VARIANTAI seni variantai iškrito į atskiras prekes — mastas neišmatuotas
Q-SEO       kurios 404 kategorijos bus — blokuoja 44 URL mapinimą
Q-ENGINE    serveriai.lt: ar keis default_storage_engine
```

## KO NELIESTI BE SAVININKO

```
prekės apskritai · kategorijų mapinimas · _vf_supplier_sku toms 27 prekėms
SEO 44 URL · ZB kainos
```

---

## TILTO PAMOKOS (šios sesijos)

```
exec() SERVERYJE IŠJUNGTAS. php -l neveiks. Sintaksės patikra prieš rašant failą:
  token_get_all($kodas, TOKEN_PARSE) + catch (\ParseError)
  (tas pats būdas jau buvo S518 — buvo pamirštas)

wp-admin puslapiui per Playwright NEUŽTENKA logged_in slapuko —
  reikia ir SECURE_AUTH_COOKIE, kitaip gauni 10 KB puslapį be turinio
  ir „patikra" būna tuščia.

GTM_SA_JSON paslaptis yra JSON BE išorinių riestinių skliaustų:
  JSON.parse('{'+raw+'}')

update_post_meta grąžina false, kai reikšmė NESIKEIČIA. Tai ne klaida.
  Tikrinti perskaitymu, ne grąžinamos reikšmės skaičiavimu.

runner.mjs rašyti IŠ NAUJO kiekvienam paleidimui, niekada per sed grandinę.
```
