process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const A64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdFMkVBJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidFMkVBJyk7CiAkb1snbWF4X2lkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPQUxFU0NFKE1BWChpZCksMCkgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkiKTsKICRhZG09Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xKSk7ICR1aWQ9JGFkbT8kYWRtWzBdLT5JRDoxOwogJG9bJ3VpZCddPSR1aWQ7CiAkb1snY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOwogJG9bJ2Nvb2tpZV92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsIHRpbWUoKSszMDAsICdsb2dnZWRfaW4nKTsKICRvWyd1cmwnXT13Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ2F1Z2ludGluaXMnKS4nP2FjdGlvbj1jcmVhdGUnOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg=='; const C64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdFMkVDJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidFMkVDJyk7CiAkbnVvPWlzc2V0KCRfR0VUWydudW8nXSk/KGludCkkX0dFVFsnbnVvJ106MDsKICRvWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICJTRUxFQ1QgaWQsc3JpdGlzLHRpcGFzLHZlcnRlLHVzZXJfaWQgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkgV0hFUkUgaWQ+JWQgT1JERVIgQlkgaWQiLCRudW8pLEFSUkFZX0EpOwogJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgaWQgRlJPTSB7JFB9cHNfcGV0cyBXSEVSRSBwZXRfbmFtZT0nUmVrc2FzMicgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIik7CiAkb1sncGV0J109JHBpZDsKIGlmICgkcGlkKSB7CiAgICRvWydwZXRfZHVvbSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc3BlY2llcyxjdXJyZW50X3dlaWdodF9rZyxxdWVzdGlvbm5haXJlX3ZlcnNpb24saXNfdGVzdCBGUk9NIHskUH1wc19wZXRzIFdIRVJFIGlkPSVkIiwkcGlkKSxBUlJBWV9BKTsKICAgJG9bJ2ZpZWxkX2xvZ19uJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX3BldF9maWVsZF9sb2cgV0hFUkUgcGV0X2lkPSVkIiwkcGlkKSk7CiAgICRvWydyZWNfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcmV6dWx0YXRhcyxyZWFzb25fY29kZSxrYW5kaWRhdHVfc2sgRlJPTSB7JFB9cHNfcmVjX2xvZyBXSEVSRSBwZXRfaWQ9JWQiLCRwaWQpLEFSUkFZX0EpOwogfQogLyogdmFseW1hcyAqLwogaWYgKCRwaWQpIHsKICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JFB9cHNfcGV0cyBXSEVSRSBpZD0lZCIsJHBpZCkpOwogICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskUH1wc19wZXRfZmllbGRfbG9nIFdIRVJFIHBldF9pZD0lZCIsJHBpZCkpOwogICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskUH1wc19yZWNfbG9nIFdIRVJFIHBldF9pZD0lZCIsJHBpZCkpOwogfQogJG9bJ2lzdHJpbnRhX2l2J109KGludCkkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskUH1wc19sYXVrYWlfaXZ5a2lhaSBXSEVSRSBpZD4lZCBBTkQgc3JpdGlzIElOICgnYW5rZXRhJywncmVjJykiLCRudW8pKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0X'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const sA=await snip('TEMP P0X E2EA',A64);
  await new Promise(r=>setTimeout(r,5000));
  const prep=JSON.parse(await (await fetch(WP+'/?ps_p0=E2EA')).text());
  await off(sA);
  out.max_id=prep.max_id;
  const { chromium } = await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1280,height:900}});
  await ctx.addCookies([{name:prep.cookie_name,value:prep.cookie_value,domain:'dev.avesa.lt',path:'/'}]);
  const p=await ctx.newPage();
  out.js=[]; p.on('pageerror',e=>out.js.push(String(e).slice(0,150)));
  await p.goto(prep.url,{waitUntil:'domcontentloaded',timeout:30000});
  await p.waitForSelector('.pspet-wrap',{timeout:15000});
  await new Promise(r=>setTimeout(r,1200));
  out.data_step_pradzioj=await p.evaluate(()=>{const h=document.querySelector('[data-step]');return h?h.getAttribute('data-step'):null;});
  const pill=await p.$('.pspet-wrap .pspet-pill'); if(pill) await pill.click();
  const inp=await p.$('.pspet-wrap .pspet-field input[type="text"], .pspet-wrap input.pspet-input'); if(inp) await inp.fill('Reksas2');
  const num=await p.$('.pspet-wrap input[type="number"]'); if(num) await num.fill('12');
  const btns=await p.$$('.pspet-wrap .pspet-btn');
  if(btns.length) await btns[btns.length-1].click();
  await new Promise(r=>setTimeout(r,3500));
  out.data_step_po=await p.evaluate(()=>{const h=document.querySelector('[data-step]');return h?h.getAttribute('data-step'):null;});
  await put('e2e_6_po_sukurimo.png', await p.screenshot({fullPage:false}), 'po sukurimo');
  /* naujas puslapis — rec blokas + rec_clicked */
  const p2=await ctx.newPage();
  p2.on('pageerror',e=>out.js.push('p2:'+String(e).slice(0,120)));
  await p2.goto(WP+'/paskyra/augintinis/',{waitUntil:'domcontentloaded',timeout:30000});
  let blokas=false;
  try{ await p2.waitForSelector('.ps-rec-blokas',{timeout:12000}); blokas=true; }catch(e){}
  out.rec_blokas=blokas;
  await put('e2e_7_rec_blokas.png', await p2.screenshot({fullPage:false}), 'rec blokas');
  if(blokas){
    const korta=await p2.$('.ps-rec-korta');
    out.kortu=(await p2.$$('.ps-rec-korta')).length;
    if(korta){ await korta.click(); await new Promise(r=>setTimeout(r,2200)); out.korta='paspausta'; }
  }
  await br.close();
  const sC=await snip('TEMP P0X E2EC',C64);
  await new Promise(r=>setTimeout(r,5000));
  out.db=JSON.parse(await (await fetch(WP+'/?ps_p0=E2EC&nuo='+prep.max_id)).text());
  await off(sC);
}catch(e){ out.bendra=String(e).slice(0,300); }
await put('p0x.json', Buffer.from(JSON.stringify(out)), 'p0x C verify');
console.log('ok');
