process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgyaiBMUCBFeHByZXNzIHXFvnNha3ltYWkgcGFnYWwgc2F2YWl0xJkgKyBzbMSXcGltbyB0YWlzeWtsxJcgKHRpayBza2FpdHltYXMpIMK3IDEgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgyaiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc4MmonXTsKICAkclsncGFnYWxfc2F2J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgWUVBUldFRUsoby5kYXRlX2NyZWF0ZWRfZ210LDMpIHNhdiwgaS5vcmRlcl9pdGVtX25hbWUgbWV0b2RhcywgQ09VTlQoKikgbiBGUk9NIHskUH13Y19vcmRlcnMgbyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIE9OIGkub3JkZXJfaWQ9by5pZCBBTkQgaS5vcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBXSEVSRSBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA5JyBBTkQgby5zdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEdST1VQIEJZIHNhdiwgbWV0b2RhcyBPUkRFUiBCWSBzYXYsIG4gREVTQyIsQVJSQVlfQSk7CiAgJHJbJ2xwX3Bhc2snXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLCBEQVRFKG8uZGF0ZV9jcmVhdGVkX2dtdCkgZCBGUk9NIHskUH13Y19vcmRlcnMgbyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIE9OIGkub3JkZXJfaWQ9by5pZCBBTkQgaS5vcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBXSEVSRSBpLm9yZGVyX2l0ZW1fbmFtZSBMSUtFICclTFAlJyBPUiBpLm9yZGVyX2l0ZW1fbmFtZSBMSUtFICclTGlldHV2b3MgcGElJyBPUkRFUiBCWSBvLmRhdGVfY3JlYXRlZF9nbXQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAkclsnaXN0X2xwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTEVGVChzdWt1cnRhLDcpIG1lbiwgQ09VTlQoKikgbiBGUk9NIHskUH1wc19pc3RfZmFrdF91enNha3ltYWkgV0hFUkUgcHJpc3RhdHltb19idWRhcyBMSUtFICclTFAlJyBPUiBwcmlzdGF0eW1vX2J1ZGFzIExJS0UgJyVwYcWhdCUnIEdST1VQIEJZIG1lbiBPUkRFUiBCWSBtZW4gREVTQyBMSU1JVCA0IixBUlJBWV9BKTsKICAkclsnaXN0X3N0dWxwJ109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZuKCRjKT0+JGNbJ0ZpZWxkJ10sJHdwZGItPmdldF9yZXN1bHRzKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIixBUlJBWV9BKSksMCw0MCk7CiAgJHNyYz1bXTsgZm9yZWFjaChbV1BNVV9QTFVHSU5fRElSLGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpXSBhcyAkZCkgZm9yZWFjaChuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQpKSBhcyAkZikgaWYoISRmLT5pc0RpcigpJiZzdWJzdHIoJGYtPmdldEZpbGVuYW1lKCksLTQpPT09Jy5waHAnKSAkc3JjW2Jhc2VuYW1lKCRmLT5nZXRQYXRobmFtZSgpKV09ZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxjb2RlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIixBUlJBWV9BKSBhcyAkcykgJHNyY1snc25pcHBldCMnLiRzWydpZCddLicgJy4kc1snbmFtZSddXT0kc1snY29kZSddOwogIGZvcmVhY2goJHNyYyBhcyAkbj0+JGMpeyBpZighcHJlZ19tYXRjaCgnL2xpdGh1YW5pYXBvc3R8bHBfZXhwcmVzc3xoaWRlX3BhcmNlbHxwYXN0b21hdG9fc2FyZ2FzfHdvb19saXRodWFuaWFwb3N0L2knLCRjKSkgY29udGludWU7ICRMPWV4cGxvZGUoIlxuIiwkYyk7IGZvcmVhY2goJEwgYXMgJGk9PiRsKSBpZihwcmVnX21hdGNoKCcvdW5zZXRcKFxzKlwkcmF0ZXN8aGlkZV9wYXJjZWx8cGFzdG9tYXRvX3Nhcmdhc3xsaXRodWFuaWFwb3N0LioodW5zZXR8cmV0dXJufGNvbnRpbnVlKXxjYXJyaWVyfHN2b3Jpc3x3ZWlnaHR8MjUvaScsJGwpJiZjb3VudCgkclsnbHBfa29kYXMnXVskbl0/P1tdKTwxMCkgJHJbJ2xwX2tvZGFzJ11bJG5dW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKTsgfQogICRyWyd6b25vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHouem9uZV9uYW1lLCBtLm1ldGhvZF9pZCwgbS5pc19lbmFibGVkLCBtLmluc3RhbmNlX2lkIEZST00geyRQfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVfbWV0aG9kcyBtIEpPSU4geyRQfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVzIHogT04gei56b25lX2lkPW0uem9uZV9pZCBPUkRFUiBCWSB6LnpvbmVfb3JkZXIiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-170157';
const GKEY='ps_s1782j';
const PHASES=["1"];
const OUT='analize/s1782_j.json';
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
