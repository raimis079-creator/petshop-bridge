# Deployment log v1.9.66 — S1678 (2026-09-12 vakaras, saugumas)
| # | Kas | Kur | md5 | bak |
|---|---|---|---|---|
| 1 | Saugumo auditas read-only (`irankiai/s1678_sec.php`, `s1678_sec2.php`) → `analize/s1678_sec.json`, `s1678_sec2.json` | — | — | — |
| 2 | **petshop-sargas-saugumas v1.0** — xmlrpc išjungtas (filtrai + 403), `/wp/v2/users` tik prisijungusiems (401 svečiams), `?author=N` ir `/author/*` → 404 svečiams, oEmbed be autoriaus, antraštės (HSTS, X-Frame-Options SAMEORIGIN, nosniff, Referrer-Policy), WC Store API rate limit 25/10 s | mu-plugins/petshop-sargas-saugumas.php | 660d7685… | naujas failas (rollback — ištrinti) |
| 3 | .htaccess blokas „Petshop Saugumas (S1678)" — mod_headers antraštės statiniams + `<Files xmlrpc.php>` deny | public_html/.htaccess | — | ps-archyvas/.htaccess.bak_s1678 |
| 4 | `public_html/ps-backups/` (5 failai, tarp jų wp-config-BAK-T0) perkelta iš webroot | → ps-archyvas/webroot-ps-backups-s1678/ | — | (pats perkėlimas) |
Verifikacija (TK fazė iš serverio): titulinis/kategorija/parduotuvė/wp-login/store cart/feed google 200; xmlrpc 403; rest users 401; author 404; antraštės visos; X-Pingback nebėra; fatal žurnale naujų klaidų nėra.

## Audito būklė po deploy
Uždaryta: xmlrpc, vartotojų enumeracija, antraštės, Store API limitas, wp-config kopija webroot'e.
**Atvira (Raimio sprendimai / po Claude Code):** 2FA administratoriui (nėra), prisijungimų limito nėra, 21 admin sesija (atjungti kitas), Code Snippets 3.9.6→3.10.2, WP 6.9.4→7.1 (gyvai NE 7.0), Flatsome 3.20.9, Complianz/Rank Math/MnM/WPForms/YITH, auto-atnaujinimai išjungti, WAF/Cloudflare nėra, `backup-run.php`/`watch-run.php` URL trigeriai (`/home/gyvunai2/backups/`) — raktas ir backup vieta nepatikrinti, PAT rotacija (šios dienos PAT atšaukti), `ps_*_raktas` opcijų rotacija.
Žalia: wp-config 0600, DISALLOW_FILE_EDIT, FORCE_SSL_ADMIN, salts, display_errors 0, exec/shell išjungti, uploads be svetimų PHP, .bak 403, registracija off.
