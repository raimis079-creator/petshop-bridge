process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg4dCBMUCBwYXN0byBrb2RvIG5vcm1hbGl6YXZpbWFzIHBldHNob3Ata2FzYS1wYXNreXJhLnBocCAoMSBkcnksIDIgYXBwbHksIDMgdmVyaWZ5LCA5IHJlc3RvcmUpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4OHQnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzg4dCddOyAkcj1bJ3YnPT4nUzE3ODh0JywnZmF6ZSc9PiRmXTsKICAkRj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthc2EtcGFza3lyYS5waHAnOyAkQj1kaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMvcGV0c2hvcC1rYXNhLXBhc2t5cmEucGhwLmJha19zMTc4OCc7CiAgJHM9ZmlsZV9nZXRfY29udGVudHMoJEYpOyAkclsnbWQ1J109bWQ1KCRzKTsgJHJbJ2R5ZGlzJ109c3RybGVuKCRzKTsgJHJbJ3lyYSddPXN0cnBvcygkcywnUzE3ODggTFAgcGFzdG8ga29kYXMnKSE9PWZhbHNlOwogICRhZGQgPSA8PDwnUEhQWCcKCgovKiA9PT09PSBTMTc4OCBMUCBwYXN0byBrb2RhcyAoMjAyNi0xMC0xOSwgUmFpbWlvIOKAnnRhaXN5a+KAnCkgPT09PT0KICogTFAgRXhwcmVzcyDEr3NraWVwaXMga2Fzb2plICh3b29jb21tZXJjZV9jaGVja291dF9wcm9jZXNzLCBwcmlvcml0ZXRhcyAxMCkgc2l1bsSNaWEgYWRyZXPEhSDEryBMUCBBUEkuCiAqIExQIEFQSSBwcmlpbWEgdGlrIDUgc2ltYm9sacWzIHBhxaF0byBrb2TEhTsg4oCeTFQtMTIzNDXigJwsIOKAnkxUMTIzNDXigJwsIOKAnjEyIDM0NeKAnCBhdG1ldGEg4oaSIGtsaWVudGFzIG1hdG8KICogYW5nbGnFoWthaSDigJ5QbGVhc2UgZmlsbCBjb3JyZWN0IHNoaXBwaW5nIGRhdGE6IHBvc3RhbENvZGUgLi4u4oCcIGlyIHXFvnNha3ltYXMgbmVzdWt1cmlhbWFzLgogKiDEjGlhIChwcmlvcml0ZXRhcyAxLCBwcmllxaEgTFApIExUIGFkcmVzbyBwYcWhdG8ga29kxIUgcGF2ZXLEjWlhbWUgNSBza2FpdG1lbmltaXMsIGplaSBqxbMgeXJhIGx5Z2lhaSA1LgogKiBLaXRva2l1cyAocHZ6LiA0IGFyIDYgc2thaXRtZW55cykgcGFsaWVrYW1lIOKAkyB0YWRhIGtsYWlkYSB0ZWlzaW5nYS4gScWhanVuZ3RpOiBvcHRpb24gcHNfbHBfcGtfaXNqdW5ndGE9MS4KICovCmlmICggISBmdW5jdGlvbl9leGlzdHMoICdwZXRzaG9wX2xwX3BrX25vcm1hbGl6dW90aScgKSApIHsKCWZ1bmN0aW9uIHBldHNob3BfbHBfcGtfbm9ybWFsaXp1b3RpKCAkcmVpa3NtZSApIHsKCQkkZCA9IHByZWdfcmVwbGFjZSggJy9cRCsvJywgJycsIChzdHJpbmcpICRyZWlrc21lICk7CgkJcmV0dXJuICggc3RybGVuKCAkZCApID09PSA1ICkgPyAkZCA6IChzdHJpbmcpICRyZWlrc21lOwoJfQoJYWRkX2FjdGlvbiggJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X3Byb2Nlc3MnLCBmdW5jdGlvbiAoKSB7CgkJaWYgKCBnZXRfb3B0aW9uKCAncHNfbHBfcGtfaXNqdW5ndGEnICkgKSB7IHJldHVybjsgfQoJCWZvcmVhY2ggKCBhcnJheSggJ2JpbGxpbmcnLCAnc2hpcHBpbmcnICkgYXMgJHAgKSB7CgkJCSRrID0gJHAgLiAnX3Bvc3Rjb2RlJzsKCQkJaWYgKCBlbXB0eSggJF9QT1NUWyAkayBdICkgKSB7IGNvbnRpbnVlOyB9CgkJCSRzYWxpcyA9IGlzc2V0KCAkX1BPU1RbICRwIC4gJ19jb3VudHJ5JyBdICkgPyBzdHJ0b3VwcGVyKCAoc3RyaW5nKSAkX1BPU1RbICRwIC4gJ19jb3VudHJ5JyBdICkgOiAnTFQnOwoJCQlpZiAoICRzYWxpcyAhPT0gJ0xUJyApIHsgY29udGludWU7IH0KCQkJJF9QT1NUWyAkayBdID0gcGV0c2hvcF9scF9wa19ub3JtYWxpenVvdGkoIHdwX3Vuc2xhc2goICRfUE9TVFsgJGsgXSApICk7CgkJfQoJfSwgMSApOwp9ClBIUFg7CiAgaWYoJGY9PT0nMScpeyAkclsncHJhZHppYSddPW1iX3N1YnN0cigkcywwLDE1MDApOyAkclsncGFiYWlnYSddPW1iX3N1YnN0cigkcywtNjAwKTsgJHJbJ2V4ZWMnXT1mdW5jdGlvbl9leGlzdHMoJ2V4ZWMnKTsgfQogIGlmKCRmPT09JzInKXsgaWYoJHJbJ3lyYSddKXsgJHJbJ2VyciddPSdqYXUgeXJhJzsgfSBlbHNlIHsgaWYoIWZpbGVfZXhpc3RzKCRCKSkgY29weSgkRiwkQik7ICRyWydiYWtfbWQ1J109bWQ1X2ZpbGUoJEIpOyAkbj1ydHJpbSgkcyk7IGlmKHN1YnN0cigkbiwtMik9PT0nPz4nKXsgJHJbJ2VyciddPSdiYWlnaWFzaSA/PiDigJMgbmVkYXJhdSc7IH0gZWxzZSB7ICRuLj0kYWRkLiJcbiI7ICR0bXA9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzX3MxNzg4dF90aWtyLnBocCc7IGZpbGVfcHV0X2NvbnRlbnRzKCR0bXAsJG4pOyAkbGludD1udWxsOyBpZihmdW5jdGlvbl9leGlzdHMoJ2V4ZWMnKSl7IEBleGVjKCdwaHAgLWwgJy5lc2NhcGVzaGVsbGFyZygkdG1wKS4nIDI+JjEnLCRvLCRjKTsgJGxpbnQ9WyRjLGltcGxvZGUoJyAnLCRvKV07IH0gJHJbJ2xpbnQnXT0kbGludDsgQHVubGluaygkdG1wKTsgaWYoJGxpbnQgJiYgJGxpbnRbMF0hPT0wICYmIHN0cnBvcygkbGludFsxXSwnTm8gc3ludGF4IGVycm9ycycpPT09ZmFsc2UpeyAkclsnZXJyJ109J2xpbnQnOyB9IGVsc2UgeyBmaWxlX3B1dF9jb250ZW50cygkRiwkbik7ICRyWydwb19tZDUnXT1tZDVfZmlsZSgkRik7IH0gfSB9IH0KICBpZigkZj09PSczJyl7ICRyWydmbiddPWZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9scF9wa19ub3JtYWxpenVvdGknKTsgaWYoJHJbJ2ZuJ10pIGZvcmVhY2goWydMVC0xMjM0NScsJ0xUMTIzNDUnLCcxMjM0NScsJyAxMiAzNDUgJywnMTIzNCcsJ0xULTEyMzQ1NiddIGFzICR0KSAkclsndGVzdCddWyR0XT1wZXRzaG9wX2xwX3BrX25vcm1hbGl6dW90aSgkdCk7IGdsb2JhbCAkd3BfZmlsdGVyOyAkclsna2FibGlhaSddPWFycmF5X21hcChmbigkY2JzKT0+Y291bnQoJGNicyksJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfY2hlY2tvdXRfcHJvY2VzcyddLT5jYWxsYmFja3M/P1tdKTsgfQogIGlmKCRmPT09JzknKXsgaWYoZmlsZV9leGlzdHMoJEIpKXsgY29weSgkQiwkRik7ICRyWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkRik7fSB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-094848';
const GKEY='ps_s1788t';
const PHASES=["2", "3"];
const OUT='analize/s1788_t2.json';
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
