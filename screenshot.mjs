process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIwZiAzIHBha2FpICgzNzQxNS0xNykg4oaSIHZpZW5hIGR5ZMW+acWzIMWhZWltYS4gRmF6xJdzOiAyIHByaXNraXJ0aStwYXRpa3JhLCAzIHBhdGlrcmEsIDkgYXRzdGF0eXRpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyMGYnXSkpIHJldHVybjsgJGY9KHN0cmluZykkX0dFVFsncHNfczE4MjBmJ107ICRyPVsndic9PidTMTgyMGYnLCdmYXplJz0+JGZdOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgxNzApOwogICRJRFM9WzM3NDE1LDM3NDE2LDM3NDE3XTsgJFNFSU1BPSdtb25nZS12ZXRzb2x1dGlvbi1kb2ctZ2FzdHJvaW50ZXN0aW5hbC00MDBnJzsKICAkdmFseXRpPWZ1bmN0aW9uKCkgdXNlKCRTRUlNQSl7IGZvcmVhY2goWydwc19ka19zZWltb3MnLCdwc19keWR6X2F1dG9fYmF6ZXMnLCdwc19ka18nLm1kNSgkU0VJTUEpXSBhcyAkdCkgZGVsZXRlX3RyYW5zaWVudCgkdCk7IGdsb2JhbCAkd3BkYjsgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfcHNfZHlkel8lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3RpbWVvdXRfcHNfZHlkel8lJyIpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7IH07CiAgdHJ5ewogICAgaWYoJGY9PT0nMicpeyBmb3JlYWNoKCRJRFMgYXMgJGlkKXsgJHJbJ2J1dm8nXVskaWRdPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19keWR6aW9fc2VpbWEnLCRTRUlNQSk7IH0gJHZhbHl0aSgpOyB9CiAgICBpZigkZj09PSc5Jyl7IGZvcmVhY2goJElEUyBhcyAkaWQpIGRlbGV0ZV9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJyk7ICR2YWx5dGkoKTsgJHJbJ2F0c3RhdHl0YSddPTE7IH0KICAgIGlmKGluX2FycmF5KCRmLFsnMicsJzMnLCc5J10sdHJ1ZSkpewogICAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRHlkemlhaScpKXsgJHJbJ25hcmlhaSddPVBldHNob3BfRHlkemlhaTo6bmFyaWFpKCRTRUlNQSk7IGZvcmVhY2goJElEUyBhcyAkaWQpICRyWyd1enJhc2FzJ11bJGlkXT1QZXRzaG9wX0R5ZHppYWk6OnV6cmFzYXMoJGlkKTsgJHJbJ2VpbHV0ZXMnXT1QZXRzaG9wX0R5ZHppYWk6OmVpbHV0ZXMoJFNFSU1BLDM3NDE3KTsgfQogICAgICAkeD13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX2hiJyx0aW1lKCksZ2V0X3Blcm1hbGluaygzNzQxNykpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7CiAgICAgICRyWydwc2wnXT1bJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdsZW50ZWxlJz0+c3RycG9zKCRoLCdwcy1wYWtfX3QnKSE9PWZhbHNlXTsKICAgICAgaWYocHJlZ19tYXRjaCgnLzx0YWJsZSBjbGFzcz0icHMtcGFrX190Ii4qPzxcL3RhYmxlPi9zdScsJGgsJG0pKSAkclsnbGVudGVsZV90eHQnXT1tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLHdwX3N0cmlwX2FsbF90YWdzKHN0cl9yZXBsYWNlKCc8JywnIDwnLCRtWzBdKSkpKSwwLDYwMCk7CiAgICAgICRjPXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNfaGInLHRpbWUoKSxob21lX3VybCgnLz9zPW1vbmdlK2dhc3Ryb2ludGVzdGluYWwmcG9zdF90eXBlPXByb2R1Y3QnKSksWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRjaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkYyk7CiAgICAgICRyWydwYWllc2thJ109Wydrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRjKV07IGZvcmVhY2goJElEUyBhcyAkaWQpICRyWydwYWllc2thJ11bJGlkXT0oYm9vbClwcmVnX21hdGNoKCcvcG9zdC0nLiRpZC4nXGIvJywkY2gpOwogICAgICAkaz13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX2hiJyx0aW1lKCksaG9tZV91cmwoJy9rYXRlZ29yaWphL2RhdWdpYXUtcGlnaWF1LycpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGtoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRrKTsKICAgICAgJHJbJ2RwX2thdCddPVsna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkayldOyBmb3JlYWNoKCRJRFMgYXMgJGlkKSAkclsnZHBfa2F0J11bJGlkXT0oYm9vbClwcmVnX21hdGNoKCcvcG9zdC0nLiRpZC4nXGIvJywka2gpOwogICAgICAkaGI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19oYj0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWydoYiddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoYik7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-153611';
const GKEY='ps_s1820f';
const PHASES=["2"];
const OUT='analize/s1820_f2.json';
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
