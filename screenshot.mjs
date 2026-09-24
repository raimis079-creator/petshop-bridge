process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzEyZCBhbmFsaXplIHJlYWQtb25seSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTJkJ10pKSByZXR1cm47CiAgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzEyZCddOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRyWydlc3liZXNfY29udGVudCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF9jb250ZW50IExJS0UgJyZsdDslJyIpOwogICAgJHJbJ2VzeWJlc19jb250ZW50X2JldF9rdXInXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIChwb3N0X2NvbnRlbnQgTElLRSAnJSZsdDtwJmd0OyUnIE9SIHBvc3RfY29udGVudCBMSUtFICclJmFtcDthbXA7JScpIik7CiAgICAkclsnZXN5YmVzX2V4Y2VycHQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIChwb3N0X2V4Y2VycHQgTElLRSAnJSZsdDslJyBPUiBwb3N0X2V4Y2VycHQgTElLRSAnJSZhbXA7YW1wOyUnKSIpOwogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJmx0OyUnIE9SREVSIEJZIElEIERFU0MgTElNSVQgMyIpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR1PWdldF9wZXJtYWxpbmsoJGlkKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgkdS4nP25jPScudGltZSgpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pKTsgcHJlZ19tYXRjaCgnIzxkaXZbXj5dKmNsYXNzPSJbXiJdKndvb2NvbW1lcmNlLVRhYnMtcGFuZWwtLWRlc2NyaXB0aW9uW14iXSoiW14+XSo+KC4qPyk8L2Rpdj4jcycsJGIsJG0pOyAkZD1pc3NldCgkbVsxXSk/cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MoaHRtbF9lbnRpdHlfZGVjb2RlKCRtWzFdKSkpOicnOyAkclsnZXN5YmVzX3B2eiddW109WyRpZCwkdSwnbWF0b21pX3RhZ2FpPScuKHByZWdfbWF0Y2goJyM8cD58Jmx0O3AmZ3Q7IycsJG1bMV0/PycnKT8nVEFJUCc6J25lJyksbWJfc3Vic3RyKCRkLDAsMTYwKV07IH0KICAgICRyWyd0ZXN0X3ByZWtlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X3RpdGxlIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3RpdGxlIExJS0UgJ1RFU1QlJyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgICAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvYXBtb2tlamltYXMvP25jPScudGltZSgpKSxbJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKSk7ICR0PXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdHJpcF90YWdzKHByZWdfcmVwbGFjZSgnIzxzY3JpcHQuKj88L3NjcmlwdD58PHN0eWxlLio/PC9zdHlsZT4jcycsJycsJGIpKSk7ICRpPW1iX3N0cnBvcygkdCwnQXBtb2vEl2ppbWFzJyk7ICRyWydhcG1va2VqaW1hc19wdXNsYXBpcyddPW1iX3N1YnN0cigkdCwkaSw5MDApOyAkclsnYXBtb2tlamltYXNfa29kYXMnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvYXBtb2tlamltYXMvJyksWyd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjBdKSk7CiAgICAkcGc9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldChob21lX3VybCgnL3ByaXN0YXR5bWFzLz9uYz0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlXSkpOyAkdDI9cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MocHJlZ19yZXBsYWNlKCcjPHNjcmlwdC4qPzwvc2NyaXB0Pnw8c3R5bGUuKj88L3N0eWxlPiNzJywnJywkcGcpKSk7ICRpPW1iX3N0cnBvcygkdDIsJ1ByaXN0YXR5bW8nKTsgJHJbJ3ByaXN0YXR5bWFzX3B1c2xhcGlzJ109bWJfc3Vic3RyKCR0MiwkaSwxMjAwKTsKICAgICRnPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9ncmF6aW5pbWFzLz9uYz0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjBdKSk7ICRyWydncmF6aW5pbWFzX2tvZGFzJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnL2dyYXppbmltYXMvJyksWyd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjBdKSk7CiAgICAkclsnZ3JhemluaW1vX3B1c2xhcGlhaSddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9uYW1lIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwYWdlJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAocG9zdF9uYW1lIExJS0UgJyVncmF6aW4lJyBPUiBwb3N0X25hbWUgTElLRSAnJXRhaXN5a2wlJyBPUiBwb3N0X25hbWUgTElLRSAnJWFwbW9rJScgT1IgcG9zdF9uYW1lIExJS0UgJyVhcGllJScgT1IgcG9zdF9uYW1lIExJS0UgJyVrb250YWt0JScgT1IgcG9zdF9uYW1lIExJS0UgJyVwcmlzdGF0JScpIik7CiAgICAkclsnZm9vdGVyX21lbml1J109YXJyYXlfbWFwKGZ1bmN0aW9uKCRpKXtyZXR1cm4gJGktPnRpdGxlLicg4oaSICcud3BfbWFrZV9saW5rX3JlbGF0aXZlKCRpLT51cmwpO30sd3BfZ2V0X25hdl9tZW51X2l0ZW1zKCdmb290ZXInKT86W10pOwogICAgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldChob21lX3VybCgnLz9uYz0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlXSkpOyBwcmVnX21hdGNoKCcjPGZvb3Rlci4qPzwvZm9vdGVyPiNzJywkYiwkbSk7ICRmPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdHJpcF90YWdzKCRtWzBdPz8nJykpOyAkclsnZm9vdGVyX3Rla3N0YXMnXT1tYl9zdWJzdHIoJGYsMCw5MDApOwogICAgJHJbJ2ltb25lc19rb2Rhc19mb290ZXJ5amUnXT1wcmVnX21hdGNoKCcjKMSubW9uxJdzIGtvZGFzfMSubVwuIGtvZGFzfFBWTSBrb2Rhc3xVQUIgQXZlc2EpI3UnLCRmKT8neXJhJzonTkVSQSc7CiAgICAkclsndGVsZWZvbmFzX2Zvb3RlcnlqZSddPXByZWdfbWF0Y2goJyNcKzM3MHw4ID82XGRcZCMnLCRmKT8neXJhJzonbmVyYSc7CiAgICAvLyBrYXRlZ29yaWp1IGFwcmFzeW11IHZpZXRhIGlyIHBhdnl6ZHlzCiAgICAkYz1nZXRfdGVybV9ieSgnc2x1ZycsJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycsJ3Byb2R1Y3RfY2F0Jyk7ICRyWydrYXRfYXByYXN5bWFzX3B2eiddPSRjP21iX3N1YnN0cihzdHJpcF90YWdzKCRjLT5kZXNjcmlwdGlvbiksMCwzMDApOm51bGw7CiAgICAkclsna2F0X3JtX2Rlc2NfcHZ6J109JGM/Z2V0X3Rlcm1fbWV0YSgkYy0+dGVybV9pZCwncmFua19tYXRoX2Rlc2NyaXB0aW9uJyx0cnVlKTpudWxsOwogICAgLy8gcHJvZHVrdG8gbWV0YSBkZXNjIHBhdnl6ZHlzIChiZSByYW5rX21hdGhfZGVzY3JpcHRpb24gLT4gZXhjZXJwdCkKICAgICRyWydwcmVrZXNfYmVfZGVzY19pcl9iZV9leGNlcnB0J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gcCBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0ncmFua19tYXRoX2Rlc2NyaXB0aW9uJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAocG0ubWV0YV92YWx1ZSBJUyBOVUxMIE9SIHBtLm1ldGFfdmFsdWU9JycpIEFORCBwLnBvc3RfZXhjZXJwdD0nJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-164303';
const GKEY='ps_s1712d';
const PHASES=["G"];
const OUT='analize/s1712_g.json';
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
