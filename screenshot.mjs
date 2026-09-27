process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0YyByeXRhcyBkcm9wc2hpcF9zbGEga29kYXMgKyBkYXJiYWxhdWtpbyBkYXJib19kaWVuYSBoZWxwZXJpYWkgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNGMnXSkpIHJldHVybjsKICAkcj1bJ3YnPT4nUzE3MjRjJ107CiAgdHJ5ewogICAgJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXRhcy5waHAnKTsgJEw9ZXhwbG9kZSgiXG4iLCRzKTsKICAgICRyWydyeXRhc180MzBfNDgwJ109aW1wbG9kZSgiXG4iLGFycmF5X21hcChmdW5jdGlvbigkaSkgdXNlKCRMKXsgcmV0dXJuICgkaSsxKS4nOiAnLigkTFskaV0/PycnKTsgfSxyYW5nZSg0MjUsNDg1KSkpOwogICAgLy8ga3VyIGRhciByeXRhcyBuYXVkb2phICI+IDIgZC4iIChuZWlzc2l1c3RpKSDigJMga2FsZW5kb3JpbmVzCiAgICBmb3JlYWNoKCRMIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9uZWlzc2l1c3RpfERBWV9JTl9TRUNPTkRTfElOVEVSVkFMIFxkKyAoREFZfEhPVVIpfGxlYWRfZC8nLCRsKSkgJHJbJ3J5dGFzX2RpZW5vcyddW109KCRpKzEpLic6ICcudHJpbSgkbCk7IH0KICAgICRkPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyk7ICRNPWV4cGxvZGUoIlxuIiwkZCk7CiAgICBmb3JlYWNoKCRNIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvblxzKyhkYXJib19kaWVuYXxwaWxub3NfZGFyYm9fZGllbm9zKVxzKlwoLycsJGwpKXsgJHJbJ2RsX2hlbHBlciddW109aW1wbG9kZSgiXG4iLGFycmF5X21hcChmdW5jdGlvbigkaikgdXNlKCRNKXsgcmV0dXJuICgkaisxKS4nOiAnLigkTVskal0/PycnKTsgfSxyYW5nZShtYXgoMCwkaS0zKSxtaW4oY291bnQoJE0pLTEsJGkrMjIpKSkpOyB9IH0KICAgIGZvcmVhY2goJE0gYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3BpbG5vc19kYXJib19kaWVub3NcKHxkYXJib19kaWVuYVwoLycsJGwpJiYhcHJlZ19tYXRjaCgnL2Z1bmN0aW9uLycsJGwpKSAkclsnZGxfbmF1ZG9qaW1hcyddW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMjIwKTsgfQogICAgJGRzPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZHJvcHNoaXAtc2FyZ2FzLnBocCc7IGlmKGlzX2ZpbGUoJGRzKSl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRkcyk7ICRyWydkcm9wc2hpcF9zYXJnYXNfbWQ1J109bWQ1KCRjKTsgJE49ZXhwbG9kZSgiXG4iLCRjKTsgZm9yZWFjaCgkTiBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvX3BzX3NsYV92ZWxhdmltYXN8MjR8SE9VUnxEQVlfSU58ZGFyYm98c2F2YWl0Z3x3ZWVrZW5kfC0+Zm9ybWF0XCguTi5cKS8nLCRsKSkgJHJbJ2Ryb3BzaGlwX3NhcmdhcyddW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMjIwKTsgfSAkclsnZHJvcHNoaXBfc2FyZ2FzX2VpbCddPWNvdW50KCROKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-081530';
const GKEY='ps_s1724c';
const PHASES=["1"];
const OUT='analize/s1724_c.json';
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
