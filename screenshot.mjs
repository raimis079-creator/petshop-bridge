process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTkgcnVuIHIzIOKAlCBSRUNPTiBDICh0aWsgc2thaXR5bWFzKTogc2l1bnR1LWxhaXNrYWkgYHV6YmFpZ2ltb19zYXJnYXNgICjCpzE4LjMsIGBfcHNfdXpiYWlndGlfYmVfc2l1bnR1YCksIFdDIGxhacWha8WzIGLFq3Nlbm9zLCBkZXNrIGBsYXBhaWAgdmVpa3NtbyBzxIVseWdvcywgYHN1cmlua3RhX3p5bWVgLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19yMyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE5IHIzJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgJG1ldGg9ZnVuY3Rpb24oJGNscywkbSwkbWF4PTUwKXsgdHJ5eyAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgkY2xzLCRtKTsgJEw9ZmlsZSgkci0+Z2V0RmlsZU5hbWUoKSk7ICRuPW1pbigkbWF4LCRyLT5nZXRFbmRMaW5lKCktJHItPmdldFN0YXJ0TGluZSgpKzEpOyByZXR1cm4gYXJyYXkoJ2YnPT5iYXNlbmFtZSgkci0+Z2V0RmlsZU5hbWUoKSksJ251byc9PiRyLT5nZXRTdGFydExpbmUoKSwna29kYXMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIocnRyaW0oJHgpLDAsMjMwKTt9LGFycmF5X3NsaWNlKCRMLCRyLT5nZXRTdGFydExpbmUoKS0xLCRuKSkpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICRlLT5nZXRNZXNzYWdlKCk7IH0gfTsKICAkZ3JlcD1mdW5jdGlvbigkZiwkcmUsJGN0eD0wLCRsaW09MzAsJHc9MjAwKXsgJG91dD1hcnJheSgpOyBpZighZmlsZV9leGlzdHMoJGYpKSByZXR1cm4gYXJyYXkoJ07EllJBJyk7ICRMPWZpbGUoJGYpOyBmb3JlYWNoKCRMIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJHJlLCRsKSl7IGZvcigkaj1tYXgoMCwkaS0kY3R4KTskajw9bWluKGNvdW50KCRMKS0xLCRpKyRjdHgpOyRqKyspeyAkb3V0W109KCRqKzEpLic6ICcubWJfc3Vic3RyKHJ0cmltKCRMWyRqXSksMCwkdyk7IH0gaWYoJGN0eCkgJG91dFtdPSctLSc7IGlmKGNvdW50KCRvdXQpPiRsaW0qKCRjdHgqMisxKSkgYnJlYWs7IH0gfSByZXR1cm4gJG91dDsgfTsKICB0cnl7CiAgJG11PVdQTVVfUExVR0lOX0RJUjsKICBmb3JlYWNoKGFycmF5KCdQZXRzaG9wX1NpdW50b3MnLCdQZXRzaG9wX1NpdW50dV9MYWlza2FpJywnUGV0c2hvcF9TaXVudHVfUmVnaXN0cmFzJykgYXMgJGMpeyBpZihjbGFzc19leGlzdHMoJGMpJiZtZXRob2RfZXhpc3RzKCRjLCd1emJhaWdpbW9fc2FyZ2FzJykpeyAkb1snc2FyZ2FzJ109JG1ldGgoJGMsJ3V6YmFpZ2ltb19zYXJnYXMnLDQwKTsgJG9bJ3NhcmdvX2tsYXNlJ109JGM7IGJyZWFrOyB9IH0KICBpZihlbXB0eSgkb1snc2FyZ2FzJ10pKXsgJG9bJ3NhcmdhcyddPSRncmVwKCRtdS4nL3BldHNob3Atc2l1bnR1LWxhaXNrYWkucGhwJywnL2Z1bmN0aW9uIHV6YmFpZ2ltb19zYXJnYXMvJywyMCwxLDIzMCk7IH0KICAkZW09V0MoKS0+bWFpbGVyKCktPmdldF9lbWFpbHMoKTsgZm9yZWFjaChhcnJheSgnV0NfRW1haWxfQ3VzdG9tZXJfQ29tcGxldGVkX09yZGVyJywnV0NfRW1haWxfQ3VzdG9tZXJfUHJvY2Vzc2luZ19PcmRlcicsJ1dDX0VtYWlsX0N1c3RvbWVyX09uX0hvbGRfT3JkZXInLCdXQ19FbWFpbF9OZXdfT3JkZXInKSBhcyAkayl7ICRvWyd3Y19sYWlza2FpJ11bJGtdPWlzc2V0KCRlbVska10pP2FycmF5KCdvbic9PiRlbVska10tPmlzX2VuYWJsZWQoKSwnc3ViamVjdCc9PiRlbVska10tPmdldF9zdWJqZWN0KCkpOic/JzsgfQogICRvWydkZXNrX2xhcGFpJ109JGdyZXAoJG11LicvcGV0c2hvcC1kZXNrLnBocCcsJy9cJ2xhcGFpXCcvJywxLDEyLDIwMCk7CiAgJG9bJ2Rlc2tfdmVpa3NtYXNfYXBtb2tldGEnXT0kZ3JlcCgkbXUuJy9wZXRzaG9wLWRlc2sucGhwJywnL1wnYXBtb2tldGFcJ3xwYXltZW50X2NvbXBsZXRlXCh8c2V0X2RhdGVfcGFpZC8nLDEsMTIsMjAwKTsKICAkb1snZGxfc3VyaW5rdGFfenltZSddPSRtZXRoKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywnc3VyaW5rdGFfenltZScsMzApOwogICRvWydkbF9zaXVudG9zX2xhaXNrYXNfaGVhZCddPSRtZXRoKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywnc2l1bnRvc19sYWlza2FzJywxNCk7CiAgJG9bJ3RlbXBfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-215444';
const GKEY='ps_r3';
const PHASES=["R"];
const OUT='analize/s1619_r3.json';
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
