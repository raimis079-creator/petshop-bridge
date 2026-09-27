process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI4bWogcmVhZC1vbmx5OiBwcmVrxJdzIHB1c2xhcGlvIHN0cnVrdMWrcmEgKGhvb2snYWksIEhUTUwgZWlsxJcpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyOG1qJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyOG1qJ107IEBzZXRfdGltZV9saW1pdCgxMjApOwogIHRyeXsKICAgIGdsb2JhbCAkd3BfZmlsdGVyOwogICAgZm9yZWFjaChbJ3dvb2NvbW1lcmNlX3NpbmdsZV9wcm9kdWN0X3N1bW1hcnknLCd3b29jb21tZXJjZV9iZWZvcmVfYWRkX3RvX2NhcnRfZm9ybScsJ3dvb2NvbW1lcmNlX2JlZm9yZV9hZGRfdG9fY2FydF9idXR0b24nLCd3b29jb21tZXJjZV9hZnRlcl9hZGRfdG9fY2FydF9xdWFudGl0eScsJ3dvb2NvbW1lcmNlX2FmdGVyX2FkZF90b19jYXJ0X2J1dHRvbicsJ3dvb2NvbW1lcmNlX2FmdGVyX2FkZF90b19jYXJ0X2Zvcm0nLCd3b29jb21tZXJjZV9hZnRlcl9zaW5nbGVfcHJvZHVjdF9zdW1tYXJ5Jywnd29vY29tbWVyY2VfcHJvZHVjdF9tZXRhX2VuZCcsJ2ZsYXRzb21lX3Byb2R1Y3RfYm94X2FmdGVyJywnd3BfZm9vdGVyJ10gYXMgJGgpeyAkbz1bXTsgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGY9JGNiWydmdW5jdGlvbiddOyAkbj1pc19hcnJheSgkZik/KGlzX29iamVjdCgkZlswXSk/Z2V0X2NsYXNzKCRmWzBdKTokZlswXSkuJzo6Jy4kZlsxXTooaXNfc3RyaW5nKCRmKT8kZjonY2xvc3VyZScpOyBpZigkbj09PSdjbG9zdXJlJyl7IHRyeXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGYpOyAkbj0nY2xvc3VyZUAnLmJhc2VuYW1lKCRyZi0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyZi0+Z2V0U3RhcnRMaW5lKCk7IH1jYXRjaChUaHJvd2FibGUgJGUpe30gfSAkb1tdPSRwci4nOicuJG47IH0gJHJbJ2hvb2tzJ11bJGhdPSRvOyB9CiAgICAkdT1hZGRfcXVlcnlfYXJnKCdwc19oYicsdGltZSgpLGdldF9wZXJtYWxpbmsoMTc5NzgpKTsgJHg9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2Nvb2tpZXMnPT5bJ3BzX2pzJz0+JzEnXSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCAoaVBob25lOyBDUFUgaVBob25lIE9TIDE3XzAgbGlrZSBNYWMgT1MgWCkgQXBwbGVXZWJLaXQvNjA1LjEuMTUgTW9iaWxlLzE1RTE0OCddKTsKICAgICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KTsgJHJbJ2lsZ2lzJ109c3RybGVuKCRiKTsKICAgIC8vIMW+eW1pxbMgZWlsxJcgSFRNTCdlCiAgICAkbWFya3M9Wyc8Zm9ybSBjbGFzcz0iY2FydCInLCdzaW5nbGVfYWRkX3RvX2NhcnRfYnV0dG9uJywnPC9mb3JtPicsJ3BzLWNhbGMnLCdwZXRzaG9wLWZidCInLCdwcy1wcmltaW5rJywncHMtcHJpc3RhdHltYXMnLCdzdGlja3ktYWRkLXRvLWNhcnQnLCdwcm9kdWN0LWZvb3RlcicsJ3dvb2NvbW1lcmNlLXRhYnMnLCdwcy1keWR6aWFpJywncHMtZHlkeicsJ3Byb2R1Y3Qtc2hvcnQtZGVzY3JpcHRpb24nLCdwcmljZS13cmFwcGVyJ107CiAgICBmb3JlYWNoKCRtYXJrcyBhcyAkbSl7ICRwPXN0cnBvcygkYiwkbSk7ICRyWydlaWxlJ11bJG1dPSRwPT09ZmFsc2U/bnVsbDokcDsgfQogICAgYXNvcnQoJHJbJ2VpbGUnXSk7CiAgICAkcz1zdHJwb3MoJGIsJzxmb3JtIGNsYXNzPSJjYXJ0IicpOyAkZT1zdHJwb3MoJGIsJ3BldHNob3AtZmJ0IicpOwogICAgJHJbJ3RhcnBfZm9ybV9pcl9mYnQnXT0kcyE9PWZhbHNlJiYkZSE9PWZhbHNlPyBwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRiLCRzLG1pbig5MDAwLCRlLSRzKzMwMCkpKTonJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-215359';
const GKEY='ps_s1728mj';
const PHASES=["1"];
const OUT='analize/s1728_mj.json';
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
