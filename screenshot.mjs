process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQycCBMUDoga3VyIGZvcm11b2phbWEgc2l1bnRhIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MnAnXSkpIHJldHVybjsgJHI9W107CiAgJHNjYW49ZnVuY3Rpb24oJGYsJHJlLCRjdHg9MCwkbWF4PTQwKSB7ICRMPUBmaWxlKCRmKTsgJG89W107IGlmKCEkTCkgcmV0dXJuIFsnKG7El3JhKSddOyBmb3JlYWNoKCRMIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgkcmUsJGwpKXsgJG9bXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIocnRyaW0oJGwpLDAsMjAwKTsgaWYoJGN0eCkgZm9yKCRrPTE7JGs8PSRjdHg7JGsrKykgaWYoaXNzZXQoJExbJGkrJGtdKSkgJG9bXT0oJGkrMSskaykuJyAgJy5tYl9zdWJzdHIocnRyaW0oJExbJGkrJGtdKSwwLDIwMCk7IGlmKGNvdW50KCRvKT4kbWF4KSBicmVhazsgfSByZXR1cm4gJG87IH07CiAgJHBsPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluLyc7CiAgJHJbJ2RsJ109JHNjYW4oV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnLCcvKGNyZWF0ZV9wYXJjZWx8cGFyY2VsX3R5cGV8d29vX2xpdGh1YW5pYXBvc3RfW2Etel9dK3xnZXRfbHBfc2hpcHBpbmdfbWV0aG9kfGNhbGxfY291cmllcnxDQUxMX0NPVVJJRVIpLycsMCw0MCk7CiAgJHJbJ3BsdWdpbl9maWx0ZXJzJ109W107ICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJHBsLidhZG1pbicsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsgZm9yZWFjaCgkaXQgYXMgJGYpeyBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsgZm9yZWFjaCgkc2NhbigkZiwnLyhhcHBseV9maWx0ZXJzfGFkZF9maWx0ZXIpXHMqXChccypbXCciXXdvb19saXRodWFuaWFwb3N0X1thLXpfXSoocGFyY2VsfHJlcXVlc3R8Y3JlYXRlfHNoaXBwaW5nfG9yZGVyX2FjdGlvbilbYS16X10qLycsMCwzMCkgYXMgJHgpIGlmKCR4IT09JyhuxJdyYSknKSAkclsncGx1Z2luX2ZpbHRlcnMnXVtdPWJhc2VuYW1lKCRmKS4nICcuJHg7IH0KICAkclsnc20nXT0kc2NhbigkcGwuJ2luY2x1ZGVzL3NoaXBwaW5nL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWxwZXhwcmVzcy10ZXJtaW5hbC5waHAnLCcvKHBhcmNlbF90eXBlfEgyVHxUMlR8VDJIfEgySHxvcHRpb25zKS8nLDAsMzApOwogIGlmKCRyWydzbSddPT09WycobsSXcmEpJ10peyBmb3JlYWNoKGdsb2IoJHBsLid7aW5jbHVkZXMscHVibGljLGFkbWlufS8qKi8qLnBocCcsR0xPQl9CUkFDRSkgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkcywiJ3BhcmNlbF90eXBlJyIpIT09ZmFsc2UpICRyWydzbV9maWxlcyddW109c3RyX3JlcGxhY2UoJHBsLCcnLCRmKTsgfSB9CiAgJHJbJ2NvdXJpZXJfc2NoZWQnXT0kc2NhbigkcGwuJ2FkbWluL3NjaGVkdWxlL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWFkbWluLWNvdXJpZXItc2NoZWR1bGUucGhwJywnLyhhZGRfYWN0aW9ufHBlbmRpbmdfY2FsbHxpc19jYWxsX3JlcXVpcmVkfHJldHVybikvJywwLDIwKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-175325';
const GKEY='ps_s1742p';
const PHASES=["1"];
const OUT='analize/s1742_p.json';
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
