process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQybiByZWNvbiBMUCBzaXVudMWzIGZvcm1hdmltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQybiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3NDJuJ107CiAgdHJ5ewogICAgJGRpcnM9W107IGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvKicsR0xPQl9PTkxZRElSKSBhcyAkZCkgaWYocHJlZ19tYXRjaCgnL2xpdGh1YW5pYXxscGV4cHJlc3N8bHAtP2V4cHJlc3N8cG9zdC9pJyxiYXNlbmFtZSgkZCkpKSAkZGlyc1tdPSRkOyAkclsnZGlycyddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRkaXJzKTsKICAgICRwYXQ9Jy8oQ0hDQXxURVJNSU5BTHx0ZXJtaW5hbF90eXBlfGNvdXJpZXJfdHlwZXxzZW5kZXJfdHlwZXx0ZW1wbGF0ZXxIQ3xDQXxDQ3xUVHxzZW5kaW5nVHlwZXxzaGlwbWVudF90eXBlfHBpY2t1cHxMUF9FWFBSRVNTfEVYUFJFU1N8c2VuZGVyLj8obWV0aG9kfHR5cGUpfGNhbGxfY291cmllcnxjb3VyaWVyX2NhbGwpLyc7CiAgICBmb3JlYWNoKCRkaXJzIGFzICRkKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkTD1AZmlsZSgkZik7IGlmKCEkTCkgY29udGludWU7ICRyZWw9c3RyX3JlcGxhY2UoV1BfUExVR0lOX0RJUi4nLycsJycsJGYpOyBmb3JlYWNoKCRMIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy8oY291cmllcnxrdXJqZXJ8dGVybWluYWx8cGHFoXRvbWF0fHRlbXBsYXRlX2lkfHRlbXBsYXRlSWR8Y2FsbC4/Y291cmllcnxzZW5kZXIpL2knLCRsKSAmJiBwcmVnX21hdGNoKCcvKD0+fFxiaWZcYnxmdW5jdGlvbnxjYXNlfGNvbnN0fFwkW2Etel9dK1xzKj0pL2knLCRsKSkgeyAkclsnZyddWyRyZWxdW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMTcwKTsgfSB9IGlmKGlzc2V0KCRyWydnJ11bJHJlbF0pICYmIGNvdW50KCRyWydnJ11bJHJlbF0pPjQ1KSAkclsnZyddWyRyZWxdPWFycmF5X3NsaWNlKCRyWydnJ11bJHJlbF0sMCw0NSk7IH0gfQogICAgJG89JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDMwMCkgdiBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJWxpdGh1YW5pYSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVscGV4cHJlc3MlJyBPUiBvcHRpb25fbmFtZSBMSUtFICd3b29fbHAlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclX2xwXyUnIE9SREVSIEJZIG9wdGlvbl9uYW1lIExJTUlUIDYwIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJG8gYXMgJHgpeyAkdj0keFsndiddOyBpZihwcmVnX21hdGNoKCcvcGFzc3xzZWNyZXR8dG9rZW58a2V5L2knLCR4WydvcHRpb25fbmFtZSddKSkgJHY9JyhzbGVwaWFtYSknOyAkclsnb3B0J11bJHhbJ29wdGlvbl9uYW1lJ11dPXByZWdfcmVwbGFjZSgnLygiPyhwYXNzd29yZHxzZWNyZXR8dG9rZW58Y2xpZW50X3NlY3JldHxhcGlfa2V5KSI/XHMqWzo7XVteOyx9XSopL2knLCckMjooc2xlcGlhbWEpJywkdik7IH0KICAgIC8vIG3Fq3PFsyBrb2Rhcywga3VyaXMga3ZpZcSNaWEgTFAKICAgIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoX2FsbCgnL14uKihMaXRodWFuaWFwb3N0fGxpdGh1YW5pYXBvc3R8TFBfRXhwcmVzc3xscGV4cHJlc3N8d29vX2xwKS4qJC9taScsJHMsJG0pKSAkclsnbXUnXVtiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cih0cmltKCR4KSwwLDE2MCk7fSwkbVswXSksMCw2KTsgfQogICAgJHJbJ21ldGFfa2V5cyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV9rZXkgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICclbHAlJyBPUiBtZXRhX2tleSBMSUtFICclbGl0aHVhbmlhJScgTElNSVQgNDAiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-174922';
const GKEY='ps_s1742n';
const PHASES=["1"];
const OUT='analize/s1742_n.json';
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
