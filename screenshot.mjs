process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHI5IChyZWNvbiwgdGlrIHNrYWl0eW1hcyk6IHRlbW9zIGJhc2UucGhwIHBpbG5hcyAoYjY0ICsgbWQ1KSBrcmVkaXRpbsSXcyBrZWl0aW11aSAoSzEpLCBXQyBnZXRfcmVtYWluaW5nX3JlZnVuZF9hbW91bnQgLyBnZXRfdG90YWxfcmVmdW5kZWQgZmlsdHJhaSwgcmVmdW5kIGvFq3JpbW8gcGFzdGFib3MvbGFpxaFrxbMga2FibGlhaSwgYHdjX29yZGVyX2Z1bGx5X3JlZnVuZGVkYCBzdGF0dXNhcywgRmFrdGFpIGhvb2thaSAoa2FkYSByYcWhbyksIEZha3RfR3JhemluaW1haSByZWFzb24uICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3I5J10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTcgcjknKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgxMjApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0cywkY3R4PTEsJG1heD0zMCwkdz00MjApeyAkcj1hcnJheSgpOyBpZighZmlsZV9leGlzdHMoJGZpbGUpKSByZXR1cm4gJ07EllJBICcuJGZpbGU7ICRsPWZpbGUoJGZpbGUpOyBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyBmb3JlYWNoKChhcnJheSkkcGF0cyBhcyAkcHQpeyBpZihwcmVnX21hdGNoKCRwdCwkbG4pKXsgJHJbXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbShpbXBsb2RlKCcg4o+OICcsYXJyYXlfbWFwKCd0cmltJyxhcnJheV9zbGljZSgkbCxtYXgoMCwkaS0kY3R4KSwkY3R4KjIrMSkpKSksMCwkdyk7IGJyZWFrOyB9IH0gaWYoY291bnQoJHIpPj0kbWF4KSBicmVhazsgfSByZXR1cm4gJHI7IH07CiAgJHRoPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOyAkYmY9JHRoLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvYmFzZS5waHAnOyAkYz1maWxlX2dldF9jb250ZW50cygkYmYpOyAkb1snYmFzZSddPWFycmF5KCdieXRlcyc9PnN0cmxlbigkYyksJ21kNSc9Pm1kNSgkYyksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoJGMpLCdsaW5lcyc9PmNvdW50KGZpbGUoJGJmKSkpOwogICR3Yz1XUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UvaW5jbHVkZXMvJzsKICAkb1sncmVtYWluaW5nJ109JGdyZXAoJHdjLidjbGFzcy13Yy1vcmRlci5waHAnLGFycmF5KCcvZnVuY3Rpb24gZ2V0X3JlbWFpbmluZ19yZWZ1bmRfYW1vdW50LycsJy9mdW5jdGlvbiBnZXRfdG90YWxfcmVmdW5kZWQvJywnL3dvb2NvbW1lcmNlX29yZGVyX2dldF90b3RhbF9yZWZ1bmRlZHxhcHBseV9maWx0ZXJzLipyZWZ1bmQvJyksMywxMiw1MDApOwogICRvWydmdWxseV9yZWZ1bmRlZCddPSRncmVwKCR3Yy4nd2Mtb3JkZXItZnVuY3Rpb25zLnBocCcsYXJyYXkoJy9mdW5jdGlvbiB3Y19vcmRlcl9mdWxseV9yZWZ1bmRlZC8nLCcvd29vY29tbWVyY2Vfb3JkZXJfZnVsbHlfcmVmdW5kZWRfc3RhdHVzLycsJy9hZGRfb3JkZXJfbm90ZS8nKSwyLDEyLDQwMCk7CiAgJG9bJ3JlZnVuZF9lbWFpbHMnXT0kZ3JlcCgkd2MuJ2NsYXNzLXdjLWVtYWlscy5waHAnLGFycmF5KCcvcmVmdW5kZWQvaScpLDAsMTAsMzAwKTsKICAkb1snZmFrdGFpX2hvb2tzJ109JGdyZXAoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1mYWt0YWkucGhwJyxhcnJheSgnL2FkZF9hY3Rpb25cKC8nKSwwLDIwLDMwMCk7CiAgJG9bJ2Zha3RfZ3Jhel9ob29rcyddPSRncmVwKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZmFrdC1ncmF6aW5pbWFpLnBocCcsYXJyYXkoJy9hZGRfYWN0aW9uXCgvJywnL3JlYXNvbnxwcmllemFzdGlzL2knKSwxLDE0LDM2MCk7CiAgJG9bJ2F2cG5fZm4nXT0kZ3JlcCgkdGguJy9mdW5jdGlvbnMucGhwJyxhcnJheSgnL2Z1bmN0aW9uIHBldHNob3BfZ2V0X2F2cG5fbnVtYmVyLycpLDE0LDEsMTQwMCk7CiAgJG9bJ3BkZnRvcHBtJ109dHJpbSgoc3RyaW5nKUBzaGVsbF9leGVjKCd3aGljaCBwZGZ0b3BwbSAyPi9kZXYvbnVsbCcpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-070348';
const GKEY='ps_r9';
const PHASES=["GO"];
const OUT='analize/s1617_r9.json';
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
