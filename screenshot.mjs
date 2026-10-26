process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwYiBza2FuxJdzdMWzIGthdGVnb3Jpam9zIOKAlCBrYWlub3MsIHNhdmlrYWlub3MsIHBhcmRhdmltYWkgMzY1IGQuIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDBiJ10pPyRfR0VUWydwc19zMTgwMGInXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE4MDBiJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJG9bJ2NvbHNfaXN0J109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIiwwKTsKICAgICRzbHVncz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHQudGVybV9pZCBGUk9NIHskcH10ZXJtcyB0IEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgKHQubmFtZSBMSUtFICdTa2FuJScgT1IgdC5uYW1lIExJS0UgJ0tyYW10JScpIik7CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgdHIub2JqZWN0X2lkIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH1wb3N0cyBwIE9OIHAuSUQ9dHIub2JqZWN0X2lkIFdIRVJFIHRyLnRlcm1fdGF4b25vbXlfaWQgSU4gKFNFTEVDVCB0ZXJtX3RheG9ub215X2lkIEZST00geyRwfXRlcm1fdGF4b25vbXkgV0hFUkUgdGVybV9pZCBJTiAoIi5pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJHNsdWdzKSkuIikpIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykiKTsKICAgIC8vIHBhcmRhdmltYWkgMzY1IGQuIChXQyBmYWt0YWkgKyBlU2hvcHJlbnQgaXN0b3JpamEpCiAgICAkZjE9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJla2VfaWQgcGlkLCBTVU0oa2lla2lzKSB2bnQsIFNVTShrYWluYV9jdCkgY3QsIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdXpzIEZST00geyRwfXBzX2Zha3RfZWlsdXRlcyBXSEVSRSBkaWVuYT49REFURV9TVUIoQ1VSREFURSgpLElOVEVSVkFMIDM2NSBEQVkpIEFORCAodGVzdGluaXMgSVMgTlVMTCBPUiB0ZXN0aW5pcz0wKSBHUk9VUCBCWSBwcmVrZV9pZCIsQVJSQVlfQSk7CiAgICAkZjI9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJla2VfaWQgcGlkLCBTVU0oa2lla2lzKSB2bnQsIFNVTShrYWluYV9jdCkgY3QsIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdXpzIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgZGllbmE+PURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCAzNjUgREFZKSBHUk9VUCBCWSBwcmVrZV9pZCIsQVJSQVlfQSk7CiAgICAkUz1hcnJheSgpOyBmb3JlYWNoKGFycmF5X21lcmdlKCRmMSwkZjIpIGFzICRyKXsgJGs9KGludCkkclsncGlkJ107IGlmKCFpc3NldCgkU1ska10pKSAkU1ska109YXJyYXkoMCwwLDApOyAkU1ska11bMF0rPShpbnQpJHJbJ3ZudCddOyAkU1ska11bMV0rPShpbnQpJHJbJ2N0J107ICRTWyRrXVsyXSs9KGludCkkclsndXpzJ107IH0KICAgIGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkb1snc3FsX2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgJG91dD1hcnJheSgpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRpZD0oaW50KSRpZDsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOwogICAgICAkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOyAkYnI9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwogICAgICAkc3JjPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxjb3N0X25ldCxzdG9ja19xdHksaXNfYWN0aXZlIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSxBUlJBWV9BKTsKICAgICAgJGNvc3Q9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsgJHNhPScnOyBmb3JlYWNoKCRzcmMgYXMgJHMpeyBpZigkc1snaXNfYWN0aXZlJ10mJiRzWydjb3N0X25ldCddIT09bnVsbCYmJHNbJ2Nvc3RfbmV0J10+MCl7ICRzYS49JHNbJ3NvdXJjZSddLic6Jy4kc1snY29zdF9uZXQnXS4nOicuJHNbJ3N0b2NrX3F0eSddLic7JzsgfSB9CiAgICAgICRvdXRbXT1hcnJheSgkaWQsJHByLT5nZXRfc3RhdHVzKCksJHByLT5nZXRfdHlwZSgpLCRwci0+Z2V0X3NrdSgpLCRwci0+Z2V0X25hbWUoKSwkcHItPmdldF9wcmljZSgpLCRjb3N0LCRzYSwkcHItPmdldF9zdG9ja19xdWFudGl0eSgpLCRwci0+aXNfaW5fc3RvY2soKT8xOjAsZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksaW1wbG9kZSgnfCcsaXNfYXJyYXkoJGNhdHMpPyRjYXRzOmFycmF5KCkpLGltcGxvZGUoJywnLGlzX2FycmF5KCRicik/JGJyOmFycmF5KCkpLCRTWyRpZF0/P2FycmF5KDAsMCwwKSwkcHItPmdldF93ZWlnaHQoKSk7CiAgICB9CiAgICAkb1snaCddPWFycmF5KCdpZCcsJ3N0JywndGlwYXMnLCdza3UnLCdwYXYnLCdrYWluYScsJ2Nvc3RfbWV0YScsJ3NyYycsJ3N0b2NrJywnaW5zdG9jaycsJ3NhbmQnLCdrYXQnLCdicmFuZCcsJ3BhcmQzNjVbdm50LGN0LHV6c10nLCdzdm9yaXMnKTsKICAgICRvWyduJ109Y291bnQoJG91dCk7ICRvWydwcmVrZXMnXT0kb3V0OwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-102916';
const GKEY='ps_s1800b';
const PHASES=["GO"];
const OUT='analize/s1800_b.json';
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
