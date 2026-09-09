process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg5IHZlaWtzbWFpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19ibHEnXSk/JF9HRVRbJ3BzX2JscSddOicnOwogIGlmKCRmIT09J0EnJiYkZiE9PSdCJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODknLCdmYXplJz0+JGYsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgaWYoJGY9PT0nQScpewogICAgICAvLyAxLiBXRUxDT01FIE1PREFMCiAgICAgICRvWydtb2RhbF9wcmllcyddPWdldF9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJyk7CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJywnMScsZmFsc2UpOwogICAgICAkb1snbW9kYWxfcG8nXT1nZXRfb3B0aW9uKCdwZXRzaG9wX3dlbGNvbWVfbW9kYWxfZW5hYmxlZCcpOwoKICAgICAgLy8gMi4gU2xhcHRhem9kemlvIHByYW5lc2ltYXMgYWRtaW5pc3RyYXRvcml1aSDigJQgbnV0aWxkb20KICAgICAgJGtvZGFzID0gPDw8J0tPREFTJwovKioKICogUGV0c2hvcCBQYXN0YXMgU2xhcHRhem9kemlvIHByYW5lc2ltYXMgYWRtaW51aSB2MS4wICh3cF9wYXNzd29yZF9jaGFuZ2Vfbm90aWZpY2F0aW9uX2VtYWlsKQogKgogKiBXb3JkUHJlc3MgYnJhbmR1b2x5cyBrYXNrYXJ0LCBrYWkgdmFydG90b2phcyBwYXNpa2VpY2lhIHNsYXB0YXpvZGksCiAqIGlzc2l1bmNpYSBsYWlza2EgYWRtaW5fZW1haWwgYWRyZXN1LiBTdSA1IDY2NiBpbXBvcnR1b3RhaXMga2xpZW50YWlzLAogKiBrdXJpZSBwbyB2aWVubyBhdHNpc3RhdGluZWphIHNsYXB0YXpvZHppdXMsIHRhaSB1emtpbXN0YSBkZXp1dGUuCiAqIEtsaWVudGFzIHNhdm8gbGFpc2thIGdhdW5hIGthaXAgaXByYXN0YSDigJQgbnV0aWxkb21hcyBUSUsgcHJhbmVzaW1hcyBhZG1pbnVpLgogKi8KYWRkX2ZpbHRlciggJ3dwX3Bhc3N3b3JkX2NoYW5nZV9ub3RpZmljYXRpb25fZW1haWwnLCBmdW5jdGlvbiggJGVtYWlsLCAkdXNlciwgJGJsb2duYW1lICkgewoJJGVtYWlsWyd0byddID0gJyc7CglyZXR1cm4gJGVtYWlsOwp9LCAxMCwgMyApOwpLT0RBUzsKICAgICAgJHNsPSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAgICAgJHBhdj0nUGV0c2hvcCBQYXN0YXMgU2xhcHRhem9kemlvIHByYW5lc2ltYXMgYWRtaW51aSB2MS4wICh3cF9wYXNzd29yZF9jaGFuZ2Vfbm90aWZpY2F0aW9uX2VtYWlsKSc7CiAgICAgICRlc2FtYXM9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NICRzbCBXSEVSRSBuYW1lPSVzIiwkcGF2KSxBUlJBWV9BKTsKICAgICAgaWYoY2xhc3NfZXhpc3RzKCdcQ29kZV9TbmlwcGV0c1xTbmlwcGV0JykpewogICAgICAgICRzPW5ldyBcQ29kZV9TbmlwcGV0c1xTbmlwcGV0KCk7CiAgICAgICAgaWYoJGVzYW1hcykgJHMtPmlkPShpbnQpJGVzYW1hc1snaWQnXTsKICAgICAgICAkcy0+bmFtZT0kcGF2OyAkcy0+Y29kZT0ka29kYXM7ICRzLT5zY29wZT0nZ2xvYmFsJzsgJHMtPmFjdGl2ZT10cnVlOyAkcy0+cHJpb3JpdHk9MTA7CiAgICAgICAgJHMtPmRlc2M9J051dGlsZG8gV1AgcHJhbmVzaW1hIGFkbWludWkgYXBpZSBrbGllbnRvIHNsYXB0YXpvZHppbyBrZWl0aW1hLiBTMTY4OS4nOwogICAgICAgICRyPVxDb2RlX1NuaXBwZXRzXHNhdmVfc25pcHBldCgkcyk7CiAgICAgICAgJG9bJ3NuaXBwZXRhcyddPWlzX29iamVjdCgkcik/JHItPmlkOiRyOwogICAgICB9IGVsc2UgJG9bJ3NuaXBwZXRhcyddPSdrbGFzxJdzIG7El3JhJzsKCiAgICAgIC8vIDMuIER1YmxpdW90aSB1enNha3ltYWkKICAgICAgZm9yZWFjaChhcnJheSgzNTg3NCwzNTg3NSkgYXMgJGlkKXsKICAgICAgICAkb3JkPXdjX2dldF9vcmRlcigkaWQpOwogICAgICAgIGlmKCEkb3JkKXsgJG9bJ3V6c2FreW1haSddWyRpZF09J25lcmFzdGFzJzsgY29udGludWU7IH0KICAgICAgICBpZigkb3JkLT5nZXRfc3RhdHVzKCkhPT0ncGVuZGluZycpeyAkb1sndXpzYWt5bWFpJ11bJGlkXT0nbmUgcGVuZGluZywgcHJhbGVpc3RhICgnLiRvcmQtPmdldF9zdGF0dXMoKS4nKSc7IGNvbnRpbnVlOyB9CiAgICAgICAgJG9yZC0+dXBkYXRlX3N0YXR1cygnY2FuY2VsbGVkJywnQXTFoWF1a3RhIHJhbmtpbml1IGLFq2R1OiBrbGllbnRhcyB0YW0gcGHEjWlhbSBrcmVwxaFlbGl1aSBzdWvFq3LElyB0cmlzIHXFvnNha3ltdXMgKCMzNTg3MyBsYXVraWEgcGF2ZWRpbW8pLiBMaWt1dGlzIGdyxIXFvmluYW1hcy4gUzE2ODkuJyk7CiAgICAgICAgJG9bJ3V6c2FreW1haSddWyRpZF09J2F0xaFhdWt0YXMnOwogICAgICB9CiAgICAgICRvWydsaWt1dGlzX3BvJ109Z2V0X3Bvc3RfbWV0YSgxNDk1MSwnX3N0b2NrJyx0cnVlKTsKICAgIH0KICAgIGlmKCRmPT09J0InKXsKICAgICAgJG9bJ21vZGFsJ109Z2V0X29wdGlvbigncGV0c2hvcF93ZWxjb21lX21vZGFsX2VuYWJsZWQnKTsKICAgICAgJG9bJ2ZpbHRyYXNfcmVnaXN0cnVvdGFzJ109aGFzX2ZpbHRlcignd3BfcGFzc3dvcmRfY2hhbmdlX25vdGlmaWNhdGlvbl9lbWFpbCcpPyd0YWlwJzonbmUnOwogICAgICAkdD0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcnMnOwogICAgICAkb1sndXpzYWt5bWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLHRvdGFsX2Ftb3VudCBGUk9NICR0IFdIRVJFIGlkIElOICgzNTg3MywzNTg3NCwzNTg3NSkiLEFSUkFZX0EpOwogICAgICAkb1snbGlrdXRpc18xNDk1MSddPWdldF9wb3N0X21ldGEoMTQ5NTEsJ19zdG9jaycsdHJ1ZSk7CiAgICAgIC8vIGFyIG1vZGFsbyBrb2RhcyBwYXRlbmthIGkgcHVzbGFwaQogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidNb3ppbGxhLzUuMCBDaHJvbWUvMTUyJykpKTsKICAgICAgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgICAgJG9bJ3RpdHVsaW5pcyddPWFycmF5KCdrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwKICAgICAgICAnd2VsY29tZSc9PnN1YnN0cl9jb3VudCgkYiwnd2VsY29tZScpK3N1YnN0cl9jb3VudCgkYiwncHMtd2VsY29tZScpLAogICAgICAgICdzdmVpa2knPT5zdWJzdHJfY291bnQoJGIsJ1N2ZWlraScpLAogICAgICAgICdtb2RhbCc9PnN1YnN0cl9jb3VudCgkYiwnbW9kYWwnKSk7CiAgICAgIC8vIG1vZGFsbyBmYWlsYXMKICAgICAgZm9yZWFjaChzY2FuZGlyKFdQTVVfUExVR0lOX0RJUikgYXMgJHgpeyBpZihzdHJpcG9zKCR4LCd3ZWxjb21lJykhPT1mYWxzZXx8c3RyaXBvcygkeCwnbW9kYWwnKSE9PWZhbHNlKSAkb1snbW9kYWxvX2ZhaWxhcyddW109JHg7IH0KICAgICAgJG9bJ3NuaXBwZXRhaV93ZWxjb21lJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJyVlbGNvbWUlJyBPUiBjb2RlIExJS0UgJyV3ZWxjb21lX21vZGFsX2VuYWJsZWQlJyIsQVJSQVlfQSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-103707';
const GKEY='ps_blq';
const PHASES=["A", "B"];
const OUT='analize/s1689_a.json';
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
