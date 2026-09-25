process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE4ZiDigJQgZmlsdHLFsyBkaWFnbm9zdGlrYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MThmJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcxOGYnXTsgZ2xvYmFsICR3cGRiOwogIGZvcmVhY2goWycva2F0ZWdvcmlqYS9rYXRlbXMvbWFpc3Rhcy1rYXRlbXMvJywnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nLCcvZ2FtaW50b2phcy9qb3NlcmEvJywnL3BhcmR1b3R1dmUvJ10gYXMgJHUpewogICAgJHJlcz13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCR1Lic/cHNfZj0xJyksWyd0aW1lb3V0Jz0+MzBdKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJlcyk7ICR4PVsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyZXMpLCdsZW4nPT5zdHJsZW4oJGgpXTsKICAgIGZvcmVhY2goWyd5aXRoLXdjYW4tZmlsdGVycycsJ3lpdGgtd2NhbicsJ2ZpbHRlcl8nLCdwcy1zZW8taDEnLCdzaG9wLXNpZGViYXInLCdzaWRlYmFyLWlubmVyJywnd2lkZ2V0X3lpdGgnLCd5aXRoX3djYW5fZmlsdGVycycsJ2ZsYXRzb21lX2FkZF9jYXRlZ29yeV9maWx0ZXJfYnV0dG9uJywnZmlsdGVyLWJ1dHRvbicsJ3Rlcm0tZGVzY3JpcHRpb24nXSBhcyAkaykgJHhbJGtdPXN1YnN0cl9jb3VudCgkaCwkayk7CiAgICBwcmVnX21hdGNoKCcjPGgxW14+XSo+KC4qPyk8L2gxPiNzaScsJGgsJG0pOyAkeFsnaDEnXT10cmltKHdwX3N0cmlwX2FsbF90YWdzKCRtWzFdPz8nJykpOyAkclskdV09JHg7IH0KICAkclsneWl0aF9ha3R5dnVzJ109aXNfcGx1Z2luX2FjdGl2ZSgneWl0aC13b29jb21tZXJjZS1hamF4LW5hdmlnYXRpb24vaW5pdC5waHAnKT86YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpLGZ1bmN0aW9uKCRwKXtyZXR1cm4gc3RyaXBvcygkcCwneWl0aCcpIT09ZmFsc2U7fSkpOwogICRyWydwcmVzZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X3N0YXR1cyxwb3N0X21vZGlmaWVkIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSd5aXRoX3djYW5fcHJlc2V0JyBPUkRFUiBCWSBJRCIsQVJSQVlfQSk7CiAgJHJbJ3NhcmdhcyddPWlzX2ZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1maWx0cnUtc2FyZ2FzLnBocCcpOwogICRyWydzaWRlYmFycyddPWFycmF5X21hcChmdW5jdGlvbigkdyl7cmV0dXJuIGlzX2FycmF5KCR3KT9jb3VudCgkdyk6MDt9LChhcnJheSlnZXRfb3B0aW9uKCdzaWRlYmFyc193aWRnZXRzJykpOwogICRsb2c9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7IGlmKGlzX2ZpbGUoJGxvZykpeyAkc3o9ZmlsZXNpemUoJGxvZyk7ICRmcD1mb3BlbigkbG9nLCdyJyk7IGZzZWVrKCRmcCxtYXgoMCwkc3otNjAwMCkpOyAkdGFpbD1mcmVhZCgkZnAsNjAwMCk7IGZjbG9zZSgkZnApOyAkbGluZXM9YXJyYXlfZmlsdGVyKGV4cGxvZGUoIlxuIiwkdGFpbCkpOyAkclsnbG9nX3RhaWwnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoJGxpbmVzKSwtMTUpOyB9CiAgJHJbJ2h0YWNjZXNzX3ByYWR6aWEnXT1tYl9zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoQUJTUEFUSC4nLmh0YWNjZXNzJyksMCwzMDApOwogICRyWyd5aXRoX29wdCddPVsnYWpheCc9PmdldF9vcHRpb24oJ3lpdGhfd2Nhbl9hamF4X3Nob3BfcGFnaW5hdGlvbicpLCd2ZXInPT5kZWZpbmVkKCdZSVRIX1dDQU5fVkVSU0lPTicpP1lJVEhfV0NBTl9WRVJTSU9OOm51bGxdOwogIHdwX3NlbmRfanNvbigkcik7Cn0sMSk7Cg==';
const VER='dep-125959';
const GKEY='ps_s1718f';
const PHASES=["1"];
const OUT='analize/s1718_f1.json';
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
