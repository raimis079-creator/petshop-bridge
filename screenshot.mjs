process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODN0IHcg4oCUICMxODA1NCBwZXJzaWV0aSBzdSBWRiBKT1MwNzkzIChtZXRhIGnFoSAjMjE3MDcpLCBrYWluYSA0MC44OSwgcHVibGlrdW90aTsgIzIxNzA3IOKGkiBkcmFmdDsgYmFrIG1ldGEgxK8gb3BjaWrEhSBwc19zMTY4M18xODA1NF9iYWs7IHJhc3RpIDMwMSBtZWNoYW5pem3EhS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODN0dyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J3cnKTsKICAkYT13Y19nZXRfcHJvZHVjdCgxODA1NCk7ICRiPXdjX2dldF9wcm9kdWN0KDIxNzA3KTsKICAka2V5cz1hcnJheSgnX3ZmX3N1cHBsaWVyX3NrdScsJ192Zl9iYXJjb2RlJywnX3ZmX2Nvc3QnLCdfdmZfcGVyc29uYWxfY29zdCcsJ192Zl9jb3N0X3htbCcsJ192Zl9wZXJzb25hbF94bWwnLCdfdmZfY2F0ZWdvcnlfcmF3JywnX3ZmX3N1cHBsaWVyX2Rpc2NvdW50JywnX3ZmX2JyYW5kX3JhdycsJ192Zl9icmFuZF9ub3JtYWxpemVkJywnX3ZmX3djX3NrdScpOwogICRiYWs9YXJyYXkoJ3N0YXR1cyc9PiRhLT5nZXRfc3RhdHVzKCksJ3ByaWNlJz0+JGEtPmdldF9yZWd1bGFyX3ByaWNlKCkpOyBmb3JlYWNoKCRhLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0pIGlmKHN0cnBvcygkbS0+a2V5LCdfdmZfJyk9PT0wfHxpbl9hcnJheSgkbS0+a2V5LGFycmF5KCdfcGV0c2hvcF9uZWVkc19wcmljZV9yZXZpZXcnLCdfcGV0c2hvcF9wcmljZV9yZXZpZXdfcmVhc29uJykpKSAkYmFrWydtZXRhJ11bJG0tPmtleV09JG0tPnZhbHVlOwogIGlmKCFnZXRfb3B0aW9uKCdwc19zMTY4M18xODA1NF9iYWsnKSkgYWRkX29wdGlvbigncHNfczE2ODNfMTgwNTRfYmFrJywkYmFrLCcnLGZhbHNlKTsKICBmb3JlYWNoKCRrZXlzIGFzICRrKXsgJHY9JGItPmdldF9tZXRhKCRrKTsgaWYoJHYhPT0nJykgJGEtPnVwZGF0ZV9tZXRhX2RhdGEoJGssJHYpOyB9CiAgJGEtPnVwZGF0ZV9tZXRhX2RhdGEoJ192Zl9tYXRjaF90eXBlJywnbWFudWFsX3MxNjgzJyk7ICRhLT51cGRhdGVfbWV0YV9kYXRhKCdfdmZfbGFzdF9tYXRjaGVkX2ltcG9ydF9wb3N0X2lkJywyMTcwNyk7ICRhLT5kZWxldGVfbWV0YV9kYXRhKCdfcGV0c2hvcF9uZWVkc19wcmljZV9yZXZpZXcnKTsgJGEtPmRlbGV0ZV9tZXRhX2RhdGEoJ19wZXRzaG9wX3ByaWNlX3Jldmlld19yZWFzb24nKTsKICAkYS0+c2V0X3JlZ3VsYXJfcHJpY2UoJzQwLjg5Jyk7ICRhLT5zZXRfc2FsZV9wcmljZSgnJyk7ICRhLT5zZXRfc3RhdHVzKCdwdWJsaXNoJyk7ICRhLT5zYXZlKCk7CiAgd3BfaW5zZXJ0X2NvbW1lbnQoYXJyYXkoJ2NvbW1lbnRfcG9zdF9JRCc9PjE4MDU0LCdjb21tZW50X3R5cGUnPT4nbm90ZScsJ2NvbW1lbnRfY29udGVudCc9PidTMTY4MzogVkYgc3VzaWVqaW1hcyBpxaF0YWlzeXRhcyBKT1MwODA1ICg0MDAgZykg4oaSIEpPUzA3OTMgKDEwIGtnKSwga2FpbmEgMyw0OSDihpIgNDAsODk7ICMyMTcwNyBkdWJsaWthdGFzIHBhc2zEl3B0YXMuJywndXNlcl9pZCc9PjAsJ2NvbW1lbnRfYXV0aG9yJz0+J0NsYXVkZScsJ2NvbW1lbnRfYXBwcm92ZWQnPT4xKSk7CiAgJGItPnNldF9zdGF0dXMoJ2RyYWZ0Jyk7ICRiLT5zZXRfY2F0YWxvZ192aXNpYmlsaXR5KCdoaWRkZW4nKTsgJGItPnNhdmUoKTsKICAkYT13Y19nZXRfcHJvZHVjdCgxODA1NCk7ICRvWycxODA1NCddPWFycmF5KCdzdCc9PiRhLT5nZXRfc3RhdHVzKCksJ3ByaWNlJz0+JGEtPmdldF9wcmljZSgpLCdza3UnPT4kYS0+Z2V0X21ldGEoJ192Zl9zdXBwbGllcl9za3UnKSwnYmMnPT4kYS0+Z2V0X21ldGEoJ192Zl9iYXJjb2RlJyksJ2Nvc3QnPT4kYS0+Z2V0X21ldGEoJ192Zl9jb3N0JyksJ3htbCc9PiRhLT5nZXRfbWV0YSgnX3ZmX2Nvc3RfeG1sJyksJ3VybCc9PmdldF9wZXJtYWxpbmsoMTgwNTQpKTsKICAkb1snMjE3MDcnXT1hcnJheSgnc3QnPT5nZXRfcG9zdF9zdGF0dXMoMjE3MDcpLCdzbHVnJz0+JGItPmdldF9zbHVnKCkpOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoKCcvd3BfcmVkaXJlY3RcKC4qMzAxfHBzX3JlZGlyZWN0fG51a3JlaXBpbS9pJywkcykpICRvWydyZWRpciddW2Jhc2VuYW1lKCRmKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3Vic3RyKHRyaW0oJHgpLDAsMTUwKTt9LHByZWdfZ3JlcCgnL3BzX3JlZGlyZWN0fG51a3JlaXBpbXwzMDEvaScsZXhwbG9kZSgiXG4iLCRzKSkpLDAsNik7IH0KICAkb1sncmVkaXJfb3B0J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVyZWRpcmVjdCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVudWtyZWlwJScgTElNSVQgMTAiKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-104323';
const GKEY='ps_s1683tw';
const PHASES=["A"];
const OUT='analize/s1683t_w.json';
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
