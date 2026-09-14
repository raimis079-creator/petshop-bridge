# Produkto ciklų lentelė ir istorinis R_due baseline (S1684, 2026-09-14)

Recon `irankiai/s1684_me.php` → `analize/s1684_me.json`. Šaltinis `ps_ist_*` 2024-01…2026-08, maisto/konservų eilutės; užsakymo „pagrindinis produktas" = brendas × pakuotė su didžiausia suma; intervalas = dienos iki KITO to kliento maisto užsakymo (≤365 d.). Pakuotė = svoris × kiekis: iki 1,5 kg / 1,5–5 / 5–11 / 11+.

## 1. Refill langai (dienos iki kito pirkimo; due = mediana)
| Brendas × pakuotė | n | p25 | **mediana (due)** | p75 | Laiškų langas (siūlomas) |
|---|---|---|---|---|---|
| Animonda 1,5–5 kg (konservų dėžės) | 457 | 19 | **34** | 57 | 20 / 30 / 45 |
| Animonda iki 1,5 kg | 345 | 28 | **41** | 65 | 25 / 38 / 55 |
| Animonda 5–11 kg | 65 | 29 | **33** | 60 | 20 / 30 / 45 |
| Josera 11 kg+ | 456 | 33 | **56** | 100 | 35 / 52 / 75 |
| Josera 5–11 kg | 292 | 36 | **73** | 135 | 40 / 68 / 100 |
| Josera 1,5–5 kg | 27 | 34 | 56 | 103 | kaip 11 kg+ |
| Exclusion 11 kg+ | 257 | 39 | **62** | 96 | 40 / 58 / 85 |
| Exclusion 5–11 kg | 249 | 55 | **76** | 118 | 50 / 72 / 100 |
| Exclusion 1,5–5 kg | 155 | 23 | **38** | 66 | 25 / 35 / 55 |
| Ontario iki 1,5 kg | 96 | 26 | 40 | 61 | 25 / 38 / 55 |
| Miamor (konservai) | 85+48 | 23 | 33–35 | 80 | 20 / 30 / 45 |
| Quattro 1,5–5 kg / 11 kg+ | 62 / 49 | 23 / 31 | 37 / 50 | 72 / 81 | 25/35/55 · 30/48/70 |
| Hikari iki 1,5 kg (žuvys) | 55 | 96 | **137** | 217 | 90 / 130 / 180 — ne 20–50 d. logika |
| Royal Canin 5–11 kg | 16 | 98 | 115 | 197 | 90 / 110 / 150 |
| Ambrosia 11 kg+ | 28 | 23 | 30 | 44 | 20 / 28 / 40 |
| Rasco 11 kg+ | 23 | 42 | 50 | 57 | 35 / 48 / 60 |

Brendo lygis (fallback, kai pakuotė nežinoma): Animonda 38 · Josera 61 · Exclusion 62 · Ontario 43 · Quattro 50 · Miamor 34 · Hikari 131 · RC 64 · Monge 38 · Ambrosia 30 · Rasco 48 · Prins 63. Universalus fallback 45.

**Išvada:** „po 30 d." visiems būtų klaida — Animonda 34, Josera 56–73, Exclusion 62–76, Hikari 137. Pirmas laiškas ties p25 (dar turi), antras ties mediana (baigiasi), trečias ties p75 (jau baigėsi) → win-back po due+30.

## 2. Istorinis R_due baseline (pirmi maisto užsakymai 2024–2025, n=2 818)
R_due = antras maisto užsakymas iki savo produkto due + 14 d.

| | R_due | R60 | R90 |
|---|---|---|---|
| **Viso** | **16,1 %** | 14,2 % | 19,3 % |
| Josera (n 1 139, due ~64) | **12,1 %** | 9,1 % | |
| Animonda (369, due ~37) | 30,6 % | 33,9 % | |
| Exclusion (362, due ~62) | 22,1 % | 16,3 % | |
| Quattro (161) | 16,8 % | 17,4 % | |
| Miamor (115) | 16,5 % | 18,3 % | |
| Ontario (105) | 14,3 % | 15,2 % | |
| Hikari (124, due ~136) | 10,5 % | 2,4 % | |
| Royal Canin (122, due ~90) | 6,6 % | 4,1 % | |

Pastabos: R60 čia 14,2 % (S1683 sakė 13 % — kitas langas/imtis, sutampa). Josera — 40 % pirmų užsakymų ir prasčiausias R_due tarp didžiųjų: čia didžiausias rezervas. Animonda R_due ≈ R60 (ciklas trumpas), Exclusion/Hikari/RC R_due ≫ R60 — todėl R60 juos nuvertina.

## 3. Siūlomi targetai (v1.2 numatė nustatyti po baseline)
- Spalio kohorta: **R_due ≥ 22 %** (+6 pp nuo 16,1; Josera ≥ 18 %, Exclusion ≥ 28 %, Animonda ≥ 35 %). R60 ≥ 20 % lieka scorecard.
- Q1 2027: R_due 27 % · Q2 32 % · Q3–Q4 38 % (atitinka R60 kelią 20/25/30/35 pagal brendų mišinį).
