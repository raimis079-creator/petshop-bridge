process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE1aCB2YXJpYWJsZSB0ZXZhaSAxNTg4Ni8xNzg2MiBtYW5hZ2Vfc3RvY2s9bm8gKyBzeW5jICgxIHZ5a2R5dGkgLyA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE1aCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxNWgnXTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3MTVoJywnZmF6ZSc9PiRmXTsgJGlkcz1bMTU4ODYsMTc4NjJdOwogIHRyeXsKICAgIGlmKCRmPT09JzEnKXsgJGJhaz1nZXRfb3B0aW9uKCdwc19zMTcxNV90ZXZhaV9iYWsnLFtdKTsKICAgICAgZm9yZWFjaCgkaWRzIGFzICRwaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgaWYoISRwfHwhJHAtPmlzX3R5cGUoJ3ZhcmlhYmxlJykpIHsgJHJbJ3ByYWxlaXN0YSddW109JHBpZDsgY29udGludWU7IH0KICAgICAgICAkYmFrWyRwaWRdPVsnbWFuYWdlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfbWFuYWdlX3N0b2NrJyx0cnVlKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksJ3N0YXR1cyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksJ3QnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogICAgICAgICRwLT5zZXRfbWFuYWdlX3N0b2NrKGZhbHNlKTsgJHAtPnNhdmUoKTsgV0NfUHJvZHVjdF9WYXJpYWJsZTo6c3luY19zdG9ja19zdGF0dXMoJHBpZCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7CiAgICAgICAgJHAyPXdjX2dldF9wcm9kdWN0KCRwaWQpOyAkclsncG8nXVskcGlkXT1bJ21hbmFnZSc9PiRwMi0+Z2V0X21hbmFnZV9zdG9jaygpLCdzdGF0dXMnPT4kcDItPmdldF9zdG9ja19zdGF0dXMoKSwnaW4nPT4kcDItPmlzX2luX3N0b2NrKCksJ3Jhdyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksJ3Zhcic9PmFycmF5X21hcChmdW5jdGlvbigkdmlkKXsgJHY9d2NfZ2V0X3Byb2R1Y3QoJHZpZCk7IHJldHVybiBbJHZpZCwkdi0+Z2V0X3N0b2NrX3N0YXR1cygpLCR2LT5nZXRfc3RvY2tfcXVhbnRpdHkoKV07IH0sJHAyLT5nZXRfY2hpbGRyZW4oKSldOyB9CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzE1X3RldmFpX2JhaycsJGJhayxmYWxzZSk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSl7IHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7ICRyWydjYWNoZSddPSdpc3ZhbHl0YXMnOyB9CiAgICAgIC8vIGtpZWsgZGFyIHZhcmlhYmxlIHRldnUgc3UgbWFuYWdlX3N0b2NrPXllcyBpciBfc3RvY2s8PTAsIGt1cml1IHZhcmlhY2lqb3MgdHVyaSBsaWt1dGkKICAgICAgJHJbJ2tpdGlfdGV2YWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBMRUZUKHAucG9zdF90aXRsZSw1MCkgdCwgc3MubWV0YV92YWx1ZSBzdCwgKFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHYgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSB2cyBPTiB2cy5wb3N0X2lkPXYuSUQgQU5EIHZzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgdnMubWV0YV92YWx1ZT0naW5zdG9jaycgV0hFUkUgdi5wb3N0X3BhcmVudD1wLklEIEFORCB2LnBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCB2LnBvc3Rfc3RhdHVzPSdwdWJsaXNoJykgdmFyX2luIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRCBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF90eXBlJyBKT0lOIHskd3BkYi0+dGVybXN9IHRtIE9OIHRtLnRlcm1faWQ9dHQudGVybV9pZCBBTkQgdG0uc2x1Zz0ndmFyaWFibGUnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbXMgT04gbXMucG9zdF9pZD1wLklEIEFORCBtcy5tZXRhX2tleT0nX21hbmFnZV9zdG9jaycgQU5EIG1zLm1ldGFfdmFsdWU9J3llcycgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNzIE9OIHNzLnBvc3RfaWQ9cC5JRCBBTkQgc3MubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgfQogICAgaWYoJGY9PT0nOScpeyAkYmFrPWdldF9vcHRpb24oJ3BzX3MxNzE1X3RldmFpX2JhaycsW10pOyBmb3JlYWNoKCRiYWsgYXMgJHBpZD0+JGIpeyB1cGRhdGVfcG9zdF9tZXRhKChpbnQpJHBpZCwnX21hbmFnZV9zdG9jaycsJGJbJ21hbmFnZSddKTsgdXBkYXRlX3Bvc3RfbWV0YSgoaW50KSRwaWQsJ19zdG9jaycsJGJbJ3N0b2NrJ10pOyB1cGRhdGVfcG9zdF9tZXRhKChpbnQpJHBpZCwnX3N0b2NrX3N0YXR1cycsJGJbJ3N0YXR1cyddKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygoaW50KSRwaWQpOyB9ICRyWydhdHN0YXR5dGEnXT1jb3VudCgkYmFrKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-200809';
const GKEY='ps_s1715h';
const PHASES=["1"];
const OUT='analize/s1715_h1.json';
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
