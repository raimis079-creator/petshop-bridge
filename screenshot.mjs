process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgxZCBrb2RvIGlzdHJhdWtvcyAyIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4MWQnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc4MWQnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRjdXQ9ZnVuY3Rpb24oJGZpbGUsJHJhbmdlcyl7ICRscz1maWxlKCRmaWxlKTsgJG91dD1bXTsgZm9yZWFjaCgkcmFuZ2VzIGFzICRyZyl7IGZvcigkaT0kcmdbMF07JGk8PSRyZ1sxXTskaSsrKXsgJG91dFtdPSRpLic6ICcucnRyaW0obWJfc3Vic3RyKCRsc1skaS0xXT8/JycsMCwxMjAwKSk7IH0gJG91dFtdPSctLS0tLSc7IH0gcmV0dXJuICRvdXQ7IH07CiAgICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0LCRtYXg9NDApeyAkb3V0PVtdOyBmb3JlYWNoKGZpbGUoJGZpbGUpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJHBhdCwkbCkpeyAkb3V0W109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwzMDApKTsgaWYoY291bnQoJG91dCk+PSRtYXgpIGJyZWFrOyB9IH0gcmV0dXJuICRvdXQ7IH07CiAgICAkZGw9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnOyAkZHI9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnOwogICAgJHJbJ2RsX2dyZXAnXT0kZ3JlcCgkZGwsJy9mdW5jdGlvbiBhdHZpcmFfcGFydGlqYXxmdW5jdGlvbiBrZWlzdGlfa2VsaWF8cGxhbmFzX2lzX2VpbHVjaXV8ZnVuY3Rpb24gdmVuaXBha19yZWdpc3RyfGZ1bmN0aW9uIHZwX3xmdW5jdGlvbiBtaXNydXNfc3ByZW5kaW1hc3xmdW5jdGlvbiBlaWx1dGVzX3NhbHRpbmlzfFZlbmlwYWsgcmVnaXN0cmFjaWphIGRhcmJhbGF1a3lqZS8nKTsKICAgICRyWydkbF8xODgyJ109JGN1dCgkZGwsW1sxODgyLDE5MDBdLFszNDQwLDM0NjBdLFszNDk2LDM1MzBdXSk7CiAgICAkclsnZHJfMzQwJ109JGN1dCgkZHIsW1szMzYsMzcyXV0pOwogICAgJHJbJ2RyX2dyZXAnXT0kZ3JlcCgkZHIsJy9mdW5jdGlvbiBuZXBlcmR1b3Rvc3xmdW5jdGlvbiBncnVwdW90aXxmdW5jdGlvbiBwZXJkdW90b3N8ZnVuY3Rpb24gc2l1c3RpfG1pc3J1cy8nKTsKICAgICRscz1maWxlKCRkbCk7IGZvcmVhY2goJGxzIGFzICRpPT4kbCl7IGlmKHN0cnBvcygkbCwnZnVuY3Rpb24gYXR2aXJhX3BhcnRpamEnKSE9PWZhbHNlKXsgJHJbJ2F0dmlyYV9wYXJ0aWphJ109JGN1dCgkZGwsW1skaSsxLCRpKzhdXSk7IH0gfQogICAgJHJbJ3RpZWtpbWFzX3ZmJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGlla2VqYXMsYnVzZW5hLHN1a3VydGEsdXpzYWt5dGEsZ2F1dGEscHJpc3RhdHltYXMgRlJPTSB7JFB9cHNfdGlla2ltYXMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAgICRyWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc191enNha3ltdV9pdnlraWFpIFdIRVJFIHV6c2FreW1hcz0zNjgyOCBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICBpZigkd3BkYi0+bGFzdF9lcnJvcil7ICRyWydpdnlraWFpX2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOyAkclsnbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJWl2eWslJyIpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-095314';
const GKEY='ps_s1781d';
const PHASES=["1"];
const OUT='analize/s1781_d.json';
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
