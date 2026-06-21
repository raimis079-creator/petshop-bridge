import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
function grabFilterClass(html, title){
  // randame filtro antraste ir ziurim apsupanti wrapper klase
  const idx = html.indexOf('>'+title+'<');
  if(idx<0) return 'TITLE_NOT_FOUND';
  // atgal ieskom artimiausio class="..." (filtro wrapperio)
  const before = html.slice(Math.max(0,idx-600), idx);
  const classes = [...before.matchAll(/class="([^"]*(?:filter|toggle|collaps|opened|closed)[^"]*)"/gi)].map(m=>m[1]);
  return classes.slice(-3).join(' || ');
}
for(const [tag,url,title] of [
  ["samp","https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/","Paskirtis"],
  ["drask","https://dev.avesa.lt/kategorija/katems/draskykles-katems/","Tipas"],
]){
  try {
    const html=execSync(`curl -sk --max-time 40 "${url}"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
    out[tag+"_len"]=html.length;
    out[tag+"_class"]=grabFilterClass(html,title);
  } catch(e){ out[tag+"_err"]=String(e).slice(0,80); }
}
fs.writeFileSync("screenshots/toggle_class.txt", JSON.stringify(out,null,1));
