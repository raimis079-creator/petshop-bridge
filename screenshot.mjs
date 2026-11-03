process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0cmQgRDIzIDMwMSBpxaFqdW5ndGllbXMgcGFrYW1zICgxIGRyeSwgMiBhcHBseSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI0cmQnXSkpIHJldHVybjsgJEY9JF9HRVRbJ3BzX3MxODI0cmQnXTsgJHI9Wyd2Jz0+J1MxODI0cmQnLCdGJz0+JEYsJ3JtJz0+Y2xhc3NfZXhpc3RzKCdcUmFua01hdGhcUmVkaXJlY3Rpb25zXFJlZGlyZWN0aW9uJyldOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgJGlkcz1bMzc0MTUsMzc0MjQsMzc0MjcsMzc0MzAsMzc0MzMsMzc0MzYsMzc0MzksMzc0NDIsMzc0NDUsMzc0NDgsMzc0NTEsMzc0NTYsMzc0NTcsMzc0NTksMzc0NjAsMzc0NjksMzc0NzIsMzc0NzUsMzc0NzgsMzc0ODEsMzc0ODQsMzc0ODddOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD1nZXRfcG9zdCgkaWQpOyAkYj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKTsgJHE9KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTsKICAgICRiZXN0PTA7ICRicT1QSFBfSU5UX01BWDsgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG0ucG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIFdIRVJFIG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtLm1ldGFfdmFsdWU9JWQiLCRiKSkgYXMgJG8peyAkb3E9KGludClnZXRfcG9zdF9tZXRhKCRvLCdfZHBfcGFja19xdHknLHRydWUpOyBpZigkb3E+JHEgJiYgJG9xPCRicSl7ICRicT0kb3E7ICRiZXN0PShpbnQpJG87IH0gfQogICAgJHNyYz0ncHJvZHVjdC8nLiRwLT5wb3N0X25hbWU7ICR0bz0kYmVzdD9nZXRfcGVybWFsaW5rKCRiZXN0KTonJzsgJHJvdz1bJ2lkJz0+JGlkLCdzdCc9PiRwLT5wb3N0X3N0YXR1cywnc3JjJz0+JHNyYywndG8nPT4kdG9dOwogICAgaWYoJEY9PT0nMicgJiYgJHRvICYmICRyWydybSddKXsgJGV4PSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQgRlJPTSB7JFB9cmFua19tYXRoX3JlZGlyZWN0aW9ucyBXSEVSRSBzb3VyY2VzIExJS0UgJXMiLCclJy4kd3BkYi0+ZXNjX2xpa2UoJHAtPnBvc3RfbmFtZSkuJyUnKSk7IGlmKCEkZXgpeyAkcmQ9XFJhbmtNYXRoXFJlZGlyZWN0aW9uc1xSZWRpcmVjdGlvbjo6ZnJvbShbJ3VybF90byc9PiR0bywnaGVhZGVyX2NvZGUnPT4zMDEsJ3N0YXR1cyc9PidhY3RpdmUnLCdzb3VyY2VzJz0+W1sncGF0dGVybic9PiRzcmMsJ2NvbXBhcmlzb24nPT4nZXhhY3QnLCdpZ25vcmUnPT4nJ11dXSk7ICRyb3dbJ3NhdmVkJ109JHJkLT5zYXZlKCk7IH0gZWxzZSAkcm93WydqYXUnXT0kZXg7IH0KICAgICRyWydvJ11bXT0kcm93OyB9CiAgaWYoJEY9PT0nNSd8fCRGPT09JzYnKXsgZm9yZWFjaCgkclsnbyddIGFzICRpPT4keCl7IGlmKCRGPT09JzUnJiYkaT4wKSBicmVhazsgJHRpZD11cmxfdG9fcG9zdGlkKCR4Wyd0byddKTsgJHNsdWc9YmFzZW5hbWUocGFyc2VfdXJsKGhvbWVfdXJsKCcvJy4keFsnc3JjJ10pLFBIUF9VUkxfUEFUSCkpOyBpZigkdGlkICYmICFpbl9hcnJheSgkc2x1ZywoYXJyYXkpZ2V0X3Bvc3RfbWV0YSgkdGlkLCdfd3Bfb2xkX3NsdWcnKSx0cnVlKSkgYWRkX3Bvc3RfbWV0YSgkdGlkLCdfd3Bfb2xkX3NsdWcnLCRzbHVnKTsgfSBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7ICR0PVtdOyBmb3JlYWNoKGFycmF5X3NsaWNlKCRyWydvJ10sMCwkRj09PSc1Jz8xOjIyKSBhcyAkeCl7ICR5PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nLiR4WydzcmMnXS4nLz9uYz0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjBdKTsgJHRbXT1bd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHkpLHdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHksJ2xvY2F0aW9uJyk9PT0keFsndG8nXV07IH0gJHJbJ3Rlc3QnXT0kdDsgfQogIGlmKCRGPT09JzcnKXsgJG49MDsgZm9yZWFjaCgkclsnbyddIGFzICR4KXsgJHRpZD11cmxfdG9fcG9zdGlkKCR4Wyd0byddKTsgJHNsdWc9YmFzZW5hbWUocGFyc2VfdXJsKGhvbWVfdXJsKCcvJy4keFsnc3JjJ10pLFBIUF9VUkxfUEFUSCkpOyBpZigkdGlkKXsgJG4rPShpbnQpZGVsZXRlX3Bvc3RfbWV0YSgkdGlkLCdfd3Bfb2xkX3NsdWcnLCRzbHVnKTsgfSB9ICRyWydpc3RyaW50YSddPSRuOyB9CiAgaWYoJEY9PT0nNCcpeyAkclsncm93cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHNvdXJjZXMsdXJsX3RvLHN0YXR1cyBGUk9NIHskUH1yYW5rX21hdGhfcmVkaXJlY3Rpb25zIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7ICRyWyduJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1yYW5rX21hdGhfcmVkaXJlY3Rpb25zIFdIRVJFIHNvdXJjZXMgTElLRSAnJXZudC1tb25nZSUnIik7IH0KICBpZigkRj09PScyJyl7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnLycuJHJbJ28nXVswXVsnc3JjJ10uJy8nKSxbJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MF0pOyAkclsndGVzdCddPVt3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkeCwnbG9jYXRpb24nKV07IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-080546';
const GKEY='ps_s1824rd';
const PHASES=["7"];
const OUT='analize/s1824_rd7.json';
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
