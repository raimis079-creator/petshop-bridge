process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU0aSByb2JvdHUgVUEgcGF2eXpkemlhaSArIHRpa3JpbmltYXMsIGFyIHpvZHppYWkgbmVwYWdhdW5hIGdlcnUgVUEgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzU0aSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgJHI9Wyd2Jz0+J1MxNzU0aSddOwogICRaPVsnbWV0YS1leHRlcm5hbGFnZW50JywnQmFpZHVzcGlkZXInLCdBbWF6b25ib3QnLCdQZXRhbEJvdCcsJ3RwaG90b2JvdCcsJ2NvbXBhdGlibGU7IFJlZmxlY3QnLCdFeGFTZWFyY2hCb3QnLCdLZWVuYWJsZScsJ3dlYmFwcC1tYXBwZXInLCdCeXRlc3BpZGVyJywnU2VtcnVzaEJvdCcsJ1NFUmFua2luZycsJ0RvdEJvdCcsJ0FocmVmc0JvdCcsJ0RhdGFGb3JTZW9Cb3QnLCdNSjEyYm90J107CiAgJGxvdz1bJ2JhaWR1JywnYW1hem9uYm90JywncGV0YWxib3QnLCdzZW1ydXNoJywnYWhyZWZzJywnZG90Ym90Jywnc2VyYW5raW5nJywnZGF0YWZvcnNlbycsJ21qMTInLCdieXRlc3BpZGVyJywna2VlbmFibCcsJ3JlZmxlY3QnLCdleGFzZWFyY2gnLCd0cGhvdG8nLCd3ZWJhcHAtbWFwcGVyJywnbWV0YS1leHRlcm5hbGFnZW50J107CiAgJHBhZz1bXTsgJG5lYXRpdD1bXTsgJHB2ej1bXTsKICBmb3JlYWNoKFsnT2N0LTIwMjYudGFyLmd6LjInLCdPY3QtMjAyNi50YXIuZ3ouMSddIGFzICRmbil7ICRoPUBnem9wZW4oZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvJy4kZm4sJ3JiJyk7IGlmKCEkaCkgY29udGludWU7IGd6cmVhZCgkaCw1MTIpOwogICAgd2hpbGUoKCRsbj1nemdldHMoJGgsMTYzODQpKSE9PWZhbHNlKXsgaWYoIXByZWdfbWF0Y2goJy8iIFxkezN9IFxTKyAiW14iXSoiICIoW14iXSopIi8nLCRsbiwkbSkpIGNvbnRpbnVlOyAkdT0kbVsxXTsgJGhpdD1udWxsOwogICAgICBmb3JlYWNoKCRaIGFzICR6KXsgaWYoc3RycG9zKCR1LCR6KSE9PWZhbHNlKXsgJGhpdD0kejsgYnJlYWs7IH0gfQogICAgICBpZigkaGl0KXsgJHBhZ1skaGl0XT0oJHBhZ1skaGl0XT8/MCkrMTsgaWYoIWlzc2V0KCRwdnpbJGhpdF0pKSAkcHZ6WyRoaXRdPW1iX3N1YnN0cigkdSwwLDExMCk7CiAgICAgICAgaWYocHJlZ19tYXRjaCgnL0dvb2dsZWJvdHxiaW5nYm90fEFwcGxlYm90fEdQVEJvdHxDaGF0R1BUfE9BSS1TZWFyY2h8UGVycGxleGl0eXxDbGF1ZGV8ZmFjZWJvb2tleHRlcm5hbGhpdHxEdWNrRHVja3xZYW5kZXhCb3QvaScsJHUpKSAkclsnUEFWT0pVUyddW109bWJfc3Vic3RyKCR1LDAsMTIwKTsgfQogICAgICBlbHNlIHsgJGw9c3RydG9sb3dlcigkdSk7IGZvcmVhY2goJGxvdyBhcyAkdyl7IGlmKHN0cnBvcygkbCwkdykhPT1mYWxzZSl7ICRrPW1iX3N1YnN0cigkdSwwLDEwMCk7ICRuZWF0aXRbJGtdPSgkbmVhdGl0WyRrXT8/MCkrMTsgYnJlYWs7IH0gfSB9IH0gZ3pjbG9zZSgkaCk7IH0KICBhcnNvcnQoJHBhZyk7IGFyc29ydCgkbmVhdGl0KTsgJHJbJ3BhZ2F1dHUnXT0kcGFnOyAkclsndmlzbyddPWFycmF5X3N1bSgkcGFnKTsgJHJbJ3B2eiddPSRwdno7ICRyWyduZXBhZ2F1dGlfYmV0X3BhbmFzdXMnXT1hcnJheV9zbGljZSgkbmVhdGl0LDAsMTAsdHJ1ZSk7CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-071041';
const GKEY='ps_s1754i';
const PHASES=["1"];
const OUT='out/s1754_i.json';
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
