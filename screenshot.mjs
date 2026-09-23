process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA1bCddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJGlkPTM2MjUyOyAkZj0kX0dFVFsncHNfczE3MDVsJ107ICRyPVsnZic9PiRmXTsKICBpZigkZj09PScyJyl7CiAgICBpZighZ2V0X29wdGlvbigncHNfczE3MDVfMzYyNTJfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzA1XzM2MjUyX2JhaycsWydzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9jaycsdHJ1ZSksJ293bic9PmdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ3NyYyc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSRpZCIsQVJSQVlfQSldLGZhbHNlKTsKICAgICRxPShpbnQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9jaycsdHJ1ZSkrKGludClnZXRfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19xdHknLHRydWUpOyAkYz1nZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpOwogICAgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsJ2FtYnJvc2lhJyk7IHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfc3RvY2snLCRxKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5JywwKTsKICAgIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCRpZCk7CiAgICAkaGFzPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSRpZCBBTkQgQklOQVJZIHNvdXJjZT0nYW1icm9zaWEnIik7CiAgICBpZighJGhhcykgJHdwZGItPmluc2VydCgieyRwfXBzX3NvdXJjZXMiLFsncHJvZHVjdF9pZCc9PiRpZCwnc291cmNlJz0+J2FtYnJvc2lhJywnZWFuJz0+JzUyMTQwMDE4MzI4NzMnLCdzdG9ja19xdHknPT4kcSwnY29zdF9uZXQnPT4kYywnaXNfYWN0aXZlJz0+MSwnaXNfc2VsbGFibGUnPT4xLCdwcmlvcml0eSc9PjEsJ2NyZWF0ZWRfYXQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyksJ3VwZGF0ZWRfYXQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskcH1wc19zb3VyY2VzIFNFVCBzdG9ja19xdHk9JWQsIGNvc3RfbmV0PUlGKGNvc3RfbmV0IElTIE5VTEwgT1IgY29zdF9uZXQ9MCwlcyxjb3N0X25ldCksIGlzX2FjdGl2ZT0xLCBpc19zZWxsYWJsZT0xIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIEJJTkFSWSBzb3VyY2U9J2FtYnJvc2lhJyIsJHEsJGMsJGlkKSk7CiAgICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHB9cHNfc291cmNlcyBTRVQgaXNfYWN0aXZlPTAsIHN0b2NrX3F0eT0wIFdIRVJFIHByb2R1Y3RfaWQ9JGlkIEFORCBCSU5BUlkgc291cmNlIElOICgnQVYnLCdhdicpIik7CiAgICBwc19zb3VyY2VzX3N5bmNfc2F1Z2lhaSgkaWQpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7IGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsKICB9CiAgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7CiAgJHJbJ3BvJ109WydzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9jaycsdHJ1ZSksJ293bic9PmdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ3NzJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9ja19zdGF0dXMnLHRydWUpLCdzdCc9PmdldF9wb3N0X3N0YXR1cygkaWQpLCd3Y3EnPT4kcHItPmdldF9zdG9ja19xdWFudGl0eSgpLCdzcmMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGNvc3RfbmV0LGlzX2FjdGl2ZSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JGlkIixBUlJBWV9BKV07CiAgJHJbJ0FWX2RpZHppb3Npb3MnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIEJJTkFSWSBtZXRhX3ZhbHVlPSdBViciKTsKICAkclsnc3JjX0FWX2RpZHppb3Npb3MnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgQklOQVJZIHNvdXJjZT0nQVYnIik7CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKSAkclsncmVzb2x2ZSddPVBldHNob3BfQVZfU291cmNlOjpyZXNvbHZlKCRpZCwxKTsKICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-101843';
const GKEY='ps_s1705l';
const PHASES=["2"];
const OUT='analize/s1705_l.json';
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
