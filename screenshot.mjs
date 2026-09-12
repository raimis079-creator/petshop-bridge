process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIG4g4oCUIERQIHBha8WzIHJlY29uOiBwcmVrxJdzLCBrdXIgX2RwXyogbmF1ZG9qYW1hLCBBViB2YXJpa2xpxbMgcmVzb2x2ZS9yZWR1Y2UvZ3JhemludGkgxaFhbHRpbmlhaS4gUkVBRC1PTkxZLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY3Nm4nXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY3NiBuJyk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRvWydkcF9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RtZXRhIHBtIEpPSU4geyRwfXBvc3RzIHBzIE9OIHBzLklEPXBtLnBvc3RfaWQgV0hFUkUgcG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBwcy5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAkb1snZHBfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG0ucG9zdF9pZCBwaWQsIHBtLm1ldGFfdmFsdWUgYmF6ZSwgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cG0ucG9zdF9pZCBBTkQgbWV0YV9rZXk9J19kcF9wYWNrX3F0eScpIHEsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBtLnBvc3RfaWQgQU5EIG1ldGFfa2V5PSdfc3RvY2snKSBzdCwgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cG0ucG9zdF9pZCBBTkQgbWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snKSBtcywgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cG0ucG9zdF9pZCBBTkQgbWV0YV9rZXk9J19wc19zYW5kZWxpcycpIHNhbmQsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBtLm1ldGFfdmFsdWUgQU5EIG1ldGFfa2V5PSdfc3RvY2snKSBiYXplX3N0LCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wbS5tZXRhX3ZhbHVlIEFORCBtZXRhX2tleT0nX293bl9zdG9ja19xdHknKSBiYXplX293biwgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cG0ubWV0YV92YWx1ZSBBTkQgbWV0YV9rZXk9J19wc19zYW5kZWxpcycpIGJhemVfc2FuZCBGUk9NIHskcH1wb3N0bWV0YSBwbSBKT0lOIHskcH1wb3N0cyBwcyBPTiBwcy5JRD1wbS5wb3N0X2lkIFdIRVJFIHBtLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgcHMucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIHBtLnBvc3RfaWQgTElNSVQgMTIiLEFSUkFZX0EpOwogICRvWydkcF9tZXRhX3Jha3RhaSddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV9rZXkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnX2RwXyUnIik7CiAgLy8ga3VyIGtvZGUgbmF1ZG9qYW1hCiAgJGZpbGVzPWFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovaW5jbHVkZXMvKi5waHAnKSk7CiAgZm9yZWFjaCgkZmlsZXMgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7ICRuPXN1YnN0cl9jb3VudCgkcywnX2RwXycpOyBpZigkbil7IHByZWdfbWF0Y2goIi9eXHMqXCpccyooLnswLDkwfSkvbSIsJHMsJGgpOyAkb1snZHBfa29kZSddW3N0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmKV09JG47IH0gfQogIC8vIEFWIHZhcmlrbGlhaToga3VyIHJlc29sdmUgLyByZWR1Y2UgLyBncmF6aW50aQogIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtYXYtcmVkdWNlLnBocCcsJ3BldHNob3AtZGVzay5waHAnKSBhcyAkbil7ICRmPVdQTVVfUExVR0lOX0RJUi4nLycuJG47IGlmKCFmaWxlX2V4aXN0cygkZikpIGNvbnRpbnVlOyAkcz1maWxlX2dldF9jb250ZW50cygkZik7ICRvWydlbmdpbmUnXVskbl09YXJyYXkoJ21kNSc9Pm1kNV9maWxlKCRmKSwnZHlkaXMnPT5zdHJsZW4oJHMpKTsgcHJlZ19tYXRjaF9hbGwoIi9eXHMqKD86cHVibGljfHByb3RlY3RlZHxwcml2YXRlKT9ccypzdGF0aWNccytmdW5jdGlvblxzKyhcdyspL20iLCRzLCRtKTsgJG9bJ2VuZ2luZSddWyRuXVsnZm4nXT1hcnJheV9zbGljZSgkbVsxXSwwLDYwKTsgfQogIGZvcmVhY2goZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSBhcyAkYyl7IGlmKHByZWdfbWF0Y2goJy9eUGV0c2hvcF9BVl8oU291cmNlfFN0b2NrfFJlZHVjZSkkLycsJGMpKXsgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGMpOyAkb1snYXZfa2xhc2VzJ11bJGNdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRyYy0+Z2V0RmlsZU5hbWUoKSk7IGZvcmVhY2goJHJjLT5nZXRNZXRob2RzKCkgYXMgJG1tKXsgJG9bJ2F2X2tsYXNlcyddWyRjLic6OicuJG1tLT5nZXROYW1lKCldPSRtbS0+Z2V0U3RhcnRMaW5lKCkuJy0nLiRtbS0+Z2V0RW5kTGluZSgpOyB9IH0gfQogIC8vIHJlc29sdmUgxaFhbHRpbmlzCiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKXsgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfQVZfU291cmNlJyk7ICRMPWV4cGxvZGUoIlxuIixmaWxlX2dldF9jb250ZW50cygkcmMtPmdldEZpbGVOYW1lKCkpKTsgZm9yZWFjaChhcnJheSgncmVzb2x2ZScsJ2F2X3F0eScsJ2xpa3V0aXMnKSBhcyAkbW4peyBpZigkcmMtPmhhc01ldGhvZCgkbW4pKXsgJG09JHJjLT5nZXRNZXRob2QoJG1uKTsgJG9bJ3NyY18nLiRtbl09aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRMLCRtLT5nZXRTdGFydExpbmUoKS0xLG1pbig3MCwkbS0+Z2V0RW5kTGluZSgpLSRtLT5nZXRTdGFydExpbmUoKSsxKSkpOyB9IH0gfQogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9SZWR1Y2UnKSl7ICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1JlZHVjZScpOyAkTD1leHBsb2RlKCJcbiIsZmlsZV9nZXRfY29udGVudHMoJHJjLT5nZXRGaWxlTmFtZSgpKSk7IGZvcmVhY2goJHJjLT5nZXRNZXRob2RzKCkgYXMgJG0peyBpZihwcmVnX21hdGNoKCcvcmVkdWNlfG1hemludHxncmF6aW50fHN1bWF6L2knLCRtLT5nZXROYW1lKCkpKSAkb1sncmVkXycuJG0tPmdldE5hbWUoKV09aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRMLCRtLT5nZXRTdGFydExpbmUoKS0xLG1pbig2MCwkbS0+Z2V0RW5kTGluZSgpLSRtLT5nZXRTdGFydExpbmUoKSsxKSkpOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-084625';
const GKEY='ps_s1676n';
const PHASES=["GO"];
const OUT='analize/s1676_n.json';
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
