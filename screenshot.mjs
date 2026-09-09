process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIG9uYm9hcmRpbmcgbG9naWthICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmtOJ10pPyRfR0VUWydwc19ia04nXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjcxUicpOwogIHRyeXsKICAgICRkaXI9V1BfUExVR0lOX0RJUi4nL2NvbXBsaWFuei1nZHByL3dlYnNpdGVzY2FuLyc7CiAgICAkYz1maWxlX2dldF9jb250ZW50cygkZGlyLidjbGFzcy13c2Mtb25ib2FyZGluZy5waHAnKTsKICAgICRvWydkeWRpcyddPXN0cmxlbigkYyk7CiAgICBmb3JlYWNoKGFycmF5KCdzaG91bGRfb25ib2FyZCcsJ21heWJlX3Nob3dfb25ib2FyZGluZ19tb2RhbCcsJ2hhbmRsZV9vbmJvYXJkaW5nX2FjdGlvbicsJ3VwZGF0ZV9vbmJvYXJkaW5nX3N0YXR1cycsJ2dldF9vbmJvYXJkaW5nX2RvYycpIGFzICRmbil7CiAgICAgIGlmKHByZWdfbWF0Y2goIi9mdW5jdGlvblxzKyRmblxzKlwoW14pXSpcKVxzKlx7LyIsJGMsJG0sUFJFR19PRkZTRVRfQ0FQVFVSRSkpewogICAgICAgICRvWydmbiddWyRmbl09cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkYywkbVswXVsxXSw5MDApKTsgfSB9CiAgICAkYT1maWxlX2dldF9jb250ZW50cygkZGlyLidjbGFzcy13c2MtYXV0aC5waHAnKTsKICAgIGZvcmVhY2goYXJyYXkoJ3NlbmRfYXV0aF9lbWFpbCcsJ3dzY19pc19hdXRoZW50aWNhdGVkJywnc3RvcmVfb25ib2FyZGluZ19jb25zZW50JywnY29uZmlybV9lbWFpbF9hdXRoJykgYXMgJGZuKXsKICAgICAgaWYocHJlZ19tYXRjaCgiL2Z1bmN0aW9uXHMrJGZuXHMqXChbXildKlwpXHMqXHsvIiwkYSwkbSxQUkVHX09GRlNFVF9DQVBUVVJFKSl7CiAgICAgICAgJG9bJ2F1dGgnXVskZm5dPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdWJzdHIoJGEsJG1bMF1bMV0sODAwKSk7IH0gfQogICAgLy8ga3VyIHJvZG9tYXMgV1NDIGJsb2thcyBkYXNoYm9hcmQnZQogICAgJHM9ZmlsZV9nZXRfY29udGVudHMoJGRpci4nY2xhc3Mtd3NjLXNldHRpbmdzLnBocCcpOwogICAgcHJlZ19tYXRjaF9hbGwoIi8nKGlkfHRpdGxlKSdccyo9PlxzKicoW14nXXswLDYwfSknLyIsJHMsJG0pOwogICAgJG9bJ3NldHRpbmdzX2xhdWthaSddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbVsyXSksMCwzMCk7CiAgICAkb1snYnVzZW5hJ109YXJyYXkoJ29uYm9hcmRpbmcnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfb25ib2FyZGluZ19zdGF0dXMnKSwnc3RhdHVzJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3N0YXR1cycpLAogICAgICAnc2lnbnVwJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3NpZ251cF9zdGF0dXMnKSwnYXV0aCc9PmNsYXNzX2V4aXN0cygnY21wbHpfd3NjX2F1dGgnKT8oY21wbHpfd3NjX2F1dGg6OndzY19pc19hdXRoZW50aWNhdGVkKCk/J3RhaXAnOiduZScpOic/Jyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-073306';
const GKEY='ps_bkN';
const PHASES=["R"];
const OUT='analize/s1671_r.json';
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
