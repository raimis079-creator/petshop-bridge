process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODYxYSBEb3Zhbm9zIGkgbWVuaXUgKFJBU08pICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg2MWEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE4NjFhJ107CiAgdHJ5ewogICAgJGxvYz1nZXRfbmF2X21lbnVfbG9jYXRpb25zKCk7ICRyWydsb2MnXT0kbG9jOwogICAgJG1pZD0wOyBmb3JlYWNoKFsncHJpbWFyeScsJ21haW5fbmF2JywncHJpbWFyeV9uYXZpZ2F0aW9uJywnaGVhZGVyJ10gYXMgJGspeyBpZighZW1wdHkoJGxvY1ska10pKXsgJG1pZD0oaW50KSRsb2NbJGtdOyAkclsndmlldGEnXT0kazsgYnJlYWs7IH0gfQogICAgaWYoISRtaWQpeyAkclsnZXJyJ109J25lcmFzdGFzIHBhZ3JpbmRpbmlzIG1lbml1JzsgdGhyb3cgbmV3IEV4Y2VwdGlvbigneCcpOyB9CiAgICAkaXRlbXM9d3BfZ2V0X25hdl9tZW51X2l0ZW1zKCRtaWQpOyAkdG9wPVtdOwogICAgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsgaWYoKGludCkkaXQtPm1lbnVfaXRlbV9wYXJlbnQ9PT0wKSAkdG9wW109WyRpdC0+SUQsJGl0LT5tZW51X29yZGVyLCRpdC0+dGl0bGUsJGl0LT5vYmplY3QsJGl0LT5vYmplY3RfaWRdOyB9CiAgICAkclsncHJpZXMnXT0kdG9wOwogICAgJHlyYT1mYWxzZTsgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsgaWYoJGl0LT5vYmplY3Q9PT0ncHJvZHVjdF9jYXQnICYmIChpbnQpJGl0LT5vYmplY3RfaWQ9PT0xMTkpICR5cmE9JGl0LT5JRDsgfQogICAgaWYoJHlyYSl7ICRyWydyZXp1bHRhdGFzJ109J2phdSB5cmEgJy4keXJhOyB9CiAgICBlbHNlIHsKICAgICAgJHBvcz0wOyBmb3JlYWNoKCRpdGVtcyBhcyAkaXQpeyBpZigoaW50KSRpdC0+bWVudV9pdGVtX3BhcmVudD09PTAgJiYgKGludCkkaXQtPklEPT09MzQxMjcpeyAkcG9zPShpbnQpJGl0LT5tZW51X29yZGVyOyB9IH0KICAgICAgaWYoJHBvcyl7IGZvcmVhY2goJGl0ZW1zIGFzICRpdCl7IGlmKChpbnQpJGl0LT5tZW51X29yZGVyPj0kcG9zKXsgd3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpdC0+SUQsJ21lbnVfb3JkZXInPT4kaXQtPm1lbnVfb3JkZXIrMV0pOyB9IH0gfQogICAgICAkbmlkPXdwX3VwZGF0ZV9uYXZfbWVudV9pdGVtKCRtaWQsMCxbJ21lbnUtaXRlbS10aXRsZSc9PidET1ZBTk9TJywnbWVudS1pdGVtLW9iamVjdCc9Pidwcm9kdWN0X2NhdCcsJ21lbnUtaXRlbS1vYmplY3QtaWQnPT4xMTksJ21lbnUtaXRlbS10eXBlJz0+J3RheG9ub215JywnbWVudS1pdGVtLXN0YXR1cyc9PidwdWJsaXNoJywnbWVudS1pdGVtLXBhcmVudC1pZCc9PjAsJ21lbnUtaXRlbS1wb3NpdGlvbic9PiRwb3M/OjBdKTsKICAgICAgaWYoIWlzX3dwX2Vycm9yKCRuaWQpICYmICRwb3MpIHdwX3VwZGF0ZV9wb3N0KFsnSUQnPT4kbmlkLCdtZW51X29yZGVyJz0+JHBvc10pOwogICAgICAkc3ViPWdldF90ZXJtX2J5KCdzbHVnJywna2FsZWRpbmVzLWRvdmFub3MnLCdwcm9kdWN0X2NhdCcpOwogICAgICBpZigkc3ViICYmICFpc193cF9lcnJvcigkbmlkKSkgJHJbJ3N1YiddPXdwX3VwZGF0ZV9uYXZfbWVudV9pdGVtKCRtaWQsMCxbJ21lbnUtaXRlbS10aXRsZSc9PidLYWzEl2RpbsSXcyBkb3Zhbm9zJywnbWVudS1pdGVtLW9iamVjdCc9Pidwcm9kdWN0X2NhdCcsJ21lbnUtaXRlbS1vYmplY3QtaWQnPT4kc3ViLT50ZXJtX2lkLCdtZW51LWl0ZW0tdHlwZSc9Pid0YXhvbm9teScsJ21lbnUtaXRlbS1zdGF0dXMnPT4ncHVibGlzaCcsJ21lbnUtaXRlbS1wYXJlbnQtaWQnPT4kbmlkXSk7CiAgICAgICRyWydyZXp1bHRhdGFzJ109aXNfd3BfZXJyb3IoJG5pZCk/JG5pZC0+Z2V0X2Vycm9yX21lc3NhZ2UoKToncHJpZMSXdGEgJy4kbmlkLicgcG96aWNpamEgJy4kcG9zOwogICAgfQogICAgJHJbJ3BvJ109YXJyYXlfdmFsdWVzKGFycmF5X21hcChmdW5jdGlvbigkaXQpe3JldHVybiBbJGl0LT5JRCwkaXQtPm1lbnVfb3JkZXIsJGl0LT50aXRsZV07fSxhcnJheV9maWx0ZXIod3BfZ2V0X25hdl9tZW51X2l0ZW1zKCRtaWQpLGZ1bmN0aW9uKCRpdCl7cmV0dXJuIChpbnQpJGl0LT5tZW51X2l0ZW1fcGFyZW50PT09MDt9KSkpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyBpZihlbXB0eSgkclsnZXJyJ10pKSAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-194314';
const GKEY='ps_s1861a';
const PHASES=["1"];
const OUT='analize/s1861_a.json';
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
