# Launch domeno migracija: dev.avesa.lt -> petshop.lt (S189 radinys)

**Aptikta:** S189 E2E teste — WooCommerce užsakymo laiške produkto paveikslėlis rodė
"linked image cannot be displayed" (Outlook negalėjo pasiekti dev.avesa.lt).

**Priežastis:** paveikslėlių URL hardcoded į dev.avesa.lt; dev aplinka neprieinama išorei
(blog_public=0, galimai Basic Auth/IP apribojimai).

---

## DB skenavimo rezultatai (kiek dev.avesa.lt URL yra)

| Vieta | Kiekis | Kritiškumas |
|-------|--------|-------------|
| wp_options | 28 | AUKŠTAS (siteurl, home, WC email logo, wcdn PDF, flatsome) |
| wp_postmeta | 9 | VIDUTINIS (galimai product galerijos) |
| wp_posts (content) | 49 | AUKŠTAS (produktų aprašymuose hardcoded img/nuorodos) |

### Svarbiausi options su dev.avesa.lt:
- `siteurl`, `home` — pagrindiniai (jau checklist'e)
- `woocommerce_email_header_image` — WC laiškų logo (KRITIŠKA — matosi kiekviename laiške)
- `wcdn_settings` — PDF sąskaitų nustatymai (KRITIŠKA — sąskaitose)
- `flatsome_registration` — temos registracija
- Likę: transient'ai (praeis savaime), mūsų probe rezultatai (nesvarbu — galima ignoruoti)

---

## SPRENDIMAS: pilnas DB search-replace (NE tik siteurl/home)

Paprastas siteurl/home pakeitimas NEUŽTENKA. Reikia pilno search-replace visoje DB,
kuris TEISINGAI tvarko serializuotus duomenis (PHP serialize).

### Rekomenduojamas būdas (vienas iš):

**A. WP-CLI (patikimiausias, jei serveriai.lt leidžia SSH/WP-CLI):**
```
wp search-replace 'dev.avesa.lt' 'petshop.lt' --all-tables --precise --recurse-objects --skip-columns=guid
wp search-replace 'http://petshop.lt' 'https://petshop.lt' --all-tables --precise
```
- `--skip-columns=guid` — GUID nekeisti (WP taisyklė, guid yra istorinis identifikatorius)
- `--precise --recurse-objects` — teisingai tvarko serializuotus masyvus

**B. Better Search Replace plugin (jei nėra WP-CLI):**
- Įdiegti, paleisti dry-run pirma, tada apply
- Pažymėti "Run as dry run" pirma, patikrinti kiek pakeitimų
- Tada apply su serializuotų duomenų palaikymu

### SVARBU — eiliškumas launch metu:
1. Pirma pakeisti hosting/DNS kad petshop.lt rodytų į naują serverį
2. DB search-replace dev.avesa.lt -> petshop.lt
3. Patikrinti siteurl/home = https://petshop.lt
4. blog_public = 1 (įjungti indeksavimą)
5. Išvalyti visus transient'us (wp transient delete --all) — seni dev URL transient'uose
6. Regeneruoti WC email header image nustatymą (patikrinti kad logo URL = petshop.lt)

---

## Papildomi punktai (jau žinomi, priminimas):

- 6 cron jobs serveriai.lt: dev.avesa.lt -> petshop.lt (import_key=v, import_id nekeisti)
- wp-config.php: define('PETSHOP_ENVIRONMENT','production')
- Invoice series AVPN/IAPV reset to 101
- Re-enable indexing (blog_public=1)
- GSC URL audit + top-100 redirect mapping (breed pages ~51% traffic)

---

## Po migracijos — VERIFIKACIJA:

- [ ] Testinis užsakymas -> laiškas -> produkto paveikslėlis matosi (ne broken)
- [ ] WC email logo matosi
- [ ] PDF sąskaita generuojasi su petshop.lt
- [ ] Produktų aprašymuose paveikslėliai/nuorodos veikia (49 posts!)
- [ ] Nėra likusių dev.avesa.lt (pakartoti DB skenavimą po replace)
