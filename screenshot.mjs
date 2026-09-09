process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg0IGF1ZGl0YXMgdjIgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibGMnXSk/JF9HRVRbJ3BzX2JsYyddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODRiJyk7CiAgdHJ5ewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAgICBwcmVnX21hdGNoX2FsbCgiL2FkZF9hY3Rpb25cKFxzKid3cF9hamF4XyhbYS16MC05X10rKSdccyosXHMqYXJyYXlcKFxzKig/Ol9fQ0xBU1NfX3xcXFwkdGhpc3wnW14nXSsnKVxzKixccyonKFthLXowLTlfXSspJy9pIiwkYywkbSxQUkVHX1NFVF9PUkRFUik7CiAgICAkb2s9MDskdHI9MDsKICAgIGZvcmVhY2goJG0gYXMgJHgpeyAkeT1tZXRob2RfZXhpc3RzKCdQZXRzaG9wX0thdGFsb2dhcycsJHhbMl0pOwogICAgICAkb1sna2FibGlhaSddWyR4WzFdXT0keFsyXS4oJHk/JyBPSyc6JyDigJQgVFJVS1NUQScpOwogICAgICBpZigkeSkkb2srKzsgZWxzZSB7JHRyKys7ICRvWydUUlVLU1RBTUknXVskeFsxXV09JHhbMl07fSB9CiAgICAkb1snc3V2ZXN0aW5lJ109YXJyYXkoJ3Zpc28nPT5jb3VudCgkbSksJ09LJz0+JG9rLCdUUlVLU1RBJz0+JHRyKTsKICAgICRnPWZ1bmN0aW9uKCRjLCR6LCRwciwkcG8sJG1heD0yKXsgJHI9YXJyYXkoKTsgJG9mZj0wOyRuPTA7CiAgICAgIHdoaWxlKCgkcD1zdHJpcG9zKCRjLCR6LCRvZmYpKSE9PWZhbHNlICYmICRuPCRtYXgpeyAkcltdPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdWJzdHIoJGMsbWF4KDAsJHAtJHByKSwkcHIrJHBvKSk7ICRvZmY9JHArc3RybGVuKCR6KTsgJG4rKzsgfSByZXR1cm4gJHI7IH07CiAgICAkb1snanNfbmF1amEnXT0kZygkYywncHNfa2F0X3BhcnRpamFfbmF1amEnLDkwMCw5MDAsMik7CiAgICAkb1sncHRfbmF1amFfaHRtbCddPSRnKCRjLCdwdC1uYXVqYScsNTAwLDkwMCwyKTsKICAgIC8vIGV0YWxvbmFzOiBzdGF0aW5pcyBtZXRvZGFzIHJhc2FudGlzIGkgREIgc3UgenVybmFsdQogICAgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrYWpheF9wYWt1b3RlXHMqXCguezAsMjgwMH0vcycsJGMsJG1tKSkgJG9bJ2V0YWxvbmFzX3Bha3VvdGUnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1tWzBdKTsKICAgIC8vIGl2eWtpdSBpcmFzeW1vIHBhdnl6ZHlzIGthdGFsb2dlCiAgICAkb1snaXZ5a2lhaV9uYXVkb2ppbWFzJ109JGcoJGMsJ1BldHNob3BfSXZ5a2lhaTo6aXJhc3l0aScsMzAwLDUwMCwzKTsKICAgIC8vIHBhcnRpanUgbGVudGVsZXMgcGF2YWRpbmltYXMga29kZQogICAgJG9bJ2xlbnRlbGUnXT0kZygkYywnUGV0c2hvcF9QYXJ0aWpvczo6bGVudGVsZScsMTUwLDI1MCwyKTsKICAgIC8vIGFyIHlyYSBzYXJndSBmdW5rY2lqYSBkYXRhaQogICAgJG9bJ2RhdGFfc2FyZ2FzJ109JGcoJGMsJ2dlcmlhdXNpYV9pa2knLDIwMCw0MDAsNCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-093643';
const GKEY='ps_blc';
const PHASES=["R"];
const OUT='analize/s1684_b.json';
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
