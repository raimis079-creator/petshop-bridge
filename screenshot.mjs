process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU2ZCBpc19jaGVja291dCBmYXRhbDoga29kYXMsIHBpbG5pIGtsYWlkb3MgaXJhc2FpLCA1MDAgdXprbGF1c29zIHR1byBwYWNpdSBsYWlrdSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NTZkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjApOyAkcj1bJ3YnPT4nUzE3NTZkJ107CiAgJGY9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJzsgJEw9ZmlsZSgkZik7ICRyWydmbl9tZDUnXT1zdWJzdHIobWQ1X2ZpbGUoJGYpLDAsOCk7ICRyWydmbl9laWwnXT1jb3VudCgkTCk7CiAgJHJbJ2tvZGFzJ109W107IGZvcigkaT0xNjAwOyRpPDE2NjA7JGkrKykgJHJbJ2tvZGFzJ11bXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIocnRyaW0oJExbJGldPz8nJyksMCwxNzApOwogIC8vIHBpbG5pIGZhdGFsIGlyYXNhaSBzdSBzdGFjayB0cmFjZSAoMTAtMDUuLjEwLTA3KQogICRsb2c9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRmaD1mb3BlbigkbG9nLCdyJyk7IGZzZWVrKCRmaCwtNDAwMDAwMCxTRUVLX0VORCk7ICR0PWZyZWFkKCRmaCw0MDAwMDAwKTsgZmNsb3NlKCRmaCk7CiAgJGxpbmVzPWV4cGxvZGUoIlxuIiwkdCk7ICRlbnQ9W107ICRsYWlrYWk9W107CiAgZm9yKCRpPTA7JGk8Y291bnQoJGxpbmVzKTskaSsrKXsgaWYoc3RycG9zKCRsaW5lc1skaV0sJ2lzX2NoZWNrb3V0KCknKSE9PWZhbHNlICYmIHByZWdfbWF0Y2goJy9eXFsoMFs1LTddLU9jdC0yMDI2IFtcZDpdKykgVVRDXF0gUEhQIEZhdGFsLycsJGxpbmVzWyRpXSwkbSkpeyAkbGFpa2FpW109JG1bMV07ICRibGs9W21iX3N1YnN0cigkbGluZXNbJGldLDAsMTYwKV07IGZvcigkaz0xOyRrPD0xMiAmJiBpc3NldCgkbGluZXNbJGkrJGtdKTskaysrKXsgJHg9JGxpbmVzWyRpKyRrXTsgaWYocHJlZ19tYXRjaCgnL15cW1xkXGQtXHd7M30tMjAyNi8nLCR4KSAmJiBzdHJwb3MoJHgsJ1N0YWNrIHRyYWNlJyk9PT1mYWxzZSAmJiBzdHJwb3MoJHgsJyMnKT09PWZhbHNlKSBicmVhazsgJGJsa1tdPW1iX3N1YnN0cihwcmVnX3JlcGxhY2UoJy9cL2hvbWVcL1xTKz9cL3B1YmxpY19odG1sXC8vJywnJywkeCksMCwxNzApOyB9IGlmKGNvdW50KCRlbnQpPDIpICRlbnRbXT0kYmxrOyB9IH0KICAkclsnbGFpa2FpJ109JGxhaWthaTsgJHJbJ2lyYXNhaSddPSRlbnQ7CiAgLy8gYWNjZXNzIGxvZzogNTAwIHRhaXMgcGFjaWFpcyBsYWlrYWlzCiAgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7ICR3YW50PVtdOyBmb3JlYWNoKCRsYWlrYWkgYXMgJGwpeyAkZD1EYXRlVGltZTo6Y3JlYXRlRnJvbUZvcm1hdCgnZC1NLVkgSDppOnMnLCRsLG5ldyBEYXRlVGltZVpvbmUoJ1VUQycpKTsgaWYoJGQpeyAkZC0+c2V0VGltZXpvbmUoJHR6KTsgJHdhbnRbJGQtPmZvcm1hdCgnZC9NL1k6SDppOnMnKV09MTsgfSB9CiAgJGFjYz1bXTsgZm9yZWFjaCgoYXJyYXkpZ2xvYihkaXJuYW1lKEFCU1BBVEgpLicvbG9ncy8qLnRhci5neionKSBhcyAkYWYpeyBpZihmaWxlbXRpbWUoJGFmKTxzdHJ0b3RpbWUoJzIwMjYtMTAtMDQgMjA6MDAgVVRDJykpIGNvbnRpbnVlOyAkaD1AZ3pvcGVuKCRhZiwncmInKTsgaWYoISRoKSBjb250aW51ZTsgZ3pyZWFkKCRoLDUxMik7CiAgICB3aGlsZSgoJGxuPWd6Z2V0cygkaCwxNjM4NCkpIT09ZmFsc2UpeyBpZighcHJlZ19tYXRjaCgnL1xbKFxkXGRcL1x3ezN9XC8yMDI2OlxkXGQ6XGRcZDpcZFxkKSBbXlxdXSpcXSAiKFxTKykgKFxTKylbXiJdKiIgKFxkezN9KSBcUysgIihbXiJdKikiICIoW14iXSopIi8nLCRsbiwkbSkpIGNvbnRpbnVlOyBpZihpc3NldCgkd2FudFskbVsxXV0pICYmICRtWzRdPj0nNTAwJykgJGFjY1tdPVskbVsxXSwkbVsyXSxtYl9zdWJzdHIoJG1bM10sMCw5MCksJG1bNF0sbWJfc3Vic3RyKCRtWzVdLDAsNTApLG1iX3N1YnN0cigkbVs2XSwwLDcwKV07IH0gZ3pjbG9zZSgkaCk7IH0KICAkclsndXprbGF1c29zXzUwMCddPSRhY2M7CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-172857';
const GKEY='ps_s1756d';
const PHASES=["1"];
const OUT='out/s1756_d.json';
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
