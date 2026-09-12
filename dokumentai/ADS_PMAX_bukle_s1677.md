# ADS / PMax — logika ir būklė (S1677, 2026-09-12 ~19:40)

Vienas dokumentas Ads temai. Pakeičia `ADS_PMAX_bukle_s1676.md` (istorija ten). Kitas langas — nuo `STARTAS_2026-09-13_po_S1677_ADS.md`.

## 0. Krypties pakeitimas (S1677) — kodėl
Raimis: „vien klaidos… man reikia pelningo Ads, visa kita tavo rankose". Kritinė peržiūra parodė, kad problema ne konfigūracijoje, o principuose:
1. PMax be feed'o ir be konversijų signalo — statyta ant nieko (D grupės, 4 nepavykę skriptai).
2. Struktūra per sudėtinga €40/d biudžetui — signalas skaidytas, o turi būti koncentruotas.
3. Vienkartinis kūrimas per API vietoj UI — dienos į v25 keistenybes.
4. Consent v1.3 (ads granted be sutikimo) — nelegalu; tikslus ir legalus kelias — offline konversijos iš WC.
5. Feed'o kokybė (pigios prekės, GTIN, nuotraukos) palikta galui, nors Shopping'e ji ir yra produktas.
6. Neapibrėžta ekonomika — nežinota, kas yra „pelninga".
Sprendimas: v2.0 RUN skriptas ir D1–D6 atšaukti; kampanija bus kuriama UI; Raimio prekių atranka (label_0 A/B/C, Quattro ne_reklamai, Exclusion LTV) LIEKA.

## 1. Ekonomika (iš `ps_fakt_*`, 22 užs. nuo T-0; `irankiai/s1677_marza.php`, `s1677_e.php`)
| | Viso | Iš Ads (10) |
|---|---|---|
| AOV su PVM | €28,34 | €27,63 |
| Prekių marža | 31 % | 34 % |
| Kontribucija/užs. (be siuntos) | €7,77 | €8,10 |
| − reali siunta (Venipak kurjeris €3,32×8, paštomatas €1,58×11 → vid. €2,31) | **≈ €5,5** | **≈ €5,8** |

Ads 08-24…09-11 (19 d., `ps_fakt_reklama`): ≈ €45/d; kačių PMax €382 / 33,7 konv. (CPA €11,3), šunų €388 / 27,5 (€14,1), brand „petshop" €64 / 15,9 (€4,0). Nauja svetainė 09-09…11: €123 / 10 WC užs. → CPA ≈ €12.
**Išvada**: pirmas Ads užsakymas nuostolingas ~€5–8; pelnas tik per pakartotinį pirkimą ir AOV. **Darbinis tikslas: tCPA €8 / tROAS ≈ 3,5** (prielaida ~1 pakartotinis pirkimas/metus). Pakartotinio pirkimo rodiklio faktuose nėra (`klientas_naujas` lygina tik su nauja svetaine) — reikia Raimio patirties arba eShoprent eksporto.
Katalogas: 2880 prekių su kaina; 342 be savikainos; marža 20–30 % — 1292, 30–40 % — 731; **<€10 — 1038 (36 %)**.
Spragos faktams (vėliau): `ps_fakt_uzsakymai.pristatymas_savikaina_ct` tuščias visiems (siuntos savikaina iš `ps_fakt_siuntos` neperkeliama); siuntimo surenkam €1,65 vs kaina €2,31 (subsidija ~€0,70/užs., 6/22 nemokamai).

## 2. Kas gyvai (09-12)
- **Feeds v2.5.0** (`plugins/petshop-feeds/petshop-feeds.php`, md5 97626f5e…, bak `ps-backups/petshop-feeds.php.bak_s1677`, repo `deploy/petshop-feeds-v2.5.0.php`, įrankis `irankiai/s1677_f.php`): `custom_label_1='pigu'` kai kaina su PVM < `pigu_iki` (12; opcija `ps_feeds_google_taisykles`), ne_reklamai/reklamuoti_ltv pirmenybė. Google feed 2114: pigu 965, ne_reklamai 62, ltv 22; label_0 A 248 / B 716 / C 933 / D 200 / X 17.
- **petshop-ads-offline v1.1** (mu-plugin, md5 04708b96…, repo `deploy/petshop-ads-offline-v1.1.php`, įrankis `irankiai/s1677_o.php`): `/?ps_ads_offline=<raktas>&dienos=N` (raktas opcijoje `ps_ads_offline_raktas`) → JSON apmokėtų užsakymų {gclid, laikas +03:00, verte (viso su PVM), valiuta, uzs}. `ps_fakt_uzsakymai.gclid` — TIK žymė „1"; tikras gclid: `_ps_gclid` (nuo v1.1 fiksuojam patys: `?gclid=` → WC sesija → užsakymo meta, be slapukų sutikimo) → `_wc_order_attribution_session_entry` → `landing_url`. Visi 10 Ads užsakymų nuo T-0 gclid turi.
- **Ads Script `irankiai/petshop_ads_offline_konv_v1_0_RUN.js`** — bulk upload `forOfflineConversions`, KONV = „Įkėlimas neprisijungus". Pirmas paleidimas 19:19: 10 eil., €276,25 (= WC iš Ads). Tvarkaraštis kasdien 06:00 (Raimis).
- **Ads UI (Raimis)**: konversijos veiksmas „Įkėlimas neprisijungus" (Importavimas iš paspaudimų, Pirkinys, 90 d.) — **Pagrindinis**; naršyklės „Purchase" → Antrinis; skambučių konversijos nuimtos. Kačių 21565450990 įjungta; abi PMax po €20/d („riboto biudžeto" — normalu); brand „petshop" €8/d lieka; URL expansion OFF abiem (Nustatymai → „Išteklių optimizavimas" → jungiklis).
- **Consent Bridge v1.4** (snippet #619, md5 d4ff8567…, bak opcija `ps_snippet619_bak_s1677`, repo `deploy/snippet-619-consent-bridge-v1.4.js`): `ad_storage`/`ad_user_data` denied default ir pagal „marketing" sutikimą, `ads_data_redaction` true, `url_passthrough` paliktas. Patikrinta svetainėje. v1.3 (granted be sutikimo, 16:00–19:30) atšauktas.

## 3. Matavimas nuo dabar
Viena tiesa = WC. Kasdien: Ads „Įkėlimas neprisijungus" (konv. ir vertė) turi sutapti su `ps_ads_offline` JSON; Ads pagal paspaudimo datą, WC pagal apmokėjimo — ±1 d. Naršyklės „Purchase" — tik stebėjimui. 14 d. jokių struktūrinių pokyčių kampanijose.

## 4. Kitas žingsnis — retail kampanija (UI, po MC review ~09-15)
Viena PMax **feed-only** (be tekstų/nuotraukų — elgiasi kaip Shopping), MC 5321054797, LT, viena grupė „visos prekės", listing filtras: `custom_label_1 ∉ {pigu, ne_reklamai}`, `custom_label_0 ∉ {D, X}`; brand exclusion; tCPA €8 (arba be tikslo 3 sav.); biudžetas €25, senoms po €10 (bendras €45 nekeliam, kol signalas nesutikrintas). URL expansion OFF. Po 2 sav. — pralaimėtoją išjungti, biudžetą į vieną. Prieš tai MC: nuotraukos <500 px (270), GTIN (4/390 be), politikos 11, kalba en/lt.

## 5. Įrankiai
Read-only: `irankiai/s1677_marza.php`, `s1677_e.php`, `s1677_k.php` (fakt lentelių struktūra), `s1677_g.php`. Deploy: `s1677_f.php` (feeds), `s1677_o.php` (ads-offline), `s1677_c.php`/`s1677_cn.php` (consent). Ads: `petshop_ads_offline_konv_v1_0_RUN.js`, `petshop_ads_konv_recon_v1_3.js`, `petshop_pmax_d_bukle_v1_2.js`. Senas `petshop_pmax_d_v2_0_RUN.js` — NEBENAUDOJAMAS. Bridge: `apt-get install -y php-cli`, `cp irankiai/mjs_template.mjs .`, `chmod +x irankiai/run.sh`, komandoms `timeout`; po bridge commit'ų `git stash -u && git rebase origin/main && git push origin HEAD:main` (run.sh keičiasi).
