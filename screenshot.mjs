process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYSDigJQgUkVBRC1PTkxZOiBhdl9sYXVrYXMvYXZfZGFiYXIvdGlla2Vqb19sYXVrYXMgKyBkdmlzYWx0aW5pdSBwcmVraXUgYnVrbGUuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY5YSddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjY5IGEnKTsKICAkTD1leHBsb2RlKCJcbiIsZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJykpOwogICRkdW1wPWZ1bmN0aW9uKCRuZWVkbGUsJGxlbiwkaykgdXNlKCRMLCYkbyl7CiAgICBmb3JlYWNoKCRMIGFzICRuPT4kbCl7IGlmKHN0cnBvcygkbCwkbmVlZGxlKSE9PWZhbHNlKXsKICAgICAgZm9yKCRpPSRuOyRpPCRuKyRsZW4gJiYgaXNzZXQoJExbJGldKTskaSsrKSAkb1ska11bXT0oJGkrMSkuJyAnLm1iX3N1YnN0cihydHJpbSgkTFskaV0pLDAsMTkwKTsKICAgICAgcmV0dXJuOyB9IH0KICAgICRvWyRrXT0nTkVSQVNUQSAnLiRuZWVkbGU7CiAgfTsKICAkZHVtcCgnZnVuY3Rpb24gYXZfbGF1a2FzJywyMiwnYXZfbGF1a2FzJyk7CiAgJGR1bXAoJ2Z1bmN0aW9uIGF2X2RhYmFyJywxOCwnYXZfZGFiYXInKTsKICAkZHVtcCgnZnVuY3Rpb24gdGlla2Vqb19sYXVrYXMnLDIwLCd0aWVrZWpvX2xhdWthcycpOwoKICBnbG9iYWwgJHdwZGI7CiAgLy8gcHJla2VzLCBrdXJpb3MgdHVyaSBfb3duX3N0b2NrX3F0eSBJUiBuZS1hdiBzYW5kZWxpCiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwgcG0xLm1ldGFfdmFsdWUgQVMgc2FuZCwgcG0yLm1ldGFfdmFsdWUgQVMgb3duLCBwbTMubWV0YV92YWx1ZSBBUyBzdG9jaywgcG00Lm1ldGFfdmFsdWUgQVMgbWFuYWdlCiAgICBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0xIE9OIHBtMS5wb3N0X2lkPXAuSUQgQU5EIHBtMS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJwogICAgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtMiBPTiBwbTIucG9zdF9pZD1wLklEIEFORCBwbTIubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JwogICAgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtMyBPTiBwbTMucG9zdF9pZD1wLklEIEFORCBwbTMubWV0YV9rZXk9J19zdG9jaycKICAgIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwbTQgT04gcG00LnBvc3RfaWQ9cC5JRCBBTkQgcG00Lm1ldGFfa2V5PSdfbWFuYWdlX3N0b2NrJwogICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwbTIubWV0YV92YWx1ZSBJUyBOT1QgTlVMTAogICAgT1JERVIgQlkgcC5JRCBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKICAkb1snc3Vfb3duJ109Y291bnQoJHJvd3MpOwogICRhbD1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9LYXRhbG9nYXMnLCdhdl9sYXVrYXMnKTsgJGFsLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICRhZD1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9LYXRhbG9nYXMnLCdhdl9kYWJhcicpOyAkYWQtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgZm9yZWFjaChhcnJheV9zbGljZSgkcm93cywwLDE1KSBhcyAkcil7CiAgICAkcGlkPShpbnQpJHJbJ0lEJ107CiAgICAkb1sncHJla2VzJ11bXT1hcnJheSgnaWQnPT4kcGlkLCdzYW5kJz0+JHJbJ3NhbmQnXSwnb3duJz0+JHJbJ293biddLCdfc3RvY2snPT4kclsnc3RvY2snXSwnbWFuYWdlJz0+JHJbJ21hbmFnZSddLAogICAgICAnYXZfbGF1a2FzJz0+JGFsLT5pbnZva2UobnVsbCwkcGlkKSwnYXZfZGFiYXInPT4kYWQtPmludm9rZShudWxsLCRwaWQpKTsKICB9CiAgLy8ga2llayBpcyB2aXNvIG5lLWF2IHNhbmRlbGl1IHByZWtpdSB0dXJpIF9vd25fc3RvY2tfcXR5CiAgJG9bJ25lX2F2X3N1X293biddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IGEKICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gYiBPTiBiLnBvc3RfaWQ9YS5wb3N0X2lkIEFORCBiLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBiLm1ldGFfdmFsdWU8PidhdicKICAgIFdIRVJFIGEubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyIpOwogICRvWydhdl9zdV9vd24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBhCiAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGIgT04gYi5wb3N0X2lkPWEucG9zdF9pZCBBTkQgYi5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgYi5tZXRhX3ZhbHVlPSdhdicKICAgIFdIRVJFIGEubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyIpOwogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-172707';
const GKEY='ps_s1669a';
const PHASES=["GO"];
const OUT='analize/s1669_a.json';
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
