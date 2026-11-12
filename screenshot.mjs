process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUyZiDigJQgODUgZzoga2FpbmEgMCw4OSwgc2F2aWthaW5hIDAsNDIsIERQIHBha2FpIDE2LzMyIHBlciBQZXRzaG9wX1JpbmtpbmlhaTo6aXNzYXVnb3RpX2RwICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTg1MiddKT8kX0dFVFsncHNfczE4NTInXTonJyk7IGlmKCRmPT09JycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkQkFTRT1hcnJheSgzODQzMiwzODQzNCwzODQzNiwzODQzOCk7CiAgJFBBSz1hcnJheSgpOyBmb3JlYWNoKCRCQVNFIGFzICRiKXsgJFBBS1tdPWFycmF5KCRiLDE2LCcxMy45MCcpOyAkUEFLW109YXJyYXkoJGIsMzIsJzI0LjkwJyk7IH0KICBpZigkZj09PSdCJyl7CiAgICAkbz1hcnJheSgndic9PidTMTg1MmYtQicpOwogICAgZm9yZWFjaCgkQkFTRSBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcnx8IWdldF9wb3N0X21ldGEoJGlkLCdfcHNfczE4NTJfc3VrdXJ0YScsdHJ1ZSkpeyAkb1skaWRdPSdORSBTMTg1Mic7IGNvbnRpbnVlOyB9CiAgICAgICRwci0+c2V0X3JlZ3VsYXJfcHJpY2UoJzAuODknKTsgJHByLT5zZXRfcHJpY2UoJzAuODknKTsgJHByLT5zYXZlKCk7CiAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsJzAuNDIwMCcpOyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2Vfc291cmNlJywncmFpbWlzXzIwMjYtMTEtMTInKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlX2ltcG9ydGVkX2F0JyxjdXJyZW50X3RpbWUoJ215c3FsJykpOwogICAgICAkd3BkYi0+dXBkYXRlKCRwLidwc19zb3VyY2VzJyxhcnJheSgnY29zdF9uZXQnPT4nMC40MjAwJyksYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kaWQsJ3NvdXJjZSc9PidhdicpKTsKICAgICAgJG9bJGlkXT1hcnJheSgna2FpbmEnPT53Y19nZXRfcHJvZHVjdCgkaWQpLT5nZXRfcHJpY2UoKSwnY29zdCc9PmdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSkpOyB9CiAgICAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9SaW5raW5pYWknLCdpc3NhdWdvdGlfZHAnKTsgJG9bJ3N0YXRpYyddPSRyLT5pc1N0YXRpYygpOyAkb1sncGFyYW1zJ109JHItPmdldE51bWJlck9mUGFyYW1ldGVycygpOwogICAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogIGlmKHByZWdfbWF0Y2goJy9eUChcZCkkLycsJGYsJG0pKXsKICAgICR4PSRQQUtbKGludCkkbVsxXS0xXTsgbGlzdCgkYmlkLCRxdHksJGthaW5hKT0keDsKICAgICRleD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHAucG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBwIEpPSU4geyRwfXBvc3RtZXRhIHEgT04gcS5wb3N0X2lkPXAucG9zdF9pZCBBTkQgcS5tZXRhX2tleT0nX2RwX3BhY2tfcXR5JyBBTkQgcS5tZXRhX3ZhbHVlPSVzIFdIRVJFIHAubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBwLm1ldGFfdmFsdWU9JXMiLChzdHJpbmcpJHF0eSwoc3RyaW5nKSRiaWQpKTsKICAgIGlmKCRleCl7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4nUzE4NTJmLScuJGYsJ2phdSc9PiRleCkpOyBleGl0OyB9CiAgICAkYmF6ZT13Y19nZXRfcHJvZHVjdCgkYmlkKTsKICAgICRwYXY9JHF0eS4nIHZudC4gJy4kYmF6ZS0+Z2V0X25hbWUoKTsKICAgICRhcHI9d3Bfc3RyaXBfYWxsX3RhZ3MoJGJhemUtPmdldF9zaG9ydF9kZXNjcmlwdGlvbigpKTsKICAgICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1JpbmtpbmlhaScsJ2lzc2F1Z290aV9kcCcpOyAkci0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICRhcmdzPWFycmF5KDAsJHBhdiwnJywka2FpbmEsJGFwcixmYWxzZSxhcnJheSgpLGFycmF5KCRiaWQ9PiRxdHkpLG51bGwsYXJyYXkoKSxudWxsKTsKICAgICRyLT5pbnZva2VBcmdzKCRyLT5pc1N0YXRpYygpP251bGw6bmV3IFBldHNob3BfUmlua2luaWFpKCksJGFyZ3MpOyAgLyogcGF0aSBmdW5rY2lqYSBhdHNha28gd3Bfc2VuZF9qc29uICovCiAgICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxODUyZi0nLiRmLCdwYXN0YWJhJz0+J2dyxK/Fvm8gYmUgd3Bfc2VuZF9qc29uJykpOyBleGl0OyB9CiAgaWYoJGY9PT0nQycpewogICAgJG89YXJyYXkoJ3YnPT4nUzE4NTJmLUMnKTsKICAgIGZvcmVhY2goJEJBU0UgYXMgJGIpeyAkaWRzPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgQU5EIG1ldGFfdmFsdWU9JXMiLChzdHJpbmcpJGIpKTsKICAgICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkb1skYl1bXT1hcnJheSgnaWQnPT4kaWQsJ3QnPT5tYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsNDApLCdzdCc9PiRwci0+Z2V0X3N0YXR1cygpLCdxdHknPT5nZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKSwna2FpbmEnPT4kcHItPmdldF9wcmljZSgpLCdjb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksJ3cnPT4kcHItPmdldF93ZWlnaHQoKSwnY2F0Jz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PidpZHMnKSksJ2ltZyc9PiRwci0+Z2V0X2ltYWdlX2lkKCkpOyB9IH0KICAgIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KfSk7Cg==';
const VER='dep-115530';
const GKEY='ps_s1852';
const PHASES=["B"];
const OUT='analize/s1852_f_B.json';
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
