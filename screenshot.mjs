process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODggbWUg4oCUIEUyRTogZj1uYXJzIChicm93c2VyPTEpIOKAlCBzdmXEjWlhcyBhdGlkYXJvIDEyNDY2ID9zdm9yaXM9MjAmY2lkPXRlcnJhLCBsYXVraWEgYmxva28gI3BzLXByaW1pbmssIMSvdmVkYSB0ZXJyYUBneXZ1bmFpLmx0LCBzcGF1ZMW+aWEg4oCeVGFpcCwgcHJpbWlua2l0ZSIsIGdyxIXFvmluYSBibG9rbyB0ZWtzdMSFOyBmPXBvIOKAlCByYW5kYSB0cmFuc2llbnQnxIUsIGt2aWXEjWlhIHBhdHZpcnRpbmltbyBudW9yb2TEhSAod3BfcmVtb3RlX2dldCBiZSByZWRpcmVjdCksIHRpa3JpbmEgcmVmaWxsL2NvbnNlbnQvd2VpZ2h0L3JlbGF1bmNoIGVpbHV0ZXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg4bWUnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY4OCBtZScpOyAkZj0kX0dFVFsncHNfczE2ODhtZSddOyAkdD1QZXRzaG9wX1JlbGF1bmNoOjp0KCk7CiAgJGNpZD0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNpZCBGUk9NICR0IFdIRVJFIGVtYWlsPSd0ZXJyYUBneXZ1bmFpLmx0JyIpOwogIGlmKCRmPT09J25hcnMnKXsKICAgICR1PWFkZF9xdWVyeV9hcmcoYXJyYXkoJ3N2b3Jpcyc9PjIwLCdjaWQnPT4kY2lkLCd1dG1fc291cmNlJz0+J3NlbmRlcicsJ3V0bV9tZWRpdW0nPT4nZW1haWwnLCd1dG1fY2FtcGFpZ24nPT4ncmVsYXVuY2gnLCd1dG1fY29udGVudCc9PidjYWxjJyksZ2V0X3Blcm1hbGluaygxMjQ2NikpOwogICAgJG9bJ3Nob3RzJ109YXJyYXkoYXJyYXkoJ24nPT4nczE2ODhfcHJpbWluaycsJ3UnPT4kdSwnZnVsbCc9PjAsJ2V2YWwnPT4ibmV3IFByb21pc2UoZnVuY3Rpb24ocil7c2V0VGltZW91dChmdW5jdGlvbigpe3ZhciBiPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcy1wcmltaW5rJyk7aWYoIWIpe3JldHVybiByKHtibG9rYXM6bnVsbCxvdXQ6KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcy1jYWxjLW91dCcpfHx7fSkuaW5uZXJUZXh0fSk7fXZhciBlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcy1wcmltaW5rLWUnKTtpZihlKXtlLnZhbHVlPSd0ZXJyYUBneXZ1bmFpLmx0Jzt9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BzLXByaW1pbmstZ28nKS5jbGljaygpO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyKHtibG9rYXM6Yi5pbm5lclRleHQuc2xpY2UoMCw1MDApLGVycjooZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BzLXByaW1pbmstZXJyJyl8fHt9KS50ZXh0Q29udGVudH0pO30sNTAwMCk7fSw2MDAwKTt9KSIpKTsKICB9IGVsc2UgewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsb3B0aW9uX3ZhbHVlIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3BzX3ByaW1pbmtfJScgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICdfdHJhbnNpZW50X3BzX3ByaW1pbmtfcmxfJScgT1JERVIgQlkgb3B0aW9uX2lkIERFU0MgTElNSVQgMyIsQVJSQVlfQSk7CiAgICAkb1sndHJhbnNpZW50YWknXT1jb3VudCgkcm93cyk7ICR0b2s9Jyc7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHY9bWF5YmVfdW5zZXJpYWxpemUoJHJbJ29wdGlvbl92YWx1ZSddKTsgaWYoaXNfYXJyYXkoJHYpJiYoJHZbJ2VtYWlsJ10/PycnKT09PSd0ZXJyYUBneXZ1bmFpLmx0Jyl7ICR0b2s9c3RyX3JlcGxhY2UoJ190cmFuc2llbnRfcHNfcHJpbWlua18nLCcnLCRyWydvcHRpb25fbmFtZSddKTsgJG9bJ3BheWxvYWQnXT0kdjsgYnJlYWs7IH0gfQogICAgaWYoJHRvayl7ICR1cmw9YWRkX3F1ZXJ5X2FyZyhhcnJheSgncHNfcHJpbWluayc9PiR0b2ssJ3onPT5QZXRzaG9wX1JlbGF1bmNoOjp6ZW5rbGFzKCR0b2spKSxob21lX3VybCgnLycpKTsgJG9bJ3VybCddPSR1cmw7CiAgICAgICRyPXdwX3JlbW90ZV9nZXQoJHVybCxhcnJheSgndGltZW91dCc9PjI1LCdyZWRpcmVjdGlvbic9PjAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWydodHRwJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKS4nIOKGkiAnLndwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIsJ2xvY2F0aW9uJyk7IH0KICAgICR1PWdldF91c2VyX2J5KCdlbWFpbCcsJ3RlcnJhQGd5dnVuYWkubHQnKTsgJHVpZD0kdT8oaW50KSR1LT5JRDowOyAkb1sndWlkJ109JHVpZDsKICAgICRvWydyZWZpbGwnXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQsbGFzdF9vcmRlcl9pZCxsYXN0X3B1cmNoYXNlX2RhdGUscHVyY2hhc2VfY291bnQsYXZnX2ludGVydmFsX2RheXMscHJlZGljdGVkX2VtcHR5X2RhdGUsY29uZmlkZW5jZSxzdGF0dXMsZmVlZGJhY2tfY3ljbGUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19yZWZpbGxfdHJhY2tpbmcgV0hFUkUgdXNlcl9pZD0lZCBBTkQgcHJvZHVjdF9pZD0xMjQ2NiIsJHVpZCksQVJSQVlfQSk7CiAgICAkb1snY29uc2VudCddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZpZWxkLGZyb21fdmFsdWUsdG9fdmFsdWUsc291cmNlLGNoYW5nZWRfYXQgRlJPTSB7JHdwZGItPnByZWZpeH1wc19jb25zZW50X2xvZyBXSEVSRSBlbWFpbD0lcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDIiLCd0ZXJyYUBneXZ1bmFpLmx0JyksQVJSQVlfQSk7CiAgICAkb1sndXNlcm1ldGEnXT1hcnJheSgnZWxpZ2libGUnPT5nZXRfdXNlcl9tZXRhKCR1aWQsJ3BzX3NvZnRfb3B0aW5fZWxpZ2libGUnLHRydWUpLCdvcHRvdXQnPT5nZXRfdXNlcl9tZXRhKCR1aWQsJ3BzX3NpbWlsYXJfb3B0b3V0Jyx0cnVlKSwnd2VpZ2h0Jz0+YXJyYXlfc2xpY2UoKGFycmF5KWdldF91c2VyX21ldGEoJHVpZCwncHNfd2VpZ2h0X3NpZ25hbCcsdHJ1ZSksLTIpKTsKICAgICRvWydyZWxhdW5jaCddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1Qga2xpa19uLHBhc2tfc3ZvcmlzLHByaW1pbmtfYXQscHJpbWlua19rZyxwcmltaW5rX2J1c2VuYSBGUk9NICR0IFdIRVJFIGVtYWlsPSd0ZXJyYUBneXZ1bmFpLmx0JyIsQVJSQVlfQSk7CiAgICAkb1snaXZ5a2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhaWthcyx0aXBhcyxyYWt0YXMscmFrdGFzMixyZWlrc21lLGthbXBhbmlqYSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3dlYl9pdnlraWFpIFdIRVJFIHRpcGFzIElOICgncmVtaW5kZXJfb3B0aW4nLCdlbWFpbF9jYWxjX2NsaWNrJykgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-100508';
const GKEY='ps_s1688me';
const PHASES=["po"];
const OUT='analize/s1688_me2.json';
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
