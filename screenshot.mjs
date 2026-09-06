process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjAgcnVuIGU4ciDigJQgUjogZGFyYnVvdG9qbyByb2zEl3MgYHBzX2RhcmJ1b3RvamFzYCB0ZWlzxJdzLCBrxIUgbWF0byB0ZXN0dW90b2phcyBXUCBhZG1pbidlIChtZW5pdSwganVvc3RhKSwgbG9naW5fcmVkaXJlY3QgKHRpayBza2FpdHltYXMpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lOHInXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYyMCBlOHInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyMDApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkSj1mdW5jdGlvbigkbyl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfTsKICB0cnl7CiAgJHI9Z2V0X3JvbGUoJ3BzX2RhcmJ1b3RvamFzJyk7ICRvWydyb2xlJ109JHI/YXJyYXkoJ25hbWUnPT4kci0+bmFtZSwnY2Fwcyc9PmFycmF5X2tleXMoYXJyYXlfZmlsdGVyKCRyLT5jYXBhYmlsaXRpZXMpKSk6J07EllJBJzsgJG9bJ3JvbGVzX3Zpc29zJ109YXJyYXlfa2V5cyh3cF9yb2xlcygpLT5yb2xlcyk7CiAgZ2xvYmFsICR3cF9maWx0ZXI7IGZvcmVhY2goYXJyYXkoJ2xvZ2luX3JlZGlyZWN0Jywnc2hvd19hZG1pbl9iYXInLCdhZG1pbl9tZW51JywnYWRtaW5faW5pdCcsJ3dwX2xvZ2luJykgYXMgJGgpeyAkY2I9YXJyYXkoKTsgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGZzKXsgZm9yZWFjaCgkZnMgYXMgJGs9PiRmbil7ICRmPSRmblsnZnVuY3Rpb24nXTsgJG49aXNfYXJyYXkoJGYpPygoaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdKTooaXNfc3RyaW5nKCRmKT8kZjonY2xvc3VyZScpOyBpZihzdHJpcG9zKCRuLCdwZXRzaG9wJykhPT1mYWxzZXx8c3RyaXBvcygkbiwncHNfJykhPT1mYWxzZXx8c3RyaXBvcygkbiwnY2xvc3VyZScpIT09ZmFsc2UpICRjYltdPSRwci4nOicuJG47IH0gfSB9ICRvWydrYWJsaWFpJ11bJGhdPWFycmF5X3NsaWNlKCRjYiwwLDI1KTsgfQogICR0dT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkdWlkPSR0dS0+SUQ7ICRleHA9dGltZSgpKzkwMDsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJGNzPWFycmF5KG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PlNFQ1VSRV9BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ3NlY3VyZV9hdXRoJywkdG9rKSkpLG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkFVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcsJHRvaykpKSxuZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSkpKTsKICAkRz1mdW5jdGlvbigkdSkgdXNlKCRjcyl7ICRyPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT45MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOyByZXR1cm4gYXJyYXkoJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJ2xvYyc9PihzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnbG9jYXRpb24nKSwnaCc9PihzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKTsgfTsKICAkeD0kRyhhZG1pbl91cmwoKSk7ICRvWyd3cF9hZG1pbiddPWFycmF5KCdjb2RlJz0+JHhbJ2NvZGUnXSwnbG9jJz0+JHhbJ2xvYyddKTsgJGg9JHhbJ2gnXTsKICAkb1snYWRtaW5tZW51J109cHJlZ19tYXRjaCgnLzx1bCBpZD0iYWRtaW5tZW51Ij4oLio/KTxcL3VsPlxzKjxcL2Rpdj4vc3UnLCRoLCRtKT9hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21hcCgndHJpbScsYXJyYXlfbWFwKCd3cF9zdHJpcF9hbGxfdGFncycscHJlZ19tYXRjaF9hbGwoJy88YVtePl0rY2xhc3M9IlteIl0qbWVudS10b3BbXiJdKiJbXj5dKj4oLio/KTxcL2E+L3N1JywkbVsxXSwkbW0pPyRtbVsxXTphcnJheSgpKSkpKTonPyc7CiAgJG9bJ2FkbWluYmFyJ109KGludCkoc3RycG9zKCRoLCdpZD0id3BhZG1pbmJhciInKSE9PWZhbHNlKTsgJG9bJ2p1b3N0YSddPShpbnQpKHN0cnBvcygkaCwncHMtanVvc3RhJykhPT1mYWxzZXx8c3RycG9zKCRoLCdwc2otJykhPT1mYWxzZSk7CiAgJHg9JEcoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJykpOyAkb1snZGVzayddPWFycmF5KCdjb2RlJz0+JHhbJ2NvZGUnXSwndGl0bGUnPT5wcmVnX21hdGNoKCcvPHRpdGxlPiguKj8pPFwvdGl0bGU+L3MnLCR4WydoJ10sJHQpP3RyaW0oJHRbMV0pOicnLCdqdW9zdGFfbnVvcm9kb3MnPT4ocHJlZ19tYXRjaF9hbGwoJy88YVtePl0qaHJlZj0iW14iXSpwYWdlPShwcy1bYS16LV0rfHBldHNob3AtW2Etei1dKylbXiJdKiJbXj5dKj4oW148XXsyLDMwfSk8XC9hPi91JywkeFsnaCddLCRqbTIpP2FycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGptMlsyXSkpOmFycmF5KCkpKTsKICBmb3JlYWNoKGFycmF5KCdhZG1pbi5waHA/cGFnZT13Yy1vcmRlcnMnLCdlZGl0LnBocD9wb3N0X3R5cGU9cHJvZHVjdCcsJ2FkbWluLnBocD9wYWdlPXdjLXNldHRpbmdzJywncGx1Z2lucy5waHAnLCd1c2Vycy5waHAnLCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJnZpZXc9c2Fza2FpdG9zJykgYXMgJHUpeyAkeD0kRyhhZG1pbl91cmwoJHUpKTsgJG9bJ3ByaWVpZ2EnXVskdV09JHhbJ2NvZGUnXS4oJHhbJ2xvYyddPycg4oaSICcubWJfc3Vic3RyKHN0cl9yZXBsYWNlKGhvbWVfdXJsKCksJycsJHhbJ2xvYyddKSwwLDYwKTonJyk7IH0KICAkb1sndGVzdHVvdG9qYXNfbWV0YSddPWFycmF5KCdsYXN0Jz0+Z2V0X3VzZXJfbWV0YSgkdWlkLCdzZXNzaW9uX3Rva2VucycsZmFsc2UpPydzZXNpamEnOicnLCdsb2NhbGUnPT5nZXRfdXNlcl9tZXRhKCR1aWQsJ2xvY2FsZScsdHJ1ZSksJ2FkbWluX2NvbG9yJz0+Z2V0X3VzZXJfbWV0YSgkdWlkLCdhZG1pbl9jb2xvcicsdHJ1ZSkpOwogICRvWyd0ZW1wX2xpa28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLmJhc2VuYW1lKCRlLT5nZXRGaWxlKCkpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgJEooJG8pOwp9LDk5KTsK';
const VER='dep-094828';
const GKEY='ps_e8r';
const PHASES=["R"];
const OUT='analize/s1620_e8r.json';
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
