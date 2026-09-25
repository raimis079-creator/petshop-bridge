process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5cyDigJQgV1BBSSBpbXBvcnTFsyDigJ5Ta2lwIHJlY29yZHMgdGhhdCBoYXZlbid0IGNoYW5nZWQiIChpc19zZWxlY3RpdmVfaGFzaGluZyk6IDEgc2F1c2FzLCAyIMSvanVuZ3RpICMzICgrIzIgamVpIDApLCA5IGF0c3RhdHl0aSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTlzJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTcxOXMnXTsgJHI9Wyd2Jz0+J1MxNzE5cycsJ2ZhemUnPT4kZl07IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLHByb2Nlc3NpbmcsZXhlY3V0aW5nLHRyaWdnZXJlZCxxdWV1ZV9jaHVua19udW1iZXIsbGFzdF9hY3Rpdml0eSxvcHRpb25zIEZST00geyRwfXBteGlfaW1wb3J0cyBXSEVSRSBpZCBJTiAoMiwzLDcpIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJHJvdyl7ICRvPUB1bnNlcmlhbGl6ZSgkcm93WydvcHRpb25zJ10pOyAkclsnZGFiYXInXVskcm93WydpZCddXT1bJ25hbWUnPT4kcm93WyduYW1lJ10sJ3Byb2Nlc3NpbmcnPT4kcm93Wydwcm9jZXNzaW5nJ10sJ2V4ZWN1dGluZyc9PiRyb3dbJ2V4ZWN1dGluZyddLCd0cmlnZ2VyZWQnPT4kcm93Wyd0cmlnZ2VyZWQnXSwnY2h1bmsnPT4kcm93WydxdWV1ZV9jaHVua19udW1iZXInXSwnbGFzdCc9PiRyb3dbJ2xhc3RfYWN0aXZpdHknXSwnaXNfc2VsZWN0aXZlX2hhc2hpbmcnPT5pc19hcnJheSgkbyk/KCRvWydpc19zZWxlY3RpdmVfaGFzaGluZyddPz8nKG7El3JhKScpOid1bnNlcmlhbGl6ZSBrbGFpZGEnLCdyZWNvcmRzX3Blcl9yZXF1ZXN0Jz0+aXNfYXJyYXkoJG8pPygkb1sncmVjb3Jkc19wZXJfcmVxdWVzdCddPz9udWxsKTpudWxsXTsgfQogICAgJHJbJ2hhc2hfdGJsJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wbXhpX2hhc2giKTsKICAgIGlmKCRmPT09JzInKXsgJGJhaz1nZXRfb3B0aW9uKCdwc19zMTcxOV93cGFpX2JhaycsW10pOyBmb3JlYWNoKCRyb3dzIGFzICRyb3cpeyAkaWQ9KGludCkkcm93WydpZCddOyBpZighaW5fYXJyYXkoJGlkLFsyLDNdKSkgY29udGludWU7IGlmKCRyb3dbJ3Byb2Nlc3NpbmcnXXx8JHJvd1snZXhlY3V0aW5nJ10peyAkclsncHJhbGVpc3RhJ11bJGlkXT0ndnlrZG9tYXMgZGFiYXInOyBjb250aW51ZTsgfSAkbz1AdW5zZXJpYWxpemUoJHJvd1snb3B0aW9ucyddKTsgaWYoIWlzX2FycmF5KCRvKSl7ICRyWydwcmFsZWlzdGEnXVskaWRdPSd1bnNlcmlhbGl6ZSc7IGNvbnRpbnVlOyB9IGlmKChzdHJpbmcpKCRvWydpc19zZWxlY3RpdmVfaGFzaGluZyddPz8nMCcpPT09JzEnKXsgJHJbJ3ByYWxlaXN0YSddWyRpZF09J2phdSAxJzsgY29udGludWU7IH0gJGJha1skaWRdPSRyb3dbJ29wdGlvbnMnXTsgJG9bJ2lzX3NlbGVjdGl2ZV9oYXNoaW5nJ109JzEnOyAkd3BkYi0+dXBkYXRlKCJ7JHB9cG14aV9pbXBvcnRzIixbJ29wdGlvbnMnPT5zZXJpYWxpemUoJG8pXSxbJ2lkJz0+JGlkXSk7ICRjaGs9QHVuc2VyaWFsaXplKCR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgb3B0aW9ucyBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9JWQiLCRpZCkpKTsgJHJbJ2lqdW5ndGEnXVskaWRdPSRjaGtbJ2lzX3NlbGVjdGl2ZV9oYXNoaW5nJ10/P251bGw7IH0gdXBkYXRlX29wdGlvbigncHNfczE3MTlfd3BhaV9iYWsnLCRiYWssZmFsc2UpOyB9CiAgICBpZigkZj09PSc5Jyl7ICRiYWs9Z2V0X29wdGlvbigncHNfczE3MTlfd3BhaV9iYWsnLFtdKTsgZm9yZWFjaCgkYmFrIGFzICRpZD0+JG9wdCl7ICR3cGRiLT51cGRhdGUoInskcH1wbXhpX2ltcG9ydHMiLFsnb3B0aW9ucyc9PiRvcHRdLFsnaWQnPT4oaW50KSRpZF0pOyAkclsnYXRzdGF0eXRhJ11bXT0kaWQ7IH0gfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-170742';
const GKEY='ps_s1719s';
const PHASES=["1", "2"];
const OUT='analize/s1719_s2.json';
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
