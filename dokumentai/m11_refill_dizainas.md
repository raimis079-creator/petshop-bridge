# M11 Refill Engine — dizaino sprendimas (paprastas + tikslus)

## Problema su "teoriniu" skaičiavimu

Pradinė idėja: skaičiuoti kada maistas baigsis pagal pakuotės svorį + gyvūno paros normą.
BET recon parodė problemas:
- WC produktų `weight` laukas TUŠČIAS (negalima imti svorio iš čia)
- `pa_pakuotes_dydis` formatas nevienodas ("1,5 kg" vs "720 g" — kg/g maišosi, kablelis)
- Paros norma priklauso nuo daug faktorių (dydis, amžius, aktyvumas, produkto kalorijų)

Teorinis skaičiavimas = daug prielaidų = daug klaidų. NETINKA principui "mažiau klaidų".

## Sprendimas: self-calibrating iš pirkimo istorijos (paprastas + tikslus)

Vietoj teorinių normų — mokomės iš KLIENTO REALAUS elgesio:

### Etapas 1 (launch — MVP): fiksuotas numatytas intervalas
- Kai klientas perka maisto produktą → įrašom į refill tracking
- Numatytas refill intervalas pagal pakuotės kategoriją (grubus, bet saugus):
  - Maža pakuotė (konservai, <500g) → 14 d.
  - Vidutinė (0.5-3 kg) → 30 d.
  - Didelė (3+ kg) → 60 d.
- predicted_empty_date = order_date + intervalas
- confidence = 0.4 (žemas — tik numatytas)

### Etapas 2 (po 2+ pirkimų): kalibravimas iš realaus intervalo
- Kai klientas perka TĄ PATĮ produktą antrą/trečią kartą:
  - Apskaičiuojam REALŲ intervalą tarp pirkimų (pvz. 35 d.)
  - Naudojam realų intervalą prognozei
  - confidence didėja (0.7 → 0.9) su kiekvienu pakartotiniu pirkimu
- Tai TIKRAI self-calibrating — mokosi iš realaus vartojimo, ne teorijos

## Kodėl tai geriau

1. **Mažiau klaidų:** nereikia parsinti nevienodo pakuotės formato ar spėti paros normų
2. **Tikslesnis laikui bėgant:** realus pirkimo intervalas > teorinė norma
3. **Paprastas MVP:** launch'ui pakanka grubaus intervalo, kalibravimas ateina savaime
4. **Naudoja tik patikimus duomenis:** order_paid datos (100% tikslūs)

## DB struktūra: ps_refill_tracking

| laukas | reikšmė |
|--------|---------|
| id | PK |
| user_id | kam |
| pet_id | kuriam augintiniui (NULL jei nežinom) |
| product_id | koks produktas |
| last_order_id | paskutinis užsakymas su šiuo produktu |
| last_purchase_date | kada paskutinį kartą pirkta |
| purchase_count | kiek kartų pirkta (kalibravimui) |
| avg_interval_days | vidutinis intervalas tarp pirkimų (kalibruojasi) |
| predicted_empty_date | prognozuojama baigsis |
| confidence | 0.4 (naujas) → 0.9 (kalibruotas) |
| status | active / snoozed / cancelled |
| created_at, updated_at | |

## Srautas

1. **order_paid event** → tikrinam ar yra maisto produktų → įrašom/atnaujinam refill_tracking
2. **Kalibravimas:** jei tas pats produktas pirktas anksčiau → apskaičiuojam realų intervalą
3. **Cron (kasdien):** tikrinam refill_tracking → jei predicted_empty_date artėja (pvz. -5 d.) →
   fire'inam refill_due event → Sender siunčia priminimą

## refill_due event payload (atitinka schemą)

- pet_id, product_id, predicted_empty_date, confidence (required)
- product_name, last_order_id, days_since_last_order

## Sender mirror

- PS_REFILL_CANDIDATE = true (kai turi bent 1 aktyvų refill)
- PS_NEXT_REFILL_DATE = artimiausia predicted_empty_date
