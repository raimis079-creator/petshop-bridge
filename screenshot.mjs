process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAzZyByZWNvbiDigJQgQW1icm9zaWEgxaHEl3JpbW8gbGVudGVsxJdzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDMnXSk/JF9HRVRbJ3BzX3MxODAzJ106JycpOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE4MDNnJyk7CiAgJG9bJ3RhYmxlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGJyYW5kLGxpbmUsc3BlY2llcyxzdGF0dXMscm93X2RpbWVuc2lvbixzb3VyY2Vfc3RydWN0dXJlLGxvb2t1cF9tZXRob2Qsd2VpZ2h0X2Jhc2lzLHJvd19jb3VudCxpc19hY3RpdmUsaW1wb3J0X2JhdGNoX2lkLHRhYmxlX2tleSx1cGRhdGVkX2F0IEZST00geyRwfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGJyYW5kIExJS0UgJyVtYnJvc2lhJScgT1IgaW1wb3J0X2JhdGNoX2lkIExJS0UgJ1MxODAwJScgT1IgaWQ+PTM0MCBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgZm9yZWFjaChhcnJheSgzNTIsMzUzLDM1NCkgYXMgJHQpeyAkb1sncm93cyddWyR0XT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCByb3dfb3JkZXIsd2VpZ2h0X2Zyb21fa2csd2VpZ2h0X3RvX2tnLGFtb3VudF9mcm9tX2csYW1vdW50X3RvX2csY2VsbF90eXBlLHNvdXJjZV9sYWJlbCBGUk9NIHskcH1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIiLCR0KSxBUlJBWV9BKTsKICAgICRvWydtYXAnXVskdF09JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbS5wcm9kdWN0X2lkLG0uaXNfYWN0aXZlLHBvLnBvc3Rfc3RhdHVzLHBvLnBvc3RfdGl0bGUgRlJPTSB7JHB9cHNfZmVlZGluZ19tYXAgbSBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1tLnByb2R1Y3RfaWQgV0hFUkUgbS5mZWVkaW5nX3RhYmxlX2lkPSVkIiwkdCksQVJSQVlfQSk7IH0KICAvLyBzZW5pICjFoXVuxbMpIEFtYnJvc2lhCiAgJG9bJ2FtYl9wdWJsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3Rfc3RhdHVzLHAucG9zdF90aXRsZSxtLmZlZWRpbmdfdGFibGVfaWQsZnQubGluZSxmdC5zcGVjaWVzLGZ0LnVwZGF0ZWRfYXQgRlJPTSB7JHB9cG9zdHMgcCBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIEFORCB0Lm5hbWU9J0FtYnJvc2lhJyBMRUZUIEpPSU4geyRwfXBzX2ZlZWRpbmdfbWFwIG0gT04gbS5wcm9kdWN0X2lkPXAuSUQgQU5EIG0uaXNfYWN0aXZlPTEgTEVGVCBKT0lOIHskcH1wc19mZWVkaW5nX3RhYmxlcyBmdCBPTiBmdC5pZD1tLmZlZWRpbmdfdGFibGVfaWQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIE9SREVSIEJZIHAuSUQiLEFSUkFZX0EpOwogIC8vIHNrYWnEjWl1b2tsxJdzIHJlenVsdGF0YXMga2VsaWVtcwogIGlmKGNsYXNzX2V4aXN0cygnRmVlZGluZ19TZXJ2aWNlJykpeyBmb3JlYWNoKGFycmF5KDM3MDcyLDM3MDgwLDM3MDg4KSBhcyAkaWQpeyBmb3JlYWNoKGFycmF5KDMsNCw1KSBhcyAkdyl7IHRyeXsgJHI9RmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+JGlkLCd3ZWlnaHRfa2cnPT4kdywnc3BlY2llc19jb2RlJz0+J2NhdCcpKTsgJG9bJ2NhbGMnXVskaWRdWyR3XT0kcjsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydjYWxjJ11bJGlkXVskd109J0VSUiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfSB9IH0KICBlbHNlICRvWydjYWxjJ109J0ZlZWRpbmdfU2VydmljZSBuxJdyYSc7CiAgLy8gYXByYcWheW1vIMWhxJdyaW1vIGRhbGlzCiAgZm9yZWFjaChhcnJheSgzNzA3MiwzNzA4OCkgYXMgJGlkKXsgJGQ9Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfY29udGVudCcsJGlkKTsgJGk9bWJfc3RycG9zKCRkLCdSZWtvbWVuZHVvamFtYXMnKTsgJG9bJ2Rlc2MnXVskaWRdPSRpIT09ZmFsc2U/bWJfc3Vic3RyKCRkLCRpLDI1MDApOidORVJBU1RBJzsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-104231';
const GKEY='ps_s1803';
const PHASES=["GO"];
const OUT='analize/s1803_g.json';
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
