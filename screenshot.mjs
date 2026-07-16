import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g4',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
// PDF -> tekstas ant runnerio
try{ execSync('sudo apt-get install -y poppler-utils >/dev/null 2>&1 || apt-get install -y poppler-utils >/dev/null 2>&1 || true'); }catch(e){}
o.pdftotext=(()=>{try{return execSync('which pdftotext || echo NONE').toString().trim();}catch(e){return 'NONE';}})();
const pdf='https://www.monge.it/wp-content/uploads/2023/09/Gemon-maxi-adult-with-chicken-and-rice-ENG.pdf';
try{
  execSync(`curl -sLk -m 40 -A "Mozilla/5.0 Chrome/120" -o /tmp/g.pdf "${pdf}"`);
  o.pdf_bytes=parseInt(execSync('stat -c%s /tmp/g.pdf || echo 0').toString().trim());
  if(o.pdftotext!=='NONE' && o.pdf_bytes>1000){
    execSync('pdftotext -layout /tmp/g.pdf /tmp/g.txt');
    const t=fs.readFileSync('/tmp/g.txt','utf8');
    o.txt_len=t.length;
    o.txt=t.slice(0,3500);
  } else if(o.pdf_bytes>1000){
    // be pdftotext: isgaunam nesuspausta teksta is PDF srautu
    const raw=fs.readFileSync('/tmp/g.pdf','latin1');
    const chunks=[...raw.matchAll(/\(([^()\\]{2,80})\)\s*Tj/g)].map(m=>m[1]);
    o.tj_n=chunks.length;
    o.tj=chunks.slice(0,200).join(' | ');
  }
}catch(e){ o.err=String(e.message).slice(0,200); }
pr('g4.json',o); console.log('DONE');
