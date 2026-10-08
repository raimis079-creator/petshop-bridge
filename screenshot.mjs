process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU5YiB1enNha3ltYWlAIHBhc3RvIGRlenV0ZTogdGlrICJNYWlsIGRlbGl2ZXJ5IGZhaWxlZCIgbGFpc2t1IGFudHJhc3RlcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NTliJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjUpOyAkcj1bJ3YnPT4nUzE3NTliJ107CiAgdHJ5ewogICRob21lPWRpcm5hbWUoZGlybmFtZShkaXJuYW1lKEFCU1BBVEgpKSk7ICRyWydhYnNwYXRoJ109QUJTUEFUSDsgJHJbJ2hvbWUnXT0kaG9tZTsKICAkY2FuZD1bJGhvbWUuJy9pbWFwL3BldHNob3AubHQvdXpzYWt5bWFpL01haWxkaXInLCRob21lLicvaW1hcC9wZXRzaG9wLmx0L3V6c2FreW1haScsJGhvbWUuJy9tYWlsL3BldHNob3AubHQvdXpzYWt5bWFpJ107CiAgJG1kPW51bGw7IGZvcmVhY2goJGNhbmQgYXMgJGMpeyAkclsna2FuZGlkYXRhaSddWyRjXT1pc19kaXIoJGMpPzE6MDsgaWYoISRtZCAmJiBpc19kaXIoJGMuJy9jdXInKSkgJG1kPSRjOyB9CiAgaWYoISRtZCl7ICRyWydob21lX2xzJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KWdsb2IoJGhvbWUuJy8qJyxHTE9CX09OTFlESVIpKTsgaWYoaXNfZGlyKCRob21lLicvaW1hcCcpKSAkclsnaW1hcF9scyddPWFycmF5X21hcChmdW5jdGlvbigkeCkgdXNlKCRob21lKXsgcmV0dXJuIHN1YnN0cigkeCxzdHJsZW4oJGhvbWUpKTsgfSwoYXJyYXkpZ2xvYigkaG9tZS4nL2ltYXAvKi8qJyxHTE9CX09OTFlESVIpKTsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICRyWydtYWlsZGlyJ109JG1kOyAkc2luY2U9c3RydG90aW1lKCcyMDI2LTEwLTAxIDAwOjAwIFVUQycpOwogICRib3VuY2U9W107ICRwZXJfZD1bXTsgJHBlcl9oPVtdOyAkZ2F2PVtdOyAkcHZ6PW51bGw7ICRzdWJqPVtdOyAkZ2VuPVtdOyAkbl9maWxlcz0wOwogIGZvcmVhY2goWyduZXcnLCdjdXInXSBhcyAkc2QpeyBmb3JlYWNoKChhcnJheSlnbG9iKCRtZC4nLycuJHNkLicvKicpIGFzICRmKXsgJG10PWZpbGVtdGltZSgkZik7IGlmKCRtdDwkc2luY2UpIGNvbnRpbnVlOyAkbl9maWxlcysrOwogICAgJGZoPWZvcGVuKCRmLCdyJyk7ICRoZWFkPWZyZWFkKCRmaCw0MDk2KTsgZmNsb3NlKCRmaCk7CiAgICAkaHA9c3RycG9zKCRoZWFkLCJcclxuXHJcbiIpOyBpZigkaHA9PT1mYWxzZSkgJGhwPXN0cnBvcygkaGVhZCwiXG5cbiIpOyAkSD0kaHAhPT1mYWxzZT9zdWJzdHIoJGhlYWQsMCwkaHApOiRoZWFkOwogICAgaWYoIXByZWdfbWF0Y2goJy9eU3ViamVjdDpccyooTWFpbCBkZWxpdmVyeSBmYWlsZWR8VW5kZWxpdmVyfERlbGl2ZXJ5IFN0YXR1c3xSZXR1cm5lZCBtYWlsfGZhaWx1cmUgbm90aWNlKS9taScsJEgpKSBjb250aW51ZTsKICAgICRkPWdtZGF0ZSgnbS1kJywkbXQpOyAkcGVyX2RbJGRdPSgkcGVyX2RbJGRdPz8wKSsxOyBpZigkbXQ+PXN0cnRvdGltZSgnMjAyNi0xMC0wNyAxMjowMCBVVEMnKSl7ICRoaz1nbWRhdGUoJ20tZCBIOicsJG10KS5zcHJpbnRmKCclMDJkJyxpbnRkaXYoKGludClnbWRhdGUoJ2knLCRtdCksNSkqNSk7ICRwZXJfaFskaGtdPSgkcGVyX2hbJGhrXT8/MCkrMTsgfQogICAgJHQ9ZmlsZV9nZXRfY29udGVudHMoJGYsZmFsc2UsbnVsbCwwLDYwMDAwKTsKICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvXlxzezIsfShbXlxzQF0rQFteXHNdKylccyokL20nLCR0LCRtbSkpeyBmb3JlYWNoKGFycmF5X3VuaXF1ZSgkbW1bMV0pIGFzICRhKXsgJGdhdlskYV09KCRnYXZbJGFdPz8wKSsxOyB9IH0KICAgIGlmKHByZWdfbWF0Y2goJy9eUmVjZWl2ZWQ6IGZyb20gKFxTKylbXlxuXSpcblteXG5dKmJ5IChcUyspL21pJywkdCwkZykpIHsgJGs9JGdbMl07ICRnZW5bJGtdPSgkZ2VuWyRrXT8/MCkrMTsgfQogICAgJGNwPXN0cmlwb3MoJHQsJ1RoaXMgaXMgYSBjb3B5IG9mIHRoZSBtZXNzYWdlJyk7IGlmKCRjcD09PWZhbHNlKSAkY3A9c3RyaXBvcygkdCwnQ29udGVudC1UeXBlOiBtZXNzYWdlL3JmYzgyMicpOyBpZigkY3A9PT1mYWxzZSkgJGNwPXN0cmlwb3MoJHQsJ3RleHQvcmZjODIyLWhlYWRlcnMnKTsKICAgIGlmKCRjcCE9PWZhbHNlKXsgJG89c3Vic3RyKCR0LCRjcCw2MDAwKTsgaWYocHJlZ19tYXRjaCgnL15TdWJqZWN0OlxzKiguezAsOTB9KS9taScsJG8sJHMpKXsgJHNrPXRyaW0oJHNbMV0pOyAkc3Vialskc2tdPSgkc3Vialskc2tdPz8wKSsxOyB9IH0KICAgICRib3VuY2VbXT1bZ21kYXRlKCdtLWQgSDppOnMnLCRtdCksYmFzZW5hbWUoJGYpXTsKICAgIGlmKCEkcHZ6ICYmIHN0cmlwb3MoJHQsJ2NhdHNib29rc2hlcnNoZXlzJykhPT1mYWxzZSl7ICRiaD0kaHAhPT1mYWxzZT9zdWJzdHIoJHQsMCwkaHApOicnOyAkb3JpZz0kY3AhPT1mYWxzZT9zdWJzdHIoJHQsJGNwLDUwMDApOicobmVyYSBrb3Bpam9zKSc7CiAgICAgIC8vIG9yaWdpbmFsbyBhbnRyYXN0ZXMgaWtpIHBpcm1vcyB0dXNjaW9zIGVpbHV0ZXMgcG8ga29waWpvcyB6eW1vcwogICAgICAkb3A9cHJlZ19zcGxpdCgiL1xyP1xuXHI/XG4vIiwkb3JpZyk7ICRwdno9Wydib3VuY2VfYW50cmFzdGVzJz0+bWJfc3Vic3RyKCRiaCwwLDM1MDApLCdvcmlnaW5hbGFzJz0+bWJfc3Vic3RyKGltcGxvZGUoIlxuXG4iLGFycmF5X3NsaWNlKCRvcCwwLDIpKSwwLDQwMDApXTsgfQogIH0gfQogIHVzb3J0KCRib3VuY2UsZnVuY3Rpb24oJGEsJGIpeyByZXR1cm4gc3RyY21wKCRhWzBdLCRiWzBdKTsgfSk7CiAgYXJzb3J0KCRnYXYpOyBhcnNvcnQoJHN1YmopOyBrc29ydCgkcGVyX2QpOyBrc29ydCgkcGVyX2gpOwogICRyKz1bJ2ZhaWx1X251b18xMDAxJz0+JG5fZmlsZXMsJ2JvdW5jZV92aXNvJz0+Y291bnQoJGJvdW5jZSksJ2JvdW5jZV9wZXJfZCc9PiRwZXJfZCwnYm91bmNlXzVtaW5fdXRjJz0+JHBlcl9oLCdwaXJtYXMnPT4kYm91bmNlWzBdPz9udWxsLCdwYXNrdXRpbmlzJz0+ZW5kKCRib3VuY2UpPzpudWxsLCdnYXZlamFpJz0+YXJyYXlfc2xpY2UoJGdhdiwwLDE1LHRydWUpLCdnZW5lcmF2byc9PiRnZW4sJ29yaWdpbmFsb190ZW1vcyc9PmFycmF5X3NsaWNlKCRzdWJqLDAsMTAsdHJ1ZSksJ3B2eic9PiRwdnpdOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-075627';
const GKEY='ps_s1759b';
const PHASES=["1"];
const OUT='out/s1759_b.json';
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
