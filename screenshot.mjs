process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3YSByZWxhdW5jaCBMMSBzdW8gMSBiYW5nb3MgcmV6dWx0YXRhcyBwbyA0IHNhdi4gKHJlYWQtb25seSwgYmUgYWRyZXPFsykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3YSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MDdhJ107CiAgJHRvaz1QZXRzaG9wX1NlbmRlcl9BZGFwdGVyOjpnZXRfc3RvcmVkX3Rva2VuKCdtYXJrZXRpbmcnKTsKICAkYXBpPWZ1bmN0aW9uKCRtLCRwKSB1c2UoJHRvayl7ICR4PXdwX3JlbW90ZV9yZXF1ZXN0KCdodHRwczovL2FwaS5zZW5kZXIubmV0L3YyJy4kcCxbJ21ldGhvZCc9PiRtLCd0aW1lb3V0Jz0+MjUsJ2hlYWRlcnMnPT5bJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nXV0pOyBpZihpc193cF9lcnJvcigkeCkpIHJldHVybiBbJ2NvZGUnPT4wXTsgcmV0dXJuIFsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSwnYm9keSc9Pmpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSx0cnVlKV07IH07CiAgZm9yZWFjaChbJ241Z2xWNSc9PidjYWxjJywnbzJqbTlZJz0+J3N0ZCddIGFzICRjaWQ9PiRrKXsgJGM9JGFwaSgnR0VUJywnL2NhbXBhaWducy8nLiRjaWQpOyAkZD0kY1snYm9keSddWydkYXRhJ10/P1tdOyAkclsna2FtcCddWyRrXT1bJ3NlbnRfY291bnQnPT4kZFsnc2VudF9jb3VudCddPz9udWxsLCdyZWNpcGllbnRfY291bnQnPT4kZFsncmVjaXBpZW50X2NvdW50J10/P251bGwsJ29wZW5zJz0+JGRbJ29wZW5zJ10/P251bGwsJ2NsaWNrcyc9PiRkWydjbGlja3MnXT8/bnVsbCwnYm91bmNlc19jb3VudCc9PiRkWydib3VuY2VzX2NvdW50J10/P251bGwsJ3JlcG9ydHMnPT4kZFsncmVwb3J0cyddPz9udWxsXTsgfQogIC8vIGdydXBpxbMgbmFyaWFpIOKGkiBixatzZW5vcwogICRzYj1bXTsgJHBnPTE7IGRveyAkeD0kYXBpKCdHRVQnLCcvc3Vic2NyaWJlcnM/bGltaXQ9MTAwJnBhZ2U9Jy4kcGcpOyBmb3JlYWNoKChhcnJheSkoJHhbJ2JvZHknXVsnZGF0YSddPz9bXSkgYXMgJHMpeyAkZ3I9W107IGZvcmVhY2goKGFycmF5KSgkc1snc3Vic2NyaWJlcl90YWdzJ10/P1tdKSBhcyAkdCl7ICRncltdPWlzX2FycmF5KCR0KT8oJHRbJ2lkJ10/PycnKTokdDsgfSBpZihhcnJheV9pbnRlcnNlY3QoJGdyLFsnYUtrbDVNJywnZExsbTVYJ10pKSAkc2Jbc3RydG9sb3dlcigkc1snZW1haWwnXT8/JycpXT0kc1snc3RhdHVzJ11bJ2VtYWlsJ10/Pyc/JzsgfSAkbGFzdD0keFsnYm9keSddWydtZXRhJ11bJ2xhc3RfcGFnZSddPz8xOyAkcGcrKzsgfSB3aGlsZSgkcGc8PSRsYXN0ICYmICRwZzw0MCk7CiAgJHJbJ2dhdmVqdSddPWNvdW50KCRzYik7ICRyWydidXNlbm9zJ109YXJyYXlfY291bnRfdmFsdWVzKCRzYik7CiAgLy8gdcW+c2FreW1haSBuYXVqb2plIHN2ZXRhaW7El2plIHBvIDA5LTMwIGnFoSBnYXbEl2rFswogICRlbXM9YXJyYXlfa2V5cygkc2IpOyAkcGg9aW1wbG9kZSgnLCcsYXJyYXlfZmlsbCgwLGNvdW50KCRlbXMpLCclcycpKTsKICAkcm93cz0kZW1zPyR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG8uaWQsIG8uZGF0ZV9jcmVhdGVkX2dtdCBkLCBvLnRvdGFsX2Ftb3VudCB0LCBvLnN0YXR1cyBzLCBMT1dFUihvLmJpbGxpbmdfZW1haWwpIGUgRlJPTSB7JFB9d2Nfb3JkZXJzIG8gV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMzAgMDk6MDA6MDAnIEFORCBMT1dFUihvLmJpbGxpbmdfZW1haWwpIElOICgkcGgpIiwkZW1zKSxBUlJBWV9BKTpbXTsKICAkdXo9W107IGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkbz13Y19nZXRfb3JkZXIoJHhbJ2lkJ10pOyAka2FuPSRvP1skby0+Z2V0X21ldGEoJ19wc191dG1fY2FtcGFpZ24nKSwkby0+Z2V0X21ldGEoJ19wc19rYW5hbGFzX3Bhc2t1dGluaXMnKV06W107ICRmPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qga2FuYWxhc19wYXNrdXRpbmlzLCB1dG1fY2FtcGFpZ24sIGtvbnRyaWJ1Y2lqYV9jdCBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSB1enNha3ltYXNfaWQ9JWQiLCR4WydpZCddKSxBUlJBWV9BKTsgJHV6W109Wyducic9PiRvPyRvLT5nZXRfb3JkZXJfbnVtYmVyKCk6JHhbJ2lkJ10sJ2QnPT5zdWJzdHIoJHhbJ2QnXSwwLDEwKSwnZXVyJz0+cm91bmQoJHhbJ3QnXSwyKSwna2FuYWxhcyc9PiRmWydrYW5hbGFzX3Bhc2t1dGluaXMnXT8/Jz8nLCd1dG0nPT4kZlsndXRtX2NhbXBhaWduJ10/PycnLCdrb250cic9Pmlzc2V0KCRmWydrb250cmlidWNpamFfY3QnXSk/cm91bmQoJGZbJ2tvbnRyaWJ1Y2lqYV9jdCddLzEwMCwyKTpudWxsXTsgfQogICRyWyd1enNha3ltYWknXT0kdXo7ICRyWyd1enNfbiddPWNvdW50KCR1eik7ICRyWyd1enNfZXVyJ109cm91bmQoYXJyYXlfc3VtKGFycmF5X2NvbHVtbigkdXosJ2V1cicpKSwyKTsgJHJbJ3BpcmtlanUnXT1jb3VudChhcnJheV91bmlxdWUoYXJyYXlfY29sdW1uKCRyb3dzLCdlJykpKTsKICAvLyBraWVrIGxpa3VzacWzIGthbmRpZGF0xbMga2l0YWkgYmFuZ2FpICh0YXMgcGF0cyBmaWx0cmFzOiAxIHBpcmtpbWFzIG51byAyMDI1LTAxLCB0aWsgxaF1bsWzIG1haXN0YXMsIGJlIHN1dGlraW1vLCBkYXIgbmVwaXJrbyBuYXVqb2plKSDigJQgc2thacSNaXVzIGnFoSBTMTc0MSBzxIVyYcWhbyBsb2dpa29zIG5lYmVwZXJyYcWhYXU7IGltYW0gcmVsYXVuY2hfa29udGFrdGFpIGJlbmRyYWkKICAkclsncmVsYXVuY2hfa29udGFrdGFpX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfcmVsYXVuY2hfa29udGFrdGFpIik7CiAgJHJbJ25hdWppX3BpcmtlamFpX3BvXzA5MzBfaXNfcmVsYXVuY2gnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgTE9XRVIoby5iaWxsaW5nX2VtYWlsKSkgRlJPTSB7JFB9d2Nfb3JkZXJzIG8gSk9JTiB7JFB9cHNfcmVsYXVuY2hfa29udGFrdGFpIGsgT04gTE9XRVIoay5lbWFpbCk9TE9XRVIoby5iaWxsaW5nX2VtYWlsKSBXSEVSRSBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0zMCciKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-075813';
const GKEY='ps_s1807a';
const PHASES=["1"];
const OUT='analize/s1807_a2.json';
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
