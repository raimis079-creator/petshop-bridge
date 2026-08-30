# DEPLOYMENT LOG PAPILDYMAS — S1532–S1534 (2026-08-31)

Papildo deployment_log_v1_9_11.md (paskutinis S1531). Sesija: naujienlaiškių
kryptis — būklės patikra + klientų failo priėmimas. Kodas NEDIEGTAS, tik recon.

---

## S1532. TILTO ATKŪRIMAS + run.sh ĮAMŽINTAS REPO ✅

`run.sh` nebuvo saugomas bridge repo (gyveno tik konteineryje) — kiekviena
sesija jį atkūrinėjo iš atminties. Atkurtas iš gyvo `screenshot.mjs` (S1531
versija = šablonas) ir **įkeltas į repo `irankiai/`**:

```
irankiai/run.sh              — pilna automatika: lint → Python template fill →
                               Contents API PUT su SHA → 25s → dispatch 298960963 →
                               poll → rezultatas per commit SHA
irankiai/mjs_template.mjs    — screenshot.mjs šablonas (B64/VER/GKEY/PHASES/OUT
                               pildomi per re.sub)
```

Sesijos startas nuo šiol: PAT į /tmp/.ghtok → parsisiųsti `irankiai/run.sh` +
`mjs_template.mjs` į /home/claude/ps/ → chmod +x → dirbti. PHP 8.3 lint'ui:
`apt-get update -qq && apt-get install -y -qq php8.3-cli`.

---

## S1533. NAUJIENLAIŠKIŲ SISTEMOS RECON — EMPIRINĖ BŪKLĖ ✅

Du runai (analize/nlrecon.json, nlrecon2.json). Serveryje GYVA:

| Failas | Versija | Esmė |
|---|---|---|
| petshop-naujienlaiskiai.php | v1.0 | variklis: ps_naujienlaiskiai lentelė (0 įrašų), newsletter srautas, korteles blokas be kainų, marketing poraštė |
| petshop-naujienlaiskiai-admin.php | v1.0 | redaktorius, gyva peržiūra, prekių parinkiklis, dry→peržiūra→GO |
| petshop-kampaniju-langas.php | v1.1 | founding/legacy/newsletter bangos, job_key idempotencija, STOP/GO po bangos |
| petshop-rezultatai.php | v1.1 | šviesoforas, suppression, email→pajamos (last-click 7 d.) |
| petshop-laiskai.php | v1.3 | dispatch gyvas, cron ps_email_dispatch_cron |
| petshop-laiskai-importas.php | v1.5 | ŠABLONŲ importas į redaktorių (NE klientų!) |

Sender: klasės Petshop_Sender_Adapter / Email_Dispatch / Event_Registry yra;
raktai options petshop_esp_sender_mk/tk + webhook_secret. ps_consent_log
veikia (11 įrašų, unsubscribe kelias įrodytas 07-31). ps_email_jobs 17
(order_paid/post_purchase_2d/refill_due/cart_abandoned). ps_naujienlaiskiai 0.

**PASTABA ATMINČIAI:** deployment_log v1.9.11 šių modulių diegimo NEFIKSUOJA
(diegta sesijoje, kurios log fragmentas nepateko į master) — būklė dabar
užfiksuota čia empiriškai. Bridge deploy/ turi tik kampaniju-langas.php.b64.

Trūksta: klientų duomenų (D7) · klientų importerio · sukurtų laiškų ·
Sender tracking CNAME (OPS-08).

---

## S1534. KLIENTŲ FAILAS PRIIMTAS — FORMATAS TINKA, PLANAS SUTARTAS ✅

**Failas:** Petshop_Newsletter_Customer_Intelligence_SUTVARKYTAS_2026-08-30.xlsx
(įkeltas į bridge `duomenys/nl_klientai_2026-08-30.xlsx.b64`).

**Profilis:** 563 klientai · 0 dublių · 0 blogų email formatų (1 eilutė
pažymėta „BLOGAS EMAIL" kokybės stulpelyje — patikrinti importe) · visi
Newsletter=TAIP → tai K1 „~560 švarus sutikimų pagrindas". 476 su pirkimo
istorija (1 435 užsakymai, 7 lapai: Dashboard/Klientai/Kampanijos/Užsakymai/
Pirkimai/Produktai/Metodika).

**Segmentai (prioritetai 1→7):** Refill-laikas 34 · Refill-artėja 19 ·
1-pirkimas-reikia-2-o 16 · Aktyvus pakartotinis 31 · Reaktyvacija 57 ·
Win-back 319 · Nepirkęs 87. Kiekvienam — NBA (konkreti prekė/kategorija),
gyvūnas (206 šuo / 204 katė / 32 multi), brandas, medianinis refill ciklas.

**SUTARTAS PLANAS (vykdymas kitoje sesijoje):**
1. Importeris (naujas modulis): XLSX → `ps_nl_klientai` lentelė su visais
   intelligence laukais + WC paskyros TYLIAI (F-KLIENTAI: jokių laiškų
   importo metu!) + marketing_consent=true į ps_consent_log su
   source='eshoprent_newsletter_import'. DRY → Raimio peržiūra → APPLY.
2. Kampanijų lango `segmentai()` prijungti prie ps_nl_klientai —
   7 prioritetai = siunčiamos auditorijos.
3. Laiškai redaktoriuje (korteles blokas refill personalizacijai).
4. Bangos su STOP/GO; Rezultatai v1.1 matuoja pajamas.

**ATVIRI KLAUSIMAI RAIMIUI (prieš siuntimą, ne prieš importą):**
- **K-NL1 kada siųsti:** TŽ §14 užrakinta — vykdymas PO launch (po 10-01),
  iš gyvo petshop.lt. Claude siūlo: importas + laiškų paruošimas dabar,
  siuntimas po perjungimo. LAUKIA PATVIRTINIMO.
- **K-NL2 pirmas laiškas:** TŽ tekstas „pasisveikinimas nuo komandos +
  anketa, be pažadų" visiems, ar iškart segmentuoti 1–7? Doktrina max
  2×/mėn. → siūlymas: №1 pasisveikinimas visiems, №2 segmentuotas.
  LAUKIA SPRENDIMO.

**GDPR pastaba:** TŽ §14 „sutikimai neperkeliami" vs K1 „560 opt-in švarus
pagrindas" — interpretacija: šie 563 SU aiškiu naujienlaiškio sutikimu
perkeliami kaip marketing_consent=true; likusieji ~2 000 pirkimo paštų —
tik paskyros be sutikimo (Art. 14 kelias). Raimis žodžiu neprieštaravo,
formaliai patvirtinti prie importo APPLY.

---

## KITAS LANGAS — EILĖS TVARKA

1. Klientų importeris (S1534 planas, DRY→APPLY).
2. K-NL1 + K-NL2 atsakymai iš Raimio.
3. Pirmo laiško juodraštis redaktoriuje.
4. (lygiagrečiai gyvena) F19 pending iš S1531: MVP #4 atsargų patikra,
   MVP #5 T-5 laiškas, MVP #7 likutis.

Aukščiausias decision Nr.: **S1534**. Kodas serveryje nekeistas, TEMP
snippetai po runų deaktyvuoti automatiškai (runner'io CL logika).
