process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE3MDMgZyDigJQgSEVQTTExICgjMTg2MjMpOiBfc3RvY2sgPSBWRiAwICsgQVYgMiA9IDIgcGVyIHdjX3VwZGF0ZV9wcm9kdWN0X3N0b2NrIChXQyBwYXRzIG51c3RhdHlzIGluc3RvY2spOyBwYXN0YWJhOyBjYWNoZTsgcGF0aWtyYSBrYXRlZ29yaWpvamUvYnJhbmQuIFJlYWQ6IGthaXAgc25pcHBldCAyNTE1IC8gZ2F2aW1vIGtlbGlhcyByYcWhbyBfc3RvY2sgKGthZCByYXN0aSB0aWtyxIUgcHJpZcW+YXN0xK8pLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTcwM2cnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkaWQ9MTg2MjM7CiAgJHN0PWZ1bmN0aW9uKCkgdXNlKCRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyByZXR1cm4gYXJyYXkoJ3N0b2NrJz0+JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3RhdHVzJz0+JHByLT5nZXRfc3RvY2tfc3RhdHVzKCksJ3Rlcm1zJz0+d3BfZ2V0X29iamVjdF90ZXJtcygkaWQsJ3Byb2R1Y3RfdmlzaWJpbGl0eScsYXJyYXkoJ2ZpZWxkcyc9PidzbHVncycpKSk7IH07CiAgJG9bJ3ByaWVzJ109JHN0KCk7ICR2Zj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfdmZfcXR5Jyx0cnVlKTsgJG93bj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSk7ICRvWyd2ZiddPSR2ZjsgJG9bJ293biddPSRvd247CiAgd2NfdXBkYXRlX3Byb2R1Y3Rfc3RvY2soJGlkLCR2Ziskb3duLCdzZXQnKTsgJG9bJ3BvJ109JHN0KCk7CiAgd3BfaW5zZXJ0X2NvbW1lbnQoYXJyYXkoJ2NvbW1lbnRfcG9zdF9JRCc9PiRpZCwnY29tbWVudF90eXBlJz0+J25vdGUnLCdjb21tZW50X2NvbnRlbnQnPT4nUzE3MDM6IF9zdG9jayBudXN0YXR5dGFzICcuKCR2Ziskb3duKS4nIChWRiAnLiR2Zi4nICsgQVYgJy4kb3duLicpIOKAlCBwbyBsaWt1xI1pbyDEr3ZlZGltbyBrb3J0ZWzEl2plIGxpa28gMC9vdXRvZnN0b2NrLCB0b2TEl2wga2F0ZWdvcmlqb2plIG5lc2lyb2TEly4nLCd1c2VyX2lkJz0+MCwnY29tbWVudF9hdXRob3InPT4nQ2xhdWRlJywnY29tbWVudF9hcHByb3ZlZCc9PjEpKTsKICBpZiAoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsKICBpZiAoZnVuY3Rpb25fZXhpc3RzKCdwcnVuZV9zdXBlcl9jYWNoZScpKXsgQHBydW5lX3N1cGVyX2NhY2hlKFdQX0NPTlRFTlRfRElSLicvY2FjaGUvc3VwZXJjYWNoZS9wZXRzaG9wLmx0L3Byb2R1Y3QtY2F0ZWdvcnkvJyx0cnVlKTsgQHBydW5lX3N1cGVyX2NhY2hlKFdQX0NPTlRFTlRfRElSLicvY2FjaGUvc3VwZXJjYWNoZS9wZXRzaG9wLmx0L3Byb2R1Y3QtYnJhbmQvJyx0cnVlKTsgQHBydW5lX3N1cGVyX2NhY2hlKFdQX0NPTlRFTlRfRElSLicvY2FjaGUvc3VwZXJjYWNoZS9wZXRzaG9wLmx0L3Byb2R1Y3QvZXhjbHVzaW9uLWhlcGF0aWMtZGlldGluaXMtc2F1c2FzLXN1bnUtbWFpc3Rhcy1zdS1raWF1bGllbmEtcnl6aWFpcy1pci16aXJuZWxpYWlzLW0tbC0xMmtnLycsdHJ1ZSk7IH0KICAkcjI9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3Byb2R1Y3QtY2F0ZWdvcnkvc2F1c2FzLW1haXN0YXMtc3VuaW1zLz9vcmRlcmJ5PWRhdGUmbmM9Jy50aW1lKCkpLGFycmF5KCd0aW1lb3V0Jz0+MjApKTsgJGIyPWlzX3dwX2Vycm9yKCRyMik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIyKTsgJG9bJ2thdGVnb3JpamFfeXJhJ109c3RycG9zKCRiMiwncG9zdC0nLiRpZCkhPT1mYWxzZXx8c3RyaXBvcygkYjIsJ0hlcGF0aWMnKSE9PWZhbHNlOwogICRyMz13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvcHJvZHVjdC1icmFuZC9leGNsdXNpb24vP25jPScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjIwKSk7ICRiMz1pc193cF9lcnJvcigkcjMpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyMyk7ICRvWydicmFuZF95cmEnXT1zdHJwb3MoJGIzLCdwb3N0LScuJGlkKSE9PWZhbHNlfHxzdHJpcG9zKCRiMywnSGVwYXRpYycpIT09ZmFsc2U7CiAgLy8gcHJpZcW+YXN0aXMga29kZToga2FzIHJhxaFvIF9vd25fc3RvY2tfcXR5IHBlciDigJ5MaWt1xI1pbyDEr3ZlZGltYXMga29ydGVsxJdqZSIgaXIgYXIgbGllxI1pYSBfc3RvY2sKICBmb3JlYWNoIChnbG9iKFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy8qLnBocCcpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZiAoc3RycG9zKCRzLCdMaWt1xI1pbyDEr3ZlZGltYXMga29ydGVsxJdqZScpIT09ZmFsc2UpeyBwcmVnX21hdGNoX2FsbCgnL1teXG5dezAsMTAwfShMaWt1xI1pbyDEr3ZlZGltYXMga29ydGVsxJdqZXxfc3RvY2tcJ3x3Y191cGRhdGVfcHJvZHVjdF9zdG9ja3xzZXRfc3RvY2tfcXVhbnRpdHl8X293bl9zdG9ja19xdHkpW15cbl17MCwxMjB9L3UnLCRzLCRtKTsgJG9bJ2tvZGFzJ11bYmFzZW5hbWUoJGYpXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSksMCwxNCk7IH0gfQogICRzbj0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIGNvZGUgTElLRSAnJUxpa3XEjWlvIMSvdmVkaW1hcyBrb3J0ZWzEl2plJScgTElNSVQgMSIsQVJSQVlfQSk7IGlmICgkc24peyAkY29kZT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRzblsnaWQnXSkpOyBwcmVnX21hdGNoX2FsbCgnL1teXG5dezAsMTAwfShMaWt1xI1pbyDEr3ZlZGltYXMga29ydGVsxJdqZXxfc3RvY2tcJ3x3Y191cGRhdGVfcHJvZHVjdF9zdG9ja3xzZXRfc3RvY2tfcXVhbnRpdHl8X293bl9zdG9ja19xdHkpW15cbl17MCwxMjB9L3UnLCRjb2RlLCRtKTsgJG9bJ3NuaXBwZXQnXT1hcnJheSgkc24sYXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVswXSkpLDAsMTQpKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-124804';
const GKEY='ps_s1703g';
const PHASES=["1"];
const OUT='analize/s1703_g.json';
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
