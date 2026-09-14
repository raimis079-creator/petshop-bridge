process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgaCDigJQgcmVhZC1vbmx5OiBMUCBwYcWhdG9tYXRvIGxhdWtvIEhUTUwgY2hlY2tvdXQnZSAoc2ltdWxpYWNpamEgc3UgTFAgcGFzaXJpbmt0dSksIHBsdWdpbm8ga2FibGlhaS9KUy4gKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4MGgnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiLCR3cF9maWx0ZXI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgwIGgnKTsKICAkZD1XUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbi8nOyAkYz1maWxlX2dldF9jb250ZW50cygkZC4naW5jbHVkZXMvY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QucGhwJyk7CiAgcHJlZ19tYXRjaF9hbGwoIi9hZGRfKD86YWN0aW9ufGZpbHRlcilccypcKFxzKlsnXCJdKFteJ1wiXSspWydcIl1ccyosXHMqXFxcJHBsdWdpbl9wdWJsaWNccyosXHMqWydcIl0oW14nXCJdKylbJ1wiXS8iLCRjLCRtKTsgJG9bJ3B1YmxpY19ob29rcyddPWFycmF5X21hcChmdW5jdGlvbigkYSwkYil7cmV0dXJuICIkYeKGkiRiIjt9LCRtWzFdLCRtWzJdKTsKICAkYzI9ZmlsZV9nZXRfY29udGVudHMoJGQuJ3B1YmxpYy9jbGFzcy13b28tbGl0aHVhbmlhcG9zdC1wdWJsaWMucGhwJyk7IHByZWdfbWF0Y2hfYWxsKCcvd3BfZW5xdWV1ZV9zY3JpcHRccypcKFteO10qO3x3cF9yZWdpc3Rlcl9zY3JpcHRccypcKFteO10qOy8nLCRjMiwkbTIpOyAkb1snc2NyaXB0cyddPWFycmF5X21hcChmdW5jdGlvbigkcyl7cmV0dXJuIHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdWJzdHIoJHMsMCwyMjApKTt9LCRtMlswXSk7CiAgcHJlZ19tYXRjaF9hbGwoJy93cF9sb2NhbGl6ZV9zY3JpcHRccypcKFteO10qO3x3cF9hZGRfaW5saW5lX3NjcmlwdFteO10qOy9zJywkYzIsJG0zKTsgJG9bJ2xvY2FsaXplJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRzKXtyZXR1cm4gcHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkcywwLDMwMCkpO30sJG0zWzBdKTsKICBwcmVnX21hdGNoKCcvZnVuY3Rpb24gcmVuZGVyX3Rlcm1pbmFsX2ZpZWxkW157XSpceyguKj8pXG5ccypcfVxuL3MnLCRjMiwkbTQpOyAkb1sncmVuZGVyX3Rlcm1pbmFsX2ZpZWxkJ109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkbTRbMV0/PycnLDAsMTUwMCkpOwogIHByZWdfbWF0Y2goJy9mdW5jdGlvbiBoYW5kbGVfZ2VuZXJhdGVfdGVybWluYWxfZHJvcGRvd25faHRtbFtee10qXHsoLio/KVxuXHMqXH1cbi9zJywkYzIsJG01KTsgJG9bJ2Ryb3Bkb3duX2ZuJ109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkbTVbMV0/PycnLDAsMTIwMCkpOwogIGZvcmVhY2goZ2xvYigkZC4ncHVibGljL2pzLyouanMnKSBhcyAkaikgJG9bJ2pzJ11bXT1iYXNlbmFtZSgkaikuJyAnLmZpbGVzaXplKCRqKTsKICAkcGlkPTE2Mjk4OyB3Y19sb2FkX2NhcnQoKTsgV0MoKS0+c2Vzc2lvbi0+c2V0X2N1c3RvbWVyX3Nlc3Npb25fY29va2llKHRydWUpOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7IFdDKCktPmNhcnQtPmFkZF90b19jYXJ0KCRwaWQsMSk7CiAgV0MoKS0+Y3VzdG9tZXItPnNldF9zaGlwcGluZ19jb3VudHJ5KCdMVCcpOyBXQygpLT5jdXN0b21lci0+c2V0X2JpbGxpbmdfY291bnRyeSgnTFQnKTsgV0MoKS0+c2Vzc2lvbi0+c2V0KCdjaG9zZW5fc2hpcHBpbmdfbWV0aG9kcycsYXJyYXkoJ3dvb19saXRodWFuaWFwb3N0X2xwZXhwcmVzc190ZXJtaW5hbDoxMicpKTsKICAkcGs9V0MoKS0+c2hpcHBpbmcoKS0+Y2FsY3VsYXRlX3NoaXBwaW5nKFdDKCktPmNhcnQtPmdldF9zaGlwcGluZ19wYWNrYWdlcygpKTsgV0MoKS0+c2Vzc2lvbi0+c2V0KCdzaGlwcGluZ19mb3JfcGFja2FnZV8wJyxhcnJheSgncGFja2FnZV9oYXNoJz0+J3gnLCdyYXRlcyc9PiRwa1swXVsncmF0ZXMnXSkpOwogICRyYXRlPSRwa1swXVsncmF0ZXMnXVsnd29vX2xpdGh1YW5pYXBvc3RfbHBleHByZXNzX3Rlcm1pbmFsOjEyJ10/P251bGw7ICRvWydyYXRlJ109JHJhdGU/JHJhdGUtPmdldF9sYWJlbCgpOm51bGw7CiAgZm9yZWFjaChhcnJheSgnd29vY29tbWVyY2VfYWZ0ZXJfc2hpcHBpbmdfcmF0ZScsJ3dvb2NvbW1lcmNlX3Jldmlld19vcmRlcl9hZnRlcl9zaGlwcGluZycsJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X2FmdGVyX29yZGVyX3JldmlldycsJ3dvb2NvbW1lcmNlX3Jldmlld19vcmRlcl9iZWZvcmVfcGF5bWVudCcpIGFzICRoKXsgb2Jfc3RhcnQoKTsgaWYoJGg9PT0nd29vY29tbWVyY2VfYWZ0ZXJfc2hpcHBpbmdfcmF0ZScmJiRyYXRlKSBkb19hY3Rpb24oJGgsJHJhdGUsMCk7IGVsc2VpZigkaCE9PSd3b29jb21tZXJjZV9hZnRlcl9zaGlwcGluZ19yYXRlJykgZG9fYWN0aW9uKCRoKTsgJGh0bWw9b2JfZ2V0X2NsZWFuKCk7ICRvWydodG1sJ11bJGhdPWFycmF5KHN0cmxlbigkaHRtbCksc3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdHJpcF90YWdzKCRodG1sLCc8c2VsZWN0PjxvcHRpb24+PGlucHV0PjxkaXY+JykpLDAsNDAwKSxzdWJzdHJfY291bnQoJGh0bWwsJzxvcHRpb24nKSk7IH0KICBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-072435';
const GKEY='ps_s1680h';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_h.json';
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
