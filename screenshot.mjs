process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAzIG1nIOKAlCBSYW5rIE1hdGggc2l0ZW1hcCBjYWNoZSBpxaF2YWx5bWFzICsgcGF0aWtyYTsgMiA9IDggc3RyYWlwc25pxbMgKHBvc3QpIG5vaW5kZXggbnXEl21pbWFzIChiYWsgdGEgcGF0aSBvcGNpamEpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTcwM21nJ10pPyRfR0VUWydwc19zMTcwM21nJ106JycpOyBpZighaW5fYXJyYXkoJGYsYXJyYXkoJzEnLCcyJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNzAzIG1nJywnZmF6ZSc9PiRmKTsKICB0cnl7CiAgICBpZigkZj09PScyJyl7CiAgICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X25hbWUsbS5tZXRhX3ZhbHVlIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0ncmFua19tYXRoX3JvYm90cycgQU5EIG0ubWV0YV92YWx1ZSBMSUtFICclbm9pbmRleCUnIFdIRVJFIHAucG9zdF90eXBlPSdwb3N0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgICAkYmFrPWdldF9vcHRpb24oJ3BzX3MxNzAzX25vaW5kZXhfYmFrJyk7IGlmKCFpc19hcnJheSgkYmFrKSkgJGJhaz1hcnJheSgpOwogICAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJGlkPShpbnQpJHJbJ0lEJ107ICRiYWtbJGlkXT1hcnJheSgnc2x1Zyc9PiRyWydwb3N0X25hbWUnXSwncmFua19tYXRoX3JvYm90cyc9PiRyWydtZXRhX3ZhbHVlJ10sJ3lvYXN0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ195b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2luZGV4Jyx0cnVlKSwndGlwYXMnPT4ncG9zdCcpOwogICAgICAgICR2PW1heWJlX3Vuc2VyaWFsaXplKCRyWydtZXRhX3ZhbHVlJ10pOyAkdj1pc19hcnJheSgkdik/YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkdixmdW5jdGlvbigkeCl7cmV0dXJuICR4IT09J25vaW5kZXgnJiYkeCE9PSdub2ZvbGxvdyc7fSkpOmFycmF5KCk7IGlmKCFpbl9hcnJheSgnaW5kZXgnLCR2LHRydWUpKSAkdltdPSdpbmRleCc7CiAgICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ3JhbmtfbWF0aF9yb2JvdHMnLCR2KTsgZGVsZXRlX3Bvc3RfbWV0YSgkaWQsJ195b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2luZGV4Jyk7IGRlbGV0ZV9wb3N0X21ldGEoJGlkLCdfeW9hc3Rfd3BzZW9fbWV0YS1yb2JvdHMtbm9mb2xsb3cnKTsgJG9bJ3Bha2Vpc3RhJ11bXT0kclsncG9zdF9uYW1lJ107IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsgfQogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTcwM19ub2luZGV4X2JhaycsJGJhayxmYWxzZSk7ICRvWydiYWtfbiddPWNvdW50KCRiYWspOwogICAgfQogICAgLy8gc2l0ZW1hcCBjYWNoZQogICAgJG49MDsgZm9yZWFjaChhcnJheSgncmFua19tYXRoX3NpdGVtYXBfY2FjaGUnLCdyYW5rLW1hdGgtc2l0ZW1hcC1jYWNoZScpIGFzICRnKXt9CiAgICAkZGVsPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF9yYW5rX21hdGhfc2l0ZW1hcF8lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3RpbWVvdXRfcmFua19tYXRoX3NpdGVtYXBfJScgT1Igb3B0aW9uX25hbWUgTElLRSAncmFua19tYXRoX3NpdGVtYXBfY2FjaGUlJyIpOyAkb1sndHJhbnNpZW50X2RlbCddPSRkZWw7CiAgICBpZihjbGFzc19leGlzdHMoJ1JhbmtNYXRoXFxTaXRlbWFwXFxDYWNoZScpKXsgdHJ5eyBSYW5rTWF0aFxTaXRlbWFwXENhY2hlOjppbnZhbGlkYXRlX3N0b3JhZ2UoKTsgJG9bJ3JtX2NhY2hlJ109J2ludmFsaWRhdGVfc3RvcmFnZSc7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1sncm1fY2FjaGUnXT0nRVJSICcuJGUtPmdldE1lc3NhZ2UoKTsgfSB9CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3JhbmtfbWF0aCcpJiZtZXRob2RfZXhpc3RzKHJhbmtfbWF0aCgpLCdzaXRlbWFwJykpe30KICAgIGRvX2FjdGlvbigncmFua19tYXRoL3NpdGVtYXAvaW52YWxpZGF0ZScpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3BhZ2Utc2l0ZW1hcC54bWw/eD0nLnRpbWUoKSksYXJyYXkoJ3RpbWVvdXQnPT4yNSkpOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7ICRvWydwYWdlX3NpdGVtYXAnXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksc3Vic3RyX2NvdW50KCRoLCc8bG9jPicpLHN1YnN0cl9jb3VudCgkaCwnL3Rha3Nhcy8nKSxzdWJzdHJfY291bnQoJGgsJy9za2FpY2l1b2tsZS8nKSk7CiAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvcG9zdC1zaXRlbWFwLnhtbD94PScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjI1KSk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgJG9bJ3Bvc3Rfc2l0ZW1hcCddPWFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSxzdWJzdHJfY291bnQoJGgsJzxsb2M+JykpOwogICAgJG9bJ25vaW5kZXhfbGlrbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgcCBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdyYW5rX21hdGhfcm9ib3RzJyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJyVub2luZGV4JScgV0hFUkUgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHAucG9zdF90eXBlIElOICgncGFnZScsJ3Bvc3QnLCdwcm9kdWN0JykiKTsKICAgICRvWydwb3N0X3B1Ymxpc2gnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncG9zdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-065249';
const GKEY='ps_s1703mg';
const PHASES=["1"];
const OUT='analize/s1703_mg1.json';
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
