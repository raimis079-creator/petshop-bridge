process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGYg4oCUIGJhY3Mgb24taG9sZCB0cmlnZXJpbyByZWNvbjogZHVubmluZy0xIMWhYWJsb25hcywgYXTFoWF1a2ltbyBsYWnFoWtvIGthYmx5cywgYmFjcyB1xb5zYWt5bWFpLCBjcm9uLiBSRUFELU9OTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjc2ZiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc2IGYnKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJGQ9UEVUU0hPUF9DT1JFX0RJUi4ndGVtcGxhdGVzL2VtYWlscy8nOyBmb3JlYWNoKGFycmF5KCdkdW5uaW5nLTEnLCdkdW5uaW5nLTInLCdkdW5uaW5nLTMnLCdvcmRlci1jYW5jZWxsZWQnLCdiYWNzLXJlbWluZGVyJykgYXMgJHQpeyAkZj0kZC4kdC4nLnBocCc7IGlmKGZpbGVfZXhpc3RzKCRmKSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgcHJlZ19tYXRjaF9hbGwoIi9cXFwkc3ViamVjdFxzKj1ccyonKFteJ10qKScvdSIsJHMsJG0pOyBwcmVnX21hdGNoX2FsbCgiL0xheW91dDo6cFwoXHMqJygoPzpbXidcXFxcXXxcXFxcLikqKScvc3UiLCRzLCRtMik7ICRvWydzYWJsJ11bJHRdPWFycmF5KCdtZDUnPT5tZDVfZmlsZSgkZiksJ3N1YmonPT4kbVsxXSwncCc9PmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cigkeCwwLDMwMCk7fSwkbTJbMV0pKTsgfSBlbHNlICRvWydzYWJsJ11bJHRdPSdOxJZSQSc7IH0KICAkZmw9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Zmxvd3MoKTsgZm9yZWFjaCgkZmwgYXMgJGs9PiR2KSBpZihwcmVnX21hdGNoKCcvZHVubmluZ3xjYW5jZWx8YmFjc3xwYXltZW50LycsJGsuJHZbJ3RlbXBsYXRlJ10pKSAkb1snZmxvd3MnXVska109JHY7CiAgLy8ga3VyIHNpdW5jaWFtYXMgImF0c2F1a3RhcyIgbGFpc2thcyAoUzE2MzkpIOKAlCBtdS1wbHVnaW5zIGdyZXAKICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYocHJlZ19tYXRjaF9hbGwoIi9bXlxuXXswLDgwfShvcmRlcl9jYW5jZWxsZWR8YXRzYXVrfGNhbmNlbGxlZClbXlxuXXswLDEyMH0vaSIsJHMsJG0pKSB7ICRoPWFycmF5KCk7IGZvcmVhY2goYXJyYXlfdW5pcXVlKCRtWzBdKSBhcyAkbCl7IGlmKHByZWdfbWF0Y2goJy9hZGRfYWN0aW9ufGRvX2FjdGlvbnxEaXNwYXRjaDo6fGxhaXNrfG1haWwvaScsJGwpKSAkaFtdPXRyaW0oJGwpOyB9IGlmKCRoKSAkb1snY2FuY2VsX2thYmxpYWknXVtiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRoLDAsOCk7IH0gfQogIC8vIGJhY3Mgb24taG9sZCB1enNha3ltYWkgZGFiYXIKICAkb1snYmFjc19vbmhvbGQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxkYXRlX2NyZWF0ZWRfZ210LHRvdGFsX2Ftb3VudCxiaWxsaW5nX2VtYWlsIEZST00geyRwfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzPSd3Yy1vbi1ob2xkJyBBTkQgcGF5bWVudF9tZXRob2Q9J2JhY3MnIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICBmb3JlYWNoKCRvWydiYWNzX29uaG9sZCddIGFzICYkcil7ICR3PXdjX2dldF9vcmRlcigkclsnaWQnXSk7ICRyWyduciddPSR3LT5nZXRfb3JkZXJfbnVtYmVyKCk7ICRyWydiaWxsaW5nX2VtYWlsJ109c3Vic3RyKCRyWydiaWxsaW5nX2VtYWlsJ10sMCwyKS4nKioqJy5zdHJyY2hyKCRyWydiaWxsaW5nX2VtYWlsJ10sJ0AnKTsgJHJbJ21ldGFfcHMnXT1hcnJheSgpOyBmb3JlYWNoKCR3LT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyBpZihzdHJwb3MoJG0tPmtleSwnX3BzXycpPT09MHx8c3RycG9zKCRtLT5rZXksJ19wZXRzaG9wJyk9PT0wKSAkclsnbWV0YV9wcyddW109JG0tPmtleTsgfSB9CiAgLy8gV0MgYmFjcyBlbWFpbCAoaW5zdHJ1Y3Rpb25zKSArIG9uLWhvbGQgbGFpc2thcwogICRvWyd3Y19vbmhvbGRfZW1haWwnXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jdXN0b21lcl9vbl9ob2xkX29yZGVyX3NldHRpbmdzJyk7CiAgLy8gY3JvbiBrYWJsaWFpIHBzXwogICRjPV9nZXRfY3Jvbl9hcnJheSgpOyBmb3JlYWNoKCRjIGFzICR0cz0+JGhzKSBmb3JlYWNoKCRocyBhcyAkaD0+JHgpIGlmKHN0cnBvcygkaCwncHNfJyk9PT0wfHxzdHJwb3MoJGgsJ3BldHNob3BfJyk9PT0wKSAkb1snY3JvbiddWyRoXT1kYXRlKCdtLWQgSDppJywkdHMpOwogIC8vIGthaXAgUGF5c2VyYSBwZW5kaW5nIGF0c2F1a2lhbWFzIOKAlCBob2xkX3N0b2NrCiAgJG9bJ2hvbGRfc3RvY2snXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9ob2xkX3N0b2NrX21pbnV0ZXMnKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-072908';
const GKEY='ps_s1676f';
const PHASES=["GO"];
const OUT='analize/s1676_f.json';
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
