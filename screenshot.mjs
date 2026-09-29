process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwaCBwcmVrZXMgYmUgbnVvdHJhdWt1IHJlY29uICgxIHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwaCddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3NDBoJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MGgnLCdmYXplJz0+JGZdOwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkcGY9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwgbS5tZXRhX3ZhbHVlIHRpZCwgYWYubWV0YV92YWx1ZSBmIEZST00geyR3cGRiLT5wb3N0c30gcCBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3RodW1ibmFpbF9pZCcgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGFmIE9OIGFmLnBvc3RfaWQ9bS5tZXRhX3ZhbHVlIEFORCBhZi5tZXRhX2tleT0nX3dwX2F0dGFjaGVkX2ZpbGUnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgJHVwPXdwX2dldF91cGxvYWRfZGlyKCk7ICRiZD10cmFpbGluZ3NsYXNoaXQoJHVwWydiYXNlZGlyJ10pOyAkaWRzPVtdOwogICAgZm9yZWFjaCgkcGYgYXMgJHgpeyBpZihlbXB0eSgkeFsndGlkJ10pfHxlbXB0eSgkeFsnZiddKXx8IWlzX2ZpbGUoJGJkLiR4WydmJ10pKSAkaWRzW109JHg7IH0KICAgICRyWydraWVrJ109Y291bnQoJGlkcyk7CiAgICAkcG09JHdwZGItPnByZWZpeC4ncG14aV9wb3N0cyc7ICRwaT0kd3BkYi0+cHJlZml4LidwbXhpX2ltcG9ydHMnOyAkaGFzX3BtPShib29sKSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckcG0nIik7CiAgICBmb3JlYWNoKCRpZHMgYXMgJHgpeyAkaWQ9KGludCkkeFsnSUQnXTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsKICAgICAgJG89WydpZCc9PiRpZCwndCc9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw3MCksJ3NrdSc9PiRwLT5nZXRfc2t1KCksJ3RpcGFzJz0+JHAtPmdldF90eXBlKCksJ3N0b2NrJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKS4nLycuJHAtPmdldF9zdG9ja19xdWFudGl0eSgpLCdzdWt1cnRhJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfZGF0ZScsJGlkKSwna2Vpc3RhJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbW9kaWZpZWQnLCRpZCksJ3RpZCc9PiR4Wyd0aWQnXSwnZic9PiR4WydmJ10sJ3RpZF9wb3N0Jz0+JHhbJ3RpZCddP2dldF9wb3N0X3N0YXR1cygoaW50KSR4Wyd0aWQnXSk6bnVsbCwnZ2FsZXJpamEnPT4kcC0+Z2V0X2dhbGxlcnlfaW1hZ2VfaWRzKCksJ3BhcmRhdmltYWknPT4oaW50KWdldF9wb3N0X21ldGEoJGlkLCd0b3RhbF9zYWxlcycsdHJ1ZSldOwogICAgICBpZigkeFsnZiddKSAkb1snZmFpbGFzX3lyYSddPWlzX2ZpbGUoJGJkLiR4WydmJ10pOwogICAgICBpZigkb1sndGlkJ10gJiYgISRvWydmJ10pICRvWyd0aWRfbWltZSddPWdldF9wb3N0X21pbWVfdHlwZSgoaW50KSR4Wyd0aWQnXSk7CiAgICAgICRnPVtdOyBmb3JlYWNoKCRvWydnYWxlcmlqYSddIGFzICRnaWQpeyAkZ2Y9Z2V0X2F0dGFjaGVkX2ZpbGUoJGdpZCk7ICRnW109JGdpZC4nOicuKCRnZiYmaXNfZmlsZSgkZ2YpPydvayc6J25lcmEnKTsgfSAkb1snZ2FsZXJpamEnXT0kZzsKICAgICAgaWYoJGhhc19wbSl7ICRvWyd3cGFpJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcC5pbXBvcnRfaWQsIGkuZnJpZW5kbHlfbmFtZSwgaS5uYW1lIEZST00gJHBtIHBwIExFRlQgSk9JTiAkcGkgaSBPTiBpLmlkPXBwLmltcG9ydF9pZCBXSEVSRSBwcC5wb3N0X2lkPSVkIExJTUlUIDEiLCRpZCksQVJSQVlfQSk7IH0KICAgICAgJG1rPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LCBMRUZUKG1ldGFfdmFsdWUsODApIHYgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnXF9wcyUlJyBPUiBtZXRhX2tleSBMSUtFICclJXRpZWslJScgT1IgbWV0YV9rZXkgTElLRSAnJSVpbWFnZSUlJyBPUiBtZXRhX2tleSBMSUtFICclJWZvdG8lJScgT1IgbWV0YV9rZXkgTElLRSAnJSVudW90ciUlJykiLCRpZCksQVJSQVlfQSk7CiAgICAgICRvWydtZXRhJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRhKXtyZXR1cm4gJGFbJ21ldGFfa2V5J10uJz0nLiRhWyd2J107fSwkbWspOwogICAgICAkb1sncGFyZW50J109JHAtPmdldF9wYXJlbnRfaWQoKTsKICAgICAgLy8gYXIgeXJhIGtpdGEgcHJla2UgdHVvIHBhY2l1IHBhdmFkaW5pbXUgc3UgbnVvdHJhdWthCiAgICAgICRvWydkdnlueXMnXT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHAyLklEIEZST00geyR3cGRiLT5wb3N0c30gcDIgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtMiBPTiBtMi5wb3N0X2lkPXAyLklEIEFORCBtMi5tZXRhX2tleT0nX3RodW1ibmFpbF9pZCcgV0hFUkUgcDIucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcDIuSUQ8PiVkIEFORCBwMi5wb3N0X3RpdGxlPSVzIExJTUlUIDEiLCRpZCxnZXRfdGhlX3RpdGxlKCRpZCkpKTsKICAgICAgJHJbJ3AnXVtdPSRvOyB9CiAgICAkclsnenVybmFsYXNfcGFza3V0aW5pYWknXT1hcnJheV9zbGljZSgoYXJyYXkpZ2V0X29wdGlvbigncHNfbnVvdHJfenVybmFsYXMnLFtdKSwtNSk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-183556';
const GKEY='ps_s1740h';
const PHASES=["1"];
const OUT='analize/s1740h.json';
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
