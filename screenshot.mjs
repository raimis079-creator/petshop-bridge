process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc5IHBhcnRpanUgbmVhdGl0aWtpbWFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmwzJ10pPyRfR0VUWydwc19ibDMnXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjc5Jywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsgJHRwPSR3cGRiLT5wcmVmaXguJ3BzX3BhcnRpam9zJzsKICB0cnl7CiAgICAkb1snc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJERVNDIGAkdHBgIiwwKTsKICAgICRvWydwYXJ0aWp1X3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRwYCIpOwogICAgLy8ga29ua3JldGkgcHJla2UKICAgICRpZD0xNjE2NTsKICAgICRvWydwcmVrZSddPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+Z2V0X3RoZV90aXRsZSgkaWQpLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksCiAgICAgICdzdG9jayc9PmdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2snLHRydWUpLCdzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLAogICAgICAnb3duJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwndmYnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3ZmX3F0eScsdHJ1ZSksJ3piJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ196Yl9xdHknLHRydWUpKTsKICAgICRvWydqb3NfcGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00gYCR0cGAgV0hFUkUgcHJla2VzX2lkPSVkIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTAiLCRpZCksQVJSQVlfQSk7CiAgICAvLyBCZW5kcmEgYXBpbXRpczogQVYgcHJla2VzLCBrdXJpdSBfc3RvY2sgPiBwYXJ0aWp1IGxpa3VjaW8KICAgICRzdHVscD0kb1snc3R1bHBlbGlhaSddOwogICAgJGxpa0NvbD1udWxsOyBmb3JlYWNoKGFycmF5KCdsaWt1dGlzJywna2lla2lzJywnbGlrbycsJ3F0eScpIGFzICRjKSBpZihpbl9hcnJheSgkYywkc3R1bHApKXskbGlrQ29sPSRjO2JyZWFrO30KICAgICRwcmVrQ29sPW51bGw7IGZvcmVhY2goYXJyYXkoJ3ByZWtlc19pZCcsJ3Byb2R1Y3RfaWQnLCdwcmVrZV9pZCcpIGFzICRjKSBpZihpbl9hcnJheSgkYywkc3R1bHApKXskcHJla0NvbD0kYzticmVhazt9CiAgICAkb1snc3R1bHBlbGlhaV9uYXVkb2phbWknXT1hcnJheSgnbGlrdXRpcyc9PiRsaWtDb2wsJ3ByZWtlJz0+JHByZWtDb2wpOwogICAgaWYoJGxpa0NvbCAmJiAkcHJla0NvbCl7CiAgICAgICRzcWw9IlNFTEVDVCBwLklELCBDQVNUKHBtLm1ldGFfdmFsdWUgQVMgU0lHTkVEKSBzdG9jaywgQ09BTEVTQ0UoU1VNKHQuYCRsaWtDb2xgKSwwKSBwYXJ0aWpvc2UKICAgICAgICAgICAgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICAgICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3N0b2NrJwogICAgICAgICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNkIE9OIHNkLnBvc3RfaWQ9cC5JRCBBTkQgc2QubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHNkLm1ldGFfdmFsdWU9J2F2JwogICAgICAgICAgICBMRUZUIEpPSU4gYCR0cGAgdCBPTiB0LmAkcHJla0NvbGA9cC5JRAogICAgICAgICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgICAgICAgIEdST1VQIEJZIHAuSUQKICAgICAgICAgICAgSEFWSU5HIHN0b2NrID4gcGFydGlqb3NlIjsKICAgICAgJHI9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7CiAgICAgICRvWyduZXN1dGFtcGFfc2snXT1jb3VudCgkcik7CiAgICAgICRvWyduZXN1dGFtcGFfc3VtYSddPWFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnc3RvY2snXS0keFsncGFydGlqb3NlJ107fSwkcikpOwogICAgICB1c29ydCgkcixmdW5jdGlvbigkYSwkYil7cmV0dXJuICgkYlsnc3RvY2snXS0kYlsncGFydGlqb3NlJ10pLSgkYVsnc3RvY2snXS0kYVsncGFydGlqb3NlJ10pO30pOwogICAgICAkb1sndG9wMjAnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gYXJyYXkoJ2lkJz0+JHhbJ0lEJ10sJ3Bhdic9PnN1YnN0cihnZXRfdGhlX3RpdGxlKCR4WydJRCddKSwwLDQ1KSwnc3RvY2snPT4keFsnc3RvY2snXSwncGFydGlqb3NlJz0+JHhbJ3BhcnRpam9zZSddLCdza2lydHVtYXMnPT4keFsnc3RvY2snXS0keFsncGFydGlqb3NlJ10pOyB9LGFycmF5X3NsaWNlKCRyLDAsMjApKTsKICAgICAgJG9bJ2F2X3ByZWtpdV92aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIG1ldGFfdmFsdWU9J2F2JyIpOwogICAgfQogICAgLy8gQXIgYnV2byBkYXVnaWF1IHRva2l1IGlzcGVqaW11IHV6c2FreW11b3NlCiAgICAkdD0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcnMnOwogICAgJG9bJ3V6c2FreW11J109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-083637';
const GKEY='ps_bl3';
const PHASES=["R"];
const OUT='analize/s1679_r.json';
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
