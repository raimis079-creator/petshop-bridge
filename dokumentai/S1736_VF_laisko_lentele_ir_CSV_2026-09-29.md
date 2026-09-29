# S1736 — VF užsakymų laiškas: lentelė su stulpeliais + CSV priedas (2026-09-29)

## Kas paprašė ir kodėl
Vetfarmas (09-29): (1) užsakymų lentelę siųsti ir prisegtu failu (xls/csv), (2) prekės kodas atskirame lauke, kiekis — skaičius be „vnt.“, (3) jie dropship užsakymus importuosis kaip atskiras operacijas pagal gavėją ir norėtų atskirų sąskaitų kiekvienam gavėjui.

**Raimio sprendimai:**
- Sąskaitos: atskiros kiekvienam gavėjui — NE („ir taip daug sąskaitų, bus chaosas“). Atsakymą VF Raimis rašo pats. Siūlyta: viena sąskaita už dienos (ar savaitės) užsakymus, eilutėse — mūsų užsakymo nr.
- Lentelė laiške lieka (patogu matyti, kas siunčiama) + CSV priedas.

## Radiniai (recon `s1736/a–e.php`, read-only)
- Laišką formuoja `mu-plugins/petshop-av-dropship.php` `laisko_html()` (dropship dalis) + `petshop-av-tiekimas.php` `laisko_dalis()` (dalis „UAB Avesa, Liucionių g. 46“). Tą patį `grupuoti()`/`laisko_html()` naudoja darbalaukio „Laiškai tiekėjams“ kortelė ir peržiūra.
- **DP pakai tiekėjui ėjo pako kodu:** #1130 „2 vnt. Exclusion … 2 kg, Excl-2kg-2vnt, 1 vnt.“, #1181 „Excl-7kg-2vnt“. Importas tokio kodo neras (turi būti HYPS02 × 2). DP pakų dabar 235.
- **VF kodas ≠ mūsų SKU:** iš 1 249 VF prekių 1 217 sutampa, 22 skiriasi (mūsų SKU — atsitiktinis kodas, pvz. PM20 prekė #35318 su SKU `91100149f1e2`), 10 be VF kodo.
- Kiti tiekėjai (Ambrosia, Prins, Quattro, Belacor) `ps_sources.supplier_sku` neturi → rodomas mūsų SKU (kaip anksčiau). ZB — ZB kodas (kaip anksčiau).

## Kas pakeista (GYVAI 09-29 10:31)
| Failas | Buvo md5 | Dabar md5 | Bak |
|---|---|---|---|
| `mu-plugins/petshop-av-dropship.php` v1.20 → **v1.21** | a16f5a09… | b2e49184… | `ps-archyvas/petshop-av-dropship.php.bak_s1736` |
| `mu-plugins/petshop-av-tiekimas.php` v1.10.1 → **v1.11** | cf7677a8… | 37d1128e… | `ps-archyvas/petshop-av-tiekimas.php.bak_s1736` |

- `Petshop_AV_Dropship::tiekejui($product_id,$qty,$src,$pav)` — viena vieta eilutei tiekėjui: DP pakas (`_dp_base_product_id`) → bazinė prekė, kiekis × `_dp_pack_qty`, bazinės pavadinimas; kodas — `tiekejo_kodas()` = `ps_sources.supplier_sku` pagal šaltinį (variacijai — ir tėvinės), atsarga — SKU.
- `grupuoti($ids, $ir_perduotus=false)` naudoja `tiekejui()` → tas pats kodas/kiekis kortelėje, laiške, CSV ir ZB „Kopijuoti“.
- `laisko_html()` — antraštės eilutė: **Užs. nr. · Gavėjas · Prekė · Kodas · (EAN tik sku_ean tiekėjams) · Kiekis** (skaičius). Prierašo `<p style="margin:14px 0">` nekeistas (darbalaukio peržiūros `{{PRIERASAS}}`).
- `laisko_dalis()` (Tiekimas) — **Prekė · Kodas · Kiekis**, per `tiekejui()`.
- CSV — `csv_failas()`: tik `CSV_TIEKEJAI = ['vf']`; `uploads/ps-lipdukai/Avesa_uzsakymas_YYYY-MM-DD.csv`, `;`, UTF-8 BOM, CRLF; stulpeliai `Užsakymo nr.;Gavėjas;Prekės kodas;Prekė;Kiekis`; prekės į AV — be užs. nr., gavėjas „UAB Avesa (sandėlis)“. Prisegamas `siusti()` (dropship + partija) ir Tiekimo `uzsakyti()` (savas laiškas); po siuntimo ištrinamas.

## Patikra
- token_get_all abiem ✓, heartbeat 200 ✓, gyvi md5 = nauji ✓.
- Render su 09-28 VF laišku (8 užs. #1185–#1200 + #1180, partija #33): 20 eilučių + 6 į AV, kodai VF ✓.
- DP kontrolė: #1130 → HYPS02 × 2 + PM20 × 10; #1181 → HYPS06 × 2 ✓.
- Testinis laiškas su CSV → terra@gyvunai.lt (wp_mail true), VF negavo.

## Atstatymas
`s1736/g2.php` fazė **9** — abu failai iš `.bak_s1736`, heartbeat. Repo: `deploy/petshop-av-dropship-v1.21.php`, `deploy/petshop-av-tiekimas-v1.11.php`, `irankiai/s1736_a–g.php`.

## Pastabos
- Kodas iš skaitmenų (pvz. VF `404842214454`) Excel'yje atidarius CSV gali rodytis kaip 4,04842E+11 — importui tai netrukdo, rankiniam peržiūrėjimui — taip.
- Kitas žingsnis: Raimis atsako VF (sąskaitos — viena už dieną su užs. nr.); pirmas realus laiškas nauju formatu — šiandien.
