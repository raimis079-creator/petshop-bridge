process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgeCDigJQgZmxhdHNvbWUtY2hpbGQvZnVuY3Rpb25zLnBocDogdGVsZWZvbm8gdmFsaWRhY2lqYSBwYWdhbCDFoWFsxK8gKExUL0xWL0VFKTsgYmFrIHBzLWJhY2t1cHMvZnVuY3Rpb25zLnBocC5iYWtfczE2ODE7IHRva2VuX2dldF9hbGwgcHJpZcWhIHJhxaFhbnQ7IHBhdGlrcmEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgxeCddKSkgcmV0dXJuOyAkbz1hcnJheSgndic9PidTMTY4MSB4Jyk7ICRmPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJG9bJ21kNV9wcmllcyddPW1kNSgkcyk7CiAgaWYobWQ1KCRzKSE9PScxZGQ4ZTZmNjZhMzk2MGJhZTRiOWE1Mzc3YWJmZjc4ZScpeyAkb1snU1RPUCddPSdtZDUgbmVzdXRhbXBhJzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAkdT13cF91cGxvYWRfZGlyKCk7ICRiYWs9JHVbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMvZnVuY3Rpb25zLnBocC5iYWtfczE2ODEnOyBpZighZmlsZV9leGlzdHMoJGJhaykpIGZpbGVfcHV0X2NvbnRlbnRzKCRiYWssJHMpOyAkb1snYmFrJ109ZmlsZV9leGlzdHMoJGJhaykmJm1kNV9maWxlKCRiYWspPT09bWQ1KCRzKTsKICAkb2xkPSIgICAgXCRjbGVhbiA9IHByZWdfcmVwbGFjZSggJy9bXFxzXFwtXFwoXFwpXFwuXSsvJywgJycsIFwkcGhvbmUgKTtcbiAgICBcJHZhbGlkID0gcHJlZ19tYXRjaCggJy9eKFxcKzM3MDZcXGR7N318ODZcXGR7N318MDZcXGR7N30pJC8nLCBcJGNsZWFuICk7XG4gICAgaWYgKCAhIFwkdmFsaWQgKSB7XG4gICAgICAgIHdjX2FkZF9ub3RpY2UoICdJdmVza2l0ZSB0ZWlzaW5nxIUgTGlldHV2b3MgdGVsZWZvbm8gbnVtZXJpIChwdnouLCArMzcwIDYxMiAzNDU2NyBhcmJhIDg2MTIzNDU2NykuJywgJ2Vycm9yJyApO1xuICAgIH1cbiI7CiAgJG5ldz0iICAgIFwkY2xlYW4gPSBwcmVnX3JlcGxhY2UoICcvW1xcc1xcLVxcKFxcKVxcLl0rLycsICcnLCBcJHBob25lICk7XG4gICAgXCRzYWxpcyA9IGlzc2V0KCBcJF9QT1NUWydiaWxsaW5nX2NvdW50cnknXSApID8gc3RydG91cHBlciggc2FuaXRpemVfdGV4dF9maWVsZCggXCRfUE9TVFsnYmlsbGluZ19jb3VudHJ5J10gKSApIDogJ0xUJztcbiAgICAvLyBTMTY4MTogTFYgaXIgRUUgcGlya8SXamFpIOKAlCBqxbMgxaFhbGllcyBudW1lcmlhaTsgTFQga2FpcCBidXZvLlxuICAgIGlmICggJ0xWJyA9PT0gXCRzYWxpcyApIHtcbiAgICAgICAgXCR2YWxpZCA9IHByZWdfbWF0Y2goICcvXihcXCszNzF8MDAzNzEpP1xcZHs4fSQvJywgXCRjbGVhbiApO1xuICAgICAgICBpZiAoICEgXCR2YWxpZCApIHsgd2NfYWRkX25vdGljZSggJ0lldmFkaWV0IHBhcmVpenUgTGF0dmlqYXMgdMSBbHJ1xYZhIG51bXVydSAocGllbS4sICszNzEgMjEyMzQ1NjcpLicsICdlcnJvcicgKTsgfVxuICAgIH0gZWxzZWlmICggJ0VFJyA9PT0gXCRzYWxpcyApIHtcbiAgICAgICAgXCR2YWxpZCA9IHByZWdfbWF0Y2goICcvXihcXCszNzJ8MDAzNzIpP1xcZHs3LDh9JC8nLCBcJGNsZWFuICk7XG4gICAgICAgIGlmICggISBcJHZhbGlkICkgeyB3Y19hZGRfbm90aWNlKCAnU2lzZXN0YWdlIMO1aWdlIEVlc3RpIHRlbGVmb25pbnVtYmVyIChudCArMzcyIDUxMjMgNDU2NykuJywgJ2Vycm9yJyApOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgXCR2YWxpZCA9IHByZWdfbWF0Y2goICcvXihcXCszNzA2XFxkezd9fDg2XFxkezd9fDA2XFxkezd9KSQvJywgXCRjbGVhbiApO1xuICAgICAgICBpZiAoICEgXCR2YWxpZCApIHtcbiAgICAgICAgICAgIHdjX2FkZF9ub3RpY2UoICdJdmVza2l0ZSB0ZWlzaW5nxIUgTGlldHV2b3MgdGVsZWZvbm8gbnVtZXJpIChwdnouLCArMzcwIDYxMiAzNDU2NyBhcmJhIDg2MTIzNDU2NykuJywgJ2Vycm9yJyApO1xuICAgICAgICB9XG4gICAgfVxuIjsKICAkb2xkMj0iICAgIGlmICggcHJlZ19tYXRjaCggJy9eMDYoXFxkezd9KSQvJywgXCRjbGVhbiwgXCRtICkgKSByZXR1cm4gJyszNzA2JyAuIFwkbVsxXTtcbiAgICByZXR1cm4gXCRjbGVhbjtcbiI7CiAgJG5ldzI9IiAgICBpZiAoIHByZWdfbWF0Y2goICcvXjA2KFxcZHs3fSkkLycsIFwkY2xlYW4sIFwkbSApICkgcmV0dXJuICcrMzcwNicgLiBcJG1bMV07XG4gICAgXCRzYWxpcyA9IGlzc2V0KCBcJF9QT1NUWydiaWxsaW5nX2NvdW50cnknXSApID8gc3RydG91cHBlciggc2FuaXRpemVfdGV4dF9maWVsZCggXCRfUE9TVFsnYmlsbGluZ19jb3VudHJ5J10gKSApIDogJ0xUJztcbiAgICBpZiAoICdMVicgPT09IFwkc2FsaXMgJiYgcHJlZ19tYXRjaCggJy9eKDAwMzcxKT8oXFxkezh9KSQvJywgXCRjbGVhbiwgXCRtICkgKSByZXR1cm4gJyszNzEnIC4gXCRtWzJdO1xuICAgIGlmICggJ0VFJyA9PT0gXCRzYWxpcyAmJiBwcmVnX21hdGNoKCAnL14oMDAzNzIpPyhcXGR7Nyw4fSkkLycsIFwkY2xlYW4sIFwkbSApICkgcmV0dXJuICcrMzcyJyAuIFwkbVsyXTtcbiAgICByZXR1cm4gXCRjbGVhbjtcbiI7CiAgaWYoc3Vic3RyX2NvdW50KCRzLCRvbGQpIT09MXx8c3Vic3RyX2NvdW50KCRzLCRvbGQyKSE9PTEpeyAkb1snU1RPUCddPSdvbGQgbmVyYXN0YXM6ICcuc3Vic3RyX2NvdW50KCRzLCRvbGQpLicvJy5zdWJzdHJfY291bnQoJHMsJG9sZDIpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICRuPXN0cl9yZXBsYWNlKGFycmF5KCRvbGQsJG9sZDIpLGFycmF5KCRuZXcsJG5ldzIpLCRzKTsKICB0cnkgeyB0b2tlbl9nZXRfYWxsKCRuLCBUT0tFTl9QQVJTRSk7IH0gY2F0Y2ggKFRocm93YWJsZSAkZSkgeyAkb1snU1RPUCddPSdQYXJzZUVycm9yOiAnLiRlLT5nZXRNZXNzYWdlKCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgZmlsZV9wdXRfY29udGVudHMoJGYsJG4pOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJGYsdHJ1ZSk7ICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkZik7ICRvWydkeWRpcyddPWZpbGVzaXplKCRmKTsKICAvLyBwYXRpa3JhOiBpbWl0dW9qYW0gdmFsaWRhY2lqxIUKICAkdD1mdW5jdGlvbigkc2FsaXMsJHRlbCl7ICRfUE9TVFsnYmlsbGluZ19jb3VudHJ5J109JHNhbGlzOyAkX1BPU1RbJ2JpbGxpbmdfcGhvbmUnXT0kdGVsOyB3Y19jbGVhcl9ub3RpY2VzKCk7IGRvX2FjdGlvbignd29vY29tbWVyY2VfY2hlY2tvdXRfcHJvY2VzcycpOyAkbj13Y19nZXRfbm90aWNlcygnZXJyb3InKTsgd2NfY2xlYXJfbm90aWNlcygpOyAkbm9ybT1hcHBseV9maWx0ZXJzKCd3b29jb21tZXJjZV9wcm9jZXNzX2NoZWNrb3V0X2ZpZWxkX2JpbGxpbmdfcGhvbmUnLCR0ZWwpOyByZXR1cm4gKCRuPydLTEFJREEnOidvaycpLicg4oaSICcuJG5vcm07IH07CiAgZm9yZWFjaChhcnJheShhcnJheSgnTFQnLCcrMzcwIDYxMiAzNDU2NycpLGFycmF5KCdMVCcsJzg2MTIzNDU2NycpLGFycmF5KCdMVCcsJyszNzEgMjEyMzQ1NjcnKSxhcnJheSgnTFYnLCcrMzcxIDIxMjM0NTY3JyksYXJyYXkoJ0xWJywnMjEyMzQ1NjcnKSxhcnJheSgnTFYnLCcyMTIzNDU2JyksYXJyYXkoJ0VFJywnKzM3MiA1MTIzIDQ1NjcnKSxhcnJheSgnRUUnLCc1MTIzNDU2NycpLGFycmF5KCdFRScsJyszNzAgNjEyMzQ1NjcnKSkgYXMgJGMpICRvWyd0ZXN0J11bJGNbMF0uJyAnLiRjWzFdXT0kdCgkY1swXSwkY1sxXSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-122152';
const GKEY='ps_s1681x';
const PHASES=["A"];
const OUT='analize/s1681_x.json';
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
