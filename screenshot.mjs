import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
let url=null;
try {
  const c=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wp/v2/product_cat?slug=sampunai-sunims&_fields=link,name,count"`,{encoding:"utf8",env}));
  if(c&&c[0]){ url=c[0].link; out.link=c[0].link; out.cat_count=c[0].count; }
} catch(e){ out.link_err=String(e).slice(0,100); }
if(!url) url=`${base}/produktu-kategorija/sampunai-sunims/`;
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1280,height:1500}, ignoreHTTPSErrors:true })).newPage();
const resp = await page.goto(url,{waitUntil:"networkidle",timeout:60000});
out.status = resp ? resp.status() : 0;
await page.waitForTimeout(3500);
// HTML tekste paieskoti filtru titulu
const txt = await page.evaluate(()=>document.body.innerText);
out.has_paskirtis=/Paskirtis/i.test(txt); out.has_veisle=/Veisl/i.test(txt);
await page.screenshot({ path:"screenshots/samp_filter2.png", fullPage:false });
await b.close();
fs.writeFileSync("screenshots/samp_filter2.txt", JSON.stringify(out,null,1));
