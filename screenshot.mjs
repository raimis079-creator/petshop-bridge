process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzMxYyBrYXMgbnVzdGF0byBtYW5hZ2Vfc3RvY2s9bm8gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzMxYyddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTczMWMnXTsgQHNldF90aW1lX2xpbWl0KDIwMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzMxYycsJ2ZhemUnPT4kZl07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRNPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy8nOwogICAgZm9yZWFjaChbJ3BldHNob3Ata2F0YWxvZ2FzLnBocCcsJ3BldHNob3AtZ2F2aW1hcy5waHAnLCdwZXRzaG9wLWxhdWthaS5waHAnXSBhcyAkZm4peyAkc3JjPUBmaWxlKCRNLiRmbik7IGlmKCEkc3JjKXsgJHJbJ2tvZCddWyRmbl09J25lcmEnOyBjb250aW51ZTsgfQogICAgICAkclsna29kJ11bJGZuXVsnbWQ1J109c3Vic3RyKG1kNV9maWxlKCRNLiRmbiksMCw4KTsgJHJbJ2tvZCddWyRmbl1bJ2hlYWQnXT1tYl9zdWJzdHIoaW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLDAsMTIpKSwwLDcwMCk7CiAgICAgIGZvcmVhY2goJHNyYyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCIjc2V0X21hbmFnZV9zdG9ja1xzKlwoXHMqZmFsc2V8J19tYW5hZ2Vfc3RvY2snXHMqLFxzKidubycjIiwkbCkpeyAkYT1tYXgoMCwkaS0zMCk7ICRyWydrb2QnXVskZm5dWydMJy4oJGkrMSldPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJHNyYywkYSw0MCkpOyB9IH0gfQogIH0KICBpZigkZj09PScyJyl7CiAgICAkaWQ9MzQ5MDg7ICRyWydtZXRhX3Zpc2knXT1bXTsgZm9yZWFjaChnZXRfcG9zdF9tZXRhKCRpZCkgYXMgJGs9PiR2KXsgJHJbJ21ldGFfdmlzaSddWyRrXT1tYl9zdWJzdHIoaXNfYXJyYXkoJHYpP2ltcGxvZGUoJyB8ICcsJHYpOiR2LDAsMzAwKTsgfQogICAgJHJbJ3Bvc3QnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHBvc3RfZGF0ZSxwb3N0X21vZGlmaWVkLHBvc3Rfc3RhdHVzLHBvc3RfYXV0aG9yIEZST00geyRQfXBvc3RzIFdIRVJFIElEPSRpZCIsQVJSQVlfQSk7CiAgICAvLyBrYXRhbG9nbyAvIGdhdmltbyDFvnVybmFsYWksIGt1cml1b3NlIG1pbmltYSBwcmVrxJcKICAgICRyWydvcHRfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVOR1RIKG9wdGlvbl92YWx1ZSkgbCBGUk9NIHskUH1vcHRpb25zIFdIRVJFIChvcHRpb25fbmFtZSBMSUtFICdwc19rYXRhbG9nJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfZ2F2aW0lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19sYXVrYWklJykgT1JERVIgQlkgb3B0aW9uX25hbWUgTElNSVQgNDAiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkclsnb3B0X2xvZyddIGFzICRvKXsgJHY9Z2V0X29wdGlvbigkb1snb3B0aW9uX25hbWUnXSk7ICRzPWlzX3NjYWxhcigkdik/KHN0cmluZykkdjpqc29uX2VuY29kZSgkdixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgaWYoc3RycG9zKCRzLCczNDkwOCcpIT09ZmFsc2UpeyAkcD1zdHJwb3MoJHMsJzM0OTA4Jyk7ICRyWydvcHRfaGl0J11bJG9bJ29wdGlvbl9uYW1lJ11dPW1iX3N1YnN0cigkcyxtYXgoMCwkcC00MDApLDkwMCk7IH0gfQogICAgJHJbJ3RpZWtpbWFzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfJSciLEFSUkFZX04pOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-155209';
const GKEY='ps_s1731c';
const PHASES=["1", "2"];
const OUT='analize/s1731_c.json';
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
