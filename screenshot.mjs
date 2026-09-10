process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggYmIg4oCUIDcgSGF1Jk1pYXUganVvZHJhxaHEjWnFsyBwYXNrZWxiaW1hcyArICMxMjU4MCBBViByZWdpc3RybyBlaWx1dMSXLiBEUlkgLyBBIC8gVi4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NjhiYiddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTY2OGJiJ107IGdsb2JhbCAkd3BkYjsgJFM9JHdwZGItPnByZWZpeC4ncHNfc291cmNlcyc7ICRvPWFycmF5KCd2Jz0+J1MxNjY4IGJiJywnZmF6ZSc9PiRmKTsKICAkRFI9YXJyYXkoMTI4MjUsMTI4MjYsMTI4NzEsMTI5NTgsMTI5OTgsMTI5OTksMTQzNjMpOwogIHRyeXsKICBmb3JlYWNoKCREUiBhcyAkcGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgJG9bJ2RyJ11bJHBpZF09YXJyYXkoJ3N0Jz0+JHByLT5nZXRfc3RhdHVzKCksJ2thaW5hJz0+JHByLT5nZXRfcHJpY2UoKSwna2F0Jz0+Y291bnQoJHByLT5nZXRfY2F0ZWdvcnlfaWRzKCkpLCdmb3RvJz0+JHByLT5nZXRfaW1hZ2VfaWQoKT8xOjAsJ3Zpcyc9PiRwci0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLCdhdic9PlBldHNob3BfUGFydGlqb3M6OmF2X2xpa3V0aXMoJHBpZCksJ3QnPT5tYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsNDApKTsKICAgIGlmKCRmPT09J0EnICYmICRwci0+Z2V0X3N0YXR1cygpPT09J2RyYWZ0Jyl7ICRwci0+c2V0X3N0YXR1cygncHVibGlzaCcpOyAkcHItPnNhdmUoKTsgfSB9CiAgJHBpZD0xMjU4MDsgJGV4PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NICRTIFdIRVJFIHByb2R1Y3RfaWQ9JHBpZCBBTkQgc291cmNlPSdhdiciLEFSUkFZX0EpOwogICR0cGw9JHdwZGItPmdldF9yb3coIlNFTEVDVCBzLiogRlJPTSAkUyBzIEpPSU4geyR3cGRiLT5wcmVmaXh9cG9zdG1ldGEgcG0gT04gcG0ucG9zdF9pZD1zLnByb2R1Y3RfaWQgQU5EIHBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBwbS5tZXRhX3ZhbHVlPSd6YicgV0hFUkUgcy5zb3VyY2U9J2F2JyBBTkQgcy5pc19hY3RpdmU9MSBMSU1JVCAxIixBUlJBWV9BKTsKICAkb1snMTI1ODAnXT1hcnJheSgnYXZfZWlsJz0+JGV4PydZUkEnOiduZXJhJywnYXYnPT5QZXRzaG9wX1BhcnRpam9zOjphdl9saWt1dGlzKCRwaWQpLCdlaWx1dGVzJz0+JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICRTIFdIRVJFIHByb2R1Y3RfaWQ9JHBpZCIsQVJSQVlfQSksJ3piX2F2X3NhYmxvbmFzJz0+JHRwbCk7CiAgaWYoJGY9PT0nQScgJiYgISRleCl7CiAgICAkcm93PWFycmF5KCk7IGZvcmVhY2goYXJyYXlfa2V5cygkdHBsKSBhcyAkayl7IGlmKCRrPT09J2lkJykgY29udGludWU7ICRyb3dbJGtdPW51bGw7IH0KICAgICR6Yj0kb1snMTI1ODAnXVsnZWlsdXRlcyddWzBdOwogICAgZm9yZWFjaCgkcm93IGFzICRrPT4kdil7IGlmKGFycmF5X2tleV9leGlzdHMoJGssJHpiKSkgJHJvd1ska109JHpiWyRrXTsgfQogICAgZm9yZWFjaCgkdHBsIGFzICRrPT4kdil7IGlmKGluX2FycmF5KCRrLGFycmF5KCdwcmlvcml0eScsJ2lzX2FjdGl2ZScsJ3NvdXJjZScsJ3N0b2NrX3NvdXJjZScsJ2RhdGFfc291cmNlJywndGlwYXMnLCdzeW5jX21vZGUnKSx0cnVlKSkgJHJvd1ska109JHY7IH0KICAgICRyb3dbJ3Byb2R1Y3RfaWQnXT0kcGlkOyAkcm93Wydzb3VyY2UnXT0nYXYnOyAkcm93WydzdG9ja19xdHknXT1QZXRzaG9wX1BhcnRpam9zOjphdl9saWt1dGlzKCRwaWQpOwogICAgJHJvd1snY29zdF9uZXQnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHNhdmlrYWluYV9ldXIgRlJPTSB7JHdwZGItPnByZWZpeH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSRwaWQgQU5EIGF0c2F1a3RhPTAgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIik7CiAgICBmb3JlYWNoKGFycmF5KCdzdXBwbGllcl9za3UnLCdleHRlcm5hbF9pZCcsJ3N5bmNlZF9hdCcsJ2ZlZWRfaWQnKSBhcyAkaykgaWYoYXJyYXlfa2V5X2V4aXN0cygkaywkcm93KSkgJHJvd1ska109bnVsbDsKICAgIGlmKGFycmF5X2tleV9leGlzdHMoJ2NyZWF0ZWRfYXQnLCRyb3cpKSAkcm93WydjcmVhdGVkX2F0J109Y3VycmVudF90aW1lKCdteXNxbCcpOyBpZihhcnJheV9rZXlfZXhpc3RzKCd1cGRhdGVkX2F0Jywkcm93KSkgJHJvd1sndXBkYXRlZF9hdCddPWN1cnJlbnRfdGltZSgnbXlzcWwnKTsKICAgICRvWydpbnMnXT0kd3BkYi0+aW5zZXJ0KCRTLCRyb3cpPydPSyAjJy4kd3BkYi0+aW5zZXJ0X2lkOidLTEFJREEgJy4kd3BkYi0+bGFzdF9lcnJvcjsgJG9bJ2luc19yb3cnXT0kcm93OwogIH0KICBpZigkZj09PSdWJyl7IGZvcmVhY2goJERSIGFzICRwaWQpeyAkcj13cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoJHBpZCksYXJyYXkoJ3RpbWVvdXQnPT4yMCkpOyAkb1snZnJvbnQnXVskcGlkXT1pc193cF9lcnJvcigkcik/J0VSUic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLicgJy4ocHJlZ19tYXRjaCgnL2NsYXNzPSJzdG9jayBpbi1zdG9jayIvJyx3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpPydpbi1zdG9jayc6Jz8nKTsgfQogICAgJG9bJ3JlZ19kciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsc3RvY2tfcXR5LGlzX2FjdGl2ZSBGUk9NICRTIFdIRVJFIHNvdXJjZT0nYXYnIEFORCBwcm9kdWN0X2lkIElOICgiLmltcGxvZGUoJywnLCREUikuIikiLEFSUkFZX0EpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-143501';
const GKEY='ps_s1668bb';
const PHASES=["DRY"];
const OUT='analize/s1668_bb_dry.json';
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
