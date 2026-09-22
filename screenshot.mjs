process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAzIG1kIOKAlCByZWNvbiAocmVhZC1vbmx5KTogYW5hbGl0aWthIMSvdnlracWzIHRpcGFpLCBrYXRlZ29yaWpvcyBwcmVracWzIHN1IGxlbnRlbGUsIHBhcmRhdmltYWkgOTAgZCwgdmVpc2zEl3MgcHVzbGFwaW8gbWV0YS/FoWFibG9uYXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzAzbWQnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTcwMyBtZCcpOwogIHRyeXsKICAgICRhPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYW5hbGl0aWthLnBocCcpOwogICAgZm9yZWFjaChhcnJheSgnVElQQUknLCdMRUlTVElOSScsJ3RpcGFzJykgYXMgJGspeyAkaT1zdHJwb3MoJGEsJ2NvbnN0ICcuJGspOyBpZigkaSE9PWZhbHNlKSAkb1sna29uc3RfJy4ka109bWJfc3Vic3RyKCRhLCRpLDkwMCk7IH0KICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvY29uc3QgKFtBLVpfXSspXHMqPVxzKmFycmF5XCgoLnswLDYwMH0/KVwpOy9zJywkYSwkbSkpIGZvcmVhY2goJG1bMV0gYXMgJGk9PiRuKSAkb1snY29uc3QnXVskbl09cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRtWzJdWyRpXSk7CiAgICAkaT1zdHJwb3MoJGEsJ2Z1bmN0aW9uIGlyYXN5dGknKTsgJG9bJ2lyYXN5dGknXT0kaSE9PWZhbHNlP21iX3N1YnN0cigkYSwkaSwzMjAwKTonTsSWUkEnOwogICAgJGk9c3RycG9zKCRhLCdmdW5jdGlvbiBnYXV0aScpOyBpZigkaT09PWZhbHNlKSAkaT1zdHJwb3MoJGEsJ3JlZ2lzdGVyX3Jlc3Rfcm91dGUnKTsgJG9bJ3Jlc3RfZ2F2aW1hcyddPSRpIT09ZmFsc2U/bWJfc3Vic3RyKCRhLCRpLDIyMDApOidOxJZSQSc7CiAgICAvLyBrYXRlZ29yaWpvcyBwcmVracWzIHN1IGxlbnRlbGUKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ucHJvZHVjdF9pZCBwaWQsIHQuc3BlY2llcyBGUk9NIHskcH1wc19mZWVkaW5nX21hcCBtIEpPSU4geyRwfXBzX2ZlZWRpbmdfdGFibGVzIHQgT04gdC5pZD1tLmZlZWRpbmdfdGFibGVfaWQgSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9bS5wcm9kdWN0X2lkIEpPSU4geyRwfXBvc3RtZXRhIHBzIE9OIHBzLnBvc3RfaWQ9bS5wcm9kdWN0X2lkIEFORCBwcy5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIHBzLm1ldGFfdmFsdWU9J2luc3RvY2snIFdIRVJFIG0uaXNfYWN0aXZlPTEgQU5EIHQuaXNfYWN0aXZlPTEgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIsQVJSQVlfQSk7CiAgICAka2F0PWFycmF5KCk7ICRrb25zZXJ2PTA7ICRwaWRzPWFycmF5KCk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHBpZHNbXT0oaW50KSRyWydwaWQnXTsgJHNsPXdwX2dldF9vYmplY3RfdGVybXMoKGludCkkclsncGlkJ10sJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J3NsdWdzJykpOyBmb3JlYWNoKChhcnJheSkkc2wgYXMgJHMpeyAka2F0WyRyWydzcGVjaWVzJ10uJyAnLiRzXT0oJGthdFskclsnc3BlY2llcyddLicgJy4kc10/PzApKzE7IH0gJG49Z2V0X3RoZV90aXRsZSgoaW50KSRyWydwaWQnXSk7IGlmKHByZWdfbWF0Y2goJy9rb25zZXJ2fHBhxaF0ZXR8cGFzdGV0fGd1bGlhxaF8cGFkYcW+fGRyxJdnbnxkcmVnbnxtYWnFoWVsfG1haXNlbC9pdScsJG4pKSAka29uc2VydisrOyB9CiAgICBhcnNvcnQoJGthdCk7ICRvWydrYXRlZ29yaWpvcyddPWFycmF5X3NsaWNlKCRrYXQsMCw2MCx0cnVlKTsgJG9bJ2tvbnNlcnZhaV9wYWdhbF9wYXYnXT0ka29uc2VydjsKICAgIC8vIHBhX21haXN0b190aXBhcyAvIGF0cmlidXRhaQogICAgJG9bJ2F0dHJfdGF4b25vbWllcyddPWFycmF5X2tleXMod2NfZ2V0X2F0dHJpYnV0ZV90YXhvbm9taWVzKCk/YXJyYXlfY29sdW1uKHdjX2dldF9hdHRyaWJ1dGVfdGF4b25vbWllcygpLCdhdHRyaWJ1dGVfbmFtZScsJ2F0dHJpYnV0ZV9uYW1lJyk6YXJyYXkoKSk7CiAgICAkc2FtcGxlPWFycmF5X3NsaWNlKCRwaWRzLDAsMyk7IGZvcmVhY2goJHNhbXBsZSBhcyAkcGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOyAkb1snYXR0cl9zYW1wbGUnXVskcGlkXT1hcnJheSgnbic9PiRwci0+Z2V0X25hbWUoKSwnYXR0cnMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBpc19vYmplY3QoJHgpPyR4LT5nZXRfbmFtZSgpLic9Jy5pbXBsb2RlKCcsJywoYXJyYXkpJHgtPmdldF9vcHRpb25zKCkpOiR4O30sJHByLT5nZXRfYXR0cmlidXRlcygpKSwnaW1nJz0+d3BfZ2V0X2F0dGFjaG1lbnRfaW1hZ2VfdXJsKCRwci0+Z2V0X2ltYWdlX2lkKCksJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCcpLCdwYWsnPT4kcHItPmdldF9hdHRyaWJ1dGUoJ3BhX3Bha3VvdGVzX2R5ZGlzJyksJ3cnPT4kcHItPmdldF93ZWlnaHQoKSwnc2FsZSc9PiRwci0+aXNfb25fc2FsZSgpKTsgfQogICAgLy8gcGFyZGF2aW1haSA5MCBkCiAgICAkaW49aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCRwaWRzKSk7CiAgICAkb1sncGFyZDkwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJla2VfaWQgcGlkLCBTVU0oa2lla2lzKSBrLCBDT1VOVChESVNUSU5DVCB1enNha3ltYXNfaWQpIHUgRlJPTSB7JHB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHByZWtlX2lkIElOICgkaW4pIEFORCBhcG1va2V0YV9hdD49Tk9XKCktSU5URVJWQUwgOTAgREFZIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIHByZWtlX2lkIE9SREVSIEJZIHUgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAkb1snaXN0X3BhcmQ5MCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByZWtlX2lkIHBpZCwgU1VNKGtpZWtpcykgaywgQ09VTlQoRElTVElOQ1QgdXpzYWt5bWFzX2lkKSB1IEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgcHJla2VfaWQgSU4gKCRpbikgQU5EIGFwbW9rZXRhX2F0Pj1OT1coKS1JTlRFUlZBTCAxODAgREFZIEdST1VQIEJZIHByZWtlX2lkIE9SREVSIEJZIHUgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAkb1snaXN0X2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMiLDApOwogICAgLy8gdmVpc2zEl3MgcHVzbGFwaXMgMzIwNiDigJQgbWV0YSBpciDFoWFibG9uYXMKICAgICRvWyd2ZWlzbGVfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBMRUZUKG1ldGFfdmFsdWUsMTIwKSB2IEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9MzIwNiBBTkQgbWV0YV9rZXkgTk9UIExJS0UgJ1xfb2VtYmVkJSciLEFSUkFZX0EpOwogICAgJHBnPWdldF9wb3N0KDMyMDYpOyAkb1sndmVpc2xlX2NvbnRlbnRfaGVhZCddPW1iX3N1YnN0cigkcGctPnBvc3RfY29udGVudCwwLDE1MDApOyAkb1sndmVpc2xlX3RpdGxlJ109JHBnLT5wb3N0X3RpdGxlOyAkb1sndmVpc2xlX3VybCddPWdldF9wZXJtYWxpbmsoMzIwNik7CiAgICAkb1sndmVpc2xlc192aXNvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X3RpdGxlIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncGFnZScgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF9wYXJlbnQ9KFNFTEVDVCBwb3N0X3BhcmVudCBGUk9NIHskcH1wb3N0cyBXSEVSRSBJRD0zMjA2KSBPUkRFUiBCWSBwb3N0X25hbWUiLEFSUkFZX0EpOwogICAgJG9bJ3ZlaXNsZV9wYXJlbnQnXT0kcGctPnBvc3RfcGFyZW50P2dldF9wb3N0KCRwZy0+cG9zdF9wYXJlbnQpLT5wb3N0X25hbWU6MDsKICAgICRvWydjYXRfdXJscyddPWFycmF5KCdzdW5pbXMnPT5nZXRfdGVybV9saW5rKCdzYXVzYXMtbWFpc3Rhcy1zdW5pbXMnLCdwcm9kdWN0X2NhdCcpLCdrYXRlbXMnPT5nZXRfdGVybV9saW5rKCdzYXVzYXMtbWFpc3Rhcy1rYXRlbXMnLCdwcm9kdWN0X2NhdCcpKTsKICAgICRvWydraWxsJ109Z2V0X29wdGlvbigncGV0c2hvcF9mZWVkaW5nX2NhbGNfa2lsbCcpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldEZpbGUoKS4nOicuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-062400';
const GKEY='ps_s1703md';
const PHASES=["1"];
const OUT='analize/s1703_md.json';
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
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
