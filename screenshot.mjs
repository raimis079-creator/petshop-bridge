process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODUgbXUg4oCUIFRFU1RBUyBzZXJ2ZXJpbyBwdXPEl2plOiBlbmRwb2ludCdvIGxvZ2lrYSAoa3JlcMWhZWxpcyBpxaEgdcW+c2FreW1vIDM1OTQ4IHN1IE1uTSkg4oCUIGtpZWsgcHJla2nFsyBzdWRlZGFtYSwga2xhaWRvczsga3JlcMWhZWxpcyB0aWsgxaFpb3MgdcW+a2xhdXNvcyBzZXNpam9qZS4gKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4NW11J10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2ODUgbXUnKTsgJHVpZD0yNTMwOyAkb2lkPTM1OTQ4OyAkb3JkPXdjX2dldF9vcmRlcigkb2lkKTsKICAkcGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00geyRwfXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSB1c2VyX2lkPSVkIEFORCBsYXN0X29yZGVyX2lkPSVkIExJTUlUIDEiLCR1aWQsJG9pZCkpOyAkZz1QZXRzaG9wX1Bha2FydG90aTo6Z3J1cGUoJHVpZCwkcGlkKTsKICAkb1sncHJla2VzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gKCR4WydyaW5raW55cyddPydbUl0gJzonJykuJHhbJ3BhdiddLicgw5cnLiR4WydraWVraXMnXS4nICcucm91bmQoJHhbJ2thaW5hJ10sMik7fSwkZ1sncHJla2VzJ10pOwogIHdjX2xvYWRfY2FydCgpOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7ICRpdGVtcz0kb3JkLT5nZXRfaXRlbXMoKTsgJHJlcz1hcnJheSgpOwogIGZvcmVhY2goJGdbJ3ByZWtlcyddIGFzICRwcil7ICRpdD0kaXRlbXNbJHByWydpdGVtX2lkJ11dOyAkZGF0YT1hcHBseV9maWx0ZXJzKCd3b29jb21tZXJjZV9vcmRlcl9hZ2Fpbl9jYXJ0X2l0ZW1fZGF0YScsYXJyYXkoKSwkaXQsJG9yZCk7ICRvWydkYXRhX2tleXMnXVtdPWFycmF5X2tleXMoJGRhdGEpOwogICAgdHJ5eyAkaz1XQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgkcHJbJ3BpZCddLCRwclsna2lla2lzJ10sMCxhcnJheSgpLCRkYXRhKTsgJHJlc1tdPSRrPydvayc6J0ZBSUwnOyB9Y2F0Y2goRXhjZXB0aW9uICRlKXsgJHJlc1tdPSdFWEMgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH0KICAkb1snYWRkJ109JHJlczsgJG9bJ25vdGljZXMnXT13Y19nZXRfbm90aWNlcygpOyBXQygpLT5jYXJ0LT5jYWxjdWxhdGVfdG90YWxzKCk7ICRvWydjYXJ0J109YXJyYXkoKTsgZm9yZWFjaChXQygpLT5jYXJ0LT5nZXRfY2FydCgpIGFzICRjaSl7ICRvWydjYXJ0J11bXT0kY2lbJ2RhdGEnXS0+Z2V0X25hbWUoKS4nIMOXJy4kY2lbJ3F1YW50aXR5J10uJyAnLnJvdW5kKCRjaVsnbGluZV90b3RhbCddKyRjaVsnbGluZV90YXgnXSwyKTsgfSAkb1sndG90YWwnXT1XQygpLT5jYXJ0LT5nZXRfdG90YWwoJ2VkaXQnKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-135125';
const GKEY='ps_s1685mu';
const PHASES=["TEST"];
const OUT='analize/s1685_mu.json';
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
