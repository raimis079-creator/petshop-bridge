process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzUgcnVuIGsg4oCUICMzNTg3MyB0eWx1cyBhdMWhYXVraW1hcyAoa2xpZW50YXMgamF1IG51c2lwaXJrbyAjMTAwMzsgcGHFoXRvIGJsb2thZGEsIGxpa3V0aXMgcGVyIFdDKSwgKyBsYWnFoWvFsyBmbG93IHPEhXJhxaFhcyAoYmFjcy9kdW5uaW5nKS4gRFJZL0FQUExZLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19rNSddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfazUnXTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOyAkbz1hcnJheSgndic9PidTMTY3NSBrJywnZmF6ZSc9PiRmKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHc9d2NfZ2V0X29yZGVyKDM1ODczKTsgJGl0ZW1zPWFycmF5KCk7IGZvcmVhY2goJHctPmdldF9pdGVtcygpIGFzICRpdCl7ICRwcj0kaXQtPmdldF9wcm9kdWN0KCk7ICRpdGVtc1skaXQtPmdldF9pZCgpXT1hcnJheSgncGlkJz0+JGl0LT5nZXRfcHJvZHVjdF9pZCgpLCdxJz0+JGl0LT5nZXRfcXVhbnRpdHkoKSwnc3RvY2snPT4kcHI/JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTpudWxsLCdvd24nPT5nZXRfcG9zdF9tZXRhKCRpdC0+Z2V0X3Byb2R1Y3RfaWQoKSwnX293bl9zdG9ja19xdHknLHRydWUpLCdyZWR1Y2VkJz0+JGl0LT5nZXRfbWV0YSgnX3JlZHVjZWRfc3RvY2snKSwnc3JjJz0+JGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpKTsgfQogICRvWydwcmllcyddPWFycmF5KCdzdGF0dXMnPT4kdy0+Z2V0X3N0YXR1cygpLCdpdGVtcyc9PiRpdGVtcyk7CiAgLy8gZmxvd3MKICBmb3JlYWNoKGFycmF5KCdQZXRzaG9wX0xhaXNrYWlfVHVyaW55cycsJ1BldHNob3BfTGFpc2thaScsJ1BldHNob3BfRW1haWxfRmxvd3MnKSBhcyAkYyl7IGlmKGNsYXNzX2V4aXN0cygkYykpeyAkbT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeC0+bmFtZTt9LChuZXcgUmVmbGVjdGlvbkNsYXNzKCRjKSktPmdldE1ldGhvZHMoKSk7ICRvWydrbGFzZSddWyRjXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRtLGZ1bmN0aW9uKCRuKXtyZXR1cm4gcHJlZ19tYXRjaCgnL2JhY3N8ZHVubmluZ3xwcmltaW58Zmxvd3xzaXVzdGl8ZGlzcGF0Y2h8cGxhbnVvL2knLCRuKTt9KSk7IH0gfQogICRvWydmbG93c19kYiddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgZmxvdyBGUk9NIHskcH1wc19lbWFpbF9jb250ZW50Iik7CiAgJG9bJ2Zsb3dzX2tvZGFzJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBmbG93IEZST00geyRwfXBzX2VtYWlsX2pvYnMiKTsKICBpZigkZj09PSdBUFBMWScgJiYgJHctPmdldF9zdGF0dXMoKT09PSdvbi1ob2xkJyl7CiAgICAkYmxvaz1mdW5jdGlvbigkcil7IHJldHVybiB0cnVlOyB9OyBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJGJsb2ssMSwxKTsgJHNrPTA7IGFkZF9hY3Rpb24oJ3BocG1haWxlcl9pbml0JyxmdW5jdGlvbigpIHVzZSgmJHNrKXskc2srKzt9KTsKICAgICR3LT51cGRhdGVfc3RhdHVzKCdjYW5jZWxsZWQnLCdTMTY3NTogYXTFoWF1a3RhIHR5bGlhaSBSYWltaW8gbnVyb2R5bXUg4oCUIGtsaWVudGFzIHXFvnNha8SXIGnFoSBuYXVqbyBpciBhcG1va8SXam8gIzEwMDMgKFBheXNlcmEpLiBMYWnFoWthcyBrbGllbnR1aSBuZXNpxbNzdGFzIChwcmVfd3BfbWFpbCBibG9rYXMpLicpOwogICAgcmVtb3ZlX2ZpbHRlcigncHJlX3dwX21haWwnLCRibG9rLDEpOwogICAgJHcyPXdjX2dldF9vcmRlcigzNTg3Myk7ICRpdGVtczI9YXJyYXkoKTsgZm9yZWFjaCgkdzItPmdldF9pdGVtcygpIGFzICRpdCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaXQtPmdldF9wcm9kdWN0X2lkKCkpOyAkaXRlbXMyWyRpdC0+Z2V0X2lkKCldPWFycmF5KCdzdG9jayc9PiRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsJ293bic9PmdldF9wb3N0X21ldGEoJGl0LT5nZXRfcHJvZHVjdF9pZCgpLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ3JlZHVjZWQnPT4kaXQtPmdldF9tZXRhKCdfcmVkdWNlZF9zdG9jaycpKTsgfQogICAgJG9bJ3BvJ109YXJyYXkoJ3N0YXR1cyc9PiR3Mi0+Z2V0X3N0YXR1cygpLCdpdGVtcyc9PiRpdGVtczIsJ2xhaXNrdV9iYW5keXRhJz0+JHNrLCdwYXN0YWJvcyc9PmFycmF5X21hcChmdW5jdGlvbigkbil7cmV0dXJuIG1iX3N1YnN0cigkbi0+Y29udGVudCwwLDEwMCk7fSxhcnJheV9zbGljZSh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+MzU4NzMsJ2xpbWl0Jz0+NCkpLDAsNCkpKTsKICAgICRvWydlbWFpbF9qb2JzX25hdWppJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdyxzdGF0dXMgRlJPTSB7JHB9cHNfZW1haWxfam9icyBXSEVSRSBjcmVhdGVkX2F0PkRBVEVfU1VCKE5PVygpLElOVEVSVkFMIDUgTUlOVVRFKSIsQVJSQVlfQSk7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-222518';
const GKEY='ps_k5';
const PHASES=["APPLY"];
const OUT='analize/s1675_k2.json';
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
