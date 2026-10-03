process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ4YiBudW90cmF1a3UgbGVtcHV0ZSwgbGFpc2t1IHBhdXplLCBTZW5kZXIga2xhaWRvcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDhiJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc0OGInXTsKICAvLyAxLiBudW90cmF1a3Ugc2FyZ2FzCiAgJHJbJ29wYyddPVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclZm90byUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVudW90cmF1ayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV0aHVtYm5haWwlJyBMSU1JVCAxNSIpIGFzICRvKXsgJHY9Z2V0X29wdGlvbigkbyk7ICRyWydvcGMnXVskb109aXNfc2NhbGFyKCR2KT9tYl9zdWJzdHIoKHN0cmluZykkdiwwLDMwMCk6bWJfc3Vic3RyKHdwX2pzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsMTUwMCk7IH0KICAkaGl0cz1bXTsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGZpKXsgJHQ9ZmlsZV9nZXRfY29udGVudHMoJGZpKTsgaWYoc3RycG9zKCR0LCdwcmVrZXNfZm90bycpIT09ZmFsc2UgfHwgc3RycG9zKCR0LCdfdGh1bWJuYWlsX2lkJykhPT1mYWxzZSAmJiBzdHJwb3MoJHQsJ251aW10JykhPT1mYWxzZSl7IHByZWdfbWF0Y2goJyMvXCpcKi4qP1wqLyNzJywkdCwkbSk7ICRoaXRzW2Jhc2VuYW1lKCRmaSldPVtkYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGZpKSksbWJfc3Vic3RyKCRtWzBdPz8nJywwLDkwMCldOyB9IH0gJHJbJ2ZhaWxhaSddPSRoaXRzOwogICRpZHM9WzM1MzEwLDM1MzE4LDM1MzIwXTsgJHJbJ3ByZWtlcyddPVtdOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHJbJ3ByZWtlcyddWyRpZF09JHA/WyRwLT5nZXRfbmFtZSgpLCRwLT5nZXRfc3RhdHVzKCksJ3RodW1iPScuZ2V0X3Bvc3RfbWV0YSgkaWQsJ190aHVtYm5haWxfaWQnLHRydWUpLCdnYWw9Jy5nZXRfcG9zdF9tZXRhKCRpZCwnX3Byb2R1Y3RfaW1hZ2VfZ2FsbGVyeScsdHJ1ZSksJ21vZD0nLmdldF9wb3N0X2ZpZWxkKCdwb3N0X21vZGlmaWVkJywkaWQpLCdzcmM9Jy5nZXRfcG9zdF9tZXRhKCRpZCwnX2FjdGl2ZV9mdWxmaWxsbWVudF9zb3VyY2UnLHRydWUpXTonbmVyYSc7IH0KICAvLyAyLiBsYWlza3UgcGF1emUgaXIgMTQgZC4gcmliYQogICRyWydwYXV6ZSddPWdldF9vcHRpb24oJ3BzX2xpZmVjeWNsZV92YXJ0YWknLCcobmVyYSknKTsKICAkclsnYXRpZGV0aSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGZsb3csIENPVU5UKCopIG4sIE1JTihjcmVhdGVkX2F0KSBzZW5pYXVzaWFzX3N1a3VydGFzLCBST1VORChNQVgoVElNRVNUQU1QRElGRihIT1VSLGNyZWF0ZWRfYXQsVVRDX1RJTUVTVEFNUCgpKSkvMjQsMSkgbWF4X2Fteml1c19kLCBTVU0oVElNRVNUQU1QRElGRihIT1VSLGNyZWF0ZWRfYXQsVVRDX1RJTUVTVEFNUCgpKT49MTMqMjQpIHBlcl9wYXJhX3Bhc2liYWlncyBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIHN0YXR1cz0nZGVmZXJyZWQnIEFORCBza2lwX3JlYXNvbj0nbGlmZWN5Y2xlX3V6ZGFyeXRhJyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkclsncHAxNF9hcnRpbWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKHNjaGVkdWxlZF9hdCkgZCwgQ09VTlQoKikgbiwgUk9VTkQoQVZHKFRJTUVTVEFNUERJRkYoSE9VUixjcmVhdGVkX2F0LHNjaGVkdWxlZF9hdCkpLzI0LDEpIGFteml1c19rYWlfc3VwbGFudW90YV9kIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdz0ncG9zdF9wdXJjaGFzZV8xNGQnIEFORCBzdGF0dXM9J3BlbmRpbmcnIEFORCBzY2hlZHVsZWRfYXQ8VVRDX1RJTUVTVEFNUCgpK0lOVEVSVkFMIDUgREFZIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydleHBpcmVkX3BvX3BhdXplcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIHNraXBfcmVhc29uPSdkZWZlcnJhbF9leHBpcmVkJyBBTkQgZGVjaXNpb25fYXQ+PScyMDI2LTEwLTAyIDA3OjUzOjAwJyIpOwogIC8vIDMuIFNlbmRlciBrbGFpZG9zCiAgJHJbJ2tsYWlkb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LHN0YXR1cyxMRUZUKENPQUxFU0NFKGxhc3RfZXJyb3IsJycpLDUwKSBlLENPVU5UKCopIG4sTUFYKHVwZGF0ZWRfYXQpIHBhc2sgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSB1cGRhdGVkX2F0Pj0nMjAyNi0xMC0wMiAwNzoyMDowMCcgQU5EIENPQUxFU0NFKGxhc3RfZXJyb3IsJycpPD4nJyBHUk9VUCBCWSAxLDIsMyIsQVJSQVlfQSk7CiAgJHJbJ2JhbmR5bWFpX3BvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdyxhdHRlbXB0cyxDT1VOVCgqKSBuIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgc2VudF9hdD49JzIwMjYtMTAtMDIgMDc6MjA6MDAnIEdST1VQIEJZIDEsMiIsQVJSQVlfQSk7CiAgLy8gNC4gIzEyNDMKICBmb3JlYWNoKHdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjQwLCd0eXBlJz0+J3Nob3Bfb3JkZXInLCdkYXRlX2NyZWF0ZWQnPT5zdHJ0b3RpbWUoJzIwMjYtMDktMzAgMTg6MDAgVVRDJykuJy4uLicuc3RydG90aW1lKCcyMDI2LTA5LTMwIDE5OjAwIFVUQycpXSkgYXMgJG8peyBpZigkby0+Z2V0X29yZGVyX251bWJlcigpPT09JzEyNDMnKXsgJGw9W107IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kby0+Z2V0X2lkKCksJ29yZGVyJz0+J0RFU0MnLCdsaW1pdCc9PjRdKSBhcyAkbikgJGxbXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCw5MCk7ICRyWyd1MTI0MyddPVskby0+Z2V0X3N0YXR1cygpLCRvLT5nZXRfcGF5bWVudF9tZXRob2QoKSwkbF07IH0gfQogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-164941';
const GKEY='ps_s1748b';
const PHASES=["1"];
const OUT='out/s1748_b.json';
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
