import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
try {
  const html=execSync(`curl -sk --max-time 40 "${base}/kategorija/sunims/sampunai-sunims/"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
  // rasti Paskirtis filtro bloka
  const ti = html.indexOf('Paskirtis');
  if(ti>0){
    // atgal iki filtro wrapperio pradzios
    const start = html.lastIndexOf('<div', ti-1);
    const ws = html.lastIndexOf('<div class="yith-wcan-filter', ti);
    out.block = html.slice(ws>0?ws:start, ti+900).replace(/\s+/g,' ').slice(0,1400);
  } else { out.block='Paskirtis NOT FOUND'; }
} catch(e){ out.err=String(e).slice(0,80); }
fs.writeFileSync("screenshots/struct.txt", JSON.stringify(out,null,1));
