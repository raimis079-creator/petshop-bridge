process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTEgYiDigJQgcmVjb246IHBhdsSXbGF2xJkgZW1haWwgam9icywgcGV0c2hvcC14bWwucGhwIDMzMOKAkzM1MCwgcGhwX2Vycm9yLmxvZyBzdWTEl3Rpcy4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5MWInXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRvWydqb2JzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIHN0YXR1cywgdXNlcl9pZCwgb3JkZXJfaWQsIHNjaGVkdWxlZF9hdCwgY3JlYXRlZF9hdCwgTEVGVChDT0FMRVNDRShza2lwX3JlYXNvbiwnJyksNjApIHNyLCBMRUZUKENPQUxFU0NFKGxhc3RfZXJyb3IsJycpLDEyMCkgZXJyIEZST00geyRwfXBzX2VtYWlsX2pvYnMgV0hFUkUgc3RhdHVzIElOICgncGVuZGluZycsJ3F1ZXVlZCcsJ3NjaGVkdWxlZCcpIEFORCBzY2hlZHVsZWRfYXQ8Tk9XKCktSU5URVJWQUwgMiBIT1VSIE9SREVSIEJZIHNjaGVkdWxlZF9hdCIsQVJSQVlfQSk7CiAgJG9bJ2pvYnNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfZW1haWxfam9icyIpOwogICRvWydqb2JzX3BlbmRpbmdfdmlzbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiwgTUlOKHNjaGVkdWxlZF9hdCkgbWluX3MsIE1BWChzY2hlZHVsZWRfYXQpIG1heF9zIEZST00geyRwfXBzX2VtYWlsX2pvYnMgV0hFUkUgc3RhdHVzIElOICgncGVuZGluZycsJ3F1ZXVlZCcsJ3NjaGVkdWxlZCcpIEdST1VQIEJZIHN0YXR1cyIsQVJSQVlfQSk7CiAgJG9bJ2Rpc3BhdGNoX2Nyb24nXT13cF9uZXh0X3NjaGVkdWxlZCgncHNfZW1haWxfZGlzcGF0Y2hfY3JvbicpOyAkb1snZGlzcGF0Y2hfY3Jvbl9sdCddPSRvWydkaXNwYXRjaF9jcm9uJ10/ZGF0ZSgnbS1kIEg6aScsJG9bJ2Rpc3BhdGNoX2Nyb24nXSszKjM2MDApOm51bGw7CiAgJGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7ICRvWyd4bWxfbWQ1J109bWQ1X2ZpbGUoJGYpOyAkb1sneG1sX2R5ZGlzJ109ZmlsZXNpemUoJGYpOwogICRsPWZpbGUoJGYpOyAkb1sneG1sXzMzMF8zNTAnXT1hcnJheSgpOyBmb3IoJGk9MzI5OyRpPDM1MDskaSsrKSBpZihpc3NldCgkbFskaV0pKSAkb1sneG1sXzMzMF8zNTAnXVskaSsxXT1ydHJpbSgkbFskaV0pOwogICRvWyd4bWxfaGVhZGVyJ109aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRsLDAsMTUpKTsKICAkcGw9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7CiAgaWYgKGZpbGVfZXhpc3RzKCRwbCkpeyAkc3o9ZmlsZXNpemUoJHBsKTsgJGZoPWZvcGVuKCRwbCwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTIwMDAwMDApKTsgJHQ9ZnJlYWQoJGZoLDIwMDAwMDApOyBmY2xvc2UoJGZoKTsKICAgICRsaW5lcz1leHBsb2RlKCJcbiIsJHQpOyBhcnJheV9zaGlmdCgkbGluZXMpOyAkdGlwPWFycmF5KCk7ICRkaWVuPWFycmF5KCk7CiAgICBmb3JlYWNoICgkbGluZXMgYXMgJGxuKXsgaWYgKCRsbj09PScnKSBjb250aW51ZTsgaWYgKHByZWdfbWF0Y2goJy9eXFsoXGRcZC1cd3szfS1cZHs0fSkvJywkbG4sJG0pKSB7ICRkaWVuWyRtWzFdXT0oJGRpZW5bJG1bMV1dPz8wKSsxOyB9CiAgICAgICRrPXByZWdfcmVwbGFjZSgnL15cW1teXF1dK1xdXHMqLycsJycsJGxuKTsgJGs9cHJlZ19yZXBsYWNlKCcvXGQrLycsJyMnLCRrKTsgJGs9bWJfc3Vic3RyKCRrLDAsMTEwKTsgJHRpcFska109KCR0aXBbJGtdPz8wKSsxOyB9CiAgICBhcnNvcnQoJHRpcCk7ICRvWydsb2dfcGFzazJtYl90aXBhaSddPWFycmF5X3NsaWNlKCR0aXAsMCwxNSx0cnVlKTsgJG9bJ2xvZ19wYXNrMm1iX2RpZW5vcyddPSRkaWVuOyAkb1snbG9nX2R5ZGlzJ109JHN6OwogICAgJGZoPWZvcGVuKCRwbCwncicpOyAkb1snbG9nX3Bpcm1hX2VpbCddPW1iX3N1YnN0cihmZ2V0cygkZmgpLDAsMTIwKTsgZmNsb3NlKCRmaCk7IH0KICAkb1snbG9nX2Vycm9yc19pbmknXT1hcnJheSgnbG9nX2Vycm9ycyc9PmluaV9nZXQoJ2xvZ19lcnJvcnMnKSwnZXJyb3JfbG9nJz0+aW5pX2dldCgnZXJyb3JfbG9nJyksJ2Vycm9yX3JlcG9ydGluZyc9PmluaV9nZXQoJ2Vycm9yX3JlcG9ydGluZycpLCd3cF9kZWJ1Zyc9PmRlZmluZWQoJ1dQX0RFQlVHJyk/V1BfREVCVUc6bnVsbCwnd3BfZGVidWdfbG9nJz0+ZGVmaW5lZCgnV1BfREVCVUdfTE9HJyk/V1BfREVCVUdfTE9HOm51bGwpOwogICRvWydhcmNoeXZhcyddPWFycmF5X21hcCgnYmFzZW5hbWUnLChhcnJheSlnbG9iKGRpcm5hbWUoQUJTUEFUSCkuJy9sb2dzLyonKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-171650';
const GKEY='ps_s1691b';
const PHASES=["1"];
const OUT='analize/s1691_b.json';
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
