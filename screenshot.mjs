process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU0ZiAxMC0wNSBhZGQtdG8tY2FydCA0MDM6IFVSTCBmb3Jtb3MsIG1ldG9kYWksIFVBLCBJUCwgYXIgdGllIElQIGtyYXVuYSBpciBKUy9DU1MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzU0ZiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgJHI9Wyd2Jz0+J1MxNzU0ZiddOwogICRkb209ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MnOyAkZmlsZXM9WydPY3QtMjAyNi50YXIuZ3ouMicsJ09jdC0yMDI2LnRhci5nei4xJ107CiAgJGF0Yz1bXTsgJGlwcz1bXTsgJGZvcm1hPVtdOyAkbWV0PVtdOyAkdWE9W107ICR2YWw9W107ICRyZWY9W107ICRzdF9hdGM9W107ICRraXRpX2lwPVtdOyAkcHZ6PVtdOwogICRpcG09ZnVuY3Rpb24oJGkpeyByZXR1cm4gcHJlZ19yZXBsYWNlKCcvXihcZCtcLlxkKylcLlxkK1wuXGQrJC8nLCckMS54LngnLCRpKTsgfTsKICAvLyAxIHByYWVqaW1hczogYWRkLXRvLWNhcnQgdXprbGF1c29zCiAgJHZpc2k9W107CiAgZm9yZWFjaCgkZmlsZXMgYXMgJGZuKXsgJGg9QGd6b3BlbigkZG9tLicvJy4kZm4sJ3JiJyk7IGlmKCEkaCkgY29udGludWU7IGd6cmVhZCgkaCw1MTIpOwogICAgd2hpbGUoKCRsbj1nemdldHMoJGgsMTYzODQpKSE9PWZhbHNlKXsgaWYoIXByZWdfbWF0Y2goJy9eKFxTKykgXFMrIFxTKyBcW1xkK1wvXHcrXC9cZCs6KFxkXGQpOlteXF1dKlxdICIoXFMrKSAoXFMrKVteIl0qIiAoXGR7M30pIFxTKyAiKFteIl0qKSIgIihbXiJdKikiLycsJGxuLCRtKSkgY29udGludWU7CiAgICAgICR2aXNpW109WyRtWzFdLCRtWzRdLCRtWzVdLCRtWzddXTsKICAgICAgaWYoc3RycG9zKCRtWzRdLCdhZGQtdG8tY2FydCcpPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICAkc3RfYXRjWyRtWzVdXT0oJHN0X2F0Y1skbVs1XV0/PzApKzE7IGlmKCRtWzVdIT09JzQwMycpIGNvbnRpbnVlOwogICAgICAkaXBzWyRtWzFdXT0oJGlwc1skbVsxXV0/PzApKzE7ICRtZXRbJG1bM11dPSgkbWV0WyRtWzNdXT8/MCkrMTsgJHZhbFskbVsyXV09KCR2YWxbJG1bMl1dPz8wKSsxOwogICAgICAkZj1wcmVnX3JlcGxhY2UoJy9cZCsvJywnTicscHJlZ19yZXBsYWNlKCcjXi9bXj9dKiMnLHN0cnBvcygkbVs0XSwnL3Byb2R1Y3QvJyk9PT0wPycvcHJvZHVjdC/igKYnOihzdHJwb3MoJG1bNF0sJy9rYXRlZ29yaWphLycpPT09MD8nL2thdGVnb3JpamEv4oCmJzpwYXJzZV91cmwoJG1bNF0sUEhQX1VSTF9QQVRIKSksJG1bNF0pKTsgJGZvcm1hW21iX3N1YnN0cigkZiwwLDgwKV09KCRmb3JtYVttYl9zdWJzdHIoJGYsMCw4MCldPz8wKSsxOwogICAgICAkdT1tYl9zdWJzdHIoJG1bN10sMCw5MCk7ICR1YVskdV09KCR1YVskdV0/PzApKzE7ICRyZD1wYXJzZV91cmwoJG1bNl0sUEhQX1VSTF9IT1NUKT86JG1bNl07ICRyZWZbJHJkXT0oJHJlZlskcmRdPz8wKSsxOwogICAgICBpZihjb3VudCgkcHZ6KTw0KSAkcHZ6W109JGlwbSgkbVsxXSkuJyAnLiRtWzNdLicgJy5tYl9zdWJzdHIoJG1bNF0sMCwxMTApLicgfCByZWYgJy5tYl9zdWJzdHIoJG1bNl0sMCw2MCk7IH0gZ3pjbG9zZSgkaCk7IH0KICAvLyAyOiBrYSBkYXIgdGllIElQIGRhcsSXCiAgJGtpZWs9Wyd0aWtfYXRjJz0+MCwnc3Vfa2l0YWlzJz0+MCwnc3Vfc3RhdGlrYSc9PjBdOyAka2l0YV92ZWlrbGE9W107CiAgJHBlcl9pcD1bXTsgZm9yZWFjaCgkdmlzaSBhcyAkdil7IGlmKCFpc3NldCgkaXBzWyR2WzBdXSkpIGNvbnRpbnVlOyAkdD1zdHJwb3MoJHZbMV0sJ2FkZC10by1jYXJ0JykhPT1mYWxzZT8nYXRjJzoocHJlZ19tYXRjaCgnI1wuKGNzc3xqc3xqcGU/Z3xwbmd8d2VicHxzdmd8d29mZjI/KShcP3wkKSMnLCR2WzFdKT8nc3RhdGlrYSc6J2tpdGEnKTsgJHBlcl9pcFskdlswXV1bJHRdPSgkcGVyX2lwWyR2WzBdXVskdF0/PzApKzE7IGlmKCR0PT09J2tpdGEnKXsgJGs9cHJlZ19yZXBsYWNlKCcvXGQrLycsJ04nLG1iX3N1YnN0cihwYXJzZV91cmwoJHZbMV0sUEhQX1VSTF9QQVRIKT86JycsMCw0MCkpLicgJy4kdlsyXTsgJGtpdGFfdmVpa2xhWyRrXT0oJGtpdGFfdmVpa2xhWyRrXT8/MCkrMTsgfSB9CiAgZm9yZWFjaCgkcGVyX2lwIGFzICRpPT4kYyl7IGlmKGVtcHR5KCRjWydraXRhJ10pJiZlbXB0eSgkY1snc3RhdGlrYSddKSkgJGtpZWtbJ3Rpa19hdGMnXSsrOyBlbHNlICRraWVrWydzdV9raXRhaXMnXSsrOyBpZighZW1wdHkoJGNbJ3N0YXRpa2EnXSkpICRraWVrWydzdV9zdGF0aWthJ10rKzsgfQogIGFyc29ydCgkaXBzKTsgYXJzb3J0KCRmb3JtYSk7IGFyc29ydCgkdWEpOyBrc29ydCgkdmFsKTsgYXJzb3J0KCRyZWYpOyBhcnNvcnQoJGtpdGFfdmVpa2xhKTsKICAkcHI9W107IGZvcmVhY2goYXJyYXlfa2V5cygkaXBzKSBhcyAkaSl7ICRwPWV4cGxvZGUoJy4nLCRpKTsgJHByWyRwWzBdXT0oJHByWyRwWzBdXT8/MCkrMTsgfSBhcnNvcnQoJHByKTsKICAkcis9WydhdGNfc3RhdHVzYWknPT4kc3RfYXRjLCdpcF91bmlrJz0+Y291bnQoJGlwcyksJ2lwX2RhdWdpYXVzaWEnPT5hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJGssJHYpIHVzZSgkaXBtKXtyZXR1cm4gWyRpcG0oJGspLCR2XTt9LGFycmF5X2tleXMoJGlwcyksJGlwcyksMCw2KSwnaXBfcGlybWFzX2JhaXRhc190b3AnPT5hcnJheV9zbGljZSgkcHIsMCwxMCx0cnVlKSwnbWV0b2RhaSc9PiRtZXQsJ2Zvcm1vcyc9PmFycmF5X3NsaWNlKCRmb3JtYSwwLDgsdHJ1ZSksJ3VhX3RvcCc9PmFycmF5X3NsaWNlKCR1YSwwLDgsdHJ1ZSksJ3VhX3VuaWsnPT5jb3VudCgkdWEpLCd2YWxhbmRvcyc9PiR2YWwsJ3JlZmVyZXInPT5hcnJheV9zbGljZSgkcmVmLDAsNix0cnVlKSwnaXBfZWxnc2VuYSc9PiRraWVrLCdraXRhX3ZlaWtsYSc9PmFycmF5X3NsaWNlKCRraXRhX3ZlaWtsYSwwLDEwLHRydWUpLCdwdnonPT4kcHZ6XTsKICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-064714';
const GKEY='ps_s1754f';
const PHASES=["1"];
const OUT='out/s1754_f.json';
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
