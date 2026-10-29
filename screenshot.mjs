process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA4cyBTZW5kZXIga2FtcGFuaWpvcyBpciBwcmVudW1lcmF0b3JpYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA4cyddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoOTApOyAkcj1bJ3YnPT4nUzE4MDhzJ107CiAgaWYoIWNsYXNzX2V4aXN0cygnUGV0c2hvcF9TZW5kZXJfQWRhcHRlcicpKXsgJHJbJ2VyciddPSduZXJhIGFkYXB0ZXJpbyc7IH0gZWxzZSB7CiAgICAkdG9rPVBldHNob3BfU2VuZGVyX0FkYXB0ZXI6OmdldF9zdG9yZWRfdG9rZW4oJ21hcmtldGluZycpOyAkaD1bJ3RpbWVvdXQnPT4yNSwnaGVhZGVycyc9PlsnQXV0aG9yaXphdGlvbic9PidCZWFyZXIgJy4kdG9rLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vanNvbiddXTsKICAgICRnPWZ1bmN0aW9uKCR1KSB1c2UoJGgpeyAkeD13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5zZW5kZXIubmV0L3YyLycuJHUsJGgpOyByZXR1cm4gaXNfd3BfZXJyb3IoJHgpP1snZXJyJz0+JHgtPmdldF9lcnJvcl9tZXNzYWdlKCldOlsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSwnYic9Pmpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSx0cnVlKV07IH07CiAgICAkYz0kZygnY2FtcGFpZ25zP2xpbWl0PTgnKTsgJHJbJ2NhbXBfY29kZSddPSRjWydjb2RlJ10/P251bGw7CiAgICBmb3JlYWNoKCgkY1snYiddWydkYXRhJ10/P1tdKSBhcyAkayl7ICRyb3c9W107IGZvcmVhY2goWydpZCcsJ3RpdGxlJywnc3ViamVjdCcsJ3N0YXR1cycsJ3NlbnRfdGltZScsJ3NjaGVkdWxlX3RpbWUnLCdjcmVhdGVkJywncmVjaXBpZW50X2NvdW50Jywnc2VudF9jb3VudCcsJ29wZW5zJywndW5pcXVlX29wZW5zJywnY2xpY2tzJywndW5pcXVlX2NsaWNrcycsJ3Vuc3Vic2NyaWJlcycsJ2JvdW5jZXNfaGFyZCcsJ2JvdW5jZXNfc29mdCcsJ2NvbXBsYWludHMnXSBhcyAkZikgaWYoaXNzZXQoJGtbJGZdKSkgJHJvd1skZl09JGtbJGZdOyBpZihlbXB0eSgkcm93WydvcGVucyddKSYmaXNzZXQoJGtbJ3N0YXRzJ10pKSAkcm93WydzdGF0cyddPSRrWydzdGF0cyddOyAkclsnY2FtcCddW109JHJvdzsgfQogICAgaWYoIWVtcHR5KCRjWydiJ11bJ2RhdGEnXVswXSkpICRyWydjYW1wX2tleXMnXT1hcnJheV9rZXlzKCRjWydiJ11bJ2RhdGEnXVswXSk7CiAgICAkcz0kZygnc3Vic2NyaWJlcnM/bGltaXQ9MScpOyAkclsnc3Vic19tZXRhJ109JHNbJ2InXVsnbWV0YSddPz8oJHNbJ2InXVsndG90YWwnXT8/bnVsbCk7CiAgICAkZ3I9JGcoJ2dyb3VwcycpOyBmb3JlYWNoKCgkZ3JbJ2InXVsnZGF0YSddPz9bXSkgYXMgJHgpICRyWydncm91cHMnXVtdPVskeFsndGl0bGUnXT8/JycsJHhbJ3JlY2lwaWVudF9jb3VudCddPz8oJHhbJ2FjdGl2ZV9zdWJzY3JpYmVycyddPz9udWxsKSwkeFsndW5zdWJzY3JpYmVkX2NvdW50J10/P251bGxdOwogIH0KICAkd2w9Z2V0X29wdGlvbigncHNfc2VuZGVyX3dlYmhvb2tfbG9nJyk7ICRyWyd3ZWJob29rX3Bhc2snXT1pc19hcnJheSgkd2wpP2FycmF5X3NsaWNlKCR3bCwtOCk6bnVsbDsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-070925';
const GKEY='ps_s1808s';
const PHASES=["1"];
const OUT='analize/s1808_s.json';
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
