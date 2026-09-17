process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTAgYyDigJQgREVQTE9ZIG11LXBsdWdpbiBwZXRzaG9wLWthc2EtcGFza3lyYS5waHAgdjEuMCArIGhlYXJ0YmVhdCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5MGMnXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4nUzE2OTAgYycpOwogICRjb2RlPWJhc2U2NF9kZWNvZGUoJ1BEOXdhSEFLTHlvcUNpQXFJRkJzZFdkcGJpQk9ZVzFsT2lCUVpYUnphRzl3SUV0aGMyRTZJSFhGdm5OaGEzbHRZWE1nWlhOaGJXRnBJSEJoYzJ0NWNtRnBJSFl4TGpBZ0tGTXhOamt3S1FvZ0tpQkVaWE5qY21sd2RHbHZiam9nVG1Wd2NtbHphV3AxYm1mRW1YTWdjR2x5YThTWGFtRnpJSE4xSUdWc0xpQndZY1doZEhVc0lHdDFjbWx6SUdwaGRTQjBkWEpwSUhCaGMydDVjc1NGTENCbllXeHBJSFhGdm1KaGFXZDBhU0IxeGI1ellXdDViY1NGSUdKbElHdHNZV2xrYjNNS0lDb2dJQ0RpZ0o1UVlYTnJlWEpoSUhOMUlIUnZhMmwxSUdWc0xpQndZY1doZEc4Z1lXUnlaWE4xSUdwaGRTQjVjbUVnYzNWcmRYSjBZU0l1SUZYRnZuTmhhM2x0WVhNZ2NISnBjMnRwY21saGJXRnpJR1Z6WVcxaGFTQndZWE5yZVhKaGFUc2djR0Z6YTNseWIzTUtJQ29nSUNCcHhhRnpZWFZuYjNSaGN5QmhaSEpsYzJGeklFNUZVRVZTVWtIRm9FOU5RVk03SUhCcGNtdkVsMnBoY3lCdVpYQnlhV3AxYm1kcFlXMWhjeTRnVmNXK2MyRnJlVzF2SUcxbGRHRWdZRjl3YzE5d1lYTnJlWEpoWDNCeWFYTnJhWEowWVdBOU1TQXJJSEJoYzNSaFltRXVDaUFxTHdwcFppQW9JQ0VnWkdWbWFXNWxaQ2dnSjBGQ1UxQkJWRWduSUNrZ0tTQjdJR1Y0YVhRN0lIMEtDbVpwYm1Gc0lHTnNZWE56SUZCbGRITm9iM0JmUzJGellWOVFZWE5yZVhKaElIc0tDUzhxS2lCQWRtRnlJR2x1ZEh4dWRXeHNJR1Z6WVcxdklIWmhjblJ2ZEc5cWJ5QkpSQ0RGb1dsaGFTQnJZWE52Y3lCMXhiNXJiR0YxYzJGcElDb3ZDZ2x3Y21sMllYUmxJSE4wWVhScFl5QWtkV2xrSUQwZ2JuVnNiRHNLQ2dsd2RXSnNhV01nYzNSaGRHbGpJR1oxYm1OMGFXOXVJR2x1YVhRb0tTQjdDZ2tKWVdSa1gyWnBiSFJsY2lnZ0ozZHZiMk52YlcxbGNtTmxYMk5vWldOcmIzVjBYM0J2YzNSbFpGOWtZWFJoSnl3Z1lYSnlZWGtvSUY5ZlEweEJVMU5mWHl3Z0ozQnZjM1JsWkNjZ0tTd2dOU0FwT3dvSkNXRmtaRjltYVd4MFpYSW9JQ2QzYjI5amIyMXRaWEpqWlY5amFHVmphMjkxZEY5amRYTjBiMjFsY2w5cFpDY3NJR0Z5Y21GNUtDQmZYME5NUVZOVFgxOHNJQ2RqZFhOMGIyMWxjbDlwWkNjZ0tTd2dNakFnS1RzS0NRbGhaR1JmWm1sc2RHVnlLQ0FuZDI5dlkyOXRiV1Z5WTJWZlkyaGxZMnR2ZFhSZmRYQmtZWFJsWDJOMWMzUnZiV1Z5WDJSaGRHRW5MQ0JoY25KaGVTZ2dYMTlEVEVGVFUxOWZMQ0FuYm1WclpXbHpkR2xmY0dGemEzbHliM01uSUNrc0lESXdJQ2s3Q2drSllXUmtYMkZqZEdsdmJpZ2dKM2R2YjJOdmJXMWxjbU5sWDJOb1pXTnJiM1YwWDJOeVpXRjBaVjl2Y21SbGNpY3NJR0Z5Y21GNUtDQmZYME5NUVZOVFgxOHNJQ2Q2ZVcxbEp5QXBMQ0F5TUN3Z01pQXBPd29KQ1dGa1pGOWhZM1JwYjI0b0lDZDNiMjlqYjIxdFpYSmpaVjlqYUdWamEyOTFkRjl2Y21SbGNsOWpjbVZoZEdWa0p5d2dZWEp5WVhrb0lGOWZRMHhCVTFOZlh5d2dKM0JoYzNSaFltRW5JQ2tzSURJd0lDazdDZ2w5Q2dvSkx5b3FJRkJ5YVdYRm9TQjJZV3hwWkdGamFXckVoVG9nYW1WcElITjJaY1NOYVdGekxDQnZJR1ZzTGlCd1ljV2hkR0Z6SUdwaGRTQjBkWEpwSUhCaGMydDVjc1NGSU9LQWxDQndZWE5yZVhKdmN5QnVaV3QxY25ScExDQnZJSEJ5YVhOcmFYSjBhUzRnS2k4S0NYQjFZbXhwWXlCemRHRjBhV01nWm5WdVkzUnBiMjRnY0c5emRHVmtLQ0FrWkdGMFlTQXBJSHNLQ1FselpXeG1Pam9rZFdsa0lEMGdiblZzYkRzS0NRbHBaaUFvSUdselgzVnpaWEpmYkc5bloyVmtYMmx1S0NrZ2ZId2daVzF3ZEhrb0lDUmtZWFJoV3lkaWFXeHNhVzVuWDJWdFlXbHNKMTBnS1NCOGZDQWhJR2x6WDJWdFlXbHNLQ0FrWkdGMFlWc25ZbWxzYkdsdVoxOWxiV0ZwYkNkZElDa2dLU0I3SUhKbGRIVnliaUFrWkdGMFlUc2dmUW9KQ1NScFpDQTlJR1Z0WVdsc1gyVjRhWE4wY3lnZ2MyRnVhWFJwZW1WZlpXMWhhV3dvSUNSa1lYUmhXeWRpYVd4c2FXNW5YMlZ0WVdsc0oxMGdLU0FwT3dvSkNXbG1JQ2dnSVNBa2FXUWdLU0I3SUhKbGRIVnliaUFrWkdGMFlUc2dmUW9KQ1NSMUlEMGdaMlYwWDNWelpYSmtZWFJoS0NBa2FXUWdLVHNLQ1FscFppQW9JQ0VnSkhVZ2ZId2dZWEp5WVhsZmFXNTBaWEp6WldOMEtDQmhjbkpoZVNnZ0oyRmtiV2x1YVhOMGNtRjBiM0luTENBbmMyaHZjRjl0WVc1aFoyVnlKeXdnSjJWa2FYUnZjaWNnS1N3Z0tHRnljbUY1S1NBa2RTMCtjbTlzWlhNZ0tTQXBJSHNnY21WMGRYSnVJQ1JrWVhSaE95QjlJQzh2SUdGa2JXbHVJSEJoYzJ0NWNzV3pJSE4yWmNTTmFYVnBJRzVsY0hKcGMydHBjblJwQ2drSmMyVnNaam82SkhWcFpDQTlJQ2hwYm5RcElDUnBaRHNLQ1Fra1pHRjBZVnNuWTNKbFlYUmxZV05qYjNWdWRDZGRJRDBnTURzS0NRbHlaWFIxY200Z0pHUmhkR0U3Q2dsOUNnb0pjSFZpYkdsaklITjBZWFJwWXlCbWRXNWpkR2x2YmlCamRYTjBiMjFsY2w5cFpDZ2dKR2xrSUNrZ2V3b0pDWEpsZEhWeWJpQW9JQ0VnSkdsa0lDWW1JSE5sYkdZNk9pUjFhV1FnS1NBL0lITmxiR1k2T2lSMWFXUWdPaUFrYVdRN0NnbDlDZ29KTHlvcUlFVnpZVzF2Y3lCd1lYTnJlWEp2Y3lCaWFXeHNhVzVuTDNOb2FYQndhVzVuSUd4aGRXdkZzeUJweGFFZ2MzWmx4STFwYnlERXIzWmxjM1JwWlhNZ2JtVndaWEp5WWNXaGVYUnBMaUFxTHdvSmNIVmliR2xqSUhOMFlYUnBZeUJtZFc1amRHbHZiaUJ1Wld0bGFYTjBhVjl3WVhOcmVYSnZjeWdnSkhWd1pHRjBaU0FwSUhzS0NRbHlaWFIxY200Z2MyVnNaam82SkhWcFpDQS9JR1poYkhObElEb2dKSFZ3WkdGMFpUc0tDWDBLQ2dsd2RXSnNhV01nYzNSaGRHbGpJR1oxYm1OMGFXOXVJSHA1YldVb0lDUnZjbVJsY2l3Z0pHUmhkR0VnS1NCN0Nna0phV1lnS0NBaElITmxiR1k2T2lSMWFXUWdLU0I3SUhKbGRIVnlianNnZlFvSkNTUnZjbVJsY2kwK2RYQmtZWFJsWDIxbGRHRmZaR0YwWVNnZ0oxOXdjMTl3WVhOcmVYSmhYM0J5YVhOcmFYSjBZU2NzSURFZ0tUc0tDWDBLQ2dsd2RXSnNhV01nYzNSaGRHbGpJR1oxYm1OMGFXOXVJSEJoYzNSaFltRW9JQ1J2Y21SbGNpQXBJSHNLQ1FscFppQW9JQ0VnYzJWc1pqbzZKSFZwWkNCOGZDQWhJQ1J2Y21SbGNpMCtaMlYwWDIxbGRHRW9JQ2RmY0hOZmNHRnphM2x5WVY5d2NtbHphMmx5ZEdFbklDa2dLU0I3SUhKbGRIVnlianNnZlFvSkNTUnZjbVJsY2kwK1lXUmtYMjl5WkdWeVgyNXZkR1VvSUNkVGRtWEVqV2x2SUhYRnZuTmhhM2x0WVhNZ2NISnBjMnRwY25SaGN5QmxjMkZ0WVdrZ2NHRnphM2x5WVdrZ0l5Y2dMaUJ6Wld4bU9qb2tkV2xrSUM0Z0p5QndZV2RoYkNCbGJDNGdjR0hGb1hURWhTQW9VekUyT1RBcExpY2dLVHNLQ1gwS2ZRcFFaWFJ6YUc5d1gwdGhjMkZmVUdGemEzbHlZVG82YVc1cGRDZ3BPd289Jyk7ICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2FzYS1wYXNreXJhLnBocCc7CiAgdHJ5IHsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkb1sncGFyc2UnXT0nb2snOyB9IGNhdGNoIChcVGhyb3dhYmxlICRlKSB7ICRvWydwYXJzZSddPSRlLT5nZXRNZXNzYWdlKCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgaWYgKG1kNSgkY29kZSkhPT0nMGEzYmNlZmVhMzJhMjc4MDFkZTY2ZmM3YWE0ZDM5NzInKSB7ICRvWydtZDUnXT0nRkFJTCc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgaWYgKGZpbGVfZXhpc3RzKCRmKSkgeyAkb1snZXhpc3RzJ109dHJ1ZTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAkb1snd3JpdGUnXT1maWxlX3B1dF9jb250ZW50cygkZiwkY29kZSk7ICRvWydtZDVfZGlzayddPW1kNV9maWxlKCRmKTsKICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX2hiPScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkYz13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7ICRvWydoZWFydGJlYXQnXT0kYzsKICBpZiAoJGM+PTUwMCkgeyB1bmxpbmsoJGYpOyAkb1sncm9sbGJhY2snXT0ndW5saW5rZWQnOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-160012';
const GKEY='ps_s1690c';
const PHASES=["ps_s1690c"];
const OUT='analize/s1690_c.json';
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
