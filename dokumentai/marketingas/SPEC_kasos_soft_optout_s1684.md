# SPEC — soft opt-out kasoje (ERĮ 81(2)) · S1684 · GYVAI v1.0.1 (S1685, 09-15) — galutinis tekstas STARTAS S1685 skyriuje

**Kur:** klasikinė kasa `[woocommerce_checkout]`, po el. pašto lauku (`woocommerce_after_checkout_billing_form` arba po `billing_email`). Naujas mu-plugin `petshop-sutikimai.php` (patikrinti, ar vardas/klasė laisvi — S1679 pamoka).

**Laukas:** checkbox `ps_similar_optout`, NEPAŽYMĖTAS pagal nutylėjimą (nepažymėtas = neprieštarauja pagal 81(2); pažymėtas = prieštarauja). Ne „sutinku" (tai būtų consent, pre-ticked draudžiama).
Tekstas (juodraštis, Raimis taiso): „Apie jūsų augintinio maisto papildymą ir panašias mūsų prekes priminsime el. paštu. Nenoriu tokių priminimų ☐ — atsisakyti galėsite ir kiekviename laiške."
Atskirai lieka naujienlaiškio forma (footer/newsletter, `consent=true`) — kasoje jos nejungiam.

**Įrašai užsakymo momentu (`woocommerce_checkout_create_order` / `_update_order_meta`):**
- order meta `_ps_similar_optout` = 0/1; `_ps_similar_basis` = `erl81_2_checkout`.
- usermeta / svečiui pagal el. paštą (lentelė `ps_kontaktai` arba usermeta): `ps_soft_optin_eligible=1`, `ps_similar_optout=0/1`, `ps_similar_optout_at`.
- `ps_consent_log`: field `similar_products_optout`, from/to, source `checkout`, ip, ua, changed_at.

**Būsenų modelis (užrakinta v1.2):** newsletter → `ps_marketing_consent=true`; lifecycle (refill/„pakartoti"/win-back) → `soft_optin_eligible && !similar_optout`; `ps_email_suppression` (unsubscribe/bounce/complaint) — bendras, stipresnis už abu. Kiekvienas lifecycle laiškas: atsisakymo nuoroda rašo `similar_optout=1` + log source `email_link`.

**Sender:** sync dvi žymos (newsletter / similar_ok), ne vien consent=true.

**Testas:** testinis užsakymas su pažymėtu ir nepažymėtu → 2 log įrašai, meta teisinga; `ps_email_jobs` filtras atmeta optout.
