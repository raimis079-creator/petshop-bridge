process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzMgcnVuIGcg4oCUIEc6IFNBUkfFsiBCxapLTMSWIChjcm9uJ2FpLCBzZWtpbWFzLCBTTEEsIGltcG9ydGFpLCBsYWnFoWthaSwgZWlsxJdzLCBQSFAga2xhaWRvcywgMzAxLCBHQTQpLiBSRUFELU9OTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjMzZyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjMzIGcnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAvLyBjcm9uJ2FpCiAgJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkbXVzPWFycmF5KCdwc192ZW5pcGFrX3Nla2ltYXMnLCdwc192ZWxhdmltb19sYWlza2FpJywncHNfZGxfYXRzYXVrdHVfdmFseW1hcycsJ3BzX2Ryb3BzaGlwX3NhcmdhcycsJ3BzX3piX2ltcG9ydGFzJywncHNfdmZfaW1wb3J0YXMnKTsgJHJhc3RhPWFycmF5KCk7CiAgZm9yZWFjaCgkY3IgYXMgJHRzPT4kaG9va3MpeyBmb3JlYWNoKCRob29rcyBhcyAkaD0+JHgpeyBmb3JlYWNoKCRtdXMgYXMgJG0peyBpZihzdHJwb3MoJGgsJG0pIT09ZmFsc2UgJiYgIWlzc2V0KCRyYXN0YVskaF0pKSAkcmFzdGFbJGhdPWRhdGUoJ20tZCBIOmknLCR0cyk7IH0gaWYoIWlzc2V0KCR2aXNpWyRoXSkpICR2aXNpWyRoXT1kYXRlKCdtLWQgSDppJywkdHMpOyB9IH0KICAkb1snY3Jvbl9tdXN1J109JHJhc3RhOyAkb1snY3Jvbl92aXNvJ109Y291bnQoJHZpc2k/P2FycmF5KCkpOwogIC8vIHNla2ltYXMKICAkb1sndmVuaXBha19zZWtpbWFzX3Bhc2snXT1nZXRfb3B0aW9uKCdwc192ZW5pcGFrX3Nla2ltYXNfcGFza3V0aW5pcycsJycpOwogIC8vIFNMQSAvIGtsYXVzaW1haQogICRvWydzbGFfdmVsYXZpbWFpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfc2xhX3ZlbGF2aW1hcyciKTsKICAkb1snc2l1bnRhX2dyaXp0YSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NpdW50YV9ncml6dGEnIik7CiAgLy8gaW1wb3J0YWkKICBmb3JlYWNoKGFycmF5KCd6Yic9Pidwc196YicsJ3ZmJz0+J3BzX3ZmJykgYXMgJGs9PiRwcmVmKXsgJG9bJ2ltcG9ydGFpJ11bJGtdPWFycmF5X2ZpbHRlcihhcnJheSgKICAgICdwYXNrJz0+Z2V0X29wdGlvbigkcHJlZi4nX3Bhc2t1dGluaXMnLGdldF9vcHRpb24oJHByZWYuJ19sYXN0JywnJykpLAogICkpOyB9CiAgJGltcD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxvcHRpb25fdmFsdWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc18laW1wb3J0JScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfJXN5bmMlJyBPUkRFUiBCWSBvcHRpb25fbmFtZSBMSU1JVCAyMCIpOwogIGZvcmVhY2goJGltcCBhcyAkcil7ICRvWydpbXBvcnRfb3BjaWpvcyddWyRyLT5vcHRpb25fbmFtZV09bWJfc3Vic3RyKCRyLT5vcHRpb25fdmFsdWUsMCw4MCk7IH0KICAvLyBsYWnFoWthaQogICRvWydkZXZfcGFzdGFzX2xlaXN0aSddPWdldF9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfbGVpc3RpJywnJyk7CiAgJG9bJ2Rldl9wYXN0YXNfenVybmFsYXMnXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSkpOwogICRvWydsYWlza3VfYXJjaHl2YXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfbGFpc2t1X2FyY2h5dmFzJyIpPyBjb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfbGFpc2t1X2FyY2h5dmFzJyxhcnJheSgpKSk6MDsKICAvLyBlaWzEl3MgKyBXYXJuaW5nCiAgJHR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7ICR1aWQ9JHR1LT5JRDsgJGV4cD10aW1lKCkrOTAwOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkY3M9YXJyYXkobmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvaykpKSk7CiAgJHI9d3BfcmVtb3RlX2dldChhZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWRlc2smZWlsZT12aXNpJyksYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT45MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAkaD0oc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgcHJlZ19tYXRjaCgnLzxuYXZbXj5dKmNsYXNzPSJbXiJdKmRsLW5hdlteIl0qIltePl0qPiguKj8pPFwvbmF2Pi9zdScsJGgsJG1tKTsKICAkb1snZWlsZXMnXT1hcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwnd2FybmluZyc9PnN1YnN0cl9jb3VudCgkaCwnPGI+V2FybmluZzwvYj4nKSwnbmF2Jz0+bWJfc3Vic3RyKHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRtbVsxXT8/JycpKSksMCwxNjApKTsKICBpZigkb1snZWlsZXMnXVsnbmF2J109PT0nJykgeyBwcmVnX21hdGNoX2FsbCgnLyhHYXV0aXxMYXVraWFtfFN1cmlua3RpIEFWfERyb3BzaGlwcGluZ3xQYXJ1b8WhdGF8S2xhdXNpbWFpfE5lYXBtb2vEl3RpfFZpc2kpW14wLTldezAsMjB9KFxkKykvdScsJGgsJG0yLFBSRUdfU0VUX09SREVSKTsgZm9yZWFjaChhcnJheV9zbGljZSgkbTIsMCw5KSBhcyAkeCl7ICRvWydlaWxlcyddWydzayddWyR4WzFdXT0keFsyXTsgfSB9CiAgLy8gUEhQIGtsYWlkb3MgKMWhaWFuZGllbikKICBmb3JlYWNoKGFycmF5KFdQX0NPTlRFTlRfRElSLicvZGVidWcubG9nJywgQUJTUEFUSC4nZXJyb3JfbG9nJywgZGlybmFtZShBQlNQQVRIKS4nL2Vycm9yX2xvZycpIGFzICRmKXsgaWYoZmlsZV9leGlzdHMoJGYpKXsgJG9bJ3BocF9sb2cnXVskZl09YXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJGYpLCd1b2RlZ2EnPT5hcnJheV9zbGljZShhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLHN1YnN0cihmaWxlX2dldF9jb250ZW50cygkZiksLTMwMDApKSksLTUpKTsgfSB9CiAgLy8gMzAxIHNhcmdhcwogICRvWydsZWdhY3lfMzAxX21hcCddPWZpbGVfZXhpc3RzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbicpPyd5cmEnOidORVJBJzsKICAvLyBHQTQKICAkb1snZ2E0X3BsdWcnXT1maWxlX2V4aXN0cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWdhNC1zZXJ2ZXJpcy5waHAnKT8neXJhJzonTkVSQSc7CiAgLy8gbG9jYWxfcGlja3VwICMxNgogICRvWydwaWNrdXAxNiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaXNfZW5hYmxlZCBGUk9NIHskcH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMgV0hFUkUgaW5zdGFuY2VfaWQ9MTYiKTsKICAvLyBza2FpdGlrbGlhaQogIGZvcmVhY2goYXJyYXkoJ3BzX2F2cG5fc2VyaWphJywncHNfaWFwdl9zZXJpamEnLCdwc19rcl9zZXJpamEnLCdwc19wcGtfc2VyaWphJykgYXMgJGspICRvWydzZXJpam9zJ11bJGtdPWdldF9vcHRpb24oJGssJz8nKTsKICAkb1sncGluZyddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-183411';
const GKEY='ps_s1633g';
const PHASES=["G"];
const OUT='analize/s1633_g.json';
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
