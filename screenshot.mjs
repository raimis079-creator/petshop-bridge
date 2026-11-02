process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIzZCBiYXppbmnFsyBhcHJhxaF5bcWzIHBhdGlrcmEgKDEpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyM2QnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxODIzZCddOyAkbz1bXTsKICBmb3JlYWNoKFszMzM0OSwzMzQyNCwzMzQzMCwzMzA4MSwzMzA3OSwzMzA4MywzMzA4NSwzMjcyNCwzMzY1NCwzMzYzMCwzMzYzMiwzMzYzNiwzMzY1MiwzMzcwNiwzMzU4NiwzMzU5MiwzNDA0OCwzMzIwMywzMzU1MCwzMzU1MiwzMzU1NCwzMjQ4MywzMzU5OCwzMzYwOCwzMjQ3NSwzMjQ2NywzMjQ2NSwzMzkyOCwzMzc1MCwzMzc0OCwzMzM1MiwzMzM2MiwzMzM1OCwzMzM1OSwzMzM2NCwzMzM2NSwzMzM2OCwzMzM2OSwzMzM1MywzMzM0OCwzMzM0NCwzMzM0NiwzMzc2OCwzMzc3MiwzMzcwOCwzMzg2NCwzMzg3MCwzMzU3NCwzMzg2NiwzMzg2OCwzMzc3OCwzMzc4MCwzMjQ4MSwzMzczOCwzMzczNiwzMzgxNiwzMzM1NiwzMzM2MCwzMjcxNiwzMzgwNiwzNDA1NCwzMzgwMiwzMzc3NCwzMzc5MCwzMzc4NiwzMzc5NiwzMzc5NCwzMzc3NiwzMzUzOCwzMzUzMiwzMzYwMCwzMzU5NCwzMzYwNiwzMzYwNCwzMjQ2OSwzMjQ3OSwzMjQ3MSwzMjQ3MywzMjQ2MywzMzY3MiwzMzY3NCwzMzYxMiwzMzYxNCwzMzYyMCwzMzYxOCwzMzgxNCwzMzgxMCwzMzM1MCwzMzM1NCwzMzM1NywzMzM2MSwzMzM2MywzMzM2NywzMzQzOCwzMzM0NywzMzQzMiwzMzY1NiwzMzczNCwzMzY1MCwzMzYzNCwzMzgwNCwzNDA1MiwzMzcxMiwzMzcxOCwzMzcyMiwzMzc3MCwzMzgxOCwzMzcwNCwzMzYyMiwzMzc4OCwzMzc5MiwzMzU4OCwzMzIwNSwzMzU0NiwzMzc4MiwzMzU0MCwzMzUzMCwzMzUzNCwzMzk3MiwzMzYwMiwzMzU5NiwzMzY3MCwzMzY3NiwzMzY4MCwzMzYxNiwzMzYxMCwzMzkzMCwzMzc0MCwzMzgxMiwzMzgwOF0gYXMgJGlkKXsgJHA9Z2V0X3Bvc3QoJGlkKTsgJGI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHQ9aHRtbF9lbnRpdHlfZGVjb2RlKGh0bWxfZW50aXR5X2RlY29kZShodG1sX2VudGl0eV9kZWNvZGUoJHAtPnBvc3RfY29udGVudCxFTlRfUVVPVEVTLCdVVEYtOCcpLEVOVF9RVU9URVMsJ1VURi04JyksRU5UX1FVT1RFUywnVVRGLTgnKTsgJHBsPXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyx3cF9zdHJpcF9hbGxfdGFncyhzdHJfcmVwbGFjZSgnPCcsJyA8JywkdCkpKSk7CiAgICAkb1skaWRdPVsnbic9PiRiLT5nZXRfbmFtZSgpLCdsZW4nPT5tYl9zdHJsZW4oJHBsKSwnZXNjJz0+c3Vic3RyX2NvdW50KCRwLT5wb3N0X2NvbnRlbnQsJyZsdDsnKSwnc3VkJz0+cHJlZ19tYXRjaCgnL1N1ZCjEl3zElyl0aXMvdScsJHBsKSwnYW4nPT5wcmVnX21hdGNoKCcvQW5hbGl0aW4vdScsJHBsKSwnc2VyJz0+cHJlZ19tYXRjaCgnL8WgxJdyaW0vdScsJHBsKSwnZW4nPT5wcmVnX21hdGNoKCcvXGIoSW5ncmVkaWVudHN8Q29tcG9zaXRpb258RmVlZGluZylcYi9pJywkcGwpLCd0YmwnPT5zdWJzdHJfY291bnQoJHQsJzx0YWJsZScpLCdleGMnPT5tYl9zdHJsZW4od3Bfc3RyaXBfYWxsX3RhZ3MoJHAtPnBvc3RfZXhjZXJwdCkpLCdpbWcnPT4oaW50KWdldF9wb3N0X3RodW1ibmFpbF9pZCgkaWQpLCdnYWwnPT5jb3VudCgkYi0+Z2V0X2dhbGxlcnlfaW1hZ2VfaWRzKCkpLCd3Jz0+JGItPmdldF93ZWlnaHQoKSwnZWFuJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ196Yl9lYW4nLHRydWUpLCdzdCc9PiRiLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwncmVnJz0+JGItPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0JyksJ2NhdCc9PmltcGxvZGUoJywnLHdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J3NsdWdzJ10pKSwnYnInPT5pbXBsb2RlKCcsJyx3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pKSwncGwnPT5tYl9zdWJzdHIoJHBsLDAsMTYwKV07IH0KICAkclsnbyddPSRvOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-230857';
const GKEY='ps_s1823d';
const PHASES=["1"];
const OUT='analize/s1823_d1.json';
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
