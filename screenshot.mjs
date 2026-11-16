process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcyeCDigJQgIzE4IEFWL1ZGIHBha2FpIGthaW5hMjQgcGF0aWtyYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzJ4J10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxODcyeCddOyBAc2V0X3RpbWVfbGltaXQoMjgwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODcyeCcsJ2ZhemUnPT4kZl07CiAgdHJ5ewogICAgJEU9JFAuJ3BzX2Zha3RfZWlsdXRlcyc7CiAgICAkclsnY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkRSIpOwogICAgJFpLPVsnX3BzX3MxODI0YXZfcGFrYXMnLCdfcHNfczE4MjV2Zl9wYWthcycsJ19wc19zMTgyNXZnX3Bha2FzJ107CiAgICAkaW49IiciLmltcGxvZGUoIicsJyIsJFpLKS4iJyI7CiAgICAkbWs9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCBwaWQsIG1ldGFfa2V5IGssIG1ldGFfdmFsdWUgYiBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBJTiAoJGluKSIsQVJSQVlfQSk7CiAgICAkYmFzZXM9W107ICR6eW09W107IGZvcmVhY2goJG1rIGFzICRtKXsgJGJhc2VzWyhpbnQpJG1bJ2InXV09MTsgJHp5bVsoaW50KSRtWydwaWQnXV09JG1bJ2snXTsgfQogICAgJGJhc2VzPWFycmF5X2tleXMoJGJhc2VzKTsgJHJbJ25fYmF6ZXMnXT1jb3VudCgkYmFzZXMpOyAkclsnbl96eW1ldGknXT1jb3VudCgkbWspOwogICAgJGVhbj1mdW5jdGlvbigkcCl7IGZvcmVhY2goWydfZ2xvYmFsX3VuaXF1ZV9pZCcsJ192Zl9lYW4nLCdfemJfZWFuJywnX2VhbicsJ19hdl9lYW4nXSBhcyAkayl7ICR2PSRwLT5nZXRfbWV0YSgkayk7IGlmKCR2KSByZXR1cm4gKHN0cmluZykkdjsgfSByZXR1cm4gJyc7IH07CiAgICAkYWxsaWRzPVtdOyAkcm93cz1bXTsKICAgIGZvcmVhY2goJGJhc2VzIGFzICRiaWQpeyAkYj13Y19nZXRfcHJvZHVjdCgkYmlkKTsgaWYoISRiKSB7ICRyb3dzW109WydpZCc9PiRiaWQsJ2Vycic9PiduZXJhJ107IGNvbnRpbnVlOyB9CiAgICAgICRwaz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPSVzIiwoc3RyaW5nKSRiaWQpKTsKICAgICAgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXkgSU4gKCRpbikgQU5EIG1ldGFfdmFsdWU9JXMiLChzdHJpbmcpJGJpZCkpIGFzICR4KSAkcGtbXT0keDsKICAgICAgJHBrPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWFwKCdpbnR2YWwnLCRwaykpKTsKICAgICAgJHBha2FpPVtdOyBmb3JlYWNoKCRwayBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOyAkc3Q9Z2V0X3Bvc3Rfc3RhdHVzKCRpZCk7IGlmKCRzdD09PSd0cmFzaCcpIGNvbnRpbnVlOwogICAgICAgICRwYWthaVtdPVsnaWQnPT4kaWQsJ3N0Jz0+JHN0LCdxJz0+KGludCkkcC0+Z2V0X21ldGEoJ19kcF9wYWNrX3F0eScpLCdrYWluYSc9PiRwLT5nZXRfcHJpY2UoKSwncmVnJz0+JHAtPmdldF9yZWd1bGFyX3ByaWNlKCksJ3NhbGUnPT4kcC0+Z2V0X3NhbGVfcHJpY2UoKSwnc3MnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCd6eW0nPT4kenltWyRpZF0/PycnLCdudW9sJz0+JHAtPmdldF9tZXRhKCdfZHBfbnVvbGFpZGFfcHJvYycpLCdtYW4nPT4kcC0+Z2V0X21ldGEoJ19tYW51YWxfcHJpY2Vfb3ZlcnJpZGUnKSwndCc9Pm1iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDYwKV07ICRhbGxpZHNbXT0kaWQ7IH0KICAgICAgJGFsbGlkc1tdPSRiaWQ7CiAgICAgICRyb3dzW109WydpZCc9PiRiaWQsJ3QnPT4kYi0+Z2V0X25hbWUoKSwnc3QnPT4kYi0+Z2V0X3N0YXR1cygpLCdza3UnPT4kYi0+Z2V0X3NrdSgpLCdlYW4nPT4kZWFuKCRiKSwna2FpbmEnPT4kYi0+Z2V0X3ByaWNlKCksJ3JlZyc9PiRiLT5nZXRfcmVndWxhcl9wcmljZSgpLCdzYWxlJz0+JGItPmdldF9zYWxlX3ByaWNlKCksCiAgICAgICAgJ2Nvc3RfbWV0YSc9PiRiLT5nZXRfbWV0YSgnX2Nvc3RfcHJpY2UnKT86KCRiLT5nZXRfbWV0YSgnX3ZmX2Nvc3QnKT86JGItPmdldF9tZXRhKCdfemJfY29zdCcpKSwnc2FuZCc9PiRiLT5nZXRfbWV0YSgnX3BzX3NhbmRlbGlzJyksJ3N0b2NrJz0+JGItPmdldF9zdG9ja19xdWFudGl0eSgpLCdzcyc9PiRiLT5nZXRfc3RvY2tfc3RhdHVzKCksJ21hbic9PiRiLT5nZXRfbWV0YSgnX21hbnVhbF9wcmljZV9vdmVycmlkZScpLCdzZWltYSc9PiRiLT5nZXRfbWV0YSgnX3BzX2R5ZHppb19zZWltYScpLCdwYWthaSc9PiRwYWthaV07CiAgICB9CiAgICAkc2FsPVtdOyAkc2F2PVtdOwogICAgaWYoJGFsbGlkcyl7ICRpZHM9aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCRhbGxpZHMpKTsKICAgICAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcmVrZV9pZCBpZCwgU1VNKElGKGRpZW5hPj1EQVRFX1NVQihDVVJEQVRFKCksSU5URVJWQUwgMzAgREFZKSxraWVraXMsMCkpIHMzMCwgU1VNKGtpZWtpcykgczYwIEZST00gJEUgV0hFUkUgZGllbmE+PURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCA2MCBEQVkpIEFORCAodGVzdGluaXMgSVMgTlVMTCBPUiB0ZXN0aW5pcz0wKSBBTkQgcHJla2VfaWQgSU4gKCRpZHMpIEdST1VQIEJZIHByZWtlX2lkIixBUlJBWV9BKSBhcyAkeCkgJHNhbFskeFsnaWQnXV09JHg7CiAgICAgIGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclsnc3FsX2VycjEnXT0kd3BkYi0+bGFzdF9lcnJvcjsKICAgICAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBlLnByZWtlX2lkIGlkLCBST1VORChlLnNhdmlrYWluYV9jdC9HUkVBVEVTVChlLmtpZWtpcywxKSkgc3YsIGUuc2F2aWthaW5hX2N0IHN2ciwgZS5raWVraXMgaywgZS5kaWVuYSBkIEZST00gJEUgZSBKT0lOIChTRUxFQ1QgcHJla2VfaWQsIE1BWChkaWVuYSkgbWQgRlJPTSAkRSBXSEVSRSBzYXZpa2FpbmFfY3Q+MCBBTkQgcHJla2VfaWQgSU4gKCRpZHMpIEdST1VQIEJZIHByZWtlX2lkKSB6IE9OIHoucHJla2VfaWQ9ZS5wcmVrZV9pZCBBTkQgei5tZD1lLmRpZW5hIFdIRVJFIGUuc2F2aWthaW5hX2N0PjAiLEFSUkFZX0EpIGFzICR4KSAkc2F2WyR4WydpZCddXT0keDsKICAgICAgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWydzcWxfZXJyMiddPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgfQogICAgJHJbJ3NhbGVzJ109JHNhbDsgJHJbJ3NhdiddPSRzYXY7ICRyWydyb3dzJ109JHJvd3M7CiAgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-094418';
const GKEY='ps_s1872x';
const PHASES=["1"];
const OUT='analize/s1872_x.json';
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
