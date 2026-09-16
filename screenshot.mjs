process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODkgcCDigJQgREVQOiBFeGNsdXNpb24gRGlldCBhbnRrYWluaXMgNDMlIC0+IDM1JS4gVElLOiBrYWlub3MuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRnPSRfR0VUWydwc19zMTY4OXAnXT8/Jyc7IGlmKCRnPT09JycpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4nUzE2ODkgcCcsJ2YnPT4kZyk7CiAgJHA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXByaWNpbmctdmYucGhwJzsKICAkQkFLPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy8nOyBpZighaXNfZGlyKCRCQUspKSAkQkFLPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy8nOwogIGlmKCRnPT09J0RFUCcpewogICAgJHNyYz1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICAkYT0iJ0V4Y2x1c2lvbiBEaWV0JyA9PiAwLjQzLCAgIC8vIHYxLjguMCAoUzE2ODkpIOKAlCBzYXZpbmlua28gc3ByZW5kaW1hcywgQU5US0FJTklTIDQzJSI7CiAgICAkYj0iJ0V4Y2x1c2lvbiBEaWV0JyA9PiAwLjM1LCAgIC8vIHYxLjguMSAoUzE2ODkpIOKAlCBzYXZpbmlua28gc3ByZW5kaW1hcywgQU5US0FJTklTIDM1JSAoYnV2byA0MyUpIjsKICAgICRuPXN1YnN0cl9jb3VudCgkc3JjLCRhKTsgJG9bJ2Fua2VyaXMnXT0kbjsKICAgIGlmKCRuPT09MSl7ICRuZXc9c3RyX3JlcGxhY2UoJGEsJGIsJHNyYyk7ICRvaz10cnVlOyB0cnl7IHRva2VuX2dldF9hbGwoJG5ldyxUT0tFTl9QQVJTRSk7fWNhdGNoKFxQYXJzZUVycm9yICRlKXskb2s9ZmFsc2U7JG9bJ3BhcnNlJ109JGUtPmdldE1lc3NhZ2UoKTt9CiAgICAgIGlmKCRvayl7IGNvcHkoJHAsJEJBSy4nY2xhc3MtcHJpY2luZy12Zi5waHAuYmFrX3MxNjg5YycpOyAkb1snaXJhc3l0YSddPShib29sKWZpbGVfcHV0X2NvbnRlbnRzKCRwLCRuZXcsTE9DS19FWCk7ICRvWydtZDUnXT1tZDVfZmlsZSgkcCk7IH0gfQogICAgJGhiPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfaGI9MScpLGFycmF5KCd0aW1lb3V0Jz0+MjApKTsgJG9bJ2hiJ109aXNfd3BfZXJyb3IoJGhiKT8kaGItPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGhiKTsKICB9CiAgaWYoJGc9PT0nVElLJyl7CiAgICByZXF1aXJlX29uY2UgJHA7ICRwcj1uZXcgUGV0c2hvcF9QcmljaW5nX1ZGKCk7CiAgICAkb1snbWFya3VwJ109JHByLT5nZXRfbWFya3VwKCdFeGNsdXNpb24gRGlldCcsYXJyYXkoJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycpKTsKICAgICRvWydkaXNjJ109JHByLT5nZXRfc3VwcGxpZXJfZGlzY291bnQoJ0V4Y2x1c2lvbiBEaWV0Jyk7CiAgICAkc2s9YXJyYXkoJ0lOUFMwNic9PmFycmF5KDQ0LjMwLCdzYXVzYXMtbWFpc3Rhcy1zdW5pbXMnKSwnSU5QUzAyJz0+YXJyYXkoMTYuODksJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycpLCdJTlBNMTEnPT5hcnJheSg1My45OSwnc2F1c2FzLW1haXN0YXMtc3VuaW1zJyksJ0lOUEExMSc9PmFycmF5KDY1LjAwLCdzYXVzYXMtbWFpc3Rhcy1zdW5pbXMnKSwnSEVQTTExJz0+YXJyYXkoNTguNDEsJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycpLCdJUDM3Jz0+YXJyYXkoMy4wNiwna29uc2VydmFpLXN1bmltcycpLCdJUDIwJz0+YXJyYXkoMS45NCwna29uc2VydmFpLXN1bmltcycpLCdDSU5QMDEnPT5hcnJheSgxNi43Nywnc2F1c2FzLW1haXN0YXMta2F0ZW1zJyksJ0NJTlA4NSc9PmFycmF5KDEuMjIsJ2tvbnNlcnZhaS1rYXRlbXMnKSk7CiAgICBmb3JlYWNoKCRzayBhcyAkaz0+JHYpeyAkcj0kcHItPmNhbGN1bGF0ZV9maW5hbF9wcmljZV9mcm9tX3htbCgkdlswXSwkdlswXSwnRXhjbHVzaW9uIERpZXQnLGFycmF5KCR2WzFdKSk7ICRvWydrYWlub3MnXVska109YXJyYXkoJ3htbCc9PiR2WzBdLCdzYXZpa2FpbmEnPT5yb3VuZCgkdlswXSowLjg1LDIpLCdyZWd1bGFyJz0+JHJbJ3JlZ3VsYXInXSwncnVsZSc9PiRyWydydWxlJ10pOyB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-163306';
const GKEY='ps_s1689p';
const PHASES=["DEP", "TIK"];
const OUT='analize/s1689_p.json';
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
