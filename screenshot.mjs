process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI3ZCBmYWt0YWkga29kYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI3ZCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyN2QnXTsKICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWZha3RhaS5waHAnOyAkTD1maWxlKCRmKTsgJHJbJ21kNSddPW1kNV9maWxlKCRmKTsgJHJbJ24nXT1jb3VudCgkTCk7CiAgJGhpdD1bXTsgZm9yZWFjaCgkTCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvc2F2aWthaW58X2RwX3xjb3N0X3ByaWNlfGNvc3RfbmV0fG5lemlub21hfHBhcmRhdmltYWl8bW5tX2tvbnRlaW5lcmlzL2knLCRsKSkgJGhpdFtdPSRpOyB9CiAgJG91dD1bXTsgJGRvbmU9W107IGZvcmVhY2goJGhpdCBhcyAkaCl7IGZvcigkaj1tYXgoMCwkaC0yKTskajw9bWluKGNvdW50KCRMKS0xLCRoKzIpOyRqKyspeyBpZihpc3NldCgkZG9uZVskal0pKSBjb250aW51ZTsgJGRvbmVbJGpdPTE7ICRvdXRbJGorMV09cnRyaW0oJExbJGpdKTsgfSB9CiAga3NvcnQoJG91dCk7ICRyWydrb2RhcyddPSRvdXQ7CiAgLy8ga2l0b3MgRFAgcGFrdW90ZXM6IGFyIHR1cmkgX2Nvc3RfcHJpY2UKICAkclsnZHAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBMRUZUKHAucG9zdF90aXRsZSw2MCkgdCwgYi5tZXRhX3ZhbHVlIGJhc2UsIHEubWV0YV92YWx1ZSBxdHksIGMubWV0YV92YWx1ZSBwYWNrX2Nvc3QsIGJjLm1ldGFfdmFsdWUgYmFzZV9jb3N0IEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgYiBPTiBiLnBvc3RfaWQ9cC5JRCBBTkQgYi5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBxIE9OIHEucG9zdF9pZD1wLklEIEFORCBxLm1ldGFfa2V5PSdfZHBfcGFja19xdHknIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgYyBPTiBjLnBvc3RfaWQ9cC5JRCBBTkQgYy5tZXRhX2tleT0nX2Nvc3RfcHJpY2UnIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgYmMgT04gYmMucG9zdF9pZD1iLm1ldGFfdmFsdWUgQU5EIGJjLm1ldGFfa2V5PSdfY29zdF9wcmljZScgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIixBUlJBWV9BKTsKICAkclsnZHBfbnVsbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUucHJla2VfaWQsIENPVU5UKCopIG4sIFJPVU5EKFNVTShlLmthaW5hX2N0KS8xMDAsMikgYmVfcHZtIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIFdIRVJFIGUucmlua2luaW9fdGlwYXM9J2RwJyBBTkQgKGUuc2F2aWthaW5hX2N0IElTIE5VTEwgT1IgZS5zYXZpa2FpbmFfY3Q9MCkgQU5EIGUudGVzdGluaXM9MCBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkclsnZHBfb2snXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBlLnByZWtlX2lkLCBlLnNhdmlrYWlub3Nfc2FsdGluaXMgcywgQ09VTlQoKikgbiBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBXSEVSRSBlLnJpbmtpbmlvX3RpcGFzPSdkcCcgQU5EIGUuc2F2aWthaW5hX2N0PjAgQU5EIGUudGVzdGluaXM9MCBHUk9VUCBCWSAxLDIiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-204749';
const GKEY='ps_s1827d';
const PHASES=["1"];
const OUT='analize/s1827_d.json';
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
