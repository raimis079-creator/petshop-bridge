process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3byBkZXppdSBla29ub21pa2EgKHJlYWQtb25seSkgKyAxID0ga2Vpc3RpIDM3MzY3IGRvdmFuYXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3byddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTgwN28nXTsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODA3byddOwogIGlmKCRGPT09JzEnKXsgdXBkYXRlX3Bvc3RfbWV0YSgzNzM2NywnX3BzX2xhdWthc19kb3Zhbm9zJyx3cF9qc29uX2VuY29kZShbMjA0MzcsMjA0MjQsMjA0MzJdKSk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoMzczNjcpOyAkclsnMzczNjdfZG92J109Z2V0X3Bvc3RfbWV0YSgzNzM2NywnX3BzX2xhdWthc19kb3Zhbm9zJyx0cnVlKTsgfQogICRzYXY9ZnVuY3Rpb24oJHBpZCkgdXNlKCR3cGRiLCRQKXsgJHM9c3RydG9sb3dlcigoc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSk7ICRjPW51bGw7CiAgICBpZigkcyE9PSdhdicpeyAkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvc3RfbmV0IEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgc291cmNlIElOKCd2ZicsJ3piJykgQU5EIGlzX2FjdGl2ZT0xIE9SREVSIEJZIHN5bmNlZF9hdCBERVNDIExJTUlUIDEiLCRwaWQpKTsgfQogICAgaWYoJGM9PT1udWxsfHwkYz09PScnKXsgJGM9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfY29zdF9wcmljZScsdHJ1ZSk7IH0KICAgIGlmKCRjPT09bnVsbHx8JGM9PT0nJyl7ICRjPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc2F2aWthaW5hX2V1ciBGUk9NIHskUH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBzYXZpa2FpbmFfZXVyPjAgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwkcGlkKSk7IH0KICAgIHJldHVybiAoJGM9PT1udWxsfHwkYz09PScnKT9udWxsOihmbG9hdCkkYzsgfTsKICBmb3JlYWNoKFszNzM2NywzNzM2OCwzNDk0MiwzNDk0NCwzNDk0NSwzNDk0NywzNTMwOSwzNTM5MCwzNTc4MSwzNTc4Ml0gYXMgJGxpZCl7ICRraWRzPVBldHNob3BfTGF1a2FpOjprcmVwc3lzKCRsaWQpOyAkcmliYT0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzX2RvdmFub3NfcmliYScsdHJ1ZSk7ICRtPVtdOyAkYmU9MDsKICAgIGZvcmVhY2goJGtpZHMgYXMgJGspeyAkcD13Y19nZXRfcHJvZHVjdCgkayk7IGlmKCEkcHx8ISRwLT5pc19pbl9zdG9jaygpKSBjb250aW51ZTsgJGM9JHNhdigkayk7IGlmKCRjPT09bnVsbCl7JGJlKys7Y29udGludWU7fSAkcHI9KGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsgJG1bXT1bJ2thaW5hJz0+JHByLCdtYXJ6YSc9PiRwci8xLjIxLSRjLCdwY3QnPT4oJHByLzEuMjEtJGMpLygkcHIvMS4yMSldOyB9CiAgICAkdmlkX3BjdD0kbT9hcnJheV9zdW0oYXJyYXlfY29sdW1uKCRtLCdwY3QnKSkvY291bnQoJG0pOjA7ICR2aWRfa2FpbmE9JG0/YXJyYXlfc3VtKGFycmF5X2NvbHVtbigkbSwna2FpbmEnKSkvY291bnQoJG0pOjA7CiAgICAkZG92PWpzb25fZGVjb2RlKChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzX2RvdmFub3MnLHRydWUpLHRydWUpOyAkZGM9W107IGZvcmVhY2goKGFycmF5KSRkb3YgYXMgJGcpeyAkZ3A9d2NfZ2V0X3Byb2R1Y3QoJGcpOyAkYz0kc2F2KCRnKTsgJGRjW109W21iX3N1YnN0cigkZ3A/JGdwLT5nZXRfbmFtZSgpOicjJy4kZywwLDMwKSwkZ3A/KGZsb2F0KSRncC0+Z2V0X3ByaWNlKCk6bnVsbCwkY107IH0KICAgICRkb3ZtYXg9bWF4KGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIChmbG9hdCkkeFsyXTt9LCRkYz86W1swLDAsMF1dKSk7CiAgICAka29udHI9JHJpYmE+MD8oJHJpYmEvMS4yMSkqJHZpZF9wY3Q6MDsgJHByaXN0PSRyaWJhPjA/KCRyaWJhPDMwPzAuNjg6LTEuMTApOjA7ICRrb3J0PSRyaWJhKjAuMDE1OwogICAgJHJbJ2RlemVzJ11bJGxpZF09WydwYXYnPT5nZXRfdGhlX3RpdGxlKCRsaWQpLCdyaWJhJz0+JHJpYmEsJ3ByZWtpdSc9PmNvdW50KCRtKSwnYmVfc2F2aWthaW5vcyc9PiRiZSwndmlkX2thaW5hJz0+cm91bmQoJHZpZF9rYWluYSwyKSwndmlkX21hcnphX3BjdCc9PnJvdW5kKCR2aWRfcGN0KjEwMCwxKSwndm50X2lraV9yaWJvcyc9PiR2aWRfa2FpbmE+MD9jZWlsKCRyaWJhLyR2aWRfa2FpbmEpOm51bGwsJ2tvbnRyX3ByaWVfcmlib3MnPT5yb3VuZCgka29udHIsMiksJ2RvdmFub3MnPT4kZGMsJ2Rvdl9icmFuZ2lhdXNpYSc9PnJvdW5kKCRkb3ZtYXgsMiksJ2xpZWthX2Jsb2dpYXVzaXUnPT5yb3VuZCgka29udHItJGRvdm1heCskcHJpc3QtJGtvcnQsMiksJ2xpZWthX2JlX2RvdmFub3MnPT5yb3VuZCgka29udHIrJHByaXN0LSRrb3J0LDIpXTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwxKTsK';
const VER='dep-095545';
const GKEY='ps_s1807o';
const PHASES=["1"];
const OUT='analize/s1807_o.json';
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
