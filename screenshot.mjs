process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTUgcnVuIGU5ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBrcmVkaXRpbsSXcyDFoWFibG9uYXMg4oCUIFdDRE4gcGx1Z2luYXMgKMSvZGllZ3Rhcy9ha3R5dnVzPyksIGNyZWRpdE5vdGUgxaFhYmxvbmFzLCBLUi1BVlBOIG51bWVyYWNpamEsIHRlbWEgZnVuY3Rpb25zLnBocCBgY3JlZGl0fGtyZWRpdGAsIHNlbm8gZGVzayBgd2Nkbl9wcmludF9jcmVkaXRub3RlYCwgd2NkbiBvcGNpam9zL8WhYWJsb27FsyBmYWlsYWkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U5ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE1IGU5cicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogICRjdHg9ZnVuY3Rpb24oJGMsJHBhdCwkbGVuPTEyMDAsJGJhY2s9MjAwKXsgJHI9YXJyYXkoKTsgJG9mZj0wOyAkbj0wOyB3aGlsZSgoJGk9c3RyaXBvcygkYywkcGF0LCRvZmYpKSE9PWZhbHNlICYmICRuPDQpeyAkcltdPXN1YnN0cigkYyxtYXgoMCwkaS0kYmFjayksJGxlbik7ICRvZmY9JGkrMTsgJG4rKzsgfSByZXR1cm4gJHI7IH07CiAgdHJ5ewogICRvWyd3Y2RuX2RpcnMnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKFdQX1BMVUdJTl9ESVIuJy8qd2NkbionKStnbG9iKFdQX1BMVUdJTl9ESVIuJy8qcHJpbnQqJykrZ2xvYihXUF9QTFVHSU5fRElSLicvKmludm9pY2UqJykpOwogICRvWydhY3RpdmUnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKChhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpLGZ1bmN0aW9uKCR4KXsgcmV0dXJuIHByZWdfbWF0Y2goJy93Y2RufHByaW50fGludm9pY2V8cGRmfGRlbGl2ZXJ5L2knLCR4KTsgfSkpOwogICRvWyd3Y2RuX29wdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgTEVGVChvcHRpb25fdmFsdWUsMzAwKSB2IEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnd2NkbiUnIE9SREVSIEJZIG9wdGlvbl9uYW1lIExJTUlUIDQwIixBUlJBWV9BKTsKICAkdGg9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7ICRjPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJHRoLicvZnVuY3Rpb25zLnBocCcpOwogICRvWyd0aGVtZV9jcmVkaXQnXT0kY3R4KCRjLCdjcmVkaXQnLDE0MDAsMzAwKTsgJG9bJ3RoZW1lX2tyZWRpdCddPSRjdHgoJGMsJ2tyZWRpdCcsOTAwLDIwMCk7ICRvWyd0aGVtZV9LUiddPSRjdHgoJGMsIidLUiIsNjAwLDIwMCk7CiAgJG9bJ3RoZW1lX2ZpbGVzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRmKSB1c2UoJHRoKXsgcmV0dXJuIHN0cl9yZXBsYWNlKCR0aC4nLycsJycsJGYpOyB9LGFycmF5X21lcmdlKGdsb2IoJHRoLicvKicpLGdsb2IoJHRoLicvKi8qJyksZ2xvYigkdGguJy8qLyovKicpKSk7CiAgJG9bJ3RoZW1lX2dyZXAnXT1hcnJheSgpOyBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoJHRoLicvKi5waHAnKSxnbG9iKCR0aC4nLyovKi5waHAnKSxnbG9iKCR0aC4nLyovKi8qLnBocCcpLGdsb2IoJHRoLicvKi8qLmh0bWwnKSxnbG9iKCR0aC4nLyovKi8qLmh0bWwnKSkgYXMgJGYpeyAkY2M9KHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihzdHJpcG9zKCRjYywnY3JlZGl0bm90ZScpIT09ZmFsc2V8fHN0cmlwb3MoJGNjLCdrcmVkaXRpbicpIT09ZmFsc2V8fHN0cmlwb3MoJGNjLCdLUi1BVlBOJykhPT1mYWxzZSl7ICRvWyd0aGVtZV9ncmVwJ11bc3RyX3JlcGxhY2UoJHRoLicvJywnJywkZildPWFycmF5KHByZWdfbWF0Y2hfYWxsKCcvY3JlZGl0bm90ZS9pJywkY2MpLHByZWdfbWF0Y2hfYWxsKCcva3JlZGl0aW4vaXUnLCRjYykscHJlZ19tYXRjaF9hbGwoJy9LUi1BVlBOLycsJGNjKSk7IH0gfQogICRkPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXNrLnBocCcpOyAkb1snZGVza19jcmVkaXRub3RlJ109JGN0eCgkZCwnY3JlZGl0bm90ZScsOTAwLDMwMCk7CiAgJG9bJ3VwbG9hZHNfd2NkbiddPWFycmF5KCdpbnZvaWNlJz0+Y291bnQoZ2xvYih3cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3djZG4vaW52b2ljZS8qJykpLCdraXRpJz0+YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYih3cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3djZG4vKicpKSk7CiAgJG9bJ2tyX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSwgQ09VTlQoKikgbiBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICclY3JlZGl0JScgT1IgbWV0YV9rZXkgTElLRSAnJWtyZWRpdCUnIEdST1VQIEJZIG1ldGFfa2V5IixBUlJBWV9BKTsKICAkb1snc25pcF9jcmVkaXQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbGVuIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIChjb2RlIExJS0UgJyVjcmVkaXRub3RlJScgT1IgY29kZSBMSUtFICcla3JlZGl0aW4lJyBPUiBjb2RlIExJS0UgJyVLUi1BVlBOJScpIEFORCBuYW1lIE5PVCBMSUtFICdURU1QJScgT1JERVIgQlkgYWN0aXZlIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICRvWydwZGZfbGliJ109YXJyYXkoJ2RvbXBkZic9PmNsYXNzX2V4aXN0cygnRG9tcGRmXFxEb21wZGYnKSwnbXBkZic9PmNsYXNzX2V4aXN0cygnTXBkZlxcTXBkZicpLCd0Y3BkZic9PmNsYXNzX2V4aXN0cygnVENQREYnKSwnZ2VuX2N0eCc9PiRjdHgoJGMsJ2Z1bmN0aW9uIHBldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYnLDMyMDAsMCkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-190642';
const GKEY='ps_e9r';
const PHASES=["R"];
const OUT='analize/s1615_e9r.json';
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
