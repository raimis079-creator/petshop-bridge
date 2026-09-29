process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5ZyBwcmFkaW5pbyBIMSAoMSByYXN0aSAvIDIga2Vpc3RpIC8gMyBwYXRpa3JhIC8gOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTczOWcnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzM5ZyddOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3MzlnJywnZmF6ZSc9PiRmXTsKICAkU0VOQVM9J1ByZWvEl3MgYXVnaW50aW5pdWkgcGFnYWwgcmVhbMWzIHBvcmVpa8SvJzsgJE5BVUpBUz0nR3l2xatuxbMgcHJla8SXcyBwYWdhbCByZWFsxbMgYXVnaW50aW5pbyBwb3JlaWvEryc7ICRJRD0oaW50KWdldF9vcHRpb24oJ3BhZ2Vfb25fZnJvbnQnKTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJHBjPWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLCRJRCk7ICRyWydwb3N0X2NvbnRlbnRfdHVyaSddPXN1YnN0cl9jb3VudCgkcGMsJFNFTkFTKTsKICAgICRpPXN0cnBvcygkcGMsJFNFTkFTKTsgaWYoJGkhPT1mYWxzZSkgJHJbJ2tvbnRla3N0YXMnXT1zdWJzdHIoJHBjLG1heCgwLCRpLTIwMCksNDIwKTsKICAgICRyWydtZXRhX3R1cmknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkLCBtZXRhX2tleSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfdmFsdWUgTElLRSAlcyBMSU1JVCAxMCIsJyUnLiR3cGRiLT5lc2NfbGlrZSgkU0VOQVMpLiclJyksQVJSQVlfQSk7CiAgICAkclsncG9zdHNfdHVyaSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElELCBwb3N0X3R5cGUsIHBvc3Rfc3RhdHVzIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9jb250ZW50IExJS0UgJXMgTElNSVQgMTAiLCclJy4kd3BkYi0+ZXNjX2xpa2UoJFNFTkFTKS4nJScpLEFSUkFZX0EpOwogICAgJGhpdHM9W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy8qLnBocCcpLGdsb2IoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy8qLyoucGhwJykpIGFzICRmcCl7IGlmKHN0cnBvcyhmaWxlX2dldF9jb250ZW50cygkZnApLCRTRU5BUykhPT1mYWxzZSkgJGhpdHNbXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmcCk7IH0gJHJbJ2ZhaWxhaV90dXJpJ109JGhpdHM7CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRwYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkSUQpOyAkbj1zdWJzdHJfY291bnQoJHBjLCRTRU5BUyk7CiAgICBpZigkbiE9PTEpeyAkclsnU1RPUCddPSdwb3N0X2NvbnRlbnQgcmFuZGEgJy4kbjsgfQogICAgZWxzZSB7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTczOV9oMV9iYWsnKSkgYWRkX29wdGlvbigncHNfczE3MzlfaDFfYmFrJywkcGMsJycsJ25vJyk7CiAgICAgICRuZXc9c3RyX3JlcGxhY2UoJFNFTkFTLCROQVVKQVMsJHBjKTsgJHJlcz0kd3BkYi0+dXBkYXRlKCR3cGRiLT5wb3N0cyxbJ3Bvc3RfY29udGVudCc9PiRuZXddLFsnSUQnPT4kSURdKTsgY2xlYW5fcG9zdF9jYWNoZSgkSUQpOwogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygncHJ1bmVfc3VwZXJfY2FjaGUnKSl7IGdsb2JhbCAkY2FjaGVfcGF0aDsgQHBydW5lX3N1cGVyX2NhY2hlKCRjYWNoZV9wYXRoLHRydWUpOyB9CiAgICAgICRyWydhdG5hdWppbnRhJ109JHJlczsgfQogIH0KICBpZigkZj09PSczJyl7CiAgICAkYz1jdXJsX2luaXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC8/bm9jYWNoZT0nLnRpbWUoKSk7IGN1cmxfc2V0b3B0X2FycmF5KCRjLFtDVVJMT1BUX1JFVFVSTlRSQU5TRkVSPT4xLENVUkxPUFRfVElNRU9VVD0+MjAsQ1VSTE9QVF9VU0VSQUdFTlQ9PidNb3ppbGxhLzUuMCBwcy1zZW8nXSk7ICRoPWN1cmxfZXhlYygkYyk7ICRyWydodHRwJ109Y3VybF9nZXRpbmZvKCRjLENVUkxJTkZPX0hUVFBfQ09ERSk7IGN1cmxfY2xvc2UoJGMpOwogICAgcHJlZ19tYXRjaF9hbGwoJy88aDFbXj5dKj4oLio/KTxcL2gxPi9zaScsJGgsJG0pOyAkclsnaDEnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiB0cmltKHN0cmlwX3RhZ3MoJHgpKTt9LCRtWzFdKTsgJHJbJ2xlbiddPXN0cmxlbigkaCk7CiAgICAkYz1jdXJsX2luaXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC8nKTsgY3VybF9zZXRvcHRfYXJyYXkoJGMsW0NVUkxPUFRfUkVUVVJOVFJBTlNGRVI9PjEsQ1VSTE9QVF9USU1FT1VUPT4yMCxDVVJMT1BUX1VTRVJBR0VOVD0+J01vemlsbGEvNS4wIHBzLXNlbzInXSk7ICRoMj1jdXJsX2V4ZWMoJGMpOyBjdXJsX2Nsb3NlKCRjKTsgcHJlZ19tYXRjaF9hbGwoJy88aDFbXj5dKj4oLio/KTxcL2gxPi9zaScsJGgyLCRtMik7ICRyWydoMV9iZV9wYXJhbSddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHRyaW0oc3RyaXBfdGFncygkeCkpO30sJG0yWzFdKTsKICB9CiAgaWYoJGY9PT0nOScpeyAkYj1nZXRfb3B0aW9uKCdwc19zMTczOV9oMV9iYWsnKTsgaWYoJGIpeyAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wb3N0cyxbJ3Bvc3RfY29udGVudCc9PiRiXSxbJ0lEJz0+JElEXSk7IGNsZWFuX3Bvc3RfY2FjaGUoJElEKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkclsnYXRzdGF0eXRhJ109MTsgfSBlbHNlICRyWydhdHN0YXR5dGEnXT0nbmVyYSBiYWsnOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-165713';
const GKEY='ps_s1739g';
const PHASES=["1"];
const OUT='analize/s1739_g.json';
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
