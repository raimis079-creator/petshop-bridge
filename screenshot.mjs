import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'oz',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-').replace(/&scaron;/g,'š').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d));}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const o={};
for(const u of ['https://www.dinozoo.lv/bariba-kakiem-ontario-adult-indoor-2-kg',
                'https://www.dinozoo.lv/bariba-kakiem-ontario-castrate-2-kg']){
  const h=get(u,30);
  const r={bytes:h.length};
  r.tables=(h.match(/<table/gi)||[]).length;
  r.title=dec((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/\s+/g,' ').trim().slice(0,60);
  const tb=allT(h);
  r.n_tab=tb.length;
  r.tab=tb.slice(0,4).map(t=>t.slice(0,9));
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  r.txt_len=txt.length;
  for(const kw of ['Barošanas','barošan','deva','Deva','svars','Svars','g/dien','dienā']){
    const i=txt.indexOf(kw);
    if(i>=0){ r['kw_'+kw]=txt.slice(Math.max(0,i-140),i+430); break; }
  }
  o[u.split('/').pop()]=r;
}
pr('oz.json',o); console.log('DONE');
