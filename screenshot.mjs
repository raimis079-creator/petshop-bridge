process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3bSAyIG5hdWpvcyBrYWNpdSBkZXplcyAoanVvZHJhc2NpYWkpIOKAlCAxIGRyeSDCtyAyIGt1cnRpIMK3IDkgdHJpbnRpIHN1a3VydGFzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwN20nXSkpIHJldHVybjsgJEY9KHN0cmluZykkX0dFVFsncHNfczE4MDdtJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgwN20nLCdmJz0+JEZdOwogICRERVpFUz1bCiAgICAnbWFpc2VsaWFpJz0+WydwYXYnPT4nS29uc2VydsWzIGTEl8W+xJcga2F0ZWkg4oCUIG1hacWhZWxpYWkgaXIgcGHFoXRldGFpIDg1IGcnLCd0cnVtcGFzJz0+J0pvc2lDYXQgODUgZycsJ2FwcmFzYXMnPT4nSm9zaUNhdCA4NSBnIG1hacWhZWxpYWkgcGFkYcW+ZSBpciDFoXZlbG7Fq3MgcGHFoXRldGFpIOKAlCBtYcW+b3MgcG9yY2lqb3MsIMWhZcWhaSBza29uaWFpIGtpZWt2aWVub3MgcsWrxaFpZXMuIFN1cmlua2l0ZSBzYXZvIGthdGVpIG51byAxMiB2bnQuJywncHJla2VzJz0+WzI2MTIzLDI2MTI1LDI2MTI5LDM0MjI2LDM0MjI0LDI2MTI3LDI2MTQxLDI2MTQzLDI2MTM1LDI2MTM5LDI2MTQ1LDI2MTM3XSwnbWluJz0+MTIsJ2RvdmFub3MnPT5bMTkwMjcsMjE1NjcsMjA0MzddLCdyaWJhJz0+MjBdLAogICAgJ2pvc2VyYSc9PlsncGF2Jz0+J0tvbnNlcnbFsyBkxJfFvsSXIGthdGVpIOKAlCBKb3NlcmEnLCd0cnVtcGFzJz0+J0pvc2VyYScsJ2FwcmFzYXMnPT4nSm9zZXJhIGJlZ3LFq2TFvmlhaSBrb25zZXJ2YWkgMjAwIGcsIGZpbMSXIDcwIGcgaXIgcGHFoXRldGFpIDg1IGcg4oCUIHZpZW5hcyBnYW1pbnRvamFzLCBkdnlsaWthIHNrb25pxbMgc3VhdWd1c2lvbXMga2F0xJdtcy4nLCdwcmVrZXMnPT5bMjEzMjksMjEzMjUsMjEzMjcsMjEzMzUsMjEzMzMsMjA0MTAsMjA0MjEsMjA0MTYsMjA0MTMsMjA0MTgsMjA0MjQsMjA0MzJdLCdtaW4nPT42LCdkb3Zhbm9zJz0+WzIwNDM3LDE5MDI3LDIxNTY3XSwncmliYSc9PjMwXSwKICBdOwogICRzYW5kPWZ1bmN0aW9uKCRwaWQpeyByZXR1cm4gc3RydG91cHBlcigoc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSk/OidBVic7IH07CiAgdHJ5ewogICAgZm9yZWFjaCgkREVaRVMgYXMgJGs9PiRkKXsgJGtsPVtdOyAkcz1bXTsgZm9yZWFjaCgkZFsncHJla2VzJ10gYXMgJHBpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOyBpZighJHApeyRrbFtdPSIkcGlkIG7El3JhIjtjb250aW51ZTt9IGlmKCEkcC0+aXNfaW5fc3RvY2soKSkgJGtsW109IiRwaWQgYmUgbGlrdcSNaW8iOyBpZigkcC0+Z2V0X3N0YXR1cygpIT09J3B1Ymxpc2gnKSAka2xbXT0iJHBpZCBuZSBwdWJsaXNoIjsgJHNbJHNhbmQoJHBpZCldPTE7IH0gaWYoY291bnQoJHMpPjEpICRrbFtdPSdrZWxpIHNhbmTEl2xpYWkgJy5pbXBsb2RlKCcrJyxhcnJheV9rZXlzKCRzKSk7CiAgICAgIGZvcmVhY2goJGRbJ2RvdmFub3MnXSBhcyAkZyl7ICRncD13Y19nZXRfcHJvZHVjdCgkZyk7IGlmKCEkZ3B8fCEkZ3AtPmlzX2luX3N0b2NrKCkpICRrbFtdPSJkb3ZhbmEgJGciOyBlbHNlaWYoJHNhbmQoJGcpIT09a2V5KCRzKSkgJGtsW109ImRvdmFuYSAkZyBraXRvIHNhbmTEl2xpbyI7IH0KICAgICAgJHJbJ3BhdGlrcmEnXVska109WydwcmVraXUnPT5jb3VudCgkZFsncHJla2VzJ10pLCdzYW5kZWxpcyc9PmFycmF5X2tleXMoJHMpLCdrbGFpZG9zJz0+JGtsXTsgfQogICAgJGphdT1nZXRfb3B0aW9uKCdwc19zMTgwN19uYXVqb3NfZGV6ZXMnKTsgJHJbJ2phdV9zdWt1cnRhJ109JGphdTsKICAgIGlmKCRGPT09JzInKXsgaWYoaXNfYXJyYXkoJGphdSkmJiRqYXUpIHRocm93IG5ldyBFeGNlcHRpb24oJ2phdSBzdWt1cnRhOiAnLmpzb25fZW5jb2RlKCRqYXUpKTsgZm9yZWFjaCgkclsncGF0aWtyYSddIGFzICR4KXsgaWYoJHhbJ2tsYWlkb3MnXSkgdGhyb3cgbmV3IEV4Y2VwdGlvbigna2xhaWRvcycpOyB9CiAgICAgICRzdWt1cnRhPVtdOwogICAgICBmb3JlYWNoKCRERVpFUyBhcyAkaz0+JGQpeyAkcmVzPVBldHNob3BfTGF1a2FpOjppc3NhdWdvdGkoWydwYXYnPT4kZFsncGF2J10sJ3ByZWtlcyc9PiRkWydwcmVrZXMnXSwncGFrb3Bvcyc9PltdLCd6b2Rpcyc9PidkZXplJywnc2VpbWEnPT4nS29uc2VydmFpIGthdMSXbXMnLCdrYXRlZ29yaWpvcyc9Pls3OSw2ODIsNjc5XSwnYXByYXNhcyc9PiRkWydhcHJhc2FzJ10sJ21pbic9PiRkWydtaW4nXV0pOwogICAgICAgIGlmKGlzX3dwX2Vycm9yKCRyZXMpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCRrLic6ICcuJHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKSk7ICRsaWQ9aXNfYXJyYXkoJHJlcykmJmlzc2V0KCRyZXNbJ2lkJ10pPyhpbnQpJHJlc1snaWQnXTooaXNfYXJyYXkoJHJlcyk/KGludClyZXNldCgkcmVzKTooaW50KSRyZXMpOyAkclsncmVzXycuJGtdPWlzX2FycmF5KCRyZXMpP2FycmF5X2tleXMoJHJlcyk6JHJlczsKICAgICAgICBpZighJGxpZCl7ICRxPWdldF9wYWdlX2J5X3RpdGxlKCRkWydwYXYnXSxPQkpFQ1QsJ3Byb2R1Y3QnKTsgJGxpZD0kcT8oaW50KSRxLT5JRDowOyB9IGlmKCEkbGlkKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCRrLic6IGxpZCBuZXJhc3RhcycpOwogICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGxpZCwnX3BzX2xhdWthc19ncnVwZScsJ2tvbnNfa2F0ZXMnKTsgdXBkYXRlX3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzX3RydW1wYXMnLCRkWyd0cnVtcGFzJ10pOyB1cGRhdGVfcG9zdF9tZXRhKCRsaWQsJ19wc19sYXVrYXNfZHlkaXMnLCcnKTsgdXBkYXRlX3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzX2RvdmFub3MnLHdwX2pzb25fZW5jb2RlKCRkWydkb3Zhbm9zJ10pKTsgdXBkYXRlX3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzX2RvdmFub3NfcmliYScsKGZsb2F0KSRkWydyaWJhJ10pOwogICAgICAgIHdwX3VwZGF0ZV9wb3N0KFsnSUQnPT4kbGlkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCddKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkbGlkKTsgJHN1a3VydGFbJGtdPSRsaWQ7IH0KICAgICAgdXBkYXRlX29wdGlvbigncHNfczE4MDdfbmF1am9zX2RlemVzJywkc3VrdXJ0YSxmYWxzZSk7ICRyWydzdWt1cnRhJ109JHN1a3VydGE7CiAgICAgIGZvcmVhY2goJHN1a3VydGEgYXMgJGs9PiRsaWQpeyAkclsncG8nXVska109WydzdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoJGxpZCksJ2tpZHMnPT5jb3VudChQZXRzaG9wX0xhdWthaTo6a3JlcHN5cygkbGlkKSksJ2Rvdic9PmdldF9wb3N0X21ldGEoJGxpZCwnX3BzX2xhdWthc19kb3Zhbm9zJyx0cnVlKSwncmliYSc9PmdldF9wb3N0X21ldGEoJGxpZCwnX3BzX2xhdWthc19kb3Zhbm9zX3JpYmEnLHRydWUpLCdzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzX3NhbmRlbGlzJyx0cnVlKSwnbWluJz0+Z2V0X3Bvc3RfbWV0YSgkbGlkLCdfbW5tX21pbl9jb250YWluZXJfc2l6ZScsdHJ1ZSksJ3VybCc9PmdldF9wZXJtYWxpbmsoJGxpZCldOyB9CiAgICB9CiAgICBpZigkRj09PSc5Jyl7IGlmKGlzX2FycmF5KCRqYXUpKXsgZm9yZWFjaCgkamF1IGFzICRrPT4kbGlkKXsgd3BfZGVsZXRlX3Bvc3QoJGxpZCx0cnVlKTsgJHdwZGItPmRlbGV0ZSgkUC4nd2NfbW5tX2NoaWxkX2l0ZW1zJyxbJ2NvbnRhaW5lcl9pZCc9PiRsaWRdLFsnJWQnXSk7ICRyWydpc3RyaW50YSddW109JGxpZDsgfSBkZWxldGVfb3B0aW9uKCdwc19zMTgwN19uYXVqb3NfZGV6ZXMnKTsgfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwxKTsK';
const VER='dep-094555';
const GKEY='ps_s1807m';
const PHASES=["2"];
const OUT='analize/s1807_m2.json';
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
