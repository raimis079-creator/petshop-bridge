process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTUgcnVuIGU1ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpICM0OiBQYXJ0aWpvczo6dXpzYWt5bW9fbnVyYXN5bWFzIChwYXJ0aWrFsyBGSUZPKSwgRmFrdGFpOjpyYXN5dGkgKyBmYWt0LWdyYXppbmltYWkgKGFyIHlyYSBrb3Jla2Npam9zL2dyxIXFvmluaW1vIEFQSSksIHRlbWE6IGludm9pY2UgZG9jIHR5cGUgLyBnZW5lcmF0ZSBwZGYgLyByZWNlaXZlZCBlbWFpbCAoYXIgUERGIHN1IEFWUE4ga2xpZW50dWkgacWhZWluYSBpxaFrYXJ0KSwgYXTFoWF1a2ltbyBrYWJsaXVrYWkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U1ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE1IGU1cicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogICRjdHg9ZnVuY3Rpb24oJGMsJHBhdCwkbGVuPTE1MDAsJGJhY2s9MCl7ICRpPXN0cnBvcygkYywkcGF0KTsgaWYoJGk9PT1mYWxzZSkgcmV0dXJuIG51bGw7IHJldHVybiBzdWJzdHIoJGMsbWF4KDAsJGktJGJhY2spLCRsZW4pOyB9OwogICRtZXRoPWZ1bmN0aW9uKCRjbCl7IGlmKCFjbGFzc19leGlzdHMoJGNsKSkgcmV0dXJuIG51bGw7ICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGNsKTsgcmV0dXJuIGFycmF5KCdmaWxlJz0+YmFzZW5hbWUoJHItPmdldEZpbGVOYW1lKCkpLCdtJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRtbSl7IHJldHVybiAkbW0tPm5hbWUuJygnLmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkcHApeyByZXR1cm4gJyQnLiRwcC0+bmFtZTsgfSwkbW0tPmdldFBhcmFtZXRlcnMoKSkpLicpJzsgfSwkci0+Z2V0TWV0aG9kcyhSZWZsZWN0aW9uTWV0aG9kOjpJU19QVUJMSUMpKSk7IH07CiAgdHJ5ewogICRtdT1XUE1VX1BMVUdJTl9ESVI7CiAgZm9yZWFjaChhcnJheSgnUGV0c2hvcF9QYXJ0aWpvcycsJ1BldHNob3BfRmFrdGFpJywnUGV0c2hvcF9GYWt0X0dyYXppbmltYWknLCdQZXRzaG9wX0Zha3RfU2l1bnRvcycsJ1BldHNob3BfRmFrdF9BdHNhcmdvcycsJ1BldHNob3BfRXZlbnRfRW1pdHRlcnMnKSBhcyAkY2wpeyAkb1snY2xzJ11bJGNsXT0kbWV0aCgkY2wpOyB9CiAgJGM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkbXUuJy9wZXRzaG9wLXBhcnRpam9zLnBocCcpOyAkb1sncGFydGlqb3NfaGVhZCddPXN1YnN0cigkYywwLDE0MDApOyAkb1sncGFydGlqb3NfbnVyYXN5bWFzJ109JGN0eCgkYywnZnVuY3Rpb24gdXpzYWt5bW9fbnVyYXN5bWFzJywyMjAwKTsgJG9bJ3BhcnRpam9zX2dyYXppbmltYXMnXT0kY3R4KCRjLCdmdW5jdGlvbiB1enNha3ltb19ncmF6aW5pbWFzJywxMjAwKSA/OiAkY3R4KCRjLCdncmF6aW4nLDkwMCwzMDApOwogIHByZWdfbWF0Y2hfYWxsKCcvYWRkX2FjdGlvblwoXHMqW1wnIl0oW15cJyJdKylbXCciXVxzKixccyooW14sXCldezAsNjB9KS8nLCRjLCRtKTsgJG9bJ3BhcnRpam9zX2hvb2tzJ109YXJyYXlfbWFwKG51bGwsJG1bMV0sJG1bMl0pOwogICRjPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJG11LicvcGV0c2hvcC1mYWt0YWkucGhwJyk7ICRvWydmYWt0YWlfaGVhZCddPXN1YnN0cigkYywwLDE2MDApOyAkb1snZmFrdGFpX3Jhc3l0aSddPSRjdHgoJGMsJ2Z1bmN0aW9uIHJhc3l0aScsMTgwMCk7ICRvWydmYWt0YWlfa29yZWtjaWphJ109JGN0eCgkYywna29yZWtjJyw5MDAsMzAwKTsKICBwcmVnX21hdGNoX2FsbCgnL2FkZF9hY3Rpb25cKFxzKltcJyJdKFteXCciXSspW1wnIl1ccyosXHMqKFteLFwpXXswLDYwfSkvJywkYywkbSk7ICRvWydmYWt0YWlfaG9va3MnXT1hcnJheV9tYXAobnVsbCwkbVsxXSwkbVsyXSk7CiAgJGM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkbXUuJy9wZXRzaG9wLWZha3QtZ3JhemluaW1haS5waHAnKTsgJG9bJ2ZnX2hlYWQnXT1zdWJzdHIoJGMsMCwxNjAwKTsgcHJlZ19tYXRjaF9hbGwoJy9hZGRfYWN0aW9uXChccypbXCciXShbXlwnIl0rKVtcJyJdXHMqLFxzKihbXixcKV17MCw2MH0pLycsJGMsJG0pOyAkb1snZmdfaG9va3MnXT1hcnJheV9tYXAobnVsbCwkbVsxXSwkbVsyXSk7IHByZWdfbWF0Y2hfYWxsKCcvZnVuY3Rpb25ccysoXHcrKVxzKlwoKFteKV0qKVwpLycsJGMsJG0pOyAkb1snZmdfZm5zJ109YXJyYXlfbWFwKG51bGwsJG1bMV0sJG1bMl0pOwogICRjPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJyk7ICRvWyd0aF9kb2NfdHlwZSddPSRjdHgoJGMsJ2Z1bmN0aW9uIHBldHNob3BfZ2V0X2ludm9pY2VfZG9jdW1lbnRfdHlwZScsOTAwKTsgJG9bJ3RoX2dlbl9wZGYnXT0kY3R4KCRjLCdmdW5jdGlvbiBwZXRzaG9wX2dlbmVyYXRlX2ludm9pY2VfcGRmJywyMjAwKTsgJG9bJ3RoX3JlY2VpdmVkJ109JGN0eCgkYywiJ3BldHNob3Bfc2VuZF9vcmRlcl9yZWNlaXZlZF9lbWFpbCciLDE4MDApOyAkb1sndGhfYXR0YWNoJ109JGN0eCgkYywiJ3dvb2NvbW1lcmNlX2VtYWlsX2F0dGFjaG1lbnRzJyIsMTIwMCk7ICRvWyd0aF9zdGF0dXNfY2hhbmdlZCddPSRjdHgoJGMsIid3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfY2hhbmdlZCciLDE0MDApOwogICRvWydpdnlraWFpJ109JG1ldGgoJ1BldHNob3BfVXpzYWt5bXVfSXZ5a2lhaScpOwogICRvWydjYW5jZWxfaG9va3MnXT1hcnJheSgpOyBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfY2FuY2VsbGVkJywnd29vY29tbWVyY2Vfb3JkZXJfc3RhdHVzX3JlZnVuZGVkJywnd29vY29tbWVyY2Vfb3JkZXJfcGFydGlhbGx5X3JlZnVuZGVkJywnd29vY29tbWVyY2Vfb3JkZXJfcmVmdW5kZWQnLCd3b29jb21tZXJjZV9vcmRlcl9mdWxseV9yZWZ1bmRlZCcsJ3dvb2NvbW1lcmNlX3NhdmVkX29yZGVyX2l0ZW1zJywnd29vY29tbWVyY2VfYmVmb3JlX2RlbGV0ZV9vcmRlcl9pdGVtJykgYXMgJGgpeyAkY2I9YXJyYXkoKTsgaWYoaXNzZXQoJEdMT0JBTFNbJ3dwX2ZpbHRlciddWyRoXSkpeyBmb3JlYWNoKCRHTE9CQUxTWyd3cF9maWx0ZXInXVskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGs9PiR2KXsgJGZuPSR2WydmdW5jdGlvbiddOyAkY2JbXT0kcHIuJzonLihpc19zdHJpbmcoJGZuKT8kZm46KGlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06J2Nsb3N1cmUnKSk7IH0gfSB9ICRvWydjYW5jZWxfaG9va3MnXVskaF09JGNiOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgJEooJG8pOwp9LDk5KTsK';
const VER='dep-180516';
const GKEY='ps_e5r';
const PHASES=["R"];
const OUT='analize/s1615_e5r.json';
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
