process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkwdSBUZW5jZW50IHBvIGJsb2thdmltbywgYmFja3VwIGlzdG9yaWphIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5MHUnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7ICRyPVsndic9PidTMTc5MHUnXTsgJGRvbT1kaXJuYW1lKEFCU1BBVEgpOwogIHRyeXsKICAgIGZvcmVhY2goWydPY3QtMjAyNi50YXIuZ3ouMScsJ09jdC0yMDI2LnRhci5neiddIGFzICRmbil7ICRoPUBnem9wZW4oJGRvbS4nL2xvZ3MvJy4kZm4sJ3JiJyk7IGlmKCEkaCkgY29udGludWU7IGd6cmVhZCgkaCw1MTIpOyAkaHI9W107ICR0b3Q9MDsgJHJtPVtdOwogICAgICB3aGlsZSgoJGxuPWd6Z2V0cygkaCwxNjM4NCkpIT09ZmFsc2UpeyBpZighcHJlZ19tYXRjaCgnL14oXFMrKSBcUysgXFMrIFxbKFxkXGQpXC9cd3szfVwvXGR7NH06KFxkXGQpOlxkXGRbXlxdXSpcXSAiXFMrIChcUyspW14iXSoiIChcZHszfSkvJywkbG4sJG0pKSBjb250aW51ZTsgJHRvdCsrOyAkaz0kbVsyXS4nICcuJG1bM107CiAgICAgICAgaWYocHJlZ19tYXRjaCgnL140M1wuMTdbMjNdXC4vJywkbVsxXSkpeyAkaHJbJGtdWyRtWzVdXT0oJGhyWyRrXVskbVs1XV0/PzApKzE7IH0KICAgICAgICBpZihzdHJwb3MoJG1bNF0sJ3JlbW92ZV9pdGVtPScpIT09ZmFsc2UpeyAkcm1bJGtdWyRtWzVdXT0oJHJtWyRrXVskbVs1XV0/PzApKzE7IH0gfQogICAgICAkclsnbG9nJ11bJGZuXT1bJ3Zpc28nPT4kdG90LCd0NDMnPT4kaHIsJ3JlbW92ZV9pdGVtJz0+JHJtXTsgfQogICAgLy8gYmFja3VwCiAgICAkc3Q9JGRvbS4nL3BzLWJhY2t1cC1zdGF0ZS5qc29uJzsgZm9yZWFjaChnbG9iKCRkb20uJy8qYmFja3VwKicpPzpbXSBhcyAkZikgJHJbJ2JmaWxlcyddW109YmFzZW5hbWUoJGYpOwogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BzLWJhY2t1cCoucGhwJykgYXMgJGYpICRyWydibXUnXVtdPWJhc2VuYW1lKCRmKS4nICcuZGF0ZSgnbS1kIEg6aScsZmlsZW10aW1lKCRmKSk7CiAgICBmb3JlYWNoKFskZG9tLicvcHMtYmFja3VwLmxvZycsJGRvbS4nL2xvZ3MvcHMtYmFja3VwLmxvZycsV1BfQ09OVEVOVF9ESVIuJy9wcy1iYWNrdXAubG9nJ10gYXMgJGxmKSBpZihpc19maWxlKCRsZikpICRyWydibG9nJ11bJGxmXT1hcnJheV9zbGljZShmaWxlKCRsZiksLTI1KTsKICAgICRyWydib3B0J109YXJyYXlfbWFwKGZuKCRvKT0+WyRvLT5vcHRpb25fbmFtZSwgbWJfc3Vic3RyKCRvLT5vcHRpb25fdmFsdWUsMCwzMDApXSwkR0xPQkFMU1snd3BkYiddLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBvcHRpb25fdmFsdWUgRlJPTSB7JEdMT0JBTFNbJ3dwZGInXS0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJWJhY2t1cCUnIEFORCBvcHRpb25fbmFtZSBOT1QgTElLRSAnJXRyYW5zaWVudCUnIExJTUlUIDE1IikpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9KTsK';
const VER='dep-180711';
const GKEY='ps_s1790u';
const PHASES=["1"];
const OUT='analize/s1790_u.json';
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
