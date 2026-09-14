process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgZCDigJQgcmVhZC1vbmx5OiBwc19zZW9fY3d2X2RpZW5hIOKAlCBzYXJnbyDFvmluaW9zLCBzZW8gcGx1Z2lubyBjd3YgYsWra2zEly/FvnVybmFsYXMsIGZ1bmtjaWpvcyBrxatuYXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgxZCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgxIGQnLCdkYWJhcl91dGMnPT5nbWRhdGUoJ1ktbS1kIEg6aScpKTsKICAkej1nZXRfb3B0aW9uKCdwc19zYXJnYXNfY3Jvbl96aW5pb3MnKTsgJG9bJ3ppbmlhX3RzJ109aXNzZXQoJHpbJ3BzX3Nlb19jd3ZfZGllbmEnXSk/Z21kYXRlKCdZLW0tZCBIOmknLCR6Wydwc19zZW9fY3d2X2RpZW5hJ10pOm51bGw7CiAgJG9bJ29wdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSBuLExFRlQob3B0aW9uX3ZhbHVlLDYwMCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3NlbyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2N3diUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfcHNfc2VvJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF9wc19jd3YlJyIsQVJSQVlfQSk7CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkcywncHNfc2VvX2N3dl9kaWVuYScpIT09ZmFsc2UpeyAkbj1iYXNlbmFtZSgkZik7IHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbXGQuXSspL2knLCRzLCRtdik7ICRvWydmYWlsYXMnXVskbl09JG12WzFdPz8nJzsKICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvXi4qcHNfc2VvX2N3dl9kaWVuYS4qJC9tJywkcywkbSkpICRvWydlaWwnXVskbl09YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3Vic3RyKHRyaW0oJHgpLDAsMzAwKTt9LCRtWzBdKTsKICAgIGlmKHByZWdfbWF0Y2goJy9hZGRfYWN0aW9uXChccypbXCciXXBzX3Nlb19jd3ZfZGllbmFbXCciXVxzKixccyooPzphcnJheVwoW14pXSosXHMqKT9bXCciXShbQS1aYS16XzAtOTpdKylbXCciXS8nLCRzLCRtbSkpeyAkZm49ZW5kKGV4cGxvZGUoJzonLCRtbVsxXSkpOyAkaT1zdHJwb3MoJHMsJ2Z1bmN0aW9uICcuJGZuLicoJyk7IGlmKCRpIT09ZmFsc2UpICRvWydmbl8nLiRmbl09c3Vic3RyKCRzLCRpLDI1MDApOyB9IH0gfQogIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9cHNfJWN3diUnIixBUlJBWV9OKSBhcyAkcil7ICR0PSRyWzBdOyAkb1snbGVudCddWyR0XT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgT1JERVIgQlkgMSBERVNDIExJTUlUIDMiLEFSUkFZX0EpOyB9CiAgJGw9QUJTUEFUSC4nLi4vbG9ncy9waHBfZXJyb3IubG9nJzsgaWYoZmlsZV9leGlzdHMoJGwpKXsgZm9yZWFjaChmaWxlKCRsKSBhcyAkbG4pIGlmKHByZWdfbWF0Y2goJy8xNC1TZXAtMjAyNiAwWzEtNV06LycsJGxuKSkgJG9bJ2xvZ18wMTA1J11bXT1zdWJzdHIoJGxuLDAsMjUwKTsgfQogICRvWydlJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-084738';
const GKEY='ps_s1681d';
const PHASES=["A"];
const OUT='analize/s1681_d.json';
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
