process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1ayAjM2EgcGFrxbMgcGF0aWtyYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjVrJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODI1ayddOwogICRrZXlzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV9rZXkgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnXFxfcHNcXF9zMTgyJXBhayUnIik7ICRyWydrZXlzJ109JGtleXM7CiAgJGZ0PSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfdGFibGVzJzsgJGhhc2Z0PSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckZnQnIik7CiAgZm9yZWFjaChbJ19wc19zMTgyMF9wYWthcycsJ19wc19zMTgyMV9wYWthcycsJ19wc19zMTgyMl9wYWthcyddIGFzICRrKXsKICAgICRpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSVzIiwkaykpOwogICAgaWYoISRpZHMgJiYgJGs9PT0nX3BzX3MxODIwX3Bha2FzJyl7ICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0nMzM5ODQnIik7IH0KICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOyAkYj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKTsgJHE9KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTsKICAgICAgJGNvc3Q9KGZsb2F0KWdldF9wb3N0X21ldGEoJGIsJ196Yl9jb3N0Jyx0cnVlKTsgJHNyYz0nemInOyBpZighJGNvc3QpeyAkY29zdD0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkYiwnX3BzX3NhdmlrYWluYScsdHJ1ZSk7ICRzcmM9J3BzJzsgfSBpZighJGNvc3QpeyAkY29zdD0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkYiwnX3djX2NvZ19jb3N0Jyx0cnVlKTsgJHNyYz0nY29nJzsgfQogICAgICAkcHI9KGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsgJHBlbD0gJGNvc3Q/IHJvdW5kKCRwci8xLjIxIC0gJHEqJGNvc3QgLSAyLjE1LDIpOm51bGw7CiAgICAgICRyWydwJ11bJGtdW109WydpZCc9PiRpZCwnYic9PiRiLCdic3QnPT5nZXRfcG9zdF9zdGF0dXMoJGIpLCdic2FuZCc9PmdldF9wb3N0X21ldGEoJGIsJ19wc19zYW5kZWxpcycsdHJ1ZSksJ3EnPT4kcSwnc3QnPT4kcC0+Z2V0X3N0YXR1cygpLCdrYWluYSc9PiRwciwndm50Jz0+JHE/cm91bmQoJHByLyRxLDIpOm51bGwsJ2Nvc3QnPT4kY29zdCwnc3JjJz0+JHNyYywncGVsbmFzJz0+JHBlbCwnc2VpbWEnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSksJ2luc3RvY2snPT4kcC0+aXNfaW5fc3RvY2soKSwnbic9Pm1iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDYwKV07CiAgICB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-111050';
const GKEY='ps_s1825k';
const PHASES=["1"];
const OUT='analize/s1825_k.json';
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
