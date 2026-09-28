process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzMxaSAjMTIwOCBrZWl0aW1vIHJlY29uIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTczMWknXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MzFpJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTczMWknLCdmYXplJz0+JGZdOyAkTT1XUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMvJzsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywncHJpdmF0ZScpIEFORCAocG9zdF90aXRsZSBMSUtFICcla2lhdWwlYXVzJScpIik7CiAgICAkaWRzMj0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19za3UnIEFORCBtZXRhX3ZhbHVlIExJS0UgJyUwMDMzMzklJyIpOwogICAgZm9yZWFjaChhcnJheV9tZXJnZSgkaWRzLCRpZHMyKSBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOwogICAgICAkclsncHJla2VzJ11bJGlkXT1bJ24nPT4kcC0+Z2V0X25hbWUoKSwnc2t1Jz0+JHAtPmdldF9za3UoKSwndHlwZSc9PiRwLT5nZXRfdHlwZSgpLCdzdCc9PmdldF9wb3N0X3N0YXR1cygkaWQpLCdrYWluYSc9PiRwLT5nZXRfcHJpY2UoKSwncmVnJz0+JHAtPmdldF9yZWd1bGFyX3ByaWNlKCksJ2thaW5hX3N1X3B2bSc9PndjX2dldF9wcmljZV9pbmNsdWRpbmdfdGF4KCRwKSwnbXMnPT4kcC0+Z2V0X21hbmFnZV9zdG9jaygpLCdzdG9jayc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3MnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdhdic9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9TdG9jaycpP1BldHNob3BfQVZfU3RvY2s6OnF0eSgkaWQpOm51bGwsJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnb3duJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwnY29zdCc9PmdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSksCiAgICAgICAgJ3NyYyc9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxzdG9ja19xdHksY29zdF9uZXQgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSIsJGlkKSxBUlJBWV9BKSwKICAgICAgICAncGFydGlqb3MnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxraWVraXNfbGlrbyxzYXZpa2FpbmFfZXVyLGdhbGlvamFfaWtpIEZST00geyRQfXBzX3BhcnRpam9zIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGtpZWtpc19saWtvPjAgT1JERVIgQlkgaWQiLCRpZCksQVJSQVlfQSldOyB9CiAgICAkbz13Y19nZXRfb3JkZXIoMzY1NTUpOyAkb209W107IGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7IGlmKHN0cnBvcygkbS0+a2V5LCdfcHMnKT09PTB8fHN0cnBvcygkbS0+a2V5LCdfb3JkZXJfc3RvY2snKT09PTApICRvbVskbS0+a2V5XT1tYl9zdWJzdHIoaXNfc2NhbGFyKCRtLT52YWx1ZSk/KHN0cmluZykkbS0+dmFsdWU6anNvbl9lbmNvZGUoJG0tPnZhbHVlLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsMjAwKTsgfQogICAgJHJbJ28nXT1bJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwndG90YWwnPT4kby0+Z2V0X3RvdGFsKCksJ3RheCc9PiRvLT5nZXRfdG90YWxfdGF4KCksJ2Rpc2MnPT4kby0+Z2V0X2Rpc2NvdW50X3RvdGFsKCksJ21ldGEnPT4kb21dOwogICAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGl0KXsgJHJbJ28nXVsnZWlsJ11bJGlpZF09WydwaWQnPT4kaXQtPmdldF9wcm9kdWN0X2lkKCksJ3EnPT4kaXQtPmdldF9xdWFudGl0eSgpLCdzdWInPT4kaXQtPmdldF9zdWJ0b3RhbCgpLCd0b3QnPT4kaXQtPmdldF90b3RhbCgpLCd0YXgnPT4kaXQtPmdldF90b3RhbF90YXgoKSwndGF4ZXMnPT4kaXQtPmdldF90YXhlcygpXTsgfQogICAgJHJbJ28nXVsnZmFrdF9laWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBXSEVSRSB1enNha3ltb19pZD0zNjU1NSIsQVJSQVlfQSkgPzogJHdwZGItPmxhc3RfZXJyb3I7CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRyWydhdl9yZWR1Y2UnXT1maWxlX2dldF9jb250ZW50cygkTS4ncGV0c2hvcC1hdi1yZWR1Y2UucGhwJyk7CiAgICBmb3JlYWNoKFsnUGV0c2hvcF9QYXJ0aWpvcycsJ1BldHNob3BfQVZfT3JkZXInLCdQZXRzaG9wX0Zha3RhaScsJ1BldHNob3BfRGFyYmFsYXVraXMnLCdQZXRzaG9wX0FWX1NvdXJjZSddIGFzICRjKXsgaWYoIWNsYXNzX2V4aXN0cygkYykpIHsgJHJbJ2tsJ11bJGNdPSduZXJhJzsgY29udGludWU7IH0gJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGMpOyAkclsna2wnXVskY11bJ2YnXT1iYXNlbmFtZSgkcmMtPmdldEZpbGVOYW1lKCkpOwogICAgICBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtKXsgaWYoJG0tPmdldERlY2xhcmluZ0NsYXNzKCktPmdldE5hbWUoKSE9PSRjKSBjb250aW51ZTsgJG49JG0tPmdldE5hbWUoKTsgaWYocHJlZ19tYXRjaCgnL251cmFzfGZpa3N8b3JkZXJ8aXJhc3l0aXxyYXN5dGl8Z3J1cGV8ZWlsdXR8a2VsaWFzfHBhcmlua3RpfHV6c2FrfHBlcnNrYWl8bGlrdXRpc3x2eWtkeW0vaScsJG4pKSAkclsna2wnXVskY11bJ20nXVtdPSgkbS0+aXNTdGF0aWMoKT8ncyAnOicnKS4oJG0tPmlzUHVibGljKCk/J3B1YiAnOidwcm90ICcpLiRuLicoJy5pbXBsb2RlKCcsJyxhcnJheV9tYXAoZnVuY3Rpb24oJHApe3JldHVybiAnJCcuJHAtPmdldE5hbWUoKTt9LCRtLT5nZXRQYXJhbWV0ZXJzKCkpKS4nKSBMJy4kbS0+Z2V0U3RhcnRMaW5lKCk7IH0gfQogICAgZ2xvYmFsICR3cF9maWx0ZXI7IGZvcmVhY2goWyd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfcHJvY2Vzc2luZycsJ3dvb2NvbW1lcmNlX3BheW1lbnRfY29tcGxldGUnLCd3b29jb21tZXJjZV9jaGVja291dF9vcmRlcl9wcm9jZXNzZWQnLCd3b29jb21tZXJjZV9jaGVja291dF9jcmVhdGVfb3JkZXJfbGluZV9pdGVtJ10gYXMgJGgpeyAkbz1bXTsgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZ4PSRjYlsnZnVuY3Rpb24nXTsgaWYoaXNfYXJyYXkoJGZ4KSkgJG9bXT0kcHIuJzonLihpc19vYmplY3QoJGZ4WzBdKT9nZXRfY2xhc3MoJGZ4WzBdKTokZnhbMF0pLic6OicuJGZ4WzFdOyBlbHNlaWYoJGZ4IGluc3RhbmNlb2YgQ2xvc3VyZSl7ICRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmeCk7ICRvW109JHByLic6Y2xvc3VyZSAnLmJhc2VuYW1lKCRyZi0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyZi0+Z2V0U3RhcnRMaW5lKCk7IH0gZWxzZSAkb1tdPSRwci4nOicuJGZ4OyB9ICRyWydob29rcyddWyRoXT0kbzsgfQogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-164415';
const GKEY='ps_s1731i';
const PHASES=["1", "2"];
const OUT='analize/s1731_i.json';
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
