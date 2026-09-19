process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTIgYiDigJQgZmF0YWwgV1BfRXJyb3I6OmdldF9tYXRjaGVkX3JvdXRlKCkga29udGVrc3RhcyAoVVJMLCBmYWlsYXMpLCBaQiBzdHJ1a3TFq3JpbmlvIMW+dXJuYWxvIHZpZXRhIGlyIGV4Y2x1ZGVkX2JyYW5kIMSvcmHFoWFpLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjkyYiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJHBsPWRpcm5hbWUoQUJTUEFUSCkuJy9sb2dzL3BocF9lcnJvci5sb2cnOyAkYz1maWxlX2dldF9jb250ZW50cygkcGwpOyBwcmVnX21hdGNoX2FsbCgnL1xbKFteXF1dKylcXSBQSFAgRmF0YWwgZXJyb3I6ICBVbmNhdWdodCBFcnJvcjogQ2FsbCB0byB1bmRlZmluZWQgbWV0aG9kIFdQX0Vycm9yOjpnZXRfbWF0Y2hlZF9yb3V0ZVwoXCkgaW4gKFteXG5dezAsMjAwfSlcbig/OlN0YWNrIHRyYWNlOlxuKT8oKD86I1xkW15cbl0qXG4pezAsMTJ9KS8nLCRjLCRtLFBSRUdfU0VUX09SREVSKTsKICAkb1snZmF0YWxfbiddPWNvdW50KCRtKTsgZm9yZWFjaCAoYXJyYXlfc2xpY2UoJG0sMCwzKSBhcyAkeCkgJG9bJ2ZhdGFsX3B2eiddW109YXJyYXkoJ2xhaWthcyc9PiR4WzFdLCdrdXInPT4keFsyXSwnc3RhY2snPT5tYl9zdWJzdHIoJHhbM10sMCw5MDApKTsKICAkb1snc2FyZ2FzX2ZhdGFsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLCBMRUZUKHVybCwxNjApIHVybCwgZmFpbGFzLCBlaWx1dGUgRlJPTSB7JHB9cHNfc2FyZ2FzX2tsYWlkb3MgV0hFUkUgbHlnaXM9J2ZhdGFsJyBBTkQgbGFpa2FzPj1OT1coKS1JTlRFUlZBTCA0OCBIT1VSIE9SREVSIEJZIGxhaWthcyBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAkb1snc2FyZ2FzX2hlYWRlcnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBsYWlrYXMsIExFRlQodXJsLDE2MCkgdXJsLCBMRUZUKHppbnV0ZSwyMDApIHogRlJPTSB7JHB9cHNfc2FyZ2FzX2tsYWlkb3MgV0hFUkUgemludXRlIExJS0UgJ0Nhbm5vdCBtb2RpZnkgaGVhZGVyJScgQU5EIGxhaWthcz49Tk9XKCktSU5URVJWQUwgNDggSE9VUiBPUkRFUiBCWSBsYWlrYXMgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAvLyBnZXRfbWF0Y2hlZF9yb3V0ZSBuYXVkb2ppbWFzIG3Fq3PFsyBrb2RlCiAgZm9yZWFjaCAoYXJyYXkoV1BNVV9QTFVHSU5fRElSLCBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJywgZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkpIGFzICRkaXIpeyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIpKTsgZm9yZWFjaCAoJGl0IGFzICRmKXsgaWYgKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkY2M9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYgKCRjYyAmJiBzdHJwb3MoJGNjLCdnZXRfbWF0Y2hlZF9yb3V0ZScpIT09ZmFsc2UpeyBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGNjKSBhcyAkaT0+JGwpIGlmIChzdHJwb3MoJGwsJ2dldF9tYXRjaGVkX3JvdXRlJykhPT1mYWxzZSkgJG9bJ2tvZGFzJ11bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZildWyRpKzFdPXRyaW0obWJfc3Vic3RyKCRsLDAsMjAwKSk7IH0gfSB9CiAgLy8gWkIgc3RydWN0dXJlZCBsb2cKICAkeGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7ICRsPWZpbGUoJHhmKTsgZm9yZWFjaCAoJGwgYXMgJGk9PiRsbikgaWYgKHN0cnBvcygkbG4sJ2Z1bmN0aW9uIHBldHNob3BfeG1sX2xvZ19zdHJ1Y3R1cmVkJykhPT1mYWxzZSl7IGZvcigkaj0kaTskajwkaSsyNTskaisrKSAkb1snbG9nX2ZuJ11bJGorMV09cnRyaW0oJGxbJGpdKTsgYnJlYWs7IH0KICAkb1snemJfbG9nX29wYyddPWFycmF5KCk7IGZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRU5HVEgob3B0aW9uX3ZhbHVlKSBsZW4gRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclcGV0c2hvcF94bWwlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclcHNfeG1sJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXpiXyUnIExJTUlUIDMwIixBUlJBWV9BKSBhcyAkcikgJG9bJ3piX2xvZ19vcGMnXVskclsnb3B0aW9uX25hbWUnXV09JHJbJ2xlbiddOwogICRvWyd6Yl9sZW50ZWxlcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIiksZnVuY3Rpb24oJHQpe3JldHVybiBwcmVnX21hdGNoKCcveG1sfHpifGltcG9ydF9sb2d8dmZfL2knLCR0KTt9KSk7CiAgJG9bJ3djX2xvZ3NfbmF1amF1c2knXT1hcnJheSgpOyBmb3JlYWNoICgoYXJyYXkpZ2xvYih3cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3djLWxvZ3MvKi5sb2cnKSBhcyAkZil7IGlmIChmaWxlbXRpbWUoJGYpPnRpbWUoKS0yMCozNjAwKSAkb1snd2NfbG9nc19uYXVqYXVzaSddW109cHJlZ19yZXBsYWNlKCcvLVswLTlhLWZdezMyfVwubG9nJC8nLCcnLGJhc2VuYW1lKCRmKSkuJyAnLmZpbGVzaXplKCRmKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-163713';
const GKEY='ps_s1692b';
const PHASES=["1"];
const OUT='analize/s1692_b.json';
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
