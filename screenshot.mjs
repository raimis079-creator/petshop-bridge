process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY1IGthbmFwaXUvQ0JEIHNrZW5hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjUnXSkpIHJldHVybjsKICBAc2V0X3RpbWVfbGltaXQoMjgwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NjUnLCdmYXplJz0+JF9HRVRbJ3BzX3MxODY1J11dOyAkVDA9bWljcm90aW1lKHRydWUpOwogIHRyeXsKICAkUkU9Jy8oa2FuYXB8aGVtcHxjYW5uYWJpc3xjYmR8a2FuYWJpZCkvaXUnOwogICRURVJNUz1bJ2thbmFwJywnaGVtcCcsJ2Nhbm5hYmlzJywnY2JkJywna2FuYWJpZCddOwogICRsaz1mdW5jdGlvbigkYykgdXNlKCRURVJNUyl7IHJldHVybiAnKCcuaW1wbG9kZSgnIE9SICcsYXJyYXlfbWFwKGZuKCR0KT0+IiRjIExJS0UgJyUkdCUnIiwkVEVSTVMpKS4nKSc7IH07CiAgJFc9InAucG9zdF90eXBlIElOKCdwcm9kdWN0JywncHJvZHVjdF92YXJpYXRpb24nKSBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScsJ3BlbmRpbmcnLCdmdXR1cmUnKSI7CiAgJHJvd3M9W107CiAgZm9yZWFjaChbJ3Bvc3RfdGl0bGUnLCdwb3N0X2V4Y2VycHQnLCdwb3N0X2NvbnRlbnQnXSBhcyAkZil7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3BhcmVudCxwLnBvc3RfdHlwZSxwLnBvc3Rfc3RhdHVzLHAucG9zdF90aXRsZSxwLiRmIHR4dCBGUk9NIHskUH1wb3N0cyBwIFdIRVJFICRXIEFORCAiLiRsaygicC4kZiIpLEFSUkFZX0EpIGFzICR4KSAkcm93c1tdPVskeCwkZiwkeFsndHh0J11dOwogIH0KICAvLyBtZXRhOiB0aWVzaW9naW5pcyBMSUtFICsgYXByYcWheW3Fsy9zdWTEl3RpZXMgbGF1a2FpIChnYWxpbWFpIGJhc2U2NCkgZGVrb2R1b2phbWkgUEhQCiAgJHNraXA9Jy9eKF9lZGl0X2xvY2t8X2VkaXRfbGFzdHxfd3Bfb2xkX3NsdWd8X3Byb2R1Y3RfaW1hZ2VfZ2FsbGVyeXxfdGh1bWJuYWlsX2lkfF93cF9hdHRhY2hlZF9maWxlKSQvJzsKICAkbXE9IlNFTEVDVCBwLklELHAucG9zdF9wYXJlbnQscC5wb3N0X3R5cGUscC5wb3N0X3N0YXR1cyxwLnBvc3RfdGl0bGUsbS5tZXRhX2tleSxtLm1ldGFfdmFsdWUgdHh0IEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBXSEVSRSAkVyBBTkQgKCIuJGxrKCdtLm1ldGFfdmFsdWUnKS4iIE9SIG0ubWV0YV9rZXkgUkVHRVhQICdkZXNjfGFwcmFzfHN1ZGV0fGNvbXBvc3xpbmdyZWR8YjY0fHNhc3RhdnxhbmFsaXR8ZmVlZHx4bWwnKSI7CiAgJG1ldGE9JHdwZGItPmdldF9yZXN1bHRzKCRtcSxBUlJBWV9BKTsgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWydTUUxfRVJSJ11bXT0kd3BkYi0+bGFzdF9lcnJvcjsKICAkclsnbWV0YV9laWx1Y2l1X3Rpa3JpbnRhJ109Y291bnQoJG1ldGEpOyAka2V5cz1bXTsKICBmb3JlYWNoKCRtZXRhIGFzICR4KXsgaWYocHJlZ19tYXRjaCgkc2tpcCwkeFsnbWV0YV9rZXknXSkpIGNvbnRpbnVlOyAkdD0oc3RyaW5nKSR4Wyd0eHQnXTsgJGRlYz1mYWxzZTsKICAgIGlmKHByZWdfbWF0Y2goJ35eW0EtWmEtejAtOSsvPVxzXXs0MCx9JH4nLCR0KSl7ICRkPWJhc2U2NF9kZWNvZGUoJHQsdHJ1ZSk7IGlmKCRkIT09ZmFsc2UgJiYgbWJfY2hlY2tfZW5jb2RpbmcoJGQsJ1VURi04JykpeyAkdD0kZDsgJGRlYz10cnVlOyB9IGVsc2UgY29udGludWU7IH0KICAgIGlmKGlzX3NlcmlhbGl6ZWQoJHQpKXsgJHU9bWF5YmVfdW5zZXJpYWxpemUoJHQpOyAkdD1pc19zY2FsYXIoJHUpPyhzdHJpbmcpJHU6d3BfanNvbl9lbmNvZGUoJHUsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IH0KICAgIGlmKCFwcmVnX21hdGNoKCRSRSwkdCkpIGNvbnRpbnVlOyAka2V5c1skeFsnbWV0YV9rZXknXV09KCRrZXlzWyR4WydtZXRhX2tleSddXT8/MCkrMTsKICAgICRyb3dzW109WyR4LCdtZXRhOicuJHhbJ21ldGFfa2V5J10uKCRkZWM/JyAoYmFzZTY0KSc6JycpLCR0XTsgfQogICRyWydtZXRhX3Jha3RhaV9zdV9yYWRpbmlhaXMnXT0ka2V5czsKICAkZm9ybWE9ZnVuY3Rpb24oJHMpeyAkcz1tYl9zdHJ0b2xvd2VyKCRzKTsgJGY9W107CiAgICBpZihwcmVnX21hdGNoKCcvY2JkfGthbmFiaWR8Y2FubmFiaWR8ZWtzdHJha3R8ZXh0cmFjdC91JywkcykpICRmW109J2Vrc3RyYWt0YXMvQ0JEJzsKICAgIGlmKHByZWdfbWF0Y2goJy9hbGllanxcYm9pbHzDtmwvdScsJHMpKSAkZltdPSdhbGllanVzJzsKICAgIGlmKHByZWdfbWF0Y2goJy9zxJdrbHxzZWtsfHNlZWR8c2FtZW58bmFzaW9uL3UnLCRzKSkgJGZbXT0nc8SXa2xvcyc7CiAgICBpZihwcmVnX21hdGNoKCcvcGx1b8WhdHxwbHVvc3R8ZmlifGJhbHR5bXxwcm90ZWlufG1pbHR8xb5pZWR8bGFwW2HFs10vdScsJHMpKSAkZltdPSdwbHVvxaF0aW7ElyBrYW5hcMSXJzsKICAgIHJldHVybiAkZj86WyduZWFpxaFrdSddOyB9OwogICRvdXQ9W107CiAgZm9yZWFjaCgkcm93cyBhcyBbJHgsJGxhdWssJHR4dF0pewogICAgJHBsPXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyx3cF9zdHJpcF9hbGxfdGFncyhodG1sX2VudGl0eV9kZWNvZGUoKHN0cmluZykkdHh0LEVOVF9RVU9URVMsJ1VURi04JykpKSk7CiAgICBpZighcHJlZ19tYXRjaF9hbGwoJFJFLCRwbCwkbSxQUkVHX09GRlNFVF9DQVBUVVJFKSkgY29udGludWU7CiAgICAkY2l0PVtdOyAkcHJldj0tOTk5OwogICAgZm9yZWFjaCgkbVswXSBhcyBbJGhpdCwkb2ZmXSl7ICRjcD1tYl9zdHJsZW4oc3Vic3RyKCRwbCwwLCRvZmYpKTsgaWYoJGNwLSRwcmV2PDYwKSBjb250aW51ZTsgJHByZXY9JGNwOyAkYT1tYXgoMCwkY3AtODApOwogICAgICAkY2l0W109Wyd6Jz0+JGhpdCwnYyc9PigkYT4wPyfigKYnOicnKS5tYl9zdWJzdHIoJHBsLCRhLCgkY3AtJGEpK21iX3N0cmxlbigkaGl0KSs4MCkuKG1iX3N0cmxlbigkcGwpPiRjcCttYl9zdHJsZW4oJGhpdCkrODA/J+KApic6JycpLCdmJz0+JGZvcm1hKG1iX3N1YnN0cigkcGwsbWF4KDAsJGNwLTQwKSw4MCttYl9zdHJsZW4oJGhpdCkpKV07CiAgICAgIGlmKGNvdW50KCRjaXQpPj00KSBicmVhazsgfQogICAgJGlkPShpbnQpJHhbJ0lEJ107ICRwYXI9KGludCkkeFsncG9zdF9wYXJlbnQnXTsgJHNpZD0oJHhbJ3Bvc3RfdHlwZSddPT09J3Byb2R1Y3RfdmFyaWF0aW9uJyYmJHBhcik/JHBhcjokaWQ7CiAgICBpZighaXNzZXQoJG91dFskaWRdKSl7CiAgICAgICRzcmM9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQgSU4oJWQsJWQpIiwkaWQsJHNpZCksQVJSQVlfQSk7CiAgICAgICRvdXRbJGlkXT1bJ2lkJz0+JGlkLCd0ZXZhcyc9PiRwYXI/Om51bGwsJ3RpcGFzJz0+JHhbJ3Bvc3RfdHlwZSddLCdwYXYnPT4keFsncG9zdF90aXRsZSddLCdidXNlbmEnPT4keFsncG9zdF9zdGF0dXMnXSwndGV2b19idXNlbmEnPT4kcGFyP2dldF9wb3N0X3N0YXR1cygkcGFyKTpudWxsLAogICAgICAgICdza3UnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSk/OmdldF9wb3N0X21ldGEoJHNpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwKICAgICAgICAnc291cmNlcyc9PiRzcmMsJ3JhbmthX2lzaW10YSc9PmdldF9wb3N0X21ldGEoJHNpZCwnX3BzX3JhbmthX2lzaW10YScsdHJ1ZSksJ3ZtdnRfaXNpbXRhJz0+Z2V0X3Bvc3RfbWV0YSgkc2lkLCdfcHNfdm12dF9pc2ltdGEnLHRydWUpLCdyYWQnPT5bXV07IH0KICAgICRvdXRbJGlkXVsncmFkJ11bXT1bJ2xhdWthcyc9PiRsYXVrLCdjaXQnPT4kY2l0XTsKICB9CiAgZm9yZWFjaCgkb3V0IGFzICYkbyl7ICRmPVtdOyBmb3JlYWNoKCRvWydyYWQnXSBhcyAkcmQpIGZvcmVhY2goJHJkWydjaXQnXSBhcyAkYykgJGY9YXJyYXlfbWVyZ2UoJGYsJGNbJ2YnXSk7ICRvWydmb3Jtb3MnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRmKSk7IH0gdW5zZXQoJG8pOwogICRyWyduJ109Y291bnQoJG91dCk7ICRyWydwYWdhbF9idXNlbmEnXT1hcnJheV9jb3VudF92YWx1ZXMoYXJyYXlfY29sdW1uKCRvdXQsJ2J1c2VuYScpKTsgJHJbJ3ByZWtlcyddPWFycmF5X3ZhbHVlcygkb3V0KTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkclsndHJ1a21lX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJFQwLDEpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-173138';
const GKEY='ps_s1865';
const PHASES=["1"];
const OUT='analize/s1865_a.json';
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
