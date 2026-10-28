process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3YiBTZW5kZXIgcGxhbmFzL2xpbWl0YWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3YiddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE4MDdiJ107CiAgJHRvaz1QZXRzaG9wX1NlbmRlcl9BZGFwdGVyOjpnZXRfc3RvcmVkX3Rva2VuKCdtYXJrZXRpbmcnKTsKICAkYXBpPWZ1bmN0aW9uKCRwKSB1c2UoJHRvayl7ICR4PXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLnNlbmRlci5uZXQvdjInLiRwLFsndGltZW91dCc9PjIwLCdoZWFkZXJzJz0+WydBdXRob3JpemF0aW9uJz0+J0JlYXJlciAnLiR0b2ssJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJ11dKTsgaWYoaXNfd3BfZXJyb3IoJHgpKSByZXR1cm4gWzAsJHgtPmdldF9lcnJvcl9tZXNzYWdlKCldOyByZXR1cm4gW3dwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSxtYl9zdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLDAsOTAwKV07IH07CiAgZm9yZWFjaChbJy9hY2NvdW50JywnL21lJywnL3VzZXInLCcvcGxhbicsJy9zdWJzY3JpcHRpb24nLCcvc2V0dGluZ3MnLCcvc3RhdHMnLCcvZG9tYWlucyddIGFzICRwKXsgJHJbJHBdPSRhcGkoJHApOyB9CiAgJGM9JGFwaSgnL2NhbXBhaWducz9saW1pdD01MCcpOyAkZD1qc29uX2RlY29kZSgkY1sxXT8/JycsdHJ1ZSk7ICRyWydrYW1wX24nXT1pc19hcnJheSgkZCk/Y291bnQoJGRbJ2RhdGEnXT8/W10pOm51bGw7CiAgJHg9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuc2VuZGVyLm5ldC92Mi9jYW1wYWlnbnM/bGltaXQ9NTAnLFsndGltZW91dCc9PjIwLCdoZWFkZXJzJz0+WydBdXRob3JpemF0aW9uJz0+J0JlYXJlciAnLiR0b2ssJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJ11dKTsgJGQ9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLHRydWUpOwogICRzdW09WydzZW50X3RvdGFsX3NwYWxpcyc9PjAsJ2thbXBhbmlqb3MnPT5bXV07IGZvcmVhY2goKGFycmF5KSgkZFsnZGF0YSddPz9bXSkgYXMgJGspeyAkc3Q9c3Vic3RyKChzdHJpbmcpKCRrWydzZW50X3RpbWUnXT8/JycpLDAsMTApOyBpZigkc3Q+PScyMDI2LTEwLTAxJykgJHN1bVsnc2VudF90b3RhbF9zcGFsaXMnXSs9KGludCkoJGtbJ3NlbnRfY291bnQnXT8/MCk7ICRzdW1bJ2thbXBhbmlqb3MnXVtdPVska1sndGl0bGUnXT8/JycsJHN0LCRrWydzZW50X2NvdW50J10/P251bGwsJGtbJ3N0YXR1cyddPz8nJ107IH0KICAkclsna2FtcGFuaWpvcyddPSRzdW07CiAgJHM9JGFwaSgnL3N1YnNjcmliZXJzP2xpbWl0PTEnKTsgJGQ9anNvbl9kZWNvZGUoJHNbMV0/PycnLHRydWUpOyAkclsnc3Vic2NyaWJlcnNfdG90YWwnXT0kZFsnbWV0YSddWyd0b3RhbCddPz9udWxsOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-081013';
const GKEY='ps_s1807b';
const PHASES=["1"];
const OUT='analize/s1807_b.json';
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
