process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1biBwbmcuanBlZyBudW90cmF1a3Uga29saXppam9zIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg4NW4nXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE3MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODg1biddOwogIHRyeXsKICAkdXA9d3BfZ2V0X3VwbG9hZF9kaXIoKTsgJGJkPSR1cFsnYmFzZWRpciddOwogICRzej1mdW5jdGlvbigkYWlkKSB1c2UgKCRiZCl7ICRtPXdwX2dldF9hdHRhY2htZW50X21ldGFkYXRhKCRhaWQpOyAkZj1nZXRfYXR0YWNoZWRfZmlsZSgkYWlkKTsgJG89WydmaWxlJz0+JG1bJ2ZpbGUnXT8/bnVsbCwnc2hhJz0+KCRmJiZpc19maWxlKCRmKSk/c3Vic3RyKHNoYTFfZmlsZSgkZiksMCwxMCk6bnVsbCwnbXRpbWUnPT4oJGYmJmlzX2ZpbGUoJGYpKT9kYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGYpKTpudWxsLCdzaXplcyc9PltdXTsKICAgIGlmKCFlbXB0eSgkbVsnc2l6ZXMnXSkpeyAkZGlyPSRiZC4nLycuZGlybmFtZSgkbVsnZmlsZSddKTsgZm9yZWFjaChbJ3RodW1ibmFpbCcsJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCcsJ3dvb2NvbW1lcmNlX3NpbmdsZScsJ21lZGl1bSddIGFzICRrKXsgaWYoIWVtcHR5KCRtWydzaXplcyddWyRrXVsnZmlsZSddKSl7ICRzZj0kZGlyLicvJy4kbVsnc2l6ZXMnXVska11bJ2ZpbGUnXTsgJG9bJ3NpemVzJ11bJGtdPVskbVsnc2l6ZXMnXVska11bJ2ZpbGUnXSxpc19maWxlKCRzZik/c3Vic3RyKHNoYTFfZmlsZSgkc2YpLDAsMTApOidORVJBJyxpc19maWxlKCRzZik/ZGF0ZSgnbS1kIEg6aScsZmlsZW10aW1lKCRzZikpOm51bGxdOyB9IH0gfQogICAgcmV0dXJuICRvOyB9OwogIGZvcmVhY2goWzM4MzgzLDM4Mzg1LDM4Mzg2LDM4Mzg4LDM4Mzg5LDM4MzkxLDM4MzkyXSBhcyAkYSkgJHJbJ2NodXJ1J11bJGFdPSRzeigkYSk7CiAgLy8gc2lhbmRpZW5vcyBOb2JieSBpciBraXRpIFZGICdwbmcnIGF0dGFjaG1lbnRhaQogICRhdHQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYS5JRCwgYS5wb3N0X3BhcmVudCwgYS5wb3N0X2RhdGUsIExFRlQocC5wb3N0X3RpdGxlLDUwKSBwcmVrZSBGUk9NIHskUH1wb3N0cyBhIExFRlQgSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPWEucG9zdF9wYXJlbnQgV0hFUkUgYS5wb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBhLnBvc3RfdGl0bGU9J3BuZycgQU5EIGEucG9zdF9kYXRlPj0nMjAyNi0xMS0xNycgT1JERVIgQlkgYS5JRCIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkYXR0IGFzICYkYSl7ICRhKz0gJHN6KCRhWydJRCddKTsgfSAkclsnbmF1amlfcG5nJ109JGF0dDsKICAkclsncG5nX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdhdHRhY2htZW50JyBBTkQgcG9zdF90aXRsZT0ncG5nJyIpOwogIC8vIHNoYSBkdWJsaWFpIHRhcnAgJ3BuZycgb3JpZ2luYWx1LCBrYWkgc2tpcnRpbmdvcyBwcmVrZXMKICAkYWxsPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGEuSUQsIGEucG9zdF9wYXJlbnQgRlJPTSB7JFB9cG9zdHMgYSBXSEVSRSBhLnBvc3RfdHlwZT0nYXR0YWNobWVudCcgQU5EIGEucG9zdF90aXRsZT0ncG5nJyIsQVJSQVlfQSk7ICRieT1bXTsKICBmb3JlYWNoKCRhbGwgYXMgJHgpeyAkZj1nZXRfYXR0YWNoZWRfZmlsZSgkeFsnSUQnXSk7IGlmKCEkZnx8IWlzX2ZpbGUoJGYpKSBjb250aW51ZTsgJGg9c2hhMV9maWxlKCRmKTsgJGJ5WyRoXVtdPShpbnQpJHhbJ3Bvc3RfcGFyZW50J107IH0KICAkZHVwPVtdOyBmb3JlYWNoKCRieSBhcyAkaD0+JHBzKXsgJHU9YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkcHMpKTsgaWYoY291bnQoJHUpPjEpICRkdXBbXT1bJ3NoYSc9PnN1YnN0cigkaCwwLDEwKSwncHJla2VzJz0+JHVdOyB9ICRyWydkdWJsaWFpX24nXT1jb3VudCgkZHVwKTsgJHJbJ2R1YmxpYWknXT1hcnJheV9zbGljZSgkZHVwLDAsMjUpOwogIGZvcmVhY2goJGR1cCBhcyAkZCl7IGZvcmVhY2goJGRbJ3ByZWtlcyddIGFzICRwaWQpeyBpZigkcGlkKSAkclsnZHVibGl1X3ByZWtlcyddWyRwaWRdPW1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRwaWQpLDAsNjApLicgfCAnLmdldF9wb3N0X3N0YXR1cygkcGlkKS4nIHwgJy5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpOyB9IH0KICBpZighZW1wdHkoJHJbJ2R1YmxpdV9wcmVrZXMnXSkpICRyWydkdWJsaXVfcHJla2VzJ109YXJyYXlfc2xpY2UoJHJbJ2R1YmxpdV9wcmVrZXMnXSwwLDYwLHRydWUpOwogIC8vIFZGIGltcG9ydG8gbnVvdHJhdWt1IG51c3RhdHltYWkKICAkbz0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JFB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTUiKTsgJG9wPSRvP0B1bnNlcmlhbGl6ZSgkbyk6bnVsbDsKICBpZihpc19hcnJheSgkb3ApKXsgZm9yZWFjaCgkb3AgYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnI2ltYWdlfGltZ3xzZWFyY2hfZXhpc3Rpbmd8YXV0b19yZW5hbWV8ZG93bmxvYWQjaScsJGspKSAkclsnaW1wNSddWyRrXT1pc19zY2FsYXIoJHYpP21iX3N1YnN0cigoc3RyaW5nKSR2LDAsMjAwKTptYl9zdWJzdHIoanNvbl9lbmNvZGUoJHYpLDAsMjAwKTsgfSB9CiAgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-102239';
const GKEY='ps_s1885n';
const PHASES=["1"];
const OUT='analize/s1885n.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
