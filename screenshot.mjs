process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0biBha2NpanUgcHVzbGFwaXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTcwNG4nXSk/JF9HRVRbJ3BzX3MxNzA0biddOicnKTsgaWYoJGYhPT0nMScmJiRmIT09JzInKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTcwNG4nLCdmYXplJz0+JGYpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgIGlmKCRmPT09JzEnKXsKICAgICAgLy8gcHVzbGFwaXMKICAgICAgJHBnPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X3N0YXR1cyBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncGFnZScgQU5EIChwb3N0X25hbWUgTElLRSAnJWFrY2lqJScgT1IgcG9zdF90aXRsZSBMSUtFICclYWtjaWolJykiLEFSUkFZX0EpOwogICAgICAkb1sncHVzbGFwaWFpJ109JHBnOwogICAgICBmb3JlYWNoKCRwZyBhcyAkcil7ICRjPWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLCRyWydJRCddKTsgJG9bJ3R1cmlueXMnXVskclsnSUQnXV09bWJfc3Vic3RyKCRjLDAsNjAwKTsgfQogICAgICAvLyBrYXMgZ2VuZXJ1b2phICJSb2R5dGkgYWtjaWphcyIKICAgICAgJHJhZD1hcnJheSgpOwogICAgICBmb3JlYWNoKGFycmF5KFdQTVVfUExVR0lOX0RJUixXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJyxnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSkgYXMgJGRpcil7CiAgICAgICAgaWYoIWlzX2RpcigkZGlyKSkgY29udGludWU7CiAgICAgICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICAgICAgZm9yZWFjaCgkaXQgYXMgJGZpbGUpeyBpZigkZmlsZS0+Z2V0RXh0ZW5zaW9uKCkhPT0ncGhwJykgY29udGludWU7ICRjPUBmaWxlX2dldF9jb250ZW50cygkZmlsZS0+Z2V0UGF0aG5hbWUoKSk7IGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICAgICAgaWYoc3RycG9zKCRjLCdSb2R5dGkgYWtjaWphcycpIT09ZmFsc2V8fHN0cnBvcygkYywnR3JhdcW+aWthbXMnKSE9PWZhbHNlKSAkcmFkW109c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJGZpbGUtPmdldFBhdGhuYW1lKCkpOyB9CiAgICAgIH0KICAgICAgJG9bJ2ZhaWxhaSddPSRyYWQ7CiAgICAgIGZvcmVhY2goJHJhZCBhcyAkZm4peyAkYz1maWxlX2dldF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4kZm4pOyAkb1sna29kYXMnXVskZm5dPWFycmF5KCdkeWRpcyc9PnN0cmxlbigkYyksJ21kNSc9Pm1kNSgkYykpOyAkaT1zdHJwb3MoJGMsJ1JvZHl0aSBha2NpamFzJyk7ICRvWydnYWJhbGFzJ11bJGZuXT1zdWJzdHIoJGMsbWF4KDAsJGktNjAwMCksOTAwMCk7IH0KICAgIH0gZWxzZSB7CiAgICAgIC8vIGtpZWsgYWtjaWp1IGlzIHRpa3J1anUKICAgICAgJGlkcz13Y19nZXRfcHJvZHVjdF9pZHNfb25fc2FsZSgpOyAkb1snd2Nfb25fc2FsZV9uJ109Y291bnQoJGlkcyk7CiAgICAgICRzdD1hcnJheSgpOyAkdmlzPWFycmF5KCk7ICRzdG9jaz1hcnJheSgpOyAkdGlwPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcikgY29udGludWU7CiAgICAgICAgJHM9JHByLT5nZXRfc3RhdHVzKCk7ICRzdFskc109KCRzdFskc10/PzApKzE7CiAgICAgICAgJHY9JHByLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCk7ICR2aXNbJHZdPSgkdmlzWyR2XT8/MCkrMTsKICAgICAgICAkc3M9JHByLT5nZXRfc3RvY2tfc3RhdHVzKCk7ICRzdG9ja1skc3NdPSgkc3RvY2tbJHNzXT8/MCkrMTsKICAgICAgICAkdD0kcHItPmdldF90eXBlKCk7ICR0aXBbJHRdPSgkdGlwWyR0XT8/MCkrMTsgfQogICAgICAkb1sncGFnYWxfc3RhdHVzJ109JHN0OyAkb1sncGFnYWxfbWF0b211bWEnXT0kdmlzOyAkb1sncGFnYWxfbGlrdXRpJ109JHN0b2NrOyAkb1sncGFnYWxfdGlwYSddPSR0aXA7CiAgICAgIC8vIHB1Ymxpc2ggKyB2aXNpYmxlICsgaW5zdG9jawogICAgICAkb2s9MDsgJHBhc2w9YXJyYXkoKTsKICAgICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHByfHwkcHItPmdldF9zdGF0dXMoKSE9PSdwdWJsaXNoJykgY29udGludWU7CiAgICAgICAgaWYoJHByLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCk9PT0ndmlzaWJsZScmJiRwci0+aXNfaW5fc3RvY2soKSkgJG9rKys7IGVsc2UgJHBhc2xbXT1hcnJheSgnaWQnPT4kaWQsJ3Bhdic9Pm1iX3N1YnN0cigkcHItPmdldF9uYW1lKCksMCw1MCksJ3Zpcyc9PiRwci0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLCdzdG9jayc9PiRwci0+Z2V0X3N0b2NrX3N0YXR1cygpLCdkcm9wc2hpcF9wYXNsZXB0YSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHJvcHNoaXBfcGFzbGVwdGEnLHRydWUpLCdzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpKTsgfQogICAgICAkb1sncHVibGlzaF92aXNpYmxlX2luc3RvY2snXT0kb2s7ICRvWyduZXJvZG9tdV9uJ109Y291bnQoJHBhc2wpOyAkb1snbmVyb2RvbW9zJ109YXJyYXlfc2xpY2UoJHBhc2wsMCw2MCk7CiAgICAgIC8vIHRpZXNpb2dpYWkgaXMgREI6IF9zYWxlX3ByaWNlIG51c3RhdHl0YQogICAgICAkb1snZGJfc2FsZV9wcmljZV9wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHBtLnBvc3RfaWQpIEZST00geyR3cGRiLT5wb3N0bWV0YX0gcG0gSk9JTiB7JHdwZGItPnBvc3RzfSBwbyBPTiBwby5JRD1wbS5wb3N0X2lkIFdIRVJFIHBtLm1ldGFfa2V5PSdfc2FsZV9wcmljZScgQU5EIHBtLm1ldGFfdmFsdWU8PicnIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvLnBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIik7CiAgICAgICRvWydsb29rdXBfb25zYWxlJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX3Byb2R1Y3RfbWV0YV9sb29rdXAgV0hFUkUgb25zYWxlPTEiKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-094820';
const GKEY='ps_s1704n';
const PHASES=["1"];
const OUT='analize/s1704_n1.json';
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
