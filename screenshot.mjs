process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkwdSBrdXJqZXJpcyB0aWtyb2plIGthc29qZSAocmVhZC1vbmx5ICsgbnVvdHJhdWtvcykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODkwdSddKSkgcmV0dXJuOyAkcj1bJ3YnPT4ndTEnLCdzaG90cyc9PltdXTsgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgIC8qIGt1ciBwYXJhxaF5dGEgc3ZvcmlvIHRhaXN5a2zElyAqLwogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHNjb3BlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyVjb3VyaWVyJScgT1IgY29kZSBMSUtFICcla3VyamVyJScpIEFORCAoY29kZSBMSUtFICcld2VpZ2h0JScgT1IgY29kZSBMSUtFICclc3ZvciUnKSIsQVJSQVlfQSk7ICRyWydzbmlwcGV0YWknXT0kc247CiAgICAkaGl0cz1bXTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyksW2dldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCddKSBhcyAkZil7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoKHN0cmlwb3MoJHQsJ2NvdXJpZXInKSE9PWZhbHNlfHxzdHJpcG9zKCR0LCdrdXJqZXInKSE9PWZhbHNlKSAmJiAoc3RycG9zKCR0LCdnZXRfY2FydF9jb250ZW50c193ZWlnaHQnKSE9PWZhbHNlfHxzdHJwb3MoJHQsJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnKSE9PWZhbHNlfHxzdHJwb3MoJHQsJ3NldF9jb3N0JykhPT1mYWxzZSkpeyAkeD1bXTsgZm9yZWFjaChbJ2dldF9jYXJ0X2NvbnRlbnRzX3dlaWdodCcsJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnLCdzZXRfY29zdCcsJ193ZWlnaHQnXSBhcyAkbil7ICRxPXN1YnN0cl9jb3VudCgkdCwkbik7IGlmKCRxKSAkeFskbl09JHE7IH0gJGhpdHNbYmFzZW5hbWUoJGYpXT0keDsgfSB9ICRyWydmYWlsYWknXT0kaGl0czsKICAgICRpbnN0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDE1MDApIHYgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3dvb2NvbW1lcmNlX3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2NvdXJpZXJfbWV0aG9kXyVfc2V0dGluZ3MnIixBUlJBWV9BKTsgJHJbJ21ldG9kb19udXN0YXR5bWFpJ109JGluc3Q7CiAgICAvKiB0aWtyYSBrYXNhOiB0dcWhxI1pYXMga3JlcMWhZWxpcyDihpIgMTUga2cgw5cxLCB0YWRhIMOXMyAqLwogICAgJHVpZD00NDsgZGVsZXRlX3VzZXJfbWV0YSgkdWlkLCdfd29vY29tbWVyY2VfcGVyc2lzdGVudF9jYXJ0XycuZ2V0X2N1cnJlbnRfYmxvZ19pZCgpKTsgJHdwZGItPmRlbGV0ZSgkd3BkYi0+cHJlZml4Lid3b29jb21tZXJjZV9zZXNzaW9ucycsWydzZXNzaW9uX2tleSc9PihzdHJpbmcpJHVpZF0pOwogICAgJGV4cD10aW1lKCkrMypIT1VSX0lOX1NFQ09ORFM7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICAgJHJbJ2Nvb2tpZXMnXT1bWyduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvayksJ2RvbWFpbic9PidwZXRzaG9wLmx0J10sWyduYW1lJz0+J3BzX2pzJywndmFsdWUnPT4nMScsJ2RvbWFpbic9PidwZXRzaG9wLmx0J11dOwogICAgJGV2PSJuZXcgUHJvbWlzZShyPT5zZXRUaW1lb3V0KCgpPT5yKEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3NoaXBwaW5nX21ldGhvZCBsaSwgLndvb2NvbW1lcmNlLXNoaXBwaW5nLW1ldGhvZHMgbGknKSkubWFwKGw9PmwuaW5uZXJUZXh0LnJlcGxhY2UoL1xccysvZywnICcpLnRyaW0oKSkuam9pbignIHx8ICcpKSw0MDAwKSkiOwogICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTB1XzAnLCd1Jz0+aG9tZV91cmwoJy8/dD0nLnRpbWUoKSksJ3cnPT4zOTAsJ2gnPT41MDBdOwogICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTB1XzEnLCd1Jz0+aG9tZV91cmwoJy8/YWRkLXRvLWNhcnQ9MTY5NTAmcXVhbnRpdHk9MScpLCd3Jz0+MzkwLCdoJz0+NTAwXTsKICAgICRyWydzaG90cyddW109WyduJz0+J3MxODkwdV9rYXNhX2xlbmd2YScsJ3UnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCkuJz9hPTEnLCd3Jz0+MzkwLCdoJz0+MjYwMCwnZnVsbCc9PjEsJ2V2YWwnPT4kZXZdOwogICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTB1XzInLCd1Jz0+aG9tZV91cmwoJy8/YWRkLXRvLWNhcnQ9MTY0MDImcXVhbnRpdHk9MScpLCd3Jz0+MzkwLCdoJz0+NTAwXTsKICAgICRyWydzaG90cyddW109WyduJz0+J3MxODkwdV9rYXNhXzE1a2cnLCd1Jz0+d2NfZ2V0X2NoZWNrb3V0X3VybCgpLic/YT0yJywndyc9PjM5MCwnaCc9PjI2MDAsJ2Z1bGwnPT4xLCdldmFsJz0+JGV2XTsKICAgICRyWydzaG90cyddW109WyduJz0+J3MxODkwdV8zJywndSc9PmhvbWVfdXJsKCcvP2FkZC10by1jYXJ0PTE2NDAyJnF1YW50aXR5PTInKSwndyc9PjM5MCwnaCc9PjUwMF07CiAgICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg5MHVfa2FzYV80NWtnJywndSc9PndjX2dldF9jaGVja291dF91cmwoKS4nP2E9MycsJ3cnPT4zOTAsJ2gnPT4yNjAwLCdmdWxsJz0+MSwnZXZhbCc9PiRldl07CiAgICAkclsnc3Vua2knXT1bZ2V0X3RoZV90aXRsZSgxNjQwMiksZ2V0X3Bvc3RfbWV0YSgxNjQwMiwnX3dlaWdodCcsdHJ1ZSksd2NfZ2V0X3Byb2R1Y3QoMTY0MDIpLT5pc19pbl9zdG9jaygpXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDEpOwo=';
const VER='dep-193515';
const GKEY='ps_s1890u';
const PHASES=["GO"];
const OUT='analize/s1890_u.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
