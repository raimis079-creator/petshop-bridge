import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pk',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||50} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;/g,'-').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&[a-z]+;/g,' ');}
const o={};
const h=get('https://web.archive.org/web/20240522103018id_/https://ontario.pet/en/for-cats-en/food-adult/',60);
o.bytes=h.length;
// visos antrastes (bet kokio lygio) su pozicijom
const heads=[];
const re=/<h[1-6][^>]*>([\s\S]{2,90}?)<\/h[1-6]>/gi; let m;
while((m=re.exec(h))!==null){
  const t=dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
  if(t.length>2) heads.push({t,i:m.index});
}
o.heads=heads.map(x=>x.t).slice(0,40);
// visos lenteles su pozicijom -> artimiausia ANKSTESNE antraste
const tabs=[];
const re2=/<table[\s\S]*?<\/table>/gi; let m2;
while((m2=re2.exec(h))!==null){
  const rows=[];
  for(const tr of (m2[0].match(/<tr[\s\S]*?<\/tr>/gi)||[])){
    const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>dec(x[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());
    if(c.length) rows.push(c);
  }
  const f=rows.flat().join(' ').toLowerCase();
  if(!/cat weight/.test(f) || rows.length<3) continue;
  let prev=null;
  for(const hd of heads){ if(hd.i < m2.index) prev=hd.t; else break; }
  // tab grupes id
  const before=h.slice(Math.max(0,m2.index-3000),m2.index);
  const tg=[...before.matchAll(/fusion-tabs-(\d+)/g)].map(x=>x[1]);
  tabs.push({head:prev, tabgroup:tg.length?tg[tg.length-1]:null, rows:rows.slice(0,9)});
}
o.n=tabs.length;
o.tabs=tabs;
pr('pk.json',o); console.log('DONE n='+o.n);
