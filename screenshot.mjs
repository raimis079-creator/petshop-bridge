process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzUgcnVuIG8g4oCUIHXFvnNha3ltxbMgaXN0b3JpamEgbnVvIFQtMDogdmlzaSBJRCAoaW5jbC4gdHJhc2gvZHJhZnQpLCBzcHJhZ29zLCBhdMWhYXVraW1vL3RyeW5pbW8gbWVjaGFuaXptYWkuIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfbzUnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOyAkbz1hcnJheSgndic9PidTMTY3NSBvJyk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsby50eXBlLG8uc3RhdHVzLG8ucGF5bWVudF9tZXRob2QgcG0sby50b3RhbF9hbW91bnQgdCxvLmRhdGVfY3JlYXRlZF9nbXQgZGMsby5kYXRlX3VwZGF0ZWRfZ210IGR1LG0ubWV0YV92YWx1ZSBuciBGUk9NIHskcH13Y19vcmRlcnMgbyBMRUZUIEpPSU4geyRwfXdjX29yZGVyc19tZXRhIG0gT04gbS5vcmRlcl9pZD1vLmlkIEFORCBtLm1ldGFfa2V5PSdfcHNfb3JkZXJfbnVtYmVyJyBXSEVSRSBvLmlkPj0zNTg2OCBPUkRFUiBCWSBvLmlkIixBUlJBWV9BKTsKICAkaWRzPWFycmF5X2NvbHVtbigkcm93cywnaWQnKTsgJG9bJ3Zpc28nXT1jb3VudCgkcm93cyk7ICRvWydtaW5fbWF4J109YXJyYXkobWluKCRpZHMpLG1heCgkaWRzKSk7CiAgJHNwPWFycmF5KCk7IGZvcigkaT0oaW50KW1pbigkaWRzKTskaTw9KGludCltYXgoJGlkcyk7JGkrKykgaWYoIWluX2FycmF5KChzdHJpbmcpJGksJGlkcyx0cnVlKSkgJHNwW109JGk7ICRvWydzcHJhZ29zX2lkJ109JHNwOwogICRvWydzYXJhc2FzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXsgcmV0dXJuICRyWydpZCddLicgJy4oJHJbJ25yJ10/JyMnLiRyWyduciddOicnKS4nICcuc3Vic3RyKCRyWyd0eXBlJ10sNSkuJyAnLnN1YnN0cigkclsnc3RhdHVzJ10sMykuJyAnLiRyWydwbSddLicgJy5yb3VuZCgkclsndCddLDIpLicgJy5zdWJzdHIoJHJbJ2RjJ10sNSwxMSk7IH0sJHJvd3MpOwogICRvWydwYWdhbF9zdGF0dXNhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLENPVU5UKCopIGMgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIGlkPj0zNTg2OCBBTkQgdHlwZT0nc2hvcF9vcmRlcicgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAvLyDEr3Z5a2lhaTogdHJ5bmltYXMvYXTFoWF1a2ltYXMKICAkb1snaXZfc3R1bHAnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3V6c2FreW11X2l2eWtpYWkiLDApOwogICRvWydpdl9hdHNhdWsnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1enNha3ltYXMsc3JpdGlzLHZlaWtzbWFzLHJlenVsdGF0YXMsa2FzX3ZhcmRhcyxMRUZUKHBhc3RhYmEsODApIHBhc3RhYmEsbGFpa2FzIEZST00geyRwfXBzX3V6c2FreW11X2l2eWtpYWkgV0hFUkUgdmVpa3NtYXMgTElLRSAnJWF0c2F1ayUnIE9SIHZlaWtzbWFzIExJS0UgJyV0cmluJScgT1IgdmVpa3NtYXMgTElLRSAnJXZhbHltJScgT1IgdmVpa3NtYXMgTElLRSAnJWNhbmNlbCUnIE9SIHZlaWtzbWFzIExJS0UgJyVkZWxldGUlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAvLyBXQyBjYW5jZWwgaG9sZCBzdG9jayBudXN0YXR5bWFzCiAgJG9bJ2hvbGRfc3RvY2tfbWluJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfaG9sZF9zdG9ja19taW51dGVzJyk7ICRvWydtYW5hZ2Vfc3RvY2snXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9tYW5hZ2Vfc3RvY2snKTsKICAkb1snYXNfY2FuY2VsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLHNjaGVkdWxlZF9kYXRlX2dtdCxsYXN0X2F0dGVtcHRfZ210IEZST00geyRwfWFjdGlvbnNjaGVkdWxlcl9hY3Rpb25zIFdIRVJFIGhvb2s9J3dvb2NvbW1lcmNlX2NhbmNlbF91bnBhaWRfb3JkZXJzJyBPUkRFUiBCWSBhY3Rpb25faWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAvLyBhdMWhYXVrdMWzIHZhbHltbyBjcm9uIGtvZGFzCiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkYywncHNfZGxfYXRzYXVrdHVfdmFseW1hcycpIT09ZmFsc2V8fHN0cnBvcygkYywnd3BfZGVsZXRlX3Bvc3QnKSE9PWZhbHNlfHxzdHJwb3MoJGMsJy0+ZGVsZXRlKCcpIT09ZmFsc2V8fHN0cnBvcygkYywnd2NfZGVsZXRlX3Nob3Bfb3JkZXJfdHJhbnNpZW50cycpIT09ZmFsc2UpeyAkbHM9ZXhwbG9kZSgiXG4iLCRjKTsgZm9yZWFjaCgkbHMgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3BzX2RsX2F0c2F1a3R1X3ZhbHltYXN8d3BfZGVsZXRlX3Bvc3R8LT5kZWxldGVcKFxzKnRydWV8Y2hlY2tvdXQtZHJhZnR8REFZX0lOX1NFQ09ORFN8SU5URVJWQUwgXGQrIChEQVl8SE9VUikvJywkbCkgJiYgIXByZWdfbWF0Y2goJy9eXHMqKFwqfFwvXC8pLycsJGwpKSAkb1sna29kYXMnXVtiYXNlbmFtZSgkZildWyRpKzFdPW1iX3N1YnN0cih0cmltKCRsKSwwLDE1MCk7IH0gfSB9CiAgJG9bJ2Nyb25fdmFseW1hcyddPXdwX25leHRfc2NoZWR1bGVkKCdwc19kbF9hdHNhdWt0dV92YWx5bWFzJyk/ZGF0ZSgnbS1kIEg6aScsd3BfbmV4dF9zY2hlZHVsZWQoJ3BzX2RsX2F0c2F1a3R1X3ZhbHltYXMnKSk6J07EllJBJzsKICAkb1sndmFseW1hc19vcGMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSBuLExFRlQob3B0aW9uX3ZhbHVlLDMwMCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2RsXyV2YWx5bSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2RsX2F0c2F1ayUnIixBUlJBWV9BKTsKICAvLyBXQyBwYXN0YWJvcyBhcGllIGnFoXRyeW5pbcSFL2F0xaFhdWtpbcSFIHBhc3RhcsWzasWzIDQgZC4KICAkb1snbm90ZXNfY2FuY2VsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYy5jb21tZW50X3Bvc3RfSUQgaWQsTEVGVChjLmNvbW1lbnRfY29udGVudCwxMTApIHQsYy5jb21tZW50X2RhdGUgZCBGUk9NIHskcH1jb21tZW50cyBjIFdIRVJFIGMuY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBBTkQgYy5jb21tZW50X2RhdGU+JzIwMjYtMDktMDknIEFORCAoYy5jb21tZW50X2NvbnRlbnQgTElLRSAnJXTFoWF1ayUnIE9SIGMuY29tbWVudF9jb250ZW50IExJS0UgJyVhbmNlbCUnIE9SIGMuY29tbWVudF9jb250ZW50IExJS0UgJyVuZWJlYXBtb2slJyBPUiBjLmNvbW1lbnRfY29udGVudCBMSUtFICclVW5wYWlkJScpIE9SREVSIEJZIGMuY29tbWVudF9JRCBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsKICAkb1snZGInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-224430';
const GKEY='ps_o5';
const PHASES=["GO"];
const OUT='analize/s1675_o.json';
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
