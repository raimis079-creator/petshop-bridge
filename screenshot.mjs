process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5aSBJbmRleE5vdyAoMSBpanVuZ3RpIC8gMiBwYXRpa3JhIC8gOSBpc2p1bmd0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzM5aSddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3MzlpJ107IEBzZXRfdGltZV9saW1pdCgxMjApOyAkcj1bJ3YnPT4nUzE3MzlpJywnZmF6ZSc9PiRmXTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJG09KGFycmF5KWdldF9vcHRpb24oJ3JhbmtfbWF0aF9tb2R1bGVzJyxbXSk7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTczOV9ybV9tb2R1bGVzX2JhaycpKSBhZGRfb3B0aW9uKCdwc19zMTczOV9ybV9tb2R1bGVzX2JhaycsJG0sJycsJ25vJyk7CiAgICBpZihjbGFzc19leGlzdHMoJ1xSYW5rTWF0aFxIZWxwZXInKSAmJiBtZXRob2RfZXhpc3RzKCdcUmFua01hdGhcSGVscGVyJywndXBkYXRlX21vZHVsZXMnKSl7IFxSYW5rTWF0aFxIZWxwZXI6OnVwZGF0ZV9tb2R1bGVzKFsnaW5zdGFudC1pbmRleGluZyc9PidvbiddKTsgJHJbJ2J1ZGFzJ109J0hlbHBlcjo6dXBkYXRlX21vZHVsZXMnOyB9CiAgICBlbHNlIHsgaWYoIWluX2FycmF5KCdpbnN0YW50LWluZGV4aW5nJywkbSx0cnVlKSl7ICRtW109J2luc3RhbnQtaW5kZXhpbmcnOyB1cGRhdGVfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycsJG0pOyB9ICRyWydidWRhcyddPSdvcHRpb24nOyB9CiAgICAkbz0oYXJyYXkpZ2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtaW5zdGFudC1pbmRleGluZycsW10pOyAkb1snYmluZ19wb3N0X3R5cGVzJ109Wydwb3N0JywncGFnZSddOyBpZihlbXB0eSgkb1snaW5kZXhub3dfYXBpX2tleSddKSkgJG9bJ2luZGV4bm93X2FwaV9rZXknXT1zdHJfcmVwbGFjZSgnLScsJycsd3BfZ2VuZXJhdGVfdXVpZDQoKSk7IHVwZGF0ZV9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLWluc3RhbnQtaW5kZXhpbmcnLCRvKTsKICAgICRyWydtb2R1bGlhaSddPWdldF9vcHRpb24oJ3JhbmtfbWF0aF9tb2R1bGVzJyk7CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRyWydtb2R1bGlhaSddPWdldF9vcHRpb24oJ3JhbmtfbWF0aF9tb2R1bGVzJyk7ICRvPWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLWluc3RhbnQtaW5kZXhpbmcnKTsgJGs9JG9bJ2luZGV4bm93X2FwaV9rZXknXT8/Jyc7ICRyWydwb3N0X3R5cGVzJ109JG9bJ2JpbmdfcG9zdF90eXBlcyddPz9udWxsOyAkclsncmFrdGFzX2lsZ2lzJ109c3RybGVuKCRrKTsKICAgIGZvcmVhY2goWydodHRwczovL3BldHNob3AubHQvJy4kay4nLnR4dCddIGFzICR1KXsgJGM9Y3VybF9pbml0KCR1KTsgY3VybF9zZXRvcHRfYXJyYXkoJGMsW0NVUkxPUFRfUkVUVVJOVFJBTlNGRVI9PjEsQ1VSTE9QVF9USU1FT1VUPT4yMCxDVVJMT1BUX1VTRVJBR0VOVD0+J3BzLWluZGV4bm93LWNoZWNrJ10pOyAkYj1jdXJsX2V4ZWMoJGMpOyAkclsncmFrdG9fZmFpbGFzJ109Y3VybF9nZXRpbmZvKCRjLENVUkxJTkZPX0hUVFBfQ09ERSkuJyAnLih0cmltKChzdHJpbmcpJGIpPT09JGs/J3R1cmlueXM9cmFrdGFzIE9LJzondHVyaW55cyBORTogJy5zdWJzdHIoKHN0cmluZykkYiwwLDYwKSk7IGN1cmxfY2xvc2UoJGMpOyB9CiAgICAkYz1jdXJsX2luaXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC8nKTsgY3VybF9zZXRvcHRfYXJyYXkoJGMsW0NVUkxPUFRfUkVUVVJOVFJBTlNGRVI9PjEsQ1VSTE9QVF9USU1FT1VUPT4yMF0pOyBjdXJsX2V4ZWMoJGMpOyAkclsnaGVhcnRiZWF0J109Y3VybF9nZXRpbmZvKCRjLENVUkxJTkZPX0hUVFBfQ09ERSk7IGN1cmxfY2xvc2UoJGMpOwogIH0KICBpZigkZj09PSc5Jyl7ICRiPWdldF9vcHRpb24oJ3BzX3MxNzM5X3JtX21vZHVsZXNfYmFrJyk7IGlmKCRiIT09ZmFsc2UpeyB1cGRhdGVfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycsJGIpOyAkclsnYXRzdGF0eXRhJ109JGI7IH0gfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-170417';
const GKEY='ps_s1739i';
const PHASES=["1", "2"];
const OUT='analize/s1739_i.json';
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
