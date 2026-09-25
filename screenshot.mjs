process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5aCDigJQgQVZQTiBudW1lcmF2aW1vIGtvZG8gaXIgaXN0b3Jpam9zIHJlY29uLCByZWFkLW9ubHkgKG0pICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxOWgnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzE5aCcsJ3QnPT5kYXRlKCdZLW0tZCBIOmk6cycpXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRmPVdQX0NPTlRFTlRfRElSLicvdGhlbWVzL2ZsYXRzb21lLWNoaWxkL2Z1bmN0aW9ucy5waHAnOyAkYz1maWxlX2dldF9jb250ZW50cygkZik7ICRsaW5lcz1leHBsb2RlKCJcbiIsJGMpOwogICAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2F2cG58QVZQTnxpbnZvaWNlX251bWJlcnxpbnZvaWNlX2RvY3VtZW50X3R5cGV8Y291bnRlci9pJywkbCkpICRyWydmdW5jdGlvbnNfZWlsJ11bJGkrMV09dHJpbShzdWJzdHIoJGwsMCwxNzApKTsgfQogICAgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uIHBldHNob3BfZ2V0X2F2cG5fbnVtYmVyW1xzXFNdezAsMjUwMH0/XG59LycsJGMsJG0pKSAkclsnZm5fYXZwbiddPSRtWzBdOwogICAgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uIHBldHNob3BfZ2V0X2ludm9pY2VfZG9jdW1lbnRfdHlwZVtcc1xTXXswLDE4MDB9P1xufS8nLCRjLCRtKSkgJHJbJ2ZuX2RvY3R5cGUnXT0kbVswXTsKICAgICRiPVdQX0NPTlRFTlRfRElSLicvdGhlbWVzL2ZsYXRzb21lLWNoaWxkL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzL2Jhc2UucGhwJzsgJGJjPWZpbGVfZ2V0X2NvbnRlbnRzKCRiKTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGJjKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvYXZwbnxpbnZvaWNlX251bWJlcnxkb2N1bWVudF90eXBlfGNvdW50ZXIvaScsJGwpKSAkclsnYmFzZV9laWwnXVskaSsxXT10cmltKHN1YnN0cigkbCwwLDE3MCkpOyB9CiAgICBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zLyoucGhwJykgYXMgJGZ4KXsgJGNjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmeCk7IGlmKHByZWdfbWF0Y2hfYWxsKCcvW15cbl17MCw2MH0ocGV0c2hvcF9nZXRfYXZwbl9udW1iZXJ8cGV0c2hvcF9hdnBuX2NvdW50ZXJ8X3BldHNob3BfYXZwbl9udW1iZXIpW15cbl17MCw2MH0vJywkY2MsJG0pKSAkclsnbXVfbmF1ZG9qYSddW2Jhc2VuYW1lKCRmeCldPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZShhcnJheV9tYXAoJ3RyaW0nLCRtWzBdKSksMCw2KTsgfQogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgKGNvZGUgTElLRSAnJWF2cG4lJyBPUiBjb2RlIExJS0UgJyVBVlBOJScpIixBUlJBWV9BKTsgZm9yZWFjaCgkc24gYXMgJHMpeyBwcmVnX21hdGNoX2FsbCgnL1teXG5dezAsNzB9KGF2cG58QVZQTilbXlxuXXswLDcwfS8nLCRzWydjb2RlJ10sJG0pOyAkclsnc25pcF9hdnBuJ11bJHNbJ2lkJ10uJyAnLiRzWyduYW1lJ11dPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZShhcnJheV9tYXAoJ3RyaW0nLCRtWzBdKSksMCw4KTsgfQogICAgZm9yZWFjaChbMzYwMjAsMzYxMTIsMzYxMTgsMzYxNDEsMzYxNDQsMzYyNzksMzYyODFdIGFzICRvaWQpeyAkbz13Y19nZXRfb3JkZXIoJG9pZCk7IGlmKCEkbykgY29udGludWU7ICRub3Rlcz1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiAkbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppOnMnKS4nICcuc3Vic3RyKHN0cmlwX3RhZ3MoJG4tPmNvbnRlbnQpLDAsNzApO30sYXJyYXlfcmV2ZXJzZSh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRvaWRdKSkpOwogICAgICAkclsndXpzJ11bJG9pZF09Wyducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ2F2cG4nPT4kby0+Z2V0X21ldGEoJ19wZXRzaG9wX2F2cG5fbnVtYmVyJyxmYWxzZSk/YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPnZhbHVlO30sJG8tPmdldF9tZXRhKCdfcGV0c2hvcF9hdnBuX251bWJlcicsZmFsc2UpKTpudWxsLCdkb2MnPT4kby0+Z2V0X21ldGEoJ19wZXRzaG9wX2ludm9pY2VfZG9jdW1lbnRfdHlwZScpLCd3Y2RuJz0+JG8tPmdldF9tZXRhKCdfd2Nkbl9pbnZvaWNlX251bWJlcicpLCd3Y2RuX2RhdGUnPT4kby0+Z2V0X21ldGEoJ193Y2RuX2ludm9pY2VfZGF0ZScpLCdjb21wbGV0ZWQnPT4kby0+Z2V0X2RhdGVfY29tcGxldGVkKCk/JG8tPmdldF9kYXRlX2NvbXBsZXRlZCgpLT5kYXRlKCdtLWQgSDppOnMnKTpudWxsLCdwYWlkJz0+JG8tPmdldF9kYXRlX3BhaWQoKT8kby0+Z2V0X2RhdGVfcGFpZCgpLT5kYXRlKCdtLWQgSDppOnMnKTpudWxsLCdub3Rlcyc9PmFycmF5X3NsaWNlKGFycmF5X2ZpbHRlcigkbm90ZXMsZnVuY3Rpb24oJHgpe3JldHVybiBwcmVnX21hdGNoKCcvQVZQTnxzxIVza2FpdHxzYXNrYWl0fFBERnxJxaFzacWzc3R8aXNzaXVzdHxCYWlndHxjb21wbGV0ZWR8S3VyamVyaXMvaScsJHgpO30pLDAsOCldOyB9CiAgICAkclsnY291bnRlcl9vcGNpamEnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIG9wdGlvbl9uYW1lLG9wdGlvbl92YWx1ZSxhdXRvbG9hZCBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lPSdwZXRzaG9wX2F2cG5fY291bnRlciciLEFSUkFZX0EpOwogICAgJHJbJ2F2cG5fY2hyb25vbG9naWphJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5tZXRhX3ZhbHVlIGF2cG4sby5pZCxvLmRhdGVfY3JlYXRlZF9nbXQsKFNFTEVDVCBkYXRlX2NvbXBsZXRlZF9nbXQgRlJPTSB7JHB9d2Nfb3JkZXJfb3BlcmF0aW9uYWxfZGF0YSBkIFdIRVJFIGQub3JkZXJfaWQ9by5pZCkgY29tcGxldGVkIEZST00geyRwfXdjX29yZGVyc19tZXRhIG0gSk9JTiB7JHB9d2Nfb3JkZXJzIG8gT04gby5pZD1tLm9yZGVyX2lkIFdIRVJFIG0ubWV0YV9rZXk9J19wZXRzaG9wX2F2cG5fbnVtYmVyJyBBTkQgbS5tZXRhX3ZhbHVlPj0nQVZQTjAxMTEwMCcgT1JERVIgQlkgY29tcGxldGVkLG8uaWQiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-145556';
const GKEY='ps_s1719h';
const PHASES=["m"];
const OUT='analize/s1719_h.json';
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
