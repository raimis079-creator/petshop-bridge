process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg4ayB1enR2YXJhOiBUZW5jZW50IDQzLjE3Mi8xNSArIHJlbW92ZV9pdGVtIGJlIFdDIHNlc2lqb3MgLT4gNDAzICgxIGRyeSwgMiBhcHBseSwgMyB2ZXJpZnksIDkgcmVzdG9yZSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzg4ayddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3ODhrJ107ICRyPVsndic9PidTMTc4OGsnLCdmYXplJz0+JGZdOwogICRodD1BQlNQQVRILicuaHRhY2Nlc3MnOyAkYmFrPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy8uaHRhY2Nlc3MuYmFrX3MxNzg4JzsgaWYoIWlzX2RpcihkaXJuYW1lKCRiYWspKSkgJGJhaz1BQlNQQVRILicuaHRhY2Nlc3MuYmFrX3MxNzg4JzsKICAkcz1maWxlX2dldF9jb250ZW50cygkaHQpOyAkclsnbWQ1J109bWQ1KCRzKTsgJHJbJ2R5ZGlzJ109c3RybGVuKCRzKTsKICAkYWRkPSIjIFMxNzg4ICgyMDI2LTEwLTE5KTogVGVuY2VudCBDbG91ZCBib3R1IGZlcm1hIEFTMTMyMjAzIDQzLjE3Mi4wLjAvMTUgLT4gNDAzXG5SZXdyaXRlQ29uZCAle1JFTU9URV9BRERSfSBeNDNcXC4xN1syM11cXC5cblJld3JpdGVSdWxlIF4gLSBbRixMXVxuIyBTMTc4ODoga3JlcHNlbGlvIHJlbW92ZV9pdGVtIGJlIFdDIHNlc2lqb3Mgc2xhcHVrbyAtPiA0MDMgKHRpa3JhcyBwaXJrZWphcyBzbGFwdWthIHR1cmkpXG5SZXdyaXRlQ29uZCAle1FVRVJZX1NUUklOR30gKF58JilyZW1vdmVfaXRlbT0gW05DXVxuUmV3cml0ZUNvbmQgJXtIVFRQX0NPT0tJRX0gIXdwX3dvb2NvbW1lcmNlX3Nlc3Npb25fIFtOQ11cblJld3JpdGVSdWxlIF4gLSBbRixMXVxuIjsKICAkcmU9Jy8oIyBCRUdJTiBQUyBCb3R1IHV6dHZhcmEuKj8pKDxcL0lmTW9kdWxlPlxzKlxuIyBFTkQgUFMgQm90dSB1enR2YXJhKS9zJzsKICAkclsnamF1X3lyYSddPXN0cnBvcygkcywnIyBTMTc4OCAoMjAyNi0xMC0xOSknKSE9PWZhbHNlOwogICRyWydwb3NfdXp0dmFyYSddPXN0cnBvcygkcywnIyBCRUdJTiBQUyBCb3R1IHV6dHZhcmEnKTsgJHJbJ3Bvc193cCddPXN0cnBvcygkcywnIyBCRUdJTiBXb3JkUHJlc3MnKTsgJHJbJ3Bvc19zdXBlcmNhY2hlJ109c3RycG9zKCRzLCcjIEJFR0lOIFdQU3VwZXJDYWNoZScpOwogIGlmKCRmPT09JzEnfHwkZj09PScyJyl7IGlmKCFwcmVnX21hdGNoKCRyZSwkcykpIHsgJHJbJ2VyciddPSdibG9rbyBuZXJhc3RhJzsgfSBlbHNlIHsgJG49cHJlZ19yZXBsYWNlKCRyZSwnJDEnLnN0cl9yZXBsYWNlKCckJywnXFwkJywkYWRkKS4nJDInLCRzLDEpOyAkclsnbmF1amFzX2Jsb2thcyddPXByZWdfbWF0Y2goJy8jIEJFR0lOIFBTIEJvdHUgdXp0dmFyYS4qPyMgRU5EIFBTIEJvdHUgdXp0dmFyYVteXG5dKi9zJywkbiwkbSk/JG1bMF06bnVsbDsgJHJbJ25hdWphc19keWRpcyddPXN0cmxlbigkbik7CiAgICAgIGlmKCRmPT09JzInKXsgaWYoJHJbJ2phdV95cmEnXSkgeyAkclsnZXJyJ109J2phdSBpZGllZ3RhJzsgfSBlbHNlIHsgaWYoIWZpbGVfZXhpc3RzKCRiYWspKSBjb3B5KCRodCwkYmFrKTsgJHJbJ2JhayddPSRiYWs7ICRyWydiYWtfbWQ1J109bWQ1X2ZpbGUoJGJhayk7IGZpbGVfcHV0X2NvbnRlbnRzKCRodCwkbik7ICRyWydwb19tZDUnXT1tZDVfZmlsZSgkaHQpOyB9IH0gfSB9CiAgaWYoJGY9PT0nMycpeyAkVD1bIFsnLycsW11dLCBbJy9wcm9kdWN0L2dpZ2ktZm9yLWxhcmdlLWpvaW50cy1hbmQtYm9uZXMtcGFwaWxkYXMtZGlkZWxpdS1zdW51LWthdWx1LWlyLXNhbmFyaXUtZnVua2NpamFpLW4xMDAvJyxbXV0sIFsnL2thdGVnb3JpamEva2F0ZW1zLycsW11dLCBbJy9rcmVwc2VsaXMvJyxbXV0sIFsnL2thc2EvJyxbXV0sIFsnL2tyZXBzZWxpcy8/X3dwbm9uY2U9YWJjJnJlbW92ZV9pdGVtPXh5eicsW11dLCBbJy9rcmVwc2VsaXM/X3dwbm9uY2U9YWJjJnJlbW92ZV9pdGVtPXh5eicsW11dLCBbJy9rcmVwc2VsaXMvP193cG5vbmNlPWFiYyZyZW1vdmVfaXRlbT14eXonLFsnd3Bfd29vY29tbWVyY2Vfc2Vzc2lvbl90ZXN0Jz0+JzEnXV0sIFsnL2thdGVnb3JpamEva2F0ZW1zLz9maWx0ZXJfeD0xJyxbXV0sIFsnL3dwLWpzb24vd2Mvc3RvcmUvdjEvcHJvZHVjdHM/cGVyX3BhZ2U9MScsW11dIF07CiAgICBmb3JlYWNoKCRUIGFzIFskcCwkY2tdKXsgJHQ9bWljcm90aW1lKHRydWUpOyAkY2tzPVtdOyBmb3JlYWNoKCRjayBhcyAkaz0+JHYpICRja3NbXT1uZXcgV1BfSHR0cF9Db29raWUoWyduYW1lJz0+JGssJ3ZhbHVlJz0+JHZdKTsgJHg9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9wZXRzaG9wLmx0Jy4kcCxbJ3RpbWVvdXQnPT4zMCwncmVkaXJlY3Rpb24nPT4wLCdzc2x2ZXJpZnknPT5mYWxzZSwnY29va2llcyc9PiRja3MsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgUFMtUzE3ODgtcGF0aWtyYSddKTsgJHJbJ3QnXVtdPVskcC4oJGNrPycgK3NsYXB1a2FzJzonJyksaXNfd3BfZXJyb3IoJHgpPyR4LT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSxyb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQsMildOyB9IH0KICBpZigkZj09PSc5Jyl7IGlmKGZpbGVfZXhpc3RzKCRiYWspKXsgY29weSgkYmFrLCRodCk7ICRyWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkaHQpOyB9IGVsc2UgJHJbJ2VyciddPSdiYWsgbmVyYSc7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-081639';
const GKEY='ps_s1788k';
const PHASES=["2", "3"];
const OUT='analize/s1788_k2.json';
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
