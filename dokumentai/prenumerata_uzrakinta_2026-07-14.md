# Prenumeratos modulio užrakintas sprendimas

**Data:** 2026-07-14
**Statusas:** UŽRAKINTA (nebediscutuojama, tik įgyvendinama)
**Šaltinis:** POC S180 patirtis + Sender.net platformos sprendimas + konsultanto įžvalgos (2026-07-14)

---

## 1. Architektūrinis principas — DVI AŠYS, ne viena

Klaida, kurią išvengiam: laikyti „manual renewal" ir „automatic recurring" alternatyvomis.

Realybėje yra du nepriklausomi sprendimai:

| Ašis | Variantai |
|---|---|
| **Siuntos kontrolė (verslo režimas)** | Klausti prieš siunčiant (T-5 confirm) / Pranešti ir siųsti jei nestabdomas |
| **Mokėjimo mechanika** | Automatiškai Paysera tokenu / Rankinis mokėjimas per Paysera |

**Kombinacijos:**

```
                          MOKĖJIMAS
                          Automatiškai tokenu    Rankinis
SIUNTOS KONTROLĖ          
Klausti prieš siunčiant   ✅ Confirm + token      ⚠️ Confirm + rankinis
                          (default naujiems)      (fallback only)

Pranešti/nestabdo         ✅ Notify + token       ❌ Nesuderinama
                          (po 2 sėkmingų ciklų)
```

**Pasekmė:** „klauskite prieš siunčiant" režimas VEIKIA su Paysera token charge. Klientas kortelę autorizuoja vieną kartą (SCA), gaunam tokeną, T-5 laiške klausiam, klientas patvirtina, sistema charge'ina tokenu. Klientui — nulis frikcijos.

## 2. Launch modelis

Iš TŽ v1.42 (užrakinta), atitinka konsultanto rekomendaciją:

- **Default naujiems klientams:** `confirm_required` + token charge
- **Po 2 sėkmingų ciklų:** klientas gali persijungti į `notify_only` + token charge
- **Rankinis fallback:** tik klientams, kurie nenori saugoti kortelės

## 3. Verslo modelis — 80-90% jau užrakinta TŽ v1.42

Nekartojam diskusijų. Priimta:

- 20-30 prenumeratos SKU (MVP)
- T-5 pranešimas VISADA
- Pause / skip / change-date / cancel funkcionalumas
- Dunning ir nesėkmingo mokėjimo atkūrimas
- EU 14 d. atsisakymo teisė

## 4. Dunning retry logika — MŪSŲ pusėje, ne Paysera

Kritinis architektūrinis sprendimas, atitinka pamatinį principą „Event Layer = smegenys, Paysera/Sender = organai".

**Klaida vengti:** Paysera daro retry pati, mūsų dunning laukia jos taisyklių.

**Teisinga:** Paysera atlieka **vieną** charge request, grąžina success/failure. Mes sprendžiame:
- Bandymas T-0
- Antras bandymas +2 dienos
- Trečias bandymas +5 dienos
- Tada prenumerata pauzuojama (ne atšaukiama — pauzė)

Failed payment events keliauja per `ps_event_log` → adapter → Sender dunning workflow.

## 5. Sekantis žingsnis: POC be pilno verslo dokumento

Nedarome „prenumeratos verslo modelio dokumento" nuo nulio. Verslo modelis TŽ v1.42 pakankamai apibrėžtas.

**POC tikslai (WPSubscription Free, dev'e):**
1. Ar sukuria normalius renewal orders?
2. Ar hooks aiškūs (`woocommerce_scheduled_subscription_payment_{gateway}` ar analogiškas)?
3. Ar galima pridėti custom laukus (`pet_id`, `mode`, `delivery_location`)?
4. Ar pause/skip/change-date veikia be core hack'inimo?
5. Ar gateway gali inicijuoti mokėjimą konkrečiu ciklo momentu?
6. Ar HPOS tvarkingas?

**Trukmė:** 1-2 dienos realaus testavimo per bridge.

**SUMO NElaikom paraleliai** — tik jei WPSubscription per pirmas kelias valandas parodys kritinį trūkumą.

## 6. Paraleliai vykstantis Paysera administracinis procesas

Nepriklausomas nuo POC.

**Šiandien (Raimis):** Užsakyti Paysera kortelių priėmimo aktyvavimą projektui 191898 (bazinis sluoksnis).

**Po POC (2-3 diena):** rašom antrą laišką Paysera su:
- Pasirinktas plugin (WPSubscription arba SUMO)
- Kortelinis recurring
- Pirmas mokėjimas su SCA, vėlesni MIT tokenu
- Confirm-required (default) ir notify-only (po 2 sėkmingų ciklų) režimai
- Kintama data (T-5 patvirtinimo įtaka)
- Klausimai: MAC kredencialai, techninė specifikacija, realaus adapterio pavyzdžiai

## 7. Bendra apimtis

**Prenumeratos modulis:** ~savaitė mūsų darbo (POC + laiškas + custom Paysera gateway + integracija).

**Paraleliai:** Paysera administracinis procesas (kortelių aktyvavimas + MAC išdavimas + recurring aktyvavimas).

Ekspertų/agentūrų terminai (savaitės, mėnesiai) nėra taikomi mūsų darbo tempui — bridge + vienas sprendėjas + greitas deploy + faktinis testas + jokio susirinkimų cirko.

## 8. Kas užrakinta (nebediscutuojama)

- ✅ Dvi ašys (siuntos kontrolė × mokėjimo mechanika), ne viena dilema
- ✅ Token charge palaiko OBA verslo režimus
- ✅ Launch default: confirm_required + token
- ✅ Notify_only tik po 2 sėkmingų ciklų
- ✅ Rankinis mokėjimas — fallback, ne pagrindinis
- ✅ Dunning retry logika mūsų pusėje, ne Paysera
- ✅ POC pirma WPSubscription (Free), SUMO tik fallback
- ✅ Paysera procesas paraleliai su POC

## 9. Kas kito laukia sprendimo (bet ne šiuo metu)

- Konkretus plugin (WPSubscription vs SUMO) — sprendimas po POC
- Konkretūs 20-30 prenumeratos SKU sąrašas — Raimis parenka verslo sprendimu
- Kortelės atnaujinimo flow (Paysera hosted vs mūsų) — po Paysera atsakymo
- Grąžinimo mechanika (automatinis Paysera API vs rankiniu) — po Paysera atsakymo

