process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGFjIOKAlCAjMTczOTcgTW9uZ2UgU29sbzogcGFydGlqYSA0MDE0IChULTAgcGFwaWxkeW1hcyA9IFpCIGtvcGlqYSkgYXTFoWF1a2lhbWEsIEFWIOKGkiAyNCAoUmFpbWlvIHNwcmVuZGltYXMpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY3NmFjJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2NzYgYWMnKTsgJHBpZD0xNzM5NzsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJG9bJ3ByaWVzJ109YXJyYXkoJ293bic9PmdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCdwNDAxNCc9PiR3cGRiLT5nZXRfcm93KCJTRUxFQ1Qga2lla2lzX2dhdXRhcyxraWVraXNfbGlrbyxhdHNhdWt0YSBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBpZD00MDE0IEFORCBwcm9kdWN0X2lkPSRwaWQiLEFSUkFZX0EpKTsKICBpZighJG9bJ3ByaWVzJ11bJ3A0MDE0J118fCRvWydwcmllcyddWydvd24nXSE9PScxMzc5Jyl7ICRvWydTVE9QJ109J2LFq2tsxJcga2l0b2tpYSc7IH0KICBlbHNlIHsKICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNjc2XzE3Mzk3X2JhaycsYXJyYXkoJ293bic9PjEzNzksJ3BhcnRpamEnPT40MDE0LCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpLGZhbHNlKTsKICAgICR3cGRiLT51cGRhdGUoInskcH1wc19wYXJ0aWpvcyIsYXJyYXkoJ2F0c2F1a3RhJz0+MSwna2lla2lzX2xpa28nPT4wLCdwYXN0YWJhJz0+J1ByYWRpbmlzIGxpa3V0aXMgVC0wIChwYXBpbGR5bWFzLCBTMTY4Mikg4oCUIEFUxaBBVUtUQSBTMTY3NjogdGFpIFpCIGZlZWQga29waWphICgxIDM0MCksIG5lIEFWOyBSYWltaXM6IHJlYWx1cyBBViAyNCcpLGFycmF5KCdpZCc9PjQwMTQpKTsKICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLDI0KTsKICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9JdnlraWFpJykpIFBldHNob3BfSXZ5a2lhaTo6aXJhc3l0aSgkcGlkLCdsaWt1dGlzJyxhcnJheSgnbGF1a2FzJz0+J19vd25fc3RvY2tfcXR5Jywnc2VuYSc9PicxMzc5JywnbmF1amEnPT4nMjQnLCdvcF9ucic9PidTMTY3NicsJ3Bhc3RhYmEnPT4nUGFydGlqYSA0MDE0IChULTAgcGFwaWxkeW1hcyA9IFpCIGtvcGlqYSkgYXTFoWF1a3RhOyByZWFsdXMgQVYgMjQgKFJhaW1pcyknKSk7CiAgICB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOwogICAgJG9bJ3BvJ109YXJyYXkoJ293bic9PmdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCdwNDAxNCc9PiR3cGRiLT5nZXRfcm93KCJTRUxFQ1Qga2lla2lzX2xpa28sYXRzYXVrdGEgRlJPTSB7JHB9cHNfcGFydGlqb3MgV0hFUkUgaWQ9NDAxNCIsQVJSQVlfQSksJ3BhcnRpanVfbGlrbyc9PiR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU1VNKGtpZWtpc19saWtvKSBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSRwaWQgQU5EIGF0c2F1a3RhPTAiKSwnc3JjX2F2Jz0+JHdwZGItPmdldF9yb3coIlNFTEVDVCBzdG9ja19xdHksaXNfYWN0aXZlLHVwZGF0ZWRfYXQgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSRwaWQgQU5EIHNvdXJjZT0nYXYnIixBUlJBWV9BKSwnd2Nfc3RvY2snPT53Y19nZXRfcHJvZHVjdCgkcGlkKS0+Z2V0X3N0b2NrX3F1YW50aXR5KCkpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK';
const VER='dep-094636';
const GKEY='ps_s1676ac';
const PHASES=["GO"];
const OUT='analize/s1676_ac.json';
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
