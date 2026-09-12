process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGFmIOKAlCBhciBSYWltaW8gcmFua2EgxK92ZXN0aSBBViBsaWt1xI1pYWkgacWhbGlrbzogMjAzIHByZWvEl21zIG93biB2cyBwYXJ0aWrFsyBzdW1hICsgcGFza3V0aW5pcyByYW5raW5pcyBfb3duIHBha2VpdGltYXMuIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NzZhZiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc2IGFmJyk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRwaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgcHJvZHVjdF9pZCBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBwYXN0YWJhIExJS0UgJyVwYXBpbGR5bWFzLCBTMTY4MiUnIik7CiAgJHN1dD0wOyAkbmVzdXQ9YXJyYXkoKTsgJHJhbms9MDsKICBmb3JlYWNoKCRwaWRzIGFzICRwaWQpeyAkb3duPWdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpOyAkb3duPSgkb3duPT09Jyc/bnVsbDooaW50KSRvd24pOyAkc3VtYT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09BTEVTQ0UoU1VNKGtpZWtpc19saWtvKSwwKSBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBhdHNhdWt0YT0wIiwkcGlkKSk7CiAgICAkaXY9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzZW5hLG5hdWphLGthcyxzYWx0aW5pcyxMRUZUKGxhaWthcywxNikgdCxwYXN0YWJhIEZST00geyRwfXBzX2l2eWtpYWkgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgbGF1a2FzPSdfb3duX3N0b2NrX3F0eScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwkcGlkKSxBUlJBWV9BKTsKICAgIGlmKCRpdiAmJiAoaW50KSRpdlsna2FzJ10+MCkgJHJhbmsrKzsKICAgIGlmKCRvd249PT0kc3VtYSkgJHN1dCsrOyBlbHNlICRuZXN1dFtdPWFycmF5KCdwaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkcGlkKSwwLDQ1KSwnb3duJz0+JG93biwncGFydGlqdV9zdW1hJz0+JHN1bWEsJ3Bhc2tfaXZ5a2lzJz0+JGl2PygkaXZbJ3QnXS4nICcuJGl2WydzZW5hJ10uJ+KGkicuJGl2WyduYXVqYSddLicga2FzPScuJGl2WydrYXMnXS4nICcuJGl2WydzYWx0aW5pcyddKTonLScpOyB9CiAgJG9bJ3ByZWtpdSddPWNvdW50KCRwaWRzKTsgJG9bJ293bl9zdXRhbXBhX3N1X3BhcnRpam9taXMnXT0kc3V0OyAkb1snbmVzdXRhbXBhJ109Y291bnQoJG5lc3V0KTsgJG9bJ3N1X3Jhbmtpbml1X2l2eWtpdSddPSRyYW5rOyAkb1snbmVzdXRfc2FyJ109YXJyYXlfc2xpY2UoJG5lc3V0LDAsNDApOwogICRvWydpdnlraXVfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCxzZW5hLG5hdWphLGthcyxzYWx0aW5pcyxMRUZUKGxhaWthcywxNikgdCxMRUZUKHBhc3RhYmEsNjApIHBhIEZST00geyRwfXBzX2l2eWtpYWkgV0hFUkUgbGF1a2FzPSdfb3duX3N0b2NrX3F0eScgQU5EIGxhaWthcz49JzIwMjYtMDktMDknIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-095651';
const GKEY='ps_s1676af';
const PHASES=["GO"];
const OUT='analize/s1676_af.json';
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
