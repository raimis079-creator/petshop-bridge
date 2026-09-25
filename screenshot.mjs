process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3aiByZWNvbiByZWFkLW9ubHk6IERyb3BzaGlwcGluZyBrb3J0ZWxlcyBsb2dpa2EgKGxhaXNrdV9rb3J0ZWxlcywgZHJvcHNoaXBfZ3J1cGVzKSArIDM2Mjk2IHZzIDM2Mjg4ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxN2onXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MTdqJ107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTcxN2onLCdmYXplJz0+JGZdOwogICRkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRkZik7CiAgJGJvZHk9ZnVuY3Rpb24oJG5hbWUsJG1heD0zMDAwKSB1c2UoJHMpeyBpZighcHJlZ19tYXRjaCgnIyhwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpP1xzKnN0YXRpY1xzK2Z1bmN0aW9uXHMrJy4kbmFtZS4nXHMqXChbXildKlwpXHMqXHsjJywkcywkbSxQUkVHX09GRlNFVF9DQVBUVVJFKSkgcmV0dXJuIG51bGw7ICRzdD0kbVswXVsxXTsgJGk9JHN0K3N0cmxlbigkbVswXVswXSk7ICRkPTE7ICRuPXN0cmxlbigkcyk7IHdoaWxlKCRpPCRuICYmICRkPjApeyAkYz0kc1skaV07IGlmKCRjPT09J3snKSAkZCsrOyBlbHNlaWYoJGM9PT0nfScpICRkLS07ICRpKys7IH0gJGI9c3Vic3RyKCRzLCRzdCwkaS0kc3QpOyByZXR1cm4gc3RybGVuKCRiKT4kbWF4P3N1YnN0cigkYiwwLCRtYXgpLifigKZbKycuKHN0cmxlbigkYiktJG1heCkuJ10nOiRiOyB9OwogIHRyeXsKICBpZigkZj09PScxJyl7ICRyWydkcm9wc2hpcF9ncnVwZXMnXT0kYm9keSgnZHJvcHNoaXBfZ3J1cGVzJyw5MDAwKTsgJHJbJ2xhaXNrdV9rb3J0ZWxlc19wcmFkemlhJ109JGJvZHkoJ2xhaXNrdV9rb3J0ZWxlcycsNDUwMCk7IH0KICBpZigkZj09PScyJyl7ICRiPSRib2R5KCdsYWlza3Vfa29ydGVsZXMnLDYwMDAwKTsgJHJbJ2xlbiddPXN0cmxlbigkYik7ICRyWydsYWlza3Vfa29ydGVsZXNfMiddPXN1YnN0cigkYiw0NTAwLDcwMDApOyB9CiAgaWYoJGY9PT0nMycpewogICAgZm9yZWFjaChbMzYyOTYsMzYyODgsMzYyOThdIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyAkbT1bXTsgZm9yZWFjaChbJ19wc19ncm91cHMnLCdfcHNfb3JkZXJfdHlwZScsJ19wc190aWVraW1hcycsJ19wc19kYWx5cycsJ19wc19zaXVudG9zJywnX3BzX2RhbHlzX2lzc2l1c3RhJywnX3BzX2Ryb3BzaGlwX2xpcGR1a2FpJywnX3BzX2xpcGR1a2FpJywnX3BzX3BlcmR1b3RhJywnX3BzX3RpZWtfcGVyZHVvdGEnLCdfcHNfdmVuaXBha19kcm9wc2hpcCcsJ19wc19kc19zaXVudG9zJywnX3BzX21hdHl0YScsJ19wc19ydXNpdW90YScsJ19wc19zdXJpbmt0YScsJ19wc19taXNydXNfc3ByZXN0YXMnLCdfcHNfcGFrdW9jaXUnXSBhcyAkayl7ICR2PSRvLT5nZXRfbWV0YSgkayk7IGlmKCR2IT09JycgJiYgJHYhPT1udWxsKSAkbVska109aXNfc2NhbGFyKCR2KT9tYl9zdWJzdHIoKHN0cmluZykkdiwwLDQwMCk6bWJfc3Vic3RyKGpzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsNDAwKTsgfQogICAgICAkYWxsPVtdOyBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG1kKXsgaWYoc3RycG9zKCRtZC0+a2V5LCdfcHNfJyk9PT0wKSAkYWxsW109JG1kLT5rZXk7IH0KICAgICAgJGl0PVtdOyBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4keCl7ICRpbT1bXTsgZm9yZWFjaCgkeC0+Z2V0X21ldGFfZGF0YSgpIGFzICRtZCl7IGlmKHN0cnBvcygkbWQtPmtleSwnX3BzXycpPT09MHx8c3RycG9zKCRtZC0+a2V5LCdfcmVkdWNlZCcpPT09MCkgJGltWyRtZC0+a2V5XT1tYl9zdWJzdHIoKHN0cmluZykoaXNfc2NhbGFyKCRtZC0+dmFsdWUpPyRtZC0+dmFsdWU6anNvbl9lbmNvZGUoJG1kLT52YWx1ZSkpLDAsODApOyB9ICRpdFtdPVskaWlkLCR4LT5nZXRfcHJvZHVjdF9pZCgpLG1iX3N1YnN0cigkeC0+Z2V0X25hbWUoKSwwLDMwKSwkaW1dOyB9CiAgICAgICRyWyd1enMnXVskaWRdPVsnbWV0YSc9PiRtLCd2aXNpX3BzX3Jha3RhaSc9PiRhbGwsJ2VpbHV0ZXMnPT4kaXQsJ3N0YXR1cyc9PiRvLT5nZXRfc3RhdHVzKCldOwogICAgfQogICAgJHJbJ3RpZWtpbWFzX2FtYnJvc2lhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc190aWVraW1hcyBXSEVSRSB0aWVrZWphcz0nYW1icm9zaWEnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgICAkclsndGlla2ltYXNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfdGlla2ltYXMiKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-072137';
const GKEY='ps_s1717j';
const PHASES=["1"];
const OUT='analize/s1717_j1.json';
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
