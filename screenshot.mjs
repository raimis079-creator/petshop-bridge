process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgaSDigJQgcmVhZC1vbmx5OiBuYXLFoXlrbMSXcyB0ZXN0YXMg4oCUIGNoZWNrb3V0IHN1IGxlbmd2YSBBViBwcmVrZSwgcGFzaXJpbmt0aSBMUCBFeHByZXNzLCBhciBtYXRvbWFzIHBhxaF0b21hdMWzIHNlbGVjdCAoZWtyYW5vIG51b3RyYXVrYSArIEpTIGtsYWlkb3MpLiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgwaSddKSkgcmV0dXJuOyAkbz1hcnJheSgndic9PidTMTY4MCBpJyk7CiAgd2NfbG9hZF9jYXJ0KCk7IFdDKCktPnNlc3Npb24tPnNldF9jdXN0b21lcl9zZXNzaW9uX2Nvb2tpZSh0cnVlKTsgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOyBXQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgxNjI5OCwxKTsKICBXQygpLT5jdXN0b21lci0+c2V0X3NoaXBwaW5nX2NvdW50cnkoJ0xUJyk7IFdDKCktPmN1c3RvbWVyLT5zZXRfYmlsbGluZ19jb3VudHJ5KCdMVCcpOyBXQygpLT5jdXN0b21lci0+c2F2ZSgpOyBXQygpLT5jYXJ0LT5jYWxjdWxhdGVfdG90YWxzKCk7IFdDKCktPnNlc3Npb24tPnNhdmVfZGF0YSgpOwogICRjb29raWVzPWFycmF5KCk7IGZvcmVhY2goaGVhZGVyc19saXN0KCkgYXMgJGgpeyBpZihzdHJpcG9zKCRoLCdTZXQtQ29va2llOiB3cF93b29jb21tZXJjZV9zZXNzaW9uXycpPT09MCl7ICRrdj1leHBsb2RlKCc9JyxzdWJzdHIoJGgsMTIpLDIpOyAkY29va2llc1tdPWFycmF5KCduYW1lJz0+JGt2WzBdLCd2YWx1ZSc9PnVybGRlY29kZShleHBsb2RlKCc7Jywka3ZbMV0pWzBdKSk7IH0gfQogICRvWydjb29raWVzJ109JGNvb2tpZXM7ICR1PXdjX2dldF9jaGVja291dF91cmwoKTsgJG9bJ2NoZWNrb3V0X3VybCddPSR1OwogICRldj0iKCgpPT57Y29uc3Qgcj1bLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3NoaXBwaW5nX21ldGhvZCBpbnB1dFt0eXBlPXJhZGlvXScpXS5tYXAoaT0+aS52YWx1ZSsnOicraS5jaGVja2VkKTtjb25zdCBzPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdC53b29fbGl0aHVhbmlhcG9zdF9scGV4cHJlc3NfdGVybWluYWxfaWQnKTtjb25zdCBzMj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0Mi1jb250YWluZXInKTtjb25zdCBjcz1zP2dldENvbXB1dGVkU3R5bGUocyk6bnVsbDtyZXR1cm4ge3JhZGlvczpyLHNlbGVjdDohIXMsb3B0czpzP3Mub3B0aW9ucy5sZW5ndGg6MCxkaXNwOmNzP2NzLmRpc3BsYXk6bnVsbCx2aXM6cz8ocy5vZmZzZXRXaWR0aD4wJiZzLm9mZnNldEhlaWdodD4wKTpudWxsLHNlbGVjdDI6ISFzMixzMnZpczpzMj8oczIub2Zmc2V0V2lkdGg+MCk6bnVsbCxqcTp0eXBlb2YgalF1ZXJ5LHNlbDJmbjoodHlwZW9mIGpRdWVyeSE9PSd1bmRlZmluZWQnJiZqUXVlcnkuZm4mJnR5cGVvZiBqUXVlcnkuZm4uc2VsZWN0MiksbGk6KCgpPT57Y29uc3QgbD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2hpcHBpbmdfbWV0aG9kIGxpLnBldHNob3Atc2VsZWN0ZWQtc2hpcHBpbmcnKTtyZXR1cm4gbD9sLmlubmVyVGV4dC5zbGljZSgwLDIwMCk6bnVsbH0pKCl9fSkoKSI7CiAgJG9bJ3Nob3RzJ109YXJyYXkoCiAgICBhcnJheSgnbic9PidzMTY4MF9scF9hZGQnLCd1Jz0+aG9tZV91cmwoJy8/YWRkLXRvLWNhcnQ9MTYyOTgnKSwndyc9PjE0NDApLAogICAgYXJyYXkoJ24nPT4nczE2ODBfbHBfcHJpZXMnLCd1Jz0+JHUsJ3cnPT4xNDQwLCdldmFsJz0+JGV2KSwKICAgIGFycmF5KCduJz0+J3MxNjgwX2xwX3BvJywndSc9PiR1LCd3Jz0+MTQ0MCwnY2xpY2snPT4naW5wdXRbdmFsdWU9Indvb19saXRodWFuaWFwb3N0X2xwZXhwcmVzc190ZXJtaW5hbDoxMiJdJywnZXZhbCc9PiRldiksCiAgICBhcnJheSgnbic9PidzMTY4MF9scF9wbzInLCd1Jz0+JHUsJ3cnPT4xNDQwLCdldmFsJz0+JGV2KSwKICAgIGFycmF5KCduJz0+J3MxNjgwX2xwX21vYicsJ3UnPT4kdSwndyc9PjM5MCwnaCc9Pjg0NCwnY2xpY2snPT4naW5wdXRbdmFsdWU9Indvb19saXRodWFuaWFwb3N0X2xwZXhwcmVzc190ZXJtaW5hbDoxMiJdJywnZXZhbCc9PiRldiwnZnVsbCc9PnRydWUpLAogICk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-073755';
const GKEY='ps_s1680i';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_i5.json';
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
