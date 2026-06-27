import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
function parseWeight(title){
  const t=title.replace(/&amp;/g,'&').replace(/&#8211;/g,'-');
  let m=t.match(/(\d+)\s*\+\s*(\d+)\s*kg\b/i); if(m)return (parseFloat(m[1])+parseFloat(m[2])).toFixed(3);
  m=t.match(/(\d+(?:[,.]\d+)?)\s*kg\b/i); if(m)return parseFloat(m[1].replace(',','.')).toFixed(3);
  m=t.match(/(\d+(?:[,.]\d+)?)\s*(gr|g)\b/i); if(m)return (parseFloat(m[1].replace(',','.'))/1000).toFixed(3);
  return null;
}
const IDS=[33370,33231,14650,14651,14634,14633,14630,14517,14516];
const out=[];
for(const id of IDS){
  const w=cj(`${BASE}/wc/v3/products/${id}?_fields=id,name,weight`);
  const pw=parseWeight(w.name||'');
  if(!pw){out.push({id,err:'no_parse',name:w.name});continue;}
  fs.writeFileSync('/tmp/wb.json',JSON.stringify({weight:pw}));
  try{execSync(`curl -sk -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wc/v3/products/${id}" -d @/tmp/wb.json -o /tmp/wr.json`,{env,maxBuffer:200000000});
    const r=JSON.parse(fs.readFileSync('/tmp/wr.json','utf8'));
    out.push({id,name:w.name,setTo:pw,confirmed:r.weight});
  }catch(e){out.push({id,err:String(e).slice(0,80)});}
}
commit("farmina_weight_fix_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log("WFIX DONE");
