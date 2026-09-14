process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODQgbWIyIOKAlCBSRUFELU9OTFk6IHNhdmlrYWlub3MgcmVpa8WhbcSXcyB0aWtyaW5pbWFzIChQVk0pLCBpc3Qga2FpbmEvcHZtIHNhbXBsZSwgZ3l2xbMgcHNfZmFrdF9laWx1dGVzIG1hcsW+YSBwYWdhbCBicmVuZMSFLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4NG1iMiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjg0IG1iMicpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRFPSJ7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyI7ICRVPSJ7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIjsgJEY9InskcH1wc19mYWt0X2VpbHV0ZXMiOwogICRvWydpc3Rfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5za3UsZS5raWVraXMsZS5rYWluYV9jdCxlLnB2bV9jdCxlLmthaW5hX3ZudF9jdCxlLmthaW5hX3JlZ3VsaWFyaV9jdCxlLm51b2xhaWRhX2N0IEZST00gJEUgZSBKT0lOICRVIHUgT04gdS51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgV0hFUkUgdS5hcG1va2V0YV9hdD4nMjAyNi0wNi0wMScgQU5EIGUuYnJlbmRhc19zbHVnIElOKCdqb3NlcmEnLCdleGNsdXNpb24nKSBPUkRFUiBCWSBSQU5EKCkgTElNSVQgNiIsQVJSQVlfQSk7CiAgJG9bJ2lzdF9wdm1fZmlsbCddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgU1VNKHB2bV9jdD4wKSBzdV9wdm0sIFJPVU5EKEFWRyhwdm1fY3Qva2FpbmFfY3QpLDMpIHB2bV9kYWxpcyBGUk9NICRFIFdIRVJFIGthaW5hX2N0PjAiLEFSUkFZX0EpOwogICRvWydjcF9zb3VyY2UnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIHMsIENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19jb3N0X3ByaWNlX3NvdXJjZScgR1JPVVAgQlkgbWV0YV92YWx1ZSIsQVJSQVlfQSk7CiAgZm9yZWFjaChhcnJheSgxODU4Nz0+J0hZUFMwNiBFeGNsdXNpb24nLDE3OTc4PT4nSk9TMDAwOCBKb3NlcmEnLDE4NTYwPT4nSFlQTTExJykgYXMgJGlkPT4kbCl7ICRyPWFycmF5KCdsJz0+JGwpOyBmb3JlYWNoKGFycmF5KCdfY29zdF9wcmljZScsJ19wcmljZScsJ19yZWd1bGFyX3ByaWNlJywnX3ZmX2Nvc3QnLCdfemJfY29zdCcsJ19jb3N0X3ByaWNlX3NvdXJjZScsJ19za3UnKSBhcyAkaykgJHJbJGtdPWdldF9wb3N0X21ldGEoJGlkLCRrLHRydWUpOyAkclsnc291cmNlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSxjb3N0X25ldCxzdG9ja19xdHksaXNfYWN0aXZlIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0kaWQiLEFSUkFZX0EpOyAkclsncGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBnYXV0YSxraWVraXNfZ2F1dGFzLHNhdmlrYWluYV9ldXIsdGlla2VqYXMgRlJPTSB7JHB9cHNfcGFydGlqb3MgV0hFUkUgcHJvZHVjdF9pZD0kaWQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsgJG9bJ3BhdiddWyRpZF09JHI7IH0KICAkb1snZmFrdF9saXZlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYnJlbmRhc19zbHVnIGIsIENPVU5UKCopIG4sIFJPVU5EKFNVTShrYWluYV9jdCkvMTAwKSBldXIsIFJPVU5EKFNVTShwdm1fY3QpLzEwMCkgcHZtLCBST1VORChTVU0oc2F2aWthaW5hX2N0KS8xMDApIHNhdiwgR1JPVVBfQ09OQ0FUKERJU1RJTkNUIHNhdmlrYWlub3Nfc2FsdGluaXMpIHNhbHQsIFJPVU5EKCgxLVNVTShzYXZpa2FpbmFfY3QpL05VTExJRihTVU0oa2FpbmFfY3QtcHZtX2N0KSwwKSkqMTAwLDEpIG1hcnphX25ldCBGUk9NICRGIEdST1VQIEJZIGIgT1JERVIgQlkgZXVyIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICRvWydmYWt0X2xpdmVfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2t1LGtpZWtpcyxrYWluYV9jdCxwdm1fY3Qsc2F2aWthaW5hX3ZudF9jdCxzYXZpa2FpbmFfY3Qsc2F2aWthaW5vc19zYWx0aW5pcyBGUk9NICRGIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-174248';
const GKEY='ps_s1684mb2';
const PHASES=["GO"];
const OUT='analize/s1684_mb2.json';
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
