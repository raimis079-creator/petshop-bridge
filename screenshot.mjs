process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2YWkgQUkgcm9ib3RhaSBpciBzdHJ1a3TFq3JpbmlhaSBkdW9tZW55cyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MTZhaSddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE4MTZhaSddOyAkSD1BQlNQQVRIOwogICRyWydyb2JvdHNfdHh0J109aXNfZmlsZSgkSC4ncm9ib3RzLnR4dCcpP2ZpbGVfZ2V0X2NvbnRlbnRzKCRILidyb2JvdHMudHh0Jyk6J25lcmEgZmFpbG8gKGRpbmFtaW5pcyknOwogICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9yb2JvdHMudHh0JyksWyd0aW1lb3V0Jz0+MTVdKTsgJHJbJ3JvYm90c19saXZlJ109c3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSwwLDI1MDApOwogICRodD1maWxlX2dldF9jb250ZW50cygkSC4nLmh0YWNjZXNzJyk7ICRyWydodGFjY2Vzc19ib3RzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJGh0KSxmbigkbCk9PnByZWdfbWF0Y2goJy9HUFR8T0FJfENsYXVkZXxhbnRocm9waWN8UGVycGxleGl0eXxCeXRlc3BpZGVyfENDQm90fEdvb2dsZS1FeHRlbmRlZHxVc2VyLUFnZW50fEhUVFBfVVNFUl9BR0VOVC9pJywkbCkpKTsKICAkclsnYWlfcGx1Z2lucyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfa2V5cyhnZXRfcGx1Z2lucygpKSxmbigkcCk9PnByZWdfbWF0Y2goJy9ib3R8YmxvY2t8c2VjdXJpdHl8d29yZGZlbmNlfGNsb3VkZmxhcmV8ZmlyZXdhbGx8cm9ib3RzfHNlby9pJywkcCkpKTsKICAkclsnYWN0aXZlJ109Z2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsKICAkclsnb3B0X2Jsb2dfcHVibGljJ109Z2V0X29wdGlvbignYmxvZ19wdWJsaWMnKTsKICAvLyBVQSB0ZXN0YWkgaSBwcmVrZQogICR1cmw9aG9tZV91cmwoJy9wcm9kdWN0L2V4Y2x1c2lvbi1oeXBvYWxsZXJnZW5pYy1zYXVzYXMtc3VudS1tYWlzdGFzLXN1LWtpYXVsaWVuYS1pci16aXJuZWxpYWlzLW0tbC0xMi1rZy8nKTsKICBmb3JlYWNoKFsnT0FJLVNlYXJjaEJvdCc9PidNb3ppbGxhLzUuMCBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKTsgY29tcGF0aWJsZTsgT0FJLVNlYXJjaEJvdC8xLjA7ICtodHRwczovL29wZW5haS5jb20vc2VhcmNoYm90JywnQ2hhdEdQVC1Vc2VyJz0+J01vemlsbGEvNS4wIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pOyBjb21wYXRpYmxlOyBDaGF0R1BULVVzZXIvMS4wOyAraHR0cHM6Ly9vcGVuYWkuY29tL2JvdCcsJ0dQVEJvdCc9PidNb3ppbGxhLzUuMCBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKTsgY29tcGF0aWJsZTsgR1BUQm90LzEuMjsgK2h0dHBzOi8vb3BlbmFpLmNvbS9ncHRib3QnLCdQZXJwbGV4aXR5Qm90Jz0+J01vemlsbGEvNS4wIChjb21wYXRpYmxlOyBQZXJwbGV4aXR5Qm90LzEuMDsgK2h0dHBzOi8vcGVycGxleGl0eS5haS9wZXJwbGV4aXR5Ym90KScsJ0NsYXVkZUJvdCc9PidNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgQ2xhdWRlQm90LzEuMDsgK2NsYXVkZWJvdEBhbnRocm9waWMuY29tKScsJ0dvb2dsZS1FeHRlbmRlZCc9PidNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgR29vZ2xlLUV4dGVuZGVkKScsJ25hcnN5a2xlJz0+J01vemlsbGEvNS4wIChMaW51eDsgQW5kcm9pZCAxMykgQXBwbGVXZWJLaXQvNTM3LjM2IENocm9tZS8xMjAgTW9iaWxlIFNhZmFyaS81MzcuMzYnXSBhcyAkbj0+JHVhKXsKICAgICR4PXdwX3JlbW90ZV9nZXQoJHVybCxbJ3RpbWVvdXQnPT4yMCwnaGVhZGVycyc9PlsnVXNlci1BZ2VudCc9PiR1YV0sJ3JlZGlyZWN0aW9uJz0+MF0pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRjb2RlPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KTsKICAgIHByZWdfbWF0Y2hfYWxsKCcjPHNjcmlwdCB0eXBlPSJhcHBsaWNhdGlvbi9sZFwranNvbiJbXj5dKj4oLio/KTwvc2NyaXB0PiNzJywkYiwkbSk7ICR0eXBlcz1bXTsgJHByb2Q9bnVsbDsgZm9yZWFjaCgkbVsxXSBhcyAkail7ICRkPWpzb25fZGVjb2RlKCRqLHRydWUpOyAkaXRlbXM9aXNzZXQoJGRbJ0BncmFwaCddKT8kZFsnQGdyYXBoJ106WyRkXTsgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsgaWYoIWlzX2FycmF5KCRpdCkpIGNvbnRpbnVlOyAkdD0kaXRbJ0B0eXBlJ10/PycnOyAkdHlwZXNbXT1pc19hcnJheSgkdCk/aW1wbG9kZSgnLycsJHQpOiR0OyBpZihpbl9hcnJheSgnUHJvZHVjdCcsKGFycmF5KSR0KSkgJHByb2Q9JGl0OyB9IH0KICAgICRyWyd1YSddWyRuXT1bJ2h0dHAnPT4kY29kZSwnZHlkaXMnPT5zdHJsZW4oJGIpLCdsZF90aXBhaSc9PiR0eXBlcywneXJhX2thaW5hJz0+c3RycG9zKCRiLCc3OSw5MCcpIT09ZmFsc2V8fHN0cnBvcygkYiwnNzkuOTAnKSE9PWZhbHNlLCd0aXRsZSc9PnByZWdfbWF0Y2goJyM8dGl0bGU+KFtePF0qKSMnLCRiLCR0KT9odG1sX2VudGl0eV9kZWNvZGUoJHRbMV0pOicnXTsKICAgIGlmKCRwcm9kJiYhaXNzZXQoJHJbJ3Byb2R1Y3RfbGQnXSkpeyAkclsncHJvZHVjdF9sZCddPVsnbmFtZSc9PiRwcm9kWyduYW1lJ10/P251bGwsJ3NrdSc9PiRwcm9kWydza3UnXT8/bnVsbCwnZ3Rpbic9PiRwcm9kWydndGluMTMnXT8/JHByb2RbJ2d0aW4nXT8/bnVsbCwnYnJhbmQnPT4kcHJvZFsnYnJhbmQnXVsnbmFtZSddPz8kcHJvZFsnYnJhbmQnXT8/bnVsbCwnb2ZmZXJzJz0+aXNfYXJyYXkoJHByb2RbJ29mZmVycyddPz9udWxsKT9hcnJheV9pbnRlcnNlY3Rfa2V5KCRwcm9kWydvZmZlcnMnXSxhcnJheV9mbGlwKFsncHJpY2UnLCdwcmljZUN1cnJlbmN5JywnYXZhaWxhYmlsaXR5JywndXJsJywncHJpY2VWYWxpZFVudGlsJ10pKTpudWxsLCdpbWFnZSc9Pmlzc2V0KCRwcm9kWydpbWFnZSddKT8xOjAsJ2Rlc2NyaXB0aW9uJz0+aXNzZXQoJHByb2RbJ2Rlc2NyaXB0aW9uJ10pP3N0cmxlbigkcHJvZFsnZGVzY3JpcHRpb24nXSk6MCwnYWdncmVnYXRlUmF0aW5nJz0+aXNzZXQoJHByb2RbJ2FnZ3JlZ2F0ZVJhdGluZyddKT8xOjBdOyB9CiAgfQogIC8vIHNpdGVtYXAKICAkeD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvc2l0ZW1hcC54bWwnKSxbJ3RpbWVvdXQnPT4xNSwncmVkaXJlY3Rpb24nPT4yXSk7ICRyWydzaXRlbWFwJ109W3dwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSxzdWJzdHIoc3RyaXBfdGFncyh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCkpLDAsMzAwKV07CiAgLy8gbGxtcy50eHQKICAkeD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvbGxtcy50eHQnKSxbJ3RpbWVvdXQnPT4xMCwncmVkaXJlY3Rpb24nPT4wXSk7ICRyWydsbG1zX3R4dCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KTsKICAvLyBhY2Nlc3MgbG9nOiBBSSBib3R1IHV6a2xhdXNvcyBwZXIgcGFza3V0aW5lcyBkaWVuYXMKICAkbGc9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzLyc7ICRjbnQ9W107IGZvcmVhY2goZ2xvYigkbGcuJ05vdi0yMDI2LnRhci5neionKSBhcyAkZil7ICR0PUBnemRlY29kZShmaWxlX2dldF9jb250ZW50cygkZikpOyBpZighJHQpIGNvbnRpbnVlOyBmb3JlYWNoKFsnR1BUQm90JywnT0FJLVNlYXJjaEJvdCcsJ0NoYXRHUFQtVXNlcicsJ1BlcnBsZXhpdHlCb3QnLCdDbGF1ZGVCb3QnLCdDbGF1ZGUtVXNlcicsJ0dvb2dsZS1FeHRlbmRlZCcsJ0J5dGVzcGlkZXInLCdBbWF6b25ib3QnLCdBcHBsZWJvdCcsJ21ldGEtZXh0ZXJuYWxhZ2VudCddIGFzICRiKXsgJGM9c3Vic3RyX2NvdW50KCR0LCRiKTsgaWYoJGMpICRjbnRbJGJdPSgkY250WyRiXT8/MCkrJGM7IH0gfQogICRyWydsb2dfYWlfYm90YWlfbGFwa3JpdGlzJ109JGNudDsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-122432';
const GKEY='ps_s1816ai';
const PHASES=["1"];
const OUT='analize/s1816_ai.json';
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
