process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkzYSBrb2RlbCBkaW5nc3RhIHNhc2thaXR1IFBERiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3OTNhJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc5M2EnXTsKICB0cnl7CiAgICAkZD1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2Nkbi9pbnZvaWNlLyc7ICRmcz1nbG9iKCRkLicqLnBkZicpOyAkbT1bXTsgZm9yZWFjaCgkZnMgYXMgJGYpICRtW2Jhc2VuYW1lKCRmKV09ZmlsZW10aW1lKCRmKTsgYXNvcnQoJG0pOwogICAgJHJbJ2ZhaWx1J109Y291bnQoJG0pOyAkclsnc2VuaWF1c2knXT1hcnJheV9tYXAoZm4oJHQpPT5kYXRlKCdZLW0tZCBIOmknLCR0KSxhcnJheV9zbGljZSgkbSwwLDUsdHJ1ZSkpOyAkclsnbmF1amF1c2knXT1hcnJheV9tYXAoZm4oJHQpPT5kYXRlKCdZLW0tZCBIOmknLCR0KSxhcnJheV9zbGljZSgkbSwtMywzLHRydWUpKTsKICAgICRwZXI9W107IGZvcmVhY2goJG0gYXMgJHQpeyAkaz1kYXRlKCdtLWQnLCR0KTsgJHBlclska109KCRwZXJbJGtdPz8wKSsxOyB9ICRyWydwYWdhbF9kaWVuYSddPSRwZXI7CiAgICAkclsna2l0aV93Y2RuJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2Nkbi8qJykpOwogICAgLy8ga2FzIHRyaW5hOiBncmVwIHBsdWdpbnVvc2UgaXIgdGVtb2plCiAgICAkaD1bXTsgJGRpcnM9W1dQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS1kZWxpdmVyeS1ub3RlcycsZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCksV1BNVV9QTFVHSU5fRElSLFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnLFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbCddOwogICAgZm9yZWFjaCgkZGlycyBhcyAkZGQpeyBpZighaXNfZGlyKCRkZCkpIGNvbnRpbnVlOyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyBmb3JlYWNoKGZpbGUoJGYpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy8odW5saW5rfHdwX2RlbGV0ZV9maWxlfHJtZGlyfGFycmF5X21hcFwoXHMqLnVubGluaykvJywkbCkgJiYgcHJlZ19tYXRjaCgnL3BkZnx3Y2RufGludm9pY2V8dXBsb2FkfHRtcHxjYWNoZXxnbG9iL2knLCRsKSkgJGhbXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLChzdHJpbmcpJGYpLic6Jy4oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjAwKSk7IH0gfSB9CiAgICAkclsndHJ5bmltYWknXT1hcnJheV9zbGljZSgkaCwwLDQwKTsKICAgICRjcj1fZ2V0X2Nyb25fYXJyYXkoKTsgJGM9W107IGZvcmVhY2goJGNyIGFzICR0cz0+JGhvb2tzKXsgZm9yZWFjaCgkaG9va3MgYXMgJGhrPT4kZXYpeyBpZihwcmVnX21hdGNoKCcvd2NkbnxpbnZvaWNlfGNsZWFufHZhbHltfGRlbGV0ZXxwZGZ8dG1wL2knLCRoaykpICRjW109JGhrLicgQCAnLndwX2RhdGUoJ20tZCBIOmknLCR0cyk7IH0gfSAkclsnY3JvbiddPSRjOwogICAgJHJbJ3djZG5fb3BjJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDIwMCkgdiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3djZG4lJyBBTkQgKG9wdGlvbl9uYW1lIExJS0UgJyVjbGVhbiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVkZWxldGUlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclc3RvcmUlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclcGRmJScpIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-173328';
const GKEY='ps_s1793a';
const PHASES=["1"];
const OUT='analize/s1793p_a.json';
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
