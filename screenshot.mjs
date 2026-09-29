process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM2ZCBkcm9wc2hpcCBsYWnFoWvFsyBhcmNoeXZhcywgRFAvTW5NIGVpbHV0xJdzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTczNmQnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MzZkJ107IEBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTczNmQnLCdmYXplJz0+JGZdOwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkYT0oYXJyYXkpZ2V0X29wdGlvbigncHNfbGFpc2t1X2FyY2h5dmFzJyxbXSk7ICRyWydhcmNoX24nXT1jb3VudCgkYSk7CiAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCRhLDAsNjApIGFzICRsKXsgJGg9KHN0cmluZykkbFsnaHRtbCddOyAkclsnYXJjaCddW109WyRsWydsYWlrYXMnXSxtYl9zdWJzdHIoJGxbJ2thbSddLDAsNjApLCRsWyd0ZW1hJ10sbWJfc3Vic3RyKChzdHJpbmcpJGxbJ2tvbnQnXSwwLDcwKSwnRFA9Jy5wcmVnX21hdGNoX2FsbCgnL0RQLVtBLVphLXowLTldLycsJGgpLCdwcj0nLmNvdW50KChhcnJheSkkbFsncHJpZWRhaSddKV07IH0KICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLG9pLm9yZGVyX2l0ZW1faWQsb2kub3JkZXJfaXRlbV9uYW1lLG0xLm1ldGFfdmFsdWUgc3JjLG0yLm1ldGFfdmFsdWUgcGlkLG0zLm1ldGFfdmFsdWUgcXR5IEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0xIE9OIG0xLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgbTEubWV0YV9rZXk9J19wc19zb3VyY2UnIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0yIE9OIG0yLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgbTIubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBtMyBPTiBtMy5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG0zLm1ldGFfa2V5PSdfcXR5JyBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPW9pLm9yZGVyX2lkIFdIRVJFIG8uZGF0ZV9jcmVhdGVkX2dtdD4nMjAyNi0wOS0wNycgQU5EIG0xLm1ldGFfdmFsdWUgTk9UIElOKCcnLCdhdicpIixBUlJBWV9BKTsKICAgICRyWyduZV9hdl9laWwnXT1jb3VudCgkcm93cyk7ICRkcD1bXTskbW5tPVtdOyRzcmM9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJHNyY1skeFsnc3JjJ11dPSgkc3JjWyR4WydzcmMnXV0/PzApKzE7ICRiPWdldF9wb3N0X21ldGEoJHhbJ3BpZCddLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKTsgaWYoJGIpeyAkZHBbXT0keCtbJ2Jhc2UnPT4kYiwna2llayc9PmdldF9wb3N0X21ldGEoJHhbJ3BpZCddLCdfZHBfcGFja19xdHknLHRydWUpLCducic9PndjX2dldF9vcmRlcigkeFsnb3JkZXJfaWQnXSk/d2NfZ2V0X29yZGVyKCR4WydvcmRlcl9pZCddKS0+Z2V0X29yZGVyX251bWJlcigpOicnXTsgfQogICAgICBpZihnZXRfcG9zdF9tZXRhKCR4WydwaWQnXSwnX21ubV9jb25maWcnLHRydWUpIT09JycgKSAkbW5tW109JHg7IH0KICAgICRyWydwYWdhbF9zcmMnXT0kc3JjOyAkclsnZHAnXT1hcnJheV9zbGljZSgkZHAsMCwzMCk7ICRyWydkcF9uJ109Y291bnQoJGRwKTsgJHJbJ21ubSddPWFycmF5X3NsaWNlKCRtbm0sMCwxMCk7CiAgICAkclsndGlla19laWxfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfdGlla2ltYXNfZWlsIik7CiAgICAkclsndGlla19zcmMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aWVrZWphcyxDT1VOVCgqKSBuIEZST00geyRQfXBzX3RpZWtpbWFzIEdST1VQIEJZIHRpZWtlamFzIixBUlJBWV9BKTsKICAgICRyWydzb3VyY2VzX3NyYyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSxDT1VOVCgqKSBuIEZST00geyRQfXBzX3NvdXJjZXMgR1JPVVAgQlkgc291cmNlIixBUlJBWV9BKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-071454';
const GKEY='ps_s1736d';
const PHASES=["1"];
const OUT='analize/s1736_d.json';
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
