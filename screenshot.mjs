process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUyciDigJQgQW5pbW9uZGEgODUgZyDEryBEMTkgxaFlaW1hcyAoa2FpcCBMYW5kZmxlaXNoIGF2LSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODUyJ10pPyRfR0VUWydwc19zMTg1MiddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTg1MnItJy4kZik7CiAgJEJBU0U9YXJyYXkoMzg0MzIsMzg0MzQsMzg0MzYsMzg0MzgpOwogICRwbGFuPWFycmF5KCk7CiAgZm9yZWFjaCgkQkFTRSBhcyAkYil7ICRwbj1nZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkYik7IGlmKCRwbj09PScnKSAkcG49c2FuaXRpemVfdGl0bGUoZ2V0X3RoZV90aXRsZSgkYikpOyAkcz0nYXYtJy4kcG47ICRzPXN1YnN0cigkcywwLDE4MCk7CiAgICAkcGs9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0lcyIsKHN0cmluZykkYikpOwogICAgJHBsYW5bJGJdPWFycmF5KCdzZWltYSc9PiRzLCdwYWthaSc9PiRwayk7IH0KICBpZigkZj09PScxJyl7ICRvWydwbGFuJ109JHBsYW47IGZvcmVhY2goJHBsYW4gYXMgJGI9PiR4KXsgZm9yZWFjaCgkeFsncGFrYWknXSBhcyAkaWQpeyAkb1sncSddWyRpZF09Z2V0X3Bvc3RfbWV0YSgkaWQsJ19kcF9wYWNrX3F0eScsdHJ1ZSk7fSB9IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KICBpZigkZj09PScyJyl7CiAgICAkZDE5PShhcnJheSlnZXRfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJyxhcnJheSgpKTsKICAgICRiYWs9YXJyYXkoJ2QxOSc9PiRkMTksJ21ldGEnPT5hcnJheSgpLCd0ZXJtJz0+YXJyYXkoKSk7CiAgICBmb3JlYWNoKCRwbGFuIGFzICRiPT4keCl7IGZvcmVhY2goYXJyYXlfbWVyZ2UoYXJyYXkoJGIpLCR4WydwYWthaSddKSBhcyAkaWQpeyAkYmFrWydtZXRhJ11bJGlkXT1nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSk7ICRiYWtbJ3Rlcm0nXVskaWRdPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncGFfcGFrdW90ZXNfZHlkaXMnLGFycmF5KCdmaWVsZHMnPT4naWRzJykpOyB9IH0KICAgIGlmKCFnZXRfb3B0aW9uKCdwc19zMTg1MnJfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxODUycl9iYWsnLCRiYWssZmFsc2UpOwogICAgZm9yZWFjaCgkcGxhbiBhcyAkYj0+JHgpewogICAgICB1cGRhdGVfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJywkeFsnc2VpbWEnXSk7CiAgICAgIGZvcmVhY2goJHhbJ3Bha2FpJ10gYXMgJGlkKXsgJHE9KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTsKICAgICAgICB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsJHhbJ3NlaW1hJ10pOwogICAgICAgICRubT0kcS4nIMOXIDg1IGcnOyAkdD10ZXJtX2V4aXN0cygkbm0sJ3BhX3Bha3VvdGVzX2R5ZGlzJyk7IGlmKCEkdCl7ICR0PXdwX2luc2VydF90ZXJtKCRubSwncGFfcGFrdW90ZXNfZHlkaXMnKTsgfQogICAgICAgICR0aWQ9aXNfYXJyYXkoJHQpPyhpbnQpJHRbJ3Rlcm1faWQnXTooaW50KSR0OwogICAgICAgIHdwX3NldF9vYmplY3RfdGVybXMoJGlkLGFycmF5KCR0aWQpLCdwYV9wYWt1b3Rlc19keWRpcycsZmFsc2UpOwogICAgICAgICRvWydzZXQnXVskaWRdPWFycmF5KCRxLCRubSwkdGlkKTsgfQogICAgICBpZighaW5fYXJyYXkoJHhbJ3NlaW1hJ10sJGQxOSx0cnVlKSkgJGQxOVtdPSR4WydzZWltYSddOwogICAgICAkaWRzPWFycmF5X21lcmdlKGFycmF5KCRiKSwkeFsncGFrYWknXSk7IGZvcmVhY2goJGlkcyBhcyAkaWQpeyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkaWQpOyB9IH0KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLCRkMTkpOyBkZWxldGVfdHJhbnNpZW50KCdwc19ka19zZWltb3MnKTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgeyAvKiB0aWsga2F0ZWdvcmlqb3MgKi8gfQogICAgJG9bJ2QxOV9uJ109Y291bnQoJGQxOSk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KICBpZigkZj09PSczJyl7ICRkMTk9KGFycmF5KWdldF9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLGFycmF5KCkpOwogICAgZm9yZWFjaCgkcGxhbiBhcyAkYj0+JHgpeyBmb3JlYWNoKGFycmF5X21lcmdlKGFycmF5KCRiKSwkeFsncGFrYWknXSkgYXMgJGlkKXsgJG9bJ2NoayddWyRpZF09YXJyYXkoZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19keWR6aW9fc2VpbWEnLHRydWUpPT09JHhbJ3NlaW1hJ10sd3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwYV9wYWt1b3Rlc19keWRpcycsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSxnZXRfcG9zdF9zdGF0dXMoJGlkKSk7IH0gJG9bJ2QxOSddWyRiXT1pbl9hcnJheSgkeFsnc2VpbWEnXSwkZDE5LHRydWUpOyB9CiAgICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgaWYoJGY9PT0nOScpeyAkYmFrPWdldF9vcHRpb24oJ3BzX3MxODUycl9iYWsnKTsgaWYoISRiYWspe2VjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4nbmVyYSBiYWsnKSk7ZXhpdDt9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJywkYmFrWydkMTknXSk7CiAgICBmb3JlYWNoKCRiYWtbJ21ldGEnXSBhcyAkaWQ9PiRtKXsgaWYoJG09PT0nJykgZGVsZXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19keWR6aW9fc2VpbWEnKTsgZWxzZSB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsJG0pOyB3cF9zZXRfb2JqZWN0X3Rlcm1zKCRpZCxhcnJheV9tYXAoJ2ludHZhbCcsJGJha1sndGVybSddWyRpZF0pLCdwYV9wYWt1b3Rlc19keWRpcycsZmFsc2UpOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IH0KICAgIGRlbGV0ZV90cmFuc2llbnQoJ3BzX2RrX3NlaW1vcycpOyAkb1snYXRzdGF0eXRhJ109MTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KfSk7Cg==';
const VER='dep-125821';
const GKEY='ps_s1852';
const PHASES=["1"];
const OUT='analize/s1852_r.json';
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
