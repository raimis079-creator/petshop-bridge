process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0bCBsaWt1Y2l1IHBhdGFpc2EgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTcwNGwnXSk/JF9HRVRbJ3BzX3MxNzA0bCddOicnKTsgaWYoIWluX2FycmF5KCRmLGFycmF5KCcxJywnMicsJzknKSx0cnVlKSkgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE3MDRsJywnZmF6ZSc9PiRmKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgICBpZigkZj09PSc5Jyl7CiAgICAgICRiYWs9Z2V0X29wdGlvbigncHNfczE3MDRfbGlrdWNpYWlfYmFrJyk7IGlmKCEkYmFrKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdiYWsgbmVyYScpOwogICAgICBmb3JlYWNoKCRiYWtbJ2VpbHV0ZXMnXSBhcyAkcil7ICRwcj13Y19nZXRfcHJvZHVjdCgkclsncGlkJ10pOyBpZighJHByKSBjb250aW51ZTsgJHByLT5zZXRfc3RvY2tfcXVhbnRpdHkoJHJbJ2J1dm8nXSk7ICRwci0+c2V0X3N0b2NrX3N0YXR1cygkclsnYnV2byddPjA/J2luc3RvY2snOidvdXRvZnN0b2NrJyk7ICRwci0+c2F2ZSgpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3BzX3NvdXJjZXNfc3luY19zYXVnaWFpJykpIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCRyWydwaWQnXSk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHJbJ3BpZCddKTsgJG9bJ2F0c3RhdHl0YSddW109JHJbJ3BpZCddLicgLT4gJy4kclsnYnV2byddOyB9CiAgICAgIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7CiAgICB9CiAgICAvLyBkdmlndWJhaSBudXJhc3l0b3MgZWlsdXRlcwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb2kub3JkZXJfaWQsIG9pLm9yZGVyX2l0ZW1faWQsCiAgICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBwaWQsCiAgICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcmVkdWNlZF9zdG9jaycgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSB3Y19yZWQsCiAgICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcHNfYXZfcmVkdWNlZF9xdHknIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgYXZfcmVkLAogICAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3BzX2F2X3JlZHVjZWRfcGlkJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGF2X3BpZAogICAgICBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBKT0lOIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBtIE9OIG0ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkCiAgICAgIFdIRVJFIG9pLm9yZGVyX2l0ZW1fdHlwZT0nbGluZV9pdGVtJyBHUk9VUCBCWSBvaS5vcmRlcl9pdGVtX2lkIEhBVklORyB3Y19yZWQ+MCBBTkQgYXZfcmVkPjAiLEFSUkFZX0EpOwogICAgJGR2aWc9YXJyYXkoKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkcGlkPShpbnQpKCRyWydhdl9waWQnXT86JHJbJ3BpZCddKTsgJG93bj1nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsgaWYoJG93biE9PScnJiYkb3duIT09bnVsbCkgY29udGludWU7CiAgICAgICRkdmlnWyRwaWRdPShpc3NldCgkZHZpZ1skcGlkXSk/JGR2aWdbJHBpZF06MCkrbWluKChpbnQpJHJbJ3djX3JlZCddLChpbnQpJHJbJ2F2X3JlZCddKTsgfQogICAgJHBhcnQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCwgU1VNKGtpZWtpc19saWtvKSBsaWtvIEZST00geyRwfXBzX3BhcnRpam9zIFdIRVJFIGF0c2F1a3RhPTAgR1JPVVAgQlkgcHJvZHVjdF9pZCIsQVJSQVlfQSk7CiAgICAkcG1hcD1hcnJheSgpOyBmb3JlYWNoKCRwYXJ0IGFzICRyKSAkcG1hcFsoaW50KSRyWydwcm9kdWN0X2lkJ11dPShpbnQpJHJbJ2xpa28nXTsKICAgICRwbGFuYXM9YXJyYXkoKTsgJGtpdGk9YXJyYXkoKTsKICAgIGZvcmVhY2goJGR2aWcgYXMgJHBpZD0+JHEpewogICAgICAkc3RvY2s9KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSk7ICRsaWtvPWlzc2V0KCRwbWFwWyRwaWRdKT8kcG1hcFskcGlkXTpudWxsOwogICAgICAkZT1hcnJheSgncGlkJz0+JHBpZCwnc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc2t1Jyx0cnVlKSwncGF2Jz0+aHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLCdkdmlndWJhaSc9PiRxLCdidXZvJz0+JHN0b2NrLCdwYXJ0aWpvcyc9PiRsaWtvKTsKICAgICAgaWYoJGxpa28hPT1udWxsICYmICRzdG9jazwkbGlrbyl7ICRlWydwcmlkZXRpJ109bWluKCRxLCRsaWtvLSRzdG9jayk7ICRlWydidXMnXT0kc3RvY2srJGVbJ3ByaWRldGknXTsgJHBsYW5hc1tdPSRlOyB9CiAgICAgIGVsc2UgeyAkZVsnc2tpcnR1bWFzJ109KCRsaWtvPT09bnVsbD9udWxsOiRzdG9jay0kbGlrbyk7ICRraXRpW109JGU7IH0KICAgIH0KICAgIHVzb3J0KCRwbGFuYXMsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsncHJpZGV0aSddPD0+JGFbJ3ByaWRldGknXTt9KTsKICAgICRvWydwbGFuYXNfbiddPWNvdW50KCRwbGFuYXMpOyAkb1sncGxhbmFzX3ZudCddPWFycmF5X3N1bShhcnJheV9jb2x1bW4oJHBsYW5hcywncHJpZGV0aScpKTsgJG9bJ2tpdGlfbiddPWNvdW50KCRraXRpKTsKICAgICRvWydpa2lfMF9idXZvJ109Y291bnQoYXJyYXlfZmlsdGVyKCRwbGFuYXMsZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnYnV2byddPT09MDt9KSk7CiAgICBpZigkZj09PScxJyl7ICRvWydwbGFuYXMnXT0kcGxhbmFzOyAkb1sna2l0aSddPSRraXRpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgICAvLyAyIOKAlCB2eWtkeXRpCiAgICBpZihnZXRfb3B0aW9uKCdwc19zMTcwNF9saWt1Y2lhaV9iYWsnKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignYmFrIGphdSB5cmEg4oCUIGphdSB2eWtkeXRhJyk7CiAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTcwNF9saWt1Y2lhaV9iYWsnLGFycmF5KCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyksJ2VpbHV0ZXMnPT4kcGxhbmFzKSxmYWxzZSk7CiAgICAkcGFkPWFycmF5KCk7CiAgICBmb3JlYWNoKCRwbGFuYXMgYXMgJGUpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGVbJ3BpZCddKTsgaWYoISRwcil7ICRvWydrbGFpZG9zJ11bXT0kZVsncGlkJ107IGNvbnRpbnVlOyB9CiAgICAgICRwci0+c2V0X3N0b2NrX3F1YW50aXR5KCRlWydidXMnXSk7ICRwci0+c2V0X3N0b2NrX3N0YXR1cygnaW5zdG9jaycpOyAkcHItPnNhdmUoKTsKICAgICAgaWYoZnVuY3Rpb25fZXhpc3RzKCdwc19zb3VyY2VzX3N5bmNfc2F1Z2lhaScpKSBwc19zb3VyY2VzX3N5bmNfc2F1Z2lhaSgkZVsncGlkJ10pOwogICAgICB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRlWydwaWQnXSk7CiAgICAgICRwYWRbXT1hcnJheSgncGlkJz0+JGVbJ3BpZCddLCdkYWJhcic9PihpbnQpZ2V0X3Bvc3RfbWV0YSgkZVsncGlkJ10sJ19zdG9jaycsdHJ1ZSksJ3BhcnRpam9zJz0+JGVbJ3BhcnRpam9zJ10sJ29rJz0+KChpbnQpZ2V0X3Bvc3RfbWV0YSgkZVsncGlkJ10sJ19zdG9jaycsdHJ1ZSk9PT0kZVsnYnVzJ10pKTsgfQogICAgJG9bJ3BhZGFyeXRhJ109JHBhZDsgJG9bJ29rX24nXT1jb3VudChhcnJheV9maWx0ZXIoJHBhZCxmdW5jdGlvbigkeCl7cmV0dXJuICR4WydvayddO30pKTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-083151';
const GKEY='ps_s1704l';
const PHASES=["1"];
const OUT='analize/s1704_l1.json';
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
