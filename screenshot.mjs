process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI5c2YgIzE0NjUgYnVrbGUgKDEgcmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjlzZiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgJGY9KHN0cmluZykkX0dFVFsncHNfczE4MjlzZiddOyAkcj1bJ3YnPT4nUzE4MjlzZicsJ2YnPT4kZl07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgJGlkcz13Y19nZXRfb3JkZXJzKFsnbGltaXQnPT40MDAsJ3JldHVybic9PidpZHMnLCdkYXRlX2NyZWF0ZWQnPT4nMjAyNi0xMC0xMC4uLjIwMjYtMTAtMjUnLCdzdGF0dXMnPT4nYW55JywndHlwZSc9PidzaG9wX29yZGVyJ10pOyAkT0lEPTA7CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZigkbyAmJiAkby0+Z2V0X29yZGVyX251bWJlcigpPT09JzE0NjUnKXsgJE9JRD0kaWQ7IGJyZWFrOyB9IH0KICAkclsnb2lkJ109JE9JRDsgaWYoISRPSUQpeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCduZXJhc3RhcycpOyB9CiAgJG89d2NfZ2V0X29yZGVyKCRPSUQpOwogICRyWydvJ109Wyducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwncG0nPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCksJ3N1a3VydGEnPT4kby0+Z2V0X2RhdGVfY3JlYXRlZCgpPyRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ1ktbS1kIEg6aScpOm51bGwsJ2FwbW9rZXRhJz0+JG8tPmdldF9kYXRlX3BhaWQoKT8kby0+Z2V0X2RhdGVfcGFpZCgpLT5kYXRlKCdZLW0tZCBIOmknKTpudWxsLCdzdW1hJz0+JG8tPmdldF90b3RhbCgpLCdpbW9uZSc9PiRvLT5nZXRfYmlsbGluZ19jb21wYW55KCksJ3NoaXAnPT4kby0+Z2V0X3NoaXBwaW5nX21ldGhvZCgpXTsKICBmb3JlYWNoKFsnX3BldHNob3BfYXZwbl9udW1iZXInLCdfcGV0c2hvcF9pYXB2X251bWJlcicsJ19wZXRzaG9wX3NmX2RhdGEnLCdfcGV0c2hvcF9pbnZvaWNlX2RvY3VtZW50X3R5cGUnLCdfcGV0c2hvcF9vcmRlcl9wZGYnLCdfb3JkZXJfc3RvY2tfcmVkdWNlZCcsJ19wc19hdl9yZWR1Y2VkJywnX3BzX2RhbHlzX2lzc2l1c3RhJywnX3BzX3ZlbmlwYWtfc2VraW1hcycsJ19wc192ZW5pcGFrX3RyYWNraW5nJywnX3BzX2RsX3ZlaWtzbWFzJ10gYXMgJGspeyAkdj0kby0+Z2V0X21ldGEoJGspOyAkclsnbWV0YSddWyRrXT1pc19zY2FsYXIoJHYpP21iX3N1YnN0cigoc3RyaW5nKSR2LDAsMzAwKTptYl9zdWJzdHIoanNvbl9lbmNvZGUoJHYsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSksMCw1MDApOyB9CiAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGkpeyAkcD0kaS0+Z2V0X3Byb2R1Y3QoKTsgJHJbJ2VpbCddW109WyRpLT5nZXRfbmFtZSgpLCRpLT5nZXRfcXVhbnRpdHkoKSwkcD8kcC0+Z2V0X2lkKCk6MCwkaS0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKSwkaS0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkX3F0eScpLCRwP2dldF9wb3N0X21ldGEoJHAtPmdldF9pZCgpLCdfcHNfc2FuZGVsaXMnLHRydWUpOicnXTsgfQogICRyWydzaXVudG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mYWt0X3NpdW50b3MgV0hFUkUgdXpzYWt5bWFzX2lkPSVkIiwkT0lEKSxBUlJBWV9BKTsKICAkclsncGFzdGFib3MnXT1hcnJheV9tYXAoZm4oJG4pPT5bJG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLG1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwyMjApXSx3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRPSUQsJ2xpbWl0Jz0+MjVdKSk7CiAgJEJQPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvYmFzZS5waHAnOyAkYnM9ZmlsZV9nZXRfY29udGVudHMoJEJQKTsKICAkTD1bXTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGJzKSBhcyAkbj0+JGxuKXsgaWYocHJlZ19tYXRjaCgnL2RvY19kYXRlX3Jhd3xfcGV0c2hvcF9zZl9kYXRhfGRhdGVfcGFpZHxnZXRfZGF0ZV9jb21wbGV0ZWQvJywkbG4pKSAkTFtdPSgkbisxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsbiksMCwyNjApOyB9ICRyWydiYXNlJ109JEw7CiAgaWYoJGY9PT0nMicpe30gCgogIGlmKCRmPT09JzInKXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJ3BldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYnKTsgJGZuPSRyZi0+Z2V0RmlsZU5hbWUoKTsgJHJbJ2dlbl9maWxlJ109JGZuLic6Jy4kcmYtPmdldFN0YXJ0TGluZSgpOwogICAgJHNyYz1maWxlX2dldF9jb250ZW50cygkZm4pOyAkTD1bXTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJHNyYykgYXMgJG49PiRsbil7IGlmKHByZWdfbWF0Y2goJy9kb2N1bWVudERhdGV8X3BldHNob3Bfc2ZfZGF0YXxkYXRlX3BhaWR8YXZwbnxnZXRfZGF0ZV9jb21wbGV0ZWR8Y29tcGxldGVkfGZ1bmN0aW9uIHBldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYvaScsJGxuKSkgJExbXT0oJG4rMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbG4pLDAsMjQwKTsgfSAkclsnZ2VuJ109YXJyYXlfc2xpY2UoJEwsMCw4MCk7IH0KICAkclsnZ2VuX2ZuJ109ZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX2dlbmVyYXRlX2ludm9pY2VfcGRmJyk7ICRyWydhdnBuX2NvdW50ZXInXT1nZXRfb3B0aW9uKCdwZXRzaG9wX2F2cG5fY291bnRlcicpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-084234';
const GKEY='ps_s1829sf';
const PHASES=["2"];
const OUT='analize/s1829_sf.json';
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
