# ESP Adapter Skeleton — Petshop Event Layer

Šis aplankas — Etapo A pradžios artefaktai. Kol negavom Sender atsakymų (LT SMS,
EU serveriai, custom link tracking domain), realaus kodo nepradedam — bet
architektūra jau užrakinta ir aiški.

## Skaitymo tvarka

1. **`class-esp-adapter-interface.php`** — ESP-agnostiškas kontraktas.
   Aprašo ką bet kuris adapter'is (Sender, Brevo, būsimi) turi implementuoti.
   Skaityti pirmiausia — čia matai kokie yra sukūrimo taškai tarp Woo ir ESP.

2. **`event-id-schema.md`** — kaip generuojam `event_id`, kad tas pats
   verslo įvykis niekada nebūtų du kartus siunčiamas, o legaliai kartojami
   (refill, subscription cycles) turėtų aiškų skirtumą.

3. **`retry-queue-architecture.md`** — kas atsitinka kai ESP down.
   Būsenų automatas, backoff seka, DLQ, health metrikos, testas Nr. 11
   (geležinės taisyklės patikrinimas).

## Geležinė taisyklė

> Išjungus konkretų ESP, parduotuvė neprarand nė vieno kliento, sutikimo,
> refill skaičiavimo, prenumeratos ar priminimo. Sustoja tik laiškų ir SMS pristatymas.

Visi trys artefaktai suprojektuoti šią taisyklę palaikyti.

## Statusas

- [x] ESP Adapter interface — projektas užrakintas
- [x] Event ID schema — projektas užrakintas
- [x] Retry queue architektūra — projektas užrakintas
- [ ] Sender POC atsakymai iš support — **laukiam Raimio**
- [ ] Sender POC 11 testų — dar neprasidėjo
- [ ] Realus adapter'io implementacija — po POC praėjimo
- [ ] Etapo A dev checklist (22 punktai iš TŽ v1.45) — po POC

## Kaip Etapo A dev laikysis šitų dokumentų

Kiekvienas taskas Etape A privalo atitikti tai, kas čia užrašyta.
Jei kažkas prieštarauja — dokumentas keičiamas PIRMAS, ne kodas.
