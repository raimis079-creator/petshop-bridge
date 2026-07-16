import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'vw3',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||30} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function sleep(ms){execSync(`sleep ${ms/1000}`);}
const o={};
// LETAI: 1 CDX uzklausa, tada puslapiai po viena su 4s pauzemis
// veikusi forma: url=prinspetfoods.nl* + filter=original:...
let cdx='';
for(let a=0;a<3;a++){
  cdx=get('https://web.archive.org/cdx/search/cdx?url=prinspetfoods.nl*&fl=original,timestamp&collapse=urlkey&limit=20000&filter=statuscode:200&filter=original:.*aanvulling.*',60);
  if(cdx.split('\n').filter(Boolean).length>3) break;
  sleep(15000);
}
const rows=cdx.split('\n').filter(Boolean).map(l=>l.split(' '));
o.aanvulling_n=rows.length;
const vw=rows.filter(([u])=>/voedingswijzer/i.test(u));
o.vw_n=vw.length;
o.vw_urls=vw.map(r=>r[0]);
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]*>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
o.pages={};
let hit=0, tried=0;
for(const [u,t] of vw){
  if(tried>=12) break;   // 12 per runa, letai
  tried++;
  sleep(4000);
  let h='';
  for(let a=0;a<2;a++){
    h=get(`https://web.archive.org/web/${t}id_/${u}`,45);
    if(h && h.length>3000 && !/Wayback Machine/.test((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1])) break;
    sleep(8000);
  }
  if(!h||h.length<3000) { o.pages[u]={err:'nepasieke'}; continue; }
  const title=dec((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/\s+/g,' ').trim().slice(0,95);
  const tabs=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase(); return /(gewicht|kg)/.test(f)&&/\d{2}/.test(f)&&rr.length>=2;});
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  const i=txt.indexOf('Aanvulling op de pagina van');
  o.pages[u]={ts:t,title,n_tab:tabs.length,tables:tabs.slice(0,2),
    ctx: i>=0? txt.slice(i,i+600):txt.slice(0,300)};
  if(tabs.length) hit++;
}
o.tried=tried; o.with_tables=hit;
pr('vw3.json',o); console.log('DONE vw='+o.vw_n+' tried='+tried+' tb='+hit);
