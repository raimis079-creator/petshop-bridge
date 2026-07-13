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
  const F={PS_ORDER_COUNT:'egLxlj', PS_PET_SPECIES:'ejqvo4', PS_MARKETING_CONSENT:'bkZwpv'};
  L('TESTAS #1 (pataisytas verifikavimas)');
  L('');
  // write again with format A {fields:{id:value}}
  const w=call('PATCH','/subscribers/terra@gyvunai.lt',{fields:{[F.PS_ORDER_COUNT]:7,[F.PS_PET_SPECIES]:'dog',[F.PS_MARKETING_CONSENT]:'true'}});
  L('WRITE {fields:{id:value}} HTTP '+w.code);
  execSync('sleep 2');
  // read back — get FULL columns raw (it may be object OR array)
  const rb=call('GET','/subscribers/terra@gyvunai.lt');
  const cols=rb.j&&rb.j.data?rb.j.data.columns:null;
  L('columns tipas: '+(Array.isArray(cols)?'ARRAY':typeof cols));
  L('columns RAW: '+JSON.stringify(cols));
  L('');
  // interpret both shapes
  const idToTitle={[F.PS_ORDER_COUNT]:'PS_ORDER_COUNT',[F.PS_PET_SPECIES]:'PS_PET_SPECIES',[F.PS_MARKETING_CONSENT]:'PS_MARKETING_CONSENT','avAlVe':'First name','dwBVJb':'Last name'};
  let vals={};
  if(Array.isArray(cols)){
    for(const c of cols){ vals[c.title||idToTitle[c.id]||c.id]=c.value; }
  } else if(cols&&typeof cols==='object'){
    for(const id in cols){ vals[idToTitle[id]||id]=cols[id]; }
  }
  L('Interpretuotos reiksmes:');
  for(const k in vals){ L('  '+k+' = '+JSON.stringify(vals[k])); }
  L('');
  const ok = String(vals['PS_ORDER_COUNT'])==='7' && String(vals['PS_PET_SPECIES'])==='dog' && String(vals['PS_MARKETING_CONSENT'])==='true';
  L('╔════════════════════════════════════╗');
  L('  TESTAS #1 VERDIKTAS: '+(ok?'🟢 ŽALIAS':'🔴 dar ne'));
  L('╚════════════════════════════════════╝');
  L('  PS_ORDER_COUNT=7: '+(String(vals['PS_ORDER_COUNT'])==='7'?'✅':'❌ ('+vals['PS_ORDER_COUNT']+')'));
  L('  PS_PET_SPECIES=dog: '+(String(vals['PS_PET_SPECIES'])==='dog'?'✅':'❌ ('+vals['PS_PET_SPECIES']+')'));
  L('  PS_MARKETING_CONSENT=true: '+(String(vals['PS_MARKETING_CONSENT'])==='true'?'✅':'❌ ('+vals['PS_MARKETING_CONSENT']+')'));
  putText('_test1c.txt', out);
  console.log('done');
})();
