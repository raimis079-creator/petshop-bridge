process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3dDAgcmVjb24gcmVhZC1vbmx5OiBzbmlwcGV0IDY4OCBodWIgc2x1Z3MsIFJNIHRlcm0gZGVzYyBwYXZ5emR6aWFpLCBicmFuZCBrYXRlZ29yaWp1IHBhc2lza2lyc3R5bWFzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxN3QwJ10pKSByZXR1cm47CiAgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzE3dDAnXTsKICB0cnl7CiAgICAkYz0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgaWQ9Njg4Iik7IHByZWdfbWF0Y2hfYWxsKCIjJyhbYS16LV0rKSdccyo9PlxzKmFycmF5XChccyonaDEnIyIsJGMsJG0pOyAkclsnaHViX3NsdWdzJ109JG1bMV07IHByZWdfbWF0Y2goJyNcJChodWJhaXxjZmd8SFVCW0EtWl0qKVxzKj1ccyphcnJheVwoLnswLDEyMDB9I3MnLCRjLCRtMik7ICRyWydodWJfY2ZnJ109bWJfc3Vic3RyKCRtMlswXT8/JycsMCwxMjAwKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIjW15cbl17MCw4MH0oaXNfcHJvZHVjdF9jYXRlZ29yeXx0ZXJtLT5zbHVnfGdldF9xdWVyaWVkX29iamVjdClbXlxuXXswLDEyMH0jIiwkYywkbTMpOyAkclsnaHViX2thaXAnXT1hcnJheV9zbGljZShhcnJheV9tYXAoJ3RyaW0nLGFycmF5X3VuaXF1ZSgkbTNbMF0pKSwwLDgpOwogICAgZm9yZWFjaChbNjgyLDc5LDEwNywzMDRdIGFzICR0aWQpeyAkdD1nZXRfdGVybSgkdGlkLCdwcm9kdWN0X2NhdCcpOyAkclsncm1fZGVzY19wdnonXVskdC0+c2x1Z109Z2V0X3Rlcm1fbWV0YSgkdGlkLCdyYW5rX21hdGhfZGVzY3JpcHRpb24nLHRydWUpOyB9CiAgICBmb3JlYWNoKFsnam9zZXJhJywndHJpeGllJywnZXhjbHVzaW9uJywnZmFybWluYSddIGFzICRicyl7ICR0PWdldF90ZXJtX2J5KCdzbHVnJywkYnMsJ3Byb2R1Y3RfYnJhbmQnKTsgJGlkcz1nZXRfcG9zdHMoWydwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9Pi0xLCdmaWVsZHMnPT4naWRzJywndGF4X3F1ZXJ5Jz0+W1sndGF4b25vbXknPT4ncHJvZHVjdF9icmFuZCcsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PiRic11dXSk7ICRrYXQ9W107IGZvcmVhY2goJGlkcyBhcyAkaWQpeyBmb3JlYWNoKHdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J2FsbCddKSBhcyAkY3QpeyBpZigkY3QtPnBhcmVudCl7ICRrYXRbJGN0LT5uYW1lXT0oJGthdFskY3QtPm5hbWVdPz8wKSsxOyB9IH0gfSBhcnNvcnQoJGthdCk7ICRyWydicmFuZF9rYXQnXVskYnNdPVsnbic9PmNvdW50KCRpZHMpLCdrYXQnPT5hcnJheV9zbGljZSgka2F0LDAsNix0cnVlKV07IH0KICAgICRyWydybV9kZXNjX2ZuJ109ZnVuY3Rpb25fZXhpc3RzKCdyYW5rX21hdGgnKT8xOjA7ICRyWydybV9oYXNfZmlsdGVyJ109aGFzX2ZpbHRlcigncmFua19tYXRoL2Zyb250ZW5kL2Rlc2NyaXB0aW9uJyk/MTowOwogICAgJHJbJ3NlcCddPWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLXRpdGxlcycpWyd0aXRsZV9zZXBhcmF0b3InXT8/bnVsbDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-084934';
const GKEY='ps_s1717t0';
const PHASES=["1"];
const OUT='analize/s1717_t0.json';
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
