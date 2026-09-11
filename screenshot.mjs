process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzAgaCDigJQgIzEwMDY6IFRvZnUgOCBWTlQuIHBha2FzIOKGkiBBViAoYmF6aW7ElyAjMTc2NTkg4oiSOCksIFJhaW1pbyBwcmHFoXltdS4gRCAoc3UgZHJ5KSArIFYuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjcwaCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTY3MGgnXTsgJG89YXJyYXkoJ3YnPT4nUzE2NzAgaCcsJ2ZhemUnPT4kZik7IGdsb2JhbCAkd3BkYjsKICAkT0lEPTM1ODg2OyAkSUlEPTE4MDM7ICRCQVNFPTE3NjU5OyAkUEFDSz04OwogIHRyeXsKICAgICRvcmQ9d2NfZ2V0X29yZGVyKCRPSUQpOyAkaXQ9JG9yZC0+Z2V0X2l0ZW0oJElJRCk7CiAgICBpZigkZj09PSdEJyl7CiAgICAgIGlmKCRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKT09PSdhdicpeyAkb1sncmV6J109J0pBVSc7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgaWYoKGludCkkaXQtPmdldF9wcm9kdWN0X2lkKCkhPT0zNTg1NiB8fCAoaW50KWdldF9wb3N0X21ldGEoMzU4NTYsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpIT09JEJBU0UgfHwgKGludClnZXRfcG9zdF9tZXRhKDM1ODU2LCdfZHBfcGFja19xdHknLHRydWUpIT09JFBBQ0sgfHwgKGludCkkaXQtPmdldF9xdWFudGl0eSgpIT09MSl7ICRvWydyZXonXT0nU1RPUDogZWlsdXTElyBuZSB0YSc7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgJG5lZWQ9JFBBQ0sqKGludCkkaXQtPmdldF9xdWFudGl0eSgpOwogICAgICAkYXY9UGV0c2hvcF9BVl9TdG9jazo6cXR5KCRCQVNFKTsgJG9bJ2F2X3ByaWVzJ109JGF2OyBpZihudWxsPT09JGF2IHx8ICRhdjwkbmVlZCl7ICRvWydyZXonXT0nU1RPUDogQVYgbmV1xb50ZW5rYSc7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgJGRyeT1QZXRzaG9wX1BhcnRpam9zOjpudXJhc3l0aSgkQkFTRSwkbmVlZCx0cnVlKTsgJG9bJ2RyeSddPSRkcnk7CiAgICAgICRvWydwYXJ0aWp1X3N1bWFfcHJpZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09BTEVTQ0UoU1VNKGtpZWtpc19saWtvKSwwKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3BhcnRpam9zIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGF0c2F1a3RhPTAiLCRCQVNFKSk7CiAgICAgIGlmKCRvWydwYXJ0aWp1X3N1bWFfcHJpZXMnXTwkbmVlZCl7ICRvWydyZXonXT0nU1RPUDogcGFydGlqxbMgbmV1xb50ZW5rYSc7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgYWRkX29wdGlvbigncHNfczE2NzBfMTAwNl9iYWNrdXAnLGFycmF5KCdpdGVtJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gYXJyYXkoJG0tPmtleSwkbS0+dmFsdWUpO30sJGl0LT5nZXRfbWV0YV9kYXRhKCkpLCdvcmRlcic9PmFycmF5KCdfcHNfZ3JvdXBzJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19ncm91cHMnKSwnX3BzX29yZGVyX3R5cGUnPT4kb3JkLT5nZXRfbWV0YSgnX3BzX29yZGVyX3R5cGUnKSwnX3BzX3NoaXBtZW50cyc9PiRvcmQtPmdldF9tZXRhKCdfcHNfc2hpcG1lbnRzJykpLCdhdic9PiRhdiwnYXQnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpLCcnLCdubycpOwogICAgICAkcj1QZXRzaG9wX0FWX1N0b2NrOjpkZWNyZWFzZSgkQkFTRSwkbmVlZCwndcW+c2FreW1hcyAjMTAwNiDigJQgOCBWTlQuIHBha2FzICMzNTg1NiAoUzE2NzApJyk7IGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydyZXonXT0nU1RPUDogZGVjcmVhc2UgJy4kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgd3Bfc2VuZF9qc29uKCRvKTsgfSAkb1snYXZfcG8nXT0kcjsKICAgICAgJG9bJ251cmFzeXRhJ109UGV0c2hvcF9QYXJ0aWpvczo6bnVyYXN5dGkoJEJBU0UsJG5lZWQsZmFsc2UpOwogICAgICBpZihtZXRob2RfZXhpc3RzKCdQZXRzaG9wX1NvdXJjZXMnLCdzaW5jaHJvbml6dW90aScpKSAkb1snc3luYyddPVBldHNob3BfU291cmNlczo6c2luY2hyb25penVvdGkoJEJBU0UpOwogICAgICAkaXQtPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19zb3VyY2UnLCdhdicpOyAkaXQtPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19jYXJyaWVyJywnYW55Jyk7ICRpdC0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX3NvdXJjZV9hdCcsY3VycmVudF90aW1lKCdteXNxbCcpKTsKICAgICAgJGl0LT51cGRhdGVfbWV0YV9kYXRhKCdfcHNfc291cmNlX3JlYXNvbicsIkFWOiBiYXppbsSXIHByZWvElyAjJEJBU0Ugw5ckUEFDSyAoRFAgcGFrYXMpLCBudXJhxaF5dGEgcmFua2luaXUgYsWrZHUgUzE2NzAiKTsKICAgICAgJGl0LT51cGRhdGVfbWV0YV9kYXRhKCdfcHNfYXZfcmVkdWNlZF9iYXNlJywiJEJBU0U6JG5lZWQiKTsgJGl0LT5zYXZlKCk7CiAgICAgICRncj1hcnJheSgpOyBmb3JlYWNoKCRvcmQtPmdldF9pdGVtcygpIGFzICR4KXsgJHM9JHgtPmdldF9tZXRhKCdfcHNfc291cmNlJyk7IGlmKCFpc3NldCgkZ3JbJHNdKSkgJGdyWyRzXT1hcnJheSgnY2Fycmllcic9PiR4LT5nZXRfbWV0YSgnX3BzX2NhcnJpZXInKSwnZWlsdXRlcyc9PjAsJ3ZpZW5ldGFpJz0+MCk7ICRnclskc11bJ2VpbHV0ZXMnXSsrOyAkZ3JbJHNdWyd2aWVuZXRhaSddKz0oaW50KSR4LT5nZXRfcXVhbnRpdHkoKTsgfQogICAgICAkb3JkPXdjX2dldF9vcmRlcigkT0lEKTsgJG9yZC0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX2dyb3Vwcycsd3BfanNvbl9lbmNvZGUoJGdyKSk7ICRvcmQtPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19vcmRlcl90eXBlJyxQZXRzaG9wX0FWX1NvdXJjZTo6b3JkZXJfdHlwZSgkZ3IpKTsgJG9yZC0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX3NoaXBtZW50cycsY291bnQoJGdyKSk7ICRvcmQtPnNhdmUoKTsKICAgICAgJG9yZC0+YWRkX29yZGVyX25vdGUoIlRvZnUgOCBWTlQuIHBha2FzICgjMzU4NTYpIHBlcmtlbHRhcyDEryBBViByYW5raW5pdSBixatkdSAoUzE2NzApOiBiYXppbsSXICMkQkFTRSBBViAkYXYg4oaSICRyLCBwYXJ0aWpvcyDiiJIkbmVlZC4gRMSWTUVTSU86IGF0xaFhdWt1cy9ncsSFxb5pbnVzIMWhxK8gdcW+c2FreW3EhSwgIyRCQVNFIEFWICskbmVlZCBncsSFxb5pbnRpIHJhbmtpbml1IGLFq2R1ICh2YXJpa2xpcyBEUCBwYWvFsyBkYXIgbmVwYWxhaWtvKS4iKTsKICAgICAgJG9bJ3JleiddPSdPSyc7CiAgICB9IGVsc2UgewogICAgICAkb1snaXRlbSddPWFycmF5KCdzcmMnPT4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ2Nhcic9PiRpdC0+Z2V0X21ldGEoJ19wc19jYXJyaWVyJyksJ3doeSc9PiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2VfcmVhc29uJykpOwogICAgICAkb1snb3JkZXInXT1hcnJheSgkb3JkLT5nZXRfbWV0YSgnX3BzX29yZGVyX3R5cGUnKSwkb3JkLT5nZXRfbWV0YSgnX3BzX2dyb3VwcycpLCRvcmQtPmdldF9tZXRhKCdfcHNfc2hpcG1lbnRzJykpOwogICAgICAkb1snYXYnXT1QZXRzaG9wX0FWX1N0b2NrOjpxdHkoJEJBU0UpOwogICAgICAkb1sncGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxraWVraXNfZ2F1dGFzLGtpZWtpc19saWtvLHRpZWtlamFzLHBhc3RhYmEgRlJPTSB7JHdwZGItPnByZWZpeH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBhdHNhdWt0YT0wIiwkQkFTRSksQVJSQVlfQSk7CiAgICAgICRvWydzb3VyY2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc291cmNlLHN0b2NrX3F0eSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJEJBU0UpLEFSUkFZX0EpOwogICAgICAkb1snc3RvY2tfbWV0YSddPWFycmF5KGdldF9wb3N0X21ldGEoJEJBU0UsJ19zdG9jaycsdHJ1ZSksZ2V0X3Bvc3RfbWV0YSgkQkFTRSwnX3N0b2NrX3N0YXR1cycsdHJ1ZSkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-072318';
const GKEY='ps_s1670h';
const PHASES=["D", "V"];
const OUT='analize/s1670_h.json';
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
