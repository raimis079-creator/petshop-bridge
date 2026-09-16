process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODggbWEg4oCUIFJFQ09OIChyZWFkLW9ubHkpIHByaW1pbmltbyByZWdpc3RyYWNpamFpIHByZWvEl3MgcHVzbGFweWplOiByZWZpbGwgdmFyaWtsaW8gQVBJICsgcHNfcmVmaWxsX3RyYWNraW5nIHN0dWxwZWxpYWk7IHNrYWnEjWl1b2tsxJdzIGZyb250LWVuZCAoa3VyIC5wcy1jYWxjLW91dCwgSlMgxK92eWtpYWksIFJFU1QpOyBtYWdpYyBsb2dpbiBSRVNUICsgcmVkaXJlY3Q7IFBldHNob3BfU3V0aWtpbWFpL0xpZmVjeWNsZV9WYXJ0YWkvUGV0X1Byb2ZpbGUgdmllxaFvcyBmdW5rY2lqb3MuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg4bWEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY4OCBtYScpOwogICRtZXQ9ZnVuY3Rpb24oJGNscyl7IGlmKCFjbGFzc19leGlzdHMoJGNscykpIHJldHVybiAnbmVyYSc7ICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGNscyk7ICRvdXQ9YXJyYXkoJ2ZpbGUnPT5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyLT5nZXRGaWxlTmFtZSgpKSk7IGZvcmVhY2goJHItPmdldE1ldGhvZHMoKSBhcyAkbSl7IGlmKCEkbS0+aXNQdWJsaWMoKSkgY29udGludWU7ICRwPWFycmF5KCk7IGZvcmVhY2goJG0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApeyRwW109KCRwcC0+aXNPcHRpb25hbCgpPyc/JzonJykuJyQnLiRwcC0+Z2V0TmFtZSgpO30gJG91dFsnbSddW109KCRtLT5pc1N0YXRpYygpPydzICc6JycpLiRtLT5nZXROYW1lKCkuJygnLmltcGxvZGUoJywnLCRwKS4nKSc7IH0gcmV0dXJuICRvdXQ7IH07CiAgZm9yZWFjaChhcnJheSgnUGV0c2hvcF9SZWZpbGxfRW5naW5lJywnUmVmaWxsX0VuZ2luZScsJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJywnRmVlZGluZ19TZXJ2aWNlJywnUGV0c2hvcF9NYWdpY19Mb2dpbicsJ01hZ2ljX0xvZ2luJywnUGV0c2hvcF9TdXRpa2ltYWknLCdQZXRzaG9wX0xpZmVjeWNsZV9WYXJ0YWknLCdQZXRzaG9wX1BldF9Qcm9maWxlJywnUGV0X1Byb2ZpbGUnLCdQZXRzaG9wX1Bha2FydG90aScpIGFzICRjKSAkb1snY2xzJ11bJGNdPSRtZXQoJGMpOwogICRvWydyZWZpbGxfY29scyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00geyR3cGRiLT5wcmVmaXh9cHNfcmVmaWxsX3RyYWNraW5nIixBUlJBWV9BKTsgJG9bJ3JlZmlsbF9jb2xzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRjKXtyZXR1cm4gJGNbJ0ZpZWxkJ10uJyAnLiRjWydUeXBlJ107fSwkb1sncmVmaWxsX2NvbHMnXSk7CiAgJG9bJ3JlZmlsbF9wdnonXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1wc19yZWZpbGxfdHJhY2tpbmcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICAkb1sncmVmaWxsX3N0YXR1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxDT1VOVCgqKSBuIEZST00geyR3cGRiLT5wcmVmaXh9cHNfcmVmaWxsX3RyYWNraW5nIEdST1VQIEJZIHN0YXR1cyIsQVJSQVlfQSk7CiAgLy8gc2thacSNaXVva2zEl3MgZnJvbnQtZW5kOiBrdXIgcmVuZGVyaW5hbWEsIFJFU1Qga2VsaWFzLCBKUyBmYWlsYWkKICAkY29yZT1XUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlJzsgJG9bJ2NvcmVfZmlsZXMnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxhcnJheV9tZXJnZShnbG9iKCRjb3JlLicvaW5jbHVkZXMvKi5waHAnKSxnbG9iKCRjb3JlLicvYXNzZXRzLyouanMnKSkpOwogIGZvcmVhY2goZ2xvYigkY29yZS4nL2luY2x1ZGVzLyoucGhwJykgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkcywncHMtY2FsYycpIT09ZmFsc2UpeyAkb1snY2FsY19waHAnXVtdPWJhc2VuYW1lKCRmKTsgZm9yZWFjaChmaWxlKCRmKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcHMtY2FsYy1vdXR8cHMtY2FsYy1nb3xyZWdpc3Rlcl9yZXN0X3JvdXRlfGRvX2FjdGlvbnxhcHBseV9maWx0ZXJzfHdwX2VucXVldWVfc2NyaXB0fHdwX2xvY2FsaXplLycsJGwpKSAkb1snY2FsY19waHBfbCddW2Jhc2VuYW1lKCRmKV1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE3MCkpOyB9IH0gfQogIGZvcmVhY2goZ2xvYigkY29yZS4nL2Fzc2V0cy8qLmpzJykgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkcywncHMtY2FsYycpIT09ZmFsc2UpeyAkb1snY2FsY19qcyddW109YmFzZW5hbWUoJGYpLicgJy5zdHJsZW4oJHMpOyBmb3JlYWNoKHByZWdfc3BsaXQoJy9cbi8nLCRzKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcHMtY2FsYy1vdXR8ZmV0Y2hcKHxkaXNwYXRjaEV2ZW50fEN1c3RvbUV2ZW50fGlubmVySFRNTHxkYXlzfGNvc3RfZGF5LycsJGwpKSAkb1snY2FsY19qc19sJ11bYmFzZW5hbWUoJGYpXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTcwKSk7IH0gfSB9CiAgLy8gbWFnaWMgbG9naW46IFJFU1Qgcm91dGUsIHJlZGlyZWN0IHBhbGFpa3ltYXMKICBmb3JlYWNoKGdsb2IoJGNvcmUuJy9pbmNsdWRlcy9jbGFzcy1tYWdpYy1sb2dpbi5waHAnKSBhcyAkZil7IGZvcmVhY2goZmlsZSgkZikgYXMgJGk9PiRsKSBpZihwcmVnX21hdGNoKCcvcmVnaXN0ZXJfcmVzdF9yb3V0ZXxyZWRpcmVjdHxcJF9HRVRcW3xcJF9SRVFVRVNUXFt8Z2V0X3BhcmFtfHVzZXJfbWV0YXx0cmFuc2llbnQvJywkbCkpICRvWydtYWdpYyddW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNzApKTsgfQogIC8vIHJlZmlsbCBlbmdpbmU6IGthaXAgc3VrdXJpYW1hIGVpbHV0xJcKICBmb3JlYWNoKGdsb2IoJGNvcmUuJy9pbmNsdWRlcy9jbGFzcy1yZWZpbGwtZW5naW5lLnBocCcpIGFzICRmKXsgZm9yZWFjaChmaWxlKCRmKSBhcyAkaT0+JGwpIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvbiB8SU5TRVJUfGluc2VydFwofHByZWRpY3RlZF9lbXB0eXxjb25maWRlbmNlfGRvX2FjdGlvbnxhcHBseV9maWx0ZXJzLycsJGwpKSAkb1sncmVmaWxsX2wnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTcwKSk7IH0KICAkb1snb3B0aW5fbWV0YV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSxDT1VOVCgqKSBuIEZST00geyR3cGRiLT51c2VybWV0YX0gV0hFUkUgbWV0YV9rZXkgSU4gKCdwc19zb2Z0X29wdGluX2VsaWdpYmxlJywncHNfc2ltaWxhcl9vcHRvdXQnLCdwc193ZWlnaHRfc2lnbmFsJywnX3BzX2VtYWlsX3ZlcmlmaWVkJykgR1JPVVAgQlkgbWV0YV9rZXkiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-095036';
const GKEY='ps_s1688ma';
const PHASES=["GO"];
const OUT='analize/s1688_ma.json';
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
