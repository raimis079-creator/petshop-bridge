process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzUxZCBwYXJ0aWp1IG51cmFzeW1vIGtvZGFzICsgaW52YXJpYW50byBwYXRpa3JhIChwYXJ0aWp1IHN1bWEgdnMgQVYgbGlrdXRpcykgdmlzb21zIEFWIHByZWtlbXMgKyAjMTI2MC8jMTI2MSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NTFkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc1MWQnXTsKICAkc2xpY2U9ZnVuY3Rpb24oJGZpbGUsJGZyb20sJG4peyAkTD1leHBsb2RlKCJcbiIsZmlsZV9nZXRfY29udGVudHMoJGZpbGUpKTsgcmV0dXJuIGltcGxvZGUoIlxuIixhcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gbWJfc3Vic3RyKHJ0cmltKCR4KSwwLDIwMCk7IH0sYXJyYXlfc2xpY2UoJEwsJGZyb20tMSwkbikpKTsgfTsKICB0cnl7CiAgJHJbJ2tvZGFzX251cmFzeW1hcyddPSRzbGljZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBhcnRpam9zLnBocCcsNTk4LDYyKTsKICAkclsna29kYXNfYXZfbGF1a2FzJ109JHNsaWNlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcGFydGlqb3MucGhwJywyNjMsNDUpOwogICRyWydrb2Rhc19hdnN0b2NrJ109JHNsaWNlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtc3RvY2sucGhwJyw5Niw0MCk7CiAgLy8gaW52YXJpYW50YXM6IHZpc29zIHByZWtlcyBzdSBha3R5dmlvbWlzIHBhcnRpam9taXMKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkIHAsIFNVTShraWVraXNfbGlrbykgcywgQ09VTlQoKikgbiBGUk9NIHskUH1wc19wYXJ0aWpvcyBXSEVSRSBhdHNhdWt0YT0wIEdST1VQIEJZIHByb2R1Y3RfaWQiLEFSUkFZX0EpOwogICRuZXM9W107ICRvaz0wOwogIGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkcGlkPShpbnQpJHhbJ3AnXTsgJGF2PWNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9TdG9jaycpP1BldHNob3BfQVZfU3RvY2s6OnF0eSgkcGlkKTpudWxsOyBpZigkYXY9PT1udWxsKSAkYXY9KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsKICAgICRkPShpbnQpJHhbJ3MnXS0oaW50KSRhdjsgaWYoJGQ9PT0wKXsgJG9rKys7IGNvbnRpbnVlOyB9CiAgICAkbmVzW109WydwaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkcGlkKSwwLDQ1KSwncGFydGlqb3MnPT4oaW50KSR4WydzJ10sJ2F2Jz0+KGludCkkYXYsJ3NraXJ0Jz0+JGQsJ2RwX3Bha2FpJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0lZCIsJHBpZCkpXTsgfQogIHVzb3J0KCRuZXMsZnVuY3Rpb24oJGEsJGIpeyByZXR1cm4gYWJzKCRiWydza2lydCddKTw9PmFicygkYVsnc2tpcnQnXSk7IH0pOwogICRyWydpbnZfb2snXT0kb2s7ICRyWydpbnZfbmVzdXRhbXBhX24nXT1jb3VudCgkbmVzKTsgJHJbJ2ludl9uZXN1dGFtcGEnXT1hcnJheV9zbGljZSgkbmVzLDAsNDApOwogICRyWydpbnZfc3VtYV9wbGl1cyddPWFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gbWF4KDAsJHhbJ3NraXJ0J10pOyB9LCRuZXMpKTsgJHJbJ2ludl9zdW1hX21pbnVzJ109YXJyYXlfc3VtKGFycmF5X21hcChmdW5jdGlvbigkeCl7IHJldHVybiBtaW4oMCwkeFsnc2tpcnQnXSk7IH0sJG5lcykpOwogIC8vICMxMjYwICMxMjYxCiAgZm9yZWFjaCh3Y19nZXRfb3JkZXJzKFsnbGltaXQnPT40MCwndHlwZSc9PidzaG9wX29yZGVyJywnZGF0ZV9jcmVhdGVkJz0+c3RydG90aW1lKCcyMDI2LTEwLTAyIDE4OjAwIFVUQycpLicuLi4nLnN0cnRvdGltZSgnMjAyNi0xMC0wMiAyMDowMCBVVEMnKV0pIGFzICRvKXsgJG5yPSRvLT5nZXRfb3JkZXJfbnVtYmVyKCk7IGlmKCFpbl9hcnJheSgkbnIsWycxMjYwJywnMTI2MSddLHRydWUpKSBjb250aW51ZTsKICAgICRsbj1bXTsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KSAkbG5bXT1tYl9zdWJzdHIoJGl0LT5nZXRfbmFtZSgpLDAsNDApLicgw5cnLiRpdC0+Z2V0X3F1YW50aXR5KCkuJyBbJy4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJykuJy8nLiRpdC0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKS4nXSc7CiAgICAkc209Jyc7IGZvcmVhY2goJG8tPmdldF9zaGlwcGluZ19tZXRob2RzKCkgYXMgJHMpICRzbT0kcy0+Z2V0X25hbWUoKTsgJG50PVtdOyBmb3JlYWNoKGFycmF5X3JldmVyc2Uod2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kby0+Z2V0X2lkKCksJ2xpbWl0Jz0+OF0pKSBhcyAkbikgJG50W109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTUwKTsKICAgICRyWyd1Jy4kbnJdPVskby0+Z2V0X3N0YXR1cygpLCRzbSwkby0+Z2V0X21ldGEoJ19wc19vcmRlcl90eXBlJyksJG8tPmdldF9tZXRhKCdfcHNfbWF0eXRhJyksJGxuLCRudF07IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-084239';
const GKEY='ps_s1751d';
const PHASES=["1"];
const OUT='out/s1751_d.json';
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
