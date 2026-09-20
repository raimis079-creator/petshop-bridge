process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTUgYSDigJQgdcW+c2FreW1hcyAjMTEyMDogZWlsdXTEl3MsIGLFq3NlbmEsIG1va8SXamltYXMsIHByaXN0YXR5bWFzLCBwYXN0YWJvcywgcHMgbWV0YSwga2VsaWFzIChBVi9kcm9wc2hpcCksIHNpdW50b3MuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2OTVhJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoKTsgJHA9JHdwZGItPnByZWZpeDsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXkgSU4gKCdfb3JkZXJfbnVtYmVyJywnX2FsZ193Y19jdXN0b21fb3JkZXJfbnVtYmVyJywnX3BzX251bWVyaXMnKSBBTkQgbWV0YV92YWx1ZT0nMTEyMCciKTsKICBpZiAoISRpZHMpICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgaWQ9MTEyMCBPUiBpZCBJTiAoU0VMRUNUIG9yZGVyX2lkIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfdmFsdWU9JzExMjAnKSIpOwogICRvWydpZHMnXT0kaWRzOyBpZiAoISRpZHMpeyAkb1snZXJyJ109J25lcmFzdGFzJzsgZ290byBvdXQ7IH0KICAkdz13Y19nZXRfb3JkZXIoKGludCkkaWRzWzBdKTsgaWYoISR3KXsgJG9bJ2VyciddPSd3Y19nZXRfb3JkZXIgbnVsbCc7IGdvdG8gb3V0OyB9CiAgJG9bJ25yJ109JHctPmdldF9vcmRlcl9udW1iZXIoKTsgJG9bJ2lkJ109JHctPmdldF9pZCgpOyAkb1snc3RhdHVzJ109JHctPmdldF9zdGF0dXMoKTsgJG9bJ3N1a3VydGEnXT0kdy0+Z2V0X2RhdGVfY3JlYXRlZCgpPyR3LT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ1ktbS1kIEg6aScpOm51bGw7ICRvWydhcG1va2V0YSddPSR3LT5nZXRfZGF0ZV9wYWlkKCk/JHctPmdldF9kYXRlX3BhaWQoKS0+ZGF0ZSgnWS1tLWQgSDppJyk6bnVsbDsKICAkb1snbW9rZWppbWFzJ109JHctPmdldF9wYXltZW50X21ldGhvZCgpLicgLyAnLiR3LT5nZXRfcGF5bWVudF9tZXRob2RfdGl0bGUoKS4nIHwgdHhuPScuJHctPmdldF90cmFuc2FjdGlvbl9pZCgpOyAkb1snc3VtYSddPSR3LT5nZXRfdG90YWwoKS4nIChwcmVrxJdzICcuJHctPmdldF9zdWJ0b3RhbCgpLicsIHNpdW50YSAnLiR3LT5nZXRfc2hpcHBpbmdfdG90YWwoKS4nLCBudW9sYWlkYSAnLiR3LT5nZXRfZGlzY291bnRfdG90YWwoKS4nKSc7CiAgJG9bJ2tsaWVudGFzJ109YXJyYXkoJ3VpZCc9PiR3LT5nZXRfY3VzdG9tZXJfaWQoKSwnZW1haWwnPT5zdWJzdHIoJHctPmdldF9iaWxsaW5nX2VtYWlsKCksMCwzKS4nKioqJywndmFyZGFzJz0+JHctPmdldF9iaWxsaW5nX2ZpcnN0X25hbWUoKSwnbWllc3Rhcyc9PiR3LT5nZXRfc2hpcHBpbmdfY2l0eSgpPzokdy0+Z2V0X2JpbGxpbmdfY2l0eSgpLCd0ZWwnPT5zdWJzdHIoJHctPmdldF9iaWxsaW5nX3Bob25lKCksMCw0KS4nKioqJywnY3JlYXRlZF92aWEnPT4kdy0+Z2V0X2NyZWF0ZWRfdmlhKCksJ2lwJz0+JHctPmdldF9jdXN0b21lcl9pcF9hZGRyZXNzKCksJ3VhJz0+c3Vic3RyKChzdHJpbmcpJHctPmdldF9jdXN0b21lcl91c2VyX2FnZW50KCksMCw4MCkpOwogIGZvcmVhY2ggKCR3LT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpIGFzICRzKSAkb1sncHJpc3RhdHltYXMnXVtdPSRzLT5nZXRfbWV0aG9kX2lkKCkuJzonLiRzLT5nZXRfaW5zdGFuY2VfaWQoKS4nICcuJHMtPmdldF9uYW1lKCkuJyAnLiRzLT5nZXRfdG90YWwoKS4nIG1ldGE9Jy5qc29uX2VuY29kZShhcnJheV9tYXAoJ3N0cnZhbCcsJHMtPmdldF9tZXRhX2RhdGEoKT9hcnJheV9jb2x1bW4oYXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPmdldF9kYXRhKCk7fSwkcy0+Z2V0X21ldGFfZGF0YSgpKSwndmFsdWUnLCdrZXknKTphcnJheSgpKSxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsKICBmb3JlYWNoICgkdy0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJHByPSRpdC0+Z2V0X3Byb2R1Y3QoKTsgJHBpZD0kaXQtPmdldF9wcm9kdWN0X2lkKCk7ICRyb3c9YXJyYXkoJ3BpZCc9PiRwaWQsJ3ZpZCc9PiRpdC0+Z2V0X3ZhcmlhdGlvbl9pZCgpLCdza3UnPT4kcHI/JHByLT5nZXRfc2t1KCk6bnVsbCwncGF2Jz0+bWJfc3Vic3RyKCRpdC0+Z2V0X25hbWUoKSwwLDcwKSwna2llayc9PiRpdC0+Z2V0X3F1YW50aXR5KCksJ3N1bWEnPT4kaXQtPmdldF90b3RhbCgpLCd0aXBhcyc9PiRwcj8kcHItPmdldF90eXBlKCk6bnVsbCwnc3RvY2snPT4kcHI/JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTpudWxsLCdvd24nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwnc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksJ3N0YXR1cyc9PmdldF9wb3N0X3N0YXR1cygkcGlkKSwna2FpbmFfZGFiYXInPT4kcHI/JHByLT5nZXRfcHJpY2UoKTpudWxsLCdyZWcnPT4kcHI/JHByLT5nZXRfcmVndWxhcl9wcmljZSgpOm51bGwpOwogICAgJG1kPWFycmF5KCk7IGZvcmVhY2ggKCRpdC0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgJGQ9JG0tPmdldF9kYXRhKCk7ICRtZFskZFsna2V5J11dPWlzX3NjYWxhcigkZFsndmFsdWUnXSk/bWJfc3Vic3RyKChzdHJpbmcpJGRbJ3ZhbHVlJ10sMCw4MCk6anNvbl9lbmNvZGUoJGRbJ3ZhbHVlJ10sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IH0gJHJvd1snbWV0YSddPSRtZDsgJG9bJ2VpbHV0ZXMnXVtdPSRyb3c7IH0KICBmb3JlYWNoICgkdy0+Z2V0X2l0ZW1zKCdjb3Vwb24nKSBhcyAkYykgJG9bJ2t1cG9uYWknXVtdPSRjLT5nZXRfY29kZSgpLicgJy4kYy0+Z2V0X2Rpc2NvdW50KCk7CiAgZm9yZWFjaCAoJHctPmdldF9pdGVtcygnZmVlJykgYXMgJGMpICRvWydtb2tlc2NpYWknXVtdPSRjLT5nZXRfbmFtZSgpLicgJy4kYy0+Z2V0X3RvdGFsKCk7CiAgJG1ldGE9YXJyYXkoKTsgZm9yZWFjaCAoJHctPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7ICRkPSRtLT5nZXRfZGF0YSgpOyBpZiAocHJlZ19tYXRjaCgnL15fcHNffGdjbGlkfHBheXNlcmF8X2RwX3xfcmVkdWNlZHxfYXZ8dmVuaXBha3xscF98a2VsaWFzfF9hbGd8cmlua2lufG1ubXxfYmlsbGluZ198c2hpcHBpbmdfbWV0aG9kfF9jcmVhdGVkfF9vcmRlcl9udW1iZXJ8X2NhcnRfaGFzaHxpc192YXRfZXhlbXB0fF9jdXN0b21lci9pJywkZFsna2V5J10pKSAkbWV0YVskZFsna2V5J11dPWlzX3NjYWxhcigkZFsndmFsdWUnXSk/bWJfc3Vic3RyKChzdHJpbmcpJGRbJ3ZhbHVlJ10sMCwxNjApOm1iX3N1YnN0cihqc29uX2VuY29kZSgkZFsndmFsdWUnXSxKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDMwMCk7IH0gJG9bJ21ldGEnXT0kbWV0YTsKICAkb1sncGFzdGFib3MnXT1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiAkbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyBbJy4oJG4tPmN1c3RvbWVyX25vdGU/J2tsaWVudHVpJzondmlkaW7ElycpLiddICcuJG4tPmFkZGVkX2J5Lic6ICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDIyMCk7fSx3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JHctPmdldF9pZCgpLCdsaW1pdCc9PjI1KSkpOwogICRvWydrbGllbnRvX3Bhc3RhYmEnXT0kdy0+Z2V0X2N1c3RvbWVyX25vdGUoKTsKICAkb1snZmFrdCddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSB1enNha3ltYXNfaWQ9JWQiLCR3LT5nZXRfaWQoKSksQVJSQVlfQSk7CiAgJG9bJ3NpdW50b3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX2Zha3Rfc2l1bnRvcyBXSEVSRSB1enNha3ltYXNfaWQ9JWQiLCR3LT5nZXRfaWQoKSksQVJSQVlfQSk7CiAgJG9bJ3RpZWtpbWFzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc190aWVraW1hcyBXSEVSRSB1enNha3ltYXNfaWQ9JWQiLCR3LT5nZXRfaWQoKSksQVJSQVlfQSk7CiAgJG9bJ2RiX2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOwogIC8vIGtpdGkgdG8gcGF0aWVzIGtsaWVudG8gdcW+c2FreW1haQogICRvWydrbGllbnRvX2tpdGknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxzdGF0dXMsdG90YWxfYW1vdW50LGRhdGVfY3JlYXRlZF9nbXQgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIGJpbGxpbmdfZW1haWw9JXMgQU5EIGlkPD4lZCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLCR3LT5nZXRfYmlsbGluZ19lbWFpbCgpLCR3LT5nZXRfaWQoKSksQVJSQVlfQSk7CiAgb3V0OgogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-073548';
const GKEY='ps_s1695a';
const PHASES=["1"];
const OUT='analize/s1695_a.json';
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
