process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjgwIHNhdmlrYWlub3MgdjIgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibDYnXSk/JF9HRVRbJ3BzX2JsNiddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODBiJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsgJHRwPSR3cGRiLT5wcmVmaXguJ3BzX3BhcnRpam9zJzsKICB0cnl7CiAgICAkc3FsPSJTRUxFQ1QgcC5JRCwgQ0FTVChwbS5tZXRhX3ZhbHVlIEFTIFNJR05FRCkgc3RvY2ssCiAgICAgICAgICAgICAgICAgQ09BTEVTQ0UoU1VNKENBU0UgV0hFTiB0LmF0c2F1a3RhPTAgT1IgdC5hdHNhdWt0YSBJUyBOVUxMIFRIRU4gdC5raWVraXNfbGlrbyBFTFNFIDAgRU5EKSwwKSBwYXJ0aWpvc2UKICAgICAgICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwbSBPTiBwbS5wb3N0X2lkPXAuSUQgQU5EIHBtLm1ldGFfa2V5PSdfc3RvY2snCiAgICAgICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNkIE9OIHNkLnBvc3RfaWQ9cC5JRCBBTkQgc2QubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHNkLm1ldGFfdmFsdWU9J2F2JwogICAgICAgICAgTEVGVCBKT0lOIGAkdHBgIHQgT04gdC5wcm9kdWN0X2lkPXAuSUQKICAgICAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICAgICAgIEdST1VQIEJZIHAuSUQsIHBtLm1ldGFfdmFsdWUKICAgICAgICAgIEhBVklORyBzdG9jayA+IHBhcnRpam9zZSI7CiAgICAkcj0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsKICAgICRvWydzcWxfa2xhaWRhJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgICAkb1sndmlzbyddPWNvdW50KCRyKTsKICAgICRzdVNhdj0wOyAkYmVTYXY9YXJyYXkoKTsgJHN1U3RvY2s9MDsgJG51bGluaXM9MDsgJHZudFRydWtzdGE9MDsgJHZudFN1U2F2PTA7ICR2bnRCZVNhdj0wOwogICAgJHB2ej1hcnJheSgpOyAkc2x0PWFycmF5KCdfY29zdF9wcmljZSc9PjAsJ192Zl9jb3N0Jz0+MCwnX3piX2Nvc3QnPT4wKTsKICAgICRrcml0U2s9MDsgJGtyaXRWbnQ9MDsgJGtyaXRTYXI9YXJyYXkoKTsKICAgIGZvcmVhY2goJHIgYXMgJHgpewogICAgICAkaWQ9KGludCkkeFsnSUQnXTsgJHN0PShpbnQpJHhbJ3N0b2NrJ107ICR0cj0kc3QtKGludCkkeFsncGFydGlqb3NlJ107ICR2bnRUcnVrc3RhKz0kdHI7CiAgICAgIGlmKCRzdD4wKSAkc3VTdG9jaysrOyBlbHNlICRudWxpbmlzKys7CiAgICAgICRzYXY9bnVsbDsgJGt1cj0nJzsKICAgICAgZm9yZWFjaChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JykgYXMgJG1rKXsgJHY9Z2V0X3Bvc3RfbWV0YSgkaWQsJG1rLHRydWUpOwogICAgICAgIGlmKCR2IT09JycgJiYgJHYhPT1udWxsICYmIChmbG9hdCkkdj4wKXsgJHNhdj0oZmxvYXQpJHY7ICRrdXI9JG1rOyBicmVhazsgfSB9CiAgICAgIGlmKCRzYXYhPT1udWxsKXsgJHN1U2F2Kys7ICRzbHRbJGt1cl0rKzsgJHZudFN1U2F2Kz1tYXgoMCwkdHIpOwogICAgICAgIGlmKGNvdW50KCRwdnopPDYpICRwdnpbXT1hcnJheSgnaWQnPT4kaWQsJ3Bhdic9PnN1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCwzNiksJ3N0b2NrJz0+JHN0LCd0cnVrc3RhJz0+JHRyLCdzYXZpa2FpbmEnPT4kc2F2LCdpcyc9PiRrdXIpOyB9CiAgICAgIGVsc2UgeyAkdm50QmVTYXYrPW1heCgwLCR0cik7CiAgICAgICAgaWYoY291bnQoJGJlU2F2KTwxMikgJGJlU2F2W109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5zdWJzdHIoZ2V0X3RoZV90aXRsZSgkaWQpLDAsMzYpLCdzdG9jayc9PiRzdCwndHJ1a3N0YSc9PiR0cik7CiAgICAgICAgaWYoJHN0PjApeyAka3JpdFNrKys7ICRrcml0Vm50Kz0kdHI7IGlmKGNvdW50KCRrcml0U2FyKTwxMikgJGtyaXRTYXJbXT1hcnJheSgnaWQnPT4kaWQsJ3Bhdic9PnN1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCwzNiksJ3N0b2NrJz0+JHN0LCd0cnVrc3RhJz0+JHRyKTsgfSB9CiAgICB9CiAgICAkb1snc3Vfc2F2aWthaW5hJ109JHN1U2F2OyAkb1snYmVfc2F2aWthaW5vcyddPWNvdW50KCRyKS0kc3VTYXY7CiAgICAkb1snbGlrdXRpc192aXJzXzAnXT0kc3VTdG9jazsgJG9bJ2xpa3V0aXNfMCddPSRudWxpbmlzOwogICAgJG9bJ3RydWtzdGFfdm50J109YXJyYXkoJ3Zpc28nPT4kdm50VHJ1a3N0YSwnc3Vfc2F2aWthaW5hJz0+JHZudFN1U2F2LCdiZV9zYXZpa2Fpbm9zJz0+JHZudEJlU2F2KTsKICAgICRvWydzYWx0aW5pYWknXT0kc2x0OwogICAgJG9bJ3B2el9zdV9zYXZpa2FpbmEnXT0kcHZ6OwogICAgJG9bJ0tSSVRJTkVTX2xpa3V0aXNfdmlyczBfYmVfc2F2aWthaW5vcyddPWFycmF5KCdzayc9PiRrcml0U2ssJ3ZudCc9PiRrcml0Vm50LCdzYXJhc2FzJz0+JGtyaXRTYXIpOwogICAgJG9bJ2JlX3NhdmlrYWlub3NfcHZ6J109JGJlU2F2OwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-084945';
const GKEY='ps_bl6';
const PHASES=["R"];
const OUT='analize/s1680_b.json';
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
