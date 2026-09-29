process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwbm4gemVua2xvIGZpbHRybyByZXp1bHRhdGFpICgxIHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwbm4nXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzQwbm4nXTsKICAkSz1ob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nKTsKICBmb3JlYWNoKFsnZmlsdHJhcyc9PiRLLic/eWl0aF93Y2FuPTEmcHJvZHVjdF9icmFuZD1qb3NlcmEnLCdzdV9rYXQnPT4kSy4nP3lpdGhfd2Nhbj0xJnByb2R1Y3RfY2F0PXNhdXNhcy1tYWlzdGFzLXN1bmltcyZwcm9kdWN0X2JyYW5kPWpvc2VyYScsJ2dhbWludG9qYXMnPT5ob21lX3VybCgnL2dhbWludG9qYXMvam9zZXJhLycpXSBhcyAkaz0+JHUpewogICAgJGM9Y3VybF9pbml0KCR1KTsgY3VybF9zZXRvcHRfYXJyYXkoJGMsW0NVUkxPUFRfUkVUVVJOVFJBTlNGRVI9PjEsQ1VSTE9QVF9USU1FT1VUPT4zMCxDVVJMT1BUX0NPT0tJRT0+J3BzX2pzPTEnLENVUkxPUFRfVVNFUkFHRU5UPT4nTW96aWxsYS81LjAgKGlQaG9uZSkgcHMtdGVzdCddKTsgJGg9KHN0cmluZyljdXJsX2V4ZWMoJGMpOyAkY29kZT1jdXJsX2dldGluZm8oJGMsQ1VSTElORk9fSFRUUF9DT0RFKTsgY3VybF9jbG9zZSgkYyk7CiAgICBwcmVnX21hdGNoX2FsbCgnLzxwIGNsYXNzPSJuYW1lIHByb2R1Y3QtdGl0bGVbXiJdKiI+XHMqPGFbXj5dKj4oLio/KTxcL2E+L3NpJywkaCwkbSk7ICR0PWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHRyaW0oaHRtbF9lbnRpdHlfZGVjb2RlKHN0cmlwX3RhZ3MoJHgpKSk7fSwkbVsxXSk7CiAgICBwcmVnX21hdGNoKCcvUm9kb21hW148XSovdScsJGgsJHJjKTsgcHJlZ19tYXRjaCgnLzxoMVtePl0qPiguKj8pPFwvaDE+L3NpJywkaCwkaDEpOwogICAgJHJbJGtdPVsnaHR0cCc9PiRjb2RlLCdoMSc9Pmlzc2V0KCRoMVsxXSk/dHJpbShzdHJpcF90YWdzKCRoMVsxXSkpOm51bGwsJ2tpZWsnPT5pc3NldCgkcmNbMF0pP3RyaW0oJHJjWzBdKTpjb3VudCgkdCksJ2thY2l1Jz0+Y291bnQoYXJyYXlfZmlsdGVyKCR0LGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19tYXRjaCgnL2thdFtlxJddfGpvc2ljYXR8a2HEjS9pdScsJHgpO30pKSwna29uc2Vydic9PmNvdW50KGFycmF5X2ZpbHRlcigkdCxmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfbWF0Y2goJy9rb25zZXJ2fHBhdGV8c291cHxzYXVjZXxwYWRhxb4vaXUnLCR4KTt9KSksJ3B2eic9PmFycmF5X3NsaWNlKCR0LDAsMyldOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-213923';
const GKEY='ps_s1740nn';
const PHASES=["1"];
const OUT='analize/s1740nn.json';
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
