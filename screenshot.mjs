import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<5;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'pmax '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
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
async function ga4(dims,mets,filt,limit=200,order){
  const body={dateRanges:[{startDate:'2026-01-10',endDate:'2026-07-09'}],
    dimensions:dims.map(d=>({name:d})),metrics:mets.map(m=>({name:m})),limit};
  if(filt) body.dimensionFilter=filt;
  if(order) body.orderBys=[{metric:{metricName:order},desc:true}];
  const r=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runReport',{
    method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.status!==200){ L('ERR '+dims+' '+r.status+' '+(await r.text()).slice(0,200)); return null; }
  const j=await r.json();
  return (j.rows||[]).map(row=>({d:row.dimensionValues.map(v=>v.value),m:row.metricValues.map(v=>+v.value||v.value)}));
}
let t;
(async()=>{
  t=await token('https://www.googleapis.com/auth/analytics.readonly');
  L('token '+(t?'ok':'FAIL'));

  // A. itemsPurchased pagal sessionDefaultChannelGroup = Cross-network (PMax)
  // GA4 item-scope + session-scope kartu ne visada leidziamas. Bandom itemName x sessionDefaultChannelGroup.
  const pmaxFilter={filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{value:'Cross-network'}}};
  const A=await ga4(['itemName'],['itemsPurchased','itemRevenue'],pmaxFilter,80,'itemRevenue');
  if(A){ putFile('pmax_items.json',JSON.stringify(A)); L('A pmax items rows='+A.length); }

  // B. palyginimui: tie patys itemai per Organic Search
  const orgFilter={filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{value:'Organic Search'}}};
  const B=await ga4(['itemName'],['itemsPurchased','itemRevenue'],orgFilter,80,'itemRevenue');
  if(B){ putFile('organic_items.json',JSON.stringify(B)); L('B organic items rows='+B.length); }

  // C. Visi itemai be filtro (bazei)
  const C=await ga4(['itemName'],['itemsPurchased','itemRevenue'],null,150,'itemRevenue');
  if(C){ putFile('all_items.json',JSON.stringify(C)); L('C all items rows='+C.length); }

  putFile('_pmax_log.txt',out);
})();
