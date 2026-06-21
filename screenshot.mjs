import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
// patikra: ar pa_veisle yra wc attribute + ar turi terminus
try {
  const at=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/attributes"`,{encoding:"utf8",env}));
  out.attrs=at.map(a=>({id:a.id,slug:a.slug,name:a.name}));
  const v=at.find(a=>a.slug==='pa_veisle'||a.slug==='veisle');
  if(v){ const terms=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/attributes/${v.id}/terms?per_page=50"`,{encoding:"utf8",env})); out.veisle_terms=terms.map(t=>({name:t.name,count:t.count})); }
} catch(e){ out.attr_err=String(e).slice(0,100); }
// screenshot kategorijos
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1280,height:1400}, ignoreHTTPSErrors:true })).newPage();
await page.goto(`${base}/produktu-kategorija/sunims/prieziura-ir-sveikata/sampunai-sunims/`,{waitUntil:"networkidle",timeout:60000});
await page.waitForTimeout(3500);
await page.screenshot({ path:"screenshots/samp_filter.png", fullPage:false });
await b.close();
fs.writeFileSync("screenshots/samp_filter.txt", JSON.stringify(out,null,1));
