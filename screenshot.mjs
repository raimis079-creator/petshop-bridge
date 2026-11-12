process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU3aSBtZW5pdSArIG51a3JlaXBpbWFzIChSQVNPKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NTdpJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODU3aSddOwogIHRyeXsKICAgICRyWydtZW5pdV91cmwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X2lkLCBtZXRhX2tleSwgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX3ZhbHVlIExJS0UgJyVrYXRlZ29yaWphL3NwcmVuZGltYWklJyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgICAkclsnb3B0J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICcla2F0ZWdvcmlqYS9zcHJlbmRpbWFpJScgTElNSVQgMTAiKTsKICAgICRyWydtZW51NjgwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCwgbWV0YV9rZXksIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19tZW51X2l0ZW1fb2JqZWN0X2lkJyBBTkQgbWV0YV92YWx1ZSBJTiAoJzY4MCcsJzM0MjUzJykiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkclsnbWVudTY4MCddIGFzICRtKXsgJGlkPSRtWydwb3N0X2lkJ107ICRyWydtaSddWyRpZF09Wyd0eXBlJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19tZW51X2l0ZW1fdHlwZScsdHJ1ZSksJ29iaic9PmdldF9wb3N0X21ldGEoJGlkLCdfbWVudV9pdGVtX29iamVjdCcsdHJ1ZSksJ3N0Jz0+Z2V0X3Bvc3Rfc3RhdHVzKCRpZCksJ3RpdGxlJz0+Z2V0X3RoZV90aXRsZSgkaWQpXTsgfQogICAgLy8gbnVrcmVpcGltYXMgcGVyIENvZGUgU25pcHBldHMKICAgIGlmKCEkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGlkIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnUGV0c2hvcCBTMTg1NyUnIikpewogICAgICAkY29kZT0iLy8gUzE4NTcgKDIwMjYtMTEtMTIpOiB0dXNjaWEgcHJla2l1IGthdGVnb3JpamEgL2thdGVnb3JpamEvc3ByZW5kaW1haS8uLi4gcm9kZSAnUHJvZHVrdHUgbmVyYXN0YScuXG4vLyBTcHJlbmRpbWFpIHlyYSBwdXNsYXBpYWkgL3NwcmVuZGltYWkvLi4uIC0+IDMwMS5cbmFkZF9hY3Rpb24oJ3RlbXBsYXRlX3JlZGlyZWN0JywgZnVuY3Rpb24oKXtcbiAgaWYgKCFmdW5jdGlvbl9leGlzdHMoJ2lzX3Byb2R1Y3RfY2F0ZWdvcnknKSB8fCAhaXNfcHJvZHVjdF9jYXRlZ29yeSgpKSByZXR1cm47XG4gIFwkdCA9IGdldF9xdWVyaWVkX29iamVjdCgpO1xuICBpZiAoIVwkdCB8fCBlbXB0eShcJHQtPnNsdWcpKSByZXR1cm47XG4gIFwkcm9vdCA9IGdldF90ZXJtX2J5KCdzbHVnJywgJ3NwcmVuZGltYWknLCAncHJvZHVjdF9jYXQnKTtcbiAgaWYgKCFcJHJvb3QpIHJldHVybjtcbiAgaWYgKChpbnQpXCR0LT50ZXJtX2lkID09PSAoaW50KVwkcm9vdC0+dGVybV9pZCkgeyB3cF9zYWZlX3JlZGlyZWN0KGhvbWVfdXJsKCcvc3ByZW5kaW1haS8nKSwgMzAxKTsgZXhpdDsgfVxuICBpZiAoKGludClcJHQtPnBhcmVudCA9PT0gKGludClcJHJvb3QtPnRlcm1faWQpIHtcbiAgICBcJHBnID0gZ2V0X3BhZ2VfYnlfcGF0aCgnc3ByZW5kaW1haS8nIC4gXCR0LT5zbHVnKTtcbiAgICB3cF9zYWZlX3JlZGlyZWN0KFwkcGcgPyBnZXRfcGVybWFsaW5rKFwkcGcpIDogaG9tZV91cmwoJy9zcHJlbmRpbWFpLycpLCAzMDEpOyBleGl0O1xuICB9XG59LCA1KTsiOwogICAgICAkd3BkYi0+aW5zZXJ0KCJ7JFB9c25pcHBldHMiLFsnbmFtZSc9PidQZXRzaG9wIFMxODU3IFNwcmVuZGltxbMga2F0ZWdvcmlqb3Mg4oaSIHB1c2xhcGlhaSAoMzAxKScsJ2Rlc2NyaXB0aW9uJz0+J1R1xaHEjWlhIGthdGVnb3JpamEgcm9kxJcgUHJvZHVrdMWzIG5lcmFzdGEnLCdjb2RlJz0+JGNvZGUsJ3RhZ3MnPT4nJywnc2NvcGUnPT4nZ2xvYmFsJywncHJpb3JpdHknPT4xMCwnYWN0aXZlJz0+MSwnbW9kaWZpZWQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldKTsKICAgICAgJHJbJ3NuaXAnXT0kd3BkYi0+aW5zZXJ0X2lkID86ICR3cGRiLT5sYXN0X2Vycm9yOwogICAgfSBlbHNlICRyWydzbmlwJ109J2phdSB5cmEnOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-181256';
const GKEY='ps_s1857i';
const PHASES=["1"];
const OUT='analize/s1857_i.json';
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
