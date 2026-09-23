process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZigoJF9HRVRbJ3BzX3MxNzA2dyddPz8nJykhPT0nMScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgpOwogIHRyeXsgJHA9Z2V0X3Bvc3QoMzIyNyk7ICRiPWdldF9vcHRpb24oJ3BzX3MxNzA2X3R1cmlueXNfYmFrJyxhcnJheSgpKTsgJGJbJzMyMjdfdGl0bGUnXT0kcC0+cG9zdF90aXRsZTsgJGJbJzMyMjdfZGVzYyddPWdldF9wb3N0X21ldGEoMzIyNywncmFua19tYXRoX2Rlc2NyaXB0aW9uJyx0cnVlKTsgdXBkYXRlX29wdGlvbigncHNfczE3MDZfdHVyaW55c19iYWsnLCRiLGZhbHNlKTsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PjMyMjcsJ3Bvc3RfdGl0bGUnPT4nR2VyaWF1c2lhcyBzYXVzYXMgxaF1bsWzIG1haXN0YXM6IGthaXAgacWhc2lyaW5rdGknKSk7CiAgICB1cGRhdGVfcG9zdF9tZXRhKDMyMjcsJ3JhbmtfbWF0aF9kZXNjcmlwdGlvbicsJ0thaXAgacWhc2lyaW5rdGkgZ2VyxIUgc2F1c8SFIMWhdW7FsyBtYWlzdMSFOiDEryBrxIUgxb5pxatyxJd0aSBzdWTEl3R5amUgaXIga29rxK8gbWFpc3TEhSByaW5rdGlzIG1hxb5pZW1zLCBkaWRlbGllbXMgYXIgc3RlcmlsaXp1b3RpZW1zIMWhdW5pbXMuJyk7CiAgICAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoMzIyNykuJz9uYz0nLnRpbWUoKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKICAgICRvWyd0aXRsZSddPXByZWdfbWF0Y2goJ348dGl0bGU+KC4qPyk8L3RpdGxlPn5zJywkaCwkbSk/JG1bMV06Jz8nOyAkb1snZGVzYyddPXByZWdfbWF0Y2goJ348bWV0YSBuYW1lPSJkZXNjcmlwdGlvbiIgY29udGVudD0iKFteIl0rKX4nLCRoLCRtKT8kbVsxXTonPyc7ICRvWydoMV8yMDI0J109c3Vic3RyX2NvdW50KCRoLCcyMDI0Jyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydLTEFJREEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgOTkpOwo=';
const VER='dep-142814';
const GKEY='ps_s1706w';
const PHASES=["1"];
const OUT='analize/s1706_mw.json';
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
