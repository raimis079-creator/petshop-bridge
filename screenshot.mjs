process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0cSBTdXBlciBDYWNoZSBFeHBlcnQgZHJ5OiBzdWdlbmVydW90b3MgbW9kX3Jld3JpdGUgdGFpc3lrbGVzLCAuaHRhY2Nlc3MgZGFiYXIsIGNhY2hlIGNvbmZpZywgV0Mgc2xhcHVrYWkgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNHEyJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyNHEyJ107IEBzZXRfdGltZV9saW1pdCgxMjApOyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvbWlzYy5waHAnOyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvZmlsZS5waHAnOwogIHRyeXsKICAgICRodD1BQlNQQVRILicuaHRhY2Nlc3MnOyAkcz1maWxlX2dldF9jb250ZW50cygkaHQpOyAkclsnaHRhY2Nlc3MnXT0kczsgJHJbJ2h0X21kNSddPW1kNSgkcyk7ICRyWydodF9sZW4nXT1zdHJsZW4oJHMpOwogICAgaWYoIWZ1bmN0aW9uX2V4aXN0cygnd3BzY19nZXRfaHRhY2Nlc3NfaW5mbycpKXsgZm9yZWFjaChbV1BfUExVR0lOX0RJUi4nL3dwLXN1cGVyLWNhY2hlL3dwLWNhY2hlLnBocCddIGFzICRmeCl7fSB9CiAgICAkY2FuZD1bV1BfUExVR0lOX0RJUi4nL3dwLXN1cGVyLWNhY2hlL2luYy9odGFjY2Vzcy5waHAnLCBXUF9QTFVHSU5fRElSLicvd3Atc3VwZXItY2FjaGUvd3AtY2FjaGUucGhwJ107CiAgICBmb3JlYWNoKCRjYW5kIGFzICRmeCl7IGlmKGlzX2ZpbGUoJGZ4KSkgJHJbJ3dwc2NfZmlsZXMnXVtdPWJhc2VuYW1lKCRmeCk7IH0KICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BzY19nZXRfaHRhY2Nlc3NfaW5mbycpKXsgJGk9d3BzY19nZXRfaHRhY2Nlc3NfaW5mbygpOyAkclsncnVsZXMnXT0kaVsncnVsZXMnXT8/bnVsbDsgJHJbJ2d6aXBydWxlcyddPSRpWydnemlwcnVsZXMnXT8/bnVsbDsgJHJbJ2luZm9fa2V5cyddPWFycmF5X2tleXMoJGkpOyB9CiAgICBlbHNlIHsgJHJbJ3dwc2NfZ2V0X2h0YWNjZXNzX2luZm8nXT0nTkVSQSc7ICRmbj1nZXRfZGVmaW5lZF9mdW5jdGlvbnMoKVsndXNlciddOyAkclsnd3BzY19mbiddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJGZuLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RycG9zKCR4LCdodGFjY2VzcycpIT09ZmFsc2V8fHN0cnBvcygkeCwnbW9kX3Jld3JpdGUnKSE9PWZhbHNlO30pKTsgfQogICAgZ2xvYmFsICR3cF9jYWNoZV9tb2RfcmV3cml0ZSwkY2FjaGVfZW5hYmxlZCwkc3VwZXJfY2FjaGVfZW5hYmxlZCwkd3BfY2FjaGVfbm90X2xvZ2dlZF9pbiwkY2FjaGVfbWF4X3RpbWUsJHdwX2NhY2hlX25vX2NhY2hlX2Zvcl9nZXQsJGNhY2hlX3JlYnVpbGRfZmlsZXMsJHdwX2NhY2hlX21vYmlsZV9lbmFibGVkLCR3cF9jYWNoZV9tb2JpbGVfYnJvd3NlcnMsJHdwX2NhY2hlX2NvbmZpZ19maWxlLCRjYWNoZV9wYXRoLCR3cF9jYWNoZV9ob21lX3BhdGgsJHdwc2NfdmVyc2lvbjsKICAgICRyWydjZmcnXT1jb21wYWN0KCd3cF9jYWNoZV9tb2RfcmV3cml0ZScsJ2NhY2hlX2VuYWJsZWQnLCdzdXBlcl9jYWNoZV9lbmFibGVkJywnd3BfY2FjaGVfbm90X2xvZ2dlZF9pbicsJ2NhY2hlX21heF90aW1lJywnd3BfY2FjaGVfbm9fY2FjaGVfZm9yX2dldCcsJ2NhY2hlX3JlYnVpbGRfZmlsZXMnLCd3cF9jYWNoZV9tb2JpbGVfZW5hYmxlZCcsJ2NhY2hlX3BhdGgnLCd3cF9jYWNoZV9ob21lX3BhdGgnLCd3cHNjX3ZlcnNpb24nKTsKICAgICRyWydyZWplY3RlZF9jb29raWVzJ109ZnVuY3Rpb25fZXhpc3RzKCd3cHNjX2dldF9yZWplY3RlZF9jb29raWVzJyk/d3BzY19nZXRfcmVqZWN0ZWRfY29va2llcygpOiduZXJhIGYtam9zJzsgJHJbJ2Nvb2tpZV9maWx0ZXInXT1hcHBseV9maWx0ZXJzKCd3cHNjX3JlamVjdGVkX2Nvb2tpZXMnLFtdKTsKICAgICRyWydwbHVnaW5zX3dwc2MnXT1nbG9iKFdQX1BMVUdJTl9ESVIuJy93cC1zdXBlci1jYWNoZS9wbHVnaW5zLyoucGhwJyk7ICRyWydwbHVnaW5zX3dwc2MnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJywkclsncGx1Z2luc193cHNjJ10pOwogICAgZ2xvYmFsICR3cF9jYWNoZV9wbHVnaW5zX2RpcjsgJHJbJ3dwc2NfcGx1Z2luc19kaXInXT0kd3BfY2FjaGVfcGx1Z2luc19kaXI/P251bGw7ICRyWyd3cHNjX3djX3BsdWdpbl9lbmFibGVkJ109ZnVuY3Rpb25fZXhpc3RzKCd3cHNjX2dldF9wbHVnaW5zJyk/bnVsbDpudWxsOwogICAgJHJbJ3BsdWdpbnNfZW5hYmxlZF9vcHQnXT1nZXRfb3B0aW9uKCd3cHNjX3BsdWdpbnMnKTsKICAgICRyWydzdXBlcmNhY2hlX3BzbCddPWNvdW50KGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlL3BldHNob3AubHQvKi9pbmRleC1odHRwcy5odG1sJyk/OltdKTsKICAgICRyWydiYWtfeXJhJ109aXNfZmlsZShkaXJuYW1lKHVudHJhaWxpbmdzbGFzaGl0KEFCU1BBVEgpKS4nL3BzLWFyY2h5dmFzLy5odGFjY2Vzcy5iYWtfczE3MjQnKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-104720';
const GKEY='ps_s1724q2';
const PHASES=["1"];
const OUT='analize/s1724_q2.json';
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
