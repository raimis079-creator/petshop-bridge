process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3ZyByZWNvbiByZWFkLW9ubHk6IHV6c2FreW1hcyAzNjI5NiAoIzExNzcpIOKAlCBidWtsZSwgZWlsdXRlcywgc2l1bnRvcywgcGFzdGFib3MsIGRhcmJhbGF1a2lvIGVpbGVzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxN2cnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MTdnJ107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTcxN2cnLCdmYXplJz0+JGZdOyAkSUQ9MzYyOTY7CiAgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7ICR0PWZ1bmN0aW9uKCRkKSB1c2UoJHR6KXsgcmV0dXJuICRkPyRkLT5zZXRUaW1lem9uZSgkdHopLT5mb3JtYXQoJ20tZCBIOmk6cycpOm51bGw7IH07CiAgJGN1dD1mdW5jdGlvbigkdiwkbj0yMjApeyBpZihpc19hcnJheSgkdil8fGlzX29iamVjdCgkdikpICR2PWpzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyAkdj0oc3RyaW5nKSR2OyByZXR1cm4gbWJfc3RybGVuKCR2KT4kbj9tYl9zdWJzdHIoJHYsMCwkbikuJ+KApic6JHY7IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRvPXdjX2dldF9vcmRlcigkSUQpOyBpZighJG8peyAkclsnbmVyYSddPXRydWU7IHdwX3NlbmRfanNvbigkcik7IH0KICAgICRyWyd1enMnXT1bJ25yJz0+JG8tPmdldF9vcmRlcl9udW1iZXIoKSwnc3RhdHVzJz0+JG8tPmdldF9zdGF0dXMoKSwnc3VrdXJ0YSc9PiR0KCRvLT5nZXRfZGF0ZV9jcmVhdGVkKCkpLCdtb2RpZic9PiR0KCRvLT5nZXRfZGF0ZV9tb2RpZmllZCgpKSwnYXBtb2tldGEnPT4kdCgkby0+Z2V0X2RhdGVfcGFpZCgpKSwnY29tcGxldGVkJz0+JHQoJG8tPmdldF9kYXRlX2NvbXBsZXRlZCgpKSwnbW9rJz0+JG8tPmdldF9wYXltZW50X21ldGhvZCgpLCdzdW1hJz0+JG8tPmdldF90b3RhbCgpLCdzaXVudGltYXMnPT4kby0+Z2V0X3NoaXBwaW5nX21ldGhvZCgpLCdtaWVzdGFzJz0+JG8tPmdldF9zaGlwcGluZ19jaXR5KCksJ3N1a3VyZSc9PiRvLT5nZXRfY3JlYXRlZF92aWEoKSwnY3VzdG9tZXJfaWQnPT4kby0+Z2V0X2N1c3RvbWVyX2lkKCldOwogICAgJHJbJ2hwb3MnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLHN0YXR1cyxkYXRlX2NyZWF0ZWRfZ210LGRhdGVfdXBkYXRlZF9nbXQsZGF0ZV9wYWlkX2dtdCBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgaWQ9JElEIixBUlJBWV9BKTsKICAgICRyWydwb3N0J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBJRCxwb3N0X3N0YXR1cyxwb3N0X21vZGlmaWVkIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgSUQ9JElEIixBUlJBWV9BKTsKICAgICRtZXRhPVtdOyBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyAkaz0kbS0+a2V5OyBpZihwcmVnX21hdGNoKCcjXl8ocHNffHZlbmlwYWt8d29vX2xpdGh1YW5pYXBvc3R8cmVkdWNlZHx3Y19vcmRlcl9hdHRyaWJ1dGlvbl9zb3VyY2V8bmV3X29yZGVyX2VtYWlsKSMnLCRrKSkgJG1ldGFbJGtdPSRjdXQoJG0tPnZhbHVlLDMwMCk7IH0KICAgIGtzb3J0KCRtZXRhKTsgJHJbJ21ldGEnXT0kbWV0YTsKICAgICRyWydlaWx1dGVzJ109W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7ICRpbT1bXTsgZm9yZWFjaCgkaXQtPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7IGlmKHByZWdfbWF0Y2goJyNeXyhwc198cmVkdWNlZHxtbm0pIycsJG0tPmtleSkpICRpbVskbS0+a2V5XT0kY3V0KCRtLT52YWx1ZSwxMjApOyB9ICRyWydlaWx1dGVzJ11bXT1bJ2lpZCc9PiRpaWQsJ3BpZCc9PiRpdC0+Z2V0X3Byb2R1Y3RfaWQoKSwndmlkJz0+JGl0LT5nZXRfdmFyaWF0aW9uX2lkKCksJ3Bhdic9Pm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCw2MCksJ2tpZWtpcyc9PiRpdC0+Z2V0X3F1YW50aXR5KCksJ21ldGEnPT4kaW1dOyB9CiAgICAkbm90ZXM9d2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kSUQsJ2xpbWl0Jz0+MzAsJ29yZGVyYnknPT4nZGF0ZV9jcmVhdGVkJywnb3JkZXInPT4nREVTQyddKTsKICAgICRyWydwYXN0YWJvcyddPWFycmF5X21hcChmdW5jdGlvbigkbikgdXNlKCR0LCRjdXQpeyByZXR1cm4gWyR0KCRuLT5kYXRlX2NyZWF0ZWQpLCRuLT5hZGRlZF9ieSwkbi0+Y3VzdG9tZXJfbm90ZT8nSyc6J1YnLCRjdXQod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDI2MCldOyB9LCRub3Rlcyk7CiAgICAkclsnZmFrdF91enMnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHV6c2FreW1hc19pZCwgc3RhdHVzYXNfZ2FsdXRpbmlzLCBzdWt1cnRhX2F0LCBhcG1va2V0YV9hdCwga2FuYWxhc19wYXNrdXRpbmlzLCB1dG1fc291cmNlLCBrbGllbnRhc19uYXVqYXMgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdXpzYWt5bWFzX2lkPSRJRCIsQVJSQVlfQSk7CiAgICAkclsnZmFrdF9zaXVudG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIHNhbmRlbGlzLCB2ZXplamFzLCBzaXVudG9zX25yLCBwcmlzdGF0eW1vX3RpcGFzLCBzdWt1cnRhX2F0LCByZWdpc3RydW90YV9hdCwgaXN2ZXp0YV9hdCwga2FpbmFfdmV6ZWpvX2N0LCBzdGF0dXNhcywgc2FsdGluaXMgRlJPTSB7JFB9cHNfZmFrdF9zaXVudG9zIFdIRVJFIHV6c2FreW1hc19pZD0kSUQiLEFSUkFZX0EpOwogICAgZm9yZWFjaChbJ3BzX3RpZWtpbWFzJywncHNfZGVza191enNha3ltYWknLCdwc19kZXNrX2VpbGUnLCdwc19zaXVudG9zJ10gYXMgJHRiKXsgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH0kdGInIikpeyAkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfSR0YiIpOyAkb2M9bnVsbDsgZm9yZWFjaChbJ29yZGVyX2lkJywndXpzYWt5bWFzX2lkJywndXpzYWt5bWFzJ10gYXMgJGMpeyBpZihpbl9hcnJheSgkYywkY29scykpeyAkb2M9JGM7IGJyZWFrOyB9IH0gaWYoJG9jKXsgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH0kdGIgV0hFUkUgJG9jPSRJRCBMSU1JVCAxMCIsQVJSQVlfQSk7ICRyWydsZW50J11bJHRiXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpIHVzZSgkY3V0KXsgZm9yZWFjaCgkeCBhcyAkaz0+JHYpICR4WyRrXT0kY3V0KCR2LDEyMCk7IHJldHVybiAkeDsgfSwkcm93cyk7IH0gZWxzZSAkclsnbGVudCddWyR0Yl09Wydjb2xzJz0+JGNvbHNdOyB9IH0KICAgIC8vIGRhcmJhbGF1a2lvIGtvZGFzOiBlaWxlcyBpciBzYXJhc3UgZnVua2Npam9zCiAgICAkZGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnOyAkcz1maWxlX2dldF9jb250ZW50cygkZGYpOyAkclsnZGxfbWQ1J109bWQ1KCRzKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIjJ2VpbGUnXHMqPT5ccyonKFthLXpfXSspJ3xlaWxlPShbYS16X10rKXxjYXNlXHMrJyhbYS16X10rKScjIiwkcywkbW0pOyAkclsnZGxfZWlsZXMnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X2ZpbHRlcihhcnJheV9tZXJnZSgkbW1bMV0sJG1tWzJdLCRtbVszXSkpKSk7CiAgICBwcmVnX21hdGNoX2FsbCgnIyhwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpP1xzKnN0YXRpY1xzK2Z1bmN0aW9uXHMrKFthLXpfMC05XSspXHMqXCgoW14pXSopXCkjaScsJHMsJGZtKTsgJHJbJ2RsX2ZuJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGEuJygnLm1iX3N1YnN0cigkYiwwLDUwKS4nKSc7fSwkZm1bMl0sJGZtWzNdKTsKICAgIC8vIGt1ciB1enNha3ltYWkgZmlsdHJ1b2phbWkgcGFnYWwgc3RhdHVzYSAvIHBhc2xlcGlhbWkKICAgIHByZWdfbWF0Y2hfYWxsKCIjW15cbl17MCwyMDB9KHdjX2dldF9vcmRlcnN8J3N0YXR1cydccyo9PnxwYXNsZXB8c2xlcHR8bmVyb2R8aGlkZGVufExBVUtUSSlbXlxuXXswLDIwMH0jIiwkcywkc20pOyAkclsnZGxfZmlsdHJhaSddPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cih0cmltKCR4KSwwLDQwMCk7fSxhcnJheV91bmlxdWUoJHNtWzBdKSksMCwyNSk7CiAgICAkclsnbGFpa2FzJ109KG5ldyBEYXRlVGltZSgnbm93JywkdHopKS0+Zm9ybWF0KCdZLW0tZCBIOmk6cycpOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-070853';
const GKEY='ps_s1717g';
const PHASES=["1"];
const OUT='analize/s1717_g.json';
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
