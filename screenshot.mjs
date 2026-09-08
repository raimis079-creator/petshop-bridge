process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQzbiBhamF4X3BhcnRpamEgemFsaWFzIGF0c2FrYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibiddKT8kX0dFVFsncHNfYm4nXTonJykhPT0nR08nKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2NDNuJyk7CiAgdHJ5ewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAgICBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb25ccythamF4X3BhcnRpamFccypcKC8nLCRjLCRtLFBSRUdfT0ZGU0VUX0NBUFRVUkUpKXsKICAgICAgJGk9JG1bMF1bMV07ICRibGs9c3Vic3RyKCRjLCRpLDEyMDApOwogICAgICAkb1snaGFuZGxlciddPXN1YnN0cigkYmxrLDAsOTAwKTsKICAgICAgcHJlZ19tYXRjaCgiL2NoZWNrX2FqYXhfcmVmZXJlclwoXHMqJyhbXiddKyknLyIsJGJsaywkbm0pOyAkb1snbm9uY2VfdmVpa3NtYXMnXT0kbm1bMV0/Pyc/JzsKICAgIH0gZWxzZSB7ICRvWydoYW5kbGVyJ109J05FUkFTVEEnOyB9CiAgICAvLyBzaW11bGlhY2lqYTogYWRtaW5hcyArIHRhcyBwYXRzIHByb2Nlc2FzIG5vbmNlCiAgICB3cF9zZXRfY3VycmVudF91c2VyKDEpOwogICAgJHZlaWtzbWFzPSRvWydub25jZV92ZWlrc21hcyddPz8nJzsKICAgICRfUE9TVD1hcnJheSgnYWN0aW9uJz0+J3BzX2thdF9wYXJ0aWphJywnbm9uY2UnPT53cF9jcmVhdGVfbm9uY2UoJHZlaWtzbWFzKSwKICAgICAgJ3BhcnQnPT4nMzg4MicsJ2lkJz0+JzE4NjE0JywnbGF1a2FzJz0+J3NhdmlrYWluYScsJ3JlaWtzbWUnPT4nMS41NycpOwogICAgJF9SRVFVRVNUPSRfUE9TVDsKICAgIGFkZF9maWx0ZXIoJ3dwX2RpZV9hamF4X2hhbmRsZXInLCBmdW5jdGlvbigpeyByZXR1cm4gZnVuY3Rpb24oJG1zZyl7IHRocm93IG5ldyBFeGNlcHRpb24oJ1dQX0RJRTogJy4oaXNfc3RyaW5nKCRtc2cpPyRtc2c6J3gnKSk7IH07IH0pOwogICAgb2Jfc3RhcnQoKTsKICAgICRseWdpcz1lcnJvcl9yZXBvcnRpbmcoRV9BTEwpOyBpbmlfc2V0KCdkaXNwbGF5X2Vycm9ycycsJzEnKTsKICAgIHRyeXsgZG9fYWN0aW9uKCd3cF9hamF4X3BzX2thdF9wYXJ0aWphJyk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snaXNpbXRpcyddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICAgICRyYXc9b2JfZ2V0X2NsZWFuKCk7IGVycm9yX3JlcG9ydGluZygkbHlnaXMpOwogICAgJG9bJ3phbGlhc19pbGdpcyddPXN0cmxlbigkcmF3KTsKICAgICRvWyd6YWxpYXMnXT1zdWJzdHIoJHJhdywwLDE1MDApOwogICAgJG9bJ2pzb25fb2snXT0gKGpzb25fZGVjb2RlKCRyYXcpIT09bnVsbCkgPyAxIDogMDsKICAgICRvWydqc29uX2tsYWlkYSddPWpzb25fbGFzdF9lcnJvcl9tc2coKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-190000';
const GKEY='ps_bn';
const PHASES=["GO"];
const OUT='analize/s1643_n.json';
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
