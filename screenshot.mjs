process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NDIgcyDigJQgc2F2aWthaW5vcyA4IGtvcnRlbGVtcyAoUmFpbWlvIGxlbnRlbGUsIGZha3TFq3JpbmUrMTUlKS4KICogUjogcGVyeml1cmE7IEE6IHJhc29tIF9jb3N0X3ByaWNlIHRpayBqZWkgZXNhbWEgPCBuYXVqYSBhcmJhIHR1c2NpYS4KICogU2FyZ2FzOiBTS1U9PWtvZGFzIEFSQkEgem9keml1IHNhcmdhcyBwYXZhZGluaW1lLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY0MiddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTY0MiddOwogICRvPWFycmF5KCd2Jz0+J1MxNjQyIHMgJy4kZik7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHJvd3M9YXJyYXkoCiAgICBhcnJheSgxOTE0NSwnMTAxMTAnLDExLjgwLGFycmF5KCdUcmV2aScpKSwKICAgIGFycmF5KDE1OTI4LCcxMDUyOCcsNC4wMCxhcnJheSgnU29uaWMnKSksCiAgICBhcnJheSgxNTkyMCwnMTA1MjknLDQuODksYXJyYXkoJ0NvbG9zc2VvJykpLAogICAgYXJyYXkoMTU5MzgsJzEwNTMwJywyLjExLGFycmF5KCdTaHV0dGxlJywnNDUnKSksCiAgICBhcnJheSgxNTkzNSwnMTA1MzMnLDMuMDQsYXJyYXkoJ1NodXR0bGUnLCc1NycpKSwKICAgIGFycmF5KDE3OTE2LCcxMDUzNicsMy41NCxhcnJheSgnU2h1dHRsZScpKSwKICAgIGFycmF5KDE1OTE0LCcxMDU1MCcsMS44NyxhcnJheSgnTGV0dGllcmEnKSksCiAgICBhcnJheSgxNTk5MywnMTA1NjUnLDUuNDAsYXJyYXkoJ1JvY2tldCcpKSwKICApOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpeyBsaXN0KCRpZCwkc2t1LCRuYXVqYSwkem9kKT0kcjsKICAgICRwcj1nZXRfcG9zdCgkaWQpOyAkZT1hcnJheSgnaWQnPT4kaWQsJ2tvZGFzJz0+JHNrdSwnbmF1amEnPT4kbmF1amEpOwogICAgaWYoISRwciB8fCAkcHItPnBvc3RfdHlwZSE9PSdwcm9kdWN0Jyl7ICRlWydrbGFpZGEnXT0nbmVyYSBwcm9kdWN0JzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgICAkZVsncGF2J109JHByLT5wb3N0X3RpdGxlOyAkZVsnc3RhdHVzJ109JHByLT5wb3N0X3N0YXR1czsKICAgICRkYnNrdT1nZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSk7ICRlWydza3VfZGInXT0kZGJza3U7CiAgICAkZVsnc2FuZGVsaXMnXT1nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKTsKICAgICRjdXI9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsgJGVbJ2Nvc3RfZGFiYXInXT0oJGN1cj09PScnP251bGw6JGN1cik7CiAgICAkdmY9Z2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9jb3N0Jyx0cnVlKTsgaWYoJHZmIT09JycpICRlWyd2Zl9jb3N0J109JHZmOwogICAgJHpiPWdldF9wb3N0X21ldGEoJGlkLCdfemJfY29zdCcsdHJ1ZSk7IGlmKCR6YiE9PScnKSAkZVsnemJfY29zdCddPSR6YjsKICAgIGlmKCRkYnNrdT09PSRza3UpeyAkc2FyZz0nc2t1JzsgfQogICAgZWxzZSB7ICRvaz10cnVlOyBmb3JlYWNoKCR6b2QgYXMgJHopeyBpZihzdHJpcG9zKCRwci0+cG9zdF90aXRsZSwkeik9PT1mYWxzZSl7JG9rPWZhbHNlO2JyZWFrO30gfSAkc2FyZz0kb2s/J3pvZHppYWknOicnOyB9CiAgICBpZigkc2FyZz09PScnKXsgJGVbJ3ZlaWtzbWFzJ109J1NLSVAgc2FyZ2FzIG5lcHJhZWpvJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgICAkZVsnc2FyZ2FzJ109JHNhcmc7CiAgICAkY3VyZj0oJGN1cj09PScnfHwkY3VyPT09bnVsbCk/bnVsbDooZmxvYXQpc3RyX3JlcGxhY2UoJywnLCcuJywgKHN0cmluZykkY3VyKTsKICAgICRyYXN5dGk9KCRjdXJmPT09bnVsbCB8fCAkY3VyZjwkbmF1amEpOwogICAgaWYoJGY9PT0nQScpewogICAgICBpZigkcmFzeXRpKXsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyxudW1iZXJfZm9ybWF0KCRuYXVqYSw0LCcuJywnJykpOyAkZVsndmVpa3NtYXMnXT0nSVJBU1lUQSc7IH0KICAgICAgZWxzZSAkZVsndmVpa3NtYXMnXT0nUEFMSUtUQSAoZXNhbWEgPj0gbmF1amEpJzsKICAgICAgJGVbJ2Nvc3RfcG8nXT1nZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpOwogICAgfSBlbHNlIHsgJGVbJ3ZlaWtzbWFzJ109JHJhc3l0aT8nUkFTWVRVJzonUEFMSUtUVSc7IH0KICAgICRvWydlaWwnXVtdPSRlOwogIH0KICBpZigkZj09PSdBJykgd3BfY2FjaGVfZmx1c2goKTsKICB3cF9zZW5kX2pzb24oJG8pOwp9LDEpOwo=';
const VER='dep-103732';
const GKEY='ps_s1642';
const PHASES=["R", "A"];
const OUT='analize/s1642_s.json';
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
