process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzQgcnVuIHM1IOKAlCBTNTogU01UUCBmcm9tIOKGkiB1enNha3ltYWlAcGV0c2hvcC5sdCAoYmFrIHBzX3MxNjM0X3NtdHBfYmFrKTsgV0MgbmV3L2NhbmNlbGxlZC9mYWlsZWQgb3JkZXIgZ2F2xJdqYWkg4oaSIHV6c2FreW1haUAgKGJhayBwc19zMTYzNF93Y19iYWspOyBwYXRpa3JhIHJlLXJlYWQuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM0czUnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYzNCBzNScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRFPSd1enNha3ltYWlAcGV0c2hvcC5sdCc7CiAgLy8gMSkgU01UUAogICRzPWdldF9vcHRpb24oJ3dwX21haWxfc210cCcpOwogIGlmKGlzX2FycmF5KCRzKSl7CiAgICBpZihmYWxzZT09PWdldF9vcHRpb24oJ3BzX3MxNjM0X3NtdHBfYmFrJykpIGFkZF9vcHRpb24oJ3BzX3MxNjM0X3NtdHBfYmFrJyxhcnJheSgnZnJvbV9lbWFpbCc9PiRzWydtYWlsJ11bJ2Zyb21fZW1haWwnXT8/JycsJ2Zyb21fbmFtZSc9PiRzWydtYWlsJ11bJ2Zyb21fbmFtZSddPz8nJywnZm9yY2UnPT4kc1snbWFpbCddWydmcm9tX2VtYWlsX2ZvcmNlJ10/P251bGwpLCcnLCdubycpOwogICAgJG9bJ3NtdHBfYnV2byddPWFycmF5KCRzWydtYWlsJ11bJ2Zyb21fbmFtZSddPz8nJywkc1snbWFpbCddWydmcm9tX2VtYWlsJ10/PycnLCRzWydtYWlsJ11bJ2Zyb21fZW1haWxfZm9yY2UnXT8/bnVsbCk7CiAgICAkc1snbWFpbCddWydmcm9tX2VtYWlsJ109JEU7ICRzWydtYWlsJ11bJ2Zyb21fbmFtZSddPSdQZXRzaG9wLmx0JzsgJHNbJ21haWwnXVsnZnJvbV9lbWFpbF9mb3JjZSddPXRydWU7CiAgICB1cGRhdGVfb3B0aW9uKCd3cF9tYWlsX3NtdHAnLCRzKTsKICB9CiAgLy8gMikgV0MgYWRtaW4gZ2F2xJdqYWkKICBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9uZXdfb3JkZXJfc2V0dGluZ3MnLCd3b29jb21tZXJjZV9jYW5jZWxsZWRfb3JkZXJfc2V0dGluZ3MnLCd3b29jb21tZXJjZV9mYWlsZWRfb3JkZXJfc2V0dGluZ3MnKSBhcyAkayl7CiAgICAkdj1nZXRfb3B0aW9uKCRrKTsgaWYoIWlzX2FycmF5KCR2KSkgY29udGludWU7CiAgICAkb1snd2NfYnV2byddWyRrXT0kdlsncmVjaXBpZW50J10/PycnOwogICAgaWYoKCR2WydyZWNpcGllbnQnXT8/JycpIT09JEUpeyAkYmFrPShhcnJheSlnZXRfb3B0aW9uKCdwc19zMTYzNF93Y19iYWsnLGFycmF5KCkpOyBpZighaXNzZXQoJGJha1ska10pKXsgJGJha1ska109JHZbJ3JlY2lwaWVudCddPz8nJzsgdXBkYXRlX29wdGlvbigncHNfczE2MzRfd2NfYmFrJywkYmFrLCdubycpOyB9ICR2WydyZWNpcGllbnQnXT0kRTsgdXBkYXRlX29wdGlvbigkaywkdik7ICRvWyd3Y19wYWtlaXN0YSddW109JGs7IH0KICB9CiAgLy8gMykgcGF0aWtyYQogIHdwX2NhY2hlX2ZsdXNoKCk7CiAgJHMyPWdldF9vcHRpb24oJ3dwX21haWxfc210cCcpOwogICRvWydzbXRwX2RhYmFyJ109YXJyYXkoJHMyWydtYWlsJ11bJ2Zyb21fbmFtZSddPz8nJywkczJbJ21haWwnXVsnZnJvbV9lbWFpbCddPz8nJywkczJbJ21haWwnXVsnZnJvbV9lbWFpbF9mb3JjZSddPz9udWxsKTsKICBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9uZXdfb3JkZXJfc2V0dGluZ3MnLCd3b29jb21tZXJjZV9jYW5jZWxsZWRfb3JkZXJfc2V0dGluZ3MnLCd3b29jb21tZXJjZV9mYWlsZWRfb3JkZXJfc2V0dGluZ3MnKSBhcyAkayl7ICR2PWdldF9vcHRpb24oJGspOyAkb1snd2NfZGFiYXInXVska109JHZbJ3JlY2lwaWVudCddPz8nJzsgfQogICRvWydwaW5nJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-193404';
const GKEY='ps_s1634s5';
const PHASES=["S5"];
const OUT='analize/s1634_s5.json';
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
