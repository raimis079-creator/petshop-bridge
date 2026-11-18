process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1eiByeXRvIHR5cmltYXMgMyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4ODV6J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg4NXonXTsgJFQwPW1pY3JvdGltZSh0cnVlKTsKICB0cnl7CiAgJGRvbT1kaXJuYW1lKEFCU1BBVEgpOyAkYWNjPVtdOwogIGZvcmVhY2goWydOb3YtMjAyNi50YXIuZ3onLCdOb3YtMjAyNi50YXIuZ3ouMScsJ05vdi0yMDI2LnRhci5nei4yJywnTm92LTIwMjYudGFyLmd6LjMnXSBhcyAkYil7ICRmeD0kZG9tLicvbG9ncy8nLiRiOyBpZighaXNfZmlsZSgkZngpKSBjb250aW51ZTsgJGg9Z3pvcGVuKCRmeCwncmInKTsKICAgIHdoaWxlKCgkbG49Z3pnZXRzKCRoLDE2Mzg0KSkhPT1mYWxzZSl7IGlmKHN0cnBvcygkbG4sJ2ltcG9ydF9pZD0yJicpPT09ZmFsc2UpIGNvbnRpbnVlOyBpZighcHJlZ19tYXRjaCgnI1xbKFxkXGQvXHd7M30vXGR7NH06XGRcZDpcZFxkOlxkXGQpIFteXF1dK1xdICJcUysgKFxTKylbXiJdKiIgKFxkezN9KSAoXFMrKSMnLCRsbiwkbSkpIGNvbnRpbnVlOwogICAgICAkYWNjW109JGIuJyAnLiRtWzFdLicgJy5wcmVnX3JlcGxhY2UoJyNpbXBvcnRfa2V5PVteJl0rIycsJ2snLCRtWzJdKS4nICcuJG1bM10uJyAnLiRtWzRdOyB9CiAgICBnemNsb3NlKCRoKTsgfQogICRyWydpbXAyX2FjYyddPWFycmF5X3NsaWNlKCRhY2MsLTQwKTsgJHJbJ2ltcDJfYWNjX24nXT1jb3VudCgkYWNjKTsKICAkbGY9aW5pX2dldCgnZXJyb3JfbG9nJyk7ICRzej1maWxlc2l6ZSgkbGYpOyAkZmg9Zm9wZW4oJGxmLCdyJyk7IGZzZWVrKCRmaCxtYXgoMCwkc3otMzAwMDAwMCkpOyAkdHg9ZnJlYWQoJGZoLDMwMDAwMDApOyBmY2xvc2UoJGZoKTsgJGU9W107CiAgZm9yZWFjaChleHBsb2RlKCJcbiIsJHR4KSBhcyAkbG4peyBpZihwcmVnX21hdGNoKCcjXlxbMTgtTm92LTIwMjYgMCgzOjV8NDpbMC0zXSkjJywkbG4pIHx8IChwcmVnX21hdGNoKCcjXlxbMVs3OF0tTm92LTIwMjYjJywkbG4pICYmIHN0cmlwb3MoJGxuLCd6YWxpb2ppYmFuZ2EnKSE9PWZhbHNlKSkgJGVbXT1tYl9zdWJzdHIoJGxuLDAsMzAwKTsgfQogICRyWydwaHBfMDQwMHV0YyddPWFycmF5X3NsaWNlKCRlLDAsMzApOwogICRyWydwdWJfMTgnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBMRUZUKHAucG9zdF90aXRsZSw3MCkgdCwgcC5wb3N0X3N0YXR1cyBzdCwgcC5wb3N0X2RhdGUgZCwgcC5wb3N0X21vZGlmaWVkIG0sIChTRUxFQ1QgR1JPVVBfQ09OQ0FUKENPTkNBVChtZXRhX2tleSwnPScsTEVGVChtZXRhX3ZhbHVlLDMwKSkgU0VQQVJBVE9SICcgfCAnKSBGUk9NIHskUH1wb3N0bWV0YSBwbSBXSEVSRSBwbS5wb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5IElOKCdfc2t1JywnX3N0b2NrJywnX3N0b2NrX3N0YXR1cycsJ19wcmljZScsJ19wc19zYWx0aW5pcycsJ19wc190aWVrZWphcycsJ196Yl9hdXRvX3B1Ymxpc2gnLCdfcHNfYXV0b19wdWJsaXNoZWQnLCdfdmZfYXV0b19wdWJsaXNoZWRfYXQnKSkgbXQgRlJPTSB7JFB9cG9zdHMgcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9kYXRlPj0nMjAyNi0xMS0xOCAwNTowMCcgQU5EIHAucG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCd0cmFzaCcpIE9SREVSIEJZIHAuSUQiLEFSUkFZX0EpOwogICRyWydwdWJfaXZ5a2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfaXZ5a2lhaSBXSEVSRSBpZD4oU0VMRUNUIE1BWChpZCktNDAwMCBGUk9NIHskUH1wc19pdnlraWFpKSBBTkQgKHRpcGFzIExJS0UgJyVwdWJsaWslJyBPUiB0aXBhcyBMSUtFICclcHVibGlzaCUnKSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICBpZigkd3BkYi0+bGFzdF9lcnJvcikgJHJbJ2l2eWtfZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgJHJbJ3RlbXBfYWt0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIExFRlQobmFtZSw0MCkgbiwgbW9kaWZpZWQgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG5hbWUgTElLRSAnVEVNUCUnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMjAiLEFSUkFZX0EpOwogICRyWyd0ZW1wX3NlbmknXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFJPVU5EKFNVTShMRU5HVEgoY29kZSkpLzEwNDg1NzYsMSkgbWIgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTAgQU5EIG5hbWUgTElLRSAnVEVNUCBQUyUnIEFORCBtb2RpZmllZDxOT1coKS1JTlRFUlZBTCA3IERBWSIsQVJSQVlfQSk7CiAgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkclsndHJ1a21lX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJFQwLDEpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-074526';
const GKEY='ps_s1885z';
const PHASES=["1"];
const OUT='analize/s1885z.json';
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
