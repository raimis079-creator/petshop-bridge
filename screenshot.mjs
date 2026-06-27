import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const w=cj(`${BASE}/wc/v3/products/14535`);
const j=cj(`${BASE}/wp/v2/product/14535?context=edit&_fields=id,content,excerpt`);
const raw=(j.content&&j.content.raw)||"";
const exc=(j.excerpt&&j.excerpt.raw)||"";
const out={
  weight:w.weight, dimensions:w.dimensions,
  short_description: w.short_description, // čia dažnai sėdi „Ėrienos moliūgų..." trumpas
  excerpt_raw:exc,
  contentHasPakuotesDydisCm: /Pakuotės dydis.*cm/.test(raw),
  contentHasErienos: /Ėrienos, moliūgų ir mėlynių/.test(raw),
  excerptHasErienos: /Ėrienos, moliūgų ir mėlynių/.test(exc),
  shortHasErienos: w.short_description && /Ėrienos, moliūgų ir mėlynių/.test(w.short_description),
  contentTail:raw.slice(-400)
};
commit("farmina_recheck_14535.json",JSON.stringify(out,null,1));
console.log("RECHECK DONE");
