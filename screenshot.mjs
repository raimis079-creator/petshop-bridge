process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwcSBtb2JpbHVzIGtlbGlhcyAyICgxIHNob3RzKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDBxJ10pKSByZXR1cm47ICRyPVsndic9PidTMTc0MHEnXTsgJE09MzkwOyAkSD04NDQ7ICRQPWdldF9wZXJtYWxpbmsoMTg1ODcpOwogICRjaz0iKCgpPT57Y29uc3QgcT1zPT5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHMpO2NvbnN0IHQ9ZT0+ZT9NYXRoLnJvdW5kKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTpudWxsO2NvbnN0IGlucz1bLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybS5jaGVja291dCBpbnB1dCwgZm9ybS5jaGVja291dCBzZWxlY3QsIGZvcm0uY2hlY2tvdXQgdGV4dGFyZWEnKV0uZmlsdGVyKGU9PmUudHlwZSE9PSdoaWRkZW4nJiZlLm9mZnNldFBhcmVudCk7cmV0dXJuIHtoOmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsbGF1a3U6aW5zLmxlbmd0aCxsYXVrYWk6aW5zLm1hcChlPT4oZS5uYW1lfHxlLmlkKSsnOicrZS50eXBlKyhlLnJlcXVpcmVkfHxlLmNsb3Nlc3QoJy52YWxpZGF0ZS1yZXF1aXJlZCcpPycqJzonJykrKGUuZ2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnKT8nLycrZS5nZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScpOicnKSsnQCcrdChlKSkuc2xpY2UoMCw0NSkscHJpc3RhdHltb19idWRhaTpbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3NoaXBwaW5nX21ldGhvZCBsaSwgLndvb2NvbW1lcmNlLXNoaXBwaW5nLW1ldGhvZHMgbGknKV0ubWFwKGU9PmUuaW5uZXJUZXh0LnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csJyAnKS5zbGljZSgwLDgwKSksbW9rZWppbW9fYnVkYWk6Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53Y19wYXltZW50X21ldGhvZHMgPiBsaScpXS5tYXAoZT0+ZS5pbm5lclRleHQudHJpbSgpLnJlcGxhY2UoL1xccysvZywnICcpLnNsaWNlKDAsOTApKSxteWd0dWthczp0KHEoJyNwbGFjZV9vcmRlcicpKSxteWd0dWtvX3Rla3N0YXM6KHEoJyNwbGFjZV9vcmRlcicpfHx7fSkuaW5uZXJUZXh0fHxudWxsLHRhaXN5a2xlczohIXEoJyN0ZXJtcycpLHByaXNpanVuZ2ltb19ibG9rYXM6ISFxKCcud29vY29tbWVyY2UtZm9ybS1sb2dpbi10b2dnbGUnKSxrdXBvbmFzOiEhcSgnLndvb2NvbW1lcmNlLWZvcm0tY291cG9uLXRvZ2dsZScpLHBhc2t5cmE6KHEoJyNjcmVhdGVhY2NvdW50Jyl8fHt9KS5jaGVja2VkLHV6c2FreW1vX3N1dmVzdGluZTp0KHEoJyNvcmRlcl9yZXZpZXcnKSl9fSkoKSI7CiAgJHJbJ3Nob3RzJ109WwogICAgWyduJz0+J2ExX3NsYXB1a2FpJywndSc9PmhvbWVfdXJsKCcvJyksJ3cnPT4kTSwnaCc9PiRILCdjbGljayc9PicuY21wbHotYnRuLmNtcGx6LWRlbnknXSwKICAgIFsnbic9PidhMl9tZW5pdScsJ3UnPT5ob21lX3VybCgnLycpLCd3Jz0+JE0sJ2gnPT4kSCwnY2xpY2snPT4nW2RhdGEtb3Blbj0iI21haW4tbWVudSJdJywnZXZhbCc9PiIoKCk9Pih7cGFpZXNrYV9tZW5pdTohIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluLW1lbnUgaW5wdXRbdHlwZT1zZWFyY2hdLCAubW9iaWxlLXNpZGViYXIgaW5wdXRbdHlwZT1zZWFyY2hdLCAub2ZmLWNhbnZhcyBpbnB1dFt0eXBlPXNlYXJjaF0nKSxtZW5pdV9wdW5rdGFpOlsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbWFpbi1tZW51IC5uYXYgPiBsaSA+IGEsIC5tb2JpbGUtc2lkZWJhciAubmF2ID4gbGkgPiBhJyldLm1hcChhPT5hLmlubmVyVGV4dC50cmltKCkpLmZpbHRlcihCb29sZWFuKS5zbGljZSgwLDE1KX0pKSgpIl0sCiAgICBbJ24nPT4nYTNfcHJla2UnLCd1Jz0+JFAsJ3cnPT4kTSwnaCc9PiRILCdldmFsJz0+IigoKT0+e2NvbnN0IHY9cz0+e2NvbnN0IGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTtpZighZSlyZXR1cm4gMDtjb25zdCBiPWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuIGIuaGVpZ2h0PjAmJmdldENvbXB1dGVkU3R5bGUoZSkuZGlzcGxheSE9PSdub25lJz9NYXRoLnJvdW5kKGIudG9wKSsnLScrTWF0aC5yb3VuZChiLmJvdHRvbSk6MH07cmV0dXJuIHtzdGlja3k6dignLnBzYy1zdGlja3ktYXRjJyksa2FpbmE6dignLnByb2R1Y3QtaW5mbyAucHJpY2UnKSxoMTp2KCcucHJvZHVjdC10aXRsZSwgaDEnKSxjb29raWU6dignLmNtcGx6LWNvb2tpZWJhbm5lcicpfX0pKCkiXSwKICAgIFsnbic9PidhNF9rcmVwc2VsaXMnLCd1Jz0+aG9tZV91cmwoJy9rcmVwc2VsaXMvP2FkZC10by1jYXJ0PTE4NTg3JyksJ3cnPT4kTSwnaCc9PiRILCdmdWxsJz0+MSwnZXZhbCc9PiIoKCk9Pntjb25zdCBxPXM9PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iocyk7Y29uc3QgdD1lPT5lP01hdGgucm91bmQoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApOm51bGw7cmV0dXJuIHtoOmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQscHJla2l1OmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJ0X2l0ZW0sIC53b29jb21tZXJjZS1jYXJ0LWZvcm1fX2NhcnQtaXRlbScpLmxlbmd0aCxteWd0dWthc19hcG1va2V0aTp0KHEoJy5jaGVja291dC1idXR0b24sIC53Yy1wcm9jZWVkLXRvLWNoZWNrb3V0IGEnKSksc3VtYToocSgnLm9yZGVyLXRvdGFsIC5hbW91bnQnKXx8e30pLmlubmVyVGV4dHx8bnVsbCxrdXBvbmFzOiEhcSgnI2NvdXBvbl9jb2RlJyksdGVrc3RhaTpbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndvb2NvbW1lcmNlLWluZm8sIC53b29jb21tZXJjZS1tZXNzYWdlLCBbY2xhc3MqPW5lbW9rYW1dLCBbY2xhc3MqPWZyZWVdJyldLm1hcChlPT5lLmlubmVyVGV4dC50cmltKCkuc2xpY2UoMCwxMjApKS5zbGljZSgwLDYpfX0pKCkiXSwKICAgIFsnbic9PidhNV9hcG1va2VqaW1hcycsJ3UnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCksJ3cnPT4kTSwnaCc9PiRILCdmdWxsJz0+MSwnZXZhbCc9PiRja10sCiAgXTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-191505';
const GKEY='ps_s1740q';
const PHASES=["1"];
const OUT='analize/s1740q.json';
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
