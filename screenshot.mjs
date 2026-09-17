process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIG4g4oCUIFBST0ZJTElTOiBrdXIgZGluZ3N0YSBzZXJ2ZXJpbyBsYWlrYXMgcHJhZGluaW8gcHVzbGFwaW8gdcW+a2xhdXNvamUuIFJlYWQtb25seS4gKi8KaWYgKGlzc2V0KCRfR0VUWydwc19zMTY4OXNuJ10pKSB7CiAgJEdMT0JBTFNbJ3BzX3Byb2YnXT1hcnJheSgnaW5pdCc9Pm1pY3JvdGltZSh0cnVlKSk7CiAgJG1rPWZ1bmN0aW9uKCRoKXsgcmV0dXJuIGZ1bmN0aW9uKCkgdXNlKCRoKXsgJEdMT0JBTFNbJ3BzX3Byb2YnXVskaF09bWljcm90aW1lKHRydWUpOyAkR0xPQkFMU1sncHNfcHJvZiddWydxXycuJGhdPSRHTE9CQUxTWyd3cGRiJ10tPm51bV9xdWVyaWVzOyB9OyB9OwogIGZvcmVhY2goYXJyYXkoJ3dwX2xvYWRlZCcsJ3dwJywndGVtcGxhdGVfcmVkaXJlY3QnLCd3cF9oZWFkJywnd3BfZm9vdGVyJykgYXMgJGgpIGFkZF9hY3Rpb24oJGgsJG1rKCRoKSwtOTk5OTkpOwogIGFkZF9hY3Rpb24oJ3RlbXBsYXRlX3JlZGlyZWN0JyxmdW5jdGlvbigpeyBvYl9zdGFydCgpOyB9LDk5OTk5KTsKICBhZGRfYWN0aW9uKCdzaHV0ZG93bicsZnVuY3Rpb24oKXsKICAgIGdsb2JhbCAkd3BkYjsgJFA9JEdMT0JBTFNbJ3BzX3Byb2YnXTsgJHQwPSRfU0VSVkVSWydSRVFVRVNUX1RJTUVfRkxPQVQnXTsgJGh0bWw9b2JfZ2V0X2NsZWFuKCk7ICRlbmQ9bWljcm90aW1lKHRydWUpOwogICAgJG89YXJyYXkoJ21zJz0+YXJyYXkoKSk7IGZvcmVhY2goYXJyYXkoJ2luaXQnLCd3cF9sb2FkZWQnLCd3cCcsJ3RlbXBsYXRlX3JlZGlyZWN0Jywnd3BfaGVhZCcsJ3dwX2Zvb3RlcicpIGFzICRoKSBpZihpc3NldCgkUFskaF0pKSRvWydtcyddWyRoXT1yb3VuZCgoJFBbJGhdLSR0MCkqMTAwMCk7CiAgICAkb1snbXMnXVsndmlzbyddPXJvdW5kKCgkZW5kLSR0MCkqMTAwMCk7ICRvWydxJ109YXJyYXkoJ2lraV9pbml0Jz0+bnVsbCwnd3BfaGVhZCc9PiRQWydxX3dwX2hlYWQnXT8/bnVsbCwndmlzbyc9PiR3cGRiLT5udW1fcXVlcmllcyk7CiAgICAkb1snaHRtbF9rYiddPXJvdW5kKHN0cmxlbigoc3RyaW5nKSRodG1sKS8xMDI0KTsgJG9bJ21lbV9tYiddPXJvdW5kKG1lbW9yeV9nZXRfcGVha191c2FnZSh0cnVlKS8xMDQ4NTc2KTsKICAgICRvWydmaWxlcyddPWNvdW50KGdldF9pbmNsdWRlZF9maWxlcygpKTsgJHN6PTA7IGZvcmVhY2goZ2V0X2luY2x1ZGVkX2ZpbGVzKCkgYXMgJGYpJHN6Kz1AZmlsZXNpemUoJGYpOyAkb1snZmlsZXNfa2InXT1yb3VuZCgkc3ovMTAyNCk7CiAgICAkb1snYXV0b2xvYWRfa2InXT1yb3VuZCgkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTShMRU5HVEgob3B0aW9uX3ZhbHVlKSkgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIGF1dG9sb2FkIElOICgneWVzJywnb24nLCdhdXRvLW9uJywnYXV0bycpIikvMTAyNCk7CiAgICAkb1snYXV0b2xvYWRfdG9wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIFJPVU5EKExFTkdUSChvcHRpb25fdmFsdWUpLzEwMjQpIGtiIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBhdXRvbG9hZCBJTiAoJ3llcycsJ29uJywnYXV0by1vbicsJ2F1dG8nKSBPUkRFUiBCWSBMRU5HVEgob3B0aW9uX3ZhbHVlKSBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogICAgJG9jPWZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9nZXRfc3RhdHVzJyk/QG9wY2FjaGVfZ2V0X3N0YXR1cyhmYWxzZSk6bnVsbDsgJG9bJ29wY2FjaGUnXT0kb2M/YXJyYXkoJ29uJz0+JG9jWydvcGNhY2hlX2VuYWJsZWQnXSwnaGl0JSc9PnJvdW5kKCRvY1snb3BjYWNoZV9zdGF0aXN0aWNzJ11bJ29wY2FjaGVfaGl0X3JhdGUnXT8/MCksJ2Z1bGwnPT4kb2NbJ2NhY2hlX2Z1bGwnXT8/bnVsbCwnbWVtX2ZyZWVfbWInPT5yb3VuZCgoJG9jWydtZW1vcnlfdXNhZ2UnXVsnZnJlZV9tZW1vcnknXT8/MCkvMTA0ODU3NikpOiduxJdyYSc7CiAgICAkb1snZXh0J109YXJyYXkoJ3JlZGlzJz0+ZXh0ZW5zaW9uX2xvYWRlZCgncmVkaXMnKSwnbWVtY2FjaGVkJz0+ZXh0ZW5zaW9uX2xvYWRlZCgnbWVtY2FjaGVkJyksJ2FwY3UnPT5leHRlbnNpb25fbG9hZGVkKCdhcGN1JyksJ29ial9jYWNoZV9kcm9waW4nPT53cF91c2luZ19leHRfb2JqZWN0X2NhY2hlKCkpOwogICAgJG9bJ2xvYWQnXT1mdW5jdGlvbl9leGlzdHMoJ3N5c19nZXRsb2FkYXZnJyk/c3lzX2dldGxvYWRhdmcoKTpudWxsOyAkb1snY3B1J109QHN1YnN0cl9jb3VudCgoc3RyaW5nKUBmaWxlX2dldF9jb250ZW50cygnL3Byb2MvY3B1aW5mbycpLCdwcm9jZXNzb3InKTsKICAgICRvWydwaHAnXT1QSFBfVkVSU0lPTi4nICcucGhwX3NhcGlfbmFtZSgpOyAkb1snY3Jvbl9hbHQnXT1kZWZpbmVkKCdESVNBQkxFX1dQX0NST04nKT9ESVNBQkxFX1dQX0NST046ZmFsc2U7CiAgICAkdD1taWNyb3RpbWUodHJ1ZSk7IGZvcigkaT0wOyRpPDIwMDAwOyRpKyspe21kNSgkaSk7fSAkb1snY3B1X2JlbmNoX21zJ109cm91bmQoKG1pY3JvdGltZSh0cnVlKS0kdCkqMTAwMCk7CiAgICAkdD1taWNyb3RpbWUodHJ1ZSk7ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIik7ICRvWydkYl9waW5nX21zJ109cm91bmQoKG1pY3JvdGltZSh0cnVlKS0kdCkqMTAwMCwxKTsKICAgICRtdT1hcnJheSgpOyBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZikkbXVbYmFzZW5hbWUoJGYpXT1maWxlc2l6ZSgkZik7IGFyc29ydCgkbXUpOyAkb1snbXVfbiddPWNvdW50KCRtdSk7ICRvWydtdV9rYiddPXJvdW5kKGFycmF5X3N1bSgkbXUpLzEwMjQpOyAkb1snbXVfdG9wJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRiKXtyZXR1cm4gcm91bmQoJGIvMTAyNCk7fSxhcnJheV9zbGljZSgkbXUsMCwxMCx0cnVlKSk7CiAgICAkb1sncGx1Z2luc19hY3RpdmUnXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSk7ICRvWydzbmlwcGV0c19hY3RpdmUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSIpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsKICB9LCAwKTsKfQo=';
const VER='dep-095140';
const GKEY='ps_s1689sn';
const PHASES=["GO"];
const OUT='analize/s1689s_n.json';
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
