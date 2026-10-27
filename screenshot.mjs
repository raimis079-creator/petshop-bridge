process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAzYSByZWNvbiDigJQgS2F0cmluZXgsIMW+dXbFsy92xJfFvmxpxbMga2F0ZWdvcmlqb3MgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTgwMyddKT8kX0dFVFsncHNfczE4MDMnXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTgwM2EnKTsKICAkb1snYnJhbmRfa2F0cmluZXgnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnRlcm1faWQsdC5uYW1lLHQuc2x1Zyx0dC5jb3VudCBGUk9NIHskcH10ZXJtcyB0IEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEFORCB0Lm5hbWUgTElLRSAnJWthdHJpbmV4JSciLEFSUkFZX0EpOwogICRvWydrYXQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnRlcm1faWQsdC5uYW1lLHQuc2x1Zyx0dC5wYXJlbnQsdHQuY291bnQgRlJPTSB7JHB9dGVybXMgdCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EICh0Lm5hbWUgTElLRSAnJcW+dXYlJyBPUiB0Lm5hbWUgTElLRSAnJXbEl8W+bCUnIE9SIHQubmFtZSBMSUtFICclYWt2YXIlJyBPUiB0Lm5hbWUgTElLRSAnJXJvcGwlJyBPUiB0Lm5hbWUgTElLRSAnJXRlcmFyJScpIE9SREVSIEJZIHR0LnBhcmVudCx0Lm5hbWUiLEFSUkFZX0EpOwogICRvWydrYXRyaW5leF9wcmVrZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF90aXRsZSxwLnBvc3Rfc3RhdHVzLHNrdS5tZXRhX3ZhbHVlIHNrdSxlYW4ubWV0YV92YWx1ZSBlYW4scHIubWV0YV92YWx1ZSBrYWluYSxjcC5tZXRhX3ZhbHVlIGNvc3Qsc2QubWV0YV92YWx1ZSBzYW5kIEZST00geyRwfXBvc3RzIHAgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBza3UgT04gc2t1LnBvc3RfaWQ9cC5JRCBBTkQgc2t1Lm1ldGFfa2V5PSdfc2t1JyBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIGVhbiBPTiBlYW4ucG9zdF9pZD1wLklEIEFORCBlYW4ubWV0YV9rZXk9J19nbG9iYWxfdW5pcXVlX2lkJyBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIHByIE9OIHByLnBvc3RfaWQ9cC5JRCBBTkQgcHIubWV0YV9rZXk9J19wcmljZScgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBjcCBPTiBjcC5wb3N0X2lkPXAuSUQgQU5EIGNwLm1ldGFfa2V5PSdfY29zdF9wcmljZScgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBzZCBPTiBzZC5wb3N0X2lkPXAuSUQgQU5EIHNkLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgKHAucG9zdF90aXRsZSBMSUtFICcla2F0cmluZXglJyBPUiBlYW4ubWV0YV92YWx1ZSBMSUtFICc1OTAyMDAzJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyVnYW1tYXJ1cyUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclZGFmbmklJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJWtyaWwlJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJW15c2lzJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyVzdGludCUnKSIsQVJSQVlfQSk7CiAgLy8gxb51dsWzIGthdGVnb3Jpam9zIHByZWtpxbMgcGF2eXpkeXMgKHN0aWxpdXMsIGF0cmlidXRhaSwgc2FuZMSXbGlzKQogIGZvcmVhY2goJG9bJ2thdCddIGFzICRrKXsgaWYoJGtbJ2NvdW50J10+MCl7ICRpZHM9Z2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ251bWJlcnBvc3RzJz0+MywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3RheF9xdWVyeSc9PmFycmF5KGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PiRrWyd0ZXJtX2lkJ10pKSwnZmllbGRzJz0+J2lkcycpKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJG9bJ3B2eiddWyRrWyduYW1lJ11dW109YXJyYXkoJ2lkJz0+JGlkLCd0Jz0+JHByLT5nZXRfbmFtZSgpLCdza3UnPT4kcHItPmdldF9za3UoKSwna2FpbmEnPT4kcHItPmdldF9wcmljZSgpLCdjb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSwnc2FuZCc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLCdicmFuZCc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSwnYXR0cnMnPT5hcnJheV9rZXlzKCRwci0+Z2V0X2F0dHJpYnV0ZXMoKSksJ2Rlc2NfbGVuJz0+c3RybGVuKCRwci0+Z2V0X2Rlc2NyaXB0aW9uKCkpLCdzaG9ydCc9Pm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkcHItPmdldF9zaG9ydF9kZXNjcmlwdGlvbigpKSwwLDIwMCkpOyB9IH0gfQogICRvWydzYW5kZWxpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIHNhbmQsQ09VTlQoKikgbiBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBHUk9VUCBCWSBtZXRhX3ZhbHVlIixBUlJBWV9BKTsKICAkb1snc291cmNlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSxDT1VOVCgqKSBuIEZST00geyRwfXBzX3NvdXJjZXMgR1JPVVAgQlkgc291cmNlIixBUlJBWV9BKTsKICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-092306';
const GKEY='ps_s1803';
const PHASES=["GO"];
const OUT='analize/s1803_a.json';
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
