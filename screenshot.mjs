process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQwdi1jIERyYWtvbmFwZSAjMjYwNTAgaXNpbXRpIGlzIHByZWt5Ym9zICgxIGRyeSwgMiBhcHBseSwgMyBwYXRpa3JhLCA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQwdmMnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE4NDB2YyddOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDB2YycsJ2ZhemUnPT4kZl07ICRQSUQ9MjYwNTA7ICR0ej1uZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpOwogICRzdGF0ZT1mdW5jdGlvbigpIHVzZSAoJFBJRCwkd3BkYiwkUCl7ICRwPWdldF9wb3N0KCRQSUQpOyByZXR1cm4gWydzdGF0dXMnPT4kcD8kcC0+cG9zdF9zdGF0dXM6bnVsbCwnbW9kaWZpZWQnPT4kcD8kcC0+cG9zdF9tb2RpZmllZDpudWxsLCd0aXRsZSc9PiRwPyRwLT5wb3N0X3RpdGxlOm51bGwsJ3JhbmthJz0+Z2V0X3Bvc3RfbWV0YSgkUElELCdfcHNfcmFua2FfaXNpbXRhJyx0cnVlKSwnc3RvY2tfc3RhdHVzJz0+Z2V0X3Bvc3RfbWV0YSgkUElELCdfc3RvY2tfc3RhdHVzJyx0cnVlKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRQSUQsJ19zdG9jaycsdHJ1ZSksJ3Zpcyc9PndwX2dldF9vYmplY3RfdGVybXMoJFBJRCwncHJvZHVjdF92aXNpYmlsaXR5JyxbJ2ZpZWxkcyc9PiduYW1lcyddKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkUElEKV07IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsgJHJbJ2RhYmFyJ109JHN0YXRlKCk7ICRyWydiYWtfeXJhJ109Z2V0X29wdGlvbigncHNfczE4NDB2XzI2MDUwX2JhaycpPzE6MDsgfQogIGlmKCRmPT09JzInKXsKICAgICRiZWZvcmU9JHN0YXRlKCk7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTg0MHZfMjYwNTBfYmFrJykpIGFkZF9vcHRpb24oJ3BzX3MxODQwdl8yNjA1MF9iYWsnLFsnbGFpa2FzJz0+KG5ldyBEYXRlVGltZSgnbm93JywkdHopKS0+Zm9ybWF0KCdZLW0tZCBIOmk6cycpLCdzdGF0ZSc9PiRiZWZvcmVdLCcnLCdubycpOyAkclsncHJpZXMnXT0kYmVmb3JlOwogICAgaWYoJGJlZm9yZVsnc3RhdHVzJ10hPT0nZHJhZnQnKXsgJHJlcz13cF91cGRhdGVfcG9zdChbJ0lEJz0+JFBJRCwncG9zdF9zdGF0dXMnPT4nZHJhZnQnXSx0cnVlKTsgJHJbJ3VwZGF0ZSddPWlzX3dwX2Vycm9yKCRyZXMpPyRyZXMtPmdldF9lcnJvcl9tZXNzYWdlKCk6JHJlczsgfQogICAgdXBkYXRlX3Bvc3RfbWV0YSgkUElELCdfcHNfcmFua2FfaXNpbXRhJywndGFpcCcpOyB1cGRhdGVfcG9zdF9tZXRhKCRQSUQsJ19wc192bXZ0X2lzaW10YScsJzIwMjYtMTEtMDkgVk1WVCBha3RhcyBJTlMtMjYtMDAwNzgsIFJhaW1pbyBudXJvZHltYXMgMTE6MDMnKTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRQSUQpOyBjbGVhbl9wb3N0X2NhY2hlKCRQSUQpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkUElEKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICAgJHJbJ3BvJ109JHN0YXRlKCk7CiAgfQogIGlmKCRmPT09JzMnKXsgJHJbJ2RhYmFyJ109JHN0YXRlKCk7ICR1PSdodHRwczovL3BldHNob3AubHQvcHJvZHVjdC9kcmFrb25hcGUtcGxhdGF1cy1zcGVjdHJvLWNiZC1hbGllanVzLTEyMDBtZy0zMC1tbC8nOyAkaD13cF9yZW1vdGVfZ2V0KCR1LFsndGltZW91dCc9PjIwLCdyZWRpcmVjdGlvbic9PjAsJ2hlYWRlcnMnPT5bJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnXV0pOyAkclsnaHR0cCddPWlzX3dwX2Vycm9yKCRoKT8kaC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTpbJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaCksJ2xvY2F0aW9uJz0+d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkaCwnbG9jYXRpb24nKSwndHVyaV9jYmQnPT5zdHJpcG9zKChzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpLCdEcmFrb25hcGUnKSE9PWZhbHNlPzE6MF07CiAgICAkcz13cF9yZW1vdGVfZ2V0KCdodHRwczovL3BldHNob3AubHQvP3M9ZHJha29uYXBlJnBvc3RfdHlwZT1wcm9kdWN0JyxbJ3RpbWVvdXQnPT4yMF0pOyAkclsncGFpZXNrYV90dXJpJ109aXNfd3BfZXJyb3IoJHMpPyRzLT5nZXRfZXJyb3JfbWVzc2FnZSgpOihzdHJpcG9zKChzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHMpLCdkcmFrb25hcGUtcGxhdGF1cycpIT09ZmFsc2U/MTowKTsKICAgIGZvcmVhY2goWydnb29nbGUnLCdrYWluYTI0Jywna2Fpbm9zJ10gYXMgJGZuKXsgJGZ4PXdwX3VwbG9hZF9kaXIoKVsnYmFzZWRpciddLiIvcGV0c2hvcC1mZWVkcy8kZm4ueG1sIjsgJHJbJ2ZlZWQnXVskZm5dPWlzX2ZpbGUoJGZ4KT9bJ210aW1lJz0+ZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoJGZ4KSksJ3R1cmknPT5zdHJpcG9zKGZpbGVfZ2V0X2NvbnRlbnRzKCRmeCksJ1ZFVDEyMDAnKSE9PWZhbHNlfHxzdHJpcG9zKGZpbGVfZ2V0X2NvbnRlbnRzKCRmeCksJ2RyYWtvbmFwZScpIT09ZmFsc2U/MTowXTpudWxsOyB9CiAgICAkclsnZmVlZF9jcm9uJ109W107IGZvcmVhY2goKGFycmF5KV9nZXRfY3Jvbl9hcnJheSgpIGFzICR0cz0+JGhvb2tzKXsgZm9yZWFjaCgkaG9va3MgYXMgJGhvb2s9PiR4KXsgaWYoc3RyaXBvcygkaG9vaywnZmVlZCcpIT09ZmFsc2UpICRyWydmZWVkX2Nyb24nXVtdPVskaG9vayxkYXRlKCdZLW0tZCBIOmknLCR0cyldOyB9IH0KICAgICRyWydsYWlrYXMnXT0obmV3IERhdGVUaW1lKCdub3cnLCR0eikpLT5mb3JtYXQoJ1ktbS1kIEg6aTpzJyk7CiAgfQogIGlmKCRmPT09JzknKXsgJGI9Z2V0X29wdGlvbigncHNfczE4NDB2XzI2MDUwX2JhaycpOyBpZigkYil7IHdwX3VwZGF0ZV9wb3N0KFsnSUQnPT4kUElELCdwb3N0X3N0YXR1cyc9PiRiWydzdGF0ZSddWydzdGF0dXMnXV0pOyBkZWxldGVfcG9zdF9tZXRhKCRQSUQsJ19wc19yYW5rYV9pc2ltdGEnKTsgZGVsZXRlX3Bvc3RfbWV0YSgkUElELCdfcHNfdm12dF9pc2ltdGEnKTsgJHJbJ2F0c3RhdHl0YSddPSRzdGF0ZSgpOyB9IGVsc2UgJHJbJ0VSUiddPSduxJdyYSBiYWsnOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-090413';
const GKEY='ps_s1840vc';
const PHASES=["1", "2", "3"];
const OUT='analize/s1840v_c.json';
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
