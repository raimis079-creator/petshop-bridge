import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function curlJson(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const out={};
// 1) find brand term
let term=null;
for(const tax of ['product_brand']){
  const t=curlJson(`${BASE}/wp/v2/${tax}?slug=farmina&_fields=id,name,slug,count`);
  if(Array.isArray(t)&&t.length){term={tax,...t[0]};break;}
}
out.term=term;
if(!term){
  // try wc brands
  const wb=curlJson(`${BASE}/wc/v3/products/brands?search=farmina&per_page=20&_fields=id,name,slug,count`);
  out.wc_brands=wb;
}
let ids=[];
if(term){
  // list products in brand via wp/v2
  let page=1,acc=[];
  while(page<=5){
    const p=curlJson(`${BASE}/wp/v2/product?${term.tax}=${term.id}&per_page=100&page=${page}&_fields=id,status,sku,title,link`);
    if(!Array.isArray(p)||!p.length)break;
    acc=acc.concat(p.map(x=>({id:x.id,status:x.status,sku:x.sku,title:(x.title&&x.title.rendered)||''})));
    if(p.length<100)break;page++;
  }
  ids=acc;
}
out.count=ids.length;
out.byStatus=ids.reduce((a,x)=>{a[x.status]=(a[x.status]||0)+1;return a;},{});
out.products=ids;
// 2) sample 3 descriptions to gauge current state
const sample=ids.slice(0,3);
out.samples=[];
for(const s of sample){
  const j=curlJson(`${BASE}/wp/v2/product/${s.id}?context=edit&_fields=id,sku,status,content`);
  const raw=(j.content&&j.content.raw)||"";
  out.samples.push({id:s.id,sku:s.sku,status:s.status,len:raw.length,
    hasAnalitin:/Analitin/i.test(raw),hasSerimo:/\u0160\u0117rim|Rekomenduojama paros/i.test(raw),
    hasSudetis:/Sud\u0117tis/i.test(raw),hasTable:/<table/i.test(raw),
    head:raw.slice(0,260)});
}
commit("farmina_recon_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log("RECON DONE");
