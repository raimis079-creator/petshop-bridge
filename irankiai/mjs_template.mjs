process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTMxIGthdGFsb2dvIGtlbGlvIGUyZSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX2t0J10pPyRfR0VUWydwc19rdCddOicnKTsgaWYoJGYhPT0nR08nJiYkZiE9PSdDTCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNTMxJywnZmF6ZSc9PiRmKTsKICAkRU09J3BzbjNrYXRAZ3l2dW5haS5sdCc7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgaWYoJGY9PT0nR08nKXsKICAgICAgLy8gMS4gS2F0YWxvZ28gc2x1b2tzbmlvIG1lY2hhbmlrYSDigJQga29raWUga2FibGlhaQogICAgICAkYz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXByZW51bWVyYXRhLWthdGFsb2dhcy5waHAnKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoIi9hZGRfKD86YWN0aW9ufGZpbHRlcilcKFxzKlsnXCJdKFthLXpfXSspWydcIl1ccyosXHMqYXJyYXlcKFteLF0rLFxzKlsnXCJdKFthLXpfXSspWydcIl0vIiwkYywkbSxQUkVHX1NFVF9PUkRFUik7CiAgICAgIGZvcmVhY2goJG0gYXMgJHgpICRvWydrYWJsaWFpJ11bXT0keFsxXS4nIC0+ICcuJHhbMl07CiAgICAgICRvWydkeWRpcyddPXN0cmxlbigkYyk7CiAgICAgIC8vIDIuIEUyRTogdXpzYWt5bWFzIHN1IGthdGFsb2dvIG1ldGEgLT4gcGF5bWVudF9jb21wbGV0ZSAtPiBwcmVudW1lcmF0YT8KICAgICAgJHVpZD1lbWFpbF9leGlzdHMoJEVNKTsgaWYoISR1aWQpICR1aWQ9d3BfY3JlYXRlX3VzZXIoJ3BzbjNrYXQnLHdwX2dlbmVyYXRlX3Bhc3N3b3JkKDIwKSwkRU0pOwogICAgICAkcHJpZXM9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBlbWFpbD0lcyIsJEVNKSk7CiAgICAgIC8vIEtyZXBzZWxpcyBzdSBwcmVuIHp5bWUgKGthaXAgcHJla2VzIHB1c2xhcGlvIFByZW51bWVydW90aSkKICAgICAgaWYoV0MoKS0+Y2FydCl7IFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKICAgICAgICBXQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgzNTA5OCwyLDAsYXJyYXkoKSxhcnJheSgncHNfcHJlbl9yZXppbWFzJz0+J2NvbmZpcm0nLCdwc19wcmVuX2ludGVydmFsYXMnPT4yOCkpOwogICAgICB9CiAgICAgIC8vIFV6c2FreW1hcyBwZXIgY2hlY2tvdXQga2FibGl1cyAoa2FpcCBXQyBjaGVja291dCBkYXJ5dHUpCiAgICAgICRvcmQ9d2NfY3JlYXRlX29yZGVyKGFycmF5KCdjdXN0b21lcl9pZCc9PiR1aWQpKTsKICAgICAgJG9yZC0+c2V0X2JpbGxpbmdfZW1haWwoJEVNKTsKICAgICAgZm9yZWFjaChXQygpLT5jYXJ0LT5nZXRfY2FydCgpIGFzICRjaz0+JGNpKXsKICAgICAgICAkaXRlbT1uZXcgV0NfT3JkZXJfSXRlbV9Qcm9kdWN0KCk7CiAgICAgICAgJGl0ZW0tPnNldF9wcm9kdWN0KCRjaVsnZGF0YSddKTsgJGl0ZW0tPnNldF9xdWFudGl0eSgkY2lbJ3F1YW50aXR5J10pOwogICAgICAgICRpdGVtLT5zZXRfc3VidG90YWwoJGNpWydsaW5lX3N1YnRvdGFsJ10pOyAkaXRlbS0+c2V0X3RvdGFsKCRjaVsnbGluZV90b3RhbCddKTsKICAgICAgICAkb3JkLT5hZGRfaXRlbSgkaXRlbSk7CiAgICAgICAgLy8ga2F0YWxvZ28gY2hlY2tvdXRfY3JlYXRlX29yZGVyIGthYmxpYWkgcGVyIGRvX2FjdGlvbgogICAgICB9CiAgICAgIGRvX2FjdGlvbignd29vY29tbWVyY2VfY2hlY2tvdXRfY3JlYXRlX29yZGVyJywkb3JkLGFycmF5KCkpOwogICAgICBkb19hY3Rpb24oJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X2NyZWF0ZV9vcmRlcl9saW5lX2l0ZW0nLCRvcmQtPmdldF9pdGVtcygpP2N1cnJlbnQoJG9yZC0+Z2V0X2l0ZW1zKCkpOm51bGwsa2V5KFdDKCktPmNhcnQtPmdldF9jYXJ0KCkpLGN1cnJlbnQoV0MoKS0+Y2FydC0+Z2V0X2NhcnQoKSksJG9yZCk7CiAgICAgICRvcmQtPmNhbGN1bGF0ZV90b3RhbHMoKTsgJG9yZC0+c2F2ZSgpOwogICAgICAkb2lkPSRvcmQtPmdldF9pZCgpOyAkb1snb2lkJ109JG9pZDsKICAgICAgZG9fYWN0aW9uKCd3b29jb21tZXJjZV9jaGVja291dF9vcmRlcl9wcm9jZXNzZWQnLCRvaWQsYXJyYXkoKSwkb3JkKTsKICAgICAgJG9yZD13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICAgICRvWydvcmRfbWV0YSddPWFycmF5KCdpbnRlcnZhbGFzJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19wcmVuX2ludGVydmFsYXMnKSwnc3VrdXJ0YSc9PiRvcmQtPmdldF9tZXRhKCdfcHNfcHJlbl9zdWt1cnRhJyksJ2lkcyc9PiRvcmQtPmdldF9tZXRhKCdfcHNfcHJlbl9pZHMnKSwncmV6aW1hcyc9PiRvcmQtPmdldF9tZXRhKCdfcHNfcHJlbl9yZXppbWFzJykpOwogICAgICAvLyAzLiBBcG1va2VqaW1hcwogICAgICAkb3JkLT5wYXltZW50X2NvbXBsZXRlKCdURVNULVMxNTMxJyk7CiAgICAgICRwbz0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIFdIRVJFIGVtYWlsPSVzIiwkRU0pKTsKICAgICAgJG9bJ3ByZW5fcHJpZXMnXT0kcHJpZXM7ICRvWydwcmVuX3BvJ109JHBvOwogICAgICAkc3Vicz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxzdGF0dXMsaW50ZXJ2YWxfZGF5cyxuZXh0X2N5Y2xlX2RhdGUsbW9kZSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMgV0hFUkUgZW1haWw9JXMiLCRFTSksQVJSQVlfQSk7CiAgICAgICRvWydwcmVudW1lcmF0b3MnXT0kc3ViczsKICAgICAgJG9bJ1RfQUtUWVZBQ0lKQSddPSgkcG8+JHByaWVzJiYkc3VicyYmJHN1YnNbMF1bJ3N0YXR1cyddPT09J2FjdGl2ZScpPydPSyc6J0ZBSUwnOwogICAgICBpZigkc3Vicyl7ICRpdHM9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcHJvZHVjdF9pZCxxdHkgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25faXRlbXMgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwkc3Vic1swXVsnaWQnXSksQVJSQVlfQSk7ICRvWydpdGVtcyddPSRpdHM7IH0KICAgICAgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOwogICAgfSBlbHNlIHsKICAgICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBlbWFpbD0lcyIsJEVNKSk7CiAgICAgIGZvcmVhY2goJGlkcyBhcyAkeCl7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25faXRlbXMgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwkeCkpOwogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9uX2V2ZW50cyBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCR4KSk7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIFdIRVJFIGlkPSVkIiwkeCkpOwogICAgICB9CiAgICAgIGZvcmVhY2god2NfZ2V0X29yZGVycyhhcnJheSgnY3VzdG9tZXInPT4kRU0sJ2xpbWl0Jz0+MjApKSBhcyAkb2QpICRvZC0+ZGVsZXRlKHRydWUpOwogICAgICAkdT1lbWFpbF9leGlzdHMoJEVNKTsgaWYoJHUpeyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB3cF9kZWxldGVfdXNlcigkdSk7IH0KICAgICAgJG9bJ2xpa3V0aXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIFdIRVJFIGVtYWlsPSVzIiwkRU0pKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-210317';
const GKEY='ps_kt';
const PHASES=["GO", "CL"];
const OUT='analize/s1531_katalog.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]={status:st,url:pg.url(),title:await pg.title()}; await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
