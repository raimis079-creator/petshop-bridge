process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwbiAzNDkxMyBkcmFmdCArIHRlc3QtIHNsdWcgKDEgZHJ5IC8gMiB0YWlreXRpIC8gMyB0ZXN0YXMgLyA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwbiddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3NDBuJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MG4nLCdmYXplJz0+JGZdOwogICRTTD1bMzQ5NDQ9Pidrb25zZXJ2dS1kZXplLTQwMC1iZS12aXN0aWVub3MnLDM0OTQ3PT4na29uc2VydnUtZGV6ZS1rYXRlaS1pc3Jhbmtpb21zJ107ICREUj0zNDkxMzsgJEJLPSdwc19zMTc0MF9zbHVnX2Jhayc7CiAgJHZhbHlrPWZ1bmN0aW9uKCl7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsgfTsKICAkaGVhZD1mdW5jdGlvbigkdSl7ICRjPWN1cmxfaW5pdCgkdSk7IGN1cmxfc2V0b3B0X2FycmF5KCRjLFtDVVJMT1BUX1JFVFVSTlRSQU5TRkVSPT4xLENVUkxPUFRfTk9CT0RZPT4xLENVUkxPUFRfRk9MTE9XTE9DQVRJT049PjAsQ1VSTE9QVF9USU1FT1VUPT4yMCxDVVJMT1BUX1VTRVJBR0VOVD0+J01vemlsbGEvNS4wIHBzLXRlc3QnXSk7IGN1cmxfZXhlYygkYyk7ICRvPWN1cmxfZ2V0aW5mbygkYyxDVVJMSU5GT19IVFRQX0NPREUpLicgJy53cF9tYWtlX2xpbmtfcmVsYXRpdmUoKHN0cmluZyljdXJsX2dldGluZm8oJGMsQ1VSTElORk9fUkVESVJFQ1RfVVJMKSk7IGN1cmxfY2xvc2UoJGMpOyByZXR1cm4gdHJpbSgkbyk7IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgIGZvcmVhY2goJFNMIGFzICRpZD0+JG5zKXsgJHA9Z2V0X3Bvc3QoJGlkKTsgJHJbJ3AnLiRpZF09WydzdGF0dXMnPT4kcC0+cG9zdF9zdGF0dXMsJ3NsdWcnPT4kcC0+cG9zdF9uYW1lLCduYXVqYXMnPT4kbnMsJ3VuaWthbHVzJz0+d3BfdW5pcXVlX3Bvc3Rfc2x1ZygkbnMsJGlkLCdwdWJsaXNoJywncHJvZHVjdCcsMCk9PT0kbnMsJ251b3JvZG9zX3R1cmlueWplJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2NvbnRlbnQgTElLRSAlcyIsJyUnLiR3cGRiLT5lc2NfbGlrZSgkcC0+cG9zdF9uYW1lKS4nJScpKSwnbWV0YSc9PihpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfdmFsdWUgTElLRSAlcyIsJyUnLiR3cGRiLT5lc2NfbGlrZSgkcC0+cG9zdF9uYW1lKS4nJScpKSwnb3B0Jz0+JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX3ZhbHVlIExJS0UgJXMgTElNSVQgNSIsJyUnLiR3cGRiLT5lc2NfbGlrZSgkcC0+cG9zdF9uYW1lKS4nJScpKV07IH0KICAgICRwPWdldF9wb3N0KCREUik7ICRyWydwJy4kRFJdPVsnc3RhdHVzJz0+JHAtPnBvc3Rfc3RhdHVzLCd0Jz0+JHAtPnBvc3RfdGl0bGUsJ3VybCc9PndwX21ha2VfbGlua19yZWxhdGl2ZShnZXRfcGVybWFsaW5rKCREUikpXTsKICAgICRyWydraXRpX3Rlc3Rfc2x1Z2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90eXBlLHBvc3RfbmFtZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3BhZ2UnLCdwb3N0JykgQU5EIChwb3N0X25hbWUgTElLRSAndGVzdC0lJyBPUiBwb3N0X25hbWUgTElLRSAnJS10ZXN0LSUnIE9SIHBvc3RfbmFtZSBMSUtFICclLXRlc3QnKSBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgfQogIGlmKCRmPT09JzInKXsKICAgIGlmKGdldF9vcHRpb24oJEJLKSl7ICRyWydTVE9QJ109J2JhayBqYXUgeXJhJzsgfQogICAgZWxzZSB7CiAgICAgICRiYWs9WydzdGF0dXNhcyc9PlskRFI9PmdldF9wb3N0X3N0YXR1cygkRFIpXSwnc2x1Zyc9PltdXTsKICAgICAgZm9yZWFjaCgkU0wgYXMgJGlkPT4kbnMpeyAkYmFrWydzbHVnJ11bJGlkXT1nZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkaWQpOyB9CiAgICAgIGFkZF9vcHRpb24oJEJLLCRiYWssJycsJ25vJyk7CiAgICAgIGZvcmVhY2goJFNMIGFzICRpZD0+JG5zKXsgaWYoZ2V0X3Bvc3Rfc3RhdHVzKCRpZCkhPT0ncHVibGlzaCcpeyAkclsncCcuJGlkXT0nbmUgcHVibGlzaCc7IGNvbnRpbnVlOyB9ICRyZXM9d3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpZCwncG9zdF9uYW1lJz0+JG5zXSx0cnVlKTsgJHJbJ3AnLiRpZF09aXNfd3BfZXJyb3IoJHJlcyk/JHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTpnZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkaWQpOyAkclsnb2xkX3NsdWcnLiRpZF09Z2V0X3Bvc3RfbWV0YSgkaWQsJ193cF9vbGRfc2x1ZycpOyB9CiAgICAgICRyZXM9d3BfdXBkYXRlX3Bvc3QoWydJRCc9PiREUiwncG9zdF9zdGF0dXMnPT4nZHJhZnQnXSx0cnVlKTsgJHJbJ3AnLiREUl09aXNfd3BfZXJyb3IoJHJlcyk/JHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTpnZXRfcG9zdF9zdGF0dXMoJERSKTsKICAgICAgJHZhbHlrKCk7CiAgICB9CiAgfQogIGlmKCRmPT09JzMnKXsKICAgICRiYWs9Z2V0X29wdGlvbigkQkspOwogICAgZm9yZWFjaCgkU0wgYXMgJGlkPT4kbnMpeyAkclsncCcuJGlkXT1bJ25hdWphJz0+JGhlYWQoZ2V0X3Blcm1hbGluaygkaWQpKSwnc2VuYSc9PiRoZWFkKGhvbWVfdXJsKCcvcHJvZHVjdC8nLiRiYWtbJ3NsdWcnXVskaWRdLicvJykpXTsgfQogICAgJHJbJ3AnLiREUl09WydzdGF0dXNhcyc9PmdldF9wb3N0X3N0YXR1cygkRFIpLCd1cmwnPT4kaGVhZChob21lX3VybCgnL3Byb2R1Y3QvJy5nZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkRFIpLicvJykpXTsKICAgICRyWydob21lJ109JGhlYWQoaG9tZV91cmwoJy8nKSk7CiAgfQogIGlmKCRmPT09JzknKXsKICAgICRiYWs9Z2V0X29wdGlvbigkQkspOyBpZighJGJhayl7ICRyWydhdHN0YXR5dGEnXT0nbmVyYSBiYWsnOyB9CiAgICBlbHNlIHsgZm9yZWFjaCgkYmFrWydzbHVnJ10gYXMgJGlkPT4kcykgd3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpZCwncG9zdF9uYW1lJz0+JHNdKTsgZm9yZWFjaCgkYmFrWydzdGF0dXNhcyddIGFzICRpZD0+JHN0KSB3cF91cGRhdGVfcG9zdChbJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PiRzdF0pOyBkZWxldGVfb3B0aW9uKCRCSyk7ICR2YWx5aygpOyAkclsnYXRzdGF0eXRhJ109MTsgfQogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-190208';
const GKEY='ps_s1740n';
const PHASES=["1", "2", "3"];
const OUT='analize/s1740n.json';
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
