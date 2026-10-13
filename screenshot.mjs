process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgyYyBtdS1wbHVnaW7FsyBpbnZlbnRvcml1cyAodGlrIHNrYWl0eW1hcykgwrcgMSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3ODJjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyAkcj1bJ3YnPT4nUzE3ODJjJywnaXRlbXMnPT5bXV07CiAgJGRpcnM9W1dQTVVfUExVR0lOX0RJUj0+J211JywgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc9Pidjb3JlJywgV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sJz0+J3htbCddOwogIGZvcmVhY2goJGRpcnMgYXMgJGQ9PiR0YWcpeyBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICAkaXQ9JHRhZz09PSdtdSc/IG5ldyBEaXJlY3RvcnlJdGVyYXRvcigkZCkgOiBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQpKTsKICAgIGZvcmVhY2goJGl0IGFzICRmKXsgaWYoJGYtPmlzRGlyKCl8fHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkcD0kZi0+Z2V0UGF0aG5hbWUoKTsgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYoJGM9PT1mYWxzZSkgY29udGludWU7CiAgICAgICRoPWZ1bmN0aW9uKCRrKSB1c2UoJGMpeyByZXR1cm4gcHJlZ19tYXRjaCgnL15ccypcKj9ccyonLiRrLic6XHMqKC4rKSQvbWknLCRjLCRtKT90cmltKCRtWzFdKTonJzsgfTsKICAgICAgcHJlZ19tYXRjaF9hbGwoIi9hZGRfKD86bWVudXxzdWJtZW51KV9wYWdlXHMqXCgoW147XXswLDIyMH0pL3MiLCRjLCRtcCk7ICRwYWdlcz1bXTsgZm9yZWFjaCgkbXBbMV0gYXMgJGEpeyBpZihwcmVnX21hdGNoX2FsbCgiLycoW2EtejAtOV9cLV0rKScvIiwkYSwkcykpICRwYWdlc1tdPWVuZCgkc1sxXSk7IH0KICAgICAgcHJlZ19tYXRjaF9hbGwoIi93cF9zY2hlZHVsZV9ldmVudFxzKlwoW147XSo/JyhbYS16MC05X10rKScvIiwkYywkY3IpOyBwcmVnX21hdGNoX2FsbCgiL3JlZ2lzdGVyX3Jlc3Rfcm91dGVccypcKFxzKicoW14nXSspJ1xzKixccyonKFteJ10rKScvIiwkYywkcnIpOwogICAgICBwcmVnX21hdGNoX2FsbCgiLyg/OlxcXCRQfHByZWZpeFxzKlwuXHMqfGdhajZffFx7XFxcJFBcfSk/WydcIl0/KHBzX1thLXowLTlfXSspLyIsJGMsJHRiKTsgJHRibD1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X2ZpbHRlcigkdGJbMV0sZm4oJHgpPT5wcmVnX21hdGNoKCcvXnBzX1thLXpdLycsJHgpJiZzdHJsZW4oJHgpPDQwKSkpOwogICAgICBwcmVnX21hdGNoX2FsbCgiL2NsYXNzXHMrKFtBLVpdW0EtWmEtejAtOV9dKykvIiwkYywkY2wpOyBwcmVnX21hdGNoX2FsbCgiL2NvbnN0XHMrVkVSU0lKQVxzKj1ccyonKFteJ10rKScvIiwkYywkdnYpOwogICAgICAkclsnaXRlbXMnXVtdPVsndCc9PiR0YWcsJ2YnPT5zdHJfcmVwbGFjZShbV1BNVV9QTFVHSU5fRElSLicvJyxXUF9QTFVHSU5fRElSLicvJ10sJycsJHApLCduJz0+JGgoJ1BsdWdpbiBOYW1lJyksJ2QnPT5tYl9zdWJzdHIoJGgoJ0Rlc2NyaXB0aW9uJyksMCwxMjApLCd2Jz0+JGgoJ1ZlcnNpb24nKT86KCR2dlsxXVswXT8/JycpLCdrYic9PnJvdW5kKHN0cmxlbigkYykvMTAyNCksJ20nPT5kYXRlKCdZLW0tZCcsJGYtPmdldE1UaW1lKCkpLCdwZyc9PmFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJHBhZ2VzKSksJ2Nyb24nPT5hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRjclsxXSkpLCdyZXN0Jz0+YXJyYXlfbWFwKGZuKCRhLCRiKT0+JGEuJGIsJHJyWzFdLCRyclsyXSksJ3RibCc9PmFycmF5X3NsaWNlKCR0YmwsMCwxMiksJ2Nscyc9PmFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkY2xbMV0pLDAsNCksJ2hvb2tzJz0+c3Vic3RyX2NvdW50KCRjLCdhZGRfYWN0aW9uKCcpK3N1YnN0cl9jb3VudCgkYywnYWRkX2ZpbHRlcignKV07CiAgICB9IH0KICBnbG9iYWwgJHdwZGI7ICRyWydzbmlwcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHNjb3BlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgT1JERVIgQlkgYWN0aXZlIERFU0MsaWQiLEFSUkFZX0EpOwogICRyWyd0YWJsZXMnXT1hcnJheV9tYXAoZm4oJHgpPT4keFswXSwkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzXyUnIixBUlJBWV9OKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-151455';
const GKEY='ps_s1782c';
const PHASES=["1"];
const OUT='analize/s1782_c.json';
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
