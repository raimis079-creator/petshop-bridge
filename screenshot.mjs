import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('=== PS_ fields SETUP (M3) ===');
  L('');

  // 1. GET visu account fields
  L('--- 1. Visi account fields (GET /fields) ---');
  const all = scall('GET','/fields');
  let existing = {};
  let probeId = null;
  if(all.code==='200'){
    try {
      const d = JSON.parse(all.raw).data || [];
      for(const f of d){
        const title = f.title || '';
        if(title.startsWith('PS_')){
          existing[title] = {id: f.id, type: f.type};
          if(title === 'PS_TEST_PROBE') probeId = f.id;
        }
      }
    } catch(e){ L('  parse err: '+all.raw.slice(0,150)); }
  } else { L('  HTTP '+all.code+' — '+all.raw.slice(0,150)); }
  L('  Esami PS_ fields: '+Object.keys(existing).filter(k=>k!=='PS_TEST_PROBE').length);
  for(const k of Object.keys(existing)){ if(k!=='PS_TEST_PROBE') L('    '+k+' ('+existing[k].type+')'); }
  L('');

  // 2. Istrinti probe lauka
  if(probeId){
    const del = scall('DELETE','/fields/'+probeId);
    L('  PS_TEST_PROBE trynimas -> HTTP '+del.code);
  }
  L('');

  // 3. 25 PS_ laukai su Sender tipais.
  // Sender field types: text, number, date (+ galimai kiti). Category → text (Sender neturi enum).
  // Boolean → text ("true"/"false" string).
  const desired = [
    ['PS_CUSTOMER_ID','text'],
    ['PS_LAST_ORDER_DATE','date'],
    ['PS_ORDER_COUNT','number'],       // JAU YRA
    ['PS_LIFETIME_VALUE','number'],
    ['PS_CUSTOMER_WAVE','text'],
    ['PS_FOUNDING_SCORE','number'],
    ['PS_PET_SPECIES','text'],         // JAU YRA (galbut)
    ['PS_PET_NAME','text'],
    ['PS_PET_LIFE_STAGE','text'],
    ['PS_DOG_SIZE','text'],
    ['PS_FEEDING_TYPE','text'],
    ['PS_PRIMARY_NEED','text'],
    ['PS_CURRENT_FOOD_BRAND','text'],
    ['PS_REFILL_CANDIDATE','text'],    // boolean → text
    ['PS_NEXT_REFILL_DATE','date'],
    ['PS_SUBSCRIPTION_STATUS','text'],
    ['PS_PREFERRED_SHIPPING','text'],
    ['PS_MARKETING_CONSENT','text'],   // JAU YRA (galbut), boolean → text
    ['PS_TRANSACTIONAL_ONLY','text'],
    ['PS_UNSUBSCRIBED_AT','date'],
    ['PS_LAST_EVENT_AT','date'],
    ['PS_LOGIN_METHOD','text'],
    ['PS_LEGACY_EMAIL_LINKED','text'],
    ['PS_LEGACY_LINK_PROMPT_SHOWN','text'],
    ['PS_EMAIL_VERIFIED','text'],
    ['PS_IDENTITY_MERGED_AT','date'],
  ];

  L('--- 3. Kuriami trukstami laukai ---');
  let created = 0, skipped = 0, failed = 0;
  const results = {};
  for(const [title, type] of desired){
    if(existing[title]){
      skipped++;
      results[title] = {status:'exists', id: existing[title].id, type: existing[title].type};
      continue;
    }
    const r = scall('POST','/fields', {title: title, type: type});
    if(r.code==='200' || r.code==='201'){
      let newId = '';
      try { newId = JSON.parse(r.raw).data.id; } catch(e){}
      created++;
      results[title] = {status:'created', id: newId, type: type};
      L('  + '+title+' ('+type+') -> '+newId);
    } else {
      failed++;
      results[title] = {status:'FAIL', code: r.code, raw: r.raw.slice(0,80)};
      L('  ! '+title+' -> HTTP '+r.code+' '+r.raw.slice(0,80));
    }
  }
  L('');
  L('=== SUVESTINE ===');
  L('  Sukurta: '+created);
  L('  Jau buvo: '+skipped);
  L('  Klaidos: '+failed);
  L('');

  // 4. Galutinis patikrinimas — GET visu PS_ dar karta
  const final = scall('GET','/fields');
  let finalPS = [];
  try {
    const d = JSON.parse(final.raw).data || [];
    finalPS = d.filter(f => (f.title||'').startsWith('PS_')).map(f => f.title);
  } catch(e){}
  L('--- 4. Galutinis PS_ fields kiekis: '+finalPS.length+' ---');
  L('  '+finalPS.sort().join(', '));

  L('');
  L('=== RESULTS JSON ===');
  L(JSON.stringify(results, null, 1));

  putText('psfields_setup.txt', out);
  console.log('done, created='+created+' skipped='+skipped+' failed='+failed);
})();
