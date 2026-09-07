process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIG0g4oCUIEQ6IG11LXBsdWdpbnMvcGV0c2hvcC1rYXRhbG9nYXMucGhwIHY4LjcuMeKGknY4LjcuMiAodmlyc3VzKCkgcGVyc2thaWNpYXZpbWFzIHNjcm9sbCdpbmFudCwgckFGOyBzYXJnYWk6IG1kNSwgY291bnQ9PTEsIHRva2VuX2dldF9hbGwsIGtvcGlqYSwgcGluZy1yb2xsYmFjaykuIEdyYXppbmEgbmF1am8gZmFpbG8gYjY0IHJlcG8gc2luY2hyb25pemFjaWphaS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzZtJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MzYgbScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogICRwaW5nPWZ1bmN0aW9uKCl7ICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi1hamF4LnBocD9hY3Rpb249aGVhcnRiZWF0JyksYXJyYXkoJ3RpbWVvdXQnPT45MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7IHJldHVybiBhcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwnZmF0YWwnPT4oaW50KShzdHJpcG9zKCRiLCdGYXRhbCBlcnJvcicpIT09ZmFsc2UpKTsgfTsKICAkZnA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGJrPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcy9wZXRzaG9wLWthdGFsb2dhcy12ODcxLUJBQ0tVUC0yMDI2LTA5LTA3LnBocCc7CiAgdHJ5ewogICRsaXZlPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGZwKTsgJG9bJ21kNV9wcmllcyddPW1kNSgkbGl2ZSk7ICRvWydkeWRpc19wcmllcyddPXN0cmxlbigkbGl2ZSk7CiAgJG9sZD0iXHRcdFx0dmlyc3VzKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB2aXJzdXMpO1xuXHRcdFx0c2V0VGltZW91dCh2aXJzdXMsIDQwMCk7IHNldFRpbWVvdXQodmlyc3VzLCAxMjAwKTsiOwogICRuZXc9Ilx0XHRcdHZpcnN1cygpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdmlyc3VzKTtcblx0XHRcdC8qIHY4LjcuMiAoUzE2MzYpOiBicmVhZGNydW1iIG51c2xlbmthIC0+IGp1b3N0b3MgYXBhY2lhIGt5bGEsIG8gdGhlYWQgbGlrZGF2b1xuXHRcdFx0ICAgdGllcyBzZW51IC0tcHMtdmlyc3VzIChwbHlzeXMgdmlycyBhbnRyYXN0ZXMpLiBQZXJza2FpY2l1b2phbSBzY3JvbGxpbmFudC4gKi9cblx0XHRcdHZhciB2UkFGPWZhbHNlOyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBmdW5jdGlvbigpeyBpZih2UkFGKSByZXR1cm47IHZSQUY9dHJ1ZTsgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7IHZSQUY9ZmFsc2U7IHZpcnN1cygpOyB9KTsgfSwge3Bhc3NpdmU6dHJ1ZX0pO1xuXHRcdFx0c2V0VGltZW91dCh2aXJzdXMsIDQwMCk7IHNldFRpbWVvdXQodmlyc3VzLCAxMjAwKTsiOwogIGlmKG1kNSgkbGl2ZSk9PT0nX19OQVVKQVNfTUQ1X18nIHx8IHN1YnN0cl9jb3VudCgkbGl2ZSwndjguNy4yIChTMTYzNiknKT09PTEpeyAkb1snamF1X3Y4NzInXT0xOyAkb1snYjY0J109YmFzZTY0X2VuY29kZSgkbGl2ZSk7ICRKKCRvKTsgfQogICRuPXN1YnN0cl9jb3VudCgkbGl2ZSwkb2xkKTsgJG9bJ29sZF9jb3VudCddPSRuOyBpZigkbiE9PTEpeyAkb1snU1RPUCddPSdvbGRfY291bnQhPTEnOyAkSigkbyk7IH0KICAkbmF1amFzPXN0cl9yZXBsYWNlKCRvbGQsJG5ldywkbGl2ZSk7CiAgJG5hdWphcz1zdHJfcmVwbGFjZSgnICogUGV0c2hvcCBLYXRhbG9nYXMgdjguNy4xIChTOTAzKSAtIFNUVUxQRUxJVSBBTlRSQVNURSBORUpVREEuJywnICogUGV0c2hvcCBLYXRhbG9nYXMgdjguNy4yIChTMTYzNikgLSBzdGlja3kgYW50cmFzdGUgc2VrYSBqdW9zdGEgc2Nyb2xsaW5hbnQuJy4iXG4iLicgKiB2OC43LjEgKFM5MDMpIC0gU1RVTFBFTElVIEFOVFJBU1RFIE5FSlVEQS4nLCRuYXVqYXMpOwogIHRyeXsgdG9rZW5fZ2V0X2FsbCgkbmF1amFzLFRPS0VOX1BBUlNFKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydTVE9QJ109J3Rva2VuOiAnLiRlLT5nZXRNZXNzYWdlKCk7ICRKKCRvKTsgfQogICRvWydrb3BpamEnXT0oaW50KWZpbGVfcHV0X2NvbnRlbnRzKCRiaywkbGl2ZSk7CiAgJG9bJ2lyYXN5dGEnXT0oaW50KWZpbGVfcHV0X2NvbnRlbnRzKCRmcCwkbmF1amFzKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmcCx0cnVlKTsKICAkb1sncGluZyddPSRwaW5nKCk7IGlmKCRvWydwaW5nJ11bJ2ZhdGFsJ118fCRvWydwaW5nJ11bJ2NvZGUnXT49NTAwKXsgZmlsZV9wdXRfY29udGVudHMoJGZwLCRsaXZlKTsgJG9bJ0FUS1VSVEEnXT1tZDVfZmlsZSgkZnApOyAkSigkbyk7IH0KICAkb1snbWQ1X3BvJ109bWQ1X2ZpbGUoJGZwKTsgJG9bJ2R5ZGlzX3BvJ109ZmlsZXNpemUoJGZwKTsgJG9bJ2I2NCddPWJhc2U2NF9lbmNvZGUoJG5hdWphcyk7CiAgJEooJG8pOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyAkSigkbyk7IH0KfSw5OSk7Cg==';
const VER='dep-165348';
const GKEY='ps_s1636m';
const PHASES=["M"];
const OUT='analize/s1636_m2.json';
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
