process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTkgcnVuIGU2cyDigJQgUzogUGxheXdyaWdodCBrYWRyYWkgKFBQSyArIEMpOiBza3lkZWxpcyAjMzU4MDkgKGt2aXRhcyBQUEswMDAxMDIgUERGKSwgIzM1ODExIChhdHNpxJdtaW1hcyDEr3Z5a2R5dGFzIOKAlCDFvmluZ3NuZWxpYWkpLCAjMzU4MTAgKGF0c2nEl21pbWFzIE5lacWhcsWrxaFpdW90aSwgVkYgZWlsdXTElyDigJ52ZcW+YSDEryBBVuKAnCksIFPEhXNrYWl0b3MgdD1wcGssIFPEhXNrYWl0b3MgxaFhYmxvbmFpIChhdHNpxJdtaW1vIGxhacWha28gZm9ybWEgYXRpZGFyeXRhKSwgTmF1amFzIHXFvnNha3ltYXMgNC4gQXBtb2vEl2ppbWFzLiArIHJlY29uOiB0ZW1vcyBgd3BfbWFpbGAgZmlsdHJhcyAocHJpZWRhaSkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U2cyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE5IGU2cycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICR0dT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkdWlkPSR0dS0+SUQ7ICRleHA9dGltZSgpKzE4MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICRvWydjb29raWVzJ109YXJyYXkoYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcsJHRvaykpLGFycmF5KCduYW1lJz0+QVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdhdXRoJywkdG9rKSksYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSkpOwogICRMPWZpbGUoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJyk7ICRnPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3dwX21haWx8cGhwbWFpbGVyfGF0dGFjaG1lbnRzL2knLCRsKSl7ICRnW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMTYwKTsgfSB9ICRvWyd0ZW1hX21haWwnXT1hcnJheV9zbGljZSgkZywwLDI1KTsKICAkc2s9ZnVuY3Rpb24oJGlkKXsgcmV0dXJuIGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzayZlaWxlPXZpc2kmYXRpZGFyeXRpPScuJGlkKTsgfTsKICAkZXY9Jyhhc3luYyBmdW5jdGlvbigpeyB2YXIgc2w9ZnVuY3Rpb24obXMpe3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyKXtzZXRUaW1lb3V0KHIsbXMpO30pO307IGF3YWl0IHNsKDI1MDApOyB2YXIgZD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgic2tEb2tUIik7IHZhciB2PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJza1YiKTsgcmV0dXJuIHtkb2s6ZD9kLmlubmVyVGV4dDoiIiwgZm9vdGVyOnY/di5pbm5lclRleHQ6IiIsIHByOihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgic2tQciIpfHx7fSkuaW5uZXJUZXh0fHwiIn07IH0pKCknOwogICRvWydzaG90cyddPWFycmF5KAogICAgYXJyYXkoJ24nPT4nczE2MTlfZTZfc2t5ZGVsaXNfMzU4MDlfcHBrJywndSc9PiRzaygzNTgwOSksJ3cnPT4xNDQwLCdoJz0+MTAwMCwnZnVsbCc9PnRydWUsJ2V2YWwnPT4kZXYpLAogICAgYXJyYXkoJ24nPT4nczE2MTlfZTZfc2t5ZGVsaXNfMzU4MTFfYXRzaWVtaW1hcycsJ3UnPT4kc2soMzU4MTEpLCd3Jz0+MTQ0MCwnaCc9PjEwMDAsJ2Z1bGwnPT50cnVlLCdldmFsJz0+JGV2KSwKICAgIGFycmF5KCduJz0+J3MxNjE5X2U2X3NreWRlbGlzXzM1ODEwX25laXNydXNpdW90YXMnLCd1Jz0+YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJmVpbGU9bmVpc3J1c2l1b3RpJmF0aWRhcnl0aT0zNTgxMCcpLCd3Jz0+MTQ0MCwnaCc9PjEwMDAsJ2Z1bGwnPT50cnVlLCdldmFsJz0+JGV2KSwKICAgIGFycmF5KCduJz0+J3MxNjE5X2U2X3Nhc2thaXRvc19wcGsnLCd1Jz0+YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJnZpZXc9c2Fza2FpdG9zJnQ9cHBrJyksJ3cnPT4xNDQwLCdoJz0+ODAwLCdldmFsJz0+JyhmdW5jdGlvbigpe3ZhciB0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoInRhYmxlLmRsLXNhc2siKTsgcmV0dXJuIHQ/dC5pbm5lclRleHQuc2xpY2UoMCw0MDApOiJsZW50ZWzEl3MgbsSXcmEiO30pKCknKSwKICAgIGFycmF5KCduJz0+J3MxNjE5X2U2X3Nhc2thaXRvc19zYWJsb25haScsJ3UnPT5hZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWRlc2smdmlldz1zYXNrYWl0b3MmdD1rciZwZF9vaz1kbF9pbmZvJnBkX25yPScucmF3dXJsZW5jb2RlKCfFoWFibG9uYXN84oCecGFydW/FoXRhIGF0c2lpbXRp4oCcIChwZXLFvmnFq3JhKScpKSwndyc9PjE0NDAsJ2gnPT4xNDAwLCdmdWxsJz0+dHJ1ZSwnZXZhbCc9PicoZnVuY3Rpb24oKXsgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgiZGV0YWlscy5kbC1zYWJsIikuZm9yRWFjaChmdW5jdGlvbihkKXtkLm9wZW49dHJ1ZTt9KTsgcmV0dXJuIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgiZGV0YWlscy5kbC1zYWJsIHN1bW1hcnkiKSkubWFwKGZ1bmN0aW9uKHMpe3JldHVybiBzLmlubmVyVGV4dDt9KTsgfSkoKScpLAogICAgYXJyYXkoJ24nPT4nczE2MTlfZTZfbmF1amFzX2FwbW9rZWppbWFzJywndSc9PmFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzayZ2aWV3PW5hdWphcycpLCd3Jz0+MTQ0MCwnaCc9PjEwMDAsJ2Z1bGwnPT50cnVlLCdldmFsJz0+JyhmdW5jdGlvbigpeyByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIuZGwtbnUtbW9rIGxhYmVsIikpLm1hcChmdW5jdGlvbihsKXtyZXR1cm4gbC5pbm5lclRleHQ7fSk7IH0pKCknKSwKICApOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-221640';
const GKEY='ps_e6s';
const PHASES=["S"];
const OUT='analize/s1619_e6s.json';
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
