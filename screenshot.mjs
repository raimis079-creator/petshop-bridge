process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDggcnVuIGUzcCDigJQgdHJpasWzIHNhbmTEl2xpxbMgdGVzdG8gcGFydW/FoWltYXM6IHByZWtpxbMga2FuZGlkYXRhaSArIMWhYWJsb25vIHXFvnNha3ltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTNwJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2UzcCddKSk7ICRvPWFycmF5KCd2Jz0+J3J1biBlM3AnLCdmJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogIHRyeXsKICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9BVl9Tb3VyY2UnLCdyZXNvbHZlJyk7ICRvWydyZXNvbHZlX3NpZyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4LT5nZXROYW1lKCk7fSwkcm0tPmdldFBhcmFtZXRlcnMoKSk7CiAgICBmb3JlYWNoKGFycmF5KDM1NDQ0LDM1NDQzLDM1NDQxKSBhcyAkb2lkKXsgJG9yZD13Y19nZXRfb3JkZXIoJG9pZCk7IGlmKCEkb3JkKSBjb250aW51ZTsgJHNoPWFycmF5KCk7IGZvcmVhY2goJG9yZC0+Z2V0X2l0ZW1zKCdzaGlwcGluZycpIGFzICRzaSl7ICRzaFtdPWFycmF5KCdtZXRob2RfaWQnPT4kc2ktPmdldF9tZXRob2RfaWQoKSwnaW5zdGFuY2UnPT4kc2ktPmdldF9pbnN0YW5jZV9pZCgpLCd0aXRsZSc9PiRzaS0+Z2V0X21ldGhvZF90aXRsZSgpLCd0b3RhbCc9PiRzaS0+Z2V0X3RvdGFsKCksJ21ldGEnPT4kc2ktPmdldF9tZXRhX2RhdGEoKT9hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+a2V5Lic9Jy5tYl9zdWJzdHIoaXNfc2NhbGFyKCRtLT52YWx1ZSk/JG0tPnZhbHVlOmpzb25fZW5jb2RlKCRtLT52YWx1ZSksMCw2MCk7fSwkc2ktPmdldF9tZXRhX2RhdGEoKSk6YXJyYXkoKSk7IH0KICAgICAgJG9tPWFycmF5KCk7IGZvcmVhY2goJG9yZC0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgaWYoc3RycG9zKCRtLT5rZXksJ3ZlbmlwYWsnKSE9PWZhbHNlfHxzdHJwb3MoJG0tPmtleSwnX3BzXycpPT09MCkgJG9tWyRtLT5rZXldPW1iX3N1YnN0cihpc19zY2FsYXIoJG0tPnZhbHVlKT8kbS0+dmFsdWU6anNvbl9lbmNvZGUoJG0tPnZhbHVlKSwwLDgwKTsgfQogICAgICAkb1snc2FibG9uYXMnXVskb2lkXT1hcnJheSgnc3QnPT4kb3JkLT5nZXRfc3RhdHVzKCksJ3BheSc9PiRvcmQtPmdldF9wYXltZW50X21ldGhvZCgpLCdiaWxsJz0+JG9yZC0+Z2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgpLicgJy4kb3JkLT5nZXRfYmlsbGluZ19sYXN0X25hbWUoKS4nICcuJG9yZC0+Z2V0X2JpbGxpbmdfZW1haWwoKS4nICcuJG9yZC0+Z2V0X2JpbGxpbmdfcGhvbmUoKS4nICcuJG9yZC0+Z2V0X2JpbGxpbmdfYWRkcmVzc18xKCkuJyAnLiRvcmQtPmdldF9iaWxsaW5nX2NpdHkoKS4nICcuJG9yZC0+Z2V0X2JpbGxpbmdfcG9zdGNvZGUoKSwnc2hpcCc9PiRzaCwnbWV0YSc9PiRvbSwnaXRlbXMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJGl0KXtyZXR1cm4gJGl0LT5nZXRfcHJvZHVjdF9pZCgpLicgJy4kaXQtPmdldF9xdWFudGl0eSgpLid4ICcubWJfc3Vic3RyKCRpdC0+Z2V0X25hbWUoKSwwLDMwKS4nIHNyYz0nLiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKS4nIGs9Jy4kaXQtPmdldF9tZXRhKCdfcHNfa2VsaWFzJyk7fSxhcnJheV92YWx1ZXMoJG9yZC0+Z2V0X2l0ZW1zKCkpKSk7IH0KICAgICRpZHM9d2NfZ2V0X3Byb2R1Y3RzKGFycmF5KCdzdGF0dXMnPT4ncHVibGlzaCcsJ2xpbWl0Jz0+NDAwLCdyZXR1cm4nPT4naWRzJywnc3RvY2tfc3RhdHVzJz0+J2luc3RvY2snLCd0eXBlJz0+J3NpbXBsZScsJ29yZGVyYnknPT4nSUQnLCdvcmRlcic9PidERVNDJykpOwogICAgJGthbmQ9YXJyYXkoJ3piJz0+YXJyYXkoKSwndmYnPT5hcnJheSgpLCdhdic9PmFycmF5KCkpOyAkbj0wOwogICAgZm9yZWFjaCgkaWRzIGFzICRwaWQpeyAkdj1QZXRzaG9wX0FWX1NvdXJjZTo6cmVzb2x2ZSgkcGlkLDEpOyAkcz1pc19hcnJheSgkdik/KCR2Wydzb3VyY2UnXT8/JycpOicnOyAkYXE9aXNfYXJyYXkoJHYpPygkdlsnYXZfcXR5J10/P251bGwpOm51bGw7IGlmKCFpc3NldCgka2FuZFskc10pKSBjb250aW51ZTsgaWYoY291bnQoJGthbmRbJHNdKT49NCkgY29udGludWU7ICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJGthbmRbJHNdW109YXJyYXkoJ3BpZCc9PiRwaWQsJ24nPT5tYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsNDApLCdza3UnPT4kcHItPmdldF9za3UoKSwnYXZfcXR5Jz0+JGFxLCd3Jz0+JHByLT5nZXRfd2VpZ2h0KCksJ3piJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfcXR5Jyx0cnVlKSwnc3RvY2snPT4kcHItPmdldF9zdG9ja19xdWFudGl0eSgpLCdvd24nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwna29kZWwnPT5tYl9zdWJzdHIoKHN0cmluZykoJHZbJ3JlYXNvbiddPz9qc29uX2VuY29kZSgkdikpLDAsODApKTsgaWYoKyskbj4zJiZjb3VudCgka2FuZFsnemInXSk+PTQmJmNvdW50KCRrYW5kWyd2ZiddKT49NCYmY291bnQoJGthbmRbJ2F2J10pPj00KSBicmVhazsgfQogICAgJG9bJ2thbmQnXT0ka2FuZDsgJG9bJ3B2el9yZXNvbHZlXzE5NzA4J109UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoMTk3MDgsMSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-154653';
const GKEY='ps_e3p';
const PHASES=["P"];
const OUT='analize/e3_run4p.json';
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
