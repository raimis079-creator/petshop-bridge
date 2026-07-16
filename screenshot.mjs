import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'q_probe',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sL --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};

// A. Kodel dogsnanny puslapiuose nera <table>? Zvalgom struktura.
const probe='https://dogsnanny.lt/prekes/quattro-collagen-sterilised-salmon/';
const h=get(probe);
o.probe_url=probe; o.bytes=h.length;
o.has_table = (h.match(/<table/gi)||[]).length;
o.norma_hits = [...h.matchAll(/.{140}norma.{200}/gis)].map(m=>m[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()).slice(0,4);
o.imgs_feed = [...h.matchAll(/(https?:\/\/[^"']*?(?:feeding|serim|norma|lentel|guide)[^"']*?\.(?:png|jpe?g|webp))/gi)].map(m=>m[1]).slice(0,6);
o.ajax_hint = /wc-tabs|woocommerce-Tabs|elementor-tab/i.test(h);

// B. Treti saltiniai arbitrazui
const extra=[
 ['pet24','https://pet24.lt/paieska?q=quattro'],
 ['zoopro','https://www.zoopro.lt/paieska?search=quattro'],
 ['kgshop','https://www.kgshop.eu/paieska?q=quattro'],
];
o.extra={};
for(const [n,u] of extra){ const x=get(u); o.extra[n]={bytes:x.length, links:[...new Set([...x.matchAll(/href="([^"]*?(?:quattro|qattro)[^"]*?)"/gi)].map(m=>m[1]))].slice(0,8)}; }
putResult('q_probe.json',o);
console.log('DONE tables='+o.has_table);
