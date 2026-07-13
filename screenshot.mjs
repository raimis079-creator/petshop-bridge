import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const TR=(process.env.SENDER_TRANSACTIONAL_TOKEN||'').trim();
L('=== SECRETS PRESENCE ===');
L('SENDER_MARKETING_TOKEN: '+(MK?('YRA (len='+MK.length+', prefix='+MK.slice(0,6)+'...)'):'TUSCIAS / NERA'));
L('SENDER_TRANSACTIONAL_TOKEN: '+(TR?('YRA (len='+TR.length+', prefix='+TR.slice(0,6)+'...)'):'TUSCIAS / NERA'));
// test each token against Sender API (list groups is a safe read-only call)
function testToken(name, tok){
  if(!tok){L(name+': praleista (nera tokeno)');return;}
  // Sender API v2: GET /v2/groups  (Bearer auth)
  const cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -H "Authorization: Bearer '+tok+'" -H "Accept: application/json" -H "Content-Type: application/json" "https://api.sender.net/v2/groups"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';
  const bodyPreview=r.replace(/\nHTTP:\S+$/,'').slice(0,300);
  L('');
  L(name+' -> Sender /v2/groups HTTP '+code);
  if(code==='200'){
    L('  ✅ TOKENAS VEIKIA');
    // parse groups to see if PS_TEST exists
    try{
      const j=JSON.parse(r.replace(/\nHTTP:\S+$/,''));
      const groups=(j.data||j||[]);
      const names=Array.isArray(groups)?groups.map(g=>g.title||g.name||JSON.stringify(g).slice(0,40)):[];
      L('  Grupes rastos: '+JSON.stringify(names));
      L('  PS_TEST yra: '+(names.some(n=>/PS_TEST/i.test(n))?'✅ TAIP':'❌ NE (reikia sukurti)'));
    }catch(e){L('  (grupiu parse nepavyko: '+bodyPreview.slice(0,120)+')');}
  } else if(code==='401'||code==='403'){
    L('  ❌ AUTORIZACIJA NEPAVYKO — tokenas neteisingas/atsauktas');
    L('  atsakymas: '+bodyPreview.slice(0,150));
  } else {
    L('  ⚠️ netiketas kodas, atsakymas: '+bodyPreview.slice(0,150));
  }
}
testToken('MARKETING', MK);
testToken('TRANSACTIONAL', TR);
putText('_sendercheck.txt', out);
console.log('done');
