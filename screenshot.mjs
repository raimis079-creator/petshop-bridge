process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY2ZCDigJQgVkYgaW1wb3J0YXM6IGFwcmHFoXltYXMgYmUg4oCea2FuYXDEl3PigJwgKEQgcGF0aWtyYSAvIFcgcmHFoXl0aSAvIDkgYXRzdGF0eXRpKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4NjYnXSk/JF9HRVRbJ3BzX3MxODY2J106JycpOyBpZigkZj09PScnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkZm49V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXZmLWltcG9ydC5waHAnOyAkYmFrPSRmbi4nLmJha19zMTg2Nic7ICRvPWFycmF5KCd2Jz0+J1MxODY2ZC0nLiRmKTsKICAkYz1maWxlX2dldF9jb250ZW50cygkZm4pOyAkb1snbWQ1X2J1dm8nXT1tZDUoJGMpOwogICRvbGQ9Ilx0XHRcdHdwX3VwZGF0ZV9wb3N0KCBbICdJRCcgPT4gXCRwb3N0X2lkLCAncG9zdF9jb250ZW50JyA9PiBcJGRlY29kZWQgXSApOyI7CiAgJG5ldz0iXHRcdFx0XCRkZWNvZGVkID0gcGV0c2hvcF94bWxfYmVfa2FuYXBpdSggXCRkZWNvZGVkICk7IC8vIFMxODY2IChSYWltaXMgMjAyNi0xMS0xMyk6IGFwcmHFoXltZSBiZSDFvm9kxb5pbyDigJ5rYW5hcMSXc+KAnFxuIi4kb2xkOwogICRmdW5jPSJcblxuLyoqXG4gKiBTMTg2NiAoUmFpbWlzIDIwMjYtMTEtMTMpOiBpxaEgVkYgYXByYcWheW1vIHBhxaFhbGludGkgxb5vZMSvIOKAnmthbmFwxJdz4oCcIChrYW5hcMSXL2thbmFwxJdzL2thbmFwacWzKSBrYXJ0dSBzdSBzxIVyYcWhbyBuYXJpdS5cbiAqL1xuaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cyggJ3BldHNob3BfeG1sX2JlX2thbmFwaXUnICkgKSB7XG5cdGZ1bmN0aW9uIHBldHNob3BfeG1sX2JlX2thbmFwaXUoIHN0cmluZyBcJHQgKTogc3RyaW5nIHtcblx0XHRpZiAoIFwkdCA9PT0gJycgfHwgc3RyaXBvcyggXCR0LCAna2FuYXAnICkgPT09IGZhbHNlICkgeyByZXR1cm4gXCR0OyB9XG5cdFx0XCRyID0gYXJyYXkoXG5cdFx0XHQnLyhzdWTEl3R5amVcXHMreXJhXFxzKylrYW5hcFxcdypcXHMqLFxccyovaXUnID0+ICdcJDEnLFxuXHRcdFx0Jy8oPzw9Wyw6OyhdKVxccypbXiw7Oi48PigpXSprYW5hcFteLDsuPD5dKj8oXFwoW14pXSpcXClbXiw7Ljw+XSopPywvaXUnID0+ICcnLFxuXHRcdFx0Jy8sXFxzKlteLDs6Ljw+KCldKmthbmFwW14sOzouPD5dKj8oXFwoW14pXSpcXClbXiw7Oi48Pl0qKT8oPz1cXHMqWy47PCldfFxccypcJCkvaXUnID0+ICcnLFxuXHRcdFx0Jy8oPzw9OilcXHMqW14sOzouPD4oKV0qa2FuYXBbXiw7Oi48Pl0qPyg/PVsuOzxdKS9pdScgPT4gJycsXG5cdFx0XHQnLyg/PD0+KShcXHMqKVteLDs6Ljw+KCldKmthbmFwW14sOy48Pl0qPyhcXChbXildKlxcKVteLDsuPD5dKik/LFxccyovaXUnID0+ICdcJDEnLFxuXHRcdFx0Jy8sXFxzKlteLDs6Ljw+KCldKlxcKFxccyprYW5hcFxcdypcXHMqXFwpKD89XFxzKlsuOzxdKS9pdScgPT4gJycsXG5cdFx0XHQnLyg/PD1cXHMpa2FuYXBcXHcqXFxzKixcXHMqL2l1JyA9PiAnJyxcblx0XHQpO1xuXHRcdGZvcmVhY2ggKCBcJHIgYXMgXCRyZSA9PiBcJHRvICkgeyBcJHggPSBwcmVnX3JlcGxhY2UoIFwkcmUsIFwkdG8sIFwkdCApOyBpZiAoIGlzX3N0cmluZyggXCR4ICkgKSB7IFwkdCA9IFwkeDsgfSB9XG5cdFx0cmV0dXJuIFwkdDtcblx0fVxufVxuIjsKICAkb1sncmFzdGEnXT1zdWJzdHJfY291bnQoJGMsJG9sZCk7ICRvWydqYXUnXT1zdHJwb3MoJGMsJ3BldHNob3BfeG1sX2JlX2thbmFwaXUnKSE9PWZhbHNlOwogIGlmKCRmPT09J1cnICYmICRvWydyYXN0YSddPT09MSAmJiAhJG9bJ2phdSddKXsKICAgICRuPXN0cl9yZXBsYWNlKCRvbGQsJG5ldywkYyk7ICRuPXJ0cmltKCRuKS4iXG4iLiRmdW5jOwogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuLFRPS0VOX1BBUlNFKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydFUlJfbGludCddPSRlLT5nZXRNZXNzYWdlKCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICBpZighZmlsZV9leGlzdHMoJGJhaykpIGNvcHkoJGZuLCRiYWspOyBmaWxlX3B1dF9jb250ZW50cygkZm4sJG4pOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJGZuLHRydWUpOwogICAgJG9bJ21kNV9kYWJhciddPW1kNV9maWxlKCRmbik7IHJlcXVpcmVfb25jZSAkZm47CiAgICAkb1sndGVzdGFzJ109cGV0c2hvcF94bWxfYmVfa2FuYXBpdSgnPHA+PGI+U3VkxJd0aXM6PC9iPiBrYW5hcGnFsyBhbGllanVzIDQgJSwgbWllbMSXcywgc3VkxJd0eWplIHlyYSBrYW5hcGnFsywgYWx5dnVvZ2nFsyBhbGllamF1cywgbWlua8WhdGltYXMgMCwxICUsIGthbmFwxJdzLCBncmFuYXRhaSAwLDAxICUsIHBsdW/FoXRpbsSXIGthbmFwxJcgMSAlLCBtaWVsxJdzLjwvcD4nKTsgfQogIGlmKCRmPT09JzknICYmIGZpbGVfZXhpc3RzKCRiYWspKXsgY29weSgkYmFrLCRmbik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZm4sdHJ1ZSk7ICRvWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkZm4pOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-190154';
const GKEY='ps_s1866';
const PHASES=["D"];
const OUT='analize/s1866_d.json';
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
