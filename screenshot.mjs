process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODggbSDigJQgIzEwNTg6IHJhc3RpIGlkLCBMUCBudW1lcsSvIGnFoSBwYXN0YWLFsyAoQ0PigKZMVCksIMSvcmHFoXl0aSBfd29vX2xpdGh1YW5pYXBvc3RfYmFyY29kZSBqZWkgdHXFocSNaWEsIGlzc2l1c3RhKCRvLCR1LHRydWUsJ2F2JywnbHAnKTsgcGF0aWtyYS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODhtJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2ODggbScpOwogICRpZD0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9yZGVyX2lkIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfb3JkZXJfbnVtYmVyJyBBTkQgbWV0YV92YWx1ZT0nMTA1OCciKTsgaWYoISRpZCl7IGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIHN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLW9uLWhvbGQnKSIpIGFzICRpKSBpZih3Y19nZXRfb3JkZXIoJGkpLT5nZXRfb3JkZXJfbnVtYmVyKCk9PScxMDU4Jyl7ICRpZD0kaTsgYnJlYWs7IH0gfQogIGlmKCEkaWQpeyAkb1snU1RPUCddPSduZXJhc3Rhcyc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9ICR3PXdjX2dldF9vcmRlcigkaWQpOyAkb1snaWQnXT0kaWQ7ICRvWydwcmllcyddPSR3LT5nZXRfc3RhdHVzKCk7ICRvWydzbSddPWltcGxvZGUoJ3wnLGFycmF5X21hcChmdW5jdGlvbigkcyl7cmV0dXJuICRzLT5nZXRfbmFtZSgpO30sJHctPmdldF9zaGlwcGluZ19tZXRob2RzKCkpKTsKICAkbm90ZXM9d2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4zMCkpOyAkYmM9Jyc7IGZvcmVhY2goJG5vdGVzIGFzICRuKXsgaWYocHJlZ19tYXRjaCgnL1xiKFtBLVpdezJ9XGR7OX1MVClcYi8nLHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwkbSkpeyAkYmM9JG1bMV07IGJyZWFrOyB9IH0KICAkb1sncGFzdGFib3MnXT1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiAkbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLnN1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwxMTApO30sYXJyYXlfc2xpY2UoJG5vdGVzLDAsNikpOwogIGlmKCEkYmMpeyAkb1snU1RPUCddPSdMUCBudW1lcmlzIHBhc3RhYm9zZSBuZXJhc3Rhcyc7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0gJG9bJ2JjJ109JGJjOwogIGlmKCEkdy0+Z2V0X21ldGEoJ193b29fbGl0aHVhbmlhcG9zdF9iYXJjb2RlJykpeyAkdy0+dXBkYXRlX21ldGFfZGF0YSgnX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUnLCRiYyk7ICR3LT5hZGRfb3JkZXJfbm90ZSgnUzE2ODg6IExQIHNla2ltbyBudW1lcmlzICcuJGJjLicgxK9yYcWheXRhcyBpxaEgdmlkaW7El3MgcGFzdGFib3MgKFJhaW1pcyDEr2TEl2pvIMSvIExQIHBhxaF0b21hdMSFIDA5LTE2KS4nLGZhbHNlLHRydWUpOyAkdy0+c2F2ZSgpOyB9CiAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywncmFpbWlzJyk7IGlmKCEkdSl7ICR1cz1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ3NlYXJjaCc9PicqYWltKicsJ3NlYXJjaF9jb2x1bW5zJz0+YXJyYXkoJ3VzZXJfbG9naW4nLCdkaXNwbGF5X25hbWUnKSkpOyAkdT0kdXM/JHVzWzBdOm51bGw7IH0KICAkdz13Y19nZXRfb3JkZXIoJGlkKTsgJG9bJ2lzc2l1c3RhJ109UGV0c2hvcF9EYXJiYWxhdWtpczo6aXNzaXVzdGEoJHcsJHUsdHJ1ZSwnYXYnLCdscCcpOwogICR3PXdjX2dldF9vcmRlcigkaWQpOyAkb1sncG8nXT0kdy0+Z2V0X3N0YXR1cygpOyAkb1snZGFseXMnXT0kdy0+Z2V0X21ldGEoJ19wc19kYWx5c19pc3NpdXN0YScpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-141034';
const GKEY='ps_s1688m';
const PHASES=["A"];
const OUT='analize/s1688_m.json';
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
