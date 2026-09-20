process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTUgZiDigJQg4oCeV29uZGVyIjogdcW+c2FreW1haSAoa2xpZW50YXMvxK9tb27Ely9lbC4gcGHFoXRhcy9wcmVrxJcpLCBixatzZW5vcywgbGFpa2FpLCBtb2vEl2ppbWFzLCBwYXN0YWJvcyAoa2FzIGF0xaFhdWvElyBpciBrb2TEl2wpLCBJUC/Er3JlbmdpbnlzLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjk1ZiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJGtsPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1Qgby5pZCBGUk9NIHskcH13Y19vcmRlcnMgbyBMRUZUIEpPSU4geyRwfXdjX29yZGVyX2FkZHJlc3NlcyBhIE9OIGEub3JkZXJfaWQ9by5pZCBXSEVSRSBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA2JyBBTkQgKGEuZmlyc3RfbmFtZSBMSUtFICcld29uZGVyJScgT1IgYS5sYXN0X25hbWUgTElLRSAnJXdvbmRlciUnIE9SIGEuY29tcGFueSBMSUtFICcld29uZGVyJScgT1Igby5iaWxsaW5nX2VtYWlsIExJS0UgJyV3b25kZXIlJykiKTsKICAkcHI9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBvaS5vcmRlcl9pZCBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBKT0lOIHskcH13Y19vcmRlcnMgbyBPTiBvLmlkPW9pLm9yZGVyX2lkIFdIRVJFIG9pLm9yZGVyX2l0ZW1fdHlwZT0nbGluZV9pdGVtJyBBTkQgb2kub3JkZXJfaXRlbV9uYW1lIExJS0UgJyV3b25kZXIlJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNiciKTsKICAkb1sncGFnYWxfa2xpZW50YSddPWNvdW50KCRrbCk7ICRvWydwYWdhbF9wcmVrZSddPWNvdW50KCRwcik7ICRpZHM9YXJyYXlfdW5pcXVlKGFycmF5X21lcmdlKCRrbCwkcHIpKTsgcnNvcnQoJGlkcyk7ICRpZHM9YXJyYXlfc2xpY2UoJGlkcywwLDI1KTsgJG9bJ24nXT1jb3VudCgkaWRzKTsKICBmb3JlYWNoICgkaWRzIGFzICRpZCl7ICR3PXdjX2dldF9vcmRlcigoaW50KSRpZCk7IGlmKCEkdykgY29udGludWU7ICRyPWFycmF5KCducic9PiR3LT5nZXRfb3JkZXJfbnVtYmVyKCksJ2lkJz0+JGlkLCdzdGF0dXMnPT4kdy0+Z2V0X3N0YXR1cygpLCdzdWt1cnRhJz0+JHctPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdzdW1hJz0+JHctPmdldF90b3RhbCgpLCdtb2snPT4kdy0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJ2FwbW9rZXRhJz0+JHctPmdldF9kYXRlX3BhaWQoKT8kdy0+Z2V0X2RhdGVfcGFpZCgpLT5kYXRlKCdtLWQgSDppJyk6bnVsbCwna2xpZW50YXMnPT4kdy0+Z2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgpLicgJy5tYl9zdWJzdHIoJHctPmdldF9iaWxsaW5nX2xhc3RfbmFtZSgpLDAsMSkuJy4gfCAnLm1iX3N1YnN0cigkdy0+Z2V0X2JpbGxpbmdfZW1haWwoKSwwLDQpLifigKYgfCAnLiR3LT5nZXRfYmlsbGluZ19jb21wYW55KCksJ3VpZCc9PiR3LT5nZXRfY3VzdG9tZXJfaWQoKSwnaXAnPT4kdy0+Z2V0X2N1c3RvbWVyX2lwX2FkZHJlc3MoKSwndmlhJz0+JHctPmdldF9jcmVhdGVkX3ZpYSgpLCdpcmVuZ2lueXMnPT4kdy0+Z2V0X21ldGEoJ19wc19pcmVuZ2lueXMnKSwndWEnPT5tYl9zdWJzdHIoKHN0cmluZykkdy0+Z2V0X2N1c3RvbWVyX3VzZXJfYWdlbnQoKSwwLDUwKSk7CiAgICBmb3JlYWNoICgkdy0+Z2V0X2l0ZW1zKCkgYXMgJGl0KSAkclsncHJla2VzJ11bXT0kaXQtPmdldF9xdWFudGl0eSgpLifDlyAnLm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCw0NSk7CiAgICBmb3JlYWNoICgkdy0+Z2V0X3NoaXBwaW5nX21ldGhvZHMoKSBhcyAkcykgJHJbJ3ByaXN0YXR5bWFzJ109JHMtPmdldF9uYW1lKCk7CiAgICBmb3JlYWNoICh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjEyKSkgYXMgJG4pICRyWydwYXN0YWJvcyddW109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy4kbi0+YWRkZWRfYnkuJzogJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTIwKTsKICAgICRyWydrbGllbnRvX3Bhc3RhYmEnXT1tYl9zdWJzdHIoJHctPmdldF9jdXN0b21lcl9ub3RlKCksMCwxMjApOwogICAgJG9bJ3V6cyddW109JHI7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-114340';
const GKEY='ps_s1695f';
const PHASES=["1"];
const OUT='analize/s1695_f.json';
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
