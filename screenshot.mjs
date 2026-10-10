process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzYyYiBBZHMgYW5hbGl6ZTogemFsaSBkdW9tZW55cyAocmVrbGFtYSwgdXpzYWt5bWFpLCBlaWx1dGVzLCBzaXVudG9zKSBKU09OIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc2MmInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzYyYiddOwogIHRyeXsKICAkclsnYWRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEgZCxrYW1wYW5pamFfaWQgaWQsa2FtcGFuaWphIGsscGFyb2R5bWFpIHBhcixwYXNwYXVkaW1haSBwYXNwLGlzbGFpZG9zX2N0IGN0LGtvbnZlcnNpam9zIGtvbnYsa29udl92ZXJ0ZV9jdCBrdixzZW5vamlfc3ZldGFpbmUgc2VuIEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBPUkRFUiBCWSBkaWVuYSIsQVJSQVlfQSk7CiAgJHJbJ2tpdG9zX3Jla2wnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrYW5hbGFzLFJPVU5EKFNVTShpc2xhaWRvc19jdCkvMTAwLDIpIGV1cixTVU0ocGFzcGF1ZGltYWkpIHBhc3AgRlJPTSB7JFB9cHNfZmFrdF9yZWtsYW1hIFdIRVJFIGthbmFsYXM8Pidnb29nbGVfYWRzJyBBTkQgZGllbmE+PScyMDI2LTA5LTA4JyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1LnV6c2FreW1hc19pZCBpZCx1LnN1a3VydGFfYXQgcyx1LnN0YXR1c2FzX2dhbHV0aW5pcyBzdCx1LmtsaWVudGFzX2lkIGtpZCxMRUZUKHUua2xpZW50YXNfZW1haWxfaGFzaCwxMikgaCx1LmtsaWVudGFzX25hdWphcyBuYXVqLHUua2xpZW50YXNfdXpzYWt5bW9fbnIgbnIsdS5kaWVub3NfbnVvX2Fua3N0ZXNuaW8gZG5hLHUucHJla2l1X3N1bWFfY3QgcHIsdS5udW9sYWlkdV9jdCBudW9sLHUua3Vwb251X2tvZGFpIGt1cCx1LnByaXN0YXR5bWFzX3BhaW10YV9jdCBwcCx1LnZpc29fY3Qgdmlzbyx1LnB2bV9jdCBwdm0sdS5zYXZpa2FpbmFfY3Qgc2F2LHUubWFyemFfY3QgbWFyLHUua29udHJpYnVjaWphX2N0IGtvbix1Lm1pc3J1cyBtaXMsdS5zYW5kZWxpYWkgc2FuZCx1LnZlemVqYWkgdmV6LHUua2FuYWxhc19waXJtYXMgazEsdS5rYW5hbGFzX3Bhc2t1dGluaXMgazIsdS51dG1fc291cmNlIHVzLHUudXRtX21lZGl1bSB1bSx1LnV0bV9jYW1wYWlnbiB1Yyx1LmdjbGlkIGcsdS5yZWZlcmVyX2RvbWVuYXMgcmVmLHUubGFuZGluZ191cmwgbHUsdS5pcmVuZ2lueXMgZGV2LHUuZWlsdWNpdV9zayBlaWwsdS5pc19yZWZpbGwgcmYsCiAgICAoU0VMRUNUIENPQUxFU0NFKFNVTSh4LmthaW5hX3ZlemVqb19jdCksMCkgRlJPTSB7JFB9cHNfZmFrdF9zaXVudG9zIHggV0hFUkUgeC51enNha3ltYXNfaWQ9dS51enNha3ltYXNfaWQgQU5EIENPQUxFU0NFKHguc3RhdHVzYXMsJycpPD4nYXRzYXVrdGEnKSBzaywKICAgIChTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfZmFrdF9zaXVudG9zIHggV0hFUkUgeC51enNha3ltYXNfaWQ9dS51enNha3ltYXNfaWQgQU5EIENPQUxFU0NFKHguc3RhdHVzYXMsJycpPD4nYXRzYXVrdGEnKSBzbiwKICAgIChTRUxFQ1QgREFURSh1c2VyX3JlZ2lzdGVyZWQpIEZST00geyR3cGRiLT51c2Vyc30gdyBXSEVSRSB3LklEPXUua2xpZW50YXNfaWQpIHVyZWcKICAgIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgV0hFUkUgdS50ZXN0aW5pcz0wIE9SREVSIEJZIHUuc3VrdXJ0YV9hdCIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkcm93cyBhcyAmJHgpeyAkbHU9KHN0cmluZykkeFsnbHUnXTsgJHE9W107ICRwdT1wYXJzZV91cmwoJGx1KTsgaWYoIWVtcHR5KCRwdVsncXVlcnknXSkpIHBhcnNlX3N0cigkcHVbJ3F1ZXJ5J10sJHEpOyAkeFsnbHAnXT0kcHVbJ3BhdGgnXT8/Jyc7ICR4WydnYWQnXT0kcVsnZ2FkX2NhbXBhaWduaWQnXT8/Jyc7ICR4WydsdV91YyddPSRxWyd1dG1fY2FtcGFpZ24nXT8/Jyc7ICR4WydsdV9nJ109aXNzZXQoJHFbJ2djbGlkJ10pfHxpc3NldCgkcVsnZ2JyYWlkJ10pfHxpc3NldCgkcVsnd2JyYWlkJ10pPzE6MDsgdW5zZXQoJHhbJ2x1J10pOyB9CiAgJHJbJ3V6cyddPSRyb3dzOwogICRyWydlaWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1enNha3ltYXNfaWQgaWQscHJla2VfaWQgcGlkLExFRlQocGF2YWRpbmltYXNfdHVvX21ldHUsNTApIHBhdixTVUJTVFJJTkdfSU5ERVgoa2F0ZWdvcmlqdV9rZWxpYXMsJz4nLDIpIGthdCxicmVuZGFzX3NsdWcgYnIsZ3l2dW5hcyBneXYsa2lla2lzIHEsa2FpbmFfY3QgayxzYXZpa2FpbmFfY3Qgc3YsbnVvbGFpZGFfY3QgbnUscmlua2luaW9fdGlwYXMgcnQgRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHRlc3RpbmlzPTAiLEFSUkFZX0EpOwogICRyWyd1cmVnX2hpc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKHVzZXJfcmVnaXN0ZXJlZCkgZCxDT1VOVCgqKSBuIEZST00geyR3cGRiLT51c2Vyc30gR1JPVVAgQlkgMSBIQVZJTkcgbj49NDAgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ3VzZXJzX2lraV8wOTA4J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT51c2Vyc30gV0hFUkUgdXNlcl9yZWdpc3RlcmVkPCcyMDI2LTA5LTA4JyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-073725';
const GKEY='ps_s1762b';
const PHASES=["1"];
const OUT='out/s1762_b.json';
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
