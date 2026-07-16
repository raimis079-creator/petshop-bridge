import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pl2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||45} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const o={};
// 1. visi ontario.pet URL (platus CDX)
const cdx=get('https://web.archive.org/cdx/search/cdx?url=ontario.pet%2Fen%2F*&output=json&limit=800&collapse=urlkey&filter=statuscode:200',50);
let rows=[]; try{ rows=JSON.parse(cdx||'[]').slice(1); }catch(e){ o.cdx_err=(cdx||'').slice(0,150); }
o.n=rows.length;
const uniq=new Map(); for(const r of rows) uniq.set(r[2].replace(/^http:\/\/ontario\.pet:80/,'https://ontario.pet'),r[1]);
o.urls=[...uniq.keys()];
await sleep(4500);
// 2. dog kategorijos?
o.dogs=o.urls.filter(u=>/dog/i.test(u));
o.cats_wet=o.urls.filter(u=>/(cans|pouches|treats)/i.test(u));
pr('pl2.json',o); console.log('DONE n='+o.n);
