process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU5YSBEb3Zhbm9zIGthdGVnb3JpamEgKFJBU08pICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg1OWEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE4NTlhJ107CiAgdHJ5ewogICAgJHQ9Z2V0X3Rlcm0oMTE5LCdwcm9kdWN0X2NhdCcpOyBpZighJHQgfHwgaXNfd3BfZXJyb3IoJHQpKSB7ICRyWydlcnInXT0nMTE5IG5lcmFzdGEnOyB0aHJvdyBuZXcgRXhjZXB0aW9uKCd4Jyk7IH0KICAgICRyWydwcmllcyddPVsnbmFtZSc9PiR0LT5uYW1lLCdzbHVnJz0+JHQtPnNsdWcsJ3BhcmVudCc9PiR0LT5wYXJlbnQsJ2NvdW50Jz0+JHQtPmNvdW50XTsKICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2Jha19zMTg1OV9jYXQxMTknLFsnbmFtZSc9PiR0LT5uYW1lLCdkZXNjcmlwdGlvbic9PiR0LT5kZXNjcmlwdGlvbl0sZmFsc2UpOwogICAgLy8gcHJvZHVrdGFpIGthdGVnb3Jpam9qZSBkYWJhcgogICAgJGlkcz1nZXRfcG9zdHMoWydwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+WydwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJ10sJ251bWJlcnBvc3RzJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLCd0YXhfcXVlcnknPT5bWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PjExOSwnaW5jbHVkZV9jaGlsZHJlbic9PnRydWVdXV0pOwogICAgJHJbJ3ByZWtlcyddPWFycmF5X21hcChmdW5jdGlvbigkaWQpe3JldHVybiBbJGlkLGdldF9wb3N0X3N0YXR1cygkaWQpLGdldF90aGVfdGl0bGUoJGlkKV07fSwkaWRzKTsKICAgIC8vIDEgcGVydmFkaW50aQogICAgJHU9d3BfdXBkYXRlX3Rlcm0oMTE5LCdwcm9kdWN0X2NhdCcsWyduYW1lJz0+J0RvdmFub3MgYXVnaW50aW5pYW1zJ10pOyAkclsncmVuYW1lJ109aXNfd3BfZXJyb3IoJHUpPyR1LT5nZXRfZXJyb3JfbWVzc2FnZSgpOidvayc7CiAgICAvLyAyIHN1YmthdGVnb3JpamEKICAgICRleD1nZXRfdGVybV9ieSgnc2x1ZycsJ2thbGVkaW5lcy1kb3Zhbm9zJywncHJvZHVjdF9jYXQnKTsKICAgIGlmKCRleCl7ICRraWQ9JGV4LT50ZXJtX2lkOyAkclsnc3ViJ109J2phdSB5cmEgJy4ka2lkLicgcGFyZW50ICcuJGV4LT5wYXJlbnQ7IH0KICAgIGVsc2UgeyAkbj13cF9pbnNlcnRfdGVybSgnS2FsxJdkaW7El3MgZG92YW5vcycsJ3Byb2R1Y3RfY2F0JyxbJ3NsdWcnPT4na2FsZWRpbmVzLWRvdmFub3MnLCdwYXJlbnQnPT4xMTldKTsgJGtpZD1pc193cF9lcnJvcigkbik/MDokblsndGVybV9pZCddOyAkclsnc3ViJ109aXNfd3BfZXJyb3IoJG4pPyRuLT5nZXRfZXJyb3JfbWVzc2FnZSgpOidzdWt1cnRhICcuJGtpZDsgfQogICAgLy8gMyBrYWxlZGluaWFpL3N2ZW50aW5pYWkgcHJvZHVrdGFpIGlzIERPVkFOT1MgLT4gaXIgaSBzdWJrYXRlZ29yaWphCiAgICAkcGVyPVtdOyBpZigka2lkKSBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHR0PW1iX3N0cnRvbG93ZXIoZ2V0X3RoZV90aXRsZSgkaWQpKTsgaWYocHJlZ19tYXRjaCgnL2thbMSXZHxrYWxlZHzFoXZlbnR8c3ZlbnR8YWR2ZW50fG5hdWphbWV0L3UnLCR0dCkpeyB3cF9zZXRfb2JqZWN0X3Rlcm1zKCRpZCxbKGludCkka2lkXSwncHJvZHVjdF9jYXQnLHRydWUpOyAkcGVyW109JGlkOyB9IH0KICAgICRyWydwZXJrZWx0YSddPSRwZXI7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICAgJHJbJ3BvJ109WyduYW1lJz0+Z2V0X3Rlcm0oMTE5LCdwcm9kdWN0X2NhdCcpLT5uYW1lLCd1cmwnPT5nZXRfdGVybV9saW5rKDExOSwncHJvZHVjdF9jYXQnKSwnc3ViX3VybCc9PiRraWQ/Z2V0X3Rlcm1fbGluaygoaW50KSRraWQsJ3Byb2R1Y3RfY2F0Jyk6bnVsbF07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7IGlmKGVtcHR5KCRyWydlcnInXSkpICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-190736';
const GKEY='ps_s1859a';
const PHASES=["1"];
const OUT='analize/s1859_a.json';
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
