process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0ZCBrYWJsaXUgZWlsZSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxNzA0ZCddKT8kX0dFVFsncHNfczE3MDRkJ106JycpOyBpZigkZiE9PScxJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE3MDRkJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1vcmRlci5waHAnKTsKICAgICRvWydhdl9vcmRlcl9tZDUnXT1tZDUoJGMpOyAkb1snYXZfb3JkZXJfZHlkaXMnXT1zdHJsZW4oJGMpOwogICAgcHJlZ19tYXRjaF9hbGwoIi9hZGRfKD86YWN0aW9ufGZpbHRlcilcKFxzKicoW2Etel8wLTldKyknXHMqLFxzKlxbW15cXV0qJyhbYS16XzAtOV0rKSdccypcXVxzKig/OixccyooXGQrKSk/L2kiLCRjLCRtLFBSRUdfU0VUX09SREVSKTsKICAgICRvWydhdl9vcmRlcl9rYWJsaWFpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbMV0uJyAtPiAnLiR4WzJdLicgcHJpbyAnLihpc3NldCgkeFszXSk/JHhbM106JzEwJyk7fSwkbSk7CiAgICAvLyBrYXMgZGFyIG51c3RhdG8gX3BzX3NvdXJjZQogICAgJGRpcj1XUE1VX1BMVUdJTl9ESVI7ICRyYWQ9YXJyYXkoKTsKICAgIGZvcmVhY2goc2NhbmRpcigkZGlyKSBhcyAkZm4peyBpZihzdWJzdHIoJGZuLC00KSE9PScucGhwJykgY29udGludWU7ICRjYz1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nLycuJGZuKTsgaWYoJGNjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICBpZihzdHJwb3MoJGNjLCJfcHNfc291cmNlIikhPT1mYWxzZSl7ICRuPXN1YnN0cl9jb3VudCgkY2MsJ19wc19zb3VyY2UnKTsgJHJhZFskZm5dPSRuOyB9IH0KICAgICRvWydwc19zb3VyY2VfZmFpbGFpJ109JHJhZDsKICAgIC8vIHJlYWx1cyBrYWJsaWFpIGd5dmFpCiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAgIGZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX3BheW1lbnRfY29tcGxldGUnLCd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfcHJvY2Vzc2luZycsJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X29yZGVyX3Byb2Nlc3NlZCcsJ3dvb2NvbW1lcmNlX29yZGVyX2l0ZW1fcXVhbnRpdHknLCd3b29jb21tZXJjZV9jYW5fcmVkdWNlX29yZGVyX3N0b2NrJykgYXMgJGgpewogICAgICAkbD1hcnJheSgpOwogICAgICBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHJpbz0+JGNicykgZm9yZWFjaCgkY2JzIGFzICRpZD0+JGNiKXsKICAgICAgICAkZm49JGNiWydmdW5jdGlvbiddOyAkbm09aXNfYXJyYXkoJGZuKT8oKGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV0pOihpc19zdHJpbmcoJGZuKT8kZm46J2Nsb3N1cmUnKTsKICAgICAgICAkbFtdPSRwcmlvLicgJy4kbm07IH0KICAgICAgJG9bJ2thYmxpYWknXVskaF09JGw7CiAgICB9CiAgICAvLyB1enNha3ltbyAzNjA5MSBwYXN0YWJvcwogICAgJG9yZD13Y19nZXRfb3JkZXIoMzYwOTEpOwogICAgaWYoJG9yZCl7ICRudD13Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+MzYwOTEsJ2xpbWl0Jz0+MzApKTsKICAgICAgJG9bJ3Bhc3RhYm9zXzM2MDkxJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gJG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnWS1tLWQgSDppOnMnKS4nIHwgJy4kbi0+Y29udGVudDt9LCRudCk7CiAgICAgICRvWydtZXRhXzM2MDkxJ109YXJyYXkoJ19wc19hdl9yZWR1Y2VkJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkJyksJ19wc19hdl9yZXN0b3JlZCc9PiRvcmQtPmdldF9tZXRhKCdfcHNfYXZfcmVzdG9yZWQnKSwnc3VrdXJ0YSc9PiRvcmQtPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnWS1tLWQgSDppOnMnKSwnYXBtb2tldGEnPT4kb3JkLT5nZXRfZGF0ZV9wYWlkKCk/JG9yZC0+Z2V0X2RhdGVfcGFpZCgpLT5kYXRlKCdZLW0tZCBIOmk6cycpOm51bGwsJ2J1ZGFzJz0+JG9yZC0+Z2V0X3BheW1lbnRfbWV0aG9kKCkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-080608';
const GKEY='ps_s1704d';
const PHASES=["1"];
const OUT='analize/s1704_d.json';
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
