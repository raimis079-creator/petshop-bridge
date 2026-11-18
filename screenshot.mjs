process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1azIgVkYgbnVvdHJhdWt1IG5lYXRpdGlraW1haSB2aXNvbXMgcHJla2VtcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4ODVrMiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4ODVrMiddOwogIHRyeXsKICAkc2t1cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwbS5wb3N0X2lkIHBpZCwgcG0ubWV0YV92YWx1ZSBza3UsIHAucG9zdF9zdGF0dXMgc3QgRlJPTSB7JFB9cG9zdG1ldGEgcG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPXBtLnBvc3RfaWQgV0hFUkUgcG0ubWV0YV9rZXk9J192Zl9zdXBwbGllcl9za3UnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSIsQVJSQVlfQSk7CiAgJGJ5c2t1PVtdOyBmb3JlYWNoKCRza3VzIGFzICRzKSAkYnlza3VbJHNbJ3NrdSddXVtdPSRzOwogICR4PWZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXZmLWNhY2hlLnhtbCcpOwogIHByZWdfbWF0Y2hfYWxsKCcjPHJvdz4uKj88L3Jvdz4jcycsJHgsJGl0ZW1zKTsgJHJbJ3htbF9pdGVtcyddPWNvdW50KCRpdGVtc1swXSk7CiAgJHhtbGltZz1bXTsgJG5lc2s9MDsKICBmb3JlYWNoKCRpdGVtc1swXSBhcyAkaXQpeyAkc2t1PXByZWdfbWF0Y2goJyM8c2t1X2lkPihbXjxdKyk8L3NrdV9pZD4jJywkaXQsJHNtKT90cmltKCRzbVsxXSk6bnVsbDsgaWYoISRza3V8fCFpc3NldCgkYnlza3VbJHNrdV0pKXsgJG5lc2srKzsgY29udGludWU7IH0KICAgIHByZWdfbWF0Y2hfYWxsKCcjcHJvZHVjdC1pbWFnZXMvKFxkKykvIycsJGl0LCRtbSk7ICR4bWxpbWdbJHNrdV09YXJyYXlfbWFwKCdpbnR2YWwnLCRtbVsxXSk7IH0KICAkclsneG1sX2JlX211c3Vfc2t1J109JG5lc2s7ICRyWydzdXRhcGRpbnRhJ109Y291bnQoJHhtbGltZyk7CiAgJHBtPVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGkuYXR0YWNobWVudF9pZCBhLCBpLmltYWdlX3VybCB1IEZST00geyRQfXBteGlfaW1hZ2VzIGkgV0hFUkUgaS5pbWFnZV91cmwgTElLRSAnJXByb2R1Y3QtaW1hZ2VzLyUnIixBUlJBWV9BKSBhcyAkeSl7IGlmKHByZWdfbWF0Y2goJyNwcm9kdWN0LWltYWdlcy8oXGQrKS8jJywkeVsndSddLCRtKSkgJHBtWyhpbnQpJHlbJ2EnXV09KGludCkkbVsxXTsgfQogICRiYWQ9W107ICRvaz0wOyAkcmFuaz0wOyAkYmU9MDsKICBmb3JlYWNoKCRieXNrdSBhcyAkc2t1PT4kbGlzdCl7IGlmKCFpc3NldCgkeG1saW1nWyRza3VdKSkgY29udGludWU7IGZvcmVhY2goJGxpc3QgYXMgJHMpeyAkcGlkPShpbnQpJHNbJ3BpZCddOyAkdGg9KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ190aHVtYm5haWxfaWQnLHRydWUpOyAkZ2FsPWFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ2ludHZhbCcsZXhwbG9kZSgnLCcsKHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ19wcm9kdWN0X2ltYWdlX2dhbGxlcnknLHRydWUpKSkpOwogICAgICAkbWluZT1bXTsgZm9yZWFjaChhcnJheV9tZXJnZShbJHRoXSwkZ2FsKSBhcyAkYSl7IGlmKCRhICYmIGlzc2V0KCRwbVskYV0pKSAkbWluZVtdPSRwbVskYV07IH0KICAgICAgaWYoISR0aCl7ICRiZSsrOyBjb250aW51ZTsgfQogICAgICBpZighaXNzZXQoJHBtWyR0aF0pKXsgJHJhbmsrKzsgY29udGludWU7IH0gLy8gcmFua2EgaWtlbHRhIG51b3RyYXVrYSAobmUgaXMgVkYpCiAgICAgICR4aT0keG1saW1nWyRza3VdOwogICAgICBpZighaW5fYXJyYXkoJHBtWyR0aF0sJHhpLHRydWUpKXsgJGJhZFtdPVsncGlkJz0+JHBpZCwnc2t1Jz0+JHNrdSwnc3QnPT4kc1snc3QnXSwnbXVzdSc9PiRtaW5lLCd4bWwnPT4keGksJ3QnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkcGlkKSwwLDYwKV07IH0gZWxzZSAkb2srKzsgfSB9CiAgJHJbJ29rJ109JG9rOyAkclsncmFua2EnXT0kcmFuazsgJHJbJ2JlX251b3RyJ109JGJlOyAkclsnbmVhdGl0aW5rYV9uJ109Y291bnQoJGJhZCk7CiAgJHJbJ25lYXRpdGlua2FfcHVibF9uJ109Y291bnQoYXJyYXlfZmlsdGVyKCRiYWQsZm4oJGIpPT4kYlsnc3QnXT09PSdwdWJsaXNoJykpOwogIHVzb3J0KCRiYWQsZm4oJGEsJGIpPT5zdHJjbXAoJGJbJ3N0J10sJGFbJ3N0J10pKTsgJHJbJ25lYXRpdGlua2EnXT1hcnJheV9zbGljZSgkYmFkLDAsODApOyBmb3JlYWNoKFsnRVVENzI4JywnRVVENzI5JywnRVVENzM5JywnRVVENzQwJ10gYXMgJHEpICRyWydjaHVydV94bWwnXVskcV09JHhtbGltZ1skcV0/P251bGw7CiAgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-103227';
const GKEY='ps_s1885k2';
const PHASES=["1"];
const OUT='analize/s1885k2.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
