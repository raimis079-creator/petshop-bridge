process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjQgZCDigJQgxK9kaWVnaWEgbnVvbGF0aW7EryBzbmlwcGV0xIUg4oCeUGV0c2hvcCBTcGFzdGFpIFJlZHVjZWRTdG9jayB2MS4wIjogYmFja3RyYWNlIGthaSB0cmluYW1hIF9yZWR1Y2VkX3N0b2NrIGVpbHV0xJdzIG1ldGEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY0ZCddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjY0IGQnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICR5cmE9JHdwZGItPmdldF92YXIoIlNFTEVDVCBpZCBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1BldHNob3AgU3Bhc3RhaSBSZWR1Y2VkU3RvY2slJyIpOwogIGlmKCR5cmEpeyAkb1snamF1X3lyYSddPShpbnQpJHlyYTsgd3Bfc2VuZF9qc29uKCRvKTsgfQogICRjb2RlPTw8PCdDT0RFJwphZGRfZmlsdGVyKCdkZWxldGVfb3JkZXJfaXRlbV9tZXRhZGF0YScsIGZ1bmN0aW9uKCRjaGVjaywkaXRlbV9pZCwkbWV0YV9rZXkpewogIGlmKCRtZXRhX2tleT09PSdfcmVkdWNlZF9zdG9jaycpewogICAgJGw9Z2V0X29wdGlvbigncHNfcnNfdHJhcCcsYXJyYXkoKSk7IGlmKCFpc19hcnJheSgkbCkpICRsPWFycmF5KCk7CiAgICAkbFtdPWFycmF5KCd0Jz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdpdGVtJz0+KGludCkkaXRlbV9pZCwKICAgICAgJ3VyaSc9PnN1YnN0cihpc3NldCgkX1NFUlZFUlsnUkVRVUVTVF9VUkknXSk/JF9TRVJWRVJbJ1JFUVVFU1RfVVJJJ106JycsMCwxNDApLAogICAgICAnYWpheCc9PmRlZmluZWQoJ0RPSU5HX0FKQVgnKSYmRE9JTkdfQUpBWD8xOjAsJ2Nyb24nPT5kZWZpbmVkKCdET0lOR19DUk9OJykmJkRPSU5HX0NST04/MTowLAogICAgICAnYnQnPT5zdWJzdHIod3BfZGVidWdfYmFja3RyYWNlX3N1bW1hcnkobnVsbCwyKSwwLDkwMCkpOwogICAgaWYoY291bnQoJGwpPjMwKSAkbD1hcnJheV9zbGljZSgkbCwtMzApOwogICAgdXBkYXRlX29wdGlvbigncHNfcnNfdHJhcCcsJGwsZmFsc2UpOwogIH0KICByZXR1cm4gJGNoZWNrOwp9LDEwLDMpOwpDT0RFOwogICR0PXRva2VuX2dldF9hbGwoJzw/cGhwICcuJGNvZGUsIFRPS0VOX1BBUlNFKTsgLy8gc2ludGFrc8SXcyBzYXJnYXMKICAkb2s9JHdwZGItPmluc2VydCgieyRwfXNuaXBwZXRzIixhcnJheSgnbmFtZSc9PidQZXRzaG9wIFNwYXN0YWkgUmVkdWNlZFN0b2NrIHYxLjAgKGJ0IGkgcHNfcnNfdHJhcCknLCdkZXNjcmlwdGlvbic9PidTMTY2NDogYmFja3RyYWNlIGthaSB0cmluYW1hIF9yZWR1Y2VkX3N0b2NrLiBMYWlraW5hcyBpa2kgxaFha25pZXMgcmFkaW1vLicsJ2NvZGUnPT4kY29kZSwndGFncyc9PicnLCdzY29wZSc9PidnbG9iYWwnLCdwcmlvcml0eSc9PjksJ2FjdGl2ZSc9PjEsJ21vZGlmaWVkJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKSk7CiAgJG9bJ2luc2VydCddPSRvaz8oaW50KSR3cGRiLT5pbnNlcnRfaWQ6J0ZBSUwgJy4kd3BkYi0+bGFzdF9lcnJvcjsKICAkb1sncGluZyddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-133031';
const GKEY='ps_s1664d';
const PHASES=["GO"];
const OUT='analize/s1664d.json';
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
