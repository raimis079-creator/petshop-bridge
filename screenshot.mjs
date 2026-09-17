process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIGYg4oCUIERFUExPWSBtdS1wbHVnaW4gcGV0c2hvcC1jbGFyaXR5LnBocCB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg5c2YnXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4nUzE2ODlzIGYnKTsKICAkY29kZT1iYXNlNjRfZGVjb2RlKCdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lFTnNZWEpwZEhrZ2RqRXVNQ0FvVXpFMk9EbHpLUW9nS2lCRVpYTmpjbWx3ZEdsdmJqb2dUV2xqY205emIyWjBJRU5zWVhKcGRIa2dLSEJ5YjJwbGEzUmhjeURpZ0o1UVpYUnphRzl3SWlCdU1qaHRNSEp4ZURnd0tTNGdRbVVnYzNWMGFXdHBiVzhnNG9DVUlHTnZiMnRwWld4bGMzTWdLR052Ym5ObGJuUjJNaUJrWlc1cFpXUXBPd29nS2lBZ0lFTnZiWEJzYVdGdWVpQnpkR0YwYVhOMGFXTnpQV0ZzYkc5M0lPS0draUJoYm1Gc2VYUnBZM05mVTNSdmNtRm5aU0JuY21GdWRHVmtMaUJPWmNTdmEyVnNhV0Z0WVNCd2NtbHphV3AxYm1kMWMybGxiWE1nWkdGeVluVnZkRzlxWVcxekwyRmtiV2x1WVcxekxnb2dLaThLYVdZZ0tDQWhJR1JsWm1sdVpXUW9JQ2RCUWxOUVFWUklKeUFwSUNrZ2V5QmxlR2wwT3lCOUNtRmtaRjloWTNScGIyNG9JQ2QzY0Y5b1pXRmtKeXdnWm5WdVkzUnBiMjRnS0NrZ2V3b0phV1lnS0NCcGMxOWhaRzFwYmlncElIeDhJR04xY25KbGJuUmZkWE5sY2w5allXNG9JQ2RsWkdsMFgzQnZjM1J6SnlBcElIeDhJR04xY25KbGJuUmZkWE5sY2w5allXNG9JQ2R3YzE5a1lYSmlkVzkwYjJwaGN5Y2dLU0FwSUhzZ2NtVjBkWEp1T3lCOUNnay9QZ284YzJOeWFYQjBQZ29vWm5WdVkzUnBiMjRvWXl4c0xHRXNjaXhwTEhRc2VTbDdZMXRoWFQxalcyRmRmSHhtZFc1amRHbHZiaWdwZXloalcyRmRMbkU5WTF0aFhTNXhmSHhiWFNrdWNIVnphQ2hoY21kMWJXVnVkSE1wZlR0MFBXd3VZM0psWVhSbFJXeGxiV1Z1ZENoeUtUdDBMbUZ6ZVc1alBURTdkQzV6Y21NOUltaDBkSEJ6T2k4dmQzZDNMbU5zWVhKcGRIa3ViWE12ZEdGbkx5SXJhVHQ1UFd3dVoyVjBSV3hsYldWdWRITkNlVlJoWjA1aGJXVW9jaWxiTUYwN2VTNXdZWEpsYm5ST2IyUmxMbWx1YzJWeWRFSmxabTl5WlNoMExIa3BPMzBwS0hkcGJtUnZkeXhrYjJOMWJXVnVkQ3dpWTJ4aGNtbDBlU0lzSW5OamNtbHdkQ0lzSW00eU9HMHdjbkY0T0RBaUtUc0tLR1oxYm1OMGFXOXVLQ2w3Wm5WdVkzUnBiMjRnY3lncGUzWmhjaUJuUFM4b1hudzdYSE1xS1dOdGNHeDZYM04wWVhScGMzUnBZM005WVd4c2IzY3ZMblJsYzNRb1pHOWpkVzFsYm5RdVkyOXZhMmxsS1R0M2FXNWtiM2N1WTJ4aGNtbDBlU2duWTI5dWMyVnVkSFl5Snl4N1lXUmZVM1J2Y21GblpUb25aR1Z1YVdWa0p5eGhibUZzZVhScFkzTmZVM1J2Y21GblpUcG5QeWRuY21GdWRHVmtKem9uWkdWdWFXVmtKMzBwTzMwS2N5Z3BPMXNuWTIxd2JIcGZjM1JoZEhWelgyTm9ZVzVuWlNjc0oyTnRjR3g2WDJWdVlXSnNaVjlqWVhSbFoyOXllU2NzSjJOdGNHeDZYM0psZG05clpTZGRMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNG9aU2w3Wkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhsTEdaMWJtTjBhVzl1S0NsN2MyVjBWR2x0Wlc5MWRDaHpMRFV3S1R0OUtUdDlLVHQ5S1NncE93bzhMM05qY21sd2RENEtDVHcvY0dod0NuMHNJRFVnS1RzSycpOyAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNsYXJpdHkucGhwJzsKICB0cnkgeyB0b2tlbl9nZXRfYWxsKCRjb2RlLCBUT0tFTl9QQVJTRSk7ICRvWydwYXJzZSddPSdvayc7IH0gY2F0Y2ggKFxUaHJvd2FibGUgJGUpIHsgJG9bJ3BhcnNlJ109JGUtPmdldE1lc3NhZ2UoKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICBpZiAobWQ1KCRjb2RlKSE9PSc0MjRkMGZmMGI5OTk1MTc5Mjg1NjNmNDAwY2JmOWNkOCcpIHsgJG9bJ21kNSddPSdGQUlMJzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICBpZiAoZmlsZV9leGlzdHMoJGYpKSB7ICRvWydleGlzdHMnXT10cnVlOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICRvWyd3cml0ZSddPWZpbGVfcHV0X2NvbnRlbnRzKCRmLCRjb2RlKTsgJG9bJ21kNV9kaXNrJ109bWQ1X2ZpbGUoJGYpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const VER='dep-074151';
const GKEY='ps_s1689sf';
const PHASES=["GO"];
const OUT='analize/s1689s_f.json';
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
