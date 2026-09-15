process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODYgbWEg4oCUIFJFQUQtT05MWTogd2luLWJhY2sgcmVjb246IMWhYWJsb25haSB3aW4tYmFjay0qLnBocCwga2FzIGp1b3Mgc2l1bsSNaWEgKGNvcmUgZ3JlcCksIHBzX2VtYWlsX2pvYnMgd2luLWJhY2sgYsWrc2Vub3MsIGthbmRpZGF0YWkgKHJlZmlsbCB0ZXJtaW5hcyArNjAgZC4gYmUgcGlya2ltbykuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg2bWEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4NiBtYScpOwogICRjb3JlPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOyAkb1snY29yZV9leGlzdHMnXT1pc19kaXIoJGNvcmUpOwogIGZvcmVhY2goZ2xvYigkY29yZS4nL3RlbXBsYXRlcy9lbWFpbHMvd2luLWJhY2sqJykgYXMgJGYpeyAkb1snc2FibG9uYWknXVtiYXNlbmFtZSgkZildPWFycmF5KCdkeWRpcyc9PmZpbGVzaXplKCRmKSwnbWQ1Jz0+c3Vic3RyKG1kNV9maWxlKCRmKSwwLDgpLCdwcmFkemlhJz0+bWJfc3Vic3RyKHN0cmlwX3RhZ3MoZmlsZV9nZXRfY29udGVudHMoJGYpKSwwLDYwMCkpOyB9CiAgJG9bJ3NhYmxvbnVfc2FyYXNhcyddPWFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoJGNvcmUuJy90ZW1wbGF0ZXMvZW1haWxzLyonKSk7CiAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkY29yZS4nL2luY2x1ZGVzJykpOwogIGZvcmVhY2goJGl0IGFzICRmKXsgaWYoc3Vic3RyKCRmLC00KSE9PScucGhwJykgY29udGludWU7ICRMPWZpbGUoJGYpOyBmb3JlYWNoKCRMIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL3dpbi4/YmFja3x3aW5iYWNrL2knLCRsKSkgJG9bJ2NvcmVfZ3JlcCddW109c3RyX3JlcGxhY2UoJGNvcmUsJycsJGYpLic6Jy4oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDIwMCkpOyB9CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkTD1maWxlKCRmKTsgZm9yZWFjaCgkTCBhcyAkaT0+JGwpIGlmKHByZWdfbWF0Y2goJy93aW4uP2JhY2svaScsJGwpKSAkb1snbXVfZ3JlcCddW109YmFzZW5hbWUoJGYpLic6Jy4oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDIwMCkpOyB9CiAgJG9bJ2pvYnNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfZW1haWxfam9icyIpOwogICRvWydqb2JzX3RpcGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdHlwZSB0LCBzdGF0dXMgcywgc2tpcF9yZWFzb24gciwgQ09VTlQoKikgbiwgTUlOKGNyZWF0ZWRfYXQpIG51bywgTUFYKGNyZWF0ZWRfYXQpIGlraSBGUk9NIHskcH1wc19lbWFpbF9qb2JzIEdST1VQIEJZIHQscyxyIE9SREVSIEJZIHQscyIsQVJSQVlfQSk7CiAgJG9bJ2Nyb24nXT1hcnJheV9maWx0ZXIoYXJyYXlfa2V5cyhfZ2V0X2Nyb25fYXJyYXkoKSA/IGFycmF5X21lcmdlKC4uLmFycmF5X3ZhbHVlcyhfZ2V0X2Nyb25fYXJyYXkoKSkpIDogYXJyYXkoKSksIGZ1bmN0aW9uKCRrKXtyZXR1cm4gc3RycG9zKCRrLCdwc18nKT09PTA7fSk7CiAgJG9bJ3JlZmlsbF9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19yZWZpbGxfdHJhY2tpbmciKTsKICAkb1sncmVmaWxsX3ByYWVqZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVESUZGKENVUkRBVEUoKSxwcmVkaWN0ZWRfZGF0ZSkgZDYwLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSBwcmVkaWN0ZWRfZGF0ZTxDVVJEQVRFKCktSU5URVJWQUwgMzAgREFZIEdST1VQIEJZIEZMT09SKERBVEVESUZGKENVUkRBVEUoKSxwcmVkaWN0ZWRfZGF0ZSkvMzApIE9SREVSIEJZIGQ2MCBMSU1JVCAxMiIsQVJSQVlfQSk7CiAgJG9bJ2lzdF9rYW5kaWRhdGFpJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBrbGllbnRhc19lbWFpbCkgRlJPTSB7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIFdIRVJFIGFwbW9rZXRhX2F0Pj1DVVJEQVRFKCktSU5URVJWQUwgMzY1IERBWSBBTkQgYXBtb2tldGFfYXQ8Q1VSREFURSgpLUlOVEVSVkFMIDEyMCBEQVkiKTsKICAkb1snaXN0X2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2lzdF9mYWt0X3V6c2FreW1haSIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-162711';
const GKEY='ps_s1686ma';
const PHASES=["RECON"];
const OUT='analize/s1686_ma.json';
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
