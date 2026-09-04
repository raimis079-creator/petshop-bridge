process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTMgcnVuIGU0ciDigJQgUiAodGlrIHNrYWl0eW1hcyk6IGt1cmlzIExQIHBsdWdpbm8ga2FibGl1a2FzIHBvIGBjb21wbGV0ZWRgIGJhbmRvIGt1cnRpIHNpdW50xIUgacWhIG5hdWpvICgjMzU0MTYgYGxwLXBhcmNlbC1mYWlsZWRgIHBvIHIyKSwgIzM1NDE2IHBvIHRlc3RvICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U0ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjEzIGU0cicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogIHRyeXsKICAgICREPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluJzsgJGZpPSRELicvYWRtaW4vY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtYWRtaW4tb3JkZXItc2VydmljZS5waHAnOyAkbHM9ZmlsZSgkZmkpOwogICAgJG9bJ2Y1NDBfNTc1J109YXJyYXkoKTsgZm9yKCRpPTUzNTskaTw1NzU7JGkrKyl7ICRvWydmNTQwXzU3NSddW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHJ0cmltKCRsc1skaV0pLDAsMjAwKTsgfQogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJEQuJy9pbmNsdWRlcy9jbGFzcy13b28tbGl0aHVhbmlhcG9zdC5waHAnKTsgJG9bJ2hvb2tzX29yZGVyJ109YXJyYXkoKTsgaWYocHJlZ19tYXRjaF9hbGwoJy9hZGRfKGFjdGlvbnxmaWx0ZXIpXHMqXChccypbXCciXShbXlwnIl0qKG9yZGVyX3N0YXR1c3xwYXltZW50X2NvbXBsZXRlfG9yZGVyX3NhdmV8dXBkYXRlX29yZGVyfHN0YXR1c19jaGFuZ2VkfG5ld19vcmRlcnx0aGFua3lvdSlbXlwnIl0qKVtcJyJdW15cbl17MCwxNDB9LycsJGMsJG0sUFJFR19TRVRfT1JERVIpKXsgZm9yZWFjaCgkbSBhcyAkeCl7ICRvWydob29rc19vcmRlciddW109JHhbMF07IH0gfQogICAgJHg9d2NfZ2V0X29yZGVyKDM1NDE2KTsgJG9bJ3UzNTQxNiddPWFycmF5KCdzdCc9PiR4LT5nZXRfc3RhdHVzKCksJ2xwX3N0Jz0+KHN0cmluZykkeC0+Z2V0X21ldGEoJ193b29fbGl0aHVhbmlhcG9zdF9zaGlwcGluZ19zdGF0dXNfdmFsdWUnKSwnYmMnPT4oc3RyaW5nKSR4LT5nZXRfbWV0YSgnX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUnKSwnaXRlbV9pZCc9PihzdHJpbmcpJHgtPmdldF9tZXRhKCdfd29vX2xpdGh1YW5pYXBvc3Rfc2hpcHBpbmdfaXRlbV9pZCcpLCdlcnInPT5tYl9zdWJzdHIoKHN0cmluZykkeC0+Z2V0X21ldGEoJ193b29fbGl0aHVhbmlhcG9zdF9wYXJjZWxfY3JlYXRlX2Vycm9yJyksMCwyMDApKTsKICAgICRvWydscF90cmFja2luZ19yb3dzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdvb19saXRodWFuaWFwb3N0X3RyYWNraW5nX3N0YXR1cyIpOwogICAgJG9bJ3RlbXBfYWt0eXZ1cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTEiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-102622';
const GKEY='ps_e4r';
const PHASES=["R"];
const OUT='analize/s1613_e4_run1r.json';
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
