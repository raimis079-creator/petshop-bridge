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
  L('--- Antra pop-ras testiniu kontaktu valymui ---');
  L('');
  // Sender search grazina puslapiuota rezultata - reikia perziureti visa puslapi
  const patterns = ['webhooktest', 'whsite', 'whunsub', 'whlong'];
  let totalDel = 0;
  for(const pat of patterns){
    L('=== pattern: '+pat+' ===');
    let page = 1;
    let batch = 0;
    while(true){
      const s = scall('GET','/subscribers?search='+pat+'&page='+page+'&limit=25');
      if(s.code!=='200'){ L('  HTTP '+s.code+' -- stopping'); break; }
      let jd;
      try { jd = JSON.parse(s.raw); } catch(e){ L('  parse err'); break; }
      const arr = jd.data || [];
      L('  page '+page+': found '+arr.length);
      if(arr.length===0) break;
      for(const sub of arr){
        const email = sub.email || '';
        if(email.includes(pat) && email.includes('@example.com')){
          const del = scall('DELETE','/subscribers/'+encodeURIComponent(email));
          if(del.code==='200' || del.code==='204'){
            batch++;
          } else {
            L('    del '+email+' -> HTTP '+del.code+' (skipping)');
          }
        }
      }
      // if this page had fewer than limit, stop
      if(arr.length < 25) break;
      page++;
      if(page>10) break; // safety
    }
    L('  pattern '+pat+' istrinta: '+batch);
    totalDel += batch;
  }
  L('');
  L('=== VISO istrinta: '+totalDel+' ===');
  L('');
  // patikra kad realiai istrinti
  L('--- Patikra po valymo ---');
  for(const pat of patterns){
    const s = scall('GET','/subscribers?search='+pat+'&limit=5');
    let arr = [];
    try { arr = JSON.parse(s.raw).data || []; } catch(e){}
    L('  '+pat+': lieka '+arr.length);
    for(const sub of arr.slice(0,3)){
      L('    '+sub.email);
    }
  }
  putText('_valymas_1b.txt', out);
  console.log('done');
})();
