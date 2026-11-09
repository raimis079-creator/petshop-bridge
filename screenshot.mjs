process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQyYSBmYXZpY29uIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg0MmEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDJhJ107CiAgJHJbJ3NpdGVfaWNvbiddPWdldF9vcHRpb24oJ3NpdGVfaWNvbicpOyAkclsnc2l0ZV9pY29uX3VybCddPWdldF9zaXRlX2ljb25fdXJsKDUxMik7CiAgJHJbJ2N1c3RvbV9sb2dvJ109Z2V0X3RoZW1lX21vZCgnY3VzdG9tX2xvZ28nKTsgJHJbJ2ZsX2xvZ28nXT1nZXRfdGhlbWVfbW9kKCdzaXRlX2xvZ28nKTsgJHJbJ2ZsX2xvZ29fZGFyayddPWdldF90aGVtZV9tb2QoJ3NpdGVfbG9nb19kYXJrJyk7ICRyWydmbF9mYXZpY29uJ109Z2V0X3RoZW1lX21vZCgnc2l0ZV9pY29uJyk7CiAgZm9yZWFjaChbJ2Zhdmljb24uaWNvJywnZmF2aWNvbi5wbmcnLCdhcHBsZS10b3VjaC1pY29uLnBuZyddIGFzICRmKXsgJHJbJ3Jvb3RfJy4kZl09ZmlsZV9leGlzdHMoQUJTUEFUSC4kZik/ZmlsZXNpemUoQUJTUEFUSC4kZik6bnVsbDsgfQogICRhPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUsZ3VpZCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCAocG9zdF90aXRsZSBMSUtFICclbG9nbyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWZhdmljb24lJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVpa29uYSUnIE9SIGd1aWQgTElLRSAnJWxvZ28lJyBPUiBndWlkIExJS0UgJyVmYXZpY29uJScpIE9SREVSIEJZIElEIERFU0MgTElNSVQgNDAiLEFSUkFZX0EpOwogIGZvcmVhY2goJGEgYXMgJiR4KXsgJG09d3BfZ2V0X2F0dGFjaG1lbnRfbWV0YWRhdGEoJHhbJ0lEJ10pOyAkeFsnd2gnXT0oJG1bJ3dpZHRoJ10/Pyc/JykuJ3gnLigkbVsnaGVpZ2h0J10/Pyc/Jyk7ICR4Wyd1cmwnXT13cF9nZXRfYXR0YWNobWVudF91cmwoJHhbJ0lEJ10pOyB1bnNldCgkeFsnZ3VpZCddKTsgfSAkclsnbG9nb19mYWlsYWknXT0kYTsKICAkaD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRoKTsgcHJlZ19tYXRjaF9hbGwoJy88bGlua1tePl0rcmVsPVsiXCddW14iXCddKmljb25bXiJcJ10qWyJcJ11bXj5dKj4vaScsJGIsJG0pOyAkclsnaGVhZF9pY29ucyddPSRtWzBdOwogIHByZWdfbWF0Y2goJy88aW1nW14+XStjbGFzcz0iW14iXSpoZWFkZXJbXy1dbG9nb1teIl0qIltePl0qPi9pJywkYiwkbTIpOyAkclsnaGVhZGVyX2xvZ29faW1nJ109JG0yWzBdPz9udWxsOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-192200';
const GKEY='ps_s1842a';
const PHASES=["1"];
const OUT='analize/s1842a.json';
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
