process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzMyYSBwYXJkYXZpbXUgYW5hbGl6ZSDigJQgc3RydWt0dXJvcyByZWNvbiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MzJhJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzMyYSddOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3MzJhJywnZmF6ZSc9PiRmXTsgJFQwPW1pY3JvdGltZSh0cnVlKTsKICAkdHo9bmV3IERhdGVUaW1lWm9uZSgnRXVyb3BlL1ZpbG5pdXMnKTsKICAkcT1mdW5jdGlvbigkc3FsKSB1c2UgKCR3cGRiLCYkcil7ICR4PSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOyBpZigkd3BkYi0+bGFzdF9lcnJvcil7ICRyWydTUUxfRVJSJ11bXT1tYl9zdWJzdHIoJHdwZGItPmxhc3RfZXJyb3IsMCwyMDApOyB9IHJldHVybiAkeDsgfTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgZm9yZWFjaChbJ3BzX2Zha3RfdXpzYWt5bWFpJywncHNfZmFrdF9laWx1dGVzJywncHNfZmFrdF9zaXVudG9zJywncHNfZmFrdF9yZWtsYW1hJywncHNfaXN0X2Zha3RfdXpzYWt5bWFpJywncHNfaXN0X2Zha3RfZWlsdXRlcycsJ3BzX2lzdF91enNha3ltYWknLCdwc19pc3RfZWlsdXRlcycsJ3BzX3dlYl9pdnlraWFpJywncHNfY2FydHMnLCdwc190YXJpZmFpJ10gYXMgJHQpewogICAgICAkZXg9JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH17JHR9JyIpOyBpZighJGV4KXsgJHJbJ2xlbnQnXVskdF09J05FUkEnOyBjb250aW51ZTsgfQogICAgICAkY29scz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIHskUH17JHR9IixBUlJBWV9BKTsgJGNjPVtdOyBmb3JlYWNoKCRjb2xzIGFzICRjKSAkY2NbXT0kY1snRmllbGQnXS4nOicucHJlZ19yZXBsYWNlKCcjXCguKiMnLCcnLCRjWydUeXBlJ10pOwogICAgICAkclsnbGVudCddWyR0XT1bJ24nPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9eyR0fSIpLCdjb2xzJz0+aW1wbG9kZSgnLCAnLCRjYyldOwogICAgfQogICAgJHJbJ2Z1X3B2eiddPSRxKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBPUkRFUiBCWSB1enNha3ltYXNfaWQgREVTQyBMSU1JVCAyIik7CiAgICAkclsnZmVfcHZ6J109JHEoIlNFTEVDVCAqIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBPUkRFUiBCWSAxIERFU0MgTElNSVQgMiIpOwogICAgJHJbJ2lmZV9wdnonXT0kcSgiU0VMRUNUICogRlJPTSB7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyBPUkRFUiBCWSAxIERFU0MgTElNSVQgMiIpOwogICAgJHJbJ2lmdV9wdnonXT0kcSgiU0VMRUNUICogRlJPTSB7JFB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIE9SREVSIEJZIDEgREVTQyBMSU1JVCAyIik7CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRyWydmdV9zdGF0dXMnXT0kcSgiU0VMRUNUIHN0YXR1c2FzX2dhbHV0aW5pcyBzLCB0ZXN0aW5pcyB0LCBDT1VOVCgqKSBuLCBNSU4oc3VrdXJ0YV9hdCkgbW4sIE1BWChzdWt1cnRhX2F0KSBteCBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBHUk9VUCBCWSAxLDIiKTsKICAgICRyWydmdV9rYW5hbGFzJ109JHEoIlNFTEVDVCBrYW5hbGFzX3Bhc2t1dGluaXMgaywgdXRtX3NvdXJjZSB1cywgQ09VTlQoKikgbiBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSB0ZXN0aW5pcz0wIEdST1VQIEJZIDEsMiBPUkRFUiBCWSBuIERFU0MgTElNSVQgNDAiKTsKICAgICRyWydpc3Rfc3RhdHVzJ109JHEoIlNFTEVDVCAqIEZST00gKFNFTEVDVCBMRUZUKHN1a3VydGFfYXQsNykgbSwgQ09VTlQoKikgbiBGUk9NIHskUH1wc19pc3RfZmFrdF91enNha3ltYWkgR1JPVVAgQlkgMSkgeCBPUkRFUiBCWSBtIERFU0MgTElNSVQgMzYiKTsKICAgICRyWyd3Y19zdGF0dXMnXT0kcSgiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiwgTUlOKGRhdGVfY3JlYXRlZF9nbXQpIG1uLCBNQVgoZGF0ZV9jcmVhdGVkX2dtdCkgbXggRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNycgR1JPVVAgQlkgMSIpOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkclsndHJ1a21lX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJFQwLDEpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-181603';
const GKEY='ps_s1732a';
const PHASES=["1", "2"];
const OUT='analize/s1732a.json';
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
