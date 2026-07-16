import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rp2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;/g,'-');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const B='https://www.realdog.lt';
const o={};
// produktu nuorodos is 4 kategoriju: <a> tagai su tekstu, ne assets
let prod=new Set();
for(const c of ['/dry-dog-food','/super-premium','/high-premium','/maistas-alergiskiems-suaugusiems-sunims','/dry-dog-food-for-puppies']){
  const h=get(B+c);
  for(const m of h.matchAll(/<a[^>]+href="(\/[a-z0-9\-]{8,})"[^>]*>/gi)){
    const u=m[1];
    if(/^\/(search|contactus|news|blog|login|register|cart|wishlist|compare|dry-dog|super-premium|high-premium|maistas-|snacks|natural|wet)/.test(u)) continue;
    if(/\.(css|js|woff|png|jpg|svg|ico)/.test(u)) continue;
    prod.add(B+u);
  }
}
const P=[...prod];
o.n=P.length; o.sample=P.slice(0,16);
o.pages={};
for(const u of P.slice(0,40)){
  const h=get(u); if(!h||h.length<5000) continue;
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,90);
  const tb=allT(h).filter(rr=>{const f=rr.flat().join(' ').toLowerCase(); return /(svor|kg)/.test(f)&&/(norma|kiekis|para|dien|gram|g\b)/.test(f)&&rr.length>=2;});
  if(tb.length){ o.pages[u]={title,tables:tb.slice(0,2)}; continue; }
  // gal tekstu?
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=b.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  const i=txt.search(/šėrimo|norma|rekomenduojam/i);
  if(i>=0) o.pages[u]={title,text:txt.slice(Math.max(0,i-100),i+700)};
}
o.hits=Object.keys(o.pages).length;
pr('rp2.json',o); console.log('DONE n='+o.n+' hits='+o.hits);
