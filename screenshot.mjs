process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0ZGsgRDIyIERQIGthaW5vczogbGVpc3RpIGp1b2RyYcWhdGluxJkgWkIgYmF6aW7EmSAoMSBkcnksIDIgYXBwbHksIDkgcmVzdG9yZSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI0ZGsnXSkpIHJldHVybjsgJEY9JF9HRVRbJ3BzX3MxODI0ZGsnXTsgJHI9Wyd2Jz0+J1MxODI0ZGsnLCdGJz0+JEZdOwogICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZHAta2Fpbm9zLnBocCc7ICRiYWs9ZGlybmFtZShBQlNQQVRIKS4nL3BzLWFyY2h5dmFzL3BldHNob3AtZHAta2Fpbm9zLnBocC5iYWtfczE4MjQnOyAkYz1maWxlX2dldF9jb250ZW50cygkZik7ICRyWydtZDUnXT1tZDUoJGMpOwogICRBPSJpZiAoIFwkYmFzZS0+Z2V0X3N0YXR1cygpICE9PSAncHVibGlzaCcgKSB7IFwkclsna2xhaWRhJ10gPSAnYmF6aW5lX25lX3B1Ymxpc2gnOyByZXR1cm4gXCRyOyB9IjsKICAkQj0iaWYgKCBcJGJhc2UtPmdldF9zdGF0dXMoKSAhPT0gJ3B1Ymxpc2gnICYmICEgKCBcJGJhc2UtPmdldF9zdGF0dXMoKSA9PT0gJ2RyYWZ0JyAmJiBnZXRfcG9zdF9tZXRhKCBcJGJhc2UtPmdldF9pZCgpLCAnX3piX2Nvc3QnLCB0cnVlICkgIT09ICcnICkgKSB7IFwkclsna2xhaWRhJ10gPSAnYmF6aW5lX25lX3B1Ymxpc2gnOyByZXR1cm4gXCRyOyB9IC8vIFMxODI0IEQyMjogWkIgYmF6aW7El3MgeXJhIGp1b2RyYcWhxI1pYWkg4oCTIGxlaWTFvmlhbWEiOwogICRyWydjbnQnXT1zdWJzdHJfY291bnQoJGMsJEEpOwogIGlmKCRGPT09JzEnKXsgJEw9ZXhwbG9kZSgiXG4iLCRjKTsgJHJbJ2N0eCddPWFycmF5X3NsaWNlKCRMLDAsMzApOyAkclsnY3R4MiddPWFycmF5X3NsaWNlKCRMLDk1LDQ1KTsgfQogIGlmKCRGPT09JzInKXsgaWYoJHJbJ21kNSddIT09JzhmZTliMGM2ODlmYjFkOGI3ODRmZDFkZjVlZGYzMzdkJ3x8JHJbJ2NudCddIT09MSl7ICRyWydrbGFpZGEnXT0nZ3VhcmQnOyBnb3RvIG91dDsgfSAkbj1zdHJfcmVwbGFjZSgkQSwkQiwkYyk7IHRyeXsgdG9rZW5fZ2V0X2FsbCgkbixUT0tFTl9QQVJTRSk7IH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJHJbJ2tsYWlkYSddPSdwYXJzZSc7IGdvdG8gb3V0OyB9CiAgICBpZighZmlsZV9leGlzdHMoJGJhaykpIGZpbGVfcHV0X2NvbnRlbnRzKCRiYWssJGMpOyBmaWxlX3B1dF9jb250ZW50cygkZiwkbik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgJHJbJ21kNV9uZXcnXT1tZDVfZmlsZSgkZik7CiAgICAkaGI9W107IGZvcmVhY2goWycvJywnL2thdGVnb3JpamEva2F0ZW1zL21haXN0YXMta2F0ZW1zL2tvbnNlcnZhaS1rYXRlbXMvJ10gYXMgJHUpeyAkeD13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX2hiJyx0aW1lKCksaG9tZV91cmwoJHUpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGhiW109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyB9ICRyWydoYiddPSRoYjsKICAgIGZvcmVhY2goJGhiIGFzICRoKXsgaWYoJGg+PTUwMHx8JGg9PTApeyBmaWxlX3B1dF9jb250ZW50cygkZiwkYyk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgJHJbJ0FUU1RBVFlUQSddPTE7IH0gfSB9CiAgaWYoJEY9PT0nMycpeyBnbG9iYWwgJHdwZGI7ICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBtLnBvc3RfaWQgRlJPTSB7JHdwZGItPnByZWZpeH1wb3N0bWV0YSBtIEpPSU4geyR3cGRiLT5wb3N0c30gcCBPTiBwLklEPW0ucG9zdF9pZCBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgV0hFUkUgbS5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCciKTsgJGMyPVsnbic9PmNvdW50KCRpZHMpLCdrbGFpZGEnPT5bXSwncGFrZWlzdGEnPT5bXSwnb2snPT4wXTsgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR4PVBldHNob3BfRFBfS2Fpbm9zOjpzaW5jaHJvbml6dW90aSgoaW50KSRpZCx0cnVlLCdzMTgyNF9kcnknKTsgaWYoIWVtcHR5KCR4WydrbGFpZGEnXSkpICRjMlsna2xhaWRhJ11bJHhbJ2tsYWlkYSddXT0oJGMyWydrbGFpZGEnXVskeFsna2xhaWRhJ11dPz8wKSsxOyBlbHNlaWYoIWVtcHR5KCR4WydwYWtlaXN0YSddKSkgJGMyWydwYWtlaXN0YSddW109WyRpZCwkeFsnYnV2byddLCR4WyduYXVqYSddXTsgZWxzZSAkYzJbJ29rJ10rKzsgfSAkYzJbJ3Bha2Vpc3RhX24nXT1jb3VudCgkYzJbJ3Bha2Vpc3RhJ10pOyAkYzJbJ3Bha2Vpc3RhJ109YXJyYXlfc2xpY2UoJGMyWydwYWtlaXN0YSddLDAsMTUpOyAkclsnZHJ5J109JGMyOyB9CiAgaWYoJEY9PT0nOScpeyBpZihmaWxlX2V4aXN0cygkYmFrKSl7IGZpbGVfcHV0X2NvbnRlbnRzKCRmLGZpbGVfZ2V0X2NvbnRlbnRzKCRiYWspKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnYXRzdGF0eXRhJ109bWQ1X2ZpbGUoJGYpOyB9IH0KICBvdXQ6IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-075824';
const GKEY='ps_s1824dk';
const PHASES=["2", "3"];
const OUT='analize/s1824_dk2.json';
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
