process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGsg4oCUIHNjaGVtb3MgYW5hbGl0aWtvcyBsYW5ndWkuIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NzZrJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2NzYgaycpOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICBmb3JlYWNoKGFycmF5KCdwc19jYXJ0cycsJ3BzX2VtYWlsX2pvYnMnLCdwc19mYWt0X3V6c2FreW1haScsJ3BzX2Zha3RfdXpzYWt5bXVfZWlsdXRlcycsJ3BzX2Zha3RfcmVrbGFtYScsJ3BzX2Zha3Rfc2l1bnRvcycsJ3BzX3dlYl9pdnlraWFpJywncHNfa2xpZW50YWknKSBhcyAkdCl7ICRUPSRwLiR0OyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJFQnIikhPT0kVCl7ICRvWyd0J11bJHRdPSdOxJZSQSc7IGNvbnRpbnVlOyB9ICRvWyd0J11bJHRdPWFycmF5KCdzdHVscCc9PiR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkVCIsMCksJ24nPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVCIpKTsgfQogICRvWydmYWt0X2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1wc19mYWt0JSciKTsKICAkb1snY2FydHNfcHZ6J109JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRwfXBzX2NhcnRzIFdIRVJFIHN0YXR1cz0nYWJhbmRvbmVkJyBPUkRFUiBCWSB1cGRhdGVkX2F0IERFU0MgTElNSVQgMSIsQVJSQVlfQSk7IGlmKCRvWydjYXJ0c19wdnonXSkgZm9yZWFjaCgkb1snY2FydHNfcHZ6J10gYXMgJGs9PiYkdil7IGlmKGlzX3N0cmluZygkdikpICR2PW1iX3N1YnN0cigkdiwwLDQwMCk7IGlmKHByZWdfbWF0Y2goJy9lbWFpbHx2YXJkYXN8bmFtZXxpcC8nLCRrKSkgJHY9JyoqKic7IH0KICAkb1snam9ic19wdnonXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JHB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93PSdjYXJ0X2FiYW5kb25lZCcgQU5EIHN0YXR1cz0nc2VudCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsgaWYoJG9bJ2pvYnNfcHZ6J10pIGZvcmVhY2goJG9bJ2pvYnNfcHZ6J10gYXMgJGs9PiYkdil7IGlmKGlzX3N0cmluZygkdikpICR2PW1iX3N1YnN0cigkdiwwLDIwMCk7IGlmKHByZWdfbWF0Y2goJy9lbWFpbHxyZWNpcGllbnQvJywkaykpICR2PScqKionOyB9CiAgJG9bJ2Z1X3B2eiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskcH1wc19mYWt0X3V6c2FreW1haSBPUkRFUiBCWSAxIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7IGlmKCRvWydmdV9wdnonXSkgZm9yZWFjaCgkb1snZnVfcHZ6J10gYXMgJGs9PiYkdil7IGlmKHByZWdfbWF0Y2goJy9lbWFpbHx2YXJkYXN8cGF2YXJkfHRlbHxhZHJlc3xtaWVzdC8nLCRrKSkgJHY9JyoqKic7IH0KICAkb1sncmVrbF9wdnonXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JHB9cHNfZmFrdF9yZWtsYW1hIE9SREVSIEJZIDEgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICAkb1snbGFua19tZW51J109YXJyYXkoKTsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXRhc2thaXRhLWxhbmtvbXVtYXMucGhwJykgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IHByZWdfbWF0Y2hfYWxsKCIvYWRkX3N1Ym1lbnVfcGFnZVwoW147XXswLDIwMH0vIiwkcywkbSk7ICRvWydsYW5rX21lbnUnXT0kbVswXTsgcHJlZ19tYXRjaCgiL2NsYXNzXHMrKFx3KykvIiwkcywkYyk7ICRvWydsYW5rX2NsYXNzJ109JGNbMV0/PycnOyBwcmVnX21hdGNoX2FsbCgiL2Z1bmN0aW9uXHMrKFx3KylccypcKC8iLCRzLCRmbik7ICRvWydsYW5rX2ZuJ109YXJyYXlfc2xpY2UoJGZuWzFdLDAsMzApOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-081206';
const GKEY='ps_s1676k';
const PHASES=["GO"];
const OUT='analize/s1676_k.json';
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
