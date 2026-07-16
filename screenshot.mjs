import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'wb3',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 28 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
// CDX: ieskom voedingsadvies + produktu puslapiu
const q=['https://web.archive.org/cdx/search/cdx?url=prinspetfoods.nl*&fl=original,timestamp&collapse=urlkey&limit=6000&filter=statuscode:200&filter=original:.*voedings.*',
         'https://web.archive.org/cdx/search/cdx?url=prinspetfoods.nl*&fl=original,timestamp&collapse=urlkey&limit=6000&filter=statuscode:200&filter=original:.*(standard-fit|super-active|puppy-junior|herring|lamb-rice|sensible|skin-coat|perfect-start).*'];
let rows=[];
for(const u of q){ const r=get(u); rows.push(...r.split('\n').filter(Boolean).map(l=>l.split(' '))); }
const uniq=[...new Map(rows.map(r=>[r[0],r])).values()];
o.n=uniq.length;
o.sample=uniq.slice(0,25).map(r=>r[0]);
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
o.pages={};
for(const [u,t] of uniq.slice(0,16)){
  const h=get(`https://web.archive.org/web/${t}id_/${u}`);
  if(!h||h.length<3000) continue;
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=dec(b.replace(/<[^>]+>/g,'\n')).split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  const g=txt.toLowerCase().indexOf('gewicht');
  const v=txt.toLowerCase().indexOf('voedingsadvies');
  if(g<0 && v<0) continue;
  o.pages[u]={ts:t, title:(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].trim().slice(0,70),
    gewicht: g>=0? txt.slice(Math.max(0,g-150), g+700):null,
    voed: v>=0? txt.slice(Math.max(0,v-100), v+700):null};
}
o.hits=Object.keys(o.pages).length;
pr('wb3.json',o); console.log('DONE n='+o.n+' hits='+o.hits);
