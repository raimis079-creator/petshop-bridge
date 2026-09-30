process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQxdCByZWNvbjogUGV0c2hvcF9SZWxhdW5jaCBtZXRvZGFpICsgU2VuZGVyIHBhc2t5cmEvbGF1a2FpL2dydXBlcyAocmVhZC1vbmx5LCBiZSBQSUkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MXQnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzQxdCddOwogIHRyeXsKICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9SZWxhdW5jaCcpKXsgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfUmVsYXVuY2gnKTsgJHJbJ3JlbGF1bmNoX2ZpbGUnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyYy0+Z2V0RmlsZU5hbWUoKSk7ICRyWydtZXRvZGFpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXsgcmV0dXJuICRtLT5nZXROYW1lKCkuJygnLmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICckJy4kcC0+Z2V0TmFtZSgpO30sJG0tPmdldFBhcmFtZXRlcnMoKSkpLicpJy4oJG0tPmlzU3RhdGljKCk/J3MnOicnKS4oJG0tPmlzUHVibGljKCk/Jyc6Jy1wJyk7IH0sJHJjLT5nZXRNZXRob2RzKCkpOwogICAgICAkbHM9ZmlsZSgkcmMtPmdldEZpbGVOYW1lKCkpOyAkaGl0PVtdOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gKGtvbnRha3RvX2R1b21lbnlzfGR1b21lbnlzfHNrYWljaXVvdGl8ZWlsdXRlc3xjYWxjfGhlcm8pfGV1cl9udW98RmVlZGluZ19TZXJ2aWNlOjpjYWxjfFwnZFwnXHMqPT58XCdnXCdccyo9Pi8nLCRsKSkgJGhpdFtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjAwKSk7IH0gJHJbJ3ZpZXRvcyddPWFycmF5X3NsaWNlKCRoaXQsMCwzMCk7IH0KICAgICRyWydmZWVkaW5nJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpPydQZXRzaG9wX0ZlZWRpbmdfU2VydmljZSc6KGNsYXNzX2V4aXN0cygnRmVlZGluZ19TZXJ2aWNlJyk/J0ZlZWRpbmdfU2VydmljZSc6J25lcmEnKTsKICAgICR0b2s9Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NlbmRlcl9BZGFwdGVyJyk/UGV0c2hvcF9TZW5kZXJfQWRhcHRlcjo6Z2V0X3N0b3JlZF90b2tlbignbWFya2V0aW5nJyk6bnVsbDsgJHJbJ3RvayddPSR0b2s/J3lyYSc6J25lcmEnOwogICAgJGFwaT1mdW5jdGlvbigkbSwkcCwkYj1udWxsKSB1c2UoJHRvayl7ICRhPVsnbWV0aG9kJz0+JG0sJ3RpbWVvdXQnPT4yNSwnaGVhZGVycyc9PlsnQXV0aG9yaXphdGlvbic9PidCZWFyZXIgJy4kdG9rLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vanNvbicsJ0NvbnRlbnQtVHlwZSc9PidhcHBsaWNhdGlvbi9qc29uJ11dOyBpZigkYiE9PW51bGwpICRhWydib2R5J109d3BfanNvbl9lbmNvZGUoJGIpOyAkeD13cF9yZW1vdGVfcmVxdWVzdCgnaHR0cHM6Ly9hcGkuc2VuZGVyLm5ldC92MicuJHAsJGEpOyBpZihpc193cF9lcnJvcigkeCkpIHJldHVybiBbJ2NvZGUnPT4wLCdlcnInPT4keC0+Z2V0X2Vycm9yX21lc3NhZ2UoKV07IHJldHVybiBbJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksJ2JvZHknPT5qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCksdHJ1ZSldOyB9OwogICAgaWYoJHRvayl7CiAgICAgICRnPSRhcGkoJ0dFVCcsJy9ncm91cHM/bGltaXQ9NTAnKTsgJHJbJ2dyb3VwcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIFskeFsnaWQnXT8/JycsJHhbJ3RpdGxlJ10/PycnLCR4WydhY3RpdmVfc3Vic2NyaWJlcnMnXT8/bnVsbCwkeFsndW5zdWJzY3JpYmVkX2NvdW50J10/P251bGwsJHhbJ2JvdW5jZWRfY291bnQnXT8/bnVsbF07fSwoYXJyYXkpKCRnWydib2R5J11bJ2RhdGEnXT8/W10pKTsKICAgICAgJGY9JGFwaSgnR0VUJywnL2ZpZWxkcz9saW1pdD0xMDAnKTsgJHJbJ2ZpZWxkcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICgkeFsndGl0bGUnXT8/JycpLic6Jy4oJHhbJ3R5cGUnXT8/JycpO30sKGFycmF5KSgkZlsnYm9keSddWydkYXRhJ10/P1tdKSk7CiAgICAgICRzPSRhcGkoJ0dFVCcsJy9zdWJzY3JpYmVycz9saW1pdD0xJyk7ICRyWydzdWJzX21ldGEnXT0kc1snYm9keSddWydtZXRhJ10/P251bGw7CiAgICAgICRjPSRhcGkoJ0dFVCcsJy9jYW1wYWlnbnM/bGltaXQ9NicpOyAkclsnY2FtcGFpZ25zJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gWyR4WydpZCddPz8nJyxtYl9zdWJzdHIoJHhbJ3RpdGxlJ10/PycnLDAsNTApLCR4WydzdGF0dXMnXT8/JycsJHhbJ3NlbnRfY291bnQnXT8/KCR4WydyZWNpcGllbnRfY291bnQnXT8/bnVsbCksJHhbJ2Zyb20nXT8/JycsJHhbJ3JlcGx5X3RvJ10/PycnLCR4WydjcmVhdGVkJ10/PycnXTt9LChhcnJheSkoJGNbJ2JvZHknXVsnZGF0YSddPz9bXSkpOwogICAgICBmb3JlYWNoKFsnL2FjY291bnQnLCcvdXNlcnMvbWUnLCcvbWUnXSBhcyAkZXApeyAkYT0kYXBpKCdHRVQnLCRlcCk7IGlmKCRhWydjb2RlJ109PTIwMCl7ICRiPSRhWydib2R5J11bJ2RhdGEnXT8/JGFbJ2JvZHknXTsgaWYoaXNfYXJyYXkoJGIpKXsgZm9yZWFjaCgkYiBhcyAkaz0+JHYpeyBpZihwcmVnX21hdGNoKCcvbWFpbHxwaG9uZXxuYW1lfGFkZHJlc3N8dG9rZW58a2V5fGNhcmQvaScsJGspKSB1bnNldCgkYlska10pOyB9IH0gJHJbJ2FjYyddWyRlcF09aXNfYXJyYXkoJGIpP21iX3N1YnN0cihqc29uX2VuY29kZSgkYixKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDkwMCk6JGI7IH0gZWxzZSAkclsnYWNjJ11bJGVwXT0kYVsnY29kZSddOyB9CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-085611';
const GKEY='ps_s1741t';
const PHASES=["1"];
const OUT='analize/s1741_t.json';
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
