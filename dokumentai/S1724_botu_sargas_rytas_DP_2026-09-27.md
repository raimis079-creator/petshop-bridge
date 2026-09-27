# S1724 · Botų sargas v1.2 (nofollow) + Ryto sargas v1.7/v1.8 + DP generatoriaus faktai (2026-09-27 14:00–14:55)

## 3. YITH filtrų nuorodos nofollow + lemputė „botų užtvara" — GYVAI

- `mu-plugins/petshop-botu-sargas.php` **v1.2** (md5 `3c39cbdb…`, bak `ps-archyvas/petshop-botu-sargas.php.bak_s1724`, repo `deploy/petshop-botu-sargas-v1.2.php`): `nofollow_buferis()` ant `template_redirect` 999 (prekių taksonomijos, shop, paieška) → `nofollow_html()` prideda `rel="nofollow"` visoms `<a>` su `filter_` arba `yith_wcan=` href. JS neliestas (YITH AJAX veikia kaip veikė). `uztvara_suvestine()`: gzopen naujausias `logs/*.tar.gz*` (mtime ≤ 1 val.), skaičiuoja 403 / 403-filtrai / 500 / 302 / viso, kešas opcijoje `ps_uztvara_suvestine`.
- `mu-plugins/petshop-rytas.php` **v1.7** (bak `.bak_s1724b`): lemputė `botu_uztvara` — raudona 500 ≥ 50; geltona 500 ≥ 10 arba 403-filtrai ≥ 150 000; kitaip žalia. Etiketėje log'o data `m-d` (log'as sukasi 06:00, todėl `$fm − 6h`).
- Pastaba: Super Cache Expert dabar atiduoda filtrų nuorodas iš kešuoto HTML — nofollow jame yra, nes buferis suveikia prieš kešavimą.

## 5. S1722 likučiai

### 5a. Rinkinių nuotraukų lemputė — GYVAI
- `petshop-rytas.php` **v1.8** (md5 `40a95f96…`, bak `.bak_s1724c`, repo `deploy/petshop-rytas-v1.8.php`, deploy `s1724/y.php`, recon `x.php`): lemputė `rinkiniai_foto` — MnM (rinkinių) prekės be miniatiūros failo (`_thumbnail_id` tuščias arba failo nėra); ≥3 raudona, 1–2 geltona. Dabar: **1 iš 28 — #34938 „Skanėstų dėžutė katei"** (Raimio grupinė nuotrauka) → geltona. Ryto sargas: **18 lempučių**.
- Dingimo priežastis (kas 09-03 nuėmė `_thumbnail_id`) **netirta** — ~30–60 min, tik jei Raimis pasakys.

### 5b. DP (dvigubos pakuotės 2×2–10 kg) generatorius — faktai, LAUKIA RAIMIO SPRENDIMO
- Istorija (`ps_ist_fakt_eilutes`, senoji platforma): kg-prekių eilučių 6 149, iš jų qty ≥ 2 — **566 (9 %)**; daugiausia TOFU kraikas 2,5 kg, Josera 12,5/10 kg.
- WC nuo starto: qty = 2 eilučių **11**. Esami DP rinkiniai (MnM) parduoti **≤ 1 vnt. kiekvienas**.
- Kandidatų (kg-prekės 2–10 kg su likučiu, be esamo DP): **239**.
- Variantai: **a)** generuoti visus 239 (daug puslapių, mažai paklausos — SEO „plonas turinys", kešo/importo apkrova); **b)** tik šeimoms su 2+ istorinėm qty≥2 eilutėm (~20–40 prekių, tikslinė); **c)** vietoje DP prekių — krepšelio taisyklė „2 vnt. −X %" (be naujų puslapių, veikia visoms). Mano nuomonė: b arba c; a — ne.

## Įrankiai
repo `irankiai/s1724_s…y.php`. Pamoka ta pati: `device_commit_files` tuo pačiu stagedPath antrą kartą — senas turinys, naudoti naują vardą.
