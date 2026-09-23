process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA1cyddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcwNXMnXTsgJGZsPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wZXRzaG9wLWdhdmltYXMucGhwJzsgJGJhaz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcy9wZXRzaG9wLWdhdmltYXMucGhwLmJha19zMTcwNSc7ICRyPVsnZic9PiRmLCdtZDVfcHJpZXMnPT5tZDVfZmlsZSgkZmwpXTsKICBpZigkZj09PScxJyl7CiAgICAkb2xkPSJ1cGRhdGVfcG9zdF9tZXRhKCBcJHBpZCwgJ19wc19zYW5kZWxpcycsICdBVicgKTsiOyAkbmV3PSJ1cGRhdGVfcG9zdF9tZXRhKCBcJHBpZCwgJ19wc19zYW5kZWxpcycsICdhdicgKTsgLyogUzE3MDU6IG1hem9zaW9zIOKAlCBrYWlwIHZpc3VyIHNpc3RlbW9qZSAqLyI7CiAgICAkYz1maWxlX2dldF9jb250ZW50cygkZmwpOyAkbj1zdWJzdHJfY291bnQoJGMsJG9sZCk7ICRyWydyYXN0YSddPSRuOwogICAgaWYoJG4hPT0xKXsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICAgaWYoIWlzX2RpcihkaXJuYW1lKCRiYWspKSkgd3BfbWtkaXJfcChkaXJuYW1lKCRiYWspKTsKICAgIGlmKCFmaWxlX2V4aXN0cygkYmFrKSkgY29weSgkZmwsJGJhayk7ICRyWydiYWtfbWQ1J109bWQ1X2ZpbGUoJGJhayk7CiAgICAkYzI9c3RyX3JlcGxhY2UoJG9sZCwkbmV3LCRjKTsKICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkYzIsIFRPS0VOX1BBUlNFKTsgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsncGFyc2VfZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICAgZmlsZV9wdXRfY29udGVudHMoJGZsLCRjMik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZmwsdHJ1ZSk7CiAgICAkclsnbWQ1X3BvJ109bWQ1X2ZpbGUoJGZsKTsKICAgICRoPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/aGI9Jy50aW1lKCkpLFsndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkY29kZT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaCk7ICRyWydoYiddPSRjb2RlOwogICAgaWYoJGNvZGU+PTUwMHx8ISRjb2RlKXsgY29weSgkYmFrLCRmbCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZmwsdHJ1ZSk7ICRyWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkZmwpOyB9CiAgfQogIGlmKCRmPT09JzInKXsgJEw9ZmlsZSgkZmwpOyBmb3JlYWNoKCRMIGFzICRpPT4kbG4pIGlmKHN0cnBvcygkbG4sIidfcHNfc2FuZGVsaXMnLCAnYSIpIT09ZmFsc2V8fHN0cnBvcygkbG4sIidfcHNfc2FuZGVsaXMnLCAnQSIpIT09ZmFsc2UpICRyWydlaWwnXVtdPSgkaSsxKS4nOiAnLnRyaW0oJGxuKTsKICAgICRyWydrbGFzZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9HYXZpbWFzJyk7ICRoPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi1hamF4LnBocCcpLFsndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsnYWpheCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKTsgJHJbJ2hvbWUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksWyd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlXSkpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-105037';
const GKEY='ps_s1705s';
const PHASES=["2"];
const OUT='analize/s1705_r2.json';
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
