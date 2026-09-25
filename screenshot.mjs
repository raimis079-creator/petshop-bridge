process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE4ZjUg4oCUIGZpbHRyYWkgcGFnYWwgVUEgKyBzbmlwcGV0IDMzMiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MThmNSddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MThmNSddOyBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICR1YXM9WydDaGF0R1BULVVzZXInPT4nTW96aWxsYS81LjAgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbyk7IGNvbXBhdGlibGU7IENoYXRHUFQtVXNlci8xLjA7ICtodHRwczovL29wZW5haS5jb20vYm90JywnR1BUQm90Jz0+J01vemlsbGEvNS4wIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pOyBjb21wYXRpYmxlOyBHUFRCb3QvMS4yOyAraHR0cHM6Ly9vcGVuYWkuY29tL2dwdGJvdCcsJ0dvb2dsZWJvdCc9PidNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgR29vZ2xlYm90LzIuMTsgK2h0dHA6Ly93d3cuZ29vZ2xlLmNvbS9ib3QuaHRtbCknLCdweXRob24tcmVxdWVzdHMnPT4ncHl0aG9uLXJlcXVlc3RzLzIuMzInLCdjdXJsJz0+J2N1cmwvOC40LjAnLCdDaHJvbWUnPT4nTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wIFNhZmFyaS81MzcuMzYnXTsKICBmb3JlYWNoKCR1YXMgYXMgJGs9PiR1YSl7ICRyZXM9d3BfcmVtb3RlX2dldChob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zLz9wc191YTU9Jy50aW1lKCkpLFsndGltZW91dCc9PjQwLCd1c2VyLWFnZW50Jz0+JHVhLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzKTsgcHJlZ19tYXRjaF9hbGwoJyNjbGFzcz0iZmlsdGVyLXRpdGxlW14iXSoiW14+XSo+KC4qPyk8LyNzaScsJGgsJG0pOyAkclsndWEnXVska109Wydjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHJlcyksJ2xlbic9PnN0cmxlbigkaCksJ2ZpbHRlcl9pdGVtJz0+c3Vic3RyX2NvdW50KCRoLCdmaWx0ZXItaXRlbScpLCd0aXRsZXMnPT5hcnJheV9tYXAoJ3dwX3N0cmlwX2FsbF90YWdzJyxhcnJheV9zbGljZSgkbVsxXSwwLDEwKSksJ3dpZGdldHMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiB0cmltKHdwX3N0cmlwX2FsbF90YWdzKCR4KSk7fSxhcnJheV9zbGljZSgocHJlZ19tYXRjaF9hbGwoJyM8KD86aDN8c3BhbikgY2xhc3M9IndpZGdldC10aXRsZVteIl0qIltePl0qPiguKj8pPC8jc2knLCRoLCR3KT8kd1sxXTpbXSksMCw4KSldOyB9CiAgJGM9JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgaWQ9MzMyIik7ICRyWydzbmlwcGV0MzMyX2xlbiddPXN0cmxlbigkYyk7ICRyWydzbmlwcGV0MzMyX2hlYWQnXT1tYl9zdWJzdHIoJGMsMCwyNTAwKTsKICBwcmVnX21hdGNoX2FsbCgnIyhpc19ib3R8Ym90fGNyYXdsZXJ8SFRUUF9VU0VSX0FHRU5UfGlzX2FkbWlufHdwX2lzX21vYmlsZXxDT09LSUV8dHJhbnNpZW50fGNhY2hlKSNpJywkYywkbW0pOyAkclsnc25pcHBldDMzMl9yYWt0YWknXT1hcnJheV9jb3VudF92YWx1ZXMoYXJyYXlfbWFwKCdzdHJ0b2xvd2VyJywkbW1bMV0pKTsKICAkclsnc2lkZWJhcl93aWRnZXRzJ109Z2V0X29wdGlvbignc2lkZWJhcnNfd2lkZ2V0cycpWydzaG9wLXNpZGViYXInXT8/bnVsbDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LDEpOwo=';
const VER='dep-133146';
const GKEY='ps_s1718f5';
const PHASES=["1"];
const OUT='analize/s1718_f5.json';
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
