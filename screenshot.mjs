process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA5biddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcwOW4nXTsgJGZsPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCc7ICRiYWs9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAuYmFrX3MxNzA5JzsKICAkU0VOQVM9JzAwZGU5NDMxNDgyMTZiZGMzMmY5NGIxNzg5OWFhY2NlJzsgJE5BVUpBUz0nZjFiZGYwOTQ5N2YzNzg2MzY3Y2QyYzY5OTczNTUwYzMnOwogICRyPVsnZic9PiRmLCdtZDVfZ3l2YXMnPT5tZDVfZmlsZSgkZmwpXTsKICBpZigkZj09PScxJyl7CiAgICAkYWlkPShpbnQpKCRfR0VUWydkX2RsX3YzNDRfdHh0J10/PzApOyAkYWY9JGFpZD9nZXRfYXR0YWNoZWRfZmlsZSgkYWlkKTonJzsgJHJbJ2FpZCddPSRhaWQ7CiAgICBpZighJGFmfHwhZmlsZV9leGlzdHMoJGFmKSl7ICRyWydrbGFpZGEnXT0nbmVyYSBEQVRBJzsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICAgJGM9QGd6ZGVjb2RlKGJhc2U2NF9kZWNvZGUodHJpbShmaWxlX2dldF9jb250ZW50cygkYWYpKSkpOyB3cF9kZWxldGVfYXR0YWNobWVudCgkYWlkLHRydWUpOwogICAgJHJbJ21kNV9uYXVqYXMnXT1tZDUoKHN0cmluZykkYyk7IGlmKG1kNSgoc3RyaW5nKSRjKSE9PSROQVVKQVMpeyAkclsna2xhaWRhJ109J21kNSBuZXN1dGFtcGEnOyB3cF9zZW5kX2pzb24oJHIpOyB9CiAgICBpZihtZDVfZmlsZSgkZmwpIT09JFNFTkFTKXsgJHJbJ2tsYWlkYSddPSdneXZhcyBmYWlsYXMgcGFzaWtlaXRlcyAtIHN0b3AnOyB3cF9zZW5kX2pzb24oJHIpOyB9CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJGMsIFRPS0VOX1BBUlNFKTsgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsncGFyc2VfZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICAgaWYoIWlzX2RpcihkaXJuYW1lKCRiYWspKSkgd3BfbWtkaXJfcChkaXJuYW1lKCRiYWspKTsgaWYoIWZpbGVfZXhpc3RzKCRiYWspKSBjb3B5KCRmbCwkYmFrKTsgJHJbJ2Jha19tZDUnXT1tZDVfZmlsZSgkYmFrKTsKICAgIGlmKCRyWydiYWtfbWQ1J10hPT0kU0VOQVMpeyAkclsna2xhaWRhJ109J2JhayBibG9nYXMnOyB3cF9zZW5kX2pzb24oJHIpOyB9CiAgICBmaWxlX3B1dF9jb250ZW50cygkZmwsJGMpOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJGZsLHRydWUpOyAkclsnbWQ1X3BvJ109bWQ1X2ZpbGUoJGZsKTsKICAgICRoYj1bXTsgZm9yZWFjaChbaG9tZV91cmwoJy8/aGI9Jy50aW1lKCkpLCBhZG1pbl91cmwoJ2FkbWluLWFqYXgucGhwJyldIGFzICR1KXsgJGg9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGhiW109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGgpOyB9ICRyWydoYiddPSRoYjsKICAgIGZvcmVhY2goJGhiIGFzICRjb2RlKXsgaWYoJGNvZGU+PTUwMHx8ISRjb2RlKXsgY29weSgkYmFrLCRmbCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZmwsdHJ1ZSk7ICRyWydBVFNUQVRZVEEnXT1tZDVfZmlsZSgkZmwpOyBicmVhazsgfSB9CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRyWyd2ZXJzaWphJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0RhcmJhbGF1a2lzJyk/UGV0c2hvcF9EYXJiYWxhdWtpczo6VkVSU0lKQTpudWxsOwogICAgJG09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGFyYmFsYXVraXMnLCdscF9keWR6aW9fb3B0Jyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgZm9yZWFjaChbMzYwOTEsMzYyNTgsMzYwMjJdIGFzICRvaWQpeyAkbz13Y19nZXRfb3JkZXIoJG9pZCk7IGlmKCRvKSAkclsnb3B0J11bJG9pZF09JG0tPmludm9rZShudWxsLCRvKTsgfQogICAgLy8gdXpzYWt5bWFzIGJlIExQIHNpdW50b3M6IGltaXR1b3RpIHN1IGtvcGlqYSBtZXRhIG5lbGllxI1pYW50IOKAlCB0aWsgYXBza2FpxI1pYXZpbWFzIHBlciBwbHVnaW7EhQogICAgJG89d2NfZ2V0X29yZGVyKDM2MDkxKTsgJG1tPWFwcGx5X2ZpbHRlcnMoJ3dvb19saXRodWFuaWFwb3N0X19vcmRlcl9hY3Rpb25fZ2V0X2xwX3NoaXBwaW5nX21ldGhvZCcsJG8pOyAkclsnYXBza2FpY2l1b3Rhc18zNjA5MSddPSRtbT9hcHBseV9maWx0ZXJzKCd3b29fbGl0aHVhbmlhcG9zdF9zaXplX3NlcnZpY2VfcmVzb2x2ZV9vcmRlcl9zaXplJywkbywkbW0pOm51bGw7CiAgICAkclsnaG9tZSddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxbJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKSk7CiAgfQogIGlmKCRmPT09JzknKXsgaWYoZmlsZV9leGlzdHMoJGJhaykpeyBjb3B5KCRiYWssJGZsKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmbCx0cnVlKTsgJHJbJ2F0c3RhdHl0YSddPW1kNV9maWxlKCRmbCk7fSB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-181704';
const GKEY='ps_s1709n';
const PHASES=["2"];
const OUT='analize/s1709_n2.json';
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
