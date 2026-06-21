import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const code = Buffer.from("LyoqCiAqIEZpbHRydSBhdGlkYXJ5bWFzOiAoMSkgaXNqdW5ndGkgWUlUSCBsYXp5LWxvYWQ7ICgyKSBDU1MrSlMgZm9yc3VvdGkgcGlybW8gZmlsdHJvCiAqIChQYXNraXJ0aXMgc2FtcHVudW9zZSBpciB0LnQuKSAuZmlsdGVyLWNvbnRlbnQgbWF0b21hLCBuZXByaWtsYXVzb21haSBudW8gWUlUSCB0b2dnbGUgSlMuCiAqLwppZiAoICEgZGVmaW5lZCggJ0FCU1BBVEgnICkgKSB7IGV4aXQ7IH0KCmZvcmVhY2ggKCBhcnJheSgKICAgICd5aXRoX3djYW5fc2hvdWxkX2xhenlfbG9hZF9maWx0ZXJzJywKICAgICd5aXRoX3djYW5fc2hvdWxkX3Nob3dfZmlsdGVyc19wbGFjZWhvbGRlcnMnLAopIGFzICRob29rICkgeyBhZGRfZmlsdGVyKCAkaG9vaywgJ19fcmV0dXJuX2ZhbHNlJywgOTkgKTsgfQoKYWRkX2FjdGlvbiggJ3dwX2Zvb3RlcicsIGZ1bmN0aW9uICgpIHsKICAgID8+CjxzdHlsZSBpZD0icHMtb3Blbi1maWx0ZXIiPgoueWl0aC13Y2FuLWZpbHRlcnMgLmZpbHRlcnMtY29udGFpbmVyIGZvcm0gPiAueWl0aC13Y2FuLWZpbHRlcjpmaXJzdC1jaGlsZCA+IC5maWx0ZXItY29udGVudHsKICBkaXNwbGF5OmJsb2NrICFpbXBvcnRhbnQ7aGVpZ2h0OmF1dG8gIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUgIWltcG9ydGFudDtvdmVyZmxvdzp2aXNpYmxlICFpbXBvcnRhbnQ7Cn0KLnlpdGgtd2Nhbi1maWx0ZXJzIC5maWx0ZXJzLWNvbnRhaW5lciBmb3JtID4gLnlpdGgtd2Nhbi1maWx0ZXI6Zmlyc3QtY2hpbGQgPiAuZmlsdGVyLXRpdGxle2N1cnNvcjpkZWZhdWx0O30KPC9zdHlsZT4KPHNjcmlwdD4KKGZ1bmN0aW9uKCl7CiAgZnVuY3Rpb24gb3BlbkZpcnN0KCl7CiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcueWl0aC13Y2FuLWZpbHRlcnMgLmZpbHRlcnMtY29udGFpbmVyIGZvcm0nKS5mb3JFYWNoKGZ1bmN0aW9uKGYpewogICAgICB2YXIgZmlyc3Q9Zi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAueWl0aC13Y2FuLWZpbHRlcicpOwogICAgICBpZighZmlyc3QpIHJldHVybjsKICAgICAgdmFyIGM9Zmlyc3QucXVlcnlTZWxlY3RvcignOnNjb3BlID4gLmZpbHRlci1jb250ZW50Jyk7CiAgICAgIGlmKGMpeyBjLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywnYmxvY2snLCdpbXBvcnRhbnQnKTsgYy5zdHlsZS5zZXRQcm9wZXJ0eSgnaGVpZ2h0JywnYXV0bycsJ2ltcG9ydGFudCcpOyBjLnN0eWxlLnNldFByb3BlcnR5KCdtYXgtaGVpZ2h0Jywnbm9uZScsJ2ltcG9ydGFudCcpOyB9CiAgICAgIGZpcnN0LmNsYXNzTGlzdC5hZGQoJ2ZpbHRlci1vcGVuJywnb3BlbmVkJywndG9nZ2xlZCcpOwogICAgfSk7CiAgfQogIGlmKGRvY3VtZW50LnJlYWR5U3RhdGUhPT0nbG9hZGluZycpIHNldFRpbWVvdXQob3BlbkZpcnN0LDYwMCk7CiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsZnVuY3Rpb24oKXsgc2V0VGltZW91dChvcGVuRmlyc3QsNjAwKTsgc2V0VGltZW91dChvcGVuRmlyc3QsMTUwMCk7IH0pOwogIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpeyBzZXRUaW1lb3V0KG9wZW5GaXJzdCw0MDApOyB9KTsKfSkoKTsKPC9zY3JpcHQ+CiAgICA8P3BocAp9LCA5OSApOwo=","base64").toString("utf8");
const out = {};
// update 492
fs.writeFileSync("/tmp/upd.json", JSON.stringify({ id:492, name:"Petshop Filtru Atidarymas v2 (CSS+JS)", code, scope:"global", active:true }));
try { out.update=execSync(`curl -sk -o /tmp/u.txt -w "%{http_code}" --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "${base}/wp-json/code-snippets/v1/snippets/492"`,{encoding:"utf8",env}).trim(); } catch(e){ out.update_err=(e.stderr||String(e)).slice(0,90); }
// screenshot
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1300,height:1250}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/",{waitUntil:"domcontentloaded",timeout:35000});
  await page.waitForTimeout(4000);
  const txt = await page.evaluate(()=>{const el=document.querySelector('.yith-wcan-filters');return el?el.innerText.slice(0,500):'NORA';});
  out.sidebar=txt; out.opened=/Antiparazitinis/.test(txt);
  await page.screenshot({ path:"screenshots/FINAL2.png", clip:{x:88,y:120,width:450,height:700} });
} catch(e){ out.shot_err=String(e).slice(0,90); }
await b.close();
fs.writeFileSync("screenshots/final2.txt", JSON.stringify(out,null,1));
