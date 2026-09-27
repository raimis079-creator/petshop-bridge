process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI1aSByZWFkLW9ubHk6IGFyIGJhemluacWzIHByZWtpxbMgcHVzbGFwaXVvc2Ugcm9kb21hIGR5ZMW+acWzIGxlbnRlbMSXOyBraWVrIG5hcmnFsyDFoWVpbW9zZTsganVvZHJhxaHEjWnFsyDFoWVpbWEgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzI1aSddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MjVpJ107IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgdHJ5ewogICAgJHBrPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgbS5wb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBBTkQgcC5wb3N0X3N0YXR1czw+J3RyYXNoJyBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfczE3MjVfZ2VuJyBPUkRFUiBCWSBtLnBvc3RfaWQiKTsKICAgICRpPTA7CiAgICBmb3JlYWNoKCRwayBhcyAkaWQpeyAkYj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKTsgJHM9Z2V0X3Bvc3RfbWV0YSgkYiwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSk7CiAgICAgICRuYXI9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcC5JRCwgTEVGVChwLnBvc3RfdGl0bGUsNDApIHQsIHAucG9zdF9zdGF0dXMgc3QgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkIFdIRVJFIG0ubWV0YV9rZXk9J19wc19keWR6aW9fc2VpbWEnIEFORCBtLm1ldGFfdmFsdWU9JXMgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLCRzKSxBUlJBWV9BKTsKICAgICAgJGU9WydwYWthcyc9PihpbnQpJGlkLCdiYXplJz0+JGIsJ3NlaW1hJz0+JHMsJ25hcml1X3B1Ymxpc2gnPT5jb3VudCgkbmFyKSwncGFrdV9zZWltYSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKV07CiAgICAgIGlmKCRpPDYpeyAkeD13cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoJGIpLic/cHNfbmM9Jy50aW1lKCksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdjb29raWVzJz0+Wydwc19qcyc9PicxJ11dKTsgJGg9aXNfd3BfZXJyb3IoJHgpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KTsgJGVbJ2h0bWxfa29kYXMnXT1pc193cF9lcnJvcigkeCk/JHgtPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyAkZVsncmlua3RpcyddPXN1YnN0cl9jb3VudCgkaCwnUmlua3RpcycpOyAkZVsncGFzaXJpbmt0YSddPXN1YnN0cl9jb3VudCgkaCwncGFzaXJpbmt0YScpOyAkZVsncHNfZHlkJ109cHJlZ19tYXRjaF9hbGwoJy9jbGFzcz0iW14iXSpwcy1keWRbXiJdKiIvJywkaCk7ICRlWyduYXJpYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiAkblsnSUQnXS4nICcuJG5bJ3QnXTt9LCRuYXIpOyB9CiAgICAgICRyWydlaWwnXVtdPSRlOyAkaSsrOyB9CiAgICAkY250PVtdOyBmb3JlYWNoKCRyWydlaWwnXSBhcyAkZSl7ICRrPSRlWyduYXJpdV9wdWJsaXNoJ10+PTI/J3NlaW1vamUgMisnOidzZWltb2plIDEgKHRpayBwYXRpKSc7ICRjbnRbJGtdPSgkY250WyRrXT8/MCkrMTsgfSAkclsnc3V2ZXN0aW5lJ109JGNudDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-150314';
const GKEY='ps_s1725i';
const PHASES=["1"];
const OUT='analize/s1725_i.json';
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
