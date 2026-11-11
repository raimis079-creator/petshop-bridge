process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQ5YSBwaWxuaSBaQitWRiBrYXRhbG9nYWkgdnMgV0MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQ5YSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjgwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzE1MzZNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJGY9JF9HRVRbJ3BzX3MxODQ5YSddOyAkcj1bJ3YnPT4nUzE4NDlhJywnZic9PiRmLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogIHRyeXsKICAgICR3Yz1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgc2t1LCBwLklEIGlkLCBwLnBvc3Rfc3RhdHVzIHN0IEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBBTkQgcC5wb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwLnBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnLCdwZW5kaW5nJywncHJpdmF0ZScpIFdIRVJFIG0ubWV0YV9rZXkgSU4oJ19za3UnLCdfemJfc3VwcGxpZXJfc2t1JywnX3ZmX3N1cHBsaWVyX3NrdScpIEFORCBtLm1ldGFfdmFsdWU8PicnIixBUlJBWV9BKSBhcyAkdyl7ICR3Y1tzdHJ0b2xvd2VyKHRyaW0oJHdbJ3NrdSddKSldPVsoaW50KSR3WydpZCddLCR3WydzdCddXTsgfQogICAgJGVhbj1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgZSwgcC5JRCBpZCwgcC5wb3N0X3N0YXR1cyBzdCBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykgV0hFUkUgbS5tZXRhX2tleSBJTignX2VhbicsJ192Zl9iYXJjb2RlJywnX3piX2VhbicsJ19nbG9iYWxfdW5pcXVlX2lkJykgQU5EIG0ubWV0YV92YWx1ZTw+JyciLEFSUkFZX0EpIGFzICR3KXsgJGVhbltsdHJpbSh0cmltKCR3WydlJ10pLCcwJyldPVsoaW50KSR3WydpZCddLCR3WydzdCddXTsgfQogICAgJGhpZD1hcnJheV9mbGlwKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX2Ryb3BzaGlwX3Bhc2xlcHRhJyBBTkQgbWV0YV92YWx1ZTw+JyciKSk7CiAgICAkbWF0Y2g9ZnVuY3Rpb24oJGNvZGUsJGUpIHVzZSgkd2MsJGVhbiwkaGlkKXsgJHc9JHdjW3N0cnRvbG93ZXIodHJpbSgkY29kZSkpXT8/bnVsbDsgaWYoISR3ICYmICRlIT09JycpICR3PSRlYW5bbHRyaW0odHJpbSgkZSksJzAnKV0/P251bGw7IGlmKCEkdykgcmV0dXJuIFswLCcnXTsgcmV0dXJuIFskd1swXSwgJHdbMV09PT0ncHVibGlzaCc/KGlzc2V0KCRoaWRbJHdbMF1dKT8ncGFzbGVwdGEnOidwdWJsaXNoJyk6JHdbMV1dOyB9OwogICAgJG91dD1bXTsKICAgIGlmKCRmPT09J3piJyl7CiAgICAgIC8vIGJsb2thdmltbyBwcmllemFzdHlzIGlzIHp1cm5hbG8gKHBhc2t1dGluZXMgMiBkLikKICAgICAgJGxmPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXByaXZhdGUtbG9ncy96Yi1pbXBvcnQubG9nJzsgJHN6PWZpbGVzaXplKCRsZik7ICRoPWZvcGVuKCRsZiwncicpOyBmc2VlaygkaCxtYXgoMCwkc3otODAwMDAwMCkpOyAkdHg9c3RyZWFtX2dldF9jb250ZW50cygkaCk7IGZjbG9zZSgkaCk7CiAgICAgICR3aHk9W107IGZvcmVhY2goZXhwbG9kZSgiXG4iLCR0eCkgYXMgJGxuKXsgaWYoc3RycG9zKCRsbiwnWkItQkxPQ0stQ1JFQVRFJyk9PT1mYWxzZSkgY29udGludWU7IGlmKHByZWdfbWF0Y2goJy9uYW1lPSguKj8pIFx8LipyZWFzb249KFx3KykvJywkbG4sJG0pKSAkd2h5W21iX3N1YnN0cih0cmltKCRtWzFdKSwwLDQwKV09JG1bMl07IH0KICAgICAgJHBhdGg9JHdwZGItPmdldF92YXIoIlNFTEVDVCBwYXRoIEZST00geyRQfXBteGlfaW1wb3J0cyBXSEVSRSBpZD0yIik7ICRyZXM9d3BfcmVtb3RlX2dldCgkcGF0aCxbJ3RpbWVvdXQnPT4xMjBdKTsgaWYoaXNfd3BfZXJyb3IoJHJlcykpIHRocm93IG5ldyBFeGNlcHRpb24oJHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKSk7CiAgICAgICR4PXNpbXBsZXhtbF9sb2FkX3N0cmluZyh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzKSwnU2ltcGxlWE1MRWxlbWVudCcsTElCWE1MX05PQ0RBVEEpOyBpZighJHgpIHRocm93IG5ldyBFeGNlcHRpb24oJ3htbCcpOwogICAgICBmb3JlYWNoKCR4LT5pdGVtcy0+aXRlbSBhcyAkaXQpeyAkY29kZT10cmltKChzdHJpbmcpJGl0LT5jb2RlKTsgJGU9dHJpbSgoc3RyaW5nKSRpdC0+ZWFuKTsgWyRpZCwkc3RdPSRtYXRjaCgkY29kZSwkZSk7ICRubT10cmltKChzdHJpbmcpJGl0LT5uYW1lKTsKICAgICAgICAkb3V0W109WyRjb2RlLG1iX3N1YnN0cigkbm0sMCwxMTApLHRyaW0oKHN0cmluZykkaXQtPmJyYW5kKSx0cmltKChzdHJpbmcpJGl0LT5jYXRlZ29yeSkscm91bmQoKGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsKHN0cmluZykkaXQtPnByaWNlKSwyKSwoZmxvYXQpJGl0LT5ycnAsKGludCkkaXQtPnF0eSwkZSwoc3RyaW5nKSgkaXQtPmltYWdlcy0+aW1hZ2VbMF0/PycnKSwkaWQsJHN0LCRpZD8nJzooJHdoeVttYl9zdWJzdHIoJG5tLDAsNDApXT8/JycpXTsgfQogICAgfQogICAgaWYoJGY9PT0ndmYnKXsKICAgICAgJGZwPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXZmLWNhY2hlLnhtbCc7ICR4PXNpbXBsZXhtbF9sb2FkX2ZpbGUoJGZwLCdTaW1wbGVYTUxFbGVtZW50JyxMSUJYTUxfTk9DREFUQSk7IGlmKCEkeCkgdGhyb3cgbmV3IEV4Y2VwdGlvbigndmYgeG1sJyk7CiAgICAgICRyb3dzPSR4LT54cGF0aCgnLy9yb3cnKTsgJHJbJ3ZmX2tleXMnXT0kcm93cz9hcnJheV9rZXlzKChhcnJheSkkcm93c1swXSk6W107CiAgICAgICRmbj1mdW5jdGlvbl9leGlzdHMoJ3ZmX3Nob3VsZF9pbXBvcnQnKT9uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCd2Zl9zaG91bGRfaW1wb3J0Jyk6bnVsbDsgJHJbJ3ZmX2ZuJ109JGZuP1skZm4tPmdldE51bWJlck9mUGFyYW1ldGVycygpLCRmbi0+Z2V0TnVtYmVyT2ZSZXF1aXJlZFBhcmFtZXRlcnMoKSxhcnJheV9tYXAoZm4oJHApPT4kcC0+Z2V0TmFtZSgpLCRmbi0+Z2V0UGFyYW1ldGVycygpKV06bnVsbDsKICAgICAgZm9yZWFjaCgkcm93cyBhcyAkcm93KXsgJGE9W107IGZvcmVhY2goKGFycmF5KSRyb3cgYXMgJGs9PiR2KSAkYVska109aXNfb2JqZWN0KCR2KT90cmltKChzdHJpbmcpJHYpOihpc19hcnJheSgkdik/Jyc6dHJpbSgoc3RyaW5nKSR2KSk7CiAgICAgICAgJGNvZGU9JGFbJ3NrdV9pZCddPz8nJzsgJGU9JGFbJ2JhcmNvZGUnXT8/Jyc7IFskaWQsJHN0XT0kbWF0Y2goJGNvZGUsJGUpOyAkd2h5PScnOwogICAgICAgIGlmKCEkaWQgJiYgJGZuICYmICRmbi0+Z2V0TnVtYmVyT2ZSZXF1aXJlZFBhcmFtZXRlcnMoKT09MSl7IHRyeXsgJHJlcz12Zl9zaG91bGRfaW1wb3J0KCRhKTsgJHdoeT1pc19hcnJheSgkcmVzKT8oKCRyZXNbJ2ltcG9ydCddPz8kcmVzWzBdPz90cnVlKT8nJzooJHJlc1sncmVhc29uJ10/PyRyZXNbMV0/PydibG9rJykpOihpc19zdHJpbmcoJHJlcyk/JHJlczooJHJlcz8nJzonYmxvaycpKTsgfWNhdGNoKFRocm93YWJsZSAkZTIpeyAkd2h5PSc/JzsgfSB9CiAgICAgICAgJGltZz0nJzsgZm9yZWFjaChbJ2ltYWdlJywnaW1hZ2VfdXJsJywnaW1nJywncGljdHVyZScsJ2ltYWdlcyddIGFzICRpaykgaWYoIWVtcHR5KCRhWyRpa10pKXsgJGltZz0kYVskaWtdOyBicmVhazsgfQogICAgICAgICRvdXRbXT1bJGNvZGUsbWJfc3Vic3RyKCRhWydwcm9kdWN0X25hbWUnXT8/JycsMCwxMTApLCRhWydicmFuZCddPz8oJGFbJ21hbnVmYWN0dXJlciddPz8nJyksJGFbJ2NhdGVnb3J5J10/PygkYVsnY2F0ZWdvcnlfbmFtZSddPz8nJykscm91bmQoKGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsJGFbJ2Jhc2VfcHJpY2UnXT8/MCksMiksMCwoaW50KSgkYVsncXR5J10/PzApLCRlLCRpbWcsJGlkLCRzdCwkd2h5XTsgfQogICAgfQogICAgJHJbJ24nXT1jb3VudCgkb3V0KTsgJHJbJ2NvbHMnXT0nY29kZSxuYW1lLGJyYW5kLGNhdCxjb3N0LHJycCxxdHksZWFuLGltZyx3Y19pZCx3Y19zdCx3aHknOyAkclsncCddPSRvdXQ7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-164734';
const GKEY='ps_s1849a';
const PHASES=["zb", "vf"];
const OUT='analize/s1849_a.json';
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
