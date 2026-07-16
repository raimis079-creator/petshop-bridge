import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
const cats=['https://exclusion.lt/hypoallergenic/','https://exclusion.lt/hydrolyzed-hypoallergenic/','https://exclusion.lt/intestinal/',
 'https://exclusion.lt/exclusion-mediterraneo-monoprotein/','https://exclusion.lt/metabolic-mobility/','https://exclusion.lt/mobility/',
 'https://exclusion.lt/urinary/','https://exclusion.lt/renal/','https://exclusion.lt/diabetic/','https://exclusion.lt/hepatic/',
 'https://exclusion.lt/hypoallergenic-katems/','https://exclusion.lt/intestinal-katems/','https://exclusion.lt/urinary-katems/',
 'https://exclusion.lt/renal-katems/','https://exclusion.lt/exclusion-mediterraneo/'];
const prods=new Set();
for(const c of cats){ const h=get(c); for(const m of h.matchAll(/href="(https:\/\/exclusion\.lt\/product\/[^"#?]+)"/gi)) prods.add(m[1]); }
const lt=[];
for(const u of [...prods]){
  let h=get(u); if(!h) continue;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/ - exclusion\.lt/,'').replace(/\s+/g,' ').trim();
  const ser=[...h.matchAll(/uploads\/[^"']*?SERIMAS[^"']*?\.png/gi)].map(x=>x[0].split('/').pop());
  const ana=[...h.matchAll(/uploads\/[^"']*?ANALITIKA[^"']*?\.png/gi)].map(x=>x[0].split('/').pop());
  // NUVALOM tag'us pirma
  h = h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  // isimam meniu: nuo "Description" iki "Related"
  const a=h.indexOf('tab-description'); const b=h.indexOf('Related products');
  if(a>0) h = h.slice(a, b>a?b:a+60000);
  let t = h.replace(/<h2[^>]*>/gi,'\n##').replace(/<\/h2>/gi,'##\n')
           .replace(/<strong[^>]*>/gi,'**').replace(/<\/strong>/gi,'**')
           .replace(/<\/p>|<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,' ');
  t = t.replace(/&nbsp;/g,' ').replace(/&#8211;/g,'-').replace(/&#8220;|&#8221;/g,'"')
       .replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d))
       .replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n').trim();
  lt.push({url:u,title,ser:ser[0]||null,ana:ana[0]||null,text:t.slice(0,4500)});
}
out.lt=lt; out.count=lt.length;
out.with_sud=lt.filter(x=>/Sud[ėe]tis/i.test(x.text)).length;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_lttext.json',Buffer.from(JSON.stringify(out)),'lt clean text');
console.log('DONE');
