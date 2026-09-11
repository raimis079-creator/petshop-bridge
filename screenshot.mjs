process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzUgcnVuIGgg4oCUIDM6IHBzX2Jha19hcmNoIGd6IHBlcmvEl2xpbWFzIHXFviB3ZWJyb290OyA0OiB3cC1jb25maWcgUEhQIGtsYWlkxbMgxb51cm5hbGFzIChkaXNwbGF5X2Vycm9ycyAwLCBsb2dfZXJyb3JzIDEsIGVycm9yX2xvZyBsb2dzL3BocF9lcnJvci5sb2cpLiBEUlkvQVBQTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2g1J10pKSByZXR1cm47ICRmPSRfR0VUWydwc19oNSddOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc1IGgnLCdmYXplJz0+JGYpOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkaG9tZT1kaXJuYW1lKEFCU1BBVEgpOyAkYXJjaD0kaG9tZS4nL3BzLWFyY2h5dmFzJzsgJHNyYz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHNfYmFrX2FyY2hfMjAyNjA5MDkuanNvbi5neic7CiAgJG9bJ2FyY2gnXT1hcnJheSgnc3JjJz0+ZmlsZV9leGlzdHMoJHNyYyk/ZmlsZXNpemUoJHNyYyk6J05FUkEnLCdkZXN0X2Rpcic9PiRhcmNoLCdob21lX3dyaXRhYmxlJz0+aXNfd3JpdGFibGUoJGhvbWUpLCdsb2dzX2Rpcic9PmlzX2RpcigkaG9tZS4nL2xvZ3MnKT8oaXNfd3JpdGFibGUoJGhvbWUuJy9sb2dzJyk/J3JhxaFvbWFzJzonbmVyYcWhb21hcycpOidORVJBJyk7CiAgJGNmZz1BQlNQQVRILid3cC1jb25maWcucGhwJzsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGNmZyk7ICRvWydjZmcnXT1hcnJheSgnbWQ1Jz0+bWQ1KCRjKSwndHVyaV9ibG9rYSc9PihpbnQpKHN0cnBvcygkYywnUzE2NzUnKSE9PWZhbHNlKSwnaW5rYXJhcyc9PihpbnQpKHN0cnBvcygkYywiZGVmaW5lKCdXUF9ERUJVR19ESVNQTEFZJywgZmFsc2UpOyIpIT09ZmFsc2UpLCdpbmlfZGFiYXInPT5hcnJheSgnZGlzcGxheSc9PmluaV9nZXQoJ2Rpc3BsYXlfZXJyb3JzJyksJ2xvZyc9PmluaV9nZXQoJ2xvZ19lcnJvcnMnKSwnZmlsZSc9PmluaV9nZXQoJ2Vycm9yX2xvZycpKSk7CiAgaWYoJGY9PT0nQVBQTFknKXsKICAgIGlmKCFpc19kaXIoJGFyY2gpKSBta2RpcigkYXJjaCwwNzAwKTsgaWYoZmlsZV9leGlzdHMoJHNyYykpeyAkb1snYXJjaCddWydtb3ZlZCddPXJlbmFtZSgkc3JjLCRhcmNoLicvcHNfYmFrX2FyY2hfMjAyNjA5MDkuanNvbi5neicpOyAkb1snYXJjaCddWydkZXN0X21kNSddPW1kNV9maWxlKCRhcmNoLicvcHNfYmFrX2FyY2hfMjAyNjA5MDkuanNvbi5neicpOyB9CiAgICAkb1snYXJjaCddWydodHRwX3BvJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnL3dwLWNvbnRlbnQvdXBsb2Fkcy9wc19iYWtfYXJjaF8yMDI2MDkwOS5qc29uLmd6JyksYXJyYXkoJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgICBpZighJG9bJ2NmZyddWyd0dXJpX2Jsb2thJ10gJiYgJG9bJ2NmZyddWydpbmthcmFzJ10pewogICAgICAkYmxrPSJkZWZpbmUoJ1dQX0RFQlVHX0RJU1BMQVknLCBmYWxzZSk7XG4vLyBTMTY3NSAoMjAyNi0wOS0xMik6IFBIUCBrbGFpZMWzIMW+dXJuYWxhcyB1xb4gd2Vicm9vdDsga2xhaWRvcyBsYW5reXRvamFtcyBuZXJvZG9tb3NcbkBpbmlfc2V0KCdkaXNwbGF5X2Vycm9ycycsICcwJyk7XG5AaW5pX3NldCgnbG9nX2Vycm9ycycsICcxJyk7XG5AaW5pX3NldCgnZXJyb3JfbG9nJywgZGlybmFtZShfX0RJUl9fKSAuICcvbG9ncy9waHBfZXJyb3IubG9nJyk7XG4iOwogICAgICAkbj1zdHJfcmVwbGFjZSgiZGVmaW5lKCdXUF9ERUJVR19ESVNQTEFZJywgZmFsc2UpO1xuIiwkYmxrLCRjLCRjbnQpOyAkb1snY2ZnJ11bJ3Bha2VpdGltYWknXT0kY250OwogICAgICB0cnl7IHRva2VuX2dldF9hbGwoJG4sVE9LRU5fUEFSU0UpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ2NmZyddWydzdG9wJ109J3BhcnNlJzsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgY29weSgkY2ZnLCRhcmNoLicvd3AtY29uZmlnLnBocC5iYWtfczE2NzUnKTsgZmlsZV9wdXRfY29udGVudHMoJGNmZywkbik7ICRvWydjZmcnXVsnaXJhc3l0YSddPW1kNV9maWxlKCRjZmcpOwogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJG9bJ3BpbmcnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7IGlmKCRvWydwaW5nJ10+PTUwMCl7IGNvcHkoJGFyY2guJy93cC1jb25maWcucGhwLmJha19zMTY3NScsJGNmZyk7ICRvWydyb2xsYmFjayddPTE7IH0KICAgIH0KICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-220700';
const GKEY='ps_h5';
const PHASES=["APPLY"];
const OUT='analize/s1675_h2.json';
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
