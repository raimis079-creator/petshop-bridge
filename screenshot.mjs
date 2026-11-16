process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc0dDMga2Fzb3MgbnVvdHJhdWtvcyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzRjJ10pKSByZXR1cm47ICRyPVsndic9Pid0MycsJ3Nob3RzJz0+W11dOyBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICR1aWQ9NDQ7CiAgZGVsZXRlX3VzZXJfbWV0YSgkdWlkLCdfd29vY29tbWVyY2VfcGVyc2lzdGVudF9jYXJ0XycuZ2V0X2N1cnJlbnRfYmxvZ19pZCgpKTsKICAkclsnc2VzX2RlbCddPSR3cGRiLT5kZWxldGUoJHdwZGItPnByZWZpeC4nd29vY29tbWVyY2Vfc2Vzc2lvbnMnLFsnc2Vzc2lvbl9rZXknPT4oc3RyaW5nKSR1aWRdKTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgQU5EIENBU1QobS5tZXRhX3ZhbHVlIEFTIFNJR05FRCk+PTUgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBrIE9OIGsucG9zdF9pZD1wLklEIEFORCBrLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBDQVNUKGsubWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDIpKSBCRVRXRUVOIDEyIEFORCA0MCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIENBU1QobS5tZXRhX3ZhbHVlIEFTIFNJR05FRCkgREVTQyBMSU1JVCAzMCIpOwogICRwPVtdOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHg9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoJHggJiYgJHgtPmlzX3R5cGUoJ3NpbXBsZScpICYmICR4LT5pc19pbl9zdG9jaygpICYmICR4LT5oYXNfZW5vdWdoX3N0b2NrKDIpICYmIFBldHNob3BfUHJlbnVtZXJhdGFfS2F0YWxvZ2FzOjpnYWxpbWEoJGlkKSkgJHBbXT0oaW50KSRpZDsgaWYoY291bnQoJHApPj0yKSBicmVhazsgfQogICRyWydwcmVrZXMnXT0kcDsgJHJbJ3BhdiddPWFycmF5X21hcChmdW5jdGlvbigkaSl7ICR4PXdjX2dldF9wcm9kdWN0KCRpKTsgcmV0dXJuICR4LT5nZXRfbmFtZSgpLicgJy4keC0+Z2V0X3ByaWNlKCkuJyBBVj0nLmdldF9wb3N0X21ldGEoJGksJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsgfSwkcCk7CiAgJGV4cD10aW1lKCkrMypIT1VSX0lOX1NFQ09ORFM7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICRyWydjb29raWVzJ109W1snbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spLCdkb21haW4nPT4ncGV0c2hvcC5sdCddLFsnbmFtZSc9Pidwc19qcycsJ3ZhbHVlJz0+JzEnLCdkb21haW4nPT4ncGV0c2hvcC5sdCddXTsKICAkVz0zOTA7CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfYzAnLCd1Jz0+aG9tZV91cmwoJy8/dD0nLnRpbWUoKSksJ3cnPT4kVywnaCc9PjYwMF07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfYzEnLCd1Jz0+aG9tZV91cmwoJy8/YWRkLXRvLWNhcnQ9Jy4kcFswXS4nJnF1YW50aXR5PTEnKSwndyc9PiRXLCdoJz0+NjAwXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg3NF9jMicsJ3UnPT5ob21lX3VybCgnLz9hZGQtdG8tY2FydD0nLiRwWzFdLicmcXVhbnRpdHk9MScpLCd3Jz0+JFcsJ2gnPT42MDBdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0X2MzX2tyZXBzZWxpcycsJ3UnPT53Y19nZXRfY2FydF91cmwoKSwndyc9PiRXLCdoJz0+MTUwMCwnZXZhbCc9PiIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BzLXByZW4nKXx8e30pLmlubmVyVGV4dHx8J05FUkEgQkxPS08nIl07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfYzRfa2FzYScsJ3UnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCksJ3cnPT4kVywnaCc9PjQyMDAsJ2Z1bGwnPT4xLCdldmFsJz0+Im5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQoKCk9PnIoWyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHMtcHJlbi1zYWx5Z29zJyl8fHt9KS5pbm5lclRleHR8fCdORVJBIFNBTFlHVScsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcy1wcmVuLXN1dGlraW1hcycpfHx7fSkuaW5uZXJUZXh0fHwnTkVSQSBWQVJORUxFUycsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcy1wcmVuLXBhc2t5cmEnKXx8e30pLmlubmVyVGV4dHx8Jy0nLCgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BheW1lbnQnKXx8e30pLmlubmVyVGV4dHx8JycpLnNsaWNlKDAsNDAwKV0uam9pbignIHx8ICcpKSw0MDAwKSkiXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2tsYWlkYSddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCAxKTsK';
const VER='dep-220024';
const GKEY='ps_s1874c';
const PHASES=["GO"];
const OUT='analize/s1874_t3.json';
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
