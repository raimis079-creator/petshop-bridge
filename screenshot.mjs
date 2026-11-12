process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODYzYyBwYXRpa3JhIHBhZ2FsIGVtYWlsL3RlbCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjNjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMDApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg2M2MnXTsKICB0cnl7CiAgICAkVT0ieyRQfXBzX3ZfYW5hbGl6ZV91enNha3ltYWkiOwogICAgJHJbJ2hhc2hfdHVzY2lhc18yMDI2J109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRVIFdIRVJFIHN1a3VydGFfYXQ+PScyMDI2LTAxLTAxJyBBTkQgKGtsaWVudGFzX2VtYWlsX2hhc2g9JycgT1Iga2xpZW50YXNfZW1haWxfaGFzaCBJUyBOVUxMKSIpOwogICAgJHJbJ3N0YXR1c2FpXzIwMjYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXNhc19nYWx1dGluaXMgcywgQ09VTlQoKikgbiBGUk9NICRVIFdIRVJFIHN1a3VydGFfYXQ+PScyMDI2LTAxLTAxJyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAgIC8vIHNlbm9qaSBwbGF0Zm9ybWE6IHRpZXNpYWkgaXMgcHNfaXN0X3V6c2FreW1haQogICAgJG9sZD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBMT1dFUihUUklNKGVtYWlsKSkgZSwgUkVHRVhQX1JFUExBQ0UodGVsLCdbXjAtOV0nLCcnKSB0LCBkYXRhIGQgRlJPTSB7JFB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBkYXRhPj0nMjAyNi0wMS0wMSciLEFSUkFZX0EpOwogICAgJHJbJ2lzdF8yMDI2X2VpbCddPWNvdW50KCRvbGQpOyAkclsnaXN0X3N0YXR1c2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzYXMsIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBkYXRhPj0nMjAyNi0wMS0wMScgR1JPVVAgQlkgMSBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICAgLy8gbmF1amEgc3ZldGFpbmUKICAgICRuZXc9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTE9XRVIoVFJJTShiaWxsaW5nX2VtYWlsKSkgZSwgJycgdCwgZGF0ZV9jcmVhdGVkX2dtdCBkLCBzdGF0dXMgcyBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIGRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTAxLTAxJyBBTkQgc3RhdHVzIE5PVCBJTiAoJ3djLWNhbmNlbGxlZCcsJ3djLWZhaWxlZCcsJ3djLXJlZnVuZGVkJywndHJhc2gnLCd3Yy1jaGVja291dC1kcmFmdCcpIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJG5ldyBhcyAmJG4peyAkblsndCddPXByZWdfcmVwbGFjZSgnL1xELycsJycsKHN0cmluZykkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBob25lIEZST00geyRQfXdjX29yZGVyX2FkZHJlc3NlcyBXSEVSRSBvcmRlcl9pZD0oU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBMT1dFUihUUklNKGJpbGxpbmdfZW1haWwpKT0lcyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD0lcyBMSU1JVCAxKSBBTkQgYWRkcmVzc190eXBlPSdiaWxsaW5nJyIsJG5bJ2UnXSwkblsnZCddKSkpOyB9IHVuc2V0KCRuKTsKICAgICRyWyd3Y18yMDI2X2VpbCddPWNvdW50KCRuZXcpOwogICAgJEU9W107JFQ9W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoJG9sZCwkbmV3KSBhcyAkeCl7IGlmKCR4WydlJ10pICRFWyR4WydlJ11dPSgkRVskeFsnZSddXT8/MCkrMTsgJHQ9c3Vic3RyKCR4Wyd0J10sLTgpOyBpZihzdHJsZW4oJHQpPj04KSAkVFskdF09KCRUWyR0XT8/MCkrMTsgfQogICAgYXJzb3J0KCRFKTsgYXJzb3J0KCRUKTsKICAgICRjbnQ9ZnVuY3Rpb24oJEEpeyAkbz1bXTsgZm9yZWFjaChbNSw4LDEwLDEyLDE1LDIwXSBhcyAkbSkgJG9bJG1dPWNvdW50KGFycmF5X2ZpbHRlcigkQSxmdW5jdGlvbigkdil1c2UoJG0pe3JldHVybiAkdj49JG07fSkpOyByZXR1cm4gJG87IH07CiAgICAkclsncGFnYWxfZW1haWwnXT1bJ2tsaWVudHUnPT5jb3VudCgkRSksJ251byc9PiRjbnQoJEUpLCd0b3AxNSc9PmFycmF5X21hcChmdW5jdGlvbigkZSwkbil7IHJldHVybiBbc3Vic3RyKCRlLDAsMykuJyoqKkAnLnN1YnN0cihzdHJyY2hyKCRlLCdAJyksMSksJG5dOyB9LGFycmF5X3NsaWNlKGFycmF5X2tleXMoJEUpLDAsMTUpLGFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcygkRSksMCwxNSkpXTsKICAgICRyWydwYWdhbF90ZWwnXT1bJ2tsaWVudHUnPT5jb3VudCgkVCksJ251byc9PiRjbnQoJFQpLCd0b3AxNSc9PmFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcygkVCksMCwxNSldOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-203255';
const GKEY='ps_s1863c';
const PHASES=["1"];
const OUT='analize/s1863_c.json';
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
