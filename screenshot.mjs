process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYWog4oCUIFJFQUQtT05MWTogc2F1Z8WrcyBhdGl0aWttZW55cyAobm9ybWFsaXp1b3RhcyBzbHVnIGx5Z3VzLCBwdWJsaXNoKSArIHN0cnVrdMWrcmluaWFpIHB1c2xhcGlhaS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NjlhaiddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjY5IGFqJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgICAkTj1mdW5jdGlvbigkcyl7ICRzPXN0cnRvbG93ZXIocmF3dXJsZGVjb2RlKCRzKSk7ICRzPWJhc2VuYW1lKCRzKTsgJHM9c3RyX3JlcGxhY2UoYXJyYXkoJ3NjYXJvbicsJ2NjYXJvbicsJ3pjYXJvbicsJ3VvZ29uJywnYW9nb24nLCdlb2dvbicsJ2Vkb3QnLCdpb2dvbicsJ3VtYWNyJyksYXJyYXkoJ3MnLCdjJywneicsJ3UnLCdhJywnZScsJ2UnLCdpJywndScpLCRzKTsKICAgICAgJHM9cHJlZ19yZXBsYWNlKCcvXjItMF9cZCstLycsJycsJHMpOyAkcz1wcmVnX3JlcGxhY2UoJy8tXGR7NX0tXGQkLycsJycsJHMpOyAkcz1wcmVnX3JlcGxhY2UoJy8oXnwtKWFuZCgtfCQpLycsJy0nLCRzKTsgJHM9cHJlZ19yZXBsYWNlKCcvLVxkKyQvJywnJywkcyk9PT0kcz8kczokczsgcmV0dXJuIHByZWdfcmVwbGFjZSgnL1teYS16MC05XS8nLCcnLCRzKTsgfTsKICAgICRpZHg9YXJyYXkoKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCwgcG9zdF9uYW1lLCBwb3N0X3N0YXR1cyBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSIsQVJSQVlfQSkgYXMgJHIpeyAkaz0kTigkclsncG9zdF9uYW1lJ10pOyAkazI9cHJlZ19yZXBsYWNlKCcvKFxkKSQvJywnJDEnLCRrKTsgJGlkeFska11bXT0kcjsgfQogICAgJG1hcD1wZXRzaG9wX2xlZ2FjeV8zMDFfbWFwKCk7CiAgICAka2VsaWFpPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGtlbGlhcyB1LCBTVU0oaGl0cykgaywgTUFYKHJlZmVyZXIpIHJlZiBGUk9NIHskcH1wc19zZW9fNDA0IFdIRVJFIHBhc2t1dGluaXNfYXQgPj0gJzIwMjYtMDktMDknIEdST1VQIEJZIHUiLEFSUkFZX0EpIGFzICRyKXsgJGs9c3RydG9sb3dlcih0cmltKHJhd3VybGRlY29kZSgoc3RyaW5nKXBhcnNlX3VybCgkclsndSddLFBIUF9VUkxfUEFUSCkpLCcvJykpOyBpZigkayE9PScnKSAka2VsaWFpWyRrXT0oJGtlbGlhaVska10/PzApKyhpbnQpJHJbJ2snXTsgfQogICAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1cmxfa2VsaWFzIHUsIENPVU5UKCopIGsgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgdGlwYXM9J2Vycm9yNDA0JyBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCcgQU5EIHRlc3RpbmlzPTAgR1JPVVAgQlkgdSIsQVJSQVlfQSkgYXMgJHIpeyAkaz1zdHJ0b2xvd2VyKHRyaW0ocmF3dXJsZGVjb2RlKChzdHJpbmcpcGFyc2VfdXJsKCRyWyd1J10sUEhQX1VSTF9QQVRIKSksJy8nKSk7IGlmKCRrIT09JycpICRrZWxpYWlbJGtdPSgka2VsaWFpWyRrXT8/MCkrKGludCkkclsnayddOyB9CiAgICAkc2F1Z3VzPWFycmF5KCk7ICRkcmFmdD1hcnJheSgpOyAka2l0aT1hcnJheSgpOyAkc3RydWt0PWFycmF5KCk7CiAgICBmb3JlYWNoKCRrZWxpYWkgYXMgJGs9PiRoKXsKICAgICAgaWYoaXNzZXQoJG1hcFska10pIHx8IHByZWdfbWF0Y2goJyMoXnwvKSh3cC18YWRtaW58aW1hZ2UvfGNhdGFsb2cvfF9wcm9maWxlcnxfZW52aXJvbm1lbnR8ZmNrZWRpdG9yfHN0YXRpYy98YXNzZXRzL3xvcGVuKXxcLihwaHB8aHRtbHxqcGd8cG5nfGdpZnxqc3xjc3N8dHh0fHhtbHxpY298ZW52KSQjJywkaykgfHwgaW5fYXJyYXkoJGssYXJyYXkoJ3BocGluZm8nLCdpbmZvJywncmVhZG1lLmh0bWwnKSkpIGNvbnRpbnVlOwogICAgICAkbms9JE4oJGspOyAkbT0kaWR4WyRua10/P2FycmF5KCk7CiAgICAgICRwdWI9YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkbSxmdW5jdGlvbigkcil7cmV0dXJuICRyWydwb3N0X3N0YXR1cyddPT09J3B1Ymxpc2gnO30pKTsKICAgICAgaWYoY291bnQoJHB1Yik9PT0xKXsgJHVybD13cF9tYWtlX2xpbmtfcmVsYXRpdmUoZ2V0X3Blcm1hbGluaygoaW50KSRwdWJbMF1bJ0lEJ10pKTsgJHI9d3BfcmVtb3RlX2hlYWQoaG9tZV91cmwoJHVybCksYXJyYXkoJ3RpbWVvdXQnPT4xNSwncmVkaXJlY3Rpb24nPT4wKSk7ICRzYXVndXNbJGtdPWFycmF5KCRoLCR1cmwsKGludCkkcHViWzBdWydJRCddLGlzX3dwX2Vycm9yKCRyKT8wOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSk7IH0KICAgICAgZWxzZWlmKGNvdW50KCRwdWIpPjEpeyAka2l0aVska109YXJyYXkoJGgsJ2RhdWcgcHVibGlzaDogJy5jb3VudCgkcHViKSk7IH0KICAgICAgZWxzZWlmKCRtKXsgJGRyYWZ0WyRrXT1hcnJheSgkaCwkbVswXVsncG9zdF9zdGF0dXMnXSk7IH0KICAgICAgZWxzZWlmKHN0cnBvcygkaywnLScpPT09ZmFsc2UgfHwgc3Vic3RyX2NvdW50KCRrLCctJyk8PTMpeyAkc3RydWt0WyRrXT0kaDsgfQogICAgICBlbHNlIHsgJGtpdGlbJGtdPWFycmF5KCRoLCduZXJhc3RhJyk7IH0KICAgIH0KICAgIHVhc29ydCgkc2F1Z3VzLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbMF08PT4kYVswXTt9KTsgYXJzb3J0KCRzdHJ1a3QpOyB1YXNvcnQoJGtpdGksZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlswXTw9PiRhWzBdO30pOwogICAgJG9bJ3Zpc29fa2VsaXUnXT1jb3VudCgka2VsaWFpKTsgJG9bJ24nXT1hcnJheSgnc2F1Z3VzJz0+Y291bnQoJHNhdWd1cyksJ2RyYWZ0Jz0+Y291bnQoJGRyYWZ0KSwnc3RydWt0Jz0+Y291bnQoJHN0cnVrdCksJ2tpdGknPT5jb3VudCgka2l0aSkpOwogICAgJG9bJ3NhdWd1c19oaXRzJ109YXJyYXlfc3VtKGFycmF5X2NvbHVtbigkc2F1Z3VzLDApKTsgJG9bJ2tpdGlfaGl0cyddPWFycmF5X3N1bShhcnJheV9jb2x1bW4oJGtpdGksMCkpOyAkb1snZHJhZnRfaGl0cyddPWFycmF5X3N1bShhcnJheV9jb2x1bW4oJGRyYWZ0LDApKTsgJG9bJ3N0cnVrdF9oaXRzJ109YXJyYXlfc3VtKCRzdHJ1a3QpOwogICAgJG9bJ3NhdWd1cyddPSRzYXVndXM7ICRvWydzdHJ1a3QnXT1hcnJheV9zbGljZSgkc3RydWt0LDAsNDAsdHJ1ZSk7ICRvWydraXRpX3RvcCddPWFycmF5X3NsaWNlKCRraXRpLDAsMjUsdHJ1ZSk7CiAgICAkb1sncHVzbGFwaWFpJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X25hbWUgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwYWdlJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIHBvc3RfbmFtZSIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-190402';
const GKEY='ps_s1669aj';
const PHASES=["A"];
const OUT='analize/s1669_aj.json';
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
