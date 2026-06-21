import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const code = Buffer.from("LyoqCiAqIFNhbXB1bnUvdmlzdSBmaWx0cnUgYXRpZGFyeW1hczogaXNqdW5ndGkgWUlUSCBsYXp5LWxvYWQgKHBsYWNlaG9sZGVyKSAtPiBzZXJ2ZXJpbyByZW5kZXJpcyBnZXJiaWEgdG9nZ2xlX3N0eWxlPW9wZW5lZC4KICogKyBDU1MgZHJhdWRpa2xpcyBwaXJtYW0gZmlsdHJ1aSAoUGFza2lydGlzKSBzYW1wdW51IGthdGVnb3Jpam9qZS4KICovCmlmICggISBkZWZpbmVkKCAnQUJTUEFUSCcgKSApIHsgZXhpdDsgfQoKLyogMSkgSXNqdW5ndGkgbGF6eS1sb2FkL3BsYWNlaG9sZGVyIChob29rJ2FpIHN1dGFtcGEgc3UgbWV0b2R1IHBhdmFkaW5pbWFpcykgKi8KZm9yZWFjaCAoIGFycmF5KAogICAgJ3lpdGhfd2Nhbl9zaG91bGRfbGF6eV9sb2FkX2ZpbHRlcnMnLAogICAgJ3lpdGhfd2Nhbl9zaG91bGRfc2hvd19maWx0ZXJzX3BsYWNlaG9sZGVycycsCiAgICAneWl0aF93Y2FuX2xhenlfbG9hZF9maWx0ZXJzJywKICAgICd5aXRoX3djYW5fc2hvd19maWx0ZXJzX3BsYWNlaG9sZGVycycsCikgYXMgJGhvb2sgKSB7CiAgICBhZGRfZmlsdGVyKCAkaG9vaywgJ19fcmV0dXJuX2ZhbHNlJywgOTkgKTsKfQoKLyogMikgQ1NTIGRyYXVkaWtsaXM6IHBpcm1hcyBmaWx0cmFzIChQYXNraXJ0aXMpIGF0aWRhcnl0YXMgKi8KYWRkX2FjdGlvbiggJ3dwX2hlYWQnLCBmdW5jdGlvbiAoKSB7CiAgICBlY2hvICc8c3R5bGUgaWQ9InBzLW9wZW4tZmlsdGVyIj4nCiAgICAgICAuICcueWl0aC13Y2FuLWZpbHRlcnMgLnlpdGgtd2Nhbi1maWx0ZXI6Zmlyc3QtY2hpbGQgLmZpbHRlci1jb250ZW50LCcKICAgICAgIC4gJy55aXRoLXdjYW4tZmlsdGVycyAueWl0aC13Y2FuLWZpbHRlcjpmaXJzdC1jaGlsZCAuZmlsdGVycy1jb250YWluZXIsJwogICAgICAgLiAnLnlpdGgtd2Nhbi1maWx0ZXJzIC55aXRoLXdjYW4tZmlsdGVyOmZpcnN0LWNoaWxkIHVsLmZpbHRlci1jb250ZW50LCcKICAgICAgIC4gJy55aXRoLXdjYW4tZmlsdGVycyAueWl0aC13Y2FuLWZpbHRlcjpmaXJzdC1jaGlsZCAueWl0aC13Y2FuLXRlcm1zeycKICAgICAgIC4gJ2Rpc3BsYXk6YmxvY2sgIWltcG9ydGFudDtoZWlnaHQ6YXV0byAhaW1wb3J0YW50O21heC1oZWlnaHQ6bm9uZSAhaW1wb3J0YW50O292ZXJmbG93OnZpc2libGUgIWltcG9ydGFudDt9JwogICAgICAgLiAnLnlpdGgtd2Nhbi1maWx0ZXJzIC55aXRoLXdjYW4tZmlsdGVyLmZpbHRlci10YXg6Zmlyc3QtY2hpbGR7fScKICAgICAgIC4gJzwvc3R5bGU+JzsKfSwgOTkgKTsK","base64").toString("utf8");
const out = {};
fs.writeFileSync("/tmp/snip.json", JSON.stringify({ name:"Petshop Filtru Atidarymas v1 (no lazy-load)", code, scope:"global", active:true }));
try { const cr=execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/snip.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}).trim(); out.create=cr; try{out.snip_id=JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")).id;}catch(e){out.head=fs.readFileSync("/tmp/cr.txt","utf8").slice(0,120);} } catch(e){ out.create_err=(e.stderr||String(e)).slice(0,100); }
// patikra HTML: ar po fixo nebera filter-placeholder ant pirmo filtro
try { execSync("sleep 2"); const html=execSync(`curl -sk --max-time 40 "${base}/kategorija/sunims/sampunai-sunims/"`,{encoding:"utf8",env,maxBuffer:15*1024*1024}); 
  out.has_placeholder = /filter-placeholder/.test(html);
  out.has_paskirtis_terms = /Antiparazitinis/.test(html);
  out.html_len = html.length;
} catch(e){ out.html_err=String(e).slice(0,80); }
fs.writeFileSync("screenshots/samp_open.txt", JSON.stringify(out,null,1));
