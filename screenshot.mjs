process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjEgcnVuIGU0cCDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBkcm9wc2hpcCB2YXJpa2xpbyBzaXVzdGkoKSAobGlwZHVrxbMgc2FyZ2FzLCBzdV9wYXJ0aWphKSwgdGlla2ltbyBhdHZpcmFfc3VfZWlsdXRlbWlzL3BhcnVvc3RpL3V6c2FreXRpLCBhcmNoeXZvIHN0cnVrdMWrcmEg4oCexaFpYW5kaWVuIHNpxbNzdGHigJwuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U0cCddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjIxIGU0cCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRsaW5lcz1mdW5jdGlvbigkZmlsZSwkYSwkYil7ICRMPWV4cGxvZGUoIlxuIiwoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRmaWxlKSk7ICRyPWFycmF5KCk7IGZvcigkaT0kYS0xOyRpPG1pbigkYixjb3VudCgkTCkpOyRpKyspeyAkcltdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cihydHJpbSgkTFskaV0pLDAsMjMwKTsgfSByZXR1cm4gJHI7IH07CiAgdHJ5ewogICAgJGRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtZHJvcHNoaXAucGhwJzsgJG9bJ3NpdXN0aSddPSRsaW5lcygkZGYsMTAwNSwxMTEwKTsgJG9bJ2FyY2h5dnVvdGknXT0kbGluZXMoJGRmLDM0OCwzNzIpOyAkb1snZ3J1cHVvdGlfZ3JlcCddPWFycmF5KCk7ICRMPWV4cGxvZGUoIlxuIiwoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRkZikpOyBmb3JlYWNoKCRMIGFzICRrPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvbiBncnVwdW90aXxmdW5jdGlvbiBsYXVraWFudHlzX3BlcmRhdmltb3xwc19kcm9wc2hpcF9hcmNoeXZhc3xBUkNIWVZBU3xnZXRfb3B0aW9uXChccypbXCciXXBzX2Ryb3BzaGlwL2knLCRsKSkgJG9bJ2dydXB1b3RpX2dyZXAnXVtdPSgkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDIwMCk7IH0KICAgICR0Zj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF2LXRpZWtpbWFzLnBocCc7ICRvWydhdHZpcmEnXT0kbGluZXMoJHRmLDIyOSwyNTApOyAkb1snYXR2aXJhX3N1X2VpbCddPSRsaW5lcygkdGYsMTA0NiwxMDk4KTsgJG9bJ3V6c2FreXRpX2dyZXAnXT1hcnJheSgpOyAkTD1leHBsb2RlKCJcbiIsKHN0cmluZylmaWxlX2dldF9jb250ZW50cygkdGYpKTsgZm9yZWFjaCgkTCBhcyAkaz0+JGwpeyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gdXpzYWt5dGlcKHxmdW5jdGlvbiBwcmlpbXRpXCh8Y29uc3QgUFJJU1RBVFlNQUl8Y29uc3QgTUVUQV9MQVVLfHV6c2FreXRhX2JlX2xhaXNrb3xmdW5jdGlvbiBsYWlza29fbnVzdC9pJywkbCkpICRvWyd1enNha3l0aV9ncmVwJ11bXT0oJGsrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwyMDApOyB9CiAgICAkb1snc2l1c3RhX3NpYW5kaWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGlla2VqYXMsdXpzYWt5dGEgRlJPTSB7JHB9cHNfdGlla2ltYXMgV0hFUkUgREFURSh1enNha3l0YSk9Q1VSREFURSgpIixBUlJBWV9BKTsKICAgICRvWydzZW50X3NyY19tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3JkZXJfaWQsbWV0YV92YWx1ZSBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX2Ryb3BzaGlwX3NlbnRfc3JjJyBPUkRFUiBCWSBvcmRlcl9pZCBERVNDIExJTUlUIDMiLEFSUkFZX0EpOwogICAgJG9bJ3RlbXBfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-114229';
const GKEY='ps_e4p';
const PHASES=["P"];
const OUT='analize/s1621_e4p.json';
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
