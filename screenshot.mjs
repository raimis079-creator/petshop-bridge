process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUzYSDigJQgcmVjb246IEFuaW1vbmRhIDEwMCBnIGthdMSXbXMga2Fpbm9zICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTg1MyddKT8kX0dFVFsncHNfczE4NTMnXTonJyk7IGlmKCRmPT09JycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE4NTNhLScuJGYsJ3Jvd3MnPT5hcnJheSgpKTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgeC5JRCBGUk9NIHskcH1wb3N0cyB4IEpPSU4geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9eC5JRCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEFORCB0dC50ZXJtX2lkPTMwOCBXSEVSRSB4LnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHgucG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSBBTkQgeC5wb3N0X3RpdGxlIFJFR0VYUCAnMTAwID9nJyBBTkQgeC5wb3N0X3RpdGxlIE5PVCBSRUdFWFAgJ15bMC05XSsgdm50JyAiKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOyAkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwogICAgaWYoIXByZWdfZ3JlcCgnL2thdC9pJywkY2F0cykgJiYgIXByZWdfbWF0Y2goJy9rYXR8a2l0dGVufGNhdC9pJywkcHItPmdldF9uYW1lKCkpKSBjb250aW51ZTsKICAgICRwaz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtLnBvc3RfaWQgaWQsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIHEgV0hFUkUgcS5wb3N0X2lkPW0ucG9zdF9pZCBBTkQgcS5tZXRhX2tleT0nX2RwX3BhY2tfcXR5JykgcSwoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgcSBXSEVSRSBxLnBvc3RfaWQ9bS5wb3N0X2lkIEFORCBxLm1ldGFfa2V5PSdfcHJpY2UnKSBwciwoU0VMRUNUIHBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RzIHogV0hFUkUgei5JRD1tLnBvc3RfaWQpIHN0IEZST00geyRwfXBvc3RtZXRhIG0gV0hFUkUgbS5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgQU5EIG0ubWV0YV92YWx1ZT0lcyIsKHN0cmluZykkaWQpLEFSUkFZX0EpOwogICAgJG9bJ3Jvd3MnXVtdPWFycmF5KCdpZCc9PiRpZCwndCc9PiRwci0+Z2V0X25hbWUoKSwnc3QnPT4kcHItPmdldF9zdGF0dXMoKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksJ2Vhbic9PiRwci0+Z2V0X21ldGEoJ19nbG9iYWxfdW5pcXVlX2lkJyk/OiRwci0+Z2V0X21ldGEoJ196Yl9lYW4nKT86JHByLT5nZXRfbWV0YSgnX3ZmX2VhbicpLCdrYWluYSc9PiRwci0+Z2V0X3ByaWNlKCksJ3JlZyc9PiRwci0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSwnc2FsZSc9PiRwci0+Z2V0X3NhbGVfcHJpY2UoKSwnY29zdCc9PiRwci0+Z2V0X21ldGEoJ19jb3N0X3ByaWNlJyk/OiRwci0+Z2V0X21ldGEoJ196Yl9jb3N0Jyk/OiRwci0+Z2V0X21ldGEoJ192Zl9jb3N0JyksJ3NhbmQnPT4kcHItPmdldF9tZXRhKCdfcHNfc2FuZGVsaXMnKSwnc3RvY2snPT4kcHItPmdldF9zdG9ja19xdWFudGl0eSgpLCdzcyc9PiRwci0+Z2V0X3N0b2NrX3N0YXR1cygpLCdwYXJkMzAnPT4kcHItPmdldF9tZXRhKCdfcHNfc2FsZXNfMzBkJyksJ3BhcmQzNjUnPT4kcHItPmdldF9tZXRhKCdfcHNfc2FsZXNfMzY1ZCcpLCdzZWltYSc9PiRwci0+Z2V0X21ldGEoJ19wc19keWR6aW9fc2VpbWEnKSwncGFrYWknPT4kcGspOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-133200';
const GKEY='ps_s1853';
const PHASES=["R"];
const OUT='analize/s1853_a.json';
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
