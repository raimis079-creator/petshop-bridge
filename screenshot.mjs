process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAwIGJvdHUgcmVjb24gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzAwJ10pfHwkX0dFVFsncHNfczE3MDAnXSE9PScxJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE3MDAgbWEnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkVz0ieyRwfXBzX3dlYl9pdnlraWFpIjsgJG51bz0nMjAyNi0wOS0xMyc7CiAgdHJ5ewogICAgJG9bJ3NhbHlzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2FsaXMsIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgcywgQ09VTlQoKikgbiBGUk9NICRXIFdIRVJFIGxhaWthcz49JyRudW8nIEdST1VQIEJZIHNhbGlzIE9SREVSIEJZIHMgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAvLyBzZXNpam9zIHByb2ZpbGlzCiAgICAkc2VzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNlc2lqYSwgTUFYKHNhbGlzKSBzYWxpcywgTUFYKGlyZW5naW55cykgaXIsIE1BWChuYXJzX3NlaW1hKSBuYXJzLCBNQVgoa2FuYWxhcykga2FuLCBNQVgoc2FsdGluaXMpIHNhbCwgQ09VTlQoKikgbiwgU1VNKHRpcGFzPSdwYWdldmlldycpIHB2LCBTVU0odGlwYXMgSU4gKCd2aWV3X2l0ZW0nLCdhZGRfdG9fY2FydCcsJ3NlYXJjaCcsJ2JlZ2luX2NoZWNrb3V0Jywndmlld19jYXJ0JywnZmlsdGVyJykpIHptLCBTVU0odGlwYXM9J2Vycm9yNDA0JykgZTQwNCwgTUFYKHN1dGlraW1hcykgc3V0LCBNQVgocHJpc2lqdW5nZXMpIHByaXMsIFRJTUVTVEFNUERJRkYoU0VDT05ELE1JTihsYWlrYXMpLE1BWChsYWlrYXMpKSB0cnVrbWUgRlJPTSAkVyBXSEVSRSBsYWlrYXM+PSckbnVvJyBHUk9VUCBCWSBzZXNpamEiLEFSUkFZX0EpOwogICAgJGFnZz1hcnJheSgpOwogICAgZm9yZWFjaCgkc2VzIGFzICRzKXsgJGs9JHNbJ3NhbGlzJ10/Oic/JzsgaWYoIWlzc2V0KCRhZ2dbJGtdKSkgJGFnZ1ska109YXJyYXkoJ3Nlcyc9PjAsJ3RpazFwdic9PjAsJ2JlX3ptJz0+MCwnc3Vfem0nPT4wLCdzdXQnPT4wLCd0cnVrbWUwJz0+MCwnbW9iJz0+MCwncHYnPT4wKTsKICAgICAgJGE9JiRhZ2dbJGtdOyAkYVsnc2VzJ10rKzsgJGFbJ3B2J10rPSRzWydwdiddOyBpZigkc1snbiddPD0xKSAkYVsndGlrMXB2J10rKzsgaWYoJHNbJ3ptJ10+MCkgJGFbJ3N1X3ptJ10rKzsgZWxzZSAkYVsnYmVfem0nXSsrOyBpZigkc1snc3V0J10pICRhWydzdXQnXSsrOyBpZigkc1sndHJ1a21lJ109PTApICRhWyd0cnVrbWUwJ10rKzsgaWYoJHNbJ2lyJ109PT0nbW9iaWxlJykgJGFbJ21vYiddKys7IHVuc2V0KCRhKTsgfQogICAgdWFzb3J0KCRhZ2csZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsnc2VzJ10tJGFbJ3NlcyddO30pOyAkb1sncHJvZmlsaXMnXT1hcnJheV9zbGljZSgkYWdnLDAsMTIsdHJ1ZSk7CiAgICAkb1sndmlzbyddPWNvdW50KCRzZXMpOwogICAgLy8gTFQgdnMgbmUtTFQgc3Ugxb5tb2dpxaFrYWlzIMSvdnlraWFpcwogICAgJGx0PTA7JGx0em09MDskbmU9MDskbmV6bT0wOyBmb3JlYWNoKCRzZXMgYXMgJHMpeyBpZigkc1snc2FsaXMnXT09PSdMVCcpeyRsdCsrOyBpZigkc1snem0nXT4wKSRsdHptKys7fSBlbHNlIHskbmUrKzsgaWYoJHNbJ3ptJ10+MCkkbmV6bSsrO30gfQogICAgJG9bJ2x0J109YXJyYXkoJ3Nlcyc9PiRsdCwnc3Vfem0nPT4kbHR6bSk7ICRvWyduZV9sdCddPWFycmF5KCdzZXMnPT4kbmUsJ3N1X3ptJz0+JG5lem0pOwogICAgLy8gbmUtTFQgbmFyxaF5a2zEl3MgLyBrYW5hbGFpCiAgICAkb1snbmVsdF9uYXJzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbmFyc19zZWltYSwgb3Nfc2VpbWEsIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgcyBGUk9NICRXIFdIRVJFIGxhaWthcz49JyRudW8nIEFORCBzYWxpczw+J0xUJyBHUk9VUCBCWSAxLDIgT1JERVIgQlkgcyBERVNDIExJTUlUIDEyIixBUlJBWV9BKTsKICAgICRvWyduZWx0X2thbmFsYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrYW5hbGFzLCBzYWx0aW5pcywgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzIEZST00gJFcgV0hFUkUgbGFpa2FzPj0nJG51bycgQU5EIHNhbGlzPD4nTFQnIEdST1VQIEJZIDEsMiBPUkRFUiBCWSBzIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICAgLy8gbmUtTFQgc2VzaWpvcyBzdSB1xb5zYWt5bXU/CiAgICAkb1snbmVsdF9jaGVja291dCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRXIFdIRVJFIGxhaWthcz49JyRudW8nIEFORCBzYWxpczw+J0xUJyBBTkQgdGlwYXM9J2JlZ2luX2NoZWNrb3V0JyIpOwogICAgJG9bJ25lbHRfYWNpdSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRXIFdIRVJFIGxhaWthcz49JyRudW8nIEFORCBzYWxpczw+J0xUJyBBTkQgcHVzbF90aXBhcz0nYWNpdSciKTsKICAgIC8vIHBhZ2V2aWV3IHRpayAxIGlyIHRydWttxJcgMCDigJQgTFQKICAgICRvWydsdF8xcHYnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCBzZXNpamEgRlJPTSAkVyBXSEVSRSBsYWlrYXM+PSckbnVvJyBBTkQgc2FsaXM9J0xUJyBHUk9VUCBCWSBzZXNpamEgSEFWSU5HIENPVU5UKCopPTEpIHgiKTsKICAgIC8vIGthaXAgbnVzdGF0b21hIMWhYWxpcyDigJQgcmlua2lrbGlvIGtvZGFzCiAgICAkc3JjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wZXRzaG9wLWFuYWxpdGlrYS5waHAnKTsgcHJlZ19tYXRjaF9hbGwoJy8uezAsMTIwfShzYWxpc3xDT1VOVFJZfEdFT0lQfENGLUlQQ291bnRyeXxjb3VudHJ5KS57MCwxNjB9L2knLCRzcmMsJG0pOyAkb1snc2FsaXNfa29kYXMnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1bMF0pLDAsOCk7CiAgICBwcmVnX21hdGNoX2FsbCgnLy57MCwxMDB9KGJvdHxjcmF3bHxzcGlkZXIpLnswLDEyMH0vaScsJHNyYywkbTIpOyAkb1snYm90X2tvZGFzJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRtMlswXSksMCw4KTsKICAgIC8vIHNlcyBwZXIgZGllbsSFIExUIHZzIG5lLUxUCiAgICAkb1snZGllbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShsYWlrYXMpIGQsIFNVTShzYWxpcz0nTFQnKSBsdF9pdiwgQ09VTlQoRElTVElOQ1QgSUYoc2FsaXM9J0xUJyxzZXNpamEsTlVMTCkpIGx0X3NlcywgQ09VTlQoRElTVElOQ1QgSUYoc2FsaXM8PidMVCcsc2VzaWphLE5VTEwpKSBuZV9zZXMgRlJPTSAkVyBXSEVSRSBsYWlrYXM+PSckbnVvJyBHUk9VUCBCWSBkIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-194048';
const GKEY='ps_s1700';
const PHASES=["1"];
const OUT='analize/s1700_ma.json';
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
