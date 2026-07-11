import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'ga '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}

// GA4 auth
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
  const R={};
  try {
    // === 1. Order #34600 detales per WC REST ===
    L('=== 1. Uzsakymas #34600 (WC REST) ===');
    const o=sh('curl -s -k -u "'+U+':'+P+'" "'+BASE+'/wp-json/wc/v3/orders/34600"');
    try{
      const ord=JSON.parse(o);
      R.order={id:ord.id,status:ord.status,total:ord.total,currency:ord.currency,
        payment:ord.payment_method_title,date:ord.date_created,
        billing_email:ord.billing?.email,
        items:(ord.line_items||[]).map(li=>({name:li.name?.slice(0,50),qty:li.quantity,total:li.total,sku:li.sku})),
        shipping_total:ord.shipping_total, total_tax:ord.total_tax};
      L('  #'+ord.id+' status='+ord.status+' total='+ord.total+' tax='+ord.total_tax+' payment='+ord.payment_method_title);
      L('  email='+ord.billing?.email+' items='+(ord.line_items||[]).length);
      // Ar yra GA4 tracking meta (kai kurie pluginai zymi)
      const metaKeys=(ord.meta_data||[]).map(m=>m.key).filter(k=>/ga|gtm|_tracked|transaction/i.test(k));
      R.order.tracking_meta=metaKeys;
      L('  tracking meta keys: '+JSON.stringify(metaKeys));
    }catch(e){L('  order parse err: '+o.slice(0,300));R.order_raw=o.slice(0,500);}

    // === 2. GA4 token ===
    const t=await token('https://www.googleapis.com/auth/analytics.readonly');
    L('=== 2. GA4 token: '+(t?'ok':'FAIL')+' ===');

    // === 3. GA4 REALTIME - purchase eventai per pask. 30 min ===
    L('=== 3. GA4 Realtime (pask. 30 min) — eventName counts ===');
    const rt=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runRealtimeReport',{
      method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},
      body:JSON.stringify({dimensions:[{name:'eventName'}],metrics:[{name:'eventCount'}],
        minuteRanges:[{startMinutesAgo:29,endMinutesAgo:0}]})});
    if(rt.status===200){
      const j=await rt.json();
      const rows=(j.rows||[]).map(r=>({event:r.dimensionValues[0].value,count:+r.metricValues[0].value}));
      R.realtime=rows;
      const ecom=rows.filter(r=>/purchase|add_to_cart|begin_checkout|view_item|add_shipping|add_payment/.test(r.event));
      L('  ecommerce eventai realtime:');
      ecom.forEach(r=>L('    '+r.event+': '+r.count));
      const pur=rows.find(r=>r.event==='purchase');
      L('  >>> purchase realtime count: '+(pur?pur.count:'0 (dar neatvyko arba latency)'));
    } else { L('  realtime ERR '+rt.status+' '+(await rt.text()).slice(0,200)); }

    // === 4. GA4 STANDARD - transactionId dimensija siandien ===
    L('=== 4. GA4 Standard — transactionId (siandien) ===');
    const today=new Date().toISOString().slice(0,10);
    const sr=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runReport',{
      method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},
      body:JSON.stringify({dateRanges:[{startDate:today,endDate:today}],
        dimensions:[{name:'transactionId'}],metrics:[{name:'eventCount'},{name:'totalRevenue'},{name:'purchaseRevenue'}],
        limit:50})});
    if(sr.status===200){
      const j=await sr.json();
      const rows=(j.rows||[]).map(r=>({txid:r.dimensionValues[0].value,count:+r.metricValues[0].value,rev:r.metricValues[1].value,prev:r.metricValues[2].value}));
      R.transactions=rows;
      L('  transakciju siandien: '+rows.length);
      rows.forEach(r=>L('    txid='+r.txid+' count='+r.count+' revenue='+r.rev+' purchaseRev='+r.prev));
      const m=rows.find(r=>r.txid==='34600'||r.txid.includes('34600'));
      L('  >>> #34600 GA4: '+(m?('RASTA count='+m.count+' rev='+m.rev+(m.count>1?' ⚠️ DUBLIKATAS':' ✅ 1x')):'DAR NERASTA (GA4 standard latency iki 24-48h; realtime patikimesnis)'));
    } else { L('  standard ERR '+sr.status+' '+(await sr.text()).slice(0,200)); }

    L('DONE');
  } catch(e){ L('!!! '+(e&&e.stack?e.stack:String(e))); }
  finally { putText('ga4_verify_34600.json',JSON.stringify(R,null,2)); putText('_run19_log.txt',out); }
})();
