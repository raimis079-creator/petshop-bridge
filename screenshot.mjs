process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxZCByZWNvbiByZWFkLW9ubHk6IFdQQUkgdHJpZ2dlci9wcm9jZXNzaW5nIGhpdCdhaSBhY2Nlc3MgbG9nZSAoMDA6MTAtMDQ6MDUpLCBwbXhpIGJ1c2VuYSwga2FzIGlza3ZpZXRlIHBpbG5hIGNhY2hlIHZhbHltYSAocGhwX2Vycm9yIHJtZGlyIGxhaWthaSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzIxZCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcyMWQnXTsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzIxZCcsJ2ZhemUnPT4kZl07ICRUMD1taWNyb3RpbWUodHJ1ZSk7CiAgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgJHE9ZnVuY3Rpb24oJHNxbCkgdXNlICgkd3BkYiwmJHIpeyAkeD0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgaWYoJHdwZGItPmxhc3RfZXJyb3IpeyAkclsnU1FMX0VSUiddW109bWJfc3Vic3RyKCR3cGRiLT5sYXN0X2Vycm9yLDAsMjAwKTsgfSByZXR1cm4gJHg7IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRyWydkYWJhciddPShuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnSDppOnMnKTsKICAgICRyWyd3cGFpX2hpc3RfZGFiYXInXT0kcSgiU0VMRUNUIGltcG9ydF9pZCBpLCB0eXBlLCB0aW1lX3J1biB0LCBkYXRlIEZST00geyRQfXBteGlfaGlzdG9yeSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDgiKTsKICAgICRyWyd3cGFpX2ltcG9ydHMnXT0kcSgiU0VMRUNUIGlkLHByb2Nlc3NpbmcsZXhlY3V0aW5nLHRyaWdnZXJlZCxxdWV1ZV9jaHVua19udW1iZXIsbGFzdF9hY3Rpdml0eSBGUk9NIHskUH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQgSU4oMiwzLDUsNykiKTsKICAgIC8vIFdQQUkgaGl0J2FpIGFjY2VzcyBsb2dlICh0YXIuZ3ogMDA6MTAtMDQ6MDUgaXIgdmFrYXIgLjEgMDQ6MjMtMDA6MTApCiAgICBmb3JlYWNoKFsnU2VwLTIwMjYudGFyLmd6JywnU2VwLTIwMjYudGFyLmd6LjEnXSBhcyAkayl7ICRmeD1kaXJuYW1lKEFCU1BBVEgpLicvbG9ncy8nLiRrOyBpZighZmlsZV9leGlzdHMoJGZ4KSkgY29udGludWU7ICRnej1maWxlX2dldF9jb250ZW50cygkZngpOyAkdGFyPUBnemRlY29kZSgkZ3opOyB1bnNldCgkZ3opOyAkbGVuPXN0cmxlbigkdGFyKTsgJHBvcz0wOyAkdHh0PScnOwogICAgICB3aGlsZSgkcG9zKzUxMjw9JGxlbil7ICRoPXN1YnN0cigkdGFyLCRwb3MsNTEyKTsgaWYodHJpbSgkaCwiXDAiKT09PScnKSBicmVhazsgJG5hbWU9cnRyaW0oc3Vic3RyKCRoLDAsMTAwKSwiXDAiKTsgJHNpemU9b2N0ZGVjKHRyaW0oc3Vic3RyKCRoLDEyNCwxMikpKTsgJHR5cGU9c3Vic3RyKCRoLDE1NiwxKTsgJHBvcys9NTEyOyBpZigoJHR5cGU9PT0nMCd8fCR0eXBlPT09IlwwInx8JHR5cGU9PT0nJykmJnByZWdfbWF0Y2goJy9sb2ckfGFjY2Vzc3xwZXRzaG9wL2knLCRuYW1lKSYmIXByZWdfbWF0Y2goJy9lcnJvcnxkZXZcLi9pJywkbmFtZSkpICR0eHQuPXN1YnN0cigkdGFyLCRwb3MsJHNpemUpOyAkcG9zKz1jZWlsKCRzaXplLzUxMikqNTEyOyB9CiAgICAgIHVuc2V0KCR0YXIpOyAkaGl0cz1bXTsgJGNudD1bXTsKICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJHR4dCkgYXMgJGxuKXsgaWYoc3RycG9zKCRsbiwnaW1wb3J0X2tleT0nKT09PWZhbHNlKSBjb250aW51ZTsgaWYoIXByZWdfbWF0Y2goJy9cWyhcZFxkKVwvXHd7M31cL1xkezR9OihcZFxkKTooXGRcZClbXlxdXSpcXSAiKFxTKykgKFxTKylbXiJdKiIgKFxkezN9KS8nLCRsbiwkbSkpIGNvbnRpbnVlOyBwYXJzZV9zdHIoc3Vic3RyKCRtWzVdLHN0cnBvcygkbVs1XSwnPycpKzEpLCRnKTsgJGtleT0oJGdbJ2ltcG9ydF9pZCddPz8nPycpLicgJy4oJGdbJ2FjdGlvbiddPz8nPycpOyAkY250WyRrZXldPSgkY250WyRrZXldPz8wKSsxOyBpZigoJGdbJ2FjdGlvbiddPz8nJyk9PT0ndHJpZ2dlcicpeyAkaGl0c1tdPSRtWzFdLicgJy4kbVsyXS4nOicuJG1bM10uJyAnLiRrZXkuJyAnLiRtWzZdOyB9IH0KICAgICAgdW5zZXQoJHR4dCk7ICRyWyRrXT1bJ2tpZWsnPT4kY250LCd0cmlnZ2VyX2hpdGFpJz0+YXJyYXlfc2xpY2UoJGhpdHMsMCw2MCldOyB9CiAgICAvLyBwaHBfZXJyb3IubG9nOiBrYWRhIGJ1dm8gbWFzaW5pYWkgcm1kaXIgKHBpbG5hcyB2YWx5bWFzKSDigJQgZ3J1cHVvdGkgcGFnYWwgbWludXRlCiAgICAkbGY9aW5pX2dldCgnZXJyb3JfbG9nJyk7IGlmKCRsZiYmaXNfZmlsZSgkbGYpKXsgJHN6PWZpbGVzaXplKCRsZik7ICRoPWZvcGVuKCRsZiwncicpOyBmc2VlaygkaCxtYXgoMCwkc3otODAwMDAwKSk7ICR0eD1zdHJlYW1fZ2V0X2NvbnRlbnRzKCRoKTsgZmNsb3NlKCRoKTsgJG1pbj1bXTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJHR4KSBhcyAkbG4peyBpZihzdHJwb3MoJGxuLCdybWRpcignKT09PWZhbHNlKSBjb250aW51ZTsgaWYoIXByZWdfbWF0Y2goJyNeXFsoXGRcZC1cd3szfS1cZHs0fSBcZFxkOlxkXGQpOlxkXGQgKFteXF1dKylcXSMnLCRsbiwkbSkpIGNvbnRpbnVlOyAkZHQ9RGF0ZVRpbWU6OmNyZWF0ZUZyb21Gb3JtYXQoJ2QtTS1ZIEg6aScsJG1bMV0sbmV3IERhdGVUaW1lWm9uZSgkbVsyXT09J1VUQyc/J1VUQyc6J0V1cm9wZS9WaWxuaXVzJykpOyBpZighJGR0KSBjb250aW51ZTsgJGR0LT5zZXRUaW1lem9uZSgkdHopOyAkaz0kZHQtPmZvcm1hdCgnbS1kIEg6aScpOyAkbWluWyRrXT0oJG1pblska10/PzApKzE7IH0ga3NvcnQoJG1pbik7ICRyWydybWRpcl9taW51dGVzJ109YXJyYXlfc2xpY2UoJG1pbiwtNDAsNDAsdHJ1ZSk7IH0KICAgIC8vIHNhcmdvIGtsYWlkb3M6IHJtZGlyIGlyYXNhaSBzdSBVUkwgcGVyIHBhc2t1dGluZXMgMzAgdmFsLiAoa2FzIGt2aWV0ZSkKICAgICRyWydybWRpcl91cmwnXT0kcSgiU0VMRUNUIERBVEVfRk9STUFUKGxhaWthcywnJW0tJWQgJUg6JWknKSBsLCBMRUZUKHVybCw3MCkgdSwgU1VNKGtpZWspIGssIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfc2FyZ2FzX2tsYWlkb3MgV0hFUkUgemludXRlIExJS0UgJ3JtZGlyJScgQU5EIGxhaWthcz49Tk9XKCktSU5URVJWQUwgMzAgSE9VUiBHUk9VUCBCWSAxLDIgT1JERVIgQlkgbGFpa2FzIERFU0MgTElNSVQgNDAiKTsKICAgICRyWyd0cnVrbWVfcyddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kVDAsMSk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRyWyd0cnVrbWVfcyddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kVDAsMSk7ICRyWydtZW1fbWInXT1yb3VuZChtZW1vcnlfZ2V0X3BlYWtfdXNhZ2UodHJ1ZSkvMTA0ODU3Nik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-104547';
const GKEY='ps_s1721d';
const PHASES=["1"];
const OUT='analize/s1721_d.json';
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
