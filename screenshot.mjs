process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggdSDigJQgUkVBRC1PTkxZOiBRdWF0dHJvIHByZWvEl3MgcGFnYWwgRUFOIOKAlCBrYWluxbMvc2F2aWthaW7FsyBtZXRhLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OHUnXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjY4IHUnKTsKICAkZWFucz1leHBsb2RlKCcsJywnNDc3MDEwNzI1NzQ5Nyw0NzcwMTA3MjUzNzcyLDQ3NzAxMDcyNTM3OTYsNDc3MDEwNzI1MzgwMiw0NzcwMTA3MjUzODI2LDQ3NzAxMDcyNTM4MzMsNDc3MDEwNzI1Mzg1Nyw0NzcwMTA3MjUzODY0LDQ3NzAxMDcyNTM4ODgsNDc3MDEwNzI1Mzg5NSw0NzcwMTA3MjUzOTE4LDQ3NzAxMDcyNTM5MjUsNDc3MDEwNzI1Mzk0OSw0NzcwMTA3MjU1NDU1LDQ3NzAxMDcyNTU0NzksNDc3MDEwNzI1NTQ4Niw0NzcwMTA3MjU1NTA5LDQ3NzAxMDcyNTU1MTYsNDc3MDEwNzI1NTUzMCw0NzcwMTA3MjU1NTQ3LDQ3NzAxMDcyNTU1NjEsNDc3MDEwNzI1NTU3OCw0NzcwMTA3MjU1NTkyLDQ3NzAxMDcyNTU2MzksNDc3MDEwNzI1NTY1Myw0NzcwMTA3MjU1OTgxLDQ3NzAxMDcyNTU5OTgsNDc3MDEwNzI1NTYwOCw0NzcwMTA3MjU1NjIyLDQ3NzAxMDcyNTgyNzIsNDc3MDEwNzI1ODI4OSw0NzcwMTA3MjU4MzAyLDQ3NzAxMDcyNTgzNjQsNDc3MDEwNzI1ODMyNiw0NzcwMTA3MjU4Mzg4LDQ3NzAxMDcyNTgzMzMsNDc3MDEwNzI1ODM5NSw0NzcwMTA3MjU4MzE5LDQ3NzAxMDcyNTgzNzEsNDc3MDEwNzI1ODM1Nyw0NzcwMTA3MjU4NDE4LDQ3NzAxMDcyNTgzNDAsNDc3MDEwNzI1ODQwMSw0NzcwMTA3MjUwMTM5LDQ3NzAxMDcyNTAxNDYsNDc3MDEwNzI1MDExNSw0NzcwMTA3MjUwMTIyLDQ3NzAxMDcyNTAwNjEsNDc3MDEwNzI1MDA3OCw0NzcwMTA3MjUwMDMwLDQ3NzAxMDcyNTAwNDcsNDc3MDEwNzI1NjAxOCw0NzcwMTA3MjU0NDAzLDQ3NzAxMDcyNTQ0MTAsNDc3MDEwNzI1MTgzOSw0NzcwMTA3MjUxODkxLDQ3NzAxMDcyNTcyNTEsNDc3MDEwNzI1NzI2OCw0NzcwMTA3MjU3Mjc1LDQ3NzAxMDcyNTcyODIsNDc3MDEwNzI1MDA5Miw0NzcwMTA3MjUwMTA4LDQ3NzAxMDcyNTQxNDQsNDc3MDEwNzI0OTk1OSw0NzcwMTA3MjQ5OTY2LDQ3NzAxMDcyNDk5ODAsNDc3MDEwNzI0OTk5Nyw0NzcwMTA3MjU3NDY2LDQ3NzAxMDcyNTc0NzMsNDc3MDEwNzI1NjgyNyw0NzcwMTA3MjU2ODM0LDQ3NzAxMDcyNTY3OTcsNDc3MDEwNzI1NjgwMyw0NzcwMTA3MjU2ODEwJyk7ICRpbj0iJyIuaW1wbG9kZSgiJywnIixhcnJheV9tYXAoJ2VzY19zcWwnLCRlYW5zKSkuIiciOwogICRvWydlYW5fa2V5cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV92YWx1ZSBJTiAoJGluKSBHUk9VUCBCWSBtZXRhX2tleSIsQVJSQVlfQSk7CiAgJGd0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQgcGlkLGdsb2JhbF91bmlxdWVfaWQgdiBGUk9NIHskcH13Y19wcm9kdWN0X21ldGFfbG9va3VwIFdIRVJFIGdsb2JhbF91bmlxdWVfaWQgSU4gKCRpbikiLEFSUkFZX0EpOyAkb1snbG9va3VwX2d0aW5fbiddPWNvdW50KCRndCk7CiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCBwaWQsbWV0YV9rZXkgayxtZXRhX3ZhbHVlIHYgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV92YWx1ZSBJTiAoJGluKSIsQVJSQVlfQSk7CiAgJGtleXM9YXJyYXkoJ19za3UnLCdfcmVndWxhcl9wcmljZScsJ19zYWxlX3ByaWNlJywnX3ByaWNlJywnX3NhbGVfcHJpY2VfZGF0ZXNfZnJvbScsJ19zYWxlX3ByaWNlX2RhdGVzX3RvJywnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JywnX3BzX3NhbmRlbGlzJywnX3N0b2NrJywnX3N0b2NrX3N0YXR1cycpOwogICRwaWRzPWFycmF5KCk7IGZvcmVhY2goJHJvd3MgYXMgJHIpICRwaWRzWyRyWydwaWQnXV1bXT0kclsndiddOwogIGZvcmVhY2goJGd0IGFzICRyKSAkcGlkc1skclsncGlkJ11dW109JHJbJ3YnXTsKICBmb3JlYWNoKCRwaWRzIGFzICRwaWQ9PiRldil7ICRwbz1nZXRfcG9zdCgkcGlkKTsgJG09YXJyYXkoJ2Vhbic9PmFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGV2KSksJ3RpcGFzJz0+JHBvLT5wb3N0X3R5cGUsJ3N0Jz0+JHBvLT5wb3N0X3N0YXR1cywncGFyZW50Jz0+JHBvLT5wb3N0X3BhcmVudCwncGF2Jz0+bWJfc3Vic3RyKCRwby0+cG9zdF90aXRsZSwwLDYwKSk7CiAgICBmb3JlYWNoKCRrZXlzIGFzICRrKSAkbVska109Z2V0X3Bvc3RfbWV0YSgkcGlkLCRrLHRydWUpOwogICAgJGFsbD1nZXRfcG9zdF9tZXRhKCRwaWQpOyBmb3JlYWNoKCRhbGwgYXMgJGs9PiR2KSBpZihwcmVnX21hdGNoKCcvY29zdHxzYXZpa3xrYWluYXxwcmljZV9vcmlnfHF1YXR0cm8vaScsJGspICYmICFpbl9hcnJheSgkaywka2V5cykpICRtWydraXRhJ11bJGtdPW1iX3N1YnN0cigoc3RyaW5nKSR2WzBdLDAsNDApOwogICAgJG9bJ3ByZWtlcyddWyRwaWRdPSRtOyB9CiAgLy8gUXVhdHRybyBwcmVrxJdzIG5lIHPEhXJhxaFlCiAgJG9bJ3F1YXR0cm9fdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBwb3N0X2lkKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgbWV0YV92YWx1ZT0ncXVhdHRybyciKTsKICAkb1sncXVhdHRyb19uZV9zYXJhc2UnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwbS5wb3N0X2lkIHBpZCxMRUZUKHgucG9zdF90aXRsZSw3MCkgdCx4LnBvc3Rfc3RhdHVzIHMgRlJPTSB7JHB9cG9zdG1ldGEgcG0gSk9JTiB7JHB9cG9zdHMgeCBPTiB4LklEPXBtLnBvc3RfaWQgV0hFUkUgcG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHBtLm1ldGFfdmFsdWU9J3F1YXR0cm8nIEFORCBwbS5wb3N0X2lkIE5PVCBJTiAoIi4oJHBpZHM/aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLGFycmF5X2tleXMoJHBpZHMpKSk6JzAnKS4iKSBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-080326';
const GKEY='ps_s1668u';
const PHASES=["1"];
const OUT='analize/s1668_u.json';
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
