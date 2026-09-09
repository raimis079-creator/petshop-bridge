process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg5IHBhdGlrcmEgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibHInXSk/JF9HRVRbJ3BzX2JsciddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODlSJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgICAvLyAxLiBMaWt1dGlzIGlyIHV6c2FreW11IHBhc3RhYm9zCiAgICBmb3JlYWNoKGFycmF5KDM1ODc0LDM1ODc1KSBhcyAkaWQpewogICAgICAkbj1hcnJheSgpOwogICAgICBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+OCkpIGFzICR4KSAkbltdPSR4LT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ0g6aTpzJykuJyAnLnN1YnN0cihzdHJpcF90YWdzKCR4LT5jb250ZW50KSwwLDE0MCk7CiAgICAgICRvWydwYXN0YWJvcyddWyRpZF09JG47CiAgICAgICRvcmQ9d2NfZ2V0X29yZGVyKCRpZCk7CiAgICAgICRvWydyZXN0b2NrX21ldGEnXVskaWRdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSw0MCkgdiBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVzdG9jayUlJyBPUiBtZXRhX2tleSBMSUtFICclJXJlZHVjZSUlJykiLCRpZCksQVJSQVlfQSk7CiAgICB9CiAgICAkb1snbGlrdXRpc18xNDk1MSddPWdldF9wb3N0X21ldGEoMTQ5NTEsJ19zdG9jaycsdHJ1ZSk7CiAgICAkb1snb3duXzE0OTUxJ109Z2V0X3Bvc3RfbWV0YSgxNDk1MSwnX293bl9zdG9ja19xdHknLHRydWUpOwogICAgJG9bJ3NhbmRlbGlzXzE0OTUxJ109Z2V0X3Bvc3RfbWV0YSgxNDk1MSwnX3BzX3NhbmRlbGlzJyx0cnVlKTsKICAgICRvWydpdnlraWFpXzE0OTUxJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLGxhdWthcyxzZW5hLG5hdWphLHBhc3RhYmEgRlJPTSB7JHdwZGItPnByZWZpeH1wc19pdnlraWFpIFdIRVJFIHByb2R1Y3RfaWQ9MTQ5NTEgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKCiAgICAvLyAyLiBLdXIgZ3l2ZW5hIHdlbGNvbWUgbW9kYWxhcwogICAgJHJhc3RhPWFycmF5KCk7CiAgICBmb3JlYWNoKHNjYW5kaXIoV1BNVV9QTFVHSU5fRElSKSBhcyAkeCl7CiAgICAgIGlmKHN1YnN0cigkeCwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAgICAkYz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy8nLiR4KTsKICAgICAgJG49c3Vic3RyX2NvdW50KCRjLCd3ZWxjb21lX21vZGFsJykrc3Vic3RyX2NvdW50KCRjLCdwc193ZWxjb21lX3NlZW4nKStzdWJzdHJfY291bnQoJGMsJ1N2ZWlraSBzdWdyxK/FvsSZJyk7CiAgICAgIGlmKCRuKSAkcmFzdGFbJ211LycuJHhdPSRuOwogICAgfQogICAgJG9bJ211X2ZhaWxhaSddPSRyYXN0YTsKICAgICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbCBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJXdlbGNvbWVfbW9kYWwlJyBPUiBjb2RlIExJS0UgJyVwc193ZWxjb21lX3NlZW4lJyBPUiBjb2RlIExJS0UgJyVzdWdyxK/FvsSZJScgT1IgbmFtZSBMSUtFICclU3ZlaWtpJSciLEFSUkFZX0EpOwogICAgJG9bJ3NuaXBwZXRhaSddPSRzbjsKICAgIC8vIHZpc2kgYWt0eXZ1cyBzbmlwcGV0YWkgc3UgJ21vZGFsJwogICAgJG9bJ21vZGFsX3NuaXBwZXRhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgKGNvZGUgTElLRSAnJW1vZGFsJScgT1IgbmFtZSBMSUtFICclbW9kYWwlJykgQU5EIGFjdGl2ZT0xIExJTUlUIDEwIixBUlJBWV9BKTsKICAgIC8vIGFyIG9wdGlvbiBza2FpdG9tYXMga3VyIG5vcnMKICAgICRvWydvcHRpb25fbmF1ZG9qaW1hcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclcGV0c2hvcF93ZWxjb21lX21vZGFsX2VuYWJsZWQlJyIsQVJSQVlfQSk7CiAgICAvLyB2YXJ0b3RvanUgbWV0YQogICAgJG9bJ3BzX3dlbGNvbWVfc2Vlbl9raWVrJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT51c2VybWV0YX0gV0hFUkUgbWV0YV9rZXk9J3BzX3dlbGNvbWVfc2VlbiciKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-103905';
const GKEY='ps_blr';
const PHASES=["R"];
const OUT='analize/s1689_r.json';
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
