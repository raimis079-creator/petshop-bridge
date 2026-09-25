process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5bCDigJQgcGF0aWtzbGludMWzIFBWTSBzxIVza2FpdMWzIFBERiArIGxhacWha2FpOiAxIFBERiByZWdlbiArIHRlc3RhcyDEryB0ZXJyYUAsIDIgc2nFs3N0aSBrbGllbnRhbXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE5bCddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3MTlsJ107ICRyPVsndic9PidTMTcxOWwnLCdmYXplJz0+JGZdOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgZ2xvYmFsICR3cGRiOwogICRPUkQ9WzM2MTEyLDM2MTE4LDM2MTQxLDM2MTQ0LDM2MjgxXTsKICB0cnl7CiAgICBmb3JlYWNoKCRPUkQgYXMgJG9pZCl7ICRvPXdjX2dldF9vcmRlcigkb2lkKTsgaWYoISRvKXsgJHJbJ3BkZiddWyRvaWRdPSduxJdyYSc7IGNvbnRpbnVlOyB9CiAgICAgICRhdnBuPSRvLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKTsgJG9sZD0kby0+Z2V0X21ldGEoJ19wZXRzaG9wX2NvbXBsZXRlZF9wZGYnKTsKICAgICAgJHBkZj1mdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYnKT9wZXRzaG9wX2dlbmVyYXRlX2ludm9pY2VfcGRmKCRvaWQpOmZhbHNlOwogICAgICBpZigkcGRmJiZmaWxlX2V4aXN0cygkcGRmKSl7ICRvLT51cGRhdGVfbWV0YV9kYXRhKCdfcGV0c2hvcF9jb21wbGV0ZWRfcGRmJywkcGRmKTsgJG8tPnNhdmUoKTsgfQogICAgICAkdHh0PScnOyBpZigkcGRmJiZmaWxlX2V4aXN0cygkcGRmKSl7ICRyYXc9ZmlsZV9nZXRfY29udGVudHMoJHBkZik7ICR0eHQ9KHN0cnBvcygkcmF3LCRhdnBuKSE9PWZhbHNlKT8nQVZQTiBQREYgdmlkdWplIOKckyc6J0FWUE4gUERGIHRla3N0ZSBuZXJhc3RhcyAoZ2FsaSBixat0aSBzdXNwYXVzdGEpJzsgfQogICAgICAkclsncGRmJ11bJG9pZF09Wyducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ2F2cG4nPT4kYXZwbiwncGRmJz0+JHBkZj9iYXNlbmFtZSgkcGRmKTpmYWxzZSwnYnl0ZXMnPT4kcGRmJiZmaWxlX2V4aXN0cygkcGRmKT9maWxlc2l6ZSgkcGRmKTowLCdidXZvJz0+JG9sZD9iYXNlbmFtZSgkb2xkKTpudWxsLCd0aWtyJz0+JHR4dF07IH0KICAgICRzaXVzdGk9ZnVuY3Rpb24oJG9pZCwkdG8pIHVzZSgmJHIpeyAkbz13Y19nZXRfb3JkZXIoJG9pZCk7ICRucj0kby0+Z2V0X29yZGVyX251bWJlcigpOyAkYXZwbj0kby0+Z2V0X21ldGEoJ19wZXRzaG9wX2F2cG5fbnVtYmVyJyk7ICRwZGY9JG8tPmdldF9tZXRhKCdfcGV0c2hvcF9jb21wbGV0ZWRfcGRmJyk7CiAgICAgICRzdWJqZWN0PSdQYXRpa3NsaW50YSBQVk0gc8SFc2thaXRhIGZha3TFq3JhICcuJGF2cG4uJyDigJMgdcW+c2FreW1hcyBOci4gJy4kbnI7CiAgICAgICRib2R5PSc8cD5TdmVpa2ksPC9wPjxwPmTEl2wgdGVjaG5pbsSXcyBrbGFpZG9zIErFq3PFsyB1xb5zYWt5bW8gTnIuICcuJG5yLicgUFZNIHPEhXNrYWl0b3MgZmFrdMWrcm9zIG51bWVyaXMgc3V0YXBvIHN1IGtpdG8gdcW+c2FreW1vIG51bWVyaXUuIFByaWRlZGFtZSBwYXRpa3NsaW50xIUgc8SFc2thaXTEhSBmYWt0xatyxIUgPHN0cm9uZz4nLiRhdnBuLic8L3N0cm9uZz4g4oCTIGppIHBha2VpxI1pYSBhbmtzxI1pYXUgYXRzacWzc3TEhS4gVcW+c2FreW1vIHR1cmlueXMsIHN1bW9zIGlyIGFwbW9rxJdqaW1hcyBuZXNpa2VpxI1pYS48L3A+PHA+QXRzaXByYcWhb21lIHXFviBuZXBhdG9ndW11cy48L3A+PHA+UGV0c2hvcC5sdCBrb21hbmRhPGJyPnV6c2FreW1haUBwZXRzaG9wLmx0PC9wPic7CiAgICAgICRtYWlsZXI9V0MoKS0+bWFpbGVyKCk7ICRodG1sPSRtYWlsZXItPndyYXBfbWVzc2FnZSgnUGF0aWtzbGludGEgUFZNIHPEhXNrYWl0YSBmYWt0xatyYScsJGJvZHkpOyAkb2s9JG1haWxlci0+c2VuZCgkdG8sJHN1YmplY3QsJGh0bWwsJycsJHBkZiYmZmlsZV9leGlzdHMoJHBkZik/WyRwZGZdOltdKTsKICAgICAgaWYoJG9rJiYkdG89PT0kby0+Z2V0X2JpbGxpbmdfZW1haWwoKSkgJG8tPmFkZF9vcmRlcl9ub3RlKCdTMTcxOToga2xpZW50dWkgacWhc2nFs3N0YSBwYXRpa3NsaW50YSBQVk0gc8SFc2thaXRhICcuJGF2cG4uJyAoJy4kdG8uJykuJyk7CiAgICAgIHJldHVybiBbJG5yLCRhdnBuLCR0bywkb2s/J2nFoXNpxbNzdGEnOidLTEFJREEnLGJhc2VuYW1lKChzdHJpbmcpJHBkZildOyB9OwogICAgaWYoJGY9PT0nMScpeyAkclsndGVzdGFzJ109JHNpdXN0aSgzNjExMiwndGVycmFAZ3l2dW5haS5sdCcpOyB9CiAgICBpZigkZj09PScyJyl7IGZvcmVhY2goJE9SRCBhcyAkb2lkKXsgJG89d2NfZ2V0X29yZGVyKCRvaWQpOyAkclsnaXNzaXVzdGEnXVskb2lkXT0kc2l1c3RpKCRvaWQsJG8tPmdldF9iaWxsaW5nX2VtYWlsKCkpOyB9IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDEpOwo=';
const VER='dep-152835';
const GKEY='ps_s1719l';
const PHASES=["2"];
const OUT='analize/s1719_l2.json';
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
