process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2cnAgcnl0YXMgdjEuMTEgYmVzdHNlbGVyaWFpIGJlIGxpa3VjaW8gKDEgZHJ5LCAyIGFwcGx5LCAzIHZlcmlmeSwgOSByZXN0b3JlKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MTZycCddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE4MTZycCddOyAkcj1bJ3YnPT4nUzE4MTZycCcsJ2ZhemUnPT4kZl07CiAgJEY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXRhcy5waHAnOyAkQkFLPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy9wZXRzaG9wLXJ5dGFzLnBocC5iYWtfczE4MTYnOyAkcz1maWxlX2dldF9jb250ZW50cygkRik7ICRyWydtZDUnXT1tZDUoJHMpOwogICRBTkNIPSJcdFx0LyogbmVpxaFzacWzc3RpICovXG5cdFx0XCRuID0gc2VsZjo6bmVpc3NpdXN0aV9zaygpOyI7CiAgJE5FVyA9IDw8PCdORVdFT0YnCgkJLyogYmVzdHNlbGVyaWFpIGJlIGxpa3XEjWlvIChTMTgxNiwgMjAyNi0xMS0wMiwgUmFpbWlvIOKAnmRhcm9t4oCcKTogdG9wIDE1MCBwcmVracWzIHBhZ2FsIHXFvnNha3ltdXMgcGVyIDYwIGQuIChtxatzxbMgZmFrdGFpKSwga3VyaW9zIGRhYmFyIE5FIOKAnnlyYSBzYW5kxJdseWpl4oCcIGFyYmEgbmVwdWJsaWt1b3Rvcy9wYXNsxJdwdG9zLiBUaWsgQVYgKHNhdm8gc2FuZMSXbGlzKSDigJQgZHJvcHNoaXAgbGlrdcSNaXVzIHR2YXJrbyBpbXBvcnRhcy4gUmF1ZG9uYSDiiaUgNSwgZ2VsdG9uYSDiiaUgMS4gKi8KCQl0cnkgewoJCQkkZV8gPSBzZWxmOjplKCk7ICR1XyA9IHNlbGY6OnUoKTsKCQkJJHRvcF8gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoICR3cGRiLT5wcmVwYXJlKAoJCQkJIlNFTEVDVCBlLnByZWtlX2lkIHBpZCwgZS52YXJpYWNpamFfaWQgdmlkLCBDT1VOVChESVNUSU5DVCBlLnV6c2FreW1hc19pZCkgdXpzLCBTVU0oZS5raWVraXMpIGsKCQkJCSBGUk9NICRlXyBlIEpPSU4gJHVfIHUgT04gdS51enNha3ltYXNfaWQgPSBlLnV6c2FreW1hc19pZCBBTkQgdS5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOICgnY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgIiAuIHN0cl9yZXBsYWNlKCAndS4nLCAndS4nLCBzZWxmOjp0cygpICkgLiAiCgkJCQkgV0hFUkUgZS5kaWVuYSA+PSAlcyBHUk9VUCBCWSAxLCAyIE9SREVSIEJZIHV6cyBERVNDIExJTUlUIDE1MCIsIHNlbGY6OnByaWVzX2QoIDYwICkgKSwgQVJSQVlfQSApOwoJCQkkYmVfID0gYXJyYXkoKTsgJG5fID0gMDsKCQkJZm9yZWFjaCAoIChhcnJheSkgJHRvcF8gYXMgJHhfICkgewoJCQkJJGlkXyA9IChpbnQpICggJHhfWyd2aWQnXSA/ICR4X1sndmlkJ10gOiAkeF9bJ3BpZCddICk7ICRwcl8gPSB3Y19nZXRfcHJvZHVjdCggJGlkXyApOyBpZiAoICEgJHByXyApIHsgY29udGludWU7IH0gJG5fKys7CgkJCQlpZiAoICdhdicgIT09IChzdHJpbmcpIGdldF9wb3N0X21ldGEoIChpbnQpICR4X1sncGlkJ10sICdfcHNfc2FuZGVsaXMnLCB0cnVlICkgKSB7IGNvbnRpbnVlOyB9CgkJCQlpZiAoICdpbnN0b2NrJyAhPT0gJHByXy0+Z2V0X3N0b2NrX3N0YXR1cygpIHx8ICdwdWJsaXNoJyAhPT0gZ2V0X3Bvc3Rfc3RhdHVzKCAoaW50KSAkeF9bJ3BpZCddICkgfHwgJ2hpZGRlbicgPT09ICRwcl8tPmdldF9jYXRhbG9nX3Zpc2liaWxpdHkoKSApIHsKCQkJCQkkYmVfW10gPSAnIycgLiAoaW50KSAkeF9bJ3BpZCddIC4gJyAnIC4gbWJfc3Vic3RyKCAkcHJfLT5nZXRfbmFtZSgpLCAwLCAzNCApIC4gJyAoJyAuIChpbnQpICR4X1sndXpzJ10gLiAnIHXFvnMuKSc7CgkJCQl9CgkJCX0KCQkJJGFkZCggJ2Jlc3RzZWxlcmlhaV9saWt1dGlzJywgY291bnQoICRiZV8gKSA+PSA1ID8gJ3JhdWRvbmEnIDogKCAkYmVfID8gJ2dlbHRvbmEnIDogJ3phbGlhJyApLCAnQmVzdHNlbGVyaWFpICh0b3AgJyAuICRuXyAuICcsIEFWKSBiZSBsaWt1xI1pbzogJyAuIGNvdW50KCAkYmVfICkgLiAoICRiZV8gPyAnIOKAlCAnIC4gaW1wbG9kZSggJzsgJywgYXJyYXlfc2xpY2UoICRiZV8sIDAsIDYgKSApIC4gKCBjb3VudCggJGJlXyApID4gNiA/ICc7IOKApicgOiAnJyApIDogJycgKSApOwoJCX0gY2F0Y2ggKCBcVGhyb3dhYmxlICRlXyApIHsgJGFkZCggJ2Jlc3RzZWxlcmlhaV9saWt1dGlzJywgJ3BpbGthJywgJ0Jlc3RzZWxlcmlhaSBiZSBsaWt1xI1pbzogJyAuICRlXy0+Z2V0TWVzc2FnZSgpICk7IH0KCk5FV0VPRjsKICAkT1Y9IiAqIFZlcnNpb246IDEuMTBcbiI7ICROVj0iICogVmVyc2lvbjogMS4xMVxuICogdjEuMTEgKFMxODE2LCAyMDI2LTExLTAyKTogcGF0aWtyYSBgYmVzdHNlbGVyaWFpX2xpa3V0aXNgIOKAlCB0b3AgMTUwIHByZWtpxbMgKDYwIGQuKSBpxaEgQVYgc2FuZMSXbGlvIGJlIGxpa3XEjWlvOyByYXVkb25hIOKJpSA1LlxuIjsKICAkclsncmFzdGEnXT1bc3Vic3RyX2NvdW50KCRzLCRBTkNIKSxzdWJzdHJfY291bnQoJHMsJE9WKV07ICRyWydqYXUnXT1zdHJwb3MoJHMsJ2Jlc3RzZWxlcmlhaV9saWt1dGlzJykhPT1mYWxzZTsKICBpZigkZj09PSdMJyl7ICRuPXN0cl9yZXBsYWNlKCRBTkNILCRORVcuJEFOQ0gsJHMpOyAkbj1zdHJfcmVwbGFjZSgkT1YsJE5WLCRuKTsgJG49c3RyX3JlcGxhY2UoJ1BldHNob3BfUnl0YXMnLCdQZXRzaG9wX1J5dGFzX0xpbnRTMTgxNicsJG4pOyAkbj1wcmVnX3JlcGxhY2UoJyNQZXRzaG9wX1J5dGFzX0xpbnRTMTgxNjo6aW5pdFwoXCk7PyMnLCcnLCRuKTsgJHRtcD1kaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMvLmxpbnRfczE4MTYucGhwJzsgZmlsZV9wdXRfY29udGVudHMoJHRtcCwkbik7IHRyeXsgaW5jbHVkZSAkdG1wOyAkclsnbGludCddPSdPSyc7ICRyWydrbGFzZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9SeXRhc19MaW50UzE4MTYnKTsgJHJbJ21ldG9kYXMnXT1tZXRob2RfZXhpc3RzKCdQZXRzaG9wX1J5dGFzX0xpbnRTMTgxNicsJ3BhdGlrcm9zJyk7IH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJHJbJ2xpbnQnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCkuJyBlaWwuICcuJGUtPmdldExpbmUoKTsgfSBAdW5saW5rKCR0bXApOyB9CiAgaWYoJGY9PT0nMicpeyBpZigkclsnamF1J118fCRyWydyYXN0YSddIT09WzEsMV0peyAkclsna2xhaWRhJ109J25lcmFzdGEgYXJiYSBqYXUgaWRpZWd0YSc7IH0gZWxzZSB7IGlmKCFpc19maWxlKCRCQUspKSBjb3B5KCRGLCRCQUspOyAkbj1zdHJfcmVwbGFjZSgkQU5DSCwkTkVXLiRBTkNILCRzKTsgJG49c3RyX3JlcGxhY2UoJE9WLCROViwkbik7IGZpbGVfcHV0X2NvbnRlbnRzKCRGLCRuKTsgY2xlYXJzdGF0Y2FjaGUoKTsgJHJbJ3BvX21kNSddPW1kNV9maWxlKCRGKTsgJHJbJ2JhayddPW1kNV9maWxlKCRCQUspOyAgfSB9CiAgaWYoJGY9PT0nMycpeyAkdDA9bWljcm90aW1lKHRydWUpOyAkcHQ9UGV0c2hvcF9SeXRhczo6cGF0aWtyb3MoKTsgJHJbJ3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQwLDEpOyAkclsnbiddPWNvdW50KCRwdCk7IGZvcmVhY2goJHB0IGFzICR4KXsgaWYoJHhbJ2tvZGFzJ109PT0nYmVzdHNlbGVyaWFpX2xpa3V0aXMnKSAkclsnbmF1amEnXT0keDsgfSAkclsncmF1ZG9ub3MnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRwdCxmbigkeCk9PiR4WydseWdpcyddPT09J3JhdWRvbmEnKSk7ICRyWydvcHQnXT1nZXRfb3B0aW9uKCdwc19yeXRhc19zYXJnYXNfcGFzaycpOyB9CiAgaWYoJGY9PT0nOScpeyBpZihpc19maWxlKCRCQUspKXsgY29weSgkQkFLLCRGKTsgY2xlYXJzdGF0Y2FjaGUoKTsgJHJbJ2F0a3VydGEnXT1tZDVfZmlsZSgkRik7fSB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsKZnVuY3Rpb24gc2hlbGxfZXhlY19pc19kaXNhYmxlZCgpeyByZXR1cm4gdHJ1ZTsgfQo=';
const VER='dep-124757';
const GKEY='ps_s1816rp';
const PHASES=["2", "3"];
const OUT='analize/s1816_rp.json';
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
