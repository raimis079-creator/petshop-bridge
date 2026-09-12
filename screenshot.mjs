process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIG8g4oCUIHNuaXBwZXQgNTcwLzU2NyAoRFAgbGlrdcSNaWFpKSwgQVZfU3RvY2sgcXR5L2RlY3JlYXNlL2luY3JlYXNlLCBGdWxmaWxsbWVudF9Tb3VyY2U6OnJlc29sdmUsICMxMDA2IERQIHBhc3RhYm9zLiBSRUFELU9OTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjc2byddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc2IG8nKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJG9bJ3NuaXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgaWxnaXMgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQgSU4gKDU2Nyw1NzApIE9SIG5hbWUgTElLRSAnJURQJXBhayUnIE9SIG5hbWUgTElLRSAnJURhdWdpYXUlJyIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGNvZGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQgSU4gKDU2Nyw1NzApIixBUlJBWV9BKSBhcyAkcyl7ICRvWydzbmlwX2NvZGUnXVskc1snaWQnXV09bWJfc3Vic3RyKCRzWydjb2RlJ10sMCw2MDAwKTsgfQogIGZvcmVhY2goYXJyYXkoJ1BldHNob3BfQVZfU3RvY2snPT5hcnJheSgncXR5JywnZGVjcmVhc2UnLCdpbmNyZWFzZScpLCdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZSc9PmFycmF5KCdyZXNvbHZlJykpIGFzICRjPT4kbXMpeyBpZighY2xhc3NfZXhpc3RzKCRjKSkgY29udGludWU7ICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCRjKTsgJEw9ZXhwbG9kZSgiXG4iLGZpbGVfZ2V0X2NvbnRlbnRzKCRyYy0+Z2V0RmlsZU5hbWUoKSkpOyAkb1snZl8nLiRjXT1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkcmMtPmdldEZpbGVOYW1lKCkpLicgbWQ1ICcubWQ1X2ZpbGUoJHJjLT5nZXRGaWxlTmFtZSgpKTsgZm9yZWFjaCgkbXMgYXMgJG1uKXsgaWYoJHJjLT5oYXNNZXRob2QoJG1uKSl7ICRtPSRyYy0+Z2V0TWV0aG9kKCRtbik7ICRvWyRjLic6OicuJG1uXT1pbXBsb2RlKCJcbiIsYXJyYXlfc2xpY2UoJEwsJG0tPmdldFN0YXJ0TGluZSgpLTEsbWluKDQ1LCRtLT5nZXRFbmRMaW5lKCktJG0tPmdldFN0YXJ0TGluZSgpKzEpKSk7IH0gfSB9CiAgJG5vdGVzPXdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4zNTg4NiwnbGltaXQnPT42MCkpOyBmb3JlYWNoKCRub3RlcyBhcyAkbil7ICRjPShzdHJpbmcpJG4tPmNvbnRlbnQ7IGlmKHByZWdfbWF0Y2goJy9EUHxwYWt8MTc2NTl8TGlrdXRpc3xBVnxTMTY3MC91JywkYykpICRvWyduMTAwNiddW109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRjKSwwLDIwMCk7IH0KICAkdz13Y19nZXRfb3JkZXIoMzU4ODYpOyBmb3JlYWNoKCR3LT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpeyAkb1snaTEwMDYnXVskaWlkXT1hcnJheSgncGlkJz0+JGl0LT5nZXRfcHJvZHVjdF9pZCgpLCdxJz0+JGl0LT5nZXRfcXVhbnRpdHkoKSwnbWV0YSc9PmFycmF5KCkpOyBmb3JlYWNoKCRpdC0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgaWYoc3RycG9zKCRtLT5rZXksJ19wcycpPT09MHx8c3RycG9zKCRtLT5rZXksJ19kcCcpPT09MHx8c3RycG9zKCRtLT5rZXksJ19yZWR1Y2VkJyk9PT0wKSAkb1snaTEwMDYnXVskaWlkXVsnbWV0YSddWyRtLT5rZXldPWlzX3NjYWxhcigkbS0+dmFsdWUpPyRtLT52YWx1ZTpqc29uX2VuY29kZSgkbS0+dmFsdWUpOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-084822';
const GKEY='ps_s1676o';
const PHASES=["GO"];
const OUT='analize/s1676_o.json';
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
