process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1a2Qga2HEjWl1a8WzL8WhdW5pdWvFsyDFocSXcmltbyBsZW50ZWzEl3MgYXByYcWheW1lICgxIGRyeSwgMiBhcHBseSwgOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyNWtkJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJGY9KHN0cmluZykkX0dFVFsncHNfczE4MjVrZCddOyAkcj1bJ3YnPT4nUzE4MjVrZCcsJ2YnPT4kZl07ICRCQUs9J3BzX3MxODI1a2RfYmFrJzsKICAkdGJsPWZ1bmN0aW9uKCRoLCRyb3dzLCRwcmUsJHBvc3QpeyAkbz0nPHA+PHN0cm9uZz4nLiRwcmUuJzwvc3Ryb25nPjwvcD48dGFibGU+PHRoZWFkPjx0cj4nOyBmb3JlYWNoKCRoIGFzICR4KSAkby49Jzx0aD4nLiR4Lic8L3RoPic7ICRvLj0nPC90cj48L3RoZWFkPjx0Ym9keT4nOyBmb3JlYWNoKCRyb3dzIGFzICRydyl7ICRvLj0nPHRyPic7IGZvcmVhY2goJHJ3IGFzICR4KSAkby49Jzx0ZD4nLiR4Lic8L3RkPic7ICRvLj0nPC90cj4nOyB9IHJldHVybiAkby4nPC90Ym9keT48L3RhYmxlPjxwPicuJHBvc3QuJzwvcD4nOyB9OwogICRWPVsKICAgMTg4NTA9PlsnbW9kZSc9PidyZXBsYWNlJywnZmluZCc9PicvPHA+xaDEl3JpbW8gcmVrb21lbmRhY2lqb3MgcHJpa2xhdXNvIG51byBrYcSNaXVrbyBhbcW+aWF1cyBiZWkgZHlkxb5pbyBpciB5cmEgcGF0ZWlrdG9zIGFudCBza2FyZGluxJdzXC5bXjxdKjxcL3A+L3UnLAogICAgICdodG1sJz0+JHRibChbJ0Ftxb5pdXMnLCdTdWF1Z3VzaW9zIGthdMSXcyBzdm9yaXMnLCdTa2FyZGluacWzICgxODUgZykgcGVyIHBhcsSFJ10sW1snMyBtxJduLicsJzHigJMxLDUga2cnLCcx4oCTMcK8ICjiiYgxODXigJMyMzAgZyknXSxbJzTigJM2IG3El24uJywnMSw14oCTMiw1IGtnJywnMcK84oCTMcK+ICjiiYgyMzDigJMzMjUgZyknXSxbJzfigJMxMiBtxJduLicsJzIsNeKAkzQsNSBrZycsJzHCvuKAkzLCvSAo4omIMzI14oCTNDYwIGcpJ11dLCfFoMSXcmltbyByZWtvbWVuZGFjaWphIChnYW1pbnRvam8gZHVvbWVueXMpOicsJ0tpZWtpcyBwcmlrbGF1c28gbnVvIGthxI1pdWtvIGFtxb5pYXVzLCBha3R5dnVtbyBpciBixatzaW1vIHN1YXVndXNpb3Mga2F0xJdzIGR5ZMW+aW8uIEd5dsWrbmFzIHZpc3VvbWV0IHR1cmkgdHVyxJd0aSDFoXZpZcW+aW8gdmFuZGVucy4nKV0sCiAgIDMzNjU0PT5bJ21vZGUnPT4nYWZ0ZXInLCdmaW5kJz0+Jy88cD48c3Ryb25nPsWgxJdyaW1vIHJla29tZW5kYWNpamE6PFwvc3Ryb25nPltePF0qPFwvcD4vdScsCiAgICAgJ2h0bWwnPT4kdGJsKFsnS2HEjWl1a28gc3ZvcmlzJywnQW3Fvml1cycsJ1Bhcm9zIG5vcm1hJ10sW1snMSBrZycsJzLigJM0IG3El24uJywnMTkwIGcnXSxbJzMga2cnLCc24oCTOCBtxJduLicsJzI3MCBnJ11dLCfFoMSXcmltbyBsZW50ZWzElyAoZ2FtaW50b2pvIGR1b21lbnlzKTonLCcnKV0sCiAgIDMzMzI0PT5bJ21vZGUnPT4nYXBwZW5kJywnZmluZCc9PicnLAogICAgICdodG1sJz0+JHRibChbJ8WgdW5pdWtvIHN2b3JpcycsJ1Bhcm9zIG5vcm1hJywnU2thcmRpbmnFsyAoMTQwIGcpJ10sW1snMCw1IGtnJywnMTEwIGcnLCfCviddLFsnMSBrZycsJzE4NSBnJywnMeKFkyddLFsnMSw1IGtnJywnMjUwIGcnLCcxwr4nXSxbJzIga2cnLCczMTAgZycsJzLCvCddLFsnMiw1IGtnJywnMzcwIGcnLCcy4oWUJ10sWyczIGtnJywnNDI1IGcnLCczJ10sWyc0IGtnJywnNTMwIGcnLCczwr4nXSxbJzUga2cnLCc2MjAgZycsJzTihZMnXSxbJzYga2cnLCc3MTUgZycsJzUnXSxbJzcga2cnLCc4MDAgZycsJzXihZQnXV0sJ8WgxJdyaW1vIHJla29tZW5kYWNpamEgKGdhbWludG9qbyBkdW9tZW55cyk6JywnUGFyb3Mgbm9ybcSFIHBhZGFseWtpdGUgxK8ga2VsaXMgbWFpdGluaW11cy4gS2lla2lzIHByaWtsYXVzbyBudW8gxaF1bml1a28gYW3FvmlhdXMsIGFrdHl2dW1vIGlyIGLFq3NpbW8gZHlkxb5pby4gxaB1bml1a2FzIHZpc2FkYSB0dXJpIHR1csSXdGkgxaF2YXJhdXMgdmFuZGVucy4nKV0sCiAgXTsKICAkcG9zdHM9ZnVuY3Rpb24oJGlkKSB1c2UoJHdwZGIsJFApeyByZXR1cm4gYXJyYXlfbWVyZ2UoWyRpZF0sYXJyYXlfbWFwKCdpbnR2YWwnLCR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbS5wb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBBTkQgcC5wb3N0X3N0YXR1czw+J3RyYXNoJyBXSEVSRSBtLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbS5tZXRhX3ZhbHVlPSVkIiwkaWQpKSkpOyB9OwogIHRyeXsKICBpZigkZj09PScxJ3x8JGY9PT0nMicpeyAkYmFrPWdldF9vcHRpb24oJEJBSyxbXSk7CiAgICBmb3JlYWNoKCRWIGFzICRpZD0+JHYpeyBmb3JlYWNoKCRwb3N0cygkaWQpIGFzICRwaWQpeyAkYz0oc3RyaW5nKWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLCRwaWQpOyAkbz1bJ3BpZCc9PiRwaWQsJ2xlbic9PnN0cmxlbigkYyldOwogICAgICAgIGlmKHN0cnBvcygkYywnKGdhbWludG9qbyBkdW9tZW55cyk6PC9zdHJvbmc+JykhPT1mYWxzZSl7ICRvWydqYXUnXT0xOyAkclsncCddWyRpZF1bXT0kbzsgY29udGludWU7IH0KICAgICAgICBpZigkdlsnbW9kZSddPT09J2FwcGVuZCcpICRuPXJ0cmltKCRjKS4iXG4iLiR2WydodG1sJ107CiAgICAgICAgZWxzZSB7IGlmKCFwcmVnX21hdGNoKCR2WydmaW5kJ10sJGMsJG0pKXsgJG9bJ25lcmFzdGEnXT0xOyAkclsncCddWyRpZF1bXT0kbzsgY29udGludWU7IH0gJG49JHZbJ21vZGUnXT09PSdyZXBsYWNlJz9zdHJfcmVwbGFjZSgkbVswXSwkdlsnaHRtbCddLCRjKTpzdHJfcmVwbGFjZSgkbVswXSwkbVswXS4kdlsnaHRtbCddLCRjKTsgfQogICAgICAgICRvWyduYXVqYXNfbGVuJ109c3RybGVuKCRuKTsKICAgICAgICBpZigkZj09PScyJyl7IGlmKCFpc3NldCgkYmFrWyRwaWRdKSkgJGJha1skcGlkXT0kYzsgdXBkYXRlX29wdGlvbigkQkFLLCRiYWssZmFsc2UpOyB3cF91cGRhdGVfcG9zdChbJ0lEJz0+JHBpZCwncG9zdF9jb250ZW50Jz0+JG5dKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkcGlkKTsgJG9bJ29rJ109MTsgfQogICAgICAgICRyWydwJ11bJGlkXVtdPSRvOyB9IH0gfQogIGlmKCRmPT09JzknKXsgZm9yZWFjaCgoYXJyYXkpZ2V0X29wdGlvbigkQkFLLFtdKSBhcyAkcGlkPT4kYyl7IHdwX3VwZGF0ZV9wb3N0KFsnSUQnPT4oaW50KSRwaWQsJ3Bvc3RfY29udGVudCc9PiRjXSk7IH0gJHJbJ29rJ109MTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-140429';
const GKEY='ps_s1825kd';
const PHASES=["2"];
const OUT='analize/s1825_kd2.json';
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
