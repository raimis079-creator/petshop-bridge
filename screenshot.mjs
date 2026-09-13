process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzkgZCDigJQgREVQTE9ZOiByaW5raWtsaXMgcGV0c2hvcC1hbmFsaXRpa2EucGhwIHYxLjIgYXRzdGF0b21hcywgbGFuZ2FzIC0+IHBldHNob3AtYW5hbGl0aWthLWxhbmdhcy5waHAgdjEuMC4yIChmYXrElyBEKTsgcGF0aWtyYSAoZmF6xJcgVCkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjc5ZCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRGPSRfR0VUWydwc19zMTY3OWQnXTsgJG89YXJyYXkoJ3YnPT4nUzE2NzkgZCcsJ2ZhemUnPT4kRik7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRmcj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWFuYWxpdGlrYS5waHAnOyAkZmw9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hbmFsaXRpa2EtbGFuZ2FzLnBocCc7ICRiZD13cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMvJzsgJGJrPSRiZC4ncGV0c2hvcC1hbmFsaXRpa2EucGhwLmJha19zMTY3OSc7CiAgJGRlYz1mdW5jdGlvbigkayl7ICRtaWQ9aXNzZXQoJF9HRVRbJGtdKT8oaW50KSRfR0VUWyRrXTowOyAkbWY9JG1pZD9nZXRfYXR0YWNoZWRfZmlsZSgkbWlkKTonJzsgJGM9JG1mJiZmaWxlX2V4aXN0cygkbWYpP2d6ZGVjb2RlKGJhc2U2NF9kZWNvZGUodHJpbShmaWxlX2dldF9jb250ZW50cygkbWYpKSkpOmZhbHNlOyBpZigkbWlkKSB3cF9kZWxldGVfYXR0YWNobWVudCgkbWlkLHRydWUpOyByZXR1cm4gJGM7IH07CiAgaWYoJEY9PT0nRCcpewogICAgJG9bJ2Jha19lc2FtaSddPWFycmF5X21hcCgnYmFzZW5hbWUnLGFycmF5X21lcmdlKGdsb2IoJGJkLidwZXRzaG9wLWFuYWxpdGlrYSonKSxnbG9iKGRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy8qL3BldHNob3AtYW5hbGl0aWthKicpKSk7CiAgICAkcmluaz0kZGVjKCdkX2FuX3JpbmtfdjEyX3R4dCcpOyAkbGFuZz0kZGVjKCdkX2FuX2xhbmdhc192MTAyX3R4dCcpOwogICAgJG9bJ2d5dmFzX21kNSddPW1kNV9maWxlKCRmcik7ICRvWydyaW5rX21kNSddPSRyaW5rP21kNSgkcmluayk6bnVsbDsgJG9bJ2xhbmdfbWQ1J109JGxhbmc/bWQ1KCRsYW5nKTpudWxsOyAkb1snbGFuZ2FzX3lyYSddPWZpbGVfZXhpc3RzKCRmbCk7CiAgICBpZigkb1snZ3l2YXNfbWQ1J10hPT0nYjE4MWQyYjQ5ZjI3NTBkMGE1N2Y3N2YxYzlkM2UyNzUnKSAkb1snU1RPUCddPSdneXZhcyBuZSB2MS4wLjEnOwogICAgZWxzZWlmKCRvWydyaW5rX21kNSddIT09J2ZhYjVlNWE4YWM5YzNjZWQxNWZlM2E2YTgwZWViNjljJ3x8JG9bJ2xhbmdfbWQ1J10hPT0nZjE3MGQyYzIzNGVkNjA3MTIzODk5NjQwZTQ1ZDE0MzUnKSAkb1snU1RPUCddPSdtZDUnOwogICAgZWxzZWlmKEB0b2tlbl9nZXRfYWxsKCRyaW5rLFRPS0VOX1BBUlNFKT09PWZhbHNlfHxAdG9rZW5fZ2V0X2FsbCgkbGFuZyxUT0tFTl9QQVJTRSk9PT1mYWxzZSkgJG9bJ1NUT1AnXT0nU0lOVEFLU0UnOwogICAgZWxzZSB7IGNvcHkoJGZyLCRiayk7IGZpbGVfcHV0X2NvbnRlbnRzKCRmbCwkbGFuZyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRmciwkcmluayk7ICRvWydpcmFzeXRhJ109YXJyYXkobWQ1X2ZpbGUoJGZyKSxtZDVfZmlsZSgkZmwpKTsKICAgICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19waW5nX3MxNjc5ZD0nLnRpbWUoKSksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGM9aXNfd3BfZXJyb3IoJHIpPydFUlInOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsgJG9bJ3BpbmcnXT0kYzsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHIpfHwkYz49NTAwKXsgY29weSgkYmssJGZyKTsgQHVubGluaygkZmwpOyAkb1snUk9MTEJBQ0snXT1tZDVfZmlsZSgkZnIpOyB9IH0KICB9CiAgaWYoJEY9PT0nVCcpewogICAgJG9bJ21kNSddPWFycmF5KG1kNV9maWxlKCRmciksZmlsZV9leGlzdHMoJGZsKT9tZDVfZmlsZSgkZmwpOm51bGwpOwogICAgJG9bJ2tsYXNlcyddPWFycmF5KCdyaW5rJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FuYWxpdGlrYScpPyhuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FuYWxpdGlrYScpKS0+Z2V0RmlsZU5hbWUoKS4nIHYnLlBldHNob3BfQW5hbGl0aWthOjpWRVJTSUpBOidORVJBJywnbGFuZyc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9BbmFsaXRpa2FfTGFuZ2FzJyk/YmFzZW5hbWUoKG5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfQW5hbGl0aWthX0xhbmdhcycpKS0+Z2V0RmlsZU5hbWUoKSk6J05FUkEnKTsKICAgICRwcmllcz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgZGllbmE9Q1VSREFURSgpIik7CiAgICAkcj13cF9yZW1vdGVfcG9zdChob21lX3VybCgnLz9yZXN0X3JvdXRlPS9wcy13ZWIvdjEvaScpLGFycmF5KCd0aW1lb3V0Jz0+MTUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0NvbnRlbnQtVHlwZSc9Pid0ZXh0L3BsYWluJywnVXNlci1BZ2VudCc9PidNb3ppbGxhLzUuMCAoWDExOyBMaW51eCkgQ2hyb21lLzEyOCBTMTY3OXRlc3QnKSwnYm9keSc9Pmpzb25fZW5jb2RlKGFycmF5KCdlJz0+J3BhZ2VfdmlldycsJ3UnPT4nLz9wc19zMTY3OV90ZXN0PTEnLCdwdCc9PidvdGhlcicsJ3MnPT4ndF9zMTY3OXwxfDF8eCcsJ3YnPT4nczE2Nzl0ZXN0JykpKSk7CiAgICAkb1sncmVzdCddPWlzX3dwX2Vycm9yKCRyKT8kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTphcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSwwLDIwMCkpOwogICAgJG9bJ2l2eWtpYWlfc2lhbmRpZW4nXT1hcnJheSgkcHJpZXMsKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBzX3dlYl9pdnlraWFpIFdIRVJFIGRpZW5hPUNVUkRBVEUoKSIpKTsKICAgICRvWydwYXNrJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBpZCxsYWlrYXMsdGlwYXMsdXJsX2tlbGlhcyBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICAgJG9bJ21lbnUnXT1oYXNfYWN0aW9uKCdhZG1pbl9tZW51Jyk7IAogICAgJGxvZz1kaXJuYW1lKEFCU1BBVEgpLicvbG9ncy9waHBfZXJyb3IubG9nJzsgJG9bJ2xvZ19mYXRhbCddPWZpbGVfZXhpc3RzKCRsb2cpP2NvdW50KGFycmF5X2ZpbHRlcihhcnJheV9zbGljZShmaWxlKCRsb2cpLC0zMCksZnVuY3Rpb24oJGwpe3JldHVybiBzdHJpcG9zKCRsLCdmYXRhbCcpIT09ZmFsc2V8fHN0cmlwb3MoJGwsJ3JlZGVjbGFyZScpIT09ZmFsc2U7fSkpOm51bGw7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-161417';
const GKEY='ps_s1679d';
const PHASES=["D", "T"];
const OUT='analize/s1679_d2.json';
const DATA=["deploy/an_rink_v12.txt", "deploy/an_langas_v102.txt"];
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
