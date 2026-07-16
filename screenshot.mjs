import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'po2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||55} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&[a-z]+;/g,' ');}
const o={};
// 1. EN dog_cans: kiek kartu "Feeding" ir "Krmení"?
const h1=get('https://web.archive.org/web/20250427134205id_/https://ontario.pet/en/for-dogs-en/cans/',60);
o.en_dogcans={bytes:h1.length, feeding:(h1.match(/Feeding/gi)||[]).length, tabs_about:(h1.match(/>About</gi)||[]).length, tabs_comp:(h1.match(/>Composition</gi)||[]).length};
await sleep(5000);
// 2. CS dog cans - ar yra?
const cdx=get('https://web.archive.org/cdx/search/cdx?url=ontario.pet%2Fcs%2Ffor-dogs-cs*&output=json&limit=40&collapse=urlkey&filter=statuscode:200',45);
let rows=[]; try{ rows=JSON.parse(cdx||'[]').slice(1); }catch(e){}
o.cs_dog_urls=rows.map(r=>({ts:r[1],u:r[2]})).slice(0,14);
await sleep(5000);
// 3. CS cats cans - lenteles?
const c2=get('https://web.archive.org/cdx/search/cdx?url=ontario.pet%2Fcs%2Ffor-cats-cs%2Fcans%2F&output=json&limit=6&filter=statuscode:200',40);
let ts=null; try{ const j=JSON.parse(c2||'[]'); if(j.length>1) ts=j[j.length-1][1]; }catch(e){}
if(ts){
  const h=get(`https://web.archive.org/web/${ts}id_/https://ontario.pet/cs/for-cats-cs/cans/`,60);
  o.cs_catcans={ts,bytes:h.length,tables:(h.match(/<table/gi)||[]).length,
    krmeni:(h.match(/Krmení|krmení|Dávkování|dávkování/g)||[]).length};
  if(o.cs_catcans.krmeni){
    const txt=dec(h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ');
    const i=txt.search(/Dávkování|dávkování|Krmení/);
    o.cs_catcans.ctx=txt.slice(Math.max(0,i-100),i+420);
  }
}
pr('po2.json',o); console.log('DONE');
