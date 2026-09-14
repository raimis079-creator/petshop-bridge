# ANALIZĖ C — rinkodaros sutikimų būklė (S1684, 2026-09-14)

Recon: `irankiai/s1684_mc.php`, `s1684_mc2.php` → `analize/s1684_mc.json`, `s1684_mc2.json`. Read-only.

## 1. Kas yra
| Šaltinis | Kiek | Kilmė / įrodymas |
|---|---|---|
| `usermeta.ps_marketing_consent` = true | **561** | `ps_consent_log` source `eshoprent_newsletter_import`, 2026-08-31 — eShoprent naujienlaiškio prenumeratorių sąrašas (ne visi klientai) |
| Nauji sutikimai po T-0 | **7** per 2 sav. | `footer_form` 5, `newsletter_form` 2 |
| Atsisakymai | 3 (Sender reconcile) + 2 unsubscribe_link (testai) | `ps_email_suppression` |
| Istoriniai klientai iš viso | 5 702 WP vartotojų (5 431 hash `ps_ist_*`), `_ps_ist_n/_pirmas/_paskutinis/_suma` meta | be sutikimo žymos — **~5 100 be sutikimo** |
| Kasa | `[woocommerce_checkout]` klasikinė, **rinkodaros opt-in lauko NĖRA** (kode `ps_marketing_consent` kasoje nenaudojamas) | — |
| Sender | lentelių/meta plugino WP pusėje nėra; sync per `sender_reconcile` (suppression) ir webhook (`transactional_only`) | kontaktų politika neaiški (S1676 atviras punktas) |
| MailPoet | 1 subscriber, išjungtas | — |

## 2. Lifecycle infrastruktūra jau parašyta, NEĮJUNGTA
`ps_email_content` — 15 srautų, visi `draft`: post_purchase_2d/7d/14d („pakartoti"), refill_due, win_back_60/90/120, legacy_reactivation_l1, cart_abandoned_1/2, back_in_stock, subscription_t5, pet_reminder_due, order_shipped, shipment_returned. `ps_email_jobs` tuščia; `ps_subscriptions` 0 eilučių. T. y. vartai C techniškai — turinio ir įjungimo klausimas, ne kūrimo.

## 3. Teisinis rėmas (ERĮ 81 str.) — Q4 sprendimai
- **561 eShoprent prenumeratorių** — aiškus naujienlaiškio užsisakymas, importuotas su žurnalu → naudotini (su opt-out kiekviename laiške).
- **~5 100 istorinių pirkėjų be žymos** — soft opt-in galimas tik jei renkant el. paštą buvo rodoma atsisakymo galimybė; **įrodymo nėra (Raimis: nuotraukos neturi) — laikome NEĮRODOMU**. Konservatyvi kryptis: jiems tik `legacy_reactivation_l1` vienas laiškas su aiškia opt-in/opt-out (rizikos priėmimas — Raimio sprendimas) ARBA visai neliesti; refill/win-back — ne.
- **Nauji nuo T-0** — kasoje opt-in lauko nėra → refill/win-back naujiems klientams šiandien **negalimi teisėtai** kaip tiesioginė rinkodara. **Blokuojantis darbas Q4 #1: opt-in laukas kasoje (soft opt-in tekstas su opt-out) + įrašas į `ps_consent_log` source `checkout`.** Be to R60 lifecycle etapai 1+2 neturi gavėjų.
- Refill/„pakartoti" = tiesioginė rinkodara (ne transakcinis) — sutarta S1683.

## 4. Skaičiai plane
- Adresuojama bazė lifecycle'ui šiandien: 561 (iš jų maisto pirkėjų ~30–40 % → ~200) + 7.
- Su kasos opt-in nuo spalio (tipinis 40–60 % pažymėjimo lygis, jei iš anksto pažymėtas nedraudžiama — tikrinti; nepažymėtas ~15–25 %): ~120 naujų/mėn. × 40 % ≈ 50/mėn. → R60 lifecycle imtis 3 mėn. ≈ 150 klientų — Q4 = instrumentavimas, 90/10 holdout matavimui reikės Q1.
