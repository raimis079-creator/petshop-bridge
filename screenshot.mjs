process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3eDQgcmVsYXVuY2ggcG9vbCBzdGF0ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwN3g0J10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J3g0J107ICRLPSJ7JFB9cHNfcmVsYXVuY2hfa29udGFrdGFpIjsKICAkclsnZ3J1cGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBncnVwZSxDT1VOVCgqKSBuIEZST00gJEsgR1JPVVAgQlkgZ3J1cGUiLEFSUkFZX0EpOwogICRyWydncnVwZV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBncnVwZSxNSU4obGFzdF9hbnlfZGF0ZSkgbnVvLE1BWChsYXN0X2FueV9kYXRlKSBpa2kgRlJPTSAkSyBHUk9VUCBCWSBncnVwZSIsQVJSQVlfQSk7CiAgJHJbJ3J1c2lzX2hlcm8nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBydXNpcyxoZXJvX3JlYXNvbixDT1VOVCgqKSBuIEZST00gJEsgR1JPVVAgQlkgcnVzaXMsaGVyb19yZWFzb24iLEFSUkFZX0EpOwogICRyWydjb25zZW50J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY29uc2VudCxDT1VOVCgqKSBuIEZST00gJEsgR1JPVVAgQlkgY29uc2VudCIsQVJSQVlfQSk7CiAgJHJbJ3RvcF9rYXQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0b3Bfa2F0LENPVU5UKCopIG4gRlJPTSAkSyBHUk9VUCBCWSB0b3Bfa2F0IE9SREVSIEJZIG4gREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgJHJbJ21ldGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgWUVBUihsYXN0X2FueV9kYXRlKSBtLENPVU5UKCopIG4gRlJPTSAkSyBHUk9VUCBCWSBtIixBUlJBWV9BKTsKICAkclsnYmFuZ2ExJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRLIFdIRVJFIGtsaWtfbj4wIE9SIHBhc2tfa2xpa19hdCBJUyBOT1QgTlVMTCIpOwogIC8vIGt1cmllIGphdSBwaXJrbyBuYXVqb2plIHN2ZXRhaW5lamUKICAkclsncGlya29fbmF1am9qZSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgay5lbWFpbCkgRlJPTSAkSyBrIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uYmlsbGluZ19lbWFpbD1rLmVtYWlsIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTAxJyBBTkQgby5zdGF0dXMgSU4oJ3djLWNvbXBsZXRlZCcsJ3djLXByb2Nlc3NpbmcnLCd3Yy1vbi1ob2xkJykiKTsKICAkclsnc3VwcHInXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2VtYWlsX3N1cHByZXNzaW9uIik7CiAgJHJbJ2JhbmdhMV9jaWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBncnVwZSxDT1VOVCgqKSBuIEZST00gJEsgV0hFUkUgY2lkIElOIChTRUxFQ1QgY2lkIEZST00gJEsgV0hFUkUgc3VrdXJ0YV9hdDwnMjAyNi0wOS0xNScpIEdST1VQIEJZIGdydXBlIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDEpOwo=';
const VER='dep-130048';
const GKEY='ps_s1807x4';
const PHASES=["1"];
const OUT='analize/s1807_x4.json';
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
