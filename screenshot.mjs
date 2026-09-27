process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI4bWEgcmVhZC1vbmx5OiBGQlQgdjEuNyByZWNvbiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjhtYSddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MjhtYSddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgxNTApOwogIHRyeXsKICAgICRmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWZidC9wZXRzaG9wLWZidC5waHAnOwogICAgJHJbJ2ZidCddPVsnbWQ1Jz0+QG1kNV9maWxlKCRmKSwnZHlkaXMnPT5AZmlsZXNpemUoJGYpLCdtdGltZSc9PkBkYXRlKCdZLW0tZCBIOmk6cycsZmlsZW10aW1lKCRmKSksJ2FrdHl2dXMnPT5pc19wbHVnaW5fYWN0aXZlKCdwZXRzaG9wLWZidC9wZXRzaG9wLWZidC5waHAnKV07CiAgICAkclsnb3B0J109WydzZXR0aW5ncyc9PmdldF9vcHRpb24oJ3BldHNob3BfZmJ0X3NldHRpbmdzJyksJ2NhdF9ydWxlcyc9PmdldF9vcHRpb24oJ3BldHNob3BfZmJ0X2NhdF9ydWxlcycpLCdwYWlycyc9PmdldF9vcHRpb24oJ3BldHNob3BfZmJ0X3BhaXJzJyksJ2NvcHVyY2hfaW5mbyc9PmdldF9vcHRpb24oJ3BzX2ZidF9jb3BpcmtpbWFpX2luZm8nKSwnc2thbmVzdGFpJz0+Z2V0X29wdGlvbigncHNfZmJ0X3NrYW5lc3RhaScsbnVsbCldOwogICAgJHJbJ21hbnVhbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wZXRzaG9wX2ZidF9pZHMnIEFORCBtZXRhX3ZhbHVlIE5PVCBJTiAoJycsJ2E6MDp7fScpIExJTUlUIDYwIixBUlJBWV9BKTsKICAgIC8vIEFWIFNvdXJjZQogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKXsKICAgICAgJHJmPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FWX1NvdXJjZScsJ3Jlc29sdmUnKTsgJGZpbGU9JHJmLT5nZXRGaWxlTmFtZSgpOyAkc3JjPWZpbGUoJGZpbGUpOwogICAgICAkclsnYXZfc291cmNlJ109WydmaWxlJz0+c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZmlsZSksJ21kNSc9Pm1kNV9maWxlKCRmaWxlKSwnbGluZXMnPT4kcmYtPmdldFN0YXJ0TGluZSgpLictJy4kcmYtPmdldEVuZExpbmUoKSwna29kYXMnPT5pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRzcmMsJHJmLT5nZXRTdGFydExpbmUoKS0xLG1pbigxMjAsJHJmLT5nZXRFbmRMaW5lKCktJHJmLT5nZXRTdGFydExpbmUoKSsxKSkpXTsKICAgICAgZm9yZWFjaChbMTg1ODcsMTg1OTAsMTc5NzgsMTg1NjAsMTYzMDUsMjM4NDksMTc0ODFdIGFzICRpZCl7ICRyWydyZXNvbHZlJ11bJGlkXT1bJ3IxJz0+UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoJGlkLDEpLCdzcmMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGlzX2FjdGl2ZSBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSldOyB9CiAgICB9CiAgICAvLyBVxb5zYWt5bW8ga2VsaW8gdmFyaWtsaXMg4oCUIGthaXAgcmVhbGlhaSBza2lyc3RvbWEgKGllxaFrb20gRXhjbHVzaW9uIGnFoWltdGllcykKICAgIGZvcmVhY2goWydwZXRzaG9wLWF2LW9yZGVyLnBocCcsJ3BldHNob3AtYXYtc291cmNlLnBocCddIGFzICRtZil7ICRwPVdQTVVfUExVR0lOX0RJUi4nLycuJG1mOyBpZihmaWxlX2V4aXN0cygkcCkpeyAkdD1maWxlX2dldF9jb250ZW50cygkcCk7IHByZWdfbWF0Y2hfYWxsKCcvLnswLDEyMH0oZXhjbHVzaW9ufGJyYW5kfGdhbWludG9qKS57MCwxMjB9L2l1JywkdCwkbSk7ICRyWydrZWxpYXMnXVskbWZdPVsnbWQ1Jz0+bWQ1KCR0KSwnZXhjbHVzaW9uX21pbmltdSc9PmFycmF5X3NsaWNlKCRtWzBdLDAsMTIpXTsgfSB9CiAgICAvLyBSIHPEhXJhxaHFsyBwcmVrxJdzOiBzYW5kxJdsacWzIGxpa3XEjWlhaSAoYXIgeXJhIHN1IGF2IGlyIHRpZWvEl2p1IGFiaWVtKQogICAgJGlkcz1bMTYzMDUsMTYzMTEsMTkwOTgsMTU4NjcsMTYyOTgsMTkwOTIsMTYzMTcsMTkxMDQsMTg2MzksMTg2NDcsMTg2MzIsMTkwODksMTYyOTUsMTg2NTUsMTgxMjUsMTYzMDIsMTkwOTUsMTc2NDEsMTc2NDQsMTc0ODEsMTc0NzgsMTc0NzUsMTc0NjksMTkwMzMsMTkwMjcsMTkwMzAsMTkwMzYsMTkwMTgsMTkwMjQsMzQ3OTQsMzQ3OTcsMjM4NDksMjM4MzcsMjM4NTIsMjE2NDcsMjM4MjUsMjM4MzQsMjIzMTEsMjM4NTgsMTk5OTEsMjI0MjEsMjYwMzIsMjQ1MzksMjE1NzcsMjE1NjcsMjE1OTksMjQwMDVdOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRvPVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxzdG9ja19xdHksaXNfYWN0aXZlIEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSxBUlJBWV9BKSBhcyAkeCkgJG9bXT0keFsnc291cmNlJ10uJzonLiR4WydzdG9ja19xdHknXS4oJHhbJ2lzX2FjdGl2ZSddPycnOicoeCknKTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHJbJ3NhcmFzYXMnXVskaWRdPVsncGF2Jz0+JHA/aHRtbF9lbnRpdHlfZGVjb2RlKCRwLT5nZXRfbmFtZSgpKTonPycsJ3N0Jz0+JHA/JHAtPmdldF9zdGF0dXMoKTonJywna2FpbmEnPT4kcD8kcC0+Z2V0X3ByaWNlKCk6JycsJ3N0b2NrJz0+JHA/JHAtPmdldF9zdG9ja19xdWFudGl0eSgpOicnLCdzcmMnPT5pbXBsb2RlKCcgJywkbyksJ2NhdHMnPT4kcD93cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKTpbXV07IH0KICAgIC8vIGthdGVnb3JpasWzIG1lZGlzIG1haXN0dWkKICAgIGZvcmVhY2goWydtYWlzdGFzLXN1bmltcycsJ21haXN0YXMta2F0ZW1zJywnc2thbmVzdGFpLXN1bmltcycsJ3NrYW5lc3RhaS1rYXRlbXMnLCd6YWlzbGFpLXN1bmltcycsJ3phaXNsYWkta2F0ZW1zJ10gYXMgJHMpeyAkdD1nZXRfdGVybV9ieSgnc2x1ZycsJHMsJ3Byb2R1Y3RfY2F0Jyk7ICRyWydrYXQnXVskc109JHQ/WydpZCc9PiR0LT50ZXJtX2lkLCdwYXJlbnQnPT4kdC0+cGFyZW50P2dldF90ZXJtKCR0LT5wYXJlbnQpLT5zbHVnOicnLCd2YWlrYWknPT53cF9saXN0X3BsdWNrKGdldF90ZXJtcyhbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywncGFyZW50Jz0+JHQtPnRlcm1faWQsJ2hpZGVfZW1wdHknPT5mYWxzZV0pLCdzbHVnJyldOm51bGw7IH0KICAgIC8vIGhvb2snYWkKICAgIGdsb2JhbCAkd3BfZmlsdGVyOyBmb3JlYWNoKFsnd29vY29tbWVyY2VfYWZ0ZXJfYWRkX3RvX2NhcnRfZm9ybScsJ3dvb2NvbW1lcmNlX2FmdGVyX2NhcnRfdGFibGUnLCd3b29jb21tZXJjZV9jaGVja291dF9jcmVhdGVfb3JkZXJfbGluZV9pdGVtJywnd29vY29tbWVyY2VfYWRkX3RvX2NhcnRfcmVkaXJlY3QnLCd3Y19hZGRfdG9fY2FydF9tZXNzYWdlX2h0bWwnXSBhcyAkaCl7ICRvPVtdOyBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZj0kY2JbJ2Z1bmN0aW9uJ107ICRvW109JHByLic6Jy4oaXNfYXJyYXkoJGYpPyhpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV06KGlzX3N0cmluZygkZik/JGY6J2Nsb3N1cmUnKSk7IH0gJHJbJ2hvb2tzJ11bJGhdPSRvOyB9CiAgICAkclsnZHBfcGFrYXNfcHZ6J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBwb3N0X2lkLCBtZXRhX3ZhbHVlIGJhc2UgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPTE4NTg3IExJTUlUIDEiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-210925';
const GKEY='ps_s1728ma';
const PHASES=["1"];
const OUT='analize/s1728_ma.json';
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
