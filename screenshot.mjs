process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM4YyBoaWthcmkgZ2F2aW1hcyAzNjU2L1cvMjAyNiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2wzJ10pPyRfR0VUWydwc19sMyddOicnKSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjM4YycsJ2Zha3R1cmEnPT4nMzY1Ni9XLzIwMjYnLCdrdXJzYXMnPT40LjEyKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRQVD0kd3BkYi0+cHJlZml4Lidwc19wYXJ0aWpvcyc7CiAgICAvLyBwaWQsIGVhbiwgcSwgcGxuL3ZudCwgcGF2YWRpbmltYXMgcGF0aWtyYWkKICAgICRlaWw9YXJyYXkoCiAgICAgIGFycmF5KDE4MjM2LCcwNDIwNTUwMTEyMDQnLDUsJzcuOTAnLCdHb2xkZmlzaCBTdGFwbGUgYmFieSAxMDAnKSwKICAgICAgYXJyYXkoMTgyNjksJzA0MjA1NTAzMTExMCcsNSwnNS40MycsJ0NpY2hsaWQgU3RhcGxlIEJhYnknKSwKICAgICAgYXJyYXkoMTgyNzIsJzA0MjA1NTA0NjMzNicsNSwnMjEuMTUnLCdHb2xkIFNpbmtpbmcgTWluaScpLAogICAgICBhcnJheSgxODI3OCwnMDQyMDU1MDQ3MzMzJyw1LCcyMS4xNScsJ0dvbGQgU2lua2luZyBNZWRpdW0nKSwKICAgICAgYXJyYXkoMTgyMDMsJzA0MjA1NTIxMzE2NScsNiwnMTMuODQnLCdBbGdhZSBXYWZlcnMnKSwKICAgICAgYXJyYXkoMTgyMTgsJzA0MjA1NTAxNDgyMycsMSwnMTI3LjgzJywnU3RhcGxlIExhcmdlLCA1IGtnJyksCiAgICApOwogICAgJHN1bV9xPTA7JHN1bV9wbG49MDsKICAgIGZvcmVhY2goJGVpbCBhcyAkZSl7CiAgICAgIGxpc3QoJHBpZCwkZWFuLCRxLCRwbG4sJHpvZGlzKT0kZTsKICAgICAgJHI9YXJyYXkoJ2lkJz0+JHBpZCwncSc9PiRxLCdwbG4nPT4kcGxuKTsKICAgICAgJHQ9Z2V0X3RoZV90aXRsZSgkcGlkKTsKICAgICAgaWYoc3RycG9zKCR0LCR6b2Rpcyk9PT1mYWxzZSl7ICRyWydTVE9QJ109J3BhdmFkaW5pbWFzIG5lc3V0YW1wYTogJy4kdDsgJG9bJ2VpbCddW109JHI7IGNvbnRpbnVlOyB9CiAgICAgICRzYW5kPWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKTsKICAgICAgaWYoJHNhbmQhPT0nYXYnfHxnZXRfcG9zdF9tZXRhKCRwaWQsJ192Zl9xdHknLHRydWUpIT09Jyd8fGdldF9wb3N0X21ldGEoJHBpZCwnX3piX3F0eScsdHJ1ZSkhPT0nJyl7CiAgICAgICAgJHJbJ1NUT1AnXT0nbmUgZ3J5bmFzIGF2OiBzYW5kPScuJHNhbmQ7ICRvWydlaWwnXVtdPSRyOyBjb250aW51ZTsgfQogICAgICAkamF1PShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQVCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBwYXN0YWJhIExJS0UgJXMiLCRwaWQsJyUzNjU2L1cvMjAyNiUnKSk7CiAgICAgIGlmKCRqYXUpeyAkclsnamF1X3lyYSddPSRqYXU7ICRvWydlaWwnXVtdPSRyOyBjb250aW51ZTsgfQogICAgICAkclsnc3RvY2tfcHJpZXMnXT0oaW50KWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKTsKICAgICAgLy8gRUFOIGplaSB0dXNjaWFzCiAgICAgIGlmKGdldF9wb3N0X21ldGEoJHBpZCwnX2VhbicsdHJ1ZSk9PT0nJyl7IHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX2VhbicsJGVhbik7ICRyWydlYW5faXJhc3l0YXMnXT0kZWFuOyB9CiAgICAgIGlmKGdldF9wb3N0X21ldGEoJHBpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpPT09JycpeyB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19nbG9iYWxfdW5pcXVlX2lkJywkZWFuKTsgfQogICAgICAkcmVzPVBldHNob3BfUGFydGlqb3M6OnByaWltdGkoJHBpZCxhcnJheSgna2lla2lzJz0+JHEsJ3NhdmlrYWluYSc9PiRwbG4sJ3ZhbGl1dGEnPT4nUExOJywna3Vyc2FzJz0+NC4xMiwKICAgICAgICAndGlla2VqYXMnPT4nSGlrYXJpJywncGFzdGFiYSc9PidGYWt0dXJhIFZBVCAzNjU2L1cvMjAyNiAoUzE2MzgpJykpOwogICAgICBpZihpc193cF9lcnJvcigkcmVzKSl7ICRyWydLTEFJREEnXT0kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyAkb1snZWlsJ11bXT0kcjsgY29udGludWU7IH0KICAgICAgJHJbJ3BhcnRpamEnXT0kcmVzOwogICAgICAvLyBrcnl6bWluZTogZWlsdXRlIC0+IERCCiAgICAgICRyWydzdG9ja19wbyddPShpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgICAkcD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLGtpZWtpc19nYXV0YXMsa2lla2lzX2xpa28sc2F2aWthaW5hX2V1cixzYXZpa2FpbmFfb3JpZyx2YWxpdXRhLGt1cnNhcyBGUk9NICRQVCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBwYXN0YWJhIExJS0UgJXMiLCRwaWQsJyUzNjU2L1cvMjAyNiUnKSxBUlJBWV9BKTsKICAgICAgJHJbJ2RiX3BhcnRpamEnXT0kcDsKICAgICAgJHJbJ09LJ109KCRyWydzdG9ja19wbyddPT09JHJbJ3N0b2NrX3ByaWVzJ10rJHEgJiYgJHAgJiYgKGludCkkcFsna2lla2lzX2dhdXRhcyddPT09JHEKICAgICAgICAmJiBhYnMoKGZsb2F0KSRwWydzYXZpa2FpbmFfb3JpZyddLShmbG9hdCkkcGxuKTwwLjAwMQogICAgICAgICYmIGFicygoZmxvYXQpJHBbJ3NhdmlrYWluYV9ldXInXS1yb3VuZCgkcGxuLzQuMTIsNCkpPDAuMDAwMSk/MTonRkFJTCc7CiAgICAgICRzdW1fcSs9JHE7ICRzdW1fcGxuKz0kcSooZmxvYXQpJHBsbjsKICAgICAgJG9bJ2VpbCddW109JHI7CiAgICB9CiAgICAvLyBEQiAtPiBzYWx0aW5pcwogICAgJGRiPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsa2lla2lzX2dhdXRhcyxzYXZpa2FpbmFfb3JpZyBGUk9NICRQVCBXSEVSRSBwYXN0YWJhIExJS0UgJyUzNjU2L1cvMjAyNiUnIixBUlJBWV9BKTsKICAgICRvWydkYl9wYXJ0aWp1J109Y291bnQoJGRiKTsKICAgICRvWydkYl9zdW1fcSddPWFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAoaW50KSR4WydraWVraXNfZ2F1dGFzJ107fSwkZGIpKTsKICAgICRvWydkYl9zdW1fcGxuJ109cm91bmQoYXJyYXlfc3VtKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4WydraWVraXNfZ2F1dGFzJ10qJHhbJ3NhdmlrYWluYV9vcmlnJ107fSwkZGIpKSwyKTsKICAgICRvWydsYXVrdGEnXT1hcnJheSgnZWlsJz0+NiwncSc9PjI3LCdwbG4nPT40ODkuMDIpOwogICAgJG9bJ3N1bV9hcHBseSddPWFycmF5KCdxJz0+JHN1bV9xLCdwbG4nPT5yb3VuZCgkc3VtX3BsbiwyKSk7CiAgICAkb1snS1JZWk1JTkUnXT0oJG9bJ2RiX3BhcnRpanUnXT09PTYgJiYgJG9bJ2RiX3N1bV9xJ109PT0yNyAmJiBhYnMoJG9bJ2RiX3N1bV9wbG4nXS00ODkuMDIpPDAuMDEpPydPSyc6J0ZBSUwnOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-211602';
const GKEY='ps_l3';
const PHASES=["GO"];
const OUT='analize/s1638_c.json';
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
