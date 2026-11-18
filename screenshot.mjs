process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1bCBDaHVydSBzZW5vcyB2cyBkYWJhcnRpbmVzIFZGIG51b3RyYXVrb3MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODg1bCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4ODVsJ107CiAgdHJ5ewogICRhdHQ9WzM4MzgzLDM4Mzg1LDM4Mzg2LDM4Mzg4LDM4Mzg5LDM4MzkxLDM4MzkyXTsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBhdHRhY2htZW50X2lkIGEsIGltYWdlX3VybCB1IEZST00geyRQfXBteGlfaW1hZ2VzIFdIRVJFIGF0dGFjaG1lbnRfaWQgSU4gKCIuaW1wbG9kZSgnLCcsJGF0dCkuIikiLEFSUkFZX0EpOwogICRyWydzZW5vcyddPVtdOyBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJGY9Z2V0X2F0dGFjaGVkX2ZpbGUoJHhbJ2EnXSk7ICRyWydzZW5vcyddW109WydhdHQnPT4keFsnYSddLCd1cmwnPT4keFsndSddLCdtdXN1X3NoYSc9PiRmJiZpc19maWxlKCRmKT9zdWJzdHIoc2hhMV9maWxlKCRmKSwwLDEwKTpudWxsXTsgfQogICRnZXQ9ZnVuY3Rpb24oJHUpeyAkcmVzPXdwX3JlbW90ZV9nZXQoJHUsWyd0aW1lb3V0Jz0+MjBdKTsgaWYoaXNfd3BfZXJyb3IoJHJlcykpIHJldHVybiBbJ2Vycic9PiRyZXMtPmdldF9lcnJvcl9tZXNzYWdlKCldOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzKTsgcmV0dXJuIFsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyZXMpLCdsZW4nPT5zdHJsZW4oJGIpLCdzaGEnPT5zdWJzdHIoc2hhMSgkYiksMCwxMCksJ3R5cGUnPT53cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyZXMsJ2NvbnRlbnQtdHlwZScpXTsgfTsKICBmb3JlYWNoKCRyWydzZW5vcyddIGFzICYkcyl7ICRzWyd2Zl9kYWJhciddPSRnZXQoJHNbJ3VybCddKTsgfQogICRuYXVqaT1bJ0VVRDcyOCc9PlszNzg2OSwzNzg3MF0sJ0VVRDcyOSc9PlszODU2OV0sJ0VVRDczOSc9PlszODU3MCwzODU3MV0sJ0VVRDc0MCc9PlszODU2NiwzODU2NywzODU2OF1dOwogIGZvcmVhY2goJG5hdWppIGFzICRza3U9PiRpZHMpeyBmb3JlYWNoKCRpZHMgYXMgJGkpeyAkclsneG1sX2RhYmFyJ11bJHNrdV1bJGldPSRnZXQoImh0dHBzOi8vYWRtaW4uYjJiLnZldGZhcm1hcy5sdC9hcGkvcHJvZHVjdC1pbWFnZXMvJGkvcG5nIik7IH0gfQogIC8vIGtpZWsgVkYgcHJla2l1IHR1cmkgbnVvdHJhdWthIHN1IFVSTCwga3VyaW8gbmVyYSBkYWJhcnRpbmlhbWUgWE1MCiAgJHg9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXZmLWNhY2hlLnhtbCcpOyBwcmVnX21hdGNoX2FsbCgnI3Byb2R1Y3QtaW1hZ2VzLyhcZCspLyMnLCR4LCRtbSk7ICR4bWxpZHM9YXJyYXlfZmxpcCgkbW1bMV0pOyAkclsneG1sX2ltZ19uJ109Y291bnQoJHhtbGlkcyk7CiAgJGFsbD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpLmF0dGFjaG1lbnRfaWQgYSwgaS5pbWFnZV91cmwgdSwgcC5wb3N0X3BhcmVudCBwcCBGUk9NIHskUH1wbXhpX2ltYWdlcyBpIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1pLmF0dGFjaG1lbnRfaWQgV0hFUkUgaS5pbWFnZV91cmwgTElLRSAnJXByb2R1Y3QtaW1hZ2VzLyUnIixBUlJBWV9BKTsKICAkcGFzPVtdOyBmb3JlYWNoKCRhbGwgYXMgJHkpeyBpZihwcmVnX21hdGNoKCcjcHJvZHVjdC1pbWFnZXMvKFxkKykvIycsJHlbJ3UnXSwkbSkgJiYgIWlzc2V0KCR4bWxpZHNbJG1bMV1dKSkgJHBhc1soaW50KSR5WydwcCddXT0xOyB9CiAgJHB1Yj1bXTsgZm9yZWFjaChhcnJheV9rZXlzKCRwYXMpIGFzICRwaWQpeyBpZigkcGlkICYmIGdldF9wb3N0X3N0YXR1cygkcGlkKT09PSdwdWJsaXNoJyl7ICR0aD0oaW50KWdldF9wb3N0X3RodW1ibmFpbF9pZCgkcGlkKTsgJHB1YltdPSRwaWQ7IH0gfQogICRyWydwcmVrZXNfc3VfcGFzZW51c2l1X3VybF9uJ109Y291bnQoJHBhcyk7ICRyWydqdV9wdWJsaWt1b3RhX24nXT1jb3VudCgkcHViKTsgJHJbJ3B2eiddPWFycmF5X21hcChmbigkcCk9PiRwLicgJy5nZXRfcG9zdF9tZXRhKCRwLCdfc2t1Jyx0cnVlKS4nICcubWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJHApLDAsNTUpLGFycmF5X3NsaWNlKCRwdWIsMCwyNSkpOwogIH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-102617';
const GKEY='ps_s1885l';
const PHASES=["1"];
const OUT='analize/s1885l.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
