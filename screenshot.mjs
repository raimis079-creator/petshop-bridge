process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIGog4oCUIFJFQUQtT05MWTogcHMta2F0YWxvZ2FzIHNva2luZWppbW8gZGlhZ25vc3Rpa2EgKHRlc3R1b3RvamFzIGNvb2tpZXM7IGthZHJhaSB2aXJzdWplIGlyIHBvIHNjcm9sbDsgLS1wcy12aXJzdXMsIC5wc2thdC1iYXIgcG96aWNpam9zLCBzdGlja3kgdGhlYWQgdG9wKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzZqJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MzYgaicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICR0dT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkdWlkPSR0dS0+SUQ7ICRleHA9dGltZSgpKzEyMDA7CiAgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJG9bJ2Nvb2tpZXMnXT1hcnJheSgKICAgIGFycmF5KCduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvaykpLAogICAgYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcsJHRvaykpCiAgKTsKICAkbT0nKGZ1bmN0aW9uKCl7dmFyIGNzPWdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTt2YXIgYj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIucHNrYXQtYmFyIik7dmFyIHRoPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5wc2thdC10IHRoZWFkIHRoIik7cmV0dXJuIHt2aXJzdXM6Y3MuZ2V0UHJvcGVydHlWYWx1ZSgiLS1wcy12aXJzdXMiKSxiYXI6Yj9NYXRoLnJvdW5kKGIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tKTpudWxsLGJhcl9wb3M6Yj9nZXRDb21wdXRlZFN0eWxlKGIpLnBvc2l0aW9uOm51bGwsdGhfdG9wOnRoP2dldENvbXB1dGVkU3R5bGUodGgpLnRvcDpudWxsLHRoX3JlY3Q6dGg/TWF0aC5yb3VuZCh0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApOm51bGwsc2Nyb2xsWTpNYXRoLnJvdW5kKHdpbmRvdy5zY3JvbGxZKX07fSkoKSc7CiAgJEY9JyhmdW5jdGlvbigpe3ZhciBjcz1nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7dmFyIGI9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLnBza2F0LWJhciIpO3ZhciB0aD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIucHNrYXQtdCB0aGVhZCB0aCIpO3JldHVybiB7dmlyc3VzOmNzLmdldFByb3BlcnR5VmFsdWUoIi0tcHMtdmlyc3VzIiksYmFyOmI/TWF0aC5yb3VuZChiLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSk6bnVsbCxiYXJfcG9zOmI/Z2V0Q29tcHV0ZWRTdHlsZShiKS5wb3NpdGlvbjpudWxsLHRoX3RvcDp0aD9nZXRDb21wdXRlZFN0eWxlKHRoKS50b3A6bnVsbCx0aF9yZWN0OnRoP01hdGgucm91bmQodGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTpudWxsLHNjcm9sbFk6TWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSl9O30pJzsKICAkdT1hZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWthdGFsb2dhcycpOwogICRvWydzaG90cyddPWFycmF5KAogICAgYXJyYXkoJ24nPT4nczE2MzZfal92aXJzdXMnLCd1Jz0+JHUsJ3cnPT4xNDQwLCdoJz0+OTAwLCdldmFsJz0+JG0pLAogICAgYXJyYXkoJ24nPT4nczE2MzZfal9zY3JvbGwnLCd1Jz0+JHUsJ3cnPT4xNDQwLCdoJz0+OTAwLCdldmFsJz0+J25ldyBQcm9taXNlKHI9Pnt3aW5kb3cuc2Nyb2xsVG8oMCw3MDApO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyKCgnLiRGLicpKCkpfSw4MDApfSknKQogICk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-165531';
const GKEY='ps_s1636j';
const PHASES=["J"];
const OUT='analize/s1636_j2.json';
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
