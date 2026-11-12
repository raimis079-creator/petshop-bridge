process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU0YyDigJQgcmVjb246IEFWIERQIHBha28gdcW+c2FreW1hcywgbnVyYcWheW1hcyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4NTQnXSk/JF9HRVRbJ3BzX3MxODU0J106JycpOyBpZigkZj09PScnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxODU0YycpOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLCBvaS5vcmRlcl9pdGVtX2lkLCBvaW0ubWV0YV92YWx1ZSBwaWQsIG0ubWV0YV92YWx1ZSBiYXNlIEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG9pbSBPTiBvaW0ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkIEFORCBvaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1vaW0ubWV0YV92YWx1ZSBBTkQgbS5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgSk9JTiB7JHB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9bS5tZXRhX3ZhbHVlIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU9J2F2JyBPUkRFUiBCWSBvaS5vcmRlcl9pZCBERVNDIExJTUlUIDMiLEFSUkFZX0EpOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkb3JkPXdjX2dldF9vcmRlcigkclsnb3JkZXJfaWQnXSk7ICRpdD0kb3JkPyRvcmQtPmdldF9pdGVtKCRyWydvcmRlcl9pdGVtX2lkJ10pOm51bGw7CiAgICAkb1snb3JkJ11bXT1hcnJheSgnb3JkZXInPT4kclsnb3JkZXJfaWQnXSwnZGF0YSc9PiRvcmQ/JG9yZC0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCcpOicnLCdidXNlbmEnPT4kb3JkPyRvcmQtPmdldF9zdGF0dXMoKTonJywncGFrJz0+JHJbJ3BpZCddLCdxdHlfcGFrJz0+Z2V0X3Bvc3RfbWV0YSgkclsncGlkJ10sJ19kcF9wYWNrX3F0eScsdHJ1ZSksJ2Jhc2UnPT4kclsnYmFzZSddLAogICAgICAnaXRlbV9xdHknPT4kaXQ/JGl0LT5nZXRfcXVhbnRpdHkoKTpudWxsLCdhdl9waWQnPT4kaXQ/JGl0LT5nZXRfbWV0YSgnX3BzX2F2X3JlZHVjZWRfcGlkJyk6bnVsbCwnYXZfcXR5Jz0+JGl0PyRpdC0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkX3F0eScpOm51bGwsJ3JlZHVjZWRfc3RvY2snPT4kaXQ/JGl0LT5nZXRfbWV0YSgnX3JlZHVjZWRfc3RvY2snKTpudWxsLCdzcmMnPT4kaXQ/JGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpOm51bGwsCiAgICAgICdwYXN0YWJvcyc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gbWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDIwMCk7fSx3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JHJbJ29yZGVyX2lkJ10sJ2xpbWl0Jz0+MjUpKSksZnVuY3Rpb24oJHQpe3JldHVybiBwcmVnX21hdGNoKCcvbnVyYcWhxJd8bGlrdXR8QVYvdScsJHQpO30pKSk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-145701';
const GKEY='ps_s1854';
const PHASES=["S"];
const OUT='analize/s1854_c.json';
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
