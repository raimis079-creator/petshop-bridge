import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'wb2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 30 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const o={};
const t='https://web.archive.org/web/2021id_/http://www.prinspetfoods.nl/artikel/90057296-prins-procare-grainfree';
const h=get(t);
o.bytes=h.length;
o.tables=allT(h).map(rows=>rows.slice(0,12));
// pilnas tekstas
let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const txt=b.replace(/<[^>]+>/g,'\n').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
o.txt_len=txt.length;
const i=txt.toLowerCase().indexOf('voedings');
o.voedings = i>=0 ? txt.slice(Math.max(0,i-200), i+900) : null;
const j=txt.toLowerCase().indexOf('gewicht');
o.gewicht = j>=0 ? txt.slice(Math.max(0,j-200), j+900) : null;
pr('wb2.json',o); console.log('DONE');
