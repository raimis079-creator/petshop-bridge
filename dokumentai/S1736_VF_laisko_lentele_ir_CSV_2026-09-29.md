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

---

# S1736 (2) — „DAUGIAU=PIGIAU“ kategorija rodė ne visus pakus (09-29 15:30)

**Raimis:** „daugiau–pigiau katalogo lange nerodo visų prekių“.

**Priežastis (recon `s1736/h.php`, `i.php`):** kategorijoje (term 91, `daugiau-pigiau`) 235 pakai — visi publish, visible, instock. Juos slėpė `petshop-dydziai-katalogas` („viena kortelė šeimai“, S1721): DP kategorijoje šeimos kandidatai — vien pakai, todėl šeimai liko vienas pakas (pvz. Josera Catelux 2×10 kg, 2×2 kg paslėptas). Paslėpta **49 pakai iš 47 šeimų** → rodė 186.

**Sprendimas (R „daryk“):** `mu-plugins/petshop-dydziai-katalogas.php` **v1.3** GYVAI 15:27 (md5 878ff6c4… → f2100534…, bak `ps-archyvas/petshop-dydziai-katalogas.php.bak_s1736`): taksonomijos archyve, kai šeimos kandidatai tik DP pakai, šeima nesujungiama — rodomi visi kandidatai (kiti nariai slepiami kaip anksčiau). Parduotuvė, paieška, gamintojų puslapiai — nepakeisti (ten veidas ne pakas). Išvalytas Super Cache katalogas `kategorija/daugiau-pigiau` (su puslapiais).

**Patikra:** prieš — „Rodoma 1–24 iš 186“, po — **„iš 235“** (nekešuotas URL, atskira užklausa); heartbeat 200. Atstatymas — `s1736/j.php` fazė 9. Repo `deploy/petshop-dydziai-katalogas-v1.3.php`, `irankiai/s1736_h/i/j.php`.

**Pasekmė (R žinojo):** DP kategorijoje ta pati prekė gali būti keliomis kortelėmis (2×2 kg ir 2×10 kg).

---

# S1736 (3) — tikroji vieta: meniu puslapis `/daugiau-pigiau/` rodė 48 iš 235 (09-29 15:50)

**Klaida mano:** (2) taisiau kategoriją `/kategorija/daugiau-pigiau/`, bet meniu „Daugiau = pigiau“ (nav item 2971) veda į PUSLAPĮ `/daugiau-pigiau/` (ID 34476, turinys `[psc_daugiau_pigiau]`). Raimis: „meluoji, nieko nepadarei“ — teisingai, jo matomas puslapis nepasikeitė. Pamoka: prieš taisant — patikrinti, kur veda meniu nuoroda, kurią mato Raimis.

**Priežastis:** snippet **570** „Petshop Daugiau=Pigiau Puslapis Shortcode v1.0“ (2026-07-05): `array_slice(..., 0, 48)` be puslapiavimo, o mygtukas rodo „Visos (235)“.

**Sprendimas (R „taip daryk su puslapiais“):** snippet 570 **v1.1** GYVAI 15:48 (md5 8b17aa91… → 436f0a19…, bak opcija `ps_s1736_snip570_bak` gz+b64): nebekarpoma, `[products ids=… limit=48 paginate="true" orderby="post__in"]` → po 48 puslapyje, `?product-page=N`, filtras `?gyvunas=` veikia kartu. Super Cache `/daugiau-pigiau/` išvalytas.

**Patikra (nekešuotas URL, atskira užklausa):** prieš — 48 prekės, puslapių nėra; po — 1–4 psl. po 48, 5 psl. 43 (= 235), puslapiai 1–5; Katėms 48 + 36. Heartbeat 200. Atstatymas — `s1736/o.php` fazė 9. Repo `deploy/snippet-570-v1.1.php`, `irankiai/s1736_k–o.php`.

Kategorijos pataisa (2) palikta — ji teisinga ir nekenkia (kategorija pasiekiama per prekių kategorijų nuorodas).
