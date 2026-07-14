import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+SAPI+path+'"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('--- Pilna testiniu @example.com kontaktu valymui ---');
  L('');
  // gauname visus kontaktus (paginate), tada is JS filtruojame pagal @example.com
  const patterns = ['webhooktest','whsite','whunsub','webhooklong','whlong'];
  const isTest = (email)=>{
    const e = (email||'').toLowerCase();
    if(!e.includes('@example.com')) return false;
    return patterns.some(p => e.includes(p));
  };
  
  let allDeleted = [];
  let allSeen = [];
  let page = 1;
  const seenIds = new Set();
  while(true){
    const s = scall('GET','/subscribers?page='+page+'&limit=100');
    if(s.code!=='200'){ L('HTTP '+s.code+' -- stop'); break; }
    let jd;
    try { jd = JSON.parse(s.raw); } catch(e){ L('parse err'); break; }
    const arr = jd.data || [];
    if(arr.length===0) break;
    L('page '+page+': fetched '+arr.length);
    let testFound = 0;
    for(const sub of arr){
      const email = sub.email || '';
      if(seenIds.has(sub.id||email)) continue;
      seenIds.add(sub.id||email);
      allSeen.push(email);
      if(isTest(email)){
        testFound++;
        const del = scall('DELETE','/subscribers/'+encodeURIComponent(email));
        if(del.code==='200' || del.code==='204'){
          allDeleted.push(email);
          L('  DEL '+email+' -> '+del.code);
        } else {
          L('  FAIL '+email+' -> '+del.code+' ('+del.raw.slice(0,60)+')');
        }
      }
    }
    L('  test found this page: '+testFound);
    // check next page
    const meta = jd.meta || {};
    if(arr.length < 100) break;
    page++;
    if(page > 20) break; // safety
  }
  L('');
  L('=== VISO peržiūrėta: '+allSeen.length+' unikaliu ===');
  L('=== VISO istrinta testiniu: '+allDeleted.length+' ===');
  L('');
  // Patikra — praeinu dar karta
  L('--- POST-VERIFIKACIJA ---');
  const s2 = scall('GET','/subscribers?page=1&limit=100');
  let arr2 = [];
  try { arr2 = JSON.parse(s2.raw).data || []; } catch(e){}
  const remaining = arr2.filter(sub => isTest(sub.email));
  L('  liko testiniu: '+remaining.length);
  for(const r of remaining) L('    still: '+r.email);
  putText('_valymas_2.txt', out);
  console.log('done');
})();
