process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGFiIOKAlCBQSFAgZXJyb3IgbG9nIEZhdGFsOyAjMTczOTcgQVY7IFRFTVAgIzU0MjQvIzU1ODQvIzU1ODk7IHBzX3Nhcmdhc19wYXN0YXM7IDEyOjU1IGxhacWha2FzIGJlIGdhdsSXam8uIFJFQUQtT05MWSAoacWhc2t5cnVzIFRFTVAgc25pcHBldMWzIHRyeW5pbcSFKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NzZhYiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc2IGFiJyk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRsb2c9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzL3BocF9lcnJvci5sb2cnOyAkb1snbG9nJ109YXJyYXkoJ3lyYSc9PmZpbGVfZXhpc3RzKCRsb2cpLCdkeWRpcyc9PmZpbGVfZXhpc3RzKCRsb2cpP2ZpbGVzaXplKCRsb2cpOjApOwogIGlmKGZpbGVfZXhpc3RzKCRsb2cpKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGxvZyxmYWxzZSxudWxsLG1heCgwLGZpbGVzaXplKCRsb2cpLTIwMDAwMCkpOyAkTD1leHBsb2RlKCJcbiIsJHMpOyAkZj1hcnJheSgpOyAkdz1hcnJheSgpOyBmb3JlYWNoKCRMIGFzICRsKXsgaWYoc3RyaXBvcygkbCwnRmF0YWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRsLCdVbmNhdWdodCcpIT09ZmFsc2UpICRmW109bWJfc3Vic3RyKCRsLDAsNDAwKTsgZWxzZWlmKHByZWdfbWF0Y2goJy9XYXJuaW5nfERlcHJlY2F0ZWR8Tm90aWNlLycsJGwpKSB7ICRrPXByZWdfcmVwbGFjZSgnL15cW1teXF1dK1xdXHMqLycsJycsbWJfc3Vic3RyKCRsLDAsMTYwKSk7ICR3WyRrXT0oJHdbJGtdPz8wKSsxOyB9IH0gJG9bJ2ZhdGFsJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRmKSwtMTIpOyBhcnNvcnQoJHcpOyAkb1snd2Fybl90b3AnXT1hcnJheV9zbGljZSgkdywwLDgsdHJ1ZSk7IH0KICAkb1snc25pcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLExFRlQoY29kZSwxNTApIGMgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQgSU4gKDU0MjQsNTU4NCw1NTg5KSIsQVJSQVlfQSk7CiAgJG9bJ3NuaXBfaXN0cmludGEnXT0kd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBpZCBJTiAoNTQyNCw1NTg0LDU1ODkpIEFORCBhY3RpdmU9MCBBTkQgbmFtZSBMSUtFICdURU1QJSciKTsKICAkcHI9d2NfZ2V0X3Byb2R1Y3QoMTczOTcpOyAkb1sncDE3Mzk3J109YXJyYXkoJ3Bhdic9PiRwcj8kcHItPmdldF9uYW1lKCk6bnVsbCwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKDE3Mzk3LCdfc3RvY2snLHRydWUpLCdvd24nPT5nZXRfcG9zdF9tZXRhKDE3Mzk3LCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKDE3Mzk3LCdfcHNfc2FuZGVsaXMnLHRydWUpLCd6Yic9PmdldF9wb3N0X21ldGEoMTczOTcsJ196Yl9xdHknLHRydWUpLCd2Zic9PmdldF9wb3N0X21ldGEoMTczOTcsJ192Zl9xdHknLHRydWUpLCdwYXJ0aWpvcyc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGdhdXRhLGtpZWtpc19nYXV0YXMsa2lla2lzX2xpa28sdGlla2VqYXMscGFzdGFiYSBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPTE3Mzk3IE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSksJ2l2eWtpYWknPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBsYXVrYXMsc2VuYSxuYXVqYSxwYXN0YWJhLExFRlQoc3VrdXJ0YSwxNikgdCBGUk9NIHskcH1wc19pdnlraWFpIFdIRVJFIHByb2R1Y3RfaWQ9MTczOTcgQU5EIGxhdWthcyBJTiAoJ19zdG9jaycsJ19vd25fc3RvY2tfcXR5JywncGFydGlqYScsJ2xpa3V0aXMnKSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpLCdzcmMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGlzX2FjdGl2ZSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9MTczOTciLEFSUkFZX0EpKTsKICAkb1snc2FyZ2FzJ109YXJyYXkoJ3Bhc3Rhcyc9PmdldF9vcHRpb24oJ3BzX3Nhcmdhc19wYXN0YXMnKSwnYWRtaW4nPT5nZXRfb3B0aW9uKCdhZG1pbl9lbWFpbCcpKTsKICAkb1snaXZ5a2lhaV9zdHVscCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfaXZ5a2lhaSIsMCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-094326';
const GKEY='ps_s1676ab';
const PHASES=["GO"];
const OUT='analize/s1676_ab.json';
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
