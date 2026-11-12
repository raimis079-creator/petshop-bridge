process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUwcjMgIzE2NTIgaXNpbXRpIG5hcnZhICgxIGRyeSwgMiB2eWtkeXRpIHBlciBkYXJiYWxhdWtpbyBraWVraXNfdnlrZHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODUwcjMnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE0MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJGY9JF9HRVRbJ3BzX3MxODUwcjMnXTsgJHI9Wyd2Jz0+J1MxODUwcjMnLCdmJz0+JGZdOwogICRpZD0zODI1MTsgJGlpZD00OTIzOyAkQz1udWxsOyBmb3JlYWNoKGdldF9kZWNsYXJlZF9jbGFzc2VzKCkgYXMgJGMpeyBpZihtZXRob2RfZXhpc3RzKCRjLCdraWVraXNfdnlrZHl0aScpKXsgJEM9JGM7IGJyZWFrOyB9IH0gJHJbJ2tsYXNlJ109JEM7CiAgJHJbJ2FkbWlucyddPWFycmF5X21hcChmbigkdSk9PlskdS0+SUQsJHUtPnVzZXJfbG9naW4sJHUtPmRpc3BsYXlfbmFtZV0sZ2V0X3VzZXJzKFsncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnZmllbGRzJz0+J2FsbCddKSk7CiAgJG89d2NfZ2V0X29yZGVyKCRpZCk7CiAgaWYoJEMpeyAkcmY9bmV3IFJlZmxlY3Rpb25DbGFzcygkQyk7ICRmYT0kcmYtPmdldE1ldGhvZCgnZmFrdGFpJyk7ICRmYS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJHp1PSRyZi0+Z2V0TWV0aG9kKCd6dXJuYWxhcycpOyAkenUtPnNldEFjY2Vzc2libGUodHJ1ZSk7ICRrZz0kcmYtPmdldE1ldGhvZCgna2lla2lvX2dhbCcpOyAka2ctPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgICAkZms9JGZhLT5pbnZva2UobnVsbCwkbywkenUtPmludm9rZShudWxsLFskaWRdKSk7ICRlPSRma1snZWlsJ11bJGlpZF0/P251bGw7CiAgICAkclsnZWlsJ109JGU/YXJyYXlfaW50ZXJzZWN0X2tleSgkZSxhcnJheV9mbGlwKFsncScsJ2xvY2snLCdhdHNhdWt0YScsJ2lzc2l1c3RhX2wnLCdzcmMnLCdiJ10pKTpudWxsOyAkclsncGFpZCddPSRma1sncGFpZCddPz9udWxsOyAkclsndXpkYXJ5dGFzJ109JGZrWyd1emRhcnl0YXMnXT8/bnVsbDsgJHJbJ2dhbCddPSRlPyRrZy0+aW52b2tlKG51bGwsJGZrLCRlKTpudWxsOyB9CiAgJHJbJ3JlbWFpbmluZyddPSRvLT5nZXRfcmVtYWluaW5nX3JlZnVuZF9hbW91bnQoKTsgJHJbJ2dyYXppbnRpJ109JG8tPmdldF9tZXRhKCdfcHNfZ3JhemludGlfcmFua29taXMnKTsKICBpZigkZj09PScyJyAmJiAkQyAmJiAhZW1wdHkoJHJbJ2dhbCddKSAmJiAhJG8tPmdldF9tZXRhKCdfcHNfZ3JhemludGlfcmFua29taXMnKSl7CiAgICAkdWlkPShpbnQpKCRfR0VUWyd1J10/PzApOyB3cF9zZXRfY3VycmVudF91c2VyKCR1aWQpOwogICAgJF9QT1NUPVsnaWQnPT4kaWQsJ2lpZCc9PiRpaWQsJ2thJz0+J2lzaW10aScsJ24nPT4wLCdnJz0+YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kYXJiYWxhdWtpcycpLCdfd3Bub25jZSc9PndwX2NyZWF0ZV9ub25jZSgncHNfZGxfa2lla2lzXycuJGlkKV07ICRfUkVRVUVTVD0kX1BPU1Q7CiAgICBhZGRfZmlsdGVyKCd3cF9yZWRpcmVjdCcsZnVuY3Rpb24oJGxvYykgdXNlKCYkciwkaWQpeyAkbzI9d2NfZ2V0X29yZGVyKCRpZCk7ICRyWydyZWRpcmVjdCddPXVybGRlY29kZSgkbG9jKTsgJHJbJ3BvJ109Wyd0b3RhbCc9PiRvMi0+Z2V0X3RvdGFsKCksJ3RheCc9PiRvMi0+Z2V0X3RvdGFsX3RheCgpLCdyZWZ1bmRlZCc9PiRvMi0+Z2V0X3RvdGFsX3JlZnVuZGVkKCksJ2l0ZW1zJz0+YXJyYXlfbWFwKGZuKCR4KT0+WyR4LT5nZXRfbmFtZSgpLCR4LT5nZXRfcXVhbnRpdHkoKSwkeC0+Z2V0X3RvdGFsKCldLGFycmF5X3ZhbHVlcygkbzItPmdldF9pdGVtcygpKSksJ2dyYXppbnRpJz0+JG8yLT5nZXRfbWV0YSgnX3BzX2dyYXppbnRpX3JhbmtvbWlzJyksJ3N0YXR1cyc9PiRvMi0+Z2V0X3N0YXR1cygpXTsKICAgICAgJG8yLT5hZGRfb3JkZXJfbm90ZSgnUGFzdGFiYTogdmVpa3NtxIUg4oCeScWhaW10aeKAnCAoVHJpeGllIG5hcnZhcykgYXRsaWtvIENsYXVkZSBwZXIgdGlsdMSFIChTMTg1MCkgUmFpbWlvIHByYcWheW11IDExLTEyIOKAlCBrbGllbnTElyBhdHNpc2FrxJcgbmFydm8sIFpCIGpvIG5lacWhc2l1bnTElywgc3VkZXJpbnRhIHN1IGtsaWVudGUuJyxmYWxzZSx0cnVlKTsKICAgICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0sMSk7CiAgICBjYWxsX3VzZXJfZnVuYyhbJEMsJ2tpZWtpc192eWtkeXRpJ10pOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-084833';
const GKEY='ps_s1850r3';
const PHASES=["1"];
const OUT='analize/s1850r3.json';
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
