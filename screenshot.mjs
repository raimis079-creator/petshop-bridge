process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIG1jIG5vb3AgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7IGlmKGlzc2V0KCRfR0VUWydwc19zMTY3MW0nXSkpeyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxNjcxbWMnLCdvayc9PjEpKTsgZXhpdDsgfSB9KTsK';
const VER='dep-162331';
const GKEY='ps_s1671m';
const PHASES=["M"];
const OUT='analize/s1671_mc4.json';
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

  // S1671 MERCHANT API: data source lt
  if(process.env.GTM_SA_JSON){ try{
    let raw=process.env.GTM_SA_JSON.trim(); out.mc_raw={len:raw.length,head:raw.slice(0,12)}; if(!raw.startsWith('{')){ raw='{'+raw+'}'; } const sa=JSON.parse(raw); const crypto=await import('crypto');
    const now=Math.floor(Date.now()/1000); const b=s=>Buffer.from(JSON.stringify(s)).toString('base64url');
    const hdr=b({alg:'RS256',typ:'JWT'}); const clm=b({iss:sa.client_email,scope:'https://www.googleapis.com/auth/content',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+clm).sign(sa.private_key,'base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+hdr+'.'+clm+'.'+sig});
    const tj=await tr.json(); out.mc={sa:sa.client_email,token:tr.status};
    if(tj.access_token){ const H={Authorization:'Bearer '+tj.access_token,'Content-Type':'application/json'}; const base='https://merchantapi.googleapis.com/datasources/v1beta/accounts/5321054797/dataSources';
      const l=await fetch(base,{headers:H}); const lt=await l.text(); let lj={}; try{ lj=JSON.parse(lt); }catch(e){ out.mc.list_raw={status:l.status,body:lt.slice(0,300)}; } out.mc.list={status:l.status,items:(lj.dataSources||[]).map(d=>({name:d.name,dn:d.displayName,lang:d.primaryProductDataSource&&d.primaryProductDataSource.contentLanguage,label:d.primaryProductDataSource&&d.primaryProductDataSource.feedLabel,countries:d.primaryProductDataSource&&d.primaryProductDataSource.countries,uri:d.fileInput&&d.fileInput.fetchSettings&&d.fileInput.fetchSettings.fetchUri}))};
      if(lj.error) out.mc.list_err=JSON.stringify(lj.error).slice(0,400);
      const yra=(lj.dataSources||[]).find(d=>d.primaryProductDataSource&&d.primaryProductDataSource.contentLanguage==='lt');
      if(!yra && process.env.MC_CREATE==='1'){
        const body={displayName:'petshop.lt Google feed LT',primaryProductDataSource:{contentLanguage:'lt',feedLabel:'PETSHOP_LT',countries:['LT'],channel:'ONLINE_PRODUCTS'},fileInput:{fetchSettings:{enabled:true,timeOfDay:{hours:3},timeZone:'Europe/Vilnius',frequency:'FREQUENCY_DAILY',fetchUri:'https://petshop.lt/feed/google/'}}};
        const c=await fetch(base,{method:'POST',headers:H,body:JSON.stringify(body)}); const cj=await c.json(); out.mc.create={status:c.status,name:cj.name,err:cj.error?JSON.stringify(cj.error).slice(0,500):null};
        if(cj.name){ const f=await fetch('https://merchantapi.googleapis.com/datasources/v1beta/'+cj.name+':fetch',{method:'POST',headers:H,body:'{}'}); out.mc.fetch={status:f.status,body:(await f.text()).slice(0,300)}; }
      }
    } else out.mc.token_body=JSON.stringify(tj).slice(0,300);
  }catch(e){ out.mc_klaida=String(e).slice(0,400); } }
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
