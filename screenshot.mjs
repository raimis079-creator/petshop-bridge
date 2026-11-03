process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0byB1xb5zYWt5bWFzICMxNTcxIHNpdW50b3MgaXIgbGFpxaFrYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI0byddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE4MjRvJ107IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG5yPSRfR0VUWydwc19zMTgyNG8nXTsKICAkaWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9yZGVyX2lkIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5IElOICgnX29yZGVyX251bWJlcicsJ19wc19vcmRlcl9udW1iZXInLCdfb3JkZXJfbnVtYmVyX2Zvcm1hdHRlZCcpIEFORCBtZXRhX3ZhbHVlPSVzIExJTUlUIDEiLCRucikpOwogIGlmKCEkaWQpICRpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBJTiAoJ19vcmRlcl9udW1iZXInLCdfcHNfb3JkZXJfbnVtYmVyJykgQU5EIG1ldGFfdmFsdWU9JXMgTElNSVQgMSIsJG5yKSk7CiAgaWYoISRpZCl7ICRvPXdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjIwMCwnb3JkZXJieSc9PidkYXRlJywnb3JkZXInPT4nREVTQyddKTsgZm9yZWFjaCgkbyBhcyAkeCl7IGlmKCR4LT5nZXRfb3JkZXJfbnVtYmVyKCk9PSRucil7ICRpZD0keC0+Z2V0X2lkKCk7IGJyZWFrOyB9IH0gfQogICRyWydpZCddPSRpZDsgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbyl7ICRyWydrbGFpZGEnXT0nbmVyYXN0YSc7IGdvdG8gb3V0OyB9CiAgJHJbJ3N0J109JG8tPmdldF9zdGF0dXMoKTsgJHJbJ3N1a3VydGEnXT0kby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCBIOmknKTsgJHJbJ3NoaXAnXT1bXTsgZm9yZWFjaCgkby0+Z2V0X3NoaXBwaW5nX21ldGhvZHMoKSBhcyAkcykgJHJbJ3NoaXAnXVtdPVskcy0+Z2V0X21ldGhvZF9pZCgpLCRzLT5nZXRfbmFtZSgpLCRzLT5nZXRfdG90YWwoKSwkcy0+Z2V0X21ldGFfZGF0YSgpP2FycmF5X21hcChmdW5jdGlvbigkbSl7cmV0dXJuIFskbS0+a2V5LGlzX3NjYWxhcigkbS0+dmFsdWUpPyRtLT52YWx1ZTp3cF9qc29uX2VuY29kZSgkbS0+dmFsdWUpXTt9LCRzLT5nZXRfbWV0YV9kYXRhKCkpOltdXTsKICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaXQpeyAkcD0kaXQtPmdldF9wcm9kdWN0KCk7ICRyWydpdGVtcyddW109WyRpdC0+Z2V0X25hbWUoKSwkaXQtPmdldF9xdWFudGl0eSgpLCRwPyRwLT5nZXRfaWQoKTowLCRwP2dldF9wb3N0X21ldGEoJHAtPmdldF9pZCgpLCdfemJfY29zdCcsdHJ1ZSkhPT0nJzpudWxsLCRwPyhpbnQpZ2V0X3Bvc3RfbWV0YSgkcC0+Z2V0X2lkKCksJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpOjAsYXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gWyRtLT5rZXksaXNfc2NhbGFyKCRtLT52YWx1ZSk/bWJfc3Vic3RyKChzdHJpbmcpJG0tPnZhbHVlLDAsMTIwKTonW2Fycl0nXTt9LCRpdC0+Z2V0X21ldGFfZGF0YSgpKV07IH0KICAkbWV0YT1bXTsgZm9yZWFjaCgkby0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgJGs9JG0tPmtleTsgaWYocHJlZ19tYXRjaCgnL3NoaXB8c2l1bnR8bHB8dmVuaXBha3x0cmFja3xsYWJlbHxsaXBkfHNhbmR8YXZ8emJ8ZHJvcHNoaXB8bWFuaWZlc3R8bGFpc2t8bWFpbHxlbWFpbHxzcGxpdHxkYWwvaScsJGspKSAkbWV0YVtdPVskayxpc19zY2FsYXIoJG0tPnZhbHVlKT9tYl9zdWJzdHIoKHN0cmluZykkbS0+dmFsdWUsMCwzMDApOm1iX3N1YnN0cih3cF9qc29uX2VuY29kZSgkbS0+dmFsdWUpLDAsNjAwKV07IH0gJHJbJ21ldGEnXT0kbWV0YTsKICAkclsnbm90ZXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiBbJG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLCRuLT5jdXN0b21lcl9ub3RlPydLTElFTlRVSSc6JycsbWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDMwMCldO30sd2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kaWQsJ29yZGVyJz0+J0FTQyddKSk7CiAgJHRiPVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfJSciKSBhcyAkdCl7ICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOyBmb3JlYWNoKFsndXpzYWt5bWFzX2lkJywnb3JkZXJfaWQnLCd1enNfaWQnXSBhcyAkYyl7IGlmKGluX2FycmF5KCRjLCRjb2xzLHRydWUpKXsgJG49KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgJGM9JWQiLCRpZCkpOyBpZigkbil7ICR0YlskdF09WyduJz0+JG4sJ2NvbHMnPT4kY29scywncm93cyc9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSAkdCBXSEVSRSAkYz0lZCBPUkRFUiBCWSAxIERFU0MgTElNSVQgNiIsJGlkKSxBUlJBWV9BKV07IH0gYnJlYWs7IH0gfSB9CiAgJHJbJ2xlbnRlbGVzJ109JHRiOwogIG91dDogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-083431';
const GKEY='ps_s1824o';
const PHASES=["1571"];
const OUT='analize/s1824_o.json';
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
