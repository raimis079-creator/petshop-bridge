process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgcGYyIOKAlCB2ZXJ0aW1haSB2MS4xIGRlcGxveSArIHBhaWXFoWtvcyBwdXNsYXBpbyBudW9yb2TFsyBDU1MgKHRpayBzZWFyY2gpICsgcGF0aWtyYS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzVwZjInXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J3BmMicpOwogICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogIGZpbGVfcHV0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtdmVydGltYWkucGhwJyxiYXNlNjRfZGVjb2RlKCdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lIWmxjblJwYldGcENpQXFJRVJsYzJOeWFYQjBhVzl1T2lCVWNzV3JhM04wWVcxcElGZHZiME52YlcxbGNtTmxMMFpzWVhSemIyMWxJR3gwWDB4VUlIWmxjblJwYldGcElDaHNZV25Gb1d0aGFTd2djR0ZwWmNXaGEyOXpJR0Z1ZEhKaHhhRjB4SmR6S1M0Z1ZHbHJJR1ZwYkhWMHhKZHpMQ0JyZFhKcHhiTWdic1NYY21FZ2IyWnBZMmxoYkdsMWIzTmxJQzV0Ynk0S0lDb2dWbVZ5YzJsdmJqb2dNUzR4Q2lBcUx3cHBaaUFvSUNFZ1pHVm1hVzVsWkNnZ0owRkNVMUJCVkVnbklDa2dLU0JsZUdsME93cGhaR1JmWm1sc2RHVnlLQ0FuWjJWMGRHVjRkRjkzYjI5amIyMXRaWEpqWlNjc0lHWjFibU4wYVc5dUtDQWtkSEpoYm5Oc1lYUmxaQ3dnSkhSbGVIUXNJQ1JrYjIxaGFXNGdLU0I3Q2dsemRHRjBhV01nSkcxaGNDQTlJR0Z5Y21GNUtBb0pDU2RWYm1admNuUjFibUYwWld4NUxDQjBhR1VnY0dGNWJXVnVkQ0JtYjNJZ2IzSmtaWElnSXlVeEpITWdabkp2YlNBbE1pUnpJR2hoY3lCbVlXbHNaV1F1SUZSb1pTQnZjbVJsY2lCM1lYTWdZWE1nWm05c2JHOTNjem9uSUQwK0lDZEVaV3BoTENCMXhiNXpZV3Q1Ylc4Z0l5VXhKSE1nS0hCcGNtdkVsMnBoY3lBbE1pUnpLU0JoY0cxdmE4U1hhbWx0WVhNZ2JtVndZWFo1YTI4dUlGWEZ2bk5oYTNsdGJ5QnBibVp2Y20xaFkybHFZVG9uTEFvSkNTSlhaVng0UlRKY2VEZ3dYSGc1T1hKbElHZGxkSFJwYm1jZ2FXNGdkRzkxWTJnZ2RHOGdiR1YwSUhsdmRTQnJibTkzSUhSb1lYUWdiM0prWlhJZ0l5VXhYQ1J6SUdaeWIyMGdKVEpjSkhNZ2FHRnpJR0psWlc0Z1kyRnVZMlZzYkdWa0xpSWdQVDRnSjFCeVlXNWx4YUZoYldVc0lHdGhaQ0IxeGI1ellXdDViV0Z6SUNNbE1TUnpJQ2h3YVhKcnhKZHFZWE1nSlRJa2N5a2dZblYyYnlCaGRNV2hZWFZyZEdGekxpY3NDZ2tKSjA5eVpHVnlJRVpoYVd4bFpEb2dKWE1uSUQwK0lDZFZ4YjV6WVd0NWJXOGdZWEJ0YjJ2RWwzUnBJRzVsY0dGMmVXdHZPaUFsY3ljc0Nna0pKMDVsZHlCUGNtUmxjam9nSXlWekp5QTlQaUFuVG1GMWFtRnpJSFhGdm5OaGEzbHRZWE02SUNNbGN5Y3NDZ2twT3dvSmFXWWdLQ0FrZEhKaGJuTnNZWFJsWkNBOVBUMGdKSFJsZUhRZ0ppWWdhWE56WlhRb0lDUnRZWEJiSUNSMFpYaDBJRjBnS1NBcElISmxkSFZ5YmlBa2JXRndXeUFrZEdWNGRDQmRPd29KY21WMGRYSnVJQ1IwY21GdWMyeGhkR1ZrT3dwOUxDQXhNQ3dnTXlBcE93cGhaR1JmWm1sc2RHVnlLQ0FuWjJWMGRHVjRkRjltYkdGMGMyOXRaU2NzSUdaMWJtTjBhVzl1S0NBa2RISmhibk5zWVhSbFpDd2dKSFJsZUhRc0lDUmtiMjFoYVc0Z0tTQjdDZ2x6ZEdGMGFXTWdKRzFoY0NBOUlHRnljbUY1S0FvSkNTZFFZV2RsY3lCbWIzVnVaQ2NnSUNBZ1BUNGdKMUpoYzNScElIQjFjMnhoY0dsaGFTY3NDZ2tKSjFCeWIyUjFZM1J6SUdadmRXNWtKeUE5UGlBblVtRnpkRzl6SUhCeVpXdkVsM01uTEFvSkNTZFFiM04wY3lCbWIzVnVaQ2NnSUNBZ1BUNGdKMUpoYzNScElNU3ZjbUhGb1dGcEp5d0tDU2s3Q2dscFppQW9JQ1IwY21GdWMyeGhkR1ZrSUQwOVBTQWtkR1Y0ZENBbUppQnBjM05sZENnZ0pHMWhjRnNnSkhSbGVIUWdYU0FwSUNrZ2NtVjBkWEp1SUNSdFlYQmJJQ1IwWlhoMElGMDdDZ2x5WlhSMWNtNGdKSFJ5WVc1emJHRjBaV1E3Q24wc0lERXdMQ0F6SUNrN0NnPT0nKSk7CiAgJG9bJ21kNSddPW1kNV9maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtdmVydGltYWkucGhwJyk7CiAgJGNzcz13cF9nZXRfY3VzdG9tX2NzcygpOwogICRwcmlkPSJcbi8qIFMxNjM1OiBwYWllxaFrb3MgcHVzbGFwacWzIG51b3JvZG9zIG1hdG9tZXNuxJdzICovXG5ib2R5LnNlYXJjaCAucGFnZS1ib3ggLmJveC10ZXh0IHB7Zm9udC1zaXplOjE2cHg7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjowO31cbmJvZHkuc2VhcmNoIC5wYWdlLWJveCAuYm94LXRleHR7cGFkZGluZzoxMHB4IDA7fVxuIjsKICBpZihzdHJwb3MoJGNzcywnUzE2MzU6IHBhaWXFoWtvcycpPT09ZmFsc2UpeyB3cF91cGRhdGVfY3VzdG9tX2Nzc19wb3N0KCRjc3MuJHByaWQpOyAkb1snY3NzJ109J3ByaWTEl3RhJzsgfSBlbHNlICRvWydjc3MnXT0namF1IGJ1dm8nOwogIHdwX2NhY2hlX2ZsdXNoKCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsKICAkaD0oc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cz10b2Z1JnBvc3RfdHlwZT1wcm9kdWN0JyksYXJyYXkoJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgZm9yZWFjaChhcnJheSgnUGFnZXMgZm91bmQnLCdSYXN0aSBwdXNsYXBpYWknLCdQcm9kdWN0cyBmb3VuZCcsJ1Jhc3RvcyBwcmVrxJdzJywnUzE2MzU6IHBhaWXFoWtvcycpIGFzICR6KSAkb1sncHNsJ11bJHpdPXN1YnN0cl9jb3VudCgkaCwkeik7CiAgJG9bJ3dhcm5pbmcnXT1zdWJzdHJfY291bnQoJGgsJ1dhcm5pbmcnKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-114020';
const GKEY='ps_s1635pf2';
const PHASES=["P2"];
const OUT='analize/s1635_pf2.json';
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
