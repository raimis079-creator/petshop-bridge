process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwY2MgZmlsdHJvIG15Z3R1a28gcmVjb24gKDEgcmVhZC1vbmx5ICsgc2hvdHMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MGNjJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzQwY2MnXTsKICB0cnl7CiAgICAkVD0kd3BkYi0+cHJlZml4Lidwc193ZWJfaXZ5a2lhaSc7CiAgICAkclsnZmlsdGVyX2l2eWtpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpcmVuZ2lueXMsIExFRlQocmFrdGFzLDQwKSByYWt0YXMsIENPVU5UKCopIG4gRlJPTSAkVCBXSEVSRSB0aXBhcz0nZmlsdGVyJyBBTkQgZGllbmE+PUNVUkRBVEUoKS1JTlRFUlZBTCAxNCBEQVkgR1JPVVAgQlkgMSwyIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxMiIsQVJSQVlfQSk7CiAgICAkclsnZmlsdGVyX2thc19yYXNvJ109W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtKi8qLnBocCcpLGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtKi8qLyoucGhwJyksZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nLyoucGhwJykpIGFzICRmcCl7ICRzPShzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKCRmcCk7IGlmKHByZWdfbWF0Y2goIi90aXBhc1xzKjpccypbJ1wiXWZpbHRlclsnXCJdfCdmaWx0ZXInXHMqPT58XCJmaWx0ZXJcIi8iLCRzKSkgJHJbJ2ZpbHRlcl9rYXNfcmFzbyddW109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZnApOyB9CiAgICAkSz1ob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nKTsKICAgICRldiA9IDw8PCdKUycKKCgpPT57Y29uc3Qgbz0ocyxuKT0+e2NvbnN0IGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTtyZXR1cm4gZT9lLm91dGVySFRNTC5yZXBsYWNlKC9ccysvZywnICcpLnNsaWNlKDAsbnx8MTUwMCk6bnVsbH07Y29uc3QgcG9zPXM9Pntjb25zdCBlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iocyk7aWYoIWUpcmV0dXJuIG51bGw7Y29uc3Qgcj1lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2NvbnN0IGM9Z2V0Q29tcHV0ZWRTdHlsZShlKTtyZXR1cm4gTWF0aC5yb3VuZChyLnRvcCkrJy0nK01hdGgucm91bmQoci5ib3R0b20pKycgdycrTWF0aC5yb3VuZChyLndpZHRoKSsnIGRpc3A6JytjLmRpc3BsYXl9O2NvbnN0IHNiPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaG9wLXNpZGViYXInKTtjb25zdCBsaW5rcz1zYj9bLi4uc2IucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmKj0iPyJdLCBhW2hyZWYqPSJmaWx0ZXIiXScpXS5zbGljZSgwLDMpLm1hcChhPT5hLmdldEF0dHJpYnV0ZSgnaHJlZicpKTpbXTtyZXR1cm4ge2ZpbHRlcmluZzpvKCcuY2F0ZWdvcnktZmlsdGVyaW5nJyw5MDApLGZpbHRlcmluZ19wb3M6cG9zKCcuY2F0ZWdvcnktZmlsdGVyaW5nJyksYnRuX3Bvczpwb3MoJy5maWx0ZXItYnV0dG9uJyksb3JkZXJpbmc6bygnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyw3MDApLG9yZGVyaW5nX3Bvczpwb3MoJy53b29jb21tZXJjZS1vcmRlcmluZycpLG9yZGVyaW5nX3BhcmVudDooZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndvb2NvbW1lcmNlLW9yZGVyaW5nJyl8fHt9KS5wYXJlbnRFbGVtZW50Py5jbGFzc05hbWUsdGl0bGVfd3JhcDpvKCcuc2hvcC1wYWdlLXRpdGxlIC5wYWdlLXRpdGxlLWlubmVyLCAuY2F0ZWdvcnktcGFnZS10aXRsZSAucGFnZS10aXRsZS1pbm5lcicsMTQwMCksc2lkZWJhcl9wcmFkemlhOnNiP3NiLm91dGVySFRNTC5yZXBsYWNlKC9ccysvZywnICcpLnNsaWNlKDAsMTUwMCk6bnVsbCxzaWRlYmFyX251b3JvZG9zOmxpbmtzLGFrdHl2dXM6Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy55aXRoLXdjYW4tYWN0aXZlLWZpbHRlcnMgLmFjdGl2ZS1maWx0ZXItbGFiZWwsIC55aXRoLXdjYW4tYWN0aXZlLWZpbHRlcnMgYSwgLndpZGdldF9sYXllcmVkX25hdl9maWx0ZXJzIGxpLCAuY2hvc2VuLCAueWl0aC13Y2FuLWZpbHRlciAuYWN0aXZlJyldLm1hcChlPT5lLmNsYXNzTmFtZS50b1N0cmluZygpLnNsaWNlKDAsNDApKyc6JysoZS5pbm5lclRleHR8fCcnKS50cmltKCkuc2xpY2UoMCwzMCkpLnNsaWNlKDAsOCksdXJsOmxvY2F0aW9uLnNlYXJjaH19KSgpCkpTOwogICAgJHJbJ3Nob3RzJ109WwogICAgICBbJ24nPT4nY2MxX2thdCcsJ3UnPT4kSywndyc9PjM5MCwnaCc9Pjg0NCwnZXZhbCc9PiRldl0sCiAgICAgIFsnbic9PidjYzJfa2F0X2ZpbHRyYXMnLCd1Jz0+JEsuJz9maWx0ZXJfZ3J1ZHUtdGlwYXM9YmUtZ3J1ZHUmcXVlcnlfdHlwZV9ncnVkdS10aXBhcz1vcicsJ3cnPT4zOTAsJ2gnPT44NDQsJ2V2YWwnPT4kZXZdLAogICAgXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-203727';
const GKEY='ps_s1740cc';
const PHASES=["1"];
const OUT='analize/s1740cc.json';
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
