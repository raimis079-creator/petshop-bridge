process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxdzogcGFydW9zdHUgcmlua2luaXUgbnVvdHJhdWtvcy4gMSBkcnkgKGtvbXBvemljaWphKCkgbG9naWthICsgcGxhbmFzKSwgMiBhdHN0YXR5dGkgdGh1bWIgKDUpICsgcGVycGllc3RpICg0KSwgOSBhdHN0YXR5dGkgKG51aW10aSB0aHVtYiB0aWsgNCBuYXVqaWVtcykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzIxdyddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3MjF3J107ICRyPVsndic9PidTMTcyMXcnLCdmYXplJz0+JGZdOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOwogICRTVV9BVFQ9WzM1MzkyPT4zNTM5MywzNTM5Nj0+MzUzOTcsMzU0MDQ9PjM1NDA1LDM1NDA2PT4zNTQwNywzNTQwOD0+MzU0MDldOyAkQkVfQVRUPVszNTA3MCwzNTA3NiwzNTA3OSwzNTA4NV07ICRCQUs9J3BzX3MxNzIxX3JpbmtfZm90b19iYWsnOwogIHRyeXsKICAgIGlmKCRmPT09JzEnKXsKICAgICAgJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yaW5raW5pYWkucGhwJyk7CiAgICAgICRwPXN0cnBvcygkcywncHJpdmF0ZSBzdGF0aWMgZnVuY3Rpb24ga29tcG96aWNpamEoJyk7ICRyWydrb21wb3ppY2lqYV9oZWFkJ109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkcywkcCwxNTAwKSk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCcvLnswLDIyMH0oPzpzZXRfaW1hZ2VfaWR8c2V0X3Bvc3RfdGh1bWJuYWlsfGRlbGV0ZV9wb3N0X21ldGFcKFteKV0qdGh1bWJuYWlsfGltYWdlX2lkKVxiLnswLDE2MH0vJywkcywkbSk7ICRyWydpbWFnZV92aWV0b3MnXT1hcnJheV9zbGljZShhcnJheV9tYXAoZm4oJHgpPT5wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHgpLCRtWzBdKSwwLDEyKTsKICAgICAgJHAyPXN0cnBvcygkcywncHJpdmF0ZSBzdGF0aWMgZnVuY3Rpb24gaXN2YWx5dGlfcGVkc2FrdXMoJyk7ICRyWydpc3ZhbHl0aV9oZWFkJ109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkcywkcDIsOTAwKSk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCcvLnswLDMwMH1pc3ZhbHl0aV9wZWRzYWt1c1woLnswLDEwMH0vJywkcywkbTIpOyAkclsnaXN2YWx5dGlfa3ZpZXRpbWFpJ109YXJyYXlfbWFwKGZuKCR4KT0+cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KSwkbTJbMF0pOwogICAgICAkclsnbW5tX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyR3cGRiLT5wcmVmaXh9d2NfbW5tX2NoaWxkX2l0ZW1zIik7CiAgICAgIGZvcmVhY2goJFNVX0FUVCBhcyAkcGlkPT4kYXR0KXsgJHJbJ3N1X2F0dCddWyRwaWRdPVsnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJHBpZCksJ3RodW1iJz0+KGludClnZXRfcG9zdF90aHVtYm5haWxfaWQoJHBpZCksJ2F0dF9zdCc9PmdldF9wb3N0X3N0YXR1cygkYXR0KSwnYXR0X3BhcmVudCc9PihpbnQpZ2V0X3Bvc3RfZmllbGQoJ3Bvc3RfcGFyZW50JywkYXR0KSwnZmFpbGFzJz0+ZmlsZV9leGlzdHMoZ2V0X2F0dGFjaGVkX2ZpbGUoJGF0dCkpPyd5cmEnOidORVJBJ107IH0KICAgICAgZm9yZWFjaCgkQkVfQVRUIGFzICRwaWQpeyAkclsnYmVfYXR0J11bJHBpZF09WydzdCc9PmdldF9wb3N0X3N0YXR1cygkcGlkKSwndGh1bWInPT4oaW50KWdldF9wb3N0X3RodW1ibmFpbF9pZCgkcGlkKSwnaGFzaCc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3Jpbmtfa29tcF9oYXNoJyx0cnVlKSwndmFpa2FpJz0+JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00geyR3cGRiLT5wcmVmaXh9d2NfbW5tX2NoaWxkX2l0ZW1zIFdIRVJFIGNvbnRhaW5lcl9pZD0lZCIsJHBpZCkpLCdraWVraWFpJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcGV0c2hvcF9jb21wb25lbnRfcXVhbnRpdGllcycsdHJ1ZSldOyB9CiAgICB9CiAgICBpZigkZj09PScyJyl7CiAgICAgICRiYWs9Z2V0X29wdGlvbigkQkFLKTsgaWYoIWlzX2FycmF5KCRiYWspKSAkYmFrPVtdOwogICAgICBmb3JlYWNoKCRTVV9BVFQgYXMgJHBpZD0+JGF0dCl7IGlmKGdldF9wb3N0X3RodW1ibmFpbF9pZCgkcGlkKSkgeyAkclsnc3VfYXR0J11bJHBpZF09J2phdSB0dXJpJzsgY29udGludWU7IH0gaWYoZ2V0X3Bvc3Rfc3RhdHVzKCRhdHQpIT09J2luaGVyaXQnfHwhZmlsZV9leGlzdHMoZ2V0X2F0dGFjaGVkX2ZpbGUoJGF0dCkpKXsgJHJbJ3N1X2F0dCddWyRwaWRdPSdhdHQgYmxvZ2FzJzsgY29udGludWU7IH0KICAgICAgICAkYmFrWyhzdHJpbmcpJHBpZF09MDsgJG9rPXNldF9wb3N0X3RodW1ibmFpbCgkcGlkLCRhdHQpOyAkclsnc3VfYXR0J11bJHBpZF09JG9rPyd0aHVtYj0nLiRhdHQ6J05FUEFWWUtPJzsgfQogICAgICAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmlua2luaWFpJywna29tcG96aWNpamEnKTsgJHJtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICBmb3JlYWNoKCRCRV9BVFQgYXMgJHBpZCl7IGlmKGdldF9wb3N0X3RodW1ibmFpbF9pZCgkcGlkKSl7ICRyWydiZV9hdHQnXVskcGlkXT0namF1IHR1cmknOyBjb250aW51ZTsgfSAkdmFpa2FpPWFycmF5X21hcCgnaW50dmFsJywkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSB7JHdwZGItPnByZWZpeH13Y19tbm1fY2hpbGRfaXRlbXMgV0hFUkUgY29udGFpbmVyX2lkPSVkIiwkcGlkKSkpOyBpZighJHZhaWthaSl7ICRyWydiZV9hdHQnXVskcGlkXT0nYmUgdmFpa3UnOyBjb250aW51ZTsgfQogICAgICAgICRiYWtbKHN0cmluZykkcGlkXT0wOyAkdDA9bWljcm90aW1lKHRydWUpOyAkcmVzPSRybS0+aW52b2tlKG51bGwsJHBpZCwkdmFpa2FpLHRydWUpOyAkclsnYmVfYXR0J11bJHBpZF09WydyZXonPT5pc19zY2FsYXIoJHJlcyk/JHJlczpqc29uX2VuY29kZSgkcmVzLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLCd0aHVtYic9PihpbnQpZ2V0X3Bvc3RfdGh1bWJuYWlsX2lkKCRwaWQpLCdzZWsnPT5yb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQwLDEpXTsgfQogICAgICB1cGRhdGVfb3B0aW9uKCRCQUssJGJhayxmYWxzZSk7CiAgICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9DYWNoZScpKXsgZm9yZWFjaChhcnJheV9tZXJnZShhcnJheV9rZXlzKCRTVV9BVFQpLCRCRV9BVFQpIGFzICRwaWQpIFBldHNob3BfQ2FjaGU6OnByZWtlX2lkKCRwaWQpOyB9CiAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSl7IHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7ICRyWydzdXBlcmNhY2hlJ109J2lzdmFseXRhcyc7IH0KICAgIH0KICAgIGlmKCRmPT09JzMnKXsgJHVhPVsndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTcyMScsJ2Nvb2tpZXMnPT5bJ3BzX2pzJz0+JzEnXV07ICR0PWdldF90ZXJtX2J5KCdzbHVnJywncmlua2luaWFpJywncHJvZHVjdF9jYXQnKTsgJHJzPXdwX3JlbW90ZV9nZXQoZ2V0X3Rlcm1fbGluaygkdCkuJz9wc193PScudGltZSgpLCR1YSk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRycyk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCcvY2xhc3M9InByb2R1Y3Qtc21hbGwgY29sW14iXSpcYnBvc3QtKFxkKylcYi4qPzxkaXYgY2xhc3M9ImJveC1pbWFnZSI+Lio/PGltZ1tePl0qXHNzcmM9IihbXiJdKykiL3MnLCRoLCRtLFBSRUdfU0VUX09SREVSKTsgZm9yZWFjaCgkbSBhcyAkeCl7ICRyWydjYXJkcyddWyhpbnQpJHhbMV1dPWJhc2VuYW1lKCR4WzJdKTsgfSAkclsncGxhY2Vob2xkZXInXT1jb3VudChhcnJheV9maWx0ZXIoJHJbJ2NhcmRzJ10/P1tdLGZuKCR2KT0+c3RycG9zKCR2LCdwbGFjZWhvbGRlcicpIT09ZmFsc2UpKTsgfQogICAgaWYoJGY9PT0nOScpeyAkYmFrPWdldF9vcHRpb24oJEJBSyk7IGZvcmVhY2goKGFycmF5KSRiYWsgYXMgJHBpZD0+JHYpeyBkZWxldGVfcG9zdF90aHVtYm5haWwoKGludCkkcGlkKTsgfSAkclsnbnVpbXRhJ109Y291bnQoKGFycmF5KSRiYWspOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-163928';
const GKEY='ps_s1721w';
const PHASES=["1"];
const OUT='analize/s1721w1.json';
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
