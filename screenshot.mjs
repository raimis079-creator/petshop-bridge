process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTYgcnVuIGUyciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBXQyAxMSBgd2NfY3JlYXRlX3JlZnVuZGAgKHdjLW9yZGVyLWZ1bmN0aW9ucy5waHApLCBgZ2V0X29yZGVyX2l0ZW1fdG90YWxzYCByZWZ1bmQgZWlsdXTEl3MgKGFic3RyYWN0cy9hYnN0cmFjdC13Yy1vcmRlci5waHApLCB0ZW1vcyBiYXNlLnBocCBzdW3FsyDFoWFsdGluaWFpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lMnInXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYxNiBlMnInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkSj1mdW5jdGlvbigkbyl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfTsKICAkc3JjPWZ1bmN0aW9uKCRmaWxlLCRwYXQsJGxlbj0yMjAwLCRiYWNrPTApeyAkYz0oc3RyaW5nKUBmaWxlX2dldF9jb250ZW50cygkZmlsZSk7IGlmKCEkYykgcmV0dXJuICdOxJZSQSAnLiRmaWxlOyAkaT1zdHJwb3MoJGMsJHBhdCk7IGlmKCRpPT09ZmFsc2UpIHJldHVybiAncGF0dGVybiBuZXJhc3RhczogJy4kcGF0OyByZXR1cm4gc3Vic3RyKCRjLG1heCgwLCRpLSRiYWNrKSwkbGVuKTsgfTsKICB0cnl7CiAgJHdjPVdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZSc7CiAgJG9bJ2ZpbGVzJ109YXJyYXkoKTsgZm9yZWFjaChhcnJheSgnL2luY2x1ZGVzL3djLW9yZGVyLWZ1bmN0aW9ucy5waHAnLCcvaW5jbHVkZXMvYWJzdHJhY3RzL2Fic3RyYWN0LXdjLW9yZGVyLnBocCcsJy9pbmNsdWRlcy9hYnN0cmFjdC13Yy1vcmRlci5waHAnLCcvaW5jbHVkZXMvY2xhc3Mtd2Mtb3JkZXIucGhwJykgYXMgJGYpeyAkb1snZmlsZXMnXVskZl09ZmlsZV9leGlzdHMoJHdjLiRmKTsgfQogICRvWyd3Y19jcmVhdGVfcmVmdW5kJ109JHNyYygkd2MuJy9pbmNsdWRlcy93Yy1vcmRlci1mdW5jdGlvbnMucGhwJywnZnVuY3Rpb24gd2NfY3JlYXRlX3JlZnVuZCcsNTYwMCk7CiAgJG9bJ3djX3Jlc3RvY2snXT0kc3JjKCR3Yy4nL2luY2x1ZGVzL3djLW9yZGVyLWZ1bmN0aW9ucy5waHAnLCdmdW5jdGlvbiB3Y19yZXN0b2NrX3JlZnVuZGVkX2l0ZW1zJywxODAwKTsKICAkYWI9ZmlsZV9leGlzdHMoJHdjLicvaW5jbHVkZXMvYWJzdHJhY3RzL2Fic3RyYWN0LXdjLW9yZGVyLnBocCcpPyR3Yy4nL2luY2x1ZGVzL2Fic3RyYWN0cy9hYnN0cmFjdC13Yy1vcmRlci5waHAnOiR3Yy4nL2luY2x1ZGVzL2Fic3RyYWN0LXdjLW9yZGVyLnBocCc7CiAgJG9bJ2l0ZW1fdG90YWxzX3JlZnVuZCddPSRzcmMoJGFiLCckcmVmdW5kcyA9ICR0aGlzLT5nZXRfcmVmdW5kcygpJywxNTAwLDMwMCk7IGlmKHN0cnBvcygkb1snaXRlbV90b3RhbHNfcmVmdW5kJ10sJ25lcmFzdGFzJykhPT1mYWxzZSl7ICRvWydpdGVtX3RvdGFsc19yZWZ1bmQnXT0kc3JjKCR3Yy4nL2luY2x1ZGVzL2NsYXNzLXdjLW9yZGVyLnBocCcsJyRyZWZ1bmRzID0gJHRoaXMtPmdldF9yZWZ1bmRzKCknLDE1MDAsMzAwKTsgfQogICRvWydpdGVtX3RvdGFsc19mbiddPSRzcmMoJHdjLicvaW5jbHVkZXMvY2xhc3Mtd2Mtb3JkZXIucGhwJywnZnVuY3Rpb24gZ2V0X29yZGVyX2l0ZW1fdG90YWxzJywzNjAwKTsKICAkYnA9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS1kZWxpdmVyeS1ub3Rlcy9iYXNlLnBocCc7ICRjPShzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKCRicCk7ICRvWydiYXNlX3NpemUnXT1zdHJsZW4oJGMpOwogIHByZWdfbWF0Y2hfYWxsKCcvZ2V0X2l0ZW1zXChbXildKlwpfGdldF9xdWFudGl0eVwoXCl8Z2V0X3RvdGFsXChcKXxnZXRfc3VidG90YWxcKFwpfGdldF90b3RhbF90YXhcKFwpfGdldF9zaGlwcGluZ190b3RhbFwoXCl8Z2V0X3RvdGFsX3JlZnVuZGVkfGdldF9yZWZ1bmRzfGdldF9xdHlfcmVmdW5kZWRfZm9yX2l0ZW18Z2V0X29yZGVyX2l0ZW1fdG90YWxzfHJlZnVuZHxjcmVkaXRub3RlfEtSLUFWUE4vaScsJGMsJG0pOyAkb1snYmFzZV9jYWxscyddPWFycmF5X2NvdW50X3ZhbHVlcygkbVswXSk7CiAgJG9bJ2Jhc2VfaXRlbXMnXT0kc3JjKCRicCwnZ2V0X2l0ZW1zKCcsMTYwMCw0MDApOwogICRvWydiYXNlX3RvdGFscyddPSRzcmMoJGJwLCdnZXRfc2hpcHBpbmdfdG90YWwnLDE0MDAsNzAwKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRGaWxlKCkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-194531';
const GKEY='ps_e2r';
const PHASES=["R"];
const OUT='analize/s1616_e2r.json';
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
