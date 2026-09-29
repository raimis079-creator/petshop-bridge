process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5ZiBwcmFkaW5pbyBTRU8gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzM5ZiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgJHI9Wyd2Jz0+J1MxNzM5ZiddOwogICRmaWQ9KGludClnZXRfb3B0aW9uKCdwYWdlX29uX2Zyb250Jyk7ICRyWydmcm9udF9pZCddPSRmaWQ7ICRyWydzaG93X29uX2Zyb250J109Z2V0X29wdGlvbignc2hvd19vbl9mcm9udCcpOwogICRyWydybV90aXRsZSddPWdldF9wb3N0X21ldGEoJGZpZCwncmFua19tYXRoX3RpdGxlJyx0cnVlKTsgJHJbJ3JtX2Rlc2MnXT1nZXRfcG9zdF9tZXRhKCRmaWQsJ3JhbmtfbWF0aF9kZXNjcmlwdGlvbicsdHJ1ZSk7ICRyWydybV9rdyddPWdldF9wb3N0X21ldGEoJGZpZCwncmFua19tYXRoX2ZvY3VzX2tleXdvcmQnLHRydWUpOwogICRybXQ9Z2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtdGl0bGVzJyk7ICRyWydybV9ob21lX3RpdGxlJ109JHJtdFsnaG9tZXBhZ2VfdGl0bGUnXT8/bnVsbDsgJHJbJ3JtX2hvbWVfZGVzYyddPSRybXRbJ2hvbWVwYWdlX2Rlc2NyaXB0aW9uJ10/P251bGw7CiAgJGM9Y3VybF9pbml0KCdodHRwczovL3BldHNob3AubHQvJyk7IGN1cmxfc2V0b3B0X2FycmF5KCRjLFtDVVJMT1BUX1JFVFVSTlRSQU5TRkVSPT4xLENVUkxPUFRfVElNRU9VVD0+MjAsQ1VSTE9QVF9VU0VSQUdFTlQ9PidNb3ppbGxhLzUuMCBwcy1zZW8nXSk7ICRoPWN1cmxfZXhlYygkYyk7IGN1cmxfY2xvc2UoJGMpOwogIHByZWdfbWF0Y2goJy88dGl0bGU+KC4qPyk8XC90aXRsZT4vc2knLCRoLCRtKTsgJHJbJ2h0bWxfdGl0bGUnXT0kbVsxXT8/bnVsbDsKICBwcmVnX21hdGNoKCcvPG1ldGEgbmFtZT0iZGVzY3JpcHRpb24iIGNvbnRlbnQ9IihbXiJdKikiL2knLCRoLCRtKTsgJHJbJ2h0bWxfZGVzYyddPSRtWzFdPz9udWxsOwogIHByZWdfbWF0Y2hfYWxsKCcvPGgxW14+XSo+KC4qPyk8XC9oMT4vc2knLCRoLCRtKTsgJHJbJ2gxJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gdHJpbShzdHJpcF90YWdzKCR4KSk7fSwkbVsxXSk7CiAgcHJlZ19tYXRjaF9hbGwoJy88aDJbXj5dKj4oLio/KTxcL2gyPi9zaScsJGgsJG0pOyAkclsnaDInXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiB0cmltKHN0cmlwX3RhZ3MoJHgpKTt9LCRtWzFdKSwwLDEyKTsKICAkdHh0PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MocHJlZ19yZXBsYWNlKCcvPChzY3JpcHR8c3R5bGUpW14+XSo+Lio/PFwvXDE+L3NpJywnJywkaCkpKSk7ICRyWyd6b2R6aXUnXT1zdHJfd29yZF9jb3VudChwcmVnX3JlcGxhY2UoJy9bXlxwe0x9XHNdL3UnLCcgJywkdHh0KSk7ICRyWydneXZ1bnVfcHJla19taW4nXT1zdWJzdHJfY291bnQobWJfc3RydG9sb3dlcigkdHh0KSwnZ3l2xatuxbMgcHJlaycpOwogIGZvcmVhY2goZ2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+WydwYWdlJywncG9zdCddLCdzJz0+J0pvc2VyYScsJ251bWJlcnBvc3RzJz0+NiwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCddKSBhcyAkcCkgJHJbJ2pvc2VyYV9wc2wnXVtdPSRwLT5JRC4nICcuZ2V0X3Blcm1hbGluaygkcCkuJyB8ICcuZ2V0X3RoZV90aXRsZSgkcCkuJyB8ICcuZ2V0X3Bvc3RfbWV0YSgkcC0+SUQsJ3JhbmtfbWF0aF90aXRsZScsdHJ1ZSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-165515';
const GKEY='ps_s1739f';
const PHASES=["1"];
const OUT='analize/s1739_f.json';
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
