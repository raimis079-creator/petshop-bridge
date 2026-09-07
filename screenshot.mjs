process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIG0g4oCUIEQ6IG11LXBsdWdpbnMvcGV0c2hvcC1rYXRhbG9nYXMucGhwIHY4LjcuMeKGknY4LjcuMiAodmlyc3VzKCkgcGVyc2thaWNpYXZpbWFzIHNjcm9sbCdpbmFudCwgckFGOyBzYXJnYWk6IG1kNSwgY291bnQ9PTEsIHRva2VuX2dldF9hbGwsIGtvcGlqYSwgcGluZy1yb2xsYmFjaykuIEdyYXppbmEgbmF1am8gZmFpbG8gYjY0IHJlcG8gc2luY2hyb25pemFjaWphaS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzZtJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MzYgbScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogICRwaW5nPWZ1bmN0aW9uKCl7ICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi1hamF4LnBocD9hY3Rpb249aGVhcnRiZWF0JyksYXJyYXkoJ3RpbWVvdXQnPT45MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7IHJldHVybiBhcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwnZmF0YWwnPT4oaW50KShzdHJpcG9zKCRiLCdGYXRhbCBlcnJvcicpIT09ZmFsc2UpKTsgfTsKICAkZnA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGJrPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcy9wZXRzaG9wLWthdGFsb2dhcy12ODcxLUJBQ0tVUC0yMDI2LTA5LTA3LnBocCc7CiAgdHJ5ewogICRsaXZlPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGZwKTsgJG9bJ21kNV9wcmllcyddPW1kNSgkbGl2ZSk7ICRvWydkeWRpc19wcmllcyddPXN0cmxlbigkbGl2ZSk7CiAgJG9sZD0iXHRcdFx0dmlyc3VzKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB2aXJzdXMpO1xuXHRcdFx0c2V0VGltZW91dCh2aXJzdXMsIDQwMCk7IHNldFRpbWVvdXQodmlyc3VzLCAxMjAwKTsiOwogICRuZXc9Ilx0XHRcdHZpcnN1cygpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdmlyc3VzKTtcblx0XHRcdC8qIHY4LjcuMiAoUzE2MzYpOiBicmVhZGNydW1iIG51c2xlbmthIC0+IGp1b3N0b3MgYXBhY2lhIGt5bGEsIG8gdGhlYWQgbGlrZGF2b1xuXHRcdFx0ICAgdGllcyBzZW51IC0tcHMtdmlyc3VzIChwbHlzeXMsIHBybyBrdXJpICdwcmFzb2thJyBlaWx1dGVzKS4gUGVyc2thaWNpdW9qYW0gc2Nyb2xsJ2luYW50LiAqL1xuXHRcdFx0dmFyIHZSQUY9ZmFsc2U7IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKCl7IGlmKHZSQUYpIHJldHVybjsgdlJBRj10cnVlOyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXsgdlJBRj1mYWxzZTsgdmlyc3VzKCk7IH0pOyB9LCB7cGFzc2l2ZTp0cnVlfSk7XG5cdFx0XHRzZXRUaW1lb3V0KHZpcnN1cywgNDAwKTsgc2V0VGltZW91dCh2aXJzdXMsIDEyMDApOyI7CiAgaWYobWQ1KCRsaXZlKT09PSdfX05BVUpBU19NRDVfXycgfHwgc3Vic3RyX2NvdW50KCRsaXZlLCd2OC43LjIgKFMxNjM2KScpPT09MSl7ICRvWydqYXVfdjg3MiddPTE7ICRvWydiNjQnXT1iYXNlNjRfZW5jb2RlKCRsaXZlKTsgJEooJG8pOyB9CiAgJG49c3Vic3RyX2NvdW50KCRsaXZlLCRvbGQpOyAkb1snb2xkX2NvdW50J109JG47IGlmKCRuIT09MSl7ICRvWydTVE9QJ109J29sZF9jb3VudCE9MSc7ICRKKCRvKTsgfQogICRuYXVqYXM9c3RyX3JlcGxhY2UoJG9sZCwkbmV3LCRsaXZlKTsKICAkbmF1amFzPXN0cl9yZXBsYWNlKCcgKiBQZXRzaG9wIEthdGFsb2dhcyB2OC43LjEgKFM5MDMpIC0gU1RVTFBFTElVIEFOVFJBU1RFIE5FSlVEQS4nLCcgKiBQZXRzaG9wIEthdGFsb2dhcyB2OC43LjIgKFMxNjM2KSAtIHN0aWNreSBhbnRyYXN0ZSBzZWthIGp1b3N0YSBzY3JvbGxcJ2luYW50LicuIlxuIi4nICogdjguNy4xIChTOTAzKSAtIFNUVUxQRUxJVSBBTlRSQVNURSBORUpVREEuJywkbmF1amFzKTsKICB0cnl7IHRva2VuX2dldF9hbGwoJG5hdWphcyxUT0tFTl9QQVJTRSk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snU1RPUCddPSd0b2tlbjogJy4kZS0+Z2V0TWVzc2FnZSgpOyAkSigkbyk7IH0KICAkb1sna29waWphJ109KGludClmaWxlX3B1dF9jb250ZW50cygkYmssJGxpdmUpOwogICRvWydpcmFzeXRhJ109KGludClmaWxlX3B1dF9jb250ZW50cygkZnAsJG5hdWphcyk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZnAsdHJ1ZSk7CiAgJG9bJ3BpbmcnXT0kcGluZygpOyBpZigkb1sncGluZyddWydmYXRhbCddfHwkb1sncGluZyddWydjb2RlJ10+PTUwMCl7IGZpbGVfcHV0X2NvbnRlbnRzKCRmcCwkbGl2ZSk7ICRvWydBVEtVUlRBJ109bWQ1X2ZpbGUoJGZwKTsgJEooJG8pOyB9CiAgJG9bJ21kNV9wbyddPW1kNV9maWxlKCRmcCk7ICRvWydkeWRpc19wbyddPWZpbGVzaXplKCRmcCk7ICRvWydiNjQnXT1iYXNlNjRfZW5jb2RlKCRuYXVqYXMpOwogICRKKCRvKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgJEooJG8pOyB9Cn0sOTkpOwo=';
const VER='dep-165208';
const GKEY='ps_s1636m';
const PHASES=["M"];
const OUT='analize/s1636_m.json';
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
