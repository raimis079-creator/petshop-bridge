process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDggcnVuIGUzcSDigJQgdjMuOSBwYXRpa3JhOiBuZWFwbW9rxJd0YXMgbmUgS2xhdXNpbXVvc2U7IGtlbGlhaSBiZSB0aWVrxJdqbzsgdmFyaWtsaW8gcHJhbmXFoWltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTNxJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4ncnVuIGUzcScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7IHdwX3NldF9jdXJyZW50X3VzZXIoJHUtPklEKTsgJG9bJ3ZlcnNpamEnXT1QZXRzaG9wX0RhcmJhbGF1a2lzOjpWRVJTSUpBOwogIHRyeXsKICAgICRmaz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ2Zha3RhaScpOyAkZmstPnNldEFjY2Vzc2libGUodHJ1ZSk7ICRzaz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ3NreWRlbGlzJyk7ICRzay0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgIC8vIG5lYXBtb2vEl3RhczogcGVuZGluZyBzdSBBViBwcmVrZQogICAgJG9yZD13Y19jcmVhdGVfb3JkZXIoYXJyYXkoJ2N1c3RvbWVyX2lkJz0+MCkpOyAkb3JkLT5zZXRfYWRkcmVzcyhhcnJheSgnZmlyc3RfbmFtZSc9PidBVURJVEFTJywnbGFzdF9uYW1lJz0+J1Rlc3RhcyAzNCcsJ2VtYWlsJz0+J3RlcnJhQHBldHNob3AubHQnLCdjb3VudHJ5Jz0+J0xUJyksJ2JpbGxpbmcnKTsgJG9yZC0+YWRkX3Byb2R1Y3Qod2NfZ2V0X3Byb2R1Y3QoMTk3MDgpLDEpOyAkb3JkLT5zZXRfcGF5bWVudF9tZXRob2QoJ2JhY3MnKTsgJG9yZC0+Y2FsY3VsYXRlX3RvdGFscygpOyAkb3JkLT51cGRhdGVfc3RhdHVzKCdwZW5kaW5nJyk7ICRvcmQtPnNhdmUoKTsgJG9pZD0kb3JkLT5nZXRfaWQoKTsKICAgICRmPSRmay0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKCRvaWQpLGFycmF5KCkpOyAkb1snbmVhcG1va2V0YXMnXT1hcnJheSgnaWQnPT4kb2lkLCdrbCc9PiRmWydrbCddLCdlaWxlcyc9PiRmWydlaWxlcyddLCduYXVqYXMnPT4kZlsnbmF1amFzJ10pOwogICAgJG9yZC0+dXBkYXRlX3N0YXR1cygnZmFpbGVkJyk7ICRmPSRmay0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKCRvaWQpLGFycmF5KCkpOyAkb1snZmFpbGVkJ109YXJyYXkoJ2tsJz0+JGZbJ2tsJ10sJ2VpbGVzJz0+JGZbJ2VpbGVzJ10pOwogICAgd2NfZ2V0X29yZGVyKCRvaWQpLT5kZWxldGUodHJ1ZSk7CiAgICAvLyBrZWxpYWkgYmUgdGlla8SXam8g4oCUIGdyeW5haSBBViBwcmVrxJcgMTk3MDggKCMzNTQ0NCBhcmJhICMzNTQ1MCkKICAgICRmPSRmay0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKDM1NDUwKSxhcnJheSgpKTsgJHM9JHNrLT5pbnZva2UobnVsbCwkZik7IGZvcmVhY2goJHNbJ2VpbCddIGFzICRlKXsgJG9bJ2tlbGlhaSddW109JGVbJ24nXS4nIOKGkiAnLmltcGxvZGUoJyB8ICcsYXJyYXlfbWFwKGZ1bmN0aW9uKCRrKXtyZXR1cm4gJGtbJ3QnXS4oJGtbJ29uJ10/JyonOicnKTt9LCRlWydrZWxpYWknXSkpOyB9CiAgICAvLyB2YXJpa2xpbyBwcmFuZcWhaW1vIHZlcnRpbWFzCiAgICAkX0dFVFsncGRfb2snXT0na29uc19vayc7ICRfR0VUWydwZF9uciddPSczNTQ1MHwyJzsgJHByPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywncHJhbmVzaW1hcycpOyAkcHItPnNldEFjY2Vzc2libGUodHJ1ZSk7IG9iX3N0YXJ0KCk7ICRwci0+aW52b2tlKG51bGwpOyAkb1sncHJhbl9rb25zJ109d3Bfc3RyaXBfYWxsX3RhZ3Mob2JfZ2V0X2NsZWFuKCkpOwogICAgJF9HRVRbJ3BkX29rJ109J3ZwX29rJzsgJF9HRVRbJ3BkX25yJ109JzEgwrcgQVYnOyBvYl9zdGFydCgpOyAkcHItPmludm9rZShudWxsKTsgJG9bJ3ByYW5fdnAnXT13cF9zdHJpcF9hbGxfdGFncyhvYl9nZXRfY2xlYW4oKSk7CiAgICAkX0dFVFsncGRfb2snXT0ncGFrdW90ZXMnOyAkX0dFVFsncGRfbnInXT0nMyc7IG9iX3N0YXJ0KCk7ICRwci0+aW52b2tlKG51bGwpOyAkb1sncHJhbl9wYWsnXT13cF9zdHJpcF9hbGxfdGFncyhvYl9nZXRfY2xlYW4oKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-172242';
const GKEY='ps_e3q';
const PHASES=["Q"];
const OUT='analize/e3_run20q.json';
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
