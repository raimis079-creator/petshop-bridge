process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI4bWYgcmVhZC1vbmx5OiBkaW5ndXNpb3MgcHJla2nFsyBudW90cmF1a29zICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyOG1mJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyOG1mJ107IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgdHJ5ewogICAgJHVwPXdwX2dldF91cGxvYWRfZGlyKCk7CiAgICAkaW5mbz1mdW5jdGlvbigkcGlkKSB1c2UoJHdwZGIsJFAsJHVwKXsgJHQ9KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ190aHVtYm5haWxfaWQnLHRydWUpOyAkYT0kdD9nZXRfcG9zdCgkdCk6bnVsbDsgJGY9JHQ/Z2V0X3Bvc3RfbWV0YSgkdCwnX3dwX2F0dGFjaGVkX2ZpbGUnLHRydWUpOicnOyAkbWQ9JHQ/d3BfZ2V0X2F0dGFjaG1lbnRfbWV0YWRhdGEoJHQpOm51bGw7ICR0aD0nJzsgaWYoJG1kICYmICFlbXB0eSgkbWRbJ3NpemVzJ11bJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCddWydmaWxlJ10pKSAkdGg9ZGlybmFtZSgkdXBbJ2Jhc2VkaXInXS4nLycuJGYpLicvJy4kbWRbJ3NpemVzJ11bJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCddWydmaWxlJ107CiAgICAgIHJldHVybiBbJ3BpZCc9PiRwaWQsJ3Bhdic9Pmh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJHBpZCksJ21vZCc9PmdldF9wb3N0X2ZpZWxkKCdwb3N0X21vZGlmaWVkJywkcGlkKSwndGh1bWInPT4kdCwnYXR0Jz0+JGE/WydzdCc9PiRhLT5wb3N0X3N0YXR1cywncGFyZW50Jz0+JGEtPnBvc3RfcGFyZW50LCdtb2QnPT4kYS0+cG9zdF9tb2RpZmllZCwndHlwZSc9PiRhLT5wb3N0X21pbWVfdHlwZV06bnVsbCwnZmFpbGFzJz0+JGYsJ2ZhaWxhc195cmEnPT4kZj9maWxlX2V4aXN0cygkdXBbJ2Jhc2VkaXInXS4nLycuJGYpOm51bGwsJ3RodW1iX2ZhaWxhc195cmEnPT4kdGg/ZmlsZV9leGlzdHMoJHRoKTpudWxsLCdnYWxlcmlqYSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3Byb2R1Y3RfaW1hZ2VfZ2FsbGVyeScsdHJ1ZSksJ2RwX3Bha2FpJz0+JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0lZCIsJHBpZCkpXTsgfTsKICAgICRyWycxOTA4OSddPSRpbmZvKDE5MDg5KTsKICAgIGZvcmVhY2goWzE2Mjk1LDE5MDk4LDE5MDkyLDE5MDk1LDE5MTA0LDE2MzA1LDE2MzExLDE2MzE3LDE2MzAyLDE4NjU1XSBhcyAkaSkgJHJbJ2tpdGknXVskaV09JGluZm8oJGkpOwogICAgLy8gdmlzb3MgcHVibGlzaCBwcmVrxJdzIGJlIHZlaWtpYW7EjWlvcyBudW90cmF1a29zCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgICAkYmU9W107ICRjbnQ9Wyd2aXNvJz0+Y291bnQoJGlkcyksJ2JlX3RodW1iX2lkJz0+MCwnYXR0X25lcmEnPT4wLCdmYWlsb19uZXJhJz0+MF07CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHQ9KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX3RodW1ibmFpbF9pZCcsdHJ1ZSk7ICR3aHk9Jyc7CiAgICAgIGlmKCEkdCl7ICRjbnRbJ2JlX3RodW1iX2lkJ10rKzsgJHdoeT0nbsSXcmEgX3RodW1ibmFpbF9pZCc7IH0KICAgICAgZWxzZSB7ICRhPWdldF9wb3N0KCR0KTsgaWYoISRhfHwkYS0+cG9zdF90eXBlIT09J2F0dGFjaG1lbnQnKXsgJGNudFsnYXR0X25lcmEnXSsrOyAkd2h5PSdhdHRhY2htZW50ICMnLiR0LicgbsSXcmEnOyB9IGVsc2UgeyAkZj1nZXRfcG9zdF9tZXRhKCR0LCdfd3BfYXR0YWNoZWRfZmlsZScsdHJ1ZSk7IGlmKCEkZnx8IWZpbGVfZXhpc3RzKCR1cFsnYmFzZWRpciddLicvJy4kZikpeyAkY250WydmYWlsb19uZXJhJ10rKzsgJHdoeT0nZmFpbG8gbsSXcmEgJy4kZjsgfSB9IH0KICAgICAgaWYoJHdoeSkgJGJlW109WydpZCc9PihpbnQpJGlkLCdwYXYnPT5tYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJGlkKSksMCw2MCksJ2tvZGVsJz0+JHdoeSwnbW9kJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbW9kaWZpZWQnLCRpZCksJ2RwJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpPzonJywnZ2VuJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zMTcyNV9nZW4nLHRydWUpPzonJ107CiAgICB9CiAgICAkclsnc3V2ZXN0aW5lJ109JGNudDsgdXNvcnQoJGJlLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gc3RyY21wKCRiWydtb2QnXSwkYVsnbW9kJ10pO30pOyAkclsnYmVfbnVvdHJhdWtvcyddPWFycmF5X3NsaWNlKCRiZSwwLDEyMCk7CiAgICAvLyDFoWl1a8WhbGluxJdqZSAvIG5lc2VuaWFpIHRyaW50aSBwcm9kdWt0YWkgaXIgYXR0YWNobWVudGFpCiAgICAkclsnc2l1a3NsaW5lX3Byb2R1a3RhaSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ndHJhc2gnIik7CiAgICAkclsnc2l1a3NsaW5lX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLHAucG9zdF9tb2RpZmllZCwgbS5tZXRhX3ZhbHVlIHRyIEZST00geyRQfXBvc3RzIHAgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfd3BfdHJhc2hfbWV0YV90aW1lJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3RyYXNoJyBPUkRFUiBCWSBwLnBvc3RfbW9kaWZpZWQgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAkclsnYXR0YWNoX3B1Ymxpc2hfc3RhdHVzYXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdhdHRhY2htZW50JyBBTkQgcG9zdF9zdGF0dXMgTk9UIElOICgnaW5oZXJpdCcsJ3ByaXZhdGUnKSIpOwogICAgLy8gbWF4IGF0dGFjaG1lbnQgSUQgaXIgdGFycGFpIChpxaF0cmludGkpIGFwbGluayAxOTA4OSB0aHVtYgogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-213909';
const GKEY='ps_s1728mf';
const PHASES=["1"];
const OUT='analize/s1728_mf.json';
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
