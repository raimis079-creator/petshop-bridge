process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQwZyBkdW5uaW5nLTEgKyAyIGNhcnQgZHJhZnQgaSB0ZXJyYUAgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19wNiddKT8kX0dFVFsncHNfcDYnXTonJykhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY0MGcnKTsKICB0cnl7CiAgICAkb3JkPXdjX2dldF9vcmRlcigzNTg2Nik7CiAgICAvLyBkdW5uaW5nLTEgcGVyIHNhYmxvbmEKICAgICRwYXlsb2FkPWFycmF5KCdvcmRlcl9udW1iZXInPT4kb3JkLT5nZXRfb3JkZXJfbnVtYmVyKCksJ3RvdGFsJz0+d2NfcHJpY2UoJG9yZC0+Z2V0X3RvdGFsKCkpLAogICAgICAnbmFtZSc9PidSYWltdW5kYXMnLCdwYXlfdXJsJz0+JG9yZC0+Z2V0X2NoZWNrb3V0X3BheW1lbnRfdXJsKCksCiAgICAgICdvcmRlcl91cmwnPT4nJywnbWV0aG9kJz0+J1BheXNlcmEnLCdleHBpcmVzX2F0Jz0+JycpOwogICAgJHJlY2lwaWVudD0ndGVycmFAcGV0c2hvcC5sdCc7ICRmbG93X2NsYXNzPSd0cmFuc2FjdGlvbmFsJzsgJHN1YmplY3Q9Jyc7CiAgICBvYl9zdGFydCgpOyBpbmNsdWRlIFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy9kdW5uaW5nLTEucGhwJzsKICAgICRvdXQ9b2JfZ2V0X2NsZWFuKCk7CiAgICAkaHRtbD1pc3NldCgkaHRtbCk/JGh0bWw6KGlzc2V0KCRib2R5KSYmY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0VtYWlsX0xheW91dCcpP1BldHNob3BfRW1haWxfTGF5b3V0Ojp3cmFwKGFycmF5KCRib2R5KSk6JG91dCk7CiAgICBpZighaXNfc3RyaW5nKCRodG1sKXx8c3RybGVuKCRodG1sKTwxMDApeyAkdmFycz1nZXRfZGVmaW5lZF92YXJzKCk7ICRvWydkdW5uaW5nX2tpbnQnXT1hcnJheV9rZXlzKCR2YXJzKTsgdGhyb3cgbmV3IEV4Y2VwdGlvbignZHVubmluZyBodG1sIHR1c2NpYXMnKTsgfQogICAgJG9rPXdwX21haWwoJHJlY2lwaWVudCwnW1BFUsW9ScWqUkFdICcuJHN1YmplY3QsJGh0bWwsYXJyYXkoJ0NvbnRlbnQtVHlwZTogdGV4dC9odG1sOyBjaGFyc2V0PVVURi04JykpOwogICAgJG9bJ2R1bm5pbmcnXT1hcnJheSgnc3ViamVjdCc9PiRzdWJqZWN0LCdpc3NpdXN0YSc9PiRvaz8xOjApOwogICAgLy8gY2FydCBkcmFmdGFpCiAgICBnbG9iYWwgJHdwZGI7ICRUPSR3cGRiLT5wcmVmaXguJ3BzX2VtYWlsX2NvbnRlbnQnOwogICAgZm9yZWFjaChhcnJheSgnY2FydF9hYmFuZG9uZWQnLCdjYXJ0X2FiYW5kb25lZF8yJykgYXMgJGZsKXsKICAgICAgJHI9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00gYCRUYCBXSEVSRSBmbG93PSVzIE9SREVSIEJZIHZlcnNpb24gREVTQyBMSU1JVCAxIiwkZmwpLEFSUkFZX0EpOwogICAgICAkYmw9anNvbl9kZWNvZGUoKHN0cmluZykkclsnYmxvY2tzX2pzb24nXSx0cnVlKTsgJGg9Jyc7CiAgICAgIGZvcmVhY2goKGFycmF5KSRibCBhcyAkYil7CiAgICAgICAgJHQ9JGJbJ3QnXT8/Jyc7IAogICAgICAgIGlmKCR0PT09J3AnKXsgJGguPSc8cD4nLm5sMmJyKGVzY19odG1sKCRiWyd0ZXh0J10/PycnKSkuJzwvcD4nOyB9CiAgICAgICAgZWxzZWlmKCR0PT09J2gnfHwkdD09PSdoMicpeyAkaC49JzxoMj4nLmVzY19odG1sKCRiWyd0ZXh0J10/PycnKS4nPC9oMj4nOyB9CiAgICAgICAgZWxzZWlmKCR0PT09J2J1dHRvbicpeyAkaC49JzxwPjxhIGhyZWY9IiMiIHN0eWxlPSJkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOiMyZDZhMzU7Y29sb3I6I2ZmZjtwYWRkaW5nOjEwcHggMThweDtib3JkZXItcmFkaXVzOjVweDt0ZXh0LWRlY29yYXRpb246bm9uZSI+Jy5lc2NfaHRtbCgkYlsnbGFiZWwnXT8/JGJbJ3RleHQnXT8/J1TEmXN0aScpLic8L2E+IDxlbT4obnVvcm9kYTogJy5lc2NfaHRtbCgkYlsndXJsJ10/Pyd7cmVjb3ZlcnlfdXJsfScpLicpPC9lbT48L3A+JzsgfQogICAgICAgIGVsc2VpZigkdD09PSdpdGVtcycpeyAkaC49JzxwIHN0eWxlPSJib3JkZXI6MXB4IGRhc2hlZCAjOTk5O3BhZGRpbmc6MTBweCI+PGVtPlvEjGlhIOKAlCBrcmVwxaFlbGlvIHByZWtpxbMgYmxva2FzOiBudW90cmF1a2EsIHBhdmFkaW5pbWFzLCBrYWluYTsgxaFhbHRpbmlzICcuZXNjX2h0bWwoJGJbJ3NhbHRpbmlzJ10/PycnKS4nXTwvZW0+PC9wPic7IH0KICAgICAgICBlbHNlaWYoJHQ9PT0nbXV0ZWQnKXsgJGguPSc8cCBzdHlsZT0iY29sb3I6Izc3Nztmb250LXNpemU6MTJweCI+Jy5lc2NfaHRtbCgkYlsndGV4dCddPz8nJykuJzwvcD4nOyB9CiAgICAgICAgZWxzZSB7ICRoLj0nPHAgc3R5bGU9ImNvbG9yOiM5OTkiPjxlbT5bYmxva2FzICcuZXNjX2h0bWwoJHQpLic6ICcuZXNjX2h0bWwobWJfc3Vic3RyKGpzb25fZW5jb2RlKCRiLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsMTIwKSkuJ108L2VtPjwvcD4nOyB9CiAgICAgIH0KICAgICAgJHdyYXBwZWQ9Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0VtYWlsX0xheW91dCcpP1BldHNob3BfRW1haWxfTGF5b3V0Ojp3cmFwKGFycmF5KCRoKSk6V0MoKS0+bWFpbGVyKCktPndyYXBfbWVzc2FnZSgkclsnc3ViamVjdCddLCRoKTsKICAgICAgd3BfbWFpbCgndGVycmFAcGV0c2hvcC5sdCcsJ1tQRVLFvUnFqlJBIGRyYWZ0IHYnLiRyWyd2ZXJzaW9uJ10uJ10gJy4kclsnc3ViamVjdCddLCR3cmFwcGVkLGFycmF5KCdDb250ZW50LVR5cGU6IHRleHQvaHRtbDsgY2hhcnNldD1VVEYtOCcpKTsKICAgICAgJG9bJGZsXT0naXNzaXVzdGEnOwogICAgfQogICAgJHo9KGFycmF5KWdldF9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfenVybmFsYXMnLGFycmF5KCkpOwogICAgZm9yZWFjaChhcnJheV9zbGljZSgkeiwtMykgYXMgJHgpeyAkb1sneiddW109JHhbJ2xhaWthcyddLicgfCAnLiR4Wyd0ZW1hJ107IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-082024';
const GKEY='ps_p6';
const PHASES=["GO"];
const OUT='analize/s1640_g.json';
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
