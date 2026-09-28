process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzMxbCAjMTIwOCBQVk0gbmF1am9tcyBlaWx1dMSXbXMgKyBmYWt0YWkgKyBwYXN0YWJhICgxIGRyeSAvIDIgdnlrZHl0aSAvIDMgcGF0aWtyYSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzMxbCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTczMWwnXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzMxbCcsJ2ZhemUnPT4kZl07CiAgJE9JRD0zNjU1NTsgJEVJTD1bMjc3NT0+NS4wNCwyNzc2PT4wLjg2XTsgJFRPVEFMPTU3LjE4OwogIHRyeXsKICAgICRvPXdjX2dldF9vcmRlcigkT0lEKTsKICAgICRyaWQ9bnVsbDsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGl0KXsgaWYoaXNzZXQoJEVJTFskaWlkXSkpIGNvbnRpbnVlOyAkdD0kaXQtPmdldF90YXhlcygpOyBpZighZW1wdHkoJHRbJ3RvdGFsJ10pKXsgJHJpZD1hcnJheV9rZXlfZmlyc3QoJHRbJ3RvdGFsJ10pOyBicmVhazsgfSB9CiAgICAkclsncmF0ZV9pZCddPSRyaWQ7IGlmKCEkcmlkKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCduxJdyYSB0YXJpZm8gaWQnKTsKICAgIGlmKCRmPT09JzInKXsKICAgICAgZm9yZWFjaCgkRUlMIGFzICRpaWQ9PiRnKXsgJGl0PSRvLT5nZXRfaXRlbSgkaWlkKTsgaWYoISRpdCkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbsSXcmEgZWlsdXTEl3MgJy4kaWlkKTsgJHRheD1yb3VuZCgkZy0oZmxvYXQpJGl0LT5nZXRfdG90YWwoKSw2KTsgJGl0LT5zZXRfdGF4ZXMoWyd0b3RhbCc9PlskcmlkPT4kdGF4XSwnc3VidG90YWwnPT5bJHJpZD0+JHRheF1dKTsgJGl0LT5zYXZlKCk7IH0KICAgICAgJG89d2NfZ2V0X29yZGVyKCRPSUQpOyAkby0+dXBkYXRlX3RheGVzKCk7ICRvLT5jYWxjdWxhdGVfdG90YWxzKGZhbHNlKTsgJG8tPnNhdmUoKTsKICAgICAgaWYoYWJzKChmbG9hdCkkby0+Z2V0X3RvdGFsKCktJFRPVEFMKT4wLjAwMSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignc3VtYSBwbyBwYXRhaXNvcyAnLiRvLT5nZXRfdG90YWwoKSk7CiAgICAgICRmdF91PVBldHNob3BfRmFrdGFpOjp0X3V6c2FreW1haSgpOyAkZnRfZT1QZXRzaG9wX0Zha3RhaTo6dF9laWx1dGVzKCk7CiAgICAgICR3cGRiLT5kZWxldGUoJGZ0X2UsWyd1enNha3ltYXNfaWQnPT4kT0lEXSk7ICR3cGRiLT5kZWxldGUoJGZ0X3UsWyd1enNha3ltYXNfaWQnPT4kT0lEXSk7CiAgICAgICRvPXdjX2dldF9vcmRlcigkT0lEKTsgJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19mYWt0YXNfaXJhc3l0YXMnKTsgJG8tPnNhdmUoKTsgUGV0c2hvcF9GYWt0YWk6OnJhc3l0aSgkT0lEKTsKICAgICAgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRPSURdKSBhcyAkbil7IGlmKHN0cnBvcygkbi0+Y29udGVudCwnUHJla2nFsyBrZWl0aW1hcyAoUzE3MzEnKSE9PWZhbHNlKXsgJHJbJ3NlbmFfcGFzdGFiYSddPW1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwyMDApOyAkc2VuYXM9JG4tPmNvbnRlbnQ7IHdjX2RlbGV0ZV9vcmRlcl9ub3RlKCRuLT5pZCk7IH0gfQogICAgICAkbz13Y19nZXRfb3JkZXIoJE9JRCk7CiAgICAgIGlmKCFlbXB0eSgkc2VuYXMpKXsgJG5hdWo9cHJlZ19yZXBsYWNlKCcvVcW+c2FreW1vIHN1bWEgbmVwYWtpdG86IFswLTksXSsg4oKsL3UnLCdVxb5zYWt5bW8gc3VtYSBuZXBha2l0bzogJy5udW1iZXJfZm9ybWF0KChmbG9hdCkkby0+Z2V0X3RvdGFsKCksMiwnLCcsJycpLicg4oKsJywkc2VuYXMpOyAkbmF1aj1wcmVnX3JlcGxhY2UoJy8gXHwgxK5TUMSWSklNQUk6IFNVTUEgW14uXSovdScsJycsJG5hdWopOyAkby0+YWRkX29yZGVyX25vdGUoJG5hdWosZmFsc2UsdHJ1ZSk7IH0KICAgIH0KICAgICRvPXdjX2dldF9vcmRlcigkT0lEKTsgJHJbJ3RvdGFsJ109JG8tPmdldF90b3RhbCgpOyAkclsndGF4J109JG8tPmdldF90b3RhbF90YXgoKTsKICAgIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7ICRyWydlaWwnXVskaWlkXT1bJGl0LT5nZXRfbmFtZSgpLCRpdC0+Z2V0X3F1YW50aXR5KCkscm91bmQoKGZsb2F0KSRpdC0+Z2V0X3RvdGFsKCkrKGZsb2F0KSRpdC0+Z2V0X3RvdGFsX3RheCgpLDIpLCRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKSwkaXQtPmdldF9tZXRhKCdfcHNfYXZfcmVkdWNlZF9xdHknKV07IH0KICAgICRyWydmYWt0J109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcmVraXVfc3VtYV9jdCxwdm1fY3Qsdmlzb19jdCxzYXZpa2FpbmFfY3QsbWFyemFfY3Qsa29udHJpYnVjaWphX2N0LGVpbHVjaXVfc2sgRlJPTSAiLlBldHNob3BfRmFrdGFpOjp0X3V6c2FreW1haSgpLiIgV0hFUkUgdXpzYWt5bWFzX2lkPSVkIiwkT0lEKSxBUlJBWV9BKTsKICAgICRyWydwYXN0YWJvcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkeC0+Y29udGVudCksMCw2MDApO30sd2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kT0lELCdvcmRlcic9PidERVNDJywnbGltaXQnPT4zXSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-165206';
const GKEY='ps_s1731l';
const PHASES=["2"];
const OUT='analize/s1731_l2.json';
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
