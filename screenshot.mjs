process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzY4YiByZWNvbiBrcmVwc2VsaW8gbGFpc2t1IGtsYXNlLCBzYWJsb25haSwgYXRzaXNha3ltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzY4YiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgJHI9Wyd2Jz0+J1MxNzY4YiddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJGRmPVBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzL2NsYXNzLWVtYWlsLWRpc3BhdGNoLnBocCc7ICRyWydkaXNwYXRjaF9tZDUnXT1pc19maWxlKCRkZik/bWQ1X2ZpbGUoJGRmKTonbmVyYSc7CiAgICAkZmw9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Zmxvd3MoKTsgZm9yZWFjaChbJ2NhcnRfYWJhbmRvbmVkJywnY2FydF9hYmFuZG9uZWRfMicsJ2Jyb3dzZV9hYmFuZG9uZWQnLCdyZWZpbGxfZHVlJywncG9zdF9wdXJjaGFzZV8xNGQnXSBhcyAkZikgJHJbJ2Zsb3dzJ11bJGZdPSRmbFskZl0/P251bGw7CiAgICBmb3JlYWNoKFsnY2FydF9hYmFuZG9uZWQnLCdjYXJ0X2FiYW5kb25lZF8yJ10gYXMgJGYpeyAkc2x1Zz0kZmxbJGZdWyd0ZW1wbGF0ZSddOyAkZGVmPVBFVFNIT1BfQ09SRV9ESVIuJ3RlbXBsYXRlcy9lbWFpbHMvJy4kc2x1Zy4nLnBocCc7ICRwPWFwcGx5X2ZpbHRlcnMoJ3BldHNob3BfZW1haWxfdGVtcGxhdGVfcGF0aCcsJGRlZiwkZiwkc2x1Zyk7ICRyWyd0cGwnXVskZl09WydwYXRoJz0+c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkcCksJ21kNSc9PmlzX2ZpbGUoJHApP21kNV9maWxlKCRwKTonbmVyYScsJ3NyYyc9PmlzX2ZpbGUoJHApP2ZpbGVfZ2V0X2NvbnRlbnRzKCRwKTonJ107CiAgICB9CiAgICAkc3U9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1zdXRpa2ltYWkucGhwJzsgJHJbJ3N1dGlraW1haSddPVsnbWQ1Jz0+aXNfZmlsZSgkc3UpP21kNV9maWxlKCRzdSk6J25lcmEnLCdzcmMnPT5pc19maWxlKCRzdSk/ZmlsZV9nZXRfY29udGVudHMoJHN1KTonJ107CiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsgZm9yZWFjaChbJ3BldHNob3BfZW1haWxfZWxpZ2liaWxpdHknLCdwZXRzaG9wX2VtYWlsX2Zsb3dzJywncGV0c2hvcF9lbWFpbF90ZW1wbGF0ZV9wYXRoJ10gYXMgJGgpeyAkY2I9W107IGlmKGlzc2V0KCR3cF9maWx0ZXJbJGhdKSkgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcmlvPT4kYXJyKSBmb3JlYWNoKCRhcnIgYXMgJGs9PiRjKXsgJGZuPSRjWydmdW5jdGlvbiddOyBpZihpc19hcnJheSgkZm4pKSAkbm09KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV07IGVsc2VpZihpc19zdHJpbmcoJGZuKSkgJG5tPSRmbjsgZWxzZSB7IHRyeXskcmY9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOyAkbm09J2Nsb3N1cmVAJy5iYXNlbmFtZSgkcmYtPmdldEZpbGVOYW1lKCkpLic6Jy4kcmYtPmdldFN0YXJ0TGluZSgpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXskbm09J2Nsb3N1cmUnO30gfSAkY2JbXT0kcHJpby4nICcuJG5tOyB9ICRyWydob29rcyddWyRoXT0kY2I7IH0KICAgICRoaXRzPVtdOyBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoc3RycG9zKCRzLCInY2FydF9hYmFuZG9uZWQnIikhPT1mYWxzZXx8c3RycG9zKCRzLCdjYXJ0X2FiYW5kb25lZF8yJykhPT1mYWxzZSkgJGhpdHNbXT1iYXNlbmFtZSgkZik7IH0gJHJbJ211X2NhcnRfcmVmcyddPSRoaXRzOwogICAgJHJbJ3Vuc3ViX2NsYXNzJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1Vuc3Vic2NyaWJlJyk7ICRyWydzdXRpa2ltYWlfY2xhc3MnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfU3V0aWtpbWFpJyk7ICRyWydvcHRvdXRfbWV0aG9kcyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9TdXRpa2ltYWknKT9nZXRfY2xhc3NfbWV0aG9kcygnUGV0c2hvcF9TdXRpa2ltYWknKTpbXTsKICAgICRyWydzaW1pbGFyX29wdG91dF91c2VycyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9dXNlcm1ldGEgV0hFUkUgbWV0YV9rZXk9J3BzX3NpbWlsYXJfb3B0b3V0JyBBTkQgbWV0YV92YWx1ZT0nMSciKTsKICAgICRyWydvcHRvdXRfb3B0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRU5HVEgob3B0aW9uX3ZhbHVlKSBsIEZST00geyRQfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJW9wdG91dCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVhdHNpc2FrJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXN1cHByZXNzJScgTElNSVQgMjAiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-090822';
const GKEY='ps_s1768b';
const PHASES=["1"];
const OUT='out/s1768b.json';
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
