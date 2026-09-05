process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTggcnVuIGU3cyDigJQgUzogUGxheXdyaWdodCBrYWRyYWkg4oCUIGxhbmdhcyDigJ5OYXVqYXMgdcW+c2FreW1hc+KAnCAodHXFocSNaWFzICsgdcW+cGlsZHl0YXMgcGVyIEpTOiBrbGllbnRhcyBpxaEgcGFpZcWha29zLCBwcmVrxJcgacWhIHBhaWXFoWtvcywgcGHFoXRvbWF0YXMpLCBlaWxpxbMganVvc3RhIHN1IG51b3JvZGEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U3cyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE4IGU3cycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICR0dT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkdWlkPSR0dS0+SUQ7ICRleHA9dGltZSgpKzE4MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICRvWydjb29raWVzJ109YXJyYXkoYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcsJHRvaykpLGFycmF5KCduYW1lJz0+QVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdhdXRoJywkdG9rKSksYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSkpOwogICR1PWFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzayZ2aWV3PW5hdWphcycpOwogICRvWydzaG90cyddPWFycmF5KAogICAgYXJyYXkoJ24nPT4nczE2MThfZTVfbmF1amFzX3R1c2NpYXMnLCd1Jz0+JHUsJ3cnPT4xNDQwLCdoJz0+MTAwMCwnZnVsbCc9PnRydWUsJ2V2YWwnPT4nKGZ1bmN0aW9uKCl7cmV0dXJuIHtmb3JtYTohIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJkbE51IikscHJpc3Q6QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIjbnVQcmlzdCBvcHRpb24iKSkubWFwKGZ1bmN0aW9uKG8pe3JldHVybiBvLnRleHRDb250ZW50O30pLGthaW5hOmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudVByaXN0SyIpLnZhbHVlLHByaXN0Tjpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibnVQcmlzdE4iKS50ZXh0Q29udGVudH07fSkoKScpLAogICAgYXJyYXkoJ24nPT4nczE2MThfZTVfbmF1amFzX3V6cGlsZHl0YXMnLCd1Jz0+JHUsJ3cnPT4xNDQwLCdoJz0+MTAwMCwnZnVsbCc9PnRydWUsJ2V2YWwnPT4nKGFzeW5jIGZ1bmN0aW9uKCl7IHZhciBzbD1mdW5jdGlvbihtcyl7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHIpe3NldFRpbWVvdXQocixtcyk7fSk7fTsgdmFyIHE9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm51S2xRIik7IHEudmFsdWU9IlRlc3RhcyAzNCI7IHEuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoImlucHV0Iix7YnViYmxlczp0cnVlfSkpOyBhd2FpdCBzbCgxNTAwKTsgdmFyIGs9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI251S2xSIC5kbC1udS1rIik7IGlmKGspIGsuY2xpY2soKTsgdmFyIHBxPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudVByUSIpOyBwcS52YWx1ZT0iZXhjbHVzaW9uIGh5cG8iOyBwcS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgiaW5wdXQiLHtidWJibGVzOnRydWV9KSk7IGF3YWl0IHNsKDE4MDApOyB2YXIgYT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIjbnVQclIgLmRsLW51LWsiKTsgaWYoYVswXSkgYVswXS5jbGljaygpOyBhd2FpdCBzbCgzMDApOyBwcS52YWx1ZT0iSEFQIMW+YWlzbGFzIjsgcHEuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoImlucHV0Iix7YnViYmxlczp0cnVlfSkpOyBhd2FpdCBzbCgxODAwKTsgYT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIjbnVQclIgLmRsLW51LWsiKTsgaWYoYVswXSkgYVswXS5jbGljaygpOyBhd2FpdCBzbCgzMDApOyB2YXIgcWk9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI251UHJUIGlucHV0W2RhdGEtZj1xXSIpOyBpZihxaSl7IHFpLnZhbHVlPSIzIjsgcWkuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoImlucHV0Iix7YnViYmxlczp0cnVlfSkpOyB9IHZhciBudT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibnVOdW9sIik7IG51LnZhbHVlPSIyIjsgbnUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoImlucHV0Iix7YnViYmxlczp0cnVlfSkpOyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibnVOdW9sUCIpLnZhbHVlPSJsb2phbHVzIGtsaWVudGFzIjsgdmFyIHM9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm51UHJpc3QiKTsgcy52YWx1ZT0idmVuaXBha19wYXN0b21hdGFzIjsgcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgiY2hhbmdlIix7YnViYmxlczp0cnVlfSkpOyBhd2FpdCBzbCgyNTAwKTsgdmFyIHZxPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudVZpZXRhUSIpOyB2cS52YWx1ZT0iTmVtZW7EjWluxJciOyB2cS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgiaW5wdXQiLHtidWJibGVzOnRydWV9KSk7IGF3YWl0IHNsKDMwMCk7IHZhciB2cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibnVWaWV0YVMiKTsgaWYodnMub3B0aW9ucy5sZW5ndGg+MSkgdnMuc2VsZWN0ZWRJbmRleD0xOyByZXR1cm4ge2tsaWVudGFzOmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIltuYW1lPVxcImtsW3ZhcmRhc11cXCJdIikudmFsdWUrIiAiK2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIltuYW1lPVxcImtsW3RlbF1cXCJdIikudmFsdWUscHJla2VzOmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNudVByVCB0Ym9keSB0ciIpLmxlbmd0aCxzdW1vczpbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm51UzEiKS50ZXh0Q29udGVudCxkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibnVTMiIpLnRleHRDb250ZW50LGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudVMzIikudGV4dENvbnRlbnQsZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm51UzQiKS50ZXh0Q29udGVudF0scHJpc3ROOmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudVByaXN0TiIpLnRleHRDb250ZW50LHZpZXRhOnZzLm9wdGlvbnNbdnMuc2VsZWN0ZWRJbmRleF0/dnMub3B0aW9uc1t2cy5zZWxlY3RlZEluZGV4XS50ZXh0Q29udGVudDoiIix2aWV0YU46ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm51VmlldGFOIikudGV4dENvbnRlbnR9OyB9KSgpJyksCiAgICBhcnJheSgnbic9PidzMTYxOF9lNV9laWxlc19qdW9zdGEnLCd1Jz0+YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJmVpbGU9c2lhbmRpZW4nKSwndyc9PjE0NDAsJ2gnPT43MDAsJ2V2YWwnPT4nKGZ1bmN0aW9uKCl7dmFyIGE9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLmRsLWUtbmF1amFzIik7IHJldHVybiBhP2EudGV4dENvbnRlbnQ6Im51b3JvZG9zIG7El3JhIjt9KSgpJyksCiAgKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-204741';
const GKEY='ps_e7s';
const PHASES=["S"];
const OUT='analize/s1618_e7s.json';
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
