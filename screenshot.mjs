process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDggcnVuIGUzc3RvcDQg4oCUIFNUT1A6IG3Fq3PFsyBlbC4gcGHFoXRvIHNpc3RlbWEgKHBzX2VtYWlsX2pvYnMgLyBwc19ldmVudF9sb2cg4oaSIFNlbmRlcikgcG8gVDMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTNzdG9wNCddKSkgcmV0dXJuOwogICRmPXN0cnRvdXBwZXIoc2FuaXRpemVfa2V5KCRfR0VUWydwc19lM3N0b3A0J10pKTsgJG89YXJyYXkoJ2YnPT4kZik7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjAwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJG9bJ2pvYnNfM2gnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LHN0YXR1cyxDT1VOVCgqKSBuIEZST00geyRwfXBzX2VtYWlsX2pvYnMgV0hFUkUgY3JlYXRlZF9hdD5EQVRFX1NVQihVVENfVElNRVNUQU1QKCksSU5URVJWQUwgNCBIT1VSKSBHUk9VUCBCWSBmbG93LHN0YXR1cyIsQVJSQVlfQSk7CiAgJG9bJ2pvYnNfc2VudF9wZXJfbWluJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURV9GT1JNQVQoc2VudF9hdCwnJUg6JWknKSBtLENPVU5UKCopIG4gRlJPTSB7JHB9cHNfZW1haWxfam9icyBXSEVSRSBzZW50X2F0PkRBVEVfU1VCKFVUQ19USU1FU1RBTVAoKSxJTlRFUlZBTCA0IEhPVVIpIEdST1VQIEJZIG0gT1JERVIgQlkgbSIsQVJSQVlfQSk7CiAgJG9bJ2V2ZW50c18zaCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGV2ZW50X25hbWUsc3RhdHVzLGFkYXB0ZXJfbmFtZSxDT1VOVCgqKSBuIEZST00geyRwfXBzX2V2ZW50X2xvZyBXSEVSRSBlbWl0dGVkX2F0PkRBVEVfU1VCKFVUQ19USU1FU1RBTVAoKSxJTlRFUlZBTCA0IEhPVVIpIEdST1VQIEJZIGV2ZW50X25hbWUsc3RhdHVzLGFkYXB0ZXJfbmFtZSIsQVJSQVlfQSk7CiAgJG9bJ3BlbmRpbmdfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsam9iX2tleSxmbG93LHN0YXR1cyxzY2hlZHVsZWRfYXQsbmV4dF9hdHRlbXB0X2F0LGF0dGVtcHRzIEZST00geyRwfXBzX2VtYWlsX2pvYnMgV0hFUkUgc3RhdHVzPSdwZW5kaW5nJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDUiLEFSUkFZX0EpOwogICRvWydwZW5kaW5nX3QzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBzX2VtYWlsX2pvYnMgV0hFUkUgc3RhdHVzPSdwZW5kaW5nJyBBTkQgKGpvYl9rZXkgUkVHRVhQICdfKDM1KDRbNS05XVswLTldfFs1LTZdWzAtOV1bMC05XXw3WzAtNl1bMC05XXw3NzB8NzcxfDc3Mnw3NzMpKSQnKSIpOwogIGlmKCRmPT09J1NUT1AnKXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGpvYl9rZXkscGF5bG9hZCBGUk9NIHskcH1wc19lbWFpbF9qb2JzIFdIRVJFIHN0YXR1cz0ncGVuZGluZyciLEFSUkFZX0EpOyAkYz0wOwogICAgZm9yZWFjaCgkcm93cyBhcyAkcil7ICRwbD1qc29uX2RlY29kZSgkclsncGF5bG9hZCddLHRydWUpOyAkb2lkPShpbnQpKCRwbFsnb3JkZXJfaWQnXT8/MCk7IGlmKCEkb2lkJiZwcmVnX21hdGNoKCcvXyhcZHs1fSkkLycsJHJbJ2pvYl9rZXknXSwkbSkpICRvaWQ9KGludCkkbVsxXTsgaWYoJG9pZCYmKCgkb2lkPj0zNTQ1MSYmJG9pZDw9MzU3NzMpfHwhd2NfZ2V0X29yZGVyKCRvaWQpKSl7ICR3cGRiLT51cGRhdGUoInskcH1wc19lbWFpbF9qb2JzIixhcnJheSgnc3RhdHVzJz0+J3NraXBwZWQnLCdza2lwX3JlYXNvbic9PidTMTYwOCBUMyB0ZXN0YXMg4oCUIHXFvnNha3ltYXMgacWhdHJpbnRhcy90ZXN0aW5pcycsJ3VwZGF0ZWRfYXQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyx0cnVlKSksYXJyYXkoJ2lkJz0+JHJbJ2lkJ10pKTsgJGMrKzsgfSB9CiAgICAkb1snYXRzYXVrdGEnXT0kYzsgJG9bJ3BlbmRpbmdfcG8nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfZW1haWxfam9icyBXSEVSRSBzdGF0dXM9J3BlbmRpbmcnIik7CiAgICAkb1snY3Jvbl9wYWxlaXN0YXMnXT13cF9uZXh0X3NjaGVkdWxlZCgncHNfZW1haWxfZGlzcGF0Y2hfY3JvbicpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-180533';
const GKEY='ps_e3stop4';
const PHASES=["STOP"];
const OUT='analize/e3_stop4.json';
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
