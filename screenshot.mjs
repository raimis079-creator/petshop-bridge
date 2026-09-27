process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0ZCBkcm9wc2hpcC1zYXJnYXMgcGlsbmFzIGtvZGFzICsgMyBwYXp5bWV0aSB1enNha3ltYWkgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNGQnXSkpIHJldHVybjsKICAkcj1bJ3YnPT4nUzE3MjRkJ107IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgdHJ5ewogICAgJHJbJ2tvZGFzJ109ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kcm9wc2hpcC1zYXJnYXMucGhwJyk7CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgbS5vcmRlcl9pZCBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRwfXdjX29yZGVycyBvIE9OIG8uaWQ9bS5vcmRlcl9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfc2xhX3ZlbGF2aW1hcycgQU5EIG8uc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLW9uLWhvbGQnKSIpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8pIGNvbnRpbnVlOyAkeD1bJ25yJz0+JG8tPmdldF9vcmRlcl9udW1iZXIoKSwnc3RhdHVzJz0+JG8tPmdldF9zdGF0dXMoKSwnc3VrdXJ0YSc9PiRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPnNldFRpbWV6b25lKCR0eiktPmZvcm1hdCgnbS1kIEg6aSBEJyldOwogICAgICBmb3JlYWNoKFsnX3BzX3NsYV92ZWxhdmltYXMnLCdfcHNfZHJvcHNoaXBfc2VudCcsJ19wc19kcm9wc2hpcF9zZW50X3NyYycsJ19wc19kcm9wc2hpcF90bycsJ19wc19rZWxpYXMnLCdfcHNfZGFseXMnLCdfcHNfZGFseXNfaXNzaXVzdGEnLCdfcHNfZGVjaWRlZF9hdCddIGFzICRrKXsgJHY9JG8tPmdldF9tZXRhKCRrKTsgaWYoJHYhPT0nJyYmJHYhPT1udWxsKSAkeFska109aXNfc2NhbGFyKCR2KT8oc3RyaW5nKSR2Ompzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyB9CiAgICAgICRpdGVtcz1bXTsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJGl0ZW1zW109WyRpdC0+Z2V0X25hbWUoKSwkaXQtPmdldF9xdWFudGl0eSgpLCRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKT86JycsJGl0LT5nZXRfbWV0YSgnX3BzX2tlbGlhcycpPzonJ107IH0gJHhbJ2VpbHV0ZXMnXT0kaXRlbXM7CiAgICAgICRub3Rlcz13Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT44XSk7ICR4WydwYXN0YWJvcyddPWFycmF5X21hcChmdW5jdGlvbigkbikgdXNlKCR0eil7IHJldHVybiAkbi0+ZGF0ZV9jcmVhdGVkLT5zZXRUaW1lem9uZSgkdHopLT5mb3JtYXQoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDE0MCk7IH0sJG5vdGVzKTsKICAgICAgJHJbJ3BhenltZXRpJ11bXT0keDsgfQogICAgLy8gdmlzaSBfcHNfc2xhX3ZlbGF2aW1hcyBwZXIgMzAgZC4gKGlyIHV6ZGFyeXRpKSDigJMga2llayBrbGFpZGluZ3UgZGVsIHNhdmFpdGdhbGlvCiAgICAkclsndmlzb3NfenltZXNfMzBkJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgby5zdGF0dXMsIG0ubWV0YV92YWx1ZSB2LCBEQVRFX0ZPUk1BVChDT05WRVJUX1RaKG8uZGF0ZV9jcmVhdGVkX2dtdCwnKzAwOjAwJywnKzAzOjAwJyksJyVtLSVkICVhJykgc3VrdXJ0YSBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRwfXdjX29yZGVycyBvIE9OIG8uaWQ9bS5vcmRlcl9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfc2xhX3ZlbGF2aW1hcycgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49VVRDX0RBVEUoKS1JTlRFUlZBTCAzMCBEQVkgT1JERVIgQlkgby5pZCIsQVJSQVlfQSk7CiAgICAkclsnc2VudF9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLCBtLm1ldGFfdmFsdWUgc2VudCBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRwfXdjX29yZGVycyBvIE9OIG8uaWQ9bS5vcmRlcl9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfZHJvcHNoaXBfc2VudCcgT1JERVIgQlkgby5pZCBERVNDIExJTUlUIDUiLEFSUkFZX0EpOwogICAgJHJbJ2RsX0xUX1NWRU5URVMnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfRGFyYmFsYXVraXMnKSYmZGVmaW5lZCgnUGV0c2hvcF9EYXJiYWxhdWtpczo6TFRfU1ZFTlRFUycpP1BldHNob3BfRGFyYmFsYXVraXM6OkxUX1NWRU5URVM6bnVsbDsKICAgICRyWydsYWlrYXMnXT0obmV3IERhdGVUaW1lKCdub3cnLCR0eikpLT5mb3JtYXQoJ1ktbS1kIEg6aSBEJyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-081743';
const GKEY='ps_s1724d';
const PHASES=["1"];
const OUT='analize/s1724_d.json';
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
