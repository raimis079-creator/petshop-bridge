import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pf',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: cs-CZ,cs;q=0.9" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&([a-z]+);/g,' ');}
const o={};
const h=get('https://www.superzoo.cz/ontario-adult-chicken-2-kg',30);
// 1. PDF nuorodos
o.pdfs=[...new Set([...h.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map(x=>x[1]))].slice(0,8);
// 2. VISOS 'dávk' vietos su skaiciais salia
let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
o.txt_len=txt.length;
const hits=[];
for(const re of [/dávk\w*/gi,/hmotnost\w*/gi,/krmn\w*/gi,/doporuč\w*/gi]){
  let m; while((m=re.exec(txt))!==null && hits.length<40){
    const seg=txt.slice(Math.max(0,m.index-100),m.index+240);
    if(/\d+\s*(g|kg)\b/i.test(seg)) hits.push({kw:m[0],seg});
  }
}
o.hits_with_numbers=hits.slice(0,10);
// 3. eilutes su "kg" IR "g"
o.lines=txt.split(' | ').filter(l=>/\d\s*kg/i.test(l)&&/\d+\s*g\b/i.test(l)).slice(0,12);
// 4. Wayback ontario.pet
try{
  const cdx=get('https://web.archive.org/cdx/search/cdx?url=ontario.pet*&output=json&limit=40&collapse=urlkey&filter=statuscode:200',35);
  const j=JSON.parse(cdx||'[]');
  o.wb_n=Math.max(0,j.length-1);
  o.wb=j.slice(1,16).map(r=>({ts:r[1],u:r[2]}));
}catch(e){ o.wb_err=String(e.message).slice(0,80); }
pr('pf.json',o); console.log('DONE');
