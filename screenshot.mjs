process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0ZHogIzE5IGRhcmJhbGF1a2lzOiDEr3NwxJdqaW1hcyBzdW5raWFtIHBhxaF0b21hdG8gdcW+c2FreW11aSAoMSBkcnksIDIgYXBwbHksIDkgcmVzdG9yZSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI0ZHonXSkpIHJldHVybjsgJEY9JF9HRVRbJ3BzX3MxODI0ZHonXTsgJHI9Wyd2Jz0+J1MxODI0ZHonLCdGJz0+JEZdOwogICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGVzay5waHAnOyAkYmFrPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy9wZXRzaG9wLWRlc2sucGhwLmJha19zMTgyNCc7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJHJbJ21kNSddPW1kNSgkYyk7CiAgJHNlc2lqYT1mdW5jdGlvbigpeyAkdT1nZXRfdXNlcnMoWydyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdvcmRlcmJ5Jz0+J0lEJywnb3JkZXInPT4nQVNDJywnbnVtYmVyJz0+MV0pOyAkdWlkPShpbnQpJHVbMF0tPklEOyAkZXhwPXRpbWUoKSsxMjAwOyAkbWFuPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCk7ICRzdD0kbWFuLT5jcmVhdGUoJGV4cCk7ICRsaT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHN0KTsgJGNrPVtTRUNVUkVfQVVUSF9DT09LSUU9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnc2VjdXJlX2F1dGgnLCRzdCksQVVUSF9DT09LSUU9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcsJHN0KSxMT0dHRURfSU5fQ09PS0lFPT4kbGksJ3BzX2pzJz0+JzEnXTsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdWlkKTsgJF9DT09LSUVbTE9HR0VEX0lOX0NPT0tJRV09JGxpOyByZXR1cm4gWyRtYW4sJHN0LCRjayx3cF9jcmVhdGVfbm9uY2UoJ3BzX3JpbmsnKV07IH07CiAgJEE9Ilx0XHRcdFx0XHRcdFwkcGsgPSBzcHJpbnRmKCAnIDxzcGFuIGNsYXNzPVwicGQtcGtcIj5kxJfFvmnFsyA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiBtYXg9XCIyMFwiIHZhbHVlPVwiJWRcIiBkYXRhLXBrPVwiJXNcIiBzdHlsZT1cIndpZHRoOjQ2cHhcIj48L3NwYW4+Jyxcblx0XHRcdFx0XHRcdFx0KGludCkgc2VsZjo6cGFrdW9jaXUoIHdjX2dldF9vcmRlciggXCRvaWRfcCApICksIGVzY19hdHRyKCBcJGJhemluZSApICk7IjsKICAkQj0kQS4iXG5cdFx0XHRcdFx0XHQvKiB2My41MCAoUzE4MjQgIzE5LCAjMTU3MSk6IHN1bmt1cyBwYcWhdG9tYXRvIHXFvnNha3ltYXMgc3UgMSBkxJfFvmUg4oaSIMSvc3DEl2ppbWFzICovXG5cdFx0XHRcdFx0XHRcJG9vX3AgPSB3Y19nZXRfb3JkZXIoIFwkb2lkX3AgKTsgXCRrZ19wID0gMC4wO1xuXHRcdFx0XHRcdFx0aWYgKCBcJG9vX3AgJiYgJ3ZlbmlwYWtfcGFzdG9tYXRhcycgPT09IHNlbGY6OnZlemVqYXMoIFwkb29fcCApICYmIDEgPT09IChpbnQpIHNlbGY6OnBha3VvY2l1KCBcJG9vX3AgKSApIHtcblx0XHRcdFx0XHRcdFx0Zm9yZWFjaCAoIFwkb29fcC0+Z2V0X2l0ZW1zKCkgYXMgXCRpdF9wICkgeyBcJHBwID0gXCRpdF9wLT5nZXRfcHJvZHVjdCgpOyBpZiAoIFwkcHAgJiYgXCRwcC0+Z2V0X3dlaWdodCgpICkgeyBcJGtnX3AgKz0gKGZsb2F0KSBcJHBwLT5nZXRfd2VpZ2h0KCkgKiAoaW50KSBcJGl0X3AtPmdldF9xdWFudGl0eSgpOyB9IH1cblx0XHRcdFx0XHRcdFx0aWYgKCBcJGtnX3AgPiAxNSApIHsgXCRwayAuPSBzcHJpbnRmKCAnIDxzcGFuIGNsYXNzPVwicGQtcmJhZFwiIHRpdGxlPVwiVmVuaXBhayBwYcWhdG9tYXR1aSAxIGTEl8W+xJcgPSAxIHNpdW50YS4gSmVpIG5ldGVscGEg4oCTIMSvcmHFoXlrIGTEl8W+acWzIHNrYWnEjWnFsyBQUklFxaAgcmVnaXN0cmFjaWrEhSwgc2lzdGVtYSBzdWt1cnMgdGllayBzaXVudMWzIGlyIHZpc2kgbnVtZXJpYWkgcGF0ZWtzIGtsaWVudHVpLlwiPuKaoCAlcyBrZyDigJMgYXIgdGVscGEgxK8gMSBkxJfFvsSZPzwvc3Bhbj4nLCBlc2NfaHRtbCggbnVtYmVyX2Zvcm1hdCggXCRrZ19wLCAxLCAnLCcsICcnICkgKSApOyB9XG5cdFx0XHRcdFx0XHR9IjsKICAkclsnY250J109c3Vic3RyX2NvdW50KCRjLCRBKTsKICBpZigkRj09PScyJyl7IGlmKCRyWydtZDUnXSE9PSc2OTc4YjU2Yjc1MDJlMDAyZjBmMDhmYzE5NTZjMWViOCd8fCRyWydjbnQnXSE9PTEpeyAkclsna2xhaWRhJ109J2d1YXJkJzsgZ290byBvdXQ7IH0KICAgICRuPXN0cl9yZXBsYWNlKCRBLCRCLCRjKTsgJG49cHJlZ19yZXBsYWNlKCcvXCogUGV0c2hvcCBEZXNrIHYzXC40OS8nLCcqIFBldHNob3AgRGVzayB2My41MCAoUzE4MjQgIzE5LCAyMDI2LTExLTAzLCBSYWltaXMg4oCeZGFyeWvigJwpIOKAlCBWZW5pcGFrIGdydXDEl3MgbGVudGVsxJdqZSBwcmllIOKAnmTEl8W+acWz4oCcIMSvc3DEl2ppbWFzLCBrYWkgcGHFoXRvbWF0byB1xb5zYWt5bWFzID4xNSBrZyBpciBkxJfFvmnFsyAxICgjMTU3MTogMjQsMiBrZywgYW50cmFzIGxpcGR1a2FzIHJhbmtvbWlzKS4nLiJcbiIuJyAqIFBldHNob3AgRGVzayB2My40OScsJG4sMSk7CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJG4sVE9LRU5fUEFSU0UpOyB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydrbGFpZGEnXT0ncGFyc2UgJy4kZS0+Z2V0TWVzc2FnZSgpOyBnb3RvIG91dDsgfQogICAgaWYoIWZpbGVfZXhpc3RzKCRiYWspKSBmaWxlX3B1dF9jb250ZW50cygkYmFrLCRjKTsgZmlsZV9wdXRfY29udGVudHMoJGYsJG4pOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJGYsdHJ1ZSk7ICRyWydtZDVfbmV3J109bWQ1X2ZpbGUoJGYpOwogICAgbGlzdCgkbWFuLCRzdCwkY2ssJG5vbmNlKT0kc2VzaWphKCk7ICRoYj1bXTsgZm9yZWFjaChbYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJyksaG9tZV91cmwoJy8nKV0gYXMgJHUpeyAkeD13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX2hiJyx0aW1lKCksJHUpLFsndGltZW91dCc9PjYwLCdzc2x2ZXJpZnknPT5mYWxzZSwnY29va2llcyc9PiRja10pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRoYltdPVt3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksc3RybGVuKCRiKSxzdWJzdHJfY291bnQoJGIsJ0ZhdGFsIGVycm9yJykrc3Vic3RyX2NvdW50KCRiLCdrcml0aW7ElyBrbGFpZGEnKSxzdWJzdHJfY291bnQoJGIsJ2FyIHRlbHBhIMSvIDEgZMSXxb7EmScpXTsgfSAkbWFuLT5kZXN0cm95KCRzdCk7ICRyWydoYiddPSRoYjsKICAgIGZvcmVhY2goJGhiIGFzICRoKXsgaWYoJGhbMF0+PTUwMHx8JGhbMF09PTB8fCRoWzJdPjApeyBmaWxlX3B1dF9jb250ZW50cygkZiwkYyk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgJHJbJ0FUU1RBVFlUQSddPTE7IH0gfSB9CiAgaWYoJEY9PT0nOScpeyBpZihmaWxlX2V4aXN0cygkYmFrKSl7IGZpbGVfcHV0X2NvbnRlbnRzKCRmLGZpbGVfZ2V0X2NvbnRlbnRzKCRiYWspKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnYXRzdGF0eXRhJ109bWQ1X2ZpbGUoJGYpOyB9IH0KICBvdXQ6IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-090523';
const GKEY='ps_s1824dz';
const PHASES=["2"];
const OUT='analize/s1824_dz2.json';
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
