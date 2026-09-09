process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY4IGNtcGx6IHp2YWxneWJhIDIgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ia0UnXSk/JF9HRVRbJ3BzX2JrRSddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NjhSMicsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgZm9yZWFjaChhcnJheSgnY21wbHpfd3NjX3N0YXR1cycsJ2NtcGx6X3dzY19zaWdudXBfc3RhdHVzJywnY21wbHpfd3NjX29uYm9hcmRpbmdfc3RhdHVzJywnY21wbHpfd3NjX2VtYWlsJywnY21wbHpfd3NjX3NpZ251cF9kYXRlJywnY21wbHpfd3NjX3NpdGVfaWQnLCdjbXBsel93c2Nfc2Nhbl9pZCcsJ2NtcGx6X3dzY19sYXN0X3NjYW4nLCdjbXBsel93c2NfdG9rZW4nLCdjbXBsel9kZXRlY3RlZF9jb29raWVzJywnY21wbHpfc3luY19jb29raWVzX2NvbXBsZXRlJywnY21wbHpfY29va2llX2RhdGFfdmVyaWZpZWRfZGF0ZScsJ2NtcGx6X2NoYW5nZWRfY29va2llcycsJ2NtcGx6X2dlbmVyYXRlX25ld19jb29raWVwb2xpY3lfc25hcHNob3QnLCdjbXBsel9kb2N1bWVudHNfdXBkYXRlX2RhdGUnLCdjbXBsel9wdWJsaXNoX2RhdGUnLCdjbXBsel9hY3RpdmF0aW9uX3RpbWUnLCdjbXBsel9kaXNtaXNzZWRfd2FybmluZ3MnKSBhcyAkayl7CiAgICAgICR2PWdldF9vcHRpb24oJGspOyAkb1snb3BjaWpvcyddWyRrXT1pc19zY2FsYXIoJHYpPyhpc19ib29sKCR2KT8oJHY/J3RydWUnOidmYWxzZScpOnN1YnN0cigoc3RyaW5nKSR2LDAsMTIwKSk6KGlzX2FycmF5KCR2KT9qc29uX2VuY29kZShhcnJheV9zbGljZSgkdiwwLDgpLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOiduZXJhJyk7IH0KICAgIC8vIHZpc29zIHdzYyBvcGNpam9zCiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDIwMCkgdiBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXdzYyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ2NtcGx6X3RyYW5zaWVudHMnIixBUlJBWV9BKSBhcyAkcikgJG9bJ3dzY192aXNvcyddWyRyWydvcHRpb25fbmFtZSddXT0kclsndiddOwogICAgLy8gc2Nhbm5lciBtZXRvZHUgc2lnbmF0dXJvcwogICAgZm9yZWFjaChhcnJheSgnY21wbHpfd3NjX3NjYW5uZXInLCdjbXBsel93c2MnLCdjbXBsel93c2NfYXV0aCcsJ2NtcGx6X3dzY19hcGknKSBhcyAkYyl7CiAgICAgIGlmKCFjbGFzc19leGlzdHMoJGMpKSB7ICRvWydrbGFzZSddWyRjXT0nbmVyYSc7IGNvbnRpbnVlOyB9CiAgICAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCRjKTsKICAgICAgJG1zPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJHJjLT5nZXRNZXRob2RzKCkgYXMgJG0peyBpZighcHJlZ19tYXRjaCgnL3NjYW58c3luY3xhdXRofHNpZ251cHxzaXRlX2lkfGVuYWJsZWR8c3RhdHVzL2knLCRtLT5uYW1lKSkgY29udGludWU7CiAgICAgICAgJHBzPWFycmF5KCk7IGZvcmVhY2goJG0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcCkgJHBzW109KCRwLT5pc09wdGlvbmFsKCk/J1snOicnKS4kcC0+Z2V0TmFtZSgpLigkcC0+aXNPcHRpb25hbCgpPyddJzonJyk7CiAgICAgICAgJG1zWyRtLT5uYW1lXT0oJG0tPmlzU3RhdGljKCk/J3N0YXRpYyAnOicnKS4kbS0+Z2V0TW9kaWZpZXJzKCkuJyAoJy5pbXBsb2RlKCcsICcsJHBzKS4nKSc7IH0KICAgICAgJG9bJ2tsYXNlJ11bJGNdPSRtczsKICAgICAgJG9bJ2tsYXNlX3Byb3BzJ11bJGNdPWFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICRwLT5nZXROYW1lKCk7fSwkcmMtPmdldFByb3BlcnRpZXMoKSk7CiAgICB9CiAgICAvLyBhciB5cmEgZ2xvYmFsdXMgb2JqZWt0YXMKICAgIGZvcmVhY2goYXJyYXkoJ0NPTVBMSUFOWicpIGFzICRjKXsgaWYoY2xhc3NfZXhpc3RzKCRjKSl7ICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCRjKTsgJHN0PWFycmF5KCk7CiAgICAgIGZvcmVhY2goJHJjLT5nZXRTdGF0aWNQcm9wZXJ0aWVzKCkgYXMgJGs9PiR2KSAkc3RbJGtdPWlzX29iamVjdCgkdik/Z2V0X2NsYXNzKCR2KTpnZXR0eXBlKCR2KTsgJG9bJ0NPTVBMSUFOWl9zdGF0aWMnXT0kc3Q7IH0gfQogICAgLy8gY29va2llcyBsZW50ZWxlIHBpbG5haQogICAgJG9bJ3N0cnVrdHVyYV9jb29raWVzJ109JHdwZGItPmdldF9jb2woIkRFU0MgeyR3cGRiLT5wcmVmaXh9Y21wbHpfY29va2llcyIsMCk7CiAgICAkb1snY29va2llcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELG5hbWUsbGFuZ3VhZ2Usc2VydmljZSxzeW5jLHNob3dPblBvbGljeSxpc01lbWJlcnNPbmx5LGlnbm9yZWQgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9jb29raWVzIixBUlJBWV9BKTsKICAgICRvWydzZXJ2aWNlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9zZXJ2aWNlcyBMSU1JVCA1IixBUlJBWV9BKTsKICAgIC8vIG51c3RhdHltYWkKICAgICRjbz1nZXRfb3B0aW9uKCdjbXBsel9vcHRpb25zJyk7CiAgICBpZihpc19hcnJheSgkY28pKSBmb3JlYWNoKGFycmF5KCdjb29raWVfc2NhbicsJ3VzZV9jZGJfYXBpJywndXNlc190aGlyZHBhcnR5X3NlcnZpY2VzJywndGhpcmRwYXJ0eV9zZXJ2aWNlc19vbl9zaXRlJywnd3NjX3NjYW5fcG9zdF90eXBlcycsJ2NvbnNlbnRfcGVyX3NlcnZpY2UnLCdndG1fY29kZScsJ3VhX2NvZGUnLCdhd19jb2RlJywnY29uZmlndXJhdGlvbl9ieV9jb21wbGlhbnonLCdyZWdpb25zJykgYXMgJGspICRvWydudXN0YXR5bWFpJ11bJGtdPWlzc2V0KCRjb1ska10pPyhpc19hcnJheSgkY29bJGtdKT9pbXBsb2RlKCcsJyxhcnJheV9zbGljZSgkY29bJGtdLDAsOCkpOiRjb1ska10pOiduZXJhJzsKICAgICRvWydsb2NhbGUnXT1nZXRfbG9jYWxlKCk7CiAgICAkb1sna2FsYm9zJ109ZnVuY3Rpb25fZXhpc3RzKCdjbXBsel9nZXRfc3VwcG9ydGVkX2xhbmd1YWdlcycpP2NtcGx6X2dldF9zdXBwb3J0ZWRfbGFuZ3VhZ2VzKCk6J25lcmEgZm4nOwogICAgJG9bJ3NpdGV1cmwnXT1nZXRfb3B0aW9uKCdzaXRldXJsJyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-070917';
const GKEY='ps_bkE';
const PHASES=["R"];
const OUT='analize/s1668_r2.json';
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
