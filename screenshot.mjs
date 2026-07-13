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
function readCols(){
  const rb=call('GET','/subscribers/terra@gyvunai.lt');
  const cols=rb.j&&rb.j.data?rb.j.data.columns:[];
  let vals={};
  if(Array.isArray(cols)){for(const c of cols){vals[c.title]=c.value;}}
  else if(cols){for(const id in cols){vals[id]=cols[id];}}
  return {vals, raw:cols};
}
(async()=>{
  const F={PS_ORDER_COUNT:'egLxlj', PS_PET_SPECIES:'ejqvo4', PS_MARKETING_CONSENT:'bkZwpv'};

  // D: POST /subscribers (upsert) with fields by ID
  L('--- D: POST /subscribers upsert su fields{id:value} ---');
  const d=call('POST','/subscribers',{email:'terra@gyvunai.lt',firstname:'Petshop',lastname:'Test',groups:['bDxp2q'],fields:{[F.PS_ORDER_COUNT]:7,[F.PS_PET_SPECIES]:'dog',[F.PS_MARKETING_CONSENT]:'true'}});
  L('  HTTP '+d.code+' resp: '+d.raw.slice(0,220));
  execSync('sleep 2');
  let r=readCols(); L('  read-back: '+JSON.stringify(r.vals));
  L('');

  // E: PATCH with fields by TITLE (not id)
  L('--- E: PATCH fields{TITLE:value} ---');
  const e=call('PATCH','/subscribers/terra@gyvunai.lt',{fields:{PS_ORDER_COUNT:7,PS_PET_SPECIES:'dog',PS_MARKETING_CONSENT:'true'}});
  L('  HTTP '+e.code+' resp: '+e.raw.slice(0,220));
  execSync('sleep 2');
  r=readCols(); L('  read-back: '+JSON.stringify(r.vals));
  L('');

  // F: check the field object to see its real key — maybe it needs "field:{id}" style
  L('--- F: GET /fields detales ---');
  const ff=call('GET','/fields');
  if(ff.j){L('  fields raw: '+JSON.stringify(ff.j.data||ff.j).slice(0,400));}
  putText('_test1d.txt', out);
  console.log('done');
})();
