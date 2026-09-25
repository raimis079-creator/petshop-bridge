process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3ZiByZWNvbiByZWFkLW9ubHk6IEdvb2dsZSAoZ2NsaWQvdXRtKSBrb250cmlidWNpamEgcG8gc2l1bnRvcyBwZXIgdmlldGluZSBkaWVuYSArIG1pc3J1cyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTdmJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzE3ZiddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3MTdmJywnZmF6ZSc9PiRmXTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJGdzPSIodS5nY2xpZDw+JycgT1IgdS51dG1fc291cmNlPSdnb29nbGUnIE9SIHUudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnKSI7CiAgICAkZ2I9Iih1LmxhbmRpbmdfdXJsIExJS0UgJyVnY2xpZD0lJyBPUiB1LmxhbmRpbmdfdXJsIExJS0UgJyV1dG1fc291cmNlPWdvb2dsZSUnIE9SIHUubGFuZGluZ191cmwgTElLRSAnJWdhZF9jYW1wYWlnbmlkPSUnIE9SIHUubGFuZGluZ191cmwgTElLRSAnJWdicmFpZD0lJyBPUiB1LmxhbmRpbmdfdXJsIExJS0UgJyV3YnJhaWQ9JScpIjsKICAgICRzcT0iKFNFTEVDVCB1enNha3ltYXNfaWQsIFNVTShrYWluYV92ZXplam9fY3QpIGN0IEZST00geyRQfXBzX2Zha3Rfc2l1bnRvcyBXSEVSRSBDT0FMRVNDRShzdGF0dXNhcywnJyk8PidhdHNhdWt0YScgR1JPVVAgQlkgdXpzYWt5bWFzX2lkKSI7CiAgICAkclsnZGllbmEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKHUuc3VrdXJ0YV9hdCArIElOVEVSVkFMIDMgSE9VUikgZCwgU1VNKCRncykgZ19uLCBST1VORChTVU0oSUYoJGdzLHUudmlzb19jdCwwKSkvMTAwKSBnX2V1ciwgUk9VTkQoU1VNKElGKCRncyx1LmtvbnRyaWJ1Y2lqYV9jdCwwKSkvMTAwLDEpIGdfa29udHIsIFJPVU5EKFNVTShJRigkZ3MsQ09BTEVTQ0Uocy5jdCwxNTgpLDApKS8xMDAsMSkgZ19zaXVudCwgU1VNKElGKCRncyx1LmtsaWVudGFzX25hdWphcywwKSkgZ19uYXVqaSwgU1VNKElGKCRnYiBBTkQgTk9UICRncywxLDApKSBtaXhfbiwgR1JPVVBfQ09OQ0FUKElGKCRnYiBBTkQgTk9UICRncyxDT05DQVQodS51enNha3ltYXNfaWQsJzonLENPQUxFU0NFKE5VTExJRih1LnV0bV9zb3VyY2UsJycpLHUua2FuYWxhc19wYXNrdXRpbmlzKSksTlVMTCkpIG1peCBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSB1IExFRlQgSk9JTiAkc3EgcyBPTiBzLnV6c2FreW1hc19pZD11LnV6c2FreW1hc19pZCBXSEVSRSB1LnRlc3RpbmlzPTAgQU5EIHUuc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgQU5EIHUuc3VrdXJ0YV9hdD49JzIwMjYtMDktMTcgMjE6MDA6MDAnIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnYWRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEgZCwgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyIEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBBTkQgZGllbmE+PScyMDI2LTA5LTE4JyBHUk9VUCBCWSBkaWVuYSBPUkRFUiBCWSBkaWVuYSIsQVJSQVlfQSk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRyWydkYl9lcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-065830';
const GKEY='ps_s1717f';
const PHASES=["1"];
const OUT='analize/s1717_f.json';
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
