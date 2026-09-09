process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc0IGNtcGx6IHBhc2xhdWd1IHp2YWxneWJhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmtTJ10pPyRfR0VUWydwc19ia1MnXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjc0Jyk7CiAgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgICRnPWZ1bmN0aW9uKCRjLCR6LCRwcmllcz0yMDAsJHBvPTkwMCwkbWF4PTIpeyAkcj1hcnJheSgpOyAkb2ZmPTA7JG49MDsKICAgICAgd2hpbGUoKCRwPXN0cmlwb3MoJGMsJHosJG9mZikpIT09ZmFsc2UgJiYgJG48JG1heCl7ICRyW109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkYyxtYXgoMCwkcC0kcHJpZXMpLCRwcmllcyskcG8pKTsgJG9mZj0kcCtzdHJsZW4oJHopOyAkbisrOyB9IHJldHVybiAkcjsgfTsKICAgICRkaXI9V1BfUExVR0lOX0RJUi4nL2NvbXBsaWFuei1nZHByLyc7CiAgICAvLyBrdXIgYXBpYnJlenRpIGxhdWthaQogICAgJGNmPSRkaXIuJ3NldHRpbmdzL2NvbmZpZy9maWVsZHMucGhwJzsKICAgICRvWydmaWVsZHNfZmFpbGFzJ109ZmlsZV9leGlzdHMoJGNmKT9maWxlc2l6ZSgkY2YpOiduZXJhJzsKICAgIGlmKGZpbGVfZXhpc3RzKCRjZikpeyAkYz1maWxlX2dldF9jb250ZW50cygkY2YpOwogICAgICAkb1sndHBzX2xhdWthcyddPSRnKCRjLCd0aGlyZHBhcnR5X3NlcnZpY2VzX29uX3NpdGUnLDMwMCwxNTAwLDEpOwogICAgICAkb1snY29uc2VudF9tb2RlJ109JGcoJGMsIidjb25zZW50LW1vZGUnIiwyMDAsNzAwLDEpOwogICAgICAkb1snZ3RtX2NvZGUnXT0kZygkYywiJ2d0bV9jb2RlJyIsMTUwLDYwMCwxKTsKICAgICAgJG9bJ3VhX2NvZGUnXT0kZygkYywiJ3VhX2NvZGUnIiwxNTAsNjAwLDEpOyB9CiAgICAvLyBjb25maWcgZmFpbGFpCiAgICAkY2Q9JGRpci4nc2V0dGluZ3MvY29uZmlnLyc7CiAgICBpZihpc19kaXIoJGNkKSkgJG9bJ2NvbmZpZ19mYWlsYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfZGlmZihzY2FuZGlyKCRjZCksYXJyYXkoJy4nLCcuLicpKSk7CiAgICAvLyBrdXIgZ2F1bmFtb3MgcGFzbGF1Z3UgcGFyaW5rdHlzCiAgICBmb3JlYWNoKGFycmF5KCd0aGlyZHBhcnR5LnBocCcsJ3NlcnZpY2VzLnBocCcsJ2NvbmZpZy5waHAnKSBhcyAkZmYpeyBpZihmaWxlX2V4aXN0cygkY2QuJGZmKSl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRjZC4kZmYpOwogICAgICBwcmVnX21hdGNoX2FsbCgiLycoW2EtejAtOVwtX117MywzMH0pJ1xzKj0+XHMqWydcIl0oW14nXCJdezIsNDB9KVsnXCJdLyIsJGMsJG0sUFJFR19TRVRfT1JERVIpOwogICAgICAkb1sncGFyaW5rdHlzJ11bJGZmXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsxXS4nID0+ICcuJHhbMl07fSwkbSksMCw0MCk7IH0gfQogICAgLy8gc2luY2hyb25pemFjaWpvcyBmdW5rY2lqYQogICAgZm9yZWFjaChhcnJheSgnY2xhc3MtY29va2llZGF0YWJhc2UucGhwJywnY29va2llZGF0YWJhc2UvY2xhc3MtY29va2llZGF0YWJhc2UucGhwJywnY2xhc3MtY29va2llLnBocCcpIGFzICRmZil7CiAgICAgIGlmKGZpbGVfZXhpc3RzKCRkaXIuJGZmKSkgJG9bJ2NkYl9mYWlsYXMnXVtdPSRmZjsgfQogICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICAkcmFzdGk9YXJyYXkoKTsKICAgIGZvcmVhY2goJGl0IGFzICRwKXsgJG49JHAtPmdldEZpbGVuYW1lKCk7CiAgICAgIGlmKHByZWdfbWF0Y2goJy9jb29raWVkYXRhYmFzZXxzeW5jfGNvb2tpZS1hZG1pbnxjbGFzcy1jb29raWUvaScsJG4pJiZzdWJzdHIoJG4sLTQpPT09Jy5waHAnKSAkcmFzdGlbXT1zdHJfcmVwbGFjZSgkZGlyLCcnLCRwLT5nZXRQYXRobmFtZSgpKTsgfQogICAgJG9bJ3N5bmNfZmFpbGFpJ109YXJyYXlfc2xpY2UoJHJhc3RpLDAsMTUpOwogICAgLy8gZnVua2Npam9zIHNpbmNocm9uaXphY2lqYWkKICAgIGZvcmVhY2goJHJhc3RpIGFzICRyZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJHJmKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoIi9mdW5jdGlvblxzKyhbYS16MC05X10qKHN5bmN8aW1wb3J0fHVwZGF0ZV9jb29raWV8cmV0cmlldmUpW2EtejAtOV9dKikvaSIsJGMsJG0pOwogICAgICBpZigkbVsxXSkgJG9bJ3N5bmNfZm4nXVskcmZdPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbVsxXSksMCwxMik7IH0KICAgICRvWydrbGFzZXNfeXJhJ109YXJyYXkoJ0NNUExaX0NPT0tJRSc9PmNsYXNzX2V4aXN0cygnQ01QTFpfQ09PS0lFJyksJ0NNUExaX1NFUlZJQ0UnPT5jbGFzc19leGlzdHMoJ0NNUExaX1NFUlZJQ0UnKSk7CiAgICAkb1snY2RiX2ZuJ109YXJyYXkoJ2NtcGx6X2dldF9jb29raWVkYXRhYmFzZSc9PmZ1bmN0aW9uX2V4aXN0cygnY21wbHpfZ2V0X2Nvb2tpZWRhdGFiYXNlJyksCiAgICAgICdjbXBsel9zeW5jX2Nvb2tpZXMnPT5mdW5jdGlvbl9leGlzdHMoJ2NtcGx6X3N5bmNfY29va2llcycpLAogICAgICAnY21wbHpfdXBkYXRlX2Nvb2tpZV9wb2xpY3lfc25hcHNob3QnPT5mdW5jdGlvbl9leGlzdHMoJ2NtcGx6X3VwZGF0ZV9jb29raWVfcG9saWN5X3NuYXBzaG90JykpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-080744';
const GKEY='ps_bkS';
const PHASES=["R"];
const OUT='analize/s1674_r.json';
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
