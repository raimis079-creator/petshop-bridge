process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGFlIOKAlCBULTAg4oCecGFwaWxkeW1hcyBTMTY4MuKAnCBwYXJ0aWpvcyDiiYggWkIvVkYgZmVlZCAowrExMCAlKSDihpIgYXTFoWF1a3RpOyBBVjogamVpIG93biDiiaUgcGFydGlqYSDihpIgb3du4oiScGFydGlqYSwga2l0YWlwIChqYXUgdGFpc3l0YSByYW5rYSkgbmVsaWVzdGkuIEZhesSXIEQ9ZHJ5LCBBPWFwcGx5LiBCYWNrdXAgcHNfczE2NzZfcGFwaWxkX2Jhay4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NzZhZSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRGPSRfR0VUWydwc19zMTY3NmFlJ107ICRvPWFycmF5KCd2Jz0+J1MxNjc2IGFlJywnZmF6ZSc9PiRGKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcGEuaWQscGEucHJvZHVjdF9pZCBwaWQscGEua2lla2lzX2dhdXRhcyBrLHBhLmtpZWtpc19saWtvIGxpa28sKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cGEucHJvZHVjdF9pZCBBTkQgbWV0YV9rZXk9J196Yl9xdHknKSB6YiwoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wYS5wcm9kdWN0X2lkIEFORCBtZXRhX2tleT0nX3ZmX3F0eScpIHZmLChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBhLnByb2R1Y3RfaWQgQU5EIG1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScpIG93biwoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wYS5wcm9kdWN0X2lkIEFORCBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJykgc2FuZCBGUk9NIHskcH1wc19wYXJ0aWpvcyBwYSBXSEVSRSBwYS5hdHNhdWt0YT0wIEFORCBwYS5wYXN0YWJhIExJS0UgJyVwYXBpbGR5bWFzLCBTMTY4MiUnIE9SREVSIEJZIHBhLmtpZWtpc19nYXV0YXMgREVTQyIsQVJSQVlfQSk7CiAgJG9bJ3Zpc28nXT1jb3VudCgkcm93cyk7ICRwbGFuPWFycmF5KCk7ICRwYWxpa3RhPWFycmF5KCk7CiAgZm9yZWFjaCgkcm93cyBhcyAkcil7ICRrPShpbnQpJHJbJ2snXTsgJG09bnVsbDsgZm9yZWFjaChhcnJheSgnemInLCd2ZicpIGFzICRmKXsgJHE9JHJbJGZdOyBpZigkcT09PW51bGx8fCRxPT09JycpIGNvbnRpbnVlOyAkcT0oaW50KSRxOyBpZigkcT4wICYmIGFicygkay0kcSk8PW1heCgxLHJvdW5kKCRxKjAuMTApKSkgeyAkbT0kZi4nPScuJHE7IGJyZWFrOyB9IH0KICAgIGlmKCEkbSl7ICRwYWxpa3RhW109JHJbJ3BpZCddLicgaycuJGsuJyB6YicuJHJbJ3piJ10uJyB2ZicuJHJbJ3ZmJ107IGNvbnRpbnVlOyB9CiAgICAkb3duPSgkclsnb3duJ109PT0nJ3x8JHJbJ293biddPT09bnVsbCk/bnVsbDooaW50KSRyWydvd24nXTsgJG5hdWphcz1udWxsOyAkdmVpa3NtYXM9J3RpayBwYXJ0aWphJzsKICAgIGlmKCRvd24hPT1udWxsICYmICRvd24+PSRrKXsgJG5hdWphcz0kb3duLSRrOyAkdmVpa3NtYXM9J293biAnLiRvd24uJ+KGkicuJG5hdWphczsgfSBlbHNlaWYoJG93biE9PW51bGwpeyAkdmVpa3NtYXM9J293biAnLiRvd24uJyBuZWxpZcSNaWFtYXMgKGphdSB0YWlzeXRhKSc7IH0KICAgICRwbGFuW109YXJyYXkoJ2lkJz0+KGludCkkclsnaWQnXSwncGlkJz0+KGludCkkclsncGlkJ10sJ3Bhdic9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRyWydwaWQnXSksMCw1MCksJ2snPT4kaywnZmVlZCc9PiRtLCdvd24nPT4kb3duLCduYXVqYXMnPT4kbmF1amFzLCd2ZWlrc21hcyc9PiR2ZWlrc21hcyk7IH0KICAkb1sna2VpY2lhbWEnXT1jb3VudCgkcGxhbik7ICRvWydwYWxpZWthbWEnXT1jb3VudCgkcGFsaWt0YSk7ICRvWydwYWxpZWthbWFfcHZ6J109YXJyYXlfc2xpY2UoJHBhbGlrdGEsMCwxNSk7ICRvWydwbGFuYXMnXT0kcGxhbjsKICBpZigkRj09PSdBJyl7IHVwZGF0ZV9vcHRpb24oJ3BzX3MxNjc2X3BhcGlsZF9iYWsnLGFycmF5KCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyksJ3BsYW5hcyc9PiRwbGFuKSxmYWxzZSk7ICRuPTA7CiAgICBmb3JlYWNoKCRwbGFuIGFzICR4KXsgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyRwfXBzX3BhcnRpam9zIFNFVCBhdHNhdWt0YT0xLGtpZWtpc19saWtvPTAscGFzdGFiYT1DT05DQVQocGFzdGFiYSwnIOKAlCBBVMWgQVVLVEEgUzE2NzY6IHN1dGFtcGEgc3UgdGlla8SXam8gZmVlZCAoJywlcywnKSwgbmUgQVYnKSBXSEVSRSBpZD0lZCIsJHhbJ2ZlZWQnXSwkeFsnaWQnXSkpOyBpZigkeFsnbmF1amFzJ10hPT1udWxsKXsgdXBkYXRlX3Bvc3RfbWV0YSgkeFsncGlkJ10sJ19vd25fc3RvY2tfcXR5JywkeFsnbmF1amFzJ10pOyBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfSXZ5a2lhaScpKSBQZXRzaG9wX0l2eWtpYWk6OmlyYXN5dGkoJHhbJ3BpZCddLCdsaWt1dGlzJyxhcnJheSgnbGF1a2FzJz0+J19vd25fc3RvY2tfcXR5Jywnc2VuYSc9PihzdHJpbmcpJHhbJ293biddLCduYXVqYSc9PihzdHJpbmcpJHhbJ25hdWphcyddLCdvcF9ucic9PidTMTY3NicsJ3Bhc3RhYmEnPT4nVC0wIHBhcGlsZHltbyBwYXJ0aWphICcuJHhbJ2lkJ10uJyAoJy4keFsnayddLicgPSAnLiR4WydmZWVkJ10uJykgYXTFoWF1a3RhIOKAlCBmZWVkIGtvcGlqYScpKTsgfSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCR4WydwaWQnXSk7ICRuKys7IH0KICAgICRvWydpdnlrZHl0YSddPSRuOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-095146';
const GKEY='ps_s1676ae';
const PHASES=["D"];
const OUT='analize/s1676_ae.json';
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
