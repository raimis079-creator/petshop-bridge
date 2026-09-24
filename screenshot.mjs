process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2ciBTdXBlciBDYWNoZSB0cmFja2luZyBwYXJhbXMgX2dsL19nYSAoMSBudXN0YXR5dGkrcGF0aWtyYSAvIDkgYXRzdGF0eXRpKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTZyJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzE2ciddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgJHI9Wyd2Jz0+J1MxNzE2cicsJ2ZhemUnPT4kZl07CiAgdHJ5ewogICAgaWYoJGY9PT0nMScpewogICAgICBpZighZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9zZXR0aW5nJykpIHRocm93IG5ldyBFeGNlcHRpb24oJ3dwX2NhY2hlX3NldHRpbmcgbmVyYScpOwogICAgICAkY2ZnPVdQX0NPTlRFTlRfRElSLicvd3AtY2FjaGUtY29uZmlnLnBocCc7ICRiYWs9ZGlybmFtZShydHJpbShBQlNQQVRILCcvJykpLicvcHMtYXJjaHl2YXMvd3AtY2FjaGUtY29uZmlnLnBocC5iYWtfczE3MTZiJzsgaWYoIWZpbGVfZXhpc3RzKCRiYWspKSBjb3B5KCRjZmcsJGJhayk7ICRyWydiYWsnXT1bJGJhayxtZDVfZmlsZSgkYmFrKV07CiAgICAgICRyWydwcmllcyddPVsnaWdub3JlJz0+JEdMT0JBTFNbJ3dwc2NfaWdub3JlX3RyYWNraW5nX3BhcmFtZXRlcnMnXT8/bnVsbCwnbGlzdCc9PiRHTE9CQUxTWyd3cHNjX3RyYWNraW5nX3BhcmFtZXRlcnMnXT8/bnVsbF07CiAgICAgIHdwX2NhY2hlX3NldHRpbmcoJ3dwc2NfaWdub3JlX3RyYWNraW5nX3BhcmFtZXRlcnMnLDEpOyB3cF9jYWNoZV9zZXR0aW5nKCd3cHNjX3RyYWNraW5nX3BhcmFtZXRlcnMnLFsnX2dsJywnX2dhJ10pOwogICAgICAkcz1maWxlX2dldF9jb250ZW50cygkY2ZnKTsgcHJlZ19tYXRjaF9hbGwoJyNeLip3cHNjXyhpZ25vcmVfKT90cmFja2luZ19wYXJhbWV0ZXJzLiokI20nLCRzLCRtKTsgJHJbJ2NmZ19laWwnXT0kbVswXTsgJHJbJ3Rva2VuJ109KGJvb2wpQHRva2VuX2dldF9hbGwoJHMsVE9LRU5fUEFSU0UpOwogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7CiAgICAgICRoPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/bmM9Jy5tdF9yYW5kKCkpLFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCk7ICRyWydodG1sJ109Wydrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKSwncGFzc3Rocm91Z2hfdHJ1ZSc9PnByZWdfbWF0Y2goIiN1cmxfcGFzc3Rocm91Z2gnLFxzKnRydWUjIiwkYik/MTowLCdwYXNzdGhyb3VnaF9mYWxzZSc9PnByZWdfbWF0Y2goIiN1cmxfcGFzc3Rocm91Z2gnLFxzKmZhbHNlIyIsJGIpPzE6MCwndjE1Jz0+c3RycG9zKCRiLCdDb25zZW50IEJyaWRnZSB2MS41JykhPT1mYWxzZT8xOjBdOwogICAgfQogICAgaWYoJGY9PT0nMycpeyBmb3JlYWNoKFsnL2thdGVnb3JpamEva2F0ZW1zLycsJy9rYXRlZ29yaWphL2thdGVtcy8/X2dsPTEqYWJjKl91cCpNUS4uKl9nYSp4JywnL2thdGVnb3JpamEva2F0ZW1zLz9fZ2w9MSp6enoqX2dhKnknLCcva2F0ZWdvcmlqYS9rYXRlbXMvP3V0bV9zb3VyY2U9dGVzdCddIGFzICR1KXsgJGg9d3BfcmVtb3RlX2dldChob21lX3VybCgkdSksWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+WydVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIENocm9tZS8xMjgnXV0pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCk7ICRyWydrZXNhcyddWyR1XT1bd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGgpLHByZWdfbWF0Y2goJyNDYWNoZWQgcGFnZSBnZW5lcmF0ZWQjJywkYik/J0NBQ0hFRCc6KHByZWdfbWF0Y2goJyNEeW5hbWljIHBhZ2UgZ2VuZXJhdGVkIycsJGIpPydkeW5hbWljJzonLScpXTsgfSAkclsnY2ZnJ109WydpZ25vcmUnPT4kR0xPQkFMU1snd3BzY19pZ25vcmVfdHJhY2tpbmdfcGFyYW1ldGVycyddPz9udWxsLCdsaXN0Jz0+JEdMT0JBTFNbJ3dwc2NfdHJhY2tpbmdfcGFyYW1ldGVycyddPz9udWxsXTsgfQogICAgaWYoJGY9PT0nOScpeyB3cF9jYWNoZV9zZXR0aW5nKCd3cHNjX2lnbm9yZV90cmFja2luZ19wYXJhbWV0ZXJzJywwKTsgd3BfY2FjaGVfc2V0dGluZygnd3BzY190cmFja2luZ19wYXJhbWV0ZXJzJywnJyk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsgJHJbJ2F0c3RhdHl0YSddPTE7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-214759';
const GKEY='ps_s1716r';
const PHASES=["1"];
const OUT='analize/s1716_r1.json';
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
