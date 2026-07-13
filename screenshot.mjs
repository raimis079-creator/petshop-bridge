import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const API='https://api.sender.net/v2';
function call(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+API+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+API+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
(async()=>{
  L('======================================');
  L('TESTAS #1: PS_ custom fields per API');
  L('======================================');
  L('');

  // --- 1a. Kokie fields jau yra? ---
  L('--- 1a. Esami custom fields ---');
  const existing=call('GET','/fields');
  let existingFields=[];
  if(existing.code==='200'){
    try{existingFields=(existing.j.data||existing.j||[]);}catch(e){}
    L('  Rasta '+existingFields.length+' esamu fields: '+JSON.stringify(existingFields.map(f=>f.title||f.name)));
  } else {
    L('  GET /fields HTTP '+existing.code+' — '+existing.raw.slice(0,150));
  }
  L('');

  // --- 1b. Sukuriam 3 PS_ fields ---
  L('--- 1b. Kuriu 3 PS_ fields ---');
  // TZ v1.45: PS_ORDER_COUNT (number), PS_PET_SPECIES (text), PS_MARKETING_CONSENT (text/boolean)
  const toCreate=[
    {name:'PS_ORDER_COUNT', type:'number'},
    {name:'PS_PET_SPECIES', type:'text'},
    {name:'PS_MARKETING_CONSENT', type:'text'}
  ];
  const created={};
  for(const f of toCreate){
    // skip if exists
    const already=existingFields.find(x=>(x.title||x.name)===f.name);
    if(already){L('  '+f.name+' jau egzistuoja (ID '+(already.id)+'), praleista'); created[f.name]=already.id; continue;}
    const c=call('POST','/fields',{title:f.name, type:f.type});
    if(c.code==='200'||c.code==='201'){
      const id=(c.j&&c.j.data&&c.j.data.id)||(c.j&&c.j.id)||'?';
      created[f.name]=id;
      L('  ✅ '+f.name+' ('+f.type+') sukurtas, ID: '+id);
    } else {
      L('  ❌ '+f.name+' HTTP '+c.code+' — '+c.raw.slice(0,180));
    }
  }
  L('');

  // --- 1c. Irasom reiksmes testiniam kontaktui ---
  L('--- 1c. Rasau reiksmes terra@gyvunai.lt ---');
  // Sender: update subscriber with fields object keyed by field id
  const fieldsPayload={};
  if(created['PS_ORDER_COUNT']) fieldsPayload[created['PS_ORDER_COUNT']]=7;
  if(created['PS_PET_SPECIES']) fieldsPayload[created['PS_PET_SPECIES']]='dog';
  if(created['PS_MARKETING_CONSENT']) fieldsPayload[created['PS_MARKETING_CONSENT']]='true';
  const upd=call('PATCH','/subscribers/terra@gyvunai.lt',{fields:fieldsPayload});
  L('  PATCH /subscribers HTTP '+upd.code);
  if(upd.code!=='200'){
    // try PUT as fallback
    const upd2=call('PUT','/subscribers/terra@gyvunai.lt',{fields:fieldsPayload});
    L('  (fallback PUT HTTP '+upd2.code+')');
    if(upd2.code!=='200') L('  atsakymas: '+upd.raw.slice(0,200));
  }
  L('');

  // --- 1d. Perskaitom atgal, tikrinam reiksmes ---
  L('--- 1d. Verifikacija (read-back) ---');
  execSync('sleep 2');
  const rb=call('GET','/subscribers/terra@gyvunai.lt');
  if(rb.code==='200' && rb.j && rb.j.data){
    const cols=rb.j.data.columns||[];
    const psCol=cols.filter(c=>/^PS_/.test(c.title||''));
    L('  PS_ laukai kontakte:');
    for(const c of psCol){ L('    '+c.title+' = '+JSON.stringify(c.value)); }
    // verdict
    const oc=psCol.find(c=>c.title==='PS_ORDER_COUNT');
    const sp=psCol.find(c=>c.title==='PS_PET_SPECIES');
    const mc=psCol.find(c=>c.title==='PS_MARKETING_CONSENT');
    const ok = oc&&String(oc.value)==='7' && sp&&String(sp.value)==='dog' && mc&&String(mc.value)==='true';
    L('');
    L('  VERDIKTAS: '+(ok?'🟢 ŽALIAS — visos reiksmes issaugotos ir perskaitytos':'🟡 DALINAI — patikrink reiksmes auksciau'));
  } else {
    L('  read-back HTTP '+rb.code+' — '+rb.raw.slice(0,150));
    L('  VERDIKTAS: 🔴 RAUDONAS — read-back nepavyko');
  }
  putText('_test1.txt', out);
  console.log('done');
})();
