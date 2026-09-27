process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI4bWcgcmVhZC1vbmx5OiBhciBidXZvIG51b3RyYXVrb3MgKGF0dGFjaG1lbnRhaSwgaXN0b3JpamEpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyOG1nJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyOG1nJ107IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgdHJ5ewogICAgJGlkcz1bMTkwODksMTkwOTIsMzQ5MDcsMzQ5MDgsMzUwNzQsMzQ5OTcsMzQ5OTksMzQ5MTNdOwogICAgJHVwPXdwX2dldF91cGxvYWRfZGlyKCk7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgICAgJG89WydwYXYnPT5odG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkaWQpKSwnc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19za3UnLHRydWUpLCdjcmVhdGVkJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfZGF0ZScsJGlkKV07CiAgICAgICRvWydhdHRfcGFyZW50J109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X3N0YXR1cyxwb3N0X2RhdGUsZ3VpZCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X3BhcmVudD0lZCIsJGlkKSxBUlJBWV9BKTsKICAgICAgJG9bJ21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSwgTEVGVChtZXRhX3ZhbHVlLDE1MCkgdiBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVpbWFnZSUlJyBPUiBtZXRhX2tleSBMSUtFICclJXRodW1iJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlZm90byUlJyBPUiBtZXRhX2tleSBMSUtFICclJWltZyUlJyBPUiBtZXRhX2tleSBMSUtFICclJWxlZ2FjeSUlJyBPUiBtZXRhX2tleSBMSUtFICclJWVzaG9wJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlaW1wb3J0JSUnKSIsJGlkKSxBUlJBWV9BKTsKICAgICAgJG9bJ3Jldml6aWpvcyddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3BhcmVudD0lZCBBTkQgcG9zdF90eXBlPSdyZXZpc2lvbiciLCRpZCkpOwogICAgICAvLyBhciBrYXMgbm9ycyBzZWthIG1ldGEgcG9recSNaXVzIChwcyDFvnVybmFsYWkpCiAgICAgICRyWydwJ11bJGlkXT0kbzsKICAgIH0KICAgIC8vIGF0dGFjaG1lbnRhaSBwYWdhbCBwYXZhZGluaW3EhQogICAgZm9yZWFjaChbJ3RyaXUnLCdzdGlybicsJ2tha3R1cycsJ1NlaWRlbCcsJ0ZyZXhpbiddIGFzICRxKXsgJHJbJ3BhZ2FsX3ZhcmRhJ11bJHFdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9wYXJlbnQscG9zdF9kYXRlIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0nYXR0YWNobWVudCcgQU5EIChwb3N0X3RpdGxlIExJS0UgJXMgT1IgZ3VpZCBMSUtFICVzKSBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDEyIiwnJScuJHEuJyUnLCclJy4kcS4nJScpLEFSUkFZX0EpOyB9CiAgICAvLyBhciB5cmEgxb51cm5hbMWzIGxlbnRlbMSXcy9vcGNpasWzIGFwaWUgbnVvdHJhdWvFsyDFoWFsaW5pbcSFCiAgICAkclsnb3BjaWpvcyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclZm90byUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVudW90cmF1ayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV0aHVtYiViYWslJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19zMTclZm90byUnIExJTUlUIDQwIik7CiAgICAvLyBULTAgaW1wb3J0YXM6IGVTaG9wcmVudCBpc3RvcmlqYSDigJQgYXIgeXJhIHBhdmVpa3NsbyBVUkwgbGVudGVsxJdzZQogICAgJHRhYnM9JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc18lJyIpOyAkclsncHNfbGVudGVsZXMnXT0kdGFiczsKICAgIC8vIFdQIHNlbmFzIOKAnnRpay3FoWl0YXMtcHNsIiAxOTA4OSBidXZvIHN1IG51b3RyYXVrYT8g4oCUIFJhbmsgTWF0aCAvIG9nIGNhY2hlCiAgICAkclsncm1fb2cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X2lkLG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSwxNTApIHYgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZCBJTiAoMTkwODksMTkwOTIsMzQ5MDcpIEFORCBtZXRhX2tleSBMSUtFICdyYW5rX21hdGglaW1hZ2UlJyIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-214102';
const GKEY='ps_s1728mg';
const PHASES=["1"];
const OUT='analize/s1728_mg.json';
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
