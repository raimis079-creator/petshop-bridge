import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<5;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'diag3 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 3'); }
  return false;
}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{'))r='{'+r; if(!r.endsWith('}'))r=r+'}'; return JSON.parse(r); }
const b64url=(b)=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(sc){
  const sa=loadSA(); const now=Math.floor(Date.now()/1000);
  const h=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const c=b64url(JSON.stringify({iss:sa.client_email,scope:sc,aud:sa.token_uri,exp:now+3600,iat:now}));
  const s=crypto.createSign('RSA-SHA256'); s.update(h+'.'+c);
  const sig=s.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r=await fetch(sa.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:h+'.'+c+'.'+sig})});
  return (await r.json()).access_token;
}
const PROP='346051580';
(async()=>{
  const t=await token('https://www.googleapis.com/auth/analytics.readonly');
  // transactionId x revenue, liepos pradzia (kur yra 11481)
  const body={dateRanges:[{startDate:'2026-07-01',endDate:'2026-07-09'}],
    dimensions:[{name:'transactionId'}], metrics:[{name:'purchaseRevenue'},{name:'taxAmount'},{name:'grossPurchaseRevenue'}],
    orderBys:[{dimension:{dimensionName:'transactionId'},desc:true}], limit:400};
  const r=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runReport',{
    method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const j=await r.json();
  if(j.error){ L('ERR '+JSON.stringify(j.error).slice(0,300)); }
  const rows=(j.rows||[]).map(x=>({id:x.dimensionValues[0].value, rev:+x.metricValues[0].value, tax:+x.metricValues[1].value, gross:+x.metricValues[2].value}));
  L('transakciju: '+rows.length);
  // ieskom 11481 / 10432 / AVP10432
  const hit=rows.filter(x=>/11481|10432|AVP10432/i.test(x.id));
  L('--- ieskomi order 11481 / AVP10432 ---');
  hit.forEach(x=>L(JSON.stringify(x)));
  L('--- pirmi 30 ID (formatui suprasti) ---');
  rows.slice(0,30).forEach(x=>L(`  id=${x.id}  rev=${x.rev}  tax=${x.tax}  gross=${x.gross}`));
  putFile('ga4_transactions_jul.json',JSON.stringify(rows));
  putFile('_diag3_log.txt',out);
})();
