process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjcgciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBrYWlwIGtlacSNaWFtYXMgcHJla8SXcyBzYW5kxJdsaXMgYF9wc19zYW5kZWxpc2AgKGthdGFsb2dvIGtvcnRlbMSXKSwga2FpcCBgUGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmVgIHJlbmthIMWhYWx0aW7EryAoQVYgdnMgdGlla8SXamFzKSwga8SFIGRhcm8gVkYgc3luYyBzdSBgX3N0b2NrYC9gX3BzX3NhbmRlbGlzYCwgbGlrdcSNacWzIGxhdWthaS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcjExJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MjcgcicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDE1MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRnPWZ1bmN0aW9uKCRmaWxlLCRyZSwkbWF4PTQwKXsgaWYoIWZpbGVfZXhpc3RzKCRmaWxlKSkgcmV0dXJuIGFycmF5KCdOxJZSQSAnLmJhc2VuYW1lKCRmaWxlKSk7ICRMPWV4cGxvZGUoIlxuIiwoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRmaWxlKSk7ICRyPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJGs9PiRsKXsgaWYocHJlZ19tYXRjaCgkcmUsJGwpKSAkcltdPSgkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE5MCk7IGlmKGNvdW50KCRyKT49JG1heCkgYnJlYWs7IH0gcmV0dXJuICRyOyB9OwogICRvWydrYXRhbG9nYXNfc2FuZGVsaXMnXT0kZyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnLCcvX3BzX3NhbmRlbGlzfHNhbmRlbGlvX3Bhc2lyaW5rfFNhbmTEl2xpc3xzYW5kZWxpcy4qc2VsZWN0fGt1cl9neXZlbmEvaScsMzApOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmcCl7IGlmKHN0cnBvcygoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRmcCksJ2NsYXNzIFBldHNob3BfQVZfU291cmNlJykhPT1mYWxzZSl7ICRvWydzb3VyY2VfZmFpbGFzJ109YmFzZW5hbWUoJGZwKTsgJG9bJ3NvdXJjZSddPSRnKCRmcCwnL2Z1bmN0aW9uIHJlc29sdmV8X3BzX3NhbmRlbGlzfF9vd25fc3RvY2t8X3ZmX3F0eXxfemJfcXR5fF9zdG9ja3xzb3VyY2UuKj0+fHJldHVybiBhcnJheVwoIC5zb3VyY2UvaScsNDUpOyB9IH0KICAkb1snYXZfc3RvY2snXT0kZyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF2LXN0b2NrLnBocCcsJy9mdW5jdGlvbiBxdHl8ZnVuY3Rpb24gbGF1a2FzfF9vd25fc3RvY2t8X3BzX3NhbmRlbGlzfF9zdG9ja3xfdmZfcXR5L2knLDI1KTsKICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzLyoucGhwJykgYXMgJGZwKXsgJGM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkZnApOyBpZihzdHJwb3MoJGMsJ19wc19zYW5kZWxpcycpIT09ZmFsc2V8fHN0cnBvcygkYywnX293bl9zdG9jaycpIT09ZmFsc2UpeyAkb1sneG1sXycuYmFzZW5hbWUoJGZwKV09JGcoJGZwLCcvX3BzX3NhbmRlbGlzfF9vd25fc3RvY2t8X3ZmX3F0eXxzZXRfc3RvY2tfcXVhbnRpdHl8dXBkYXRlX3Bvc3RfbWV0YS4qX3N0b2NrL2knLDIwKTsgfSB9CiAgJG9bJ3B2el92Zl9zdV9hdiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsTEVGVChwLnBvc3RfdGl0bGUsNTApIG4scy5tZXRhX3ZhbHVlIHNhbmQsby5tZXRhX3ZhbHVlIG93bix2Lm1ldGFfdmFsdWUgdmYsc3QubWV0YV92YWx1ZSBzdG9jayBGUk9NIHskcH1wb3N0cyBwIEpPSU4geyRwfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHMubWV0YV92YWx1ZT0ndmYnIEpPSU4geyRwfXBvc3RtZXRhIG8gT04gby5wb3N0X2lkPXAuSUQgQU5EIG8ubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyBBTkQgby5tZXRhX3ZhbHVlKzA+MCBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIHYgT04gdi5wb3N0X2lkPXAuSUQgQU5EIHYubWV0YV9rZXk9J192Zl9xdHknIExFRlQgSk9JTiB7JHB9cG9zdG1ldGEgc3QgT04gc3QucG9zdF9pZD1wLklEIEFORCBzdC5tZXRhX2tleT0nX3N0b2NrJyBXSEVSRSBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBMSU1JVCA4IixBUlJBWV9BKTsKICAkb1sna2lla192Zl9zdV9vd24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgcyBKT0lOIHskcH1wb3N0bWV0YSBvIE9OIG8ucG9zdF9pZD1zLnBvc3RfaWQgQU5EIG8ubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyBBTkQgby5tZXRhX3ZhbHVlKzA+MCBXSEVSRSBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU8PidhdiciKTsKICAkb1sna2lla19hdl9zdV92ZiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBzIEpPSU4geyRwfXBvc3RtZXRhIHYgT04gdi5wb3N0X2lkPXMucG9zdF9pZCBBTkQgdi5tZXRhX2tleT0nX3ZmX3F0eScgV0hFUkUgcy5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgcy5tZXRhX3ZhbHVlPSdhdiciKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-153216';
const GKEY='ps_r11';
const PHASES=["R"];
const OUT='analize/s1627_r.json';
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
