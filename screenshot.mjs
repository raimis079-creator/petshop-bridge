process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc0cjIgcmlraWF2aW1vIHR5cmltYXMgMiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzRxJ10pKSByZXR1cm47ICRyPVsndic9PidyMiddOyBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICRxPW5ldyBXUF9RdWVyeShbJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+MjQsJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+J3NhdXNhcy1tYWlzdGFzLXN1bmltcyddXSwnd2NfcXVlcnknPT4ncHJvZHVjdF9xdWVyeScsJ2ZpZWxkcyc9PidpZHMnXSk7CiAgLyogaW1pdHVvamFtIHBhZ3JpbmRpbsSZIHXFvmtsYXVzxIUgcGVyIFdDX1F1ZXJ5LCBrYWQgc3V2ZWlrdMWzIHJpa2lhdmltYXMgKi8KICAkYXJncz1bJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+MjQsJ3Byb2R1Y3RfY2F0Jz0+J3NhdXNhcy1tYWlzdGFzLXN1bmltcyddOwogICRyWydzcWxfcGFzdGFiYSddPSd0aWsgcGFseWdpbmltdWknOwogICRpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRCBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEpPSU4geyR3cGRiLT50ZXJtc30gdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBMRUZUIEpPSU4geyR3cGRiLT5wcmVmaXh9d2NfcHJvZHVjdF9tZXRhX2xvb2t1cCBsIE9OIGwucHJvZHVjdF9pZD1wLklEIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHQuc2x1Zz0lcyBPUkRFUiBCWSAobC5zdG9ja19zdGF0dXM9J291dG9mc3RvY2snKSBBU0MsIHAubWVudV9vcmRlciBBU0MsIHAucG9zdF90aXRsZSBBU0MgTElNSVQgNDAwIiwnc2F1c2FzLW1haXN0YXMtc3VuaW1zJykpOwogICRuZWF0PTA7ICRlaWw9W107CiAgZm9yZWFjaCgkaWRzIGFzICRpPT4kaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOwogICAgJGxrPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc3RvY2tfc3RhdHVzIEZST00geyR3cGRiLT5wcmVmaXh9d2NfcHJvZHVjdF9tZXRhX2xvb2t1cCBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkaWQpKTsKICAgICRtZXRhPWdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2tfc3RhdHVzJyx0cnVlKTsgJGRwPWdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKTsKICAgICR2aXM9JHAtPmdldF9jYXRhbG9nX3Zpc2liaWxpdHkoKTsKICAgICRpc2luPSRwLT5pc19pbl9zdG9jaygpOwogICAgJGh0bWw9d2NfZ2V0X3N0b2NrX2h0bWwoJHApOwogICAgJG5ldHVyaW1lX3JvZG89KHN0cmlwb3MoJGh0bWwsJ25ldHVyaW1lJykhPT1mYWxzZXx8c3RyaXBvcygkaHRtbCwnb3V0LW9mLXN0b2NrJykhPT1mYWxzZSk7CiAgICBpZigkbGshPT0nb3V0b2ZzdG9jaycgJiYgKCEkaXNpbiB8fCAkbmV0dXJpbWVfcm9kbykpIHsgJG5lYXQrKzsgaWYoY291bnQoJGVpbCk8MjUpICRlaWxbXT1bJGlkLG1iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDUwKSwnbG9va3VwPScuJGxrLCdtZXRhPScuJG1ldGEsJ2lzX2luPScuKGludCkkaXNpbiwnZHA9Jy4kZHAsJ3RpcGFzPScuJHAtPmdldF90eXBlKCksJ21hbmFnZT0nLihpbnQpJHAtPmdldF9tYW5hZ2Vfc3RvY2soKSwnc3RvY2s9Jy4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3Zpcz0nLiR2aXNdOyB9CiAgfQogICRyWyd2aXNvJ109Y291bnQoJGlkcyk7ICRyWyduZWF0aXRpa2ltYWknXT0kbmVhdDsgJHJbJ3B2eiddPSRlaWw7CiAgLyogdmlzb3MgcGFyZHVvdHV2xJdzIG1hc3R1ICovCiAgJHJbJ3Zpc3VyJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbC5zdG9ja19zdGF0dXMgbG9va3VwLCBtLm1ldGFfdmFsdWUgbWV0YSwgQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnByZWZpeH13Y19wcm9kdWN0X21ldGFfbG9va3VwIGwgT04gbC5wcm9kdWN0X2lkPXAuSUQgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgMSwyIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-112127';
const GKEY='ps_s1874q';
const PHASES=["GO"];
const OUT='analize/s1874_r2.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
