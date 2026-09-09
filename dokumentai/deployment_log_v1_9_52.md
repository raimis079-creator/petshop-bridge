# deployment_log v1_9_52 — S1661–S1663 (2026-09-09 diena)

## S1661 — kitos sesijos (S1688/S1689) ataskaitos patikra + likučio grąžinimas

**Kontekstas.** Kita sesija pranešė 3 problemas. Raimis paprašė patikrinti hipotezes.

1. **Welcome modalas — hipotezė KLAIDINGA.** Modalas v1.3 visą laiką GYVAS:
   `wp-content/plugins/petshop-core/includes/class-welcome-modal.php`
   (paprastas pluginas, NE mu-plugins; md5 `b7bcf6af97626216823332ecfe6db4be` = repo
   `deploy/class-welcome-modal.php`). Ataskaita grepino tik mu-plugins. Jungiklis
   `petshop_welcome_modal_enabled=1` (Raimis įjungė) veikia — titulinis rodo modalą.
   Deploy bandymas į mu-plugins gavo „Cannot redeclare class" 500 → auto-rollback suveikė.
   **PAMOKA: grep patikros privalo apimti wp-content/plugins ir temą, ne tik mu-plugins.**
2. **8 vnt grąžinta rankiniu.** #35874 ir #35875 (pid 14951 „Žarnų pagaliukai, 80 g")
   atšaukti be likučio grąžinimo. Grąžinta +4+4 (10→18) su pastabom „S1661".
   −1 neatitikimas = teisėtas #35876 (pending, 11→10).
3. **Mechanizmas.** „Likutis sumažintas/padidintas" pastabos = WC core (vertimai);
   AV variklio `grazinti()` nedalyvauja (užsakymai be `_ps_av_reduced`).
   E2E (testinis #35878, ištrintas): rankinis `update_status('cancelled')` grąžina TVARKINGAI.
   Tikroji priežastis: **kliento grįžimas į order-pay puslapį (pakartotinis „Stock hold")
   ištrina eilutės `_reduced_stock` ir HPOS `stock_reduced` žymę** → vėlesnis atšaukimas
   (core `wc_maybe_increase_stock_levels`) nieko negrąžina ir žymę nuima tyliai.
   Koreliacija: 35873 (hold 12:39), 35874 (13:02–08), 35875 (13:18–25) — meta dingusi;
   35876 be pakartotinio apsilankymo — meta sveika. Tiksli trynimo kodo vieta
   (WC core/ReserveStock kelias) — **ATVIRA**.
   **#35873 apsaugotas:** `_reduced_stock=4` + `set_stock_reduced(true)` atstatyta su pastaba.
4. TEMP snippetų valymas: 101 senų `TEMP PS dep-%` ištrinta iš DB.

## S1662 — sargas + AVPN tik apmokėtiems

1. **Sarginis snippetas GYVAS** — id **5323** „Petshop Sargas Likucio grazinimas v1.0
   (atsaukimo patikra)": ant `woocommerce_order_status_cancelled` prio 99; jei yra
   „Likutis sumažintas" pastaba be grąžinimo — rašo ⚠ įspėjimo pastabą. Nieko nekeičia.
   LAIKINAS iki tikrosios trynimo vietos radimo.
2. **AVPN tik apmokėtiems (Raimio taisyklė).** `flatsome-child/functions.php`
   `petshop_get_invoice_document_type` perrašyta GYVAI pilnu failu:
   proforma (IAPV) kol `!is_paid` bet kuriam gateway (anksčiau tik bacs — Paysera
   pending degino AVPN). md5 `1dd8e6f66a3960bae4b9a5377abff78e`, backup serveryje
   `functions.php.bak-s1662`, repo `deploy/functions-child-s1662.php`.
   Priskyrėjas — lazy `petshop_get_avpn_number()` (functions.php ~238), kviečiamas iš
   `petshop_get_invoice_title()`.
3. **Esamų tvarkymas.** AVPN nuimta su pastabom: 35871 (011001), 35873 (011003),
   35874 (011004), 35875 (011005), 35876 (011006). **#35872 pernumeruotas
   011002→AVPN011001** (pirmas realus klientas, apmokėtas 06:56; `_petshop_completed_pdf`
   buvo tuščias — saugu). Counter `petshop_avpn_counter`=11002.
   **Seka be skylių: 011000 (Raimio testas #35868), 011001 (#35872).**
4. Rytinė patikra №1 faktiškai ĮVYKDYTA: #35872 Paysera callback → processing automatiškai.

## S1663 — užsakymų numeracija + modalo tekstų patikslinimas

1. **Numeracija klientui nuo 1000** (Raimio sprendimas; nesimaišo su AVPN 11xxx).
   Snippetas **5330** „Petshop Uzsakymu Numeracija v1.0 (woocommerce_order_number filtras)":
   `petshop_order_counter` (KITAS numeris; atominis LAST_INSERT_ID), meta `_ps_order_number`
   per `woocommerce_new_order` (checkout-draft PRALEIDŽIAMAS — numeriai nedeginami
   juodraščiams; priskiriama išėjus iš draft), `woocommerce_order_number` filtras.
   Vidiniai ID 35xxx nekeisti (Paysera/siuntos/DB nepaliesta).
   **Esami 35868–35876 palikti senais numeriais (Raimio sprendimas).**
   E2E: testinis #35879 gavo nr 999, ištrintas; counter=1000 — pirmas realus bus **#1000**.
2. **Modalo tekstai.** Raimio 09-07 nuotrauka („Ta pati parduotuvė, kurią pažįstate…")
   = v1.2 iš dev. Raimis PATVIRTINO: galutinis A tekstas = gyvasis v1.3
   („Atnaujinome parduotuvę: prekių turime daugiau…" / „Pridėti augintinį").
   Gyvai nieko nekeista. **Modalo tema uždaryta galutinai.**

## Atviri po S1663

- Mechanizmo šaknis: tiksli vieta, kur order-pay kelias ištrina `_reduced_stock` (sargas 5323 dengia).
- #35872 wcdn meta `_wcdn_invoice_number='AVPN35872'` — wcdn fallback šablonas su AVPN
  prefiksu + order id; klaidinantis dublikatas šalia tikros AVPN011001. Aptarti/tvarkyti.
- Rytinės iš STARTAS po T0: `s1634_g` stiliaus patikra (Warning/eilės/cron/404, titulinio 9 img,
  `ps_sender_webhook_log`), istorijos `irankiai/s1643_h2.php` kėlimas, `ps_*_bak` (38) valymas.
- Raimio sprendimai: #35868 trinti/palikti; Raimio veiksmai iš STARTAS (cron URL, Sender webhook,
  GSC/Ads Brand, Kaina24/Kainos resubmit, Flatsome licencija, pirma reali siunta, TTL 300→3600).
