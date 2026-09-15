process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODUgbW8g4oCUIERFUExPWSDFoWFibG9ubyBwYXRhaXNhIChkdmlndWJhcyB0YcWha2FzKTsgdG9rZW5fZ2V0X2FsbCwgaGVhcnRiZWF0LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4NW1vJ10pKSByZXR1cm47ICRvPWFycmF5KCd2Jz0+J1MxNjg1IG1vJyk7ICR0PVdQTVVfUExVR0lOX0RJUi4nL3BzLXNhYmxvbmFpL3JlZmlsbC1wYWthcnRvdGkucGhwJzsgJG50PWJhc2U2NF9kZWNvZGUoJ1BEOXdhSEFLTHlvcUNpQXFJTVdnWVdKc2IyNWhjem9nY21WbWFXeHNYMlIxWlNEaWdKUWc0b0NlVUdGcllYSjBiM1JwSUhURWhTQndZWFRFcnlJZ0tGTXhOamcxTENCUk5DQndiR0Z1WVhNZ2JHbG1aV041WTJ4bElHVjBZWEJoY3lBeEtTNEtJQ29nVUdGclpXbkVqV2xoSUdOdmNtVWdjbVZtYVd4c0xuQm9jQ0J3WlhJZ2NHVjBjMmh2Y0Y5bGJXRnBiRjkwWlcxd2JHRjBaVjl3WVhSb0lDaFFaWFJ6YUc5d1gxQmhhMkZ5ZEc5MGFTa3VJRXRwYm5SaGJXbGxhbWs2SUNSd1lYbHNiMkZrTENBa1pteHZkMTlqYkdGemN5d2dKSEpsWTJsd2FXVnVkQzRnVG5WemRHRjBieUFrYzNWaWFtVmpkQzRLSUNvZ1VISnBibU5wY0dGek9pQnJiMjVyY21WMGFTQndjbVZyeEpjZ0t5QndZWE5yZFhScGJtbHpJR3RwWld0cGN5QXJJR3RoYVc1aElDc2dkbWxsYm1GeklIQmhjM0JoZFdScGJXRnpJTVN2SUd0aGM4U0ZPeUJpWlNCaGRXZHBiblJwYm1sdklIWmhjbVJ2SUNoc2FXNXJjMjVwWVdrcE95QmlaU0JoZFhSdmJXRjBhVzVwYnlCd1lYQnBiR1I1Ylc4Z2NHSEZ2bUZreGJNZ0tFMHhNQ0J1eEpkeVlTa3VDaUFxTHdwcFppQW9JQ0VnWkdWbWFXNWxaQ2dnSjBGQ1UxQkJWRWduSUNrZ0tTQjdJR1Y0YVhRN0lIMEtKR1Z0WVdsc0lEMGdhWE56WlhRb0lDUnlaV05wY0dsbGJuUWdLU0EvSUNSeVpXTnBjR2xsYm5RZ09pQW5KenNnSkdaaklEMGdhWE56WlhRb0lDUm1iRzkzWDJOc1lYTnpJQ2tnUHlBa1pteHZkMTlqYkdGemN5QTZJQ2R6WlhKMmFXTmxKenNLSkdRZ1BTQmpiR0Z6YzE5bGVHbHpkSE1vSUNkUVpYUnphRzl3WDFCaGEyRnlkRzkwYVNjZ0tTQS9JRkJsZEhOb2IzQmZVR0ZyWVhKMGIzUnBPanBrZFc5dFpXNTVjeWdnSkhCaGVXeHZZV1FzSUNSbGJXRnBiQ0FwSURvZ1lYSnlZWGtvS1RzS0pHWmlYM1Z5YkNBOUlHbHpjMlYwS0NBa2NHRjViRzloWkZzblptVmxaR0poWTJ0ZmRYSnNKMTBnS1NBL0lDUndZWGxzYjJGa1d5ZG1aV1ZrWW1GamExOTFjbXduWFNBNklDY25Pd29rY0dGMklEMGdhWE56WlhRb0lDUmtXeWR3WVhaaFpHbHVhVzFoY3lkZElDa2dQeUFrWkZzbmNHRjJZV1JwYm1sdFlYTW5YU0E2SUNnZ2FYTnpaWFFvSUNSd1lYbHNiMkZrV3lkd2NtOWtkV04wWDI1aGJXVW5YU0FwSUQ4Z0pIQmhlV3h2WVdSYkozQnliMlIxWTNSZmJtRnRaU2RkSURvZ0oyMWhhWE4wYnljZ0tUc0tKR3RwWldzZ1BTQnBjM05sZENnZ0pHUmJKMnRwWld0cGN5ZGRJQ2tnUHlBb2FXNTBLU0FrWkZzbmEybGxhMmx6SjEwZ09pQXhPd29LSkhOMVltcGxZM1FnUFNBblRHRnBhMkZ6SUhCaGEyRnlkRzkwYVRvZ0p5QXVJQ1J3WVhZN0Nnb2tZbTlrZVNBOUlGQmxkSE5vYjNCZlJXMWhhV3hmVEdGNWIzVjBPanB3S0NBblVHRm5ZV3dnWVc1cmMzUmxjMjdFcnlCd2FYSnJhVzNFaFNERm9Xa2djSEpsYThTWEp5QXVJQ2dnSVNCbGJYQjBlU2dnSkdSYkoyUmhkR0VuWFNBcElEOGdKeUJuWVd4cElHSmhhV2QwYVhNZ1lYQnBaU0FuSUM0Z1pYTmpYMmgwYld3b0lDUmtXeWRrWVhSaEoxMGdLU0E2SUNjZ1oyRnNhU0J1WlhSeWRXdDFjeUJpWVdsbmRHbHpMaWNnS1NBcE93b2tZbTlrZVNBdVBTQlFaWFJ6YUc5d1gwVnRZV2xzWDB4aGVXOTFkRG82Y0NnZ0oxUmhjeUJ3WVhSeklIWEZ2bk5oYTNsdFlYTWdkbWxsYm5VZ2NHRnpjR0YxWkdsdGRTRGlnSlFnSnlBdUlDUnJhV1ZySUM0Z0p5QjJiblF1SnlBdUlDZ2dJU0JsYlhCMGVTZ2dKR1JiSjJ0aGFXNWhKMTBnS1NBL0lDY3NJQ2NnTGlCbGMyTmZhSFJ0YkNnZ0pHUmJKMnRoYVc1aEoxMGdLU0F1SUNjZzRvS3NKeUE2SUNjbklDa2dMaUFuSU9LQWxDQndjbWx6ZEdGMGVYTnBiV1VnZEdGcGNDQndZWFFnWjNKbGFYUmhhU3dnYTJGcGNDQndjbUZsYVhURWhTQnJZWEoweElVdUp5QXBPd3BwWmlBb0lDRWdaVzF3ZEhrb0lDUmtXeWRyWVhOaEoxMGdLU0FwSUNSaWIyUjVJQzQ5SUZCbGRITm9iM0JmUlcxaGFXeGZUR0Y1YjNWME9qcGlkWFIwYjI0b0lDUmtXeWRyWVhOaEoxMHNJQ2RRWVd0aGNuUnZkR2tnZE1TRklIQmhkTVN2SnlBcE93b2tZVzUwY2lBOUlHRnljbUY1S0NrN0NtbG1JQ2dnSVNCbGJYQjBlU2dnSkdSYkozQnlaV3RsSjEwZ0tTQXBJQ1JoYm5SeVd5ZFFaWExGdm1uRnEzTEVsM1JwSUhCeVpXdkVtU2RkSUQwZ0pHUmJKM0J5Wld0bEoxMDdDbWxtSUNnZ0pHWmlYM1Z5YkNBcElDUmhiblJ5V3lkUVlYUnBhM05zYVc1MGFTQndjbWx0YVc1cGJjU0ZKMTBnUFNBa1ptSmZkWEpzT3dwcFppQW9JQ0VnWlcxd2RIa29JQ1JrV3lkdmNIUnZkWFFuWFNBcElDa2dKR0Z1ZEhKYkowNWxibTl5YVhVZ2RHOXJhY1d6SUhCeWFXMXBibWx0eGJNblhTQTlJQ1JrV3lkdmNIUnZkWFFuWFRzS2FXWWdLQ0FrWVc1MGNpQXBJQ1JpYjJSNUlDNDlJRkJsZEhOb2IzQmZSVzFoYVd4ZlRHRjViM1YwT2pwelpXTnZibVJoY25rb0lDUmhiblJ5SUNrN0NncGxZMmh2SUZCbGRITm9iM0JmUlcxaGFXeGZUR0Y1YjNWME9qcDNjbUZ3S0NCaGNuSmhlU2dLQ1NkemRXSnFaV04wSnlBZ0lDQTlQaUFrYzNWaWFtVmpkQ3dLQ1Nkd2NtVm9aV0ZrWlhJbklDQTlQaUFuVkdGeklIQmhkSE1nZGNXK2MyRnJlVzFoY3lCMmFXVnVkU0J3WVhOd1lYVmthVzExTGljc0Nna25ZbTlrZVNjZ0lDQWdJQ0FnUFQ0Z0pHSnZaSGtzQ2drblpteHZkMTlqYkdGemN5Y2dQVDRnSkdaakxBb0pKMlZ0WVdsc0p5QWdJQ0FnSUQwK0lDUmxiV0ZwYkN3S0NTZHlaV0Z6YjI0bklDQWdJQ0E5UGlBblIyRjJiM1JsSU1XaHhLOGdiR0ZweGFGcnhJVXNJRzVsY3lCd2FYSnJiM1JsSU1XaGFjU0ZJSEJ5Wld2RW1TQndaWFJ6YUc5d0xteDBMaUJRY21sdGFXNXBiY1d6SUdkaGJHbDBaU0JoZEhOcGMyRnJlWFJwSUc1MWIzSnZaR0VnWVhWcnhhSEVqV2xoZFM0bkxBb3BJQ2s3Q2c9PScpOyBpZihtZDUoJG50KSE9PSdlMmEwZjIzODdiNDliNGU1ZTU2ZmFjNWFiZWQ4Zjc4NicpeyAkb1snU1RPUCddPSdtZDUnOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogIHRyeSB7IHRva2VuX2dldF9hbGwoJG50LCBUT0tFTl9QQVJTRSk7IH0gY2F0Y2ggKFRocm93YWJsZSAkZSkgeyAkb1snU1RPUCddPSRlLT5nZXRNZXNzYWdlKCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgZmlsZV9wdXRfY29udGVudHMoJHQsJG50KTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCR0LHRydWUpOyAkb1snbWQ1J109bWQ1X2ZpbGUoJHQpOwogICRoYj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJG9bJ2hlYXJ0YmVhdCddPWlzX3dwX2Vycm9yKCRoYik/MDp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaGIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const VER='dep-133414';
const GKEY='ps_s1685mo';
const PHASES=["DEPLOY"];
const OUT='analize/s1685_mo.json';
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
