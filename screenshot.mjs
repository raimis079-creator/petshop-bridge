process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTAgcnVuIGUxMnIg4oCUIHJlY29uOiBMUCBwbHVnaW5vIG51c3RhdHltYWkgKGxhacWha28vY29tcGxldGVkIMSvdnlraWFpKSArIFdDIOKAnkNvbmZpcm0geW91ciBlbWFpbOKAnCBwcmFuZcWhaW1vIGtpbG3ElyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lMTJyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4ncnVuIGUxMnInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICB0cnl7CiAgICRvWydscF9vcGNpam9zJ109YXJyYXkoKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxvcHRpb25fdmFsdWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICd3b29fbGl0aHVhbmlhcG9zdCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3dvb2NvbW1lcmNlX2xpdGh1YW5pYXBvc3QlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclbHBleHByZXNzJSciLEFSUkFZX0EpIGFzICRyKXsgJHY9bWF5YmVfdW5zZXJpYWxpemUoJHJbJ29wdGlvbl92YWx1ZSddKTsgJG9bJ2xwX29wY2lqb3MnXVskclsnb3B0aW9uX25hbWUnXV09aXNfYXJyYXkoJHYpP2FycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGlzX3N0cmluZygkeCk/bWJfc3Vic3RyKCR4LDAsODApOiR4O30sJHYpOm1iX3N1YnN0cigoc3RyaW5nKSR2LDAsMTIwKTsgfQogICAkZGlyPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluJzsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyKSk7CiAgIGZvcmVhY2goJGl0IGFzICRmbCl7IGlmKHN1YnN0cigkZmwsLTQpIT09Jy5waHAnKSBjb250aW51ZTsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGZsKTsKICAgICBpZihwcmVnX21hdGNoX2FsbCgnLy57MCwxMDB9ZXZlbnRfdG9fKD86c2VuZF90cmFja2luZ19lbWFpbHxjb21wbGV0ZV9vcmRlcikuezAsMTYwfS8nLCRzLCRtKSl7ICRvWydldmVudF9jdHgnXVtiYXNlbmFtZSgkZmwpXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gdHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHgpKTt9LCRtWzBdKSksMCw2KTsgfQogICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvYWRkX2FjdGlvblxzKlwoXHMqW1wnIl13b29fbGl0aHVhbmlhcG9zdF9zZW5kX3RyYWNraW5nX2VtYWlsW1wnIl0uezAsMTIwfS8nLCRzLCRtKSl7ICRvWydzZW5kX2hvb2snXVtiYXNlbmFtZSgkZmwpXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiB0cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCkpO30sJG1bMF0pOyB9CiAgICAgaWYocHJlZ19tYXRjaF9hbGwoJy9nZXRfb3B0aW9uXHMqXChccypbXCciXShbXlwnIl0qKD86ZXZlbnR8ZW1haWx8Y29tcGxldGV8c3RhdHVzKVteXCciXSopW1wnIl0vaScsJHMsJG0pKXsgZm9yZWFjaCgkbVsxXSBhcyAkaykgJG9bJ29wdF9rZXlzJ11bJGtdPWJhc2VuYW1lKCRmbCk7IH0KICAgfQogICBnbG9iYWwgJHdwX2ZpbHRlcjsgJG9bJ3NlbmRfaG9va19neXZhcyddPWFycmF5KCk7IGlmKCFlbXB0eSgkd3BfZmlsdGVyWyd3b29fbGl0aHVhbmlhcG9zdF9zZW5kX3RyYWNraW5nX2VtYWlsJ10pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWyd3b29fbGl0aHVhbmlhcG9zdF9zZW5kX3RyYWNraW5nX2VtYWlsJ10tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgJG9bJ3NlbmRfaG9va19neXZhcyddW109JHByLic6ICcuKGlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06KGlzX3N0cmluZygkZm4pPyRmbjonY2xvc3VyZScpKTsgfSB9IH0KICAgLy8gV0M6IOKAnkNvbmZpcm0geW91ciBlbWFpbCBhZGRyZXNz4oCcIGtpbG3ElwogICAkd2M9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlJzsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkd2MuJy9pbmNsdWRlcycpKTsgZm9yZWFjaCgkaXQgYXMgJGZsKXsgaWYoc3Vic3RyKCRmbCwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkcz1maWxlX2dldF9jb250ZW50cygkZmwpOyBpZihzdHJwb3MoJHMsJ2NoZWNrIGZvciBwYXN0IG9yZGVycycpIT09ZmFsc2UpeyAkcG9zPXN0cnBvcygkcywnY2hlY2sgZm9yIHBhc3Qgb3JkZXJzJyk7ICRvWyd3Y19jb25maXJtJ11bc3RyX3JlcGxhY2UoJHdjLCcnLCRmbCldPXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkcyxtYXgoMCwkcG9zLTE0MDApLDE5MDApKSk7IH0gfQogICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCR3Yy4nL3NyYycpKTsgZm9yZWFjaCgkaXQgYXMgJGZsKXsgaWYoc3Vic3RyKCRmbCwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkcz1maWxlX2dldF9jb250ZW50cygkZmwpOyBpZihzdHJwb3MoJHMsJ2NoZWNrIGZvciBwYXN0IG9yZGVycycpIT09ZmFsc2UpeyAkcG9zPXN0cnBvcygkcywnY2hlY2sgZm9yIHBhc3Qgb3JkZXJzJyk7ICRvWyd3Y19jb25maXJtJ11bc3RyX3JlcGxhY2UoJHdjLCcnLCRmbCldPXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkcyxtYXgoMCwkcG9zLTE0MDApLDE5MDApKSk7IH0gfQogICAkb1snd2NfdmVyc2lqYSddPVdDKCktPnZlcnNpb247CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-203642';
const GKEY='ps_e12r';
const PHASES=["R"];
const OUT='analize/e12_run1r.json';
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
