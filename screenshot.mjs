process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYiDigJQgUkVBRC1PTkxZOiBWZW5pcGFrIHNpdW50xbMgMzU4NzIgLyAjMTAwMiBixatzZW5hLCBjcm9uLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OWInXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY2OSBiJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgICAkaWQyPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX29yZGVyX251bWJlcicgQU5EIG1ldGFfdmFsdWU9JzEwMDInIExJTUlUIDEiKTsKICAgICRvWydjcm9uX2tpdGFzJ109KCR0PXdwX25leHRfc2NoZWR1bGVkKCdwc192ZW5pcGFrX3Nla2ltYXMnKSk/d3BfZGF0ZSgnWS1tLWQgSDppOnMnLCR0KTpudWxsOwogICAgJG9bJ2Nyb25fcGFza3V0aW5pcyddPWdldF9vcHRpb24oJ3BzX3ZlbmlwYWtfc2VraW1hc19wYXNrdXRpbmlzJyk7CiAgICAkb1snZGlzYWJsZV93cF9jcm9uJ109ZGVmaW5lZCgnRElTQUJMRV9XUF9DUk9OJykmJkRJU0FCTEVfV1BfQ1JPTjsKICAgIGZvcmVhY2goYXJyYXkoMzU4NzIsJGlkMikgYXMgJGlkKXsgJG9yZD13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvcmQpeyAkb1sndSddWyRpZF09J25lcmFzdGFzJzsgY29udGludWU7IH0KICAgICAgJHg9YXJyYXkoJ25yJz0+JG9yZC0+Z2V0X29yZGVyX251bWJlcigpLCdzdGF0dXMnPT4kb3JkLT5nZXRfc3RhdHVzKCksJ2lzc2l1c3RhJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19kYWx5c19pc3NpdXN0YScpLCdzZWtpbWFzJz0+JG9yZC0+Z2V0X21ldGEoJ19wc192ZW5pcGFrX3Nla2ltYXMnKSwnc2l1bnRvcyc9PiRvcmQtPmdldF9tZXRhKCdfcHNfc2l1bnRvcycpKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy9WXGR7NX1FXGR7N30vJyxpc19zdHJpbmcoJHhbJ3NpdW50b3MnXSk/JHhbJ3NpdW50b3MnXTp3cF9qc29uX2VuY29kZSgkeFsnc2l1bnRvcyddKSwkbSk7ICRucnM9JG1bMF07IHVuc2V0KCR4WydzaXVudG9zJ10pOwogICAgICBmb3JlYWNoKGFycmF5X3VuaXF1ZSgkbnJzKSBhcyAkbil7ICRldj1QZXRzaG9wX0RhcmJhbGF1a2lzOjp2ZW5pcGFrX2l2eWtpYWkoJG4pOyAkeFsnYXBpJ11bJG5dPWlzX3dwX2Vycm9yKCRldik/JGV2LT5nZXRfZXJyb3JfbWVzc2FnZSgpOmFycmF5X3NsaWNlKChhcnJheSkkZXYsLTQpOyB9CiAgICAgICRvWyd1J11bJGlkXT0keDsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-150200';
const GKEY='ps_s1669b';
const PHASES=["A"];
const OUT='analize/s1669_b.json';
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
