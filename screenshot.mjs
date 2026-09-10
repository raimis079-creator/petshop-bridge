process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggYXcg4oCUIFJFQUQtT05MWTogU0Ygc2Fza18xMyAyNjA5MDkgcHJla8SXcyBwYWdhbCBFQU4g4oCUIGFyIHlyYSwga3VyaXMgc2FuZMSXbGlzLCBsaWt1xI1pYWk7IHBhcnRpasWzIGdhbGlvamltbyBsYXVrYXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY4YXcnXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjY4IGF3Jyk7CiAgJGVpbD1hcnJheSgnODAwOTQ3MDAwNTIzNCcsJzgwMDk0NzAwMTQ0MzQnLCc1OTA0NDc5MDgxMDI1JywnNTkwNDQ3OTA4MTEzMScsJzU5MDQ0NzkwODEyMjMnLCc1OTA0NDc5MDgxMjMwJywnNTkwNDQ3OTA4MTI0NycsJzU5MDQ0NzkwODEyNTQnLCc1OTA0NDc5MDgxMzUzJywnNTkwNDQ3OTA4MTQyMScsJzU5MDQ0NzkwODE0NjknLCc1OTA0NDc5MDgxNDkwJywnNTkwNDQ3OTA4MTc3MycpOwogICRrb2RhaT1hcnJheSgnTTA1MjM0JywnTTE0NDM0JywnSE0tODEwMicsJ0hNLTgxMTMnLCdITS04MTIyJywnSE0tODEyMycsJ0hNLTgxMjQnLCdITS04MTI1JywnSE0tODEzNScsJ0hNLTgxNDInLCdITS04MTQ2JywnSE0tODE0OScsJ0hNLTgxNzcnKTsKICBmb3JlYWNoKCRlaWwgYXMgJGk9PiRlKXsgJGs9JGtvZGFpWyRpXTsKICAgICRpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBESVNUSU5DVCBwbS5wb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIHBtIEpPSU4geyRwfXBvc3RzIHggT04geC5JRD1wbS5wb3N0X2lkIEFORCB4LnBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCB4LnBvc3Rfc3RhdHVzPD4ndHJhc2gnIFdIRVJFIChwbS5tZXRhX2tleSBJTiAoJ19lYW4nLCdfZ2xvYmFsX3VuaXF1ZV9pZCcpIEFORCBwbS5tZXRhX3ZhbHVlPSVzKSBPUiAocG0ubWV0YV9rZXkgSU4gKCdfc2t1JywnX3ZmX3N1cHBsaWVyX3NrdScsJ196Yl9za3UnLCdfemJfY29kZScpIEFORCBwbS5tZXRhX3ZhbHVlPSVzKSIsJGUsJGspKTsKICAgICRsPWFycmF5KCk7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJGxbXT1hcnJheSgnaWQnPT4oaW50KSRpZCwndCc9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw0NSksJ3N0Jz0+Z2V0X3Bvc3Rfc3RhdHVzKCRpZCksJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnb3duJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3N0b2NrJyx0cnVlKSwnY29zdCc9PmdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSksJ2Vhbic9PmdldF9wb3N0X21ldGEoJGlkLCdfZWFuJyx0cnVlKT86Z2V0X3Bvc3RfbWV0YSgkaWQsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKSwnc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19za3UnLHRydWUpKTsgfQogICAgJG9bJ3ByZWtlcyddWyRrXT0kbDsgfQogICRvWydwYXJ0aWpvc19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19wYXJ0aWpvcyIpOwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJ0aWpvcycpKXsgJG09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUGFydGlqb3MnLCdwcmlpbXRpJyk7ICRvWydwcmlpbXRpX3BhcmFtJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHgtPmdldE5hbWUoKTt9LCRtLT5nZXRQYXJhbWV0ZXJzKCkpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-135159';
const GKEY='ps_s1668aw';
const PHASES=["1"];
const OUT='analize/s1668_aw.json';
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
