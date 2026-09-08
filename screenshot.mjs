process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQ3IFQwIGJsb2thcyBBICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfdDcnXSk/JF9HRVRbJ3BzX3Q3J106JycpOyBpZigkZiE9PSdBJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NDcnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRyb290PXJ0cmltKEFCU1BBVEgsJy8nKTsKICAgIC8vIDEuIFNrYWl0aWtsaWFpCiAgICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wX2F2cG5fY291bnRlcic9PjExMDAwLCdwZXRzaG9wX2tyYXZwbl9jb3VudGVyJz0+MTAxLCdwZXRzaG9wX2lhcHZfY291bnRlcic9PjEwMSwncGV0c2hvcF9wcGtfY291bnRlcic9PjEwMSkgYXMgJGs9PiR2KXsKICAgICAgJHNlbj1nZXRfb3B0aW9uKCRrKTsgdXBkYXRlX29wdGlvbigkaywkdik7ICRvWydza2FpdGlrbGlhaSddWyRrXT0kc2VuLictPicuZ2V0X29wdGlvbigkayk7CiAgICB9CiAgICAvLyAyLiBQYXlzZXJhIHRlc3QKICAgICRwcz1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9wYXlzZXJhX3NldHRpbmdzJyk7CiAgICBpZihpc19hcnJheSgkcHMpKXsgJG9bJ3BheXNlcmFfcmFrdGFpJ109YXJyYXlfa2V5cygkcHMpOwogICAgICBmb3JlYWNoKCRwcyBhcyAkaz0+JHYpeyBpZihwcmVnX21hdGNoKCcvdGVzdHxzYW5kYm94L2knLCRrKSAmJiAkdiE9PSdubycgJiYgJHYhPT0nJyl7ICRvWydwYXlzZXJhX2tlaXN0YSddWyRrXT0kdi4nLT5ubyc7ICRwc1ska109J25vJzsgfSB9CiAgICAgIGlmKGlzc2V0KCRvWydwYXlzZXJhX2tlaXN0YSddKSkgdXBkYXRlX29wdGlvbignd29vY29tbWVyY2VfcGF5c2VyYV9zZXR0aW5ncycsJHBzKTsKICAgIH0KICAgIC8vIDMuIFNFTyArIFNTTAogICAgdXBkYXRlX29wdGlvbignYmxvZ19wdWJsaWMnLDEpOyAkb1snYmxvZ19wdWJsaWMnXT1nZXRfb3B0aW9uKCdibG9nX3B1YmxpYycpOwogICAgdXBkYXRlX29wdGlvbignd29vY29tbWVyY2VfZm9yY2Vfc3NsX2NoZWNrb3V0JywneWVzJyk7ICRvWydmb3JjZV9zc2wnXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9mb3JjZV9zc2xfY2hlY2tvdXQnKTsKICAgIC8vIDQuIHdwLWNvbmZpZyBSMTk0CiAgICAkd2NwPSIkcm9vdC93cC1jb25maWcucGhwIjsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHdjcCk7CiAgICBAY29weSgkd2NwLCRyb290LicvcHMtYmFja3Vwcy93cC1jb25maWctQkFLLVQwLScuZGF0ZSgnWW1kX0hpcycpLicucGhwJyk7CiAgICAkbj1wcmVnX3JlcGxhY2UoJ34vXCogUjE5NCBkZXYgdmVpZHJvZGlzLio/XG5cfVxufnMnLCcnLCRjLDEsJGNudCk7CiAgICBpZigkY250PT09MSAmJiBzdHJsZW4oJG4pPHN0cmxlbigkYykpeyBmaWxlX3B1dF9jb250ZW50cygkd2NwLCRuKTsgJG9bJ3dwY29uZmlnJ109J1IxOTQgcGFzYWxpbnRhICgnLihzdHJsZW4oJGMpLXN0cmxlbigkbikpLicgQiknOyB9CiAgICBlbHNlICRvWyd3cGNvbmZpZyddPSdORVBBU0FMSU5UQSBjbnQ9Jy4kY250OwogICAgLy8gNS4gRmFpbHUgdHJ5bmltYXMgKGtvcGlqb3MgaSBwcy1iYWNrdXBzKQogICAgJGJkPSIkcm9vdC9wcy1iYWNrdXBzIjsgaWYoIWlzX2RpcigkYmQpKSBAbWtkaXIoJGJkKTsKICAgIGZvcmVhY2goYXJyYXkoJHJvb3QuJy9wZXJrZWx0aS1yMTg2LnBocCcsV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXYtdmVpZHJvZGlzLnBocCcsV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXYtcGFzdGFzLnBocCcpIGFzICRmbCl7CiAgICAgIGlmKGZpbGVfZXhpc3RzKCRmbCkpeyBAY29weSgkZmwsJGJkLicvJy5iYXNlbmFtZSgkZmwsJy5waHAnKS4nLUJBSy1UMC5waHAnKTsgJG9rPUB1bmxpbmsoJGZsKTsgJG9bJ3RyaW50YSddW2Jhc2VuYW1lKCRmbCldPSRvaz8nT0snOidGQUlMJzsgfQogICAgICBlbHNlICRvWyd0cmludGEnXVtiYXNlbmFtZSgkZmwpXT0nbmVidXZvJzsKICAgIH0KICAgIGRlbGV0ZV9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfbGVpc3RpJyk7CiAgICAvLyA2LiB3cC1zdXBlci1jYWNoZSBrb25maWdlIGRldgogICAgJHNjPVdQX0NPTlRFTlRfRElSLicvd3AtY2FjaGUtY29uZmlnLnBocCc7CiAgICAkb1snc2NfZGV2J109ZmlsZV9leGlzdHMoJHNjKT9zdWJzdHJfY291bnQoZmlsZV9nZXRfY29udGVudHMoJHNjKSwnZGV2LmF2ZXNhLmx0Jyk6J25lcmEnOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICAgd3BfY2FjaGVfZmx1c2goKTsgJG9bJ2NhY2hlJ109J2ZsdXNoJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-223900';
const GKEY='ps_t7';
const PHASES=["A"];
const OUT='analize/s1647_blokasA.json';
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
