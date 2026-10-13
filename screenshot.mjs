process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgybyBrdXBvbmFzIExUICsg4oCeU3VrdXJ0aSBwYXNreXLEhSIgbnVtYXR5dGFpIMK3IDEgcGF0aWtyYSDCtyAyIHNuaXBwZXRhcyDCtyA5IGnFoWp1bmd0aSBzbmlwcGV0xIUgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgybyddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTc4Mm8nXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3ODJvJywnZic9PiRGXTsKICB0cnl7CiAgICBpZigkRj09PScxJyl7CiAgICAgICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2FzYS1wYXNreXJhLnBocCc7ICRyWydrYXNhX3Bhc2t5cmEnXT1maWxlX2V4aXN0cygkZik/YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCd0cmltJyxmaWxlKCRmKSksMCwxNCk6J27El3JhJzsKICAgICAgJGdyZXA9W107IGZvcmVhY2gobmV3IERpcmVjdG9yeUl0ZXJhdG9yKFdQTVVfUExVR0lOX0RJUikgYXMgJHgpeyBpZigkeC0+aXNEaXIoKXx8c3Vic3RyKCR4LT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJykgY29udGludWU7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCR4LT5nZXRQYXRobmFtZSgpKTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL2NyZWF0ZV9hY2NvdW50X2RlZmF1bHRfY2hlY2tlZHxjcmVhdGVhY2NvdW50fGRvZXMgbm90IGV4aXN0fGNhbm5vdCBiZSBhcHBsaWVkL2knLCRsKSkgJGdyZXBbJHgtPmdldEZpbGVuYW1lKCldW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxMjApKTsgfQogICAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSIsQVJSQVlfQSkgYXMgJHMpIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRzWydjb2RlJ10pIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL2NyZWF0ZV9hY2NvdW50X2RlZmF1bHRfY2hlY2tlZHxjcmVhdGVhY2NvdW50fGRvZXMgbm90IGV4aXN0fGNhbm5vdCBiZSBhcHBsaWVkL2knLCRsKSkgJGdyZXBbJ3NuaXBwZXQjJy4kc1snaWQnXV1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDEyMCkpOwogICAgICAkclsnZ3JlcCddPSRncmVwOwogICAgICBmb3JlYWNoKFsnd29vY29tbWVyY2VfZW5hYmxlX2d1ZXN0X2NoZWNrb3V0Jywnd29vY29tbWVyY2VfZW5hYmxlX3NpZ251cF9hbmRfbG9naW5fZnJvbV9jaGVja291dCcsJ3dvb2NvbW1lcmNlX3JlZ2lzdHJhdGlvbl9nZW5lcmF0ZV9wYXNzd29yZCcsJ3dvb2NvbW1lcmNlX2VuYWJsZV9jaGVja291dF9sb2dpbl9yZW1pbmRlciddIGFzICRvKSAkclsnb3B0J11bJG9dPWdldF9vcHRpb24oJG8pOwogICAgICAkclsnbHQnXT1bJ2RuZSc9Pl9fKCdDb3Vwb24gIiVzIiBkb2VzIG5vdCBleGlzdCEnLCd3b29jb21tZXJjZScpLCdjbmEnPT5fXygnQ291cG9uICIlcyIgY2Fubm90IGJlIGFwcGxpZWQgYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdC4nLCd3b29jb21tZXJjZScpLCdzdWt1cnRpJz0+X18oJ0NyZWF0ZSBhbiBhY2NvdW50PycsJ3dvb2NvbW1lcmNlJyldOwogICAgICAkclsnc2F2ZV9zbmlwcGV0J109ZnVuY3Rpb25fZXhpc3RzKCdzYXZlX3NuaXBwZXQnKXx8ZnVuY3Rpb25fZXhpc3RzKCdjb2RlX3NuaXBwZXRzJyk7CiAgICB9CiAgICBpZigkRj09PScyJyl7CiAgICAgICRjb2RlPScvKionLiJcbiIuJyAqIEthc2EgS3Vwb25vIGtsYWlkYSBMVCArIHBhc2t5cmEgbmVwYcW+eW3El3RhIHYxLjAgKFMxNzgyKScuIlxuIi4nICogV29vQ29tbWVyY2UgMTEga3Vwb25vIGtsYWlkb3MgdGVrc3RhcyBMVCB2ZXJ0aW1lIHRyxatrc3RhOyDigJ5TdWt1cnRpIHBhc2t5csSFPyIga2Fzb2plIG5lcGHFvnltxJd0YSBwYWdhbCBudXR5bMSXamltxIUuJy4iXG4iLicgKi8nLiJcbiIKICAgICAgIC4nYWRkX2ZpbHRlcihcJ2dldHRleHRcJywgZnVuY3Rpb24oJHQsJG8sJGQpeyBpZigkZCE9PVwnd29vY29tbWVyY2VcJykgcmV0dXJuICR0OyBzdGF0aWMgJG09YXJyYXkoJy4iXG4iCiAgICAgICAuJyAgXCdDb3Vwb24gIiVzIiBjYW5ub3QgYmUgYXBwbGllZCBiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0LlwnPT5cJ051b2xhaWRvcyBrb2RhcyDigJ4lcyIgbmVlZ3ppc3R1b2phLlwnLCcuIlxuIgogICAgICAgLicgIFwnQ291cG9uICIlcyIgZG9lcyBub3QgZXhpc3QhXCc9PlwnTnVvbGFpZG9zIGtvZGFzIOKAniVzIiBuZWVnemlzdHVvamEuXCcsJy4iXG4iCiAgICAgICAuJyAgXCdDb3Vwb24gIiVzIiBoYXMgYWxyZWFkeSBiZWVuIGFwcGxpZWQuXCc9PlwnTnVvbGFpZG9zIGtvZGFzIOKAniVzIiBqYXUgcHJpdGFpa3l0YXMuXCcsJy4iXG4iCiAgICAgICAuJyAgXCdUaGlzIGNvdXBvbiBoYXMgZXhwaXJlZC5cJz0+XCfFoGlvIG51b2xhaWRvcyBrb2RvIGdhbGlvamltYXMgYmFpZ8SXc2kuXCcsJy4iXG4iCiAgICAgICAuJyAgXCdDb3Vwb24gdXNhZ2UgbGltaXQgaGFzIGJlZW4gcmVhY2hlZC5cJz0+XCfFoGlvIG51b2xhaWRvcyBrb2RvIHBhbmF1ZG9qaW3FsyBsaW1pdGFzIGnFoW5hdWRvdGFzLlwnLCcuIlxuIgogICAgICAgLicgIFwnUGxlYXNlIGVudGVyIGEgY291cG9uIGNvZGUuXCc9PlwnxK52ZXNraXRlIG51b2xhaWRvcyBrb2TEhS5cJywnLiJcbiIKICAgICAgIC4nICBcJ0NvdXBvbiBjb2RlIGFwcGxpZWQgc3VjY2Vzc2Z1bGx5LlwnPT5cJ051b2xhaWRvcyBrb2RhcyBwcml0YWlreXRhcy5cJywnLiJcbiIKICAgICAgIC4nICBcJ0NvdXBvbiBoYXMgYmVlbiByZW1vdmVkLlwnPT5cJ051b2xhaWRvcyBrb2RhcyBwYcWhYWxpbnRhcy5cJywnLiJcbiIKICAgICAgIC4nKTsgcmV0dXJuIGlzc2V0KCRtWyRvXSk/JG1bJG9dOiR0OyB9LDIwLDMpOycuIlxuIgogICAgICAgLidhZGRfZmlsdGVyKFwnd29vY29tbWVyY2VfY3JlYXRlX2FjY291bnRfZGVmYXVsdF9jaGVja2VkXCcsXCdfX3JldHVybl9mYWxzZVwnLDIwKTsnLiJcbiI7CiAgICAgICR3cGRiLT5pbnNlcnQoInskUH1zbmlwcGV0cyIsWyduYW1lJz0+J0thc2EgS3Vwb25vIGtsYWlkYSBMVCArIHBhc2t5cmEgbmVwYcW+eW3El3RhIHYxLjAgKFMxNzgyKScsJ2Rlc2NyaXB0aW9uJz0+J1MxNzgyIChSYWltaW8g4oCeZGFyeWsiIDIwOjQzKTogV0Mga3Vwb25vIGtsYWlkb3MgTFQ7IOKAnlN1a3VydGkgcGFza3lyxIU/IiBrYXNvamUgbmVwYcW+eW3El3RhIHBhZ2FsIG51dHlsxJdqaW3EhS4nLCdjb2RlJz0+JGNvZGUsJ3Njb3BlJz0+J2dsb2JhbCcsJ2FjdGl2ZSc9PjEsJ3ByaW9yaXR5Jz0+MTAsJ21vZGlmaWVkJz0+Y3VycmVudF90aW1lKCdteXNxbCcpXSk7CiAgICAgICRyWydzaWQnXT0kd3BkYi0+aW5zZXJ0X2lkOyAkclsnZSddPSR3cGRiLT5sYXN0X2Vycm9yOyB3cF9jYWNoZV9mbHVzaCgpOyBpZihmdW5jdGlvbl9leGlzdHMoJ2NvZGVfc25pcHBldHMnKSl7IHRyeXsgY29kZV9zbmlwcGV0cygpLT5kYi0+dGFibGVzX2V4aXN0KCk7IH1jYXRjaChUaHJvd2FibGUgJGUpe30gfQogICAgICBmb3JlYWNoKFsnY29kZV9zbmlwcGV0c19hY3RpdmUnLCdjb2RlX3NuaXBwZXRzX2FjdGl2ZV9zaGFyZWRfbmV0d29yaycsJ2NvZGVfc25pcHBldHNfYWN0aXZlX3NpdGV3aWRlJ10gYXMgJG8pIGRlbGV0ZV90cmFuc2llbnQoJG8pOwogICAgICAkclsnYmFrJ109J25lcmVpa2lhIOKAlCBhdMWhYXVraW1hczogZGVha3R5dnVvdGkgc25pcHBldMSFICcuJHJbJ3NpZCddOwogICAgfQogICAgaWYoJEY9PT0nOScpeyAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnS2FzYSBLdXBvbm8ga2xhaWRhIExUJSciKTsgJHJbJ2RlYWt0eXZ1b3RhJ109JHdwZGItPnJvd3NfYWZmZWN0ZWQ7IHdwX2NhY2hlX2ZsdXNoKCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-174415';
const GKEY='ps_s1782o';
const PHASES=["1"];
const OUT='analize/s1782_o1.json';
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
