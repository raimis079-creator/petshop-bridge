process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODk5diBkYXJiYWxhdWtpbyBwYXRpa3JhIHBvIGRpZWdpbW8gKHRpayBhdHZhaXpkdW9qYSwgbmlla28gbmVyYXNvKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4OTl2J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMTApOyAkcj1bJ3YnPT4nUzE4OTl2LTEnXTsKICB0cnl7CiAgICAkYWRtPWdldF91c2VycyhbJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ2ZpZWxkcyc9PidJRCddKTsgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSRhZG1bMF0pOwogICAgaWYoIWZ1bmN0aW9uX2V4aXN0cygnZ2V0X2N1cnJlbnRfc2NyZWVuJykpIHsgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3NjcmVlbi5waHAnOyB9IHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy90ZW1wbGF0ZS5waHAnOwogICAgJHJbJ3ZlcnNpamEnXT1QZXRzaG9wX0RhcmJhbGF1a2lzOjpWRVJTSUpBOyAkclsnZWlsZXMnXT1hcnJheV9rZXlzKFBldHNob3BfRGFyYmFsYXVraXM6OkVJTEVTKTsgJHJbJ2tsYXNlJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1ByZW5fRWlsZScpOyAkclsnc2thaWNpdXMnXT1QZXRzaG9wX1ByZW5fRWlsZTo6c2thaWNpdXMoKTsKICAgIGZvcmVhY2goWydwcmVudW1lcmF0YScsJ25hdWppJywna2xhdXNpbWFpJywnc3VyaW5rdGknXSBhcyAkZSl7ICRfR0VUPVsncGFnZSc9Pidwcy1kZXNrJywnZWlsZSc9PiRlLCdwc19zMTg5OXYnPT4nMSddOyAkdDA9bWljcm90aW1lKHRydWUpOyBvYl9zdGFydCgpOyBQZXRzaG9wX0RhcmJhbGF1a2lzOjpwdXNsYXBpcygpOyAkaD1vYl9nZXRfY2xlYW4oKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy88YSBjbGFzcz0iZGwtZVteIl0qIltePl0qPihbXjxdKykgPHNwYW4gY2xhc3M9InNrW14iXSoiPihbXjxdKik8XC9zcGFuPi91JywkaCwkbSk7ICR0YWJzPVtdOyBmb3JlYWNoKCRtWzFdIGFzICRpPT4kbikgJHRhYnNbXT10cmltKCRuKS4nPScudHJpbSgkbVsyXVskaV0pOwogICAgICAkclsncHNsJ11bJGVdPVsnaWxnaXMnPT5zdHJsZW4oJGgpLCdzJz0+cm91bmQobWljcm90aW1lKHRydWUpLSR0MCwyKSwndGFiYWknPT5pbXBsb2RlKCcgfCAnLCR0YWJzKSwnZmlsdHJhaSc9PnN1YnN0cl9jb3VudCgkaCwnZGwtZi1yb3cnKSwna29ydGVsZXMnPT5zdWJzdHJfY291bnQoJGgsJzEuIFJlaWtpYSBzcHJlbmRpbW8nKStzdWJzdHJfY291bnQoJGgsJzIuIFJlaWtpYSB1xb5zYWt5dGknKStzdWJzdHJfY291bnQoJGgsJzMuIEFydMSXamFuxI1pb3MnKSwna2xhaWRhJz0+c3Vic3RyX2NvdW50KCRoLCdQcmVudW1lcmF0xbMgZWlsxJdzIGtsYWlkYScpLCdmYXRhbCc9PnN1YnN0cl9jb3VudCgkaCwnRmF0YWwgZXJyb3InKStzdWJzdHJfY291bnQoJGgsJ1dhcm5pbmc6JyldOwogICAgICBpZigkZT09PSdwcmVudW1lcmF0YScpeyAkcD1zdHJwb3MoJGgsJzEuIFJlaWtpYSBzcHJlbmRpbW8nKTsgJHJbJ3Rla3N0YXMnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsd3Bfc3RyaXBfYWxsX3RhZ3Moc3Vic3RyKCRoLCRwLTQwLDE1MDApKSkpOyB9IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy5iYXNlbmFtZSgkZS0+Z2V0RmlsZSgpKS4nOicuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-093100';
const GKEY='ps_s1899v';
const PHASES=["V"];
const OUT='analize/s1899_v.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
