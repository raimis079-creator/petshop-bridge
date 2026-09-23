process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA5ZCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcwOWQnXTsgJHNzPWdldF9zdHlsZXNoZWV0KCk7ICRjc3M9KHN0cmluZyl3cF9nZXRfY3VzdG9tX2Nzcygkc3MpOyAkcj1bJ2YnPT4kZiwnbWQ1X3ByaWVzJz0+bWQ1KCRjc3MpXTsKICAkb2xkPSJcdGZpbHRlcjogZ3JheXNjYWxlKDU1JSkgIWltcG9ydGFudDtcbn0iOwogICRhZGQ9IlxuLyogUzE3MDk6IGlzcGFyZHVvdGFpIHByZWtlaSBhbnRyb3MgKGhvdmVyKSBudW90cmF1a29zIG5lcm9keXRpIC0ga2l0YWlwIG9wYWNpdHkgMC40NSBqYSBwYWRhcm8gbWF0b21hIGlyIGFiaSBudW90cmF1a29zIHBlcnNpZGVuZ2lhICovXG4ucHJvZHVjdHMgbGkucHJvZHVjdC5vdXRvZnN0b2NrIC5ib3gtaW1hZ2UgaW1nLmJhY2staW1hZ2UsXG4ucHJvZHVjdHMgbGkucHJvZHVjdC5vdXQtb2Ytc3RvY2sgLmJveC1pbWFnZSBpbWcuYmFjay1pbWFnZSxcbi5wcm9kdWN0LXNtYWxsLm91dG9mc3RvY2sgLmJveC1pbWFnZSBpbWcuYmFjay1pbWFnZSxcbi5wcm9kdWN0LXNtYWxsLm91dC1vZi1zdG9jayAuYm94LWltYWdlIGltZy5iYWNrLWltYWdlIHtcblx0ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufSI7CiAgaWYoJGY9PT0nMScpewogICAgaWYoc3RycG9zKCRjc3MsJ1MxNzA5OicpIT09ZmFsc2UpeyAkclsnamF1J109MTsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICAgJG49c3Vic3RyX2NvdW50KCRjc3MsJG9sZCk7ICRyWydyYXN0YSddPSRuOyBpZigkbiE9PTEpIHdwX3NlbmRfanNvbigkcik7CiAgICBpZighZ2V0X29wdGlvbigncHNfczE3MDlfY3VzdG9tY3NzX2JhaycpKSB1cGRhdGVfb3B0aW9uKCdwc19zMTcwOV9jdXN0b21jc3NfYmFrJywkY3NzLGZhbHNlKTsKICAgICRyZXM9d3BfdXBkYXRlX2N1c3RvbV9jc3NfcG9zdChzdHJfcmVwbGFjZSgkb2xkLCRvbGQuJGFkZCwkY3NzKSxbJ3N0eWxlc2hlZXQnPT4kc3NdKTsKICAgICRyWyd1cGQnXT1pc193cF9lcnJvcigkcmVzKT8kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpOiRyZXMtPklEOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB7IHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7ICRyWydjYWNoZSddPSdpc3ZhbHl0YSc7IH0KICB9CiAgaWYoJGY9PT0nOScpeyAkYj1nZXRfb3B0aW9uKCdwc19zMTcwOV9jdXN0b21jc3NfYmFrJyk7IGlmKCRiKXsgd3BfdXBkYXRlX2N1c3RvbV9jc3NfcG9zdCgkYixbJ3N0eWxlc2hlZXQnPT4kc3NdKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkclsnYXRzdGF0eXRhJ109bWQ1KCRiKTt9IH0KICAkYzI9KHN0cmluZyl3cF9nZXRfY3VzdG9tX2Nzcygkc3MpOyAkclsnbWQ1X3BvJ109bWQ1KCRjMik7ICRyWyd5cmFfczE3MDknXT1zdHJwb3MoJGMyLCdTMTcwOTonKSE9PWZhbHNlOyAkclsnYmFrX21kNSddPW1kNSgoc3RyaW5nKWdldF9vcHRpb24oJ3BzX3MxNzA5X2N1c3RvbWNzc19iYWsnKSk7CiAgJGg9d3BfcmVtb3RlX2dldChob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL2R1YmVuZWxpYWktc3VuaW1zLz9uYz0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWydrYXRfY29kZSddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKTsgJHJbJ2thdF90dXJpX3RhaXN5a2xlJ109c3RycG9zKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRoKSwnaW1nLmJhY2staW1hZ2UnKSE9PWZhbHNlOwogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-171814';
const GKEY='ps_s1709d';
const PHASES=["1"];
const OUT='analize/s1709_d.json';
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
