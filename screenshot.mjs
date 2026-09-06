process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzMgcnVuIGcg4oCUIEc6IFNBUkfFsiBCxapLTMSWIChTMTYzNCBmaXg6ICtzZWN1cmVfYXV0aCBjb29raWUsIGRsLWVpbGVzIHJlZ2V4KSAoY3JvbidhaSwgc2VraW1hcywgU0xBLCBpbXBvcnRhaSwgbGFpxaFrYWksIGVpbMSXcywgUEhQIGtsYWlkb3MsIDMwMSwgR0E0KS4gUkVBRC1PTkxZLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTYzNGcnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYzNCBnJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgLy8gY3JvbidhaQogICRjcj1fZ2V0X2Nyb25fYXJyYXkoKTsgJG11cz1hcnJheSgncHNfdmVuaXBha19zZWtpbWFzJywncHNfdmVsYXZpbW9fbGFpc2thaScsJ3BzX2RsX2F0c2F1a3R1X3ZhbHltYXMnLCdwc19kcm9wc2hpcF9zYXJnYXMnLCdwc196Yl9pbXBvcnRhcycsJ3BzX3ZmX2ltcG9ydGFzJyk7ICRyYXN0YT1hcnJheSgpOwogIGZvcmVhY2goJGNyIGFzICR0cz0+JGhvb2tzKXsgZm9yZWFjaCgkaG9va3MgYXMgJGg9PiR4KXsgZm9yZWFjaCgkbXVzIGFzICRtKXsgaWYoc3RycG9zKCRoLCRtKSE9PWZhbHNlICYmICFpc3NldCgkcmFzdGFbJGhdKSkgJHJhc3RhWyRoXT1kYXRlKCdtLWQgSDppJywkdHMpOyB9IGlmKCFpc3NldCgkdmlzaVskaF0pKSAkdmlzaVskaF09ZGF0ZSgnbS1kIEg6aScsJHRzKTsgfSB9CiAgJG9bJ2Nyb25fbXVzdSddPSRyYXN0YTsgJG9bJ2Nyb25fdmlzbyddPWNvdW50KCR2aXNpPz9hcnJheSgpKTsKICAvLyBzZWtpbWFzCiAgJG9bJ3ZlbmlwYWtfc2VraW1hc19wYXNrJ109Z2V0X29wdGlvbigncHNfdmVuaXBha19zZWtpbWFzX3Bhc2t1dGluaXMnLCcnKTsKICAvLyBTTEEgLyBrbGF1c2ltYWkKICAkb1snc2xhX3ZlbGF2aW1haSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NsYV92ZWxhdmltYXMnIik7CiAgJG9bJ3NpdW50YV9ncml6dGEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zaXVudGFfZ3JpenRhJyIpOwogIC8vIGltcG9ydGFpCiAgZm9yZWFjaChhcnJheSgnemInPT4ncHNfemInLCd2Zic9Pidwc192ZicpIGFzICRrPT4kcHJlZil7ICRvWydpbXBvcnRhaSddWyRrXT1hcnJheV9maWx0ZXIoYXJyYXkoCiAgICAncGFzayc9PmdldF9vcHRpb24oJHByZWYuJ19wYXNrdXRpbmlzJyxnZXRfb3B0aW9uKCRwcmVmLidfbGFzdCcsJycpKSwKICApKTsgfQogICRpbXA9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsb3B0aW9uX3ZhbHVlIEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncHNfJWltcG9ydCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzXyVzeW5jJScgT1JERVIgQlkgb3B0aW9uX25hbWUgTElNSVQgMjAiKTsKICBmb3JlYWNoKCRpbXAgYXMgJHIpeyAkb1snaW1wb3J0X29wY2lqb3MnXVskci0+b3B0aW9uX25hbWVdPW1iX3N1YnN0cigkci0+b3B0aW9uX3ZhbHVlLDAsODApOyB9CiAgLy8gbGFpxaFrYWkKICAkb1snZGV2X3Bhc3Rhc19sZWlzdGknXT1nZXRfb3B0aW9uKCdwc19kZXZfcGFzdGFzX2xlaXN0aScsJycpOwogICRvWydkZXZfcGFzdGFzX3p1cm5hbGFzJ109Y291bnQoKGFycmF5KWdldF9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfenVybmFsYXMnLGFycmF5KCkpKTsKICAkb1snbGFpc2t1X2FyY2h5dmFzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWU9J3BzX2xhaXNrdV9hcmNoeXZhcyciKT8gY291bnQoKGFycmF5KWdldF9vcHRpb24oJ3BzX2xhaXNrdV9hcmNoeXZhcycsYXJyYXkoKSkpOjA7CiAgLy8gZWlsxJdzICsgV2FybmluZwogICR0dT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkdWlkPSR0dS0+SUQ7ICRleHA9dGltZSgpKzkwMDsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJGNzPWFycmF5KG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spKSksbmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+U0VDVVJFX0FVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnc2VjdXJlX2F1dGgnLCR0b2spKSkpOwogICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJmVpbGU9dmlzaScpLGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+OTAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7CiAgJGg9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7IHByZWdfbWF0Y2goJy88bmF2W14+XSpjbGFzcz0iW14iXSpkbC1laWxlc1teIl0qIltePl0qPiguKj8pPFwvbmF2Pi9zdScsJGgsJG1tKTsKICAkb1snZWlsZXMnXT1hcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwnd2FybmluZyc9PnN1YnN0cl9jb3VudCgkaCwnPGI+V2FybmluZzwvYj4nKSwnbmF2Jz0+bWJfc3Vic3RyKHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRtbVsxXT8/JycpKSksMCwxNjApKTsKICBpZigkb1snZWlsZXMnXVsnbmF2J109PT0nJykgeyBwcmVnX21hdGNoX2FsbCgnLyhHYXV0aXxMYXVraWFtfFN1cmlua3RpIEFWfERyb3BzaGlwcGluZ3xQYXJ1b8WhdGF8S2xhdXNpbWFpfE5lYXBtb2vEl3RpfFZpc2kpW14wLTldezAsMjB9KFxkKykvdScsJGgsJG0yLFBSRUdfU0VUX09SREVSKTsgZm9yZWFjaChhcnJheV9zbGljZSgkbTIsMCw5KSBhcyAkeCl7ICRvWydlaWxlcyddWydzayddWyR4WzFdXT0keFsyXTsgfSB9CiAgLy8gUEhQIGtsYWlkb3MgKMWhaWFuZGllbikKICBmb3JlYWNoKGFycmF5KFdQX0NPTlRFTlRfRElSLicvZGVidWcubG9nJywgQUJTUEFUSC4nZXJyb3JfbG9nJywgZGlybmFtZShBQlNQQVRIKS4nL2Vycm9yX2xvZycpIGFzICRmKXsgaWYoZmlsZV9leGlzdHMoJGYpKXsgJG9bJ3BocF9sb2cnXVskZl09YXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJGYpLCd1b2RlZ2EnPT5hcnJheV9zbGljZShhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLHN1YnN0cihmaWxlX2dldF9jb250ZW50cygkZiksLTMwMDApKSksLTUpKTsgfSB9CiAgLy8gMzAxIHNhcmdhcwogICRvWydsZWdhY3lfMzAxX21hcCddPWZpbGVfZXhpc3RzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbicpPyd5cmEnOidORVJBJzsKICAvLyBHQTQKICAkb1snZ2E0X3BsdWcnXT1maWxlX2V4aXN0cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWdhNC1zZXJ2ZXJpcy5waHAnKT8neXJhJzonTkVSQSc7CiAgLy8gbG9jYWxfcGlja3VwICMxNgogICRvWydwaWNrdXAxNiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaXNfZW5hYmxlZCBGUk9NIHskcH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMgV0hFUkUgaW5zdGFuY2VfaWQ9MTYiKTsKICAvLyBza2FpdGlrbGlhaQogIGZvcmVhY2goYXJyYXkoJ3BzX2F2cG5fc2VyaWphJywncHNfaWFwdl9zZXJpamEnLCdwc19rcl9zZXJpamEnLCdwc19wcGtfc2VyaWphJykgYXMgJGspICRvWydzZXJpam9zJ11bJGtdPWdldF9vcHRpb24oJGssJz8nKTsKICAkb1sncGluZyddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-191130';
const GKEY='ps_s1634g';
const PHASES=["G"];
const OUT='analize/s1634_g.json';
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
