process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1eDEgUGF0w6kgMzIgZHJ5ICsgRGF1Z2lhdT1QaWdpYXUgbWl4IHR5cmltYXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI1eDEnXSkpIHJldHVybjsgJHBoPShzdHJpbmcpJF9HRVRbJ3BzX3MxODI1eDEnXTsgJHI9Wyd2Jz0+J1MxODI1eDEnLCdwaCc9PiRwaF07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgaWYoJHBoPT09JzEnKXsKICAgIGZvcmVhY2goWzIxNjc5LDIxNjgxXSBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyAkYz0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9jb3N0Jyx0cnVlKTsgJHJlZz0oZmxvYXQpJHAtPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0Jyk7CiAgICAgICRwaz1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPSVkIiwkaWQpKSBhcyAkeCl7ICRwa1tdPVsoaW50KSR4LGdldF9wb3N0X3N0YXR1cygkeCksKGludClnZXRfcG9zdF9tZXRhKCR4LCdfZHBfcGFja19xdHknLHRydWUpLHdjX2dldF9wcm9kdWN0KCR4KT93Y19nZXRfcHJvZHVjdCgkeCktPmdldF9wcmljZSgpOm51bGwsZ2V0X3Bvc3RfbWV0YSgkeCwnX2RwX251b2xhaWRhX3Byb2MnLHRydWUpXTsgfQogICAgICAkc2ltPVtdOyBmb3JlYWNoKFszMiwzNiw0MCw0OF0gYXMgJHEpeyBmb3JlYWNoKFswLjc0LDAuNzUsMC43NiwwLjc3LDAuNzgsMC43OV0gYXMgJHUpeyAkdD0kdSokcTsgJGJlc3Q9bnVsbDsgZm9yKCRpPTA7JGk8PTIwMDA7JGkrKyl7ICRwcD0kaS8xMDA7ICRrPShmbG9hdClQZXRzaG9wX0RQX0thaW5vczo6a2FpbmEoJHJlZywkcSwkcHApOyBpZigkYmVzdD09PW51bGx8fGFicygkay0kdCk8YWJzKCRiZXN0WzFdLSR0KSkgJGJlc3Q9WyRwcCwka107IGlmKCRrPCR0LTEpIGJyZWFrOyB9ICRzaW1bXT1bJHEsJHUsJGJlc3RbMF0sJGJlc3RbMV0scm91bmQoJGJlc3RbMV0vMS4yMS0kcSokYy0yLjE1LDIpXTsgfSB9CiAgICAgICRyWydwJ11bJGlkXT1bJ25tJz0+JHAtPmdldF9uYW1lKCksJ3JlZyc9PiRyZWcsJ2Nvc3QnPT4kYywnc3QnPT4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3N0YXQnPT4kcC0+Z2V0X3N0YXR1cygpLCdwYWthaSc9PiRwaywnc2ltJz0+JHNpbV07IH0KICAgIGlmKCFmdW5jdGlvbl9leGlzdHMoJ2dldF9wbHVnaW5zJykpIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgICRhY3Q9KGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyxbXSk7ICRwbD1bXTsgZm9yZWFjaChnZXRfcGx1Z2lucygpIGFzICRmPT4kaCl7ICRzPXN0cnRvbG93ZXIoJGhbJ05hbWUnXS4nICcuJGhbJ0Rlc2NyaXB0aW9uJ10pOyBpZihwcmVnX21hdGNoKCcvZGF1Z2lhdXxwaWdpYXV8cXVhbnRpdHl8dGllcnxidWxrfGRpc2NvdW50fGR5bmFtaWN8cHJpY2luZ3xudW9sYWlkfGtpZWsvJywkcykpICRwbFtdPVskZiwkaFsnTmFtZSddLCRoWydWZXJzaW9uJ10saW5fYXJyYXkoJGYsJGFjdCldOyB9ICRyWydwbHVnaW5zJ109JHBsOwogICAgJG11PVtdOyBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZil7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYocHJlZ19tYXRjaCgnL0RhdWdpYXV8UGlnaWF1fF9kcF98a2lla2lvIG51b2xhaWR8d29vY29tbWVyY2VfYmVmb3JlX2NhbGN1bGF0ZV90b3RhbHN8d29vY29tbWVyY2VfY2FydF9jYWxjdWxhdGVfZmVlcy9pJywkdCkpIHsgJGg9Z2V0X2ZpbGVfZGF0YSgkZixbJ24nPT4nUGx1Z2luIE5hbWUnLCd2Jz0+J1ZlcnNpb24nXSk7ICRoaXRzPVtdOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkdCkgYXMgJGxuPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9iZWZvcmVfY2FsY3VsYXRlX3RvdGFsc3xjYXJ0X2NhbGN1bGF0ZV9mZWVzfGFkZF9mZWV8c2V0X3ByaWNlXCh8bWl4fGxpbmlqfGthdGVnb3Jpanx0aWVyfHBha29wYS9pJywkbCkpICRoaXRzW109KCRsbisxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE2MCk7IGlmKGNvdW50KCRoaXRzKT4yNSkgYnJlYWs7IH0gJG11W109W2Jhc2VuYW1lKCRmKSwkaFsnbiddLCRoWyd2J10sc3RybGVuKCR0KSwkaGl0c107IH0gfSAkclsnbXUnXT0kbXU7CiAgICAkclsnb3B0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFTkdUSChvcHRpb25fdmFsdWUpIGwgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclZGF1Z2lhdSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVwaWdpYXUlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19kcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV0aWVyJScgTElNSVQgNDAiLEFSUkFZX0EpOwogICAgJHJbJ3NuaXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJyVhdWdpYXUlJyBPUiBuYW1lIExJS0UgJyVpZ2lhdSUnIE9SIGNvZGUgTElLRSAnJWJlZm9yZV9jYWxjdWxhdGVfdG90YWxzJScgT1IgY29kZSBMSUtFICclY2FydF9jYWxjdWxhdGVfZmVlcyUnIExJTUlUIDMwIixBUlJBWV9BKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-132528';
const GKEY='ps_s1825x1';
const PHASES=["1"];
const OUT='analize/s1825_x1.json';
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
