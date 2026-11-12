process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU2ZSDigJQgQW5pbW9uZGEgxaF1bmltcyAxNTAgZyAxLzExLzIyICgxMSA9IOKIkjIgY3Qvdm50LiwgMjIgPSDiiJI1ICUpLCAyNC8zNiDihpIganVvZHJhxaF0aXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODU2J10pPyRfR0VUWydwc19zMTg1NiddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTg1NmUtJy4kZik7CiAgJEs9YXJyYXkoMzg0MzA9PmFycmF5KCcxNC40MScsJzI3LjgwJykpOyBpZihpc3NldCgkX0dFVFsncHNfczE4NTYnXSkmJiRfR0VUWydwc19zMTg1NiddPT09J0snKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgJHByPXdjX2dldF9wcm9kdWN0KDM4NDMwKTsgJHdhcz0kcHItPmdldF9wcmljZSgpOyAkcHItPnNldF9yZWd1bGFyX3ByaWNlKCcxLjMzJyk7ICRwci0+c2V0X3NhbGVfcHJpY2UoJycpOyAkcHItPnNldF9wcmljZSgnMS4zMycpOyAkcHItPnNhdmUoKTsgY2xlYW5fcG9zdF9jYWNoZSgzODQzMCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoMzg0MzApOyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxODU2ZS1LJywnYnV2byc9PiR3YXMsJ2RhYmFyJz0+d2NfZ2V0X3Byb2R1Y3QoMzg0MzApLT5nZXRfcHJpY2UoKSkpOyBleGl0OyB9CiAgJFQ9YXJyYXkoMTE9Pjc3MiwyMj0+NzczKTsKICAkcmFzdGk9ZnVuY3Rpb24oJGIsJHEpIHVzZSgkd3BkYiwkcCl7IHJldHVybiAkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHAucG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBwIEpPSU4geyRwfXBvc3RtZXRhIHEgT04gcS5wb3N0X2lkPXAucG9zdF9pZCBBTkQgcS5tZXRhX2tleT0nX2RwX3BhY2tfcXR5JyBBTkQgcS5tZXRhX3ZhbHVlPSVzIEpPSU4geyRwfXBvc3RzIHogT04gei5JRD1wLnBvc3RfaWQgQU5EIHoucG9zdF9zdGF0dXM8Pid0cmFzaCcgV0hFUkUgcC5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgQU5EIHAubWV0YV92YWx1ZT0lcyBPUkRFUiBCWSBwLnBvc3RfaWQgTElNSVQgMSIsKHN0cmluZykkcSwoc3RyaW5nKSRiKSk7IH07CiAgJFRSPWFycmF5KCk7IGZvcmVhY2goJEsgYXMgJGI9PiR4KSBmb3JlYWNoKGFycmF5KDExLDIyKSBhcyAkaT0+JHEpIGlmKCEkcmFzdGkoJGIsJHEpKSAkVFJbXT1hcnJheSgkYiwkcSwkeFskaV0pOwogIGlmKCRmPT09JzAnKXsgJGJhaz1hcnJheSgnZDE5Jz0+Z2V0X29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycpKTsgZm9yZWFjaCgkSyBhcyAkYj0+JHgpeyAkYmFrWydzZWltYSddWyRiXT1nZXRfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPSVzIiwoc3RyaW5nKSRiKSkgYXMgJGlkKSAkYmFrWydwYWsnXVskaWRdPWdldF9wb3N0X3N0YXR1cygkaWQpOyB9CiAgICBpZighZ2V0X29wdGlvbigncHNfczE4NTZlX2JhaycpKSB1cGRhdGVfb3B0aW9uKCdwc19zMTg1NmVfYmFrJywkYmFrLGZhbHNlKTsgJG9bJ3RydWtzdGEnXT0kVFI7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgaWYocHJlZ19tYXRjaCgnL15QKFxkKykkLycsJGYsJG0pKXsgaWYoISRUUil7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4kb1sndiddLCduaWVrbyc9PjEpKTsgZXhpdDsgfSBsaXN0KCRiLCRxLCRrKT0kVFJbMF07CiAgICAkYmF6ZT13Y19nZXRfcHJvZHVjdCgkYik7ICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1JpbmtpbmlhaScsJ2lzc2F1Z290aV9kcCcpOyAkci0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICRyLT5pbnZva2VBcmdzKCRyLT5pc1N0YXRpYygpP251bGw6bmV3IFBldHNob3BfUmlua2luaWFpKCksYXJyYXkoMCwkcS4nIHZudC4gJy4kYmF6ZS0+Z2V0X25hbWUoKSwnJywkayx3cF9zdHJpcF9hbGxfdGFncygkYmF6ZS0+Z2V0X3Nob3J0X2Rlc2NyaXB0aW9uKCkpLHRydWUsYXJyYXkoKSxhcnJheSgkYj0+JHEpLG51bGwsYXJyYXkoKSxudWxsKSk7CiAgICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+JG9bJ3YnXSwncGFzdGFiYSc9PidiZSB3cF9zZW5kX2pzb24nKSk7IGV4aXQ7IH0KICBpZigkZj09PSdVJyl7IGlmKCRUUikgJG9bJ0VSUl90cnVrc3RhJ109JFRSOyAkZDE5PShhcnJheSlnZXRfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJyxhcnJheSgpKTsKICAgIGZvcmVhY2goJEsgYXMgJGI9PiR4KXsgJHM9Z2V0X3Bvc3RfbWV0YSgkYiwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSk7IGlmKCEkcyl7ICRzPSdhdi0nLmdldF9wb3N0X2ZpZWxkKCdwb3N0X25hbWUnLCRiKTsgdXBkYXRlX3Bvc3RfbWV0YSgkYiwnX3BzX2R5ZHppb19zZWltYScsJHMpOyB9CiAgICAgIGZvcmVhY2goJHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0lcyIsKHN0cmluZykkYikpIGFzICRpZCl7ICRxPShpbnQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19kcF9wYWNrX3F0eScsdHJ1ZSk7CiAgICAgICAgaWYoaXNzZXQoJFRbJHFdKSl7IHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJywkcyk7IHdwX3NldF9vYmplY3RfdGVybXMoJGlkLGFycmF5KCRUWyRxXSksJ3BhX3Bha3VvdGVzX2R5ZGlzJyxmYWxzZSk7IHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfczE4NTZlX3Bha2FzJywkYik7IH0KICAgICAgICBlbHNlaWYoZ2V0X3Bvc3Rfc3RhdHVzKCRpZCk9PT0ncHVibGlzaCcpeyB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kaWQsJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JykpOyAkb1snanVvZHJhc3RpcyddW109JGlkLicgKCcuJHEuJyknOyB9CiAgICAgICAgY2xlYW5fcG9zdF9jYWNoZSgkaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRpZCk7CiAgICAgICAgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRvWydiJ11bJGJdWyRxXT1hcnJheSgkaWQsZ2V0X3Bvc3Rfc3RhdHVzKCRpZCksJHByLT5nZXRfcHJpY2UoKSxyb3VuZCgkcHItPmdldF9wcmljZSgpL21heCgxLCRxKSwzKSxnZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpKTsgfQogICAgICBkZWxldGVfdHJhbnNpZW50KCdwc19ka18nLm1kNSgkcykpOyBpZighaW5fYXJyYXkoJHMsJGQxOSx0cnVlKSkgJGQxOVtdPSRzOyBjbGVhbl9wb3N0X2NhY2hlKCRiKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkYik7IH0KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLCRkMTkpOyBkZWxldGVfdHJhbnNpZW50KCdwc19ka19zZWltb3MnKTsgJG9bJ2QxOV9uJ109Y291bnQoJGQxOSk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KICBpZigkZj09PSc5Jyl7ICRiYWs9Z2V0X29wdGlvbigncHNfczE4NTZlX2JhaycpOyBmb3JlYWNoKChhcnJheSkkYmFrWydwYWsnXSBhcyAkaWQ9PiRzdCkgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PiRzdCkpOwogICAgZm9yZWFjaCgkSyBhcyAkYj0+JHgpeyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3MxODU2ZV9wYWthcycgQU5EIG1ldGFfdmFsdWU9JXMiLChzdHJpbmcpJGIpKSBhcyAkaWQpIGlmKCFpc3NldCgkYmFrWydwYWsnXVskaWRdKSkgd3BfdHJhc2hfcG9zdCgkaWQpOyBpZigkYmFrWydzZWltYSddWyRiXT09PScnKSBkZWxldGVfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJyk7IH0KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLCRiYWtbJ2QxOSddKTsgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4nUzE4NTZlLTknKSk7IGV4aXQ7IH0KfSk7Cg==';
const VER='dep-173345';
const GKEY='ps_s1856';
const PHASES=["K", "0", "P1", "P2", "U"];
const OUT='analize/s1856_e.json';
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
