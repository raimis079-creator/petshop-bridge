process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIGszIOKAlCBSRUFELU9OTFk6IHVwbF9jYXQgZmFpbHUgYnV2aW1hcyBkaXNrZSwgLy9wZXRzaG9wLmx0IG51b3JvZHUga2lla2lzIHR1cmlueWplLCBkZXYgY2VydG8gZ2FsaW9qaW1hcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzZrMyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjM2IGszJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkSj1mdW5jdGlvbigkbyl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfTsKICB0cnl7CiAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGQ9JHVwWydiYXNlZGlyJ10uJy8yMDI2LzA3Lyc7CiAgZm9yZWFjaChhcnJheSgndXBsX2NhdC1zdW5pbXMtdjIud2VicCcsJ3VwbF9jYXQta2F0ZW1zLXYyLndlYnAnLCd1cGxfY2F0LWdyYXV6aWthbXMtdjIud2VicCcsJ3VwbF9jYXQtcGF1a3NjaWFtcy12Mi53ZWJwJywndXBsX2NhdC16dXZpbXMtdjIud2VicCcpIGFzICRmKXsgJG9bJ2ZhaWxhaSddWyRmXT1maWxlX2V4aXN0cygkZC4kZik/ZmlsZXNpemUoJGQuJGYpOjA7IH0KICAkb1sndXBsX3Zpc2knXT1jb3VudChnbG9iKCRkLid1cGxfKicpKTsKICAkYz1nZXRfcG9zdCgoaW50KWdldF9vcHRpb24oJ3BhZ2Vfb25fZnJvbnQnKSktPnBvc3RfY29udGVudDsKICAkb1sncGV0c2hvcF9sdF9udW9yb2R1X3R1cmlueWplJ109c3Vic3RyX2NvdW50KCRjLCcvL3BldHNob3AubHQvJyk7CiAgJG9bJ2Rldl9hdmVzYV9udW9yb2R1J109c3Vic3RyX2NvdW50KCRjLCdkZXYuYXZlc2EubHQnKTsKICAvLyBjZXJ0YXM6IHNzbHZlcmlmeT10cnVlIGkgc2F2ZQogICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vZGV2LmF2ZXNhLmx0LycsYXJyYXkoJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+dHJ1ZSkpOwogICRvWydjZXJ0J109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOignT0sgJy53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcikpOwogICRjeD1zdHJlYW1fY29udGV4dF9jcmVhdGUoYXJyYXkoJ3NzbCc9PmFycmF5KCdjYXB0dXJlX3BlZXJfY2VydCc9PnRydWUsJ3ZlcmlmeV9wZWVyJz0+ZmFsc2UsJ3ZlcmlmeV9wZWVyX25hbWUnPT5mYWxzZSkpKTsKICAkcz1Ac3RyZWFtX3NvY2tldF9jbGllbnQoJ3NzbDovL2Rldi5hdmVzYS5sdDo0NDMnLCRlMSwkZTIsMTUsU1RSRUFNX0NMSUVOVF9DT05ORUNULCRjeCk7CiAgaWYoJHMpeyAkcHI9c3RyZWFtX2NvbnRleHRfZ2V0X3BhcmFtcygkcyk7ICRjcnQ9b3BlbnNzbF94NTA5X3BhcnNlKCRwclsnb3B0aW9ucyddWydzc2wnXVsncGVlcl9jZXJ0aWZpY2F0ZSddKTsgJG9bJ2NlcnRfY24nXT0kY3J0WydzdWJqZWN0J11bJ0NOJ10/Pyc/JzsgJG9bJ2NlcnRfaWtpJ109ZGF0ZSgnWS1tLWQgSDppJywkY3J0Wyd2YWxpZFRvX3RpbWVfdCddKTsgfQogICRKKCRvKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgJEooJG8pOyB9Cn0sOTkpOwo=';
const VER='dep-160015';
const GKEY='ps_s1636k3';
const PHASES=["K3"];
const OUT='analize/s1636_k3.json';
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
