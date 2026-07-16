import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'q_wp',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}

const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
// -k butinas: serveriai.lt neatiduoda tarpinio sertifikato (diagnozuota)
function wp(path){
  const cmd=`curl -sk -m 40 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/${path}"`;
  try{ return execSync(cmd,{maxBuffer:60*1024*1024}).toString(); }catch(e){ return ''; }
}
const out={};
// 1. Visi Quattro produktai
let items=[];
for(let page=1;page<=4;page++){
  const raw=wp(`wc/v3/products?search=quattro&per_page=100&status=publish&page=${page}`);
  let arr; try{arr=JSON.parse(raw);}catch(e){ out.parse_err=raw.slice(0,300); break; }
  if(!Array.isArray(arr)||!arr.length) break;
  for(const p of arr) items.push({id:p.id, sku:p.sku, name:p.name, stock:p.stock_status, type:p.type, cats:(p.categories||[]).map(c=>c.name)});
  if(arr.length<100) break;
}
out.total=items.length;
out.instock=items.filter(i=>i.stock==='instock').length;

// 2. Turinio patikra: ar yra serimo lentele
const res=[];
for(const it of items){
  if(it.stock!=='instock'){ res.push({...it, has_feed:null, skip:'outofstock'}); continue; }
  const raw=wp(`wp/v2/product/${it.id}?context=edit&_fields=id,content`);
  let c=''; try{ c=JSON.parse(raw).content.raw||''; }catch(e){ res.push({...it, has_feed:'ERR'}); continue; }
  const low=c.toLowerCase();
  const hasTable=/<table/i.test(c);
  const feedish=/svor/.test(low) && /(norma|kiekis per par|paros|dienos norma)/.test(low);
  res.push({...it, has_feed: (hasTable&&feedish)?true:false, bytes:c.length});
}
out.products=res;
out.instock_no_table=res.filter(r=>r.has_feed===false).length;
out.instock_with_table=res.filter(r=>r.has_feed===true).length;
putResult('q_wp.json',out);
console.log('DONE total='+out.total+' instock='+out.instock+' no_table='+out.instock_no_table+' with_table='+out.instock_with_table);
