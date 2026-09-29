process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM4YiBrYW5hbHUga2xhc2lmaWthdG9yaXVzICsgQUkgc3JhdXRhcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MzhiJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzM4YiddOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsgJHI9Wyd2Jz0+J1MxNzM4YicsJ2ZhemUnPT4kZl07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJHA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYW5hbGFpLnBocCc7ICR0PUBmaWxlX2dldF9jb250ZW50cygkcCk7ICRyWydrYW5hbGFpX21kNSddPW1kNSgkdCk7ICRyWydrYW5hbGFpX2R5ZGlzJ109c3RybGVuKCR0KTsgaWYocHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFswLTkuXSspLycsJHQsJG0pKSAkclsna2FuYWxhaV92ZXJzaWphJ109JG1bMV07CiAgICAkbHM9ZXhwbG9kZSgiXG4iLCR0KTsgJG91dD1bXTsgZm9yZWFjaCgkbHMgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2thbmFsYXN8dGFpc3lrbHxrbGFzaWZ8cmVmZXJhbHxyZWZlcnJhbHxvcmdhbmlrYXxzb2NffGRpcmVjdHxtb2thbWFzfGVtYWlsfGdldF9vcHRpb258Y29uc3QgfGZ1bmN0aW9uIC9pJywkbCkpICRvdXRbXT0oJGkrMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDIwMCkpOyB9ICRyWydrYW5hbGFpX2tvZGFzJ109YXJyYXlfc2xpY2UoJG91dCwwLDE2MCk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc19rYW5hbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BldHNob3Bfa2FuYWwlJyIsQVJSQVlfQSkgYXMgJG8peyAkdj1nZXRfb3B0aW9uKCRvWydvcHRpb25fbmFtZSddKTsgJHJbJ29wdDonLiRvWydvcHRpb25fbmFtZSddXT1pc19zY2FsYXIoJHYpP3N1YnN0cigoc3RyaW5nKSR2LDAsMTUwMCk6c3Vic3RyKGpzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsMzAwMCk7IH0KICB9CiAgaWYoJGY9PT0nMicpewogICAgJHJbJ2FpX3JlZmVyZXJfMzBkJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcmVmZXJlcl9kb21lbmFzIGhvc3QsIGthbmFsYXMsIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgbGFuaywgQ09VTlQoKikgaXYgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgbGFpa2FzPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzMCBEQVkpIEFORCAocmVmZXJlcl9kb21lbmFzIExJS0UgJyVjaGF0Z3B0JScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVvcGVuYWklJyBPUiByZWZlcmVyX2RvbWVuYXMgTElLRSAnJXBlcnBsZXhpdHklJyBPUiByZWZlcmVyX2RvbWVuYXMgTElLRSAnJWdlbWluaSUnIE9SIHJlZmVyZXJfZG9tZW5hcyBMSUtFICclY29waWxvdCUnIE9SIHJlZmVyZXJfZG9tZW5hcyBMSUtFICclY2xhdWRlJScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyViaW5nJScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVkdWNrZHVja2dvJScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyV5b3UuY29tJScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVtaXN0cmFsJScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVtZXRhLmFpJScpIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAzIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ2FpX3V0bV8zMGQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzYWx0aW5pcywgbWVkaXVtLCBrYW5hbGFzLCBDT1VOVChESVNUSU5DVCBsYW5reXRvamFzX2QpIGxhbmsgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgbGFpa2FzPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzMCBEQVkpIEFORCAoc2FsdGluaXMgTElLRSAnJWNoYXRncHQlJyBPUiBzYWx0aW5pcyBMSUtFICclb3BlbmFpJScgT1Igc2FsdGluaXMgTElLRSAnJXBlcnBsZXhpdHklJyBPUiBzYWx0aW5pcyBMSUtFICclZ2VtaW5pJScgT1Igc2FsdGluaXMgTElLRSAnJWNvcGlsb3QlJyBPUiBsYW5kaW5nIExJS0UgJyV1dG1fc291cmNlPWNoYXRncHQlJykgR1JPVVAgQlkgMSwyLDMgT1JERVIgQlkgNCBERVNDIixBUlJBWV9BKTsKICAgICRyWydyZWZlcnJhbF90b3BfMzBkJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcmVmZXJlcl9kb21lbmFzIGhvc3QsIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgbGFuayBGUk9NIHskUH1wc193ZWJfaXZ5a2lhaSBXSEVSRSBsYWlrYXM+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDMwIERBWSkgQU5EIGthbmFsYXM9J3JlZmVycmFsJyBBTkQgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MgTElNSVQgMjUiLEFSUkFZX0EpOwogICAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSIpOyAkclsnZmFrdF9jb2xzJ109aW1wbG9kZSgnLCcsJGNvbHMpOwogICAgJGRjPWluX2FycmF5KCdkaWVuYScsJGNvbHMpPydkaWVuYSc6J3N1a3VydGFfYXQnOwogICAgJHJbJ2Zha3Rfa2FuYWxhaV8zMGQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrYW5hbGFzX3Bhc2t1dGluaXMgaywgQ09VTlQoKikgbiBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSAkZGM+PURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCAzMCBEQVkpIEdST1VQIEJZIDEgT1JERVIgQlkgMiBERVNDIixBUlJBWV9BKTsKICAgICRyWydmYWt0X2FpXzMwZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hc19pZCwgJGRjIGQsIGthbmFsYXNfcGFza3V0aW5pcyBrLCB1dG1fc291cmNlIHMsIHJlZmVyZXJfZG9tZW5hcyByZCwgdmlzb19jdCBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSAkZGM+PURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCAzMCBEQVkpIEFORCAodXRtX3NvdXJjZSBMSUtFICclY2hhdGdwdCUnIE9SIHV0bV9zb3VyY2UgTElLRSAnJW9wZW5haSUnIE9SIHJlZmVyZXJfZG9tZW5hcyBMSUtFICclY2hhdGdwdCUnIE9SIHJlZmVyZXJfZG9tZW5hcyBMSUtFICclb3BlbmFpJScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVwZXJwbGV4aXR5JScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVnZW1pbmklJyBPUiByZWZlcmVyX2RvbWVuYXMgTElLRSAnJWNvcGlsb3QlJyBPUiByZWZlcmVyX2RvbWVuYXMgTElLRSAnJWNsYXVkZSUnKSBPUkRFUiBCWSAyIixBUlJBWV9BKTsKICAgIC8vIGFyIHlyYSBVQSBzdHVscGVsaXMgaXZ5a2l1b3NlPyBuZXJhLiBBcGFjaGUgYWNjZXNzIGxvZyBwYXNrdXRpbmVzIDIgZC46IEFJIGJvdHUgVUEKICAgICRsb2dzPWdsb2IoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzLyonKTsgJHJbJ2xvZ19mYWlsYWknXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJywkbG9ncyk7CiAgICAkY250PVtdOyBmb3JlYWNoKCRsb2dzIGFzICRsZil7IGlmKCFwcmVnX21hdGNoKCcvXC5sb2ckLycsJGxmKSkgY29udGludWU7ICRoPUBmb3BlbigkbGYsJ3InKTsgaWYoISRoKSBjb250aW51ZTsgJG49MDsgd2hpbGUoKCRsPWZnZXRzKCRoKSkhPT1mYWxzZSl7ICRuKys7IGlmKCRuPjQwMDAwMCkgYnJlYWs7IGlmKHByZWdfbWF0Y2goJy8oR1BUQm90fENoYXRHUFQtVXNlcnxPQUktU2VhcmNoQm90fFBlcnBsZXhpdHlCb3R8UGVycGxleGl0eS1Vc2VyfENsYXVkZUJvdHxDbGF1ZGUtVXNlcnxHb29nbGUtRXh0ZW5kZWR8QXBwbGVib3R8Qnl0ZXNwaWRlcnxtZXRhLWV4dGVybmFsYWdlbnR8QW1hem9uYm90fENDQm90fGFudGhyb3BpYy1haXxjb2hlcmUtYWl8RHVja0Fzc2lzdEJvdHxZb3VCb3R8TWlzdHJhbEFJKS8nLCRsLCRtKSl7ICRjb2RlPXByZWdfbWF0Y2goJy8iIChcZHszfSkgLycsJGwsJGMpPyRjWzFdOic/JzsgJGs9JG1bMV0uJyAnLiRjb2RlOyAkY250WyRrXT0oJGNudFska10/PzApKzE7IH0gfSBmY2xvc2UoJGgpOyB9IGFyc29ydCgkY250KTsgJHJbJ2xvZ19haV91YSddPSRjbnQ7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-151925';
const GKEY='ps_s1738b';
const PHASES=["1", "2"];
const OUT='analize/s1738_b.json';
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
