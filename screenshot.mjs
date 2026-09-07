process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIHYg4oCUIFY6IHBlcnppdXJvcyBwYXJ1b3NpbWFzIFJhaW1pdWkgKG9wdD0xLCB1aWQxMTkgc2VlbiBpc3Jhc3l0aS9pc3RyaW50aSwgdG1wIG11LXBsdWdpbiBzdSB2aWVua2FydGluZSBCIHByaXNpanVuZ2ltbyBudW9yb2RhKSDCtyBDOiB2YWx5bWFzICh0bXAgZmFpbGFzIHNhbGluLCBvcHQ9MCwgc2VlbiBpc3RyaW50aSkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM2diddKSkgcmV0dXJuOwogICRmPXN0cnRvdXBwZXIoc2FuaXRpemVfa2V5KCRfR0VUWydwc19zMTYzNnYnXSkpOyAkbz1hcnJheSgndic9PidTMTYzNiB2JywnZic9PiRmKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkSj1mdW5jdGlvbigkbyl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfTsKICAkdG1wPVdQTVVfUExVR0lOX0RJUi4nL3RtcC1zMTYzNi1wZXJ6aXVyYS5waHAnOwogIHRyeXsKICBpZigkZj09PSdWJyl7CiAgICB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX3dlbGNvbWVfbW9kYWxfZW5hYmxlZCcsMSxmYWxzZSk7CiAgICBkZWxldGVfdXNlcl9tZXRhKDExOSwncHNfd2VsY29tZV9zZWVuJyk7CiAgICAkdT1nZXRfdXNlcmRhdGEoMTE5KTsgJG9bJ2JfdmFydG90b2phcyddPSR1PyR1LT51c2VyX2VtYWlsOic/JzsKICAgICRuPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc19wZXRzIFdIRVJFIHVzZXJfaWQ9MTE5IEFORCBzdGF0dXM9J2FjdGl2ZSciKTsgJG9bJ2JfcGV0cyddPSRuOwogICAgJGNvZGU9Jzw/cGhwIC8qIFRFTVAgUzE2MzYgcGVyeml1cmEg4oCUIHZpZW5rYXJ0aW5lIEIgcHJpc2lqdW5naW1vIG51b3JvZGEgUmFpbWl1aS4gVHJpbnRpIHBlciBDIGZhemUuICovCmlmICggISBkZWZpbmVkKCAiQUJTUEFUSCIgKSApIHsgZXhpdDsgfQphZGRfYWN0aW9uKCJpbml0IiwgZnVuY3Rpb24oKXsKICBpZiAoICggJF9HRVRbInBzX2JfcGVyeml1cmEiXSA/PyAiIiApICE9PSAicmFpbWlzLTdmM2s5IiApIHJldHVybjsKICB3cF9zZXRfYXV0aF9jb29raWUoIDExOSwgZmFsc2UsIHRydWUgKTsKICB3cF9zYWZlX3JlZGlyZWN0KCBob21lX3VybCggIi8/Yj0iIC4gdGltZSgpICkgKTsgZXhpdDsKfSwgMik7Cic7CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsVE9LRU5fUEFSU0UpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ1NUT1AnXT0ndG9rZW4nOyAkSigkbyk7IH0KICAgICRvWyd0bXBfaXJhc3l0YSddPShpbnQpZmlsZV9wdXRfY29udGVudHMoJHRtcCwkY29kZSk7CiAgICAkcj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4tYWpheC5waHA/YWN0aW9uPWhlYXJ0YmVhdCcpLGFycmF5KCd0aW1lb3V0Jz0+NjAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7CiAgICAkb1sncGluZyddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAgIGlmKHN0cmlwb3MoKHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksJ0ZhdGFsIGVycm9yJykhPT1mYWxzZSl7IHVubGluaygkdG1wKTsgJG9bJ0FUU0FVS1RBJ109MTsgfQogICAgJG9bJ2JfbnVvcm9kYSddPWhvbWVfdXJsKCcvP3BzX2JfcGVyeml1cmE9cmFpbWlzLTdmM2s5Jyk7CiAgICAkSigkbyk7CiAgfQogIGlmKCRmPT09J0MnKXsKICAgICRvWyd0bXBfaXN0cmludGEnXT1maWxlX2V4aXN0cygkdG1wKT8oaW50KXVubGluaygkdG1wKTonbmVidXZvJzsKICAgIHVwZGF0ZV9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJywwLGZhbHNlKTsKICAgIGRlbGV0ZV91c2VyX21ldGEoMTE5LCdwc193ZWxjb21lX3NlZW4nKTsKICAgICRvWydvcHRfcG8nXT1nZXRfb3B0aW9uKCdwZXRzaG9wX3dlbGNvbWVfbW9kYWxfZW5hYmxlZCcpOwogICAgJEooJG8pOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgJEooJG8pOyB9Cn0sOTkpOwo=';
const VER='dep-161824';
const GKEY='ps_s1636v';
const PHASES=["C"];
const OUT='analize/s1636_c.json';
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
