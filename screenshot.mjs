process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzEgZCDigJQgQTogcGVya2VsaW1hczsgVDogcGF0aWtyYS4gQXRzYXJnaW5lIGkgb3B0aW9uIHBzX3MxNjcxX2F0c2FyZ2luZS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGYgPSBpc3NldCgkX0dFVFsncHNfczE2NzFkJ10pID8gJF9HRVRbJ3BzX3MxNjcxZCddIDogJyc7CiAgaWYgKCRmIT09J0EnICYmICRmIT09J1QnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY3MSBkJywnZmF6ZSc9PiRmKTsKICAkbGs9JHdwZGItPnByZWZpeC4nd2NfcHJvZHVjdF9tZXRhX2xvb2t1cCc7CiAgJG9bJ3NsZXBpYV9pc3BhcmR1b3RhcyddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2hpZGVfb3V0X29mX3N0b2NrX2l0ZW1zJyk7CiAgdHJ5ewogICAgJHQ9JHdwZGItPnByZWZpeC4ncHNfcGFydGlqb3MnOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCwgU1VNKGtpZWtpc19saWtvKSBsaWtvIEZST00gJHQgV0hFUkUgYXRzYXVrdGE9MCBHUk9VUCBCWSBwcm9kdWN0X2lkIixBUlJBWV9BKTsKICAgICRwbGFuPWFycmF5KCk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsKICAgICAgJHBpZD0oaW50KSRyWydwcm9kdWN0X2lkJ107ICRsaWtvPShpbnQpJHJbJ2xpa28nXTsKICAgICAgJHRzPVBldHNob3BfS2F0YWxvZ2FzOjp0aWVrZWpvX3NhbmRlbGlzKCRwaWQpOyBpZigkdHM9PT0nJykgY29udGludWU7CiAgICAgICRhdj0oaW50KVBldHNob3BfS2F0YWxvZ2FzOjphdl9kYWJhcigkcGlkKTsgaWYoJGF2PT09JGxpa28pIGNvbnRpbnVlOwogICAgICAkcGxhbltdPWFycmF5KCdwaWQnPT4kcGlkLCd0aWVrJz0+JHRzLCd4bWwnPT5QZXRzaG9wX0thdGFsb2dhczo6eG1sX3NhbmRlbGlzKCRwaWQpLCdsaWtvJz0+JGxpa28pOwogICAgfQogICAgJG9bJ3BsYW5lJ109Y291bnQoJHBsYW4pOwoKICAgIGlmKCRmPT09J0EnKXsKICAgICAgaWYoZ2V0X29wdGlvbigncHNfczE2NzFfYXRzYXJnaW5lJykpeyAkb1snS0xBSURBJ109J2F0c2FyZ2luZSBqYXUgeXJhIOKAlCBwZXJrZWxpbWFzIGphdSB2eWtkeXRhcyc7IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgJGJhaz1hcnJheSgpOwogICAgICBmb3JlYWNoKCRwbGFuIGFzICRwKXsgJHBpZD0kcFsncGlkJ107CiAgICAgICAgJGJha1skcGlkXT1hcnJheSgnb3duJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksCiAgICAgICAgICAnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksCiAgICAgICAgICAnc3RhdHVzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2tfc3RhdHVzJyx0cnVlKSwKICAgICAgICAgICdsayc9PiR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc3RvY2tfcXVhbnRpdHksc3RvY2tfc3RhdHVzIEZST00gJGxrIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRwaWQpLEFSUkFZX0EpKTsKICAgICAgfQogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTY3MV9hdHNhcmdpbmUnLCRiYWssZmFsc2UpOwogICAgICAkb1snYXRzYXJnaW5lX24nXT1jb3VudCgkYmFrKTsKCiAgICAgICRhdl9uPTA7ICRzdF9uPTA7CiAgICAgIGZvcmVhY2goJHBsYW4gYXMgJHApewogICAgICAgICRwaWQ9JHBbJ3BpZCddOwogICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLChpbnQpJHBbJ2xpa28nXSk7ICRhdl9uKys7CiAgICAgICAgaWYoISRwWyd4bWwnXSl7CiAgICAgICAgICAvKiBSYW5raW5pbyB0aWVrZWpvIGVpbHV0ZToga2lla2lvIG5lemlub20sIGtvbCBSYWltaXMgbmVpdmVzLiBBViBsaWt1dGlzCiAgICAgICAgICAgICBsaWVrYSBgX293bl9zdG9ja19xdHlgLCBvIHBhcmRhdmltbyByaWJhIGppIHByaWRlZGEgcGVyIFBldHNob3BfQVZfTGltaXQuICovCiAgICAgICAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsMCk7CiAgICAgICAgICAkYnVzID0gKChpbnQpJHBbJ2xpa28nXT4wKSA/ICdpbnN0b2NrJyA6ICdvdXRvZnN0b2NrJzsKICAgICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3N0b2NrX3N0YXR1cycsJGJ1cyk7CiAgICAgICAgICAkd3BkYi0+dXBkYXRlKCRsayxhcnJheSgnc3RvY2tfcXVhbnRpdHknPT4wLCdzdG9ja19zdGF0dXMnPT4kYnVzKSxhcnJheSgncHJvZHVjdF9pZCc9PiRwaWQpKTsKICAgICAgICAgICRzdF9uKys7CiAgICAgICAgfQogICAgICB9CiAgICAgICRvWydhdl9hdG5hdWppbnRhJ109JGF2X247ICRvWyd0aWVrZWpvX251bnVsaW50YSddPSRzdF9uOwogICAgfSBlbHNlIHsKICAgICAgZm9yZWFjaChhcnJheV9zbGljZSgkcGxhbiwwLDUpIGFzICRwKXsgJHBpZD0kcFsncGlkJ107CiAgICAgICAgJG9bJ2xpa29fbmVzdXRhbXBhJ11bXT1hcnJheSgnaWQnPT4kcGlkLCd0aWVrJz0+JHBbJ3RpZWsnXSwncGFydGlqb3MnPT4kcFsnbGlrbyddLAogICAgICAgICAgJ2F2Jz0+UGV0c2hvcF9LYXRhbG9nYXM6OmF2X2RhYmFyKCRwaWQpLCdfc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSkpOwogICAgICB9CiAgICAgIGZvcmVhY2goYXJyYXkoMTczNjMsMTU4MzgsMTY1MzcpIGFzICRwaWQpewogICAgICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICAgICAkb1sncHZ6J11bJHBpZF09YXJyYXkoJ293bic9PmdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCdfc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksCiAgICAgICAgICAnc3RhdHVzX21ldGEnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9ja19zdGF0dXMnLHRydWUpLAogICAgICAgICAgJ3djX3F0eSc9PiRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsJ3djX3N0YXR1cyc9PiRwcj8kcHItPmdldF9zdG9ja19zdGF0dXMoKTpudWxsLAogICAgICAgICAgJ3BlcmthbWEnPT4kcHI/KCRwci0+aXNfaW5fc3RvY2soKT8neXJhJzonbmVyYScpOm51bGwpOwogICAgICB9CiAgICAgICRvWydmcm9udCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjE1KSkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-183009';
const GKEY='ps_s1671d';
const PHASES=["A", "T"];
const OUT='analize/s1671_d.json';
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
