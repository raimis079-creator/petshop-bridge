process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzYwZCBsYWlza2FpIHBvIHNsYXB0YXpvZHppbyBrZWl0aW1vOiB1enNha3ltdSBrb3Bpam9zIHV6c2FreW1haUAsIGJvdW5jZSwgV1BNUyBrbGFpZG9zLCAjMTI5NSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NjBkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc2MGQnXTsKICB0cnl7CiAgJFQwPXN0cnRvdGltZSgnMjAyNi0xMC0wOCAwODozMCBVVEMnKTsKICAkb3JkPVtdOyBmb3JlYWNoKHdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjIwMCwndHlwZSc9PidzaG9wX29yZGVyJywnZGF0ZV9jcmVhdGVkJz0+Jz49Jy4kVDAsJ3N0YXR1cyc9PlsncHJvY2Vzc2luZycsJ2NvbXBsZXRlZCcsJ29uLWhvbGQnLCdwZW5kaW5nJywnY2FuY2VsbGVkJywnZmFpbGVkJ11dKSBhcyAkbyl7ICRvcmRbJG8tPmdldF9vcmRlcl9udW1iZXIoKV09WyRvLT5nZXRfc3RhdHVzKCksJG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpXTsgfSBrc29ydCgkb3JkKTsgJHJbJ3V6c2FreW1haSddPSRvcmQ7CiAgJHViPScvaG9tZS9neXZ1bmFpMi9pbWFwL3BldHNob3AubHQvdXpzYWt5bWFpL01haWxkaXInOyAka29wPVtdOyAkYm5jPVtdOyAka2l0aT0wOwogIGZvcmVhY2goYXJyYXlfbWVyZ2UoWyR1Yi4nL25ldycsJHViLicvY3VyJ10sKGFycmF5KWdsb2IoJHViLicvLiovbmV3JyxHTE9CX09OTFlESVIpLChhcnJheSlnbG9iKCR1Yi4nLy4qL2N1cicsR0xPQl9PTkxZRElSKSkgYXMgJGQpeyBmb3JlYWNoKChhcnJheSlnbG9iKCRkLicvKicpIGFzICRmKXsgJG10PWZpbGVtdGltZSgkZik7IGlmKCRtdDwkVDApIGNvbnRpbnVlOwogICAgJGg9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLGZhbHNlLG51bGwsMCw2MDAwKTsgaWYoISRoKSBjb250aW51ZTsgJGhwPXN0cnBvcygkaCwiXG5cbiIpOyAkSD1zdWJzdHIoJGgsMCwkaHA/OjYwMDApOyAkSD1wcmVnX3JlcGxhY2UoIi9ccj9cblsgXHRdKy8iLCcgJywkSCk7CiAgICAkc2o9cHJlZ19tYXRjaCgnL15TdWJqZWN0OlxzKiguKikkL21pJywkSCwkbSk/dHJpbShAaWNvbnZfbWltZV9kZWNvZGUoJG1bMV0sSUNPTlZfTUlNRV9ERUNPREVfQ09OVElOVUVfT05fRVJST1IsJ1VURi04JykpOicnOyAkZnI9cHJlZ19tYXRjaCgnL15Gcm9tOlxzKiguKikkL21pJywkSCwkbTIpPyRtMlsxXTonJzsKICAgIGlmKHByZWdfbWF0Y2goJy9NYWlsIGRlbGl2ZXJ5IGZhaWxlZHxVbmRlbGl2ZXJ8ZmFpbHVyZSBub3RpY2UvaScsJHNqKSl7ICRibmNbXT1bZ21kYXRlKCdtLWQgSDppJywkbXQpLG1iX3N1YnN0cigkc2osMCw2MCldOyBjb250aW51ZTsgfQogICAgaWYoc3RyaXBvcygkZnIsJ3V6c2FreW1haUBwZXRzaG9wLmx0JykhPT1mYWxzZSAmJiBwcmVnX21hdGNoKCcvIyhcZHs0fSkvJywkc2osJG1tKSl7ICRrb3BbJG1tWzFdXVtdPW1iX3N1YnN0cigkc2osMCw3MCk7IH0gZWxzZSAka2l0aSsrOwogIH0gfQogIGtzb3J0KCRrb3ApOyAkclsna29waWpvcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7IHJldHVybiBjb3VudCgkeCkuJ8OXICcuJHhbMF07IH0sJGtvcCk7ICRyWydiZV9rb3Bpam9zJ109YXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoYXJyYXlfa2V5cygkb3JkKSxhcnJheV9tYXAoJ3N0cnZhbCcsYXJyYXlfa2V5cygka29wKSkpKTsgJHJbJ2JvdW5jZV9wb18xMTMwJ109JGJuYzsgJHJbJ2tpdGlfbGFpc2thaSddPSRraXRpOwogICRUPSRQLid3cG1haWxzbXRwX2RlYnVnX2V2ZW50cyc7ICRyWyd3cG1zX2tsYWlkb3MnXT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJFQnIik/JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY3JlYXRlZF9hdCxMRUZUKGNvbnRlbnQsMTYwKSBjIEZST00gJFQgV0hFUkUgY3JlYXRlZF9hdD49JzIwMjYtMTAtMDggMDg6MzA6MDAnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk6J25lcmEgbGVudGVsZXMnOwogIGZvcmVhY2god2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+NjAsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ2RhdGVfY3JlYXRlZCc9Pic+PScuc3RydG90aW1lKCcyMDI2LTEwLTA2IDAwOjAwIFVUQycpXSkgYXMgJG8peyBpZigkby0+Z2V0X29yZGVyX251bWJlcigpIT09JzEyOTUnKSBjb250aW51ZTsgJG50PVtdOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JG8tPmdldF9pZCgpLCdsaW1pdCc9PjNdKSBhcyAkbikgJG50W109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTEwKTsgJHJbJ3UxMjk1J109WyRvLT5nZXRfc3RhdHVzKCksJG50XTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-203813';
const GKEY='ps_s1760d';
const PHASES=["1"];
const OUT='out/s1760_d.json';
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
