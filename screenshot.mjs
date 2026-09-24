process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2ZiBmdW5jdGlvbnMucGhwIGtyZXBzZWxpbyB6aW51dGVzIGZ1bmtjaWphICsgdmVuaXBhayBwaWNrdXAgbWF0bWVueXMgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxNmYnXSkpIHJldHVybjsKICAkcj1bJ3YnPT4nUzE3MTZmJ107CiAgdHJ5ewogICAgJGZuPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbik7ICRyWydtZDUnXT1tZDUoJHMpOyAkclsnZHlkaXMnXT1zdHJsZW4oJHMpOwogICAgJHBvcz1zdHJwb3MoJHMsJ3ByaWtsYXVzbyBuZW1va2FtYXMgcHJpc3RhdHltYXMnKTsgJHN0YXJ0PXN0cnJwb3Moc3Vic3RyKCRzLDAsJHBvcyksIlxuZnVuY3Rpb24gIik7ICRlbmQ9c3RycG9zKCRzLCJcbn0iLCRwb3MpOyAkclsnZm5fc3RhcnRfbGluZSddPXN1YnN0cl9jb3VudChzdWJzdHIoJHMsMCwkc3RhcnQpLCJcbiIpKzI7ICRyWydmbiddPXN1YnN0cigkcywkc3RhcnQsJGVuZC0kc3RhcnQrMik7CiAgICBwcmVnX21hdGNoX2FsbCgiI2FkZF9hY3Rpb25cKFteXG5dKiIucHJlZ19xdW90ZShwcmVnX3JlcGxhY2UoJyNeXHMqZnVuY3Rpb25ccysoXHcrKS4qI3MnLCckMScsdHJpbSgkclsnZm4nXSkpKS4iW15cbl0qIyIsJHMsJG0pOyAkclsnaG9vayddPSRtWzBdOwogICAgJG89Z2V0X29wdGlvbignd29vY29tbWVyY2Vfc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfcGlja3VwX21ldGhvZF8zX3NldHRpbmdzJyk7ICRyWydwaWNrdXBfbWF0bWVueXMnXT1hcnJheV9maWx0ZXIoKGFycmF5KSRvLGZ1bmN0aW9uKCRrKXtyZXR1cm4gcHJlZ19tYXRjaCgnI2xlbmd0aHx3aWR0aHxoZWlnaHR8ZGltZW5zaW9ufHNpemV8dm9sdW1lI2knLCRrKTt9LEFSUkFZX0ZJTFRFUl9VU0VfS0VZKTsKICAgICRyWydwaWNrdXBfcmFrdGFpJ109YXJyYXlfa2V5cygoYXJyYXkpJG8pOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-203122';
const GKEY='ps_s1716f';
const PHASES=["1"];
const OUT='analize/s1716_f1.json';
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
