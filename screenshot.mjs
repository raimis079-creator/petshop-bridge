process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM4ZCBhbmltb25kYSBsb29rdXAgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19sNCddKT8kX0dFVFsncHNfbDQnXTonJykhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTYzOGQnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkZWlsPWFycmF5KAphcnJheSgnQUFQIDgyNzMwJywnNDAxNzcyMTgyNzMwMCcsMTgsJzYuMjMnKSwKYXJyYXkoJ0FBUCA4MjczMicsJzQwMTc3MjE4MjczMjQnLDMwLCc2LjIzJyksCmFycmF5KCdBQVAgODI3NDYnLCc0MDE3NzIxODI3NDYxJywyNCwnNi4yMycpLAphcnJheSgnQUFQIDgyNDc5LzgnLCc0MDE3NzIxODI0Nzk4JywxOCwnNi4yMycpLAphcnJheSgnQUFQIDgyODAxJywnNDAxNzcyMTgyODAxNycsMTIsJzYuMjMnKSwKYXJyYXkoJ0FBUCA4MjgwMicsJzQwMTc3MjE4MjgwMjQnLDEyLCc2LjIzJyksCmFycmF5KCdBQVAgODI3MzknLCc0MDE3NzIxODI3MzkzJyw2MCwnNy4yOScpLAphcnJheSgnQUFQIDgyNDgyLzgnLCc0MDE3NzIxODI0ODI4JywxMjAsJzcuMjknKSwKYXJyYXkoJ0FBUCA4Mjc0MScsJzQwMTc3MjE4Mjc0MTYnLDkwLCc3LjI5JyksCmFycmF5KCdBQVAgODI3NDInLCc0MDE3NzIxODI3NDIzJywxNTAsJzcuMjknKSwKYXJyYXkoJ0FBUCA4MjQ4NS84JywnNDAxNzcyMTgyNDg1OScsNjAsJzcuMjknKSwKYXJyYXkoJ0FBUCA4Mjc0NCcsJzQwMTc3MjE4Mjc0NDcnLDE1MCwnNy4yOScpLAphcnJheSgnQUFQIDgyNDgzLzgnLCc0MDE3NzIxODI0ODM1Jyw5MCwnNy4yOScpLAphcnJheSgnQUFQIDgyNzQ3JywnNDAxNzcyMTgyNzQ3OCcsMTUwLCc3LjI5JyksCmFycmF5KCdBQVAgODI0ODEvOCcsJzQwMTc3MjE4MjQ4MTEnLDYwLCc3LjI5JyksCmFycmF5KCdBQVAgODI3NjcnLCc0MDE3NzIxODI3Njc2Jyw2MCwnNy4yOScpLAphcnJheSgnQUFQIDgyODA0JywnNDAxNzcyMTgyODA0OCcsMzAsJzcuMjknKSwKYXJyYXkoJ0FBUCA4MjgwNScsJzQwMTc3MjE4MjgwNTUnLDMwLCc3LjI5JyksCmFycmF5KCdBQVAgODI5NzMnLCc0MDE3NzIxODI5NzMxJyw2NiwnMi44MCcpLAphcnJheSgnQUFQIDgyOTY0JywnNDAxNzcyMTgyOTY0OScsNjYsJzIuODAnKSwKYXJyYXkoJ0FBUCA4Mjk2NicsJzQwMTc3MjE4Mjk2NjMnLDg4LCcyLjgwJyksCmFycmF5KCdBQVAgODI5ODkvOCcsJzQwMTc3MjE4Mjk4OTInLDg4LCcyLjgwJyksCmFycmF5KCdBQVAgODI5NzknLCc0MDE3NzIxODI5NzkzJyw4OCwnMi44MCcpLAphcnJheSgnQUFQIDgyOTgwJywnNDAxNzcyMTgyOTgwOScsNjYsJzIuODAnKSwKYXJyYXkoJ0FBSyA4Mzk2Ni84JywnNDAxNzcyMTgzOTY2MicsMzYsJzMuNTUnKSwKYXJyYXkoJ0FBSyA4MzQzOCcsJzQwMTc3MjE4MzQzODQnLDEyOCwnMi4xNScpLAphcnJheSgnQUFLIDgzODYyLzgnLCc0MDE3NzIxODM4NjI3JywxMjgsJzIuNDInKSwKYXJyYXkoJ0FBSyA4MzQ0MicsJzQwMTc3MjE4MzQ0MjEnLDEyOCwnMi4xNScpLAphcnJheSgnQUFLIDgzMjAyLzgnLCc0MDE3NzIxODMyMDIxJyw2NCwnMi4xNScpLAphcnJheSgnQUFLIDgzMzA0LzgnLCc0MDE3NzIxODMzMDQyJyw2NCwnMi4xNScpLAphcnJheSgnQUFLIDgzNDQ4JywnNDAxNzcyMTgzNDQ4MycsOTYsJzIuMTUnKSwKYXJyYXkoJ0FBSyA4MzQ1MycsJzQwMTc3MjE4MzQ1MzcnLDEyOCwnMi4xNScpLAphcnJheSgnQUFLIDgzNDQ5JywnNDAxNzcyMTgzNDQ5MCcsOTYsJzIuMTUnKSwKYXJyYXkoJ0FBSyA4MzQzNycsJzQwMTc3MjE4MzQzNzcnLDEyOCwnMi4xNScpLAphcnJheSgnQUFLIDgzNzI0LzgnLCc0MDE3NzIxODM3MjQ4JywxOCwnNy4wMycpLAphcnJheSgnQUFLIDgzNzIyLzgnLCc0MDE3NzIxODM3MjI0JywxMiwnNy4wMycpLAphcnJheSgnQUFLIDgzOTY5LzgnLCc0MDE3NzIxODM5NjkzJywyNCwnNy4wMycpLAphcnJheSgnQUFLIDgzMTE2JywnNDAxNzcyMTgzMTE2MScsMTIsJzIuNTYnKSwKYXJyYXkoJ0FBSyA4MzExOCcsJzQwMTc3MjE4MzExODUnLDEyLCcyLjU2JykgICAgKTsKICAgIGZvcmVhY2goJGVpbCBhcyAkZSl7CiAgICAgIGxpc3QoJHN5bSwkYmFyLCRxLCRrKT0kZTsKICAgICAgJHI9YXJyYXkoJ3N5bSc9PiRzeW0sJ2Jhcic9PiRiYXIsJ3EnPT4kcSk7CiAgICAgICRoaXRzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgICAiU0VMRUNUIERJU1RJTkNUIHBtLnBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBwbSBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD1wbS5wb3N0X2lkIEFORCBwLnBvc3RfdHlwZSBJTigncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgV0hFUkUgcG0ubWV0YV92YWx1ZT0lcyIsJGJhciksQVJSQVlfQSk7CiAgICAgIGZvcmVhY2goJGhpdHMgYXMgJGgpeyAkcGlkPShpbnQpJGhbJ3Bvc3RfaWQnXTsKICAgICAgICAkclsncmFzdGEnXVtdPWFycmF5KCdpZCc9PiRwaWQsJ3QnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkcGlkKSwwLDU1KSwKICAgICAgICAgICdzdCc9PmdldF9wb3N0X3N0YXR1cygkcGlkKSwnc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc2t1Jyx0cnVlKSwKICAgICAgICAgICdzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLAogICAgICAgICAgJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpLAogICAgICAgICAgJ3ZmJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdmZfcXR5Jyx0cnVlKSwnemInPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9xdHknLHRydWUpLAogICAgICAgICAgJ3RpcGFzJz0+Z2V0X3Bvc3RfdHlwZSgkcGlkKSwnZWFuJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfZWFuJyx0cnVlKSk7CiAgICAgIH0KICAgICAgaWYoZW1wdHkoJHJbJ3Jhc3RhJ10pKXsKICAgICAgICAkczI9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG0ucG9zdF9pZCxwbS5tZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gcG0gV0hFUkUgcG0ubWV0YV9rZXk9J19za3UnIEFORCBwbS5tZXRhX3ZhbHVlIExJS0UgJXMgTElNSVQgMyIsJyUnLiR3cGRiLT5lc2NfbGlrZSh0cmltKHN0cl9yZXBsYWNlKGFycmF5KCdBQVAnLCdBQUsnLCcvOCcsJyAnKSwnJywkc3ltKSkpLiclJyksQVJSQVlfQSk7CiAgICAgICAgZm9yZWFjaCgkczIgYXMgJGgpeyAkclsncGFnYWxfc2t1J11bXT1hcnJheSgnaWQnPT4oaW50KSRoWydwb3N0X2lkJ10sJ3NrdSc9PiRoWydtZXRhX3ZhbHVlJ10sJ3QnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkaFsncG9zdF9pZCddKSwwLDU1KSwnc2FuZCc9PmdldF9wb3N0X21ldGEoJGhbJ3Bvc3RfaWQnXSwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRoWydwb3N0X2lkJ10sJ19zdG9jaycsdHJ1ZSkpOyB9CiAgICAgIH0KICAgICAgJG9bJ2VpbCddW109JHI7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-212637';
const GKEY='ps_l4';
const PHASES=["GO"];
const OUT='analize/s1638_d.json';
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
