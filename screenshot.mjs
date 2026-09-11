process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzAgcSDigJQgUkVBRC1PTkxZOiBWRiBsYWnFoWtvIGtlbGlhcyDigJQgV1AgTWFpbCBTTVRQIG51c3RhdHltYWksIEROUyAoU1BGL0RLSU0vRE1BUkMpLCBkcm9wc2hpcCBsYWnFoWtvIGtvZGFzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY3MHEnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY3MCBxJyk7IGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgICAkcz1nZXRfb3B0aW9uKCd3cF9tYWlsX3NtdHAnKTsgaWYoaXNfYXJyYXkoJHMpKXsgYXJyYXlfd2Fsa19yZWN1cnNpdmUoJHMsZnVuY3Rpb24oJiR2LCRrKXsgaWYocHJlZ19tYXRjaCgnL3Bhc3N8c2VjcmV0fGtleXx0b2tlbnxjbGllbnRfaWQvaScsKHN0cmluZykkaykgJiYgJHYhPT0nJykgJHY9JyoqKic7IH0pOyB9CiAgICAkb1snd3BtcyddPSRzOyAkb1snd3Btc192ZXInXT1kZWZpbmVkKCdXUE1TX1BMVUdJTl9WRVInKT9XUE1TX1BMVUdJTl9WRVI6bnVsbDsKICAgICRvWydha3R5dnVzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSxmdW5jdGlvbigkcCl7cmV0dXJuIHByZWdfbWF0Y2goJy9tYWlsfHNtdHB8cG9zdG1hbnxzZW5kZXIvaScsJHApO30pKTsKICAgIGZvcmVhY2goYXJyYXkoJ3BldHNob3AubHQnLCd2ZXRmYXJtYXMubHQnKSBhcyAkZG9tKXsKICAgICAgJG9bJ2RucyddWyRkb21dWydteCddPWFycmF5X21hcChmdW5jdGlvbigkcil7cmV0dXJuICRyWydwcmknXS4nICcuJHJbJ3RhcmdldCddO30sKGFycmF5KUBkbnNfZ2V0X3JlY29yZCgkZG9tLEROU19NWCkpOwogICAgICAkb1snZG5zJ11bJGRvbV1bJ3R4dCddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ3R4dCddPz8nJzt9LChhcnJheSlAZG5zX2dldF9yZWNvcmQoJGRvbSxETlNfVFhUKSksZnVuY3Rpb24oJHQpe3JldHVybiBzdHJpcG9zKCR0LCdzcGYnKSE9PWZhbHNlfHxzdHJpcG9zKCR0LCd2ZXJpZmljYXRpb24nKSE9PWZhbHNlO30pKTsKICAgICAgJG9bJ2RucyddWyRkb21dWydkbWFyYyddPWFycmF5X21hcChmdW5jdGlvbigkcil7cmV0dXJuICRyWyd0eHQnXT8/Jyc7fSwoYXJyYXkpQGRuc19nZXRfcmVjb3JkKCdfZG1hcmMuJy4kZG9tLEROU19UWFQpKTsgfQogICAgZm9yZWFjaChhcnJheSgnZGVmYXVsdCcsJ3gnLCdtYWlsJywnZGtpbScsJ3NlbGVjdG9yMScsJ2dvb2dsZScsJ3MxJywnazEnKSBhcyAkc2VsKXsgJHI9QGRuc19nZXRfcmVjb3JkKCRzZWwuJy5fZG9tYWlua2V5LnBldHNob3AubHQnLEROU19UWFQpOyBpZigkcikgJG9bJ2RraW0nXVskc2VsXT1tYl9zdWJzdHIoJHJbMF1bJ3R4dCddPz8nJywwLDYwKTsgfQogICAgJG9bJ2FfcGV0c2hvcCddPWdldGhvc3RieW5hbWVsKCdwZXRzaG9wLmx0Jyk7ICRvWydob3N0bmFtZSddPWdldGhvc3RuYW1lKCk7CiAgICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5pcGlmeS5vcmcnLGFycmF5KCd0aW1lb3V0Jz0+MTApKTsgJG9bJ2lzb3JpbmlzX2lwJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgICRvWydwdHInXT1pc19zdHJpbmcoJG9bJ2lzb3JpbmlzX2lwJ10pJiZmaWx0ZXJfdmFyKCRvWydpc29yaW5pc19pcCddLEZJTFRFUl9WQUxJREFURV9JUCk/Z2V0aG9zdGJ5YWRkcigkb1snaXNvcmluaXNfaXAnXSk6bnVsbDsKICAgIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpKSBhcyAkZil7ICRMPUBmaWxlKCRmKTsgaWYoISRMKSBjb250aW51ZTsgJHR4dD1pbXBsb2RlKCcnLCRMKTsgaWYoc3RycG9zKCR0eHQsJ19wc19kcm9wc2hpcF9zZW50Jyk9PT1mYWxzZSAmJiBzdHJwb3MoJHR4dCwnUGVyZHVvdGEgdGlla8SXanVpJyk9PT1mYWxzZSkgY29udGludWU7CiAgICAgIGZvcmVhY2goJEwgYXMgJGk9PiRsKSBpZihwcmVnX21hdGNoKCcvd3BfbWFpbFxzKlwofENjOnxCY2M6fEZyb206fFJlcGx5LVRvfGhlYWRlcnNcW1xdfGtvcGlqfHRlcnJhQHx2ZXRmYXJtYXN8LT5hZGRDQ3wtPmFkZEJDQy9pJywkbCkpICRvWydrb2RhcyddW2Jhc2VuYW1lKCRmKV1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDIwMCkpOyB9CiAgICAkb1snc210cF9rbGFpZG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY3JlYXRlZF9hdCwgTEVGVChjb250ZW50LDMwMCkgYywgaW5pdGlhdG9yIEZST00geyR3cGRiLT5wcmVmaXh9d3BtYWlsc210cF9kZWJ1Z19ldmVudHMgV0hFUkUgY3JlYXRlZF9hdCA+PSAnMjAyNi0wOS0wOScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAgICRvWydhZG1pbl9lbWFpbCddPWdldF9vcHRpb24oJ2FkbWluX2VtYWlsJyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-084706';
const GKEY='ps_s1670q';
const PHASES=["A"];
const OUT='analize/s1670_q.json';
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
