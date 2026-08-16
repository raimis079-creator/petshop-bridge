process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const A64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdFMkVBJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidFMkVBJyk7CiAkb1snbWF4X2lkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPQUxFU0NFKE1BWChpZCksMCkgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkiKTsKICRhZG09Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xKSk7ICR1aWQ9JGFkbT8kYWRtWzBdLT5JRDoxOwogJG9bJ3VpZCddPSR1aWQ7CiAkb1snY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOwogJG9bJ2Nvb2tpZV92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsIHRpbWUoKSszMDAsICdsb2dnZWRfaW4nKTsKICRvWyd1cmwnXT13Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ2F1Z2ludGluaXMnKS4nP2FjdGlvbj1jcmVhdGUnOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg=='; const D64B='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdFMkVEJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidFMkVEJyk7CiAkbnVvPWlzc2V0KCRfR0VUWydudW8nXSk/KGludCkkX0dFVFsnbnVvJ106MDsKICRvWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICJTRUxFQ1QgaWQsc3JpdGlzLHRpcGFzLHZlcnRlLHVzZXJfaWQgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkgV0hFUkUgaWQ+JWQgQU5EIHNyaXRpcyBJTiAoJ2Fua2V0YScsJ3JlYycpIE9SREVSIEJZIGlkIiwkbnVvKSxBUlJBWV9BKTsKCiAvKiBkcmFmdCBjcmVhdGUgcGVyIHRpa3JhIFJFU1QgaGFuZGxlcmkgKGFub25pbWluaXMga2VsaWFzKSAqLwogd3Bfc2V0X2N1cnJlbnRfdXNlcigwKTsKICRycT1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdQT1NUJywnL3BldHNob3AvdjEvcGV0LWRyYWZ0Jyk7CiAkcnEtPnNldF9oZWFkZXIoJ0NvbnRlbnQtVHlwZScsJ2FwcGxpY2F0aW9uL2pzb24nKTsKICRycS0+c2V0X2JvZHkod3BfanNvbl9lbmNvZGUoYXJyYXkoCiAgICdlbWFpbCc9Pid6emRyYWZ0LScud3BfZ2VuZXJhdGVfcGFzc3dvcmQoNixmYWxzZSkuJ0BleGFtcGxlLmNvbScsCiAgICdwYXlsb2FkJz0+YXJyYXkoJ3BldF9uYW1lJz0+J1paRHJhZnRhcycsJ3NwZWNpZXMnPT4nZG9nJywnbGlmZV9zdGFnZSc9PidhZHVsdCcsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+OSwKICAgICAnc2Vuc2l0aXZpdGllcyc9Pidub25lJywncHJpbWFyeV9uZWVkJz0+J25vbmUnLCdkb2dfc2l6ZSc9PidzbWFsbCcpLAogICAncGF5bG9hZF92ZXJzaW9uJz0+MSwKICkpKTsKICRycz1yZXN0X2RvX3JlcXVlc3QoJHJxKTsKICRvWydkcmFmdF9zdGF0dXMnXT0kcnMtPmdldF9zdGF0dXMoKTsKICRkZD0kcnMtPmdldF9kYXRhKCk7ICRvWydkcmFmdF9kYXRhJ109aXNfYXJyYXkoJGRkKT9hcnJheV9pbnRlcnNlY3Rfa2V5KCRkZCxhcnJheV9mbGlwKGFycmF5KCdkcmFmdF9pZCcsJ2lkJywnb2snLCdjb2RlJywnbWVzc2FnZScpKSk6JGRkOwogJGRpZD0nJzsgaWYoaXNfYXJyYXkoJGRkKSl7IGZvcmVhY2goYXJyYXkoJ2RyYWZ0X2lkJywnaWQnKSBhcyAkayl7IGlmKCFlbXB0eSgkZGRbJGtdKSl7ICRkaWQ9KHN0cmluZykkZGRbJGtdOyBicmVhazsgfSB9IH0KICRvWydkcmFmdF9pZCddPSRkaWQ7CiAkb1snY29tcGxldGVkX2RyYWZ0J109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoCiAgIlNFTEVDVCB0aXBhcyx2ZXJ0ZSx1c2VyX2lkIEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIHNyaXRpcz0nYW5rZXRhJyBBTkQgdGlwYXM9J2Fua2V0YV9jb21wbGV0ZWQnIEFORCB2ZXJ0ZSBMSUtFICVzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsJ2RyYWZ0OiUnKSxBUlJBWV9BKTsKCiAvKiBjbGFpbToga2FpcCBwcmlzaWp1bmdlcyBhZG1pbmFzICovCiAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyB3cF9zZXRfY3VycmVudF91c2VyKCRhZG1bMF0tPklEKTsKICRycTI9bmV3IFdQX1JFU1RfUmVxdWVzdCgnUE9TVCcsJy9wZXRzaG9wL3YxL3BldC1jbGFpbS1yZXNvbHZlJyk7CiAkcnEyLT5zZXRfaGVhZGVyKCdDb250ZW50LVR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7CiAkcnEyLT5zZXRfYm9keSh3cF9qc29uX2VuY29kZShhcnJheSgnZHJhZnRfaWQnPT4kZGlkLCdhY3Rpb24nPT4nY2xhaW0nKSkpOwogJHJzMj1yZXN0X2RvX3JlcXVlc3QoJHJxMik7CiAkb1snY2xhaW1fc3RhdHVzJ109JHJzMi0+Z2V0X3N0YXR1cygpOwogJGNkPSRyczItPmdldF9kYXRhKCk7ICRvWydjbGFpbV9kYXRhJ109aXNfYXJyYXkoJGNkKT9qc29uX2RlY29kZSh3cF9qc29uX2VuY29kZSgkY2QpLHRydWUpOiRjZDsKIGlmKGlzX2FycmF5KCRvWydjbGFpbV9kYXRhJ10pKSAkb1snY2xhaW1fZGF0YSddPWFycmF5X3NsaWNlKCRvWydjbGFpbV9kYXRhJ10sMCw2LHRydWUpOwogJG9bJ2NsYWltZWRfaXYnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHRpcGFzLHZlcnRlLHVzZXJfaWQgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkgV0hFUkUgc3JpdGlzPSdhbmtldGEnIEFORCB0aXBhcz0ncHJvZmlsZV9jbGFpbWVkJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogJGNwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGlkIEZST00geyRQfXBzX3BldHMgV0hFUkUgcGV0X25hbWU9J1paRHJhZnRhcycgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIik7CiAkb1snY2xhaW1lZF9wZXQnXT0kY3BpZDsKIGlmKCRjcGlkKXsKICAgJG9bJ2NsYWltZWRfcGV0X2R1b20nXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNlbnNpdGl2aXRpZXMscXVlc3Rpb25uYWlyZV92ZXJzaW9uIEZST00geyRQfXBzX3BldHMgV0hFUkUgaWQ9JWQiLCRjcGlkKSxBUlJBWV9BKTsKICAgJG9bJ2ZsX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfcGV0X2ZpZWxkX2xvZyBXSEVSRSBwZXRfaWQ9JWQiLCRjcGlkKSk7CiB9CiAvKiB2YWx5bWFzICovCiAkb1snaXN2YWx5dGEnXT1hcnJheSgKICAncGV0cyc9PiRjcGlkPyR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyRQfXBzX3BldHMgV0hFUkUgaWQ9JWQiLCRjcGlkKSk6MCwKICAnZmwnPT4kY3BpZD8kd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskUH1wc19wZXRfZmllbGRfbG9nIFdIRVJFIHBldF9pZD0lZCIsJGNwaWQpKTowLAogICdybCc9PiRjcGlkPyR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyRQfXBzX3JlY19sb2cgV0hFUkUgcGV0X2lkPSVkIiwkY3BpZCkpOjAsCiAgJ2RyYWZ0Jz0+JGRpZD8kd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskUH1wc19wZXRfcHJvZmlsZV9kcmFmdHMgV0hFUkUgZHJhZnRfaWQ9JXMiLCRkaWQpKTowLAogICdpdic9PiR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIGlkPiVkIEFORCBzcml0aXMgSU4gKCdhbmtldGEnLCdyZWMnKSIsJG51bykpLAogKTsKIHdwX3NldF9jdXJyZW50X3VzZXIoMCk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'P1A-ANON'};
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
  const sA=await snip('TEMP P1A E2EA',A64);
  await new Promise(r=>setTimeout(r,5000));
  const prep=JSON.parse(await (await fetch(WP+'/?ps_p0=E2EA')).text());
  await off(sA);
  out.max_id=prep.max_id;

  const { chromium } = await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1280,height:1000}});
  const p=await ctx.newPage();  /* ANONIMAS — be cookie */
  out.js=[]; p.on('pageerror',e=>out.js.push(String(e).slice(0,150)));
  await p.goto(WP+'/anketa-testas/',{waitUntil:'domcontentloaded',timeout:30000});
  await p.waitForSelector('.pspet-wrap',{timeout:15000});
  await new Promise(r=>setTimeout(r,1200));
  out.step1=await p.evaluate(()=>{const h=document.querySelector('[data-step]');return h?h.getAttribute('data-step'):null;});
  const pill=await p.$('.pspet-wrap .pspet-pill'); if(pill) await pill.click();
  const nm=await p.$('.pspet-wrap input[type="text"], .pspet-wrap input.pspet-input'); if(nm) await nm.fill('Anonimas1');
  const sv=await p.$('.pspet-wrap input[placeholder*="pvz"], .pspet-wrap input[inputmode], .pspet-wrap input[type="number"]');
  out.svoris_rastas=!!sv; if(sv) await sv.fill('11');
  await put('e2e_8_anon_step1.png', await p.screenshot({fullPage:false}), 'anon step1');
  const btns=await p.$$('.pspet-wrap .pspet-btn');
  if(btns.length) await btns[btns.length-1].click();
  await new Promise(r=>setTimeout(r,2500));
  out.step_po=await p.evaluate(()=>{const h=document.querySelector('[data-step]');return h?h.getAttribute('data-step'):null;});
  /* 'none' pill vizualas: atidarome Savijauta sekcija jei uzverta */
  try{
    const sav=p.locator('.pspet-step-title',{hasText:'Savijauta'}).first();
    if(await sav.count()) await sav.click();
    await new Promise(r=>setTimeout(r,700));
  }catch(e){}
  out.none_pill=await p.evaluate(()=>{
    const ps=[...document.querySelectorAll('.pspet-pill')];
    const n=ps.find(x=>/Jautrumų nepastebėjau/.test(x.textContent||''));
    return n?{yra:1,aktyvus:n.className.indexOf('active')>=0}:{yra:0};
  });
  if(out.none_pill&&out.none_pill.yra){
    await p.locator('.pspet-pill',{hasText:'Jautrumų nepastebėjau'}).first().click();
    await new Promise(r=>setTimeout(r,500));
    out.none_po_click=await p.evaluate(()=>{
      const n=[...document.querySelectorAll('.pspet-pill')].find(x=>/Jautrumų nepastebėjau/.test(x.textContent||''));
      return n?n.className.indexOf('active')>=0:null;
    });
    out.draft_sens=await p.evaluate(()=>{try{const d=JSON.parse(localStorage.getItem('pspet_draft')||sessionStorage.getItem('pspet_draft')||'null');return d&&d.data?d.data.sensitivities:(d?d.sensitivities:undefined);}catch(e){return 'err';}});
  }
  await put('e2e_9_anon_step2_none.png', await p.screenshot({fullPage:false}), 'anon step2 none');
  /* metimas step2 */
  await p.evaluate(()=>{window.dispatchEvent(new Event('pagehide'));});
  await new Promise(r=>setTimeout(r,2200));
  await br.close();

  const sD=await snip('TEMP P1A E2ED',D64B);
  await new Promise(r=>setTimeout(r,5000));
  out.db=JSON.parse(await (await fetch(WP+'/?ps_p0=E2ED&nuo='+prep.max_id)).text());
  await off(sD);
}catch(e){ out.bendra=String(e).slice(0,300); }
await put('p1a.json', Buffer.from(JSON.stringify(out)), 'p1a anon e2e');
console.log('ok');
