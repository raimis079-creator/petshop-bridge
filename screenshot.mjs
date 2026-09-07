process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUga3VwIOKAlCBrdXBvbmFzIFBldHNob3AuMTA6IOKIkjEwJSBwcmVrxJdtcywgYmUgcHJpc3RhdHltbywgaW5kaXZpZHVhbF91c2UsIGJlIGxpbWl0xbM7IGnFoXNraXJ0b3MgbWFpc3RvIGthdC4gxaF1bmltcy9rYXTEl21zLiBQYXRpa3JhOiByZWFkLWJhY2sgKyBpc192YWxpZF9mb3JfcHJvZHVjdCAobWFpc3RhcyBORSwgxb5haXNsYXMgVEFJUCkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM1a3VwJ10pKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRvPWFycmF5KCd2Jz0+J1MxNjM1IGt1cCcpOyAkS0FUPWFycmF5KDcxLDcyLDczLDgzLDg1LDg2LDc4LDc5LDgwLDgxKTsKICAkaWQ9d2NfZ2V0X2NvdXBvbl9pZF9ieV9jb2RlKCdwZXRzaG9wLjEwJyk7CiAgaWYoISRpZCl7ICRjPW5ldyBXQ19Db3Vwb24oKTsgJGMtPnNldF9jb2RlKCdQZXRzaG9wLjEwJyk7IH0KICBlbHNlIHsgJGM9bmV3IFdDX0NvdXBvbigkaWQpOyAkb1snYnV2byddPTE7IH0KICAkYy0+c2V0X2Rpc2NvdW50X3R5cGUoJ3BlcmNlbnQnKTsgJGMtPnNldF9hbW91bnQoMTApOwogICRjLT5zZXRfaW5kaXZpZHVhbF91c2UodHJ1ZSk7ICRjLT5zZXRfZnJlZV9zaGlwcGluZyhmYWxzZSk7CiAgJGMtPnNldF9leGNsdWRlZF9wcm9kdWN0X2NhdGVnb3JpZXMoJEtBVCk7CiAgJGMtPnNldF91c2FnZV9saW1pdCgwKTsgJGMtPnNldF91c2FnZV9saW1pdF9wZXJfdXNlcigwKTsgJGMtPnNldF9kYXRlX2V4cGlyZXMobnVsbCk7CiAgJGMtPnNldF9kZXNjcmlwdGlvbignS2xpZW50byBudW9sYWlkYSAtMTAlIHByZWvEl21zLCBiZSBtYWlzdG8gxaF1bmltcy9rYXTEl21zIChTMTYzNSknKTsKICAkaWQ9JGMtPnNhdmUoKTsgJG9bJ2lkJ109JGlkOwogIHdwX2NhY2hlX2ZsdXNoKCk7CiAgJGMyPW5ldyBXQ19Db3Vwb24oJ3BldHNob3AuMTAnKTsKICAkb1snZGFiYXInXT1hcnJheSgna29kYXMnPT4kYzItPmdldF9jb2RlKCksJ3RpcGFzJz0+JGMyLT5nZXRfZGlzY291bnRfdHlwZSgpLCdzdW1hJz0+JGMyLT5nZXRfYW1vdW50KCksJ2luZGl2Jz0+JGMyLT5nZXRfaW5kaXZpZHVhbF91c2UoKT8xOjAsJ2ZyZWVfc2hpcCc9PiRjMi0+Z2V0X2ZyZWVfc2hpcHBpbmcoKT8xOjAsJ2V4Y2xfa2F0Jz0+JGMyLT5nZXRfZXhjbHVkZWRfcHJvZHVjdF9jYXRlZ29yaWVzKCksJ2xpbWl0Jz0+JGMyLT5nZXRfdXNhZ2VfbGltaXQoKSwnZ2FsaW9qYV9pa2knPT4kYzItPmdldF9kYXRlX2V4cGlyZXMoKT8neXJhJzonYmUgZGF0b3MnKTsKICBmb3JlYWNoKGFycmF5KDE5NzA4PT4na29uc2VydmFpIMWhdW5pbXMgKG1haXN0YXMg4oCUIHR1cmkgTkVnYWxpb3RpKScsMzUzNTc9PifFvmFpc2xhcyDFoXVuaW1zICh0dXJpIGdhbGlvdGkpJywxOTQ3NT0+J2tvbnNlcnZhaSDFoXVuaW1zIChtYWlzdGFzIOKAlCBORWdhbGlvdGkpJykgYXMgJHBpZD0+JGthcyl7CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCEkcHIpeyAkb1sndGVzdCddWyRwaWRdPSduxJdyYSc7IGNvbnRpbnVlOyB9CiAgICAkb1sndGVzdCddWyRwaWRdPWFycmF5KCdrYXMnPT4ka2FzLCdrYXQnPT53Y19nZXRfcHJvZHVjdF90ZXJtX2lkcygkcGlkLCdwcm9kdWN0X2NhdCcpLCdnYWxpb2phJz0+JGMyLT5pc192YWxpZF9mb3JfcHJvZHVjdCgkcHIpPydUQUlQJzonTkUnKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-070508';
const GKEY='ps_s1635kup';
const PHASES=["K"];
const OUT='analize/s1635_kup.json';
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
