process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBkaWFnbm9zdGlrYSBpbnN0b2NrICovCmFkZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX2JlZm9yZV9hZGRfdG9fY2FydF9idXR0b24nLCBmdW5jdGlvbigpeyBlY2hvICc8IS0tUFNESUFHOmJhdGNiLS0+JzsgfSw1KTsKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdUSCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0YxOURHLTIuMCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRzZW5hPWdldF9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3NrdScsbnVsbCk7CiAgICAvLyBwaXJtb2ppIHByZWtlIGJ1dm8gMzUxNDcg4oCUIGpvcyBzdG9jayBidXNlbmE6CiAgICAkcDA9d2NfZ2V0X3Byb2R1Y3QoMzUxNDcpOwogICAgJG9bJ3AzNTE0NyddPSRwMD9hcnJheSgnc3RvY2snPT4kcDAtPmdldF9zdG9ja19zdGF0dXMoKSwncHVyY2hhc2FibGUnPT4kcDAtPmlzX3B1cmNoYXNhYmxlKCk/J1QnOidOJywndGlwYXMnPT4kcDAtPmdldF90eXBlKCkpOidORVJBJzsKICAgIC8vIHJhbmRhbWUgaW5zdG9jayBzaW1wbGUgcHJla2UKICAgICRwaWQ9MDsKICAgICRrYW5kPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzdCBPTiBzdC5wb3N0X2lkPXAuSUQgQU5EIHN0Lm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgc3QubWV0YV92YWx1ZT0naW5zdG9jaycgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwciBPTiBwci5wb3N0X2lkPXAuSUQgQU5EIHByLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBwci5tZXRhX3ZhbHVlPjAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBwLklEIERFU0MgTElNSVQgMTAiKTsKICAgIGZvcmVhY2goJGthbmQgYXMgJGMpeyAkcD13Y19nZXRfcHJvZHVjdCgoaW50KSRjKTsgaWYoJHAmJiRwLT5pc190eXBlKCdzaW1wbGUnKSYmJHAtPmlzX3B1cmNoYXNhYmxlKCkmJiRwLT5pc19pbl9zdG9jaygpKXsgJHBpZD0oaW50KSRjOyBicmVhazsgfSB9CiAgICAkb1sncGlkJ109JHBpZDsKICAgIGlmKCRwaWQpewogICAgICB1cGRhdGVfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9za3UnLGFycmF5KCRwaWQpLGZhbHNlKTsKICAgICAgJGc9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc25jJyx0aW1lKCksZ2V0X3Blcm1hbGluaygkcGlkKSksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOwogICAgICAkb1snYmF0Y2InXT1zdHJwb3MoJGgsJ1BTRElBRzpiYXRjYicpIT09ZmFsc2U/J1NBVU5BJzonTkVTQVVOQSc7CiAgICAgICRvWydwYXNpcmlua2ltYXMnXT1zdHJwb3MoJGgsJ3BzX3ByZW5faW50ZXJ2YWxhcycpIT09ZmFsc2U/J1QnOidOJzsKICAgICAgJG9bJ2thczQnXT1zdHJwb3MoJGgsJ2thcyA0IHNhdmFpdGVzJykhPT1mYWxzZT8nVCc6J04nOwogICAgICAkb1snZm9ybW9qZSddPXByZWdfbWF0Y2goJy88Zm9ybVtePl0qY2FydFtePl0qPi4qcHNfcHJlbl9pbnRlcnZhbGFzLio8XC9mb3JtPi9zJywkaCk/J1QnOidOJzsKICAgIH0KICAgIGlmKCRzZW5hPT09bnVsbCkgZGVsZXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfc2t1Jyk7IGVsc2UgdXBkYXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfc2t1Jywkc2VuYSxmYWxzZSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='f19_diag2-092238';
const GKEY='ps_f19';
const PHASES=["TH"];
const OUT='analize/f19_diag2.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
