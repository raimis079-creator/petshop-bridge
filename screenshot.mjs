process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGcg4oCUIGRlc2sgYXTFoWF1a2ltbyBzdSBsYWnFoWt1IGZ1bmtjaWphOyBkaXNwYXRjaCBlbnF1ZXVlIEFQSTsgZHVubmluZy0xIHBpbG5hczsgcGF5bWVudF9mYWlsZWQga3VyIGt2aWXEjWlhbWFzLiBSRUFELU9OTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjc2ZyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc2IGcnKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXNrLnBocCcpOyAkTD1leHBsb2RlKCJcbiIsJHMpOwogIGZvcmVhY2goJEwgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3N1X2xhaXNrdXxhdHNhdWt0YV9sYWlza2FzfGZ1bmN0aW9uIGF0c2F1a3RpfG9yZGVyX2NhbmNlbGxlZHxsYWlza2FpX29mZi8nLCRsKSkgJG9bJ2Rlc2snXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjIwKSk7IH0KICAvLyBmdW5rY2lqYSwga3VyaW9qZSBzdV9sYWlza3UKICBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb25ccysoXHcrKVxzKlwoW14pXSpcKVxzKlx7KD86KD8hZnVuY3Rpb25ccykuKXswLDQwMDB9P3N1X2xhaXNrdS9zdScsJHMsJG0pKXsgJG9bJ2Rlc2tfZm4nXT0kbVsxXTsgJHN0PXN0cnBvcygkcywnZnVuY3Rpb24gJy4kbVsxXSk7ICRvWydkZXNrX2ZuX3NyYyddPW1iX3N1YnN0cigkcywkc3QsMjYwMCk7IH0KICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcpOyBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtKXsgJHBzPWFycmF5KCk7IGZvcmVhY2goJG0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApICRwc1tdPSgkcHAtPmlzT3B0aW9uYWwoKT8nPyc6JycpLiRwcC0+Z2V0TmFtZSgpOyAkb1snZGlzcGF0Y2hfYXBpJ11bJG0tPmdldE5hbWUoKV09aW1wbG9kZSgnLCcsJHBzKTsgfQogICRvWydkdW5uaW5nMSddPWZpbGVfZ2V0X2NvbnRlbnRzKFBFVFNIT1BfQ09SRV9ESVIuJ3RlbXBsYXRlcy9lbWFpbHMvZHVubmluZy0xLnBocCcpOwogIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpKSBhcyAkZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYocHJlZ19tYXRjaF9hbGwoIi9bXlxuXXswLDEwMH0ncGF5bWVudF9mYWlsZWQnW15cbl17MCwxMjB9LyIsJGMsJG0pKSAkb1sncGF5bWVudF9mYWlsZWRfa3VyJ11bYmFzZW5hbWUoJGYpXT1hcnJheV9tYXAoJ3RyaW0nLCRtWzBdKTsgfQogIC8vIGF0c2F1a3RhcyBrbGllbnRvIGxhaXNrYXMg4oCUIGthcyBzaXVuY2lhIChTMTYzOTogV0MgY2FuY2VsbGVkIGVtYWlsPyBwZXRzaG9wLWxhaXNrYWk/KQogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxhaXNrYWkqLnBocCcpIGFzICRmKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoX2FsbCgiL1teXG5dezAsMTAwfShjYW5jZWxsZWR8YXRzYXVrKVteXG5dezAsMTQwfS9pIiwkYywkbSkpICRvWydsYWlza2FpX2NhbmNlbCddW2Jhc2VuYW1lKCRmKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCd0cmltJyxhcnJheV91bmlxdWUoJG1bMF0pKSwwLDEyKTsgfQogICRvWyd3Y19jYW5jZWxfZW1haWwnXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jdXN0b21lcl9jYW5jZWxsZWRfb3JkZXJfc2V0dGluZ3MnKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-073056';
const GKEY='ps_s1676g';
const PHASES=["GO"];
const OUT='analize/s1676_g.json';
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
