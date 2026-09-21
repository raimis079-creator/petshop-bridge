process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE3MDMgYyDigJQgIzExMDQ6IGZhesSXIDEgKHBhdGlrcmEpOiBixatzZW5hLCBlaWx1dMSXcywgcHJpc3RhdHltYXMsIHBhc3RhYm9zIChMUCBzaXVudG9zIG5yKSwgYmFyY29kZSBtZXRhOyBmYXrElyAyOiBiYXJjb2RlIGnFoSBwYXN0YWJvcyDihpIgX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUsIFBldHNob3BfRGFyYmFsYXVraXM6Omlzc2l1c3RhKCRvLCR1LHRydWUsJ2F2JywnbHAnKSDihpIgY29tcGxldGVkICsgbGFpxaFrYXMga2xpZW50dWkgc3Ugc2VraW11LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTcwM2MnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTcwMyBjJyk7ICRmPSRfR0VUWydwc19zMTcwM2MnXTsKICAkaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9yZGVyX2lkIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfb3JkZXJfbnVtYmVyJyBBTkQgbWV0YV92YWx1ZT0nMTExNycgTElNSVQgMSIpOyAkb1snaWQnXT0kaWQ7ICR3PSRpZD93Y19nZXRfb3JkZXIoJGlkKTpudWxsOyBpZighJHcpeyAkb1snZXJyJ109J25lcmFzdGFzJzsgZ290byBvdXQ7IH0KICAkbm90ZXM9d2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4yMCkpOyAkYmM9bnVsbDsgZm9yZWFjaCAoJG5vdGVzIGFzICRuKXsgaWYgKHByZWdfbWF0Y2goJy9cYihbQS1aXXsyfVxkezl9W0EtWl17Mn0pXGIvJyx3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksJG0pKXsgJGJjPSRtWzFdOyBicmVhazsgfSB9CiAgaWYgKCEkYmMpeyAkdnA9KHN0cmluZykkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgb3JkZXJfaWQ9JWQgQU5EIG1ldGFfa2V5PSdfcHNfdmlkaW5lX3Bhc3RhYmEnIiwkaWQpKTsgJG9bJ3ZwJ109JHZwOyBpZiAocHJlZ19tYXRjaCgnL1tBLVpdezJ9WzAtOV17OX1bQS1aXXsyfS91JywkdnAsJG0pKSAkYmM9JG1bMF07IH0gJG9bJ2JjX2lzX3Bhc3RhYm9zJ109JGJjOyAkb1snYmNfbWV0YSddPSR3LT5nZXRfbWV0YSgnX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUnKTsKICBpZiAoJGY9PT0nMScpewogICAgJG9bJ25yJ109JHctPmdldF9vcmRlcl9udW1iZXIoKTsgJG9bJ3N0YXR1cyddPSR3LT5nZXRfc3RhdHVzKCk7ICRvWydzdWt1cnRhJ109JHctPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpOyAkb1snYXBtb2tldGEnXT0kdy0+Z2V0X2RhdGVfcGFpZCgpPyR3LT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ20tZCBIOmknKTpudWxsOyAkb1snbW9rJ109JHctPmdldF9wYXltZW50X21ldGhvZCgpOwogICAgZm9yZWFjaCAoJHctPmdldF9zaGlwcGluZ19tZXRob2RzKCkgYXMgJHMpICRvWydwcmlzdGF0eW1hcyddPSRzLT5nZXRfbWV0aG9kX2lkKCkuJyAnLiRzLT5nZXRfbmFtZSgpOwogICAgZm9yZWFjaCAoJHctPmdldF9pdGVtcygpIGFzICRpdCkgJG9bJ2VpbHV0ZXMnXVtdPSRpdC0+Z2V0X3F1YW50aXR5KCkuJ8OXICcubWJfc3Vic3RyKCRpdC0+Z2V0X25hbWUoKSwwLDUwKS4nIHwgc3JjPScuJGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpLicga2VsaWFzPScuJGl0LT5nZXRfbWV0YSgnX3BzX2tlbGlhcycpOwogICAgJG9bJ2RhbHlzX2lzc2l1c3RhJ109JHctPmdldF9tZXRhKCdfcHNfZGFseXNfaXNzaXVzdGEnKTsgJG9bJ2xwX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsNjApIHYgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgb3JkZXJfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJWxpdGh1YW5pYXBvc3QlJScgT1IgbWV0YV9rZXkgTElLRSAnX3BzX2xwJSUnIE9SIG1ldGFfa2V5IExJS0UgJ19wc19kYWx5cyUlJykiLCRpZCksQVJSQVlfQSk7CiAgICAkb1sncGFzdGFib3MnXT1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiAkbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLiRuLT5hZGRlZF9ieS4nOiAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwxNDApO30sYXJyYXlfc2xpY2UoJG5vdGVzLDAsMTApKTsKICAgICRvWydmcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHZlemVqYXMsc2l1bnRvc19ucixzdGF0dXNhcyxpc3ZlenRhX2F0IEZST00geyRwfXBzX2Zha3Rfc2l1bnRvcyBXSEVSRSB1enNha3ltYXNfaWQ9JWQiLCRpZCksQVJSQVlfQSk7CiAgfQogIGlmICgkZj09PScyJyl7CiAgICBpZiAoISRiYyl7ICRvWydTVE9QJ109J3NpdW50b3MgbnIgcGFzdGFib3NlIG5lcmFzdGFzJzsgZ290byBvdXQ7IH0KICAgIGlmIChpbl9hcnJheSgkdy0+Z2V0X3N0YXR1cygpLGFycmF5KCdjb21wbGV0ZWQnLCdjYW5jZWxsZWQnLCdyZWZ1bmRlZCcpLHRydWUpKXsgJG9bJ1NUT1AnXT0nYsWrc2VuYSBqYXUgJy4kdy0+Z2V0X3N0YXR1cygpOyBnb3RvIG91dDsgfQogICAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywncmFpbWlzJyk7IGlmKCEkdSl7ICR1cz1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ3NlYXJjaCc9PicqYWltKicsJ3NlYXJjaF9jb2x1bW5zJz0+YXJyYXkoJ3VzZXJfbG9naW4nLCdkaXNwbGF5X25hbWUnKSkpOyAkdT0kdXM/JHVzWzBdOm51bGw7IH0gJG9bJ3UnXT0kdT8kdS0+ZGlzcGxheV9uYW1lLicgIycuJHUtPklEOm51bGw7CiAgICBpZiAoIWNsYXNzX2V4aXN0cygnUGV0c2hvcF9EYXJiYWxhdWtpcycpfHwhbWV0aG9kX2V4aXN0cygnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ2lzc2l1c3RhJykpeyAkb1snU1RPUCddPSdpc3NpdXN0YSgpIG5lcmFzdGEnOyBnb3RvIG91dDsgfQogICAgJG9bJ3ByaWVzJ109JHctPmdldF9zdGF0dXMoKTsKICAgIGlmICgkdy0+Z2V0X21ldGEoJ193b29fbGl0aHVhbmlhcG9zdF9iYXJjb2RlJykhPT0kYmMpeyAkdy0+dXBkYXRlX21ldGFfZGF0YSgnX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUnLCRiYyk7ICR3LT5hZGRfb3JkZXJfbm90ZSgnUzE3MDM6IExQIHNla2ltbyBudW1lcmlzICcuJGJjLicgxK9yYcWheXRhcyBpxaEgdmlkaW7El3MgcGFzdGFib3MgKFJhaW1pcyDEr2TEl2pvIMSvIHBhxaF0b21hdMSFIDA5LTIxICgjMTExNykpLicsZmFsc2UsdHJ1ZSk7ICR3LT5zYXZlKCk7IH0KICAgICR3PXdjX2dldF9vcmRlcigkaWQpOyAkb1snaXNzaXVzdGEnXT1QZXRzaG9wX0RhcmJhbGF1a2lzOjppc3NpdXN0YSgkdywkdSx0cnVlLCdhdicsJ2xwJyk7CiAgICAkdz13Y19nZXRfb3JkZXIoJGlkKTsgJG9bJ3BvJ109JHctPmdldF9zdGF0dXMoKTsgJG9bJ2RhbHlzJ109JHctPmdldF9tZXRhKCdfcHNfZGFseXNfaXNzaXVzdGEnKTsgJG9bJ2JjJ109JHctPmdldF9tZXRhKCdfd29vX2xpdGh1YW5pYXBvc3RfYmFyY29kZScpOwogICAgJG9bJ2ZzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdmV6ZWphcyxzaXVudG9zX25yLHN0YXR1c2FzLGlzdmV6dGFfYXQsc2FsdGluaXMgRlJPTSB7JHB9cHNfZmFrdF9zaXVudG9zIFdIRVJFIHV6c2FreW1hc19pZD0lZCIsJGlkKSxBUlJBWV9BKTsKICAgICRvWydwYXN0YWJvcyddPWFycmF5X21hcChmdW5jdGlvbigkbil7cmV0dXJuICRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ0g6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTUwKTt9LGFycmF5X3NsaWNlKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+NSkpLDAsNSkpOwogICAgJG9bJ2xhaXNrYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmbG93LHN0YXR1cyxjcmVhdGVkX2F0IEZST00geyRwfXBzX2VtYWlsX2pvYnMgV0hFUkUgcmVjaXBpZW50X3VzZXJfaWQ9JWQgQU5EIGNyZWF0ZWRfYXQ+PU5PVygpLUlOVEVSVkFMIDEwIE1JTlVURSIsJHctPmdldF9jdXN0b21lcl9pZCgpKSxBUlJBWV9BKTsKICB9CiAgb3V0OgogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-090846';
const GKEY='ps_s1703c';
const PHASES=["1"];
const OUT='analize/s1703_c2.json';
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
