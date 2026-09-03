process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDcgcnVuMjAg4oCUIOKAnkF1dG/igJwgcGVyIHRpa3LEhSBudW9yb2TEhSBpxaEgc8SFcmHFoW8gKHRlc3R1b3RvamFzKSArIHBhdGlrcmEgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7IGlmICghaXNzZXQoJF9HRVRbJ3BzX2RseiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd0ZW1wX2lzdHJpbnRhJz0+JHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIikpOwogICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7ICR1aWQ9JHUtPklEOyAkZXhwPXRpbWUoKSszNjAwOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkY2s9YXJyYXkoU0VDVVJFX0FVVEhfQ09PS0lFPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ3NlY3VyZV9hdXRoJywkdG9rKSxBVVRIX0NPT0tJRT0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdhdXRoJywkdG9rKSxMT0dHRURfSU5fQ09PS0lFPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvaykpOwogICRjcz1hcnJheSgpOyBmb3JlYWNoKCRjayBhcyAkaz0+JHYpICRjc1tdPW5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PiRrLCd2YWx1ZSc9PiR2KSk7ICRfQ09PS0lFW0xPR0dFRF9JTl9DT09LSUVdPSRja1tMT0dHRURfSU5fQ09PS0lFXTsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdWlkKTsKICAkcj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzayZlaWxlPW5hdWppJyksYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogIGlmKHByZWdfbWF0Y2goJy9kYXRhLWlkPSIzNTQ0MyIuKj88YSBjbGFzcz0idiIgaHJlZj0iKFteIl0qdj1ydXNpdW90aVteIl0qKSJbXj5dKj5BdXRvPFwvYT4vcycsJGIsJG0pKXsgJHVybD1odG1sX2VudGl0eV9kZWNvZGUoJG1bMV0pOyAkb1snYXV0b191cmwnXT1zdWJzdHIoJHVybCwwLDEyMCk7ICRyMj13cF9yZW1vdGVfZ2V0KCR1cmwsYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOyAkbG9jPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIyLCdsb2NhdGlvbicpOyBwYXJzZV9zdHIocGFyc2VfdXJsKCRsb2MsUEhQX1VSTF9RVUVSWSksJHEpOyAkb1sncG8nXT1hcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyMiksJ3BkX29rJz0+JHFbJ3BkX29rJ10/PycnLCdwZF9ucic9PnJhd3VybGRlY29kZSgkcVsncGRfbnInXT8/JycpLCdlaWxlJz0+JHFbJ2VpbGUnXT8/JycpOyB9IGVsc2UgJG9bJ2F1dG9fdXJsJ109J25lcmFzdGEnOwogIHdwX2NhY2hlX2ZsdXNoKCk7ICRyZj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ2Zha3RhaScpOyAkcmYtPnNldEFjY2Vzc2libGUodHJ1ZSk7ICR4PSRyZi0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKDM1NDQzKSxhcnJheSgpKTsgJG9bJzM1NDQzJ109YXJyYXkoJ3J1cyc9PiR4WydydXMnXSwnZWlsZXMnPT5pbXBsb2RlKCcsJywkeFsnZWlsZXMnXSksJ2J0bic9PiR4WydidG4nXVswXSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-122239';
const GKEY='ps_dlz';
const PHASES=["T"];
const OUT='analize/e2_run20.json';
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
