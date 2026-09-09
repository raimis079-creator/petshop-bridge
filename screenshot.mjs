process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjYxIGhpcG90ZXplcyBwYXRpa3JhIChtb2RhbGFzICsgbGlrdWNpYWkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE2NjFwJ10pIHx8ICRfR0VUWydwc19zMTY2MXAnXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjYxUCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIC8vIDEuIG11LXBsdWdpbnM6IGZhaWxhaSArIGdyZXAgd2VsY29tZQogICAgJGQ9V1BNVV9QTFVHSU5fRElSOyAkaGl0cz1hcnJheSgpOyAkZmlsZXM9YXJyYXkoKTsKICAgIGZvcmVhY2goZ2xvYigkZC4nLyoucGhwJykgYXMgJGYpewogICAgICAkZmlsZXNbXT1iYXNlbmFtZSgkZik7CiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgaWYoc3RyaXBvcygkYywnd2VsY29tZV9tb2RhbCcpIT09ZmFsc2V8fHN0cmlwb3MoJGMsJ3BzX3dlbGNvbWVfc2VlbicpIT09ZmFsc2V8fHN0cnBvcygkYywnU3ZlaWtpIHN1Z3InKSE9PWZhbHNlKQogICAgICAgICRoaXRzW109YmFzZW5hbWUoJGYpOwogICAgfQogICAgJG9bJ211X2ZhaWxhaSddPSRmaWxlczsgJG9bJ211X3dlbGNvbWVfaGl0cyddPSRoaXRzOwogICAgLy8gMi4gc25pcHBldGFpIHN1IHdlbGNvbWUKICAgICRvWydzbmlwX3dlbGNvbWUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJXdlbGNvbWUlJyBPUiBuYW1lIExJS0UgJyV3ZWxjb21lJScgT1IgY29kZSBMSUtFICclcHNfd2VsY29tZV9zZWVuJSciLEFSUkFZX0EpOwogICAgLy8gMy4ganVuZ2lrbGlzICsgdXNlciBtZXRhCiAgICAkb1snb3B0X2VuYWJsZWQnXT1nZXRfb3B0aW9uKCdwZXRzaG9wX3dlbGNvbWVfbW9kYWxfZW5hYmxlZCcsJ05FUkEnKTsKICAgICRvWydzZWVuX21ldGFfa2llayddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIG1ldGFfa2V5PSdwc193ZWxjb21lX3NlZW4nIik7CiAgICAvLyA0LiB1enNha3ltdSAzNTg3MS83My83NC83NSBtZXRhICsgcHJla2VzCiAgICBmb3JlYWNoKGFycmF5KDM1ODcxLDM1ODczLDM1ODc0LDM1ODc1KSBhcyAkb2lkKXsKICAgICAgJG9yZD13Y19nZXRfb3JkZXIoJG9pZCk7IGlmKCEkb3JkKXsgJG9bJ29yZCddWyRvaWRdPSdORVJBJzsgY29udGludWU7IH0KICAgICAgJHI9YXJyYXkoJ3N0YXR1cyc9PiRvcmQtPmdldF9zdGF0dXMoKSwKICAgICAgICAnX2RwX3N0b2NrX3JlZHVjZWQnPT4kb3JkLT5nZXRfbWV0YSgnX2RwX3N0b2NrX3JlZHVjZWQnKSwKICAgICAgICAnX29yZGVyX3N0b2NrX3JlZHVjZWQnPT4kb3JkLT5nZXRfbWV0YSgnX29yZGVyX3N0b2NrX3JlZHVjZWQnKSwKICAgICAgICAnX3BzX3N0b2NrX3JlZHVjZWQnPT4kb3JkLT5nZXRfbWV0YSgnX3BzX3N0b2NrX3JlZHVjZWQnKSk7CiAgICAgIGZvcmVhY2goJG9yZC0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsKICAgICAgICAkcGlkPSRpdC0+Z2V0X3ZhcmlhdGlvbl9pZCgpPzokaXQtPmdldF9wcm9kdWN0X2lkKCk7CiAgICAgICAgJHJbJ3ByZWtlcyddW109YXJyYXkoJ3BpZCc9PiRwaWQsJ3F0eSc9PiRpdC0+Z2V0X3F1YW50aXR5KCksJ19zdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwncGF2Jz0+bWJfc3Vic3RyKCRpdC0+Z2V0X25hbWUoKSwwLDMwKSk7CiAgICAgIH0KICAgICAgLy8gcGFzdGFib3Mgc3UgTGlrdXRpcwogICAgICAkbnQ9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb21tZW50X2NvbnRlbnQgRlJPTSB7JHdwZGItPmNvbW1lbnRzfSBXSEVSRSBjb21tZW50X3Bvc3RfSUQ9JWQgQU5EIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZScgQU5EIGNvbW1lbnRfY29udGVudCBMSUtFICclJWlrdXQlJSciLCRvaWQpKTsKICAgICAgJHJbJ2xpa3VjaW9fcGFzdGFib3MnXT0kbnQ7CiAgICAgICRvWydvcmQnXVskb2lkXT0kcjsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-105211';
const GKEY='ps_s1661p';
const PHASES=["GO"];
const OUT='analize/s1661_p.json';
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

