process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcwNWInXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRyPVtdOwogICRxPWZ1bmN0aW9uKCRrLCRzcWwpIHVzZSgmJHIsJHdwZGIpeyAkclska109JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7IGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclskay4nX2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOyB9OwogICRxKCdzdF9uZXcnLCJTRUxFQ1Qgc3RhdHVzYXNfZ2FsdXRpbmlzIHMsIENPVU5UKCopIG4sIFNVTShhcG1va2V0YV9hdCBJUyBOT1QgTlVMTCkgcGFpZCwgTUlOKGRpZW5hKSBtbiwgTUFYKGRpZW5hKSBteCBGUk9NIHskcH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSB0ZXN0aW5pcz0wIEFORCBzYWx0aW5pc19hcGxpbmthPSdwcm9kJyBHUk9VUCBCWSAxIik7CiAgJHEoJ3N0X25ld19hbGwnLCJTRUxFQ1Qgc2FsdGluaXNfYXBsaW5rYSwgdGVzdGluaXMsIENPVU5UKCopIG4sIE1JTihkaWVuYSkgbW4gRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgR1JPVVAgQlkgMSwyIik7CiAgJHEoJ3N0X2lzdCcsIlNFTEVDVCBzdGF0dXNhc19nYWx1dGluaXMgcywgQ09VTlQoKikgbiwgU1VNKGFwbW9rZXRhX2F0IElTIE5PVCBOVUxMKSBwYWlkLCBNSU4oZGllbmEpIG1uLCBNQVgoZGllbmEpIG14IEZST00geyRwfXBzX2lzdF9mYWt0X3V6c2FreW1haSBHUk9VUCBCWSAxIik7CiAgJHEoJ2lzdF9jaCcsIlNFTEVDVCBrYW5hbGFzX3Bhc2t1dGluaXMsIENPVU5UKCopIG4gRlJPTSB7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIEdST1VQIEJZIDEiKTsKICBmb3JlYWNoKFsncHNfZmFrdF9nc2NfZGllbm9zJywncHNfZmFrdF9nc2NfdXJsX2QnLCdwc193ZWJfZGllbm9zJywncHNfZW1haWxfam9icycsJ3BzX3Nlb180MDQnLCdwc19jYXJ0cycsJ3BzX2lzdF9mYWt0X2VpbHV0ZXMnXSBhcyAkdCl7CiAgICAkYz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIHskcH0kdCIsQVJSQVlfQSk7ICRyWydjb2xzJ11bJHRdPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4WydGaWVsZCddLic6Jy4keFsnVHlwZSddO30sKGFycmF5KSRjKTsKICAgICRyWydjbnQnXVskdF09JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH0kdCIpOyB9CiAgJHEoJ3dpX3RpcGFzJywiU0VMRUNUIHRpcGFzLCBDT1VOVCgqKSBuLCBNSU4oZGllbmEpIG1uIEZST00geyRwfXBzX3dlYl9pdnlraWFpIFdIRVJFIHRlc3RpbmlzPTAgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MiKTsKICAkcSgnd2lfa2FuYWxhcycsIlNFTEVDVCBrYW5hbGFzLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX3dlYl9pdnlraWFpIFdIRVJFIHRlc3RpbmlzPTAgQU5EIHRpcGFzPSdwYWdldmlldycgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MiKTsKICAkcSgnd2lfc2FsaXMnLCJTRUxFQ1Qgc2FsaXMsIENPVU5UKCopIG4gRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgdGlwYXM9J3BhZ2V2aWV3JyBHUk9VUCBCWSAxIE9SREVSIEJZIDIgREVTQyBMSU1JVCAxMiIpOwogICRxKCdnc2NfcycsIlNFTEVDVCAqIEZST00geyRwfXBzX2Zha3RfZ3NjX2RpZW5vcyBPUkRFUiBCWSAxIERFU0MgTElNSVQgMyIpOwogICRxKCd3ZF9zJywiU0VMRUNUICogRlJPTSB7JHB9cHNfd2ViX2RpZW5vcyBPUkRFUiBCWSAxIERFU0MgTElNSVQgMyIpOwogICRxKCdmcl9rJywiU0VMRUNUIGthbmFsYXMsIGthbXBhbmlqYSwgTUlOKGRpZW5hKSBtbiwgTUFYKGRpZW5hKSBteCwgQ09VTlQoKikgbiBGUk9NIHskcH1wc19mYWt0X3Jla2xhbWEgR1JPVVAgQlkgMSwyIik7CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-082659';
const GKEY='ps_s1705b';
const PHASES=["1"];
const OUT='analize/s1705_b.json';
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
