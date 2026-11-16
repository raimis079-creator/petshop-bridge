process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODczIGxpa3VjaXUgc3RhYmlsdW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzNzMiddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nc3QxJ107IGdsb2JhbCAkd3BkYjsgJHB4PSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJHJbJ3NhbmQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzYW5kZWxpcywgQ09VTlQoRElTVElOQ1QgcHJla2VfaWQpIG4sIE1JTihkYXRhKSBudW8sIE1BWChkYXRhKSBpa2kgRlJPTSB7JHB4fXBzX2Zha3RfYXRzYXJnb3NfZCBHUk9VUCBCWSBzYW5kZWxpcyIsQVJSQVlfQSk7CiAgICAkbnVvPWRhdGUoJ1ktbS1kJyxzdHJ0b3RpbWUoJy02MCBkYXlzJykpOwogICAgJGthdD0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHRyLm9iamVjdF9pZCBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEpPSU4geyR3cGRiLT50ZXJtc30gdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSB0LnNsdWcgUkVHRVhQICdtYWlzdGFzfGtvbnNlcnZ8c2thbmVzdHxrcmFpa3xwYXBpbGR8dml0YW1pbnxwYXNhciciKTsKICAgICRrYXQ9YXJyYXlfZmxpcChhcnJheV9tYXAoJ2ludHZhbCcsJGthdCkpOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgYS5wcmVrZV9pZCBwLCBhLnNhbmRlbGlzIHMsIENPVU5UKCopIGQsIFNVTShhLmxpa3V0aXNfdGlla2Vqbz4wKSBkdCwgTUlOKGEubGlrdXRpc190aWVrZWpvKSBtbiwgUk9VTkQoQVZHKGEubGlrdXRpc190aWVrZWpvKSkgYXYsIFNVQlNUUklOR19JTkRFWChHUk9VUF9DT05DQVQoYS5saWt1dGlzX3RpZWtlam8gT1JERVIgQlkgYS5kYXRhIERFU0MpLCcsJywxKSBkYWIgRlJPTSB7JHB4fXBzX2Zha3RfYXRzYXJnb3NfZCBhIEpPSU4geyR3cGRiLT5wb3N0c30gcG8gT04gcG8uSUQ9YS5wcmVrZV9pZCBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIFdIRVJFIGEuZGF0YT49JXMgQU5EIGEuc2FuZGVsaXMgSU4oJ3ZmJywnemInLCdhbWJyb3NpYScpIEdST1VQIEJZIGEucHJla2VfaWQsIGEuc2FuZGVsaXMiLCRudW8pLEFSUkFZX0EpOwogICAgJFM9W107ICRvdXQ9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgaWYoIWlzc2V0KCRrYXRbKGludCkkeFsncCddXSkpIGNvbnRpbnVlOyAkU1soaW50KSR4WydwJ11dPSR4OwogICAgICAkb3V0W109WyhpbnQpJHhbJ3AnXSwkeFsncyddLChpbnQpJHhbJ2QnXSwoaW50KSR4WydkdCddLChpbnQpJHhbJ21uJ10sKGludCkkeFsnYXYnXSwoaW50KSR4WydkYWInXV07IH0KICAgICRyWyduX3N1dmFydCddPWNvdW50KCRvdXQpOyAkclsncm93cyddPWJhc2U2NF9lbmNvZGUoZ3pjb21wcmVzcyhqc29uX2VuY29kZSgkb3V0KSw5KSk7CiAgICAvLyBEUCBwYWthaQogICAgJGRwPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIG0ubWV0YV92YWx1ZSBiYXNlIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtLm1ldGFfdmFsdWU8PicnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgJGRwbz1bXTsgZm9yZWFjaCgkZHAgYXMgJGQpeyAkbj0wOyBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJykpeyAkcT1QZXRzaG9wX0FWX1NvdXJjZTo6ZHAoKGludCkkZFsnSUQnXSk7ICRuPSRxPyhpbnQpJHFbJ24nXTowOyB9ICRiPShpbnQpJGRbJ2Jhc2UnXTsgJHM9JFNbJGJdPz9udWxsOyAkZHBvW109WyhpbnQpJGRbJ0lEJ10sJGIsJG4sJHM/JHNbJ3MnXTonJywkcz8oaW50KSRzWydkdCddOi0xLCRzPyhpbnQpJHNbJ2QnXTowLCRzPyhpbnQpJHNbJ21uJ106LTEsJHM/KGludCkkc1snZGFiJ106LTFdOyB9CiAgICAkclsnZHAnXT1iYXNlNjRfZW5jb2RlKGd6Y29tcHJlc3MoanNvbl9lbmNvZGUoJGRwbyksOSkpOyAkclsnbl9kcCddPWNvdW50KCRkcG8pOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyKTsgZXhpdDsKfSwxKTsK';
const VER='dep-143121';
const GKEY='ps_s1873s2';
const PHASES=["1"];
const OUT='analize/s1873_st.json';
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
