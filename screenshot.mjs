process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTYgcnVuIGU2ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpIOKAnlNpdW50YSBncsSvxb50YeKAnCBzdW1vbXM6IFdDIHByaXN0YXR5bW8gem9ub3MvbWV0b2RhaSBzdSDEr2thaW5pYWlzIChpbnN0YW5jZSBzZXR0aW5ncywgc3ZvcmlvIGxlbnRlbMSXcyksIG5lbW9rYW1vIHByaXN0YXR5bW8gc2xlbmtzxI1pYWksIHRlc3RpbmnFsyB1xb5zYWt5bcWzIHNoaXBwaW5nIGVpbHV0xJdzIChtZXRob2RfaWQvaW5zdGFuY2VfaWQvY29zdC90YXgpLCBkYXJiYWxhdWtpbyBgdmV6ZWphcygpYCByZWlrxaFtxJdzLCBncsSvxb51c2nFsyB0ZXN0aW5pxbMgKCMzNTQzOC8jMzU0MjEvIzM1NDM5KSBzdW1vcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTZyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTYgZTZyJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgdHJ5ewogICAgLy8gMS4gWm9ub3MgaXIgbWV0b2RhaQogICAgJHpvbmVzPVdDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZXMoKTsgJHpvbmVzWzBdPWFycmF5KCdpZCc9PjAsJ3pvbmVfbmFtZSc9PidSZXN0IG9mIHdvcmxkJywnc2hpcHBpbmdfbWV0aG9kcyc9PldDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZSgwKS0+Z2V0X3NoaXBwaW5nX21ldGhvZHMoKSk7CiAgICBmb3JlYWNoKCR6b25lcyBhcyAkeil7ICR6bT1hcnJheSgpOyAkbXM9aXNzZXQoJHpbJ3NoaXBwaW5nX21ldGhvZHMnXSk/JHpbJ3NoaXBwaW5nX21ldGhvZHMnXTphcnJheSgpOyBmb3JlYWNoKCRtcyBhcyAkbSl7ICRpbnN0PSRtLT5pbnN0YW5jZV9zZXR0aW5ncz8/YXJyYXkoKTsgJGtlZXA9YXJyYXkoKTsgZm9yZWFjaCgoYXJyYXkpJGluc3QgYXMgJGs9PiR2KXsgJGtlZXBbJGtdPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCwxNjApOmpzb25fZW5jb2RlKCR2KTsgfSAkem1bXT1hcnJheSgnaWQnPT4kbS0+aWQsJ2luc3QnPT4kbS0+Z2V0X2luc3RhbmNlX2lkKCksJ3RpdGxlJz0+JG0tPmdldF90aXRsZSgpLCdlbmFibGVkJz0+JG0tPmVuYWJsZWQsJ3NldHRpbmdzJz0+JGtlZXApOyB9ICRvWyd6b25lcyddW109YXJyYXkoJ25hbWUnPT4kelsnem9uZV9uYW1lJ10sJ2lkJz0+JHpbJ2lkJ10sJ21ldGhvZHMnPT4kem0pOyB9CiAgICAvLyAyLiBTdm9yaW8gbGVudGVsxJdzIOKAlCBhciB5cmEgcGx1Z2lubyAod2VpZ2h0IGJhc2VkKSBsZW50ZWzEl3Mgb3B0aW9ucwogICAgJG9bJ3NoaXBfb3B0aW9ucyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRUZUKG9wdGlvbl92YWx1ZSw0MDApIHYgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICd3b29jb21tZXJjZV8lX3NldHRpbmdzJyBBTkQgKG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWxpdGh1YW5pYSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVmbGF0X3JhdGUlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclZnJlZV9zaGlwcGluZyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV3ZWlnaHQlJykgTElNSVQgNDAiLEFSUkFZX0EpOwogICAgJG9bJ3NoaXBfcGx1Z2lucyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksZnVuY3Rpb24oJHgpeyByZXR1cm4gcHJlZ19tYXRjaCgnL3NoaXB8dmVuaXBha3xsaXRodWFuaWF8d2VpZ2h0fHRhYmxlL2knLCR4KTsgfSkpOwogICAgLy8gMy4gRGFyYmFsYXVraW8gdmV6ZWphcygpIGxvZ2lrYQogICAgJG11PVdQTVVfUExVR0lOX0RJUjsgJGM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkbXUuJy9wZXRzaG9wLWRlc2sucGhwJyk7ICRpPXN0cnBvcygkYywnZnVuY3Rpb24gdmV6ZWphcycpOyAkb1snZGVza192ZXplamFzJ109JGkhPT1mYWxzZT9zdWJzdHIoJGMsJGksMTgwMCk6J25lcmFzdGEnOwogICAgJGk9c3RycG9zKCRjLCdmdW5jdGlvbiB2ZXplam9fdmFyZGFzJyk7ICRvWydkZXNrX3ZlemVqb192YXJkYXMnXT0kaSE9PWZhbHNlP3N1YnN0cigkYywkaSw5MDApOiduZXJhc3RhJzsKICAgIC8vIDQuIFRlc3RpbmlhaSDigJQgc2hpcHBpbmcgZWlsdXTEl3MgaXIgZ3LEr8W+dXNpb3Mgc2l1bnRvcwogICAgZm9yZWFjaChhcnJheSgzNTQzOCwzNTQyMSwzNTQzOSwzNTQxNCwzNTQyMCwzNTQzNSwzNTQ0MSwzNTQ0MiwzNTQ1MCkgYXMgJGlkKXsgJHg9d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkeCkgY29udGludWU7ICRzaD1hcnJheSgpOyBmb3JlYWNoKCR4LT5nZXRfaXRlbXMoJ3NoaXBwaW5nJykgYXMgJHMpeyAkc2hbXT1hcnJheSgnbSc9PiRzLT5nZXRfbWV0aG9kX2lkKCksJ2luc3QnPT4kcy0+Z2V0X2luc3RhbmNlX2lkKCksJ25hbWUnPT4kcy0+Z2V0X25hbWUoKSwnY29zdCc9PiRzLT5nZXRfdG90YWwoKSwndGF4Jz0+JHMtPmdldF90b3RhbF90YXgoKSwnbWV0YSc9PmFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkbSl7IHJldHVybiAkbS0+a2V5Lic9Jy5tYl9zdWJzdHIoaXNfc2NhbGFyKCRtLT52YWx1ZSk/JG0tPnZhbHVlOmpzb25fZW5jb2RlKCRtLT52YWx1ZSksMCw2MCk7IH0sJHMtPmdldF9tZXRhX2RhdGEoKSksMCw4KSk7IH0KICAgICAgJG9bJ3V6cyddWyRpZF09YXJyYXkoJ3N0Jz0+JHgtPmdldF9zdGF0dXMoKSwndG90YWwnPT4keC0+Z2V0X3RvdGFsKCksJ3NoaXAnPT4keC0+Z2V0X3NoaXBwaW5nX3RvdGFsKCksJ3NoaXBfdGF4Jz0+JHgtPmdldF9zaGlwcGluZ190YXgoKSwnc2gnPT4kc2gsJ3Zleic9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9EZXNrJyk/KG5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCd2ZXplamFzJykpLT5pc1B1YmxpYygpOm51bGwsJ2dyaXp0YSc9PihzdHJpbmcpJHgtPmdldF9tZXRhKCdfcHNfc2l1bnRhX2dyaXp0YScpLCd3ZWlnaHQnPT4wKTsgJHc9MDsgZm9yZWFjaCgkeC0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJHByPSRpdC0+Z2V0X3Byb2R1Y3QoKTsgaWYoJHByKSAkdys9KGZsb2F0KSRwci0+Z2V0X3dlaWdodCgpKiRpdC0+Z2V0X3F1YW50aXR5KCk7IH0gJG9bJ3V6cyddWyRpZF1bJ3dlaWdodCddPSR3OyB9CiAgICAvLyA1LiBQcmlzdGF0eW1vIHB1c2xhcGlzIDE0ODk0IOKAlCDEr2thaW5pxbMgcGFzdHJhaXBhCiAgICAkcGc9Z2V0X3Bvc3QoMTQ4OTQpOyAkdD13cF9zdHJpcF9hbGxfdGFncygoc3RyaW5nKSgkcGc/JHBnLT5wb3N0X2NvbnRlbnQ6JycpKTsgJGk9bWJfc3RyaXBvcygkdCwnMiwxNScpOyAkb1sncHJpc3RhdHltYXNfMTQ4OTQnXT0kaSE9PWZhbHNlP3ByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxtYl9zdWJzdHIoJHQsbWF4KDAsJGktNjAwKSwxNTAwKSk6bWJfc3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkdCksMCwxNTAwKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-204536';
const GKEY='ps_e6r';
const PHASES=["R"];
const OUT='analize/s1616_e6r.json';
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
