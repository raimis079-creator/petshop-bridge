process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzAgYSDigJQgUkVBRC1PTkxZOiAjMTAwNiBUb2Z1IMW+YWxpYSBhcmJhdGEg4oCUIEFWIGxpa3V0aXMsIHBhcnRpam9zLCByZWdpc3RyYXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjcwYSddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjcwIGEnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRvaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9yZGVyX2lkIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfb3JkZXJfbnVtYmVyJyBBTkQgbWV0YV92YWx1ZT0nMTAwNicgTElNSVQgMSIpOyAkb3JkPXdjX2dldF9vcmRlcigkb2lkKTsKICAgICRvWyd1enMnXT1hcnJheSgnaWQnPT4kb2lkLCdzdCc9PiRvcmQtPmdldF9zdGF0dXMoKSwnbW9rJz0+JG9yZC0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJ2RsJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19kbF9idXNlbmEnKSk7CiAgICBmb3JlYWNoKCRvcmQtPmdldF9tZXRhX2RhdGEoKSBhcyAkbWQpeyBpZihwcmVnX21hdGNoKCcvXl9wc18oZGx8a2VsaWFzfHNhbmRlbHxydXNpYXZ8ZWlsZXxkYWx5c3xtYXJzcnV0KS8nLCRtZC0+a2V5KSkgJG9bJ3V6cyddWydtZXRhJ11bJG1kLT5rZXldPW1iX3N1YnN0cihpc19zY2FsYXIoJG1kLT52YWx1ZSk/KHN0cmluZykkbWQtPnZhbHVlOndwX2pzb25fZW5jb2RlKCRtZC0+dmFsdWUpLDAsMzAwKTsgfQogICAgZm9yZWFjaCgkb3JkLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpeyAkcGlkPSRpdC0+Z2V0X3ZhcmlhdGlvbl9pZCgpPzokaXQtPmdldF9wcm9kdWN0X2lkKCk7ICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICAgJGltPWFycmF5KCk7IGZvcmVhY2goJGl0LT5nZXRfbWV0YV9kYXRhKCkgYXMgJG1kKSAkaW1bJG1kLT5rZXldPW1iX3N1YnN0cihpc19zY2FsYXIoJG1kLT52YWx1ZSk/KHN0cmluZykkbWQtPnZhbHVlOndwX2pzb25fZW5jb2RlKCRtZC0+dmFsdWUpLDAsMjAwKTsKICAgICAgJHg9YXJyYXkoJ2l0ZW0nPT4kaWlkLCdwaWQnPT4kcGlkLCdwYXYnPT4kaXQtPmdldF9uYW1lKCksJ2tpZWtpcyc9PiRpdC0+Z2V0X3F1YW50aXR5KCksJ2l0ZW1fbWV0YSc9PiRpbSwKICAgICAgICAnbWV0YSc9PmFycmF5KCdfc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksJ19vd25fc3RvY2tfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ19wc19zYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnX3N0b2NrX3N0YXR1cyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksJ19tYW5hZ2Vfc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19tYW5hZ2Vfc3RvY2snLHRydWUpLCdfcHNfdGlla2VqYXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc190aWVrZWphcycsdHJ1ZSkpKTsKICAgICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1wc19zb3VyY2VzJyIpKSAkeFsnc291cmNlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkcGlkKSxBUlJBWV9BKTsKICAgICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1wc19wYXJ0aWpvcyciKSkgJHhbJ3BhcnRpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSVkIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsJHBpZCksQVJSQVlfQSk7CiAgICAgICRvWydwcmVrZXMnXVtdPSR4OyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-062351';
const GKEY='ps_s1670a';
const PHASES=["A"];
const OUT='analize/s1670_a.json';
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
