process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI1ZyByZWFkLW9ubHk6IERQIGdlbmVyYXRvcmlhdXMga2FuZGlkYXRhaSAy4oCTMTAga2cg4oCUIHBqxat2aWFpIChzYW5kxJdsaXMsIGd5dsWrbmFzLCBicmVuZGFzLCAlLCBsaWt1dGlzLCBwYXJkYXZpbWFpKSwgZXNhbcWzIHBha8WzIFNFTyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjVnJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyNWcnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyBAc2V0X3RpbWVfbGltaXQoMTUwKTsKICB0cnl7CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19keWR6aW9fc2VpbWEnIEFORCBzLm1ldGFfdmFsdWU8PicnIFdIRVJFIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF90aXRsZSBSRUdFWFAgJyhefFteMC05LC5dKShbMi05XXwxMCkoWywuXVswLTldKyk/ID9rZycgQU5EIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00geyRQfXBvc3RtZXRhIGRwIFdIRVJFIGRwLnBvc3RfaWQ9cC5JRCBBTkQgZHAubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnKSBBTkQgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSB7JFB9cG9zdG1ldGEgYjIgV0hFUkUgYjIubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBiMi5tZXRhX3ZhbHVlPXAuSUQpIik7CiAgICAkclsna2FuZGlkYXR1J109Y291bnQoJGlkcyk7CiAgICAkcGFyZD1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgcGlkLCBTVU0ocS5tZXRhX3ZhbHVlKSB2bnQgRlJPTSB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgbSBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBxIE9OIHEub3JkZXJfaXRlbV9pZD1tLm9yZGVyX2l0ZW1faWQgQU5EIHEubWV0YV9rZXk9J19xdHknIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIGkgT04gaS5vcmRlcl9pdGVtX2lkPW0ub3JkZXJfaXRlbV9pZCBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPWkub3JkZXJfaWQgV0hFUkUgbS5tZXRhX2tleT0nX3Byb2R1Y3RfaWQnIEFORCBvLnN0YXR1cyBJTiAoJ3djLWNvbXBsZXRlZCcsJ3djLXByb2Nlc3NpbmcnKSBHUk9VUCBCWSBtLm1ldGFfdmFsdWUiLEFSUkFZX0EpIGFzICR4KSAkcGFyZFsoaW50KSR4WydwaWQnXV09KGludCkkeFsndm50J107CiAgICAkY250PVsnc2FuZGVsaXMnPT5bXSwnZ3l2dW5hcyc9PltdLCdncnVwZSc9PltdLCdwcm9jJz0+W10sJ2xpa3V0aXMnPT5bXSwncGFyZF93Yyc9PltdLCdicmVuZGFzJz0+W10sJ2thaW5hJz0+W10sJ2R5ZGlzX2tnJz0+W11dOyAkcHZ6PVtdOwogICAgZm9yZWFjaCgkaWRzIGFzICRwaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgaWYoISRwKSBjb250aW51ZTsKICAgICAgJHNkPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKT9QZXRzaG9wX1JpbmtpbmlhaTo6c2FuZGVsaXMoJHBpZCk6Jz8nOyAkY250WydzYW5kZWxpcyddWyRzZF09KCRjbnRbJ3NhbmRlbGlzJ11bJHNkXT8/MCkrMTsKICAgICAgJHNsPWltcGxvZGUoJyAnLHdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKSk7ICRnPShzdHJwb3MoJHNsLCdrYXQnKSE9PWZhbHNlJiZzdHJwb3MoJHNsLCdzdW4nKT09PWZhbHNlKT8na2F0ZW1zJzooKHN0cnBvcygkc2wsJ3N1bicpIT09ZmFsc2UmJnN0cnBvcygkc2wsJ2thdCcpPT09ZmFsc2UpPydzdW5pbXMnOidhYnUvPycpOyAkY250WydneXZ1bmFzJ11bJGddPSgkY250WydneXZ1bmFzJ11bJGddPz8wKSsxOwogICAgICAkZ3I9Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0RQX0thaW5vcycpP1BldHNob3BfRFBfS2Fpbm9zOjpncnVwZSgkcGlkKTonPyc7ICRjbnRbJ2dydXBlJ11bJGdyPzonKG5lemlub21hKSddPSgkY250WydncnVwZSddWyRncj86JyhuZXppbm9tYSknXT8/MCkrMTsKICAgICAgJHByPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9EUF9LYWlub3MnKT9QZXRzaG9wX0RQX0thaW5vczo6bnVtYXR5dG9qaV9wcm9jKCRwaWQpOicnOyAkY250Wydwcm9jJ11bJHByPT09Jyc/JyhuZXJhKSc6JHByXT0oJGNudFsncHJvYyddWyRwcj09PScnPycobmVyYSknOiRwcl0/PzApKzE7CiAgICAgICRzdD0kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOyAkcT0kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7ICRsaz0kc3QhPT0naW5zdG9jayc/J25lcmEnOigoJHE9PT1udWxsKT8nYmVfc2thaWNpYXVzJzooJHE8Mj8nMSB2bnQnOigkcTw2PycyLTUnOic2KycpKSk7ICRjbnRbJ2xpa3V0aXMnXVskbGtdPSgkY250WydsaWt1dGlzJ11bJGxrXT8/MCkrMTsKICAgICAgJHBzPSRwYXJkWyRwaWRdPz8wOyAkcGs9JHBzPT0wPycwJzooJHBzPDM/JzEtMic6KCRwczwxMD8nMy05JzonMTArJykpOyAkY250WydwYXJkX3djJ11bJHBrXT0oJGNudFsncGFyZF93YyddWyRwa10/PzApKzE7CiAgICAgICRiPXdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pOyAkYm49JGI/JGJbMF06Jz8nOyAkY250WydicmVuZGFzJ11bJGJuXT0oJGNudFsnYnJlbmRhcyddWyRibl0/PzApKzE7CiAgICAgICRrbj0oZmxvYXQpJHAtPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0Jyk7ICRraz0ka248MjA/JzwyMCc6KCRrbjw0MD8nMjAtNDAnOigka248NjA/JzQwLTYwJzonNjArJykpOyAkY250WydrYWluYSddWyRra109KCRjbnRbJ2thaW5hJ11bJGtrXT8/MCkrMTsKICAgICAgaWYocHJlZ19tYXRjaCgnLyhefFteMC05LC5dKSgoPzpbMi05XXwxMCkoPzpbLC5dWzAtOV0rKT8pID9rZy91JywkcC0+Z2V0X25hbWUoKSwkbSkpeyAka2c9c3RyX3JlcGxhY2UoJywnLCcuJywkbVsyXSk7ICRjbnRbJ2R5ZGlzX2tnJ11bJGtnXT0oJGNudFsnZHlkaXNfa2cnXVska2ddPz8wKSsxOyB9CiAgICAgIGlmKGNvdW50KCRwdnopPDEyICYmICRwcz49MykgJHB2eltdPVsnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw2MCksJ2thaW5hJz0+JGtuLCdzYW5kJz0+JHNkLCdwYXJkJz0+JHBzLCdwcm9jJz0+JHByLCdwYWtvX2thaW5hJz0+KCRwciE9PScnJiYka24+MCYmY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0RQX0thaW5vcycpKT9QZXRzaG9wX0RQX0thaW5vczo6a2FpbmEoJGtuLDIsJHByKTpudWxsXTsKICAgIH0KICAgIGZvcmVhY2goJGNudCBhcyAkaz0+JHYpeyBhcnNvcnQoJHYpOyAkY250WyRrXT0oJGs9PT0nYnJlbmRhcycpP2FycmF5X3NsaWNlKCR2LDAsMTUsdHJ1ZSk6JHY7IH0KICAgICRyWydwanV2aWFpJ109JGNudDsgJHJbJ3Bhdnl6ZHppYWknXT0kcHZ6OwogICAgLy8gZXNhbcWzIHBha8WzIFNFTyAvIG1hdG9tdW1hcwogICAgJHBrPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgQU5EIG1ldGFfdmFsdWU8PicnIik7CiAgICAkcm9iPVtdOyBmb3JlYWNoKCRwayBhcyAkeCl7ICR2PWdldF9wb3N0X21ldGEoJHgsJ3JhbmtfbWF0aF9yb2JvdHMnLHRydWUpOyAkaz1pc19hcnJheSgkdik/aW1wbG9kZSgnLCcsJHYpOihzdHJpbmcpJHY7ICRyb2JbJGs/OicobnVtYXR5dGEpJ109KCRyb2JbJGs/OicobnVtYXR5dGEpJ10/PzApKzE7IH0gJHJbJ3Bha3Vfcm9ib3RzJ109JHJvYjsKICAgICRyWydwYWt1X3NlaW1hJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIHMgSk9JTiB7JFB9cG9zdG1ldGEgYiBPTiBiLnBvc3RfaWQ9cy5wb3N0X2lkIEFORCBiLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBXSEVSRSBzLm1ldGFfa2V5PSdfcHNfZHlkemlvX3NlaW1hJyBBTkQgcy5tZXRhX3ZhbHVlPD4nJyIpOwogICAgJHJbJ3JtX3NpdGVtYXBfcHJvZHVjdCddPWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLXNpdGVtYXAnKVsncHRfcHJvZHVjdF9zaXRlbWFwJ10/P251bGw7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-143655';
const GKEY='ps_s1725g';
const PHASES=["1"];
const OUT='analize/s1725_g.json';
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
