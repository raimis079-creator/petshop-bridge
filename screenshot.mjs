process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIyYiBsYXVrYWkgaXNfcHJvZHVjdCBhcHNhdWdhICgxIGRlcGxveSwgMiBwYXRpa3JhLCA5IHJlc3RvcmUpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyMmInXSkpIHJldHVybjsgJEY9JF9HRVRbJ3BzX3MxODIyYiddOyAkcj1bJ3YnPT4nUzE4MjJiJywnRic9PiRGXTsKICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxhdWthaS5waHAnOyAkYXJjaD1kaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMnOyAkYmFrPSRhcmNoLicvcGV0c2hvcC1sYXVrYWkucGhwLmJha19zMTgyMic7CiAgJGhiPWZ1bmN0aW9uKCl7ICRjPVtdOyBmb3JlYWNoKFsnLycsJy9rYXNhLycsJy9wYXJkdW90dXZlLyddIGFzICR1KXsgJHg9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc19oYicsdGltZSgpLGhvbWVfdXJsKCR1KSksWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRjWyR1XT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCk7fSByZXR1cm4gJGM7IH07CiAgaWYoJEY9PT0nMScpewogICAgJG9sZD1maWxlX2dldF9jb250ZW50cygkZik7ICRyWydtZDVfcHJpZXMnXT1tZDUoJG9sZCk7CiAgICBpZigkclsnbWQ1X3ByaWVzJ10hPT0nMjAxY2VmZmNmM2I4YWIxNmMwOGViMTIzNzExMmIxMDcnKXsgJHJbJ2tsYWlkYSddPSdtZDUgbmVzdXRhbXBhJzsgZ290byBvdXQ7IH0KICAgIGlmKCFpc19kaXIoJGFyY2gpKSBta2RpcigkYXJjaCwwNzUwLHRydWUpOyBpZighZmlsZV9leGlzdHMoJGJhaykpIGZpbGVfcHV0X2NvbnRlbnRzKCRiYWssJG9sZCk7ICRyWydiYWsnXT0kYmFrOyAkclsnYmFrX21kNSddPW1kNV9maWxlKCRiYWspOwogICAgJHJlcD1bICJpZiAoICEgaXNfcHJvZHVjdCgpICkgeyByZXR1cm47IH0iID0+ICJpZiAoICEgZnVuY3Rpb25fZXhpc3RzKCAnaXNfcHJvZHVjdCcgKSB8fCAhIGlzX3Byb2R1Y3QoKSApIHsgcmV0dXJuOyB9IiwKICAgICAgICAgICAiaWYgKCBpc19wcm9kdWN0KCkgKSB7IiA9PiAiaWYgKCBmdW5jdGlvbl9leGlzdHMoICdpc19wcm9kdWN0JyApICYmIGlzX3Byb2R1Y3QoKSApIHsiIF07CiAgICAkbmV3PSRvbGQ7IGZvcmVhY2goJHJlcCBhcyAkYT0+JGIpeyAkbj1zdWJzdHJfY291bnQoJG5ldywkYSk7ICRyWydraWVrJ11bJGFdPSRuOyBpZigkbiE9PTEpeyAkclsna2xhaWRhJ109J25lIDEgYXRpdGlrbXVvJzsgZ290byBvdXQ7IH0gJG5ldz1zdHJfcmVwbGFjZSgkYSwkYiwkbmV3KTsgfQogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuZXcsVE9LRU5fUEFSU0UpOyB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydrbGFpZGEnXT0ncGFyc2U6ICcuJGUtPmdldE1lc3NhZ2UoKTsgZ290byBvdXQ7IH0KICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRuZXcpOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJGYsdHJ1ZSk7CiAgICAkclsnbWQ1X3BvJ109bWQ1X2ZpbGUoJGYpOyAkclsnaGInXT0kaGIoKTsKICAgIGZvcmVhY2goJHJbJ2hiJ10gYXMgJGMpeyBpZigkYz49NTAwKXsgZmlsZV9wdXRfY29udGVudHMoJGYsJG9sZCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgJHJbJ0FUU1RBVFlUQSddPXRydWU7IGJyZWFrOyB9IH0KICB9IGVsc2VpZigkRj09PScyJyl7CiAgICBnbG9iYWwgJHdwZGI7ICRyWydtZDUnXT1tZDVfZmlsZSgkZik7ICRyWydoYiddPSRoYigpOwogICAgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3dwLWFjdGl2YXRlLnBocCcpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsnYWN0aXZhdGVfY29kZSddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KTsKICAgICRsaWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19wc19sYXVrYXMnIEFORCBtLm1ldGFfdmFsdWU9J3llcycgV0hFUkUgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBMSU1JVCAxIik7CiAgICAkclsnbGF1a2FzX2lkJ109JGxpZDsgaWYoJGxpZCl7ICR4PXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNfaGInLHRpbWUoKSxnZXRfcGVybWFsaW5rKCRsaWQpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpOyAkclsnbGF1a2FzX2NvZGUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCk7ICRyWydsYXVrYXNfaHRtbF9rYiddPXJvdW5kKHN0cmxlbigkaCkvMTAyNCk7ICRyWydsYXVrYXNfdml0cmluYSddPShzdHJwb3MoJGgsJ21ubV9xdWFudGl0eScpIT09ZmFsc2UpOyB9CiAgICAkbG9nPWluaV9nZXQoJ2Vycm9yX2xvZycpOyAkc3o9ZmlsZXNpemUoJGxvZyk7ICRoPWZvcGVuKCRsb2csJ3InKTsgZnNlZWsoJGgsbWF4KDAsJHN6LTIwMDAwMCkpOyAkdD1mcmVhZCgkaCwyMDAwMDApOyBmY2xvc2UoJGgpOwogICAgJHJbJ2ZhdGFsX25hdWppJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJHQpLGZ1bmN0aW9uKCRzKXsgcmV0dXJuIHN0cmlwb3MoJHMsJ0ZhdGFsJykhPT1mYWxzZSAmJiBzdHJwb3MoJHMsJzAyLU5vdi0yMDI2IDE5OicpIT09ZmFsc2U7IH0pKTsKICB9IGVsc2VpZigkRj09PSc5Jyl7CiAgICBpZihmaWxlX2V4aXN0cygkYmFrKSl7IGZpbGVfcHV0X2NvbnRlbnRzKCRmLGZpbGVfZ2V0X2NvbnRlbnRzKCRiYWspKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnYXRzdGF0eXRhJ109bWQ1X2ZpbGUoJGYpOyB9CiAgfQogIG91dDogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-193014';
const GKEY='ps_s1822b';
const PHASES=["2"];
const OUT='analize/s1822_b2.json';
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
