import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
function check(tag,url){
  try {
    const html=execSync(`curl -sk --max-time 40 "${url}"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
    out[tag]={
      tipas_filter: /filter-title">Tipas/.test(html),
      issukavimo: /I\u0161\u0161ukavimo/.test(html) || /ukavimo/.test(html),
      sepetys: /epetys/.test(html),
      placeholder: /filter-placeholder/.test(html),
      brand_filter: /Prek\u0117s \u017Eenklas|filter-title">Prek/.test(html),
      products_count: (html.match(/Rodoma/)||[])[0]||'?',
    };
  } catch(e){ out[tag]={err:String(e).slice(0,60)}; }
}
check("sunims","https://dev.avesa.lt/kategorija/sunims/sukos-sepeciai-zirkles-sunims/");
check("katems","https://dev.avesa.lt/kategorija/katems/sukos-sepeciai-zirkles-katems/");
fs.writeFileSync("screenshots/verify_groom.txt", JSON.stringify(out,null,1));
