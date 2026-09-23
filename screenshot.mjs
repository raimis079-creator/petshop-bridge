process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZigoJF9HRVRbJ3BzX3MxNzA2eSddPz8nJykhPT0nMScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgpOwogIHRyeXsKICAgICRjZmc9YXJyYXkoCiAgICAgIDMyMzE9PmFycmF5KCd0Jz0+J0pvc2VyYSBtYWlzdGFzIMWhdW5pbXMg4oCTIDEwIGtnLCAxMiw1IGtnIGlyIDE1IGtnIG1hacWhYWknLCdkJz0+J0pvc2VyYSBzYXVzYXMgbWFpc3RhcyDFoXVuaW1zIHBhZ2FsIGR5ZMSvLCBhbcW+acWzIGlyIGFrdHl2dW3EhTogMTAga2csIDEyLDUga2cgaXIgMTUga2cgbWFpxaFhaS4gS2llayBrYWludW9qYSBwZXIgZGllbsSFIOKAkyBwYXNpdGlrcmlua2l0ZSBza2FpxI1pdW9rbMSXamUuJywnc2MnPT4nW3BldHNob3BfbWFpc3RhaSBydXNpcz0iZG9nIiBrZz0iMjAiIGZpbHRyYXM9Ikpvc2VyYSIgbj0iMyIgYW50cmFzdGU9IlBvcHVsaWFyaWF1c2kgSm9zZXJhIG1haXN0YWkgxaF1bmltcyIgdGVrc3Rhcz0iS2llayBrYWludW9qYSBwZXIgZGllbsSFIDIwIGtnIMWhdW5pdWkgcGFnYWwgZ2FtaW50b2pvIG5vcm3EhToiXScpLAogICAgICAzMjMzPT5hcnJheSgndCc9PidKb3NlcmEgbWFpc3RhcyBrYXTEl21zIOKAkyAyIGtnIGlyIDEwIGtnIHBha3VvdMSXcycsJ2QnPT4nSm9zZXJhIHNhdXNhcyBtYWlzdGFzIGthdMSXbXM6IHN0ZXJpbGl6dW90b21zLCBpxaFyYW5raW9tcywgamF1dHJhdXMgdmlyxaFraW5pbW8ga2F0xJdtcywgMiBrZyBpciAxMCBrZyBwYWt1b3TEl3MuIEtpZWsga2FpbnVvamEgcGVyIGRpZW7EhSDigJMgcGFzaXRpa3JpbmtpdGUgc2thacSNaXVva2zEl2plLicsJ3NjJz0+J1twZXRzaG9wX21haXN0YWkgcnVzaXM9ImNhdCIga2c9IjQiIGZpbHRyYXM9Ikpvc2VyYSIgbj0iMyIgYW50cmFzdGU9IlBvcHVsaWFyaWF1c2kgSm9zZXJhIG1haXN0YWkga2F0xJdtcyIgdGVrc3Rhcz0iS2llayBrYWludW9qYSBwZXIgZGllbsSFIDQga2cga2F0ZWkgcGFnYWwgZ2FtaW50b2pvIG5vcm3EhToiXScpKTsKICAgICRiPWdldF9vcHRpb24oJ3BzX3MxNzA2X3R1cmlueXNfYmFrJyxhcnJheSgpKTsKICAgIGZvcmVhY2goJGNmZyBhcyAkaWQ9PiRjKXsgJHA9Z2V0X3Bvc3QoJGlkKTsgJGJbJGlkLidfdGl0bGUnXT0kcC0+cG9zdF90aXRsZTsgJGJbJGlkXT0kcC0+cG9zdF9jb250ZW50OyAkYlskaWQuJ19kZXNjJ109Z2V0X3Bvc3RfbWV0YSgkaWQsJ3JhbmtfbWF0aF9kZXNjcmlwdGlvbicsdHJ1ZSk7CiAgICAgICR0eHQ9JHAtPnBvc3RfY29udGVudDsgcHJlZ19tYXRjaF9hbGwoJ35bXjw+XXswLDYwfXBpZ2lhdVtePD5dezAsNDB9fml1JywkdHh0LCRtKTsgJG9bJ3BpZ2lhdV9wcmllcyddWyRpZF09JG1bMF07CiAgICAgICR0eHQ9c3RyX3JlcGxhY2UoYXJyYXkoJ0pvc2VyYSBtYWlzdGFzIGthdMSXbXMgcGlnaWF1JyksYXJyYXkoJ0pvc2VyYSBtYWlzdGFzIGthdMSXbXMnKSwkdHh0KTsKICAgICAgaWYoc3RycG9zKCR0eHQsJ1twZXRzaG9wX21haXN0YWknKT09PWZhbHNlKXsgJHBvcz1zdHJpcG9zKCR0eHQsJzwvcD4nKTsgJHR4dD0oJHBvcz09PWZhbHNlKT8kY1snc2MnXS4kdHh0OnN1YnN0cigkdHh0LDAsJHBvcys0KS4iXG5cbiIuJGNbJ3NjJ10uIlxuXG4iLnN1YnN0cigkdHh0LCRwb3MrNCk7IH0KICAgICAga3Nlc19yZW1vdmVfZmlsdGVycygpOyB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kaWQsJ3Bvc3RfdGl0bGUnPT4kY1sndCddLCdwb3N0X2NvbnRlbnQnPT53cF9zbGFzaCgkdHh0KSkpOyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwncmFua19tYXRoX2Rlc2NyaXB0aW9uJywkY1snZCddKTsKICAgICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldChnZXRfcGVybWFsaW5rKCRpZCkuJz9uYz0nLnRpbWUoKSxhcnJheSgndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKICAgICAgJG9bJ3AnXVskaWRdPWFycmF5KCd0aXRsZSc9PnByZWdfbWF0Y2goJ348dGl0bGU+KC4qPyk8L3RpdGxlPn5zJywkaCwkbW0pPyRtbVsxXTonPycsJ2Rlc2MnPT5wcmVnX21hdGNoKCd+PG1ldGEgbmFtZT0iZGVzY3JpcHRpb24iIGNvbnRlbnQ9IihbXiJdKyl+JywkaCwkbW0pPyRtbVsxXTonPycsJ3BpZ2lhdV9saWtvJz0+cHJlZ19tYXRjaF9hbGwoJ35waWdpYXV+aXUnLHdwX3N0cmlwX2FsbF90YWdzKHByZWdfcmVwbGFjZSgnfjwoc2NyaXB0fHN0eWxlKS4qPzwvXDE+fnMnLCcnLCRoKSkpLCdibG9rYXMnPT5wcmVnX21hdGNoKCd+PHNlY3Rpb24gY2xhc3M9InBzLXZzIHBzLXZzLXN0ciIuKj88L3NlY3Rpb24+fnMnLCRoLCRtbSk/bWJfc3Vic3RyKHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRtbVswXSkpKSwwLDUwMCk6J05FUkEnKTsKICAgIH0KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzA2X3R1cmlueXNfYmFrJywkYixmYWxzZSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydLTEFJREEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgOTkpOwo=';
const VER='dep-144252';
const GKEY='ps_s1706y';
const PHASES=["1"];
const OUT='analize/s1706_my.json';
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
