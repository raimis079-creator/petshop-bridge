import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'tx',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
const u='https://prinspetfoods.com/product/procare-standard-fit/';
let h=get(u);
o.bytes=h.length;
// isvalom script/style, tada tagus
let body=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0];
body=body.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const txt=body.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
  .split('\n').map(x=>x.trim()).filter(x=>x.length>0).join(' | ');
o.txt_len=txt.length;
o.txt=txt.slice(0,4000);
// eilutes su skaiciais ir kg/gram
const lines=txt.split(' | ');
o.numeric_lines=lines.filter(l=>/\d/.test(l)&&/(kg|gram|g\b)/i.test(l)).slice(0,40);
pr('tx.json',o); console.log('DONE '+o.txt_len);
