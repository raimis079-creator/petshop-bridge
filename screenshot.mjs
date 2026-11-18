process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkyeSBWZW5pcGFrIGxhdWtvIHJlbWVsaXMgKDEgZGVwbG95LCAyIG51b3RyYXVrb3MsIDkgYXRzdGF0eXRpKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4OTJ5J10pKSByZXR1cm47ICRGPSRfR0VUWydwc19zMTg5MnknXTsgJHI9Wyd2Jz0+J3kxJywnRic9PiRGXTsgZ2xvYmFsICR3cGRiOwogICRaWU09Jy8qIFMxODkyIFZlbmlwYWsgcGHFoXRvbWF0byBsYXVrYXMg4oCTIHBhcmR1b3R1dsSXcyDFvmFsaWEgKi8nOwogICRCTD0kWllNLiJcbmJvZHkgLnZlbmlwYWstcGlja3VwLXdyYXBwZXIgc2VsZWN0LnZlbmlwYWtfcGlja3VwX3BvaW50LFxuYm9keSAudmVuaXBhay1waWNrdXAtd3JhcHBlciAuc2VsZWN0Mi1jb250YWluZXItLWRlZmF1bHQgLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGV7Ym9yZGVyLWNvbG9yOiMzNjVhNTE7fVxuYm9keSAudmVuaXBhay1waWNrdXAtd3JhcHBlciAuc2VsZWN0Mi1jb250YWluZXItLWRlZmF1bHQuc2VsZWN0Mi1jb250YWluZXItLW9wZW4gLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUsXG5ib2R5IC52ZW5pcGFrLXBpY2t1cC13cmFwcGVyIC5zZWxlY3QyLWNvbnRhaW5lci0tZGVmYXVsdC5zZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMgLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUsXG5ib2R5IC52ZW5pcGFrLXBpY2t1cC13cmFwcGVyIHNlbGVjdC52ZW5pcGFrX3BpY2t1cF9wb2ludDpmb2N1c3tib3JkZXItY29sb3I6IzM2NWE1MTtib3gtc2hhZG93OjAgMCAwIDFweCAjMzY1YTUxO291dGxpbmU6MDt9XG4vKiBTMTg5MiBwYWJhaWdhICovIjsKICB0cnl7CiAgICAkY3NzPShzdHJpbmcpd3BfZ2V0X2N1c3RvbV9jc3MoKTsKICAgIGlmKCRGPT09JzEnKXsKICAgICAgaWYoc3RycG9zKCRjc3MsJFpZTSkhPT1mYWxzZSl7ICRyWydqYXUnXT0xOyB9CiAgICAgIGVsc2UgeyBpZihnZXRfb3B0aW9uKCdwc19zMTg5Ml9jc3NfYmFrJyk9PT1mYWxzZSkgdXBkYXRlX29wdGlvbigncHNfczE4OTJfY3NzX2JhaycsJGNzcyxmYWxzZSk7CiAgICAgICAgJHg9d3BfdXBkYXRlX2N1c3RvbV9jc3NfcG9zdChydHJpbSgkY3NzKS4iXG5cbiIuJEJMLiJcbiIpOyAkclsnb2snXT0haXNfd3BfZXJyb3IoJHgpOyAkclsnbGVuJ109W3N0cmxlbigkY3NzKSxzdHJsZW4oKHN0cmluZyl3cF9nZXRfY3VzdG9tX2NzcygpKV07IH0KICAgIH0gZWxzZWlmKCRGPT09JzknKXsKICAgICAgJGI9Z2V0X29wdGlvbigncHNfczE4OTJfY3NzX2JhaycpOyBpZigkYiE9PWZhbHNlKXsgJHg9d3BfdXBkYXRlX2N1c3RvbV9jc3NfcG9zdCgkYik7ICRyWydhdHN0YXR5dGEnXT0haXNfd3BfZXJyb3IoJHgpOyAkclsnbGVuJ109c3RybGVuKChzdHJpbmcpd3BfZ2V0X2N1c3RvbV9jc3MoKSk7IH0KICAgIH0gZWxzZWlmKCRGPT09JzInKXsKICAgICAgJHJbJ3lyYSddPXN0cnBvcygkY3NzLCRaWU0pIT09ZmFsc2U7ICRyWydiYWtfbGVuJ109c3RybGVuKChzdHJpbmcpZ2V0X29wdGlvbigncHNfczE4OTJfY3NzX2JhaycpKTsgJHJbJ3Nob3RzJ109W107CiAgICAgICR1aWQ9NDQ7IGRlbGV0ZV91c2VyX21ldGEoJHVpZCwnX3dvb2NvbW1lcmNlX3BlcnNpc3RlbnRfY2FydF8nLmdldF9jdXJyZW50X2Jsb2dfaWQoKSk7ICR3cGRiLT5kZWxldGUoJHdwZGItPnByZWZpeC4nd29vY29tbWVyY2Vfc2Vzc2lvbnMnLFsnc2Vzc2lvbl9rZXknPT4oc3RyaW5nKSR1aWRdKTsKICAgICAgJGV4cD10aW1lKCkrMypIT1VSX0lOX1NFQ09ORFM7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICAgICAkclsnY29va2llcyddPVtbJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSwnZG9tYWluJz0+J3BldHNob3AubHQnXSxbJ25hbWUnPT4ncHNfanMnLCd2YWx1ZSc9PicxJywnZG9tYWluJz0+J3BldHNob3AubHQnXV07CiAgICAgICRldj0ibmV3IFByb21pc2Uocj0+c2V0VGltZW91dCgoKT0+e2NvbnN0IGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZlbmlwYWstcGlja3VwLXdyYXBwZXIgLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnKTtjb25zdCBzPVsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScpXS5tYXAoeD0+Z2V0Q29tcHV0ZWRTdHlsZSh4KS5ib3JkZXJUb3BDb2xvcik7Y29uc3QgaW5wPVsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjYmlsbGluZ19maXJzdF9uYW1lLCNiaWxsaW5nX2VtYWlsLCNiaWxsaW5nX2NvdW50cnlfZmllbGQgLnNlbGVjdDItc2VsZWN0aW9uJyldLm1hcCh4PT5nZXRDb21wdXRlZFN0eWxlKHgpLmJvcmRlclRvcENvbG9yKTtyKEpTT04uc3RyaW5naWZ5KHt2ZW5pcGFrOmU/Z2V0Q29tcHV0ZWRTdHlsZShlKS5ib3JkZXI6J05FUkEnLHZpc2lfc2VsZWN0MjpzLGtpdGlfbGF1a2FpOmlucCxsb2dvOiEhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndjLXZlbmlwYWstc2hpcHBpbmctbG9nbycpfSkpfSw0NTAwKSkiOwogICAgICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg5Ml8wJywndSc9PmhvbWVfdXJsKCcvP3Q9Jy50aW1lKCkpLCd3Jz0+MzkwLCdoJz0+NDAwXTsKICAgICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTJfMScsJ3UnPT5ob21lX3VybCgnLz9hZGQtdG8tY2FydD0xNjk1MCZxdWFudGl0eT0xJyksJ3cnPT4zOTAsJ2gnPT40MDBdOwogICAgICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg5Ml9wb190ZWwnLCd1Jz0+d2NfZ2V0X2NoZWNrb3V0X3VybCgpLic/YT0xJywndyc9PjM5MCwnaCc9PjI0MDAsJ2Z1bGwnPT4xLCdldmFsJz0+JGV2XTsKICAgICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTJfcG9fcGMnLCd1Jz0+d2NfZ2V0X2NoZWNrb3V0X3VybCgpLic/YT0yJywndyc9PjEzNjYsJ2gnPT4xNTAwLCdmdWxsJz0+MSwnZXZhbCc9PiRldl07CiAgICAgICRyWydzaG90cyddW109WyduJz0+J3MxODkyX3BvX2F0aWRhcnl0YXMnLCd1Jz0+d2NfZ2V0X2NoZWNrb3V0X3VybCgpLic/YT0zJywndyc9PjM5MCwnaCc9PjI0MDAsJ2Z1bGwnPT4xLCdjbGljayc9PicudmVuaXBhay1waWNrdXAtd3JhcHBlciAuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsJ2V2YWwnPT4ibmV3IFByb21pc2Uocj0+c2V0VGltZW91dCgoKT0+e2NvbnN0IGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZlbmlwYWstcGlja3VwLXdyYXBwZXIgLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnKTtyKGdldENvbXB1dGVkU3R5bGUoZSkuYm9yZGVyKycgfCAnK2dldENvbXB1dGVkU3R5bGUoZSkuYm94U2hhZG93LnNsaWNlKDAsNjApKycgfCBvcGVuPScrISFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKSl9LDE1MDApKSJdOwogICAgICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg5Ml9wb19rdXJqZXJpcycsJ3UnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCkuJz9hPTQnLCd3Jz0+MzkwLCdoJz0+MjQwMCwnZnVsbCc9PjEsJ2NsaWNrJz0+J2xhYmVsW2Zvcl49XCJzaGlwcGluZ19tZXRob2RfMF9zaG9wdXBfdmVuaXBha19zaGlwcGluZ19jb3VyaWVyX21ldGhvZFwiXScsJ2V2YWwnPT4ibmV3IFByb21pc2Uocj0+c2V0VGltZW91dCgoKT0+e3IoWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNzaGlwcGluZ19tZXRob2QgbGknKV0ubWFwKGw9PihsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyl8fHt9KS5jaGVja2VkKyc6JytsLmlubmVyVGV4dC5yZXBsYWNlKC9cXFxccysvZywnICcpLnNsaWNlKDAsNDApKS5qb2luKCcgfHwgJykrJyB8IGxhdWthcyBtYXRvbWFzPScrISEoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZlbmlwYWstcGlja3VwLXdyYXBwZXInKXx8e30pLm9mZnNldFBhcmVudCl9LDUwMDApKSJdOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwxKTsK';
const VER='dep-203932';
const GKEY='ps_s1892y';
const PHASES=["2"];
const OUT='analize/s1892_2.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
