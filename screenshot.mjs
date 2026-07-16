import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pod',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const B='https://prinspetfoods.com';
const o={};
const raw=get(`${B}/wp-json/wp/v2/product/1088`);
o.raw_head=raw.slice(0,300);
try{
  const j=JSON.parse(raw);
  o.keys=Object.keys(j);
  o.title=j.title&&j.title.rendered;
  const c=(j.content&&j.content.rendered)||'';
  o.content_len=c.length;
  o.content_tables=(c.match(/<table/gi)||[]).length;
  // meta / pods laukai
  o.meta=j.meta||null;
  o.acf=j.acf||null;
  // ieskom skaiciu su 'gram'
  const plain=c.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  o.plain_len=plain.length;
  o.plain_head=plain.slice(0,600);
  for(const kw of ['gram','Gram','feeding','Feeding','kg','advice','Voedings']){
    const i=plain.indexOf(kw); if(i>=0) o['p_'+kw]=plain.slice(Math.max(0,i-120),i+280);
  }
  // elementor duomenys meta lauke?
  const el=get(`${B}/wp-json/wp/v2/product/1088?context=view&_fields=id,title,content,meta,acf,pods`);
  o.fields_probe=el.slice(0,300);
}catch(e){ o.err=String(e.message).slice(0,150); }
// Pods API
for(const p of ['pods/v1/pods','pods/v1/product','pods/v1/products']){
  o['pods_'+p.split('/').pop()]=get(`${B}/wp-json/${p}?per_page=1`).slice(0,180);
}
// visi produktai
const all=get(`${B}/wp-json/wp/v2/product?per_page=100&_fields=id,slug,title`);
try{ const a=JSON.parse(all); o.products_n=a.length; o.products=a.map(x=>({id:x.id,slug:x.slug})).slice(0,30); }
catch(e){ o.all_head=all.slice(0,200); }
pr('pod.json',o); console.log('DONE');
