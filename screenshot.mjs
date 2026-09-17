process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTAgZCDigJQgdGVzdGFzOiBzdmXEjWlvIGthc2Egc3UgZXNhbW9zIHBhc2t5cm9zIGVsLiBwYcWhdHUgKHRlcnJhQGd5dnVuYWkubHQpLCBiYWNzLCB0ZXN0aW7ElyBwcmVrxJc7IHBvIHRvIGF0xaFhdWt0aS4gKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRFPSd0ZXJyYUBneXZ1bmFpLmx0JzsKICBpZiAoaXNzZXQoJF9HRVRbJ3BzX3MxNjkwZDEnXSkpIHsgJG89YXJyYXkoKTsKICAgICRvWyd1aWQnXT1lbWFpbF9leGlzdHMoJEUpOyAkb1sncHJvZCddPWdldF9wYWdlX2J5X3BhdGgoJ3BzLXRlc3Rhcy0xLWV1cicsJ09CSkVDVCcsJ3Byb2R1Y3QnKTsgJG9bJ3Byb2QnXT0kb1sncHJvZCddPyRvWydwcm9kJ10tPklEOm51bGw7CiAgICAkb1sncGx1Z2luJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thc2FfUGFza3lyYScpOwogICAgJGQ9YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY2hlY2tvdXRfcG9zdGVkX2RhdGEnLGFycmF5KCdiaWxsaW5nX2VtYWlsJz0+JEUsJ2NyZWF0ZWFjY291bnQnPT4xKSk7CiAgICAkb1snY3JlYXRlYWNjb3VudF9wbyddPSRkWydjcmVhdGVhY2NvdW50J107ICRvWydjdXN0b21lcl9pZF9wbyddPWFwcGx5X2ZpbHRlcnMoJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X2N1c3RvbWVyX2lkJywwKTsgJG9bJ3VwZGF0ZV9kYXRhJ109YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY2hlY2tvdXRfdXBkYXRlX2N1c3RvbWVyX2RhdGEnLHRydWUsbnVsbCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogIGlmIChpc3NldCgkX0dFVFsncHNfczE2OTBkMiddKSkgewogICAgJHBpZD1nZXRfcGFnZV9ieV9wYXRoKCdwcy10ZXN0YXMtMS1ldXInLCdPQkpFQ1QnLCdwcm9kdWN0JyktPklEOyB3Y19sb2FkX2NhcnQoKTsgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOyBXQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgkcGlkLDEpOwogICAgJF9QT1NUPWFycmF5KCdiaWxsaW5nX2ZpcnN0X25hbWUnPT4nVGVzdGFzJywnYmlsbGluZ19sYXN0X25hbWUnPT4nUzE2OTAnLCdiaWxsaW5nX2NvdW50cnknPT4nTFQnLCdiaWxsaW5nX2FkZHJlc3NfMSc9PidUZXN0byBnLiAxJywnYmlsbGluZ19jaXR5Jz0+J1ZpbG5pdXMnLCdiaWxsaW5nX3Bvc3Rjb2RlJz0+JzAxMTAwJywnYmlsbGluZ19waG9uZSc9PicrMzcwNjAwMDAwMDAnLCdiaWxsaW5nX2VtYWlsJz0+JEUsJ2NyZWF0ZWFjY291bnQnPT4xLCdwYXltZW50X21ldGhvZCc9PidiYWNzJywndGVybXMnPT4xLCd0ZXJtcy1maWVsZCc9PjEsJ3NoaXBfdG9fZGlmZmVyZW50X2FkZHJlc3MnPT4wLCdvcmRlcl9jb21tZW50cyc9PidURVNUQVMgUzE2OTAg4oCUIGF0xaFhdWt0aScpOwogICAgJF9QT1NUWyd3b29jb21tZXJjZS1wcm9jZXNzLWNoZWNrb3V0LW5vbmNlJ109d3BfY3JlYXRlX25vbmNlKCd3b29jb21tZXJjZS1wcm9jZXNzX2NoZWNrb3V0Jyk7ICRfUE9TVFsnX3dwbm9uY2UnXT0kX1BPU1RbJ3dvb2NvbW1lcmNlLXByb2Nlc3MtY2hlY2tvdXQtbm9uY2UnXTsKICAgICRfUkVRVUVTVD1hcnJheV9tZXJnZSgkX1JFUVVFU1QsJF9QT1NUKTsgJF9TRVJWRVJbJ1JFUVVFU1RfTUVUSE9EJ109J1BPU1QnOyBpZighZGVmaW5lZCgnRE9JTkdfQUpBWCcpKSBkZWZpbmUoJ0RPSU5HX0FKQVgnLHRydWUpOwogICAgYWRkX2ZpbHRlcignd3BfZG9pbmdfYWpheCcsJ19fcmV0dXJuX3RydWUnKTsgV0MoKS0+Y2hlY2tvdXQoKS0+cHJvY2Vzc19jaGVja291dCgpOyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCduZWJ1dm9fZXhpdCc9PnRydWUsICdub3RpY2VzJz0+d2NfZ2V0X25vdGljZXMoKSkpOyBleGl0OyB9CiAgaWYgKGlzc2V0KCRfR0VUWydwc19zMTY5MGQzJ10pKSB7ICRvPWFycmF5KCk7CiAgICAkaWRzPXdjX2dldF9vcmRlcnMoYXJyYXkoJ2xpbWl0Jz0+Miwnb3JkZXJieSc9PidpZCcsJ29yZGVyJz0+J0RFU0MnLCdiaWxsaW5nX2VtYWlsJz0+JEUsJ3JldHVybic9PidpZHMnKSk7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG9yZD13Y19nZXRfb3JkZXIoJGlkKTsgJG49YXJyYXkoKTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjYpKSBhcyAkbnQpICRuW109bWJfc3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkbnQtPmNvbnRlbnQpLDAsMTAwKTsKICAgICAgJHJvdz1hcnJheSgnaWQnPT4kaWQsJ3N0Jz0+JG9yZC0+Z2V0X3N0YXR1cygpLCd1aWQnPT4kb3JkLT5nZXRfY3VzdG9tZXJfaWQoKSwnbWV0YSc9PiRvcmQtPmdldF9tZXRhKCdfcHNfcGFza3lyYV9wcmlza2lydGEnKSwnc3VrdXJ0YXMnPT4kb3JkLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ20tZCBIOmknKSwncGFzdGFib3MnPT4kbik7CiAgICAgIGlmICgkb3JkLT5nZXRfY3VzdG9tZXJfbm90ZSgpPT09J1RFU1RBUyBTMTY5MCDigJQgYXTFoWF1a3RpJyAmJiAkb3JkLT5oYXNfc3RhdHVzKCdvbi1ob2xkJykpIHsgJG9yZC0+dXBkYXRlX3N0YXR1cygnY2FuY2VsbGVkJywnVEVTVEFTIFMxNjkwIGF0xaFhdWt0YXMgYXV0b21hdGnFoWthaS4nKTsgJHJvd1snYXRzYXVrdGEnXT10cnVlOyB9CiAgICAgICRvWyd1enMnXVtdPSRyb3c7IH0KICAgICR1PWdldF91c2VyX2J5KCdlbWFpbCcsJEUpOyAkb1sncGFza3lyb3NfYWRyZXNhcyddPWFycmF5KCdhZGRyJz0+Z2V0X3VzZXJfbWV0YSgkdS0+SUQsJ2JpbGxpbmdfYWRkcmVzc18xJyx0cnVlKSwnY2l0eSc9PmdldF91c2VyX21ldGEoJHUtPklELCdiaWxsaW5nX2NpdHknLHRydWUpKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KfSw5OSk7Cg==';
const VER='dep-160219';
const GKEY='ps_s1690d1';
const PHASES=["ps_s1690d1", "ps_s1690d2", "ps_s1690d3"];
const OUT='analize/s1690_d.json';
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
