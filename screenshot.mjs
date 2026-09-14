process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgYiDigJQgcmVhZC1vbmx5OiByeXRvIHNhcmdvIHJhdWRvbm9zLCBuZWlzc2l1c3RpIHRhaXN5a2zElywgcHNfc2FyZ2FzX2tsYWlkb3MgMzYgdmFsLiwgc25pcHBldGFzIHN1ICIkYeKGkiIuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgxYiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgxIGInKTsKICAkb1sncnl0YXMnXT1nZXRfb3B0aW9uKCdwc19yeXRhc19zYXJnYXNfcGFzaycpOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihzdHJwb3MoJHMsJ25laXNzaXVzdGknKSE9PWZhbHNlKXsgJG49YmFzZW5hbWUoJGYpOyBwcmVnX21hdGNoKCcvVmVyc2lvbjpccyooW1xkLl0rKS9pJywkcywkbXYpOyAkb1sncnl0YXNfZmFpbGFzJ11bJG5dPSRtdlsxXT8/Jyc7CiAgICBpZihwcmVnX21hdGNoX2FsbCgnL14uKm5laXNzaXVzdGkuKiQvbScsJHMsJG0pKSAkb1snbmVpc3NfZWlsJ11bJG5dPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHN1YnN0cih0cmltKCR4KSwwLDQwMCk7fSwkbVswXSk7IH0gfQogICRvWydrbGFpZG9zXzM2aCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhaWthcyxseWdpcyxMRUZUKHppbnV0ZSwyMDApIHosZmFpbGFzLGVpbHV0ZSxraWVrIEZST00geyRwfXBzX3Nhcmdhc19rbGFpZG9zIFdIRVJFIGxhaWthcz49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMzYgSE9VUikgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgJG9bJ3NuaXBfYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLExFRlQoY29kZSw1MDApIGMgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclXCRh4oaSJScgT1IgKGNvZGUgTElLRSAnJWHihpIlJyBBTkQgYWN0aXZlPTEpIExJTUlUIDUiLEFSUkFZX0EpOwogICRvWyd0ZW1wX3NuaXBzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsbW9kaWZpZWQgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgT1IgbmFtZSBMSUtFICdkZXAtJScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG8uaWQgRlJPTSB7JHB9d2Nfb3JkZXJzIG8gV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXM9J3djLXByb2Nlc3NpbmcnIE9SREVSIEJZIG8uaWQiKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHc9d2NfZ2V0X29yZGVyKCRpZCk7ICRvWydwcm9jZXNzaW5nJ11bXT1hcnJheSgnbnInPT4kdy0+Z2V0X29yZGVyX251bWJlcigpLCdzdWt1cnRhJz0+JHctPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdhcG1vayc9PiR3LT5nZXRfcGF5bWVudF9tZXRob2QoKSwnc20nPT5pbXBsb2RlKCd8JyxhcnJheV9tYXAoZnVuY3Rpb24oJHMpe3JldHVybiAkcy0+Z2V0X25hbWUoKTt9LCR3LT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpKSksJ2lzc2l1c3RhJz0+JHctPmdldF9tZXRhKCdfcHNfZGFseXNfaXNzaXVzdGEnKT8ndGFpcCc6J25lJywndmVuaXBhayc9PiR3LT5nZXRfbWV0YSgnX3BzX3ZlbmlwYWtfc2VraW1hcycpPyd5cmEnOicnLCdwYXN0YWJvcyc9PmFycmF5X21hcChmdW5jdGlvbigkbil7cmV0dXJuIHN1YnN0cigkbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLiRuLT5jb250ZW50LDAsMTIwKTt9LGFycmF5X3NsaWNlKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+MykpLDAsMykpKTsgfQogICRvWydlJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-084040';
const GKEY='ps_s1681b';
const PHASES=["A"];
const OUT='analize/s1681_b.json';
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
