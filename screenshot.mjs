process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI2bzEgdcW+c2FreW1vICMxNjM4IGlyIHPEhXNrYWl0xbMgc2lzdGVtb3MgcGVyxb5pxatyYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjZvMSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyNm8xJ107CiAgdHJ5ewogICRpZHM9d2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+NSwncmV0dXJuJz0+J2lkcycsJ21ldGFfa2V5Jz0+J19vcmRlcl9udW1iZXInLCdtZXRhX3ZhbHVlJz0+JzE2MzgnLCdzdGF0dXMnPT4nYW55J10pOwogIGlmKCEkaWRzKXsgZm9yZWFjaChbJ19vcmRlcl9udW1iZXInLCdfcHNfb3JkZXJfbm8nLCdfd2NwZGZfaW52b2ljZV9udW1iZXInLCdfYWxnX3djX2N1c3RvbV9vcmRlcl9udW1iZXInXSBhcyAkayl7ICR4PSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0lcyBBTkQgbWV0YV92YWx1ZT0nMTYzOCciLCRrKSk7IGlmKCR4KXsgJGlkcz0keDsgJHJbJ2J5J109JGs7IGJyZWFrOyB9IH0KICAgIGlmKCEkaWRzICYmICR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9d2Nfb3JkZXJzX21ldGEnIikpeyAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV92YWx1ZT0nMTYzOCcgQU5EIG1ldGFfa2V5IE5PVCBMSUtFICclcHJpY2UlJyBMSU1JVCA1Iik7ICRyWydieSddPSd3Y19vcmRlcnNfbWV0YSc7IH0gfQogICRyWydpZHMnXT0kaWRzOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsKICAgICRpdD1bXTsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGkpeyAkaXRbXT1bJGktPmdldF9wcm9kdWN0X2lkKCksJGktPmdldF9uYW1lKCksJGktPmdldF9xdWFudGl0eSgpLCRpLT5nZXRfdG90YWwoKSwkaS0+Z2V0X3RvdGFsX3RheCgpXTsgfQogICAgJG09W107IGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbWQpeyAkaz0kbWQtPmtleTsgaWYocHJlZ19tYXRjaCgnL15fPyhiaWxsaW5nfGNvbXBhbnl8aW1vbnxwdm18dmF0fGtvZHxpbnZvaWNlfHNhc2thaXR8d2NwZGZ8cHNffGZha3R1cikvaScsJGspKSAkbVska109aXNfc2NhbGFyKCRtZC0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtZC0+dmFsdWUsMCwxNTApOidbYXJyXSc7IH0KICAgICRyWydvJ11bJGlkXT1bJ25yJz0+JG8tPmdldF9vcmRlcl9udW1iZXIoKSwnc3RhdHVzJz0+JG8tPmdldF9zdGF0dXMoKSwnZGF0ZSc9PiRvLT5nZXRfZGF0ZV9jcmVhdGVkKCk/JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnWS1tLWQgSDppJyk6JycsJ3RvdGFsJz0+JG8tPmdldF90b3RhbCgpLCd0YXgnPT4kby0+Z2V0X3RvdGFsX3RheCgpLCdzaGlwJz0+WyRvLT5nZXRfc2hpcHBpbmdfbWV0aG9kKCksJG8tPmdldF9zaGlwcGluZ190b3RhbCgpXSwncGF5Jz0+WyRvLT5nZXRfcGF5bWVudF9tZXRob2QoKSwkby0+Z2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCldLAogICAgICAnYmlsbCc9Plskby0+Z2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgpLCRvLT5nZXRfYmlsbGluZ19sYXN0X25hbWUoKSwkby0+Z2V0X2JpbGxpbmdfY29tcGFueSgpLCRvLT5nZXRfYmlsbGluZ19hZGRyZXNzXzEoKSwkby0+Z2V0X2JpbGxpbmdfY2l0eSgpLCRvLT5nZXRfYmlsbGluZ19wb3N0Y29kZSgpLCRvLT5nZXRfYmlsbGluZ19lbWFpbCgpLCRvLT5nZXRfYmlsbGluZ19waG9uZSgpXSwnaXRlbXMnPT4kaXQsJ21ldGEnPT4kbSwKICAgICAgJ25vdGVzJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gWyRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKSxtYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMjAwKV07fSx3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4xNV0pKV07IH0KICBpZighZnVuY3Rpb25fZXhpc3RzKCdnZXRfcGx1Z2lucycpKSByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvcGx1Z2luLnBocCc7CiAgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnLFtdKTsgZm9yZWFjaChnZXRfcGx1Z2lucygpIGFzICRmPT4kaCl7IGlmKHByZWdfbWF0Y2goJy9pbnZvaWNlfHBkZnxzYXNrYWl0fGZha3R1cnxwdm0vaScsJGhbJ05hbWUnXS4nICcuJGYpKSAkclsncGx1ZyddW109WyRmLCRoWydOYW1lJ10saW5fYXJyYXkoJGYsJGFjdCldOyB9CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkdD1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHByZWdfbWF0Y2goJy9zW2HEhV1za2FpdHxmYWt0dXJ8aW52b2ljZS9pdScsJHQpKXsgJGg9Z2V0X2ZpbGVfZGF0YSgkZixbJ24nPT4nUGx1Z2luIE5hbWUnLCd2Jz0+J1ZlcnNpb24nXSk7ICRyWydtdSddW109W2Jhc2VuYW1lKCRmKSwkaFsnbiddLCRoWyd2J10sc3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJHQpLCdmYWt0dXInKSxzdWJzdHJfY291bnQoc3RydG9sb3dlcigkdCksJ2ludm9pY2UnKV07IH0gfQogICRyWydzbmlwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgKG5hbWUgTElLRSAnJWFza2FpdCUnIE9SIG5hbWUgTElLRSAnJWFrdHVyJScgT1IgbmFtZSBMSUtFICclbnZvaWNlJScgT1IgbmFtZSBMSUtFICclUFZNJScpIExJTUlUIDIwIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-102328';
const GKEY='ps_s1826o1';
const PHASES=["1"];
const OUT='analize/s1826_o1.json';
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
