process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkyYSAjMTQ3NyAjMTQ3OCBidWtsZSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3OTJhJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc5MmEnXTsKICAkcm09ZnVuY3Rpb24oJG4peyAkbT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJG4pOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgcmV0dXJuICRtOyB9OwogIHRyeXsKICAgIGZvcmVhY2goWycxNDc3JywnMTQ3OCddIGFzICRucil7ICRvaWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9yZGVyX2lkIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfb3JkZXJfbnVtYmVyJyBBTkQgbWV0YV92YWx1ZT0lcyBMSU1JVCAxIiwkbnIpKTsgJG89d2NfZ2V0X29yZGVyKCRvaWQpOwogICAgICAkeD1bJ29pZCc9PiRvaWQsJ3N0YXR1cyc9PiRvLT5nZXRfc3RhdHVzKCksJ3N1bWEnPT4kby0+Z2V0X3RvdGFsKCksJ21vayc9PiRvLT5nZXRfcGF5bWVudF9tZXRob2QoKSwnYXZwbic9PiRvLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKSwnZG9jJz0+JG8tPmdldF9tZXRhKCdfcGV0c2hvcF9pbnZvaWNlX2RvY3VtZW50X3R5cGUnKSwnc3ByJz0+JG8tPmdldF9tZXRhKCdfcHNfbWlzcnVzX3NwcmVuZGltYXMnKSwncnVzJz0+JG8tPmdldF9tZXRhKCdfcHNfcnVzaXVvdGEnKSwnbGF1a2lhJz0+JG8tPmdldF9tZXRhKCdfcHNfdGlla2ltYXNfbGF1a2lhJyksJ2VpbCc9PltdXTsKICAgICAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGl0KXsgJHhbJ2VpbCddW109JGlpZC4nIHwgJy5tYl9zdWJzdHIoJGl0LT5nZXRfbmFtZSgpLDAsNDUpLicgw5cnLiRpdC0+Z2V0X3F1YW50aXR5KCkuJyAnLiRpdC0+Z2V0X3RvdGFsKCkuJ+KCrCB8IHNyYz0nLiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKS4nIGtlbGlhcz0nLiRpdC0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKS4nIGtvbnM9Jy4kaXQtPmdldF9tZXRhKCdfcHNfa29uc29saWRhY2lqYScpLicgcmVkPScuJGl0LT5nZXRfbWV0YSgnX3BzX2F2X3JlZHVjZWRfcXR5JykuJyB8ICcuanNvbl9lbmNvZGUoUGV0c2hvcF9BVl9UaWVraW1hczo6ZWlsdXRlc19idWtsZSgkb2lkLChpbnQpJGlpZCkpOyB9CiAgICAgICRmPSRybSgnZmFrdGFpJyktPmludm9rZShudWxsLCRvLCRybSgnenVybmFsYXMnKS0+aW52b2tlKG51bGwsWyRvaWRdKSk7CiAgICAgICR4WydlaWxlcyddPSRmWydlaWxlcyddOyAkeFsna2wnXT0kZlsna2wnXTsgJHhbJ3Rha2VsaXMnXT1hcnJheV9tYXAoZm4oJHQpPT4kdFsxXS4nIFsnLiR0WzJdLiddJy4oJHRbNF0/JyBidG49Jy4kdFs0XTonJyksJGZbJ3Rha2VsaXMnXSk7CiAgICAgICR4WydlaWxfZiddPWFycmF5X3ZhbHVlcyhhcnJheV9tYXAoZm4oJGUpPT5tYl9zdWJzdHIoJGVbJ24nXSwwLDMwKS4nIHwgJy4kZVsnayddLicgfCBsb2NrOiAnLigkZVsnbG9jayddPz8nJykuJyB8IGdhbGltaSAnLmpzb25fZW5jb2RlKCRlWydnYWxpbWknXSksJGZbJ2VpbCddKSk7CiAgICAgIGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kb2lkLCdvcmRlcl9ieSc9PidkYXRlX2NyZWF0ZWQnLCdvcmRlcic9PidBU0MnXSkgYXMgJG4peyBpZihwcmVnX21hdGNoKCcvRGFyYmFsYXVraXN8VGlla2ltYXN8VnlrZHltYXN8U3VyxavFoXxQZXJkdW90YS91Jywkbi0+Y29udGVudCkpICR4WydwYXN0YWJvcyddW109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgWycuJG4tPmFkZGVkX2J5LiddICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDIwMCk7IH0KICAgICAgJHJbJ3UnLiRucl09JHg7IH0KICAgICRyWydwYXJ0aWphNTcnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JFB9cHNfdGlla2ltYXMgV0hFUkUgaWQ9NTciLEFSUkFZX0EpOwogICAgJHJbJ3BhcnRpamE1N19laWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxwcm9kdWN0X2lkLG9yZGVyX2lkLHF0eSxxdHlfZ2F1dGEscGFzdGFiYSBGUk9NIHskUH1wc190aWVraW1hc19laWwgV0hFUkUgcGFydGlqYV9pZD01NyIsQVJSQVlfQSk7CiAgICAvLyBkYXJiYWxhdWtpbyBrb2Rhczoga2lla2lzL2lzaW10aSBzdSBpX2F2IGlyIHV6c2FreXRhIHBhcnRpamEKICAgICRkbD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCc7ICRoPVtdOyBmb3JlYWNoKGZpbGUoJGRsKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gKGtpZWtpc3xpc2ltdGl8a2Vpc3RpX2tpZWtpfGtpZWtpbyl8cHNfZGxfa2lla2lzfFwna2lla2lzXCcgPT09fEnFoWltdGl8aXNpbXRpX2VpbHV0ZXxfcHNfZ3JhemludGlfcmFua29taXN8R1JBWklOVElfTUVUQS91JywkbCkpICRoW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwyNDApKTsgfSAkclsnZGxfZ3JlcCddPWFycmF5X3NsaWNlKCRoLDAsMzApOwogICAgJHJbJ2RsX3ZlciddPVBldHNob3BfRGFyYmFsYXVraXM6OlZFUlNJSkE7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-055656';
const GKEY='ps_s1792a';
const PHASES=["1"];
const OUT='analize/s1792p_a.json';
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
