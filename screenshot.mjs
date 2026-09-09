process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg4IGtsaWVudG8gcGFza3lyYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JscCddKT8kX0dFVFsncHNfYmxwJ106JycpIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY4OCcsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgJHU9Z2V0X3VzZXJfYnkoJ2VtYWlsJywncHRvbWFzODg3QGdtYWlsLmNvbScpOwogICAgaWYoJHUpewogICAgICAkb1sndmFydG90b2phcyddPWFycmF5KCdpZCc9PiR1LT5JRCwnbG9naW4nPT4kdS0+dXNlcl9sb2dpbiwncmVnaXN0cnVvdGFzJz0+JHUtPnVzZXJfcmVnaXN0ZXJlZCwKICAgICAgICAncm9sZXMnPT4kdS0+cm9sZXMpOwogICAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSw2MCkgdiBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIHVzZXJfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJWltcG9ydCUlJyBPUiBtZXRhX2tleSBMSUtFICclJXdlbGNvbWUlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVzZXNzaW9uJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlbGFzdCUlJyBPUiBtZXRhX2tleT0nX3BzX2ltcG9ydGFzJykiLCR1LT5JRCksQVJSQVlfQSkgYXMgJHIpICRvWydtZXRhJ11bJHJbJ21ldGFfa2V5J11dPSRyWyd2J107CiAgICAgICRvWydhY3RpdmF0aW9uX2tleSddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdXNlcl9hY3RpdmF0aW9uX2tleSBGUk9NIHskd3BkYi0+dXNlcnN9IFdIRVJFIElEPSVkIiwkdS0+SUQpKTsKICAgICAgJG9bJ3R1cmlfc2xhcHRhem9kaSddPShib29sKSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgTEVOR1RIKHVzZXJfcGFzcykgRlJPTSB7JHdwZGItPnVzZXJzfSBXSEVSRSBJRD0lZCIsJHUtPklEKSk7CiAgICB9IGVsc2UgJG9bJ3ZhcnRvdG9qYXMnXT0nbmVyYXN0YXMnOwogICAgLy8gc2lhbmRpZW5vcyBsYWlza2FpCiAgICAkZD1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2MtbG9ncyc7CiAgICBmb3JlYWNoKHNjYW5kaXIoJGQpIGFzICRmKXsgaWYoc3RycG9zKCRmLCd0cmFuc2FjdGlvbmFsLWVtYWlscy0yMDI2LTA5LTA5Jyk9PT0wKSAkb1snbGFpc2thaSddPXN1YnN0cihmaWxlX2dldF9jb250ZW50cygkZC4nLycuJGYpLC0yMDAwKTsgfQogICAgLy8ga2llayBpbXBvcnR1b3R1IGtsaWVudHUgYXBza3JpdGFpCiAgICAkb1snaW1wb3J0dW90dSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfaW1wb3J0YXMnIik7CiAgICAvLyBhciBidXZvIHNsYXB0YXpvZHppbyBhdHN0YXR5bW8gdXprbGF1c3Ugc2lhbmRpZW4KICAgICRvWydyZXNldF9rZXlfdHVyaSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+dXNlcnN9IFdIRVJFIHVzZXJfYWN0aXZhdGlvbl9rZXk8PicnIik7CiAgICAvLyB3ZWxjb21lIG1vZGFsCiAgICAkb1snd2VsY29tZV9tb2RhbCddPWdldF9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJyk7CiAgICAvLyB1enNha3ltYWkKICAgICR0PSR3cGRiLT5wcmVmaXguJ3djX29yZGVycyc7CiAgICAkb1sndXpzYWt5bWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLGRhdGVfY3JlYXRlZF9nbXQscGF5bWVudF9tZXRob2QsdG90YWxfYW1vdW50IEZST00gJHQgV0hFUkUgYmlsbGluZ19lbWFpbD0ncHRvbWFzODg3QGdtYWlsLmNvbScgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICAgJG9bJ2xpa3V0aXNfMTQ5NTEnXT1nZXRfcG9zdF9tZXRhKDE0OTUxLCdfc3RvY2snLHRydWUpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-103146';
const GKEY='ps_blp';
const PHASES=["R"];
const OUT='analize/s1688_r.json';
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
