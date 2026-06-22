import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
function fetchTitles(tag,url){
  for(let a=1;a<=3;a++){
    try {
      const html=execSync(`curl -sk --max-time 60 "${url}"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
      out[tag]={ titles:[...html.matchAll(/filter-title">([^<]+)</g)].map(m=>m[1]), preset:(html.match(/preset_(\d+)/)||[])[1]||'none', placeholder:/filter-placeholder/.test(html) };
      return;
    } catch(e){ out[tag+"_try"+a]="timeout"; }
  }
}
fetchTitles("sunims","https://dev.avesa.lt/kategorija/sunims/sukos-sepeciai-zirkles-sunims/");
fetchTitles("katems","https://dev.avesa.lt/kategorija/katems/sukos-sepeciai-zirkles-katems/");
fs.writeFileSync("screenshots/titles2.txt", JSON.stringify(out,null,1));
