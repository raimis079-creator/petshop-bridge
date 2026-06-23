import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cb.json', JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
// 1. Surenku visas Josera prekes (search=Josera)
let prods=[];
for(let page=1;page<=5;page++){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Josera&per_page=100&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));
    if(!Array.isArray(r)||r.length===0)break;
    prods=prods.concat(r); if(r.length<100)break;
  }catch(e){break;}
}
const seen={}; prods=prods.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
// 2. Kiekvienai skaitau raw ir tikrinu sekcijas + lentele
function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return 'ERR';}}
const items=[];
for(const p of prods){
  const h=readRaw(p.id);
  const hasTable=/<table>/.test(h);
  const hasSerimo=h.indexOf("\u0160\u0117rimo")>-1;
  const hasAnal=h.indexOf("Analitin")>-1;
  const hasSud=h.indexOf("Sud\u0117tis")>-1;
  items.push({id:p.id, name:(p.name||"").replace(/\s+/g," ").trim(), sud:hasSud, anal:hasAnal, ser:hasSerimo, table:hasTable, len:h.length});
}
const needFeeding=items.filter(i=>!i.table); // be lenteles
commit("josera_recon_"+TS+".json", JSON.stringify({total:items.length, need_feeding:needFeeding.length, items}, null, 1));
console.log("DONE "+TS+" total="+items.length+" need_feeding="+needFeeding.length);
