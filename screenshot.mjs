process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdGZCIOKAlCAxNyByaW5raW5pxbMgcGVydHZhcmt5bWFzIMSvIHN0YW5kYXJ0xIU6IGZpa3N1b3RhIGthaW5hIChyZWd1bGFyPTjDl3ZudCwgc2FsZT3iiJIxMCUpLCBwZXJfaXRlbSBubywgYXByYcWhYWkgacWhIHZpZW5ldGluxJdzLCBwYXZhZGluaW1hcyAiOCBWTlQuIC0gLi4uIi4gUGF0aWtyYSArIGNhcnQgdGVzdGFzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTYzNXRmYiddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4ndGZCJyk7CiAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJE1BUD1hcnJheSgxNzY1OT0+MzU4NTYsMTc2NjI9PjM1ODU1LDE3NjY1PT4zNTg1NCwxNzY2OD0+MzU4NTMsMTc2NzE9PjM1ODUyLDE3Njc0PT4zNTg1MSwxNzY3Nz0+MzU4NTAsMTc2ODA9PjM1ODQ5LDE3NjgzPT4zNTg0OCwxNzY4Nj0+MzU4NDcsMTc2ODk9PjM1ODQ2LDE3NjkyPT4zNTg0NSwxNzY5NT0+MzU4NDQsMTc2OTg9PjM1ODQzLDE3NzAxPT4zNTg0MiwxNzcwND0+MzU4NDEsMTc3MDc9PjM1ODQwKTsKICBmb3JlYWNoKCRNQVAgYXMgJHZpZD0+JGNpZCl7CiAgICAkdj13Y19nZXRfcHJvZHVjdCgkdmlkKTsgJHZwPWdldF9wb3N0KCR2aWQpOyBpZighJHYpIGNvbnRpbnVlOwogICAgJHJlZz1yb3VuZCg4KihmbG9hdCkkdi0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSwyKTsgJHNhbGU9cm91bmQoJHJlZyowLjksMik7CiAgICAkYz13Y19nZXRfcHJvZHVjdCgkY2lkKTsKICAgICRjLT5zZXRfbmFtZSgnOCBWTlQuIC0gJy4kdi0+Z2V0X25hbWUoKSk7CiAgICAkYy0+c2V0X3Nob3J0X2Rlc2NyaXB0aW9uKCR2cC0+cG9zdF9leGNlcnB0KTsKICAgICRjLT5zZXRfZGVzY3JpcHRpb24oJHZwLT5wb3N0X2NvbnRlbnQpOwogICAgJGMtPnNhdmUoKTsKICAgIGZvcmVhY2goYXJyYXkoJ19tbm1fcGVyX3Byb2R1Y3RfcHJpY2luZyc9PidubycsJ19tbm1fcGVyX3Byb2R1Y3RfZGlzY291bnQnPT4nJywnX21ubV9iYXNlX3JlZ3VsYXJfcHJpY2UnPT4kcmVnLCdfbW5tX2Jhc2Vfc2FsZV9wcmljZSc9PiRzYWxlLCdfbW5tX2Jhc2VfcHJpY2UnPT4kc2FsZSwnX3JlZ3VsYXJfcHJpY2UnPT4kcmVnLCdfc2FsZV9wcmljZSc9PiRzYWxlLCdfcHJpY2UnPT4kc2FsZSkgYXMgJGs9PiR2dikgdXBkYXRlX3Bvc3RfbWV0YSgkY2lkLCRrLCR2dik7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkY2lkKTsKICAgICRvWydhdG4nXVskY2lkXT0kcmVnLifihpInLiRzYWxlOwogIH0KICB3cF9jYWNoZV9mbHVzaCgpOwogIC8vIHBhdGlrcmE6IHB1c2xhcGlzICsga3JlcMWhZWxpcyAoa2F2b3MgMzU4NDMpCiAgJGphcj1hcnJheSgpOyAkQ0s9ZnVuY3Rpb24oJHIpdXNlKCYkamFyKXsgZm9yZWFjaCh3cF9yZW1vdGVfcmV0cmlldmVfY29va2llcygkcikgYXMgJGMyKXsgJGphclskYzItPm5hbWVdPW5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PiRjMi0+bmFtZSwndmFsdWUnPT4kYzItPnZhbHVlKSk7IH0gfTsKICAkYXJnPWZ1bmN0aW9uKCRlPWFycmF5KCkpdXNlKCYkamFyKXsgcmV0dXJuIGFycmF5X21lcmdlKGFycmF5KCd0aW1lb3V0Jz0+NjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdjb29raWVzJz0+YXJyYXlfdmFsdWVzKCRqYXIpLCdyZWRpcmVjdGlvbic9PjApLCRlKTsgfTsKICAkdT1nZXRfcGVybWFsaW5rKDM1ODQzKTsKICAkcj13cF9yZW1vdGVfZ2V0KCR1LCRhcmcoKSk7ICRDSygkcik7ICRoPShzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICRvWydwc2wnXT1hcnJheSgnMzIsMDQnPT5zdWJzdHJfY291bnQoJGgsJzMyLDA0JyksJzM1LDYwX3BlcmJyYXVrdGEnPT5zdWJzdHJfY291bnQoJGgsJzM1LDYwJyksJ251b2xhaWRvc190ZWtzdGFzJz0+c3Vic3RyX2NvdW50KCRoLCcxMCAlIG51b2xhaWRhJykpOwogICRyPXdwX3JlbW90ZV9wb3N0KCR1LCRhcmcoYXJyYXkoJ2JvZHknPT5hcnJheSgnYWRkLXRvLWNhcnQnPT4nMzU4NDMnLCdxdWFudGl0eSc9PicxJywnbW5tX3F1YW50aXR5WzE3Njk4XSc9Pic4JyksJ3RpbWVvdXQnPT45MCkpKTsgJENLKCRyKTsKICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvY2FydC8nKSwkYXJnKCkpOyAkaDI9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgJG9bJ2tyZXBzZWxpc18zMl8wNCddPXN1YnN0cl9jb3VudCgkaDIsJzMyLDA0Jyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-104427';
const GKEY='ps_s1635tfb';
const PHASES=["TB"];
const OUT='analize/s1635_tfb.json';
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
