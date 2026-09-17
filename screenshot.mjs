process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTAgZiDigJQga29kxJdsIG5lYXRlaW5hIOKAnk5hdWphcyB1xb5zYWt5bWFzIiBsYWnFoWthaS4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5MGYnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRvWydkYWJhciddPWN1cnJlbnRfdGltZSgnbXlzcWwnKTsKICAkaWRzPXdjX2dldF9vcmRlcnMoYXJyYXkoJ2xpbWl0Jz0+NCwnb3JkZXJieSc9PidpZCcsJ29yZGVyJz0+J0RFU0MnLCdyZXR1cm4nPT4naWRzJykpOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkb3JkPXdjX2dldF9vcmRlcigkaWQpOyAkbj1hcnJheSgpOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+MTApKSBhcyAkbnQpICRuW109JG50LT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ0g6aScpLicgJy5tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRudC0+Y29udGVudCksMCw5MCk7CiAgICAkb1sndXpzJ11bXT1hcnJheSgnaWQnPT4kaWQsJ3N0Jz0+JG9yZC0+Z2V0X3N0YXR1cygpLCdwbSc9PiRvcmQtPmdldF9wYXltZW50X21ldGhvZCgpLCd1aWQnPT4kb3JkLT5nZXRfY3VzdG9tZXJfaWQoKSwnc3VrdXJ0YXMnPT4kb3JkLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ0g6aScpLCdwcmlza2lydGEnPT4kb3JkLT5nZXRfbWV0YSgnX3BzX3Bhc2t5cmFfcHJpc2tpcnRhJyksJ3Bhc3RhYm9zJz0+JG4pOyB9CiAgJG9bJ2FkbWluX2VtYWlsJ109Z2V0X29wdGlvbignYWRtaW5fZW1haWwnKTsgJG9bJ3djX25ld19vcmRlciddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX25ld19vcmRlcl9zZXR0aW5ncycpOwogICRvWydzbXRwJ109YXJyYXlfaW50ZXJzZWN0X2tleSgoYXJyYXkpZ2V0X29wdGlvbignd3BfbWFpbF9zbXRwJyksYXJyYXlfZmxpcChhcnJheSgnbWFpbCcsJ3NtdHAnKSkpOyBpZihpc3NldCgkb1snc210cCddWydzbXRwJ11bJ3Bhc3MnXSkpICRvWydzbXRwJ11bJ3NtdHAnXVsncGFzcyddPScqKionOwogICRvWydzbXRwX2RlYnVnJ109Z2V0X29wdGlvbignd3BfbWFpbF9zbXRwX2RlYnVnJyk7CiAgJHQ9JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skcH13cG1haWxzbXRwX2VtYWlsc19sb2cnIik7ICRvWydzbXRwX2xvZ19sZW50ZWxlJ109JHQ7CiAgaWYoJHQpeyAkb1snc210cF9sb2cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgc3ViamVjdCwgcGVvcGxlLCBzdGF0dXMsIGRhdGVfc2VudCwgTEVGVChlcnJvcl90ZXh0LDIwMCkgZXJyIEZST00gJHQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMiIsQVJSQVlfQSk7IH0KICAkb1sncHNfZW1haWxfam9icyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBmbG93X2tleSwgc3RhdHVzLCBMRUZUKHNraXBfcmVhc29uLDYwKSBzaywgY3JlYXRlZF9hdCBGUk9NIHskcH1wc19lbWFpbF9qb2JzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNiIsQVJSQVlfQSk7CiAgJG9bJ2Rldl9wYXN0YXMnXT1hcnJheSgnaG9zdCc9PiRfU0VSVkVSWydIVFRQX0hPU1QnXSwndHJhbnNpZW50Jz0+Z2V0X3RyYW5zaWVudCgncHNfcHJlX3dwX21haWxfZ2F0ZScpLCdtdSc9PmFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKnBhc3RhcyoucGhwJykpKTsKICAkb1snbXVfbmF1amF1c2knXT1hcnJheV9tYXAoZnVuY3Rpb24oJGYpe3JldHVybiBiYXNlbmFtZSgkZikuJyAnLmRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZikpO30sYXJyYXlfc2xpY2UoYXJyYXlfcmV2ZXJzZShhcnJheV9tYXAobnVsbCxnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykpKSwwLDApKTsgCiAgJGZzPWdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKTsgdXNvcnQoJGZzLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gZmlsZW10aW1lKCRiKS1maWxlbXRpbWUoJGEpO30pOyAkb1snbXVfbmF1amF1c2knXT1hcnJheV9tYXAoZnVuY3Rpb24oJGYpe3JldHVybiBiYXNlbmFtZSgkZikuJyAnLmRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZikpO30sYXJyYXlfc2xpY2UoJGZzLDAsNikpOwogICRsZj1BQlNQQVRILicuLi9sb2dzL3BocF9lcnJvci5sb2cnOyAkb1sncGhwX2xvZ190YWlsJ109ZmlsZV9leGlzdHMoJGxmKT9hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIoJHgsMCwyMDApO30sYXJyYXlfc2xpY2UoZmlsZSgkbGYpLC04KSk6J25lcmEnOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-171040';
const GKEY='ps_s1690f';
const PHASES=["ps_s1690f"];
const OUT='analize/s1690_f.json';
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
