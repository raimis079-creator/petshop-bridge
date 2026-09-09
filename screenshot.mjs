process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg0IHRlc3RhcyB2MiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JsZyddKT8kX0dFVFsncHNfYmxnJ106JycpIT09J1QnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY4NFQyJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgICAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSRhZG1bMF0pOwogICAgYWRkX2ZpbHRlcignd3BfZG9pbmdfYWpheCcsJ19fcmV0dXJuX3RydWUnLDk5KTsKICAgICRoPWZ1bmN0aW9uKCl7IHJldHVybiBmdW5jdGlvbigkbSwkdD0nJywkYT1hcnJheSgpKXsgdGhyb3cgbmV3IEV4Y2VwdGlvbignV1BESUUnKTsgfTsgfTsKICAgIGFkZF9maWx0ZXIoJ3dwX2RpZV9hamF4X2hhbmRsZXInLCRoLDk5KTsKICAgICRrdj1mdW5jdGlvbigkcG9zdCl7CiAgICAgICRfUE9TVD0kcG9zdDsgJF9SRVFVRVNUPSRwb3N0OwogICAgICBvYl9zdGFydCgpOwogICAgICB0cnl7IFBldHNob3BfS2F0YWxvZ2FzOjphamF4X3BhcnRpamEoKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fQogICAgICAkb3V0PW9iX2dldF9jbGVhbigpOwogICAgICAkaj1qc29uX2RlY29kZSgkb3V0LHRydWUpOwogICAgICByZXR1cm4gJGohPT1udWxsPyRqOmFycmF5KCdSQVcnPT5zdWJzdHIoJG91dCwwLDE2MCkpOwogICAgfTsKICAgICRsZW50PVBldHNob3BfUGFydGlqb3M6OmxlbnRlbGUoKTsKICAgICRwYXJ0PTQwNzM7CiAgICAkcD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSBgJGxlbnRgIFdIRVJFIGlkPSVkIiwkcGFydCksQVJSQVlfQSk7CiAgICAkcGlkPShpbnQpJHBbJ3Byb2R1Y3RfaWQnXTsKICAgICRvWyd0ZXN0aW5lJ109YXJyYXkoJ3BhcnRpamEnPT4kcGFydCwncHJla2UnPT4kcGlkLCdwYXYnPT5zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLDAsNDApLAogICAgICAnZ2F1dGEnPT4oaW50KSRwWydraWVraXNfZ2F1dGFzJ10sJ2xpa28nPT4oaW50KSRwWydraWVraXNfbGlrbyddLCdzYXYnPT4kcFsnc2F2aWthaW5hX2V1ciddLCdnYWwnPT4kcFsnZ2VyaWF1c2lhX2lraSddKTsKICAgICRuPXdwX2NyZWF0ZV9ub25jZSgncHNfa2F0Jyk7CiAgICAkYj1hcnJheSgnYWN0aW9uJz0+J3BzX2thdF9wYXJ0aWphJywnbm9uY2UnPT4kbiwncGFydCc9PiRwYXJ0LCdpZCc9PiRwaWQpOwogICAgJHQ9YXJyYXkoKTsKICAgICR0WycxX2RhdGFfYmxvZ2EnXT0ka3YoJGIrYXJyYXkoJ2xhdWthcyc9PidnZXJpYXVzaWFfaWtpJywncmVpa3NtZSc9PicyMDI3LTAyLTMxJykpOwogICAgJHRbJzJfZGF0YV9mb3JtYXRhcyddPSRrdigkYithcnJheSgnbGF1a2FzJz0+J2dlcmlhdXNpYV9pa2knLCdyZWlrc21lJz0+JzIwMjcvMDkvMzAnKSk7CiAgICAkdFsnM19saWt1dGlzX3Blcl9kaWRlbGlzJ109JGt2KCRiK2FycmF5KCdsYXVrYXMnPT4na2lla2lzX2xpa28nLCdyZWlrc21lJz0+KHN0cmluZykoKGludCkkcFsna2lla2lzX2dhdXRhcyddKzUpKSk7CiAgICAkdFsnNF9saWt1dGlzX25lc2thaWNpdXMnXT0ka3YoJGIrYXJyYXkoJ2xhdWthcyc9PidraWVraXNfbGlrbycsJ3JlaWtzbWUnPT4nYWJjJykpOwogICAgJHRbJzVfc2F2aWthaW5hX25laWdpYW1hJ109JGt2KCRiK2FycmF5KCdsYXVrYXMnPT4nc2F2aWthaW5hX2V1cicsJ3JlaWtzbWUnPT4nLTUnKSk7CiAgICAkdFsnNl9zdmV0aW1hc19sYXVrYXMnXT0ka3YoJGIrYXJyYXkoJ2xhdWthcyc9Pid0aWVrZWphcycsJ3JlaWtzbWUnPT4nWCcpKTsKICAgICR0Wyc3X2tpdGFfcHJla2UnXT0ka3YoYXJyYXkoJ2FjdGlvbic9Pidwc19rYXRfcGFydGlqYScsJ25vbmNlJz0+JG4sJ3BhcnQnPT4kcGFydCwnaWQnPT45OTk5OTksJ2xhdWthcyc9PidraWVraXNfbGlrbycsJ3JlaWtzbWUnPT4nMScpKTsKICAgICR0Wyc4X25lcmFfcGFydGlqb3MnXT0ka3YoYXJyYXkoJ2FjdGlvbic9Pidwc19rYXRfcGFydGlqYScsJ25vbmNlJz0+JG4sJ3BhcnQnPT45OTk5OTk5OSwnaWQnPT4kcGlkLCdsYXVrYXMnPT4na2lla2lzX2xpa28nLCdyZWlrc21lJz0+JzEnKSk7CiAgICAvLyB0ZWlnaWFtaQogICAgJHRbJzlfc2F2aWthaW5hX2thYmxlbGl1J109JGt2KCRiK2FycmF5KCdsYXVrYXMnPT4nc2F2aWthaW5hX2V1cicsJ3JlaWtzbWUnPT4nOSw5OScpKTsKICAgICR0WycxMF9saWt1dGlzX21hemluYW0nXT0ka3YoJGIrYXJyYXkoJ2xhdWthcyc9PidraWVraXNfbGlrbycsJ3JlaWtzbWUnPT4oc3RyaW5nKW1heCgwLChpbnQpJHBbJ2tpZWtpc19saWtvJ10tMSkpKTsKICAgICR0WycxMV9kYXRhX3ZhbG9tJ109JGt2KCRiK2FycmF5KCdsYXVrYXMnPT4nZ2VyaWF1c2lhX2lraScsJ3JlaWtzbWUnPT4nJykpOwogICAgJG9bJ3Rlc3RhaSddPSR0OwogICAgJG9bJ2RiX3BvX3Rlc3R1J109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBraWVraXNfbGlrbyxzYXZpa2FpbmFfZXVyLGdlcmlhdXNpYV9pa2kgRlJPTSBgJGxlbnRgIFdIRVJFIGlkPSVkIiwkcGFydCksQVJSQVlfQSk7CiAgICAvLyBBVFNUQVRPTSBpIHByYWRpbmUgKFMxNjgyKSBidXNlbmE6IGdlcmlhdXNpYV9pa2kgYnV2byBOVUxMCiAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIlVQREFURSBgJGxlbnRgIFNFVCBraWVraXNfbGlrbz0lZCwgc2F2aWthaW5hX2V1cj0lZiwgZ2VyaWF1c2lhX2lraT1OVUxMIFdIRVJFIGlkPSVkIiwKICAgICAgKGludCkkcFsna2lla2lzX2xpa28nXSwoZmxvYXQpJHBbJ3NhdmlrYWluYV9ldXInXSwkcGFydCkpOwogICAgJG9bJ2F0c3RhdHl0YSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qga2lla2lzX2xpa28sc2F2aWthaW5hX2V1cixnZXJpYXVzaWFfaWtpIEZST00gYCRsZW50YCBXSEVSRSBpZD0lZCIsJHBhcnQpLEFSUkFZX0EpOwogICAgJG9bJ3p1cm5hbGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBsYWlrYXMsbGF1a2FzLHNlbmEsbmF1amEscGFzdGFiYSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2l2eWtpYWkgV0hFUkUgcHJvZHVjdF9pZD0lZCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLCRwaWQpLEFSUkFZX0EpOwogICAgJG9bJ3N2ZXRhaW5lJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-095113';
const GKEY='ps_blg';
const PHASES=["T"];
const OUT='analize/s1684_t2.json';
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
