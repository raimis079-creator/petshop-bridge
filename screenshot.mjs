import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'vw',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 28 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-').replace(/&eacute;/g,'é').replace(/&iuml;/g,'ï');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const o={};
const cdx=get('https://web.archive.org/cdx/search/cdx?url=prinspetfoods.nl/aanvulling*&fl=original,timestamp&collapse=urlkey&limit=4000&filter=statuscode:200');
const rows=cdx.split('\n').filter(Boolean).map(l=>l.split(' '));
o.aanvulling_n=rows.length;
const vw=rows.filter(([u])=>/voedingswijzer/i.test(u));
o.vw_n=vw.length;
o.pages={};
let hit=0;
for(const [u,t] of vw.slice(0,42)){
  const h=get(`https://web.archive.org/web/${t}id_/${u}`);
  if(!h||h.length<3000) continue;
  const title=dec((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/\s+/g,' ').trim().slice(0,90);
  const tabs=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase(); return /(gewicht|kg)/.test(f)&&/\d/.test(f)&&rr.length>2;});
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  const i=txt.toLowerCase().indexOf('gram');
  o.pages[u]={ts:t,title,n_tab:tabs.length,tables:tabs.slice(0,1),
    snippet: i>=0? txt.slice(Math.max(0,i-260), i+420):txt.slice(0,400)};
  if(tabs.length) hit++;
}
o.with_tables=hit;
pr('vw.json',o); console.log('DONE vw='+o.vw_n+' tb='+hit);
