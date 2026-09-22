process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0aSBkdmlndWJvIG51cmFzeW1vIHN1c2thaWNpYXZpbWFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE3MDRpJ10pPyRfR0VUWydwc19zMTcwNGknXTonJyk7IGlmKCRmIT09JzEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTcwNGknKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgICAvLyBlaWx1dGVzIGt1ciBXQyBudXJhc2UgSVIgQVYgbnVyYXNlIHRhIHBhdGkga2lla2kKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLCBvaS5vcmRlcl9pdGVtX2lkLAogICAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3Byb2R1Y3RfaWQnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgcGlkLAogICAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3JlZHVjZWRfc3RvY2snIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgd2NfcmVkLAogICAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3BzX2F2X3JlZHVjZWRfcXR5JyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGF2X3JlZCwKICAgICAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19wc19hdl9yZWR1Y2VkX3BpZCcgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBhdl9waWQKICAgICAgRlJPTSB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kKICAgICAgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgbSBPTiBtLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZAogICAgICBXSEVSRSBvaS5vcmRlcl9pdGVtX3R5cGU9J2xpbmVfaXRlbScKICAgICAgR1JPVVAgQlkgb2kub3JkZXJfaXRlbV9pZAogICAgICBIQVZJTkcgd2NfcmVkPjAgQU5EIGF2X3JlZD4wIixBUlJBWV9BKTsKICAgICRkdmlnPWFycmF5KCk7ICRwYXY9YXJyYXkoKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJHIpewogICAgICAkcGlkPShpbnQpKCRyWydhdl9waWQnXT86JHJbJ3BpZCddKTsKICAgICAgJG93bj1nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsKICAgICAgaWYoJG93biE9PScnJiYkb3duIT09bnVsbCkgY29udGludWU7IC8vIG5lIGdyeW5haSBBViDigJQgQVYgbWF6aW5vIGtpdGEgbGF1a2EKICAgICAgJHE9bWluKChpbnQpJHJbJ3djX3JlZCddLChpbnQpJHJbJ2F2X3JlZCddKTsKICAgICAgaWYoIWlzc2V0KCRkdmlnWyRwaWRdKSkgJGR2aWdbJHBpZF09MDsKICAgICAgJGR2aWdbJHBpZF0rPSRxOwogICAgfQogICAgLy8gcGFseWdpbmFtIHN1IGludmFyaWFudHUKICAgICRwYXJ0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsIFNVTShraWVraXNfbGlrbykgbGlrbyBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBhdHNhdWt0YT0wIEdST1VQIEJZIHByb2R1Y3RfaWQiLEFSUkFZX0EpOwogICAgJHBtYXA9YXJyYXkoKTsgZm9yZWFjaCgkcGFydCBhcyAkcikgJHBtYXBbKGludCkkclsncHJvZHVjdF9pZCddXT0oaW50KSRyWydsaWtvJ107CiAgICAkYXRzPWFycmF5KCk7ICRwYWFpc2s9MDsgJG5lcGFhaXNrPTA7CiAgICBmb3JlYWNoKCRkdmlnIGFzICRwaWQ9PiRxKXsKICAgICAgJHN0b2NrPShpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgICAkbGlrbz1pc3NldCgkcG1hcFskcGlkXSk/JHBtYXBbJHBpZF06bnVsbDsKICAgICAgJHNraXJ0PSgkbGlrbz09PW51bGwpP251bGw6KCRzdG9jay0kbGlrbyk7CiAgICAgICRhdHNbXT1hcnJheSgncGlkJz0+JHBpZCwncGF2Jz0+aHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpLAogICAgICAgICdkdmlndWJhaSc9PiRxLCdzdG9jayc9PiRzdG9jaywncGFydGlqb3MnPT4kbGlrbywnc2tpcnR1bWFzJz0+JHNraXJ0LAogICAgICAgICdzdXRhbXBhJz0+KCRza2lydCE9PW51bGwgJiYgJHNraXJ0PT09LSRxKT8nVEFJUCc6J05FJyk7CiAgICB9CiAgICB1c29ydCgkYXRzLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ2R2aWd1YmFpJ108PT4kYVsnZHZpZ3ViYWknXTt9KTsKICAgIGZvcmVhY2goJGF0cyBhcyAkeCl7IGlmKCR4WydzdXRhbXBhJ109PT0nVEFJUCcpICRwYWFpc2srKzsgZWxzZSAkbmVwYWFpc2srKzsgfQogICAgJG9bJ3ByZWtpdV9wYWxpZXN0YSddPWNvdW50KCRhdHMpOwogICAgJG9bJ3Zpc29fZHZpZ3ViYWlfdm50J109YXJyYXlfc3VtKCRkdmlnKTsKICAgICRvWydwYWFpc2tpbmFfdmlzaXNrYWknXT0kcGFhaXNrOyAkb1snbmVwYWFpc2tpbmEnXT0kbmVwYWFpc2s7CiAgICAkb1snZWlsdXRlcyddPSRhdHM7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-081700';
const GKEY='ps_s1704i';
const PHASES=["1"];
const OUT='analize/s1704_i.json';
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
