process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIGZlZWQgdjIuNCB0YWlzeWtsaXUgZHJ5LXJ1biAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjcxYiddKSB8fCAkX0dFVFsncHNfczE2NzFiJ10hPT0nQjEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoJ3YnPT4nUzE2NzFiMScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgdHJ5IHsKICAgICRpZHMgPSBwc19mZWVkc19pZHMoKTsgJG9bJ2lkcyddPWNvdW50KCRpZHMpOwogICAgJHN0PWFycmF5KCdBJz0+MCwnQic9PjAsJ0MnPT4wLCdEJz0+MCwnWCc9PjAsJ291dF9vZl9zdG9jayc9PjAsJ2FrY2lqYSc9PjAsJ2x0dic9PjAsJ25lX3Jla2xhbWFpJz0+MCwnb2ZmX2dvb2dsZSc9PjApOyAkbHR2PWFycmF5KCk7ICRuZXI9YXJyYXkoKTsgJG9vcz1hcnJheSgpOyAkc2FsZT1hcnJheSgpOyAkcGFrX2J5X3NhbmQ9YXJyYXkoKTsgJGV4Y2xfa2l0YT1hcnJheSgpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7IGlmKCd5ZXMnPT09Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19mZWVkX29mZl9nb29nbGUnLHRydWUpKXskc3RbJ29mZl9nb29nbGUnXSsrO2NvbnRpbnVlO30gJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOyAkaz0oZmxvYXQpJHByLT5nZXRfcHJpY2UoKTsgaWYoJGs8PTApIGNvbnRpbnVlOwogICAgICAkbGlrPSRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7IGlmKCRsaWs9PT1udWxsKSAkbGlrPSRwci0+aXNfaW5fc3RvY2soKT8xOjA7IGlmKCRsaWs8PTApeyAkc3RbJ291dF9vZl9zdG9jayddKys7IGlmKGNvdW50KCRvb3MpPDEwKSRvb3NbXT0kaWQuJyAnLm1iX3N1YnN0cigkcHItPmdldF9uYW1lKCksMCw0MCk7IH0KICAgICAgJHNhdj0wOyBmb3JlYWNoKGFycmF5KCdfY29zdF9wcmljZScsJ192Zl9jb3N0JywnX3piX2Nvc3QnKSBhcyAkc2speyAkc3Y9KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsKHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwkc2ssdHJ1ZSkpOyBpZigkc3Y+MCl7JHNhdj0kc3Y7YnJlYWs7fSB9CiAgICAgICRrYj0kay8xLjIxOyAkbT0kc2F2PjA/MTAwKigka2ItJHNhdikvJGtiOm51bGw7ICRwYWs9JG09PT1udWxsPydYJzooJG0+PTM1PydBJzooJG0+PTI4PydCJzooJG0+PTIwPydDJzonRCcpKSk7ICRzdFskcGFrXSsrOwogICAgICAkc2FuZD0oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpOyAkcGFrX2J5X3NhbmRbJHNhbmQ/Oic/J11bJHBha109KCRwYWtfYnlfc2FuZFskc2FuZD86Jz8nXVskcGFrXT8/MCkrMTsKICAgICAgJHJlZz0kcHItPmdldF9yZWd1bGFyX3ByaWNlKCk7IGlmKCRwci0+aXNfb25fc2FsZSgpICYmICRyZWchPT0nJyAmJiAoZmxvYXQpJHJlZz4kayl7ICRzdFsnYWtjaWphJ10rKzsgaWYoY291bnQoJHNhbGUpPDUpJHNhbGVbXT0kaWQuJyAnLiRyZWcuJ+KGkicuJGs7IH0KICAgICAgJGJ0PWdldF90aGVfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyk7ICRicj0oJGJ0JiYhaXNfd3BfZXJyb3IoJGJ0KSk/JGJ0WzBdLT5uYW1lOicnOyAkbm09JHByLT5nZXRfbmFtZSgpOyAka2c9KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsKHN0cmluZykkcHItPmdldF93ZWlnaHQoKSk7CiAgICAgIGlmKCRicj09PSdRdWF0dHJvJyl7ICRzdFsnbmVfcmVrbGFtYWknXSsrOyBpZihjb3VudCgkbmVyKTwzKSRuZXJbXT0kaWQ7IH0KICAgICAgZWxzZWlmKCRicj09PSdFeGNsdXNpb24nKXsgaWYoJGtnPj02LjUgfHwgcHJlZ19tYXRjaCgnL1xiKDd8MTIpXHMqa2dcYi9pdScsJG5tKSl7ICRzdFsnbHR2J10rKzsgJGx0dltdPWFycmF5KCRpZCxyb3VuZCgkaywyKSwka2csJHBhaywkbGlrLG1iX3N1YnN0cigkbm0sMCw3MCkpOyB9IGVsc2UgeyAkZXhjbF9raXRhW109YXJyYXkoJGlkLHJvdW5kKCRrLDIpLCRrZyxtYl9zdWJzdHIoJG5tLDAsNjApKTsgfSB9CiAgICB9CiAgICAkb1snc3QnXT0kc3Q7ICRvWydwYWtfYnlfc2FuZCddPSRwYWtfYnlfc2FuZDsgJG9bJ2x0diddPSRsdHY7ICRvWydleGNsdXNpb25fbmVfbHR2X24nXT1jb3VudCgkZXhjbF9raXRhKTsgJG9bJ2V4Y2x1c2lvbl9uZV9sdHYnXT1hcnJheV9zbGljZSgkZXhjbF9raXRhLDAsNDApOyAkb1snb29zX3B2eiddPSRvb3M7ICRvWydzYWxlX3B2eiddPSRzYWxlOyAkb1snbmVyX3B2eiddPSRuZXI7CiAgICAkb1snYW1icm9zaWEnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgQU5EIHQubmFtZT0nQW1icm9zaWEnIEpPSU4geyRwfXBvc3RzIHAgT04gcC5JRD10ci5vYmplY3RfaWQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgICAkb1sndHZlbmtpbmlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDUwKSB0LCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3N0b2NrJyBMSU1JVCAxKSBzLCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3ByaWNlJyBMSU1JVCAxKSBrIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklEIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgQU5EIHQuc2x1Zz0ndHZlbmtpbml1LXp1dnUtbWFpc3RhcycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIsIEFSUkFZX0EpOwogIH0gY2F0Y2ggKFRocm93YWJsZSAkZSkgeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-153813';
const GKEY='ps_s1671b';
const PHASES=["B1"];
const OUT='analize/s1671_b1.json';
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
