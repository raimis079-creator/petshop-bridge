process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODYgbXgg4oCUIFJFQ09OIChyZWFkLW9ubHkpOiBQZXRzaG9wX1NlbmRlcl9BZGFwdGVyIG1ldG9kYWkgKyBIVFRQIGhlbHBlcmlzOyBTZW5kZXIgQVBJOiBmaWVsZHMsIGdyb3VwcywgdGVycmEgc3Vic2NyaWJlcjsgcHNfcmVsYXVuY2hfa29udGFrdGFpIGNhbGMgZWlsdXTEl3MgYGR1b21lbnlzYCByYWt0YWkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg2bXgnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY4NiBteCcpOwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9TZW5kZXJfQWRhcHRlcicpKXsKICAgICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfU2VuZGVyX0FkYXB0ZXInKTsgJG9bJ2ZpbGUnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyLT5nZXRGaWxlTmFtZSgpKTsKICAgIGZvcmVhY2goJHItPmdldE1ldGhvZHMoKSBhcyAkbSl7ICRwPWFycmF5KCk7IGZvcmVhY2goJG0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApeyRwW109KCRwcC0+aXNPcHRpb25hbCgpPyc/JzonJykuJyQnLiRwcC0+Z2V0TmFtZSgpO30gJG9bJ21ldCddW109KCRtLT5pc1N0YXRpYygpPydzICc6JycpLigkbS0+aXNQcml2YXRlKCk/Jy0gJzooJG0tPmlzUHJvdGVjdGVkKCk/JyMgJzonKyAnKSkuJG0tPmdldE5hbWUoKS4nKCcuaW1wbG9kZSgnLCcsJHApLicpJzsgfQogICAgJHNyYz1maWxlKCRyLT5nZXRGaWxlTmFtZSgpKTsgZm9yZWFjaCgkc3JjIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9hcGlcLnNlbmRlcnx3cF9yZW1vdGVfKGdldHxwb3N0fHJlcXVlc3QpfEJlYXJlcnxiYXNlX3VybHxcL3YyLycsJGwpKSAkb1snc3JjJ11bXT0oJGkrMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE4MCkpOyB9CiAgICAkdG9rPVBldHNob3BfU2VuZGVyX0FkYXB0ZXI6OmdldF9zdG9yZWRfdG9rZW4oJ21hcmtldGluZycpOyAkb1sndG9rX2xlbiddPXN0cmxlbigkdG9rKTsKICAgICRoPWFycmF5KCdBdXRob3JpemF0aW9uJz0+J0JlYXJlciAnLiR0b2ssJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJywnQ29udGVudC1UeXBlJz0+J2FwcGxpY2F0aW9uL2pzb24nKTsKICAgIGZvcmVhY2goYXJyYXkoJ2ZpZWxkcyc9PidodHRwczovL2FwaS5zZW5kZXIubmV0L3YyL2ZpZWxkcz9saW1pdD0xMDAnLCdncm91cHMnPT4naHR0cHM6Ly9hcGkuc2VuZGVyLm5ldC92Mi9ncm91cHM/bGltaXQ9MTAwJywnc3ViJz0+J2h0dHBzOi8vYXBpLnNlbmRlci5uZXQvdjIvc3Vic2NyaWJlcnMvdGVycmFAZ3l2dW5haS5sdCcpIGFzICRrPT4kdSl7CiAgICAgICRycz13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCdoZWFkZXJzJz0+JGgsJ3RpbWVvdXQnPT4yMCkpOyBpZihpc193cF9lcnJvcigkcnMpKXskb1ska109JHJzLT5nZXRfZXJyb3JfbWVzc2FnZSgpO2NvbnRpbnVlO30KICAgICAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJzKSx0cnVlKTsgJG9bJGsuJ19zdCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRycyk7CiAgICAgIGlmKCRrPT0nZmllbGRzJyl7ICRvWyRrXT1hcnJheSgpOyBmb3JlYWNoKChhcnJheSkoJGpbJ2RhdGEnXT8/YXJyYXkoKSkgYXMgJGYpeyAkb1ska11bXT1hcnJheV9pbnRlcnNlY3Rfa2V5KCRmLGFycmF5X2ZsaXAoYXJyYXkoJ2lkJywndGl0bGUnLCd0YWcnLCd0eXBlJykpKTsgfSB9CiAgICAgIGVsc2VpZigkaz09J2dyb3VwcycpeyAkb1ska109YXJyYXkoKTsgZm9yZWFjaCgoYXJyYXkpKCRqWydkYXRhJ10/P2FycmF5KCkpIGFzICRnKXsgJG9bJGtdW109KCRnWydpZCddPz8nJykuJyAnLigkZ1sndGl0bGUnXT8/JycpLicgKCcuKCRnWydhY3RpdmVfc3Vic2NyaWJlcnMnXT8/JGdbJ3N1YnNjcmliZXJzX2NvdW50J10/Pyc/JykuJyknOyB9IH0KICAgICAgZWxzZSB7ICRvWyRrXT0kajsgfQogICAgfQogIH0gZWxzZSAkb1snYWRhcHRlciddPSduZXJhJzsKICAkdD1QZXRzaG9wX1JlbGF1bmNoOjp0KCk7CiAgJHJvdz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHNlZ21lbnRhcyxwcm9kdWN0X2lkLHJ1c2lzLHN2b3JpYWksZHVvbWVueXMsaGVyb19yZWFzb24sY29uc2VudCBGUk9NICR0IFdIRVJFIHNlZ21lbnRhcz0nY2FsYycgQU5EIGR1b21lbnlzIElTIE5PVCBOVUxMIEFORCBlbWFpbDw+J3RlcnJhQGd5dnVuYWkubHQnIE9SREVSIEJZIGNvbnNlbnQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICBpZigkcm93KXsgJHJvd1snZHVvbWVueXMnXT1qc29uX2RlY29kZSgkcm93WydkdW9tZW55cyddLHRydWUpOyB9ICRvWydjYWxjX3B2eiddPSRyb3c7CiAgJG9bJ3RlcnJhJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjaWQsc2VnbWVudGFzLHByb2R1Y3RfaWQscnVzaXMsc3ZvcmlhaSxoZXJvX3JlYXNvbixkdW9tZW55cyBJUyBOT1QgTlVMTCBBUyBkIEZST00gJHQgV0hFUkUgZW1haWw9JXMiLCd0ZXJyYUBneXZ1bmFpLmx0JyksQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-082936';
const GKEY='ps_s1686mx';
const PHASES=["GO"];
const OUT='analize/s1686_mx.json';
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
