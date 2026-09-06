process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjAgcnVuIGU3ciDigJQgNiBldGFwbyByZWNvbiBJSSAodGlrIHNrYWl0eW1hcyk6IEFWIMW+dXJuYWxhcyBwZXIgcHJla8SZIChwcmFkaW5pcyBidXZvIC8gZGFiYXJ0aW5pcyksIHBhcnRpam9zLCB0aWVraW1hcywgYXRhc2thaXTFsyBkaWVub3Mgc3JpdHlzLCBwZXRzL3JlZmlsbCBzxIVzYWpvcyBzdSB0ZXN0aW5pYWlzLCBpdnlraWFpIG5hxaFsYWnEjWlhaSwgcHNfY2FydHMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U3ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjIwIGU3cicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogIHRyeXsKICAkb1snYXZfenVybmFsYXNfcHJla2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCxsYXVrYXMsQ09VTlQoKikgbixNSU4oc3VrdXJ0YSkgbnVvLE1BWChzdWt1cnRhKSBpa2ksU1VCU1RSSU5HX0lOREVYKEdST1VQX0NPTkNBVChidXZvIE9SREVSIEJZIGlkKSwnLCcsMSkgcGlybWFzX2J1dm8sU1VCU1RSSU5HX0lOREVYKEdST1VQX0NPTkNBVCh0YXBvIE9SREVSIEJZIGlkIERFU0MpLCcsJywxKSBwYXNrX3RhcG8gRlJPTSB7JHB9cHNfYXZfenVybmFsYXMgR1JPVVAgQlkgcHJvZHVjdF9pZCxsYXVrYXMgT1JERVIgQlkgbiBERVNDIExJTUlUIDI1IixBUlJBWV9BKTsKICAkb1snYXZfenVybmFsYXNfb3AnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcGVyYWNpamEsQ09VTlQoKikgbiBGUk9NIHskcH1wc19hdl96dXJuYWxhcyBHUk9VUCBCWSBvcGVyYWNpamEiLEFSUkFZX0EpOwogICRvWydwYXJ0aWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHByb2R1Y3RfaWQsZ2F1dGEsa2lla2lzX2dhdXRhcyxraWVraXNfbGlrbyxzYXZpa2FpbmFfZXVyLFNVQlNUUklORyhwYXN0YWJhLDEsNDApIHBhc3RhYmEgRlJPTSB7JHB9cHNfcGFydGlqb3MgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICRvWyd0aWVraW1hcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRpZWtlamFzLGJ1c2VuYSxzdWt1cnRhLFNVQlNUUklORyhwYXN0YWJhLDEsNDApIHBhc3RhYmEgRlJPTSB7JHB9cHNfdGlla2ltYXMgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICRvWydhdGFza2FpdHVfZGllbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3JpdGlzLGFwbGlua2EsQ09VTlQoKikgbixNSU4oZGllbmEpIG51byxNQVgoZGllbmEpIGlraSBGUk9NIHskcH1wc19hdGFza2FpdHVfZGllbm9zIEdST1VQIEJZIHNyaXRpcyxhcGxpbmthIixBUlJBWV9BKTsKICAkb1sna29udHJvbGVfZGllbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEsd29vX2FwbW9rZXRpLHdvb19zdW1hX2N0LGZha3QgRlJPTSB7JHB9cHNfa29udHJvbGVfZGllbm9zIE9SREVSIEJZIGRpZW5hIixBUlJBWV9BKTsKICAkb1snZmFrdF91enNfdGVzdGluaXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0ZXN0aW5pcyxDT1VOVCgqKSBuIEZST00geyRwfXBzX2Zha3RfdXpzYWt5bWFpIEdST1VQIEJZIHRlc3RpbmlzIixBUlJBWV9BKTsgJG9bJ2Zha3RfZWlsX3Rlc3RpbmlzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGVzdGluaXMsQ09VTlQoKikgbiBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgR1JPVVAgQlkgdGVzdGluaXMiLEFSUkFZX0EpOwogICRvWydmYWt0X2F0c2FyZ29zX3Rlc3RpbmlzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGVzdGluaXMsQ09VTlQoKikgbixNSU4oZGF0YSkgbnVvLE1BWChkYXRhKSBpa2kgRlJPTSB7JHB9cHNfZmFrdF9hdHNhcmdvc19kIEdST1VQIEJZIHRlc3RpbmlzIixBUlJBWV9BKTsgJG9bJ2RpbV9rbF90ZXN0aW5pcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRlc3RpbmlzLENPVU5UKCopIG4gRlJPTSB7JHB9cHNfZGltX2tsaWVudGFpIEdST1VQIEJZIHRlc3RpbmlzIixBUlJBWV9BKTsKICAkb1snaXZ5a2lhaV9uYXNsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTUlOKHgudXpzYWt5bWFzKSBhLE1BWCh4LnV6c2FreW1hcykgYixDT1VOVCgqKSBuLENPVU5UKERJU1RJTkNUIHgudXpzYWt5bWFzKSBkIEZST00geyRwfXBzX3V6c2FreW11X2l2eWtpYWkgeCBMRUZUIEpPSU4geyRwfXdjX29yZGVycyB3IE9OIHcuaWQ9eC51enNha3ltYXMgV0hFUkUgdy5pZCBJUyBOVUxMIixBUlJBWV9BKTsKICAkb1snaXZ5a2lhaV90aXBhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRpcGFzLENPVU5UKCopIG4gRlJPTSB7JHB9cHNfdXpzYWt5bXVfaXZ5a2lhaSBHUk9VUCBCWSB0aXBhcyBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICRvWydjYXJ0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxDT1VOVCgqKSBuLE1JTihjcmVhdGVkX2F0KSBudW8sTUFYKGNyZWF0ZWRfYXQpIGlraSBGUk9NIHskcH1wc19jYXJ0cyBHUk9VUCBCWSBzdGF0dXMiLEFSUkFZX0EpOwogICRvWydwZXRzX3VzZXJzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdXNlcl9pZCxDT1VOVCgqKSBuIEZST00geyRwfXBzX3BldHMgR1JPVVAgQlkgdXNlcl9pZCBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOyAkb1sncmVmaWxsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdXNlcl9pZCxDT1VOVCgqKSBuLE1BWChsYXN0X29yZGVyX2lkKSBsbyBGUk9NIHskcH1wc19yZWZpbGxfdHJhY2tpbmcgR1JPVVAgQlkgdXNlcl9pZCIsQVJSQVlfQSk7CiAgJG9bJ3BldF9wcm9kdWN0c19sbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhc3Rfb3JkZXJfaWQsQ09VTlQoKikgbiBGUk9NIHskcH1wc19wZXRfcHJvZHVjdHMgR1JPVVAgQlkgbGFzdF9vcmRlcl9pZCIsQVJSQVlfQSk7CiAgJG9bJ2VtYWlsX2pvYnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LHN0YXR1cyxDT1VOVCgqKSBuIEZST00geyRwfXBzX2VtYWlsX2pvYnMgR1JPVVAgQlkgZmxvdyxzdGF0dXMgT1JERVIgQlkgbiBERVNDIExJTUlUIDEyIixBUlJBWV9BKTsgJG9bJ2V2ZW50X2xvZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGV2ZW50X25hbWUsc3RhdHVzLENPVU5UKCopIG4gRlJPTSB7JHB9cHNfZXZlbnRfbG9nIEdST1VQIEJZIGV2ZW50X25hbWUsc3RhdHVzIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgJG9bJ3Nhcmdhc19rbGFpZG9zJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLE1JTihsYWlrYXMpIG51byxNQVgobGFpa2FzKSBpa2kgRlJPTSB7JHB9cHNfc2FyZ2FzX2tsYWlkb3MiLEFSUkFZX0EpOwogICRvWyd3Y19sb29rdXBfbmFzbCddPWFycmF5KCdzdGF0cyc9PiR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHB9d2Nfb3JkZXJfc3RhdHMgcyBMRUZUIEpPSU4geyRwfXdjX29yZGVycyB3IE9OIHcuaWQ9cy5vcmRlcl9pZCBXSEVSRSB3LmlkIElTIE5VTEwiKSwnaXRlbXMnPT4kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIG9yZGVyX2lkIEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIGkgTEVGVCBKT0lOIHskcH13Y19vcmRlcnMgdyBPTiB3LmlkPWkub3JkZXJfaWQgV0hFUkUgdy5pZCBJUyBOVUxMIikpOwogICRvWydjdXN0b21lcl9sb29rdXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBjdXN0b21lcl9pZCx1c2VyX2lkLFNVQlNUUklORyhlbWFpbCwxLDMwKSBlbWFpbCBGUk9NIHskcH13Y19jdXN0b21lcl9sb29rdXAgT1JERVIgQlkgY3VzdG9tZXJfaWQiLEFSUkFZX0EpOwogICRvWyd2ZW5pcGFrX21hbmlmZXN0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldmVuaXBhayVtYW5pZmVzdCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrX2xhc3QlJyBMSU1JVCA4IixBUlJBWV9BKTsKICAkb1sndGVtcF9saWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy5iYXNlbmFtZSgkZS0+Z2V0RmlsZSgpKS4nOicuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-092154';
const GKEY='ps_e7r';
const PHASES=["R"];
const OUT='analize/s1620_e7r.json';
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
