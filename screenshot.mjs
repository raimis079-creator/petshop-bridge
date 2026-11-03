process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0bzMgIzE1NzEgYW50cmFzIFZlbmlwYWsgcGFrZXRhcyAxMTA0MDU0MjUgKFJhaW1pbyDigJ50YWlw4oCcIDEwOjQ1KSAoMSBkcnksIDIgYXBwbHksIDkgcmVzdG9yZSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI0bzMnXSkpIHJldHVybjsgJEY9JF9HRVRbJ3BzX3MxODI0bzMnXTsgJHI9Wyd2Jz0+J1MxODI0bzMnLCdGJz0+JEZdOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRpZD0zNzM3MDsgJE4yPScxMTA0MDU0MjUnOyAkTjE9J1YwNzI2N0UxMDAwNjIxJzsgJEJLPSdwc19zMTgyNG8zX2Jhayc7CiAgJG89d2NfZ2V0X29yZGVyKCRpZCk7ICR2ZD0kby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpOyAkdmQ9aXNfYXJyYXkoJHZkKT8kdmQ6anNvbl9kZWNvZGUoKHN0cmluZykkdmQsdHJ1ZSk7ICRwcz1qc29uX2RlY29kZSgoc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX3NpdW50b3MnKSx0cnVlKTsKICAkc2g9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRQfXBzX3NoaXBtZW50cyBXSEVSRSBvcmRlcl9pZD0lZCBBTkQgdHJhY2tpbmdfbnVtYmVyPSVzIiwkaWQsJE4xKSxBUlJBWV9BKTsgJGZzPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mYWt0X3NpdW50b3MgV0hFUkUgdXpzYWt5bWFzX2lkPSVkIEFORCBzaXVudG9zX25yPSVzIiwkaWQsJE4xKSxBUlJBWV9BKTsKICAkclsncHJpZXMnXT1bJ3ZkJz0+JHZkLCdwcyc9PiRwcywnc2gnPT4kc2g/JHNoWydpZCddOm51bGwsJ2ZzJz0+JGZzP1skZnNbJ2lkJ10sJGZzWydwYWtldHVfc2snXSwkZnNbJ2thaW5hX3ZlemVqb19jdCddLCRmc1snc3ZvcmlzX2Rla2xhcnVvdGFzX2cnXV06bnVsbCwnc2gyJz0+JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NIHskUH1wc19zaGlwbWVudHMgV0hFUkUgdHJhY2tpbmdfbnVtYmVyPSVzIiwkTjIpKV07CiAgaWYoJEY9PT0nMicpeyBpZihpbl9hcnJheSgkTjIsKGFycmF5KSgkdmRbJ3BhY2tfbnVtYmVycyddPz9bXSksdHJ1ZSkpeyAkclsnamF1J109MTsgZ290byBvdXQ7IH0KICAgIHVwZGF0ZV9vcHRpb24oJEJLLFsndmQnPT4kby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpLCdwcyc9PiRvLT5nZXRfbWV0YSgnX3BzX3NpdW50b3MnKSwnZnMnPT4kZnNdLGZhbHNlKTsKICAgICR2ZFsncGFja19udW1iZXJzJ11bXT0kTjI7ICRvLT51cGRhdGVfbWV0YV9kYXRhKCd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnLCR2ZCk7CiAgICBpZihpc19hcnJheSgkcHMpJiZpc3NldCgkcHNbJ2F2J10pKXsgJHBzWydhdiddWydudW1lcmlhaSddW109JE4yOyAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX3NpdW50b3MnLHdwX2pzb25fZW5jb2RlKCRwcykpOyB9CiAgICAkby0+YWRkX29yZGVyX25vdGUoJ0FudHJhcyBWZW5pcGFrIHBha2V0YXMgKEluZ2EsIHJhbmtpbmlzIGxpcGR1a2FzIMSvIHBhxaF0b21hdMSFKSDEr3JhxaF5dGFzIMSvIHNpdW50xIU6ICcuJE4yLicg4oCTIGthZCBrbGllbnRhcyBsYWnFoWtlIGlyIHBhc2t5cm9qZSBtYXR5dMWzIGFidSBudW1lcml1cy4gKENsYXVkZSBTMTgyNCwgUmFpbWlvIOKAnnRhaXDigJwpJywwLGZhbHNlKTsgJG8tPnNhdmUoKTsKICAgIGlmKCRzaCl7ICRyb3c9JHNoOyB1bnNldCgkcm93WydpZCddKTsgJHJvd1snc2hpcG1lbnRfaWQnXT0nc2hwXycuc3Vic3RyKG1kNSgkTjIudGltZSgpKSwwLDE2KTsgJHJvd1sndHJhY2tpbmdfbnVtYmVyJ109JE4yOyAkcm93Wyd0cmFja2luZ191cmwnXT0naHR0cHM6Ly92ZW5pcGFrLmx0L3RyYWNraW5nL3RyYWNrLycuJE4yOyAkcm93Wydub3RpZmllZF9hdCddPW51bGw7ICR3cGRiLT5pbnNlcnQoJFAuJ3BzX3NoaXBtZW50cycsJHJvdyk7ICRyWydzaF9uZXcnXT0kd3BkYi0+aW5zZXJ0X2lkOyB9CiAgICBpZigkZnMpeyAkd3BkYi0+dXBkYXRlKCRQLidwc19mYWt0X3NpdW50b3MnLFsncGFrZXR1X3NrJz0+Miwna2FpbmFfdmV6ZWpvX2N0Jz0+KGludCkkZnNbJ2thaW5hX3ZlemVqb19jdCddKjIsJ3N2b3Jpc19kZWtsYXJ1b3Rhc19nJz0+MjQyMDBdLFsnaWQnPT4kZnNbJ2lkJ11dKTsgfQogICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7ICRyWydwbyddPVsndmQnPT4kby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpLCdwcyc9PiRvLT5nZXRfbWV0YSgnX3BzX3NpdW50b3MnKV07IH0KICBpZigkRj09PSc5Jyl7ICRiPWdldF9vcHRpb24oJEJLKTsgaWYoJGIpeyAkby0+dXBkYXRlX21ldGFfZGF0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJywkYlsndmQnXSk7ICRvLT51cGRhdGVfbWV0YV9kYXRhKCdfcHNfc2l1bnRvcycsJGJbJ3BzJ10pOyAkby0+c2F2ZSgpOyAkd3BkYi0+ZGVsZXRlKCRQLidwc19zaGlwbWVudHMnLFsnb3JkZXJfaWQnPT4kaWQsJ3RyYWNraW5nX251bWJlcic9PiROMl0pOyBpZigkYlsnZnMnXSkgJHdwZGItPnVwZGF0ZSgkUC4ncHNfZmFrdF9zaXVudG9zJyxbJ3Bha2V0dV9zayc9PiRiWydmcyddWydwYWtldHVfc2snXSwna2FpbmFfdmV6ZWpvX2N0Jz0+JGJbJ2ZzJ11bJ2thaW5hX3ZlemVqb19jdCddLCdzdm9yaXNfZGVrbGFydW90YXNfZyc9PiRiWydmcyddWydzdm9yaXNfZGVrbGFydW90YXNfZyddXSxbJ2lkJz0+JGJbJ2ZzJ11bJ2lkJ11dKTsgJHJbJ2F0c3RhdHl0YSddPTE7IH0gfQogIG91dDogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-084542';
const GKEY='ps_s1824o3';
const PHASES=["1"];
const OUT='analize/s1824_o3a.json';
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
