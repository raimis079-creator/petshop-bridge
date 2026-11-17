process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc0cjMgRFAgcGFrdSBsaWt1dGlzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg3NHonXSkpIHJldHVybjsgJHI9Wyd2Jz0+J3IzJ107IGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgZm9yZWFjaChbJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfaXNfaW5fc3RvY2snLCd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9zdG9ja19zdGF0dXMnLCd3b29jb21tZXJjZV9nZXRfYXZhaWxhYmlsaXR5Jywnd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfc3RvY2tfcXVhbnRpdHknLCd3b29jb21tZXJjZV9pc19wdXJjaGFzYWJsZSddIGFzICRoKXsgZ2xvYmFsICR3cF9maWx0ZXI7ICRjYj1bXTsgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHA9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkeCl7ICRmPSR4WydmdW5jdGlvbiddOyBpZihpc19hcnJheSgkZikpICRjYltdPSRwLic6Jy4oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOyBlbHNlaWYoaXNfc3RyaW5nKCRmKSkgJGNiW109JHAuJzonLiRmOyBlbHNlIHsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGYpOyAkY2JbXT0kcC4nOmNsb3N1cmUgJy5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyZi0+Z2V0U3RhcnRMaW5lKCk7IH0gfSAkclsnaCddWyRoXT0kY2I7IH0KICAkclsnc24nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyVpc19pbl9zdG9jayUnIE9SIGNvZGUgTElLRSAnJWdldF9zdG9ja19zdGF0dXMlJyBPUiBjb2RlIExJS0UgJyVfZHBfYmFzZV9wcm9kdWN0X2lkJScpIixBUlJBWV9BKTsKICAkZHA9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtLm1ldGFfdmFsdWU8PicnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAkbj0wOyRuZWF0PTA7JGtyeXA9WydzYXVnb19pbl9yb2RvX291dCc9PjAsJ3NhdWdvX291dF9yb2RvX2luJz0+MF07CiAgZm9yZWFjaCgkZHAgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsgJG4rKzsgJHN0PWdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2tfc3RhdHVzJyx0cnVlKTsgJGluPSRwLT5pc19pbl9zdG9jaygpOyBpZigkc3Q9PT0naW5zdG9jaycmJiEkaW4peyRrcnlwWydzYXVnb19pbl9yb2RvX291dCddKys7fSBpZigkc3Q9PT0nb3V0b2ZzdG9jaycmJiRpbil7JGtyeXBbJ3NhdWdvX291dF9yb2RvX2luJ10rKzt9IH0KICAkclsnZHAnXT1bJ3B1Ymxpa3VvdHUnPT4kbl0rJGtyeXA7CiAgJGI9d2NfZ2V0X3Byb2R1Y3QoMTg1ODcpOyAkclsnMTg1ODcnXT1bJ3N0b2NrJz0+JGItPmdldF9zdG9ja19xdWFudGl0eSgpLCdtYW5hZ2UnPT4kYi0+Z2V0X21hbmFnZV9zdG9jaygpLCdzdGF0dXNfbWV0YSc9PmdldF9wb3N0X21ldGEoMTg1ODcsJ19zdG9ja19zdGF0dXMnLHRydWUpLCdpc19pbic9PiRiLT5pc19pbl9zdG9jaygpLCdvd24nPT5nZXRfcG9zdF9tZXRhKDE4NTg3LCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgxODU4NywnX3BzX3NhbmRlbGlzJyx0cnVlKSwndmZfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgxODU4NywnX3ZmX3F0eScsdHJ1ZSksJ3N0b2NrX3Jhdyc9PmdldF9wb3N0X21ldGEoMTg1ODcsJ19zdG9jaycsdHJ1ZSksJ2h0bWwnPT53cF9zdHJpcF9hbGxfdGFncyh3Y19nZXRfc3RvY2tfaHRtbCgkYikpXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-112311';
const GKEY='ps_s1874z';
const PHASES=["GO"];
const OUT='analize/s1874_r3.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
