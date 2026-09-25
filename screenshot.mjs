process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIwbiDigJQgcHJla2VzLXR2YXJrYSBkZXBsb3k6IDEgPSByYcWheXRpIChrb2RhcyDEr2TEl3RhcykgKyBoZWFydGJlYXQsIDIgPSBwYXRpa3JhICh0dmFya2EgSFRNTCksIDkgPSBwYcWhYWxpbnRpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyMG4nXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzIwbiddOyAkcj1bJ3YnPT4nUzE3MjBuJywnZmF6ZSc9PiRmXTsKICAkcGw9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmVrZXMtdHZhcmthLnBocCc7ICRhcj1kaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMnOwogICRoYj1mdW5jdGlvbigpeyAkcnM9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19oYj0xJyksWyd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+J01vemlsbGEvNS4wIHBzLXMxNzIwJ10pOyByZXR1cm4gaXNfd3BfZXJyb3IoJHJzKT8nRVJSJzp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpOyB9OwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAka29kYXM9YmFzZTY0X2RlY29kZSgnUEQ5d2FIQUtMeW9xQ2lBcUlGQnNkV2RwYmlCT1lXMWxPaUJRWlhSemFHOXdJSEJ5Wld2RWwzTWdjSFZ6YkdGd2FXOGdkSFpoY210aElIWXhMakFnS0ZNeE56SXdMQ0J3YkdGdVlYTWdNaTR4TnlrS0lDb2dSR1Z6WTNKcGNIUnBiMjQ2SU9LQW5rUmh4YjV1WVdrZ2NHVnlhMkZ0WVNCcllYSjBkZUtBbkNBb1VHVjBjMmh2Y0Y5R1FsUTZPbkpsYm1SbGNsOTNhV1JuWlhRc0lIZHZiMk52YlcxbGNtTmxYMkZtZEdWeVgyRmtaRjkwYjE5allYSjBYMlp2Y20wZ2NISnBieUF5TUNrZ2NHVnlhMlZzYVdGdFlYTWdVRThnYzJ0aGFjU05hWFZ2YTJ6RWwzTUtJQ29nSUNBb1VHVjBjMmh2Y0Y5UWNtOWtkV04wWDBOaGJHTTZPbmRwWkdkbGRDd2dkMjl2WTI5dGJXVnlZMlZmYzJsdVoyeGxYM0J5YjJSMVkzUmZjM1Z0YldGeWVTQndjbWx2SURNeEtTRGlocElnYzNWdGJXRnllU0J3Y21sdklETXlMaUJTWVdsdGFXOGdjM0J5Wlc1a2FXMWhjeUF5TURJMkxUQTVMVEkxSUNoVE1UY3hNaUJ5WVdScGJubHpJQ001S1M0S0lDb2dJQ0JKeGFGcWRXNW5kR2s2SUc5d1kybHFZU0J3YzE5d2NtVnJaWE5mZEhaaGNtdGhYMmx6YW5WdVozUmhQVEVnS0dkeXhLL0Z2blJoSUhObGJtRWdkSFpoY210aEtTNEtJQ29nVm1WeWMybHZiam9nTVM0d0NpQXFMd3BwWmlBb0lDRWdaR1ZtYVc1bFpDZ2dKMEZDVTFCQlZFZ25JQ2tnS1NCN0lHVjRhWFE3SUgwS0NtRmtaRjloWTNScGIyNG9JQ2QzY0Njc0lHWjFibU4wYVc5dUlDZ3BJSHNLQ1dsbUlDZ2dhWE5mWVdSdGFXNG9LU0I4ZkNCblpYUmZiM0IwYVc5dUtDQW5jSE5mY0hKbGEyVnpYM1IyWVhKcllWOXBjMnAxYm1kMFlTY2dLU0FwSUhzZ2NtVjBkWEp1T3lCOUNnbG5iRzlpWVd3Z0pIZHdYMlpwYkhSbGNqc0tDU1JvSUQwZ0ozZHZiMk52YlcxbGNtTmxYMkZtZEdWeVgyRmtaRjkwYjE5allYSjBYMlp2Y20wbk93b0phV1lnS0NCbGJYQjBlU2dnSkhkd1gyWnBiSFJsY2xzZ0pHZ2dYU0FwSUh4OElHVnRjSFI1S0NBa2QzQmZabWxzZEdWeVd5QWthQ0JkTFQ1allXeHNZbUZqYTNOYk1qQmRJQ2tnS1NCN0lISmxkSFZ5YmpzZ2ZRb0pabTl5WldGamFDQW9JQ1IzY0Y5bWFXeDBaWEpiSUNSb0lGMHRQbU5oYkd4aVlXTnJjMXN5TUYwZ1lYTWdKR05pSUNrZ2V3b0pDU1JtYmlBOUlDUmpZbHNuWm5WdVkzUnBiMjRuWFRzS0NRbHBaaUFvSUNFZ2FYTmZZWEp5WVhrb0lDUm1iaUFwSUh4OElHTnZkVzUwS0NBa1ptNGdLU0FoUFQwZ01pQXBJSHNnWTI5dWRHbHVkV1U3SUgwS0NRa2thMndnUFNCcGMxOXZZbXBsWTNRb0lDUm1ibHN3WFNBcElEOGdaMlYwWDJOc1lYTnpLQ0FrWm01Yk1GMGdLU0E2SUNoemRISnBibWNwSUNSbWJsc3dYVHNLQ1FscFppQW9JQ2RRWlhSemFHOXdYMFpDVkNjZ0lUMDlJQ1JyYkNCOGZDQW5jbVZ1WkdWeVgzZHBaR2RsZENjZ0lUMDlJQ1JtYmxzeFhTQXBJSHNnWTI5dWRHbHVkV1U3SUgwS0NRbHlaVzF2ZG1WZllXTjBhVzl1S0NBa2FDd2dKR1p1TENBeU1DQXBPd29KQ1dGa1pGOWhZM1JwYjI0b0lDZDNiMjlqYjIxdFpYSmpaVjl6YVc1bmJHVmZjSEp2WkhWamRGOXpkVzF0WVhKNUp5d2dKR1p1TENBek1pQXBPd29KQ1hKbGRIVnlianNLQ1gwS2ZTd2dNakFnS1RzSycpOyBpZihzdHJwb3MoJGtvZGFzLCdQZXRzaG9wX0ZCVCcpPT09ZmFsc2UpIHRocm93IG5ldyBFeGNlcHRpb24oJ2Jsb2dhcyB0dXJpbnlzJyk7CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLFRPS0VOX1BBUlNFKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7IHRocm93IG5ldyBFeGNlcHRpb24oJ1BBUlNFICcuJGUtPmdldE1lc3NhZ2UoKSk7IH0KICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRwbCwka29kYXMpOyAkclsnbWQ1J109bWQ1X2ZpbGUoJHBsKTsgJHJbJ2hlYXJ0YmVhdCddPSRoYigpOyBpZigkclsnaGVhcnRiZWF0J10hPT0yMDApeyBAdW5saW5rKCRwbCk7ICRyWydBVFNUQVRZVEEnXT0xOyB9CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpeyB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkclsnc3VwZXJfY2FjaGUnXT0nacWhdmFseXRhcyc7IH0KICB9CiAgaWYoJGY9PT0nMicpewogICAgZm9yZWFjaChbMTg1NjAsMzUzMTZdIGFzICRwaWQpeyAkcnM9d3BfcmVtb3RlX2dldChnZXRfcGVybWFsaW5rKCRwaWQpLic/cHNfbm9jYWNoZT0nLnRpbWUoKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgcHMtczE3MjAnXSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRycyk7CiAgICAgICRyWydwcmVrZXMnXVskcGlkXT1bJ2h0dHAnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpLCdhZGRfdG9fY2FydCc9PnN0cnBvcygkYiwnc2luZ2xlX2FkZF90b19jYXJ0X2J1dHRvbicpLCdjYWxjJz0+c3RycG9zKCRiLCdjbGFzcz0icHMtY2FsYyInKSwnZmJ0Jz0+c3RycG9zKCRiLCdwZXRzaG9wLWZidF9faGVhZGluZycpLCdhdHNhcmdvcyc9PnN0cnBvcygkYiwncHMtYXRzYXJndScpLCdtZXRhJz0+c3RycG9zKCRiLCdwcm9kdWN0X21ldGEnKSwnZmJ0X2thcnR1Jz0+c3Vic3RyX2NvdW50KCRiLCdwZXRzaG9wLWZidF9faGVhZGluZycpXTsgfQogICAgJHJbJ2hlYXJ0YmVhdCddPSRoYigpOyAkclsncGhwX2Vycm9yX3RhaWwnXT1zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZycpLC00MDApOwogIH0KICBpZigkZj09PSc5Jyl7IGlmKGZpbGVfZXhpc3RzKCRwbCkpIHJlbmFtZSgkcGwsJGFyLicvcGV0c2hvcC1wcmVrZXMtdHZhcmthLnBocC5vZmZfczE3MjAnKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkclsnaGVhcnRiZWF0J109JGhiKCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-200732';
const GKEY='ps_s1720n';
const PHASES=["1", "2"];
const OUT='analize/s1720_n.json';
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
