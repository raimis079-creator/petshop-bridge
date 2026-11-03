process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1diBWRiBrb25zZXJ2xbMgcGFrxbMgZHVvbWVueXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI1diddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyNXYnXTsKICAkY2F0cz1bJ2tvbnNlcnZhaS1zdW5pbXMnLCdrb25zZXJ2YWkta2F0ZW1zJywnYW5pbW9uZGEta29uc2VydmFpLXN1bmltcyddOwogICRpZHM9Z2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4tMSwnZmllbGRzJz0+J2lkcycsJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+JGNhdHNdXSwnbWV0YV9xdWVyeSc9PltbJ2tleSc9PidfcHNfc2FuZGVsaXMnLCd2YWx1ZSc9Pid2ZiddXV0pOwogICRraWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCciKTsgJGtpZHM9YXJyYXlfZmxpcCgka2lkcyk7CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHx8ISRwLT5pc19pbl9zdG9jaygpfHxpc3NldCgka2lkc1skaWRdKXx8Z2V0X3Bvc3RfbWV0YSgkaWQsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpKSBjb250aW51ZTsKICAgICRzdj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNhdmlrYWluYV9jdCwgZGllbmEgRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHByZWtlX2lkPSVkIEFORCBzYXZpa2FpbmFfY3Q+MCBPUkRFUiBCWSBkaWVuYSBERVNDIExJTUlUIDEiLCRpZCksQVJSQVlfQSk7CiAgICAkczkwPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT0FMRVNDRShTVU0oa2lla2lzKSwwKSBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgcHJla2VfaWQ9JWQgQU5EIGRpZW5hPj1EQVRFX1NVQihDVVJEQVRFKCksSU5URVJWQUwgOTAgREFZKSBBTkQgQ09BTEVTQ0UodGVzdGluaXMsMCk9MCIsJGlkKSk7CiAgICAkZmFtPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKTsgJGZtPVtdOyBpZigkZmFtKXsgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHMucG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBzIEpPSU4geyRQfXBvc3RzIHEgT04gcS5JRD1zLnBvc3RfaWQgQU5EIHEucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIFdIRVJFIHMubWV0YV9rZXk9J19wc19keWR6aW9fc2VpbWEnIEFORCBzLm1ldGFfdmFsdWU9JXMiLCRmYW0pKSBhcyAkbSl7IGlmKChpbnQpJG0hPT0kaWQpICRmbVtdPVsoaW50KSRtLG1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRtKSwwLDUwKV07IH0gfQogICAgJHJbJ28nXVtdPVsnaWQnPT4kaWQsJ24nPT4kcC0+Z2V0X25hbWUoKSwncmVnJz0+KGZsb2F0KSRwLT5nZXRfcmVndWxhcl9wcmljZSgpLCdzYWxlJz0+KGZsb2F0KSRwLT5nZXRfc2FsZV9wcmljZSgpLCdzdCc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnYyc9PiRzdj9yb3VuZCgkc3ZbJ3NhdmlrYWluYV9jdCddLzEwMCwzKTpudWxsLCdjZCc9PiRzdlsnZGllbmEnXT8/bnVsbCwndmZjJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9jb3N0Jyx0cnVlKSwnczkwJz0+JHM5MCwndyc9PiRwLT5nZXRfd2VpZ2h0KCksJ2ZhbSc9PiRmYW0sJ2ZtJz0+JGZtLCdjYXQnPT5pbXBsb2RlKCcsJyx3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKSldOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-115542';
const GKEY='ps_s1825v';
const PHASES=["1"];
const OUT='analize/s1825_v.json';
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
