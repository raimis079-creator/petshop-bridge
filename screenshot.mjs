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
  // field IDs from test 1
  const F={PS_ORDER_COUNT:'egLxlj', PS_PET_SPECIES:'ejqvo4', PS_MARKETING_CONSENT:'bkZwpv'};

  // First: show current full subscriber JSON to understand structure
  L('--- Dabartinis kontakto JSON (columns dalis) ---');
  const cur=call('GET','/subscribers/terra@gyvunai.lt');
  if(cur.j&&cur.j.data){
    L('  columns: '+JSON.stringify(cur.j.data.columns||[]));
  }
  L('');

  // Try approach A: fields as object {id: value}
  L('--- Bandymas A: {fields:{id:value}} ---');
  const a=call('PATCH','/subscribers/terra@gyvunai.lt',{fields:{[F.PS_ORDER_COUNT]:7,[F.PS_PET_SPECIES]:'dog',[F.PS_MARKETING_CONSENT]:'true'}});
  L('  HTTP '+a.code+' resp: '+a.raw.slice(0,200));
  L('');

  // Try approach B: fields as array of {id, value}
  L('--- Bandymas B: {fields:[{id,value}]} ---');
  const b=call('PATCH','/subscribers/terra@gyvunai.lt',{fields:[{id:F.PS_ORDER_COUNT,value:7},{id:F.PS_PET_SPECIES,value:'dog'},{id:F.PS_MARKETING_CONSENT,value:'true'}]});
  L('  HTTP '+b.code+' resp: '+b.raw.slice(0,200));
  L('');

  // read-back after B
  execSync('sleep 2');
  L('--- Read-back po B ---');
  const rb=call('GET','/subscribers/terra@gyvunai.lt');
  if(rb.j&&rb.j.data){
    const ps=(rb.j.data.columns||[]).filter(c=>/^PS_/.test(c.title||''));
    for(const c of ps){L('  '+c.title+' = '+JSON.stringify(c.value));}
    if(ps.every(c=>c.value===null||c.value===''||c.value===undefined)){
      L('  (B irgi tuscia — bandau C)');
      // Approach C: top-level keys by field title
      L('');
      L('--- Bandymas C: top-level {PS_ORDER_COUNT:7,...} ---');
      const c3=call('PATCH','/subscribers/terra@gyvunai.lt',{PS_ORDER_COUNT:7,PS_PET_SPECIES:'dog',PS_MARKETING_CONSENT:'true'});
      L('  HTTP '+c3.code+' resp: '+c3.raw.slice(0,200));
      execSync('sleep 2');
      const rb3=call('GET','/subscribers/terra@gyvunai.lt');
      if(rb3.j&&rb3.j.data){
        const ps3=(rb3.j.data.columns||[]).filter(c=>/^PS_/.test(c.title||''));
        L('  read-back C:');
        for(const c of ps3){L('    '+c.title+' = '+JSON.stringify(c.value));}
      }
    }
  }
  putText('_test1b.txt', out);
  console.log('done');
})();
