process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwbyB0ZXN0LSBzbHVnIDM0OTQyLzM0OTQ1ICgxIGRyeSAvIDIgdGFpa3l0aSAvIDMgdGVzdGFzIC8gOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MG8nXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzQwbyddOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3NDBvJywnZmF6ZSc9PiRmXTsKICAkU0w9WzM0OTQyPT4na29uc2VydnUtZGV6ZS04MDAtYmUtdmlzdGllbm9zJywzNDk0NT0+J2tvbnNlcnZ1LWRlemUtNDAwLW1vbm9wcm90ZWluYXMnXTsgJERSPTA7ICRCSz0ncHNfczE3NDBvX3NsdWdfYmFrJzsKICAkdmFseWs9ZnVuY3Rpb24oKXsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyB9OwogICRoZWFkPWZ1bmN0aW9uKCR1KXsgJGM9Y3VybF9pbml0KCR1KTsgY3VybF9zZXRvcHRfYXJyYXkoJGMsW0NVUkxPUFRfUkVUVVJOVFJBTlNGRVI9PjEsQ1VSTE9QVF9OT0JPRFk9PjEsQ1VSTE9QVF9GT0xMT1dMT0NBVElPTj0+MCxDVVJMT1BUX1RJTUVPVVQ9PjIwLENVUkxPUFRfVVNFUkFHRU5UPT4nTW96aWxsYS81LjAgcHMtdGVzdCddKTsgY3VybF9leGVjKCRjKTsgJG89Y3VybF9nZXRpbmZvKCRjLENVUkxJTkZPX0hUVFBfQ09ERSkuJyAnLndwX21ha2VfbGlua19yZWxhdGl2ZSgoc3RyaW5nKWN1cmxfZ2V0aW5mbygkYyxDVVJMSU5GT19SRURJUkVDVF9VUkwpKTsgY3VybF9jbG9zZSgkYyk7IHJldHVybiB0cmltKCRvKTsgfTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgZm9yZWFjaCgkU0wgYXMgJGlkPT4kbnMpeyAkcD1nZXRfcG9zdCgkaWQpOyAkclsncCcuJGlkXT1bJ3N0YXR1cyc9PiRwLT5wb3N0X3N0YXR1cywnc2x1Zyc9PiRwLT5wb3N0X25hbWUsJ25hdWphcyc9PiRucywndW5pa2FsdXMnPT53cF91bmlxdWVfcG9zdF9zbHVnKCRucywkaWQsJ3B1Ymxpc2gnLCdwcm9kdWN0JywwKT09PSRucywnbnVvcm9kb3NfdHVyaW55amUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfY29udGVudCBMSUtFICVzIiwnJScuJHdwZGItPmVzY19saWtlKCRwLT5wb3N0X25hbWUpLiclJykpLCdtZXRhJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV92YWx1ZSBMSUtFICVzIiwnJScuJHdwZGItPmVzY19saWtlKCRwLT5wb3N0X25hbWUpLiclJykpLCdvcHQnPT4kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fdmFsdWUgTElLRSAlcyBMSU1JVCA1IiwnJScuJHdwZGItPmVzY19saWtlKCRwLT5wb3N0X25hbWUpLiclJykpXTsgfQogICAgCiAgICAkclsna2l0aV90ZXN0X3NsdWdhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdHlwZSxwb3N0X25hbWUgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwYWdlJywncG9zdCcpIEFORCAocG9zdF9uYW1lIExJS0UgJ3Rlc3QtJScgT1IgcG9zdF9uYW1lIExJS0UgJyUtdGVzdC0lJyBPUiBwb3N0X25hbWUgTElLRSAnJS10ZXN0JykgTElNSVQgMjAiLEFSUkFZX0EpOwogIH0KICBpZigkZj09PScyJyl7CiAgICBpZihnZXRfb3B0aW9uKCRCSykpeyAkclsnU1RPUCddPSdiYWsgamF1IHlyYSc7IH0KICAgIGVsc2UgewogICAgICAkYmFrPVsnc3RhdHVzYXMnPT5bXSwnc2x1Zyc9PltdXTsKICAgICAgZm9yZWFjaCgkU0wgYXMgJGlkPT4kbnMpeyAkYmFrWydzbHVnJ11bJGlkXT1nZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkaWQpOyB9CiAgICAgIGFkZF9vcHRpb24oJEJLLCRiYWssJycsJ25vJyk7CiAgICAgIGZvcmVhY2goJFNMIGFzICRpZD0+JG5zKXsgaWYoZ2V0X3Bvc3Rfc3RhdHVzKCRpZCkhPT0ncHVibGlzaCcpeyAkclsncCcuJGlkXT0nbmUgcHVibGlzaCc7IGNvbnRpbnVlOyB9ICRyZXM9d3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpZCwncG9zdF9uYW1lJz0+JG5zXSx0cnVlKTsgJHJbJ3AnLiRpZF09aXNfd3BfZXJyb3IoJHJlcyk/JHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTpnZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkaWQpOyAkclsnb2xkX3NsdWcnLiRpZF09Z2V0X3Bvc3RfbWV0YSgkaWQsJ193cF9vbGRfc2x1ZycpOyB9CiAgICAgIAogICAgICAkdmFseWsoKTsKICAgIH0KICB9CiAgaWYoJGY9PT0nMycpewogICAgJGJhaz1nZXRfb3B0aW9uKCRCSyk7CiAgICBmb3JlYWNoKCRTTCBhcyAkaWQ9PiRucyl7ICRyWydwJy4kaWRdPVsnbmF1amEnPT4kaGVhZChnZXRfcGVybWFsaW5rKCRpZCkpLCdzZW5hJz0+JGhlYWQoaG9tZV91cmwoJy9wcm9kdWN0LycuJGJha1snc2x1ZyddWyRpZF0uJy8nKSldOyB9CiAgICAKICAgICRyWydob21lJ109JGhlYWQoaG9tZV91cmwoJy8nKSk7CiAgfQogIGlmKCRmPT09JzknKXsKICAgICRiYWs9Z2V0X29wdGlvbigkQkspOyBpZighJGJhayl7ICRyWydhdHN0YXR5dGEnXT0nbmVyYSBiYWsnOyB9CiAgICBlbHNlIHsgZm9yZWFjaCgkYmFrWydzbHVnJ10gYXMgJGlkPT4kcykgd3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpZCwncG9zdF9uYW1lJz0+JHNdKTsgZm9yZWFjaCgkYmFrWydzdGF0dXNhcyddIGFzICRpZD0+JHN0KSB3cF91cGRhdGVfcG9zdChbJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PiRzdF0pOyBkZWxldGVfb3B0aW9uKCRCSyk7ICR2YWx5aygpOyAkclsnYXRzdGF0eXRhJ109MTsgfQogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-190412';
const GKEY='ps_s1740o';
const PHASES=["1", "2", "3"];
const OUT='analize/s1740o.json';
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
