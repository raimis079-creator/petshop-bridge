process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgYSDigJQgcmVhZC1vbmx5OiBMUCBFeHByZXNzIGxpcGR1a28ga2xhaWRhIOKAlCB1xb5zYWt5bcWzIG1ldGEsIHBsdWdpbm8gYsWrc2VuYSwgxb51cm5hbGFzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4MGEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4MCBhJyk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG8uaWQgRlJPTSB7JHB9d2Nfb3JkZXJzIG8gSk9JTiB7JHB9d2Nfb3JkZXJfc3RhdHMgcyBPTiBzLm9yZGVyX2lkPW8uaWQgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1vbi1ob2xkJywnd2MtcGVuZGluZycpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA4JyBPUkRFUiBCWSBvLmlkIERFU0MgTElNSVQgNjAiKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHc9d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkdykgY29udGludWU7ICRtPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KCdfd29vX2xpdGh1YW5pYXBvc3Rfc2hpcHBpbmdfc3RhdHVzX3ZhbHVlJywnX3dvb19saXRodWFuaWFwb3N0X3BhcmNlbF9jcmVhdGVfZXJyb3InLCdfd29vX2xpdGh1YW5pYXBvc3RfbHBleHByZXNzX3Rlcm1pbmFsX2lkJywnX3dvb19saXRodWFuaWFwb3N0X2xwZXhwcmVzc190ZXJtaW5hbCcsJ193b29fbGl0aHVhbmlhcG9zdF9zaGlwcGluZ19pdGVtX2lkJywnX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUnLCdfd29vX2xpdGh1YW5pYXBvc3Rfc2hpcHBpbmdfbWV0aG9kJykgYXMgJGspeyAkdj0kdy0+Z2V0X21ldGEoJGspOyBpZigkdiE9PScnKSAkbVska109aXNfc2NhbGFyKCR2KT9zdWJzdHIoKHN0cmluZykkdiwwLDMwMCk6anNvbl9lbmNvZGUoJHYsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IH0KICAgICRzbT1hcnJheSgpOyBmb3JlYWNoKCR3LT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpIGFzICRzKXsgJHNtW109JHMtPmdldF9tZXRob2RfaWQoKS4nOicuJHMtPmdldF9pbnN0YW5jZV9pZCgpLicgJy4kcy0+Z2V0X25hbWUoKTsgfQogICAgaWYoJG18fHByZWdfZ3JlcCgnL2xpdGh1YW5pYXxscGV4cHJlc3N8bHBfL2knLCRzbSkpICRvWydscF91enMnXVtdPWFycmF5KCdpZCc9PiRpZCwnbnInPT4kdy0+Z2V0X29yZGVyX251bWJlcigpLCdzdCc9PiR3LT5nZXRfc3RhdHVzKCksJ3NtJz0+JHNtLCdtZXRhJz0+JG0sJ25vdGVzJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gc3Vic3RyKCRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcuJG4tPmNvbnRlbnQsMCwyMDApO30sYXJyYXlfc2xpY2Uod2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT42KSksMCw2KSkpOwogIH0KICBmb3JlYWNoKGdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJykgYXMgJHBsKSBpZihzdHJpcG9zKCRwbCwnbGl0aHVhbmlhJykhPT1mYWxzZXx8c3RyaXBvcygkcGwsJ2xwJykhPT1mYWxzZXx8c3RyaXBvcygkcGwsJ3Bvc3QnKSE9PWZhbHNlKSAkb1sncGx1Z2lucyddW109JHBsLicgJy4oZ2V0X3BsdWdpbl9kYXRhKFdQX1BMVUdJTl9ESVIuJy8nLiRwbCxmYWxzZSxmYWxzZSlbJ1ZlcnNpb24nXT8/JycpOwogICRvcHRzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lIG4sTEVOR1RIKG9wdGlvbl92YWx1ZSkgbCBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVsaXRodWFuaWFwb3N0JScgT1Igb3B0aW9uX25hbWUgTElLRSAnd29vY29tbWVyY2VfbHBleHByZXNzJSciLEFSUkFZX0EpOyAkb1snb3B0cyddPSRvcHRzOwogIGZvcmVhY2goJG9wdHMgYXMgJHgpeyBpZihwcmVnX21hdGNoKCcvc2V0dGluZ3N8YXBpfHRva2VufGF1dGgvaScsJHhbJ24nXSkpeyAkdj1nZXRfb3B0aW9uKCR4WyduJ10pOyBpZihpc19hcnJheSgkdikpeyBmb3JlYWNoKCR2IGFzICRrPT4kdnYpeyBpZihwcmVnX21hdGNoKCcvcGFzc3xzZWNyZXR8dG9rZW58a2V5L2knLCRrKSkgJHZbJGtdPSR2dj8nW3lyYSAnLnN0cmxlbigoc3RyaW5nKSR2dikuJ10nOidbVFVTQ0lBXSc7IGVsc2VpZihpc19zdHJpbmcoJHZ2KSkgJHZbJGtdPXN1YnN0cigkdnYsMCw4MCk7fSAkb1snb3B0XycuJHhbJ24nXV09JHY7IH0gfSB9CiAgJGxvZ3M9Z2xvYihXQ19MT0dfRElSLicqbGl0aHVhbmlhKicpOyAkb1snbG9nX2ZpbGVzJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KSRsb2dzKTsgcnNvcnQoJGxvZ3MpOyBpZigkbG9ncyl7ICRsPWZpbGUoJGxvZ3NbMF0pOyAkb1snbG9nX3RhaWwnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHMpe3JldHVybiBzdWJzdHIoJHMsMCwzMDApO30sYXJyYXlfc2xpY2UoJGwsLTI1KSk7IH0KICAkb1sndGVybWluYWxhaV9uJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13b29fbGl0aHVhbmlhcG9zdF91bmlzZW5kX3Rlcm1pbmFscyIpOyAkb1snZSddPSR3cGRiLT5sYXN0X2Vycm9yOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-065505';
const GKEY='ps_s1680a';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_a.json';
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
