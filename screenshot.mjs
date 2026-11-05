process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODMxenggWkIgZmVlZDogVHJpeGllIFhtYXMgLyBwaWdpb3Mgc211bGttZW5vcywga3VyaW9zIE5FaW1wb3J0dW90b3MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODMxengnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCcxMDI0TScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgzMXp4J107CiAgdHJ5ewogICR1cD1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMnOyAkY2FuZD1hcnJheV9tZXJnZShnbG9iKCR1cC4nLyp6YionKT86W10sZ2xvYigkdXAuJy8qLyp6YionKT86W10sZ2xvYigkdXAuJy93cGFsbGltcG9ydC9maWxlcy8qJyk/OltdKTsKICBmb3JlYWNoKCRjYW5kIGFzICRjKXsgaWYoaXNfZmlsZSgkYykpICRyWydmYWlsYWknXVtdPVtzdHJfcmVwbGFjZSgkdXAsJycsJGMpLHJvdW5kKGZpbGVzaXplKCRjKS8xMDQ4NTc2LDEpLHdwX2RhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkYykpXTsgfQogICR4bWw9bnVsbDsgZm9yZWFjaCgkY2FuZCBhcyAkYyl7IGlmKGlzX2ZpbGUoJGMpICYmIHByZWdfbWF0Y2goJy96Yi4qXC54bWwkL2knLCRjKSAmJiBmaWxlc2l6ZSgkYyk+MTAwMDAwKXsgJHhtbD0kYzsgYnJlYWs7IH0gfQogIGlmKCEkeG1sKXsgZm9yZWFjaCgkY2FuZCBhcyAkYyl7IGlmKGlzX2ZpbGUoJGMpICYmIHByZWdfbWF0Y2goJy9cLnhtbCQvaScsJGMpICYmIHN0cmlwb3MoZmlsZV9nZXRfY29udGVudHMoJGMsZmFsc2UsbnVsbCwwLDMwMDApLCd0cml4aWUnKSE9PWZhbHNlKXsgJHhtbD0kYzsgYnJlYWs7IH0gfSB9CiAgJHJbJ3htbCddPSR4bWw/IHN0cl9yZXBsYWNlKCR1cCwnJywkeG1sKTpudWxsOyBpZighJHhtbCkgdGhyb3cgbmV3IEV4Y2VwdGlvbignemIgeG1sIG5lcmFzdGFzJyk7CiAgJHM9ZmlsZV9nZXRfY29udGVudHMoJHhtbCk7ICRyWyd4bWxfcHJhZHppYSddPW1iX3N1YnN0cigkcywwLDYwMCk7CiAgLy8gYmVuZHJhcyBza2FpxI1pYXZpbWFzIHBhZ2FsIHJha3R1cwogICRlYW5zPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3piX2VhbiciKTsgJGhhdmU9YXJyYXlfZmxpcCgkZWFucyk7CiAgJHg9QHNpbXBsZXhtbF9sb2FkX3N0cmluZygkcyk7IGlmKCEkeCkgdGhyb3cgbmV3IEV4Y2VwdGlvbigneG1sIG5lcGFyc2luYW1hcycpOwogICRpdGVtcz1bXTsgZm9yZWFjaCgkeC0+eHBhdGgoJy8vKltsb2NhbC1uYW1lKCk9Iml0ZW0iIG9yIGxvY2FsLW5hbWUoKT0icHJvZHVjdCIgb3IgbG9jYWwtbmFtZSgpPSJyb3ciIG9yIGxvY2FsLW5hbWUoKT0iUHJvZHVjdCJdJykgYXMgJGl0KXsgJGE9anNvbl9kZWNvZGUoanNvbl9lbmNvZGUoJGl0KSx0cnVlKTsgJGZsYXQ9W107IGFycmF5X3dhbGtfcmVjdXJzaXZlKCRhLGZ1bmN0aW9uKCR2LCRrKSB1c2UgKCYkZmxhdCl7IGlmKCFpc3NldCgkZmxhdFska10pKSAkZmxhdFska109JHY7IH0pOyAkaXRlbXNbXT0kZmxhdDsgaWYoY291bnQoJGl0ZW1zKT42MDAwMCkgYnJlYWs7IH0KICAkclsnaXRlbXNfbiddPWNvdW50KCRpdGVtcyk7ICRyWydrZXlzJ109YXJyYXlfc2xpY2UoYXJyYXlfa2V5cygkaXRlbXNbMF0/P1tdKSwwLDQwKTsKICAka2FsPVtdOyAkcGlnPVtdOyAkbl90eD0wOwogIGZvcmVhY2goJGl0ZW1zIGFzICRmKXsgJHR4dD1pbXBsb2RlKCcgJyxhcnJheV9tYXAoJ3N0cnZhbCcsJGYpKTsgJG5hbWU9Jyc7IGZvcmVhY2goWyduYW1lJywndGl0bGUnLCdOYW1lJywncHJvZHVjdF9uYW1lJywncGF2YWRpbmltYXMnXSBhcyAkayl7IGlmKCFlbXB0eSgkZlska10pKXsgJG5hbWU9JGZbJGtdOyBicmVhazsgfSB9ICRwcmljZT1udWxsOyBmb3JlYWNoKFsncHJpY2UnLCdQcmljZScsJ2Nvc3QnLCd3aG9sZXNhbGVfcHJpY2UnLCduZXRfcHJpY2UnLCdrYWluYSddIGFzICRrKXsgaWYoaXNzZXQoJGZbJGtdKSAmJiBpc19udW1lcmljKHN0cl9yZXBsYWNlKCcsJywnLicsJGZbJGtdKSkpeyAkcHJpY2U9KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsJGZbJGtdKTsgYnJlYWs7IH0gfSAkcXR5PW51bGw7IGZvcmVhY2goWydxdHknLCdxdWFudGl0eScsJ3N0b2NrJywnU3RvY2snLCdraWVraXMnXSBhcyAkayl7IGlmKGlzc2V0KCRmWyRrXSkpeyAkcXR5PShpbnQpJGZbJGtdOyBicmVhazsgfSB9ICRlYW49Jyc7IGZvcmVhY2goWydlYW4nLCdFQU4nLCdiYXJjb2RlJ10gYXMgJGspeyBpZighZW1wdHkoJGZbJGtdKSl7ICRlYW49KHN0cmluZykkZlska107IGJyZWFrOyB9IH0KICAgICRpc1R4PXN0cmlwb3MoJHR4dCwndHJpeGllJykhPT1mYWxzZTsgaWYoJGlzVHgpICRuX3R4Kys7CiAgICAkaW1wPWlzc2V0KCRoYXZlWyRlYW5dKTsKICAgIGlmKHByZWdfbWF0Y2goJy94bWFzfGNocmlzdG1hc3xrYWzEl2R8c2FudGF8YWR2ZW50fGVsZnxyZWluZGVlcnxzbm93fHdpbnRlci9pJywkbmFtZSkpICRrYWxbXT1bbWJfc3Vic3RyKCRuYW1lLDAsODApLCRwcmljZSwkcXR5LCRlYW4sJGltcD8neXJhJzonTsSWUkEnXTsKICAgIGlmKCRpc1R4ICYmICRwcmljZSE9PW51bGwgJiYgJHByaWNlPD00ICYmICRxdHk+PTUgJiYgISRpbXApICRwaWdbXT1bbWJfc3Vic3RyKCRuYW1lLDAsODApLCRwcmljZSwkcXR5LCRlYW5dOwogIH0KICAkclsndHJpeGllX2ZlZWRfbiddPSRuX3R4OyAkclsna2FsZWRpbmVzX24nXT1jb3VudCgka2FsKTsgJHJbJ2thbGVkaW5lcyddPWFycmF5X3NsaWNlKCRrYWwsMCw4MCk7ICRyWyd0cml4aWVfcGlnaW9zX25laW1wb3J0dW90b3NfbiddPWNvdW50KCRwaWcpOyB1c29ydCgkcGlnLGZuKCRhLCRiKT0+JGFbMV08PT4kYlsxXSk7ICRyWyd0cml4aWVfcGlnaW9zJ109YXJyYXlfc2xpY2UoJHBpZywwLDEyMCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-120440';
const GKEY='ps_s1831zx';
const PHASES=["1"];
const OUT='analize/s1831_zx.json';
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
