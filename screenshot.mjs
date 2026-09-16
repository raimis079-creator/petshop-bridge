process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODkgdyDigJQgIzE4NTUxIElOUFMwNiBha3R5dmF2aW1hczogcHVibGlzaCwga2FpbmEgNjEuNTksIFZGIG1ldGEsIGluc3RvY2sgYmUgbGlrdWNpbyB2YWxkeW1vLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4OXcnXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4nUzE2ODkgdycpOyAkaWQ9MTg1NTE7CiAgJGtleXM9YXJyYXkoJ19yZWd1bGFyX3ByaWNlJywnX3ByaWNlJywnX3NhbGVfcHJpY2UnLCdfc3RvY2snLCdfc3RvY2tfc3RhdHVzJywnX21hbmFnZV9zdG9jaycsJ19iYWNrb3JkZXJzJywnX3ZmX2Nvc3QnLCdfdmZfY29zdF94bWwnLCdfdmZfcGVyc29uYWxfY29zdCcsJ192Zl9wZXJzb25hbF94bWwnLCdfdmZfc3VwcGxpZXJfZGlzY291bnQnLCdfdmZfc3VwcGxpZXJfc2t1JywnX3ZmX2JhcmNvZGUnLCdfdmZfYnJhbmRfcmF3JywnX3ZmX2JyYW5kX25vcm1hbGl6ZWQnLCdfdmZfcHJpY2VfcnVsZV91c2VkJywnX2VhbicsJ19nbG9iYWxfdW5pcXVlX2lkJywnX3BzX3NhbmRlbGlzJyk7CiAgJGJhaz1hcnJheSgnc3RhdHVzJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRpZCkpOyBmb3JlYWNoKCRrZXlzIGFzICRrKSAkYmFrWyRrXT1nZXRfcG9zdF9tZXRhKCRpZCwkayx0cnVlKTsKICB1cGRhdGVfb3B0aW9uKCdwc19zMTY4OV8xODU1MV9iYWsnLCRiYWssZmFsc2UpOyAkb1snYmFrJ109J3BzX3MxNjg5XzE4NTUxX2Jhayc7CiAgJG09YXJyYXkoJ19yZWd1bGFyX3ByaWNlJz0+JzYxLjU5JywnX3ByaWNlJz0+JzYxLjU5JywnX3NhbGVfcHJpY2UnPT4nJywnX3N0b2NrJz0+JzAnLCdfc3RvY2tfc3RhdHVzJz0+J2luc3RvY2snLCdfbWFuYWdlX3N0b2NrJz0+J25vJywnX2JhY2tvcmRlcnMnPT4nbm8nLAogICAgJ192Zl9jb3N0Jz0+JzM3LjY1NScsJ192Zl9jb3N0X3htbCc9Pic0NC4zMCcsJ192Zl9wZXJzb25hbF9jb3N0Jz0+JzM3LjY1NScsJ192Zl9wZXJzb25hbF94bWwnPT4nNDQuMzAnLCdfdmZfc3VwcGxpZXJfZGlzY291bnQnPT4nMC4xNScsCiAgICAnX3ZmX3N1cHBsaWVyX3NrdSc9PidJTlBTMDYnLCdfdmZfYmFyY29kZSc9Pic4MDExMjU5MDAyODUnLCdfdmZfYnJhbmRfcmF3Jz0+J0VYQ0wgVkVURElFVCcsJ192Zl9icmFuZF9ub3JtYWxpemVkJz0+J0V4Y2x1c2lvbiBEaWV0JywKICAgICdfdmZfcHJpY2VfcnVsZV91c2VkJz0+J0JSQU5EOkV4Y2x1c2lvbiBEaWV0ICtESVNDOjE1JSAobWFudWFsIFMxNjg5KScsJ19lYW4nPT4nODAxMTI1OTAwMjg1JywnX2dsb2JhbF91bmlxdWVfaWQnPT4nODAxMTI1OTAwMjg1JywnX3BzX3NhbmRlbGlzJz0+J3ZmJyk7CiAgZm9yZWFjaCgkbSBhcyAkaz0+JHYpIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCRrLCR2KTsKICB3cF9zZXRfb2JqZWN0X3Rlcm1zKCRpZCwnRXhjbHVzaW9uIERpZXQnLCdwcm9kdWN0X2JyYW5kJyk7CiAgJHI9d3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJyksdHJ1ZSk7ICRvWydwdWJsaXNoJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOiRyOwogIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NvdXJjZXMnKSAmJiBtZXRob2RfZXhpc3RzKCdQZXRzaG9wX1NvdXJjZXMnLCdzaW5jaHJvbml6dW90aScpKSB7IHRyeXsgUGV0c2hvcF9Tb3VyY2VzOjpzaW5jaHJvbml6dW90aSgkaWQpOyAkb1snc291cmNlcyddPSdvayc7IH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJG9bJ3NvdXJjZXMnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9IH0KICAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOwogICRvWydwbyddPWFycmF5KCdzdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoJGlkKSwncHJpY2UnPT4kcC0+Z2V0X3ByaWNlKCksJ2luc3RvY2snPT4kcC0+aXNfaW5fc3RvY2soKSwncHVyY2hhc2FibGUnPT4kcC0+aXNfcHVyY2hhc2FibGUoKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkaWQpLCdicmFuZCc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-171758';
const GKEY='ps_s1689w';
const PHASES=["GO"];
const OUT='analize/s1689_w.json';
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
