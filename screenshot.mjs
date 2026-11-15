process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY5diBrYWxlZGluaWFpIGp1b2RyYXNjaWFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg2OXYnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODY5diddOwogICRmaXg9WzE3OTM3LDE3OTMyLDE3OTI4LDM2NzYyLDM2NzY0LDM4Mjc4LDM4Mjc5LDE2NDQyLDE2NDM4LDIyMzY2LDIyMzY5LDE1NjMzXTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4oJ2RyYWZ0JywncGVuZGluZycsJ3ByaXZhdGUnLCdwdWJsaXNoJykgQU5EIChwb3N0X3RpdGxlIExJS0UgJyVrYWzEl2QlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVLYWzEl2QlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyV4bWFzJScgT1IgcG9zdF90aXRsZSBMSUtFICclY2hyaXN0bWFzJScgT1IgcG9zdF90aXRsZSBMSUtFICclYWR2ZW50JScgT1IgcG9zdF90aXRsZSBMSUtFICclxaF2ZW50aW4lJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVnaW1jYXQlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVnaW1kb2clJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVnaW1wZXQlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVlbGYlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVyZWluZGVlciUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJXNlbmVsJScpIik7CiAgJGlkcz1hcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpLCRmaXgpKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9Z2V0X3Bvc3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOwogICAgJG1ldGFzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgKG1ldGFfa2V5IExJS0UgJyUlY29zdCUlJyBPUiBtZXRhX2tleSBMSUtFICclJXNhdmlrYWluJSUnIE9SIG1ldGFfa2V5IElOKCdfcHNfc291cmNlJywnX3BzX2lzaW10aXNfbGF1a2lhX3BlcnppdXJvcycsJ19wc19yYW5rYV9pc2ltdGEnLCdfdmZfc3VwcGxpZXJfc2t1JywnX3piX2NvZGUnLCdfcHNfdm12dF9pc2ltdGEnKSkiLCRpZCksQVJSQVlfQSk7ICRtbT1bXTsgZm9yZWFjaCgkbWV0YXMgYXMgJG0pICRtbVskbVsnbWV0YV9rZXknXV09bWJfc3Vic3RyKCRtWydtZXRhX3ZhbHVlJ10sMCw0MCk7CiAgICAkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgICRyWydwJ11bXT1bJ2lkJz0+JGlkLCdzdCc9PiRwLT5wb3N0X3N0YXR1cywndCc9Pm1iX3N1YnN0cigkcC0+cG9zdF90aXRsZSwwLDcwKSwna2FpbmEnPT4kcHItPmdldF9yZWd1bGFyX3ByaWNlKCksJ2FrYyc9PiRwci0+Z2V0X3NhbGVfcHJpY2UoKSwnbGlrdXRpcyc9PiRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3N0b2NrX3N0Jz0+JHByLT5nZXRfc3RvY2tfc3RhdHVzKCksJ2ltZyc9Pihib29sKSRwci0+Z2V0X2ltYWdlX2lkKCksJ2Fwcic9Pm1iX3N0cmxlbih0cmltKHdwX3N0cmlwX2FsbF90YWdzKCRwLT5wb3N0X2NvbnRlbnQpKSksJ3NrdSc9PiRwci0+Z2V0X3NrdSgpLCdrYXQnPT5pbXBsb2RlKCd8Jyxpc193cF9lcnJvcigkY2F0cyk/W106JGNhdHMpLCdtJz0+JG1tLCdzdWt1cnRhJz0+c3Vic3RyKCRwLT5wb3N0X2RhdGUsMCwxMCksJ3RpcGFzJz0+JHByLT5nZXRfdHlwZSgpXTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-141428';
const GKEY='ps_s1869v';
const PHASES=["1"];
const OUT='analize/s1869_v.json';
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
