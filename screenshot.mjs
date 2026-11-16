process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcwZSByeXRvIHR5cmltYXMgMiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzBlJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg3MGUyJ107CiAgJHJbJ2VqXzdkX2R1ZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBzY2hlZHVsZWRfYXQsIGF0dGVtcHRzLCBzdGF0dXMsIExFRlQoQ09BTEVTQ0UoYmxvY2tfcmVhc29uLCcnKSw2MCkgYnIsIExFRlQoQ09BTEVTQ0UobGFzdF9lcnJvciwnJyksODApIGxlLCBuZXh0X2F0dGVtcHRfYXQgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBzdGF0dXM9J3BlbmRpbmcnIEFORCBzY2hlZHVsZWRfYXQ8PU5PVygpIE9SREVSIEJZIHNjaGVkdWxlZF9hdCBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgJHJbJ2VqX3NlbnRfcGFzayddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGZsb3csIE1BWChzZW50X2F0KSBwYXNrIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgc3RhdHVzPSdzZW50JyBHUk9VUCBCWSBmbG93IixBUlJBWV9BKTsKICAkclsnZWpfc2VudF82aCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGZsb3csIHNlbnRfYXQgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBzdGF0dXM9J3NlbnQnIEFORCBzZW50X2F0Pj1OT1coKS1JTlRFUlZBTCA2IEhPVVIgT1JERVIgQlkgc2VudF9hdCIsQVJSQVlfQSk7CiAgJHJbJ25vd19kYiddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTk9XKCkiKTsKICAkY3I9W107IGZvcmVhY2goX2dldF9jcm9uX2FycmF5KCkgYXMgJHRzPT4kaG9va3MpeyBmb3JlYWNoKCRob29rcyBhcyAkaD0+JHgpeyBpZihwcmVnX21hdGNoKCcvZW1haWx8bGFpc2t8bWFpbHxwc19lanxsaWZlY3ljbGV8cmVmaWxsfHdpbl9iYWNrL2knLCRoKSl7ICRzPXJlc2V0KCR4KTsgJGNyW109WyRoLHdwX2RhdGUoJ20tZCBIOmk6cycsJHRzKSwkc1snc2NoZWR1bGUnXT8/J3ZpZW5rJ107IH0gfSB9ICRyWydjcm9uX2VtYWlsJ109JGNyOwogICRyWydhc19lbWFpbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGhvb2ssIHN0YXR1cywgQ09VTlQoKikgbiwgTUFYKHNjaGVkdWxlZF9kYXRlX2dtdCkgbXggRlJPTSB7JFB9YWN0aW9uc2NoZWR1bGVyX2FjdGlvbnMgV0hFUkUgKGhvb2sgTElLRSAnJWVtYWlsJScgT1IgaG9vayBMSUtFICclbGFpc2slJyBPUiBob29rIExJS0UgJ3BzXyUnKSBBTkQgc2NoZWR1bGVkX2RhdGVfZ210Pj1VVENfVElNRVNUQU1QKCktSU5URVJWQUwgMSBEQVkgR1JPVVAgQlkgaG9vayxzdGF0dXMiLEFSUkFZX0EpOwogIGZvcmVhY2goWzE3MzY9PjM4NTg3LDE3Mzg9PjM4NTg5LDE3Mzk9PjM4NjAwLDE3NDE9PjM4NjAyLDE3NDM9PjM4NjA0XSBhcyAkbnI9PiRpZCl7IGlmKCEkaWQpIHsgJHJbJ28nXVskbnJdPSdpZD8nOyBjb250aW51ZTsgfSAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKXsgJHJbJ28nXVskbnJdPSduZXJhJzsgY29udGludWU7IH0KICAgICRubj1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT40MF0pIGFzICRuKXsgJG5uW109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTEwKTsgfQogICAgJGl0PVtdOyBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkeCl7ICRwPSR4LT5nZXRfcHJvZHVjdCgpOyAkaXRbXT1tYl9zdWJzdHIoJHgtPmdldF9uYW1lKCksMCw1MCkuJyB4Jy4keC0+Z2V0X3F1YW50aXR5KCkuJyBzdD0nLigkcD92YXJfZXhwb3J0KCRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSx0cnVlKTonLScpLicga2VsaWFzPScuKCR4LT5nZXRfbWV0YSgnX3BzX2tlbGlhcycpPzokeC0+Z2V0X21ldGEoJ19rZWxpYXMnKT86JycpOyB9CiAgICAkbWV0YT1bXTsgZm9yZWFjaCgkby0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgJGs9JG0tPmtleTsgaWYocHJlZ19tYXRjaCgnL3RpZWt8dmZ8ZHJvcHNoaXB8cGVyZHVvdHxrZWxpYXN8dmVuaXBha3xzaXVudC9pJywkaykpICRtZXRhWyRrXT1pc19zY2FsYXIoJG0tPnZhbHVlKT9tYl9zdWJzdHIoKHN0cmluZykkbS0+dmFsdWUsMCw4MCk6J1thcnJdJzsgfQogICAgJHJbJ28nXVskbnJdPVsnaWQnPT4kaWQsJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwnaXRlbXMnPT4kaXQsJ21ldGEnPT4kbWV0YSwnbm90ZXNfbic9PmNvdW50KCRubiksJ25vdGVzJz0+YXJyYXlfc2xpY2UoJG5uLDAsMTQpXTsgfQogICRyWydrYW1wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FtcGFuaWphX2lkLCBMRUZUKGthbXBhbmlqYSw0MCkgaywgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIgRlJPTSB7JFB9cHNfZmFrdF9yZWtsYW1hIFdIRVJFIGthbmFsYXM9J2dvb2dsZV9hZHMnIEFORCBkaWVuYT49JzIwMjYtMTEtMDEnIEdST1VQIEJZIGthbXBhbmlqYV9pZCwga2FtcGFuaWphIixBUlJBWV9BKTsKICAkclsndmZfcGVyZHVvdGFfcGFzayddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGNvbW1lbnRfcG9zdF9JRCBvaWQsIGNvbW1lbnRfZGF0ZSwgTEVGVChjb21tZW50X2NvbnRlbnQsMTAwKSBjIEZST00geyRQfWNvbW1lbnRzIFdIRVJFIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZScgQU5EIGNvbW1lbnRfY29udGVudCBMSUtFICdQZXJkdW90YSB0aWVrJScgT1JERVIgQlkgY29tbWVudF9JRCBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-075457';
const GKEY='ps_s1870e';
const PHASES=["1"];
const OUT='analize/s1870_e.json';
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
