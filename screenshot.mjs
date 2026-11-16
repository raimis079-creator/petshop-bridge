process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcxYiBWRiA0IHV6c2FreW1haSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzFiJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg3MWInXTsKICAkclsnZGVza19jbGFzcyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9EZXNrJyk7ICRyWydkc19jbGFzcyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9Ecm9wc2hpcCcpOwogIGZvcmVhY2goWzM4NTI3LDM4NTMyLDM4NTMzLDM4NTgyXSBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsgJG1ldGE9W107IGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7ICRrPSRtLT5rZXk7IGlmKHN0cnBvcygkaywnX3BzXycpPT09MHx8c3RycG9zKCRrLCdfcGV0c2hvcCcpPT09MCkgJG1ldGFbJGtdPWlzX3NjYWxhcigkbS0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtLT52YWx1ZSwwLDEyMCk6bWJfc3Vic3RyKGpzb25fZW5jb2RlKCRtLT52YWx1ZSxKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDE2MCk7IH0KICAgICRubj1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT42XSkgYXMgJG4peyAkbm5bXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwyMDApLicgKCcuJG4tPmFkZGVkX2J5LicpJzsgfQogICAgJGl0PVtdOyBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkeCl7ICRpdFtdPW1iX3N1YnN0cigkeC0+Z2V0X25hbWUoKSwwLDQwKS4nIHgnLiR4LT5nZXRfcXVhbnRpdHkoKS4nIHNyYz0nLiR4LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpOyB9CiAgICAkclsnbyddWyRvLT5nZXRfb3JkZXJfbnVtYmVyKCldPVsnc3QnPT4kby0+Z2V0X3N0YXR1cygpLCdtb2QnPT4kby0+Z2V0X2RhdGVfbW9kaWZpZWQoKT8kby0+Z2V0X2RhdGVfbW9kaWZpZWQoKS0+ZGF0ZSgnbS1kIEg6aScpOicnLCdtZXRhJz0+JG1ldGEsJ2l0ZW1zJz0+JGl0LCdub3Rlcyc9PiRubl07IH0KICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfRHJvcHNoaXAnKSl7ICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJyk7ICRmbj0kcmMtPmdldEZpbGVOYW1lKCk7ICRyWydkc19maWxlJ109WyRmbixzdWJzdHIobWQ1X2ZpbGUoJGZuKSwwLDgpLGRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZm4pKV07ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbik7ICRyWydkc19oZWFkJ109bWJfc3Vic3RyKCRzLDAsMTUwMCk7ICRoPVtdOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkcykgYXMgJGk9PiRsbil7IGlmKHByZWdfbWF0Y2goJy9QRVJTScWyU1RJfHBlcnNpdXN0aXxwZXJzacWzc3RpfGlyX3BlcmR1b3R1c3xwYWthcnR8acWhIG5hdWpvfG51aW10aXxwZXJkdW90aV92ZWx8YWRtaW5fcG9zdF98YWRkX2FjdGlvblwoICouYWRtaW5fcG9zdC9pJywkbG4pKSAkaFtdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsbiksMCwyMjApOyB9ICRyWydkc19oaXRzJ109YXJyYXlfc2xpY2UoJGgsMCw1MCk7IH0KICBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2Ryb3BzaGlwJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfbGFpc2slbnVzdCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3RpZWtlaiUnIExJTUlUIDIwIikgYXMgJG9uKXsgJHY9Z2V0X29wdGlvbigkb24pOyAkclsnb3BjJ11bJG9uXT1tYl9zdWJzdHIoaXNfc2NhbGFyKCR2KT8oc3RyaW5nKSR2Ompzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsNTAwKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-083407';
const GKEY='ps_s1871b';
const PHASES=["1"];
const OUT='analize/s1871_b.json';
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
