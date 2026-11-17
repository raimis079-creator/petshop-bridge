process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc2YyBkaWRlbGkgbWFpc2FpIGlzdG9yaWphIDIwMjQtMjAyNiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzZjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNzY4TScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg3NmMnXTsgJFQwPW1pY3JvdGltZSh0cnVlKTsKICB0cnl7CiAgJG91dD1bXTsgJHBhdGhzPVtdOyAkYnJhbmRtPVtdOyAkd2s9W107ICR0b3Q9W107CiAgZm9yZWFjaChbJ2lzdCc9PiJ7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyIsJ25ldyc9PiJ7JFB9cHNfZmFrdF9laWx1dGVzIl0gYXMgJHNyYz0+JHQpewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5hcG1va2V0YV9hdCBkLCBlLmtpZWtpcyBxLCBlLmthaW5hX2N0IGssIGUuc3ZvcmlzX2cgcywgZS5wYXZhZGluaW1hc190dW9fbWV0dSBwLCBlLmthdGVnb3JpanVfa2VsaWFzIGMsIGUuYnJlbmRhc19zbHVnIGIsIGUudGVzdGluaXMgdHN0LCBlLnV6c2FreW1hc19pZCBvIEZST00gJHQgZSBXSEVSRSBlLmFwbW9rZXRhX2F0Pj0nMjAyNC0wMS0wMScgQU5EIENPQUxFU0NFKGUudGVzdGluaXMsMCk9MCIsQVJSQVlfQSk7CiAgICAkclsnbl8nLiRzcmNdPWNvdW50KCRyb3dzKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJHgpeyBpZighJHhbJ2QnXSkgY29udGludWU7ICRtPXN1YnN0cigkeFsnZCddLDAsNyk7ICR0b3RbJG1dWyRzcmNdWydvJ11bJHhbJ28nXV09MTsKICAgICAgJGM9bWJfc3RydG9sb3dlcigoc3RyaW5nKSR4WydjJ10pOyBpZihtYl9zdHJwb3MoJGMsJ3NhdXMnKT09PWZhbHNlKSBjb250aW51ZTsgJHBhdGhzWyR4WydjJ11dPSgkcGF0aHNbJHhbJ2MnXV0/PzApKzE7CiAgICAgICRrZz0keFsncyddPygoZmxvYXQpJHhbJ3MnXSkvMTAwMDowOyAkcGs9MDsgaWYocHJlZ19tYXRjaCgnLyhcZCsoPzpbLixdXGQrKT8pXHMqa2cvaXUnLChzdHJpbmcpJHhbJ3AnXSwkbW0pKSAkcGs9KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsJG1tWzFdKTsKICAgICAgaWYocHJlZ19tYXRjaCgnL15ccyooXGQrKVxzKnZudC91Jywoc3RyaW5nKSR4WydwJ10sJG12KSAmJiAkcGspICRwayo9IChpbnQpJG12WzFdOwogICAgICAkdz0kcGs/OiRrZzsgJHE9KGludCkkeFsncSddOyAkYmlnPSR3Pj03OwogICAgICAkb3V0WyRtXVskc3JjXVskYmlnPydiaWcnOidzbWFsbCddWydxJ109KCRvdXRbJG1dWyRzcmNdWyRiaWc/J2JpZyc6J3NtYWxsJ11bJ3EnXT8/MCkrJHE7CiAgICAgICRvdXRbJG1dWyRzcmNdWyRiaWc/J2JpZyc6J3NtYWxsJ11bJ2V1ciddPXJvdW5kKCgkb3V0WyRtXVskc3JjXVskYmlnPydiaWcnOidzbWFsbCddWydldXInXT8/MCkrJHhbJ2snXS8xMDAsMCk7CiAgICAgIGlmKCRiaWcpeyAkYnJhbmRtWyRtXVskeFsnYiddPzonPyddPSgkYnJhbmRtWyRtXVskeFsnYiddPzonPyddPz8wKSskcTsgJHk9KG5ldyBEYXRlVGltZSgkeFsnZCddKSktPmZvcm1hdCgnby1cV1cnKTsgaWYoJHhbJ2QnXT49JzIwMjUtMDgtMDEnKSAkd2tbJHldPSgkd2tbJHldPz8wKSskcTsgfQogICAgfQogIH0KICBmb3JlYWNoKCR0b3QgYXMgJG09PiYkYSkgZm9yZWFjaCgkYSBhcyAkcz0+JiRiKSAkYj1jb3VudCgkYlsnbyddKTsgdW5zZXQoJGEsJGIpOwogIGtzb3J0KCRvdXQpOyBrc29ydCgkdG90KTsga3NvcnQoJHdrKTsga3NvcnQoJGJyYW5kbSk7CiAgZm9yZWFjaCgkYnJhbmRtIGFzICRtPT4mJGEpeyBhcnNvcnQoJGEpOyAkYT1hcnJheV9zbGljZSgkYSwwLDYsdHJ1ZSk7IH0gdW5zZXQoJGEpOwogIGFyc29ydCgkcGF0aHMpOyAkclsncGF0aHMnXT1hcnJheV9zbGljZSgkcGF0aHMsMCwyNSx0cnVlKTsKICAkclsnbWVuJ109JG91dDsgJHJbJ3V6c19tZW4nXT0kdG90OyAkclsnd2snXT0kd2s7ICRyWydicmFuZF9tZW4nXT0kYnJhbmRtOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkclsndHJ1a21lX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJFQwLDEpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-084008';
const GKEY='ps_s1876c';
const PHASES=["1"];
const OUT='analize/s1876_c.json';
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
