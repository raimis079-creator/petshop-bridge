import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
let out = {};
function grab(tag, url){
  for (let a=0;a<3;a++){
    try {
      const html = execSync('curl -sk --max-time 50 "'+url+'"', {encoding:"utf8", env, maxBuffer:15000000});
      const titles = (html.match(/filter-title">[^<]+/g) || []).map(s => s.replace('filter-title">',''));
      out[tag] = { titles: titles, preset: (html.match(/preset_\d+/) || ['none'])[0], placeholder: /filter-placeholder/.test(html), len: html.length };
      return;
    } catch(e){ out[tag+'_e'+a] = 'to'; }
  }
}
grab('sunims', 'https://dev.avesa.lt/kategorija/sunims/sukos-sepeciai-zirkles-sunims/');
grab('katems', 'https://dev.avesa.lt/kategorija/katems/sukos-sepeciai-zirkles-katems/');
fs.writeFileSync("screenshots/t.txt", JSON.stringify(out,null,1));
