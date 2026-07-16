import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
// 1) Zinomas veikiantis URL -> is jo istraukiam VISAS vidines nuorodas
const seed='https://exclusion.pl/pl/karma-dla-psa-hypoallergenic-srednie-duze-rasy-wie/3-123-155';
const h=get(seed);
out.seed_bytes=h.length;
const links=new Set();
for(const m of h.matchAll(/href="(https?:\/\/exclusion\.pl\/[^"#?]+)"/gi)) links.add(m[1]);
out.links_total=links.size;
// produktu nuorodos: baigiasi /N-N-N
const prod=[...links].filter(u=>/\/\d+-\d+-\d+\/?$/.test(u));
out.product_links=prod.length;
out.product_sample=prod.slice(0,10);
// kategoriju nuorodos
const cats=[...links].filter(u=>/\/\d+-[a-z]/i.test(u) && !/\/\d+-\d+-\d+/.test(u));
out.cat_links=cats.slice(0,12);
// 2) ar veikia be slug? testas
for(const t of ['https://exclusion.pl/x/3-123-19','https://exclusion.pl/3-123-19','https://exclusion.pl/index.php?id_product=19&controller=product']){
  const c=execSync(`curl -s -o /dev/null -w "%{http_code} %{url_effective}" -L --max-time 15 "${t}"`).toString();
  out['probe_'+t.slice(22,45)]=c;
}
// 3) is seed puslapio - ar yra lentele?
const tables=h.match(/<table[\s\S]*?<\/table>/gi)||[];
out.seed_tables=tables.length;
out.seed_table_txt = tables.map(t=>t.replace(/<[^>]+>/g,'|').replace(/\|+/g,'|').replace(/\s+/g,' ').slice(0,240));
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_plstruct.json',Buffer.from(JSON.stringify(out)),'pl struct');
console.log('DONE');
