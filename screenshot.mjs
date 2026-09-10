process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggYXog4oCUIFNGIHNhc2tfMTMgMjYwOTA5IOKGkiBBViBwYXJ0aWpvcyAoMTMgcHJla2nFsywga2lla2lzL2dhbGlvamEvc2F2aWthaW5hKSBwZXIgUGV0c2hvcF9QYXJ0aWpvczo6cHJpaW10aSgpLiBEUlkgLyBBIC8gVi4gSnVvZHJhxaHEjWlhaSBORVBBU0tFTEJJQU1JLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OGF6J10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNjY4YXonXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4Lidwc19wYXJ0aWpvcyc7ICRvPWFycmF5KCd2Jz0+J1MxNjY4IGF6JywnZmF6ZSc9PiRmKTsKICAkUEFTVD0nU0Ygc2Fza18xMyAyNjA5MDknOwogIC8vIHBpZCwgc2t1IHNhcmdhcywga2lla2lzLCBnYWxpb2phLCBzYXZpa2FpbmEgYmUgUFZNCiAgJEQ9YXJyYXkoCiAgIGFycmF5KDEyNTgwLCc4MDA5NDcwMDA1MjM0JywzLCcyMDI4LTAxLTE5Jyw2Ljg3MCksCiAgIGFycmF5KDE3Mzk3LCdNMTQ0MzQnLDI0LCcyMDMwLTA3LTIzJywxLjYzMiksCiAgIGFycmF5KDE5Mjk3LCdITS04MTAyJyw0LCcyMDI4LTAxLTMxJyw2LjMzNSksCiAgIGFycmF5KDE5MjkwLCdITS04MTEzJywyLCcyMDI4LTAxLTAxJyw2LjA0MSksCiAgIGFycmF5KDEyODI1LCdITS04MTIyLTEnLDMsJzIwMjgtMDEtMzAnLDUuMjc4KSwKICAgYXJyYXkoMTI4MjYsJ0hNLTgxMjMtMScsNiwnMjAyOC0wMS0zMScsNi4wMDYpLAogICBhcnJheSgxOTI4MSwnSE0tODEyNCcsMywnMjAyOC0wMS0zMScsNi4zMzUpLAogICBhcnJheSgxOTMwNiwnSE0tODEyNScsMywnMjAyOC0wMS0zMCcsNi41ODApLAogICBhcnJheSgxMjg3MSwnSE0tODEzNS0xJywzLCcyMDI4LTAyLTI5Jyw2LjY0MyksCiAgIGFycmF5KDEyOTU4LCdITS04MTQyLTEnLDQsJzIwMjgtMDMtMDInLDUuMzU1KSwKICAgYXJyYXkoMTI5OTgsJ0hNLTgxNDYtMScsMywnMjAyNy0wMy0yNCcsNC4yNzApLAogICBhcnJheSgxMjk5OSwnSE0tODE0OS0xJyw0LCcyMDI4LTAzLTAyJyw1Ljk5MiksCiAgIGFycmF5KDE0MzYzLCdITS04MTc3LTEnLDMsJzIwMjctMDctMTEnLDMuOTk3KSk7CiAgdHJ5ewogICRvWydwMTYyNDgnXT1nZXRfcG9zdF9zdGF0dXMoMTYyNDgpOwogICRrbGFpZG9zPWFycmF5KCk7ICRlaWw9YXJyYXkoKTsKICBmb3JlYWNoKCREIGFzICR4KXsgbGlzdCgkcGlkLCRzYXJnLCRrLCRnLCRzKT0keDsKICAgICRza3U9KHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpOyAkZWFuPShzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfZWFuJyx0cnVlKTsgJGd1PShzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsdHJ1ZSk7CiAgICBpZighaW5fYXJyYXkoJHNhcmcsYXJyYXkoJHNrdSwkZWFuLCRndSksdHJ1ZSkpICRrbGFpZG9zW109YXJyYXkoJHBpZCwic2FyZ2FzICRzYXJnIOKJoCBza3UgJHNrdSAvIGVhbiAkZWFuLyRndSIpOwogICAgaWYoZ2V0X3Bvc3RfdHlwZSgkcGlkKSE9PSdwcm9kdWN0JykgJGtsYWlkb3NbXT1hcnJheSgkcGlkLCduZSBwcm9kdWN0Jyk7CiAgICAkamF1PShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIHBhc3RhYmEgTElLRSAlcyBBTkQgYXRzYXVrdGE9MCIsJHBpZCwnJScuJHdwZGItPmVzY19saWtlKCRQQVNUKS4nJScpKTsKICAgIGlmKCRqYXUgJiYgJGYhPT0nVicpICRrbGFpZG9zW109YXJyYXkoJHBpZCwnamF1IGltcG9ydHVvdGEnKTsKICAgICRlaWxbJHBpZF09YXJyYXkoJ3N0Jz0+Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpLCdzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLCdsYXVrYXMnPT5QZXRzaG9wX1BhcnRpam9zOjphdl9sYXVrYXMoJHBpZCksJ2F2X3ByaWVzJz0+UGV0c2hvcF9QYXJ0aWpvczo6YXZfbGlrdXRpcygkcGlkKSwna2lla2lzJz0+JGssJ2phdSc9PiRqYXUpOwogIH0KICAkb1sna2xhaWRvcyddPSRrbGFpZG9zOwogIGlmKCRmPT09J0EnKXsKICAgIGlmKCRrbGFpZG9zKXsgJG9bJ3JleiddPSdTVE9QOiBzYXJnYWknOyB3cF9zZW5kX2pzb24oJG8pOyB9CiAgICBmb3JlYWNoKCREIGFzICR4KXsgbGlzdCgkcGlkLCRzYXJnLCRrLCRnLCRzKT0keDsKICAgICAgJHI9UGV0c2hvcF9QYXJ0aWpvczo6cHJpaW10aSgkcGlkLGFycmF5KCdraWVraXMnPT4kaywnc2F2aWthaW5hJz0+JHMsJ2dlcmlhdXNpYV9pa2knPT4kZywndGlla2VqYXMnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwncGFzdGFiYSc9PiRQQVNULicgKFMxNjY4KScpKTsKICAgICAgJGVpbFskcGlkXVsncmV6J109aXNfd3BfZXJyb3IoJHIpPydLTEFJREEgJy4kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKToncGFydGlqYSAjJy4kclsncGFydGlqb3NfaWQnXTsgfQogIH0KICBpZigkZj09PSdWJyl7IGZvcmVhY2goJEQgYXMgJHgpeyAkcGlkPSR4WzBdOwogICAgICAkZWlsWyRwaWRdWydhdl9kYWJhciddPVBldHNob3BfUGFydGlqb3M6OmF2X2xpa3V0aXMoJHBpZCk7ICRlaWxbJHBpZF1bJ2Nvc3QnXT1nZXRfcG9zdF9tZXRhKCRwaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsKICAgICAgJGVpbFskcGlkXVsncGFydCddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsa2lla2lzX2xpa28sc2F2aWthaW5hX2V1cixnZXJpYXVzaWFfaWtpIEZST00gJFAgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgcGFzdGFiYSBMSUtFICVzIEFORCBhdHNhdWt0YT0wIiwkcGlkLCclJy4kd3BkYi0+ZXNjX2xpa2UoJFBBU1QpLiclJyksQVJSQVlfQSk7CiAgICAgICRlaWxbJHBpZF1bJ3JlZ19hdiddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc3RvY2tfcXR5IEZST00geyR3cGRiLT5wcmVmaXh9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBzb3VyY2U9J2F2JyIsJHBpZCkpOyB9IH0KICAkb1snZWlsJ109JGVpbDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-142059';
const GKEY='ps_s1668az';
const PHASES=["A", "V"];
const OUT='analize/s1668_az_a.json';
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
