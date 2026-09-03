process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDkgcnVuIGU4ayDigJQga8SFIGtsaWVudGFzIG1hdG8gcGFza3lyb2plICh2aWV3LW9yZGVyKSBzdSByZWdpc3RydW90YSBzaXVudGE6IHRlc3RpbmlzIGtsaWVudGFzICsgIzM1NDIxLyMzNTQ0MCAqLwphZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsIGZ1bmN0aW9uKCRyLCRhKXsgJGw9KGFycmF5KWdldF9vcHRpb24oJ3BzX2U4X21haWwnLGFycmF5KCkpOyAkbFtdPWFycmF5KGN1cnJlbnRfdGltZSgnSDppOnMnKSxpc19hcnJheSgkYVsndG8nXSk/aW1wbG9kZSgnLCcsJGFbJ3RvJ10pOiRhWyd0byddLCRhWydzdWJqZWN0J10pOyB1cGRhdGVfb3B0aW9uKCdwc19lOF9tYWlsJyxhcnJheV9zbGljZSgkbCwtMjApLGZhbHNlKTsgcmV0dXJuIHRydWU7IH0sNCwyKTsKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZThrJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4ncnVuIGU4aycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogIHRyeXsKICAgJGVtPSdzMTYwOS5rbGllbnRhc0BhdmVzYS5sdCc7ICR1aWQ9ZW1haWxfZXhpc3RzKCRlbSk7IGlmKCEkdWlkKXsgJHVpZD13Y19jcmVhdGVfbmV3X2N1c3RvbWVyKCRlbSwnczE2MDlrbGllbnRhcycsd3BfZ2VuZXJhdGVfcGFzc3dvcmQoMjApKTsgfSAkb1sndWlkJ109JHVpZDsKICAgaWYoaXNfd3BfZXJyb3IoJHVpZCkpeyAkb1snRkFUQUwnXT0kdWlkLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyB0aHJvdyBuZXcgRXhjZXB0aW9uKCd1c2VyJyk7IH0KICAgJHU9Z2V0X3VzZXJfYnkoJ2lkJywkdWlkKTsgJHUtPmRpc3BsYXlfbmFtZT0nUzE2MDkgS2xpZW50YXMnOyB3cF91cGRhdGVfdXNlcihhcnJheSgnSUQnPT4kdWlkLCdkaXNwbGF5X25hbWUnPT4nUzE2MDkgS2xpZW50YXMnLCdmaXJzdF9uYW1lJz0+J1Rlc3RhcycpKTsKICAgZm9yZWFjaChhcnJheSgzNTQyMSwzNTQ0MCkgYXMgJG9pZCl7ICRvcmQ9d2NfZ2V0X29yZGVyKCRvaWQpOyAkb1sncHJpZXNfY3VzdG9tZXInXVskb2lkXT0kb3JkLT5nZXRfY3VzdG9tZXJfaWQoKTsgJG9yZC0+c2V0X2N1c3RvbWVyX2lkKCR1aWQpOyAkb3JkLT5zYXZlKCk7IH0KICAgJG9bJ215X2FjY291bnQnXT13Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpOyAkb1sndmlld19vcmRlcl91cmwnXT13Y19nZXRfZW5kcG9pbnRfdXJsKCd2aWV3LW9yZGVyJywzNTQyMSx3Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpKTsgJG9bJ29yZGVyc191cmwnXT13Y19nZXRfZW5kcG9pbnRfdXJsKCdvcmRlcnMnLCcnLHdjX2dldF9wYWdlX3Blcm1hbGluaygnbXlhY2NvdW50JykpOwogICAvLyBrYXMga2FiaW5hIHByaWUgdmlldy1vcmRlciAvIG9yZGVyIGRldGFpbHMgZnJvbnQtZW5kJ2UKICAgZm9yZWFjaChhcnJheSgndmVuaXBhayc9PldQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nJywnbHAnPT5XUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbicsJ211Jz0+V1BNVV9QTFVHSU5fRElSLCdjb3JlJz0+V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScpIGFzICRrPT4kZGlyKXsgJG9bJ2hvb2tzJ11bJGtdPWFycmF5KCk7IGlmKCFpc19kaXIoJGRpcikpIGNvbnRpbnVlOyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIpKTsgZm9yZWFjaCgkaXQgYXMgJGZsKXsgaWYoc3Vic3RyKCRmbCwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkcz1maWxlX2dldF9jb250ZW50cygkZmwpOyBpZihwcmVnX21hdGNoX2FsbCgnLyh3b29jb21tZXJjZV9vcmRlcl9kZXRhaWxzX2FmdGVyX29yZGVyX3RhYmxlfHdvb2NvbW1lcmNlX3ZpZXdfb3JkZXJ8d29vY29tbWVyY2Vfb3JkZXJfZGV0YWlsc19iZWZvcmVfb3JkZXJfdGFibGV8d29vY29tbWVyY2VfbXlfYWNjb3VudF9teV9vcmRlcnNfYWN0aW9uc3x3b29jb21tZXJjZV9teV9hY2NvdW50X215X29yZGVyc19jb2x1bW58d29vY29tbWVyY2VfYWNjb3VudF9bYS16X10rX2VuZHBvaW50fHdvb2NvbW1lcmNlX29yZGVyX2l0ZW1fbWV0YV9lbmQpLycsJHMsJG0pKXsgJG9bJ2hvb2tzJ11bJGtdW109YmFzZW5hbWUoJGZsKS4nOiAnLmltcGxvZGUoJywgJyxhcnJheV91bmlxdWUoJG1bMV0pKTsgfSB9IH0KICAgZm9yZWFjaChhcnJheSgnd29vY29tbWVyY2Vfb3JkZXJfZGV0YWlsc19hZnRlcl9vcmRlcl90YWJsZScsJ3dvb2NvbW1lcmNlX3ZpZXdfb3JkZXInLCd3b29jb21tZXJjZV9vcmRlcl9kZXRhaWxzX2JlZm9yZV9vcmRlcl90YWJsZScpIGFzICRoKXsgZ2xvYmFsICR3cF9maWx0ZXI7ICRvWydneXZpX2hvb2thaSddWyRoXT1hcnJheSgpOyBpZighZW1wdHkoJHdwX2ZpbHRlclskaF0pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicyl7IGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyAkb1snZ3l2aV9ob29rYWknXVskaF1bXT0kcHIuJzogJy4oaXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTooaXNfc3RyaW5nKCRmbik/JGZuOidjbG9zdXJlJykpOyB9IH0gfSB9CiAgICRleHA9dGltZSgpKzE4MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICAkY29vaz1hcnJheSgpOyBmb3JlYWNoKGFycmF5KGFycmF5KFNFQ1VSRV9BVVRIX0NPT0tJRSwnc2VjdXJlX2F1dGgnKSxhcnJheShBVVRIX0NPT0tJRSwnYXV0aCcpLGFycmF5KExPR0dFRF9JTl9DT09LSUUsJ2xvZ2dlZF9pbicpKSBhcyAkYyl7ICRjb29rW109YXJyYXkoJ25hbWUnPT4kY1swXSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJGNbMV0sJHRvaykpOyB9CiAgICRvWydjb29raWVzJ109JGNvb2s7ICRldj0iKHt0ZWtzdGFzOihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud29vY29tbWVyY2UtTXlBY2NvdW50LWNvbnRlbnQnKXx8ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndvb2NvbW1lcmNlJyl8fGRvY3VtZW50LmJvZHkpLmlubmVyVGV4dC5yZXBsYWNlKC9cXHMrL2csJyAnKS5zbGljZSgwLDE1MDApLHZlbmlwYWs6KGRvY3VtZW50LmJvZHkuaW5uZXJUZXh0Lm1hdGNoKC9WMDcyNjdFXFxkKy9nKXx8W10pLG51b3JvZG9zOlsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud29vY29tbWVyY2UtTXlBY2NvdW50LWNvbnRlbnQgYScpXS5tYXAoYT0+YS5pbm5lclRleHQudHJpbSgpKycg4oaSICcrYS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkuc2xpY2UoMCwyNSl9KSI7CiAgICRvWydzaG90cyddPWFycmF5KAogICAgIGFycmF5KCduJz0+J2U4X3Bhc2t5cmEnLCd1Jz0+JG9bJ215X2FjY291bnQnXSwnZnVsbCc9PnRydWUsJ2V2YWwnPT4kZXYpLAogICAgIGFycmF5KCduJz0+J2U4X3V6c2FreW1haScsJ3UnPT4kb1snb3JkZXJzX3VybCddLCdmdWxsJz0+dHJ1ZSwnZXZhbCc9PiRldiksCiAgICAgYXJyYXkoJ24nPT4nZThfdXpzYWt5bWFzXzM1NDIxJywndSc9PiRvWyd2aWV3X29yZGVyX3VybCddLCdmdWxsJz0+dHJ1ZSwnZXZhbCc9PiRldiksCiAgICAgYXJyYXkoJ24nPT4nZThfdXpzYWt5bWFzXzM1NDQwJywndSc9PndjX2dldF9lbmRwb2ludF91cmwoJ3ZpZXctb3JkZXInLDM1NDQwLHdjX2dldF9wYWdlX3Blcm1hbGluaygnbXlhY2NvdW50JykpLCdmdWxsJz0+dHJ1ZSwnZXZhbCc9PiRldiksCiAgICAgYXJyYXkoJ24nPT4nZThfdXpzYWt5bWFzXzM1NDIxX21vYicsJ3UnPT4kb1sndmlld19vcmRlcl91cmwnXSwndyc9PjM5MCwnaCc9PjkwMCwnZnVsbCc9PnRydWUpLAogICApOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kb1snRkFUQUwnXT8/KCRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpKTsgfQogICRvWydtYWlsJ109Z2V0X29wdGlvbigncHNfZThfbWFpbCcsYXJyYXkoKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-191844';
const GKEY='ps_e8k';
const PHASES=["K"];
const OUT='analize/e5_run8k.json';
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
