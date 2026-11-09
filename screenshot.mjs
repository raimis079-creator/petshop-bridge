process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQwZyBaQiBpbXBvcnRvIHJlc3Vyc3UgdHlyaW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NDBnJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMDApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg0MGcnXTsKICAkcz1nZXRfb3B0aW9uKCdQTVhJX1BsdWdpbl9PcHRpb25zJyk7IGlmKGlzX2FycmF5KCRzKSl7IGZvcmVhY2goJHMgYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL2Nyb258dGltZXxsaW1pdHxjaHVua3xyZWNvcmRzfHNlc3Npb258bGFyZ2V8cHJvY2Vzc2luZy9pJywkaykpICRyWyd3cGFpX251c3QnXVska109aXNfc2NhbGFyKCR2KT8kdjonW2Fycl0nOyB9IH0KICBmb3JlYWNoKFsyLDMsNSw3XSBhcyAkaWQpeyAkbz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JFB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPSVkIiwkaWQpKTsgJG89bWF5YmVfdW5zZXJpYWxpemUoJG8pOyAkeD1bXTsKICAgIGlmKGlzX2FycmF5KCRvKSkgZm9yZWFjaChbJ3JlY29yZHNfcGVyX3JlcXVlc3QnLCdpc19zZWxlY3RpdmVfaGFzaGluZycsJ2NodW5ja2luZycsJ2lzX2Zhc3RfbW9kZScsJ2NyZWF0ZV9uZXdfcmVjb3JkcycsJ2lzX3VwZGF0ZV90aXRsZScsJ2lzX3VwZGF0ZV9jb250ZW50JywnaXNfdXBkYXRlX2ltYWdlcycsJ3VwZGF0ZV9hbGxfZGF0YScsJ2lzX3VwZGF0ZV9jdXN0b21fZmllbGRzJywnaXNfdXBkYXRlX2NhdGVnb3JpZXMnLCdpc191cGRhdGVfYXR0cmlidXRlcycsJ2lzX3VwZGF0ZV9wcmljZScsJ2lzX2tlZXBfZm9ybWVyX3Bvc3RzJywnZHVwbGljYXRlX21hdGNoaW5nJywnaXNfZGVsZXRlX21pc3NpbmcnLCdpc191cGRhdGVfbWlzc2luZ19jZicsJ3Byb2Nlc3NpbmdfZGVsYXknLCdyZWNvcmRzX3Blcl9yZXF1ZXN0X21vZGUnXSBhcyAkayl7IGlmKGFycmF5X2tleV9leGlzdHMoJGssJG8pKSAkeFska109aXNfc2NhbGFyKCRvWyRrXSk/JG9bJGtdOidbYXJyXSc7IH0KICAgICRyWydpbXAnXVskaWRdPSR4OwogICAgJHJbJ2hpc3QnXVskaWRdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHRpbWVfcnVuLExFRlQoc3VtbWFyeSw5MCkgcyxkYXRlIEZST00geyRQfXBteGlfaGlzdG9yeSBXSEVSRSBpbXBvcnRfaWQ9JWQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA2IiwkaWQpLEFSUkFZX0EpOyB9CiAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGxkPSR1cFsnYmFzZWRpciddLicvd3BhbGxpbXBvcnQvbG9ncyc7ICRyWydsb2dkaXInXT1pc19kaXIoJGxkKTsKICBmb3JlYWNoKFsnMTEwNzcnLCcxMDU5MyddIGFzICRoKXsgJGY9IiRsZC8kaC5odG1sIjsgaWYoIWlzX2ZpbGUoJGYpKSB7ICRyWydsb2cnXVskaF09J25lcmEnOyBjb250aW51ZTsgfSAkdD1maWxlX2dldF9jb250ZW50cygkZik7ICRsbj1wcmVnX3NwbGl0KCcvPGJyXHMqXC8/Pnxcbi8nLCR0KTsgJHRzPVtdOyBmb3JlYWNoKCRsbiBhcyAkbCl7ICRsPXRyaW0oc3RyaXBfdGFncygkbCkpOyBpZihwcmVnX21hdGNoKCcvXlxbKFxkXGQ6XGRcZDpcZFxkKVxdXHMqKC4qKSQvJywkbCwkbSkpeyAkdHNbXT0kbVsxXS4nICcubWJfc3Vic3RyKCRtWzJdLDAsOTApOyB9IH0KICAgICRyWydsb2cnXVskaF09WydrYic9PnJvdW5kKHN0cmxlbigkdCkvMTAyNCksJ2VpbCc9PmNvdW50KCR0cyksJ3Bpcm1vcyc9PmFycmF5X3NsaWNlKCR0cywwLDYpLCdwYXNrdXRpbmVzJz0+YXJyYXlfc2xpY2UoJHRzLC02KV07CiAgICAkcGVyPVtdOyBmb3JlYWNoKCR0cyBhcyAkbCl7IGlmKHByZWdfbWF0Y2goJy9eKFxkXGQ6XGRcZCkvJywkbCwkbSkpICRwZXJbJG1bMV1dPSgkcGVyWyRtWzFdXT8/MCkrMTsgfSAkclsnbG9nJ11bJGhdWydwZXJfbWluX3RvcCddPWFycmF5X3NsaWNlKCRwZXIsMCw0MCk7IH0KICAvLyBhdG1pbnRpZXMgZmF0YWwgaXMgcGhwX2Vycm9yLmxvZwogICRwbD0nL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9wZXRzaG9wLmx0L2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRmaD1AZm9wZW4oJHBsLCdyJyk7ICRtZW09W107ICRwcmV2PScnOwogIGlmKCRmaCl7IHdoaWxlKCgkbD1mZ2V0cygkZmgpKSE9PWZhbHNlKXsgaWYoc3RyaXBvcygkbCwnQWxsb3dlZCBtZW1vcnknKSE9PWZhbHNlfHxzdHJpcG9zKCRsLCdNYXhpbXVtIGV4ZWN1dGlvbiB0aW1lJykhPT1mYWxzZSl7ICRtZW1bXT1tYl9zdWJzdHIodHJpbSgkbCksMCwyNjApOyB9IH0gZmNsb3NlKCRmaCk7IH0KICAkclsnbWVtX2ZhdGFsX24nXT1jb3VudCgkbWVtKTsgJHJbJ21lbV9mYXRhbCddPWFycmF5X3NsaWNlKCRtZW0sLTI1KTsKICBmb3JlYWNoKGdsb2IoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzLyonKT86W10gYXMgJGYpICRyWydsb2dzJ11bXT1bYmFzZW5hbWUoJGYpLHJvdW5kKGZpbGVzaXplKCRmKS8xMDQ4NTc2LDEpLGRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZikpXTsKICAkclsncGhwJ109WydtZW0nPT5pbmlfZ2V0KCdtZW1vcnlfbGltaXQnKSwnbWV0Jz0+aW5pX2dldCgnbWF4X2V4ZWN1dGlvbl90aW1lJyksJ3dwX21lbSc9PmRlZmluZWQoJ1dQX01FTU9SWV9MSU1JVCcpP1dQX01FTU9SWV9MSU1JVDpudWxsLCd3cF9tYXgnPT5kZWZpbmVkKCdXUF9NQVhfTUVNT1JZX0xJTUlUJyk/V1BfTUFYX01FTU9SWV9MSU1JVDpudWxsXTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-080939';
const GKEY='ps_s1840g';
const PHASES=["1"];
const OUT='analize/s1840_g.json';
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
