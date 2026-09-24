process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2ZCBrYXNvcyBtZXRvZHUgdGVzdGFzICgxIHByaWVzIC8gMiBwZXJyaWtpdW90aSBwYXN0b21hdGEgcGlybXUgLyAzIHBvIC8gOSBhdHN0YXR5dGkpIOKAlCBrcmVwc2VsaXMgbmVpc3NhdWdvbWFzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxNmQnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MTZkJ107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTcxNmQnLCdmYXplJz0+JGZdOyAkUD0kd3BkYi0+cHJlZml4OwogICR0ZXN0PWZ1bmN0aW9uKCRwaWQsJHF0eT0xKXsgd2NfbG9hZF9jYXJ0KCk7IFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoZmFsc2UpOyB3Y19jbGVhcl9ub3RpY2VzKCk7IFdDKCktPmN1c3RvbWVyLT5zZXRfc2hpcHBpbmdfY291bnRyeSgnTFQnKTsgV0MoKS0+Y3VzdG9tZXItPnNldF9iaWxsaW5nX2NvdW50cnkoJ0xUJyk7IFdDKCktPmN1c3RvbWVyLT5zZXRfc2hpcHBpbmdfcG9zdGNvZGUoJzAxMTAwJyk7ICRrPVdDKCktPmNhcnQtPmFkZF90b19jYXJ0KCRwaWQsJHF0eSk7IGlmKCEkaykgcmV0dXJuIFsnYWRkJz0+ZmFsc2UsJ25vdGljZXMnPT53Y19nZXRfbm90aWNlcygpXTsgV0MoKS0+Y2FydC0+Y2FsY3VsYXRlX3RvdGFscygpOyAkcGs9V0MoKS0+Y2FydC0+Z2V0X3NoaXBwaW5nX3BhY2thZ2VzKCk7ICRwaz1XQygpLT5zaGlwcGluZygpLT5jYWxjdWxhdGVfc2hpcHBpbmcoJHBrKTsgJG89W107IGZvcmVhY2goJHBrIGFzICRpPT4kcCl7ICRyYXRlcz1bXTsgZm9yZWFjaCgkcFsncmF0ZXMnXSBhcyAkcmlkPT4kcmF0ZSl7ICRyYXRlc1tdPVskcmlkLCRyYXRlLT5nZXRfbGFiZWwoKSwkcmF0ZS0+Z2V0X2Nvc3QoKV07IH0gJG9bJGldPVsncmF0ZXMnPT4kcmF0ZXMsJ2RlZmF1bHQnPT5mdW5jdGlvbl9leGlzdHMoJ3djX2dldF9kZWZhdWx0X3NoaXBwaW5nX21ldGhvZF9mb3JfcGFja2FnZScpP3djX2dldF9kZWZhdWx0X3NoaXBwaW5nX21ldGhvZF9mb3JfcGFja2FnZSgkaSwkcCwnJyk6bnVsbF07IH0gJHJlcz1jbGFzc19leGlzdHMoJ1BldHNob3BfRnVsZmlsbG1lbnRfU291cmNlJyk/UGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2U6OnJlc29sdmUoKGludCkkcGlkKTpudWxsOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KGZhbHNlKTsgcmV0dXJuIFsnYWRkJz0+dHJ1ZSwnc3VidG90YWwnPT5XQygpLT5jYXJ0LT5nZXRfc3VidG90YWwoKSwncGFrZXRhaSc9PiRvLCdmdWxmaWxsbWVudF9yZXNvbHZlJz0+JHJlcywndGlrX2t1cmplcml1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKSwnc3ZvcmlzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfd2VpZ2h0Jyx0cnVlKV07IH07CiAgdHJ5ewogICAgaWYoJGY9PT0nMSd8fCRmPT09JzMnKXsgZm9yZWFjaChbMTc5Nzg9PidKb3NlcmEgU2Vuc2lQbHVzIDEyLDUga2cgKFZGKScsMTI0NjY9PidFdWthbnViYSBEZXJtYXRvc2lzIDEyIGtnIChaQiknLDE1ODcwPT4nR2VvcnBsYXN0IFZpY2t5IHR1YWxldGFzICh0aWsga3VyamVyaXUpJ10gYXMgJHBpZD0+JHBhdil7ICRyWyd0ZXN0YWknXVskcGlkLicgJy4kcGF2XT0kdGVzdCgkcGlkKTsgfSAkclsnbWV0b2RhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGluc3RhbmNlX2lkLCBtZXRob2RfaWQsIG1ldGhvZF9vcmRlciwgaXNfZW5hYmxlZCBGUk9NIHskUH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMgV0hFUkUgem9uZV9pZD0xIE9SREVSIEJZIG1ldGhvZF9vcmRlciwgaW5zdGFuY2VfaWQiLEFSUkFZX0EpOyB9CiAgICBpZigkZj09PScyJyl7ICRiYWs9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaW5zdGFuY2VfaWQsIG1ldGhvZF9vcmRlciBGUk9NIHskUH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMgV0hFUkUgem9uZV9pZD0xIixBUlJBWV9BKTsgdXBkYXRlX29wdGlvbigncHNfczE3MTZfem9uYTFfZWlsZV9iYWsnLCRiYWssZmFsc2UpOyAkclsnYmFrJ109JGJhazsKICAgICAgLy8gcGHFoXRvbWF0YWkgKGluc3QgMykg4oaSIDEsIGt1cmplcmlzIGluc3QgMiDihpIgMiwga2l0aSArMCAoamF1IOKJpTMpCiAgICAgICR3cGRiLT51cGRhdGUoInskUH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMiLFsnbWV0aG9kX29yZGVyJz0+MF0sWyd6b25lX2lkJz0+MSwnaW5zdGFuY2VfaWQnPT4zXSk7CiAgICAgICR3cGRiLT51cGRhdGUoInskUH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMiLFsnbWV0aG9kX29yZGVyJz0+MV0sWyd6b25lX2lkJz0+MSwnaW5zdGFuY2VfaWQnPT4xXSk7IC8vIGZyZWVfc2hpcHBpbmcgKGlzanVuZ3RhcykgcG8gcGFzdG9tYXRvCiAgICAgIFdDX0NhY2hlX0hlbHBlcjo6Z2V0X3RyYW5zaWVudF92ZXJzaW9uKCdzaGlwcGluZycsdHJ1ZSk7IHdwX2NhY2hlX2ZsdXNoKCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsKICAgICAgJHJbJ3BvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaW5zdGFuY2VfaWQsIG1ldGhvZF9pZCwgbWV0aG9kX29yZGVyLCBpc19lbmFibGVkIEZST00geyRQfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVfbWV0aG9kcyBXSEVSRSB6b25lX2lkPTEgT1JERVIgQlkgbWV0aG9kX29yZGVyLCBpbnN0YW5jZV9pZCIsQVJSQVlfQSk7IH0KICAgIGlmKCRmPT09JzknKXsgZm9yZWFjaChnZXRfb3B0aW9uKCdwc19zMTcxNl96b25hMV9laWxlX2JhaycsW10pIGFzICRiKXsgJHdwZGItPnVwZGF0ZSgieyRQfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVfbWV0aG9kcyIsWydtZXRob2Rfb3JkZXInPT4oaW50KSRiWydtZXRob2Rfb3JkZXInXV0sWyd6b25lX2lkJz0+MSwnaW5zdGFuY2VfaWQnPT4oaW50KSRiWydpbnN0YW5jZV9pZCddXSk7IH0gV0NfQ2FjaGVfSGVscGVyOjpnZXRfdHJhbnNpZW50X3ZlcnNpb24oJ3NoaXBwaW5nJyx0cnVlKTsgJHJbJ2F0c3RhdHl0YSddPTE7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-203952';
const GKEY='ps_s1716d';
const PHASES=["3"];
const OUT='analize/s1716_d3.json';
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
