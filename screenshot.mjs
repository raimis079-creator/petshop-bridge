process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjcgZiDigJQgRTogZGxfdXJsL3ZlaWtzbW9fdXJsICZhbXA7IGR2aWd1YmEgZXNjOyBUOiBwYXRpa3JhLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZiA9IGlzc2V0KCRfR0VUWydwc19zMTY2N2YnXSkgPyAkX0dFVFsncHNfczE2NjdmJ10gOiAnJzsKICBpZiAoJGYhPT0nRScgJiYgJGYhPT0nVCcpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY2NyBmJywnZmF6ZSc9PiRmKTsKICAkcD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCc7CiAgdHJ5ewogICAgaWYoJGY9PT0nRScpewogICAgICAkYz1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgICRvWydtZDVfcHJpZXMnXT1tZDUoJGMpOyAkb1snZHlkaXNfcHJpZXMnXT1zdHJsZW4oJGMpOwoKICAgICAgJHJlcD1hcnJheSgKICAgICAgICAvLyAxLiBwYWdhbGJpbmlzIG1ldG9kYXMgcHJpZXMgZGxfdXJsCiAgICAgICAgYXJyYXkoCiAgICAgICAgICAiXHRwcm90ZWN0ZWQgc3RhdGljIGZ1bmN0aW9uIGRsX3VybCggXCR2LCBcJGlkLCBcJGV4dHJhID0gYXJyYXkoKSApIHsiLAogICAgICAgICAgIlx0cHJvdGVjdGVkIHN0YXRpYyBmdW5jdGlvbiBkZWsoIFwkdSApIHsgcmV0dXJuIGh0bWxfZW50aXR5X2RlY29kZSggKHN0cmluZykgXCR1LCBFTlRfUVVPVEVTLCAnVVRGLTgnICk7IH1cblxuXHRwcm90ZWN0ZWQgc3RhdGljIGZ1bmN0aW9uIGRsX3VybCggXCR2LCBcJGlkLCBcJGV4dHJhID0gYXJyYXkoKSApIHsiCiAgICAgICAgKSwKICAgICAgICAvLyAyLiBkbF91cmwgYXB2YWxrYWxhcwogICAgICAgIGFycmF5KAogICAgICAgICAgIlx0XHRyZXR1cm4gd3Bfbm9uY2VfdXJsKCBhZG1pbl91cmwoICdhZG1pbi1wb3N0LnBocD8nIC4gaHR0cF9idWlsZF9xdWVyeSgiLAogICAgICAgICAgIlx0XHRyZXR1cm4gc2VsZjo6ZGVrKCB3cF9ub25jZV91cmwoIGFkbWluX3VybCggJ2FkbWluLXBvc3QucGhwPycgLiBodHRwX2J1aWxkX3F1ZXJ5KCIKICAgICAgICApLAogICAgICAgIGFycmF5KAogICAgICAgICAgIiApLCAncHNfZGxfJyAuIFwkdiAuICdfJyAuIChpbnQpIFwkaWQgKTsiLAogICAgICAgICAgIiApLCAncHNfZGxfJyAuIFwkdiAuICdfJyAuIChpbnQpIFwkaWQgKSApOyIKICAgICAgICApLAogICAgICAgIC8vIDMuIHZlaWtzbW9fdXJsIGFwdmFsa2FsYXMKICAgICAgICBhcnJheSgKICAgICAgICAgICJcdFx0cmV0dXJuIHdwX25vbmNlX3VybCggYWRtaW5fdXJsKCAnYWRtaW4tcG9zdC5waHA/YWN0aW9uPXBzX2Rlc2tfdmVpa3NtYXMiLAogICAgICAgICAgIlx0XHRyZXR1cm4gc2VsZjo6ZGVrKCB3cF9ub25jZV91cmwoIGFkbWluX3VybCggJ2FkbWluLXBvc3QucGhwP2FjdGlvbj1wc19kZXNrX3ZlaWtzbWFzIgogICAgICAgICksCiAgICAgICAgYXJyYXkoCiAgICAgICAgICAiICksICdwc19kZXNrXycgLiBcJHYgLiAnXycgLiAoaW50KSBcJGlkICk7IiwKICAgICAgICAgICIgKSwgJ3BzX2Rlc2tfJyAuIFwkdiAuICdfJyAuIChpbnQpIFwkaWQgKSApOyIKICAgICAgICApLAogICAgICApOwogICAgICBmb3JlYWNoKCRyZXAgYXMgJGk9PiRyKXsKICAgICAgICAkbj1zdWJzdHJfY291bnQoJGMsJHJbMF0pOwogICAgICAgICRvWydyYWRpbmlhaSddWyRpXT0kbjsKICAgICAgICBpZigkbiE9PTEpeyAkb1snS0xBSURBJ109J3Bha2VpdGltYXMgJy4kaS4nIHJhZG8gJy4kbi4nIChyZWlraWEgMSknOyB3cF9zZW5kX2pzb24oJG8pOyB9CiAgICAgIH0KICAgICAgZm9yZWFjaCgkcmVwIGFzICRyKXsgJGM9c3RyX3JlcGxhY2UoJHJbMF0sJHJbMV0sJGMpOyB9CgogICAgICAkdD1AdG9rZW5fZ2V0X2FsbCgkYywgVE9LRU5fUEFSU0UpOwogICAgICBpZighJHQpeyAkb1snS0xBSURBJ109J1RPS0VOX1BBUlNFJzsgd3Bfc2VuZF9qc29uKCRvKTsgfQoKICAgICAgJGJhaz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CiAgICAgIGlmKCFpc19kaXIoJGJhaykpIEBta2RpcigkYmFrLDA3NTUsdHJ1ZSk7CiAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRiYWsuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocC5iYWtfczE2NjcnLCBmaWxlX2dldF9jb250ZW50cygkcCkpOwogICAgICBmaWxlX3B1dF9jb250ZW50cygkcCwkYyk7CiAgICAgICRvWydtZDVfcG8nXT1tZDUoZmlsZV9nZXRfY29udGVudHMoJHApKTsgJG9bJ2R5ZGlzX3BvJ109c3RybGVuKCRjKTsKICAgICAgJG9bJ2JhayddPSRiYWsuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocC5iYWtfczE2NjcnOwogICAgfSBlbHNlIHsKICAgICAgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGFyYmFsYXVraXMnLCdkbF91cmwnKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgICAgICR1PSRyLT5pbnZva2UobnVsbCwna2VsaWFzJywzNTg4MCxhcnJheSgnaWlkJz0+MCwnayc9Pid0aWVzaWFpJykpOwogICAgICAkb1sndXJsJ109JHU7CiAgICAgICRvWydBTVAnXT0oc3RycG9zKCR1LCcmYW1wOycpIT09ZmFsc2UpPydCTE9HQUknOidPSyc7CiAgICAgICRvWydmcm9udCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjE1KSkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-162502';
const GKEY='ps_s1667f';
const PHASES=["E", "T"];
const OUT='analize/s1667_f.json';
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
