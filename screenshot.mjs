process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODN0IGog4oCUIGRlc2sucGhwIGtsYXVzaW1hcygpL2tsYXVzaW1vX2VpbHV0ZXMoKSBpciBkYXJiYWxhdWtpcy5waHAgZWlsdcSNacWzIGLFq2tsxJc6IHByYWxlaXN0aSBNbk0gcmlua2luaW8ga29udGVpbmVyxK87IGJhayBhYmllbTsgdG9rZW5fZ2V0X2FsbDsgcGF0aWtyYSAjMTA1My4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODN0aiddKSkgcmV0dXJuOyAkbz1hcnJheSgndic9PidTMTY4M3QgaicpOyAkdT13cF91cGxvYWRfZGlyKCk7ICRiZD0kdVsnYmFzZWRpciddLicvcHMtYmFja3Vwcy8nOwogICRtbm09IlwkaXQtPmdldF9tZXRhKCAnX21ubV9jb25maWcnICkgfHwgXCRpdC0+Z2V0X21ldGEoICdfbW5tX2NvbnRhaW5lcl9zaXplJyApIjsKICAkZmlsZXM9YXJyYXkoCiAgICAncGV0c2hvcC1kZXNrLnBocCc9PmFycmF5KCdtZDUnPT4nMzNjOWIxZmVhMjQyZjg3YThlZDE4OWUyZGZkOTI5MGUnLCdtYXAnPT5hcnJheSgKICAgICAgIlx0XHRcdGlmICggXCRpdC0+Z2V0X21ldGEoICdfcmVkdWNlZF9zdG9jaycgKSB8fCBcJGl0LT5nZXRfbWV0YSggJ19wc19hdl9yZWR1Y2VkJyApICkgeyBjb250aW51ZTsgfVxuXHRcdFx0XCRwaWQgPSBcJGl0LT5nZXRfcHJvZHVjdF9pZCgpO1xuXHRcdFx0aWYgKCAhIFwkcGlkICkgeyBjb250aW51ZTsgfVxuXHRcdFx0XCRmaWtzdW90YSI9PiJcdFx0XHRpZiAoIFwkaXQtPmdldF9tZXRhKCAnX3JlZHVjZWRfc3RvY2snICkgfHwgXCRpdC0+Z2V0X21ldGEoICdfcHNfYXZfcmVkdWNlZCcgKSApIHsgY29udGludWU7IH1cblx0XHRcdGlmICggJG1ubSApIHsgY29udGludWU7IH0gLy8gUzE2ODM6IHJpbmtpbmlvIGtvbnRlaW5lcmlzIOKAlCBsaWt1dGlzIGtvbXBvbmVudHVvc2Vcblx0XHRcdFwkcGlkID0gXCRpdC0+Z2V0X3Byb2R1Y3RfaWQoKTtcblx0XHRcdGlmICggISBcJHBpZCApIHsgY29udGludWU7IH1cblx0XHRcdFwkZmlrc3VvdGEiLAogICAgICAiXHRcdFx0aWYgKCBcJGl0LT5nZXRfbWV0YSggJ19yZWR1Y2VkX3N0b2NrJyApIHx8IFwkaXQtPmdldF9tZXRhKCAnX3BzX2F2X3JlZHVjZWQnICkgKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcJHBpZCA9IFwkaXQtPmdldF9wcm9kdWN0X2lkKCk7XG5cdFx0XHRpZiAoICEgXCRwaWQgKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcJGZpeCA9Ij0+Ilx0XHRcdGlmICggXCRpdC0+Z2V0X21ldGEoICdfcmVkdWNlZF9zdG9jaycgKSB8fCBcJGl0LT5nZXRfbWV0YSggJ19wc19hdl9yZWR1Y2VkJyApICkgeyBjb250aW51ZTsgfVxuXHRcdFx0aWYgKCAkbW5tICkgeyBjb250aW51ZTsgfSAvLyBTMTY4Mzogcmlua2luaW8ga29udGVpbmVyaXNcblx0XHRcdFwkcGlkID0gXCRpdC0+Z2V0X3Byb2R1Y3RfaWQoKTtcblx0XHRcdGlmICggISBcJHBpZCApIHsgY29udGludWU7IH1cblx0XHRcdFwkZml4ID0iKSksCiAgICAncGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnPT5hcnJheSgnbWQ1Jz0+JzhiMmY4OTZiMjAyMGZlMDkxNzllMzU3YjY3MjllMjY0JywnbWFwJz0+YXJyYXkoCiAgICAgICJcdFx0XHRcJGF0cyA9IChzdHJpbmcpIFwkaXQtPmdldF9tZXRhKCAnX3BzX2F0c2F1a3RhJyApOyBpZiAoIFwkYXRzICkgeyBcJHJlZHVjZWQgPSB0cnVlOyB9Ij0+Ilx0XHRcdGlmICggJG1ubSApIHsgXCRyZWR1Y2VkID0gdHJ1ZTsgfSAvLyBTMTY4Mzogcmlua2luaW8gKE1peC1hbmQtTWF0Y2gpIGtvbnRlaW5lcmlzIOKAlCBsaWt1dGlzIGtvbXBvbmVudHVvc2UsIHRyxatrdW1vIG5lc2thacSNaXVvamFtXG5cdFx0XHRcJGF0cyA9IChzdHJpbmcpIFwkaXQtPmdldF9tZXRhKCAnX3BzX2F0c2F1a3RhJyApOyBpZiAoIFwkYXRzICkgeyBcJHJlZHVjZWQgPSB0cnVlOyB9IikpKTsKICBmb3JlYWNoKCRmaWxlcyBhcyAkbj0+JGMpeyAkZj1XUE1VX1BMVUdJTl9ESVIuJy8nLiRuOyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKG1kNSgkcykhPT0kY1snbWQ1J10peyAkb1snU1RPUCddPSRuLicgbWQ1JzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgIGZvcmVhY2goJGNbJ21hcCddIGFzICRhPT4kYikgaWYoc3Vic3RyX2NvdW50KCRzLCRhKSE9PTEpeyAkb1snU1RPUCddPSRuLicgbmVyYXN0YS9rYXJ0b2phc2k6ICcuc3Vic3RyKCRhLDAsNjApLicgPScuc3Vic3RyX2NvdW50KCRzLCRhKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICRuZXc9c3RyX3JlcGxhY2UoYXJyYXlfa2V5cygkY1snbWFwJ10pLGFycmF5X3ZhbHVlcygkY1snbWFwJ10pLCRzKTsgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuZXcsVE9LRU5fUEFSU0UpO31jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snU1RPUCddPSRuLicgJy4kZS0+Z2V0TWVzc2FnZSgpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgJGZpbGVzWyRuXVsnbmV3J109JG5ldzsgfQogIGZvcmVhY2goJGZpbGVzIGFzICRuPT4kYyl7ICRmPVdQTVVfUExVR0lOX0RJUi4nLycuJG47ICRiYWs9JGJkLiRuLicuYmFrX3MxNjgzJzsgaWYoIWZpbGVfZXhpc3RzKCRiYWspKSBmaWxlX3B1dF9jb250ZW50cygkYmFrLGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk7IGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRjWyduZXcnXSk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgJG9bJG5dPWFycmF5KCdiYWsnPT5tZDVfZmlsZSgkYmFrKT09PSRjWydtZDUnXSwnbWQ1X3BvJz0+bWQ1X2ZpbGUoJGYpKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-062132';
const GKEY='ps_s1683tj';
const PHASES=["A"];
const OUT='analize/s1683t_j.json';
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
