process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQyYSByZWNvbiBQYXlzZXJhIGtvcnRlbGnFsyByZWlrYWxhdmltYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQyYSddKSkgcmV0dXJuOyAkRj0kX0dFVFsncHNfczE3NDJhJ107IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MmEnLCdmJz0+JEZdOwogICRjbD1mdW5jdGlvbigkaCl7IHJldHVybiB0cmltKHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsd3Bfc3RyaXBfYWxsX3RhZ3MoJGgpKSk7IH07CiAgdHJ5ewogIGlmKCRGPT09JzEnKXsKICAgIGZvcmVhY2goWyd3b29jb21tZXJjZV90ZXJtc19wYWdlX2lkJywnd3BfcGFnZV9mb3JfcHJpdmFjeV9wb2xpY3knLCd3b29jb21tZXJjZV9jaGVja291dF90ZXJtc19hbmRfY29uZGl0aW9uc19jaGVja2JveF90ZXh0Jywnd29vY29tbWVyY2VfY2hlY2tvdXRfcHJpdmFjeV9wb2xpY3lfdGV4dCcsJ3dvb2NvbW1lcmNlX3JlZ2lzdHJhdGlvbl9wcml2YWN5X3BvbGljeV90ZXh0Jywnd29vY29tbWVyY2VfY2hlY2tvdXRfaGlnaGxpZ2h0X3JlcXVpcmVkX2ZpZWxkcycsJ3dvb2NvbW1lcmNlX2RlZmF1bHRfY291bnRyeSddIGFzICRvKSAkclsnb3B0J11bJG9dPWdldF9vcHRpb24oJG8pOwogICAgJHRpZD13Y190ZXJtc19hbmRfY29uZGl0aW9uc19wYWdlX2lkKCk7ICRyWyd0ZXJtc19wYWdlJ109JHRpZD9bZ2V0X3RoZV90aXRsZSgkdGlkKSxnZXRfcGVybWFsaW5rKCR0aWQpLGdldF9wb3N0X3N0YXR1cygkdGlkKV06bnVsbDsKICAgICRwaWQ9KGludClnZXRfb3B0aW9uKCd3cF9wYWdlX2Zvcl9wcml2YWN5X3BvbGljeScpOyAkclsncHJpdl9wYWdlJ109JHBpZD9bZ2V0X3RoZV90aXRsZSgkcGlkKSxnZXRfcGVybWFsaW5rKCRwaWQpLGdldF9wb3N0X3N0YXR1cygkcGlkKV06bnVsbDsKICAgICRyWydjaGVja2JveF9lbmFibGVkJ109ZnVuY3Rpb25fZXhpc3RzKCd3Y190ZXJtc19hbmRfY29uZGl0aW9uc19jaGVja2JveF9lbmFibGVkJyk/d2NfdGVybXNfYW5kX2NvbmRpdGlvbnNfY2hlY2tib3hfZW5hYmxlZCgpOm51bGw7CiAgICAkclsnc2hvd190ZXJtc19maWx0ZXInXT1hcHBseV9maWx0ZXJzKCd3b29jb21tZXJjZV9jaGVja291dF9zaG93X3Rlcm1zJyx0cnVlKTsKICAgIGdsb2JhbCAkd3BfZmlsdGVyOyBmb3JlYWNoKFsnd29vY29tbWVyY2VfY2hlY2tvdXRfc2hvd190ZXJtcycsJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X3Rlcm1zX2FuZF9jb25kaXRpb25zJywnd29vY29tbWVyY2VfY2hlY2tvdXRfYmVmb3JlX3Rlcm1zX2FuZF9jb25kaXRpb25zJywnd29vY29tbWVyY2VfY2hlY2tvdXRfYWZ0ZXJfdGVybXNfYW5kX2NvbmRpdGlvbnMnLCd3b29jb21tZXJjZV9nZXRfdGVybXNfYW5kX2NvbmRpdGlvbnNfY2hlY2tib3hfdGV4dCcsJ3dvb2NvbW1lcmNlX3Jldmlld19vcmRlcl9iZWZvcmVfc3VibWl0Jywnd29vY29tbWVyY2VfY2hlY2tvdXRfcHJvY2VzcycsJ3dvb2NvbW1lcmNlX2FmdGVyX2NoZWNrb3V0X3ZhbGlkYXRpb24nXSBhcyAkaCl7IGlmKCFpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGNvbnRpbnVlOyBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHA9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZj0kY2JbJ2Z1bmN0aW9uJ107ICRuPWlzX3N0cmluZygkZik/JGY6KGlzX2FycmF5KCRmKT8oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOidjbG9zdXJlJyk7IGlmKCRuPT09J2Nsb3N1cmUnKXsgdHJ5eyRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsgJG49J2Nsb3N1cmVAJy5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyZi0+Z2V0U3RhcnRMaW5lKCk7fWNhdGNoKFRocm93YWJsZSAkZSl7fSB9ICRyWydob29rcyddWyRoXVtdPSRwLicgJy4kbjsgfSB9CiAgICAvLyBncmVwIG11LXBsdWdpbnMgKyBjaGlsZCB0aGVtZSBmb3IgdGVybXMKICAgICRkaXJzPVtXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnLCBnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKV07IGZvcmVhY2goJGRpcnMgYXMgJGQpeyBmb3JlYWNoKGdsb2IoJGQuJy8qLnBocCcpIGFzICRmbCl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbCk7IGlmKHByZWdfbWF0Y2hfYWxsKCcvXi4qKHNob3dfdGVybXN8dGVybXNfYW5kX2NvbmRpdGlvbnN8dGVybXMtYW5kLWNvbmRpdGlvbnN8cHJpdmFjeV9wb2xpY3lfdGV4dHxwc19zdXRpbmt8c3V0aW5rdSkuKiQvbWknLCRzLCRtKSkgJHJbJ2dyZXAnXVtzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmbCldPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cih0cmltKCR4KSwwLDIyMCk7fSwkbVswXSksMCw4KTsgfSB9CiAgfQogIGlmKCRGPT09JzInKXsKICAgICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfaGI9Jy50aW1lKCkpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRyWydjb2RlJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyAkclsnbGVuJ109c3RybGVuKCRoKTsKICAgICRpPXN0cmlwb3MoJGgsJzxmb290ZXInKTsgJGY9JGkhPT1mYWxzZT9zdWJzdHIoJGgsJGkpOnN1YnN0cigkaCwtMzAwMDApOwogICAgJHJbJ2Zvb3Rlcl90ZXh0J109bWJfc3Vic3RyKCRjbChwcmVnX3JlcGxhY2UoJyM8KHNjcmlwdHxzdHlsZSlbXj5dKj4uKj88L1wxPiNzaScsJycsJGYpKSwwLDI1MDApOwogICAgcHJlZ19tYXRjaF9hbGwoJyM8aW1nW14+XSs+I2knLCRmLCRtKTsgJHJbJ2Zvb3Rlcl9pbWdzJ109YXJyYXlfc2xpY2UoJG1bMF0sMCwzMCk7CiAgICBwcmVnX21hdGNoX2FsbCgnIzxzdmdbXj5dKihhcmlhLWxhYmVsfGNsYXNzKT0iW14iXSoiI2knLCRmLCRtMik7ICRyWydmb290ZXJfc3ZncyddPWFycmF5X3NsaWNlKCRtMlswXSwwLDIwKTsKICAgIGZvcmVhY2goWyd2aXNhJywnbWFzdGVyY2FyZCcsJ0AnLCd0ZWw6JywnbWFpbHRvOiddIGFzICRrKXsgJHA9MDsgJHJbJ2N0eCddWyRrXT1bXTsgd2hpbGUoKCRwPXN0cmlwb3MoJGYsJGssJHApKSE9PWZhbHNlICYmIGNvdW50KCRyWydjdHgnXVska10pPDQpeyAkclsnY3R4J11bJGtdW109bWJfc3Vic3RyKHN1YnN0cigkZixtYXgoMCwkcC0zMDApLDYwMCksMCw2MDApOyAkcCs9c3RybGVuKCRrKTt9IH0KICAgICRyWyd0aGVtZV9tb2RzX2Zvb3RlciddPWFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X3RoZW1lX21vZHMoKSxmdW5jdGlvbigkdiwkayl7IHJldHVybiBwcmVnX21hdGNoKCcvZm9vdGVyfHBheW1lbnR8YWJzb2x1dGUvaScsJGspOyB9LEFSUkFZX0ZJTFRFUl9VU0VfQk9USCk7CiAgfQogIGlmKCRGPT09JzMnKXsKICAgIGZvcmVhY2goWydncmF6aW5pbWFzJywncGlya2ltby10YWlzeWtsZXMnLCd0YWlzeWtsZXMnLCdwcml2YXR1bW8tcG9saXRpa2EnLCdrb250YWt0YWknXSBhcyAkc2wpeyAkcD1nZXRfcGFnZV9ieV9wYXRoKCRzbCk7IGlmKCEkcCkgeyAkclsncGFnZXMnXVskc2xdPW51bGw7IGNvbnRpbnVlOyB9ICR0PSRjbChkb19zaG9ydGNvZGUoJHAtPnBvc3RfY29udGVudCkpOyAkaGl0cz1bXTsgaWYocHJlZ19tYXRjaF9hbGwoJy9bXi5dezAsMjIwfSgxNHxrZXR1cmlvbGlrfGdyxIXFvmlufGF0c2lzYWspW14uXXswLDIyMH1cLi9pdScsJHQsJG0pKSAkaGl0cz1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1bMF0pLDAsMTApOyAkclsncGFnZXMnXVskc2xdPVsnaWQnPT4kcC0+SUQsJ3RpdGxlJz0+JHAtPnBvc3RfdGl0bGUsJ21vZCc9PiRwLT5wb3N0X21vZGlmaWVkLCdsZW4nPT5tYl9zdHJsZW4oJHQpLCdoaXRzJz0+JGhpdHMsICdoZWFkJz0+bWJfc3Vic3RyKCR0LDAsNjAwKV07IH0KICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-154319';
const GKEY='ps_s1742a';
const PHASES=["1", "2", "3"];
const OUT='analize/s1742_a.json';
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
