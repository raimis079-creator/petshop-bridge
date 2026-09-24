process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2bSBzYXVzaSBtYWlzdGFpIGlraSAyMCBrZzoga2FzIGJsb2t1b2phIHBhc3RvbWF0YSByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE2bSddKSkgcmV0dXJuOwogIEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTcxNm0nXTsKICB0cnl7CiAgICAkc3FsPSJTRUxFQ1QgcC5JRCwgTEVGVChwLnBvc3RfdGl0bGUsNTUpIHQsIENBU1Qod3QubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpIGtnLCBzLm1ldGFfdmFsdWUgc2FuZCwgdGsubWV0YV92YWx1ZSB0aWtfa3VyaiwgbC5tZXRhX3ZhbHVlIGwsIHcubWV0YV92YWx1ZSB3LCBoLm1ldGFfdmFsdWUgaCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBKT0lOIHskd3BkYi0+dGVybXN9IHRtIE9OIHRtLnRlcm1faWQ9dHQudGVybV9pZCBBTkQgdG0uc2x1ZyBMSUtFICdzYXVzYXMtbWFpc3RhcyUnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSB3dCBPTiB3dC5wb3N0X2lkPXAuSUQgQU5EIHd0Lm1ldGFfa2V5PSdfd2VpZ2h0JyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdGsgT04gdGsucG9zdF9pZD1wLklEIEFORCB0ay5tZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGwgT04gbC5wb3N0X2lkPXAuSUQgQU5EIGwubWV0YV9rZXk9J19sZW5ndGgnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSB3IE9OIHcucG9zdF9pZD1wLklEIEFORCB3Lm1ldGFfa2V5PSdfd2lkdGgnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBoIE9OIGgucG9zdF9pZD1wLklEIEFORCBoLm1ldGFfa2V5PSdfaGVpZ2h0JyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEdST1VQIEJZIHAuSUQiOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7ICRyWydzYXVzdV9uJ109Y291bnQoJHJvd3MpOwogICAgJGlraTIwPWFycmF5X2ZpbHRlcigkcm93cyxmdW5jdGlvbigkeCl7cmV0dXJuIChmbG9hdCkkeFsna2cnXT4wJiYoZmxvYXQpJHhbJ2tnJ108PTIwO30pOyAkclsnaWtpMjBfbiddPWNvdW50KCRpa2kyMCk7CiAgICAkclsnYmVfc3ZvcmlvJ109Y291bnQoYXJyYXlfZmlsdGVyKCRyb3dzLGZ1bmN0aW9uKCR4KXtyZXR1cm4gKGZsb2F0KSR4WydrZyddPD0wO30pKTsKICAgICRyWyd2aXJzMjAnXT1hcnJheV92YWx1ZXMoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gWyR4WydJRCddLCR4Wyd0J10sJHhbJ2tnJ11dO30sYXJyYXlfZmlsdGVyKCRyb3dzLGZ1bmN0aW9uKCR4KXtyZXR1cm4gKGZsb2F0KSR4WydrZyddPjIwO30pKSk7CiAgICAkclsndmlyczI0OSddPWNvdW50KGFycmF5X2ZpbHRlcigkcm93cyxmdW5jdGlvbigkeCl7cmV0dXJuIChmbG9hdCkkeFsna2cnXT4yNC45O30pKTsKICAgICRkaW1zPWZ1bmN0aW9uKCR4KXsgJGQ9WyhmbG9hdCkkeFsnbCddLChmbG9hdCkkeFsndyddLChmbG9hdCkkeFsnaCddXTsgc29ydCgkZCk7IHJldHVybiAkZFswXT4zOS41fHwkZFsxXT40MXx8JGRbMl0+NjE7IH07CiAgICAkclsnaWtpMjBfYmxva3VvamFfbWF0bWVueXMnXT1jb3VudChhcnJheV9maWx0ZXIoJGlraTIwLCRkaW1zKSk7ICRyWydpa2kyMF9ibG9rdW9qYV9tYXRtZW55c19wYWdhbF9zYW5kZWxpJ109YXJyYXlfY291bnRfdmFsdWVzKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4WydzYW5kJ10/OicobmVyYSknO30sYXJyYXlfZmlsdGVyKCRpa2kyMCwkZGltcykpKTsKICAgICR0az1hcnJheV9maWx0ZXIoJGlraTIwLGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3Rpa19rdXJqJ109PT0neWVzJzt9KTsgJHJbJ2lraTIwX3Rpa19rdXJqZXJpdV9uJ109Y291bnQoJHRrKTsgJHJbJ2lraTIwX3Rpa19rdXJqZXJpdSddPWFycmF5X3ZhbHVlcyhhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBbJHhbJ0lEJ10sJHhbJ3QnXSwkeFsna2cnXSwkeFsnc2FuZCddXTt9LCR0aykpOwogICAgJHJbJ2lraTIwX2FidSddPWNvdW50KGFycmF5X2ZpbHRlcigkaWtpMjAsZnVuY3Rpb24oJHgpIHVzZSgkZGltcyl7cmV0dXJuICR4Wyd0aWtfa3VyaiddPT09J3llcycmJiRkaW1zKCR4KTt9KSk7CiAgICAkclsnaWtpMjBfb2tfZGFiYXInXT1jb3VudChhcnJheV9maWx0ZXIoJGlraTIwLGZ1bmN0aW9uKCR4KSB1c2UoJGRpbXMpe3JldHVybiAkeFsndGlrX2t1cmonXSE9PSd5ZXMnJiYhJGRpbXMoJHgpO30pKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-211052';
const GKEY='ps_s1716m';
const PHASES=["1"];
const OUT='analize/s1716_m1.json';
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
