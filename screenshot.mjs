process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgZSDigJQgUkVBRC1PTkxZOiBhciBmZWVkJ2FpIHJvZG8gMCBsaWt1xI1pbyBwcmVrZXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY5ZSddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjY5IGUnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRkPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLWZlZWRzLyc7IGxpYnhtbF91c2VfaW50ZXJuYWxfZXJyb3JzKHRydWUpOwogICAgJGs9c2ltcGxleG1sX2xvYWRfZmlsZSgkZC4na2Fpbm9zLnhtbCcsJ1NpbXBsZVhNTEVsZW1lbnQnLExJQlhNTF9OT0NEQVRBKTsgJHN0PWFycmF5KCk7CiAgICBmb3JlYWNoKCRrLT5wcm9kdWN0cy0+cHJvZHVjdCBhcyAkZSl7ICR2PXRyaW0oKHN0cmluZykkZS0+c3RvY2spOyAka2V5PSgoaW50KSR2PD0wKT8nMF9hcl9tYXppYXUnOic+MCc7ICRzdFska2V5XT0oJHN0WyRrZXldPz8wKSsxOyBpZighaXNzZXQoJG9bJ3N0b2NrX3B2eiddWyR2XSkgJiYgY291bnQoJG9bJ3N0b2NrX3B2eiddPz9hcnJheSgpKTw2KSAkb1snc3RvY2tfcHZ6J11bJHZdPShzdHJpbmcpJGVbJ2lkJ107IH0KICAgICRvWydrYWlub3Nfc3RvY2snXT0kc3Q7CiAgICAkcz1maWxlX2dldF9jb250ZW50cygkZC4na2FpbmEyNC54bWwnKTsgcHJlZ19tYXRjaF9hbGwoJy88c3RvY2s+XHMqKD86PCFcW0NEQVRBXFspP1xzKigtP1xkKykvJywkcywkbSk7ICR6PTA7IGZvcmVhY2goJG1bMV0gYXMgJHYpIGlmKChpbnQpJHY8PTApICR6Kys7ICRvWydrYWluYTI0J109YXJyYXkoJ3N1X3N0b2NrJz0+Y291bnQoJG1bMV0pLCdudWxpcyc9PiR6LCdwcm9kdWN0Jz0+c3Vic3RyX2NvdW50KCRzLCc8cHJvZHVjdCAnKSk7IHVuc2V0KCRzKTsKICAgICRvWyd3cF9wdWJsaXNoJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbC5zdG9ja19zdGF0dXMsIENPVU5UKCopIGMgRlJPTSB7JHB9cG9zdHMgeCBKT0lOIHskcH13Y19wcm9kdWN0X21ldGFfbG9va3VwIGwgT04gbC5wcm9kdWN0X2lkPXguSUQgV0hFUkUgeC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCB4LnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBHUk9VUCBCWSBsLnN0b2NrX3N0YXR1cyIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKGFycmF5KFdQTVVfUExVR0lOX0RJUixXUF9QTFVHSU5fRElSKSBhcyAkZGlyKXsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKCRkaXIuJy9wZXRzaG9wLWZlZWRzKi5waHAnKT86YXJyYXkoKSxnbG9iKCRkaXIuJy9wZXRzaG9wLWZlZWRzLyoucGhwJyk/OmFycmF5KCksZ2xvYigkZGlyLicvcGV0c2hvcC1mZWVkcy9pbmNsdWRlcy8qLnBocCcpPzphcnJheSgpKSBhcyAkZil7IGZvcmVhY2goZmlsZSgkZikgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3N0b2NrfF9kb19ub3RfZXhwb3J0fGZlZWRfb2ZmL2knLCRsKSkgJG9bJ2tvZGFzJ11bYmFzZW5hbWUoJGYpLic6Jy4oJGkrMSldPXRyaW0oc3Vic3RyKCRsLDAsMTgwKSk7IH0gfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-152458';
const GKEY='ps_s1669e';
const PHASES=["A"];
const OUT='analize/s1669_e.json';
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
