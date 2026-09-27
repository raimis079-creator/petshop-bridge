process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI4bW4gcmVhZC1vbmx5OiBuZW1va2FtbyBwcmlzdGF0eW1vIGp1b3N0YSDigJQga2FpcCBwYWRhcnl0YSBkYWJhciAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjhtbiddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MjhtbiddOwogIHRyeXsKICAgICRmPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7ICR0PWZpbGUoJGYpOyAkclsnZnVuY3Rpb25zX21kNSddPW1kNV9maWxlKCRmKTsKICAgICRvPVtdOyBmb3JlYWNoKCR0IGFzICRpPT4kbCl7IGlmKHN0cmlwb3MoJGwsJ2ZyZWVfc2hpcHBpbmdfcHJvZ3Jlc3MnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ25lbW9rYW0nKSE9PWZhbHNlKSAkb1tdPSgkaSsxKS4nOiAnLnJ0cmltKCRsKTsgfSAkclsnZWlsdXRlcyddPWFycmF5X3NsaWNlKCRvLDAsNDApOwogICAgLy8gZnVua2Npam9zIGtvZGFzCiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfZnJlZV9zaGlwcGluZ19wcm9ncmVzcycpKXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJ3BldHNob3BfZnJlZV9zaGlwcGluZ19wcm9ncmVzcycpOyAkclsnZm4nXT1bJ251byc9PiRyZi0+Z2V0U3RhcnRMaW5lKCksJ2lraSc9PiRyZi0+Z2V0RW5kTGluZSgpLCdrb2Rhcyc9PmltcGxvZGUoJycsYXJyYXlfc2xpY2UoJHQsJHJmLT5nZXRTdGFydExpbmUoKS0xLCRyZi0+Z2V0RW5kTGluZSgpLSRyZi0+Z2V0U3RhcnRMaW5lKCkrMSkpXTsgfQogICAgZ2xvYmFsICR3cF9maWx0ZXI7ICRrdXI9W107IGZvcmVhY2goJHdwX2ZpbHRlciBhcyAkaD0+JHcpeyBmb3JlYWNoKCR3LT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgaWYoaXNfc3RyaW5nKCRmbikgJiYgc3RyaXBvcygkZm4sJ2ZyZWVfc2hpcHBpbmcnKSE9PWZhbHNlKSAka3VyW109JGguJzonLiRwci4nOicuJGZuOyBpZihpc19hcnJheSgkZm4pKXsgJG49KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV07IGlmKHN0cmlwb3MoJG4sJ2ZyZWUnKSE9PWZhbHNlfHxzdHJpcG9zKCRuLCdqdW9zdCcpIT09ZmFsc2UpICRrdXJbXT0kaC4nOicuJHByLic6Jy4kbjsgfSB9IH0gJHJbJ2hvb2tzJ109JGt1cjsKICAgIGZvcmVhY2goWyd3b29jb21tZXJjZV9iZWZvcmVfY2FydCcsJ3dvb2NvbW1lcmNlX2JlZm9yZV9jYXJ0X3RhYmxlJywnd29vY29tbWVyY2VfY2FydF90b3RhbHNfYmVmb3JlX29yZGVyX3RvdGFsJywnd29vY29tbWVyY2VfcHJvY2VlZF90b19jaGVja291dCcsJ3dvb2NvbW1lcmNlX2FmdGVyX2NhcnRfdG90YWxzJywnd29vY29tbWVyY2VfYWZ0ZXJfY2FydCcsJ3dvb2NvbW1lcmNlX3dpZGdldF9zaG9wcGluZ19jYXJ0X2JlZm9yZV9idXR0b25zJywnd29vY29tbWVyY2VfYmVmb3JlX21pbmlfY2FydCcsJ3dvb2NvbW1lcmNlX2NhcnRfY29sbGF0ZXJhbHMnLCd3b29jb21tZXJjZV9hZnRlcl9jYXJ0X3RhYmxlJywnd29vY29tbWVyY2VfYmVmb3JlX2NoZWNrb3V0X2Zvcm0nLCd3b29jb21tZXJjZV9yZXZpZXdfb3JkZXJfYmVmb3JlX3NoaXBwaW5nJ10gYXMgJGgpeyAkbz1bXTsgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgJG49aXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTooaXNfc3RyaW5nKCRmbik/JGZuOidjbG9zdXJlJyk7IGlmKCRuPT09J2Nsb3N1cmUnKXsgdHJ5eyRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmbik7ICRuPSdjbG9zdXJlQCcuYmFzZW5hbWUoJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTt9Y2F0Y2goVGhyb3dhYmxlICRlKXt9IH0gJG9bXT0kcHIuJzonLiRuOyB9ICRyWydjYXJ0X2hvb2tzJ11bJGhdPSRvOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-221029';
const GKEY='ps_s1728mn';
const PHASES=["1"];
const OUT='analize/s1728_mn.json';
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
