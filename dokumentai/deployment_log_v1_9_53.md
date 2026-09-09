# deployment_log v1_9_53 — S1664 (2026-09-09 popietė)

## S1664 — rytinė patikra, bak valymas, istorijos kėlimas, ReducedStock spąstai

1. **Rytinė patikra** (`s1634_g` sn. 5332 + nauji `s1664_a` 5333 / `s1664_c`):
   Warning 0, ping 200, eilės Gauti 2 / Surinkti AV 1 / Neapmokėti 2 (atitinka 35873+35876),
   cron 84. **Klaidingas s1634_g aliarmas dėl ZB/VF cron'ų** — jie gyvi kitais vardais:
   `petshop_vf_sync_stock_hourly`, `_feed_hourly`, `_reprice_daily` (03:00), `_publish_daily`
   (04:00), `petshop_import_tempas`. Titulinis 200, 20 `<img>`. `ps_sender_webhook_log`
   egzistuoja, 0 įrašų (laukia Raimio webhook setup). 301: mu-plugins
   `petshop-legacy-301-map.json` 1091 įrašų, 3/3 realūs pavyzdžiai → teisingi 301 su
   /kategorija/ keliu. Pastaba: pickup zona #16 `is_enabled=0` (kaip sukurta — Raimio
   jungiklis, nekeista).
2. **`ps_*_bak` valymas.** Rasta 44 (ne 38). Archyvas serveryje
   `uploads/ps_bak_arch_20260909.json.gz` (1 101 825 B, md5 `59e6d15cbec8b04f5f50b9a31ecdba1d`),
   po to visos 44 ištrintos, liko 0. (`s1664_b`)
3. **Istorija `s1643_h2` DRY→A.** DRY: 93 nauji (jau_yra 0), 217 eil. (190 sku / 13 pavad. /
   14 nesusietų), suma 3 949,17. APPLY: įrašyta 93+217, atnaujinta 5 statusai (11999–12003).
   Po: 10 169 užs. / 24 555 eil., max_id 12106, max_data 2026-09-08 22:20, be_tevo 0,
   eiluciu_nesutampa 0, ivykdyti_suma 397 105,04. **Adapterio rebuild kablys NETIRTAS** —
   liko vizuali „Petshop ataskaitos → Pardavimai" patikra (ar rodo 09-08 duomenis).
4. **ReducedStock spąstai.** Nuolatinis snippetas **5339** „Petshop Spastai ReducedStock v1.0
   (bt i ps_rs_trap)": `delete_order_item_metadata` filtras — kai trinama `_reduced_stock`,
   rašo laiką/item/URI/AJAX/CRON/backtrace į opciją `ps_rs_trap` (rolling 30). E2E per
   #35868 eil. 1727 (laikina meta 999 add+delete): backtrace pagautas, originali
   `_reduced_stock=1` nepaliesta. **ps_rs_trap[0] = testinis įrašas (uri ps_s1664e) — palikti.**
   Laukiam realaus kliento grįžimo į order-pay → spąstai parodys tikslią WC core vietą.
5. wcdn `AVPN35872` dublikatas #35872 metose — NELIESTA, laukia aptarimo su Raimiu.

## Atviri po S1664
- Ataskaitų ekrano vizuali patikra po istorijos kėlimo (adapterio kablys).
- `ps_rs_trap` peržiūra kai suveiks (šaknies radimas → sargo 5323 ir spąstų 5339 nuėmimas).
- wcdn AVPN35872 dublikatas — Raimio sprendimas.
- Raimio veiksmai iš STARTAS nepakitę: #35868 trinti/palikti, cron URL, Sender webhook,
  GSC/Ads Brand, Kaina24/Kainos resubmit, Flatsome licencija, pirma reali siunta (J1!),
  eShoprent neišjungti, po paros TTL 300→3600.
