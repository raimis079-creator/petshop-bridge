process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0aSByZWNvbjoga2FzIHJlZ2lzdHJ1b2phIHBldHNob3BfdmZfc3luY19zdG9ja19ob3VybHksIGthaXAgcmFzbyBfc3RvY2s7IHBldHNob3AtY2FjaGUgdjEuMiB2eWtkeXRpKCkga29kYXMuIHJlYWQtb25seSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjRpJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyNGknXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgdHJ5ewogICAgLy8gMS4ga2FzIHJlZ2lzdHJ1b2phIGhvb2snYQogICAgJHJhc3RhPVtdOyBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyovKi5waHAnKSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyovKi8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nLyovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy8qLyovKi5waHAnKSkgYXMgJGZ4KXsgJHM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmeCk7IGlmKCRzIT09ZmFsc2UmJnN0cnBvcygkcywncGV0c2hvcF92Zl9zeW5jX3N0b2NrX2hvdXJseScpIT09ZmFsc2UpICRyYXN0YVtdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGZ4KTsgfQogICAgJHJbJ2hvb2tfZmFpbGFpJ109JHJhc3RhOwogICAgLy8gMi4gaG9vaydvIGNhbGxiYWNrJ2FzCiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsgJGNiPVtdOyBpZihpc3NldCgkd3BfZmlsdGVyWydwZXRzaG9wX3ZmX3N5bmNfc3RvY2tfaG91cmx5J10pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWydwZXRzaG9wX3ZmX3N5bmNfc3RvY2tfaG91cmx5J10tPmNhbGxiYWNrcyBhcyAkcHJpbz0+JGZzKXsgZm9yZWFjaCgkZnMgYXMgJGs9PiRmKXsgJGZuPSRmWydmdW5jdGlvbiddOyBpZihpc19hcnJheSgkZm4pKXsgJGNscz1pc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF07ICRjYltdPVskcHJpbywkY2xzLic6OicuJGZuWzFdXTsgdHJ5eyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNscywkZm5bMV0pOyAkY2JbY291bnQoJGNiKS0xXVtdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHJtLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJtLT5nZXRTdGFydExpbmUoKS4nLScuJHJtLT5nZXRFbmRMaW5lKCk7IH1jYXRjaChUaHJvd2FibGUgJGUpe30gfSBlbHNlaWYoaXNfc3RyaW5nKCRmbikpeyAkY2JbXT1bJHByaW8sJGZuXTsgdHJ5eyAkcmY9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOyAkY2JbY291bnQoJGNiKS0xXVtdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fSB9IGVsc2UgJGNiW109WyRwcmlvLCdjbG9zdXJlJ107IH0gfSB9CiAgICAkclsnY2FsbGJhY2tzJ109JGNiOwogICAgLy8gMy4gY2FsbGJhY2snbyBrb2RhcyAocGlybWFzKQogICAgaWYoJGNiICYmIGlzc2V0KCRjYlswXVsyXSkpeyBsaXN0KCRmcCwkcm5nKT1leHBsb2RlKCc6JywkY2JbMF1bMl0pOyBsaXN0KCRhLCRiKT1hcnJheV9wYWQoZXhwbG9kZSgnLScsJHJuZyksMixudWxsKTsgJEw9ZmlsZShBQlNQQVRILiRmcCk7ICRiPSRiPzokYSs4MDsgJHJbJ2NhbGxiYWNrX2tvZGFzJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkTCwkYS0xLG1pbigkYi0kYSsxLDE0MCkpKTsKICAgICAgLy8ga3VyIHNldF9zdG9jayAvIHVwZGF0ZV9wb3N0X21ldGEgX3N0b2NrIHRhbWUgZmFpbGUKICAgICAgZm9yZWFjaCgkTCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvc2V0X3N0b2NrfF9zdG9ja1xifHdjX3VwZGF0ZV9wcm9kdWN0X3N0b2NrfHVwZGF0ZV9wb3N0X21ldGF8c2V0X3N0b2NrX3N0YXR1c3wtPnNhdmVcKC8nLCRsKSkgJHJbJ3N0b2NrX2VpbHV0ZXMnXVtdPSgkaSsxKS4nOiAnLnRyaW0oJGwpOyB9ICRyWydzdG9ja19laWx1dGVzJ109YXJyYXlfc2xpY2UoJHJbJ3N0b2NrX2VpbHV0ZXMnXT8/W10sMCw2MCk7ICRyWydmYWlsYXMnXT0kZnA7IH0KICAgIC8vIDQuIHBldHNob3AtY2FjaGUgdnlrZHl0aSgpIGlyIHByZWtlXyogZnVua2Npam9zCiAgICAkYz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNhY2hlLnBocCcpOyAkTD1leHBsb2RlKCJcbiIsJGMpOyAkclsnY2FjaGVfdmVyJ109cHJlZ19tYXRjaCgnI1ZlcnNpb246XHMqKFtcZC5dKykjJywkYywkbSk/JG1bMV06bnVsbDsgJHJbJ2NhY2hlX21kNSddPW1kNSgkYyk7ICRyWydjYWNoZV9laWwnXT1jb3VudCgkTCk7CiAgICAkc3Q9bnVsbDsgZm9yZWFjaCgkTCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gKHByZWtlX29ianxwcmVrZV9pZHxwcmVrZV9wcm9wc3x2eWtkeXRpfHZpc2thc3x6dXJuYWxhc3xwb19pbXBvcnRvKVxiLycsJGwpKSAkc3RbXT0kaTsgfQogICAgJHJbJ2NhY2hlX2tvZGFzJ109W107IGZvcmVhY2goJHN0IGFzICRpKXsgJHJbJ2NhY2hlX2tvZGFzJ11bXT1pbXBsb2RlKCJcbiIsYXJyYXlfbWFwKGZ1bmN0aW9uKCRqKSB1c2UoJEwpeyByZXR1cm4gKCRqKzEpLic6ICcuJExbJGpdOyB9LHJhbmdlKCRpLG1pbihjb3VudCgkTCktMSwkaSsyOCkpKSk7IH0KICAgICRyWydjYWNoZV9jb25maWdfb3B0J109Wydwc19jYWNoZV92YWx5bWFpX24nPT5jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfY2FjaGVfdmFseW1haScpKV07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-102216';
const GKEY='ps_s1724i';
const PHASES=["1"];
const OUT='analize/s1724_i.json';
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
