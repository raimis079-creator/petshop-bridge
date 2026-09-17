process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHcg4oCUIERJQUdOT1rEliA0OiBrYXNvcyBudXN0YXR5bWFpICsgdmlzxbMgcGxhY2Utb3JkZXItZGVidWcgYmFpZ8SNacWzIHN0YXRpc3Rpa2EgbnVvIFQtMC4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4OXN3J10pKSByZXR1cm47ICRvPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgnd29vY29tbWVyY2VfZW5hYmxlX2d1ZXN0X2NoZWNrb3V0Jywnd29vY29tbWVyY2VfZW5hYmxlX2NoZWNrb3V0X2xvZ2luX3JlbWluZGVyJywnd29vY29tbWVyY2VfZW5hYmxlX3NpZ251cF9hbmRfbG9naW5fZnJvbV9jaGVja291dCcsJ3dvb2NvbW1lcmNlX2VuYWJsZV9teWFjY291bnRfcmVnaXN0cmF0aW9uJywnd29vY29tbWVyY2VfcmVnaXN0cmF0aW9uX2dlbmVyYXRlX3VzZXJuYW1lJywnd29vY29tbWVyY2VfcmVnaXN0cmF0aW9uX2dlbmVyYXRlX3Bhc3N3b3JkJywnd29vY29tbWVyY2VfaG9sZF9zdG9ja19taW51dGVzJywnd29vY29tbWVyY2VfbWFuYWdlX3N0b2NrJykgYXMgJGspJG9bJ29wdCddWyRrXT1nZXRfb3B0aW9uKCRrKTsKICAkc3Q9YXJyYXkoKTsgJHB2PWFycmF5KCk7ICRkaWVub3M9YXJyYXkoKTsKICBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MvcGxhY2Utb3JkZXItZGVidWctKicpPzphcnJheSgpIGFzICRmKXsgJHQ9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBwcmVnX21hdGNoKCcvKFxkezR9LVxkXGQtXGRcZClUKFxkXGQpLycsJHQsJGQpOyAkZGF5PSRkWzFdPz8nPyc7CiAgICBwcmVnX21hdGNoX2FsbCgnL1wrMDA6MDAgXHcrIFxbW15cXV0qXF0gKFtee10rPykgQ09OVEVYVC8nLCR0LCRtKTsgJGxhc3Q9dHJpbShlbmQoJG1bMV0pPzonPycpOyAka2V5PW1iX3N1YnN0cihwcmVnX3JlcGxhY2UoJy/igJ5bXuKAnF0r4oCcLycsJ+KAnuKApuKAnCcsd3Bfc3RyaXBfYWxsX3RhZ3MoJGxhc3QpKSwwLDkwKTsKICAgICRzdFska2V5XT0oJHN0WyRrZXldPz8wKSsxOyAkZGllbm9zWyRkYXldWyRrZXldPSgkZGllbm9zWyRkYXldWyRrZXldPz8wKSsxOyB9CiAgYXJzb3J0KCRzdCk7ICRvWydiYWlndHlzX3Zpc28nXT0kc3Q7IGtzb3J0KCRkaWVub3MpOyAkb1sncGFnYWxfZGllbmEnXT0kZGllbm9zOyAkb1snZmFpbHUnXT1jb3VudChnbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93Yy1sb2dzL3BsYWNlLW9yZGVyLWRlYnVnLSonKT86YXJyYXkoKSk7CiAgZ2xvYmFsICR3cGRiOyAkb1sndmFydG90b2p1X3N1X3V6c2FreW1haXNfaXN0b3Jpam9qZSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnVzZXJzfSIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-151832';
const GKEY='ps_s1689sw';
const PHASES=["GO"];
const OUT='analize/s1689s_w.json';
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
