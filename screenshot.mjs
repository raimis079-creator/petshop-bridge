import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rf',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||30} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
const u='https://www.realdog.lt/rd70233-real-dog-sp-adult-mini-lambrice-12-kg';
const h=get(u);
o.bytes=h.length;
let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const txt=b.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
o.txt_len=txt.length;
o.full=txt;   // VISAS tekstas
o.tables=(h.match(/<table/gi)||[]).length;
o.imgs=[...h.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(x=>x[1]).filter(u=>!/logo|icon|flag|cart|banner/i.test(u)).slice(0,12);
pr('rf.json',o); console.log('DONE '+o.txt_len);
