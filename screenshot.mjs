process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1ZDIgc2F1c8WzIGFwcmHFoXltxbMgxaHEl3JpbW8gacWhdHJhdWthIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyNWQyJ10pKSByZXR1cm47ICRyPVsndic9PidTMTgyNWQyJ107CiAgJGlkcz1hcnJheV9tYXAoJ2ludHZhbCcsZXhwbG9kZSgnLCcsJzM3MTIyLDM2NjIwLDM2NjIyLDM2NjI0LDM2NjI2LDM2MjUyLDM1OTczLDM1MDI3LDMzMzk0LDMzMzkwLDMzMzcwLDI2ODk5LDI3MTI2LDI3MDM1LDI3MDM4LDI1NzQ5LDI2MDU0LDI1MTY1LDIxMzQ1LDIxMzc0LDIxMzY0LDIxNTMxLDIxMzE2LDIxMTczLDIwNTM3LDIwNTM5LDIwNTQxLDIwNTQzLDIwOTU3LDE0NjUyLDE0NjQyLDE0NjM5LDE0NDcyLDE0NDY3LDE0NDY4LDE0NDcwLDE0MTcxLDEzMDA5LDEyOTg1LDEyOTMyLDEyNzE4LDEyNzIwLDEyNjk2LDEyNjc5LDEyNDgzLDEyNDg0LDEyNDg1LDEyNDg2LDE4NjIzLDE4NTcyLDE4Mzg1LDE3OTU2LDE2Nzk0LDE2NzkxLDE2NzI3LDE2NzI0LDE2NzIxLDE2NzE4LDE2NzE1LDE2NzA4LDE2NzAyLDE2Njk5LDE2Njk2LDE2NjYzLDE2NjYwLDE2NjU3LDE2NjUxLDE2NjQ4LDE2NjI3LDE2NjE1LDE2NjA5LDE2NjA2LDE2NjAzLDE2NTk0LDE2NTkxLDE2NTg1LDE2NTgyLDE2NTc5LDE2NTc2LDE2NTczLDE2NTcwLDE2NTY3LDE2NTYxLDE2NTU1LDE2NTUyLDE2NTQ5LDE2NTM0LDE2NTM3LDE2NTEzLDE2NTAxLDE2NDcyLDE2NDY2LDE2NDYzLDE2NDYwLDE2NDU3LDE2NDMxLDE2NDI1LDE2NDIyLDE2NDExLDE2NDAyLDE2MjU0LDE0ODA0LDE0ODA1LDE0Njc0LDE0Njc3LDE0Njc4LDE0NjYyLDE0NjY0LDE0NjY1LDE0NjY5LDE0NjcwLDE0NjU3LDE0NjYwLDE0NjYxLDE0NjUxLDE0NjQzLDE0NjQ0LDE0NjQ1LDE0NjQ3LDE0NjQ4LDE0NjQ5LDE0NjMzLDE0NjM0LDE0NjM2LDE0NjM3LDE0NjM4LDE0NjQwLDE0NjQxLDE0NjMyLDE0NjMwLDE0NjMxLDE0NDczLDE0NDY5LDE0NDcxLDE0MTg1LDE0MTg2LDE0MTczLDE0MDcyLDEzODcxLDEzMDQxLDEyOTkyLDEyOTMzLDEyODI5LDEyNzIxLDEyNzAzLDEyNzA2LDEyNzA3LDEyNzA4LDEyNzAyLDEyNjk0LDEyNjk1LDEyNjk3LDEyNjk4LDEyNjk5LDEyNzAwLDEyNjkzLDEyNzAxLDEyNjgzLDEyNjg1LDEyNjg3LDEyNjg5LDEyNjkxLDEyNjc1LDEyNjc2LDEyNjgxLDEyNjY2LDEyNTU1LDEyNDgyJykpOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkaWQpOwogICAgaWYocHJlZ19tYXRjaF9hbGwoJy8oLnswLDMwMH0pKDx0YWJsZS4qPzxcL3RhYmxlPikvc3UnLCRjLCRtLFBSRUdfU0VUX09SREVSKSl7IGZvcmVhY2goJG0gYXMgJHgpeyAkclsndCddWyRpZF1bXT1bJ3ByZSc9PndwX3N0cmlwX2FsbF90YWdzKCR4WzFdKSwndGJsJz0+cHJlZ19yZXBsYWNlKCcvXHMrKHN0eWxlfGNsYXNzfHdpZHRofGJvcmRlcnxjZWxscGFkZGluZ3xjZWxsc3BhY2luZyk9IlteIl0qIi8nLCcnLCR4WzJdKV07IH0gfQogICAgZWxzZSB7ICR0PXdwX3N0cmlwX2FsbF90YWdzKCRjKTsgaWYocHJlZ19tYXRjaCgnLyjFoMSXcmltfMWhxJdyaW18UmVrb21lbmR1b2phbXxwYXJvcyBub3JtKS57MCw5MDB9L3N1JywkdCwkbW0pKSAkclsneCddWyRpZF09JG1tWzBdOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-135501';
const GKEY='ps_s1825d2';
const PHASES=["1"];
const OUT='analize/s1825_d2.json';
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
