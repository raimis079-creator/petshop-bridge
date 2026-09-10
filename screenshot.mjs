process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYWkg4oCUIFJFQUQtT05MWTogNDA0IGtlbGlhaSAoYmVhY29uICsgcHNfc2VvXzQwNCkg4oaSIGdhbGltaSB0xbMgcGHEjWnFsyBwcmVracWzIGF0aXRpa21lbnlzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OWFpJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2NjkgYWknKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRvWydzZW9fc3R1bHAnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3Nlb180MDQiKTsKICAgICRjPSRvWydzZW9fc3R1bHAnXTsgJHVjPW51bGw7ICRkYz1udWxsOyAka2M9bnVsbDsgZm9yZWFjaCgkYyBhcyAkeCl7IGlmKCEkdWMgJiYgcHJlZ19tYXRjaCgnL3VybHxrZWxpYXN8cGF0aHx1cmkvaScsJHgpKSAkdWM9JHg7IGlmKCEkZGMgJiYgcHJlZ19tYXRjaCgnL3Bhc2t8bGFzdHxsYWlrYXN8ZGF0ZXxfYXQkL2knLCR4KSkgJGRjPSR4OyBpZighJGtjICYmIHByZWdfbWF0Y2goJy9raWVrfGhpdHN8Y291bnR8a2FydGFpL2knLCR4KSkgJGtjPSR4OyB9CiAgICAkb1snc2VvX2NvbHMnXT1hcnJheSgkdWMsJGRjLCRrYyk7CiAgICAka2VsaWFpPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHVybF9rZWxpYXMgdSwgQ09VTlQoRElTVElOQ1QgZGllbmEsbGFua3l0b2phc19kKSBsIEZST00geyRwfXBzX3dlYl9pdnlraWFpIFdIRVJFIHRpcGFzPSdlcnJvcjQwNCcgQU5EIHNhbHRpbmlzX2FwbGlua2E9J3Byb2QnIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIHUiLEFSUkFZX0EpIGFzICRyKXsgJGs9c3RydG9sb3dlcih0cmltKHJhd3VybGRlY29kZSgoc3RyaW5nKXBhcnNlX3VybCgkclsndSddLFBIUF9VUkxfUEFUSCkpLCcvJykpOyAka2VsaWFpWyRrXVsnd2ViJ109KCRrZWxpYWlbJGtdWyd3ZWInXT8/MCkrJHJbJ2wnXTsgfQogICAgaWYoJHVjKXsgJHE9IlNFTEVDVCAkdWMgdSIuKCRrYz8iLCBTVU0oJGtjKSBrIjoiLCBDT1VOVCgqKSBrIikuIiBGUk9NIHskcH1wc19zZW9fNDA0Ii4oJGRjPyIgV0hFUkUgJGRjID49ICcyMDI2LTA5LTA5JyI6IiIpLiIgR1JPVVAgQlkgdSBPUkRFUiBCWSBrIERFU0MgTElNSVQgNDAwIjsKICAgICAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoJHEsQVJSQVlfQSkgYXMgJHIpeyAkaz1zdHJ0b2xvd2VyKHRyaW0ocmF3dXJsZGVjb2RlKChzdHJpbmcpcGFyc2VfdXJsKCRyWyd1J10sUEhQX1VSTF9QQVRIKSksJy8nKSk7IGlmKCRrPT09JycpIGNvbnRpbnVlOyAka2VsaWFpWyRrXVsnc3J2J109KCRrZWxpYWlbJGtdWydzcnYnXT8/MCkrKGludCkkclsnayddOyB9IH0KICAgICRvWydrZWxpdSddPWNvdW50KCRrZWxpYWkpOwogICAgJG1hcD1wZXRzaG9wX2xlZ2FjeV8zMDFfbWFwKCk7CiAgICAkcHJvZHM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsIHBvc3RfbmFtZSwgcG9zdF9zdGF0dXMgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykiLEFSUkFZX0EpOwogICAgJG5vcm09ZnVuY3Rpb24oJHMpeyAkcz1zdHJ0b2xvd2VyKCRzKTsgJHM9c3RyX3JlcGxhY2UoYXJyYXkoJ3NjYXJvbicsJ2NjYXJvbicsJ3pjYXJvbicsJ3VvZ29uJywnYW9nb24nLCdlb2dvbicsJ2Vkb3QnLCdpb2dvbicsJ3VtYWNyJyksYXJyYXkoJ3MnLCdjJywneicsJ3UnLCdhJywnZScsJ2UnLCdpJywndScpLCRzKTsgJHM9cHJlZ19yZXBsYWNlKCcvLVxkezQsNn0tXGQkLycsJycsJHMpOyByZXR1cm4gJHM7IH07CiAgICAkc2tpcD0nI14od3AtfGFkbWlufGx0L2FkbWlufGltYWdlL3xjYXRhbG9nL3xpbmRleFwucGhwfHhtbHJwY3xcLndlbGwta25vd258Y2dpLWJpbnx2ZW5kb3J8XC5lbnZ8ZmVlZC8pIyc7CiAgICBmb3JlYWNoKCRrZWxpYWkgYXMgJGs9PiR4KXsKICAgICAgJGU9YXJyYXkoJ2tlbGlhcyc9PiRrLCd3ZWInPT4keFsnd2ViJ10/PzAsJ3Nydic9PiR4WydzcnYnXT8/MCwnbWFwJz0+aXNzZXQoJG1hcFska10pKTsKICAgICAgaWYocHJlZ19tYXRjaCgkc2tpcCwkaykgfHwgc3RycG9zKCRrLCcucGhwJykhPT1mYWxzZSB8fCBwcmVnX21hdGNoKCcvXC4oanBnfHBuZ3xnaWZ8anN8Y3NzfHR4dHx4bWx8aWNvKSQvJywkaykpeyAkZVsndGlwYXMnXT0ndGVjaG5pbic7ICRvWydyJ11bXT0kZTsgY29udGludWU7IH0KICAgICAgJHNsdWc9YmFzZW5hbWUoJGspOyAkbnM9JG5vcm0oJHNsdWcpOyAkYmVzdD1hcnJheSgpOwogICAgICBmb3JlYWNoKCRwcm9kcyBhcyAkcHIpeyAkcG49JHByWydwb3N0X25hbWUnXTsgaWYoYWJzKHN0cmxlbigkcG4pLXN0cmxlbigkbnMpKT40MCkgY29udGludWU7IHNpbWlsYXJfdGV4dCgkbnMsJHBuLCRwYyk7IGlmKCRwYz49NzApICRiZXN0W109YXJyYXkocm91bmQoJHBjLDEpLChpbnQpJHByWydJRCddLCRwbiwkcHJbJ3Bvc3Rfc3RhdHVzJ10pOyB9CiAgICAgIHVzb3J0KCRiZXN0LGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbMF08PT4kYVswXTt9KTsgJGJlc3Q9YXJyYXlfc2xpY2UoJGJlc3QsMCwyKTsKICAgICAgZm9yZWFjaCgkYmVzdCBhcyAmJGIpeyAkcHA9d2NfZ2V0X3Byb2R1Y3QoJGJbMV0pOyAkYltdPSRwcD8kcHAtPmdldF9zdG9ja19zdGF0dXMoKTonPyc7ICRiW109JHBwP21iX3N1YnN0cigkcHAtPmdldF9uYW1lKCksMCw4MCk6Jyc7IH0KICAgICAgJGVbJ2thbmQnXT0kYmVzdDsgJG9bJ3InXVtdPSRlOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-190148';
const GKEY='ps_s1669ai';
const PHASES=["A"];
const OUT='analize/s1669_ai.json';
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
