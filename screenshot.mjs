process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkyeCBWZW5pcGFrIGxhdWtvIERPTSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4OTJ4J10pKSByZXR1cm47ICRyPVsndic9Pid4MScsJ3Nob3RzJz0+W11dOyBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgJHVpZD00NDsgZGVsZXRlX3VzZXJfbWV0YSgkdWlkLCdfd29vY29tbWVyY2VfcGVyc2lzdGVudF9jYXJ0XycuZ2V0X2N1cnJlbnRfYmxvZ19pZCgpKTsgJHdwZGItPmRlbGV0ZSgkd3BkYi0+cHJlZml4Lid3b29jb21tZXJjZV9zZXNzaW9ucycsWydzZXNzaW9uX2tleSc9PihzdHJpbmcpJHVpZF0pOwogICAgJGV4cD10aW1lKCkrMypIT1VSX0lOX1NFQ09ORFM7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICAgJHJbJ2Nvb2tpZXMnXT1bWyduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvayksJ2RvbWFpbic9PidwZXRzaG9wLmx0J10sWyduYW1lJz0+J3BzX2pzJywndmFsdWUnPT4nMScsJ2RvbWFpbic9PidwZXRzaG9wLmx0J10sWyduYW1lJz0+J2NtcGx6X2Jhbm5lci1zdGF0dXMnLCd2YWx1ZSc9PidkaXNtaXNzZWQnLCdkb21haW4nPT4ncGV0c2hvcC5sdCddXTsKICAgICRldj08PDwnSlMnCm5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQoKCk9PnsgY29uc3Qgb3V0PXt9OyBjb25zdCBsaT1bLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3NoaXBwaW5nX21ldGhvZCBsaScpXS5maW5kKGw9Pi9hdHNpL2kudGVzdChsLmlubmVyVGV4dCkpOyBpZighbGkpe3IoJ05FUkEnKTtyZXR1cm47fQogY29uc3QgZWxzPVsuLi5saS5xdWVyeVNlbGVjdG9yQWxsKCcqJyldLmZpbHRlcihlPT57Y29uc3QgYz1nZXRDb21wdXRlZFN0eWxlKGUpOyByZXR1cm4gL3JnYlwoKDFbMC05XXsyfXxbNS05XVswLTldKSwgPyhcZHsxLDJ9fDFbMC00XVxkKSwgPygyXGR7Mn18MVs1LTldXGQpXCkvLnRlc3QoYy5ib3JkZXJUb3BDb2xvcitjLm91dGxpbmVDb2xvcitjLmNvbG9yKSAmJiAocGFyc2VGbG9hdChjLmJvcmRlclRvcFdpZHRoKT4wfHxlLnRhZ05hbWU9PT0nU0VMRUNUJyk7fSk7CiBvdXQuZWxzPWVscy5zbGljZSgwLDgpLm1hcChlPT4oe3RhZzplLnRhZ05hbWUsaWQ6ZS5pZCxjbHM6ZS5jbGFzc05hbWUmJmUuY2xhc3NOYW1lLnRvU3RyaW5nKCkuc2xpY2UoMCwxMjApLGJvcmRlcjpnZXRDb21wdXRlZFN0eWxlKGUpLmJvcmRlcixvdXRsaW5lOmdldENvbXB1dGVkU3R5bGUoZSkub3V0bGluZSxzaGFkb3c6Z2V0Q29tcHV0ZWRTdHlsZShlKS5ib3hTaGFkb3cuc2xpY2UoMCw4MCl9KSk7CiBvdXQuaHRtbD1saS5pbm5lckhUTUwucmVwbGFjZSgvPG9wdGlvbltcc1xTXSo/PFwvb3B0aW9uPi9nLCcnKS5yZXBsYWNlKC9ccysvZywnICcpLnNsaWNlKDAsMTgwMCk7CiBjb25zdCBydWxlcz1bXTsgZm9yKGNvbnN0IHMgb2YgZG9jdW1lbnQuc3R5bGVTaGVldHMpeyBsZXQgcnM7IHRyeXtycz1zLmNzc1J1bGVzfWNhdGNoKGUpe2NvbnRpbnVlfSBmb3IoY29uc3QgcnUgb2YgcnMpeyBjb25zdCB0PXJ1LmNzc1RleHR8fCcnOyBpZigvdmVuaXBha3xzZWxlY3QyL2kudGVzdCh0KSAmJiAvYm9yZGVyfG91dGxpbmV8c2hhZG93L2kudGVzdCh0KSAmJiAvI1swLTlhLWZdezMsNn18cmdiL2kudGVzdCh0KSkgcnVsZXMucHVzaCgocy5ocmVmfHwnaW5saW5lJykuc3BsaXQoJy8nKS5zbGljZSgtMikuam9pbignLycpLnNsaWNlKDAsNjApKycgOjogJyt0LnNsaWNlKDAsMjYwKSk7IH0gfQogb3V0LnJ1bGVzPXJ1bGVzLnNsaWNlKDAsMjUpOyByKEpTT04uc3RyaW5naWZ5KG91dCkpOyB9LDQ1MDApKQpKUzsKICAgICRyWydzaG90cyddW109WyduJz0+J3MxODkyXzAnLCd1Jz0+aG9tZV91cmwoJy8/dD0nLnRpbWUoKSksJ3cnPT4zOTAsJ2gnPT40MDBdOwogICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTJfMScsJ3UnPT5ob21lX3VybCgnLz9hZGQtdG8tY2FydD0xNjk1MCZxdWFudGl0eT0xJyksJ3cnPT4zOTAsJ2gnPT40MDBdOwogICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTJfcHJpZXNfdGVsJywndSc9PndjX2dldF9jaGVja291dF91cmwoKS4nP2E9MScsJ3cnPT4zOTAsJ2gnPT4yNDAwLCdmdWxsJz0+MSwnZXZhbCc9PiRldl07CiAgICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg5Ml9wcmllc19wYycsJ3UnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCkuJz9hPTInLCd3Jz0+MTM2NiwnaCc9PjE1MDAsJ2Z1bGwnPT4xXTsKICAgICRyWydjdXN0b21fY3NzX2xlbiddPXN0cmxlbigoc3RyaW5nKXdwX2dldF9jdXN0b21fY3NzKCkpOyAkclsnZmxhdHNvbWVfY3NzX2xlbiddPXN0cmxlbigoc3RyaW5nKWdldF90aGVtZV9tb2QoJ2h0bWxfY3VzdG9tX2NzcycpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-203422';
const GKEY='ps_s1892x';
const PHASES=["GO"];
const OUT='analize/s1892_x.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
