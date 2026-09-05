process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHIxMSAocmVjb24sIHRpayBza2FpdHltYXMpOiBrdXIgUHJhZ21hIGVrc3BvcnRvIGtvZGFzIOKAlCBjcm9uIGBwZXRzaG9wX3ByYWdtYV9tb250aGx5X2V4cG9ydGAgY2FsbGJhY2snxbMgZmFpbGFpIChSZWZsZWN0aW9uKSwgc25pcHBldCdhaSBzdSAncHJhZ21hJywgcGx1Z2lucy9tdS1wbHVnaW5zL3RlbWEgZmFpbGFpIHN1ICdwcmFnbWEnLCBvcGNpam9zIGAqcHJhZ21hKmAuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3IxMSddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE3IHIxMScpOyBnbG9iYWwgJHdwZGIsJHdwX2ZpbHRlcjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMTIwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJGNiPWFycmF5KCk7IGlmKGlzc2V0KCR3cF9maWx0ZXJbJ3BldHNob3BfcHJhZ21hX21vbnRobHlfZXhwb3J0J10pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWydwZXRzaG9wX3ByYWdtYV9tb250aGx5X2V4cG9ydCddLT5jYWxsYmFja3MgYXMgJHByPT4kZm5zKXsgZm9yZWFjaCgkZm5zIGFzICRmbil7ICRmPSRmblsnZnVuY3Rpb24nXTsgdHJ5eyBpZihpc19zdHJpbmcoJGYpJiZmdW5jdGlvbl9leGlzdHMoJGYpKXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGYpOyAkY2JbXT1hcnJheSgkcHIsJGYsc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkcmYtPmdldEZpbGVOYW1lKCkpLCRyZi0+Z2V0U3RhcnRMaW5lKCkpOyB9IGVsc2VpZihpc19hcnJheSgkZikpeyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJGZbMF0sJGZbMV0pOyAkY2JbXT1hcnJheSgkcHIsKGlzX29iamVjdCgkZlswXSk/Z2V0X2NsYXNzKCRmWzBdKTokZlswXSkuJzo6Jy4kZlsxXSxzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRybS0+Z2V0RmlsZU5hbWUoKSksJHJtLT5nZXRTdGFydExpbmUoKSk7IH0gZWxzZWlmKCRmIGluc3RhbmNlb2YgQ2xvc3VyZSl7ICRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsgJGNiW109YXJyYXkoJHByLCdjbG9zdXJlJyxzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSksJHJmLT5nZXRTdGFydExpbmUoKSk7IH0gfWNhdGNoKFRocm93YWJsZSAkZSl7ICRjYltdPWFycmF5KCRwciwnPycsJGUtPmdldE1lc3NhZ2UoKSk7IH0gfSB9IH0gJG9bJ2Nyb25fY2InXT0kY2I7CiAgJG9bJ2Nyb25fbmV4dCddPXdwX25leHRfc2NoZWR1bGVkKCdwZXRzaG9wX3ByYWdtYV9tb250aGx5X2V4cG9ydCcpOyAkb1snY3Jvbl9uZXh0X2QnXT0kb1snY3Jvbl9uZXh0J10/d3BfZGF0ZSgnWS1tLWQgSDppJywkb1snY3Jvbl9uZXh0J10pOm51bGw7CiAgJG9bJ3NuaXBwZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsc2NvcGUsTEVOR1RIKGNvZGUpIGxlbiBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVwcmFnbWElJyBPUiBuYW1lIExJS0UgJyVyYWdtYSUnIixBUlJBWV9BKTsKICAkaGl0cz1hcnJheSgpOyBmb3JlYWNoKGFycmF5KFdQX1BMVUdJTl9ESVIsV1BNVV9QTFVHSU5fRElSLGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpKSBhcyAkZGlyKXsgZm9yZWFjaChuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcixGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpIGFzICRmKXsgaWYoISRmLT5pc0ZpbGUoKXx8c3Vic3RyKCRmLT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJykgY29udGludWU7ICRwYXRoPSRmLT5nZXRQYXRobmFtZSgpOyBpZihzdHJwb3MoJHBhdGgsJy92ZW5kb3IvJykhPT1mYWxzZXx8c3RycG9zKCRwYXRoLCcvbm9kZV9tb2R1bGVzLycpIT09ZmFsc2UpIGNvbnRpbnVlOyBpZihzdHJpcG9zKCRmLT5nZXRGaWxlbmFtZSgpLCdwcmFnbWEnKSE9PWZhbHNlKXsgJGhpdHNbXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRwYXRoKS4nICgnLiRmLT5nZXRTaXplKCkuJyknOyBjb250aW51ZTsgfSBpZigkZi0+Z2V0U2l6ZSgpPDQwMDAwMCYmc3RyaXBvcygoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRwYXRoKSwncGV0c2hvcF9wcmFnbWEnKSE9PWZhbHNlKXsgJGhpdHNbXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRwYXRoKS4nICgnLiRmLT5nZXRTaXplKCkuJykgW3Rla3N0ZV0nOyB9IGlmKGNvdW50KCRoaXRzKT4yMCkgYnJlYWs7IH0gfQogICRvWydmYWlsYWknXT0kaGl0czsKICAkb1snb3BjaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDE1MCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVwcmFnbWElJyIsQVJSQVlfQSk7CiAgJG9bJ2FjdGl2ZV9wbHVnaW5zJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSxmdW5jdGlvbigkeCl7IHJldHVybiBzdHJpcG9zKCR4LCdwcmFnbWEnKSE9PWZhbHNlfHxzdHJpcG9zKCR4LCdwZXRzaG9wJykhPT1mYWxzZTsgfSkpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-185623';
const GKEY='ps_r11';
const PHASES=["GO"];
const OUT='analize/s1617_r11.json';
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
