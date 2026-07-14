import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const TK=(process.env.SENDER_TRANSACTIONAL_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path, body, token){
  const tk = token || MK;
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+tk+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+tk+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('=== SenderAdapter recon (pries v0.2.0 koda) ===');
  L('');

  // 1. Custom fields dabar — patvirtinam TITLE names + ID
  L('--- 1. Esami PS_ custom fields ---');
  const cf = scall('GET','/account/fields');
  if(cf.code==='200'){
    let arr = [];
    try{ arr = JSON.parse(cf.raw).data || []; }catch(e){}
    for(const f of arr){
      if((f.title||'').startsWith('PS_')){
        L('  '+f.title+' (id='+f.id+', type='+(f.type||'?')+')');
      }
    }
  } else { L('  HTTP '+cf.code+' — '+cf.raw.slice(0,120)); }
  L('');

  // 2. Konkretus subscriber — patvirtinam status modeli (email vs temail)
  L('--- 2. terra@gyvunai.lt status modelis ---');
  const sub = scall('GET','/subscribers/terra@gyvunai.lt');
  if(sub.code==='200'){
    let d;
    try{ d = JSON.parse(sub.raw).data || JSON.parse(sub.raw); }catch(e){ d={}; }
    L('  email(marketing) status: '+(d.status ? JSON.stringify(d.status) : (d.status_email||'?')));
    L('  raw keys: '+Object.keys(d).join(', '));
    // rodyti tik pagr laukus
    if(d.status) L('  status objektas: '+JSON.stringify(d.status));
  } else { L('  HTTP '+sub.code+' — '+sub.raw.slice(0,150)); }
  L('');

  // 3. TEST — sukurti unsubscribed kontakta, tada bandyti ji upsert'inti (reaktyvuoti)
  L('--- 3. Reaktyvavimo scenarijus (unsub → upsert) ---');
  const testEmail = 'reactivate_test@example.com';
  // 3a. sukurti
  const create = scall('POST','/subscribers', {email: testEmail, firstname:'ReactTest'});
  L('  3a. create: HTTP '+create.code+' — '+create.raw.slice(0,100));
  // 3b. unsubscribe (DELETE = soft delete)
  const del = scall('DELETE','/subscribers/'+encodeURIComponent(testEmail));
  L('  3b. delete(soft): HTTP '+del.code);
  // 3c. GET po unsub
  const g1 = scall('GET','/subscribers/'+encodeURIComponent(testEmail));
  let st1='?';
  try{ const d=JSON.parse(g1.raw).data||{}; st1=JSON.stringify(d.status); }catch(e){}
  L('  3c. status po delete: '+st1);
  // 3d. bandyti POST vel (ar duplikatas ar reaktyvuoja?)
  const recreate = scall('POST','/subscribers', {email: testEmail, firstname:'ReactAgain'});
  L('  3d. re-POST: HTTP '+recreate.code+' — '+recreate.raw.slice(0,120));
  // 3e. bandyti PATCH (fields update) ant unsubscribed
  const patch = scall('PATCH','/subscribers/'+encodeURIComponent(testEmail), {fields:{PS_ORDER_COUNT:'3'}});
  L('  3e. PATCH fields ant unsub: HTTP '+patch.code+' — '+patch.raw.slice(0,120));
  // 3f. GET final status
  const g2 = scall('GET','/subscribers/'+encodeURIComponent(testEmail));
  let st2='?';
  try{ const d=JSON.parse(g2.raw).data||{}; st2=JSON.stringify(d.status); }catch(e){}
  L('  3f. status po re-POST+PATCH: '+st2);
  // cleanup
  scall('DELETE','/subscribers/'+encodeURIComponent(testEmail));
  L('');

  // 4. Rate limit headers (kiek galim siusti)
  L('--- 4. Rate limit info ---');
  let cmd='curl -s -D - -o /dev/null --max-time 20 -H "Authorization: Bearer '+MK+'" "'+SAPI+'/groups"';
  let rl;try{rl=execSync(cmd,{encoding:'utf8'});}catch(e){rl='err';}
  const rlLines = rl.split('\n').filter(l => /ratelimit|rate-limit|x-rate/i.test(l));
  L('  rate limit headers: '+(rlLines.length? rlLines.join(' | ') : 'nerasta'));
  L('');

  // 5. Transakcinis endpoint — patvirtinam kelia
  L('--- 5. Transactional endpoint (message/send) ---');
  L('  (nesiunčiam realaus, tik patvirtinam kad TK egzistuoja)');
  L('  TK length: '+TK.length);
  L('  MK length: '+MK.length);

  putText('_adapter_recon.txt', out);
  console.log('done');
})();
