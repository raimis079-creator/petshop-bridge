process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTQgbCDigJQgUHJpbnMgKDE5IHBvei4pOiBhciB5cmEgVkYvWkIgZmVlZCd1b3NlIChwYWdhbCBFQU4vcGF2YWRpbmltxIUpLCBkYWJhcnRpbsSXIG1ldGEgKF9wc19zYW5kZWxpcywgX3piX2VuYWJsZWQsIF92Zl8qKSwgVC0wIHBhcnRpam9zLCBwc19zb3VyY2VzLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjk0bCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJGlkcz1hcnJheSgxNjc1MSwxNjc0NSwxNjc3MiwxNjg1NCwxNjg4NiwxNjg4MSwxNjg2MiwxNjg2OCwxNjg3MSwxNjg3NiwxNjg4OSwxNjc4NSwxNjc4MiwxNjc3NiwxNjgyNCwxNjg2NSwxNjc5MSwxNjc3OSwxNjc4OCk7CiAgJGluPWltcGxvZGUoJywnLCRpZHMpOwogICRvWydwcmVrZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF9zdGF0dXMsTEVGVChwLnBvc3RfdGl0bGUsNjApIHQsCiAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3NrdScpIHNrdSwKICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfc3RvY2snKSBzdG9jaywKICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScpIG93biwKICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnKSBzYW5kZWxpcywKICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfemJfZW5hYmxlZCcpIHpiLAogICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J192Zl9za3UnKSB2Zl9za3UsCiAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3ZmX3F0eScpIHZmX3F0eSwKICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfZWFuJykgZWFuLAogICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J19nbG9iYWxfdW5pcXVlX2lkJykgZ3RpbgogICAgRlJPTSB7JHB9cG9zdHMgcCBXSEVSRSBwLklEIElOICgkaW4pIixBUlJBWV9BKTsKICAkb1sncGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcmVrZV9pZCxDT1VOVCgqKSBuLFNVTShsaWt1dGlzKSBsaWt1dGlzLEdST1VQX0NPTkNBVChESVNUSU5DVCB0aWVrZWphcykgdGllayxHUk9VUF9DT05DQVQoRElTVElOQ1Qgc3RhdHVzYXMpIHN0IEZST00geyRwfXBzX3BhcnRpam9zIFdIRVJFIHByZWtlX2lkIElOICgkaW4pIEdST1VQIEJZIHByZWtlX2lkIixBUlJBWV9BKTsKICBpZiAoJHdwZGItPmxhc3RfZXJyb3IpeyAkb1snZXJyMSddPSR3cGRiLT5sYXN0X2Vycm9yOyAkb1sncGFydGlqb3NfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfcGFydGlqb3MiLDApOyB9CiAgJG9bJ3NvdXJjZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZCBJTiAoJGluKSBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgLy8gVkYgZmVlZAogICR2Zj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcGV0c2hvcC12Zi1jYWNoZS54bWwnOyAkb1sndmZfZmVlZCddPWZpbGVfZXhpc3RzKCR2Zik/YXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJHZmKSwncGFzayc9PmRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkdmYpKSk6bnVsbDsKICBpZiAoZmlsZV9leGlzdHMoJHZmKSl7ICR4PUBzaW1wbGV4bWxfbG9hZF9maWxlKCR2Zik7ICRoaXRzPWFycmF5KCk7IGlmICgkeCl7IGZvcmVhY2ggKCR4LT54cGF0aCgnLy9yb3cnKSBhcyAkcil7ICRuPShzdHJpbmcpJHItPnByb2R1Y3RfbmFtZTsgaWYgKHN0cmlwb3MoJG4sJ3ByaW5zJykhPT1mYWxzZSkgJGhpdHNbXT1hcnJheSgnc2t1Jz0+KHN0cmluZykkci0+c2t1X2lkLCduJz0+bWJfc3Vic3RyKCRuLDAsNzApLCdlYW4nPT4oc3RyaW5nKSRyLT5iYXJjb2RlLCdxdHknPT4oc3RyaW5nKSRyLT5xdHksJ2thaW5hJz0+KHN0cmluZykkci0+YmFzZV9wcmljZSk7IH0gfSAkb1sndmZfcHJpbnMnXT1hcnJheSgnbic9PmNvdW50KCRoaXRzKSwncHZ6Jz0+YXJyYXlfc2xpY2UoJGhpdHMsMCwzMCkpOyB9CiAgLy8gWkIgZmVlZCDigJQga3VyPyBpZcWha29tIHhtbCBmYWlsxbMgdXBsb2FkcyBzdSB6YgogICRvWyd6Yl9mYWlsYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJGYpe3JldHVybiBiYXNlbmFtZSgkZikuJyAnLmZpbGVzaXplKCRmKS4nICcuZGF0ZSgnbS1kIEg6aScsZmlsZW10aW1lKCRmKSk7fSxhcnJheV9tZXJnZShnbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy8qemIqLnhtbCcpPzphcnJheSgpLGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3dwYWxsaW1wb3J0L2ZpbGVzLyonKT86YXJyYXkoKSkpOwogICRvWyd6Yl9wcmluc19wcmVrZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF9zdGF0dXMsTEVGVChwLnBvc3RfdGl0bGUsNjApIHQsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J196Yl9xdHknKSB6Yl9xdHkgRlJPTSB7JHB9cG9zdHMgcCBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfemJfZW5hYmxlZCcgQU5EIG0ubWV0YV92YWx1ZT0neWVzJyBXSEVSRSBwLnBvc3RfdGl0bGUgTElLRSAnJVByaW5zJScgTElNSVQgMzAiLEFSUkFZX0EpOwogICRvWydwcmluc192aXNvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3Rfc3RhdHVzLENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICclUHJpbnMlJyBHUk9VUCBCWSBwb3N0X3N0YXR1cyIsQVJSQVlfQSk7CiAgJG9bJ3ByaW5zX2JyYW5kJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5uYW1lLHQuc2x1ZyxDT1VOVCgqKSBuIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBBTkQgdC5uYW1lIExJS0UgJyVQcmlucyUnIEdST1VQIEJZIHQudGVybV9pZCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-201429';
const GKEY='ps_s1694l';
const PHASES=["1"];
const OUT='analize/s1694_l.json';
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
