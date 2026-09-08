process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQwZCBwcmltaW5pbXUgbGFpc2thaSBwZXJ6aXVyYWkgaSB0ZXJyYUAgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19wMyddKT8kX0dFVFsncHNfcDMnXTonJykhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY0MGQnKTsKICB0cnl7CiAgICB1cGRhdGVfb3B0aW9uKCdwc19kZXZfcGFzdGFzX2xlaXN0aScsJ3RlcnJhQHBldHNob3AubHQnKTsKICAgIC8vIDEpIGJhY3MgIlV6c2FreW1hcyBnYXV0YXMiICsgSUFQVjogbmF1amFzIG9uLWhvbGQgdXpzYWt5bWFzCiAgICAkbj13Y19jcmVhdGVfb3JkZXIoKTsKICAgICRuLT5hZGRfcHJvZHVjdCh3Y19nZXRfcHJvZHVjdCgxODI3MiksMSk7CiAgICAkc2g9bmV3IFdDX09yZGVyX0l0ZW1fU2hpcHBpbmcoKTsgJHNoLT5zZXRfbWV0aG9kX3RpdGxlKCdWRU5JUEFLIEt1cmplcmlzJyk7CiAgICAkc2gtPnNldF9tZXRob2RfaWQoJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2NvdXJpZXJfbWV0aG9kJyk7ICRzaC0+c2V0X2luc3RhbmNlX2lkKDIpOyAkc2gtPnNldF90b3RhbCgnNC45OScpOyAkbi0+YWRkX2l0ZW0oJHNoKTsKICAgICRhZHI9YXJyYXkoJ2ZpcnN0X25hbWUnPT4nUmFpbXVuZGFzJywnbGFzdF9uYW1lJz0+J0J1bGFrYXMnLCdlbWFpbCc9Pid0ZXJyYUBwZXRzaG9wLmx0JywncGhvbmUnPT4nKzM3MDYwMDAwMDAwJywnYWRkcmVzc18xJz0+J1Rlc3RvIGcuIDEnLCdjaXR5Jz0+J1ZpbG5pdXMnLCdwb3N0Y29kZSc9PicwMTEwMCcsJ2NvdW50cnknPT4nTFQnKTsKICAgICRuLT5zZXRfYWRkcmVzcygkYWRyLCdiaWxsaW5nJyk7ICRuLT5zZXRfYWRkcmVzcygkYWRyLCdzaGlwcGluZycpOwogICAgJG4tPnNldF9wYXltZW50X21ldGhvZCgnYmFjcycpOyAkbi0+c2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCdCYW5raW5pcyBwYXZlZGltYXMnKTsgJG4tPmNhbGN1bGF0ZV90b3RhbHMoKTsKICAgICRuLT51cGRhdGVfc3RhdHVzKCdvbi1ob2xkJywnUzE2NDAgcHJpbWluaW3FsyBwZXLFvmnFq3JhJyx0cnVlKTsKICAgICRpZD0kbi0+Z2V0X2lkKCk7ICRvWyd1enNha3ltYXMnXT0kaWQ7CiAgICBkb19hY3Rpb24oJ3BldHNob3Bfc2VuZF9vcmRlcl9yZWNlaXZlZF9lbWFpbCcsJGlkKTsKICAgIC8vIDIpIGR1bm5pbmctMSBzYWJsb25hcwogICAgJGthbmQ9YXJyYXkoV1BNVV9QTFVHSU5fRElSLicvZW1haWxzL2R1bm5pbmctMS5waHAnLFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZW1haWxzL2R1bm5pbmctMS5waHAnLAogICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1sYWlza2FpL2VtYWlscy9kdW5uaW5nLTEucGhwJyxnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2VtYWlscy9kdW5uaW5nLTEucGhwJyk7CiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi9kdW5uaW5nLTEucGhwJykgYXMgJGcpeyAka2FuZFtdPSRnOyB9CiAgICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nLyovKi9kdW5uaW5nLTEucGhwJykgYXMgJGcpeyAka2FuZFtdPSRnOyB9CiAgICAkZGY9Jyc7IGZvcmVhY2goJGthbmQgYXMgJGspeyBpZihmaWxlX2V4aXN0cygkaykpeyAkZGY9JGs7IGJyZWFrOyB9IH0KICAgICRvWydkdW5uaW5nX2ZhaWxhcyddPSRkZj9zdHJfcmVwbGFjZShBQlNQQVRILCcvJywkZGYpOidORVJBU1RBJzsKICAgIGlmKCRkZiAmJiBjbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnKSAmJiBtZXRob2RfZXhpc3RzKCdQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoJywncmVuZGVyJykpewogICAgICAkb1snZHVubmluZ19rZWxpYXMnXT0nZGlzcGF0Y2gtcmVuZGVyJzsKICAgIH0KICAgIGlmKCRkZil7CiAgICAgICRjdHg9YXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdvcmRlcic9PndjX2dldF9vcmRlcigkaWQpLCdmaXJzdF9uYW1lJz0+J1JhaW11bmRhcycsJ3N1bWEnPT53Y19nZXRfb3JkZXIoJGlkKS0+Z2V0X3RvdGFsKCksJ25yJz0+JGlkKTsKICAgICAgb2Jfc3RhcnQoKTsgJHRwbD1pbmNsdWRlICRkZjsgJGh0bWw9b2JfZ2V0X2NsZWFuKCk7CiAgICAgIGlmKGlzX3N0cmluZygkdHBsKSYmc3RybGVuKCR0cGwpPjUwKSAkaHRtbD0kdHBsOwogICAgICBpZihpc19hcnJheSgkdHBsKSYmaXNzZXQoJHRwbFsnaHRtbCddKSkgJGh0bWw9JHRwbFsnaHRtbCddOwogICAgICBpZigkaHRtbCl7IFdDKCktPm1haWxlcigpLT5zZW5kKCd0ZXJyYUBwZXRzaG9wLmx0JywnW1BFUsW9ScWqUkFdIGR1bm5pbmctMSDigJQgbW9rxJdqaW1vIHByaW1pbmltYXMnLCRodG1sKTsgJG9bJ2R1bm5pbmdfaXNzaXVzdGEnXT0xOyB9CiAgICAgIGVsc2UgJG9bJ2R1bm5pbmdfaXNzaXVzdGEnXT0ncmVuZGVyIHR1c2NpYXMg4oCUIHJlaWtlcyBwZXIgZGlzcGF0Y2gnOwogICAgfQogICAgLy8gMy00KSBjYXJ0X2FiYW5kb25lZCBkcmFmdCByZW5kZXJpYWkKICAgIGdsb2JhbCAkd3BkYjsgJFQ9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfY29udGVudCc7CiAgICBmb3JlYWNoKGFycmF5KCdjYXJ0X2FiYW5kb25lZCcsJ2NhcnRfYWJhbmRvbmVkXzInKSBhcyAkZmwpewogICAgICAkcj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSBgJFRgIFdIRVJFIGZsb3c9JXMgT1JERVIgQlkgdmVyc2lvbiBERVNDIExJTUlUIDEiLCRmbCksQVJSQVlfQSk7CiAgICAgIGlmKCEkcil7ICRvWyRmbF09J25lcmFzdGEnOyBjb250aW51ZTsgfQogICAgICAkYmw9anNvbl9kZWNvZGUoJHJbJ2Jsb2NrcyddLHRydWUpOwogICAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfTGFpc2thaV9UdXJpbnlzJykmJm1ldGhvZF9leGlzdHMoJ1BldHNob3BfTGFpc2thaV9UdXJpbnlzJywncmVuZGVyaW50aScpKXsKICAgICAgICAkaHRtbD1QZXRzaG9wX0xhaXNrYWlfVHVyaW55czo6cmVuZGVyaW50aSgkZmwsJGJsLCRyKTsKICAgICAgfSBlbHNlIHsKICAgICAgICAkaHRtbD0nJzsKICAgICAgICBmb3JlYWNoKChhcnJheSkkYmwgYXMgJGIpeyAkdHg9aXNfYXJyYXkoJGIpPygkYlsndGV4dCddPz8kYlsndGVrc3RhcyddPz9qc29uX2VuY29kZSgkYixKU09OX1VORVNDQVBFRF9VTklDT0RFKSk6KHN0cmluZykkYjsKICAgICAgICAgICRodG1sLj0nPHA+Jy5ubDJicihlc2NfaHRtbCgkdHgpKS4nPC9wPic7IH0KICAgICAgICAkaHRtbD1XQygpLT5tYWlsZXIoKS0+d3JhcF9tZXNzYWdlKCRyWydzdWJqZWN0J10/PyRmbCwkaHRtbCk7CiAgICAgIH0KICAgICAgV0MoKS0+bWFpbGVyKCktPnNlbmQoJ3RlcnJhQHBldHNob3AubHQnLCdbUEVSxb1JxapSQSBkcmFmdF0gJy4kZmwuKCRyWydzdWJqZWN0J10/PycnPycg4oCUICcuJHJbJ3N1YmplY3QnXTonJyksJGh0bWwpOwogICAgICAkb1skZmxdPSdpc3NpdXN0YSB2Jy4kclsndmVyc2lvbiddOwogICAgfQogICAgJHo9KGFycmF5KWdldF9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfenVybmFsYXMnLGFycmF5KCkpOwogICAgZm9yZWFjaChhcnJheV9zbGljZSgkeiwtNSkgYXMgJHgpeyAkb1sneiddW109JHhbJ2xhaWthcyddLicgfCAnLiR4Wyd0ZW1hJ10uJyB8IHByOicuJHhbJ3ByaWVkYWknXS4nICcuJHhbJ2ZhaWxhaSddOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-081510';
const GKEY='ps_p3';
const PHASES=["GO"];
const OUT='analize/s1640_d.json';
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
