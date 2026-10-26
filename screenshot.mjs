process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwYSBuYXTFq3JhbMWrcyBrcmFtdHVrYWkg4oCUIGFzb3J0aW1lbnRhcyBpciBzYXZpa2Fpbm9zIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDBhJ10pPyRfR0VUWydwc19zMTgwMGEnXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE4MDBhJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgLy8gMS4ga2F0ZWdvcmlqb3Mgc3Ugc2thbsSXc3RhaXMva3JhbXR1a2FpcwogICAgJG9bJ2thdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LnBhcmVudCx0dC5jb3VudCBGUk9NIHskcH10ZXJtcyB0IEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgKHQubmFtZSBMSUtFICclc2thbiUnIE9SIHQubmFtZSBMSUtFICcla3JhbXQlJyBPUiB0Lm5hbWUgTElLRSAnJWthdWwlJyBPUiB0Lm5hbWUgTElLRSAnJXJhZyUnKSBPUkRFUiBCWSB0dC5wYXJlbnQsdC5uYW1lIixBUlJBWV9BKTsKICAgIC8vIDIuIGxlbnRlbGnFsyBzdHVscGVsaWFpCiAgICBmb3JlYWNoKGFycmF5KCdwc19zb3VyY2VzJywncHNfZmFrdF9laWx1dGVzJywncHNfcGFydGlqb3MnKSBhcyAkdCl7ICRvWydjb2xzXycuJHRdPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9eyR0fSIsMCk7IH0KICAgIC8vIDMuIHByZWvEl3MgcGFnYWwgcmFrdGHFvm9kxb5pdXMKICAgICRrdz1hcnJheSgncmFnICcsJ3JhZ2FzJywncmFnYWknLCdlbG5pbycsJ2VsbmnFsycsJ2tyYW10Jywnc8WrcicsJ3N1cmlzJywnc8WrcmlzJywna2F2YW1lZCcsJ2FseXZtZWQnLCdidWl2b2wnLCdoaW1hbGFqJywndHJhY2jEl2onLCd0cmFjaGVqJywnamF1xI1pbycsJ2phdXRpZW4nLCdvZG9zJywnb2RhICcsJ2thdWxhcycsJ2thdWxhaScsJ2thbm9wYScsJ2thbm9wb3MnLCdhdXN5cycsJ2F1c2lzJywncGl6emxlJywnYnVsbHknLCdzYXVzZ3lzbCcsJ3BsYXXEjScsJ3RlbmRvbicsJ2FudGxlcicsJ3lhaycsJ8SXcml1aycpOwogICAgJHc9YXJyYXkoKTsgZm9yZWFjaCgka3cgYXMgJGspeyAkd1tdPSR3cGRiLT5wcmVwYXJlKCJwLnBvc3RfdGl0bGUgTElLRSAlcyIsJyUnLiR3cGRiLT5lc2NfbGlrZSgkaykuJyUnKTsgfQogICAgJHNxbD0iU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLHAucG9zdF9zdGF0dXMgRlJPTSB7JHB9cG9zdHMgcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykgQU5EICgiLmltcGxvZGUoJyBPUiAnLCR3KS4iKSBPUkRFUiBCWSBwLnBvc3RfdGl0bGUgTElNSVQgNDAwIjsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOwogICAgJG91dD1hcnJheSgpOwogICAgJGhhc19mZT1pbl9hcnJheSgncHJvZHVjdF9pZCcsJG9bJ2NvbHNfcHNfZmFrdF9laWx1dGVzJ10/P2FycmF5KCksdHJ1ZSk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsKICAgICAgJGlkPShpbnQpJHJbJ0lEJ107ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHByKSBjb250aW51ZTsKICAgICAgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKICAgICAgJGJyPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKICAgICAgJHg9YXJyYXkoJ2lkJz0+JGlkLCdzdCc9PiRyWydwb3N0X3N0YXR1cyddLCd0aXBhcyc9PiRwci0+Z2V0X3R5cGUoKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksJ3Bhdic9PiRyWydwb3N0X3RpdGxlJ10sCiAgICAgICAgJ2thaW5hJz0+JHByLT5nZXRfcHJpY2UoKSwncmVnJz0+JHByLT5nZXRfcmVndWxhcl9wcmljZSgpLCdjb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSwKICAgICAgICAnc3RvY2snPT4kcHItPmdldF9zdG9ja19xdWFudGl0eSgpLCdpbnN0b2NrJz0+JHByLT5pc19pbl9zdG9jaygpPzE6MCwnc2FuZCc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLAogICAgICAgICdrYXQnPT5pbXBsb2RlKCcgPiAnLGlzX2FycmF5KCRjYXRzKT8kY2F0czphcnJheSgpKSwnYnJhbmQnPT5pbXBsb2RlKCcsJyxpc19hcnJheSgkYnIpPyRicjphcnJheSgpKSwnZWFuJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKT86Z2V0X3Bvc3RfbWV0YSgkaWQsJ19lYW4nLHRydWUpKTsKICAgICAgJHhbJ3NyYyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkaWQpLEFSUkFZX0EpOwogICAgICBpZigkaGFzX2ZlKXsgJHhbJ3BhcmQzNjUnXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKERJU1RJTkNUIG9yZGVyX2lkKSB1enMsIFNVTShraWVraXMpIHZudCBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgc3VrdXJ0YT49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMzY1IERBWSkiLCRpZCksQVJSQVlfQSk7IH0KICAgICAgJHhbJ2lzdDM2NSddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgU1VNKGtpZWtpcykgRlJPTSB7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBzdWt1cnRhPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzNjUgREFZKSIsJGlkKSk7CiAgICAgICRvdXRbXT0keDsKICAgIH0KICAgICRvWyduJ109Y291bnQoJG91dCk7ICRvWydwcmVrZXMnXT0kb3V0OwogICAgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRvWydzcWxfZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-102715';
const GKEY='ps_s1800a';
const PHASES=["GO"];
const OUT='analize/s1800_a.json';
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
