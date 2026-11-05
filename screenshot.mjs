process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI5cGcgUHJhZ21hIHNpdW50aW1vIGJ1a2xlIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyOXBnJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCg5MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODI5cGcnXTsKICB0cnl7CiAgJG9wPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRUZUKG9wdGlvbl92YWx1ZSw2MDApIHYgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclcHJhZ21hJScgT1JERVIgQlkgb3B0aW9uX25hbWUiLEFSUkFZX0EpOyAkclsnb3BjaWpvcyddPSRvcDsgJGxnPWdldF9vcHRpb24oJ3BldHNob3BfcHJhZ21hX2xvZycpOyAkclsnbG9nJ109aXNfYXJyYXkoJGxnKT9hcnJheV9zbGljZSgkbGcsLTgpOiRsZzsgJHJbJ3JlYyddPWdldF9vcHRpb24oJ3BldHNob3BfcHJhZ21hX3JlY2lwaWVudCcpOyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclcHJhZ21hJSciKSBhcyAkbil7IGlmKHN0cnBvcygkbiwna25vd24nKT09PWZhbHNlICYmIHN0cnBvcygkbiwnX2xvZycpPT09ZmFsc2UpICRyWydraXRvcyddWyRuXT1nZXRfb3B0aW9uKCRuKTsgfQogICRjcj1fZ2V0X2Nyb25fYXJyYXkoKTsgJHJbJ2Nyb24nXT1bXTsgZm9yZWFjaCgkY3IgYXMgJHRzPT4kaG9va3MpeyBmb3JlYWNoKCRob29rcyBhcyAkaD0+JHgpeyBpZihzdHJpcG9zKCRoLCdwcmFnbWEnKSE9PWZhbHNlKSAkclsnY3JvbiddW109WyRoLHdwX2RhdGUoJ1ktbS1kIEg6aScsJHRzKV07IH0gfQogICR0Yj0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJXByYWdtYSUnIik7ICRyWydsZW50ZWxlcyddPSR0YjsKICBmb3JlYWNoKCR0YiBhcyAkdCl7ICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSBgJHRgIik7ICRyWydsZW50J11bJHRdPVsnY29scyc9PiRjb2xzLCdwYXNrJz0+JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIGAkdGAgT1JERVIgQlkgMSBERVNDIExJTUlUIDUiLEFSUkFZX0EpXTsgfQogICRkPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcyc7ICRmcz1bXTsgZm9yZWFjaChnbG9iKCRkLicvKnByYWdtYSonLEdMT0JfTk9TT1JUKT86W10gYXMgJGcpeyAkZnNbXT0kZzsgfSBmb3JlYWNoKGdsb2IoJGQuJy8qLypwcmFnbWEqJyk/OltdIGFzICRnKXsgJGZzW109JGc7IH0gJHJbJ2thdGFsb2dhaSddPSRmczsKICBmb3JlYWNoKCRmcyBhcyAkZyl7IGlmKGlzX2RpcigkZykpeyAkbD1bXTsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZyxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZil7ICRsW109W3N0cl9yZXBsYWNlKCRkLCcnLCRmLT5nZXRQYXRobmFtZSgpKSx3cF9kYXRlKCdZLW0tZCBIOmknLCRmLT5nZXRNVGltZSgpKSwkZi0+Z2V0U2l6ZSgpXTsgfSB1c29ydCgkbCxmbigkYSwkYik9PnN0cmNtcCgkYlsxXSwkYVsxXSkpOyAkclsnZmFpbGFpJ11bJGddPWFycmF5X3NsaWNlKCRsLDAsMTUpOyB9IH0KICAkbXQ9JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH13cG1haWxzbXRwX2VtYWlsc19sb2cnIik7IGlmKCRtdCl7ICRyWydtYWlsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIExFRlQoc3ViamVjdCwxMjApIHMsIHBlb3BsZSwgc3RhdHVzLCBkYXRlX3NlbnQgRlJPTSAkbXQgV0hFUkUgc3ViamVjdCBMSUtFICclcmFnbWElJyBPUiBwZW9wbGUgTElLRSAnJWF1ZGFjJScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-085117';
const GKEY='ps_s1829pg';
const PHASES=["1"];
const OUT='analize/s1829_pg.json';
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
