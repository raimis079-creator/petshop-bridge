process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzcgcnVuIGIg4oCUIEJlbGFjb3IgVG9mdSAoUmFpbWlvIHBsYW5hcyk6IDE3IEJlbG9DYXQ6IGZpemluaXMgKGnFoSBrb3Bpam9zIHByaWVzLW51bGluaW1hKSDihpIgX293bl9zdG9ja19xdHkgKyBwYXJ0aWphIChwcmlpbXRpIDIuMzAsIHBvIHRvIGxhdWthaSBDUlVELCBuZXMgcGFydGlqxbMgdmFyaWtsaXMgYmVsY29yJ3VpIHJhxaFvIMSvIF9zdG9jayDigJQgUzU5MC92OC4wIG5lc3V0YXBpbWFzKTsgX3N0b2NrIChUSUVLxJZKTyBCZWxhY29yKSA9IDgwLCBwdcWhaWFpICMxNzY3MSBpciBwZXJzaWt1aSAjMTc2NzcgPSAwLiBQdXJyZmVjdCAxNzcxMC8xNzcxNC8xNzcxOSDihpIgX3BzX3NhbmRlbGlzPWF2LCBraWVraWFpIG5la2VpxI1pYW1pLiBCOiB2eWtkeW1hcyArIGtyecW+bWluxJcuIFI6IGRyeS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzdiJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX3MxNjM3YiddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjM3IGInLCdmJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRiZWxvY2F0PWFycmF5KDE3NjU5LDE3NjYyLDE3NjY1LDE3NjY4LDE3NjcxLDE3Njc0LDE3Njc3LDE3NjgwLDE3NjgzLDE3Njg2LDE3Njg5LDE3NjkyLDE3Njk1LDE3Njk4LDE3NzAxLDE3NzA0LDE3NzA3KTsKICAkbnVsaXM9YXJyYXkoMTc2NzEsMTc2NzcpOyAkcHVycj1hcnJheSgxNzcxMCwxNzcxNCwxNzcxOSk7CiAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGc9Z2xvYigkdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMvbGlrdWNpYWktcHJpZXMtbnVsaW5pbWEtKi9zdG9ja19tZXRhLmpzb24uZ3onKTsKICBpZighJGcpeyAkb1snU1RPUCddPSdrb3Bpam9zIG5lcmFkYXUnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogIHNvcnQoJGcpOyAkYmtmPWVuZCgkZyk7ICRvWydrb3BpamEnXT1iYXNlbmFtZShkaXJuYW1lKCRia2YpKTsKICAkbWV0YT1qc29uX2RlY29kZShnemRlY29kZShmaWxlX2dldF9jb250ZW50cygkYmtmKSksdHJ1ZSk7ICRmaXo9YXJyYXkoKTsKICBmb3JlYWNoKCRtZXRhIGFzICRtKXsgaWYoJG1bJ21ldGFfa2V5J109PT0nX3N0b2NrJyAmJiBpbl9hcnJheSgoaW50KSRtWydwb3N0X2lkJ10sJGJlbG9jYXQsdHJ1ZSkpICRmaXpbKGludCkkbVsncG9zdF9pZCddXT0oaW50KSRtWydtZXRhX3ZhbHVlJ107IH0KICAkcGxhbj1hcnJheSgpOwogIGZvcmVhY2goJGJlbG9jYXQgYXMgJHBpZCl7ICR4PSRmaXpbJHBpZF0/PzA7CiAgICAkcGxhbltdPWFycmF5KCdwaWQnPT4kcGlkLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpLCdmaXpfYXYnPT4keCwnYmVsYWNvcic9PmluX2FycmF5KCRwaWQsJG51bGlzLHRydWUpPzA6ODApOyB9CiAgJG9bJ3BsYW5hcyddPSRwbGFuOwogIGlmKCRmPT09J0InKXsKICAgICRyPWFycmF5KCdwYXJ0aWp1Jz0+MCwna2xhaWRvcyc9PmFycmF5KCkpOwogICAgZm9yZWFjaCgkcGxhbiBhcyAkeCl7ICRwaWQ9JHhbJ3BpZCddOwogICAgICBpZigkeFsnZml6X2F2J10+MCl7CiAgICAgICAgJHByPVBldHNob3BfUGFydGlqb3M6OnByaWltdGkoJHBpZCxhcnJheSgna2lla2lzJz0+JHhbJ2Zpel9hdiddLCdzYXZpa2FpbmEnPT4nMi4zMCcsJ3ZhbGl1dGEnPT4nRVVSJywna3Vyc2FzJz0+MSwndGlla2VqYXMnPT4nQmVsYWNvcicsJ2dhdXRhJz0+Y3VycmVudF90aW1lKCdZLW0tZCcpLCdpbXBvcnR1b3RhJz0+MSwncGFzdGFiYSc9PidGaXppbmlzIGxpa3V0aXMgKFRvZnUgaSBBViwgUzE2MzcpJykpOwogICAgICAgIGlmKGlzX3dwX2Vycm9yKCRwcikpeyAkclsna2xhaWRvcyddW109JHhbJ3NrdSddLic6ICcuJHByLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBjb250aW51ZTsgfQogICAgICAgICRyWydwYXJ0aWp1J10rKzsKICAgICAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5JywkeFsnZml6X2F2J10pOyAvLyBBViBsZW50eW5hICh2OC4wIGJlbGNvciB0YWlzeWtsxJcpCiAgICAgIH0KICAgICAgJHc9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7ICR3LT5zZXRfbWFuYWdlX3N0b2NrKHRydWUpOyAkdy0+c2V0X3N0b2NrX3F1YW50aXR5KCR4WydiZWxhY29yJ10pOyAkdy0+c2F2ZSgpOyAvLyBUSUVLxJZKTyBCZWxhY29yIGxhdWthcwogICAgfQogICAgZm9yZWFjaCgkcHVyciBhcyAkcGlkKXsgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLCdhdicpOyB9CiAgICAvLyBrcnnFvm1pbsSXCiAgICAkaz1hcnJheSgnbmVzdXRhbXBhJz0+YXJyYXkoKSk7CiAgICBmb3JlYWNoKCRwbGFuIGFzICR4KXsgJHBpZD0keFsncGlkJ107CiAgICAgICRvd249KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsgJHN0PShpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgICAkcGw9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShraWVraXNfbGlrbyksMCkgRlJPTSB7JHB9cHNfcGFydGlqb3MgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgcGFzdGFiYSBMSUtFICdGaXppbmlzIGxpa3V0aXMgKFRvZnUlJSciLCRwaWQpKTsKICAgICAgaWYoJG93biE9PSR4WydmaXpfYXYnXXx8JHN0IT09JHhbJ2JlbGFjb3InXXx8JHBsIT09JHhbJ2Zpel9hdiddKSAka1snbmVzdXRhbXBhJ11bXT0keFsnc2t1J10uIiBvd24kb3duL3skeFsnZml6X2F2J119IHN0JHN0L3skeFsnYmVsYWNvciddfSBwYXJ0JHBsIjsKICAgIH0KICAgIGZvcmVhY2goJHB1cnIgYXMgJHBpZCl7IGlmKGdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSE9PSdhdicpICRrWyduZXN1dGFtcGEnXVtdPSJwdXJyICRwaWQgc2FuZCI7IH0KICAgICRrWydvd25fc3VtYV90b2Z1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPQUxFU0NFKFNVTShtZXRhX3ZhbHVlKzApLDApIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgQU5EIHBvc3RfaWQgSU4gKCIuaW1wbG9kZSgnLCcsJGJlbG9jYXQpLiIpIik7CiAgICAka1sncHVycl9zYW5kJ109YXJyYXkoKTsgZm9yZWFjaCgkcHVyciBhcyAkcGlkKSAka1sncHVycl9zYW5kJ11bJHBpZF09Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLicvc3QnLihpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgJG9bJ2FwcGx5J109JHI7ICRvWydrcnl6bWluZSddPSRrOwogICAgJG9bJ3BpbmcnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-194411';
const GKEY='ps_s1637b';
const PHASES=["B"];
const OUT='analize/s1637_b.json';
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
