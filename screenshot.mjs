process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg1IHNpdW50aW1vIG1ldG9kYWkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibG0nXSk/JF9HRVRbJ3BzX2JsbSddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODVkJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgICBmb3JlYWNoKFdDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZXMoKSBhcyAkeil7CiAgICAgICRzYXI9YXJyYXkoKTsKICAgICAgZm9yZWFjaCgkelsnc2hpcHBpbmdfbWV0aG9kcyddIGFzICRzKXsKICAgICAgICAkc2FyW109YXJyYXkoJ2lkJz0+JHMtPmlkLCdpbnN0Jz0+JHMtPmluc3RhbmNlX2lkLCdpanVuZ3Rhcyc9PiRzLT5lbmFibGVkLAogICAgICAgICAgJ3Bhdic9PiRzLT5nZXRfdGl0bGUoKSwna2FpbmEnPT5pc3NldCgkcy0+aW5zdGFuY2Vfc2V0dGluZ3NbJ2Nvc3QnXSk/JHMtPmluc3RhbmNlX3NldHRpbmdzWydjb3N0J106JycpOwogICAgICB9CiAgICAgICRvWyd6b25vcyddWyR6Wyd6b25lX25hbWUnXV09JHNhcjsKICAgIH0KICAgICRkZWY9bmV3IFdDX1NoaXBwaW5nX1pvbmUoMCk7CiAgICAkc2FyPWFycmF5KCk7CiAgICBmb3JlYWNoKCRkZWYtPmdldF9zaGlwcGluZ19tZXRob2RzKCkgYXMgJHMpICRzYXJbXT1hcnJheSgnaWQnPT4kcy0+aWQsJ2luc3QnPT4kcy0+aW5zdGFuY2VfaWQsJ2lqdW5ndGFzJz0+JHMtPmVuYWJsZWQsJ3Bhdic9PiRzLT5nZXRfdGl0bGUoKSk7CiAgICAkb1snem9ub3MnXVsnKGxpa3VzaW9zIHNyaXR5cyknXT0kc2FyOwogICAgLy8ga2EgcGFzaXJpbmtvIGtsaWVudGFzCiAgICBmb3JlYWNoKGFycmF5KDM1ODcyLDM1ODczLDM1ODc0LDM1ODc1KSBhcyAkaWQpewogICAgICAkb3JkPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG9yZCkgY29udGludWU7CiAgICAgICRtPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJG9yZC0+Z2V0X3NoaXBwaW5nX21ldGhvZHMoKSBhcyAkcykgJG1bXT0kcy0+Z2V0X21ldGhvZF9pZCgpLicjJy4kcy0+Z2V0X2luc3RhbmNlX2lkKCkuJyDigJQgJy4kcy0+Z2V0X25hbWUoKS4nIOKAlCAnLiRzLT5nZXRfdG90YWwoKTsKICAgICAgJG9bJ3V6c2FreW1haSddWyRpZF09YXJyYXkoJ21ldG9kYWknPT4kbSwnYnVzZW5hJz0+JG9yZC0+Z2V0X3N0YXR1cygpLAogICAgICAgICdscF9tZXRhJz0+JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksTEVGVChtZXRhX3ZhbHVlLDYwKSB2IEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEgV0hFUkUgb3JkZXJfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJWxwZXhwcmVzcyUlJyBPUiBtZXRhX2tleSBMSUtFICclJXRlcm1pbmFsJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUldmVuaXBhayUlJykiLCRpZCksQVJSQVlfQSkpOwogICAgfQogICAgLy8gTFAgcGx1Z2lubyBudXN0YXR5bWFpCiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDEyMCkgdiBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJWxpdGh1YW5pYXBvc3QlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclbHBleHByZXNzJScgTElNSVQgMTIiLEFSUkFZX0EpIGFzICRyKSAkb1snbHBfb3BjaWpvcyddWyRyWydvcHRpb25fbmFtZSddXT0kclsndiddOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-101048';
const GKEY='ps_blm';
const PHASES=["R"];
const OUT='analize/s1685_d.json';
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
