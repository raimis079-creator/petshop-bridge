# S1700 — Sprintas 1 / 1.6 botų patikra — 2026-09-20 (naktį), read-only `irankiai/s1700_ma.php`

## Išvada trumpai
**Botų problemos nėra. „US/GB" sesijos — ne užsienis ir ne botai, o lietuviai su angliška naršyklės kalba.** `ps_web_ivykiai.salis` pildomas iš `Accept-Language` (arba Cloudflare antraštės, kurios nėra) — **ne geo-IP** (rinkiklio `petshop-analitika.php` `salis()`, plano §4A.1). Todėl `salis` = naršyklės/telefono kalba: en-US → „US", en-GB → „GB", ru → „RU".

## Įrodymai (09-13…20, 8 d., 1 332 sesijos)
| | sesijos | su žmogišku įvykiu (view_item/cart/search) | begin_checkout | „ačiū" puslapis |
|---|---|---|---|---|
| LT (lt kalba) | 480 | 260 | — | — |
| ne-LT (US 361, GB 288, ? 147, RU 36, kt. 20) | 852 | 532 | **71** | **40** |

- Ne-LT sesijų kanalai: **Google Ads 400** (kampanijos tik LT), kaina24 39, kainos 31, organika 145, chatgpt 20 — visi mūsų kanalai; naršyklės — Safari iOS 179, Chrome Android 169, Chrome Windows 181 (įprastas mišinys, mobile 72 %).
- 40 užsakymų „ačiū" puslapių iš „ne-LT" sesijų per 8 d. — tai realūs pirkėjai su angliška telefono kalba (iOS numatytoji dažnai en-GB/en-US).
- Rinkiklis renka tik su JS, o UA botus (`bot|crawl|spider|headless|python-requests…`) atmeta — tikrieji crawler'iai į lentelę nepatenka.
- Vienos užklausos sesijos (1 pageview, trukmė 0): LT 135 / US 69 / GB 72 / ? 37 ≈ 24 % — įprastas bounce, ne botai.

## Tikras srautas
**~166 sesijos/d (1 332 / 8 d.), faktiškai visos Lietuvos.** KPI lentelės „Sesijos/d (LT, be botų) ~170 (tikrinti)" → patvirtinta **~165**, be korekcijos. Pagal dienas: 09-14 214, 09-15 181, 09-16 179, 09-17 166, 09-18 130, 09-19 146, 09-20 148.

## Ką daryti
- Kodo nekeisti (rinkiklis S1679 jau kartą buvo sulaužytas kito lango). Analitikos lange / ataskaitose `salis` skaityti kaip **„naršyklės kalba"**, ne šalį; jei kada reikės geo — Cloudflare `CF-IPCountry` (Cloudflare neįjungtas, S1678 atvira) arba geo-IP DB.
- S1696 srauto plano pastaba „salis US/GB 700 iš 1 464 — anomalija (botai?)" — atšaukta.
- Įdomus šalutinis faktas: **~60 % pirkėjų naršyklė angliška** — svetainės tekstai lieka LT, bet el. laiškų/checkout mikrotekstai turi būti aiškūs be konteksto.

## Kitas langas
1.6 ☑. Liko 1.7 `/skaiciuokle/` puslapis, 1.8 Product schema + AI botai. Prefiksas `s1701_m*`.
