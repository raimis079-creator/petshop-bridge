process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTQgYyDigJQg4oCeS2Vpc3RpIHByaW1pbmltxIUiIG51b3JvZGEgcmVmaWxsIGxhacWha2U6IGt1ciB2ZWRhIChmZWVkYmFja191cmwpLCBrYXMgasSFIGdlbmVydW9qYSwga8SFIHJvZG8uIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2OTRjJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoKTsgJHA9JHdwZGItPnByZWZpeDsKICAkdHBsPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wcy1zYWJsb25haS9yZWZpbGwtcGFrYXJ0b3RpLnBocCc7ICRzcmM9ZmlsZV9leGlzdHMoJHRwbCk/ZmlsZV9nZXRfY29udGVudHMoJHRwbCk6Jyc7CiAgcHJlZ19tYXRjaF9hbGwoJy8uezAsMTYwfShmZWVkYmFja191cmx8S2Vpc3RpIHByaW1pbmltfGtlaXN0aV91cmx8cGF0aWtzbGludGkpLnswLDIwMH0vdScsJHNyYywkbSk7ICRvWydzYWJsb25hcyddPWFycmF5X3NsaWNlKCRtWzBdLDAsNik7CiAgLy8ga2FzIGdlbmVydW9qYSBmZWVkYmFja191cmwg4oCUIG11LXBsdWdpbnMgaXIgY29yZQogICRoaXRzPWFycmF5KCk7IGZvcmVhY2ggKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zLyoucGhwJykgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmIChzdHJwb3MoJHMsJ2ZlZWRiYWNrX3VybCcpIT09ZmFsc2UpeyBwcmVnX21hdGNoX2FsbCgnLy57MCwxMjB9ZmVlZGJhY2tfdXJsLnswLDE2MH0vJywkcywkbW0pOyAkaGl0c1tiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRtbVswXSwwLDQpO30gfQogIGZvcmVhY2ggKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZiAoc3RycG9zKCRzLCdmZWVkYmFja191cmwnKSE9PWZhbHNlKXsgcHJlZ19tYXRjaF9hbGwoJy8uezAsMTIwfWZlZWRiYWNrX3VybC57MCwxNjB9LycsJHMsJG1tKTsgJGhpdHNbJ2NvcmUvJy5iYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRtbVswXSwwLDQpO30gfQogICRvWydmZWVkYmFja191cmxfa29kZSddPSRoaXRzOwogIC8vIHNuaXBwZXQnYWkKICAkb1snc25pcHBldHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVmZWVkYmFja191cmwlJyBPUiBjb2RlIExJS0UgJyVwc19mZWVkYmFjayUnIE9SIG5hbWUgTElLRSAnJVMzMjMlJyBPUiBuYW1lIExJS0UgJyVrYWxpYnIlJyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgLy8gcGFza3V0aW5pcyBpxaFzacWzc3RhcyAvIHN1cGxhbnVvdGFzIHJlZmlsbF9kdWUgam9iIHBheWxvYWQKICAkb1snam9icyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGZsb3dfa2V5LHN0YXR1cyxzY2hlZHVsZWRfYXQsc2VudF9hdCxMRUZUKHBheWxvYWRfanNvbiw5MDApIHBheWxvYWQgRlJPTSB7JHB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93X2tleT0ncmVmaWxsX2R1ZScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAvLyByYXN0aSBrZWxpxIUgacWhIHBheWxvYWQgaXIgZ2F1dGkgcHVzbGFwxK8ga2FpcCBzdmXEjWlhcwogICR1cmw9bnVsbDsgZm9yZWFjaCAoKGFycmF5KSRvWydqb2JzJ10gYXMgJGopeyAkcGw9anNvbl9kZWNvZGUoJGpbJ3BheWxvYWQnXT8/JycsdHJ1ZSk7IGlmIChpc19hcnJheSgkcGwpKXsgYXJyYXlfd2Fsa19yZWN1cnNpdmUoJHBsLGZ1bmN0aW9uKCR2LCRrKXVzZSgmJHVybCl7IGlmKCEkdXJsICYmIGlzX3N0cmluZygkdikgJiYgc3RyaXBvcygkdiwnaHR0cCcpPT09MCAmJiAoc3RyaXBvcygkdiwnZmVlZGJhY2snKSE9PWZhbHNlfHxzdHJpcG9zKCR2LCdwcmltaW4nKSE9PWZhbHNlfHxzdHJpcG9zKCR2LCdrYWxpYnInKSE9PWZhbHNlKSkgJHVybD0kdjsgfSk7IH0gaWYoJHVybCkgYnJlYWs7IH0KICBpZiAoISR1cmwgJiYgJG9bJ3NhYmxvbmFzJ10peyBpZiAocHJlZ19tYXRjaCgnL2h0dHBzPzpcL1wvW15cc1wnIl0rLycsaW1wbG9kZSgnICcsJG9bJ3NhYmxvbmFzJ10pLCRtdSkpICR1cmw9JG11WzBdOyB9CiAgJG9bJ3VybCddPSR1cmw7CiAgaWYgKCR1cmwpeyAkcj13cF9yZW1vdGVfZ2V0KCR1cmwsYXJyYXkoJ3RpbWVvdXQnPT4yMCwncmVkaXJlY3Rpb24nPT4zKSk7IGlmIChpc193cF9lcnJvcigkcikpICRvWydwdXNsYXBpc19lcnInXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgZWxzZSB7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgJG9bJ3B1c2xhcGlzX2tvZGFzJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOyAkb1sncHVzbGFwaXNfdXJsX2dhbHV0aW5pcyddPSRyWydodHRwX3Jlc3BvbnNlJ10tPmdldF9yZXNwb25zZV9vYmplY3QoKS0+dXJsPz9udWxsOyAkdD13cF9zdHJpcF9hbGxfdGFncyhwcmVnX3JlcGxhY2UoJyM8KHNjcmlwdHxzdHlsZSlbXj5dKj4uKj88L1wxPiNzaScsJycsJGIpKTsgJHQ9cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR0KTsgJHBvcz1zdHJpcG9zKCR0LCdwcmltaW4nKTsgJG9bJ3B1c2xhcGlzX3Rla3N0YXMnXT1tYl9zdWJzdHIoJHQsbWF4KDAsKCRwb3M/OjApLTMwMCksMTUwMCk7IHByZWdfbWF0Y2goJy88dGl0bGU+KC4qPyk8XC90aXRsZT4vc2knLCRiLCRtdCk7ICRvWyd0aXRsZSddPSRtdFsxXT8/bnVsbDsgcHJlZ19tYXRjaF9hbGwoJy88KD86aW5wdXR8c2VsZWN0fGJ1dHRvbilbXj5dezAsMjAwfT4vaScsJGIsJG1mKTsgJG9bJ2Zvcm1vc19sYXVrYWknXT1hcnJheV9zbGljZSgkbWZbMF0sMCwyNSk7IH0gfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-194828';
const GKEY='ps_s1694c';
const PHASES=["1"];
const OUT='analize/s1694_c.json';
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
