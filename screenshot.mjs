process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODggbWcg4oCUIERFUExPWSBwZXRzaG9wLWxpZmVjeWNsZS12YXJ0YWkucGhwIHYxLjIuMSDihpIgdjEuMi4yOiBhacWha2lhaSBwYXByYcWheXRhcyBwcmltaW5pbWFzIChwc19yZWZpbGxfdHJhY2tpbmcuZmVlZGJhY2tfY3ljbGU9J3JlbGF1bmNoJykgTkVQQVRFTktBIMSvIDEwICUgaG9sZG91dC4gbWQ1IHNhcmdhcyA2NTE2YmVjOeKApiwgYmFrIHVwbG9hZHMvcHMtYmFja3Vwcy9wZXRzaG9wLWxpZmVjeWNsZS12YXJ0YWkucGhwLmJha19zMTY4OCwgdG9rZW5fZ2V0X2FsbCwgaGVhcnRiZWF0L3JvbGxiYWNrLiBmPXRpa3JpbnRpIOKAlCBhdHNraXJhIHXFvmtsYXVzYS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODhtZyddKSkgcmV0dXJuOyAkbz1hcnJheSgndic9PidTMTY4OCBtZycpOyAkZj0kX0dFVFsncHNfczE2ODhtZyddOwogICRmcD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxpZmVjeWNsZS12YXJ0YWkucGhwJzsgJGJhaz13cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyB3cF9ta2Rpcl9wKCRiYWspOwogIGlmKCRmPT09J2RlcGxveScpewogICAgJG9bJ21kNV9wcmllcyddPW1kNV9maWxlKCRmcCk7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmcCk7CiAgICAkYT0iCQlpZiAoIHNlbGY6OmhvbGRvdXQoIFwkZW1haWwgKSApIHJldHVybiBhcnJheSggJ2FsbG93ZWQnID0+IGZhbHNlLCAncmVhc29uJyA9PiAnaG9sZG91dF8xMCcsICd0ZXJtaW5hbCcgPT4gdHJ1ZSApOyI7CiAgICAkYj0iCQlpZiAoIHNlbGY6OmhvbGRvdXQoIFwkZW1haWwgKSAmJiAhIHNlbGY6OnByYXN5dGEoIFwkZW1haWwsIFwkY29udGV4dCApICkgcmV0dXJuIGFycmF5KCAnYWxsb3dlZCcgPT4gZmFsc2UsICdyZWFzb24nID0+ICdob2xkb3V0XzEwJywgJ3Rlcm1pbmFsJyA9PiB0cnVlICk7IjsKICAgICRjPSIJcHVibGljIHN0YXRpYyBmdW5jdGlvbiBob2xkb3V0KCBcJGVtYWlsICkgeyI7CiAgICAkZD0iCS8qKiBTMTY4ODoga2xpZW50YXMgcGF0cyBwYXByYcWhxJcgcHJpbWluaW1vIHByZWvEl3MgcHVzbGFweWplIChmZWVkYmFja19jeWNsZT0ncmVsYXVuY2gnKSDigJQgaG9sZG91dCBuZXRhaWtvbWFzLiAqLwoJcHVibGljIHN0YXRpYyBmdW5jdGlvbiBwcmFzeXRhKCBcJGVtYWlsLCBcJGNvbnRleHQgKSB7CgkJZ2xvYmFsIFwkd3BkYjsgXCR1aWQgPSBpc3NldCggXCRjb250ZXh0Wyd1c2VyX2lkJ10gKSA/IChpbnQpIFwkY29udGV4dFsndXNlcl9pZCddIDogMDsgXCRwaWQgPSBpc3NldCggXCRjb250ZXh0Wydwcm9kdWN0X2lkJ10gKSA/IChpbnQpIFwkY29udGV4dFsncHJvZHVjdF9pZCddIDogMDsKCQlpZiAoICEgXCR1aWQgKSB7IFwkdSA9IGdldF91c2VyX2J5KCAnZW1haWwnLCBcJGVtYWlsICk7IFwkdWlkID0gXCR1ID8gKGludCkgXCR1LT5JRCA6IDA7IH0KCQlpZiAoICEgXCR1aWQgfHwgISBcJHBpZCApIHJldHVybiBmYWxzZTsKCQlyZXR1cm4gJ3JlbGF1bmNoJyA9PT0gKHN0cmluZykgXCR3cGRiLT5nZXRfdmFyKCBcJHdwZGItPnByZXBhcmUoIFwiU0VMRUNUIGZlZWRiYWNrX2N5Y2xlIEZST00ge1wkd3BkYi0+cHJlZml4fXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSB1c2VyX2lkPSVkIEFORCBwcm9kdWN0X2lkPSVkXCIsIFwkdWlkLCBcJHBpZCApICk7Cgl9CgoJcHVibGljIHN0YXRpYyBmdW5jdGlvbiBob2xkb3V0KCBcJGVtYWlsICkgeyI7CiAgICAkb1snYV9uJ109c3Vic3RyX2NvdW50KCRzLCRhKTsgJG9bJ2NfbiddPXN1YnN0cl9jb3VudCgkcywkYyk7CiAgICBpZihzdWJzdHIoJG9bJ21kNV9wcmllcyddLDAsOCkhPT0nNjUxNmJlYzknfHwkb1snYV9uJ10hPT0xfHwkb1snY19uJ10hPT0xKXsgJG9bJ3N0b3AnXT0nc2FyZ2FzJzsgfQogICAgZWxzZSB7ICRuPXN0cl9yZXBsYWNlKCRhLCRiLCRzKTsgJG49c3RyX3JlcGxhY2UoJGMsJGQsJG4pOyAkbj1zdHJfcmVwbGFjZSgnVmVyc2lvbjogMS4yLjEnLCdWZXJzaW9uOiAxLjIuMicsJG4pOwogICAgICB0cnkgeyB0b2tlbl9nZXRfYWxsKCRuLFRPS0VOX1BBUlNFKTsgfSBjYXRjaChUaHJvd2FibGUgJGUpeyAkb1snc3RvcCddPSd0b2tlbjogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICAgIGlmKGVtcHR5KCRvWydzdG9wJ10pKXsgY29weSgkZnAsJGJhay4nL3BldHNob3AtbGlmZWN5Y2xlLXZhcnRhaS5waHAuYmFrX3MxNjg4Jyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRmcCwkbik7ICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkZnApOwogICAgICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfaGI9Jy50aW1lKCkpLGFycmF5KCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRoYj1pc193cF9lcnJvcigkcik/MDp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7ICRvWydoYiddPSRoYjsKICAgICAgICBpZigkaGI+PTUwMHx8JGhiPT09MCl7IGNvcHkoJGJhay4nL3BldHNob3AtbGlmZWN5Y2xlLXZhcnRhaS5waHAuYmFrX3MxNjg4JywkZnApOyAkb1sncm9sbGJhY2snXT1tZDVfZmlsZSgkZnApOyB9IH0gfQogIH0gZWxzZSB7CiAgICAkb1snbWQ1J109bWQ1X2ZpbGUoJGZwKTsgJG9bJ3ZlciddPWdldF9maWxlX2RhdGEoJGZwLGFycmF5KCd2Jz0+J1ZlcnNpb24nKSlbJ3YnXTsgJG9bJ3ByYXN5dGFfbWV0J109bWV0aG9kX2V4aXN0cygnUGV0c2hvcF9MaWZlY3ljbGVfVmFydGFpJywncHJhc3l0YScpOwogICAgJG9bJ3ByYXN5dGFfdGVycmEnXT1QZXRzaG9wX0xpZmVjeWNsZV9WYXJ0YWk6OnByYXN5dGEoJ3RlcnJhQGd5dnVuYWkubHQnLGFycmF5KCd1c2VyX2lkJz0+NDQsJ3Byb2R1Y3RfaWQnPT4xMjQ2NikpOwogICAgJG9bJ3ByYXN5dGFfa2l0YSddPVBldHNob3BfTGlmZWN5Y2xlX1ZhcnRhaTo6cHJhc3l0YSgndGVycmFAZ3l2dW5haS5sdCcsYXJyYXkoJ3VzZXJfaWQnPT40NCwncHJvZHVjdF9pZCc9PjE4MDg0KSk7CiAgICAkb1snaG9sZG91dF90ZXJyYSddPVBldHNob3BfTGlmZWN5Y2xlX1ZhcnRhaTo6aG9sZG91dCgndGVycmFAZ3l2dW5haS5sdCcpOwogICAgJG9bJ2VsaWdfdGVycmEnXT1QZXRzaG9wX0xpZmVjeWNsZV9WYXJ0YWk6OmVsaWdpYmlsaXR5KGFycmF5KCdhbGxvd2VkJz0+dHJ1ZSksJ3JlZmlsbF9kdWUnLCdzaW1pbGFyX3NvZnRfb3B0aW4nLCd0ZXJyYUBneXZ1bmFpLmx0JyxhcnJheSgndXNlcl9pZCc9PjQ0LCdwcm9kdWN0X2lkJz0+MTI0NjYpKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-101512';
const GKEY='ps_s1688mg';
const PHASES=["tikrinti"];
const OUT='analize/s1688_mg3.json';
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
