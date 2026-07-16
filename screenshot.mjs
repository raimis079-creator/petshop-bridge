import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'an',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||40} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
// Standard-Fit voedingswijzer anatomija
const cdx=get('https://web.archive.org/cdx/search/cdx?url=prinspetfoods.nl*&fl=original,timestamp&collapse=urlkey&limit=20000&filter=statuscode:200&filter=original:.*aanvulling.*');
const rows=cdx.split('\n').filter(Boolean).map(l=>l.split(' '));
const sf=rows.find(([u])=>/90038430/.test(u)) || rows.find(([u])=>/voedingswijzer/.test(u));
o.url=sf&&sf[0]; o.ts=sf&&sf[1];
if(sf){
  execSync('sleep 4');
  const h=get(`https://web.archive.org/web/${sf[1]}id_/${sf[0]}`,50);
  o.bytes=h.length;
  // ka turi vidurys tarp "Aanvulling" ir "Delen"
  const m=h.match(/Aanvulling op de pagina van[\s\S]*?Delen/i);
  if(m){
    const seg=m[0];
    o.seg_len=seg.length;
    o.seg_imgs=[...seg.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(x=>x[1]).slice(0,10);
    o.seg_iframes=[...seg.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(x=>x[1]).slice(0,5);
    o.seg_links=[...seg.matchAll(/<a[^>]+href="([^"]+)"/gi)].map(x=>x[1]).slice(0,10);
    o.seg_objects=[...seg.matchAll(/<(object|embed)[^>]+/gi)].map(x=>x[0].slice(0,120)).slice(0,5);
    o.seg_raw_sample=seg.replace(/\s+/g,' ').slice(0,1200);
  }
  // visi img visame puslapyje su voeding/wijzer/tabel pavadinime
  o.all_feed_imgs=[...h.matchAll(/<img[^>]+src="([^"]*(?:voeding|wijzer|tabel|schema)[^"]*)"/gi)].map(x=>x[1]).slice(0,10);
  // pdf
  o.pdfs=[...h.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map(x=>x[1]).slice(0,8);
}
pr('an.json',o); console.log('DONE');
