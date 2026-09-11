process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzAgbCDigJQgUkVBRC1PTkxZOiBWZW5pcGFrIHBsdWdpbmFzIOKAlCBpxaEga3VyIGltYSB1xb5zYWt5bW8gTnIuIGxpcGR1a3VpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY3MGwnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY3MCBsJyk7CiAgdHJ5ewogICAgJGRpcnM9Z2xvYihXUF9QTFVHSU5fRElSLicvKnZlbmlwYWsqJyxHTE9CX09OTFlESVIpOyAkb1snZGlycyddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRkaXJzKTsKICAgIGZvcmVhY2goJGRpcnMgYXMgJGQpeyAkcGY9Z2xvYigkZC4nLyoucGhwJyk7IGZvcmVhY2goJHBmIGFzICR4KXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJHgpOyBpZihwcmVnX21hdGNoKCcvVmVyc2lvbjpccyooXFMrKS8nLCRzLCRtKSl7ICRvWyd2ZXInXVtiYXNlbmFtZSgkZCldPSRtWzFdOyBicmVhazsgfSB9CiAgICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgZm9yZWFjaCgkaXQgYXMgJGYpeyBpZihzdWJzdHIoJGYtPmdldEZpbGVuYW1lKCksLTQpIT09Jy5waHAnKSBjb250aW51ZTsgJEw9ZmlsZSgkZi0+Z2V0UGF0aG5hbWUoKSk7ICRiPXN0cl9yZXBsYWNlKCRkLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgZm9yZWFjaCgkTCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZG9jX25vfG9yZGVyX251bWJlcnxnZXRfb3JkZXJfbnVtYmVyfDxyZWZ8cmVmZXJlbmNlfG9yZGVyX25yfC0+Z2V0X2lkXChcKS4qKHhtbHxyZWZ8ZG9jfG51bWJlcnxucil8YXBwbHlfZmlsdGVyc1woXHMqW1wnIl1bYS16X10qdmVuaXBha1thLXpfXSoocmVmfG51bWJlcnxkb2N8c2hpcG1lbnR8eG1sfHBhY2spL2knLCRsKSAmJiBjb3VudCgkb1snaCddW2Jhc2VuYW1lKCRkKV1bJGJdPz9hcnJheSgpKTwxMikgJG9bJ2gnXVtiYXNlbmFtZSgkZCldWyRiXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTgwKSk7IH0gfSB9CiAgICAkb1snZmlsdHJhc19vcmRlcl9udW1iZXInXT1oYXNfZmlsdGVyKCd3b29jb21tZXJjZV9vcmRlcl9udW1iZXInKTsKICAgICRvcmQ9d2NfZ2V0X29yZGVyKDM1ODg2KTsgJG9bJ25yJ109YXJyYXkoJG9yZC0+Z2V0X2lkKCksJG9yZC0+Z2V0X29yZGVyX251bWJlcigpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-083013';
const GKEY='ps_s1670l';
const PHASES=["A"];
const OUT='analize/s1670_l.json';
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
