process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODUgbXEg4oCUIFRFU1RBUzogZ3J1cHVvdGFzIHJlZmlsbF9kdWUgcmVuZGVyIChrbGllbnRhcyBzdSDiiaUyIHNla2Ftb21pcyB0byBwYXRpZXMgdcW+c2FreW1vIHByZWvEl21pcyksIHZhcnRhaSAobGFpa2luYXMgc2VudCBqb2Ig4oaSIGFudHJhIHByZWvElyBwcmFsZWlkxb5pYW1hKSwgbnVvcm9kYSDEryBlbmRwb2ludCfEhTsgbGFpa2luaSBkdW9tZW55cyBpxaF0cmluYW1pLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4NW1xJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2ODUgbXEnKTsKICAkZz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHVzZXJfaWQsbGFzdF9vcmRlcl9pZCxDT1VOVCgqKSBuIEZST00geyRwfXBzX3JlZmlsbF90cmFja2luZyBHUk9VUCBCWSB1c2VyX2lkLGxhc3Rfb3JkZXJfaWQgSEFWSU5HIG4+PTIgT1JERVIgQlkgbiBERVNDIExJTUlUIDEiLEFSUkFZX0EpOyAkb1snZ3J1cGUnXT0kZzsKICAkcGlkcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSB7JHB9cHNfcmVmaWxsX3RyYWNraW5nIFdIRVJFIHVzZXJfaWQ9JWQgQU5EIGxhc3Rfb3JkZXJfaWQ9JWQiLCRnWyd1c2VyX2lkJ10sJGdbJ2xhc3Rfb3JkZXJfaWQnXSkpOyAkdT1nZXRfdXNlcl9ieSgnaWQnLCRnWyd1c2VyX2lkJ10pOyAkZW09JHUtPnVzZXJfZW1haWw7CiAgJHByPXdjX2dldF9wcm9kdWN0KCRwaWRzWzBdKTsgJHBheT1hcnJheSgncHJvZHVjdF9pZCc9PihpbnQpJHBpZHNbMF0sJ3Byb2R1Y3RfbmFtZSc9PiRwci0+Z2V0X25hbWUoKSwnZmVlZGJhY2tfdXJsJz0+aG9tZV91cmwoJy8/ZmI9dGVzdCcpKTsKICAkeD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpyZW5kZXIoJ3JlZmlsbF9kdWUnLCRwYXksYXJyYXkoJ2Zsb3dfY2xhc3MnPT4nc2VydmljZScsJ3JlY2lwaWVudF9lbWFpbCc9PiRlbSkpOyAkb1snc3ViamVjdCddPSR4WydzdWJqZWN0J107ICRvWyd0ZWtzdGFzJ109dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3MoJHhbJ2h0bWwnXSkpKTsgcHJlZ19tYXRjaF9hbGwoJy9ocmVmPSIoW14iXSspIi8nLCR4WydodG1sJ10sJG0pOyAkb1snbnVvcm9kb3MnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHUpe3JldHVybiBwcmVnX3JlcGxhY2UoJy8oej0pW14mIl0rLycsJyQx4oCmJywkdSk7fSwkbVsxXSk7CiAgJGN0eD1hcnJheSgndXNlcl9pZCc9PihpbnQpJGdbJ3VzZXJfaWQnXSwncHJvZHVjdF9pZCc9PihpbnQpJHBpZHNbMV0pOyAkb1sndmFydGFpX3ByaWVzJ109YXBwbHlfZmlsdGVycygncGV0c2hvcF9lbWFpbF9lbGlnaWJpbGl0eScsYXJyYXkoJ2FsbG93ZWQnPT50cnVlLCdyZWFzb24nPT4nJywndGVybWluYWwnPT50cnVlKSwncmVmaWxsX2R1ZScsJ3NlcnZpY2UnLCRlbSwkY3R4KTsKICAkd3BkYi0+aW5zZXJ0KCRwLidwc19lbWFpbF9qb2JzJyxhcnJheSgnam9iX2tleSc9PidURVNUX3MxNjg1bXEnLCdmbG93Jz0+J3JlZmlsbF9kdWUnLCdmbG93X2NsYXNzJz0+J3NlcnZpY2UnLCdyZWNpcGllbnRfZW1haWwnPT4kZW0sJ3JlY2lwaWVudF91c2VyX2lkJz0+JGdbJ3VzZXJfaWQnXSwnc3ViamVjdCc9Pid0ZXN0JywncGF5bG9hZCc9Pid7fScsJ3N0YXR1cyc9PidzZW50JywncHJvdmlkZXInPT4ndGVzdCcsJ2F0dGVtcHRzJz0+MSwnc2NoZWR1bGVkX2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLCdzZW50X2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLCdjcmVhdGVkX2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLCd1cGRhdGVkX2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLCdjb250ZXh0X2pzb24nPT5qc29uX2VuY29kZShhcnJheSgndXNlcl9pZCc9PihpbnQpJGdbJ3VzZXJfaWQnXSwncHJvZHVjdF9pZCc9PihpbnQpJHBpZHNbMF0pKSkpOyAkamlkPSR3cGRiLT5pbnNlcnRfaWQ7CiAgJG9bJ3ZhcnRhaV9wbyddPWFwcGx5X2ZpbHRlcnMoJ3BldHNob3BfZW1haWxfZWxpZ2liaWxpdHknLGFycmF5KCdhbGxvd2VkJz0+dHJ1ZSwncmVhc29uJz0+JycsJ3Rlcm1pbmFsJz0+dHJ1ZSksJ3JlZmlsbF9kdWUnLCdzZXJ2aWNlJywkZW0sJGN0eCk7CiAgJHdwZGItPmRlbGV0ZSgkcC4ncHNfZW1haWxfam9icycsYXJyYXkoJ2lkJz0+JGppZCkpOyAkb1snaXN2YWx5dGEnXT0hJHdwZGItPmdldF92YXIoIlNFTEVDVCBpZCBGUk9NIHskcH1wc19lbWFpbF9qb2JzIFdIRVJFIGpvYl9rZXk9J1RFU1RfczE2ODVtcSciKTsKICAkb1snZW5kcG9pbnQnXT1QZXRzaG9wX1Bha2FydG90aTo6dXJsKCRnWydsYXN0X29yZGVyX2lkJ10pOyAkb1sncHJla2VzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3BhdiddLicgw5cnLiR4WydraWVraXMnXTt9LFBldHNob3BfUGFrYXJ0b3RpOjpncnVwZSgoaW50KSRnWyd1c2VyX2lkJ10sKGludCkkcGlkc1swXSlbJ3ByZWtlcyddKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-134254';
const GKEY='ps_s1685mq';
const PHASES=["TEST"];
const OUT='analize/s1685_mq.json';
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
