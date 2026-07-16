import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pn',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||55} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;/g,'-').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&[a-z]+;/g,' ');}
const o={};
const pages=[['dog_cans','https://ontario.pet/en/for-dogs-en/cans/','20250427134205'],
             ['cat_cans','https://ontario.pet/en/for-cats-en/cans/','20240912122912'],
             ['cat_pouches','https://ontario.pet/en/for-cats-en/pouches/','20240912113315'],
             ['cat_treats','https://ontario.pet/en/for-cats-en/treats/','20250427130033']];
for(const [k,u,ts] of pages){
  const h=get(`https://web.archive.org/web/${ts}id_/${u}`,60);
  const r={bytes:h.length};
  const marks=[]; const re=/<h[23][^>]*>([\s\S]{2,90}?)<\/h[23]>/gi; let m;
  while((m=re.exec(h))!==null){
    const t=dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
    if(/ontario/i.test(t)) marks.push({t,i:m.index});
  }
  r.feeds=[];
  for(let i=0;i<marks.length;i++){
    const from=marks[i].i, to=(i+1<marks.length)?marks[i+1].i:h.length;
    const seg=h.slice(from,to).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
    const txt=dec(seg.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
    // feeding sakiniai
    const fm=txt.match(/(Feeding[\s\S]{0,60}?:?\s*)([\s\S]{0,420})/i);
    const daily=txt.match(/([^.]{0,120}\b(daily|per day|per\s+10\s*kg|g\s*\/\s*(day|kg)|recommend)[^.]{0,260}\.)/i);
    r.feeds.push({name:marks[i].t.slice(0,58), feeding: fm?fm[0].slice(0,420):null, daily: daily?daily[0].slice(0,340):null});
  }
  o[k]=r;
  await sleep(5500);
}
pr('pn.json',o); console.log('DONE');
