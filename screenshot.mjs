process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg5aiBwYWt1b3RlcyA1MCBnIGtpbG1lICsgcHJvdmlkZXIgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzg5aiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3ODlqJ107CiAgJGN1dD1mdW5jdGlvbigkZmlsZSwkYSwkYil7ICRscz1maWxlKCRmaWxlKTsgJG89W107IGZvcigkaT1tYXgoMSwkYSk7JGk8PW1pbihjb3VudCgkbHMpLCRiKTskaSsrKSAkb1tdPSRpLic6ICcucnRyaW0obWJfc3Vic3RyKCRsc1skaS0xXSwwLDIzMCkpOyByZXR1cm4gJG87IH07CiAgdHJ5ewogICAgJHJbJ2NhbGNfODAnXT0kY3V0KFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcHJvZHVjdC1jYWxjLnBocCcsODAsMTAwKTsKICAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0ZlZWRpbmdfUGFja2FnZV9Qcm92aWRlcicpOyAkbT0kcmMtPmdldE1ldGhvZCgnZm9yX3Byb2R1Y3QnKTsgJHJbJ3Byb3ZpZGVyX2ZhaWxhcyddPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHJjLT5nZXRGaWxlTmFtZSgpKTsgJHJbJ3Byb3ZpZGVyJ109JGN1dCgkcmMtPmdldEZpbGVOYW1lKCksJG0tPmdldFN0YXJ0TGluZSgpLCRtLT5nZXRFbmRMaW5lKCkpOwogICAgJHJbJ2Zvcl8zNjkxOCddPVBldHNob3BfRmVlZGluZ19QYWNrYWdlX1Byb3ZpZGVyOjpmb3JfcHJvZHVjdCgzNjkxOCk7ICRyWydmb3JfMTUxNzgnXT1QZXRzaG9wX0ZlZWRpbmdfUGFja2FnZV9Qcm92aWRlcjo6Zm9yX3Byb2R1Y3QoMTUxNzgpOwogICAgJGc9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1nYXZpbWFzLnBocCc7ICRoPVtdOyBmb3JlYWNoKGZpbGUoJGcpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9wYWt1b3R8cGFfcGFrdW90ZXN8X3dlaWdodHxzdm9yL2l1JywkbCkpICRoW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwyMzApKTsgfSAkclsnZ2F2aW1hc19ncmVwJ109YXJyYXlfc2xpY2UoJGgsMCw0MCk7CiAgICAkclsnZHlkemlhaV9hdXRvX2xvZyddPWFycmF5X3NsaWNlKChhcnJheSlnZXRfb3B0aW9uKCdwc19keWR6aWFpX2F1dG9fbG9nJyxbXSksLTYpOwogICAgJHJbJ3Rlcm1pbmFzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCB0LnRlcm1faWQsdC5uYW1lLHR0LmNvdW50IEZST00geyRQfXRlcm1zIHQgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZCBBTkQgdHQudGF4b25vbXk9J3BhX3Bha3VvdGVzX2R5ZGlzJyBXSEVSRSB0Lm5hbWU9JzUwIGcnIixBUlJBWV9BKTsKICAgIC8vIGtpZWsgemFpc2x1L2Frc2VzdWFydSB0dXJpIHBha3VvdGVzIGR5ZGkgZyBpciByb2R5dHUgc2thaWNpdW9rbGUKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCB0ci5vYmplY3RfaWQgRlJPTSB7JFB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncGFfcGFrdW90ZXNfZHlkaXMnIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD10ci5vYmplY3RfaWQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCciKTsKICAgICRyYzI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUHJvZHVjdF9DYWxjJywnY29udGV4dCcpOyAkcmMyLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkbmU9W107CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOyAkYz0kcmMyLT5pbnZva2UobnVsbCwkcHIpOyBpZighJGMpIGNvbnRpbnVlOyAkaz13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKTsgJGtzPWltcGxvZGUoJywnLCRrKTsgaWYoIXByZWdfbWF0Y2goJy9tYWlzdHxrb25zZXJ2fHBhc2FyfHNhdXNhcy91Jywka3MpKSAkbmVbXT0kaWQuJyB8ICcubWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJGlkKSwwLDUwKS4nIHwgJy4ka3M7IH0KICAgICRyWydzdV9wYWt1b3RlX3B1Ymxpa3VvdHUnXT1jb3VudCgkaWRzKTsgJHJbJ3NrYWljaXVva2xlX25lX21haXN0dWknXT0kbmU7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-111201';
const GKEY='ps_s1789j';
const PHASES=["1"];
const OUT='analize/s1789p_j.json';
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
