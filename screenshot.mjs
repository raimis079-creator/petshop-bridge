process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgxcCBWZW5pcGFrIGtsYWlkYSArIG51bWVyaXM6IGt1ciBzcHJlbmR6aWFtYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3ODFwJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc4MXAnXTsgJEY9KHN0cmluZykkX0dFVFsncHNfczE3ODFwJ107CiAgJGN1dD1mdW5jdGlvbigkZmlsZSwkYSwkYiwkdz05MDApeyAkbHM9ZmlsZSgkZmlsZSk7ICRvPVtdOyBmb3IoJGk9bWF4KDEsJGEpOyRpPD1taW4oY291bnQoJGxzKSwkYik7JGkrKyl7ICRvW109JGkuJzogJy5ydHJpbShtYl9zdWJzdHIoJGxzWyRpLTFdLDAsJHcpKTsgfSByZXR1cm4gJG87IH07CiAgJGdyZXA9ZnVuY3Rpb24oJGZpbGUsJHBhdCwkbWF4PTQwLCR3PTMwMCl7ICRvdXQ9W107IGZvcmVhY2goZmlsZSgkZmlsZSkgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgkcGF0LCRsKSl7ICRvdXRbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLCR3KSk7IGlmKGNvdW50KCRvdXQpPj0kbWF4KSBicmVhazsgfSB9IHJldHVybiAkb3V0OyB9OwogIHRyeXsKICAgIGlmKCRGPT09JzEnKXsKICAgICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfU2l1bnRvcycpOyAkc2Y9JHJjLT5nZXRGaWxlTmFtZSgpOyAkclsnc2l1bnRvc19mYWlsYXMnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRzZik7ICRyWydzaXVudG9zX21kNSddPW1kNV9maWxlKCRzZik7ICRyWydzaXVudG9zX2VpbCddPWNvdW50KGZpbGUoJHNmKSk7CiAgICAgICRtPSRyYy0+Z2V0TWV0aG9kKCdzYXJhc2FzJyk7ICRyWydzYXJhc2FzJ109JGN1dCgkc2YsJG0tPmdldFN0YXJ0TGluZSgpLTMsJG0tPmdldEVuZExpbmUoKSk7CiAgICAgICRyWydzaXVudG9zX21ldG9kYWknXT0kZ3JlcCgkc2YsJy9mdW5jdGlvbiBcdysvJyw0MCwxNjApOwogICAgICAkZGs9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXNrLnBocCc7ICRyWydkZXNrX3NpdW50b3Nfa29kYXMnXT0kY3V0KCRkaywxMTU4LDExODUsNTAwKTsgJHJbJ2Rlc2tfdHVyaV9zaXVudGEnXT0kZ3JlcCgkZGssJy9mdW5jdGlvbiB0dXJpX3NpdW50YXx0dXJpX3NpdW50YVwofFBldHNob3BfU2l1bnRvczo6LycsMzAsMjYwKTsKICAgICAgJGxzPWZpbGUoJGRrKTsgZm9yZWFjaCgkbHMgYXMgJGk9PiRsKXsgaWYoc3RycG9zKCRsLCdmdW5jdGlvbiB0dXJpX3NpdW50YScpIT09ZmFsc2UpeyAkclsndHVyaV9zaXVudGFfa29kYXMnXT0kY3V0KCRkaywkaSsxLCRpKzE0LDUwMCk7IH0gfQogICAgICAkclsnZGVza192cF9yZWdfcG8nXT0kY3V0KCRkayw3NTIsODAwLDUyMCk7CiAgICAgICRkbD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCc7ICRyWydkbF8xMjU1J109JGN1dCgkZGwsMTI2MiwxMjcyLDkwMCk7CiAgICAgIC8vIGthcyBkYXIgc2thaXRvIHZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YSBtdXN1IGtvZHVvc2UKICAgICAgJGg9W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwJykpIGFzICRmbCl7ICRuPTA7IGZvcmVhY2goZmlsZSgkZmwpIGFzICRsKXsgaWYoc3RycG9zKCRsLCd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnKSE9PWZhbHNlfHxzdHJwb3MoJGwsJ3BhY2tfbnVtYmVycycpIT09ZmFsc2UpICRuKys7IH0gaWYoJG4pICRoW2Jhc2VuYW1lKCRmbCldPSRuOyB9ICRyWydrYXNfc2thaXRvJ109JGg7CiAgICB9CiAgICBpZigkRj09PScyJyl7CiAgICAgIC8vIFZlbmlwYWsgcGx1Z2luYXM6IGt1ciByYXNvbWFzIHBhY2tfbnVtYmVycyBpciBzdGF0dXMgZXJyb3IKICAgICAgJHZwPW51bGw7IGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvKnZlbmlwYWsqJyxHTE9CX09OTFlESVIpIGFzICRkKXsgJHZwPSRkOyB9ICRyWyd2cF9kaXInXT0kdnA/YmFzZW5hbWUoJHZwKTpudWxsOwogICAgICBpZigkdnApeyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCR2cCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyAkaD1bXTsKICAgICAgICBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCd8fHN0cnBvcygkZiwnL3ZlbmRvci8nKSE9PWZhbHNlKSBjb250aW51ZTsgJGxzPWZpbGUoJGYpOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcGFja19udW1iZXJzfFtcJyJdc3RhdHVzW1wnIl1ccypcXT9ccyo9Pj9ccypbXCciXShlcnJvcnxzZW50KXxlcnJvcl9tZXNzYWdlLycsJGwpKSAkaFtdPXN0cl9yZXBsYWNlKCR2cC4nLycsJycsJGYpLic6Jy4oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjIwKSk7IH0gfQogICAgICAgICRyWyd2cF9oaXRzJ109YXJyYXlfc2xpY2UoJGgsMCw3MCk7IH0KICAgICAgLy8gZGF6bmlzOiBraWVrIHV6c2FreW11IHN1IHN0YXR1cz1lcnJvciBpciBudW1lcml1CiAgICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ub3JkZXJfaWQsIG4ubWV0YV92YWx1ZSBuciwgby5zdGF0dXMsIG8uZGF0ZV9jcmVhdGVkX2dtdCBkLCBtLm1ldGFfdmFsdWUgdmQgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgbSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPW0ub3JkZXJfaWQgTEVGVCBKT0lOIHskUH13Y19vcmRlcnNfbWV0YSBuIE9OIG4ub3JkZXJfaWQ9bS5vcmRlcl9pZCBBTkQgbi5tZXRhX2tleT0nX3BzX29yZGVyX251bWJlcicgV0hFUkUgbS5tZXRhX2tleT0ndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJyVcInN0YXR1c1wiOlwiZXJyb3JcIiUnIE9SREVSIEJZIG0ub3JkZXJfaWQgREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgICAgIGZvcmVhY2goJHJvd3MgYXMgJiR4KXsgJGQ9anNvbl9kZWNvZGUoJHhbJ3ZkJ10sdHJ1ZSk7ICR4WyducnMnXT1pbXBsb2RlKCcsJywoYXJyYXkpKCRkWydwYWNrX251bWJlcnMnXT8/W10pKTsgJHhbJ2VyciddPW1iX3N1YnN0cigoc3RyaW5nKSgkZFsnZXJyb3JfbWVzc2FnZSddPz8nJyksMCw5MCk7IHVuc2V0KCR4Wyd2ZCddKTsgfSB1bnNldCgkeCk7ICRyWydrbGFpZG9zX3Zpc29zJ109JHJvd3M7CiAgICAgICRyWyd2aXNvX3N1X3ZkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnIik7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-160648';
const GKEY='ps_s1781p';
const PHASES=["1", "2"];
const OUT='analize/s1781_p.json';
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
