process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5cCDigJQgNTAwIHJlY29uOiBmaWx0cnUtc2FyZ2FzIHR1cmlueXMsIFdDIGdldF9jdXJyZW50X3BhZ2VfdXJsLCBrbGFpZG9zIGF0a2FydG9qaW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTlwJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcxOXAnXTsKICB0cnl7CiAgICAkclsnZmlsdHJ1X3NhcmdhcyddPWZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wZXRzaG9wLWZpbHRydS1zYXJnYXMucGhwJyk7CiAgICAkd2M9ZmlsZV9nZXRfY29udGVudHMoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3dvb2NvbW1lcmNlL2luY2x1ZGVzL2Fic3RyYWN0cy9hYnN0cmFjdC13Yy13aWRnZXQucGhwJyk7IGlmKHByZWdfbWF0Y2goJy9wcm90ZWN0ZWQgZnVuY3Rpb24gZ2V0X2N1cnJlbnRfcGFnZV91cmxcKFwpW1xzXFNdezAsMjIwMH0/XG5cdH0vJywkd2MsJG0pKSAkclsnd2NfZm4nXT0kbVswXTsKICAgICR1PSdodHRwczovL3BldHNob3AubHQva2F0ZWdvcmlqYS9rYXRlbXMvP3lpdGhfd2Nhbj0xJnByb2R1Y3RfY2F0PXR1YWxldGFpLWtyYWlrYWktc2VtdHV2ZWxpYWksa3JhaWthaS1rYWNpdS10dWFsZXRhbXMmcXVlcnlfdHlwZV9wcm9kdWN0X2NhdD1vciZxdWVyeV90eXBlX3RpcGFzPW9yJmZpbHRlcl90aXBhcz1hdHZpcmFzJzsKICAgIGZvcmVhY2goWydwYXByYXN0YXMnPT5bXSwnYWpheCc9PlsnWC1SZXF1ZXN0ZWQtV2l0aCc9PidYTUxIdHRwUmVxdWVzdCcsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJ11dIGFzICRrPT4kaCl7ICRoWydjb29raWUnXT0ncHNfanM9MSc7ICRoWyd1c2VyLWFnZW50J109J01vemlsbGEvNS4wIHBzLXRlc3QnOyAkcnM9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT4kaCwnbGltaXRfcmVzcG9uc2Vfc2l6ZSc9PjQwMF0pOyAkclsndGVzdF8nLiRrXT1pc193cF9lcnJvcigkcnMpPyRycy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpLicgJy5zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MoKHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcnMpKSksMCw4MCk7IH0KICAgICR1Mj0naHR0cHM6Ly9wZXRzaG9wLmx0L2thdGVnb3JpamEva2F0ZW1zLz9wcm9kdWN0X2NhdD10dWFsZXRhaS1rcmFpa2FpLXNlbXR1dmVsaWFpLGtyYWlrYWkta2FjaXUtdHVhbGV0YW1zJnF1ZXJ5X3R5cGVfcHJvZHVjdF9jYXQ9b3InOwogICAgJHJzPXdwX3JlbW90ZV9nZXQoJHUyLFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PlsnY29va2llJz0+J3BzX2pzPTEnLCd1c2VyLWFnZW50Jz0+J01vemlsbGEvNS4wIHBzLXRlc3QnXSwnbGltaXRfcmVzcG9uc2Vfc2l6ZSc9PjQwMF0pOyAkclsndGVzdF9iZV9maWx0ZXInXT1pc193cF9lcnJvcigkcnMpPyRycy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpOwogICAgJGVsPWluaV9nZXQoJ2Vycm9yX2xvZycpOyAkc3o9ZmlsZXNpemUoJGVsKTsgJGZoPWZvcGVuKCRlbCwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTIwMDAwKSk7ICR0PWZyZWFkKCRmaCwyMDAwMCk7IGZjbG9zZSgkZmgpOyAkclsnbG9nX3RhaWxfc3Ryc3RyJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoZnVuY3Rpb24oJGwpe3JldHVybiBzdWJzdHIoJGwsMCwxMjApO30sZXhwbG9kZSgiXG4iLCR0KSksZnVuY3Rpb24oJGwpe3JldHVybiBzdHJwb3MoJGwsJ3N0cnN0cicpIT09ZmFsc2U7fSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-160309';
const GKEY='ps_s1719p';
const PHASES=["1"];
const OUT='analize/s1719_p.json';
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
