process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTEgZCDigJQga3VyIHJhxaFvbWEgcHNfZGltX2tsaWVudGFpIC8gcHNfd2ViX2RpZW5vczsgcGV0c2hvcC1rbGllbnRhaS5waHAgMTE14oCTMTM1OyBsZW50ZWxpxbMgYsWra2zEly4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5MWQnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRkaXJzPWFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScpOwogIGZvcmVhY2ggKCRkaXJzIGFzICRkKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCkpOyBmb3JlYWNoICgkaXQgYXMgJGYpeyBpZiAoc3Vic3RyKCRmLC00KSE9PScucGhwJykgY29udGludWU7ICRjPUBmaWxlX2dldF9jb250ZW50cygkZik7IGlmICgkYz09PWZhbHNlKSBjb250aW51ZTsKICAgIGZvcmVhY2ggKGFycmF5KCdwc19kaW1fa2xpZW50YWknLCdwc193ZWJfZGllbm9zJykgYXMgJHQpeyBpZiAoc3RycG9zKCRjLCR0KSE9PWZhbHNlKXsgJGxpbmVzPWV4cGxvZGUoIlxuIiwkYyk7IGZvcmVhY2ggKCRsaW5lcyBhcyAkaT0+JGwpeyBpZiAoc3RycG9zKCRsLCR0KSE9PWZhbHNlICYmIHByZWdfbWF0Y2goJy9pbnNlcnR8cmVwbGFjZXxJTlNFUlR8UkVQTEFDRXxEVVBMSUNBVEUvaScsJGwpKSAkb1sna3VyJ11bJHRdW2Jhc2VuYW1lKCRmKV1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDIwMCkpOyB9IGlmICghaXNzZXQoJG9bJ2t1ciddWyR0XVtiYXNlbmFtZSgkZildKSkgJG9bJ2t1ciddWyR0XVtiYXNlbmFtZSgkZildPScodGlrIHBhbWluxJd0YSknOyB9IH0gfSB9CiAgLy8gcHNfZGltX2tsaWVudGFpIHJhxaF5bW8ga29udGVrc3RhczogcmFzdGkgZmFpbMSFIHN1IElOU0VSVCBpciBwYXJvZHl0aSDCsTI1IGVpbC4KICBmb3JlYWNoICgoYXJyYXkpKCRvWydrdXInXVsncHNfZGltX2tsaWVudGFpJ10/P2FycmF5KCkpIGFzICRmbj0+JHYpeyBpZiAoIWlzX2FycmF5KCR2KSkgY29udGludWU7IGZvcmVhY2ggKCRkaXJzIGFzICRkKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCkpOyBmb3JlYWNoICgkaXQgYXMgJGYpeyBpZiAoYmFzZW5hbWUoJGYpIT09JGZuKSBjb250aW51ZTsgJGxpbmVzPWZpbGUoJGYpOyAkb1snZGltX2ZhaWxhcyddPWFycmF5KCdrZWxpYXMnPT5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmKSwnbWQ1Jz0+bWQ1X2ZpbGUoJGYpLCdkeWRpcyc9PmZpbGVzaXplKCRmKSk7IHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbXGRcLl0rKS8nLGltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGxpbmVzLDAsMjApKSwkbSk7ICRvWydkaW1fZmFpbGFzJ11bJ3ZlcnNpamEnXT0kbVsxXT8/bnVsbDsKICAgICAgZm9yZWFjaCAoJHYgYXMgJGxuKXsgJG49KGludCkkbG47IGZvcigkaT1tYXgoMCwkbi0zMCk7JGk8bWluKGNvdW50KCRsaW5lcyksJG4rMTUpOyRpKyspICRvWydkaW1fY3R4J11bJGkrMV09cnRyaW0oJGxpbmVzWyRpXSk7IH0gfSB9IH0KICAka2Y9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rbGllbnRhaS5waHAnOyBpZiAoZmlsZV9leGlzdHMoJGtmKSl7ICRsPWZpbGUoJGtmKTsgZm9yKCRpPTExMjskaTwxMzU7JGkrKykgaWYoaXNzZXQoJGxbJGldKSkgJG9bJ2tsaWVudGFpXzExM18xMzUnXVskaSsxXT1ydHJpbSgkbFskaV0pOyAkb1sna2xpZW50YWlfbWQ1J109bWQ1X2ZpbGUoJGtmKTsgfQogICRvWydkaW1fbGVudGVsZSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgTUlOKHBlcnNrYWljaXVvdGFfYXQpIG1pbl9wLCBNQVgocGVyc2thaWNpdW90YV9hdCkgbWF4X3AsIFNVTShwZXJza2FpY2l1b3RhX2F0Pj1DVVJEQVRFKCktSU5URVJWQUwgMSBEQVkpIHNpYW5kaWVuIEZST00geyRwfXBzX2RpbV9rbGllbnRhaSIsQVJSQVlfQSk7CiAgJG9bJ2RpbV9pbmRla3NhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBJTkRFWCBGUk9NIHskcH1wc19kaW1fa2xpZW50YWkiLEFSUkFZX0EpOwogICRvWydkaW1fcGFza19jcm9uJ109Z2V0X29wdGlvbigncHNfZGltX2tsaWVudHVfcGFzaycpOwogICRvWyd3ZWJfZGllbm9zX3Bhc2snXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1BWChkYXRhKSBtYXhfZCwgQ09VTlQoKikgbiBGUk9NIHskcH1wc193ZWJfZGllbm9zIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-172057';
const GKEY='ps_s1691d';
const PHASES=["1"];
const OUT='analize/s1691_d.json';
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
