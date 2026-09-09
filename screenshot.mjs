process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjgxIHpiIHZmIHNhdmlrYWlub3MgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibDcnXSk/JF9HRVRbJ3BzX2JsNyddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODEnLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOyAkdHA9JHdwZGItPnByZWZpeC4ncHNfcGFydGlqb3MnOwogIHRyeXsKICAgICRzcWw9IlNFTEVDVCBwLklELCBDQVNUKHBtLm1ldGFfdmFsdWUgQVMgU0lHTkVEKSBzdG9jaywKICAgICAgICAgICAgICAgICBDT0FMRVNDRShTVU0oQ0FTRSBXSEVOIHQuYXRzYXVrdGE9MCBPUiB0LmF0c2F1a3RhIElTIE5VTEwgVEhFTiB0LmtpZWtpc19saWtvIEVMU0UgMCBFTkQpLDApIHBhcnRpam9zZQogICAgICAgICAgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICAgICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtIE9OIHBtLnBvc3RfaWQ9cC5JRCBBTkQgcG0ubWV0YV9rZXk9J19zdG9jaycKICAgICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc2QgT04gc2QucG9zdF9pZD1wLklEIEFORCBzZC5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgc2QubWV0YV92YWx1ZT0nYXYnCiAgICAgICAgICBMRUZUIEpPSU4gYCR0cGAgdCBPTiB0LnByb2R1Y3RfaWQ9cC5JRAogICAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICAgICAgR1JPVVAgQlkgcC5JRCwgcG0ubWV0YV92YWx1ZSBIQVZJTkcgc3RvY2sgPiBwYXJ0aWpvc2UiOwogICAgJHI9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7CiAgICAkb1sndmlzbyddPWNvdW50KCRyKTsKICAgICRzdD1hcnJheSgndHVyaV92Zl9jb3N0Jz0+MCwndHVyaV96Yl9jb3N0Jz0+MCwndHVyaV9iZXRfa3VyaV90aWVrZWpvJz0+MCwndGlrX2Nvc3RfcHJpY2UnPT4wLAogICAgICAgICAgICAgICd0dXJpX3ZmX3F0eSc9PjAsJ3R1cmlfemJfcXR5Jz0+MCk7CiAgICAkc2tpcnQ9YXJyYXkoKTsgJHZpZW5vZGk9MDsgJHRpa19rb3J0ZWxlPWFycmF5KCk7ICR2bnRUaWVrPTA7ICR2bnRLb3J0PTA7CiAgICBmb3JlYWNoKCRyIGFzICR4KXsKICAgICAgJGlkPShpbnQpJHhbJ0lEJ107ICR0cj0oaW50KSR4WydzdG9jayddLShpbnQpJHhbJ3BhcnRpam9zZSddOwogICAgICAkY3A9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsgJGNwPSgkY3AhPT0nJyYmKGZsb2F0KSRjcD4wKT8oZmxvYXQpJGNwOm51bGw7CiAgICAgICR2Zj1nZXRfcG9zdF9tZXRhKCRpZCwnX3ZmX2Nvc3QnLHRydWUpOyAgICR2Zj0oJHZmIT09JycmJihmbG9hdCkkdmY+MCk/KGZsb2F0KSR2ZjpudWxsOwogICAgICAkemI9Z2V0X3Bvc3RfbWV0YSgkaWQsJ196Yl9jb3N0Jyx0cnVlKTsgICAkemI9KCR6YiE9PScnJiYoZmxvYXQpJHpiPjApPyhmbG9hdCkkemI6bnVsbDsKICAgICAgJHZxPWdldF9wb3N0X21ldGEoJGlkLCdfdmZfcXR5Jyx0cnVlKTsgJHpxPWdldF9wb3N0X21ldGEoJGlkLCdfemJfcXR5Jyx0cnVlKTsKICAgICAgaWYoJHZmIT09bnVsbCkgJHN0Wyd0dXJpX3ZmX2Nvc3QnXSsrOwogICAgICBpZigkemIhPT1udWxsKSAkc3RbJ3R1cmlfemJfY29zdCddKys7CiAgICAgIGlmKCR2cSE9PScnICYmICR2cSE9PW51bGwpICRzdFsndHVyaV92Zl9xdHknXSsrOwogICAgICBpZigkenEhPT0nJyAmJiAkenEhPT1udWxsKSAkc3RbJ3R1cmlfemJfcXR5J10rKzsKICAgICAgJHRpZWsgPSAkdmYhPT1udWxsID8gJHZmIDogKCR6YiE9PW51bGwgPyAkemIgOiBudWxsKTsKICAgICAgaWYoJHRpZWshPT1udWxsKXsgJHN0Wyd0dXJpX2JldF9rdXJpX3RpZWtlam8nXSsrOyAkdm50VGllays9JHRyOwogICAgICAgIGlmKCRjcCE9PW51bGwpewogICAgICAgICAgJGQ9cm91bmQoJHRpZWstJGNwLDQpOwogICAgICAgICAgaWYoYWJzKCRkKTwwLjAwNSkgJHZpZW5vZGkrKzsKICAgICAgICAgIGVsc2UgaWYoY291bnQoJHNraXJ0KTwxNSkgJHNraXJ0W109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5zdWJzdHIoZ2V0X3RoZV90aXRsZSgkaWQpLDAsMzQpLCdrb3J0ZWxlJz0+JGNwLCd0aWVrZWpvJz0+JHRpZWssJ2lzJz0+JHZmIT09bnVsbD8ndmYnOid6YicsJ3NraXJ0dW1hcyc9PiRkLCd0cnVrc3RhJz0+JHRyKTsKICAgICAgICB9CiAgICAgIH0gZWxzZSB7ICRzdFsndGlrX2Nvc3RfcHJpY2UnXSsrOyAkdm50S29ydCs9JHRyOwogICAgICAgIGlmKGNvdW50KCR0aWtfa29ydGVsZSk8MTApICR0aWtfa29ydGVsZVtdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+c3Vic3RyKGdldF90aGVfdGl0bGUoJGlkKSwwLDM0KSwna29ydGVsZSc9PiRjcCwndHJ1a3N0YSc9PiR0cik7IH0KICAgIH0KICAgICRvWydzdGF0aXN0aWthJ109JHN0OwogICAgJG9bJ3ZpZW5vZG9zX3NhdmlrYWlub3MnXT0kdmllbm9kaTsKICAgICRvWydza2lyaWFzaV9wdnonXT0kc2tpcnQ7CiAgICAkb1sndGlrX2tvcnRlbGVfcHZ6J109JHRpa19rb3J0ZWxlOwogICAgJG9bJ3ZudCddPWFycmF5KCdpc190aWVrZWpvJz0+JHZudFRpZWssJ2lzX2tvcnRlbGVzJz0+JHZudEtvcnQpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-085424';
const GKEY='ps_bl7';
const PHASES=["R"];
const OUT='analize/s1681_r.json';
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
