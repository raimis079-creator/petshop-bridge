process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYXAg4oCUIGxlZ2FjeS0zMDEgKzkgc3RydWt0xatyaW5pYWkgcHVzbGFwaWFpICsgcGFncmluZGluaW8gcHVzbGFwaW8gMiBudW9yb2TFsyBwYXRhaXNhIChSYWltaW8gcGF0dmlydGludGEpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OWFwJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNjY5YXAnXTsgJG89YXJyYXkoJ3YnPT4nUzE2NjkgYXAnLCdmYXplJz0+JGYpOyBnbG9iYWwgJHdwZGI7CiAgJE09V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJzsgJEJBSz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcy9wZXRzaG9wLWxlZ2FjeS0zMDEtbWFwLmpzb24uYmFrX3MxNjY5Yic7ICRPTEQ9JzkzMGM2NGQ5ZDQxYTliZjdlMzFlODIzZWE3OTU2YTE4JzsKICAkYWRkPWFycmF5KCd2aXNvcy1wcmVrZXMnPT4nL3BhcmR1b3R1dmUvJywnY29udGFjdCc9Picva29udGFrdGFpLycsJ3BhaWVza2EnPT4nL3BhcmR1b3R1dmUvJywnYWtjaWppbmlhaS1wYXNpdWx5bWFpJz0+Jy9ha2Npam9zLycsJ2phdXRydXMtdmlyc2tpbmltYXMnPT4nL3NwcmVuZGltYWkvamF1dHJ1cy12aXJza2luaW1hcy8nLCdwcmlzaWp1bmdpbWFzJz0+Jy9wYXNreXJhLycsJ3BhcmR1b3R1dmVzLWtvbnRha3RhaSc9Picva29udGFrdGFpLycsJ3ByaXZhdHVtby1wb2xpdGlrYS0yJz0+Jy9wcml2YXR1bW8tcG9saXRpa2EvJywnc3RlcmlsaXp1b3Rhcy1hdWdpbnRpbmlzJz0+Jy9zcHJlbmRpbWFpL3N0ZXJpbGl6dW90YXMtYXVnaW50aW5pcy8nKTsKICAkSE9NRT0zNDU0MzsKICB0cnl7CiAgaWYoJGY9PT0nRCcpewogICAgJGN1cj1tZDVfZmlsZSgkTSk7ICRvWydwcmllcyddPSRjdXI7ICRtYXA9anNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoJE0pLHRydWUpOyAkbjA9Y291bnQoJG1hcCk7CiAgICBpZigkY3VyIT09JE9MRCl7ICRqYXU9MDsgZm9yZWFjaCgkYWRkIGFzICRrPT4kdikgaWYoKCRtYXBbJGtdPz9udWxsKT09PSR2KSAkamF1Kys7ICRvWydyZXonXT0oJGphdT09PWNvdW50KCRhZGQpKT8nSkFVJzonU1RPUDogbWQ1Jzsgd3Bfc2VuZF9qc29uKCRvKTsgfQogICAgZm9yZWFjaCgkYWRkIGFzICRrPT4kdil7IGlmKGlzc2V0KCRtYXBbJGtdKSl7ICRvWydyZXonXT0nU1RPUDogcmFrdGFzIGphdSB5cmEgJy4kazsgd3Bfc2VuZF9qc29uKCRvKTsgfSAkbWFwWyRrXT0kdjsgfQogICAgJGpzPXdwX2pzb25fZW5jb2RlKCRtYXAsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgaWYoY291bnQoanNvbl9kZWNvZGUoJGpzLHRydWUpKSE9PSRuMCtjb3VudCgkYWRkKSl7ICRvWydyZXonXT0nU1RPUDoganNvbic7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgIGlmKCFjb3B5KCRNLCRCQUspIHx8IG1kNV9maWxlKCRCQUspIT09JE9MRCl7ICRvWydyZXonXT0nU1RPUDogYmFja3VwJzsgd3Bfc2VuZF9qc29uKCRvKTsgfQogICAgJHRtcD0kTS4nLnRtcC1zMTY2OWInOyBmaWxlX3B1dF9jb250ZW50cygkdG1wLCRqcyk7IGlmKG1kNV9maWxlKCR0bXApIT09bWQ1KCRqcykpeyBAdW5saW5rKCR0bXApOyAkb1sncmV6J109J1NUT1A6IHRtcCc7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgIHJlbmFtZSgkdG1wLCRNKTsgJG9bJ3BvJ109bWQ1X2ZpbGUoJE0pOyAkb1snbiddPSRuMC4n4oaSJy5jb3VudChqc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cygkTSksdHJ1ZSkpOwogICAgLyogUGFncmluZGluaXMgcHVzbGFwaXMgKi8KICAgICRjPShzdHJpbmcpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBJRD0lZCIsJEhPTUUpKTsKICAgIGlmKCFnZXRfb3B0aW9uKCdwc19zMTY2OV9ob21lX2JhY2t1cCcpKSBhZGRfb3B0aW9uKCdwc19zMTY2OV9ob21lX2JhY2t1cCcsYXJyYXkoJ2lkJz0+JEhPTUUsJ21kNSc9Pm1kNSgkYyksJ3R1cmlueXMnPT4kYyksJycsJ25vJyk7CiAgICAkbjE9MDsgJG4yPTA7CiAgICAkYzI9cHJlZ19yZXBsYWNlKCcjKGhyZWY9WyJcJ10pL2phdXRydXMtdmlyc2tpbmltYXMvIycsJyQxL3NwcmVuZGltYWkvamF1dHJ1cy12aXJza2luaW1hcy8nLCRjLC0xLCRuMSk7CiAgICAkYzI9cHJlZ19yZXBsYWNlKCcjKGhyZWY9WyJcJ10pL3N0ZXJpbGl6dW90YXMtYXVnaW50aW5pcy8jJywnJDEvc3ByZW5kaW1haS9zdGVyaWxpenVvdGFzLWF1Z2ludGluaXMvJywkYzIsLTEsJG4yKTsKICAgICRvWydob21lX3Bha2Vpc3RhJ109YXJyYXkoJG4xLCRuMik7CiAgICBpZigkbjE+PTEgJiYgJG4yPj0xKXsgJHdwZGItPnVwZGF0ZSgkd3BkYi0+cG9zdHMsYXJyYXkoJ3Bvc3RfY29udGVudCc9PiRjMiksYXJyYXkoJ0lEJz0+JEhPTUUpKTsgY2xlYW5fcG9zdF9jYWNoZSgkSE9NRSk7CiAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BzY19kZWxldGVfcG9zdF9jYWNoZScpKSB3cHNjX2RlbGV0ZV9wb3N0X2NhY2hlKCRIT01FKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cHNjX2RlbGV0ZV91cmxfY2FjaGUnKSkgd3BzY19kZWxldGVfdXJsX2NhY2hlKGhvbWVfdXJsKCcvJykpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRIT01FKTsKICAgICAgJG9bJ2hvbWVfbWQ1J109YXJyYXkobWQ1KCRjKSxtZDUoKHN0cmluZykkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfY29udGVudCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIElEPSVkIiwkSE9NRSkpKSk7IH0KICAgIGVsc2UgJG9bJ2hvbWUnXT0nTkVLRUlTVEE6IG5lcmFzdGEgdGlrc2xpxbMgbnVvcm9kxbMnOwogICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19oYj1zMTY2OWFwJyksYXJyYXkoJ3RpbWVvdXQnPT4yMCkpOyAkb1sncGluZyddPWlzX3dwX2Vycm9yKCRyKT8wOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAgIGlmKCEkb1sncGluZyddfHwkb1sncGluZyddPj01MDApeyBjb3B5KCRCQUssJE0pOyAkb1sncmV6J109J1JPTExCQUNLIG1hcCc7IH0gZWxzZSAkb1sncmV6J109J09LJzsKICB9IGVsc2VpZigkZj09PSdWJyl7CiAgICBmb3JlYWNoKCRhZGQgYXMgJGs9PiR2KXsgJHI9d3BfcmVtb3RlX2hlYWQoaG9tZV91cmwoJy8nLiRrLicvJyksYXJyYXkoJ3RpbWVvdXQnPT4xNSwncmVkaXJlY3Rpb24nPT4wKSk7ICRsb2M9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCdsb2NhdGlvbicpOyAkcjI9d3BfcmVtb3RlX2hlYWQoJGxvYyxhcnJheSgndGltZW91dCc9PjE1LCdyZWRpcmVjdGlvbic9PjApKTsgJG9bJ3QnXVska109YXJyYXkod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLHBhcnNlX3VybCgkbG9jLFBIUF9VUkxfUEFUSCksd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIyKSk7IH0KICAgIGZvcmVhY2goYXJyYXkoJz9wc19uYz0nLnRpbWUoKSwgJycpIGFzICRxKXsgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLycuJHEpLGFycmF5KCd0aW1lb3V0Jz0+MzApKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgICAkb1snaG9tZSddWyRxPT09Jyc/J2tlc2FzJzonZGluYW1pbmlzJ109YXJyYXkoJ3NwcmVuZGltYWlfanYnPT5zdWJzdHJfY291bnQoJGgsJy9zcHJlbmRpbWFpL2phdXRydXMtdmlyc2tpbmltYXMvJyksJ3NwcmVuZGltYWlfc2EnPT5zdWJzdHJfY291bnQoJGgsJy9zcHJlbmRpbWFpL3N0ZXJpbGl6dW90YXMtYXVnaW50aW5pcy8nKSwnYmxvZ29zJz0+cHJlZ19tYXRjaF9hbGwoJyNocmVmPVsiXCddKGh0dHBzOi8vcGV0c2hvcFwubHQpPy8oamF1dHJ1cy12aXJza2luaW1hc3xzdGVyaWxpenVvdGFzLWF1Z2ludGluaXMpLyMnLCRoKSk7IH0KICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-193357';
const GKEY='ps_s1669ap';
const PHASES=["D", "V"];
const OUT='analize/s1669_ap.json';
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
