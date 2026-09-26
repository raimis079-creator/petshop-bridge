process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxdCByZWFkLW9ubHk6IE1uTSByaW5raW5pdSBrb21wb3ppY2lqb3Mg4oCUIGF0dGFjaG1lbnRhaSwgZmFpbGFpIGRpc2tlLCBwZXRzaG9wLXJpbmtpbmlhaSBmdW5rY2lqb3MgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzIxdCddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MjF0J107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICR1cD13cF91cGxvYWRfZGlyKCk7CiAgdHJ5ewogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIE9OIHRyLm9iamVjdF9pZD1wLklEIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSk9JTiB7JHdwZGItPnRlcm1zfSB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X3R5cGUnIEFORCB0LnNsdWc9J21peC1hbmQtbWF0Y2gnIEFORCBwLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScsJ3RyYXNoJykiKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkaWQ9KGludCkkaWQ7ICRyb3c9WydzdCc9PmdldF9wb3N0X3N0YXR1cygkaWQpLCdwYXYnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkaWQpLDAsNDApLCdsYXVrYXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthcycsdHJ1ZSksJ3RodW1iJz0+KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX3RodW1ibmFpbF9pZCcsdHJ1ZSksJ21vZCc9PmdldF9wb3N0X2ZpZWxkKCdwb3N0X21vZGlmaWVkJywkaWQpXTsKICAgICAgJGF0dD0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCwgcG9zdF90aXRsZSwgcG9zdF9kYXRlIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdhdHRhY2htZW50JyBBTkQgKHBvc3RfcGFyZW50PSVkIE9SIHBvc3RfdGl0bGUgTElLRSAlcyBPUiBndWlkIExJS0UgJXMpIE9SREVSIEJZIElEIERFU0MgTElNSVQgNSIsJGlkLCdyaW5rLWtvbXBvemljaWphLScuJGlkLictJScsJyVyaW5rLWtvbXBvemljaWphLScuJGlkLictJScpLEFSUkFZX0EpOwogICAgICAkcm93WydhdHQnXT1hcnJheV9tYXAoZm4oJGEpPT5bJGFbJ0lEJ10sJGFbJ3Bvc3RfdGl0bGUnXSxzdWJzdHIoJGFbJ3Bvc3RfZGF0ZSddLDAsMTYpLGZpbGVfZXhpc3RzKGdldF9hdHRhY2hlZF9maWxlKCRhWydJRCddKSk/J2ZhaWxhcyc6J0JFIEZBSUxPJ10sJGF0dCk7CiAgICAgICRkaXNrPWdsb2IoJHVwWydiYXNlZGlyJ10uJy8qLyovcmluay1rb21wb3ppY2lqYS0nLiRpZC4nLSouanBnJyk7ICRyb3dbJ2Rpc2tlJ109YXJyYXlfbWFwKGZuKCRmKT0+YmFzZW5hbWUoJGYpLicgJy5kYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGYpKSxhcnJheV9zbGljZSgoYXJyYXkpJGRpc2ssMCw0KSk7CiAgICAgICRyb3dbJ3BhcmFzYXMnXT1hcnJheV9rZXlzKGFycmF5X2ZpbHRlcihnZXRfcG9zdF9tZXRhKCRpZCksZm4oJHYsJGspPT5zdHJpcG9zKCRrLCdrb21wb3onKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdjb21wb3NpdGlvbicpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ19wc19yaW5rJykhPT1mYWxzZSxBUlJBWV9GSUxURVJfVVNFX0JPVEgpKTsKICAgICAgJHJbJ21ubSddWyRpZF09JHJvdzsgfQogICAgLy8gdmlzb3Mgcmluay1rb21wb3ppY2lqYSBhdHRhY2htZW50YWkKICAgICRyWydrb21wX2F0dF92aXNvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9zdGF0dXMgc3QsIENPVU5UKCopIG4sIE1JTihwb3N0X2RhdGUpIG51bywgTUFYKHBvc3RfZGF0ZSkgaWtpIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdhdHRhY2htZW50JyBBTkQgcG9zdF90aXRsZSBMSUtFICdyaW5rLWtvbXBvemljaWphLSUnIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICAgJHJbJ2tvbXBfZGlza2VfdmlzbyddPWNvdW50KGdsb2IoJHVwWydiYXNlZGlyJ10uJy8qLyovcmluay1rb21wb3ppY2lqYS0qLmpwZycpKTsKICAgICRyWydrb21wX2Rpc2tlX2JlX3RodW1iX2R5ZHppbyddPWNvdW50KGdsb2IoJHVwWydiYXNlZGlyJ10uJy8qLyovcmluay1rb21wb3ppY2lqYS0qWzAtOV0uanBnJykpOwogICAgLy8gcGV0c2hvcC1yaW5raW5pYWkgbW9kdWxpcwogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcmlua2luKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgcHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFtcZC5dKykvJywkcywkbSk7IHByZWdfbWF0Y2hfYWxsKCcvZnVuY3Rpb25ccysoXHcqKD86a29tcG96fHBpZXNrfGZvdG98bnVvdHJhdWt8dGh1bWJ8cGVkc2FrfGltYWdlKVx3KilccypcKC9pJywkcywkZm4pOyBwcmVnX21hdGNoX2FsbCgnL2FkZF8oPzphY3Rpb258ZmlsdGVyKVwoXHMqW1wnIl0oW15cJyJdKylbXCciXS8nLCRzLCRoayk7CiAgICAgICRyWydtb2R1bGlhaSddW2Jhc2VuYW1lKCRmKV09Wyd2Jz0+JG1bMV0/Pyc/Jywna2InPT5yb3VuZChzdHJsZW4oJHMpLzEwMjQpLCdmbic9PmFycmF5X3VuaXF1ZSgkZm5bMV0pLCdob29rcyc9PmFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkaGtbMV0pLDAsMjUpLCdtZDUnPT5tZDUoJHMpXTsKICAgICAgZm9yZWFjaChbJ190aHVtYm5haWxfaWQnLCdkZWxldGVfcG9zdF90aHVtYm5haWwnLCd3cF9kZWxldGVfYXR0YWNobWVudCcsJ3NldF9wb3N0X3RodW1ibmFpbCcsJ2ltYWdlY3JvcGF1dG8nXSBhcyAka3cpeyAkclsnbW9kdWxpYWknXVtiYXNlbmFtZSgkZildWydrdyddWyRrd109c3Vic3RyX2NvdW50KCRzLCRrdyk7IH0gfQogICAgLy8gc25pcHBldCA1MzkgYWt0eXZ1cz8KICAgICRyWydzbmlwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIG5hbWUsIGFjdGl2ZSwgbW9kaWZpZWQgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBpZCBJTiAoNTM5LDU0Nyw1NTApIE9SIG5hbWUgTElLRSAnJXJpbmtpbiUnIE9SIG5hbWUgTElLRSAnJWtvbXBveiUnIExJTUlUIDEyIixBUlJBWV9BKTsKICAgIC8vIGthcyBnYWxlam8gdHJpbnRpIGF0dGFjaG1lbnR1czogbWVkaWEgY2xlYW5lciAvIHNob3J0cGl4ZWwgLyBuZXNlbmlhaSBpc3RyaW50aSAoYmUgaXN0cmludHVqdSBsZW50ZWxlcyDigJQgdGlrIHBvc3QgY291bnQgcGFnYWwgZGF0YSkKICAgICRyWydhdHRfcGVyX2RpZW5hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShwb3N0X2RhdGUpIGQsIENPVU5UKCopIG4gRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X3RpdGxlIExJS0UgJ3Jpbmsta29tcG96aWNpamEtJScgR1JPVVAgQlkgMSBPUkRFUiBCWSAxIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICAgJHJbJ3BsdWdpbnNfbWVkaWEnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksZm4oJHApPT5wcmVnX21hdGNoKCcvbWVkaWF8Y2xlYW58c2hvcnRwaXhlbHxpbWFnZXx0aHVtYnxyZWdlbmVyYXQvaScsJHApKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-163216';
const GKEY='ps_s1721t';
const PHASES=["1"];
const OUT='analize/s1721t.json';
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
