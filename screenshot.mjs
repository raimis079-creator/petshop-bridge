process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgybyBrdXBvbmFzIExUICsg4oCeU3VrdXJ0aSBwYXNreXLEhSIgbnVtYXR5dGFpIMK3IDEgcGF0aWtyYSDCtyAyIHNuaXBwZXRhcyDCtyA5IGnFoWp1bmd0aSBzbmlwcGV0xIUgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgybyddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTc4Mm8nXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3ODJvJywnZic9PiRGXTsKICB0cnl7CiAgICBpZigkRj09PScxJyl7CiAgICAgICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2FzYS1wYXNreXJhLnBocCc7ICRyWydrYXNhX3Bhc2t5cmEnXT1maWxlX2V4aXN0cygkZik/YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCd0cmltJyxmaWxlKCRmKSksMCwxNCk6J27El3JhJzsKICAgICAgJGdyZXA9W107IGZvcmVhY2gobmV3IERpcmVjdG9yeUl0ZXJhdG9yKFdQTVVfUExVR0lOX0RJUikgYXMgJHgpeyBpZigkeC0+aXNEaXIoKXx8c3Vic3RyKCR4LT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJykgY29udGludWU7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCR4LT5nZXRQYXRobmFtZSgpKTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL2NyZWF0ZV9hY2NvdW50X2RlZmF1bHRfY2hlY2tlZHxjcmVhdGVhY2NvdW50fGRvZXMgbm90IGV4aXN0fGNhbm5vdCBiZSBhcHBsaWVkL2knLCRsKSkgJGdyZXBbJHgtPmdldEZpbGVuYW1lKCldW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxMjApKTsgfQogICAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSIsQVJSQVlfQSkgYXMgJHMpIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRzWydjb2RlJ10pIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL2NyZWF0ZV9hY2NvdW50X2RlZmF1bHRfY2hlY2tlZHxjcmVhdGVhY2NvdW50fGRvZXMgbm90IGV4aXN0fGNhbm5vdCBiZSBhcHBsaWVkL2knLCRsKSkgJGdyZXBbJ3NuaXBwZXQjJy4kc1snaWQnXV1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDEyMCkpOwogICAgICAkclsnZ3JlcCddPSRncmVwOwogICAgICBmb3JlYWNoKFsnd29vY29tbWVyY2VfZW5hYmxlX2d1ZXN0X2NoZWNrb3V0Jywnd29vY29tbWVyY2VfZW5hYmxlX3NpZ251cF9hbmRfbG9naW5fZnJvbV9jaGVja291dCcsJ3dvb2NvbW1lcmNlX3JlZ2lzdHJhdGlvbl9nZW5lcmF0ZV9wYXNzd29yZCcsJ3dvb2NvbW1lcmNlX2VuYWJsZV9jaGVja291dF9sb2dpbl9yZW1pbmRlciddIGFzICRvKSAkclsnb3B0J11bJG9dPWdldF9vcHRpb24oJG8pOwogICAgICAkclsnbHQnXT1bJ2RuZSc9Pl9fKCdDb3Vwb24gIiVzIiBkb2VzIG5vdCBleGlzdCEnLCd3b29jb21tZXJjZScpLCdjbmEnPT5fXygnQ291cG9uICIlcyIgY2Fubm90IGJlIGFwcGxpZWQgYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdC4nLCd3b29jb21tZXJjZScpLCdzdWt1cnRpJz0+X18oJ0NyZWF0ZSBhbiBhY2NvdW50PycsJ3dvb2NvbW1lcmNlJyldOwogICAgICAkclsnc2F2ZV9zbmlwcGV0J109ZnVuY3Rpb25fZXhpc3RzKCdzYXZlX3NuaXBwZXQnKXx8ZnVuY3Rpb25fZXhpc3RzKCdjb2RlX3NuaXBwZXRzJyk7CiAgICB9CiAgICBpZigkRj09PScyJyl7CiAgICAgICRjb2RlPScvKionLiJcbiIuJyAqIEthc2EgS3Vwb25vIGtsYWlkb3MgTFQgdjEuMCAoUzE3ODIpJy4iXG4iLicgKiBXb29Db21tZXJjZSAxMSBrdXBvbm8ga2xhaWTFsyB0ZWtzdGFpIExUIHZlcnRpbWUgdHLFq2tzdGEgKGdldHRleHQpLicuIlxuIi4nICovJy4iXG4iCiAgICAgICAuJ2FkZF9maWx0ZXIoXCdnZXR0ZXh0XCcsIGZ1bmN0aW9uKCR0LCRvLCRkKXsgaWYoJGQhPT1cJ3dvb2NvbW1lcmNlXCcpIHJldHVybiAkdDsgc3RhdGljICRtPWFycmF5KCcuIlxuIgogICAgICAgLicgIFwnQ291cG9uICIlcyIgY2Fubm90IGJlIGFwcGxpZWQgYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdC5cJz0+XCdOdW9sYWlkb3Mga29kYXMg4oCeJXMiIG5lZWd6aXN0dW9qYS5cJywnLiJcbiIKICAgICAgIC4nICBcJ0NvdXBvbiAiJXMiIGRvZXMgbm90IGV4aXN0IVwnPT5cJ051b2xhaWRvcyBrb2RhcyDigJ4lcyIgbmVlZ3ppc3R1b2phLlwnLCcuIlxuIgogICAgICAgLicgIFwnQ291cG9uICIlcyIgaGFzIGFscmVhZHkgYmVlbiBhcHBsaWVkLlwnPT5cJ051b2xhaWRvcyBrb2RhcyDigJ4lcyIgamF1IHByaXRhaWt5dGFzLlwnLCcuIlxuIgogICAgICAgLicgIFwnVGhpcyBjb3Vwb24gaGFzIGV4cGlyZWQuXCc9PlwnxaBpbyBudW9sYWlkb3Mga29kbyBnYWxpb2ppbWFzIGJhaWfEl3NpLlwnLCcuIlxuIgogICAgICAgLicgIFwnQ291cG9uIHVzYWdlIGxpbWl0IGhhcyBiZWVuIHJlYWNoZWQuXCc9PlwnxaBpbyBudW9sYWlkb3Mga29kbyBwYW5hdWRvamltxbMgbGltaXRhcyBpxaFuYXVkb3Rhcy5cJywnLiJcbiIKICAgICAgIC4nICBcJ1BsZWFzZSBlbnRlciBhIGNvdXBvbiBjb2RlLlwnPT5cJ8SudmVza2l0ZSBudW9sYWlkb3Mga29kxIUuXCcsJy4iXG4iCiAgICAgICAuJyAgXCdDb3Vwb24gY29kZSBhcHBsaWVkIHN1Y2Nlc3NmdWxseS5cJz0+XCdOdW9sYWlkb3Mga29kYXMgcHJpdGFpa3l0YXMuXCcsJy4iXG4iCiAgICAgICAuJyAgXCdDb3Vwb24gaGFzIGJlZW4gcmVtb3ZlZC5cJz0+XCdOdW9sYWlkb3Mga29kYXMgcGHFoWFsaW50YXMuXCcsJy4iXG4iCiAgICAgICAuJyk7IHJldHVybiBpc3NldCgkbVskb10pPyRtWyRvXTokdDsgfSwyMCwzKTsnLiJcbiIKICAgICAgIDsKICAgICAgJHdwZGItPmluc2VydCgieyRQfXNuaXBwZXRzIixbJ25hbWUnPT4nS2FzYSBLdXBvbm8ga2xhaWRvcyBMVCB2MS4wIChTMTc4MiknLCdkZXNjcmlwdGlvbic9PidTMTc4MiAoUmFpbWlvIOKAnmRhcnlrIiAyMDo0Myk6IFdDIGt1cG9ubyBrbGFpZMWzIHRla3N0YWkgTFQgKGdldHRleHQpLCA4IGVpbHV0xJdzLicsJ2NvZGUnPT4kY29kZSwnc2NvcGUnPT4nZ2xvYmFsJywnYWN0aXZlJz0+MSwncHJpb3JpdHknPT4xMCwnbW9kaWZpZWQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldKTsKICAgICAgJHJbJ3NpZCddPSR3cGRiLT5pbnNlcnRfaWQ7ICRyWydlJ109JHdwZGItPmxhc3RfZXJyb3I7IHdwX2NhY2hlX2ZsdXNoKCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnY29kZV9zbmlwcGV0cycpKXsgdHJ5eyBjb2RlX3NuaXBwZXRzKCktPmRiLT50YWJsZXNfZXhpc3QoKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fSB9CiAgICAgIGZvcmVhY2goWydjb2RlX3NuaXBwZXRzX2FjdGl2ZScsJ2NvZGVfc25pcHBldHNfYWN0aXZlX3NoYXJlZF9uZXR3b3JrJywnY29kZV9zbmlwcGV0c19hY3RpdmVfc2l0ZXdpZGUnXSBhcyAkbykgZGVsZXRlX3RyYW5zaWVudCgkbyk7CiAgICAgICRyWydiYWsnXT0nbmVyZWlraWEg4oCUIGF0xaFhdWtpbWFzOiBkZWFrdHl2dW90aSBzbmlwcGV0xIUgJy4kclsnc2lkJ107CiAgICB9CiAgICBpZigkRj09PSc5Jyl7ICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdLYXNhIEt1cG9ubyBrbGFpZG9zIExUJSciKTsgJHJbJ2RlYWt0eXZ1b3RhJ109JHdwZGItPnJvd3NfYWZmZWN0ZWQ7IHdwX2NhY2hlX2ZsdXNoKCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-174547';
const GKEY='ps_s1782o';
const PHASES=["2"];
const OUT='analize/s1782_o2.json';
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
