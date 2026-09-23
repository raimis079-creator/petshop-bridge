process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA5aCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcwOWgnXTsgJGlkPTE0ODk0OyAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkaWQpOyAkcj1bJ2YnPT4kZiwnbWQ1X3ByaWVzJz0+bWQ1KCRjKV07CiAgJG9sZD0nPHA+PHN0cm9uZz5QcmVrxJdzIGnFoXNpdW7EjWlhbW9zIHBlciAx4oCTMyBkYXJibyBkaWVuYXMsIGRhxb5uaWF1c2lhaSBncmVpxI1pYXUuPC9zdHJvbmc+LCBqZWlndSBzaXVudMWzIHZlxb7El2pvIHBlcnZlxb5pbW8gcGFzbGF1Z2Egdnlrc3RhIHNrbGFuZMW+aWFpLjwvcD4nOwogICRuZXc9JzxwPjxzdHJvbmc+UHJla8SXcyBpxaFzaXVuxI1pYW1vcyBwZXIgMeKAkzMgZGFyYm8gZGllbmFzLCBvIHByaXN0YXRvbW9zIOKAkyBwZXIgMSBkYXJibyBkaWVuxIU8L3N0cm9uZz4sIGplaWd1IHNpdW50xbMgdmXFvsSXam8gcGVydmXFvmltbyBwYXNsYXVnYSB2eWtzdGEgc2tsYW5kxb5pYWkuPC9wPic7CiAgJHJbJ3Jhc3RhJ109c3Vic3RyX2NvdW50KCRjLCRvbGQpOwogIGlmKCRmPT09JzEnICYmICRyWydyYXN0YSddPT09MSl7CiAgICBpZighZ2V0X29wdGlvbigncHNfczE3MDlfcHJpc3RhdHltYXNfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzA5X3ByaXN0YXR5bWFzX2JhaycsJGMsZmFsc2UpOwogICAgJHU9d3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpZCwncG9zdF9jb250ZW50Jz0+c3RyX3JlcGxhY2UoJG9sZCwkbmV3LCRjKV0sdHJ1ZSk7ICRyWyd1cGQnXT1pc193cF9lcnJvcigkdSk/JHUtPmdldF9lcnJvcl9tZXNzYWdlKCk6JHU7CiAgICBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsKICB9CiAgaWYoJGY9PT0nOScpeyAkYj1nZXRfb3B0aW9uKCdwc19zMTcwOV9wcmlzdGF0eW1hc19iYWsnKTsgaWYoJGIpeyB3cF91cGRhdGVfcG9zdChbJ0lEJz0+JGlkLCdwb3N0X2NvbnRlbnQnPT4kYl0pOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsgJHJbJ2F0c3RhdHl0YSddPW1kNSgkYik7fSB9CiAgJGg9d3BfcmVtb3RlX2dldChnZXRfcGVybWFsaW5rKCRpZCkuJz9uYz0nLnRpbWUoKSxbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpOwogICRyWydodHRwJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGgpOyAkclsnZ3l2YWlfbmF1amFzJ109c3RycG9zKCRiLCdvIHByaXN0YXRvbW9zIOKAkyBwZXIgMSBkYXJibyBkaWVuxIUnKSE9PWZhbHNlOyAkclsnZ3l2YWlfc2VuYXMnXT1zdHJwb3MoJGIsJ2Rhxb5uaWF1c2lhaSBncmVpxI1pYXUnKSE9PWZhbHNlOwogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-173659';
const GKEY='ps_s1709h';
const PHASES=["1"];
const OUT='analize/s1709_h.json';
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
