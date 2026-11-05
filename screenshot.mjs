process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODMxemIgWkIvVkYgc211bGttZW5vcyBkZXp1dGVtcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MzF6YiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkZj0kX0dFVFsncHNfczE4MzF6YiddOyAkcj1bJ3YnPT4nUzE4MzF6YicsJ2YnPT4kZl07CiAgdHJ5ewogICRrZXkgPSAkZj09PSd2ZicgPyAnX3ZmX2Nvc3QnIDogJ196Yl9jb3N0JzsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklEIGlkLCBwLnBvc3RfdGl0bGUgbm0sIHAucG9zdF9zdGF0dXMgc3QsIGMubWV0YV92YWx1ZSBjb3N0LCBzLm1ldGFfdmFsdWUgc3RvY2ssIHByLm1ldGFfdmFsdWUgcHJpY2UsIGIubWV0YV92YWx1ZSBicmFuZCBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIGMgT04gYy5wb3N0X2lkPXAuSUQgQU5EIGMubWV0YV9rZXk9JyRrZXknIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3N0b2NrJyBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHByIE9OIHByLnBvc3RfaWQ9cC5JRCBBTkQgcHIubWV0YV9rZXk9J19wcmljZScgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBiIE9OIGIucG9zdF9pZD1wLklEIEFORCBiLm1ldGFfa2V5PSdfemJfYnJhbmQnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykgQU5EIENBU1QoYy5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoMTAsMikpIEJFVFdFRU4gMC4yIEFORCA0LjUgQU5EIENBU1Qocy5tZXRhX3ZhbHVlIEFTIFNJR05FRCk+PTUiLEFSUkFZX0EpOwogICRyWyduJ109Y291bnQoJHJvd3MpOyAkb3V0PVtdOyAka2FsPVtdOyAkYnJhbmRzPVtdOwogIGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkY2F0cz1pbXBsb2RlKCcvJyx3cF9nZXRfcG9zdF90ZXJtcygkeFsnaWQnXSwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J25hbWVzJ10pKTsgJGJyPSR4WydicmFuZCddPzonJzsgJGJyYW5kc1skYnJdPSgkYnJhbmRzWyRicl0/PzApKzE7CiAgICAkcm93PVskeFsnaWQnXSxtYl9zdWJzdHIoJHhbJ25tJ10sMCw3NSksJHhbJ3N0J10sKGZsb2F0KSR4Wydjb3N0J10sKGludCkkeFsnc3RvY2snXSwkeFsncHJpY2UnXSxtYl9zdWJzdHIoJGNhdHMsMCwzNSksJGJyXTsKICAgIGlmKHByZWdfbWF0Y2goJy9rYWzEl2R8eG1hc3xjaHJpc3RtYXN8xaF2ZW50aW58YWR2ZW50fHNhbnRhfGVsbml8c25haWd8ZWdsdXR8ZG92YW4vaXUnLCR4WydubSddKSkgJGthbFtdPSRyb3c7CiAgICAkb3V0W109JHJvdzsgfQogICRyWydrYWxlZGluZXMnXT0ka2FsOyBhcnNvcnQoJGJyYW5kcyk7ICRyWydicmFuZHMnXT1hcnJheV9zbGljZSgkYnJhbmRzLDAsMjUsdHJ1ZSk7CiAgLy8ga2F0ZWdvcmlqb3MKICAka2F0PVtdOyBmb3JlYWNoKCRvdXQgYXMgJG8peyAkaz1leHBsb2RlKCcvJywkb1s2XSlbMF07ICRrYXRbJGtdPSgka2F0WyRrXT8/MCkrMTsgfSBhcnNvcnQoJGthdCk7ICRyWydrYXQnXT1hcnJheV9zbGljZSgka2F0LDAsMzAsdHJ1ZSk7CiAgLy8gcGF2eXpkemlhaSBwYWdhbCBncnVwZXMKICAkZz1bJ8W+YWlzbCc9PltdLCAnc2thbsSXc3QnPT5bXSwgJ2FudGtha2x8cGF2YWR8cGV0bmXFoXxrYXNwaW58cGV0ZWxpxaEnPT5bXSwgJ2R1YmVuxJdsfGdlcnR1dic9PltdLCAnxaF1a3zFoWVwZXR8cHJpZcW+fMWhYW1wxatuJz0+W10sICdrYXQuKsW+YWlzfHBlbHxwbHVua3NufGthxI1pYcW+b2x8Y2F0bmlwJz0+W11dOwogIGZvcmVhY2goJG91dCBhcyAkbyl7IGZvcmVhY2goJGcgYXMgJHJlPT4kXyl7IGlmKHByZWdfbWF0Y2goIi8kcmUvaXUiLCRvWzFdLicgJy4kb1s2XSkpeyBpZihjb3VudCgkZ1skcmVdKTw0MCkgJGdbJHJlXVtdPSRvOyBicmVhazsgfSB9IH0KICAkclsnZ3J1cGVzJ109JGc7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-120047';
const GKEY='ps_s1831zb';
const PHASES=["zb", "vf"];
const OUT='analize/s1831_zb.json';
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
