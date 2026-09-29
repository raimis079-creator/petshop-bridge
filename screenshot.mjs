process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwa2sgemVua2xvIGZpbHRybyByZWNvbiAoMSByZWFkLW9ubHkgKyBzaG90cykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwa2snXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzQwa2snXTsKICB0cnl7CiAgICAkaGl0cz1bXTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyksZ2xvYihXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC0qLyoucGhwJyksZ2xvYihXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC0qLyovKi5waHAnKSxnbG9iKFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLSovKi8qLmpzJyksZ2xvYihXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC0qL2Fzc2V0cy8qLyouanMnKSxnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5waHAnKSxnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi8qLmpzJyksZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nLyouanMnKSkgYXMgJGZwKXsgJHM9KHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJGZwKTsgaWYoc3RycG9zKCRzLCdwcy1uaWNoZScpIT09ZmFsc2UpeyBwcmVnX21hdGNoX2FsbCgnL1teXG5dKihwcy1uaWNoZXxvcGVuZWR8TklDSEV8bmlzb3N8YXR2aXJvc3xwcm9kdWN0X2JyYW5kKVteXG5dKi9pJywkcywkbSk7ICRoaXRzW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGZwKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKHRyaW0oJHgpLDAsMzAwKTt9LCRtWzBdKSwwLDE0KTsgfSB9CiAgICAkclsncHNfbmljaGUnXT0kaGl0czsKICAgICRldiA9IDw8PCdKUycKKCgpPT57Y29uc3QgZj1bLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3Nob3Atc2lkZWJhciAueWl0aC13Y2FuLWZpbHRlcicpXTtyZXR1cm4gZi5tYXAoeD0+e2NvbnN0IGxpPXgucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlci1pdGVtJyk7Y29uc3QgYz14LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXItY29udGVudCcpO3JldHVybiB4LmdldEF0dHJpYnV0ZSgnZGF0YS10YXhvbm9teScpKycgfCAnK3guY2xhc3NOYW1lKycgfCBpdGVtczonK2xpLmxlbmd0aCsnIHwgY29udGVudDonKyhjP2dldENvbXB1dGVkU3R5bGUoYykuZGlzcGxheSsnIHN0eWxlPScrKGMuZ2V0QXR0cmlidXRlKCdzdHlsZScpfHwnJyk6JycpKycgfCAnKyh4LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXItdGl0bGUnKXx8e30pLmlubmVyVGV4dDt9KS5jb25jYXQoWygoKT0+e2NvbnN0IGI9Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNzaG9wLXNpZGViYXIgLnlpdGgtd2Nhbi1maWx0ZXInKV0uZmluZCh4PT4vYnJhbmR8emVua2wvaS50ZXN0KHguZ2V0QXR0cmlidXRlKCdkYXRhLXRheG9ub215Jyl8fCcnKXx8L8W+ZW5rbGFzL2kudGVzdCgoeC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyLXRpdGxlJyl8fHt9KS5pbm5lclRleHR8fCcnKSk7cmV0dXJuIGI/Yi5vdXRlckhUTUwucmVwbGFjZSgvXHMrL2csJyAnKS5zbGljZSgwLDE4MDApOiduZXJhJzt9KSgpXSl9KSgpCkpTOwogICAgJHJbJ3Nob3RzJ109W1snbic9PidrazAnLCd1Jz0+aG9tZV91cmwoJy8nKSwndyc9PjM5MCwnaCc9Pjg0NF0sWyduJz0+J2trMScsJ3UnPT5ob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nKSwndyc9PjM5MCwnaCc9Pjg0NCwnZXZhbCc9PiRldl1dOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-212811';
const GKEY='ps_s1740kk';
const PHASES=["1"];
const OUT='analize/s1740kk.json';
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
