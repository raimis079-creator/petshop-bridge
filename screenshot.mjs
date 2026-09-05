process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHI3IChyZWNvbiwgdGlrIHNrYWl0eW1hcykg4oCUIGtyZWRpdGluxJc6IHRlbW9zIGJhc2UucGhwIHNlZ21lbnRhaSAoYW50cmHFoXTElyAx4oCTODAsIGtyZWRpdGluxJdzIGVpbHV0xJdzIDM3MOKAkzQ3MCksIHRlbW9zIGZ1bmN0aW9ucy5waHAgYHBldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGZgICgyOTLigJMzNjApLCBXQ0ROIHJlbmRlcmVyIGAkb3JkZXJbJ3JlZnVuZCddYCDFoWFsdGluaXMsIFdDRE4gdGVtcGxhdGUgYGNyZWRpdG5vdGVgIGVuYWJsZWQvcmVnaXN0cmFjaWphLCBzZW5vIGRlc2sgY3JlZGl0bm90ZS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcjcnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYxNyByNycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRzZWc9ZnVuY3Rpb24oJGZpbGUsJGEsJGIpeyBpZighZmlsZV9leGlzdHMoJGZpbGUpKSByZXR1cm4gJ07EllJBJzsgJGw9ZmlsZSgkZmlsZSk7ICRyPWFycmF5KCk7IGZvcigkaT0kYS0xOyRpPG1pbigkYixjb3VudCgkbCkpOyRpKyspeyAkcltdPSgkaSsxKS4nOiAnLnJ0cmltKCRsWyRpXSk7IH0gcmV0dXJuIGltcGxvZGUoIlxuIiwkcik7IH07CiAgJHRoPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOyAkcGQ9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzJzsKICAkb1snYmFzZV8xXzgwJ109JHNlZygkdGguJy93b29jb21tZXJjZS1kZWxpdmVyeS1ub3Rlcy9iYXNlLnBocCcsMSw4MCk7CiAgJG9bJ2Jhc2VfMzcwXzQ3MCddPSRzZWcoJHRoLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvYmFzZS5waHAnLDM3MCw0NzApOwogICRvWydmbl8yOTJfMzYwJ109JHNlZygkdGguJy9mdW5jdGlvbnMucGhwJywyOTIsMzYwKTsKICAkb1sncmVuZGVyZXJfMjI1XzI2NSddPSRzZWcoJHBkLicvaW5jbHVkZXMvc2VydmljZXMvdGVtcGxhdGUvY2xhc3MtdGVtcGxhdGUtcmVuZGVyZXIucGhwJywyMjUsMjY1KTsKICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0cywkY3R4PTEsJG1heD0zMCwkdz00MjApeyAkcj1hcnJheSgpOyBpZighZmlsZV9leGlzdHMoJGZpbGUpKSByZXR1cm4gJ07EllJBICcuJGZpbGU7ICRsPWZpbGUoJGZpbGUpOyBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyBmb3JlYWNoKChhcnJheSkkcGF0cyBhcyAkcHQpeyBpZihwcmVnX21hdGNoKCRwdCwkbG4pKXsgJHJbXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbShpbXBsb2RlKCcg4o+OICcsYXJyYXlfbWFwKCd0cmltJyxhcnJheV9zbGljZSgkbCxtYXgoMCwkaS0kY3R4KSwkY3R4KjIrMSkpKSksMCwkdyk7IGJyZWFrOyB9IH0gaWYoY291bnQoJHIpPj0kbWF4KSBicmVhazsgfSByZXR1cm4gJHI7IH07CiAgZm9yZWFjaChnbG9iKCRwZC4nL2luY2x1ZGVzLyoqLyoucGhwJykgYXMgJGYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHByZWdfbWF0Y2goIi8ncmVmdW5kJ1xzKj0+fFxbXHMqJ3JlZnVuZCdccypcXVxzKj0vIiwkYykpeyAkb1sncmVmdW5kX3NyYyddW2Jhc2VuYW1lKCRmKV09JGdyZXAoJGYsYXJyYXkoIi8ncmVmdW5kJy8iLCIvZ2V0X3JlZnVuZHMvIiksMiwxMiw1MDApOyB9IH0KICBmb3JlYWNoKGdsb2IoJHBkLicvaW5jbHVkZXMvKi8qLnBocCcpIGFzICRmKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoKCIvJ3JlZnVuZCdccyo9PnxcW1xzKidyZWZ1bmQnXHMqXF1ccyo9LyIsJGMpKXsgJG9bJ3JlZnVuZF9zcmMnXVtiYXNlbmFtZSgkZildPSRncmVwKCRmLGFycmF5KCIvJ3JlZnVuZCcvIiwiL2dldF9yZWZ1bmRzLyIpLDIsMTIsNTAwKTsgfSB9CiAgJG9bJ3RwbF9lbmFibGVkJ109YXJyYXkoKTsgaWYoY2xhc3NfZXhpc3RzKCdXb29Db21tZXJjZV9EZWxpdmVyeV9Ob3Rlc1xcVGVtcGxhdGVzJyl8fGNsYXNzX2V4aXN0cygnXFxXQ0ROXFxUZW1wbGF0ZXMnKSl7IH0KICBmb3JlYWNoKGFycmF5KCdpbnZvaWNlJywnY3JlZGl0bm90ZScpIGFzICR0KXsgJG9bJ3RwbF9lbmFibGVkJ11bJHRdPW51bGw7IH0KICAkb1snY2xhc3NlcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSxmdW5jdGlvbigkYyl7IHJldHVybiBzdHJpcG9zKCRjLCd3Y2RuJykhPT1mYWxzZXx8c3RyaXBvcygkYywnZGVsaXZlcnlfbm90ZXMnKSE9PWZhbHNlOyB9KSk7CiAgJG9bJ2Rlc2tfZ3JlcCddPSRncmVwKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGVzay5waHAnLGFycmF5KCcvY3JlZGl0bm90ZXxrcmVkaXQvaScpLDIsMTAsNTAwKTsKICAkb1snYXRzaXNha19ncmVwJ109JGdyZXAoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdHNpc2FreW1hcy5waHAnLGFycmF5KCcvY3JlZGl0bm90ZXxrcmVkaXR8S3JlZGl0aW4vaScpLDIsMTAsNTAwKTsKICAkb1snYmFzZV9pbnZvaWNlX251bWJlciddPSRncmVwKCR0aC4nL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzL2Jhc2UucGhwJyxhcnJheSgnL1wkaW52b2ljZV9udW1iZXJccyo9LycsJy9LUi0vJywnL3BldHNob3BfZ2V0XyhhdnBufGlhcHZ8aW52b2ljZSkvJyksMSwyMCw0MDApOwogICRvWydtaWdyYXRpb25fY3JlZGl0bm90ZSddPSRncmVwKCRwZC4nL2luY2x1ZGVzL2NvcmUvY2xhc3MtbWlncmF0aW9uLnBocCcsYXJyYXkoJy9jcmVkaXRub3RlL2knKSwzLDYsNjAwKTsKICAkb1snc2V0dGluZ3NfYXBpX2NyZWRpdG5vdGUnXT0kZ3JlcCgkcGQuJy9pbmNsdWRlcy9hcGkvY2xhc3Mtc2V0dGluZ3MucGhwJyxhcnJheSgnL2NyZWRpdG5vdGUvaScpLDMsNiw2MDApOwogICRvWydlbmdpbmVfMjY4MF8yNzAwJ109JHNlZygkcGQuJy9pbmNsdWRlcy9zZXJ2aWNlcy90ZW1wbGF0ZS9jbGFzcy10ZW1wbGF0ZS1lbmdpbmUucGhwJywyNjg1LDI3MDApOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-063816';
const GKEY='ps_r7';
const PHASES=["GO"];
const OUT='analize/s1617_r7.json';
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
