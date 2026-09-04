process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTQgcnVuIGU0diDigJQgViAobmF1amFzIHByb2Nlc2FzLCB0aWsgc2thaXR5bWFzKTogIzM1NDMxLyMzNTQzNCBwbyDigJ5SZWRhZ3VvdGnigJwg4oCUIHBhc3RhYmEsIMSvdnlraXMgcHJpZcWhL3BvLCBzaGlwcGluZyBsYXVrYWk7IGRldi1wYXN0YXMgxb51cm5hbGFzIChsYWnFoWthcyAjMzU0MzEpOyBQbGF5d3JpZ2h0OiBLbGF1c2ltYWkg4oaSIOKAnlRhaXN5dGkgYWRyZXPEheKAnCBhbnQgIzM1NDM5IChzaW0ga2xhaWRhKSDihpIgc2t5ZGVsaXMgc3UgZm9ybWEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U0diddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE0IGU0dicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogIHRyeXsKICAgIGZvcmVhY2goYXJyYXkoMzU0MzEsMzU0MzQpIGFzICRpZCl7ICR4PXdjX2dldF9vcmRlcigkaWQpOyAkbnQ9d2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4xKSk7ICRldj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgnU0VMRUNUIHZlaWtzbWFzLHJlenVsdGF0YXMsa2FuYWxhcyxrYXNfdmFyZGFzLGxhaWthcyxwYXN0YWJhLHByaWVzLHBvIEZST00gJy5QZXRzaG9wX1V6c2FreW11X0l2eWtpYWk6OnQoKS4nIFdIRVJFIHV6c2FreW1hcz0lZCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEnLCRpZCksQVJSQVlfQSk7CiAgICAgICRvWyRpZF09YXJyYXkoJ3NoJz0+YXJyYXkoJHgtPmdldF9zaGlwcGluZ19hZGRyZXNzXzEoKSwkeC0+Z2V0X3NoaXBwaW5nX3Bvc3Rjb2RlKCkpLCd0ZWwnPT4keC0+Z2V0X2JpbGxpbmdfcGhvbmUoKS4nLycuJHgtPmdldF9zaGlwcGluZ19waG9uZSgpLCd2c29kJz0+KHN0cmluZykkeC0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpLCdwYXN0YWJhJz0+JG50P21iX3N1YnN0cigkbnRbMF0tPmNvbnRlbnQsMCw0MDApOm51bGwsJ2l2eWtpcyc9PiRldik7IH0KICAgICR6PShhcnJheSlnZXRfb3B0aW9uKCdwc19kZXZfcGFzdGFzX3p1cm5hbGFzJyxhcnJheSgpKTsgJG9bJ2Rldl96dXJuYWxhcyddPWNvdW50KCR6KTsgJG9bJ2Rldl9wYXNrdXRpbmlzJ109ZW5kKCR6KTsKICAgICR0dT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkdWlkPSR0dS0+SUQ7ICRleHA9dGltZSgpKzE4MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICAgJG9bJ2Nvb2tpZXMnXT1hcnJheShhcnJheSgnbmFtZSc9PlNFQ1VSRV9BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ3NlY3VyZV9hdXRoJywkdG9rKSksYXJyYXkoJ25hbWUnPT5BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2F1dGgnLCR0b2spKSxhcnJheSgnbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spKSk7CiAgICAkZXZmPSIoYXN5bmMoKT0+e2F3YWl0IG5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQociwyNTAwKSk7IHJldHVybiB7Zm9ybWE6ISFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tSZWRGJyksbGF1a2FpOlsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjc2tSZWRGIGlucHV0Om5vdChbdHlwZT1oaWRkZW5dKScpXS5tYXAoeD0+eC5uYW1lKyc9Jyt4LnZhbHVlKSxrbGF1czooZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NrS2xhdXMnKXx8e2lubmVyVGV4dDonJ30pLmlubmVyVGV4dCx2Oihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tWJyl8fHtpbm5lclRleHQ6Jyd9KS5pbm5lclRleHQucmVwbGFjZSgvXFxzKy9nLCcgJyl9OyB9KSgpIjsKICAgICRvWydzaG90cyddPWFycmF5KGFycmF5KCduJz0+J3MxNjE0X2U0X3RhaXN5dGlfMzU0MzknLCd1Jz0+YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJmVpbGU9a2xhdXNpbWFpJyksJ3cnPT4xNDAwLCdjbGljayc9PicuZGwta29ydGVsZVtkYXRhLWlkPSIzNTQzOSJdIGJ1dHRvbltkYXRhLXJlZGFndW90aV0nLCdldmFsJz0+JGV2ZikpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-154042';
const GKEY='ps_e4v';
const PHASES=["V"];
const OUT='analize/s1614_e4v.json';
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
