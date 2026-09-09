process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY5IGNtcGx6IGxhdWthaSAyICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmtJJ10pPyRfR0VUWydwc19ia0knXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjY5UjInKTsKICB0cnl7CiAgICAkZGlyPVdQX1BMVUdJTl9ESVIuJy9jb21wbGlhbnotZ2Rwcic7CiAgICAkYz1maWxlX2dldF9jb250ZW50cygkZGlyLicvc2V0dGluZ3Mvc2V0dGluZ3MucGhwJyk7CiAgICBpZihwcmVnX21hdGNoX2FsbCgiL2FkZF8oPzpzdWIpP21lbnVfcGFnZVwoXHMqKC57MCwyNjB9PylcKTsvcyIsJGMsJG0pKSAkb1snbWVuaXUnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHgpO30sYXJyYXlfc2xpY2UoJG1bMV0sMCw4KSk7CiAgICAkY2ZnPWlzc2V0KENPTVBMSUFOWjo6JGNvbmZpZyk/Q09NUExJQU5aOjokY29uZmlnOm51bGw7CiAgICAkb1snY29uZmlnX3lyYSddPSRjZmc/Z2V0X2NsYXNzKCRjZmcpOiduZSc7CiAgICBpZigkY2ZnKXsKICAgICAgJHZhcnM9Z2V0X29iamVjdF92YXJzKCRjZmcpOwogICAgICBmb3JlYWNoKCR2YXJzIGFzICRrPT4kdikgJG9bJ2NvbmZpZ19zYXZ5YmVzJ11bJGtdPWlzX2FycmF5KCR2KT8oJ21hc3l2YXMgJy5jb3VudCgkdikpOmdldHR5cGUoJHYpOwogICAgICAkZmw9aXNzZXQoJGNmZy0+ZmllbGRzKT8kY2ZnLT5maWVsZHM6YXJyYXkoKTsKICAgICAgZm9yZWFjaChhcnJheSgndGhpcmRwYXJ0eV9zZXJ2aWNlc19vbl9zaXRlJywndXNlc190aGlyZHBhcnR5X3NlcnZpY2VzJywnY29uc2VudC1tb2RlJywnZ3RtX2NvZGUnLCd1YV9jb2RlJywnYXdfY29kZScsJ2NvbXBpbGVfc3RhdGlzdGljcycsJ2NvbXBpbGVfc3RhdGlzdGljc19tb3JlX2luZm8nKSBhcyAkayl7CiAgICAgICAgaWYoaXNzZXQoJGZsWyRrXSkpeyAkZD0kZmxbJGtdOwogICAgICAgICAgJG9bJ2xhdWthaSddWyRrXT1hcnJheSgndHlwZSc9PiRkWyd0eXBlJ10/Pyc/Jywnc3RlcCc9PiRkWydzdGVwJ10/P251bGwsJ3NlY3Rpb24nPT4kZFsnc2VjdGlvbiddPz9udWxsLCdtZW51Jz0+JGRbJ21lbnVfaWQnXT8/bnVsbCwKICAgICAgICAgICAgJ2NvbmRpdGlvbic9Pmlzc2V0KCRkWydjb25kaXRpb24nXSk/anNvbl9lbmNvZGUoJGRbJ2NvbmRpdGlvbiddLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOm51bGwsCiAgICAgICAgICAgICdvcHRpb25zJz0+aXNzZXQoJGRbJ29wdGlvbnMnXSk/KGlzX2FycmF5KCRkWydvcHRpb25zJ10pP2FycmF5X3NsaWNlKCRkWydvcHRpb25zJ10sMCwzMCx0cnVlKTokZFsnb3B0aW9ucyddKTpudWxsKTsgfSB9CiAgICAgIGlmKGlzc2V0KCRjZmctPnRoaXJkcGFydHlfc2VydmljZXMpKSAkb1sndHBzJ109YXJyYXlfc2xpY2UoKGFycmF5KSRjZmctPnRoaXJkcGFydHlfc2VydmljZXMsMCw0MCx0cnVlKTsKICAgICAgaWYoaXNzZXQoJGNmZy0+c3RhdGlzdGljcykpICRvWydzdGF0aXN0aWNzX3ZhcmlhbnRhaSddPWFycmF5X3NsaWNlKChhcnJheSkkY2ZnLT5zdGF0aXN0aWNzLDAsMjAsdHJ1ZSk7CiAgICB9CiAgICAvLyBmYWlsYXMgc3UgdGhpcmRwYXJ0eSBzYXJhc28gYXBpYnJlemltdQogICAgZm9yZWFjaChhcnJheSgnL2NvbmZpZy9jb25maWcucGhwJywnL2NvbmZpZy9maWVsZHMucGhwJywnL2NvbmZpZy93aXphcmQucGhwJywnL2NvbmZpZy9zZXJ2aWNlcy5waHAnKSBhcyAkZil7IGlmKGZpbGVfZXhpc3RzKCRkaXIuJGYpKSAkb1snY29uZmlnX2ZhaWxhaSddW109JGY7IH0KICAgIGlmKGZpbGVfZXhpc3RzKCRkaXIuJy9jb25maWcvY29uZmlnLnBocCcpKXsgJGNjPWZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9jb25maWcvY29uZmlnLnBocCcpOwogICAgICBpZihwcmVnX21hdGNoKCIvdGhpcmRwYXJ0eV9zZXJ2aWNlc1xzKj1ccyphcnJheVwoKC57MCw5MDB9KS9zIiwkY2MsJG0pKSAkb1sndHBzX2lzX2ZhaWxvJ109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRtWzFdKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-071944';
const GKEY='ps_bkI';
const PHASES=["R"];
const OUT='analize/s1669_r2.json';
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
