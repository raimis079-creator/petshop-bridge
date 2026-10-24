process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk3ZCB2YXJpYWNpanUgcGFyZGF2aW1haSBpciBudXJhc3ltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzk3ZCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3OTdkJ107CiAgdHJ5ewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb2kub3JkZXJfaWQsIG9pLm9yZGVyX2l0ZW1faWQsIG0ubWV0YV92YWx1ZSB2aWQgRlJPTSB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgbSBPTiBtLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgbS5tZXRhX2tleT0nX3ZhcmlhdGlvbl9pZCcgQU5EIG0ubWV0YV92YWx1ZT4wIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9b2kub3JkZXJfaWQgQU5EIG8uc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIE9SREVSIEJZIG9pLm9yZGVyX2lkIixBUlJBWV9BKTsKICAgICRvdXQ9W107ICR2c2V0PVtdOwogICAgZm9yZWFjaCgkcm93cyBhcyAkeCl7ICRvPXdjX2dldF9vcmRlcigoaW50KSR4WydvcmRlcl9pZCddKTsgJGl0PSRvLT5nZXRfaXRlbSgoaW50KSR4WydvcmRlcl9pdGVtX2lkJ10pOyAkdmlkPShpbnQpJHhbJ3ZpZCddOyAkdnNldFskdmlkXT0xOwogICAgICAkbnQ9Jyc7IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kby0+Z2V0X2lkKCldKSBhcyAkbil7IGlmKHN0cnBvcygkbi0+Y29udGVudCwnQVYgbnVyYcWheW1hcycpPT09MCkgJG50Lj1tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMjAwKTsgfQogICAgICAkb3V0W109Wyducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ2RhdGEnPT4kby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdtLWQgSDppJyksJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwndmlkJz0+JHZpZCwncGlkJz0+JGl0LT5nZXRfcHJvZHVjdF9pZCgpLCdwYXYnPT4kaXQtPmdldF9uYW1lKCksJ3F0eSc9PiRpdC0+Z2V0X3F1YW50aXR5KCksJ3NyYyc9PiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKSwnYXZfcmVkX3F0eSc9PiRpdC0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkX3F0eScpLCdhdl9ub3RlJz0+JG50XTsgfQogICAgJHJbJ2VpbHV0ZXMnXT0kb3V0OwogICAgJHZpZHM9YXJyYXlfa2V5cygkdnNldCk7ICRwYXI9W107IGZvcmVhY2goJHZpZHMgYXMgJHYpeyAkcGFyW109KGludCl3cF9nZXRfcG9zdF9wYXJlbnRfaWQoJHYpOyB9ICRhbGw9YXJyYXlfdW5pcXVlKGFycmF5X21lcmdlKCR2aWRzLCRwYXIpKTsKICAgICRyWyd6dXJuYWxhcyddPSRhbGw/JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsb3BlcmFjaWphLHByb2R1Y3RfaWQsbGF1a2FzLGJ1dm8sdGFwbyxwcmllemFzdGlzLHVzZXJfaWQsc3VrdXJ0YSBGUk9NIHskUH1wc19hdl96dXJuYWxhcyBXSEVSRSBwcm9kdWN0X2lkIElOKCIuaW1wbG9kZSgnLCcsJGFsbCkuIikgQU5EIGxhdWthcyBJTignX3N0b2NrJywnX293bl9zdG9ja19xdHknKSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk6W107CiAgICAkclsndmFyX3RldnVfc2thaWNpdXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcG9zdF9wYXJlbnQpIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAgICRyWyd2YXJfc2thaWNpdXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0X3ZhcmlhdGlvbicgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICAgJHJbJ3Zhcl9zdV9vd24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgcCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgQU5EIG0ubWV0YV92YWx1ZTw+JycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3RfdmFyaWF0aW9uJyIpOwogICAgJHJbJ3RldmFpX21hbmFnZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIG0ubWV0YV92YWx1ZSBtYW5hZ2UsIHMubWV0YV92YWx1ZSBzdG9jayBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3N0b2NrJyBXSEVSRSBwLklEIElOKFNFTEVDVCBESVNUSU5DVCBwb3N0X3BhcmVudCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIG0ubWV0YV92YWx1ZT0neWVzJyIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-165217';
const GKEY='ps_s1797d';
const PHASES=["1"];
const OUT='analize/s1797d.json';
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
