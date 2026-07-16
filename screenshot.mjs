import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g3',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
for(const u of ['https://www.monge.it/es/producto/gemon-maxi-adult-con-pollo-y-arroz/',
                'https://www.monge.it/es/producto/gemon-all-breeds-adult-con-cordero-y-arroz/']){
  const h=get(u);
  const r={bytes:h.length};
  r.tables=(h.match(/<table/gi)||[]).length;
  r.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,70);
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=b.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  r.txt_len=txt.length;
  for(const kw of ['razione','Razione','dose','Dose','alimentazione','Alimentazione','ración','Ración','g/','peso','Peso']){
    const i=txt.indexOf(kw);
    if(i>=0){ r['kw_'+kw]=txt.slice(Math.max(0,i-120),i+420); break; }
  }
  r.pdfs=[...h.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map(x=>x[1]).slice(0,6);
  r.imgs=[...h.matchAll(/<img[^>]+src="([^"]*(?:razion|dose|tabel|feed|aliment)[^"]*)"/gi)].map(x=>x[1]).slice(0,6);
  r.numeric=txt.split(' | ').filter(l=>/\d/.test(l)&&/(kg|g\b|gr)/i.test(l)).slice(0,14);
  o[u.split('/').filter(Boolean).pop()]=r;
}
pr('g3.json',o); console.log('DONE');
