process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjYzIG51bWVyYWNpamEgZGVwbG95K2UyZSAoRC9UL0NMKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfczE2NjNiJ10pPyRfR0VUWydwc19zMTY2M2InXTonJzsgaWYoIWluX2FycmF5KCRmLGFycmF5KCdEJywnVCcsJ0NMJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjYzQicsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgaWYoJGY9PT0nRCcpewogICAgICAka29kYXMgPSA8PDwnS09EQVMnCi8qKgogKiBQZXRzaG9wIFV6c2FreW11IE51bWVyYWNpamEgdjEuMCAod29vY29tbWVyY2Vfb3JkZXJfbnVtYmVyIGZpbHRyYXMpCiAqCiAqIFMxNjYzIChSYWltaW8gc3ByZW5kaW1hcyAyMDI2LTA5LTA5KToga2xpZW50dWkgcm9kb21pIG51b3Nla2x1cyB1enNha3ltdQogKiBudW1lcmlhaSBudW8gMTAwMCAodmlkaW5pcyBJRCBsaWVrYSAzNXh4eCDigJQgUGF5c2VyYS9zaXVudG9zL0RCIG5lc2lrZWljaWEpLgogKiBDb3VudGVyIGBwZXRzaG9wX29yZGVyX2NvdW50ZXJgID0gS0lUQVMgbnVtZXJpcyAoa2FpcCBBVlBOL0tSL0lBUFYvUFBLKS4KICogUHJpc2tpcmlhbWEga3VyaWFudCB1enNha3ltYTsgY2hlY2tvdXQtZHJhZnQgcHJhbGVpZHppYW1hcyAobnVtZXJpdQogKiBuZWRlZ2luYW0ganVvZHJhc2NpYW1zKSDigJQgcHJpc2tpcmlhbWEgaXNlanVzIGlzIGRyYWZ0LgogKiBTZW5pIHV6c2FreW1haSBiZSBtZXRvcyByb2RvIHNhdm8gSUQgKDM1ODY44oCTMzU4NzYgcGFsaWt0aSDigJQgUmFpbWlvIHNwcmVuZGltYXMpLgogKi8KZnVuY3Rpb24gcGV0c2hvcF9wcmlza2lydGlfdXpzYWt5bW9fbnIoICRvcmRlciApIHsKCWlmICggISAkb3JkZXIgaW5zdGFuY2VvZiBXQ19PcmRlciB8fCAnc2hvcF9vcmRlcicgIT09ICRvcmRlci0+Z2V0X3R5cGUoKSApIHJldHVybjsKCWlmICggJG9yZGVyLT5nZXRfbWV0YSggJ19wc19vcmRlcl9udW1iZXInICkgKSByZXR1cm47CglpZiAoIGluX2FycmF5KCAkb3JkZXItPmdldF9zdGF0dXMoKSwgYXJyYXkoICdjaGVja291dC1kcmFmdCcsICdhdXRvLWRyYWZ0JyApLCB0cnVlICkgKSByZXR1cm47CglnbG9iYWwgJHdwZGI7Cgkkd3BkYi0+cXVlcnkoICJVUERBVEUgeyR3cGRiLT5vcHRpb25zfSBTRVQgb3B0aW9uX3ZhbHVlID0gTEFTVF9JTlNFUlRfSUQob3B0aW9uX3ZhbHVlICsgMSkgV0hFUkUgb3B0aW9uX25hbWUgPSAncGV0c2hvcF9vcmRlcl9jb3VudGVyJyIgKTsKCSRuYXVqYXMgPSAoaW50KSAkd3BkYi0+Z2V0X3ZhciggJ1NFTEVDVCBMQVNUX0lOU0VSVF9JRCgpJyApOwoJaWYgKCAkbmF1amFzIDwgMiApIHJldHVybjsgLy8gb3BjaWpvcyBuZXJhIOKAlCBnZXJpYXUgSUQgbmVpIDAvMQoJJG9yZGVyLT51cGRhdGVfbWV0YV9kYXRhKCAnX3BzX29yZGVyX251bWJlcicsICRuYXVqYXMgLSAxICk7Cgkkb3JkZXItPnNhdmUoKTsKfQphZGRfYWN0aW9uKCAnd29vY29tbWVyY2VfbmV3X29yZGVyJywgZnVuY3Rpb24oICRvcmRlcl9pZCwgJG9yZGVyID0gbnVsbCApIHsKCXBldHNob3BfcHJpc2tpcnRpX3V6c2FreW1vX25yKCAkb3JkZXIgPyAkb3JkZXIgOiB3Y19nZXRfb3JkZXIoICRvcmRlcl9pZCApICk7Cn0sIDIwLCAyICk7CmFkZF9hY3Rpb24oICd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfY2hhbmdlZCcsIGZ1bmN0aW9uKCAkb3JkZXJfaWQsICRzZW4sICRuYXVqLCAkb3JkZXIgKSB7CglpZiAoICdjaGVja291dC1kcmFmdCcgPT09ICRzZW4gKSBwZXRzaG9wX3ByaXNraXJ0aV91enNha3ltb19uciggJG9yZGVyICk7Cn0sIDIwLCA0ICk7CmFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9vcmRlcl9udW1iZXInLCBmdW5jdGlvbiggJG5yLCAkb3JkZXIgKSB7CgkkbSA9ICRvcmRlciBpbnN0YW5jZW9mIFdDX09yZGVyID8gJG9yZGVyLT5nZXRfbWV0YSggJ19wc19vcmRlcl9udW1iZXInICkgOiAnJzsKCXJldHVybiAkbSA/IChzdHJpbmcpICRtIDogJG5yOwp9LCAxMCwgMiApOwpLT0RBUzsKICAgICAgdG9rZW5fZ2V0X2FsbCgnPD9waHAgJy4ka29kYXMsIFRPS0VOX1BBUlNFKTsKICAgICAgJHBhdj0nUGV0c2hvcCBVenNha3ltdSBOdW1lcmFjaWphIHYxLjAgKHdvb2NvbW1lcmNlX29yZGVyX251bWJlciBmaWx0cmFzKSc7CiAgICAgICRlcz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgbmFtZT0lcyIsJHBhdiksQVJSQVlfQSk7CiAgICAgICRzPW5ldyBcQ29kZV9TbmlwcGV0c1xTbmlwcGV0KCk7CiAgICAgIGlmKCRlcykgJHMtPmlkPShpbnQpJGVzWydpZCddOwogICAgICAkcy0+bmFtZT0kcGF2OyAkcy0+Y29kZT0ka29kYXM7ICRzLT5zY29wZT0nZ2xvYmFsJzsgJHMtPmFjdGl2ZT10cnVlOyAkcy0+cHJpb3JpdHk9MTA7CiAgICAgICRzLT5kZXNjPSdOdW9zZWtsdXMgdXpzYWt5bXUgbnVtZXJpYWkgbnVvIDEwMDAuIFMxNjYzLic7CiAgICAgICRyPVxDb2RlX1NuaXBwZXRzXHNhdmVfc25pcHBldCgkcyk7CiAgICAgICRvWydzbmlwX2lkJ109aXNfb2JqZWN0KCRyKT8kci0+aWQ6JHI7CiAgICAgIGFkZF9vcHRpb24oJ3BldHNob3Bfb3JkZXJfY291bnRlcicsOTk5LCcnLCdubycpIHx8IHVwZGF0ZV9vcHRpb24oJ3BldHNob3Bfb3JkZXJfY291bnRlcicsOTk5KTsKICAgICAgJG9bJ2NvdW50ZXInXT1nZXRfb3B0aW9uKCdwZXRzaG9wX29yZGVyX2NvdW50ZXInKTsKICAgICAgJGg9d3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7CiAgICAgICRvWydoZWFydGJlYXQnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaCk7CiAgICB9IGVsc2VpZigkZj09PSdUJyl7CiAgICAgICRvcmQ9d2NfY3JlYXRlX29yZGVyKCk7ICRvcmQtPnNldF9zdGF0dXMoJ3BlbmRpbmcnKTsgJG9yZC0+c2F2ZSgpOwogICAgICAkb3JkPXdjX2dldF9vcmRlcigkb3JkLT5nZXRfaWQoKSk7CiAgICAgICRvWyd0ZXN0X29pZCddPSRvcmQtPmdldF9pZCgpOwogICAgICAkb1sndGVzdF9uciddPSRvcmQtPmdldF9vcmRlcl9udW1iZXIoKTsKICAgICAgJG9bJ3NlbmFzXzM1ODcyJ109d2NfZ2V0X29yZGVyKDM1ODcyKS0+Z2V0X29yZGVyX251bWJlcigpOwogICAgICAkb1snY291bnRlcl9wbyddPWdldF9vcHRpb24oJ3BldHNob3Bfb3JkZXJfY291bnRlcicpOwogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTY2M190ZXN0X29pZCcsJG9yZC0+Z2V0X2lkKCkpOwogICAgfSBlbHNlIHsKICAgICAgJG9pZD0oaW50KWdldF9vcHRpb24oJ3BzX3MxNjYzX3Rlc3Rfb2lkJyk7CiAgICAgIGlmKCRvaWQpeyAkb2Q9d2NfZ2V0X29yZGVyKCRvaWQpOyBpZigkb2QpICRvZC0+ZGVsZXRlKHRydWUpOyAkb1snaXN0cmludGEnXT0kb2lkOyBkZWxldGVfb3B0aW9uKCdwc19zMTY2M190ZXN0X29pZCcpOyB9CiAgICAgICRvWydjb3VudGVyJ109Z2V0X29wdGlvbigncGV0c2hvcF9vcmRlcl9jb3VudGVyJyk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-122824';
const GKEY='ps_s1663b';
const PHASES=["D", "T", "CL"];
const OUT='analize/s1663_b.json';
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

