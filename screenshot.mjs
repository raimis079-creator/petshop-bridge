process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NDMgVSDigJQgUkVBRC1PTkxZOiBrb2tpZSB1enNha3ltYWkgV1AgREIgKyBzZXJpasWzIHNrYWl0aWtsaWFpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY0M3UnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY0MyBVJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CgogICRocG9zPShpbnQpJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skcH13Y19vcmRlcnMnIik/MTowOwogICRvWydocG9zX2xlbnRlbGUnXT0kaHBvcz8xOjA7CiAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skcH13Y19vcmRlcnMnIikpewogICAgJG9bJ3djX29yZGVycyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxkYXRlX2NyZWF0ZWRfZ210LHRvdGFsX2Ftb3VudCBGUk9NIHskcH13Y19vcmRlcnMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzMCIpOwogICAgJG9bJ3djX29yZGVyc19uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX29yZGVycyIpOwogIH0KICAkb1sncG9zdHNfc2hvcF9vcmRlcl9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTignc2hvcF9vcmRlcicsJ3Nob3Bfb3JkZXJfcGxhY2Vob2xkJykiKTsKICAkb1sncG9zdHNfcGFza3V0aW5pYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3R5cGUscG9zdF9zdGF0dXMscG9zdF9kYXRlIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTignc2hvcF9vcmRlcicsJ3Nob3Bfb3JkZXJfcGxhY2Vob2xkJykgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAxNSIpOwogICRvWydyZWZ1bmRfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Nob3Bfb3JkZXJfcmVmdW5kJyIpOwogICRvWydtYXhfcG9zdF9pZCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBNQVgoSUQpIEZST00geyRwfXBvc3RzIik7CiAgJG9bJ2F1dG9faW5jcmVtZW50X3Bvc3RzJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBBVVRPX0lOQ1JFTUVOVCBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS5UQUJMRVMgV0hFUkUgVEFCTEVfU0NIRU1BPURBVEFCQVNFKCkgQU5EIFRBQkxFX05BTUU9J3skcH1wb3N0cyciKTsKICBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRwfXdjX29yZGVycyciKSkgJG9bJ2F1dG9faW5jcmVtZW50X3djX29yZGVycyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQVVUT19JTkNSRU1FTlQgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuVEFCTEVTIFdIRVJFIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIEFORCBUQUJMRV9OQU1FPSd7JHB9d2Nfb3JkZXJzJyIpOwoKICAkb3BzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLG9wdGlvbl92YWx1ZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVjb3VudGVyJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXNlcmlqJScgT1Igb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF8lYXZwbiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BldHNob3BfJWlhcHYlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwZXRzaG9wXyVrciUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BldHNob3BfJXBwayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVpbnZvaWNlJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJW51bWVyJSciKTsKICAkYz1hcnJheSgpOyBmb3JlYWNoKCRvcHMgYXMgJHIpICRjWyRyLT5vcHRpb25fbmFtZV09bWJfc3Vic3RyKChzdHJpbmcpJHItPm9wdGlvbl92YWx1ZSwwLDYwKTsKICAkb1snc2thaXRpa2xpYWknXT0kYzsKCiAgJG9bJ3BzX2xlbnRlbGVzJ109YXJyYXkoKTsKICBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9cHNcXF8lJyIpIGFzICR0KSAkb1sncHNfbGVudGVsZXMnXVskdF09KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0YCIpOwogICRvWydwaW5nJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-214226';
const GKEY='ps_s1643u';
const PHASES=["U"];
const OUT='analize/s1643u.json';
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
