process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3ZyBkZXppdSBrYW5kaWRhdGFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwN2cnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODA3ZyddOwogICRrYXQ9ZnVuY3Rpb24oJHNsdWcpeyAkdD1nZXRfdGVybV9ieSgnc2x1ZycsJHNsdWcsJ3Byb2R1Y3RfY2F0Jyk7IGlmKCEkdCkgcmV0dXJuIFtdOyByZXR1cm4gYXJyYXlfbWVyZ2UoWyhpbnQpJHQtPnRlcm1faWRdLGFycmF5X21hcCgnaW50dmFsJywoYXJyYXkpZ2V0X3Rlcm1fY2hpbGRyZW4oJHQtPnRlcm1faWQsJ3Byb2R1Y3RfY2F0JykpKTsgfTsKICAkclsna2F0ZWdvcmlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnRlcm1faWQsIHQuc2x1ZywgdC5uYW1lLCB0dC5wYXJlbnQsIHR0LmNvdW50IEZST00geyRQfXRlcm1zIHQgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZCBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCAodC5zbHVnIExJS0UgJyVza2FuZXN0JScgT1IgdC5zbHVnIExJS0UgJyVrcmFtdCUnIE9SIHQuc2x1ZyBMSUtFICcla29uc2VydiUnIE9SIHQuc2x1ZyBMSUtFICclc2xhcGlhcyUnIE9SIHQuc2x1ZyBMSUtFICclbWFpc2VsaSUnIE9SIHQuc2x1ZyBMSUtFICclcG91Y2glJyBPUiB0Lm5hbWUgTElLRSAnJcWhbGFwJScpIE9SREVSIEJZIHR0LnBhcmVudCwgdC5uYW1lIixBUlJBWV9BKTsKICAkc2VsPWZ1bmN0aW9uKCRrYXRzbHVncywkd2hlcmU9JycpIHVzZSgkd3BkYiwkUCwka2F0KXsgJGlkcz1bXTsgZm9yZWFjaCgka2F0c2x1Z3MgYXMgJHMpICRpZHM9YXJyYXlfbWVyZ2UoJGlkcywka2F0KCRzKSk7IGlmKCEkaWRzKSByZXR1cm4gW107ICRpbj1pbXBsb2RlKCcsJyxhcnJheV91bmlxdWUoJGlkcykpOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgRElTVElOQ1QgcC5JRCBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRCBKT0lOIHskUH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQudGVybV9pZCBJTiAoJGluKSBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnICR3aGVyZSIsQVJSQVlfQSk7ICRvdXQ9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHhbJ0lEJ10pOyBpZighJHB8fCEkcC0+aXNfaW5fc3RvY2soKXx8JHAtPmlzX3R5cGUoJ3ZhcmlhYmxlJyl8fChmbG9hdCkkcC0+Z2V0X3ByaWNlKCk8PTApIGNvbnRpbnVlOyAkcz1nZXRfcG9zdF9tZXRhKCRwLT5nZXRfaWQoKSwnX3BzX3NhbmRlbGlzJyx0cnVlKTsgaWYoISRzKXsgJHM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBHUk9VUF9DT05DQVQoRElTVElOQ1Qgc291cmNlKSBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkcC0+Z2V0X2lkKCkpKT86Jz8nOyB9CiAgICAgICRicj13cF9nZXRfcG9zdF90ZXJtcygkcC0+Z2V0X2lkKCksJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pOyAkdz0oZmxvYXQpJHAtPmdldF93ZWlnaHQoKTsgJG1ubT0oYm9vbClnZXRfcG9zdF9tZXRhKCRwLT5nZXRfaWQoKSwnX21ubV9jb25maWcnLHRydWUpOwogICAgICBpZigkbW5tKSBjb250aW51ZTsgJG91dFtdPVsnaWQnPT4kcC0+Z2V0X2lkKCksJ24nPT5tYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw3MCksJ2V1cic9PihmbG9hdCkkcC0+Z2V0X3ByaWNlKCksJ3MnPT4kcywna2cnPT4kdywnYnInPT5pc19hcnJheSgkYnIpJiYkYnI/JGJyWzBdOicnLCdzdCc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc29sZCc9PihpbnQpZ2V0X3Bvc3RfbWV0YSgkcC0+Z2V0X2lkKCksJ3RvdGFsX3NhbGVzJyx0cnVlKV07IH0KICAgIHVzb3J0KCRvdXQsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsnc29sZCddPD0+JGFbJ3NvbGQnXTt9KTsgcmV0dXJuICRvdXQ7IH07CiAgJHJbJ3NrYW5lc3RhaV9zdW5pbXMnXT0kc2VsKFsnc2thbmVzdGFpLXN1bmltcycsJ3NrYW5lc3RhaS1pci1rcmFtdGFsYWktc3VuaW1zJywna3JhbXRhbGFpLXN1bmltcyddKTsKICAkclsnc2thbmVzdGFpX2thdGVtcyddPSRzZWwoWydza2FuZXN0YWkta2F0ZW1zJ10pOwogICRyWydrb25zZXJ2YWlfa2F0ZW1zJ109JHNlbChbJ2tvbnNlcnZhaS1rYXRlbXMnLCdzbGFwaWFzLW1haXN0YXMta2F0ZW1zJywna29uc2VydmFpLWlyLW1haXNlbGlhaS1rYXRlbXMnXSk7CiAgZm9yZWFjaChbJ3NrYW5lc3RhaV9zdW5pbXMnLCdza2FuZXN0YWlfa2F0ZW1zJywna29uc2VydmFpX2thdGVtcyddIGFzICRrKXsgJHJbJGsuJ19uJ109Y291bnQoJHJbJGtdKTsgJHJbJGtdPWFycmF5X3NsaWNlKCRyWyRrXSwwLDcwKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwxKTsK';
const VER='dep-091710';
const GKEY='ps_s1807g';
const PHASES=["1"];
const OUT='analize/s1807_g.json';
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
