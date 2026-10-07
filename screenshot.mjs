process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU3YSBmbGF0c29tZS1jaGlsZCBmdW5jdGlvbnMucGhwOjE2MzUgaXNfY2hlY2tvdXQgYXBzYXVnYSDigJQgMSBkcnkgwrcgMiBkaWVndGkrcGF0aWtyYSAoYXV0by1hdHN0YXR5bWFzKSDCtyAzIHdwLWFjdGl2YXRlIHRlc3RhcyDCtyA5IGF0c3RhdHl0aSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NTdhJ10pKSByZXR1cm47ICRGPShzdHJpbmcpJF9HRVRbJ3BzX3MxNzU3YSddOyBAc2V0X3RpbWVfbGltaXQoMTYwKTsgJHI9Wyd2Jz0+J1MxNzU3YScsJ2YnPT4kRl07CiAgJGRzdD1nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnOyAkYmFrPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy9mbGF0c29tZS1jaGlsZC1mdW5jdGlvbnMucGhwLmJha19zMTc1Nyc7CiAgJFNFTkE9IiAgICBpZiAoICEgaXNfY2hlY2tvdXQoKSApIHJldHVybiBcJHRyYW5zbGF0ZWQ7XG5cbiAgICBcJHJlcGxhY2VtZW50cyA9IGFycmF5KCI7CiAgJE5BVUpBPSIgICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cyggJ2lzX2NoZWNrb3V0JyApIHx8ICEgaXNfY2hlY2tvdXQoKSApIHJldHVybiBcJHRyYW5zbGF0ZWQ7IC8vIFMxNzU3OiBiZSBXb29Db21tZXJjZSAocHZ6LiAvd3AtYWN0aXZhdGUucGhwKSDigJQgbmlla28gbmVkYXJvXG5cbiAgICBcJHJlcGxhY2VtZW50cyA9IGFycmF5KCI7CiAgJGdldD1mdW5jdGlvbigkcCl7ICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJHAuKHN0cnBvcygkcCwnPycpPT09ZmFsc2U/Jz8nOicmJykuJ3BzX2hiPScubWljcm90aW1lKHRydWUpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MF0pOyByZXR1cm4gaXNfd3BfZXJyb3IoJHgpP1swLCR4LT5nZXRfZXJyb3JfbWVzc2FnZSgpXTpbd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KV07IH07CiAgJGhiPWZ1bmN0aW9uKCkgdXNlKCRnZXQpeyAkaD1bXTsgZm9yZWFjaChbJy8nLCcva2FzYS8nLCcvd3AtYWRtaW4vYWRtaW4tYWpheC5waHAnLCcvd3AtanNvbi8nXSBhcyAkcCl7IGxpc3QoJGMsJGIpPSRnZXQoJHApOyAkaFskcF09WyRjLChpbnQpKHN0cmlwb3MoJGIsJ2NyaXRpY2FsIGVycm9yJykhPT1mYWxzZXx8c3RyaXBvcygkYiwnRmF0YWwgZXJyb3InKSE9PWZhbHNlfHxzdHJpcG9zKCRiLCdrcml0aW7ElyBrbGFpZGEnKSE9PWZhbHNlKV07IH0gcmV0dXJuICRoOyB9OwogIHRyeXsKICAkdD1maWxlX2dldF9jb250ZW50cygkZHN0KTsgJHJbJ21kNSddPW1kNSgkdCk7ICRyWydzZW5hX24nXT1zdWJzdHJfY291bnQoJHQsJFNFTkEpOyAkclsnbmF1amFfbiddPXN1YnN0cl9jb3VudCgkdCwkTkFVSkEpOwogIGlmKCRGPT09JzEnfHwkRj09PScyJyl7CiAgICBpZihzdHJwb3MoJHJbJ21kNSddLCc3ZDgwNTdjNScpIT09MCkgJHJbJ2VyciddPSdmYWlsYXMgcGFzaWtlaXTElyc7CiAgICBlbHNlaWYoJHJbJ3NlbmFfbiddIT09MSkgJHJbJ2VyciddPSdzZW5hIGVpbHV0xJcgcmFzdGEgJy4kclsnc2VuYV9uJ10uJyBrLic7CiAgICBlbHNlIHsgJG49c3RyX3JlcGxhY2UoJFNFTkEsJE5BVUpBLCR0KTsgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuLFRPS0VOX1BBUlNFKTsgJHJbJ3RvayddPSdvayc7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109J3Rva2VuOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gJHJbJ25hdWphc19tZDUnXT1tZDUoJG4pOwogICAgICBpZigkRj09PScyJyAmJiBlbXB0eSgkclsnZXJyJ10pKXsgaWYoIWZpbGVfZXhpc3RzKCRiYWspKSBjb3B5KCRkc3QsJGJhayk7ICRyWydiYWtfbWQ1J109bWQ1X2ZpbGUoJGJhayk7IGlmKCRyWydiYWtfbWQ1J10hPT0kclsnbWQ1J10peyAkclsnZXJyJ109J2JhayBuZXN1dGFtcGEnOyB9CiAgICAgICAgZWxzZSB7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJG4pOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBAb3BjYWNoZV9pbnZhbGlkYXRlKCRkc3QsdHJ1ZSk7IGNsZWFyc3RhdGNhY2hlKCk7ICRyWydtZDVfcG8nXT1tZDVfZmlsZSgkZHN0KTsgc2xlZXAoMSk7ICRoPSRoYigpOyAkclsnaGInXT0kaDsKICAgICAgICAgICRibD0kaFsnLyddWzBdIT09MjAwOyBmb3JlYWNoKCRoIGFzICR2KXsgaWYoJHZbMV0pICRibD10cnVlOyB9IGlmKCRibCl7IGNvcHkoJGJhaywkZHN0KTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgQG9wY2FjaGVfaW52YWxpZGF0ZSgkZHN0LHRydWUpOyAkclsnQVRTVEFUWVRBJ109bWQ1X2ZpbGUoJGRzdCk7IH0gfSB9IH0gfQogIGlmKCRGPT09JzMnKXsgJHQwPXRpbWUoKTsgbGlzdCgkYywkYik9JGdldCgnL3dwLWFjdGl2YXRlLnBocCcpOyAkclsnd3BfYWN0aXZhdGUnXT1bJGMsKGludCkoc3RyaXBvcygkYiwnY3JpdGljYWwgZXJyb3InKSE9PWZhbHNlKV07ICRyWydoYiddPSRoYigpOyBzbGVlcCgyKTsKICAgICRsb2c9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRmaD1mb3BlbigkbG9nLCdyJyk7IGZzZWVrKCRmaCwtMjAwMDAwLFNFRUtfRU5EKTsgJHg9ZnJlYWQoJGZoLDIwMDAwMCk7IGZjbG9zZSgkZmgpOyAkbmF1amk9MDsgZm9yZWFjaChleHBsb2RlKCJcbiIsJHgpIGFzICRsKXsgaWYocHJlZ19tYXRjaCgnL15cWyhcZFxkLVx3ezN9LTIwMjYgXGRcZDpcZFxkOlxkXGQpIFVUQ1xdIFBIUCBGYXRhbC8nLCRsLCRtKSl7ICRkPURhdGVUaW1lOjpjcmVhdGVGcm9tRm9ybWF0KCdkLU0tWSBIOmk6cycsJG1bMV0sbmV3IERhdGVUaW1lWm9uZSgnVVRDJykpOyBpZigkZCAmJiAkZC0+Z2V0VGltZXN0YW1wKCk+PSR0MC01KSAkbmF1amkrKzsgfSB9ICRyWyduYXVqaV9mYXRhbCddPSRuYXVqaTsgfQogIGlmKCRGPT09JzknKXsgaWYoZmlsZV9leGlzdHMoJGJhaykpeyBjb3B5KCRiYWssJGRzdCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIEBvcGNhY2hlX2ludmFsaWRhdGUoJGRzdCx0cnVlKTsgJHJbJ2F0c3RhdHl0YSddPW1kNV9maWxlKCRkc3QpOyB9IGVsc2UgJHJbJ2VyciddPSduxJdyYSBiYWsnOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCAxKTsK';
const VER='dep-174529';
const GKEY='ps_s1757a';
const PHASES=["1", "2"];
const OUT='out/s1757_a12.json';
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
