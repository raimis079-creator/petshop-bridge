process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzcgbWFyxb5hIOKAlCByZWFkLW9ubHk6IHByZWtpxbMgbWFyxb5hIGnFoSBzYXZpa2Fpbm9zICsgMzAgZC4gdcW+c2FreW3FsyBla29ub21pa2EgKHZpc28gaXIgacWhIEFkcykuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjc3bSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc3IG1hcsW+YScpOwogICRzYXY9ZnVuY3Rpb24oJHBpZCl7IGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJkYXZpbWFpJykmJm1ldGhvZF9leGlzdHMoJ1BldHNob3BfUGFyZGF2aW1haScsJ3NhdmlrYWluYScpKXsgJHM9UGV0c2hvcF9QYXJkYXZpbWFpOjpzYXZpa2FpbmEoJHBpZCk7IGlmKCRzIT09bnVsbCYmJHMhPT0nJyYmKGZsb2F0KSRzPjApIHJldHVybiAoZmxvYXQpJHM7IH0KICAgIGZvcmVhY2goYXJyYXkoJ19wc19zYXZpa2FpbmEnLCdfd2NfY29nX2Nvc3QnLCdfYWxnX3djX2NvZ19jb3N0JykgYXMgJGspeyAkcz1nZXRfcG9zdF9tZXRhKCRwaWQsJGssdHJ1ZSk7IGlmKCRzIT09JycmJihmbG9hdCkkcz4wKSByZXR1cm4gKGZsb2F0KSRzOyB9IHJldHVybiBudWxsOyB9OwogIC8vIDEuIGthdGFsb2dhcwogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAkYj1hcnJheSgnYmVfc2F2Jz0+MCwnc2F2X2d0X2thaW5hJz0+MCwnPDAnPT4wLCcwLTEwJz0+MCwnMTAtMjAnPT4wLCcyMC0zMCc9PjAsJzMwLTQwJz0+MCwnNDArJz0+MCk7ICRuPTA7ICRzdW1NPTA7ICRwaWc9MDsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7ICRwcj0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLHRydWUpOyBpZigkcHI8PTApIGNvbnRpbnVlOyAkbisrOyAkYz0kc2F2KCRwaWQpOwogICAgaWYoJGM9PT1udWxsKXsgJGJbJ2JlX3NhdiddKys7IGNvbnRpbnVlOyB9IGlmKCRjPiRwcikgJGJbJ3Nhdl9ndF9rYWluYSddKys7IGlmKCRwcjwxMCkgJHBpZysrOwogICAgJG5ldD0kcHIvMS4yMTsgJG09KCRuZXQtJGMpLyRuZXQqMTAwOyAkc3VtTSs9JG07CiAgICAkYlskbTwwPyc8MCc6KCRtPDEwPycwLTEwJzooJG08MjA/JzEwLTIwJzooJG08MzA/JzIwLTMwJzooJG08NDA/JzMwLTQwJzonNDArJykpKSldKys7IH0KICAkb1sna2F0YWxvZ2FzJ109YXJyYXkoJ3N1X2thaW5hJz0+JG4sJ2thaW5hX2x0MTAnPT4kcGlnLCdtYXJ6YV9wcmllbGFpZGEnPT4nc2F2aWthaW5hIGJlIFBWTSwga2FpbmEgc3UgUFZNIDIxJScsJ2p1b3N0b3MnPT4kYiwndmlkX21hcnphX3BhcHJhc3RhJz0+cm91bmQoJHN1bU0vbWF4KDEsJG4tJGJbJ2JlX3NhdiddKSwxKSk7CiAgLy8gMi4gMzAgZC4gdcW+c2FreW1haQogICRvcmRzPXdjX2dldF9vcmRlcnMoYXJyYXkoJ2xpbWl0Jz0+LTEsJ3N0YXR1cyc9PmFycmF5KCdwcm9jZXNzaW5nJywnY29tcGxldGVkJyksJ2RhdGVfY3JlYXRlZCc9Pic+Jy4odGltZSgpLTMwKjg2NDAwKSwncmV0dXJuJz0+J29iamVjdHMnKSk7CiAgJGFnZz1mdW5jdGlvbigpeyByZXR1cm4gYXJyYXkoJ3V6cyc9PjAsJ3BhamFtb3Nfc3VfcHZtJz0+MCwncHJla2VzX25ldCc9PjAsJ3NhdmlrYWluYSc9PjAsJ3NpdW50X3N1cmlua3RhJz0+MCwnYmVfc2F2X2VpbCc9PjAsJ25lbW9rX3NpdW50aW1hcyc9PjApOyB9OwogICR0PWFycmF5KCd2aXNvJz0+JGFnZygpLCdhZHMnPT4kYWdnKCkpOyAka2F0PWFycmF5KCk7CiAgZm9yZWFjaCgkb3JkcyBhcyAkb2QpeyAkYWRzPSgkb2QtPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fdXRtX3NvdXJjZScpPT09J2dvb2dsZScmJnN0cmlwb3MoKHN0cmluZykkb2QtPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fdXRtX21lZGl1bScpLCdjcGMnKSE9PWZhbHNlKXx8JG9kLT5nZXRfbWV0YSgnX3djX29yZGVyX2F0dHJpYnV0aW9uX3NvdXJjZV90eXBlJyk9PT0ndXRtJyYmJG9kLT5nZXRfbWV0YSgnX3djX29yZGVyX2F0dHJpYnV0aW9uX3V0bV9zb3VyY2UnKT09PSdnb29nbGUnOwogICAgJGtleXM9JGFkcz9hcnJheSgndmlzbycsJ2FkcycpOmFycmF5KCd2aXNvJyk7CiAgICBmb3JlYWNoKCRrZXlzIGFzICRrKXsgJHRbJGtdWyd1enMnXSsrOyAkdFska11bJ3BhamFtb3Nfc3VfcHZtJ10rPShmbG9hdCkkb2QtPmdldF90b3RhbCgpOyAkc2g9KGZsb2F0KSRvZC0+Z2V0X3NoaXBwaW5nX3RvdGFsKCk7ICR0WyRrXVsnc2l1bnRfc3VyaW5rdGEnXSs9JHNoOyBpZigkc2g8PTApICR0WyRrXVsnbmVtb2tfc2l1bnRpbWFzJ10rKzsgfQogICAgZm9yZWFjaCgkb2QtPmdldF9pdGVtcygpIGFzICRpdCl7ICRwaWQ9JGl0LT5nZXRfdmFyaWF0aW9uX2lkKCk/OiRpdC0+Z2V0X3Byb2R1Y3RfaWQoKTsgJHE9JGl0LT5nZXRfcXVhbnRpdHkoKTsgJG5ldD0oZmxvYXQpJGl0LT5nZXRfdG90YWwoKTsgJGM9JHNhdigkcGlkKTsKICAgICAgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoJGl0LT5nZXRfcHJvZHVjdF9pZCgpLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsgJGNuPSRjYXRzJiYhaXNfd3BfZXJyb3IoJGNhdHMpPyRjYXRzWzBdOic/JzsKICAgICAgaWYoIWlzc2V0KCRrYXRbJGNuXSkpICRrYXRbJGNuXT1hcnJheSgnbmV0Jz0+MCwnc2F2Jz0+MCwndm50Jz0+MCk7ICRrYXRbJGNuXVsnbmV0J10rPSRuZXQ7ICRrYXRbJGNuXVsndm50J10rPSRxOwogICAgICBmb3JlYWNoKCRrZXlzIGFzICRrKXsgJHRbJGtdWydwcmVrZXNfbmV0J10rPSRuZXQ7IGlmKCRjPT09bnVsbCl7ICR0WyRrXVsnYmVfc2F2X2VpbCddKys7IH0gZWxzZSB7ICR0WyRrXVsnc2F2aWthaW5hJ10rPSRjKiRxOyB9IH0KICAgICAgaWYoJGMhPT1udWxsKSAka2F0WyRjbl1bJ3NhdiddKz0kYyokcTsgfSB9CiAgZm9yZWFjaCgkdCBhcyAkaz0+JiR2KXsgJHZbJ21hcnphX3BjdCddPSR2WydwcmVrZXNfbmV0J10+MD9yb3VuZCgoJHZbJ3ByZWtlc19uZXQnXS0kdlsnc2F2aWthaW5hJ10pLyR2WydwcmVrZXNfbmV0J10qMTAwLDEpOm51bGw7ICR2Wydhb3Zfc3VfcHZtJ109JHZbJ3V6cyddP3JvdW5kKCR2WydwYWphbW9zX3N1X3B2bSddLyR2Wyd1enMnXSwyKTpudWxsOyAkdlsnYnJ1dG9fbWFyemFfdXpzJ109JHZbJ3V6cyddP3JvdW5kKCgkdlsncHJla2VzX25ldCddLSR2WydzYXZpa2FpbmEnXSkvJHZbJ3V6cyddLDIpOm51bGw7IGZvcmVhY2goJHYgYXMgJGtrPT4kdnYpIGlmKGlzX2Zsb2F0KCR2dikpICR2WyRra109cm91bmQoJHZ2LDIpOyB9IHVuc2V0KCR2KTsKICB1YXNvcnQoJGthdCxmdW5jdGlvbigkYSwkYil7cmV0dXJuICRiWyduZXQnXTw9PiRhWyduZXQnXTt9KTsgJGt0PWFycmF5KCk7IGZvcmVhY2goYXJyYXlfc2xpY2UoJGthdCwwLDEyLHRydWUpIGFzICRjbj0+JHYpeyAka3RbJGNuXT1hcnJheSgnbmV0Jz0+cm91bmQoJHZbJ25ldCddKSwnbWFyemFfcGN0Jz0+JHZbJ25ldCddPjA/cm91bmQoKCR2WyduZXQnXS0kdlsnc2F2J10pLyR2WyduZXQnXSoxMDAsMSk6bnVsbCwndm50Jz0+JHZbJ3ZudCddKTsgfQogICRvWyd1enNha3ltYWlfMzBkJ109JHQ7ICRvWyd0b3Bfa2F0ZWdvcmlqb3MnXT0ka3Q7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-141802';
const GKEY='ps_s1677m';
const PHASES=["GO"];
const OUT='analize/s1677_marza.json';
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
