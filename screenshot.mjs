process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDggcnVuIGUzdyDigJQgdjMuNyBwYXRpa3JhOiB2YXJuZWzEl3MgKyB2aWVuYXMgbGFpxaFrYXMgKG51b3RyYXVrb3MsIHRlc3R1b3RvamFzKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lM3cnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidydW4gZTN3Jyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJHVpZD0kdS0+SUQ7ICRleHA9dGltZSgpKzE4MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogIGZvcmVhY2goYXJyYXkoYXJyYXkoU0VDVVJFX0FVVEhfQ09PS0lFLCdzZWN1cmVfYXV0aCcpLGFycmF5KEFVVEhfQ09PS0lFLCdhdXRoJyksYXJyYXkoTE9HR0VEX0lOX0NPT0tJRSwnbG9nZ2VkX2luJykpIGFzICRjKXsgJG9bJ2Nvb2tpZXMnXVtdPWFycmF5KCduYW1lJz0+JGNbMF0sJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCRjWzFdLCR0b2spKTsgfQogICRvWyd2ZXJzaWphJ109UGV0c2hvcF9EYXJiYWxhdWtpczo6VkVSU0lKQTsgJEI9YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJyk7CiAgJG9bJ3Nob3RzJ109YXJyYXkoCiAgICBhcnJheSgnbic9PidlM192MzdfbGF1a2lhbScsJ3UnPT4kQi4nJmVpbGU9bGF1a2lhbScsJ2V2YWwnPT4iKHtidG46Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kbC16aW5nc25pYWktayBidXR0b24nKV0ubWFwKGI9PmIuaW5uZXJUZXh0KyhiLmRpc2FibGVkPycgW29mZl0nOicnKSksY2I6ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRsLXV6cy1jYicpLmxlbmd0aCxwZXJ6OiEhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRsLXBlcnonKSxwYXN0YWJhOihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGwtemluZ3NuaWFpLWsgLnBpbGthcy5tYXonKXx8e30pLmlubmVyVGV4dCxnYWw6KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kbC10ay1nYXV0YScpfHx7fSkuaW5uZXJUZXh0fSkiKSwKICAgIGFycmF5KCduJz0+J2UzX3YzN19kcm9wc2hpcCcsJ3UnPT4kQi4nJmVpbGU9bGFpc2thaScsJ2gnPT4xMjAwLCdldmFsJz0+Iih7Y2I6ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRsLXV6cy1jYicpLmxlbmd0aCxmb3JtczpbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybS5kbC1sYWlza2FzLWYnKV0ubWFwKGY9PmYuaWQrJzonKyhmLnF1ZXJ5U2VsZWN0b3IoJy5kbC11enMtaWRzJyl8fHt9KS52YWx1ZSsnIOKGkiAnKyhmLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbltkYXRhLXRwbF0nKXx8e30pLmlubmVyVGV4dCl9KSIpLAogICAgYXJyYXkoJ24nPT4nZTNfdjM3X2Ryb3BzaGlwX29mZicsJ3UnPT4kQi4nJmVpbGU9bGFpc2thaScsJ2gnPT4xMjAwLCdjbGljayc9PicuZGwtdXpzLWNiJywnZXZhbCc9PiIoe2Zvcm1zOlsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtLmRsLWxhaXNrYXMtZicpXS5tYXAoZj0+Zi5pZCsnOicrKGYucXVlcnlTZWxlY3RvcignLmRsLXV6cy1pZHMnKXx8e30pLnZhbHVlKycg4oaSICcrKGYucXVlcnlTZWxlY3RvcignYnV0dG9uW2RhdGEtdHBsXScpfHx7fSkuaW5uZXJUZXh0KygoZi5xdWVyeVNlbGVjdG9yKCdidXR0b25bZGF0YS10cGxdJyl8fHt9KS5kaXNhYmxlZD8nIFtvZmZdJzonJykpfSkiKSwKICApOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-162838';
const GKEY='ps_e3w';
const PHASES=["W"];
const OUT='analize/e3_run12w.json';
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
