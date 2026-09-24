process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2YyB0aWsta3VyamVyaXUga29kYXMgKyBQYXlzZXJhIGxlbnRlbGVzICh0aWsgc3R1bHBlbGlhaSkgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxNmMnXSkpIHJldHVybjsKICBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3MTZjJ107ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi5waHAnKSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykpIGFzICRnKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBpZihzdHJwb3MoJHMsJ2Z1bmN0aW9uIHBldHNob3BfaGlkZV9wYXJjZWxfaWZfY291cmllcl9vbmx5JykhPT1mYWxzZSl7IHByZWdfbWF0Y2goJyMoL1wqXCpbXi9dezAsOTAwfVwqL1xzKik/ZnVuY3Rpb24gcGV0c2hvcF9oaWRlX3BhcmNlbF9pZl9jb3VyaWVyX29ubHkuKj9cblx9I3MnLCRzLCRtKTsgJHJbJ2hpZGVfcGFyY2VsJ11bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZyldPXN1YnN0cigkbVswXT8/JycsMCwzMDAwKTsgfSBpZihzdHJwb3MoJHMsJ19wc190aWtfa3VyamVyaXUnKSE9PWZhbHNlKXsgcHJlZ19tYXRjaF9hbGwoJyNbXlxuXXswLDIwMH1fcHNfdGlrX2t1cmplcml1W15cbl17MCwyMDB9IycsJHMsJG1tKTsgJHJbJ3Rpa19rdXJqZXJpdV92aWV0b3MnXVtzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRnKV09YXJyYXlfc2xpY2UoJG1tWzBdLDAsNCk7IH0gfQogICAgJHJbJ3AxMjQ2Nl90aWtfa3VyamVyaXUnXT1nZXRfcG9zdF9tZXRhKDEyNDY2LCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKTsKICAgICRyWyd0aWtfa3VyamVyaXVfcGFnYWxfc2FuZGVsaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHMubWV0YV92YWx1ZSBzYW5kLCBDT1VOVCgqKSBuIEZST00geyR3cGRiLT5wb3N0bWV0YX0gdCBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD10LnBvc3RfaWQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzIE9OIHMucG9zdF9pZD10LnBvc3RfaWQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgV0hFUkUgdC5tZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgQU5EIHQubWV0YV92YWx1ZT0neWVzJyBHUk9VUCBCWSBzLm1ldGFfdmFsdWUiLEFSUkFZX0EpOwogICAgJHJbJ3Rpa19rdXJqZXJpdV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBMRUZUKHAucG9zdF90aXRsZSw1MCkgdCwgdy5tZXRhX3ZhbHVlIHN2b3JpcyBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IHQgSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9dC5wb3N0X2lkIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdyBPTiB3LnBvc3RfaWQ9cC5JRCBBTkQgdy5tZXRhX2tleT0nX3dlaWdodCcgV0hFUkUgdC5tZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgQU5EIHQubWV0YV92YWx1ZT0neWVzJyBPUkRFUiBCWSBDQVNUKHcubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpIEFTQyBMSU1JVCAxMiIsQVJSQVlfQSk7CiAgICAkclsndGlrX2t1cmplcml1X3N2b3JpYWknXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihDQVNUKHcubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpKSBtbiwgTUFYKENBU1Qody5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoOCwyKSkpIG14LCBBVkcoQ0FTVCh3Lm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSkgdmlkLCBTVU0oQ0FTVCh3Lm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKTw9MjQuOSkgaWtpXzI0OSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IHQgSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9dC5wb3N0X2lkIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdyBPTiB3LnBvc3RfaWQ9cC5JRCBBTkQgdy5tZXRhX2tleT0nX3dlaWdodCcgV0hFUkUgdC5tZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgQU5EIHQubWV0YV92YWx1ZT0neWVzJyIsQVJSQVlfQSk7CiAgICAvLyBQYXlzZXJhIGxlbnRlbMSXcyDigJQgdGlrIHN0dWxwZWxpxbMgcGF2YWRpbmltYWkKICAgIGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wYXlzZXJhJSciKSBhcyAkdCl7ICRyWydwYXlzZXJhX2xlbnRlbGVzJ11bJHRdPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOyB9CiAgICAvLyBrcmVwxaFlbGlvIMW+aW51dMSXIOKAnm5lbW9rYW1hcyBwYcWhdG9tYXRhcyIg4oCUIGZ1bmN0aW9ucy5waHAgbG9naWthIChzxIVseWdvcykKICAgICRzPWZpbGVfZ2V0X2NvbnRlbnRzKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCcpOyBwcmVnX21hdGNoKCcjLnswLDE1MDB9cHJpa2xhdXNvIG5lbW9rYW1hcyBwcmlzdGF0eW1hcy57MCw2MDB9I3MnLCRzLCRtKTsgJHJbJ2tyZXBzZWxpb196aW51dGVfa29kYXMnXT1zdWJzdHIoJG1bMF0/PycnLDAsMjEwMCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-202418';
const GKEY='ps_s1716c';
const PHASES=["1"];
const OUT='analize/s1716_c1.json';
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
