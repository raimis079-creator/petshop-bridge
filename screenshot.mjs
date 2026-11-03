process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1ZCBhcHJhxaF5bcWzIGxlbnRlbGnFsyBpxaF0cmF1a2EgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI1ZCddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE4MjVkJ107CiAgJGlkcz1hcnJheV9tYXAoJ2ludHZhbCcsZXhwbG9kZSgnLCcsJzM1MzQwLDM1MzEyLDM1MzE2LDM1MzIyLDM1MzI2LDM1MzI4LDM1MzMwLDM1MzM0LDM1MzM4LDM1MzQyLDM1MDgxLDM1MDc5LDM0ODEyLDM0ODE0LDM0ODE2LDM0ODE4LDM0ODIwLDM0ODIyLDM0ODI0LDM0MjI0LDM0MjI2LDMzOTgyLDI2MTIzLDI2MTI1LDI2MTI3LDI2MTI5LDI2MTM1LDI2MTM3LDI2MTM5LDI2MTQxLDI2MTQzLDI2MTQ1LDI0MzkzLDI0Mzk1LDIzNDcwLDIzNDg2LDIzNDk4LDIzNTAwLDIzNDcyLDIzNDc2LDIzNDc4LDIzNDY0LDIzNDgwLDIzNDgyLDIzNDY4LDIyNzYzLDIyNzY1LDIyOTg1LDIyNzY5LDIyNzcxLDIxMzI3LDIxODMwLDIxMzI5LDIxODMyLDIxMzMxLDIxODM0LDIxMzMzLDIxODM2LDIxMzM1LDIxODM4LDIxODU2LDIxODU4LDIxMzU3LDIxNjcxLDIxNjc3LDIxNjc5LDIxNjgxLDIxMzI1LDIxODI4LDIxMTI1LDIxMTM5LDIxMTQxLDIxMTY1LDIwNDE2LDIwNDE4LDIwNDIxLDIwNDU1LDIwNDI0LDIwNDMyLDIwNDY2LDIwNDM1LDIwNDM3LDIwNTIzLDIwNDgxLDIwNTI1LDIwNDEwLDIwNDEzLDE5NjAyLDE5NTk4LDE5NTk0LDE5NTkwLDE5NTg2LDE5NTgyLDE5NTc4LDE5NTc0LDE5NTcwLDE5NTY2LDE5NTYyLDE5NTU3LDE5NTUzLDE5NTQ5LDE5NTQ1LDE5NTQyLDE5NTA4LDE5NTA0LDE5NTAwLDE5NDk2LDE5NDkyLDE5NDg4LDE5NDgzLDE5NDc5LDE5NDc1LDE5NDcxLDE5NDQ2LDE5NDI1LDE5NDE0LDE5NDExLDE4NjE0LDE4NjExLDE4NjA4LDE4NjA1LDE4NjAyLDE4NTk5LDE4NTk2LDE4NTkzLDE4NTIxLDE4NTE4LDE4NTE1LDE4NTEyLDE4NTAzLDE4NDkzLDE4NDg4LDE4MDcxLDE4MDY4LDE3NDIxLDE3NDE4LDE3NDE1LDE3NDA5LDE3NDA2LDE3NDAzJykpOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkaWQpOyBpZighcHJlZ19tYXRjaF9hbGwoJy8oLnswLDMwMH0pKDx0YWJsZS4qPzxcL3RhYmxlPikvc3UnLCRjLCRtLFBSRUdfU0VUX09SREVSKSkgY29udGludWU7CiAgICBmb3JlYWNoKCRtIGFzICR4KXsgJHJbJ3QnXVskaWRdW109WydwcmUnPT53cF9zdHJpcF9hbGxfdGFncygkeFsxXSksJ3RibCc9PnByZWdfcmVwbGFjZSgnL1xzK3N0eWxlPSJbXiJdKiIvJywnJywkeFsyXSldOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-112154';
const GKEY='ps_s1825d';
const PHASES=["1"];
const OUT='analize/s1825_d.json';
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
