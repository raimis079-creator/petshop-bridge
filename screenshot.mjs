process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODN0IHIg4oCUIHJlYWQtb25seTogSm9zZXJhIExlZ2VyIDEwIGtnIOKAlCBwcmVrxJdzIGthaW5vcy9tZXRhL3ZhcmlhY2lqb3MsIHXFvnNha3ltYWkgc3UgamEgMyBkLiwga2FpbsWzIGlzdG9yaWphL8WhYWx0aW5pcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODN0ciddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J3InKTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIElOKCdwcm9kdWN0JywncHJvZHVjdF92YXJpYXRpb24nKSBBTkQgcG9zdF90aXRsZSBMSUtFICclTGVnZXIlJyBBTkQgcG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCdwcml2YXRlJykgTElNSVQgMTAiKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOyAkbT1hcnJheSgpOyBmb3JlYWNoKCRwci0+Z2V0X21ldGFfZGF0YSgpIGFzICRtZCkgaWYocHJlZ19tYXRjaCgnL2thaW58cHJpY2V8X3BzX3xzYXZpa3x2Zl98dGlla3xmZWVkfGxhYmVsL2knLCRtZC0+a2V5KSYmIXByZWdfbWF0Y2goJy9fcHNfZ2F8ZGVzYy9pJywkbWQtPmtleSkpICRtWyRtZC0+a2V5XT1zdWJzdHIoanNvbl9lbmNvZGUoJG1kLT52YWx1ZSxKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDgwKTsKICAgICRvWydwcmVrZXMnXVskaWRdPWFycmF5KCduJz0+JHByLT5nZXRfbmFtZSgpLCd0aXBhcyc9PiRwci0+Z2V0X3R5cGUoKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksJ3JlZyc9PiRwci0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSwnc2FsZSc9PiRwci0+Z2V0X3NhbGVfcHJpY2UoKSwncHJpY2UnPT4kcHItPmdldF9wcmljZSgpLCdzYWxlX251byc9PiRwci0+Z2V0X2RhdGVfb25fc2FsZV9mcm9tKCk/JHByLT5nZXRfZGF0ZV9vbl9zYWxlX2Zyb20oKS0+ZGF0ZSgnbS1kJyk6JycsJ3NhbGVfaWtpJz0+JHByLT5nZXRfZGF0ZV9vbl9zYWxlX3RvKCk/JHByLT5nZXRfZGF0ZV9vbl9zYWxlX3RvKCktPmRhdGUoJ20tZCcpOicnLCdzdG9jayc9PiRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3BhcmVudCc9PiRwci0+Z2V0X3BhcmVudF9pZCgpLCdtb2QnPT4kcHItPmdldF9kYXRlX21vZGlmaWVkKCktPmRhdGUoJ20tZCBIOmknKSwnbWV0YSc9PiRtKTsgfQogICRpdGVtcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvaS5vcmRlcl9pZCxvaS5vcmRlcl9pdGVtX2lkLG9pLm9yZGVyX2l0ZW1fbmFtZSBuIEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIEpPSU4geyRwfXdjX29yZGVycyBvIE9OIG8uaWQ9b2kub3JkZXJfaWQgV0hFUkUgb2kub3JkZXJfaXRlbV9uYW1lIExJS0UgJyVMZWdlciUnIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDQgREFZKSIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsgJHc9d2NfZ2V0X29yZGVyKCRpdFsnb3JkZXJfaWQnXSk7ICRpPSR3LT5nZXRfaXRlbSgkaXRbJ29yZGVyX2l0ZW1faWQnXSk7ICRvWyd1enMnXVtdPWFycmF5KCducic9PiR3LT5nZXRfb3JkZXJfbnVtYmVyKCksJ3N0Jz0+JHctPmdldF9zdGF0dXMoKSwnc3VrdXJ0YSc9PiR3LT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ20tZCBIOmknKSwncHJla2UnPT4kaXRbJ24nXSwncGlkJz0+JGktPmdldF9wcm9kdWN0X2lkKCksJ3ZpZCc9PiRpLT5nZXRfdmFyaWF0aW9uX2lkKCksJ3EnPT4kaS0+Z2V0X3F1YW50aXR5KCksJ3N1YnRvdGFsJz0+JGktPmdldF9zdWJ0b3RhbCgpLCd0b3RhbCc9PiRpLT5nZXRfdG90YWwoKSwndmlzbyc9PiR3LT5nZXRfdG90YWwoKSwna3Vwb25haSc9PiR3LT5nZXRfY291cG9uX2NvZGVzKCksJ21ldGEnPT5hcnJheV9maWx0ZXIoYXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gcHJlZ19tYXRjaCgnL19wc19rYWluYXxzYXZpa3xtbm18cmlua3xudW9sYWlkfGJ1bmRsZS9pJywkbS0+a2V5KT8kbS0+a2V5Lic9Jy5zdWJzdHIoanNvbl9lbmNvZGUoJG0tPnZhbHVlLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsNjApOm51bGw7fSwkaS0+Z2V0X21ldGFfZGF0YSgpKSkpOyB9CiAgJG9bJ2thaW51X2xvZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfa2FpbnVfaXN0b3JpamEgV0hFUkUgcHJvZHVjdF9pZCBJTigiLihpbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJGlkcykpPzonMCcpLiIpIE9SREVSIEJZIDEgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsgJG9bJ2UnXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-103157';
const GKEY='ps_s1683tr';
const PHASES=["A"];
const OUT='analize/s1683t_r.json';
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
