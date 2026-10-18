process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg3byAjMTQ1MCBrbGllbnRvIGtlbGlhcyBrYXNvamUgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzg3byddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3ODdvJ107CiAgdHJ5ewogICAgJG89bnVsbDsgZm9yZWFjaCh3Y19nZXRfb3JkZXJzKFsnbGltaXQnPT40MCwndHlwZSc9PidzaG9wX29yZGVyJywnc3RhdHVzJz0+J2FueScsJ2RhdGVfY3JlYXRlZCc9Pic+PScuc3RydG90aW1lKCcyMDI2LTEwLTE2IDEwOjAwIFVUQycpXSkgYXMgJHgpIGlmKCR4LT5nZXRfb3JkZXJfbnVtYmVyKCk9PScxNDUwJykgJG89JHg7IGlmKCEkbykgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmVyYXN0YScpOwogICAgJGlkPSRvLT5nZXRfaWQoKTsgJHJbJ2lkJ109JGlkOyAkclsnc3VrdXJ0YSddPSRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ1ktbS1kIEg6aTpzJyk7ICRyWydhcG0nXT0kby0+Z2V0X2RhdGVfcGFpZCgpPyRvLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ1ktbS1kIEg6aTpzJyk6bnVsbDsgJHJbJ3N0YXR1cyddPSRvLT5nZXRfc3RhdHVzKCk7CiAgICAkclsnc2hpcCddPWFycmF5X21hcChmbigkcyk9Plskcy0+Z2V0X21ldGhvZF9pZCgpLCRzLT5nZXRfbmFtZSgpLCRzLT5nZXRfdG90YWwoKSxhcnJheV9tYXAoZm4oJG0pPT5bJG0tPmtleSxpc19zY2FsYXIoJG0tPnZhbHVlKT9tYl9zdWJzdHIoKHN0cmluZykkbS0+dmFsdWUsMCw4MCk6J2FyciddLCRzLT5nZXRfbWV0YV9kYXRhKCkpXSxhcnJheV92YWx1ZXMoJG8tPmdldF9pdGVtcygnc2hpcHBpbmcnKSkpOwogICAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJHA9JGl0LT5nZXRfcHJvZHVjdCgpOyAkcGlkPSRpdC0+Z2V0X3Byb2R1Y3RfaWQoKTsgJHJbJ2VpbCddW109WydwaWQnPT4kcGlkLCduJz0+JGl0LT5nZXRfbmFtZSgpLCdxJz0+JGl0LT5nZXRfcXVhbnRpdHkoKSwnc3ZvcmlzJz0+JHA/JHAtPmdldF93ZWlnaHQoKTpudWxsLCdkaW0nPT4kcD9bJHAtPmdldF9sZW5ndGgoKSwkcC0+Z2V0X3dpZHRoKCksJHAtPmdldF9oZWlnaHQoKV06bnVsbCwndGlrX2t1cmplcml1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKSwnY291cmllcl9vbmx5X21ldGEnPT5hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X21hcChmbigkayk9PnByZWdfbWF0Y2goJy9rdXJqZXJ8Y291cmllcnxwYXN0b21hdHxwYXJjZWwvaScsJGspPyRrLic9Jy5tYl9zdWJzdHIoKHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJGssdHJ1ZSksMCwzMCk6bnVsbCxhcnJheV9rZXlzKGdldF9wb3N0X21ldGEoJHBpZCkpKSkpLCdzaGlwcGluZ19jbGFzcyc9PiRwPyRwLT5nZXRfc2hpcHBpbmdfY2xhc3MoKTpudWxsLCdzcmMnPT4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ2NhcnJpZXInPT4kaXQtPmdldF9tZXRhKCdfcHNfY2FycmllcicpXTsgfQogICAgZm9yZWFjaChbJ19iaWxsaW5nX2NpdHknLCdfc2hpcHBpbmdfY2l0eSddIGFzICRrKSAkclsnbWllc3RhcyddWyRrXT0kby0+Z2V0X21ldGEoJGspPzokby0+eydnZXQnLnN0cl9yZXBsYWNlKCdfYmlsbGluZycsJ19iaWxsaW5nJywkayl9Pz9udWxsOwogICAgJHJbJ21pZXN0YXMnXT0kby0+Z2V0X2JpbGxpbmdfY2l0eSgpOyAkclsnYXR0ciddPVsnc291cmNlJz0+JG8tPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fc291cmNlX3R5cGUnKS4nLycuJG8tPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fdXRtX3NvdXJjZScpLCdkZXZpY2UnPT4kby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9kZXZpY2VfdHlwZScpLCdzZXNzaW9uX3N0YXJ0Jz0+JG8tPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fc2Vzc2lvbl9zdGFydF90aW1lJyksJ3BhZ2VzJz0+JG8tPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fc2Vzc2lvbl9wYWdlcycpLCdlbnRyeSc9PiRvLT5nZXRfbWV0YSgnX3djX29yZGVyX2F0dHJpYnV0aW9uX3Nlc3Npb25fZW50cnknKSwnaXJlbmdpbnlzJz0+JG8tPmdldF9tZXRhKCdfcHNfaXJlbmdpbnlzJyksJ3N0YXRfc2VzaWphJz0+JG8tPmdldF9tZXRhKCdfcHNfc3RhdF9zZXNpamEnKV07CiAgICAkclsnY3VzdG9tZXJfbm90ZSddPSRvLT5nZXRfY3VzdG9tZXJfbm90ZSgpOwogICAgJHJbJ25vdGVzJ109YXJyYXlfbWFwKGZuKCRuKT0+JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aTpzJykuJyBbJy4oJG4tPmN1c3RvbWVyX25vdGU/J0snOidWJykuJ10gJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMjIwKSx3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4zMCwnb3JkZXInPT4nQVNDJ10pKTsKICAgIC8vIG3Fq3PFsyBsYW5reXRvam8gxK92eWtpYWkKICAgICRzZXM9JG8tPmdldF9tZXRhKCdfcHNfc3RhdF9zZXNpamEnKTsgJHQwPWdtZGF0ZSgnWS1tLWQgSDppOnMnLCRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmdldFRpbWVzdGFtcCgpLTMqMzYwMCk7ICR0MT1nbWRhdGUoJ1ktbS1kIEg6aTpzJywkby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5nZXRUaW1lc3RhbXAoKSs2MDApOwogICAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc193ZWJfaXZ5a2lhaSIpOyAkclsnaXZfY29scyddPSRjb2xzOwogICAgaWYoJHNlcyAmJiBpbl9hcnJheSgnc2VzaWphJywkY29scykpICRyWydpdiddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgc2VzaWphPSVzIE9SREVSIEJZIGlkIExJTUlUIDgwIiwkc2VzKSxBUlJBWV9BKTsKICAgIC8vIGthc29zIGRlcmluaW1vIMW+dXJuYWxhcwogICAgJGxnPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MvcGxhY2Utb3JkZXItZGVidWctMjAyNi0xMC0xNionKTsgJHJbJ2xvZ3MnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJywkbGc/OltdKTsKICAgIGZvcmVhY2goJGxnPzpbXSBhcyAkZil7IGZvcmVhY2goZmlsZSgkZikgYXMgJGwpIGlmKHN0cnBvcygkbCwoc3RyaW5nKSRpZCkhPT1mYWxzZXx8c3RycG9zKCRsLCcxNDUwJykhPT1mYWxzZSkgJHJbJ2xvZ19oaXRzJ11bXT1tYl9zdWJzdHIodHJpbSgkbCksMCwzMDApOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-195632';
const GKEY='ps_s1787o';
const PHASES=["1"];
const OUT='analize/s1787_o.json';
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
