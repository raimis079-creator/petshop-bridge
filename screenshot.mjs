process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk3YyB2YXJpYWNpanUgQVYgbGlrdXRpcy9wYXJ0aWpvcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3OTdjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc5N2MnXTsKICB0cnl7CiAgICAkaWRzPVsxNjE4NSwzNDMyNSwzNDMyNiwzNDMyNywzNDMyOCwzNDMyOV07ICRpbj1pbXBsb2RlKCcsJywkaWRzKTsKICAgICRyWydzb3VyY2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQgSU4oJGluKSIsQVJSQVlfQSk7CiAgICAkclsncGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXBzX3BhcnRpam9zIFdIRVJFIHByb2R1Y3RfaWQgSU4oJGluKSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICAkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX2F2X3p1cm5hbGFzIik7ICRyWyd6dXJuX2NvbHMnXT0kY29sczsgJHBjPWluX2FycmF5KCdwcm9kdWN0X2lkJywkY29scyk/J3Byb2R1Y3RfaWQnOihpbl9hcnJheSgncGlkJywkY29scyk/J3BpZCc6bnVsbCk7CiAgICBpZigkcGMpICRyWydhdl96dXJuYWxhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfYXZfenVybmFsYXMgV0hFUkUgeyRwY30gSU4oJGluKSBPUkRFUiBCWSAxIERFU0MgTElNSVQgNjAiLEFSUkFZX0EpOwogICAgJG93bj1bXTsgZm9yZWFjaCgkaWRzIGFzICRpKXsgJG93blskaV09Wydfb3duX3N0b2NrX3F0eSc9PmdldF9wb3N0X21ldGEoJGksJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwnX3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkaSwnX3N0b2NrJyx0cnVlKSwnX3BzX3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgkaSwnX3BzX3NhbmRlbGlzJyx0cnVlKV07IH0gJHJbJ21ldGEnXT0kb3duOwogICAgJG11PVdQTVVfUExVR0lOX0RJUi4nLyc7IGZvcmVhY2goWydwZXRzaG9wLWF2LXJlZHVjZS5waHAnLCdwZXRzaG9wLWF2LXN0b2NrLnBocCcsJ3BldHNob3AtcGFydGlqb3MucGhwJywncGV0c2hvcC1yZXplcnZhY2lqYS1hdi5waHAnLCdwZXRzaG9wLWF2LXNvdXJjZS5waHAnXSBhcyAkZil7ICRyWydzcmMnXVskZl09YmFzZTY0X2VuY29kZShnemNvbXByZXNzKGZpbGVfZ2V0X2NvbnRlbnRzKCRtdS4kZiksOSkpOyB9CiAgICAvLyBraXRpIHV6c2FreW1haSBzdSB2YXJpYWNpam9taXMgcGFza3V0aW5lcyAzMCBkLgogICAgJHJbJ3Zhcl91enMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvaS5vcmRlcl9pZCwgb2kub3JkZXJfaXRlbV9uYW1lLCBtLm1ldGFfdmFsdWUgdmlkIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gT04gbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG0ubWV0YV9rZXk9J192YXJpYXRpb25faWQnIEFORCBtLm1ldGFfdmFsdWU+MCBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPW9pLm9yZGVyX2lkIFdIRVJFIG8uZGF0ZV9jcmVhdGVkX2dtdD5EQVRFX1NVQihOT1coKSxJTlRFUlZBTCA0NSBEQVkpIE9SREVSIEJZIG9pLm9yZGVyX2lkIERFU0MgTElNSVQgNDAiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-165001';
const GKEY='ps_s1797c';
const PHASES=["1"];
const OUT='analize/s1797c.json';
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
