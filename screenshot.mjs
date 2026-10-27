process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA0YSBaQiBYTUwgc2luY2hyb25pemFjaWphIOKAlCBrYWRhIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwNGEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MDRhJywnZGFiYXInPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogIHRyeXsKICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cG14aV9pbXBvcnRzJyIpKXsKICAgICAgJHJbJ2ltcG9ydGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxmcmllbmRseV9uYW1lLHBhdGgscmVnaXN0ZXJlZF9vbixsYXN0X2FjdGl2aXR5LHRyaWdnZXJlZCxwcm9jZXNzaW5nLGV4ZWN1dGluZyxxdWV1ZV9jaHVua19udW1iZXIsaW1wb3J0ZWQsY3JlYXRlZCx1cGRhdGVkLHNraXBwZWQsY291bnQgRlJPTSB7JFB9cG14aV9pbXBvcnRzIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAgICAgJHJbJ2lzdG9yaWphJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaC5pZCxoLmltcG9ydF9pZCxoLnR5cGUsaC50aW1lX3J1bixoLmRhdGUsTEVGVChoLnN1bW1hcnksMjAwKSBzdW1tYXJ5IEZST00geyRQfXBteGlfaGlzdG9yeSBoIE9SREVSIEJZIGguaWQgREVTQyBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgICB9CiAgICAkclsnc291cmNlc196YiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgTUFYKHN5bmNlZF9hdCkgbWF4X3N5bmMsIE1JTihzeW5jZWRfYXQpIG1pbl9zeW5jLCBTVU0oc3luY2VkX2F0Pj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAxIERBWSkpIHBlcl9wYXJhLCBNQVgodXBkYXRlZF9hdCkgbWF4X3VwZCBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHNvdXJjZT0nemInIixBUlJBWV9BKTsKICAgICRyWydzb3VyY2VzX3ZmJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBNQVgoc3luY2VkX2F0KSBtYXhfc3luYywgTUFYKHVwZGF0ZWRfYXQpIG1heF91cGQgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBzb3VyY2U9J3ZmJyIsQVJSQVlfQSk7CiAgICAkbz1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgTEVGVChvcHRpb25fdmFsdWUsMzAwKSB2IEZST00geyRQfW9wdGlvbnMgV0hFUkUgKG9wdGlvbl9uYW1lIExJS0UgJyV6YiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV6YWxpb2ppJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfaW1wb3J0JScgT1Igb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF94bWwlJykgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICdfdHJhbnNpZW50JScgT1JERVIgQlkgb3B0aW9uX25hbWUgTElNSVQgNjAiLEFSUkFZX0EpIGFzICR4KSAkb1skeFsnb3B0aW9uX25hbWUnXV09JHhbJ3YnXTsgJHJbJ29wY2lqb3MnXT0kbzsKICAgICRjcj1bXTsgZm9yZWFjaCgoYXJyYXkpX2dldF9jcm9uX2FycmF5KCkgYXMgJHRzPT4kaCl7IGZvcmVhY2goJGggYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL3pifHhtbHxpbXBvcnR8cG14aXx2Zi9pJywkaykpICRjcltdPVskayx3cF9kYXRlKCdZLW0tZCBIOmknLCR0cyldOyB9IH0gJHJbJ2Nyb24nXT0kY3I7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-194204';
const GKEY='ps_s1804a';
const PHASES=["1"];
const OUT='analize/s1804a.json';
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
