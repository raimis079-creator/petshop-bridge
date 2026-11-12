process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUwZCByeXRvIHR5cmltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODUwZCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTQwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NTBkJ107CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzPSd3Yy1wcm9jZXNzaW5nJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdDwnMjAyNi0xMS0xMSAwNjowMCcgT1JERVIgQlkgaWQiKTsKICBmb3JlYWNoKGFycmF5X3VuaXF1ZSgkaWRzKSBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsgJG5uPVtdOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjZdKSBhcyAkbil7ICRubltdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDE1MCk7IH0KICAgICRpdD1bXTsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJHgpeyAkcD0keC0+Z2V0X3Byb2R1Y3QoKTsgJGl0W109bWJfc3Vic3RyKCR4LT5nZXRfbmFtZSgpLDAsNDApLicgeCcuJHgtPmdldF9xdWFudGl0eSgpLicgc3Q9Jy4oJHA/JHAtPmdldF9zdG9ja19xdWFudGl0eSgpOictJyk7IH0KICAgICRyWydvJ11bJG8tPmdldF9vcmRlcl9udW1iZXIoKV09WydpZCc9PiRpZCwncG0nPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJ3BhaWQnPT4kby0+Z2V0X2RhdGVfcGFpZCgpPyRvLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ20tZCBIOmknKTpudWxsLCdzdWt1cnRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdzaGlwJz0+JG8tPmdldF9zaGlwcGluZ19tZXRob2QoKSwnbm90ZXMnPT4kbm4sJ2l0ZW1zJz0+JGl0XTsgfQogICRyWydpbXAyX2hpc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aW1lX3J1biwgTEVGVChzdW1tYXJ5LDEyMCkgcywgZGF0ZSBGUk9NIHskUH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTIgQU5EIGRhdGU+PU5PVygpLUlOVEVSVkFMIDIgREFZIE9SREVSIEJZIGlkIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgJHJbJ3Nhcmdhc19mYXRhbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhaWthcyxseWdpcyxMRUZUKHppbnV0ZSwxNjApIHosZmFpbGFzLGVpbHV0ZSxMRUZUKHVybCwyMDApIHVybCxraWVrIEZST00geyRQfXBzX3Nhcmdhc19rbGFpZG9zIFdIRVJFIGxhaWthcz49JzIwMjYtMTEtMTEnIEFORCAobHlnaXMgTElLRSAnJWZhdGFsJScgT1IgemludXRlIExJS0UgJyVtZW1vcnklJykgT1JERVIgQlkgbGFpa2FzIExJTUlUIDMwIixBUlJBWV9BKTsKICAkclsnYWNjNTAwJ109W107ICRyWydhY2NfaW1wJ109W107CiAgZm9yZWFjaChbJy4xJywnLjInXSBhcyAkc2Z4KXsgJGZ4PWRpcm5hbWUoQUJTUEFUSCkuJy9sb2dzL05vdi0yMDI2LnRhci5neicuJHNmeDsgJGg9QGd6b3BlbigkZngsJ3JiJyk7IGlmKCEkaCkgY29udGludWU7IHdoaWxlKCgkbG49Z3pnZXRzKCRoLDgxOTIpKSE9PWZhbHNlKXsgaWYoIXByZWdfbWF0Y2goJyNeKFxTKykgLio/XFsoW15cXV0rKVxdICIoXHcrKSAoW14gIl0qKVteIl0qIiAoXGR7M30pIChcUyspIycsJGxuLCRtKSkgY29udGludWU7ICRpcD1wcmVnX3JlcGxhY2UoJy9cLlxkKyQvJywnLngnLCRtWzFdKTsgaWYoJG1bNV09PT0nNTAwJykgJHJbJ2FjYzUwMCddW109JG1bMl0uJyAnLiRtWzNdLicgJy5tYl9zdWJzdHIoJG1bNF0sMCwxNTApLicgJy4kaXA7IGlmKHN0cnBvcygkbVs0XSwnaW1wb3J0X2tleScpIT09ZmFsc2UgJiYgc3RycG9zKCRtWzRdLCdpbXBvcnRfaWQ9MicpIT09ZmFsc2UpICRyWydhY2NfaW1wJ11bXT0kbVsyXS4nICcubWJfc3Vic3RyKCRtWzRdLDAsOTApLicgJy4kbVs1XTsgfSBnemNsb3NlKCRoKTsgfQogICRyWydhY2M1MDAnXT1hcnJheV9zbGljZSgkclsnYWNjNTAwJ10sLTYwKTsgJHJbJ2FjY19pbXAnXT1hcnJheV9zbGljZSgkclsnYWNjX2ltcCddLC0xNSk7CiAgJGxmPScvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvbG9ncy9waHBfZXJyb3IubG9nJzsgJHN6PWZpbGVzaXplKCRsZik7ICRmaD1mb3BlbigkbGYsJ3InKTsgZnNlZWsoJGZoLG1heCgwLCRzei0yNTAwMDAwKSk7ICR0eD1mcmVhZCgkZmgsMjUwMDAwMCk7IGZjbG9zZSgkZmgpOyAkTD1leHBsb2RlKCJcbiIsJHR4KTsgJGhpdD1bXTsKICBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihzdHJwb3MoJGxuLCdBbGxvd2VkIG1lbW9yeScpIT09ZmFsc2UgJiYgc3RycG9zKCRsbiwnMTEtTm92LTIwMjYnKSE9PWZhbHNlKXsgJGN0eD1bXTsgZm9yKCRqPW1heCgwLCRpLTIpOyRqPD1taW4oY291bnQoJEwpLTEsJGkrMyk7JGorKykgJGN0eFtdPW1iX3N1YnN0cigkTFskal0sMCwyNjApOyAkaGl0W109JGN0eDsgfSB9CiAgJHJbJ21lbV9jdHgnXT1hcnJheV9zbGljZSgkaGl0LDAsNCk7ICRyWydtZW1fY3R4X3Bhc2snXT1hcnJheV9zbGljZSgkaGl0LC0yKTsKICAkeD1AZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnKTsgJG89W107IGlmKCR4KSBmb3IoJGk9NTE3MDskaTw9NTE4MDskaSsrKSAkb1tdPSRpLic6ICcucnRyaW0obWJfc3Vic3RyKCR4WyRpLTFdPz8nJywwLDIyMCkpOyAkclsna2F0YWxvZ2FzX3NyYyddPSRvOwogICRyWydjYW5jJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgby5zdGF0dXMsIG8uZGF0ZV9jcmVhdGVkX2dtdCwgby50b3RhbF9hbW91bnQsIG8ucGF5bWVudF9tZXRob2QgRlJPTSB7JFB9d2Nfb3JkZXJzIG8gV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0xMS0xMCAyMDowMCcgQU5EIG8uc3RhdHVzIE5PVCBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAkZnM9Z2xvYihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2MtbG9ncy9wbGFjZS1vcmRlci1kZWJ1Zy0qJyk/OltdOyBzb3J0KCRmcyk7IGZvcmVhY2goJGZzIGFzICRmKXsgJGQ9c3Vic3RyKGJhc2VuYW1lKCRmKSwyNywxMCk7IGlmKCRkPCcyMDI2LTExLTExJykgY29udGludWU7ICRyWydwb2QnXVtdPWJhc2VuYW1lKCRmKS4nICcuY291bnQoYXJyYXlfZmlsdGVyKGV4cGxvZGUoIlxuIixmaWxlX2dldF9jb250ZW50cygkZikpKSk7IH0KICAkcGw9Z2V0X29wdGlvbigncGV0c2hvcF9wcmFnbWFfbG9nJyk7ICRyWydwcmFnbWFfbG9nJ109aXNfYXJyYXkoJHBsKT9hcnJheV9zbGljZSgkcGwsLTMpOihpc19zdHJpbmcoJHBsKT9tYl9zdWJzdHIoJHBsLC02MDApOiRwbCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-074722';
const GKEY='ps_s1850d';
const PHASES=["1"];
const OUT='analize/s1850d.json';
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
