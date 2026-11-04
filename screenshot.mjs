process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI3aiBmYWt0dSBwYXRhaXNhIERQIHNhdmlrYWluYSAoRCBkcnksIDQgdnlrZHl0aSwgOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyN2onXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7ICRGPSRfR0VUWydwc19zMTgyN2onXTsgJHI9Wyd2Jz0+J1MxODI3aicsJ0YnPT4kRl07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICAkRT0ieyRQfXBzX2Zha3RfZWlsdXRlcyI7ICRVPSJ7JFB9cHNfZmFrdF91enNha3ltYWkiOwogICRpaWRzPVsxODAzLDI5MTIsMzUyMCwzNTQwLDM1ODYsMzc0OSwzNzUwLDQzMzUsNDUzOSw0ODI4XTsgJGluPWltcGxvZGUoJywnLCRpaWRzKTsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgdXpzYWt5bWFzX2lkLCBlaWx1dGVzX2lkLCBwcmVrZV9pZCwga2lla2lzLCBzYXZpa2FpbmFfdm50X2N0LCBzYXZpa2FpbmFfY3QsIHNhdmlrYWlub3Nfc2FsdGluaXMgRlJPTSAkRSBXSEVSRSBlaWx1dGVzX2lkIElOKCRpbikiLEFSUkFZX0EpOwogICRyWydlaWwnXT0kcm93czsKICBpZigkRj09PSdEJ3x8JEY9PT0nNCcpeyAkZGVsdGE9W107ICR1cGQ9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJHY9d2NfZ2V0X29yZGVyX2l0ZW1fbWV0YSgoaW50KSR4WydlaWx1dGVzX2lkJ10sJ19wc19zYXZpa2FpbmFfdm50Jyx0cnVlKTsgJHZjdD0oaW50KXJvdW5kKChmbG9hdCkkdioxMDApOyBpZigkdmN0PD0wKSBjb250aW51ZTsgaWYoKGludCkkeFsnc2F2aWthaW5hX2N0J10+MCkgY29udGludWU7CiAgICAgICRzPSR2Y3QqKGludCkkeFsna2lla2lzJ107ICR1cGRbXT1bJHhbJ2lkJ10sJHZjdCwkc107ICRkZWx0YVsoaW50KSR4Wyd1enNha3ltYXNfaWQnXV09KCRkZWx0YVsoaW50KSR4Wyd1enNha3ltYXNfaWQnXV0/PzApKyRzOyB9CiAgICAkclsndXBkJ109JHVwZDsgJHJbJ2RlbHRhJ109JGRlbHRhOyAkclsnZGVsdGFfdmlzbyddPWFycmF5X3N1bSgkZGVsdGEpOwogICAgaWYoJEY9PT0nNCcpeyAkYmFrPVsnZWlsJz0+JHJvd3MsJ3V6cyc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hc19pZCxzYXZpa2FpbmFfY3QsbWFyemFfY3Qsa29udHJpYnVjaWphX2N0IEZST00gJFUgV0hFUkUgdXpzYWt5bWFzX2lkIElOKCIuaW1wbG9kZSgnLCcsYXJyYXlfa2V5cygkZGVsdGEpPzpbMF0pLiIpIixBUlJBWV9BKV07CiAgICAgIGlmKCFnZXRfb3B0aW9uKCdwc19zMTgyN19mYWt0X2JhaycpKSB1cGRhdGVfb3B0aW9uKCdwc19zMTgyN19mYWt0X2JhaycsJGJhayxmYWxzZSk7CiAgICAgIGZvcmVhY2goJHVwZCBhcyAkdSl7ICR3cGRiLT51cGRhdGUoJEUsWydzYXZpa2FpbmFfdm50X2N0Jz0+JHVbMV0sJ3NhdmlrYWluYV9jdCc9PiR1WzJdLCdzYXZpa2Fpbm9zX3NhbHRpbmlzJz0+J2RwX2JhemVfczE4MjcnXSxbJ2lkJz0+JHVbMF1dKTsgfQogICAgICBmb3JlYWNoKCRkZWx0YSBhcyAkb2lkPT4kZCl7ICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFICRVIFNFVCBzYXZpa2FpbmFfY3Q9c2F2aWthaW5hX2N0KyVkLCBtYXJ6YV9jdD1tYXJ6YV9jdC0lZCwga29udHJpYnVjaWphX2N0PWtvbnRyaWJ1Y2lqYV9jdC0lZCBXSEVSRSB1enNha3ltYXNfaWQ9JWQiLCRkLCRkLCRkLCRvaWQpKTsgfQogICAgICAkclsncG8nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1enNha3ltYXNfaWQsc2F2aWthaW5hX2N0LG1hcnphX2N0LGtvbnRyaWJ1Y2lqYV9jdCBGUk9NICRVIFdIRVJFIHV6c2FreW1hc19pZCBJTigiLmltcGxvZGUoJywnLGFycmF5X2tleXMoJGRlbHRhKT86WzBdKS4iKSIsQVJSQVlfQSk7CiAgICAgICRyWydrb250cm9sZSddPVtdOyBmb3JlYWNoKGFycmF5X2tleXMoJGRlbHRhKSBhcyAkb2lkKXsgJGs9UGV0c2hvcF9GYWt0YWk6OmtvbnRyb2xlKCRvaWQpOyAkclsna29udHJvbGUnXVskb2lkXT0ka1snbWFyemFfcGVyc2thaWNpdW90YSddPz8kazsgfQogICAgICAkclsnc3BhbGlzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBST1VORChTVU0oc2F2aWthaW5hX2N0KS8xMDAsMikgc2F2LCBST1VORChTVU0obWFyemFfY3QpLzEwMCwyKSBtYXJ6YSwgUk9VTkQoU1VNKGtvbnRyaWJ1Y2lqYV9jdCkvMTAwLDIpIGtvbnRyIEZST00gJFUgV0hFUkUgdGVzdGluaXM9MCBBTkQgc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgQU5EIHN1a3VydGFfYXQ+PScyMDI2LTEwLTAxJyBBTkQgc3VrdXJ0YV9hdDwnMjAyNi0xMS0wMSciLEFSUkFZX0EpOyB9CiAgfSBlbHNlaWYoJEY9PT0nOScpeyAkYmFrPWdldF9vcHRpb24oJ3BzX3MxODI3X2Zha3RfYmFrJyk7IGZvcmVhY2goKGFycmF5KSgkYmFrWydlaWwnXT8/W10pIGFzICR4KXsgJHdwZGItPnVwZGF0ZSgkRSxbJ3NhdmlrYWluYV92bnRfY3QnPT4keFsnc2F2aWthaW5hX3ZudF9jdCddLCdzYXZpa2FpbmFfY3QnPT4keFsnc2F2aWthaW5hX2N0J10sJ3NhdmlrYWlub3Nfc2FsdGluaXMnPT4keFsnc2F2aWthaW5vc19zYWx0aW5pcyddXSxbJ2lkJz0+JHhbJ2lkJ11dKTsgfSBmb3JlYWNoKChhcnJheSkoJGJha1sndXpzJ10/P1tdKSBhcyAkeCl7ICR3cGRiLT51cGRhdGUoJFUsWydzYXZpa2FpbmFfY3QnPT4keFsnc2F2aWthaW5hX2N0J10sJ21hcnphX2N0Jz0+JHhbJ21hcnphX2N0J10sJ2tvbnRyaWJ1Y2lqYV9jdCc9PiR4Wydrb250cmlidWNpamFfY3QnXV0sWyd1enNha3ltYXNfaWQnPT4keFsndXpzYWt5bWFzX2lkJ11dKTsgfSAkclsnYXRzdGF0eXRhJ109MTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0sIDEpOwo=';
const VER='dep-210225';
const GKEY='ps_s1827j';
const PHASES=["D"];
const OUT='analize/s1827_jD.json';
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
