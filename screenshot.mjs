process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdGZFIOKAlCAxNyByaW5raW5pxbMga29udmVyc2lqYSDEryBEUCBldGFsb27EhSAoa2FpcCAjMzUwOTYpOiBzaW1wbGUgKyBfZHBfYmFzZV9wcm9kdWN0X2lkICsgX2RwX3BhY2tfcXR5PTgsIGthdC4gREFVR0lBVT1QSUdJQVUoOTEpKzEwNywgTW5NIGxpZWthbm9zIGnFoXZhbG9tb3MsIDc2NCBzdWJrYXQuIHRyaW5hbWEuIFBhdGlrcmEgKyBrYWRyYXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM1dGZlJ10pKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9Pid0ZkUnKTsKICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkTUFQPWFycmF5KDE3NjU5PT4zNTg1NiwxNzY2Mj0+MzU4NTUsMTc2NjU9PjM1ODU0LDE3NjY4PT4zNTg1MywxNzY3MT0+MzU4NTIsMTc2NzQ9PjM1ODUxLDE3Njc3PT4zNTg1MCwxNzY4MD0+MzU4NDksMTc2ODM9PjM1ODQ4LDE3Njg2PT4zNTg0NywxNzY4OT0+MzU4NDYsMTc2OTI9PjM1ODQ1LDE3Njk1PT4zNTg0NCwxNzY5OD0+MzU4NDMsMTc3MDE9PjM1ODQyLDE3NzA0PT4zNTg0MSwxNzcwNz0+MzU4NDApOwogIGZvcmVhY2goJE1BUCBhcyAkdmlkPT4kY2lkKXsKICAgIHdwX3NldF9vYmplY3RfdGVybXMoJGNpZCwnc2ltcGxlJywncHJvZHVjdF90eXBlJyk7CiAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskcH13Y19tbm1fY2hpbGRfaXRlbXMgV0hFUkUgY29udGFpbmVyX2lkPSVkIiwkY2lkKSk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgbWV0YV9rZXkgTElLRSAnXF9tbm0lJSciLCRjaWQpKSBhcyAkbWspIGRlbGV0ZV9wb3N0X21ldGEoJGNpZCwkbWspOwogICAgdXBkYXRlX3Bvc3RfbWV0YSgkY2lkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJywkdmlkKTsKICAgIHVwZGF0ZV9wb3N0X21ldGEoJGNpZCwnX2RwX3BhY2tfcXR5Jyw4KTsKICAgICRrYWluYT1yb3VuZCg4KihmbG9hdCl3Y19nZXRfcHJvZHVjdCgkdmlkKS0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSowLjksMik7CiAgICB1cGRhdGVfcG9zdF9tZXRhKCRjaWQsJ19yZWd1bGFyX3ByaWNlJywka2FpbmEpOyB1cGRhdGVfcG9zdF9tZXRhKCRjaWQsJ19wcmljZScsJGthaW5hKTsgZGVsZXRlX3Bvc3RfbWV0YSgkY2lkLCdfc2FsZV9wcmljZScpOwogICAgdXBkYXRlX3Bvc3RfbWV0YSgkY2lkLCdfbWFuYWdlX3N0b2NrJywnbm8nKTsgdXBkYXRlX3Bvc3RfbWV0YSgkY2lkLCdfc3RvY2tfc3RhdHVzJywnaW5zdG9jaycpOwogICAgd3Bfc2V0X29iamVjdF90ZXJtcygkY2lkLGFycmF5KDkxLDEwNyksJ3Byb2R1Y3RfY2F0Jyk7CiAgICBjbGVhbl9wb3N0X2NhY2hlKCRjaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkY2lkKTsKICAgICRvWydvayddWyRjaWRdPSRrYWluYTsKICB9CiAgJHI9d3BfZGVsZXRlX3Rlcm0oNzY0LCdwcm9kdWN0X2NhdCcpOyAkb1sna2F0NzY0J109aXNfd3BfZXJyb3IoJHIpPydrbGFpZGEnOidpxaF0cmludGEnOwogIHdwX2NhY2hlX2ZsdXNoKCk7CiAgJGM9d2NfZ2V0X3Byb2R1Y3QoMzU4NDMpOwogICRvWydwdnonXT1hcnJheSgndGlwYXMnPT4kYy0+Z2V0X3R5cGUoKSwna2FpbmEnPT4kYy0+Z2V0X3ByaWNlKCksJ2Jhc2UnPT5nZXRfcG9zdF9tZXRhKDM1ODQzLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKSwncXR5Jz0+Z2V0X3Bvc3RfbWV0YSgzNTg0MywnX2RwX3BhY2tfcXR5Jyx0cnVlKSwna2F0Jz0+aW1wbG9kZSgnfCcsd3BfZ2V0X3Bvc3RfdGVybXMoMzU4NDMsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpKSk7CiAgJGg9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoMzU4NDMpLGFycmF5KCd0aW1lb3V0Jz0+NjAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogIGZvcmVhY2goYXJyYXkoJ0VLT05PTUnFoEtBIFBBS1VPVMSWJywnU3V0YXVwb3RlJywnxK5wcmFzdGFpIHBvIHZpZW7EhScsJ8OXOCcsJ0kgS1JFUMWgRUzEricsJ8SuIEtSRVDFoEVMxK4nKSBhcyAkeikgJG9bJ3BzbCddWyR6XT1zdWJzdHJfY291bnQoJGgsJHopOwogICRvWydzaG90cyddPWFycmF5KGFycmF5KCduJz0+J3MxNjM1X2RwX3Jpbms0JywndSc9PmdldF9wZXJtYWxpbmsoMzU4NDMpLCd3Jz0+MTM2NiwnaCc9PjEwNTAsJ2Z1bGwnPT4wKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-113137';
const GKEY='ps_s1635tfe';
const PHASES=["TE"];
const OUT='analize/s1635_tfe.json';
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
