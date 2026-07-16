import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'wb',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
// 1. Wayback: kokie prinspetfoods.nl URL isarchyvuoti
const cdx=get('https://web.archive.org/cdx/search/cdx?url=prinspetfoods.nl*&output=text&fl=original,timestamp&collapse=urlkey&limit=3000&filter=statuscode:200');
const lines=cdx.split('\n').filter(Boolean).map(l=>l.split(' '));
o.cdx_n=lines.length;
const proc=lines.filter(([u])=>/procare|protection|standard-fit|super-active|grainfree|voedingsadvies|herring|lamb|mini/i.test(u));
o.proc_n=proc.length;
o.proc_sample=proc.slice(0,15).map(([u,t])=>u+' @'+t);
// 2. traukiam kelis
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push({rows});} return res;}
o.pages={};
for(const [u,t] of proc.slice(0,14)){
  const w=`https://web.archive.org/web/${t}id_/${u}`;
  const h=get(w); if(!h||h.length<2000) continue;
  const tb=allT(h);
  const good=tb.filter(x=>{const f=x.rows.flat().join(' ').toLowerCase(); return /(gewicht|kg)/.test(f)&&/(gram|hoeveelheid|per dag|dag)/.test(f);});
  const title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,80);
  o.pages[u]={ts:t,title,n_all:tb.length,n_feed:good.length,tables:good.slice(0,1),bytes:h.length};
}
pr('wb.json',o); console.log('DONE cdx='+o.cdx_n+' proc='+o.proc_n);
