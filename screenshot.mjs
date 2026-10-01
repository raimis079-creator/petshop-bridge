process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ1dCB0ZXN0aW5pcyBwYXZlZGltbyB1enNha3ltYXMgUmFpbWlvIHByYXN5bXU6IDEgbnVzdGF0eW1haSAvIDIgc3VrdXJ0aStmaWtzdW90aSBsYWlza3VzIC8gMyByZXp1bHRhdGFpIC8gNCBhdHNhdWt0aSB0eWxpYWkgKyBsaWt1dGlzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0NXQnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzQ1dCddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDV0JywnZmF6ZSc9PiRmXTsKICAkRU09J3RlcnJhQGd5dnVuYWkubHQnOyAkUElEPTE2MjczOyAkT1BUPSdwc19zMTc0NXRfbGFpc2thaSc7CiAgaWYoJGY9PT0nMScpewogICAgJGI9Z2V0X29wdGlvbignd29vY29tbWVyY2VfYmFjc19zZXR0aW5ncycpOyAkclsnYmFjcyddPWlzX2FycmF5KCRiKT9bJ2VuYWJsZWQnPT4kYlsnZW5hYmxlZCddPz8nJywndGl0bGUnPT4kYlsndGl0bGUnXT8/JycsJ2luc3RydWN0aW9ucyc9Pm1iX3N1YnN0cigkYlsnaW5zdHJ1Y3Rpb25zJ10/PycnLDAsMzAwKSwnZGVzY3JpcHRpb24nPT5tYl9zdWJzdHIoJGJbJ2Rlc2NyaXB0aW9uJ10/PycnLDAsMjAwKV06bnVsbDsKICAgICRhY2M9Z2V0X29wdGlvbignd29vY29tbWVyY2VfYmFjc19hY2NvdW50cycpOyAkclsnYmFjc19zYXNrYWl0b3MnXT1pc19hcnJheSgkYWNjKT9jb3VudCgkYWNjKTowOwogICAgJG9oPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2N1c3RvbWVyX29uX2hvbGRfb3JkZXJfc2V0dGluZ3MnKTsgJHJbJ29uX2hvbGRfbGFpc2thcyddPWlzX2FycmF5KCRvaCk/KCRvaFsnZW5hYmxlZCddPz8nPycpOiduZW51c3RhdHl0YSc7CiAgICAkcD13Y19nZXRfcHJvZHVjdCgkUElEKTsgJHJbJ3ByZWtlJ109JHA/WyRwLT5nZXRfbmFtZSgpLCRwLT5nZXRfcHJpY2UoKSwkcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJHAtPmdldF9zdG9ja19zdGF0dXMoKV06bnVsbDsKICAgICRyWydkZWZlciddPWFwcGx5X2ZpbHRlcnMoJ3dvb2NvbW1lcmNlX2RlZmVyX3RyYW5zYWN0aW9uYWxfZW1haWxzJyxmYWxzZSk7CiAgfQogIGlmKCRmPT09JzInKXsKICAgIHVwZGF0ZV9vcHRpb24oJE9QVCxbXSxmYWxzZSk7CiAgICBhZGRfZmlsdGVyKCd3cF9tYWlsJyxmdW5jdGlvbigkYSkgdXNlKCRPUFQpeyAkbD1nZXRfb3B0aW9uKCRPUFQsW10pOyAkYnQ9YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXsgcmV0dXJuIGlzc2V0KCR4WydmaWxlJ10pP2Jhc2VuYW1lKCR4WydmaWxlJ10pLic6Jy4oJHhbJ2xpbmUnXT8/JycpOicnOyB9LGRlYnVnX2JhY2t0cmFjZShERUJVR19CQUNLVFJBQ0VfSUdOT1JFX0FSR1MsMTQpKTsgJGxbXT1bJ3QnPT5jdXJyZW50X3RpbWUoJ0g6aTpzJyksJ3RvJz0+aXNfYXJyYXkoJGFbJ3RvJ10pP2ltcGxvZGUoJywnLCRhWyd0byddKTokYVsndG8nXSwnc3ViamVjdCc9PiRhWydzdWJqZWN0J10sJ2lzJz0+YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkYnQsZnVuY3Rpb24oJHgpe3JldHVybiAkeCAmJiAhcHJlZ19tYXRjaCgnL14oY2xhc3Mtd3AtaG9va3xwbHVnaW58cGx1Z2dhYmxlKVwucGhwLycsJHgpO30pKV07IHVwZGF0ZV9vcHRpb24oJE9QVCwkbCxmYWxzZSk7IHJldHVybiAkYTsgfSwxKTsKICAgIGFkZF9hY3Rpb24oJ3dwX21haWxfZmFpbGVkJyxmdW5jdGlvbigkZSkgdXNlKCRPUFQpeyAkbD1nZXRfb3B0aW9uKCRPUFQsW10pOyAkbFtdPVsnS0xBSURBJz0+JGUtPmdldF9lcnJvcl9tZXNzYWdlKCldOyB1cGRhdGVfb3B0aW9uKCRPUFQsJGwsZmFsc2UpOyB9KTsKICAgICRvPXdjX2NyZWF0ZV9vcmRlcihbJ2N1c3RvbWVyX2lkJz0+MCwnY3JlYXRlZF92aWEnPT4nY2hlY2tvdXQnXSk7CiAgICAkby0+YWRkX3Byb2R1Y3Qod2NfZ2V0X3Byb2R1Y3QoJFBJRCksMSk7CiAgICAkYWRyPVsnZmlyc3RfbmFtZSc9PidURVNUQVMnLCdsYXN0X25hbWUnPT4nUmFpbWlvIHByYcWheW11IFMxNzQ1JywnZW1haWwnPT4kRU0sJ3Bob25lJz0+JyszNzA2MDAwMDAwMCcsJ2FkZHJlc3NfMSc9PidMaXVjaW9uacWzIGcuIDQ2JywnY2l0eSc9PidWaWxuaXVzJywncG9zdGNvZGUnPT4nMDExMDAnLCdjb3VudHJ5Jz0+J0xUJ107CiAgICAkby0+c2V0X2FkZHJlc3MoJGFkciwnYmlsbGluZycpOyAkby0+c2V0X2FkZHJlc3MoJGFkciwnc2hpcHBpbmcnKTsKICAgICRvLT5zZXRfcGF5bWVudF9tZXRob2QoJ2JhY3MnKTsgJG8tPnNldF9wYXltZW50X21ldGhvZF90aXRsZSgnQmFua2luaXMgcGF2ZWRpbWFzJyk7CiAgICAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BldHNob3BfdGVzdCcsMSk7ICRvLT5jYWxjdWxhdGVfdG90YWxzKCk7ICRvLT5zYXZlKCk7CiAgICAkby0+YWRkX29yZGVyX25vdGUoJ1RFU1RBUyBTMTc0NSAoUmFpbWlvIHByYcWheW11IDEwLTAxKTogdGlrcmluYW1hLCBrb2tpZSBsYWnFoWthaSBpxaFlaW5hIHBhdmVkaW1vIHXFvnNha3ltdWkuIE5FQVBET1JPVEkg4oCUIGJ1cyBhdMWhYXVrdGFzIHR5bGlhaS4nKTsKICAgIC8vIGthaXAgV0NfR2F0ZXdheV9CQUNTOjpwcm9jZXNzX3BheW1lbnQKICAgICRvLT51cGRhdGVfc3RhdHVzKCdvbi1ob2xkJywnQXdhaXRpbmcgQkFDUyBwYXltZW50LicpOyB3Y19tYXliZV9yZWR1Y2Vfc3RvY2tfbGV2ZWxzKCRvLT5nZXRfaWQoKSk7CiAgICBvYl9zdGFydCgpOyBkb19hY3Rpb24oJ3dvb2NvbW1lcmNlX3RoYW5reW91X2JhY3MnLCRvLT5nZXRfaWQoKSk7ICRyWydwYWRla29zX2JhY3NfYmxva2FzJ109bWJfc3Vic3RyKHRyaW0od3Bfc3RyaXBfYWxsX3RhZ3Mob2JfZ2V0X2NsZWFuKCkpKSwwLDgwMCk7CiAgICAkclsndXpzJ109WyRvLT5nZXRfaWQoKSwkby0+Z2V0X29yZGVyX251bWJlcigpLCRvLT5nZXRfc3RhdHVzKCksJG8tPmdldF90b3RhbCgpXTsgdXBkYXRlX29wdGlvbigncHNfczE3NDV0X3V6cycsJG8tPmdldF9pZCgpLGZhbHNlKTsKICAgICRyWydsYWlza2FpX2lraV9zaW9sJ109Z2V0X29wdGlvbigkT1BULFtdKTsKICB9CiAgaWYoJGY9PT0nMycpewogICAgJGlkPShpbnQpZ2V0X29wdGlvbigncHNfczE3NDV0X3V6cycpOyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgJHJbJ3V6cyddPSRvP1skby0+Z2V0X29yZGVyX251bWJlcigpLCRvLT5nZXRfc3RhdHVzKCldOm51bGw7CiAgICAkclsnbGFpc2thaSddPWdldF9vcHRpb24oJE9QVCxbXSk7CiAgICAkclsncGFzdGFib3MnXT1bXTsgaWYoJG8pIGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kaWQsJ29yZGVyJz0+J0FTQyddKSBhcyAkeCl7ICRyWydwYXN0YWJvcyddW109JHgtPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnSDppOnMnKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCR4LT5jb250ZW50KSwwLDEyMCk7IH0KICAgIGlmKCRvKXsgZ2xvYmFsICR3cDsgJHdwLT5xdWVyeV92YXJzWydvcmRlci1yZWNlaXZlZCddPSRpZDsgb2Jfc3RhcnQoKTsgd2NfZ2V0X3RlbXBsYXRlKCdjaGVja291dC90aGFua3lvdS5waHAnLFsnb3JkZXInPT4kb10pOyAkaD1vYl9nZXRfY2xlYW4oKTsgJHR4dD10cmltKHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsd3Bfc3RyaXBfYWxsX3RhZ3MoJGgpKSk7ICRyWydwYWRla29zX3B1c2xhcGlzJ109bWJfc3Vic3RyKCR0eHQsMCwxNTAwKTsgJHJbJ3BhZGVrb3NfeXJhX2liYW4nXT0oYm9vbClwcmVnX21hdGNoKCcvTFRcZHsyfVxzP1xkezR9LycsJHR4dCk7IH0KICAgICRyWydqb2JzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMsc2tpcF9yZWFzb24gRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSByZWNpcGllbnRfZW1haWw9JXMgQU5EIGNyZWF0ZWRfYXQ+PSVzIiwkRU0sZ21kYXRlKCdZLW0tZCBIOmk6cycsdGltZSgpLTM2MDApKSxBUlJBWV9BKTsKICB9CiAgaWYoJGY9PT0nNCcpewogICAgJGlkPShpbnQpZ2V0X29wdGlvbigncHNfczE3NDV0X3V6cycpOyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvfHwhJG8tPmdldF9tZXRhKCdfcGV0c2hvcF90ZXN0JykpeyAkclsna2xhaWRhJ109J25lIHRlc3RpbmlzIC8gbmVyYXN0YXMnOyB9CiAgICBlbHNlIHsgJGJsb2s9ZnVuY3Rpb24oJHgpeyByZXR1cm4gdHJ1ZTsgfTsgYWRkX2ZpbHRlcigncHJlX3dwX21haWwnLCRibG9rLDEpOyAkby0+dXBkYXRlX3N0YXR1cygnY2FuY2VsbGVkJywnVEVTVEFTIFMxNzQ1IGF0xaFhdWt0YXMgdHlsaWFpIChsYWnFoWthaSBibG9rdW90aSkuJyk7IHJlbW92ZV9maWx0ZXIoJ3ByZV93cF9tYWlsJywkYmxvaywxKTsKICAgICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7ICRwPXdjX2dldF9wcm9kdWN0KCRQSUQpOyAkclsncG8nXT1bJG8tPmdldF9zdGF0dXMoKSwkcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCldOyB9CiAgfQogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-180112';
const GKEY='ps_s1745t';
const PHASES=["3"];
const OUT='out/s1745_t.json';
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
