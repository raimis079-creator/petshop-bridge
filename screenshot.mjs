process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzExYiddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHI9W107CiAgJHJbJ2xlZ2FjeV9ibG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3RfdHlwZSxwLnBvc3Rfc3RhdHVzLHAucG9zdF9uYW1lLG0ubWV0YV9rZXksbS5tZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gbSBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD1tLnBvc3RfaWQgV0hFUkUgbS5tZXRhX2tleSBJTiAoJ19wZXRzaG9wX2xlZ2FjeV91cmwnLCdfcGV0c2hvcF9sZWdhY3lfc2x1ZycpIEFORCBwLnBvc3RfdHlwZSBJTiAoJ3Bvc3QnLCdwYWdlJykgTElNSVQgODAiLEFSUkFZX0EpOwogICRyWydwb3N0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X3N0YXR1cyxwb3N0X2RhdGUgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Bvc3QnIE9SREVSIEJZIElEIixBUlJBWV9BKTsKICAkclsnYmxvZ19sZWdhY3lfYW55J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCxtZXRhX2tleSxtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV92YWx1ZSBMSUtFICclYmxvZ2lkJScgTElNSVQgMjAiLEFSUkFZX0EpOwogICRtYXA9anNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJyksdHJ1ZSk7CiAgJHJbJ21hcF9zYW1wbGUnXT1hcnJheV9zbGljZSgkbWFwLDAsNSx0cnVlKTsKICAkclsnbWFwX2Jsb2dpc2gnXT1hcnJheV9zbGljZShhcnJheV9maWx0ZXIoJG1hcCxmdW5jdGlvbigkdiwkayl7cmV0dXJuIHByZWdfbWF0Y2goJy9zdHJhaXBzfGJsb2d8cGF0YXJ8bWFzdGlmfHRha3MvJywkay4nICcuKGlzX3N0cmluZygkdik/JHY6anNvbl9lbmNvZGUoJHYpKSk7fSxBUlJBWV9GSUxURVJfVVNFX0JPVEgpLDAsNDAsdHJ1ZSk7CiAgJHBhdGhzPVsndHJpeGllLWtpbGltZWxpcy1wdXJ2dWktc3VyaW5rdGktMTIwLTgwLWNtJywna2lhdWxlcy1zbmlwYXMtYmFsdGFzJywnYXV0b21hdGluZS1zZXJ5a2xhLWthdGVpc3VuaXVpJywna3JhaWthcy1rYXRlbXMtdG9mdS1iZWxvY2F0LW9yaWdpbmFsLWJla3ZhcGlzLTYtbC0yLTUta2ctMi1tbS1ncmFudWxlcycsJ3N0ZXJpbGl6dW90dS1rYWNpdS1tYWlzdGFzJywnc2F0dXJuLXBldGNhcmUtZ21iaC1hdGhlbmEnLCdmaW5uZXJuLWdtYmgtYW5kLWNvJywnc2FsZHppb3Npb3MtYnVsdmVzLWFwdnluaW90b3MtYW50aWVuYS01MDAtZy1uYXR1cmFsdXMtc2thbmVzdGFpLXN1bmltcy1oYXUtYW5kLW1pYXUnXTsKICBmb3JlYWNoKCRwYXRocyBhcyAkcCl7CiAgICAkdz1hcnJheV9maWx0ZXIoZXhwbG9kZSgnLScsJHApLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RybGVuKCR4KT49NTt9KTsgJHc9YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKCR3KSwwLDMpOwogICAgJGxpa2U9aW1wbG9kZSgnIEFORCAnLGFycmF5X21hcChmdW5jdGlvbigkeCl1c2UoJHdwZGIpe3JldHVybiAkd3BkYi0+cHJlcGFyZSgncG9zdF9uYW1lIExJS0UgJXMnLCclJy4kd3BkYi0+ZXNjX2xpa2Uoc3Vic3RyKCR4LDAsNikpLiclJyk7fSwkdykpOwogICAgJHJbJ2NhbmQnXVskcF09JGxpa2U/JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF9uYW1lLHBvc3Rfc3RhdHVzLHBvc3RfdHlwZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwb3N0JywncGFnZScpIEFORCAoJGxpa2UpIE9SREVSIEJZIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBERVNDIExJTUlUIDYiLEFSUkFZX0EpOltdOwogICAgJHJbJ2xlZ2FjeSddWyRwXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkLG1ldGFfa2V5IEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXkgSU4gKCdfcGV0c2hvcF9sZWdhY3lfc2x1ZycsJ19wZXRzaG9wX2xlZ2FjeV91cmwnKSBBTkQgbWV0YV92YWx1ZSBMSUtFICVzIExJTUlUIDMiLCclJy4kcC4nJScpLEFSUkFZX0EpOwogIH0KICBmb3JlYWNoKFsnc2F0dXJuLXBldGNhcmUnLCdmaW5uZXJuJywnYXRoZW5hJywnaGF1LWFuZC1taWF1JywnaGF1LW1pYXUnXSBhcyAkYil7ICR0PWdldF90ZXJtX2J5KCdzbHVnJywkYiwncHJvZHVjdF9icmFuZCcpOyAkclsnYnJhbmQnXVskYl09JHQ/JHQtPnRlcm1faWQ6bnVsbDsgfQogICRyWydicmFuZHNfbGlrZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQuc2x1Zyx0Lm5hbWUgRlJPTSB7JHdwZGItPnRlcm1zfSB0IEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB4IE9OIHgudGVybV9pZD10LnRlcm1faWQgV0hFUkUgeC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcgQU5EICh0LnNsdWcgTElLRSAnJXNhdHVybiUnIE9SIHQuc2x1ZyBMSUtFICclYXRoZW5hJScgT1IgdC5zbHVnIExJS0UgJyVmaW5uZXJuJScgT1IgdC5zbHVnIExJS0UgJyVoYXUlJyBPUiB0LnNsdWcgTElLRSAnJWJlbG9jYXQlJyBPUiB0LnNsdWcgTElLRSAnJXRyaXhpZSUnKSIsQVJSQVlfQSk7CiAgJHJbJ2NhdHNfbGlrZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQuc2x1Zyx0LnRlcm1faWQgRlJPTSB7JHdwZGItPnRlcm1zfSB0IEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB4IE9OIHgudGVybV9pZD10LnRlcm1faWQgV0hFUkUgeC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCAodC5zbHVnIExJS0UgJyVzdGVyaWwlJyBPUiB0LnNsdWcgTElLRSAnJXNlcnlrbCUnIE9SIHQuc2x1ZyBMSUtFICclc25pcCUnIE9SIHQuc2x1ZyBMSUtFICcla2lsaW1lbCUnIE9SIHQuc2x1ZyBMSUtFICcla3JhaWslJykiLEFSUkFZX0EpOwogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-132844';
const GKEY='ps_s1711b';
const PHASES=["1"];
const OUT='analize/s1711_b.json';
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
