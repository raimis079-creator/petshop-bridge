process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYWwg4oCUIFJFQUQtT05MWTogc3RydWt0xatyaW5pYWkgNDA0ICsgdGlrc2zFq3MgcHVzbGFwacWzL2thdGVnb3JpasWzIGFkcmVzYWkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY5YWwnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY2OSBhbCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJG1hcD1wZXRzaG9wX2xlZ2FjeV8zMDFfbWFwKCk7ICRoPWFycmF5KCk7ICRyZWY9YXJyYXkoKTsKICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2VsaWFzIHUsIFNVTShoaXRzKSBrLCBTVU0oYm90X2hpdHMpIGIsIE1BWChyZWZlcmVyKSByIEZST00geyRwfXBzX3Nlb180MDQgV0hFUkUgcGFza3V0aW5pc19hdCA+PSAnMjAyNi0wOS0wOScgR1JPVVAgQlkgdSIsQVJSQVlfQSkgYXMgJHIpeyAkaz1zdHJ0b2xvd2VyKHRyaW0ocmF3dXJsZGVjb2RlKChzdHJpbmcpcGFyc2VfdXJsKCRyWyd1J10sUEhQX1VSTF9QQVRIKSksJy8nKSk7IGlmKCRrPT09JycpIGNvbnRpbnVlOyAkaFska109KCRoWyRrXT8/MCkrKGludCkkclsnayddOyAkcmVmWyRrXT1hcnJheSgoaW50KSRyWydiJ10sbWJfc3Vic3RyKChzdHJpbmcpJHJbJ3InXSwwLDUwKSk7IH0KICAgIGZvcmVhY2goJGggYXMgJGs9PiRjKXsKICAgICAgaWYoaXNzZXQoJG1hcFska10pKSBjb250aW51ZTsKICAgICAgaWYocHJlZ19tYXRjaCgnIyhefC8pKFwufHdwLXxhZG1pbnxsdC9hZG1pbnxpbWFnZS98Y2F0YWxvZy98X3Byb2ZpbGVyfF9lbnZpcm9ubWVudHxmY2tlZGl0b3J8c3RhdGljL3xhc3NldHMvfG9wZW58dmVuZG9yfGNnaXxhcGkvfGJhY2t1cHxkZWJ1Z3xjb25maWd8c2VydmVyLXN0YXR1c3xcLmdpdCl8XC4ocGhwfGh0bWw/fGpwZ3xqcGVnfHBuZ3xnaWZ8anN8Y3NzfHR4dHx4bWx8aWNvfGpzb258eW1sfHNxbHx6aXB8bG9nfGJhaykkIycsJGspKSBjb250aW51ZTsKICAgICAgaWYoc3Vic3RyX2NvdW50KGJhc2VuYW1lKCRrKSwnLScpPjMpIGNvbnRpbnVlOwogICAgICAkb1sncyddWyRrXT1hcnJheSgkYywkcmVmWyRrXVswXT8/MCwkcmVmWyRrXVsxXT8/JycpOwogICAgfQogICAgaWYoIWVtcHR5KCRvWydzJ10pKSB1YXNvcnQoJG9bJ3MnXSxmdW5jdGlvbigkYSwkYil7cmV0dXJuICRiWzBdPD0+JGFbMF07fSk7CiAgICAkb1sncyddPWFycmF5X3NsaWNlKCRvWydzJ10/P2FycmF5KCksMCw2MCx0cnVlKTsKICAgIGZvcmVhY2goYXJyYXkoJ2tvbnRha3RhaScsJ3BhcmR1b3R1dmUnLCdha2Npam9zJywncGFzaXVseW1haScsJ3Bhc2t5cmEnLCdzbGFwdWt1LXBvbGl0aWthJywncHJpdmF0dW1vLXBvbGl0aWthJywnamF1dHJ1cy12aXJza2luaW1hcycsJ3N0ZXJpbGl6dW90YXMtYXVnaW50aW5pcycsJ3NwcmVuZGltYWknLCdkYXVnaWF1LXBpZ2lhdScsJ2FwaWUtbXVzJywncHJpc3RhdHltYXMnLCdncmF6aW5pbWFzJywnZHVrJywncHJpZXppdXJvcy1wcmllbW9uZXMtc3VuaW1zJykgYXMgJHMpeyAkcGc9Z2V0X3BhZ2VfYnlfcGF0aCgkcyk7IGlmKCEkcGcpeyAkaWQ9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3BhZ2UnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfbmFtZT0lcyBMSU1JVCAxIiwkcykpOyAkcGc9JGlkP2dldF9wb3N0KCRpZCk6bnVsbDsgfSAkb1sncGFnZXMnXVskc109JHBnP3dwX21ha2VfbGlua19yZWxhdGl2ZShnZXRfcGVybWFsaW5rKCRwZykpOm51bGw7IH0KICAgICRvWydzaG9wJ109d3BfbWFrZV9saW5rX3JlbGF0aXZlKGdldF9wZXJtYWxpbmsod2NfZ2V0X3BhZ2VfaWQoJ3Nob3AnKSkpOyAkb1snYWNjJ109d3BfbWFrZV9saW5rX3JlbGF0aXZlKGdldF9wZXJtYWxpbmsod2NfZ2V0X3BhZ2VfaWQoJ215YWNjb3VudCcpKSk7CiAgICAkb1snZ2FtaW50b2phaSddPWFycmF5KCd0YXgnPT50YXhvbm9teV9leGlzdHMoJ2dhbWludG9qYXMnKXx8dGF4b25vbXlfZXhpc3RzKCdwYV9nYW1pbnRvamFzJyl8fHRheG9ub215X2V4aXN0cygncHJvZHVjdF9icmFuZCcpLCAnYXJjaCc9Pm51bGwpOwogICAgZm9yZWFjaChhcnJheSgnenV2aW1zJywnc3VuaW1zJywna2F0ZW1zJywnZ3JhdXppa2FtcycsJ3BhdWtzY2lhbXMnLCdzdW5pbXMvcHJpZXppdXJvcy1wcmllbW9uZXMtc3VuaW1zJykgYXMgJGMpeyAkdD1nZXRfdGVybV9ieSgnc2x1ZycsYmFzZW5hbWUoJGMpLCdwcm9kdWN0X2NhdCcpOyAkb1snY2F0J11bJGNdPSR0P2FycmF5KCR0LT50ZXJtX2lkLHdwX21ha2VfbGlua19yZWxhdGl2ZShnZXRfdGVybV9saW5rKCR0KSkpOm51bGw7IH0KICAgICRyPXdwX3JlbW90ZV9oZWFkKGhvbWVfdXJsKCcvZ2FtaW50b2phaS8nKSxhcnJheSgndGltZW91dCc9PjEwLCdyZWRpcmVjdGlvbic9PjApKTsgJG9bJ2dhbWludG9qYWknXVsnaGVhZCddPWlzX3dwX2Vycm9yKCRyKT8wOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-192328';
const GKEY='ps_s1669al';
const PHASES=["A"];
const OUT='analize/s1669_al.json';
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
