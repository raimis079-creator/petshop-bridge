process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxZyByZWNvbiByZWFkLW9ubHk6IHNrYWljaXVva2xlIChzdm9yaW8gc2F1Z29qaW1hcywgQUpBWCwgY2FsYyBBUEkpLCBEUCBtZXRhLCBGbGF0c29tZSBsb29wIGhvb2thaSwgcGV0IHByb2ZpbGUgc3ZvcmlzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyMWcnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzIxZyddOyAkcj1bJ3YnPT4nUzE3MjFnJywnZmF6ZSc9PiRmXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG11PVdQTVVfUExVR0lOX0RJUjsgJGNvcmU9JG11LicvcGV0c2hvcC1jb3JlJzsKICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0LCRjdHg9MTYwLCRtYXg9MTQpeyBpZighaXNfZmlsZSgkZmlsZSkpIHJldHVybiAnTkVSQSAnLiRmaWxlOyAkcz1maWxlX2dldF9jb250ZW50cygkZmlsZSk7IHByZWdfbWF0Y2hfYWxsKCcjW15cbl17MCwnLiRjdHguJ30oJy4kcGF0LicpW15cbl17MCwnLiRjdHguJ30jJywkcywkbSk7IHJldHVybiBhcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIodHJpbSgkeCksMCw0MDApO30sJG1bMF0pLDAsJG1heCk7IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRyWydjb3JlX2ZpbGVzJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsYXJyYXlfbWVyZ2UoZ2xvYigkY29yZS4nLyoucGhwJyksZ2xvYigkY29yZS4nL2luY2x1ZGVzLyoucGhwJyksZ2xvYigkY29yZS4nL2Fzc2V0cy8qLmpzJykpKTsKICAgICRyWydjYWxjX3BocCddPSRncmVwKCRjb3JlLicvaW5jbHVkZXMvY2xhc3MtcHJvZHVjdC1jYWxjLnBocCcsJ3dwX2FqYXh8YWRkX2FjdGlvbnxsb2NhbFN0b3JhZ2V8Y29va2llfHBzX2NhbGN8d2VpZ2h0fEZlZWRpbmdfU2VydmljZTo6fHdwX2VucXVldWVfc2NyaXB0fHdwX2xvY2FsaXplfHJlc3Rfcm91dGV8cmVnaXN0ZXJfcmVzdCcpOwogICAgZm9yZWFjaChnbG9iKCRjb3JlLicvYXNzZXRzLypjYWxjKi5qcycpIGFzICRqcyl7ICRyWydjYWxjX2pzJ11bYmFzZW5hbWUoJGpzKV09JGdyZXAoJGpzLCdsb2NhbFN0b3JhZ2V8c2Vzc2lvblN0b3JhZ2V8Y29va2llfGFqYXh8ZmV0Y2hcKHxhY3Rpb258d2VpZ2h0fHBzX2NhbGNfd3xwcy1jYWxjLXcnKTsgfQogICAgZm9yZWFjaChnbG9iKCRjb3JlLicvYXNzZXRzLyouanMnKSBhcyAkanMpeyAkcz1maWxlX2dldF9jb250ZW50cygkanMpOyBpZihzdHJwb3MoJHMsJ3BzLWNhbGMnKSE9PWZhbHNlfHxzdHJwb3MoJHMsJ3BzX2NhbGMnKSE9PWZhbHNlKSAkclsnanNfc3VfY2FsYyddW109YmFzZW5hbWUoJGpzKS4nICcucm91bmQoc3RybGVuKCRzKS8xMDI0KS4nS0InOyB9CiAgICBmb3JlYWNoKGdsb2IoJGNvcmUuJy9pbmNsdWRlcy8qLnBocCcpIGFzICRwaCl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRwaCk7IGlmKHByZWdfbWF0Y2goJy9jbGFzc1xzK0ZlZWRpbmdfU2VydmljZS8nLCRzKSl7ICRyWydmZWVkaW5nX2ZpbGUnXT1iYXNlbmFtZSgkcGgpOyBwcmVnX21hdGNoX2FsbCgnI3B1YmxpYyAoPzpzdGF0aWMgKT9mdW5jdGlvbiAoXHcrKVxzKlwoKFteKV0qKVwpIycsJHMsJG0pOyAkclsnZmVlZGluZ19mbnMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYS4nKCcubWJfc3Vic3RyKCRiLDAsODApLicpJzt9LCRtWzFdLCRtWzJdKTsgJHJbJ2NhbGNfYm9keSddPSRncmVwKCRwaCwnZnVuY3Rpb24gY2FsY3xyZXR1cm4gYXJyYXl8XCdkYXlzfFwnZ19wZXJfZGF5fGdyYW1zfGR1cmF0aW9ufFwnbWluXCd8XCdtYXhcJ3xXRUlHSFRfT1VUJywyMDAsMjApOyB9IH0KICAgICRyWydwZXRfcHJvZmlsZV9mbnMnXT0kZ3JlcCgkY29yZS4nL2luY2x1ZGVzL2NsYXNzLXBldC1wcm9maWxlLnBocCcsJ3B1YmxpYyAoc3RhdGljICk/ZnVuY3Rpb258d2VpZ2h0fHN2b3JpcycsMTIwLDI1KTsKICAgICRyWyd3ZWlnaHRfc2lnbmFsJ109W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYigkbXUuJy8qLnBocCcpLGdsb2IoJGNvcmUuJy9pbmNsdWRlcy8qLnBocCcpKSBhcyAkcGgpeyAkcz1maWxlX2dldF9jb250ZW50cygkcGgpOyBpZihzdHJwb3MoJHMsJ3BzX3dlaWdodF9zaWduYWwnKSE9PWZhbHNlKSAkclsnd2VpZ2h0X3NpZ25hbCddW2Jhc2VuYW1lKCRwaCldPSRncmVwKCRwaCwncHNfd2VpZ2h0X3NpZ25hbCcsMTQwLDYpOyB9CiAgICAvLyBEUCBtZXRhCiAgICBmb3JlYWNoKFszNjAwMiwzNjAwMywxODU5MF0gYXMgJHBpZCl7ICRyWydkcCddWyRwaWRdPVsnX2RwX2Jhc2VfcHJvZHVjdF9pZCc9PmdldF9wb3N0X21ldGEoJHBpZCwnX2RwX2Jhc2VfcHJvZHVjdF9pZCcsdHJ1ZSksJ19kcF9wYWNrX3F0eSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKSwncGFrJz0+d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwYV9wYWt1b3Rlc19keWRpcycsWydmaWVsZHMnPT4nbmFtZXMnXSksJ3NlaW1hJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKSwncHJpY2VfaHRtbCc9PndwX3N0cmlwX2FsbF90YWdzKHdjX2dldF9wcm9kdWN0KCRwaWQpLT5nZXRfcHJpY2VfaHRtbCgpKV07IH0KICAgIC8vIEZsYXRzb21lIGxvb3AgaG9va3MKICAgIGdsb2JhbCAkd3BfZmlsdGVyOyBmb3JlYWNoKFsnd29vY29tbWVyY2VfYmVmb3JlX3Nob3BfbG9vcF9pdGVtJywnd29vY29tbWVyY2VfYmVmb3JlX3Nob3BfbG9vcF9pdGVtX3RpdGxlJywnd29vY29tbWVyY2Vfc2hvcF9sb29wX2l0ZW1fdGl0bGUnLCd3b29jb21tZXJjZV9hZnRlcl9zaG9wX2xvb3BfaXRlbV90aXRsZScsJ3dvb2NvbW1lcmNlX2FmdGVyX3Nob3BfbG9vcF9pdGVtJywnZmxhdHNvbWVfcHJvZHVjdF9ib3hfYWZ0ZXInLCdmbGF0c29tZV9wcm9kdWN0X2JveF9hY3Rpb25zJywnZmxhdHNvbWVfcHJvZHVjdF9ib3hfdG9vbHNfdG9wJywnd29vY29tbWVyY2Vfc2luZ2xlX3Byb2R1Y3Rfc3VtbWFyeSddIGFzICRoayl7IGlmKCFpc3NldCgkd3BfZmlsdGVyWyRoa10pKSBjb250aW51ZTsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoa10tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgJHJbJ2hvb2tzJ11bJGhrXVtdPSRwci4nICcuKGlzX3N0cmluZygkZm4pPyRmbjooaXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTonY2xvc3VyZScpKTsgfSB9IH0KICAgICRyWydmbGF0c29tZV9ib3gnXT0kZ3JlcChnZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS9jb250ZW50LXByb2R1Y3QucGhwJywnZG9fYWN0aW9ufGdldF90ZW1wbGF0ZV9wYXJ0fHByb2R1Y3Qtc21hbGx8Ym94LXRleHQnLDEyMCwyMCk7CiAgICAkclsnZHlkemlhaV9tZDUnXT1tZDVfZmlsZSgkbXUuJy9wZXRzaG9wLWR5ZHppYWkucGhwJyk7CiAgICAkclsnZHlkemlhaV9ob29rcyddPVtdOyBmb3JlYWNoKGdsb2IoJG11LicvKi5waHAnKSBhcyAkcGgpeyAkcz1maWxlX2dldF9jb250ZW50cygkcGgpOyBpZihzdHJwb3MoJHMsJ19wc19keWR6aW9fc2VpbWEnKSE9PWZhbHNlKSAkclsnZHlkemlhaV9ob29rcyddW109YmFzZW5hbWUoJHBoKTsgfQogICAgLy8gZmFrdHUgbGVudGVsZXMgcGFyZGF2aW1haSBwZXIgcHJla2UgKDM2NSBkKSDigJQgZ3JlaXRpcwogICAgJHQwPW1pY3JvdGltZSh0cnVlKTsgJHJbJ2Zha3RfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJla2VfaWQsIFNVTShraWVraXMpIHEgRlJPTSB7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSBwcmVrZV9pZCBJTiAoMTg1ODQsMTg1OTAsMTg1ODcsMzYwMDIsMzYwMDMpIEFORCBkaWVuYT49JzIwMjUtMDktMjYnIEdST1VQIEJZIHByZWtlX2lkIixBUlJBWV9BKTsgJHJbJ2Zha3RfbXMnXT1yb3VuZCgobWljcm90aW1lKHRydWUpLSR0MCkqMTAwMCk7CiAgICAkclsnYWpheF91cmwnXT1hZG1pbl91cmwoJ2FkbWluLWFqYXgucGhwJyk7ICRyWyd3Y19hamF4J109Y2xhc3NfZXhpc3RzKCdXQ19BSkFYJyk/V0NfQUpBWDo6Z2V0X2VuZHBvaW50KCclJWVuZHBvaW50JSUnKTpudWxsOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-125014';
const GKEY='ps_s1721g';
const PHASES=["1"];
const OUT='analize/s1721_g2.json';
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
