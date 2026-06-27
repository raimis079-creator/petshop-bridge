import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const out={};
// Eukanuba brand
let term=null;
const t=cj(`${BASE}/wp/v2/product_brand?slug=eukanuba&_fields=id,name,slug,count`);
if(Array.isArray(t)&&t.length)term=t[0];
out.term=term;
let ids=[];
if(term){let page=1,acc=[];while(page<=4){const p=cj(`${BASE}/wp/v2/product?product_brand=${term.id}&per_page=100&page=${page}&_fields=id,status,sku,title`);if(!Array.isArray(p)||!p.length)break;acc=acc.concat(p.map(x=>({id:x.id,status:x.status,title:(x.title&&x.title.rendered)||''})));if(p.length<100)break;page++;}ids=acc;}
out.count=ids.length;
out.byStatus=ids.reduce((a,x)=>{a[x.status]=(a[x.status]||0)+1;return a;},{});
out.first10=ids.slice(0,10);
// sample 4 descriptions: structure + table?
out.samples=[];
for(const s of ids.slice(0,4)){
  const j=cj(`${BASE}/wp/v2/product/${s.id}?context=edit&_fields=id,sku,status,content`);
  const raw=(j.content&&j.content.raw)||"";
  out.samples.push({id:s.id,sku:s.sku,len:raw.length,hasAnalitin:/Analitin/i.test(raw),hasSerimo:/\u0160\u0117rim|Rekomenduojama paros/i.test(raw),hasSudetis:/Sud\u0117tis/i.test(raw),hasTable:/<table/i.test(raw),hasB2b:/b2b-black/i.test(raw),head:raw.replace(/\s+/g,' ').slice(0,220)});
}
// also: pick a Farmina product and dump its full Serimo section to see how the feeding norm is stored
const f=cj(`${BASE}/wp/v2/product/33370?context=edit&_fields=id,content`);
const fraw=(f.content&&f.content.raw)||"";
const si=fraw.search(/\u0160\u0117rim|Rekomenduojama paros/i);
out.farmina_serimo=si>=0?fraw.slice(si,si+700):"(nerasta)";
// import linkage postmeta on a Farmina product (clues about which import owns it)
const pm=cj(`${BASE}/wp/v2/product/33370?context=edit&_fields=meta`);
out.farmina_importmeta = pm && pm.meta ? Object.keys(pm.meta).filter(k=>/import|pmxi|wpallimport|zb/i.test(k)) : "n/a";
commit("euk_recon_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log("EUK DONE");
