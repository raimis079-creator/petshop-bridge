import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
function firstFilterBlock(html){
  const i = html.indexOf('yith-wcan-filter ');
  if(i<0) return 'NOT_FOUND';
  return html.slice(i-30, i+260).replace(/\s+/g,' ');
}
for(const [tag,url] of [
  ["samp","https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/"],
  ["drask","https://dev.avesa.lt/kategorija/katems/draskykles-katems/"],
]){
  try {
    const html=execSync(`curl -sk --max-time 40 "${url}"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
    out[tag+"_block"]=firstFilterBlock(html);
    out[tag+"_placeholder"]=/filter-placeholder/.test(html);
  } catch(e){ out[tag+"_err"]=String(e).slice(0,70); }
}
fs.writeFileSync("screenshots/open_check.txt", JSON.stringify(out,null,1));
