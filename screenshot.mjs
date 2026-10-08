process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU5ZSBrdXIgc2F1Z29tYXMgdXpzYWt5bWFpQCBwYXN0byBzbGFwdGF6b2RpczogMSBEQiDCtyAyIHNhdmFzIGtvZGFzIMK3IDMgcGx1Z2luYWkgKHJlYWQtb25seSwgcmVpa3NtZXMgbmVpc3ZlZGFtb3MpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc1OWUnXSkpIHJldHVybjsgJEY9KHN0cmluZykkX0dFVFsncHNfczE3NTllJ107IEBzZXRfdGltZV9saW1pdCgxNjUpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc1OWUnLCdmJz0+JEZdOwogICRtYXNrPWZ1bmN0aW9uKCRsKXsgJGw9cHJlZ19yZXBsYWNlKCcvKChwYXNzKHdvcmQpP3xwd2R8c2VjcmV0fGtleSlbXj1cbl17MCwzMH0oPT58PXw6KVxzKikoW1wnIl0pW15cJyJdKlw1L2knLCckMSQ1KioqJDUnLCRsKTsgcmV0dXJuIG1iX3N1YnN0cih0cmltKCRsKSwwLDE3MCk7IH07CiAgJGdyZXA9ZnVuY3Rpb24oJGRpcnMsJHBhdHMsJG1heHNpemUsJHNraXApIHVzZSgkbWFzayl7ICRvPVtdOyAkbmY9MDsKICAgIGZvcmVhY2goJGRpcnMgYXMgJGQpeyBpZihpc19maWxlKCRkKSl7ICRpdD1bbmV3IFNwbEZpbGVJbmZvKCRkKV07IH0gZWxzZWlmKGlzX2RpcigkZCkpeyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZUNhbGxiYWNrRmlsdGVySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSxmdW5jdGlvbigkZikgdXNlKCRza2lwKXsgcmV0dXJuICEoJGYtPmlzRGlyKCkgJiYgcHJlZ19tYXRjaCgkc2tpcCwkZi0+Z2V0RmlsZW5hbWUoKSkpOyB9KSk7IH0gZWxzZSBjb250aW51ZTsKICAgICAgZm9yZWFjaCgkaXQgYXMgJGYpeyBpZighJGYtPmlzRmlsZSgpKSBjb250aW51ZTsgJHA9JGYtPmdldFBhdGhuYW1lKCk7IGlmKCFwcmVnX21hdGNoKCcvXC4ocGhwfHNofHB5fGluaXxlbnZ8anNvbnxjb25mKSQvaScsJHApIHx8ICRmLT5nZXRTaXplKCk+JG1heHNpemUpIGNvbnRpbnVlOyAkbmYrKzsKICAgICAgICAkdD1AZmlsZV9nZXRfY29udGVudHMoJHApOyBpZigkdD09PWZhbHNlKSBjb250aW51ZTsgJGhpdD1mYWxzZTsgZm9yZWFjaCgkcGF0cyBhcyAkcHQpeyBpZihzdHJpcG9zKCR0LCRwdCkhPT1mYWxzZSl7ICRoaXQ9dHJ1ZTsgYnJlYWs7IH0gfSBpZighJGhpdCkgY29udGludWU7CiAgICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJHQpIGFzICRpPT4kbCl7IGZvcmVhY2goJHBhdHMgYXMgJHB0KXsgaWYoc3RyaXBvcygkbCwkcHQpIT09ZmFsc2UpeyAkb1tdPVtzdHJfcmVwbGFjZShkaXJuYW1lKEFCU1BBVEgpLicvJywnJywkcCksJGkrMSwkcHQsJG1hc2soJGwpXTsgYnJlYWs7IH0gfSBpZihjb3VudCgkbyk+MTIwKSBicmVhayAzOyB9IH0gfQogICAgcmV0dXJuIFskbmYsJG9dOyB9OwogIHRyeXsKICBpZigkRj09PScxJyl7CiAgICAkbz1nZXRfb3B0aW9uKCd3cF9tYWlsX3NtdHAnKTsgJHJbJ3dwbXMnXT1bJ21haWxlcic9PiRvWydtYWlsJ11bJ21haWxlciddPz9udWxsLCdob3N0Jz0+JG9bJ3NtdHAnXVsnaG9zdCddPz9udWxsLCd1c2VyJz0+JG9bJ3NtdHAnXVsndXNlciddPz9udWxsLCdwYXNzX3lyYSc9PiFlbXB0eSgkb1snc210cCddWydwYXNzJ10pXTsKICAgIGZvcmVhY2goWydpc29wYXMnLCd1enNha3ltYWlAcGV0c2hvcC5sdCcsJ3BldHNob3AubHQ6NDY1Jywnc210cF9wYXNzJywnaW1hcCddIGFzICRuKXsgJEw9JyUnLiR3cGRiLT5lc2NfbGlrZSgkbikuJyUnOyAkclsnb3B0aW9ucyddWyRuXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBvcHRpb25fbmFtZSBuLExFTkdUSChvcHRpb25fdmFsdWUpIGxlbixhdXRvbG9hZCBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX3ZhbHVlIExJS0UgJXMgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICdcXF90cmFuc2llbnQlJScgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICdcXF9zaXRlXFxfdHJhbnNpZW50JSUnIExJTUlUIDMwIiwkTCksQVJSQVlfQSk7IH0KICAgICRUPSRQLidtYWlscG9ldF9zZXR0aW5ncyc7IGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckVCciKSl7ICR2PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgdmFsdWUgRlJPTSAkVCBXSEVSRSBuYW1lPSdtdGEnIik7ICRtPW1heWJlX3Vuc2VyaWFsaXplKCR2KTsgJHJbJ21haWxwb2V0X210YSddPWlzX2FycmF5KCRtKT9bJ21ldGhvZCc9PiRtWydtZXRob2QnXT8/bnVsbCwnaG9zdCc9PiRtWydob3N0J10/P251bGwsJ3BvcnQnPT4kbVsncG9ydCddPz9udWxsLCdsb2dpbic9PiRtWydsb2dpbiddPz9udWxsLCdwYXNzX3lyYSc9PiFlbXB0eSgkbVsncGFzc3dvcmQnXSldOm1iX3N1YnN0cigoc3RyaW5nKSR2LDAsNjApOyAkcz1tYXliZV91bnNlcmlhbGl6ZSgkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHZhbHVlIEZST00gJFQgV0hFUkUgbmFtZT0nc2VuZGVyJyIpKTsgJHJbJ21haWxwb2V0X3NlbmRlciddPWlzX2FycmF5KCRzKT8oJHNbJ2FkZHJlc3MnXT8/bnVsbCk6bnVsbDsgJHJbJ21haWxwb2V0X2FrdHl2dXMnXT1pbl9hcnJheSgnbWFpbHBvZXQvbWFpbHBvZXQucGhwJywoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSx0cnVlKTsgfQogICAgZm9yZWFjaChbJ1dQTVNfT04nLCdXUE1TX1NNVFBfUEFTUycsJ1NNVFBfUEFTUycsJ1NNVFBfUEFTU1dPUkQnLCdNQUlMX1BBU1NXT1JEJ10gYXMgJGMpICRyWydrb25zdCddWyRjXT1kZWZpbmVkKCRjKT8xOjA7CiAgICAkclsndXNlcm1ldGFfc210cCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIG1ldGFfa2V5IExJS0UgJyVzbXRwJScgT1IgbWV0YV9rZXkgTElLRSAnJWltYXAlJyIpOwogIH0KICBpZigkRj09PScyJyl7CiAgICAkcm9vdD1kaXJuYW1lKEFCU1BBVEgpOyAkZGlycz1bQUJTUEFUSC4nd3AtY29uZmlnLnBocCcsV1BNVV9QTFVHSU5fRElSLGdldF90aGVtZV9yb290KCksJHJvb3QuJy9wcy1icmlkZ2UnLCRyb290Licvc2NyaXB0cycsJHJvb3QuJy9jcm9uJ107CiAgICBmb3JlYWNoKChhcnJheSlnbG9iKCRyb290LicvKi57cGhwLHNoLHB5LGluaSxlbnZ9JyxHTE9CX0JSQUNFKSBhcyAkZikgJGRpcnNbXT0kZjsgZm9yZWFjaCgoYXJyYXkpZ2xvYihBQlNQQVRILicqLntwaHAsaW5pLGVudn0nLEdMT0JfQlJBQ0UpIGFzICRmKSBpZihiYXNlbmFtZSgkZikhPT0nd3AtY29uZmlnLnBocCcpICRkaXJzW109JGY7CiAgICAkaG9tZT1kaXJuYW1lKGRpcm5hbWUoJHJvb3QpKTsgZm9yZWFjaCgoYXJyYXkpZ2xvYigkaG9tZS4nLyoue3BocCxzaCxweX0nLEdMT0JfQlJBQ0UpIGFzICRmKSAkZGlyc1tdPSRmOwogICAgbGlzdCgkbiwkbyk9JGdyZXAoJGRpcnMsWydpc29wYXMnLCdpbWFwX29wZW4nLCd1enNha3ltYWlAcGV0c2hvcC5sdCcsJ1NNVFBBdXRoJywnLT5QYXNzd29yZCcsJ3NtdHBfcGFzcycsJ3BocG1haWxlcl9pbml0JywnbWFpbC5wZXRzaG9wLmx0J10sMjAwMDAwMCwnL14obm9kZV9tb2R1bGVzfHZlbmRvcnxcLmdpdHxjYWNoZSkkLycpOwogICAgJHJbJ2ZhaWx1J109JG47ICRyWydyYXN0YSddPSRvOyAkclsnY3JvbnRhYl9mYWlsYWknXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJywoYXJyYXkpZ2xvYigkaG9tZS4nLypjcm9uKicpKTsKICB9CiAgaWYoJEY9PT0nMycpewogICAgbGlzdCgkbiwkbyk9JGdyZXAoW1dQX1BMVUdJTl9ESVJdLFsnaXNvcGFzJywnaW1hcF9vcGVuKCcsJ3V6c2FreW1haUBwZXRzaG9wLmx0JywnbWFpbC5wZXRzaG9wLmx0J10sMTUwMDAwMCwnL14obm9kZV9tb2R1bGVzfGxhbmd1YWdlc3xhc3NldHN8XC5naXR8dGVzdHM/KSQvJyk7CiAgICAkclsnZmFpbHUnXT0kbjsgJHJbJ3Jhc3RhJ109JG87CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-081715';
const GKEY='ps_s1759e';
const PHASES=["1", "2"];
const OUT='out/s1759_e.json';
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
