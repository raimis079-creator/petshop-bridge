process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgybiAzIGtlbGlhaSA0MDQg4oaSIGF0aXRpa21lbnlzIMK3IDEgcGF0aWtyYSDCtyAyIDMwMSDFvmVtxJdsYXBpcyArIHZpZGluxJcgbnVvcm9kYSDCtyA5IGF0c3RhdHltYXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgybiddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTc4Mm4nXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3ODJuJywnZic9PiRGXTsKICB0cnl7CiAgICAkY2F0cz1mdW5jdGlvbigkbGlrZSkgdXNlKCR3cGRiLCRQKXsgcmV0dXJuICR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LmNvdW50LHR0LnBhcmVudCBGUk9NIHskUH10ZXJtcyB0IEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgKHQuc2x1ZyBMSUtFICVzIE9SIHQubmFtZSBMSUtFICVzKSBMSU1JVCA4IiwkbGlrZSwkbGlrZSksQVJSQVlfQSk7IH07CiAgICAkclsncHJpZXppdXJvcyddPWFycmF5X21hcChmbigkYyk9PlskY1sndGVybV9pZCddLCRjWyduYW1lJ10sZ2V0X3Rlcm1fbGluaygoaW50KSRjWyd0ZXJtX2lkJ10sJ3Byb2R1Y3RfY2F0JyksJGNbJ2NvdW50J11dLCRjYXRzKCclcHJpZXppdXIlJykpOwogICAgJHJbJ21haXN0YXNfa2F0ZW1zJ109YXJyYXlfbWFwKGZuKCRjKT0+WyRjWyd0ZXJtX2lkJ10sJGNbJ25hbWUnXSxnZXRfdGVybV9saW5rKChpbnQpJGNbJ3Rlcm1faWQnXSwncHJvZHVjdF9jYXQnKSwkY1snY291bnQnXV0sJGNhdHMoJyVtYWlzdGFzLWthdGVtcyUnKSk7CiAgICBmb3JlYWNoKFsnYWtjaWpvcycsJ3Bhc2l1bHltYWknLCdkYXVnaWF1LXBpZ2lhdSddIGFzICRzKXsgJHA9Z2V0X3BhZ2VfYnlfcGF0aCgkcyk7ICRyWydwc2wnXVskc109JHA/WyRwLT5JRCwkcC0+cG9zdF9zdGF0dXMsZ2V0X3Blcm1hbGluaygkcCldOm51bGw7IH0KICAgICRyWydha2Npam9zX251b3JvZG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X3R5cGUgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3R5cGUgSU4gKCdwYWdlJywncG9zdCcsJ3Byb2R1Y3QnKSBBTkQgcG9zdF9jb250ZW50IExJS0UgJyVocmVmPVwiL2FrY2lqb3MlJyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgICAkclsnbWVuaXVfYWtjaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLG0ubWV0YV92YWx1ZSB1cmwgRlJPTSB7JFB9cG9zdHMgcCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfbWVudV9pdGVtX3VybCcgV0hFUkUgcC5wb3N0X3R5cGU9J25hdl9tZW51X2l0ZW0nIEFORCBtLm1ldGFfdmFsdWUgTElLRSAnJWFrY2lqb3MlJyIsQVJSQVlfQSk7CiAgICAkclsnd2lkZ2V0X2FrY2lqb3MnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfW9wdGlvbnMgV0hFUkUgb3B0aW9uX3ZhbHVlIExJS0UgJyUvYWtjaWpvcyUnIEFORCBvcHRpb25fbmFtZSBOT1QgTElLRSAnJXRyYW5zaWVudCUnIik7CiAgICAkbWY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJzsgJHJbJ21hcCddPVsneXJhJz0+ZmlsZV9leGlzdHMoJG1mKSwna2InPT5maWxlX2V4aXN0cygkbWYpP3JvdW5kKGZpbGVzaXplKCRtZikvMTAyNCk6MF07IGlmKGZpbGVfZXhpc3RzKCRtZikpeyAkbT1qc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cygkbWYpLHRydWUpOyAkclsnbWFwX24nXT1pc19hcnJheSgkbSk/Y291bnQoJG0pOic/JzsgJHJbJ21hcF9wdnonXT1hcnJheV9zbGljZSgkbSwwLDIsdHJ1ZSk7IGZvcmVhY2goWydzdW5pbXMvcHJpZXppdXJvcy1wcmllbW9uZXMnLCdha2Npam9zJywna2F0ZWdvcmlqYS9rYXRlbXMvbWFpc3Rhcy1rYXRlbXMnXSBhcyAkayl7ICRyWydtYXBfdHVyaSddWyRrXT0kbVska10/PygkbVsnLycuJGtdPz8oJG1bJy8nLiRrLicvJ10/P251bGwpKTsgfSB9CiAgICBmb3JlYWNoKFsnL3N1bmltcy9wcmlleml1cm9zLXByaWVtb25lcycsJy9ha2Npam9zLycsJy9rYXRlZ29yaWphL2thdGVtcy9tYWlzdGFzLWthdGVtcy8nXSBhcyAkdSl7ICRoPXdwX3JlbW90ZV9oZWFkKGhvbWVfdXJsKCR1KSxbJ3JlZGlyZWN0aW9uJz0+MCwndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsnZGFiYXInXVskdV09aXNfd3BfZXJyb3IoJGgpPydlcnInOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKS4nIOKGkiAnLndwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJGgsJ2xvY2F0aW9uJyk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-173534';
const GKEY='ps_s1782n';
const PHASES=["1"];
const OUT='analize/s1782_n1.json';
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
