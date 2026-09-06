process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzQgcnVuIHIg4oCUIEIgcmVjb246IChSMSkgZWlsacWzIG5hdiBtYXJrdXAgdGlrcmFzIEhUTUw7IChSMikgRUFOIHN1cmlua2ltbyBsYXBlIOKAlCBQZXRzaG9wX0FWX1NoZWV0cyArIGRhcmJhbGF1a2lzIGdyZXAuIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzRyJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNjM0ciddOyAkbz1hcnJheSgndic9PidTMTYzNCByJywnZmF6ZSc9PiRmKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICBpZigkZj09PSdSMScpewogICAgJHR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7ICR1aWQ9JHR1LT5JRDsgJGV4cD10aW1lKCkrOTAwOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAgICRjcz1hcnJheShuZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSkpKTsKICAgICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJmVpbGU9dmlzaScpLGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+OTAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7CiAgICAkaD0oc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgICRvWydjb2RlJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOyAkb1snZHlkaXMnXT1zdHJsZW4oJGgpOwogICAgZm9yZWFjaChhcnJheSgnZGwtbmF2JywnZGwtZWlsZXMnLCc8bmF2JywnZWlsZT0nKSBhcyAkxb4pICRvWydraWVrJ11bJMW+XT1zdWJzdHJfY291bnQoJGgsJMW+KTsKICAgICRwb3M9c3RycG9zKCRoLCdlaWxlPScpOwogICAgaWYoJHBvcyE9PWZhbHNlKXsgJHN0PW1heCgwLCRwb3MtMzUwKTsgJG9bJ2FwbGlua19laWxlX3JhdyddPW1iX3N1YnN0cigkaCwkc3QsOTAwKTsgfQogICAgaWYocHJlZ19tYXRjaCgnLzxuYXZbXj5dKj4vdScsJGgsJG0pKSAkb1snbmF2X3RhZyddPSRtWzBdOwogICAgcHJlZ19tYXRjaF9hbGwoJy9jbGFzcz0iKFteIl0qKD86bmF2fGVpbClbXiJdKikiL3UnLCRoLCRtYyk7ICRvWydrbGFzZXMnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1jWzFdPz9hcnJheSgpKSwwLDEwKTsKICB9CiAgaWYoJGY9PT0nUjInKXsKICAgIGZvcmVhY2goYXJyYXkoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1zaGVldHMucGhwJywgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtc2hlZXRzLnBocCcpIGFzICRmcCl7IGlmKGZpbGVfZXhpc3RzKCRmcCkpeyAkb1snc2hlZXRzX2tlbGlhcyddPSRmcDsgYnJlYWs7IH0gfQogICAgaWYoIWVtcHR5KCRvWydzaGVldHNfa2VsaWFzJ10pKXsKICAgICAgJHM9ZmlsZV9nZXRfY29udGVudHMoJG9bJ3NoZWV0c19rZWxpYXMnXSk7ICRvWydzaGVldHMnXT1hcnJheSgnZHlkaXMnPT5zdHJsZW4oJHMpLCdtZDUnPT5tZDUoJHMpKTsKICAgICAgaWYocHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFswLTkuXSspLycsJHMsJG0pKSAkb1snc2hlZXRzJ11bJ3ZlciddPSRtWzFdOwogICAgICAkbGluPWV4cGxvZGUoIlxuIiwkcyk7CiAgICAgIGZvcmVhY2goJGxpbiBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZWFufGJhcmNvZGV8YmFya29kL2knLCRsKSkgJG9bJ3NoZWV0cyddWydlYW5fZWlsJ11bJGkrMV09dHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKTsgfQogICAgICBmb3JlYWNoKCRsaW4gYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrXHcrLycsJGwsJG0yKSkgJG9bJ3NoZWV0cyddWydmbiddW109KCRpKzEpLic6Jy50cmltKG1iX3N1YnN0cigkbCwwLDEwMCkpOyB9CiAgICAgICRvWydzaGVldHMnXVsnZm4nXT1hcnJheV9zbGljZSgkb1snc2hlZXRzJ11bJ2ZuJ10/P2FycmF5KCksMCw0MCk7CiAgICAgIGlmKGlzc2V0KCRvWydzaGVldHMnXVsnZWFuX2VpbCddKSkgJG9bJ3NoZWV0cyddWydlYW5fZWlsJ109YXJyYXlfc2xpY2UoJG9bJ3NoZWV0cyddWydlYW5fZWlsJ10sMCwyNSx0cnVlKTsKICAgIH0KICAgICRkPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyk7ICRvWydkbF9tZDUnXT1tZDUoJGQpOwogICAgJGxpbj1leHBsb2RlKCJcbiIsJGQpOyAkZWU9YXJyYXkoKTsKICAgIGZvcmVhY2goJGxpbiBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZWFufGJhcmNvZGV8YmFya29kL2knLCRsKSkgJGVlWyRpKzFdPXRyaW0obWJfc3Vic3RyKCRsLDAsMTQwKSk7IH0KICAgICRvWydkbF9lYW5fZWlsJ109YXJyYXlfc2xpY2UoJGVlLDAsMjUsdHJ1ZSk7CiAgICBmb3JlYWNoKCRsaW4gYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3N1cmlua2ltb3xsYXBhc3xsYXBlL2knLCRsKSAmJiBwcmVnX21hdGNoKCcvZnVuY3Rpb258YWN0aW9ufExhcGFzfGxhcMSFLycsJGwpKSAkb1snZGxfbGFwYXNfZWlsJ11bJGkrMV09dHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKTsgfQogICAgJG9bJ2RsX2xhcGFzX2VpbCddPWFycmF5X3NsaWNlKCRvWydkbF9sYXBhc19laWwnXT8/YXJyYXkoKSwwLDIwLHRydWUpOwogICAgJGc9JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2VhbicgQU5EIG1ldGFfdmFsdWU8PicnIik7CiAgICBmb3JlYWNoKGFycmF5KCdfZWFuJywnX2JhcmNvZGUnLCdfYWxnX2VhbicsJ193cG1fZ3Rpbl9jb2RlJywnZWFuJykgYXMgJGspeyAkYz0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9JXMgQU5EIG1ldGFfdmFsdWU8PicnIiwkaykpOyBpZigkYykgJG9bJ2Vhbl9tZXRhJ11bJGtdPSRjOyB9CiAgICAkc2t1PShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3NrdScgQU5EIG1ldGFfdmFsdWUgUkVHRVhQICdeWzAtOV17MTIsMTR9JCciKTsKICAgICRvWydza3Vfc2thaXRpbmlhaV8xMl8xNCddPSRza3U7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-190521';
const GKEY='ps_s1634r';
const PHASES=["R1", "R2"];
const OUT='analize/s1634_r.json';
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
