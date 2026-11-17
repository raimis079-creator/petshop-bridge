process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc2ZSBKb3NlcmEga2Fpbm9zIHBhZ2FsIHBhdmFkaW5pbWEgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODc2ZSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NzZlJ107CiAgdHJ5ewogICRhZ2c9W107ICRicm09W107CiAgZm9yZWFjaChbJ2lzdCc9PiJ7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyIsJ25ldyc9PiJ7JFB9cHNfZmFrdF9laWx1dGVzIl0gYXMgJHNyYz0+JHQpewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYXBtb2tldGFfYXQgZCwga2lla2lzIHEsIGthaW5hX3ZudF9jdCBwdSwga2FpbmFfcmVndWxpYXJpX2N0IHJwLCBwYXZhZGluaW1hc190dW9fbWV0dSBwLCBrYXRlZ29yaWp1X2tlbGlhcyBjLCBicmVuZGFzX3NsdWcgYiwgc3ZvcmlzX2cgcyBGUk9NICR0IFdIRVJFIGFwbW9rZXRhX2F0Pj0nMjAyNS0wMS0wMScgQU5EIENPQUxFU0NFKHRlc3RpbmlzLDApPTAiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkcm93cyBhcyAkeCl7IGlmKG1iX3N0cmlwb3MoKHN0cmluZykkeFsnYyddLCdzYXVzJyk9PT1mYWxzZSkgY29udGludWU7IGlmKHByZWdfbWF0Y2goJy9eXHMqXGQrXHMqdm50L3UnLCR4WydwJ10pKSBjb250aW51ZTsgJHBrPTA7IGlmKHByZWdfbWF0Y2goJy8oXGQrKD86Wy4sXVxkKyk/KVxzKmtnL2l1JywkeFsncCddLCRtbSkpICRwaz0oZmxvYXQpc3RyX3JlcGxhY2UoJywnLCcuJywkbW1bMV0pOyAkdz0kcGs/OigoZmxvYXQpJHhbJ3MnXSkvMTAwMDsgaWYoJHc8NykgY29udGludWU7CiAgICAgICR5PXN1YnN0cigkeFsnZCddLDAsNyk7ICRiPSR4WydiJ10/Oic/JzsKICAgICAgJGJybVskYl1bJHldWydxJ109KCRicm1bJGJdWyR5XVsncSddPz8wKSskeFsncSddOyAkYnJtWyRiXVskeV1bJ2V1cl9rZyddW109JHhbJ3B1J10vMTAwKjEuMjEvJHc7CiAgICAgIGlmKCFpbl9hcnJheSgkYixbJ2pvc2VyYScsJ2V4Y2x1c2lvbicsJ3F1YXR0cm8nLCdyb3lhbC1jYW5pbiddKSkgY29udGludWU7CiAgICAgICRuPW1iX3N0cnRvbG93ZXIoJHhbJ3AnXSk7ICRuPXByZWdfcmVwbGFjZSgnLyZbI2EtejAtOV0rOy8nLCcnLCRuKTsgJG49cHJlZ19yZXBsYWNlKCcvXHMqWy3igJNdXHMqc2F1c2FzLiokL3UnLCcnLCRuKTsgJG49cHJlZ19yZXBsYWNlKCcvc2F1c2FzLiokL3UnLCcnLCRuKTsgJG49cHJlZ19yZXBsYWNlKCcvW15hLXrEhcSNxJnEl8SvxaHFs8Wrxb4wLTksXC4gXS91JywnICcsJG4pOyAkbj10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkbikpOyAkbj1tYl9zdWJzdHIoJG4sMCw0NSk7CiAgICAgICRhZ2dbJGIuJ3wnLiRuXVskeV1bJ3EnXT0oJGFnZ1skYi4nfCcuJG5dWyR5XVsncSddPz8wKSskeFsncSddOyAkYWdnWyRiLid8Jy4kbl1bJHldWydwJ11bXT0keFsncHUnXS8xMDAqMS4yMTsgfQogIH0KICBmb3JlYWNoKCRicm0gYXMgJiRhKXsgZm9yZWFjaCgkYSBhcyAmJG0peyAkbVsnZXVyX2tnJ109cm91bmQoYXJyYXlfc3VtKCRtWydldXJfa2cnXSkvY291bnQoJG1bJ2V1cl9rZyddKSwyKTsgfSBrc29ydCgkYSk7IH0gdW5zZXQoJGEsJG0pOwogICR0b3Q9W107IGZvcmVhY2goJGFnZyBhcyAkaz0+JiRhKXsgJHM9MDsgZm9yZWFjaCgkYSBhcyAmJG0peyAkcys9JG1bJ3EnXTsgJG1bJ3AnXT1yb3VuZChhcnJheV9zdW0oJG1bJ3AnXSkvY291bnQoJG1bJ3AnXSksMik7IH0ga3NvcnQoJGEpOyAkdG90WyRrXT0kczsgfSB1bnNldCgkYSwkbSk7CiAgYXJzb3J0KCR0b3QpOyAkb3V0PVtdOyBmb3JlYWNoKGFycmF5X3NsaWNlKCR0b3QsMCwzMCx0cnVlKSBhcyAkaz0+JHMpICRvdXRbJGtdPVsndmlzbyc9PiRzLCdtJz0+JGFnZ1ska11dOwogICRyWydwcm9kJ109JG91dDsgJHJbJ2JyYW5kJ109YXJyYXlfaW50ZXJzZWN0X2tleSgkYnJtLGFycmF5X2ZsaXAoWydqb3NlcmEnLCdleGNsdXNpb24nLCdxdWF0dHJvJywncm95YWwtY2FuaW4nLCdhbWJyb3NpYScsJ2Zhcm1pbmEnLCdwcmlucycsJ3Jhc2NvJywnb250YXJpbyddKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-084421';
const GKEY='ps_s1876e';
const PHASES=["1"];
const OUT='analize/s1876_e.json';
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
