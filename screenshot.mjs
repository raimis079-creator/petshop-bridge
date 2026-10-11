process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzczYSBza2FuZXN0YWkgc3VuaW1zOiBrYXRlZ29yaWpvcywgbWFyemEsIHBhcmRhdmltYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzczYSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgJHI9Wyd2Jz0+J1MxNzczYSddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJHJvb3Q9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCdza2FuZXN0YWktc3VuaW1zJywncHJvZHVjdF9jYXQnKTsgJHJbJ3Jvb3QnXT0kcm9vdD9bJHJvb3QtPnRlcm1faWQsJHJvb3QtPm5hbWUsJHJvb3QtPmNvdW50XTpudWxsOwogICAgJGtpZHM9JHJvb3Q/Z2V0X3Rlcm1zKFsndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdjaGlsZF9vZic9PiRyb290LT50ZXJtX2lkLCdoaWRlX2VtcHR5Jz0+ZmFsc2VdKTpbXTsgJHJbJ3ZhaWthaSddPWFycmF5X21hcChmbigkdCk9PlskdC0+dGVybV9pZCwkdC0+c2x1ZywkdC0+bmFtZSwkdC0+Y291bnRdLCRraWRzKTsKICAgICRpZHM9JHJvb3Q/Z2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4tMSwnZmllbGRzJz0+J2lkcycsJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywndGVybXMnPT4kcm9vdC0+dGVybV9pZCwnaW5jbHVkZV9jaGlsZHJlbic9PnRydWVdXV0pOltdOwogICAgJHNvbGQ9W107IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaW0ubWV0YV92YWx1ZSBwaWQsIFNVTShxLm1ldGFfdmFsdWUpIG4sIFNVTSh0Lm1ldGFfdmFsdWUpIHMsIENPVU5UKERJU1RJTkNUIG8uaWQpIHUgRlJPTSB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPWkub3JkZXJfaWQgQU5EIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA4JyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBpbSBPTiBpbS5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBxIE9OIHEub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIHEubWV0YV9rZXk9J19xdHknIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIHQgT04gdC5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgdC5tZXRhX2tleT0nX2xpbmVfdG90YWwnIEdST1VQIEJZIGltLm1ldGFfdmFsdWUiLEFSUkFZX0EpIGFzICR4KSAkc29sZFskeFsncGlkJ11dPSR4OwogICAgJHJvd3M9W107ICRhZ2c9WydwcmVraXUnPT4wLCdpbnN0b2NrJz0+MCwnc3Vfc2F2aWthaW5hJz0+MCwncGFyZF92bnQnPT4wLCdwYXJkX3N1bWEnPT4wLCd1enMnPT4wXTsgJHNyYz1bXTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOyAkbT1nZXRfcG9zdF9tZXRhKCRpZCk7CiAgICAgICRjPW51bGw7IGZvcmVhY2goWydfY29zdF9wcmljZScsJ196Yl9jb3N0JywnX3ZmX2Nvc3QnLCdfcHNfY29zdCddIGFzICRrKSBpZighZW1wdHkoJG1bJGtdWzBdKSl7ICRjPShmbG9hdCkkbVska11bMF07IGJyZWFrOyB9CiAgICAgICRzYW5kPSRtWydfcHNfc2FuZGVsaXMnXVswXT8/Jyc7ICRzcmNbJHNhbmQ/Oidhdj8nXT0oJHNyY1skc2FuZD86J2F2PyddPz8wKSsxOwogICAgICAkcHI9KGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsgJG16PSgkYyYmJHByKT9yb3VuZCgoKCRwci8xLjIxKS0kYykvKCRwci8xLjIxKSoxMDAsMSk6bnVsbDsgJHM9JHNvbGRbJGlkXT8/bnVsbDsKICAgICAgJGFnZ1sncHJla2l1J10rKzsgaWYoJHAtPmlzX2luX3N0b2NrKCkpICRhZ2dbJ2luc3RvY2snXSsrOyBpZigkYykgJGFnZ1snc3Vfc2F2aWthaW5hJ10rKzsgaWYoJHMpeyAkYWdnWydwYXJkX3ZudCddKz0kc1snbiddOyAkYWdnWydwYXJkX3N1bWEnXSs9JHNbJ3MnXTsgfQogICAgICAkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgICAgJHJvd3NbXT1bJGlkLG1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoJHAtPmdldF9uYW1lKCkpLDAsNTApLCRwciwkYywkbXosJHNhbmQsJHAtPmlzX2luX3N0b2NrKCk/MTowLCRzPyhpbnQpJHNbJ24nXTowLCRzP3JvdW5kKCRzWydzJ10sMik6MCxpbXBsb2RlKCcvJyxhcnJheV9zbGljZSgkY2F0cywwLDIpKV07CiAgICB9CiAgICB1c29ydCgkcm93cyxmbigkYSwkYik9PiRiWzhdPD0+JGFbOF0pOyAkclsnYWdnJ109JGFnZzsgJHJbJ3NhbmRlbGlhaSddPSRzcmM7ICRyWyd0b3AnXT1hcnJheV9zbGljZSgkcm93cywwLDQwKTsKICAgICRtenM9YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9jb2x1bW4oJHJvd3MsNCksZm4oJHgpPT4keCE9PW51bGwpKTsgc29ydCgkbXpzKTsgJHJbJ21hcnphX21lZGlhbmEnXT0kbXpzPyRtenNbaW50ZGl2KGNvdW50KCRtenMpLDIpXTpudWxsOwogICAgLy8gdXpzYWt5bWFpLCBrdXJpdW9zZSBidXZvIHNrYW5lc3R1LCBpciBqdSBkYWxpcwogICAgJHRvdD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBzdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDgnIik7CiAgICAkaW49JGlkcz9pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJGlkcykpOicwJzsKICAgICRzdT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgby5pZCkgRlJPTSB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPWkub3JkZXJfaWQgQU5EIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA4JyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBpbSBPTiBpbS5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBBTkQgaW0ubWV0YV92YWx1ZSBJTigkaW4pIik7CiAgICAkclsndXpzYWt5bWFpX3Zpc28nXT0kdG90OyAkclsndXpzYWt5bWFpX3N1X3NrYW5lc3RhaXMnXT0kc3U7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-135632';
const GKEY='ps_s1773a';
const PHASES=["1"];
const OUT='out/s1773a.json';
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
