process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY4YSBQcmFnbWEga2xhaWRvcyByZWNvbiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjhhJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg2OGEnXTsKICAkZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmFnbWEvcGV0c2hvcC1wcmFnbWEucGhwJzsgJEw9ZmlsZSgkZik7ICRyWydtZDUnXT1tZDVfZmlsZSgkZik7ICRyWyduJ109Y291bnQoJEwpOyAkb3V0PVtdOwogIGZvcmVhY2goJEwgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2tub3dufGNsaWVudF9pZHxrbGllbnRvX2lkfGltb25lc3xmdW5jdGlvbiB8XCcyXCd8XCczXCd8XCc1XCd8Y29tcGFueXx2YXR8aW1vbmVzX2tvZGFzfHB2bV9rb2QvaScsJGwpKSAkb3V0WyRpKzFdPXJ0cmltKCRsKTsgfSAkclsna29kYXMnXT0kb3V0OwogICRhdnBuPVsnQVZQTjAxMTUzOScsJ0FWUE4wMTE0OTgnLCdBVlBOMDExNDkzJywnQVZQTjAxMTQ5NScsJ0FWUE4wMTE0NjEnLCdBVlBOMDExNDY0JywnQVZQTjAxMTQ2NycsJ0FWUE4wMTE0NDcnLCdBVlBOMDExNDQxJywnQVZQTjAxMTQyMycsJ0FWUE4wMTE0MTYnLCdBVlBOMDExNDUyJywnQVZQTjAxMTQwNScsJ0FWUE4wMTE0MDQnLCdBVlBOMDExNDAxJywnQVZQTjAxMTM5OScsJ0FWUE4wMTEzNjYnLCdBVlBOMDExMzY4JywnQVZQTjAxMTQxMScsJ0FWUE4wMTEzNzcnLCdBVlBOMDExMzU5JywnQVZQTjAxMTM1MScsJ0FWUE4wMTEyOTknLCdBVlBOMDExMjc4JywnQVZQTjAxMTI4MicsJ0FWUE4wMTEyNzQnXTsKICAka25vd249Z2V0X29wdGlvbigncGV0c2hvcF9wcmFnbWFfa25vd25fZW1haWxzJyk7ICRyWydrbm93bl9uJ109aXNfYXJyYXkoJGtub3duKT9jb3VudCgka25vd24pOihpc19zdHJpbmcoJGtub3duKT9zdHJsZW4oJGtub3duKTpudWxsKTsgJHJbJ2tub3duX3R5cGUnXT1nZXR0eXBlKCRrbm93bik7CiAgZm9yZWFjaCgkYXZwbiBhcyAkYSl7ICRvaWQ9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX3ZhbHVlPSVzIEFORCBtZXRhX2tleSBMSUtFICclJWludm9pY2UlJW51bWJlciUlJyBMSU1JVCAxIiwkYSkpOyBpZighJG9pZCkgJG9pZD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9yZGVyX2lkIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfdmFsdWU9JXMgTElNSVQgMSIsJGEpKTsKICAgICRvPSRvaWQ/d2NfZ2V0X29yZGVyKCRvaWQpOm51bGw7IGlmKCEkbyl7ICRyWydlaWwnXVskYV09J25lcmFzdGEnOyBjb250aW51ZTsgfQogICAgJGVtPXN0cnRvbG93ZXIoJG8tPmdldF9iaWxsaW5nX2VtYWlsKCkpOyAkcHJldj0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIGJpbGxpbmdfZW1haWw9JXMgQU5EIGlkPCVkIEFORCBzdGF0dXMgSU4oJ3djLWNvbXBsZXRlZCcsJ3djLXByb2Nlc3NpbmcnKSIsJGVtLCRvaWQpKTsKICAgICRyWydlaWwnXVskYV09WydvaWQnPT4kb2lkLCducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ2ltb25lJz0+JG8tPmdldF9iaWxsaW5nX2NvbXBhbnkoKSwnbWV0YV9rb2RhaSc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKGZuKCRtKT0+JG0tPmtleS4nPScuJG0tPnZhbHVlLCRvLT5nZXRfbWV0YV9kYXRhKCkpLGZuKCRzKT0+cHJlZ19tYXRjaCgnL2tvZHx2YXR8cHZtfGNvbXBhbnl8aW1vbnxwcmFnbWEvaScsJHMpKSksJ2tub3duJz0+aXNfYXJyYXkoJGtub3duKT9pbl9hcnJheSgkZW0sJGtub3duLHRydWUpfHxpc3NldCgka25vd25bJGVtXSk6bnVsbCwnYW5rc3Rlc25pJz0+JHByZXYsJ2Vrc3AnPT4kby0+Z2V0X21ldGEoJ19wc19wcmFnbWFfZWtzcG9ydHVvdGEnKV07CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-161114';
const GKEY='ps_s1868a';
const PHASES=["1"];
const OUT='analize/s1868_a.json';
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
