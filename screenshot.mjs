process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgeCDigJQgUkVBRC1PTkxZOiDFoWlhbmRpZW5vcyB1xb5zYWt5bWFzIFZGIHRpZWvEl2p1aSArIGxhacWha8WzIMW+dXJuYWxhcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2Njl4J10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2NjkgeCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJG9bJ2xlbnQnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgV0hFUkUgVGFibGVzX2luXyIuREJfTkFNRS4iIFJFR0VYUCAnbWFpbHxsYWlza3x0aWVrZWp8ZHJvcHNoaXB8c3VwcGxpZXJ8dmZfJyIpOwogICAgZm9yZWFjaCgkb1snbGVudCddIGFzICR0KXsgJGM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7ICRkYz1udWxsOyBmb3JlYWNoKCRjIGFzICR4KSBpZihwcmVnX21hdGNoKCcvXihsYWlrYXN8ZGF0ZXxjcmVhdGVkfGNyZWF0ZWRfYXR8c3VrdXJ0YXxzaXVzdGF8c2VudHx0aW1lfGRhdGEpL2knLCR4KSl7ICRkYz0keDsgYnJlYWs7IH0KICAgICAgJG9bJ3QnXVskdF09YXJyYXkoJ3N0dWxwJz0+JGMsJ24nPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpKTsKICAgICAgaWYoJGRjKXsgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICR0IFdIRVJFICRkYyA+PSBDVVJEQVRFKCkgLSBJTlRFUlZBTCAxIERBWSBPUkRFUiBCWSAkZGMgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsgZm9yZWFjaCgkcm93cyBhcyAmJHIpIGZvcmVhY2goJHIgYXMgJGs9PiR2KSAkclska109bWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKChzdHJpbmcpJHYpLDAsMTQwKTsgJG9bJ3QnXVskdF1bJ3Bhc2snXT0kcm93czsgfSB9CiAgICAkb1snbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ub3JkZXJfaWQsIG0ubWV0YV9rZXksIExFRlQobS5tZXRhX3ZhbHVlLDE2MCkgdiBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRwfXdjX29yZGVycyB4IE9OIHguaWQ9bS5vcmRlcl9pZCBXSEVSRSB4LmRhdGVfdXBkYXRlZF9nbXQgPj0gVVRDX0RBVEUoKSAtIElOVEVSVkFMIDEgREFZIEFORCAobS5tZXRhX2tleSBMSUtFICcldGllayUnIE9SIG0ubWV0YV9rZXkgTElLRSAnJXZmJScgT1IgbS5tZXRhX2tleSBMSUtFICclZHJvcHNoaXAlJyBPUiBtLm1ldGFfa2V5IExJS0UgJyVzdXBwbGllciUnKSBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-180137';
const GKEY='ps_s1669x';
const PHASES=["A"];
const OUT='analize/s1669_x.json';
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
