import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const out={};
// 1) Per CLI patikrinam wp_options / imports lentelę
try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/types/product" -o /tmp/t.json`,{env});}catch(e){}
// 2) Check via direct DB query through a snippet? No - instead probe via comparing Eukanuba reference (it has both encoded ZB + decoded table - last import didn't break it)
// 3) Tikrinam: ar Eukanuba 14794 (turi tikra lentele) is karto po Sėrimo turi enkoduota turini ir cia lentele - jei tai jau veikia, vadinasi importas tikrai content nelieci.
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const e=cj(`${BASE}/wp/v2/product/14794?context=edit&_fields=modified,modified_gmt,content`);
out.euk14794_modified=e.modified;
out.euk14794_modified_gmt=e.modified_gmt;
const f=cj(`${BASE}/wp/v2/product/14535?context=edit&_fields=modified,modified_gmt`);
out.farmina14535_modified=f.modified;
out.farmina14535_modified_gmt=f.modified_gmt;
// per ZB stock cron - cariausiai 15:15/16:15 - palyginsim su modified, jei lygina su productu kuriame yra lentele - matome kad jo content nera updatint po table insertion
out.now=new Date().toISOString();
// 4) Patikrinam ZB feed sample - matome ar feed turi entitetus
try{execSync(`curl -sk --max-time 30 "https://api.zoobaze.lt/api/v1/feed/goods.xml" -o /tmp/feed.xml -H "Authorization: Bearer dummy" 2>/dev/null`,{env,maxBuffer:200000000});}catch(e){}
try{const s=fs.statSync('/tmp/feed.xml');out.feedSize=s.size;}catch(e){out.feedSize=0;}
commit("zb_overwrite_check.json",JSON.stringify(out,null,1));
console.log("CHK DONE");
