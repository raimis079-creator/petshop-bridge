process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAzbyDigJQgQ1NTIHRla3N0byBhcHJhxaF5bXVvc2UgdmFseW1hcyAoMTYzKSArIHNuaXBwZXQgNTEyIHByaWXFvmFzdGllcyBwYXRhaXNhLiBSPWRyeSwgVz1yYcWheXRpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDMnXSk/JF9HRVRbJ3BzX3MxODAzJ106JycpOyBpZighaW5fYXJyYXkoJGYsYXJyYXkoJ1InLCdXJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxODAzbycsJ2YnPT4kZik7CiAgJFJYPScvKD86XHMqXC5iMmItW1x3LV0rW157fTxdKlx7W157fTxdKlx9KSsvdSc7CiAgJHZhbHl0aT1mdW5jdGlvbigkYykgdXNlKCRSWCl7ICRwYXJ0cz1wcmVnX3NwbGl0KCcjKDxzdHlsZVtePl0qPi4qPzwvc3R5bGU+KSNpcycsJGMsLTEsUFJFR19TUExJVF9ERUxJTV9DQVBUVVJFKTsgJG49MDsKICAgIGZvcmVhY2goJHBhcnRzIGFzICRpPT4kcyl7IGlmKHN0cmlwb3MoJHMsJzxzdHlsZScpPT09MCkgY29udGludWU7ICRwYXJ0c1skaV09cHJlZ19yZXBsYWNlKCRSWCwnJywkcywtMSwkayk7ICRuKz0kazsgfQogICAgJGM9aW1wbG9kZSgnJywkcGFydHMpOyAkYz1wcmVnX3JlcGxhY2UoJyM8cD5ccyo8L3A+I2knLCcnLCRjKTsgcmV0dXJuIGFycmF5KCRjLCRuKTsgfTsKICB0cnl7CiAgICAvLyAxKSBEQiB2YWx5bWFzCiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3N0YXR1cyxwb3N0X2NvbnRlbnQgYyBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJWIyYi0leyUnIixBUlJBWV9BKTsKICAgICR0dj0wOyAkcGF2PWFycmF5KCk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgbGlzdCgkbmMsJG4pPSR2YWx5dGkoJHJbJ2MnXSk7IGlmKCEkbikgY29udGludWU7ICR0disrOwogICAgICBpZihjb3VudCgkcGF2KTwyKSAkcGF2W109YXJyYXkoJ2lkJz0+JHJbJ0lEJ10sJ3ByaWVzJz0+c3Vic3RyKCRyWydjJ10sMCwxODApLCdwbyc9PnN1YnN0cigkbmMsMCwxODApKTsKICAgICAgaWYoJGY9PT0nVycpeyBpZighZ2V0X3Bvc3RfbWV0YSgkclsnSUQnXSwnX3BzX3MxODAzX2Nzc19iYWsnLHRydWUpKSBhZGRfcG9zdF9tZXRhKCRyWydJRCddLCdfcHNfczE4MDNfY3NzX2Jhaycsd3Bfc2xhc2goJHJbJ2MnXSksdHJ1ZSk7CiAgICAgICAgJHdwZGItPnVwZGF0ZSgkd3BkYi0+cG9zdHMsYXJyYXkoJ3Bvc3RfY29udGVudCc9PiRuYyksYXJyYXkoJ0lEJz0+JHJbJ0lEJ10pKTsgY2xlYW5fcG9zdF9jYWNoZSgkclsnSUQnXSk7IH0gfQogICAgJG9bJ2RiJ109YXJyYXkoJ3Rpa3JpbnRhJz0+Y291bnQoJHJvd3MpLCd0YWlzb21hJz0+JHR2LCdwdnonPT4kcGF2KTsKICAgIC8vIDIpIHNuaXBwZXQgNTEyCiAgICAkY29kZT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQ9NTEyIik7CiAgICAkb2xkPSJcJGh0bWwgPSBwcmVnX3JlcGxhY2UoJyM8c3R5bGVbXj5dKj4uKj88L3N0eWxlPiNpcycsICcgJywgXCRodG1sKTsiOwogICAgJGNudD1zdWJzdHJfY291bnQoJGNvZGUsJG9sZCk7ICRvWydzNTEyX3ZpZXRvcyddPSRjbnQ7CiAgICBpZihzdHJwb3MoJGNvZGUsJ1MxODAzJykhPT1mYWxzZSl7ICRvWydzNTEyJ109J2phdSBwYXRhaXN5dGEnOyB9CiAgICBlbHNlewogICAgICAkbmV3PSRvbGQuIlxuICAgIFwkaHRtbCA9IHByZWdfcmVwbGFjZSgnLyg/OlxccypcXC5iMmItW1xcdy1dK1tee308XSpcXHtbXnt9PF0qXFx9KSsvdScsICcgJywgXCRodG1sKTsgLyogUzE4MDM6IENTUyB0ZWtzdGFzIGJlIDxzdHlsZT4gKGtzZXMgbnVraXJwdGEgxb55bcSXKSAqLyI7CiAgICAgICRjb2RlMj1zdHJfcmVwbGFjZSgkb2xkLCRuZXcsJGNvZGUpOwogICAgICAkY29kZTIuPSJcblxuLyogUzE4MDMgMjAyNi0xMC0yNzogcHJpZcW+YXN0aXMg4oCUIGnFoXNhdWdhbnQgYmUgdW5maWx0ZXJlZF9odG1sIGtzZXMgacWhbWV0YSA8c3R5bGU+IMW+eW3EmSwgcGFsaWVrYSBDU1Mga2FpcCB0ZWtzdMSFLiBBcHJhxaF5bW8gPHN0eWxlPiBzdSAuYjJiLSB0YWlzeWtsxJdtaXMgZnJvbnRhcyB2aXMgdGllayBpxaFtZXRhICjFvnIuIGF1a8WhxI1pYXUpLCB0b2TEl2wgacWhaW1hbWFzIHZpc2FzIHByaWXFoSBrc2VzLiAqL1xuYWRkX2ZpbHRlcignY29udGVudF9zYXZlX3ByZScsIGZ1bmN0aW9uKFwkYyl7IGlmKGlzX3N0cmluZyhcJGMpICYmIHN0cmlwb3MoXCRjLCc8c3R5bGUnKSE9PWZhbHNlICYmIHN0cnBvcyhcJGMsJy5iMmItJykhPT1mYWxzZSl7IFwkYz1wcmVnX3JlcGxhY2UoJyM8c3R5bGVbXj5dKj5bXjxdKlxcXFwuYjJiLVtePF0qPC9zdHlsZT4jaXMnLCcnLFwkYyk7IH0gcmV0dXJuIFwkYzsgfSwgOSk7XG4iOwogICAgICB0cnl7IHRva2VuX2dldF9hbGwoJzw/cGhwICcuJGNvZGUyLCBUT0tFTl9QQVJTRSk7ICRvWydzNTEyX2xpbnQnXT0nT0snOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgdGhyb3cgbmV3IEV4Y2VwdGlvbignNTEyIGxpbnQ6ICcuJGUtPmdldE1lc3NhZ2UoKSk7IH0KICAgICAgLy8gZmlsdHJvIHRlc3RhcwogICAgICAkdD13cF9zbGFzaCgiPHN0eWxlPi5iMmItYmxhY2ssIC5iMmItYmxhY2sgKiB7IGNvbG9yOiMwMDAgIWltcG9ydGFudDsgfTwvc3R5bGU+PGRpdiBjbGFzcz1cImIyYi1ibGFja1wiPjxwPlRla3N0YXM8L3A+PC9kaXY+Iik7CiAgICAgICRmbj1mdW5jdGlvbigkYyl7IGlmKGlzX3N0cmluZygkYykgJiYgc3RyaXBvcygkYywnPHN0eWxlJykhPT1mYWxzZSAmJiBzdHJwb3MoJGMsJy5iMmItJykhPT1mYWxzZSl7ICRjPXByZWdfcmVwbGFjZSgnIzxzdHlsZVtePl0qPltePF0qXFwuYjJiLVtePF0qPC9zdHlsZT4jaXMnLCcnLCRjKTsgfSByZXR1cm4gJGM7IH07CiAgICAgICRvWydmaWx0cm9fdGVzdGFzJ109d3BfdW5zbGFzaCgkZm4oJHQpKTsKICAgICAgJG9bJ3ZhbHltb190ZXN0YXMnXT0kdmFseXRpKCI8cD4uYjJiLWJsYWNrLCAuYjJiLWJsYWNrICogeyBjb2xvcjojMDAwICFpbXBvcnRhbnQ7IH08L3A+XG48ZGl2IGNsYXNzPVwiYjJiLWJsYWNrXCI+PHA+VGVrc3RhczwvcD48L2Rpdj4iKVswXTsKICAgICAgaWYoJGY9PT0nVycpeyB1cGRhdGVfb3B0aW9uKCdwc19zMTgwM19zNTEyX2JhaycsJGNvZGUsZmFsc2UpOyAkd3BkYi0+dXBkYXRlKCRwLidzbmlwcGV0cycsYXJyYXkoJ2NvZGUnPT4kY29kZTIsJ21vZGlmaWVkJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKSxhcnJheSgnaWQnPT41MTIpKTsgJG9bJ3M1MTInXT0nxK9yYcWheXRhJzsgfQogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-151523';
const GKEY='ps_s1803';
const PHASES=["W"];
const OUT='analize/s1803_o_W.json';
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
