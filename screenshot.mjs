process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzggaCDigJQgUkVBRC1PTkxZOiBIaWthcmkvdHZlbmtpbmnFsyDFvnV2xbMgbWFpc3RvIGthaW5vcywgc2F2aWthaW5vcywgbWFyxb5vcywgbGlrdcSNaWFpLCBwYXJkYXZpbWFpIChpc3RvcmlqYSArIFdDKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfc2VjOGgnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY3OCBoJyk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJG9bJ2lzdF9sZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9cHNfaXN0JSciKTsgJG9bJ2Zha3RfbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXBzX2Zha3QlJyIpOwogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBwLklEIEZST00geyRwfXBvc3RzIHAgTEVGVCBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgTEVGVCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBMRUZUIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgKHAucG9zdF90aXRsZSBMSUtFICclSGlrYXJpJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyVLYXRyaW5leCUnIE9SIHAucG9zdF90aXRsZSBMSUtFICcla29pJScgT1IgdC5zbHVnIExJS0UgJyV0dmVua2luJScgT1IgKHR0LnRheG9ub215PSdwYV9nYW1pbnRvamFzJyBBTkQgdC5uYW1lIExJS0UgJyVIaWthcmklJykpIE9SREVSIEJZIHAuSUQiKTsKICAkb1snbiddPWNvdW50KCRpZHMpOyAkb1sncHJla2VzJ109YXJyYXkoKTsKICAvLyBpc3RvcmlqYTogcmFzdGkgbGVudGVsxJkgc3Ugc2t1CiAgJGlzdD1udWxsOyBmb3JlYWNoKCRvWydpc3RfbGVudGVsZXMnXSBhcyAkdCl7ICRjPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOyBpZihpbl9hcnJheSgnc2t1JywkYyl8fGluX2FycmF5KCdwcm9kdWN0X2lkJywkYykpIHsgJGlzdD0kdDsgJG9bJ2lzdF9jb2xzXycuJHRdPSRjOyB9IH0KICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG09ZnVuY3Rpb24oJGspIHVzZSgkd3BkYiwkcCwkaWQpeyByZXR1cm4gJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9JWQgQU5EIG1ldGFfa2V5PSVzIiwkaWQsJGspKTsgfTsKICAgICRwcj0oZmxvYXQpJG0oJ19wcmljZScpOyAkcnA9KGZsb2F0KSRtKCdfcmVndWxhcl9wcmljZScpOyAkY29zdD0oZmxvYXQpKCRtKCdfY29zdF9wcmljZScpPzooJG0oJ192Zl9jb3N0Jyk/OiRtKCdfemJfY29zdCcpKSk7ICRuZXQ9JHByLzEuMjE7ICRtej0kbmV0PjAmJiRjb3N0PjA/cm91bmQoKCRuZXQtJGNvc3QpLyRuZXQqMTAwKTpudWxsOwogICAgJHNrdT0kbSgnX3NrdScpOyAkc3Q9JG0oJ19zdG9jaycpOyAkb3duPSRtKCdfb3duX3N0b2NrX3F0eScpOyAkc2FuPSRtKCdfcHNfc2FuZGVsaXMnKTsgJHN0YXQ9Z2V0X3Bvc3Rfc3RhdHVzKCRpZCk7CiAgICAkczkwPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgU1VNKGwucHJvZHVjdF9xdHkpIEZST00geyRwfXdjX29yZGVyX3Byb2R1Y3RfbG9va3VwIGwgSk9JTiB7JHB9d2Nfb3JkZXJzIHcgT04gdy5pZD1sLm9yZGVyX2lkIFdIRVJFIGwucHJvZHVjdF9pZD0lZCBBTkQgdy5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgdy5kYXRlX2NyZWF0ZWRfZ210PicyMDI2LTA5LTA5JyIsJGlkKSk7CiAgICAkczEyPW51bGw7IGlmKCRpc3QgJiYgJHNrdSl7ICRzMTI9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBTVU0oa2lla2lzKSBGUk9NICRpc3QgV0hFUkUgc2t1PSVzIiwkc2t1KSk7IH0KICAgICRvWydwcmVrZXMnXVtdPWFycmF5KCdpZCc9PiRpZCwncCc9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw1MCksJ3NrdSc9PiRza3UsJ2thaW5hJz0+JHByLCdyZWcnPT4kcnAsJ3Nhdic9PiRjb3N0LCdtYXJ6YSc9PiRteiwnc2FuJz0+JHNhbiwnc3RvY2snPT4kc3QsJ293bic9PiRvd24sJ3N0Jz0+JHN0YXQsJ3BvVDAnPT4kczkwLCdpc3QnPT4kczEyKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-215630';
const GKEY='ps_sec8h';
const PHASES=["GO"];
const OUT='analize/s1678_h.json';
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
