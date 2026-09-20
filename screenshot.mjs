process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjk3IGZlZWQgcmVjb24gMiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE2OTcnXSk/JF9HRVRbJ3BzX3MxNjk3J106JycpOyBpZigkZiE9PScxJyYmJGYhPT0nMicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjk3IG1iJywnZmF6ZSc9PiRmKTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgaWYoJGY9PT0nMScpewogICAgICAkb1snc3JjX2I2NCddPWJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtZmVlZHMvcGV0c2hvcC1mZWVkcy5waHAnKSk7CiAgICAgICR1cD13cF91cGxvYWRfZGlyKCk7ICRvWydrYWluYTI0X2dhbHZhJ109c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCR1cFsnYmFzZWRpciddLicvcGV0c2hvcC1mZWVkcy9rYWluYTI0LnhtbCcpLDAsMjUwMCk7CiAgICAgICRvWydrYWlub3NfZ2FsdmEnXT1zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoJHVwWydiYXNlZGlyJ10uJy9wZXRzaG9wLWZlZWRzL2thaW5vcy54bWwnKSwwLDE4MDApOwogICAgICAkb1sncGFza3V0aW5pcyddPWdldF9vcHRpb24oJ3BzX2ZlZWRzX3Bhc2t1dGluaXMnKTsKICAgIH0gZWxzZSB7CiAgICAgIC8vIGJyZW5kYWkgZmVlZCBrYW5kaWRhdHVvc2UgKHB1Ymxpc2ggKyBpbnN0b2NrICsgbmUgcmlua2lueXMpCiAgICAgICRvWydicmVuZGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5uYW1lIGIsIENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdHMgcG8gSk9JTiB7JHB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cG8uSUQgQU5EIHMubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBzLm1ldGFfdmFsdWU9J2luc3RvY2snCiAgICAgICAgSk9JTiB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wby5JRCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQKICAgICAgICBXSEVSRSBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgdC5uYW1lIE9SREVSIEJZIG4gREVTQyIsQVJSQVlfQSk7CiAgICAgIC8vIGthaW7FsyBwYWx5Z2luaW1vIHBlcsW+acWrcm9zIHBlciAzMCBkLiBwYWdhbCBicmVuZMSFIChsYW5kaW5nIHNsdWcg4oaSIHByZWvElyDihpIgYnJlbmRhcykKICAgICAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSIpOwogICAgICAkcmM9bnVsbDsgZm9yZWFjaCgkY29scyBhcyAkYykgaWYocHJlZ19tYXRjaCgnL3JlZi9pJywkYykpeyRyYz0kYzticmVhazt9CiAgICAgICR0Yz1udWxsOyBmb3JlYWNoKCRjb2xzIGFzICRjKSBpZihwcmVnX21hdGNoKCcvbGFpa3x0aW1lfGRhdGF8Y3JlYXRlZC9pJywkYykpeyR0Yz0kYzticmVhazt9CiAgICAgICR1Yz1udWxsOyBmb3JlYWNoKCRjb2xzIGFzICRjKSBpZihwcmVnX21hdGNoKCcvdXJsfGtlbGlhc3xwYXRofHB1c2xhcC9pJywkYykpeyR1Yz0kYzticmVhazt9CiAgICAgICRzYz1udWxsOyBmb3JlYWNoKCRjb2xzIGFzICRjKSBpZihwcmVnX21hdGNoKCcvc2VzfHNpZHx2aXppdC9pJywkYykpeyRzYz0kYzticmVhazt9CiAgICAgICRvWydjb2xzJ109YXJyYXkoJHJjLCR0YywkdWMsJHNjKTsKICAgICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYCR1Y2AgdSwgYCRyY2AgciwgQ09VTlQoKikgbiIuKCRzYz8iLCBDT1VOVChESVNUSU5DVCBgJHNjYCkgcyI6IiIpLiIgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgKGAkcmNgIExJS0UgJyVrYWluYTI0JScgT1IgYCRyY2AgTElLRSAnJWthaW5vcy5sdCUnIE9SIGAkcmNgIExJS0UgJyVrYWlub3Rla2ElJykgQU5EIGAkdGNgPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzMCBEQVkpIEFORCBgJHVjYCBMSUtFICcvcHJvZHVjdC8lJyBHUk9VUCBCWSB1LHIiLEFSUkFZX0EpOwogICAgICAkYnI9YXJyYXkoKTsgJHNrdT1hcnJheSgpOwogICAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHNsdWc9ZXhwbG9kZSgnPycsdHJpbShzdWJzdHIoJHJbJ3UnXSw5KSwnLycpKVswXTsgJGhvc3Q9cHJlZ19yZXBsYWNlKCcvXnd3d1wuLycsJycscGFyc2VfdXJsKCRyWydyJ10sUEhQX1VSTF9IT1NUKT86Jz8nKTsKICAgICAgICAkcGlkPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgSUQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF9uYW1lPSVzIEFORCBwb3N0X3R5cGU9J3Byb2R1Y3QnIExJTUlUIDEiLCRzbHVnKSk7IGlmKCEkcGlkKSBjb250aW51ZTsKICAgICAgICAkYj0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHQubmFtZSBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHRyLm9iamVjdF9pZD0kcGlkIExJTUlUIDEiKT86Jz8nOwogICAgICAgICRiclskYl1bJGhvc3RdPSgkYnJbJGJdWyRob3N0XT8/MCkrKGludCkoJHJbJ3MnXT8/JHJbJ24nXSk7CiAgICAgICAgJGs9JHBpZDsgaWYoIWlzc2V0KCRza3VbJGtdKSkgJHNrdVska109YXJyYXkoJ3BpZCc9PiRwaWQsJ2InPT4kYiwnbic9PjAsJ3NsdWcnPT4kc2x1Zyk7ICRza3VbJGtdWyduJ10rPShpbnQpKCRyWydzJ10/PyRyWyduJ10pOyB9CiAgICAgIHVhc29ydCgkc2t1LGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ24nXS0kYVsnbiddO30pOwogICAgICAkb1sncGVyeml1cm9zX2JyZW5kYWknXT0kYnI7ICRvWydwZXJ6aXVyb3Nfc2t1X3RvcCddPWFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcygkc2t1KSwwLDYwKTsKICAgICAgLy8ga2FpbsWzIHBhbHlnaW5pbW8gdcW+c2FreW3FsyBwcmVrxJdzIOKGkiBicmVuZGFpIChudW8gVC0wKQogICAgICAkb1sndXpzX2JyZW5kYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0Lm5hbWUgYiwgQ09VTlQoRElTVElOQ1Qgby5pZCkgdXpzLCBTVU0ocW0ubWV0YV92YWx1ZSkgdm50IEZST00geyRwfXdjX29yZGVycyBvIEpPSU4geyRwfXdjX29yZGVyc19tZXRhIG0gT04gbS5vcmRlcl9pZD1vLmlkIEFORCBtLm1ldGFfa2V5PSdfd2Nfb3JkZXJfYXR0cmlidXRpb25fcmVmZXJyZXInIEFORCAobS5tZXRhX3ZhbHVlIExJS0UgJyVrYWluYTI0JScgT1IgbS5tZXRhX3ZhbHVlIExJS0UgJyVrYWlub3MubHQlJyBPUiBtLm1ldGFfdmFsdWUgTElLRSAnJWthaW5vdGVrYSUnKQogICAgICAgIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIE9OIG9pLm9yZGVyX2lkPW8uaWQgQU5EIG9pLm9yZGVyX2l0ZW1fdHlwZT0nbGluZV9pdGVtJyBKT0lOIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBwbSBPTiBwbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIHBtLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgcW0gT04gcW0ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkIEFORCBxbS5tZXRhX2tleT0nX3F0eScKICAgICAgICBMRUZUIEpPSU4geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9cG0ubWV0YV92YWx1ZSBMRUZUIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcgTEVGVCBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkCiAgICAgICAgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA4JyBHUk9VUCBCWSB0Lm5hbWUgT1JERVIgQlkgdXpzIERFU0MiLEFSUkFZX0EpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-172616';
const GKEY='ps_s1697';
const PHASES=["1", "2"];
const OUT='analize/s1697_mb.json';
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
