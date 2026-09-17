process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHYg4oCUIERJQUdOT1rEliAzOiBuZXBhdnlrdXNpxbMga2Fzb3MgYmFuZHltxbMgxb5pbmdzbmlhaSArIHJ5dG8gYXTFoWF1a3TFsyBQYXlzZXJhIHXFvnNha3ltxbMgcGFzdGFib3MuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODlzdiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJGZzPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MvcGxhY2Utb3JkZXItZGVidWctKicuZGF0ZSgnWS1tLWQnKS4nKicpPzphcnJheSgpOyB1c29ydCgkZnMsZnVuY3Rpb24oJGEsJGIpe3JldHVybiBmaWxlbXRpbWUoJGIpLWZpbGVtdGltZSgkYSk7fSk7CiAgZm9yZWFjaChhcnJheV9zbGljZSgkZnMsMCwzKSBhcyAkZil7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgcHJlZ19tYXRjaF9hbGwoJy8oXGRcZDpcZFxkOlxkXGQpXCswMDowMCAoXHcrKSBcW1teXF1dKlxdIChbXntdKykvJywkdCwkbSxQUkVHX1NFVF9PUkRFUik7ICRvWyd6aW5nc25pYWknXVtiYXNlbmFtZSgkZiwnLmxvZycpXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsxXS4nICcuJHhbMl0uJyAnLnRyaW0oJHhbM10pO30sJG0pOyBwcmVnX21hdGNoX2FsbCgnLyIoZXJyb3J8bWVzc2FnZXxub3RpY2V8cmVhc29uKSI6IihbXiJdezAsMjAwfSkvJywkdCwkZSxQUkVHX1NFVF9PUkRFUik7ICRvWydrbGFpZG9zJ11bYmFzZW5hbWUoJGYsJy5sb2cnKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbMV0uJzogJy4keFsyXTt9LCRlKSwwLDUpOyB9CiAgZm9yZWFjaChhcnJheSgzNTk5NiwzNTk5NywzNTk5OCwzNTk5OSwzNjAwMCwzNjAwMSkgYXMgJGlkKXsgJG9yZD13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvcmQpY29udGludWU7ICRuPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29tbWVudF9jb250ZW50IEZST00geyRwfWNvbW1lbnRzIFdIRVJFIGNvbW1lbnRfcG9zdF9JRD0lZCBBTkQgY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBPUkRFUiBCWSBjb21tZW50X0lEIiwkaWQpKTsgJG9bJ3J5dGFzJ11bJGlkXT1hcnJheSgnZW1haWxfaGFzaCc9PnN1YnN0cihtZDUoJG9yZC0+Z2V0X2JpbGxpbmdfZW1haWwoKSksMCw2KSwnZGV2Jz0+JG9yZC0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9kZXZpY2VfdHlwZScpLCdzcmMnPT4kb3JkLT5nZXRfbWV0YSgnX3djX29yZGVyX2F0dHJpYnV0aW9uX3V0bV9zb3VyY2UnKSwnaXRlbXMnPT5pbXBsb2RlKCcsICcsYXJyYXlfbWFwKGZ1bmN0aW9uKCRpKXtyZXR1cm4gJGktPmdldF9uYW1lKCk7fSwkb3JkLT5nZXRfaXRlbXMoKSkpLCdub3Rlcyc9PmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkeCksMCw5MCk7fSwkbikpOyB9CiAgJG9bJ3J5dGFzX3Nla21pbmdhc18zNTk5NV9oYXNoJ109c3Vic3RyKG1kNSh3Y19nZXRfb3JkZXIoMzU5OTUpLT5nZXRfYmlsbGluZ19lbWFpbCgpKSwwLDYpOyAkb1snMzYwMDVfaGFzaCddPXN1YnN0cihtZDUod2NfZ2V0X29yZGVyKDM2MDA1KS0+Z2V0X2JpbGxpbmdfZW1haWwoKSksMCw2KTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-151638';
const GKEY='ps_s1689sv';
const PHASES=["GO"];
const OUT='analize/s1689s_v.json';
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
