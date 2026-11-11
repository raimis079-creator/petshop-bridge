process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQ4YyBaQiBmZWVkIDw9NSBFVVIgdnMgV0MgKyBpc3RvcmlqYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NDhjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyODApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnMTUzNk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDhjJ107CiAgdHJ5ewogICAgJHJbJ21pbl9jb3N0J109ZGVmaW5lZCgnUEVUU0hPUF9YTUxfWkJfTUlOX0NPU1QnKT9QRVRTSE9QX1hNTF9aQl9NSU5fQ09TVDpudWxsOwogICAgJGY9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10uJy9wZXRzaG9wLXByaXZhdGUtbG9ncy96Yi1mZWVkLXMxODQ4LnhtbCc7CiAgICAkeD1zaW1wbGV4bWxfbG9hZF9maWxlKCRmLCdTaW1wbGVYTUxFbGVtZW50JyxMSUJYTUxfTk9DREFUQSk7IGlmKCEkeCkgdGhyb3cgbmV3IEV4Y2VwdGlvbigneG1sJyk7CiAgICAvLyBXQyB6ZW1lbGFwaXMgcGFnYWwgU0tVCiAgICAkd2M9W107IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5tZXRhX3ZhbHVlIHNrdSwgcC5JRCBpZCwgcC5wb3N0X3N0YXR1cyBzdCBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQgQU5EIHAucG9zdF90eXBlIElOKCdwcm9kdWN0JywncHJvZHVjdF92YXJpYXRpb24nKSBXSEVSRSBtLm1ldGFfa2V5IElOKCdfc2t1JywnX3piX3N1cHBsaWVyX3NrdScpIEFORCBtLm1ldGFfdmFsdWU8PicnIixBUlJBWV9BKSBhcyAkdyl7ICR3Y1tzdHJ0b2xvd2VyKHRyaW0oJHdbJ3NrdSddKSldPVsoaW50KSR3WydpZCddLCR3WydzdCddXTsgfQogICAgJHNvbGQ9W107IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCBwaWQsIFNVTShwcm9kdWN0X3F0eSkgcSBGUk9NIHskUH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBHUk9VUCBCWSAxIixBUlJBWV9BKSBhcyAkcykgJHNvbGRbKGludCkkc1sncGlkJ11dPShpbnQpJHNbJ3EnXTsKICAgICRpc3Q9W107ICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyIpOwogICAgaWYoaW5fYXJyYXkoJ3NrdScsJGNvbHMpKXsgJGtjPWluX2FycmF5KCdraWVraXMnLCRjb2xzKT8na2lla2lzJzonMSc7IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTE9XRVIoc2t1KSBzLCBTVU0oJGtjKSBxIEZST00geyRQfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgc2t1PD4nJyBHUk9VUCBCWSAxIixBUlJBWV9BKSBhcyAkcykgJGlzdFskc1sncyddXT0oaW50KSRzWydxJ107IH0KICAgICRyWydpc3RfY29scyddPSRjb2xzOwogICAgJG91dD1bXTsgJG49MDsKICAgIGZvcmVhY2goJHgtPml0ZW1zLT5pdGVtIGFzICRpdCl7ICRuKys7ICRjb3N0PShmbG9hdClzdHJfcmVwbGFjZSgnLCcsJy4nLChzdHJpbmcpJGl0LT5wcmljZSk7IGlmKCRjb3N0PD0wfHwkY29zdD41KSBjb250aW51ZTsKICAgICAgJGNvZGU9dHJpbSgoc3RyaW5nKSRpdC0+Y29kZSk7ICRrPXN0cnRvbG93ZXIoJGNvZGUpOyAkdz0kd2NbJGtdPz9udWxsOyAkaWQ9JHc/JHdbMF06MDsKICAgICAgJHZpcz0nJzsgJHByaWNlPScnOyBpZigkaWQpeyAkdmlzPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHJvcHNoaXBfcGFzbGVwdGEnLHRydWUpPydwYXNsJzonJzsgJHByaWNlPWdldF9wb3N0X21ldGEoJGlkLCdfcHJpY2UnLHRydWUpOyB9CiAgICAgICRvdXRbXT1bJGNvZGUsbWJfc3Vic3RyKHRyaW0oKHN0cmluZykkaXQtPm5hbWUpLDAsOTApLHRyaW0oKHN0cmluZykkaXQtPmJyYW5kKSx0cmltKChzdHJpbmcpJGl0LT5jYXRlZ29yeSkscm91bmQoJGNvc3QsMyksKGZsb2F0KSRpdC0+cnJwLChpbnQpJGl0LT5xdHksdHJpbSgoc3RyaW5nKSRpdC0+ZWFuKSwoZmxvYXQpJGl0LT53ZWlnaHRfYnJ1dHRvLCRpZCwkdz8kd1sxXTonJywkdmlzLCRwcmljZSwkaWQ/KCRzb2xkWyRpZF0/PzApOjAsJGlzdFska10/PzAsKHN0cmluZykkaXQtPmltYWdlcy0+aW1hZ2VbMF0hPT0nJz8xOjBdOwogICAgfQogICAgJHJbJ2ZlZWRfbiddPSRuOyAkclsnbiddPWNvdW50KCRvdXQpOyAkclsnY29scyddPSdjb2RlLG5hbWUsYnJhbmQsY2F0LGNvc3QscnJwLHF0eSxlYW4sd2VpZ2h0LHdjX2lkLHdjX3N0YXR1cyxwYXNsLHdjX3ByaWNlLHNvbGRfVDAsc29sZF9pc3QsaW1nJzsgJHJbJ3AnXT0kb3V0OwogICAgQHVubGluaygkZik7ICRyWydmZWVkX2RlbGV0ZWQnXT0hZmlsZV9leGlzdHMoJGYpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-162307';
const GKEY='ps_s1848c';
const PHASES=["1"];
const OUT='analize/s1848_c.json';
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
