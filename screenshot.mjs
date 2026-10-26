process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwYyB2aXNhcyBrYXRhbG9nYXMga29tcGFrdGnFoWthaSDigJQga2FpbmEsIHNhdmlrYWluYSwgRUFOLCBwYXJkYXZpbWFpIDM2NSBkLiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODAwYyddKT8kX0dFVFsncHNfczE4MDBjJ106JycpOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxODAwYycpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRmMT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcmVrZV9pZCBwaWQsIFNVTShraWVraXMpIHZudCwgU1VNKGthaW5hX2N0KSBjdCBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgZGllbmE+PURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCAzNjUgREFZKSBBTkQgKHRlc3RpbmlzIElTIE5VTEwgT1IgdGVzdGluaXM9MCkgR1JPVVAgQlkgcHJla2VfaWQiLEFSUkFZX0EpOwogICAgJGYyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByZWtlX2lkIHBpZCwgU1VNKGtpZWtpcykgdm50LCBTVU0oa2FpbmFfY3QpIGN0IEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgZGllbmE+PURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCAzNjUgREFZKSBHUk9VUCBCWSBwcmVrZV9pZCIsQVJSQVlfQSk7CiAgICAkUz1hcnJheSgpOyBmb3JlYWNoKGFycmF5X21lcmdlKCRmMSwkZjIpIGFzICRyKXsgJGs9KGludCkkclsncGlkJ107IGlmKCFpc3NldCgkU1ska10pKSAkU1ska109YXJyYXkoMCwwKTsgJFNbJGtdWzBdKz0oaW50KSRyWyd2bnQnXTsgJFNbJGtdWzFdKz0oaW50KSRyWydjdCddOyB9CiAgICAkc3JjPWFycmF5KCk7IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCxzb3VyY2UsY29zdF9uZXQsc3RvY2tfcXR5IEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgaXNfYWN0aXZlPTEgQU5EIGNvc3RfbmV0PjAiLEFSUkFZX0EpIGFzICRzKXsgJHNyY1soaW50KSRzWydwcm9kdWN0X2lkJ11dW109JHNbJ3NvdXJjZSddLic6Jy4kc1snY29zdF9uZXQnXS4nOicuJHNbJ3N0b2NrX3F0eSddOyB9CiAgICAkY2F0cz1hcnJheSgpOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRyLm9iamVjdF9pZCBvaWQsIHQubmFtZSBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIixBUlJBWV9BKSBhcyAkYyl7ICRjYXRzWyhpbnQpJGNbJ29pZCddXVtdPSRjWyduYW1lJ107IH0KICAgICRicj1hcnJheSgpOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRyLm9iamVjdF9pZCBvaWQsIHQubmFtZSBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCciLEFSUkFZX0EpIGFzICRjKXsgJGJyWyhpbnQpJGNbJ29pZCddXT0kY1snbmFtZSddOyB9CiAgICAkbWV0YT1hcnJheSgpOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsbWV0YV9rZXksbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBJTiAoJ19wcmljZScsJ19jb3N0X3ByaWNlJywnX3N0b2NrJywnX3N0b2NrX3N0YXR1cycsJ19za3UnLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJ19lYW4nLCdfcHNfc2FuZGVsaXMnLCdfd2VpZ2h0JykgQU5EIG1ldGFfdmFsdWU8PicnIixBUlJBWV9BKSBhcyAkbSl7ICRtZXRhWyhpbnQpJG1bJ3Bvc3RfaWQnXV1bJG1bJ21ldGFfa2V5J11dPSRtWydtZXRhX3ZhbHVlJ107IH0KICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9zdGF0dXMscG9zdF9wYXJlbnQscG9zdF90eXBlIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSIsQVJSQVlfQSk7CiAgICAkb3V0PWFycmF5KCk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJGlkPShpbnQpJHJbJ0lEJ107ICRtPSRtZXRhWyRpZF0/P2FycmF5KCk7ICRwaWQ9JHJbJ3Bvc3RfdHlwZSddPT09J3Byb2R1Y3RfdmFyaWF0aW9uJz8oaW50KSRyWydwb3N0X3BhcmVudCddOiRpZDsKICAgICAgJG91dFtdPWFycmF5KCRpZCwkclsncG9zdF90eXBlJ109PT0ncHJvZHVjdF92YXJpYXRpb24nPyRwaWQ6MCwkclsncG9zdF9zdGF0dXMnXVswXSwkbVsnX3NrdSddPz8nJywkbVsnX2dsb2JhbF91bmlxdWVfaWQnXT8/KCRtWydfZWFuJ10/PycnKSwkclsncG9zdF90aXRsZSddLCRtWydfcHJpY2UnXT8/JycsJG1bJ19jb3N0X3ByaWNlJ10/PycnLGltcGxvZGUoJzsnLCRzcmNbJGlkXT8/YXJyYXkoKSksJG1bJ19zdG9jayddPz8nJywkbVsnX3N0b2NrX3N0YXR1cyddPz8nJywkbVsnX3BzX3NhbmRlbGlzJ10/PycnLGltcGxvZGUoJ3wnLCRjYXRzWyRwaWRdPz9hcnJheSgpKSwkYnJbJHBpZF0/PycnLCRTWyRpZF1bMF0/PzAsJFNbJGlkXVsxXT8/MCwkbVsnX3dlaWdodCddPz8nJyk7CiAgICB9CiAgICAkb1snaCddPWFycmF5KCdpZCcsJ3BhcmVudCcsJ3N0Jywnc2t1JywnZWFuJywncGF2Jywna2FpbmEnLCdjb3N0X21ldGEnLCdzcmMnLCdzdG9jaycsJ3N0b2NrX3N0YXR1cycsJ3NhbmQnLCdrYXQnLCdicmFuZCcsJ3ZudDM2NScsJ2N0MzY1Jywnc3ZvcmlzJyk7CiAgICAkb1snbiddPWNvdW50KCRvdXQpOyAkb1sncHJla2VzJ109JG91dDsKICAgIGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkb1snc3FsX2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-103643';
const GKEY='ps_s1800c';
const PHASES=["GO"];
const OUT='analize/s1800_c.json';
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
