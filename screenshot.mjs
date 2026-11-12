process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODYzYSBsb2phbHVzIGtsaWVudGFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg2M2InXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODYzYiddOwogIHRyeXsKICAgICRVPSJ7JFB9cHNfdl9hbmFsaXplX3V6c2FreW1haSI7CiAgICAkbz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1enNha3ltYXNfaWQgaWQsIGtsaWVudGFzX2VtYWlsX2hhc2ggYywgREFURShzdWt1cnRhX2F0KSBkLCB2aXNvX2N0IHYsIHNhbmRlbGlhaSBzIEZST00gJFUgV0hFUkUgc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTiAoJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywndHJhc2gnKSBBTkQga2xpZW50YXNfZW1haWxfaGFzaDw+JycgQU5EIHN1a3VydGFfYXQ+PScyMDI2LTAxLTAxJyIsQVJSQVlfQSk7CiAgICAkZz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1enNha3ltYXNfaWQgaWQsIEdST1VQX0NPTkNBVChESVNUSU5DVCBneXZ1bmFzKSBnIEZST00gKFNFTEVDVCB1enNha3ltYXNfaWQsZ3l2dW5hcyBGUk9NIHskUH1wc19pc3RfZmFrdF9laWx1dGVzIFdIRVJFIHRlc3RpbmlzPTAgVU5JT04gQUxMIFNFTEVDVCB1enNha3ltYXNfaWQsZ3l2dW5hcyBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgdGVzdGluaXM9MCkgeCBHUk9VUCBCWSB1enNha3ltYXNfaWQiLEFSUkFZX0EpOwogICAgJEc9W107IGZvcmVhY2goJGcgYXMgJHgpICRHWyR4WydpZCddXT0keFsnZyddOwogICAgJEM9W107IGZvcmVhY2goJG8gYXMgJHgpeyAkYz0mJENbJHhbJ2MnXV07IGlmKCEkYykgJGM9WyduJz0+MCwndic9PjAsJ3N1byc9PjAsJ2thdGUnPT4wLCdsYXN0Jz0+JycsJ2ZpcnN0Jz0+JzknLCdzJz0+W11dOyAkY1snbiddKys7ICRjWyd2J10rPSR4Wyd2J107ICRnZz0oc3RyaW5nKSgkR1skeFsnaWQnXV0/PycnKTsgaWYoc3RycG9zKCRnZywnc3VvJykhPT1mYWxzZXx8c3RycG9zKCRnZywnYWJ1JykhPT1mYWxzZSkgJGNbJ3N1byddKys7IGlmKHN0cnBvcygkZ2csJ2thdGUnKSE9PWZhbHNlfHxzdHJwb3MoJGdnLCdhYnUnKSE9PWZhbHNlKSAkY1sna2F0ZSddKys7IGlmKCR4WydkJ10+JGNbJ2xhc3QnXSkgJGNbJ2xhc3QnXT0keFsnZCddOyBpZigkeFsnZCddPCRjWydmaXJzdCddKSAkY1snZmlyc3QnXT0keFsnZCddOyBmb3JlYWNoKGV4cGxvZGUoJywnLChzdHJpbmcpJHhbJ3MnXSkgYXMgJHMpeyBpZigkcyE9PScnKSAkY1sncyddWyRzXT0oJGNbJ3MnXVskc10/PzApKzE7IH0gdW5zZXQoJGMpOyB9CiAgICAkclsna2xpZW50dV92aXNvJ109Y291bnQoJEMpOyAkclsndXpzX3Zpc28nXT1jb3VudCgkbyk7ICRyWydsYWlrb3RhcnBpcyddPVttaW4oYXJyYXlfY29sdW1uKCRvLCdkJykpLG1heChhcnJheV9jb2x1bW4oJG8sJ2QnKSldOwogICAgZm9yZWFjaChbNSw4LDEwLDEyLDE1XSBhcyAkbWluKXsgJGE9Wyd2aXNvJz0+MCwndGlrX3N1bnlzJz0+MCwndGlrX2thdGVzJz0+MCwnYWJ1Jz0+MCwnbmV6aW5vbWEnPT4wLCdha3R5dnVzXzEybWVuJz0+MCwnYWt0eXZ1c182bWVuJz0+MCwnZXVyX3ZpZCc9PjAsJ3NhbmRfbGVnYWN5X2RhdWd1bWEnPT4wXTsKICAgICAgZm9yZWFjaCgkQyBhcyAkYyl7IGlmKCRjWyduJ108JG1pbikgY29udGludWU7ICRhWyd2aXNvJ10rKzsgJGFbJ2V1cl92aWQnXSs9JGNbJ3YnXTsKICAgICAgICAkc3VuPSRjWydzdW8nXT49JGNbJ24nXSowLjM7ICRrYXQ9JGNbJ2thdGUnXT49JGNbJ24nXSowLjM7CiAgICAgICAgaWYoJHN1biYmJGthdCkgJGFbJ2FidSddKys7IGVsc2VpZigkc3VuKSAkYVsndGlrX3N1bnlzJ10rKzsgZWxzZWlmKCRrYXQpICRhWyd0aWtfa2F0ZXMnXSsrOyBlbHNlICRhWyduZXppbm9tYSddKys7CiAgICAgICAgaWYoJGNbJ2xhc3QnXT49ZGF0ZSgnWS1tLWQnLHN0cnRvdGltZSgnLTM2NSBkYXlzJykpKSAkYVsnYWt0eXZ1c18xMm1lbiddKys7CiAgICAgICAgaWYoJGNbJ2xhc3QnXT49ZGF0ZSgnWS1tLWQnLHN0cnRvdGltZSgnLTE4MyBkYXlzJykpKSAkYVsnYWt0eXZ1c182bWVuJ10rKzsKICAgICAgICAkdG90PWFycmF5X3N1bSgkY1sncyddKTsgaWYoJHRvdCAmJiAoKCRjWydzJ11bJ2xlZ2FjeSddPz8wKSsoJGNbJ3MnXVsnYXYnXT8/MCkpLyR0b3Q+PTAuNSkgJGFbJ3NhbmRfbGVnYWN5X2RhdWd1bWEnXSsrOyB9CiAgICAgICRhWydldXJfdmlkJ109JGFbJ3Zpc28nXT9yb3VuZCgkYVsnZXVyX3ZpZCddLyRhWyd2aXNvJ10vMTAwKTowOyAkclsnbnVvXycuJG1pbl09JGE7IH0KICAgICRzaz1bXTsgZm9yZWFjaCgkQyBhcyAkYykgZm9yZWFjaCgkY1sncyddIGFzICRzPT4kbikgJHNrWyRzXT0oJHNrWyRzXT8/MCkrJG47IGFyc29ydCgkc2spOyAkclsnc2FuZGVsaXVfcmVpa3NtZXMnXT1hcnJheV9zbGljZSgkc2ssMCwxMCx0cnVlKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9KTsK';
const VER='dep-202543';
const GKEY='ps_s1863b';
const PHASES=["1"];
const OUT='analize/s1863_b.json';
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
