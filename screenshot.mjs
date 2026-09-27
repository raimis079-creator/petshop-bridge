process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI3bWggcmVhZC1vbmx5OiAyLjMgYXRyaWJ1dGFpIChqYXV0cnVtYXMsIGR5ZGlzLCBhbcW+aXVzKSwgc2thbsSXc3RhaSBwYWdhbCBzYW5kxJdsxK8gKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzI3bWgnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzI3bWgnXTsgJHI9Wyd2Jz0+J1MxNzI3bWgnLCdmJz0+JGZdOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgxNzApOwogIHRyeXsKICAgICRpZHNfY2F0PWZ1bmN0aW9uKCRzbHVncyl7IHJldHVybiBnZXRfcG9zdHMoWydwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9Pi0xLCdmaWVsZHMnPT4naWRzJywndGF4X3F1ZXJ5Jz0+W1sndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT4kc2x1Z3MsJ2luY2x1ZGVfY2hpbGRyZW4nPT50cnVlXV1dKTsgfTsKICAgICRzcmM9ZnVuY3Rpb24oJGlkKSB1c2UoJHdwZGIsJFApeyBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJykpeyAkeD1QZXRzaG9wX0FWX1NvdXJjZTo6cmVzb2x2ZSgkaWQsMSk7IHJldHVybiAkeFsnc291cmNlJ10/Pyc/JzsgfSByZXR1cm4gJz8nOyB9OwogICAgaWYoJGY9PT0nMScpewogICAgICAkclsncGFfdGF4J109W107IGZvcmVhY2god2NfZ2V0X2F0dHJpYnV0ZV90YXhvbm9taWVzKCkgYXMgJHQpeyAkclsncGFfdGF4J11bXT0kdC0+YXR0cmlidXRlX25hbWU7IH0KICAgICAgZm9yZWFjaChbJ3N1bnlzJz0+WydtYWlzdGFzLXN1bmltcyddLCdrYXRlcyc9PlsnbWFpc3Rhcy1rYXRlbXMnXSwnc2thbl9zdW55cyc9Plsnc2thbmVzdGFpLXN1bmltcyddLCdza2FuX2thdGVzJz0+Wydza2FuZXN0YWkta2F0ZW1zJ11dIGFzICRrPT4kc2wpewogICAgICAgICRpZHM9JGlkc19jYXQoJHNsKTsgJGlkcz1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRpZHMsZnVuY3Rpb24oJGkpeyByZXR1cm4gIWdldF9wb3N0X21ldGEoJGksJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpICYmIGdldF9wb3N0X21ldGEoJGksJ19zdG9ja19zdGF0dXMnLHRydWUpPT09J2luc3RvY2snOyB9KSk7CiAgICAgICAgJHN0PVsnbic9PmNvdW50KCRpZHMpLCdwYWdhbF9zYW5kZWxpJz0+W10sJ2F0dHJfcGFkZW5naW1hcyc9PltdXTsKICAgICAgICBmb3JlYWNoKCRpZHMgYXMgJGkpeyAkcz0kc3JjKCRpKTsgJHN0WydwYWdhbF9zYW5kZWxpJ11bJHNdPSgkc3RbJ3BhZ2FsX3NhbmRlbGknXVskc10/PzApKzE7IGZvcmVhY2goJHJbJ3BhX3RheCddIGFzICRhKXsgJHR0PXdwX2dldF9wb3N0X3Rlcm1zKCRpLCdwYV8nLiRhLFsnZmllbGRzJz0+J3NsdWdzJ10pOyBpZigkdHQgJiYgIWlzX3dwX2Vycm9yKCR0dCkpeyAkc3RbJ2F0dHJfcGFkZW5naW1hcyddWyRhXT0oJHN0WydhdHRyX3BhZGVuZ2ltYXMnXVskYV0/PzApKzE7IGZvcmVhY2goJHR0IGFzICRzbHVnKSAkc3RbJ3Rlcm1zJ11bJGFdWyRzbHVnXT0oJHN0Wyd0ZXJtcyddWyRhXVskc2x1Z10/PzApKzE7IH0gfSB9CiAgICAgICAgYXJzb3J0KCRzdFsncGFnYWxfc2FuZGVsaSddKTsgYXJzb3J0KCRzdFsnYXR0cl9wYWRlbmdpbWFzJ10pOwogICAgICAgIGZvcmVhY2goKCRzdFsndGVybXMnXT8/W10pIGFzICRhPT4kdil7IGFyc29ydCgkc3RbJ3Rlcm1zJ11bJGFdKTsgJHN0Wyd0ZXJtcyddWyRhXT1hcnJheV9zbGljZSgkc3RbJ3Rlcm1zJ11bJGFdLDAsMTQsdHJ1ZSk7IH0KICAgICAgICAkclska109JHN0OwogICAgICB9CiAgICB9CiAgICBpZigkZj09PScyJyl7CiAgICAgICRjYW5kcz1bMTYzMDUsMTYzMTEsMTkwOTgsMTU4NjcsMTYyOTgsMTkwOTIsMTYzMTcsMTkxMDQsMTg2MzksMTg2NDcsMTg2NTUsMTgxMjUsMTc2NDQsMTc2NDEsMTc0ODEsMTc0NzgsMTc0NzUsMTc0NjksMTkwMzMsMTkwMjddOwogICAgICBmb3JlYWNoKCRjYW5kcyBhcyAkaSl7ICRhPVtdOyBmb3JlYWNoKHdjX2dldF9hdHRyaWJ1dGVfdGF4b25vbWllcygpIGFzICR0KXsgJHR0PXdwX2dldF9wb3N0X3Rlcm1zKCRpLCdwYV8nLiR0LT5hdHRyaWJ1dGVfbmFtZSxbJ2ZpZWxkcyc9PidzbHVncyddKTsgaWYoJHR0ICYmICFpc193cF9lcnJvcigkdHQpKSAkYVskdC0+YXR0cmlidXRlX25hbWVdPWltcGxvZGUoJywnLCR0dCk7IH0gJHJbJ2thbmQnXVskaV09WydwYXYnPT5nZXRfdGhlX3RpdGxlKCRpKSwnc3JjJz0+JHNyYygkaSksJ2F0dHInPT4kYSwnY2F0cyc9PmltcGxvZGUoJywnLHdwX2dldF9wb3N0X3Rlcm1zKCRpLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nc2x1Z3MnXSkpXTsgfQogICAgICAvLyB0b3AgbWFpc3RvIHByZWvEl3MgcG8gVC0wIGlyIGrFsyDFvnltb3MKICAgICAgJHRvcD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcmVrZV9pZCBwaWQsIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdSBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgdGVzdGluaXM9MCBBTkQga2F0ZWdvcmlqdV9rZWxpYXMgTElLRSAnJW1haXN0YXMtJScgR1JPVVAgQlkgcHJla2VfaWQgT1JERVIgQlkgdSBERVNDIExJTUlUIDI1IixBUlJBWV9BKTsKICAgICAgZm9yZWFjaCgkdG9wIGFzICR0KXsgJGk9KGludCkkdFsncGlkJ107ICRhPVtdOyBmb3JlYWNoKFsnc3BlY2lhbGlfbWl0eWJhJywnbW9ub3Byb3RlaW4nLCdiYWx0eW11X3NhbHRpbmlzJywnc3Vuc19keWRpcycsJ3ZlaXNsZXNfZHlkaXMnLCdkeWRpcycsJ2Fteml1cycsJ2d5dmVuaW1vX2V0YXBhcycsJ2FtemlhdXNfZ3J1cGUnXSBhcyAkbil7ICR0dD13cF9nZXRfcG9zdF90ZXJtcygkaSwncGFfJy4kbixbJ2ZpZWxkcyc9PidzbHVncyddKTsgaWYoJHR0ICYmICFpc193cF9lcnJvcigkdHQpKSAkYVskbl09aW1wbG9kZSgnLCcsJHR0KTsgfSAkclsndG9wX21haXN0YXMnXVtdPVsncGlkJz0+JGksJ3UnPT4kdFsndSddLCdwYXYnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkaSksMCw3MCksJ3NyYyc9PiRzcmMoJGkpLCdhdHRyJz0+JGEsJ2NhdHMnPT5pbXBsb2RlKCcsJyx3cF9nZXRfcG9zdF90ZXJtcygkaSwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J3NsdWdzJ10pKV07IH0KICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-195228';
const GKEY='ps_s1727mh';
const PHASES=["1", "2"];
const OUT='analize/s1727_mh.json';
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
