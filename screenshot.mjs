import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const TERM=301;
let acc=[],page=1;
while(page<=3){
  const p=cj(`${BASE}/wp/v2/product?product_brand=${TERM}&per_page=100&page=${page}&_fields=id,status,title`);
  if(!Array.isArray(p)||!p.length)break;
  acc=acc.concat(p.map(x=>({id:x.id,status:x.status,title:((x.title&&x.title.rendered)||'').replace(/&amp;/g,'&').replace(/&#8211;/g,'-')})));
  if(p.length<100)break;page++;
}
// group: N&D PUMPKIN - DOG only
const dogPumpkin=acc.filter(x=>/N&D PUMPKIN/i.test(x.title)&&/DOG/i.test(x.title));
// derive recipe key
function recipeKey(t){
  // strip pkg sizes like "12 kg", "800 g", "2,5 kg" etc
  return t.replace(/N&D PUMPKIN[^-]*-/i,'').replace(/-?\s*DOG\s*Dry/i,'').replace(/\d+([,.]\d+)?\s*(kg|g|gr)\b/gi,'').replace(/\(pak\.\d+\)/i,'').replace(/F\d+\s+/i,'').replace(/\s+/g,' ').trim();
}
const groups={};
for(const p of dogPumpkin){const k=recipeKey(p.title);(groups[k]=groups[k]||[]).push(p);}
const out={total:acc.length,dogPumpkin:dogPumpkin.length,recipes:Object.keys(groups).length,groups};
commit("farmina_pumpkin_groups.json",JSON.stringify(out,null,1));
console.log("SCAN DONE");
