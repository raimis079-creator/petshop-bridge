process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg1IG1va2VqaW1vIHByb2JsZW1hICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmxqJ10pPyRfR0VUWydwc19ibGonXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjg1Jywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJyksJ3V0Yyc9PmdtZGF0ZSgnSDppOnMnKSk7CiAgZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcnMnOwogIHRyeXsKICAgICRvWyd1enNha3ltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdGF0dXMsZGF0ZV9jcmVhdGVkX2dtdCxkYXRlX3VwZGF0ZWRfZ210LHRvdGFsX2Ftb3VudCxwYXltZW50X21ldGhvZCxiaWxsaW5nX2VtYWlsLGN1c3RvbWVyX2lkIEZST00gJHQgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAkb1sncGFnYWxfc3RhdHVzYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxDT1VOVCgqKSBrIEZST00gJHQgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAgIC8vIHBhc3RhYm9zIHZpc2llbXMgc2lhbmRpZW5vcyB1enNha3ltYW1zCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgaWQgRlJPTSAkdCBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD4nMjAyNi0wOS0wOSAwMDowMDowMCciKTsKICAgICRvWydzaWFuZGllbl9pZHMnXT0kaWRzOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7CiAgICAgICRvcmQ9d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkb3JkKSBjb250aW51ZTsKICAgICAgJG49YXJyYXkoKTsKICAgICAgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjMwKSkgYXMgJHgpICRuW109JHgtPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnSDppOnMnKS4nICcuc3Vic3RyKHN0cmlwX3RhZ3MoJHgtPmNvbnRlbnQpLDAsMTUwKTsKICAgICAgJG9bJ3Bhc3RhYm9zJ11bJGlkXT0kbjsKICAgICAgJG9bJ21ldGEnXVskaWRdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSw4MCkgdiBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVwYXlzZXJhJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlcGF5bWVudCUlJyBPUiBtZXRhX2tleSBMSUtFICclJXRyYW5zYWN0aW9uJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlYXZwbiUlJykiLCRpZCksQVJSQVlfQSk7CiAgICB9CiAgICAvLyBQYXlzZXJhIGxvZ2FpCiAgICAkZD1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2MtbG9ncyc7CiAgICBpZihpc19kaXIoJGQpKSBmb3JlYWNoKHNjYW5kaXIoJGQpIGFzICRmKXsKICAgICAgaWYoc3Vic3RyKCRmLC00KSE9PScubG9nJykgY29udGludWU7CiAgICAgIGlmKGZpbGVtdGltZSgkZC4nLycuJGYpPHRpbWUoKS04NjQwMCkgY29udGludWU7CiAgICAgICRvWydsb2d1X2ZhaWxhaSddWyRmXT1hcnJheShmaWxlc2l6ZSgkZC4nLycuJGYpLGRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZC4nLycuJGYpKSk7CiAgICAgIGlmKHByZWdfbWF0Y2goJy9wYXlzZXJhfGZhdGFsfHdjX2xvZ2dlci9pJywkZikpeyAkYz1maWxlX2dldF9jb250ZW50cygkZC4nLycuJGYpOyAkb1snTE9HXycuc3Vic3RyKCRmLDAsMjQpXT1zdWJzdHIoJGMsLTMwMDApOyB9CiAgICB9CiAgICAvLyBQYXlzZXJhIG51c3RhdHltYWkgaXIgY2FsbGJhY2sKICAgICRvWydwYXlzZXJhJ109YXJyYXkoCiAgICAgICdtYWluJz0+Z2V0X29wdGlvbigncGF5c2VyYV9wYXltZW50X21haW5fc2V0dGluZ3MnKSwKICAgICAgJ3N0YXR1cyc9PmdldF9vcHRpb24oJ3BheXNlcmFfcGF5bWVudF9zdGF0dXNfc2V0dGluZ3MnKSwKICAgICAgJ2V4dHJhJz0+Z2V0X29wdGlvbigncGF5c2VyYV9wYXltZW50X2V4dHJhX3NldHRpbmdzJyksCiAgICAgICdnYXRld2F5Jz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfcGF5c2VyYV9zZXR0aW5ncycpLAogICAgKTsKICAgIGlmKGlzc2V0KCRvWydwYXlzZXJhJ11bJ21haW4nXVsncHJvamVjdF9wYXNzd29yZCddKSkgJG9bJ3BheXNlcmEnXVsnbWFpbiddWydwcm9qZWN0X3Bhc3N3b3JkJ109JyhwYXNsxJdwdGEsIGlsZ2lzICcuc3RybGVuKCRvWydwYXlzZXJhJ11bJ21haW4nXVsncHJvamVjdF9wYXNzd29yZCddKS4nKSc7CiAgICAvLyBjYWxsYmFjayBwYXNpZWtpYW11bWFzCiAgICBmb3JlYWNoKGFycmF5KCd3Yy1hcGknPT5ob21lX3VybCgnLz93Yy1hcGk9d2NfZ2F0ZXdheV9wYXlzZXJhJyksJ2NhbGxiYWNrJz0+aG9tZV91cmwoJy8/cGF5c2VyYV9jYWxsYmFjaz0xJykpIGFzICRrPT4kdSl7CiAgICAgICRyPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOwogICAgICAkb1snY2FsbGJhY2snXVska109aXNfd3BfZXJyb3IoJHIpPydFUlInOmFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSxzdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLDAsMTQwKSk7CiAgICB9CiAgICAvLyBzZXNpam9zIC8ga3JlcHNlbGlhaSBzaWFuZGllbgogICAgJG9bJ2NhcnRzX3NpYW5kaWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLExFRlQoc25hcHNob3RfanNvbiw2MCkgc2osY3JlYXRlZF9hdCxjb252ZXJ0ZWRfb3JkZXJfaWQgRlJPTSB7JHdwZGItPnByZWZpeH1wc19jYXJ0cyBXSEVSRSBjcmVhdGVkX2F0PicyMDI2LTA5LTA5IDA2OjAwOjAwJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-100403';
const GKEY='ps_blj';
const PHASES=["R"];
const OUT='analize/s1685_r.json';
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
