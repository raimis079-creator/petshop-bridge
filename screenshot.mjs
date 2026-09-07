process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM4aCAxOTQ0MCBwYWt1b3RlcyBrZWl0aW1hcyArIGdhdmltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19sOCddKT8kX0dFVFsncHNfbDgnXTonJykhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTYzOGgnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRQVD0kd3BkYi0+cHJlZml4Lidwc19wYXJ0aWpvcyc7ICRwaWQ9MTk0NDA7CiAgICAkb1sncHJpZXMnXT1hcnJheSgnc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc2t1Jyx0cnVlKSwnZWFuJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfZWFuJyx0cnVlKSwKICAgICAgJ2d1aWQnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKSwnc3RvY2snPT4oaW50KWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSk7CiAgICBpZihtYl9zdHJwb3MoZ2V0X3RoZV90aXRsZSgkcGlkKSwnQ2hpY2tlbiBMaXZlcicpPT09ZmFsc2UpeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCduZSB0YSBrb3J0YScpOyB9CiAgICBpZighKGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gJFBUIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIHBhc3RhYmEgTElLRSAlcyIsJHBpZCwnJTU1MTAvVC8yMDI2JScpKSl7CiAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3NrdScsJzgzMzA0Jyk7CiAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX2VhbicsJzQwMTc3MjE4MzMwNDInKTsKICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJzQwMTc3MjE4MzMwNDInKTsKICAgICAgJHJlcz1QZXRzaG9wX1BhcnRpam9zOjpwcmlpbXRpKCRwaWQsYXJyYXkoJ2tpZWtpcyc9PjY0LCdzYXZpa2FpbmEnPT4nMi4xNScsJ3ZhbGl1dGEnPT4nUExOJywna3Vyc2FzJz0+NC4xMiwKICAgICAgICAndGlla2VqYXMnPT4nQW5pbW9uZGEnLCdwYXN0YWJhJz0+J0Zha3R1cmEgdmF0IDU1MTAvVC8yMDI2IChTMTYzOCknKSk7CiAgICAgIGlmKGlzX3dwX2Vycm9yKCRyZXMpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCRyZXMtPmdldF9lcnJvcl9tZXNzYWdlKCkpOwogICAgICAkb1sncGFydGlqYSddPSRyZXM7CiAgICB9IGVsc2UgJG9bJ2phdV95cmEnXT0xOwogICAgJG9bJ3BvJ109YXJyYXkoJ3NrdSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3NrdScsdHJ1ZSksJ2Vhbic9PmdldF9wb3N0X21ldGEoJHBpZCwnX2VhbicsdHJ1ZSksJ3N0b2NrJz0+KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSkpOwogICAgJGRiPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsa2lla2lzX2dhdXRhcyxzYXZpa2FpbmFfb3JpZyxzYXZpa2FpbmFfZXVyIEZST00gJFBUIFdIRVJFIHBhc3RhYmEgTElLRSAnJTU1MTAvVC8yMDI2JSciLEFSUkFZX0EpOwogICAgJG9bJ2RiJ109YXJyYXkoJ3BhcnRpanUnPT5jb3VudCgkZGIpLAogICAgICAncSc9PmFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAoaW50KSR4WydraWVraXNfZ2F1dGFzJ107fSwkZGIpKSwKICAgICAgJ3Bsbic9PnJvdW5kKGFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsna2lla2lzX2dhdXRhcyddKiR4WydzYXZpa2FpbmFfb3JpZyddO30sJGRiKSksMikpOwogICAgJG9bJ0tSWVpNSU5FJ109KCRvWydkYiddWydwYXJ0aWp1J109PT0zOSYmJG9bJ2RiJ11bJ3EnXT09PTI3MDAmJmFicygkb1snZGInXVsncGxuJ10tMTIzMjUuNzQpPDAuMDEpPydPSyc6J0ZBSUwnOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-214930';
const GKEY='ps_l8';
const PHASES=["GO"];
const OUT='analize/s1638_h.json';
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
