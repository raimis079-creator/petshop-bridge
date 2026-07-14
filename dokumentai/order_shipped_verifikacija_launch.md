# order_shipped realios meta verifikacija — ATSKIRA UŽDUOTIS (launch)

**Statusas:** Atidėta. Tikrinti launch dieną su pirmu realiu siuntiniu.
**Kodėl atskirai:** dev testas patvirtino kad logika veikia su TIKĖTINA meta struktūra,
bet nepatvirtinta ar sena/dabartinė petshop.lt naudoja tuos pačius meta raktus.

---

## Ką reikia patikrinti

Mano `resolve_tracking()` (M12, S192) skaito tracking iš šių meta raktų:
- **LP Express:** `_woo_lithuaniapost_barcode`
- **Venipak:** `venipak_shipping_order_data` (JSON) → `pack_numbers[]`

Šie raktai teisingi DEV plugin'ams (wc-venipak-shipping, woo-lithuaniapost-main).
BET nepatvirtinta ar sena petshop.lt naudoja:
1. Tuos pačius plugin'us
2. Tas pačias versijas
3. Tuos pačius meta raktus

## Kaip patikrinti (launch dieną arba anksčiau)

### Variantas A — greitas (Raimis, admin)
Sename/naujame WordPress admin atidaryti vieną Venipak išsiųstą + vieną LP išsiųstą
užsakymą, pažiūrėti kur rodomas tracking numeris.

### Variantas B — tikslus (Claude, po migracijos)
Po domeno migracijos (kai realūs užsakymai bus naujoje DB), paleisti recon snippet'ą
kuris nuskaito realaus išsiųsto užsakymo VISUS meta raktus ir patikrina ar
`_woo_lithuaniapost_barcode` / `venipak_shipping_order_data` egzistuoja su duomenimis.

### Variantas C — su pirmu realiu siuntiniu (launch)
Po launch, kai bus išsiųstas pirmas realus užsakymas:
1. Patikrinti ar order_shipped event realiai fire'ino (event_log)
2. Jei ne — nuskaityti to užsakymo meta ir pritaikyti resolve_tracking()

## Jei meta raktai skiriasi

Reikės atnaujinti `Petshop_Event_Emitters::resolve_tracking()`:
- Pridėti alternatyvius meta raktus (senos versijos)
- Arba pritaikyti prie realios struktūros

Failas: plugins/petshop-core/includes/class-event-emitters.php

## Rizikos lygis

ŽEMAS. order_shipped yra "nice to have" siuntos pranešimas, ne kritinis srautas.
Jei pradžioje neveiktų — klientai vis tiek gauna WooCommerce native "completed" laišką.
Refill (M11) ir kiti kritiniai srautai NEPRIKLAUSO nuo order_shipped.
