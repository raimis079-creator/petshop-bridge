import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const makerPhp = Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19tYWtlX2RyYXNrX3ByZXNldCddKSApIHJldHVybjsKICBpZiAoICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgKSB7IHN0YXR1c19oZWFkZXIoNDAzKTsgZWNobyAnbm8nOyBleGl0OyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkdHBsID0gZ2V0X3BhZ2VfYnlfcGF0aCgnZHViZW5lbGl1LWZpbHRyYXMnLCBPQkpFQ1QsICd5aXRoX3djYW5fcHJlc2V0Jyk7CiAgaWYoISR0cGwpeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnJvcic9PidubyB0cGwnKSk7IGV4aXQ7IH0KICAkZiA9IGdldF9wb3N0X21ldGEoJHRwbC0+SUQsJ19maWx0ZXJzJyx0cnVlKTsKICBpZihpc19zdHJpbmcoJGYpKSAkZiA9IG1heWJlX3Vuc2VyaWFsaXplKCRmKTsKICBpZighaXNfYXJyYXkoJGYpKXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyb3InPT4nYmFkIGZpbHRlcnMnKSk7IGV4aXQ7IH0KICAkZjEgPSAkZlsxXTsgJGYxWyd0YXhvbm9teSddPSdwYV90aXBhcyc7ICRmMVsndGl0bGUnXT0nVGlwYXMnOyAkZjFbJ3RvZ2dsZV9zdHlsZSddPSdvcGVuZWQnOwogICRmMyA9ICRmWzNdOyAvLyBwcm9kdWN0X2JyYW5kCiAgJG5mID0gYXJyYXkoMT0+JGYxLCAyPT4kZjMpOwogICRleCA9IGdldF9wYWdlX2J5X3BhdGgoJ2RyYXNreWtsaXUtZmlsdHJhcycsIE9CSkVDVCwgJ3lpdGhfd2Nhbl9wcmVzZXQnKTsKICAkcGlkID0gJGV4ID8gJGV4LT5JRCA6IHdwX2luc2VydF9wb3N0KGFycmF5KCdwb3N0X3RpdGxlJz0+IkRyYXNreWtsaVx1ezAxNzN9IGZpbHRyYXMiLCdwb3N0X25hbWUnPT4nZHJhc2t5a2xpdS1maWx0cmFzJywncG9zdF90eXBlJz0+J3lpdGhfd2Nhbl9wcmVzZXQnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJykpOwogIGlmKCEkcGlkIHx8IGlzX3dwX2Vycm9yKCRwaWQpKXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyb3InPT4naW5zZXJ0IGZhaWwnKSk7IGV4aXQ7IH0KICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19lbmFibGVkJywneWVzJyk7CiAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfbGF5b3V0JywnZGVmYXVsdCcpOwogIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX2ZpbHRlcnMnLCRuZik7CiAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgncHJlc2V0X2lkJz0+JHBpZCwnc2x1Zyc9PidkcmFza3lrbGl1LWZpbHRyYXMnLCdmaWx0ZXJzJz0+Y291bnQoJG5mKSkpOwogIGV4aXQ7Cn0sIDk5KTsK","base64").toString("utf8");
const out = {};
// preset maker (idempotentiskas - grazina esama jei yra)
fs.writeFileSync("/tmp/mk.json", JSON.stringify({ name:"Petshop Draskykles Preset Maker TEMP", code: makerPhp, scope:"global", active:true }));
try {
  const cr = execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/mk.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}).trim();
  out.maker_create=cr; try { out.maker_id=JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")).id; } catch(e){}
} catch(e){ out.maker_err=(e.stderr||String(e)).slice(0,80); }
try { execSync("sleep 2"); out.preset = execSync(`curl -sk --max-time 35 "${base}/?ps_make_drask_preset=1&k=ps2026"`,{encoding:"utf8",env}).slice(0,160); } catch(e){ out.preset_err=(e.stderr||String(e)).slice(0,80); }
if(out.maker_id){ try { execSync(`curl -sk -o /dev/null --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "${base}/wp-json/code-snippets/v1/snippets/${out.maker_id}"`,{encoding:"utf8",env}); } catch(e){} }
// 332 busena
try { const s=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets/332"`,{encoding:"utf8",env,maxBuffer:5*1024*1024})); out.snip332=s.name; out.has_drask=(s.code||"").indexOf("draskykliu-filtras")>=0; } catch(e){}
// puslapis
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1200}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto("https://dev.avesa.lt/kategorija/katems/draskykles-katems/?nc="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  try { await page.waitForLoadState("networkidle",{timeout:14000}); } catch {}
  await page.waitForTimeout(3000);
  out.filters = await page.evaluate(()=>{
    const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
      const h=f.querySelector(".filter-title");
      r.push({title:h?h.textContent.trim():"?", tax:f.getAttribute("data-taxonomy")||"", niche:f.classList.contains("ps-niche"), nterms:f.querySelectorAll(".filter-content li").length});
    }); return r;
  });
  await page.screenshot({ path:"screenshots/draskykles_filtras.png" });
  await b.close();
} catch(e){ out.page_err=(e.stderr||String(e)).slice(0,100); }
fs.writeFileSync("screenshots/drask_final.txt", JSON.stringify(out,null,2));
