process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwZCBBbWJyb3NpYSBFQU4gacWhIEFsZmF6b28ga2FpbnlubyDigJQgUiAocGVyxb5pxatyYSkgLyBXICjEr3JhxaF5bWFzIHN1IGJhaykgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTgwMGQnXSk/JF9HRVRbJ3BzX3MxODAwZCddOicnKTsgaWYoIWluX2FycmF5KCRmLGFycmF5KCdSJywnVycpLHRydWUpKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTgwMGQnLCdmYXplJz0+JGYpOwogICRNQVA9YXJyYXkoCiAgICAnQU1QQ0YwMic9Pic1MjE0MDAwNTgzODIwJywnQU1QQ1MwMic9Pic1MjE0MDAwNTgzNjYwJywnQU1QQ1MxMic9Pic1MjE0MDAwNTgzNzkwJywKICAgICdBTUxTMDInPT4nNTIxNDAwMDU4Mzg4MicsJ0FNTFMxMic9Pic1MjE0MDAwNTgzOTA1JywnQU1MRTAyJz0+JzUyMTQwMDA1ODM5NDMnLCdBTUxFMTInPT4nNTIxNDAwMDU4Mzk2NycsCiAgICAnQU1URDAyJz0+JzUyMTQwMDA1ODM2ODQnLCdBTVREMTInPT4nNTIxNDAwMDU4MzgwNicsJ0FNVFIwMic9Pic1MjE0MDAxODMyMzU0JywnQU1UUjEyJz0+JzUyMTQwMDE4MzIzNzgnLAogICAgJ0FNQlMwMic9Pic1MjE0MDAxODMyMjg2JywnQU1CUzEyJz0+JzUyMTQwMDE4MzIzMDknLCdBTVRTMDInPT4nNTIxNDAwMDU4Mzk3NCcsJ0FNVFMxMic9Pic1MjE0MDAwNTgzOTk4JywKICAgICdVL0FIVDUnPT4nNTIxNDAwMTgzMjg3MycpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRyb3dzPWFycmF5KCk7CiAgICBmb3JlYWNoKCRNQVAgYXMgJHNrdT0+JGVhbil7CiAgICAgICRpZD13Y19nZXRfcHJvZHVjdF9pZF9ieV9za3UoJHNrdSk7CiAgICAgICRyb3dzWyRza3VdPWFycmF5KCdpZCc9PiRpZCwnZWFuX25hdWphcyc9PiRlYW4sJ2dpZF9kYWJhcic9PiRpZD9nZXRfcG9zdF9tZXRhKCRpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpOm51bGwsJ19lYW5fZGFiYXInPT4kaWQ/Z2V0X3Bvc3RfbWV0YSgkaWQsJ19lYW4nLHRydWUpOm51bGwsCiAgICAgICAgJ2thc190dXJpX2Vhbic9PiR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2dsb2JhbF91bmlxdWVfaWQnIEFORCBtZXRhX3ZhbHVlPSVzIiwkZWFuKSkpOwogICAgfQogICAgJG9bJ3Jvd3MnXT0kcm93czsKICAgIGlmKCRmPT09J1cnKXsKICAgICAgaWYoZ2V0X29wdGlvbigncHNfczE4MDBfZWFuX2JhaycpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdiYWsgamF1IHlyYSDigJQgVyBqYXUgdnlrZHl0YScpOwogICAgICAkYmFrPWFycmF5KCk7IGZvcmVhY2goJHJvd3MgYXMgJHNrdT0+JHIpeyBpZigkclsnaWQnXSkgJGJha1skclsnaWQnXV09YXJyYXkoJ2dpZCc9PiRyWydnaWRfZGFiYXInXSwnX2Vhbic9PiRyWydfZWFuX2RhYmFyJ10pOyB9CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3MxODAwX2Vhbl9iYWsnLCRiYWssZmFsc2UpOwogICAgICAvLyBwaXJtaWF1c2lhIGnFoXZhbHl0aSBkdWJsaXVvdHVzL2tsYWlkaW5ndXMsIHRhZGEgcmHFoXl0aQogICAgICBmb3JlYWNoKCRyb3dzIGFzICRza3U9PiRyKXsgaWYoJHJbJ2lkJ10pIGRlbGV0ZV9wb3N0X21ldGEoJHJbJ2lkJ10sJ19nbG9iYWxfdW5pcXVlX2lkJyk7IH0KICAgICAgJHJlcz1hcnJheSgpOwogICAgICBmb3JlYWNoKCRyb3dzIGFzICRza3U9PiRyKXsgaWYoISRyWydpZCddKXsgJHJlc1skc2t1XT0nTkVSQVNUQSc7IGNvbnRpbnVlOyB9CiAgICAgICAgJHByPXdjX2dldF9wcm9kdWN0KCRyWydpZCddKTsgJG9rPScnOwogICAgICAgIHRyeXsgJHByLT5zZXRfZ2xvYmFsX3VuaXF1ZV9pZCgkclsnZWFuX25hdWphcyddKTsgJHByLT5zYXZlKCk7ICRvaz0nc2F2ZSc7IH1jYXRjaChUaHJvd2FibGUgJGUpeyB1cGRhdGVfcG9zdF9tZXRhKCRyWydpZCddLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJHJbJ2Vhbl9uYXVqYXMnXSk7ICRvaz0nbWV0YTonLiRlLT5nZXRNZXNzYWdlKCk7IH0KICAgICAgICBpZigkclsnX2Vhbl9kYWJhciddIT09JycgJiYgJHJbJ19lYW5fZGFiYXInXSE9PW51bGwgJiYgJHJbJ19lYW5fZGFiYXInXSE9PSRyWydlYW5fbmF1amFzJ10pIHVwZGF0ZV9wb3N0X21ldGEoJHJbJ2lkJ10sJ19lYW4nLCRyWydlYW5fbmF1amFzJ10pOwogICAgICAgICRyZXNbJHNrdV09YXJyYXkoJ2lkJz0+JHJbJ2lkJ10sJ29rJz0+JG9rLCdwbyc9PmdldF9wb3N0X21ldGEoJHJbJ2lkJ10sJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKSwnbG9va3VwJz0+JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBnbG9iYWxfdW5pcXVlX2lkIEZST00geyRwfXdjX3Byb2R1Y3RfbWV0YV9sb29rdXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHJbJ2lkJ10pKSk7CiAgICAgIH0KICAgICAgJG9bJ3JlcyddPSRyZXM7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-114516';
const GKEY='ps_s1800d';
const PHASES=["R"];
const OUT='analize/s1800_d_r2.json';
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
