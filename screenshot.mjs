import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pp',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
const u='https://prinspetfoods.com/product/procare-standard-fit/';
const h=get(u);
o.bytes=h.length;
o.tables=(h.match(/<table/gi)||[]).length;
o.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].trim().slice(0,80);
// ieskom serimo zodziu
for(const kw of ['feeding','voedingsadvies','voeding','gram','dosage','recommend','kg']){
  const re=new RegExp('.{120}'+kw+'.{260}','gis');
  const hits=[...h.matchAll(re)].map(m=>m[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()).slice(0,2);
  o['kw_'+kw]=hits;
}
// ar yra pdf / json / ajax
o.pdfs=[...h.matchAll(/href="([^"]+\.pdf)"/gi)].map(m=>m[1]).slice(0,8);
o.iframes=[...h.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(m=>m[1]).slice(0,5);
o.json_ld=(h.match(/application\/ld\+json/gi)||[]).length;
o.has_wp=/wp-content|wp-json/i.test(h);
pr('pp.json',o); console.log('DONE');
