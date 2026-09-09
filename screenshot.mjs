process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY1IGNtcGx6IGlyIGF0cmlidXRhaSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JrOSddKT8kX0dFVFsncHNfYms5J106JycpIT09J0snKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY2NUsnKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgLy8gVmlzb3MgY21wbHogb3BjaWpvcwogICAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxMRU5HVEgob3B0aW9uX3ZhbHVlKSBsIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdjbXBseiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ2NvbXBsaWFueiUnIE9SREVSIEJZIG9wdGlvbl9uYW1lIixBUlJBWV9BKSBhcyAkcikgJG9bJ2NtcGx6X29wY2lqb3MnXVskclsnb3B0aW9uX25hbWUnXV09JHJbJ2wnXTsKICAgICRzPWdldF9vcHRpb24oJ2NtcGx6X29wdGlvbnNfc2V0dGluZ3MnKTsgaWYoIWlzX2FycmF5KCRzKSkgJHM9Z2V0X29wdGlvbignY29tcGxpYW56X29wdGlvbnNfc2V0dGluZ3MnKTsKICAgIGlmKGlzX2FycmF5KCRzKSl7IGZvcmVhY2goJHMgYXMgJGs9PiR2KXsgaWYoaXNfc3RyaW5nKCR2KSYmKHN0cnBvcygkdiwnQCcpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ21haWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdhZGRyZXNzJykhPT1mYWxzZXx8c3RyaXBvcygkaywnY29tcGFueScpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ3N5bmMnKSE9PWZhbHNlKSkgJG9bJ251c3RhdHltYWknXVska109c3Vic3RyKChzdHJpbmcpJHYsMCw5MCk7IH0gfQogICAgZm9yZWFjaChhcnJheSgnY21wbHpfc3luY19jb29raWVzX2NvbXBsZXRlJywnY21wbHpfZGV0ZWN0ZWRfY29va2llcycsJ2NtcGx6X2Nvb2tpZWRhdGFiYXNlX3JlcXVlc3RfZmFpbGVkJywnY21wbHpfc2Nhbl9wcm9ncmVzcycsJ2NtcGx6X2xhc3Rfc2NhbicsJ2NtcGx6X3dpemFyZF9jb21wbGV0ZWRfb25jZScsJ2NtcGx6X2RlbGV0ZWRfY29va2llcycpIGFzICRrKXsgJHY9Z2V0X29wdGlvbigkayk7ICRvWydidXNlbmEnXVska109aXNfc2NhbGFyKCR2KT8kdjooaXNfYXJyYXkoJHYpPygnbWFzeXZhcyAnLmNvdW50KCR2KSk6J25lcmEnKTsgfQogICAgLy8gU2xhcHVrdSBpcmFzYWkgKGNtcGx6IG5hdWRvamEgQ1BUIGNtcGx6LWNvb2tpZSkKICAgICRvWydjb29raWVfY3B0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9zdGF0dXMsQ09VTlQoKikgayBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZSBJTiAoJ2NtcGx6LWNvb2tpZXMnLCdjbXBsei1zZXJ2aWNlJykgR1JPVVAgQlkgcG9zdF9zdGF0dXMscG9zdF90eXBlIixBUlJBWV9BKTsKICAgICRvWydjb29raWVfdGlwYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X3R5cGUsQ09VTlQoKikgayBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZSBMSUtFICdjbXBseiUnIEdST1VQIEJZIHBvc3RfdHlwZSIsQVJSQVlfQSk7CiAgICAvLyBFbCBwYXN0YXMgaXMga2l0dXIKICAgICRvWydhZG1pbl9lbWFpbCddPWdldF9vcHRpb24oJ2FkbWluX2VtYWlsJyk7CiAgICAvLyBhciAnYmUgamF2YXNjcmlwdCcgeXJhIG5vc2NyaXB0IGJsb2tlCiAgICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL3BldHNob3AubHQvc2xhcHVrdS1wb2xpdGlrYS8nLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4nTW96aWxsYS81LjAgQ2hyb21lLzE1MicpKSk7CiAgICAkYj1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgaWYocHJlZ19tYXRjaCgnLyguezcwMH1iZSBqYXZhc2NyaXB0Lns1MDB9KS9zdScsJGIsJG0pKSAkb1snanNfa29udGVrc3RvX2h0bWwnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1bMV0pOwogICAgJG9bJ2NtcGx6X2RvY3VtZW50X2tsYXNlcyddPWFycmF5KCdjb29raWVzLW92ZXJ2aWV3Jz0+c3Vic3RyX2NvdW50KCRiLCdjbXBsei1jb29raWVzLW92ZXJ2aWV3JyksJ2NtcGx6LWRvY3VtZW50Jz0+c3Vic3RyX2NvdW50KCRiLCdjbXBsei1kb2N1bWVudCcpLCdub3NjcmlwdCc9PnN1YnN0cl9jb3VudCgkYiwnPG5vc2NyaXB0JykpOwogICAgLy8gLS0tLSBUdXNjaW9zIFRBS1NPTk9NSU5FUyBhdHJpYnV0dSByZWlrc21lcwogICAgJHRheD0ncGFfbW9ub3Byb3RlaW4nOwogICAgJG9bJ21vbm9wcm90ZWluJ109YXJyYXkoCiAgICAgICd0ZXJtaW5haSc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQubmFtZSx0dC5jb3VudCBGUk9NIHskd3BkYi0+dGVybXN9IHQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIFdIRVJFIHR0LnRheG9ub215PSckdGF4JyIsQVJSQVlfQSksCiAgICAgICdwcmVraXVfc3VfYXRyaWJ1dHUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3Byb2R1Y3RfYXR0cmlidXRlcycgQU5EIG1ldGFfdmFsdWUgTElLRSAnJXBhX21vbm9wcm90ZWluJSciKSwKICAgICk7CiAgICAvLyBraWVrIGlzIGp1IE5FVFVSSSB0ZXJtaW5vCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHJvZHVjdF9hdHRyaWJ1dGVzJyBBTkQgbWV0YV92YWx1ZSBMSUtFICclcGFfbW9ub3Byb3RlaW4lJyBMSU1JVCA1MDAwIik7CiAgICAkYmU9MDsgJHB2ej1hcnJheSgpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR0dD13cF9nZXRfb2JqZWN0X3Rlcm1zKCRpZCwkdGF4LGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7IGlmKGlzX3dwX2Vycm9yKCR0dCl8fCFjb3VudCgkdHQpKXsgJGJlKys7IGlmKGNvdW50KCRwdnopPDUpICRwdnpbXT0kaWQ7IH0gfQogICAgJG9bJ21vbm9wcm90ZWluJ11bJ2JlX3Rlcm1pbm8nXT0kYmU7ICRvWydtb25vcHJvdGVpbiddWydwdnonXT0kcHZ6OwogICAgLy8gQmVuZHJhaTogdmlzb3MgcGFfIHRha3Nvbm9taWpvcywga3VyIGF0cmlidXRhcyBwcmlza2lydGFzIGJldCB0ZXJtaW51IG5lcmEKICAgICR0YXhzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgdGF4b25vbXkgRlJPTSB7JHdwZGItPnRlcm1fdGF4b25vbXl9IFdIRVJFIHRheG9ub215IExJS0UgJ3BhXyUnIik7CiAgICAkb1sncGFfdGFrc29ub21pam9zJ109JHRheHM7CiAgICAkc2FudD1hcnJheSgpOwogICAgZm9yZWFjaCgkdGF4cyBhcyAkdHgpewogICAgICAkbj0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3Byb2R1Y3RfYXR0cmlidXRlcycgQU5EIG1ldGFfdmFsdWUgTElLRSAnJSR0eCUnIik7CiAgICAgIGlmKCRuKSAkc2FudFskdHhdPSRuOwogICAgfQogICAgJG9bJ2F0cmlidXR1X3ByaXNreXJpbWFpJ109JHNhbnQ7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-063009';
const GKEY='ps_bk9';
const PHASES=["K"];
const OUT='analize/s1665_k.json';
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
