import { execSync } from "child_process";
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:10*1024*1024})); }
const out = {};
try { const c=wc("products/categories?per_page=100&search=apranga"); out.cats=c.map(x=>({id:x.id,name:x.name,slug:x.slug,count:x.count})); } catch(e){ out.cat_err=String(e).slice(0,80); }
try { const s=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets/332"`,{encoding:"utf8",env,maxBuffer:5*1024*1024})); out.snip332=s.name; out.has_apranga=(s.code||"").indexOf("apranga-filtras")>=0; out.has_drask=(s.code||"").indexOf("draskykliu-filtras")>=0; } catch(e){ out.s_err=String(e).slice(0,60); }
// ar apranga-filtras presetas egzistuoja? per yith preset slug paieska (wp/v2 negalim - WAF). Naudojam REST custom? Tikrinam per kategorijos puslapio HTML.
let slug=(out.cats||[]).filter(c=>c.slug.indexOf('apranga')>=0).sort((a,b)=>b.count-a.count)[0];
out.target=slug;
try {
  const url="https://dev.avesa.lt/kategorija/sunims/"+(slug?slug.slug:"apranga-sunims")+"/?z="+Date.now();
  out.url=url;
  const html=execSync(`curl -sk --max-time 40 "${url}"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
  out.http_has_yith = html.indexOf("yith-wcan-filters")>=0;
  // istraukti filtru titulus
  const titles=[...html.matchAll(/class="[^"]*filter-title[^"]*"[^>]*>([^<]+)</g)].map(m=>m[1].trim());
  out.filter_titles = titles;
  out.has_tipas = html.indexOf("pa_tipas")>=0 || titles.some(t=>/tipas/i.test(t));
} catch(e){ out.page_err=(e.stderr||String(e)).slice(0,100); }
console.log("===PSRESULT===");
console.log(JSON.stringify(out));
console.log("===PSEND===");
