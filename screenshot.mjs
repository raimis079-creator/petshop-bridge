process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1dCBzbmlwcGV0dSB2YWx5bWFzICsgIzE3NTggYW51bGlhdmltYXMgKFJhaW1pbyB0YWlwIDExLTE4KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4ODV0J10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTg4NXQnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODg1dCcsJ2ZhemUnPT4kZl07CiAgJFc9ImFjdGl2ZT0wIEFORCBuYW1lIExJS0UgJ1RFTVAgUFMlJyBBTkQgbW9kaWZpZWQgPCBOT1coKSAtIElOVEVSVkFMIDcgREFZIjsKICAkYXJjaD1udWxsOyBmb3JlYWNoKFtkaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMnLGRpcm5hbWUoZGlybmFtZShBQlNQQVRIKSkuJy9wcy1hcmNoeXZhcycsQUJTUEFUSC4ncHMtYXJjaHl2YXMnLFdQX0NPTlRFTlRfRElSLicvcHMtYXJjaHl2YXMnXSBhcyAkZCl7IGlmKGlzX2RpcigkZCkpeyAkYXJjaD0kZDsgYnJlYWs7IH0gfQogICRyWydhcmNoJ109JGFyY2g7ICRiZj0kYXJjaD8kYXJjaC4nL3MxODg1L3NuaXBwZXRzX3RlbXBfaWtpXycuZGF0ZSgnWW1kJykuJy5qc29uLmd6JzpudWxsOyAkclsnYmYnXT0kYmY7CiAgJG9pZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIEFORCBtZXRhX3ZhbHVlPScxNzU4JyBMSU1JVCAxIik7CiAgdHJ5ewogIGlmKCRmPT09JzEnfHwkZj09PSc0Jyl7CiAgICAkclsna2FuZGlkYXRhaSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgTUlOKGlkKSBtbiwgTUFYKGlkKSBteCwgUk9VTkQoU1VNKExFTkdUSChjb2RlKSkvMTA0ODU3NiwxKSBtYiwgTUFYKG1vZGlmaWVkKSBwYXNrIEZST00geyRQfXNuaXBwZXRzIFdIRVJFICRXIixBUlJBWV9BKTsKICAgICRyWyd2aXNvJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBTVU0oYWN0aXZlPTEpIGFrdCwgUk9VTkQoU1VNKExFTkdUSChjb2RlKSkvMTA0ODU3NiwxKSBtYiBGUk9NIHskUH1zbmlwcGV0cyIsQVJSQVlfQSk7CiAgICAkclsnbmVfdGVtcF9uZWFrdCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MCBBTkQgbmFtZSBOT1QgTElLRSAnVEVNUCBQUyUnIik7CiAgICBpZigkYmYmJmlzX2ZpbGUoJGJmKSkgJHJbJ2JhY2t1cCddPVtmaWxlc2l6ZSgkYmYpLCBjb3VudChqc29uX2RlY29kZShnemRlY29kZShmaWxlX2dldF9jb250ZW50cygkYmYpKSx0cnVlKT86W10pXTsKICAgICRvPSRvaWQ/d2NfZ2V0X29yZGVyKCRvaWQpOm51bGw7CiAgICBpZigkbyl7ICRubj1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRvaWQsJ2xpbWl0Jz0+NF0pIGFzICRuKXsgJG5uW109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTYwKTsgfQogICAgICAkaXQ9W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICR4KXsgJHA9JHgtPmdldF9wcm9kdWN0KCk7ICRpdFtdPSgkcD8kcC0+Z2V0X2lkKCk6MCkuJyAnLm1iX3N1YnN0cigkeC0+Z2V0X25hbWUoKSwwLDUwKS4nIHgnLiR4LT5nZXRfcXVhbnRpdHkoKS4nIHN0PScuKCRwPyRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTonLScpOyB9CiAgICAgICRyWydvMTc1OCddPVsnaWQnPT4kb2lkLCdzdCc9PiRvLT5nZXRfc3RhdHVzKCksJ3BtJz0+JG8tPmdldF9wYXltZW50X21ldGhvZCgpLCdwYWlkJz0+JG8tPmdldF9kYXRlX3BhaWQoKT8ndGFpcCc6J25lJywnc3VtYSc9PiRvLT5nZXRfdG90YWwoKSwnc3RvY2tfcmVkdWNlZCc9PiRvLT5nZXRfbWV0YSgnX29yZGVyX3N0b2NrX3JlZHVjZWQnKSwnbm90ZXMnPT4kbm4sJ2l0ZW1zJz0+JGl0XTsKICAgICAgJG53PXdjX2dldF9vcmRlcigzODY5Mik7IGlmKCRudykgJHJbJ25hdWplc25pcyddPVsnaWQnPT4zODY5MiwnbnInPT4kbnctPmdldF9vcmRlcl9udW1iZXIoKSwnc3QnPT4kbnctPmdldF9zdGF0dXMoKSwncGFpZCc9PiRudy0+Z2V0X2RhdGVfcGFpZCgpPyRudy0+Z2V0X2RhdGVfcGFpZCgpLT5kYXRlKCdtLWQgSDppJyk6bnVsbCwnc3VtYSc9PiRudy0+Z2V0X3RvdGFsKCksJ3N1a3VydGEnPT4kbnctPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCd0YXNfcGF0c19rbGllbnRhcyc9PihzdHJ0b2xvd2VyKCRudy0+Z2V0X2JpbGxpbmdfZW1haWwoKSk9PT1zdHJ0b2xvd2VyKCRvLT5nZXRfYmlsbGluZ19lbWFpbCgpKSldOyB9CiAgfQogIGlmKCRmPT09JzInKXsKICAgIGlmKCEkYXJjaCl7IHRocm93IG5ldyBFeGNlcHRpb24oJ25lcmEgcHMtYXJjaHl2YXMnKTsgfQogICAgQG1rZGlyKCRhcmNoLicvczE4ODUnLDA3NTUsdHJ1ZSk7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXNuaXBwZXRzIFdIRVJFICRXIE9SREVSIEJZIGlkIixBUlJBWV9BKTsgJG49Y291bnQoJHJvd3MpOwogICAgJGd6PWd6ZW5jb2RlKGpzb25fZW5jb2RlKCRyb3dzLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyksNik7ICRvaz1maWxlX3B1dF9jb250ZW50cygkYmYsJGd6KTsKICAgICRjaGs9anNvbl9kZWNvZGUoZ3pkZWNvZGUoZmlsZV9nZXRfY29udGVudHMoJGJmKSksdHJ1ZSk7ICRyWydiYWNrdXAnXT1bJ2VpbCc9PiRuLCdiYWl0YWknPT4kb2ssJ3BhdGlrcmEnPT5pc19hcnJheSgkY2hrKT9jb3VudCgkY2hrKTotMV07CiAgICBpZighJG9rIHx8ICFpc19hcnJheSgkY2hrKSB8fCBjb3VudCgkY2hrKSE9PSRuIHx8ICRuPDEpIHRocm93IG5ldyBFeGNlcHRpb24oJ2tvcGlqYSBuZXBhdnlrbyAtIG5ldHJpbnRhJyk7CiAgICAkaWRzPWFycmF5X21hcCgnaW50dmFsJyxhcnJheV9jb2x1bW4oJGNoaywnaWQnKSk7ICRkZWw9MDsKICAgIGZvcmVhY2goYXJyYXlfY2h1bmsoJGlkcywyMDApIGFzICRjaCl7ICRkZWwrPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgaWQgSU4gKCIuaW1wbG9kZSgnLCcsJGNoKS4iKSBBTkQgJFciKTsgfQogICAgJHJbJ2lzdHJpbnRhJ109JGRlbDsgJHJbJ2xpa28nXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFJPVU5EKFNVTShMRU5HVEgoY29kZSkpLzEwNDg1NzYsMSkgbWIgRlJPTSB7JFB9c25pcHBldHMiLEFSUkFZX0EpOwogIH0KICBpZigkZj09PSczJyl7CiAgICAkbz0kb2lkP3djX2dldF9vcmRlcigkb2lkKTpudWxsOyBpZighJG8pIHRocm93IG5ldyBFeGNlcHRpb24oJyMxNzU4IG5lcmFzdGFzJyk7CiAgICBpZigkby0+Z2V0X3N0YXR1cygpIT09J29uLWhvbGQnIHx8ICRvLT5nZXRfZGF0ZV9wYWlkKCkpIHRocm93IG5ldyBFeGNlcHRpb24oJ25ldGlua2FtYSBidXNlbmE6ICcuJG8tPmdldF9zdGF0dXMoKSk7CiAgICAkcHJpZXM9W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICR4KXsgJHA9JHgtPmdldF9wcm9kdWN0KCk7IGlmKCRwKSAkcHJpZXNbJHAtPmdldF9pZCgpXT0kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7IH0KICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywnX19yZXR1cm5fZmFsc2UnLDEpOyAvLyBqb2tpdSBsYWlza3Ugc2lvIHZlaWtzbW8gbWV0dQogICAgJG8tPnVwZGF0ZV9zdGF0dXMoJ2NhbmNlbGxlZCcsJ0FudWxpdW90YSBSYWltaW8gc3ByZW5kaW11IDIwMjYtMTEtMTggKFMxODg1KTogYmFua2luaXMgcGF2ZWRpbWFzIG5lYXBtb2vEl3RhcyBudW8gMTEtMTUsIGtsaWVudGFzIHR1cmkgbmF1amVzbsSvIHXFvnNha3ltxIUuIExhacWha2FpIG5lc2nFs3N0aS4nKTsKICAgIHJlbW92ZV9maWx0ZXIoJ3ByZV93cF9tYWlsJywnX19yZXR1cm5fZmFsc2UnLDEpOwogICAgJG8yPXdjX2dldF9vcmRlcigkb2lkKTsgJHBvPVtdOyBmb3JlYWNoKCRvMi0+Z2V0X2l0ZW1zKCkgYXMgJHgpeyAkcD13Y19nZXRfcHJvZHVjdCgkeC0+Z2V0X3Byb2R1Y3RfaWQoKSk7IGlmKCRwKSAkcG9bJHAtPmdldF9pZCgpXT0kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7IH0KICAgICRyWydyZXonXT1bJ3N0Jz0+JG8yLT5nZXRfc3RhdHVzKCksJ2xpa3V0aXNfcHJpZXMnPT4kcHJpZXMsJ2xpa3V0aXNfcG8nPT4kcG9dOwogIH0KICB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-082506';
const GKEY='ps_s1885t';
const PHASES=["2"];
const OUT='analize/s1885t2.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
