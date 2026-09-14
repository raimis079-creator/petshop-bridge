process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgdSDigJQgUFZNIDIxICUgdGFyaWZhaSBMViBpciBFRSAoa2FpcCBMVCwgc3Ugc2l1bnRpbXUpLCBWZW5pcGFrIEVFL0xWIGZlZSAzLjU5IOKGkiAyLjk3ICg9My41OSBzdSBQVk0pOyBwYXRpa3JhIExWL0VFL0xULiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4MXUnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY4MSB1Jyk7CiAgJGx0PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskd3BkYi0+cHJlZml4fXdvb2NvbW1lcmNlX3RheF9yYXRlcyBXSEVSRSB0YXhfcmF0ZV9jb3VudHJ5PSdMVCcgQU5EIHRheF9yYXRlX2NsYXNzPScnIExJTUlUIDEiLEFSUkFZX0EpOyAkb1snbHQnXT0kbHQ7CiAgZm9yZWFjaChhcnJheSgnTFYnLCdFRScpIGFzICRjKXsgJGV4PSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdGF4X3JhdGVfaWQgRlJPTSB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV90YXhfcmF0ZXMgV0hFUkUgdGF4X3JhdGVfY291bnRyeT0lcyBBTkQgdGF4X3JhdGVfY2xhc3M9JyciLCRjKSk7CiAgICBpZigkZXgpeyAkb1sndGFyaWZhcyddWyRjXT0namF1IGJ1dm8gIycuJGV4OyBjb250aW51ZTsgfQogICAgJGlkPVdDX1RheDo6X2luc2VydF90YXhfcmF0ZShhcnJheSgndGF4X3JhdGVfY291bnRyeSc9PiRjLCd0YXhfcmF0ZV9zdGF0ZSc9PicnLCd0YXhfcmF0ZSc9PiRsdFsndGF4X3JhdGUnXSwndGF4X3JhdGVfbmFtZSc9PiRsdFsndGF4X3JhdGVfbmFtZSddLCd0YXhfcmF0ZV9wcmlvcml0eSc9PiRsdFsndGF4X3JhdGVfcHJpb3JpdHknXSwndGF4X3JhdGVfY29tcG91bmQnPT4wLCd0YXhfcmF0ZV9zaGlwcGluZyc9PjEsJ3RheF9yYXRlX29yZGVyJz0+KGludCkkbHRbJ3RheF9yYXRlX29yZGVyJ10rMSwndGF4X3JhdGVfY2xhc3MnPT4nJykpOwogICAgJG9bJ3RhcmlmYXMnXVskY109J3N1a3VydGFzICMnLiRpZDsgfQogICRrPSd3b29jb21tZXJjZV9zaG9wdXBfdmVuaXBha19zaGlwcGluZ19waWNrdXBfbWV0aG9kXzVfc2V0dGluZ3MnOyAkcz1nZXRfb3B0aW9uKCRrKTsgJHNbJ2ZlZSddPScyLjk3JzsgdXBkYXRlX29wdGlvbigkaywkcyk7CiAgV0NfQ2FjaGVfSGVscGVyOjpnZXRfdHJhbnNpZW50X3ZlcnNpb24oJ3NoaXBwaW5nJyx0cnVlKTsgd3BfY2FjaGVfZmx1c2goKTsKICAkb1sncmF0ZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0YXhfcmF0ZV9jb3VudHJ5IGMsdGF4X3JhdGUgcix0YXhfcmF0ZV9uYW1lIG4sdGF4X3JhdGVfc2hpcHBpbmcgcyx0YXhfcmF0ZV9jbGFzcyBjbCBGUk9NIHskd3BkYi0+cHJlZml4fXdvb2NvbW1lcmNlX3RheF9yYXRlcyIsQVJSQVlfQSk7CiAgJHBpZD13Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0Jz0+MSwnc3RhdHVzJz0+J3B1Ymxpc2gnLCdzdG9ja19zdGF0dXMnPT4naW5zdG9jaycsJ3JldHVybic9PidpZHMnLCdvcmRlcmJ5Jz0+J3JhbmQnKSlbMF07CiAgZm9yZWFjaChhcnJheSgnTFYnLCdFRScsJ0xUJykgYXMgJGMpeyBXQygpLT5jdXN0b21lci0+c2V0X2JpbGxpbmdfbG9jYXRpb24oJGMsJycsJ0xWMTAxMCcsJycpOyBXQygpLT5jdXN0b21lci0+c2V0X3NoaXBwaW5nX2xvY2F0aW9uKCRjLCcnLCdMVjEwMTAnLCcnKTsKICAgICRwaz1hcnJheSgnY29udGVudHMnPT5hcnJheSgpLCdjb250ZW50c19jb3N0Jz0+MTAsJ2FwcGxpZWRfY291cG9ucyc9PmFycmF5KCksJ2Rlc3RpbmF0aW9uJz0+YXJyYXkoJ2NvdW50cnknPT4kYywnc3RhdGUnPT4nJywncG9zdGNvZGUnPT4nTFYxMDEwJywnY2l0eSc9PidSaWdhJywnYWRkcmVzcyc9PidhJywnYWRkcmVzc18xJz0+J2EnLCdhZGRyZXNzXzInPT4nJyksJ2NhcnRfc3VidG90YWwnPT4xMCk7CiAgICAkej1XQ19TaGlwcGluZ19ab25lczo6Z2V0X3pvbmVfbWF0Y2hpbmdfcGFja2FnZSgkcGspOyAkcj1hcnJheSgpOwogICAgZm9yZWFjaCgkei0+Z2V0X3NoaXBwaW5nX21ldGhvZHModHJ1ZSkgYXMgJG0peyBpZigkbS0+aWQhPT0nc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfcGlja3VwX21ldGhvZCcpIGNvbnRpbnVlOyAkbS0+cmF0ZXM9YXJyYXkoKTsgJG0tPmNhbGN1bGF0ZV9zaGlwcGluZygkcGspOyBmb3JlYWNoKCRtLT5yYXRlcyBhcyAkcnQpICRyW109YXJyYXkoJ2Nvc3QnPT4kcnQtPmdldF9jb3N0KCksJ3RheCc9PnJvdW5kKGFycmF5X3N1bSgkcnQtPmdldF90YXhlcygpKSwzKSwndmlzbyc9PnJvdW5kKCRydC0+Z2V0X2Nvc3QoKSthcnJheV9zdW0oJHJ0LT5nZXRfdGF4ZXMoKSksMikpOyB9CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7ICRvWyd0ZXN0J11bJGNdPWFycmF5KCdwYXN0Jz0+JHIsJ3ByZWtlJz0+JHByLT5nZXRfbmFtZSgpLCdzdV9wdm0nPT53Y19nZXRfcHJpY2VfaW5jbHVkaW5nX3RheCgkcHIpLCdiZV9wdm0nPT5yb3VuZCh3Y19nZXRfcHJpY2VfZXhjbHVkaW5nX3RheCgkcHIpLDIpKTsgfQogICRvWydlJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-115454';
const GKEY='ps_s1681u';
const PHASES=["A"];
const OUT='analize/s1681_u.json';
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
