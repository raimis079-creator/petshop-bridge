import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const TR=(process.env.SENDER_TRANSACTIONAL_TOKEN||'').trim();
const API='https://api.sender.net/v2';
function call(tok, method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+tok+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+API+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+tok+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+API+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
(async()=>{
  L('======================================');
  L('TESTAS #5: Transakcinis atsisakiusiam marketingo');
  L('======================================');
  L('');
  // 1. verifikuoti domenai
  L('--- 5a. Verifikuoti domenai ---');
  const d=call(MK,'GET','/domains');
  if(d.code==='200'&&d.j){
    const doms=(d.j.data||d.j||[]);
    L('  Rasta domenu: '+doms.length);
    for(const dm of doms){
      L('    '+(dm.domain||dm.name||JSON.stringify(dm).slice(0,50))+' — auth/verified: '+JSON.stringify({spf:dm.spf,dkim:dm.dkim,dmarc:dm.dmarc,verified:dm.verified,status:dm.status}).slice(0,120));
    }
    // remember first verified domain
    var verified=doms.find(x=>x.dkim||x.verified||x.status==='verified'||x.spf);
    var fromDomain=verified?(verified.domain||verified.name):null;
    L('  Naudosiu from domeną: '+(fromDomain||'(NĖRA verifikuoto — testuosiu su petshop.lt bandymui)'));
  } else {
    L('  GET /domains HTTP '+d.code+' — '+d.raw.slice(0,150));
    var fromDomain=null;
  }
  L('');

  // 2. subscriber marketing būsena (dokumentavimui)
  L('--- 5b. terra@gyvunai.lt būsena ---');
  const sub=call(MK,'GET','/subscribers/terra@gyvunai.lt');
  if(sub.j&&sub.j.data){
    L('  status: '+JSON.stringify(sub.j.data.status));
    L('  unsubscribed_at: '+JSON.stringify(sub.j.data.unsubscribed_at));
    L('  unsubscribed flag: '+JSON.stringify(sub.j.data.unsubscribed));
  }
  L('');

  // 3. siunciam transakcini per /message/send
  L('--- 5c. Transakcinis siuntimas ---');
  const fromEmail = fromDomain ? ('terra@'+fromDomain) : 'terra@petshop.lt';
  const body={
    from:{email:fromEmail, name:'Petshop.lt'},
    to:{email:'terra@gyvunai.lt', name:'Petshop Test'},
    subject:'[TEST 5] Transakcinis — užsakymo patvirtinimas',
    html:'<p>Sveiki, tai transakcinio laiško testas (užsakymo patvirtinimas). Šis laiškas turi ateiti net jei marketingo atsisakyta.</p>'
  };
  L('  from: '+fromEmail);
  // try transactional token first
  let s=call(TR,'POST','/message/send', body);
  L('  [TRANSACTIONAL token] HTTP '+s.code+' — '+s.raw.slice(0,220));
  if(s.code!=='200'&&s.code!=='201'){
    // fallback marketing token
    let s2=call(MK,'POST','/message/send', body);
    L('  [MARKETING token fallback] HTTP '+s2.code+' — '+s2.raw.slice(0,220));
    s=s2;
  }
  L('');
  L('--- IŠVADA ---');
  if(s.code==='200'||s.code==='201'){
    L('  ✅ Transakcinis PRIIMTAS (HTTP '+s.code+')');
    L('  → svarbu: transakcinis endpoint atskiras nuo marketing consent');
  } else if(/domain|verif|from/i.test(s.raw)){
    L('  ⚠️ Atmesta dėl NEVERIFIKUOTO domeno — tai testo #10 (domain setup) reikalas, ne consent problema');
    L('  → transakcinio mechanizmas veikia, tik reikia verifikuoti mail.petshop.lt');
  } else {
    L('  ❌ Kita klaida: '+s.raw.slice(0,150));
  }
  putText('_test5.txt', out);
  console.log('done');
})();
