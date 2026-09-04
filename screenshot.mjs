process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTQgcnVuIGU4ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiB2YXJpa2xpbyBzdXJpbmtpbW8gbGFwYXMg4oCUIGt1cmlvcyBlaWx1dMSXcyBzcGF1c2RpbmFtb3MgKFBldHNob3BfRGVzayBsYXBhaSAvIGxhcGFzKSwgYGVpbHV0ZXNfc2FsdGluaXNgLCBWZW5pcGFrIGRpc3BhdGNoIHByZWtpxbMvc3ZvcmlvIMWhYWx0aW5pcyAodmlzb3MgZWlsdXTEl3MgYXIgdGlrIEFWKS4gUmFpbWlvIGF0c2FreW11aSA1IChncsSvxb51c2kgdGlla8SXam8gZGFsaXMg4oaSIEFWIHN0YW5kYXJ0aW7ElyBwcm9jZWTFq3JhLCBrYWkgQVYgc2l1bnRhIGphdSBpxaFzacWzc3RhKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZThyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTQgZThyJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHNyYz1mdW5jdGlvbigkY2xzLCRtLCRtYXg9ODApeyB0cnl7ICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRjbHMsJG0pOyAkZj1maWxlKCRyLT5nZXRGaWxlTmFtZSgpKTsgcmV0dXJuIGFycmF5KCdmJz0+YmFzZW5hbWUoJHItPmdldEZpbGVOYW1lKCkpLic6Jy4kci0+Z2V0U3RhcnRMaW5lKCkuJy0nLiRyLT5nZXRFbmRMaW5lKCksJ3NyYyc9PmFycmF5X21hcChmdW5jdGlvbigkbCl7IHJldHVybiBydHJpbShtYl9zdWJzdHIoJGwsMCwyMjApKTsgfSxhcnJheV9zbGljZSgkZiwkci0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oJG1heCwkci0+Z2V0RW5kTGluZSgpLSRyLT5nZXRTdGFydExpbmUoKSsxKSkpKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7IHJldHVybiAnRVJSICcuJGUtPmdldE1lc3NhZ2UoKTsgfSB9OwogIHRyeXsKICAgICRtcz1hcnJheV9tYXAoZnVuY3Rpb24oJG0peyByZXR1cm4gJG0tPmdldE5hbWUoKTsgfSwobmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9EZXNrJykpLT5nZXRNZXRob2RzKCkpOwogICAgJG9bJ2Rlc2tfbGFwX21ldG9kYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRtcyxmdW5jdGlvbigkbil7IHJldHVybiBwcmVnX21hdGNoKCcvbGFwfHN1cmlua3xlaWx1dGVzX3NhbHRpbmlzfGVpbHV0ZXNfa2VsaWFzfHByZWtlc19hdnxhdl9laWx1dGVzL2knLCRuKTsgfSkpOwogICAgZm9yZWFjaCgkb1snZGVza19sYXBfbWV0b2RhaSddIGFzICRtKXsgJG9bJ3NyY18nLiRtXT0kc3JjKCdQZXRzaG9wX0Rlc2snLCRtLDcwKTsgfQogICAgLy8gVmVuaXBhayBkaXNwYXRjaCBzdm9yaXMvcHJla8SXcyDigJQgdmlzb3MgZWlsdXTEl3M/CiAgICAkdnA9V1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcvYWRtaW4vY2xhc3Mtd29vY29tbWVyY2Utc2hvcHVwLXZlbmlwYWstc2hpcHBpbmctYWRtaW4tZGlzcGF0Y2gucGhwJzsgJGxzPWZpbGUoJHZwKTsgJG91dD1hcnJheSgpOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvd2VpZ2h0fGdldF9pdGVtc3xvcmRlcl9wcm9kdWN0c3xwcm9kdWN0c19jb3VudHxfcHNfc291cmNlfF9wc19rZWxpYXMvJywkbCkpeyAkb3V0W109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxODApKTsgfSB9ICRvWyd2cF9kaXNwYXRjaF9ncmVwJ109YXJyYXlfc2xpY2UoJG91dCwwLDQwKTsKICAgIC8vIGFyIHZhcmlrbHlqZSBrdXIgbm9ycyBmaWx0cnVvamFtYSBwYWdhbCBfcHNfc291cmNlIHJhxaFhbnQgbGlwZHVrxIUgLyBzdm9yxK8KICAgICRvWydkZXNrX3N2b3JpcyddPW1ldGhvZF9leGlzdHMoJ1BldHNob3BfRGVzaycsJ3V6c2FreW1vX3N2b3JpcycpPyRzcmMoJ1BldHNob3BfRGVzaycsJ3V6c2FreW1vX3N2b3JpcycsNDApOiduxJdyYSc7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-164850';
const GKEY='ps_e8r';
const PHASES=["R"];
const OUT='analize/s1614_e8r.json';
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
