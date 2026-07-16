const U='W1siaHR0cDovL3d3dy5wcmluc3BldGZvb2RzLm5sOjgwL2FhbnZ1bGxpbmcvOTAwMzg0MzAtdm9lZGluZ3N3aWp6ZXIiLCAiMjAxNjA2MDUwMjUxMTciXSwgWyJodHRwOi8vd3d3LnByaW5zcGV0Zm9vZHMubmw6ODAvYWFudnVsbGluZy85MDAzODQ0NC12b2VkaW5nc3dpanplciIsICIyMDE2MDQyNzAxNDQwMSJdLCBbImh0dHA6Ly93d3cucHJpbnNwZXRmb29kcy5ubDo4MC9hYW52dWxsaW5nLzkwMDM4NDQ1LXZvZWRpbmdzd2lqemVyIiwgIjIwMTYwNjAyMDI1MzUyIl0sIFsiaHR0cDovL3d3dy5wcmluc3BldGZvb2RzLm5sL2FhbnZ1bGxpbmcvOTAwMzg0NTItdm9lZGluZ3N3aWp6ZXIiLCAiMjAxNjA0MDMwMzU1NDgiXSwgWyJodHRwOi8vd3d3LnByaW5zcGV0Zm9vZHMubmw6ODAvYWFudnVsbGluZy85MDA0OTY4NC12b2VkaW5nc3dpanplciIsICIyMDE2MDQyMTA4MzIxNiJdLCBbImh0dHA6Ly93d3cucHJpbnNwZXRmb29kcy5ubDo4MC9hYW52dWxsaW5nLzkwMDU3MDI5LXZvZWRpbmdzd2lqemVyIiwgIjIwMTYwNzI3MTkwNzA2Il0sIFsiaHR0cDovL3d3dy5wcmluc3BldGZvb2RzLm5sOjgwL2FhbnZ1bGxpbmcvOTAwNTk5Njgtdm9lZGluZ3N3aWp6ZXIiLCAiMjAxNjA0MjcwMDUyNTMiXSwgWyJodHRwOi8vd3d3LnByaW5zcGV0Zm9vZHMubmw6ODAvYWFudnVsbGluZy85MDA3MTc5OC12b2VkaW5nc3dpanplciIsICIyMDE2MDQyOTE4NTIyMiJdXQ==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'an2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||45} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const urls=JSON.parse(Buffer.from(U,'base64').toString('utf8'));
const o={pages:{}};
for(const [u,t] of urls){
  execSync('sleep 5');
  let h='';
  for(let a=0;a<3;a++){
    h=get(`https://web.archive.org/web/${t}id_/${u}`,50);
    const ti=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1];
    if(h.length>3000 && !/Wayback Machine|Internet Archive/i.test(ti)) break;
    execSync('sleep 10'); h='';
  }
  if(!h){ o.pages[u]={err:'nepasieke'}; continue; }
  const r={bytes:h.length};
  r.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,80);
  const m=h.match(/Aanvulling op de pagina van[\s\S]*?(?:Delen|Nieuws)/i);
  if(m){
    const seg=m[0];
    r.seg_len=seg.length;
    r.imgs=[...seg.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(x=>x[1]).slice(0,8);
    r.raw=seg.replace(/\s+/g,' ').slice(0,1500);
  }
  r.all_imgs=[...h.matchAll(/<img[^>]+src="([^"]*(?:voeding|wijzer|tabel|schema|aanvull)[^"]*)"/gi)].map(x=>x[1]).slice(0,8);
  o.pages[u]=r;
}
pr('an2.json',o); console.log('DONE');
