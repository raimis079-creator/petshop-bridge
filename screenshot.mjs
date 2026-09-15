process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODN0IG0g4oCUIHJlYWQtb25seTogIzEwNTcgZWlsdXTEl3MgMjA0OSBtZXRhLCBwcmVrxJdzIDE4MjQ1IGxpa3V0aXMvQVYsIHNwcmVuZGltYXMoKSwgaXIga2l0aSBwcm9jZXNzaW5nIHXFvnNha3ltYWkgc3UgQVYgZWlsdXTEl21pcyBiZSBfcmVkdWNlZF9zdG9jay4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODN0bSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgzdCBtJyk7CiAgJHc9d2NfZ2V0X29yZGVyKDM1OTU1KTsgZm9yZWFjaCgkdy0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGl0KXsgJG1tPWFycmF5KCk7IGZvcmVhY2goJGl0LT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0pICRtbVskbS0+a2V5XT1zdWJzdHIoanNvbl9lbmNvZGUoJG0tPnZhbHVlLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsODApOyAkb1snaXRlbSddWyRpaWRdPSRtbTsgfQogICRwcj13Y19nZXRfcHJvZHVjdCgxODI0NSk7ICRvWydwcmVrZSddPWFycmF5KCdzdG9jayc9PiRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ21uZyc9PiRwci0+Z2V0X21hbmFnZV9zdG9jaygpLCdzdGF0dXMnPT4kcHItPmdldF9zdG9ja19zdGF0dXMoKSwnb3duJz0+JHByLT5nZXRfbWV0YSgnX293bl9zdG9ja19xdHknKSwndGllayc9PiRwci0+Z2V0X21ldGEoJ19wc190aWVrZWphcycpKTsKICAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnc3ByZW5kaW1hcycpOyAkci0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJG9bJ3NwcmVuZCddPSRyLT5pbnZva2UobnVsbCwxODI0NSwxKTsKICAkb1snc3RvY2tfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19zdG9ja19sb2cgV0hFUkUgcHJvZHVjdF9pZD0xODI0NSBPUkRFUiBCWSAxIERFU0MgTElNSVQgNiIsQVJSQVlfQSk7CiAgaWYoJHdwZGItPmxhc3RfZXJyb3IpeyAkb1snZTEnXT0kd3BkYi0+bGFzdF9lcnJvcjsgJG9bJ3N0b2NrX2xvZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfYXZfc3RvY2tfbG9nIFdIRVJFIHByb2R1Y3RfaWQ9MTgyNDUgT1JERVIgQlkgMSBERVNDIExJTUlUIDYiLEFSUkFZX0EpOyB9CiAgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzPSd3Yy1wcm9jZXNzaW5nJyIpIGFzICRpZCl7ICRvbz13Y19nZXRfb3JkZXIoJGlkKTsgZm9yZWFjaCgkb28tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7IGlmKCdhdichPT0kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJykpIGNvbnRpbnVlOyBpZighJGl0LT5nZXRfbWV0YSgnX3JlZHVjZWRfc3RvY2snKSYmISRpdC0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkJykpICRvWydiZV9yZWR1Y2VkJ11bXT0kb28tPmdldF9vcmRlcl9udW1iZXIoKS4nIGlpZCcuJGlpZC4nIGF2X3JlZF9xdHk9Jy4kaXQtPmdldF9tZXRhKCdfcHNfYXZfcmVkdWNlZF9xdHknKTsgfSB9CiAgJG9bJ2UnXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-093138';
const GKEY='ps_s1683tm';
const PHASES=["A"];
const OUT='analize/s1683t_m.json';
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
