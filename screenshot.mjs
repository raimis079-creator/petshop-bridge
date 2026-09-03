process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDcgcnVuOCDigJQgZGFyYnVvdG9qbyBkaWVub3JhxaF0aXMsIEF2ZXNvcyBrZWxpYXM6ICMzNTQzNyBTdXJpbmt0aSjinJMpIOKGkiBMaXBkdWthcyAoVmVuaXBhaykg4oaSIFBhcnVvxaF0YSDihpIgTGlwZHVrYXMgUERGIOKGkiBJxaFzacWzc3RhICsgc2VraW1vIGxhacWha2FzICovCmFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJHIsJGEpeyAkbD0oYXJyYXkpZ2V0X29wdGlvbigncHNfYXVkaXRfbWFpbCcsYXJyYXkoKSk7ICRsW109YXJyYXkoY3VycmVudF90aW1lKCdIOmk6cycpLGlzX2FycmF5KCRhWyd0byddKT9pbXBsb2RlKCcsJywkYVsndG8nXSk6JGFbJ3RvJ10sJGFbJ3N1YmplY3QnXSwncnVuOCcpOyB1cGRhdGVfb3B0aW9uKCdwc19hdWRpdF9tYWlsJyxhcnJheV9zbGljZSgkbCwtMTIwKSxmYWxzZSk7IHJldHVybiB0cnVlOyB9LDEwLDIpOwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19kbGUnXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4ncnVuOCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI5MCk7CiAgdHJ5ewogICAgJG9bJ3RlbXBfaXN0cmludGEnXT0kd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsgZGVsZXRlX29wdGlvbigncHNfYXVkaXRfbWFpbCcpOwogICAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJHVpZD0kdS0+SUQ7ICRleHA9dGltZSgpKzM2MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOwogICAgJGNrPWFycmF5KFNFQ1VSRV9BVVRIX0NPT0tJRT0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcsJHRvayksQVVUSF9DT09LSUU9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcsJHRvayksTE9HR0VEX0lOX0NPT0tJRT0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spKTsKICAgICRjcz1hcnJheSgpOyBmb3JlYWNoKCRjayBhcyAkaz0+JHYpICRjc1tdPW5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PiRrLCd2YWx1ZSc9PiR2KSk7ICRfQ09PS0lFW0xPR0dFRF9JTl9DT09LSUVdPSRja1tMT0dHRURfSU5fQ09PS0lFXTsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdWlkKTsKICAgICRSRVE9ZnVuY3Rpb24oJHVybCwkcmF3PWZhbHNlKSB1c2UoJGNzKXsgJHI9d3BfcmVtb3RlX2dldChodG1sX2VudGl0eV9kZWNvZGUoJHVybCksYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT45MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOyBpZihpc193cF9lcnJvcigkcikpIHJldHVybiBhcnJheSgnZXJyJz0+JHItPmdldF9lcnJvcl9tZXNzYWdlKCkpOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7ICR4PWFycmF5KCdjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCdjdCc9PndwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIsJ2NvbnRlbnQtdHlwZScpKTsgJGxvYz13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCdsb2NhdGlvbicpOyBpZigkbG9jKXsgcGFyc2Vfc3RyKHBhcnNlX3VybCgkbG9jLFBIUF9VUkxfUVVFUlkpLCRxKTsgJHhbJ2xvYyddPWFycmF5X2ludGVyc2VjdF9rZXkoJHEsYXJyYXlfZmxpcChhcnJheSgncGFnZScsJ2VpbGUnLCdwZF9vaycsJ3BkX25yJykpKTsgaWYoaXNzZXQoJHhbJ2xvYyddWydwZF9uciddKSkgJHhbJ2xvYyddWydwZF9uciddPXJhd3VybGRlY29kZSgkeFsnbG9jJ11bJ3BkX25yJ10pOyB9IGVsc2VpZigkcmF3KSAkeFsncmF3J109JGI7IGVsc2UgJHhbJ2xlbiddPXN0cmxlbigkYik7IHJldHVybiAkeDsgfTsKICAgICRiYXNlPWFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzaycpOyAkQT0zNTQzNzsKICAgICRidG49ZnVuY3Rpb24oJGVpbGUpIHVzZSgkUkVRLCRiYXNlLCRBKXsgJHI9JFJFUSgkYmFzZS4nJmVpbGU9Jy4kZWlsZSx0cnVlKTsgaWYocHJlZ19tYXRjaCgnL2RhdGEtaWQ9IicuJEEuJyIuKj88XC90cj4vcycsJHJbJ3JhdyddPz8nJywkbSkpeyBwcmVnX21hdGNoX2FsbCgnLzxhIGNsYXNzPSJ2W14iXSoiW14+XSpocmVmPSIoW14iXSopIltePl0qPihbXjxdKik8XC9hPi8nLCRtWzBdLCRhYSxQUkVHX1NFVF9PUkRFUik7ICRvdXQ9YXJyYXkoKTsgZm9yZWFjaCgkYWEgYXMgJHgpICRvdXRbXT1hcnJheSgkeFsyXSxodG1sX2VudGl0eV9kZWNvZGUoJHhbMV0pKTsgcmV0dXJuICRvdXQ7IH0gcmV0dXJuICdlaWx1dMSXcyBuxJdyYSc7IH07CiAgICAkb1snMV9zdXJpbmt0aV9idG4nXT0kYnRuKCdzdXJpbmt0aScpOwogICAgJGxpcD0nJzsgZm9yZWFjaCgoYXJyYXkpJG9bJzFfc3VyaW5rdGlfYnRuJ10gYXMgJHgpeyBpZihpc19hcnJheSgkeCkmJnN0cnBvcygkeFsxXSwndj12cF9yZWcnKSE9PWZhbHNlKSAkbGlwPSR4WzFdOyB9CiAgICAkb1snMl9saXBkdWthcyddPSRsaXA/JFJFUSgkbGlwKTondnBfcmVnIG15Z3R1a28gbsSXcmEnOwogICAgd3BfY2FjaGVfZmx1c2goKTsgJG9vPXdjX2dldF9vcmRlcigkQSk7ICRvWycyX3BvJ109YXJyYXkoJ3N0Jz0+JG9vLT5nZXRfc3RhdHVzKCksJ3NpdW50b3MnPT4kb28tPmdldF9tZXRhKCdfcHNfc2l1bnRvcycpKTsKICAgICRvWyczX3N1cmlua3RpX2RhciddPSRidG4oJ3N1cmlua3RpJyk7ICRvWyczX3BhcnVvc3RhX2J0biddPSRidG4oJ3BhcnVvc3RhJyk7CiAgICAkcGRmPScnOyAkaXNzPScnOyBmb3JlYWNoKChhcnJheSkkb1snM19wYXJ1b3N0YV9idG4nXSBhcyAkeCl7IGlmKGlzX2FycmF5KCR4KSl7IGlmKHN0cnBvcygkeFsxXSwncHNfZHJvcHNoaXBfbGlwZHVrYXMnKSE9PWZhbHNlKSAkcGRmPSR4WzFdOyBpZihzdHJwb3MoJHhbMV0sJ3Y9aXNzaXVzdGEnKSE9PWZhbHNlKSAkaXNzPSR4WzFdOyB9IH0KICAgIGlmKCRwZGYpeyAkcnI9d3BfcmVtb3RlX2dldCgkcGRmLGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+OTAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRycik7ICRvWyc0X3BkZiddPWFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyciksd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkcnIsJ2NvbnRlbnQtdHlwZScpLHN0cmxlbigkYiksc3Vic3RyKCRiLDAsNSkpOyB9CiAgICAkb1snNV9pc3NpdXN0YSddPSRpc3M/JFJFUSgkaXNzLicmc2VraW1vPTEnKTonbsSXcmEnOwogICAgd3BfY2FjaGVfZmx1c2goKTsgJG9vPXdjX2dldF9vcmRlcigkQSk7ICRvWyc1X3BvJ109YXJyYXkoJ3N0Jz0+JG9vLT5nZXRfc3RhdHVzKCksJ3Nla2ltbyc9PiRvby0+Z2V0X21ldGEoJ19wc19zZWtpbW9fc2l1c3RhJykpOwogICAgJG9bJzZfdmlzaV9zaWFuZGllbiddPSRSRVEoJGJhc2UuJyZlaWxlPXZpc2kmYj1zaWFuZGllbicpOwogICAgJG9bJ21haWwnXT1nZXRfb3B0aW9uKCdwc19hdWRpdF9tYWlsJyk7CiAgICAkb1snenVybmFsYXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHIpeyByZXR1cm4gUGV0c2hvcF9VenNha3ltdV9JdnlraWFpOjp6bW9ndWkoJHIpOyB9LFBldHNob3BfVXpzYWt5bXVfSXZ5a2lhaTo6dXpzYWt5bW8oJEEsNikpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-082513';
const GKEY='ps_dle';
const PHASES=["T"];
const OUT='analize/e2_run8.json';
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
