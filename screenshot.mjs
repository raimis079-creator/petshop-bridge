process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc1IHlhbmRleCBjbGFyaXR5IHNhbGluaW1hcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfYmtXJ10pPyRfR0VUWydwc19ia1cnXTonJzsKICBpZigkZiE9PSdBJyYmJGYhPT0nQicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjc1JywnZmF6ZSc9PiRmLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOwogICR0Yz0kd3BkYi0+cHJlZml4LidjbXBsel9jb29raWVzJzsgJHRzPSR3cGRiLT5wcmVmaXguJ2NtcGx6X3NlcnZpY2VzJzsKICB0cnl7CiAgICBpZigkZj09PSdBJyl7CiAgICAgIC8vIDEuIFBhc2xhdWd1IElECiAgICAgICRzaWQ9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NICR0cyBXSEVSRSBuYW1lIElOICgnWWFuZGV4IE1ldHJpY2EnLCdNaWNyb3NvZnQgQ2xhcml0eScpIik7CiAgICAgICRvWydwYXNsYXVndV9pZCddPSRzaWQ7CiAgICAgIC8vIDIuIFNsYXB1a2FpOiBwYWdhbCBzZXJ2aWNlSUQgKyBuYXNsZWNpYWkgcGFnYWwgdmFyZGEKICAgICAgJHBhZ2FsU2lkPSRzaWQ/JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NICR0YyBXSEVSRSBzZXJ2aWNlSUQgSU4gKCIuaW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCRzaWQpKS4iKSIpOmFycmF5KCk7CiAgICAgICRwYWdhbFZhcmRhPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSAkdGMgV0hFUkUgbmFtZSBMSUtFICdcX3ltJScgT1IgbmFtZSBMSUtFICdcX2NsY2slJyBPUiBuYW1lIExJS0UgJ1xfY2xzayUnIE9SIG5hbWUgTElLRSAnJWNsYXJpdHklJyIpOwogICAgICAkY2lkPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoJHBhZ2FsU2lkLCRwYWdhbFZhcmRhKSkpOwogICAgICAkb1snc2xhcHVrdV9pZCddPSRjaWQ7ICRvWydzbGFwdWt1X3NrJ109Y291bnQoJGNpZCk7CiAgICAgIC8vIDMuIEJBSyBwaWxub3MgZWlsdXRlcwogICAgICAkYmFrPWFycmF5KCdzZXJ2aWNlcyc9PmFycmF5KCksJ2Nvb2tpZXMnPT5hcnJheSgpKTsKICAgICAgaWYoJHNpZCkgJGJha1snc2VydmljZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHRzIFdIRVJFIElEIElOICgiLmltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkc2lkKSkuIikiLEFSUkFZX0EpOwogICAgICBpZigkY2lkKSAkYmFrWydjb29raWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICR0YyBXSEVSRSBJRCBJTiAoIi5pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJGNpZCkpLiIpIixBUlJBWV9BKTsKICAgICAgdXBkYXRlX29wdGlvbigncHNfczE2NzVfY21wbHpfYmFrJywkYmFrLGZhbHNlKTsKICAgICAgJG9bJ2JhayddPWFycmF5KCdzZXJ2aWNlcyc9PmNvdW50KCRiYWtbJ3NlcnZpY2VzJ10pLCdjb29raWVzJz0+Y291bnQoJGJha1snY29va2llcyddKSk7CiAgICAgIC8vIDQuIFp5bWltIGlzdHJpbnRhaXMgKGdyYXppbmFtYSwgbmUgREVMRVRFKQogICAgICBpZigkY2lkKXsgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkY2lkKSk7CiAgICAgICAgJG9bJ3VwZF9jb29raWVzJ109JHdwZGItPnF1ZXJ5KCJVUERBVEUgJHRjIFNFVCBkZWxldGVkPTEsIHNob3dPblBvbGljeT0wLCBzeW5jPTAgV0hFUkUgSUQgSU4gKCRpbikiKTsgfQogICAgICBpZigkc2lkKXsgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkc2lkKSk7CiAgICAgICAgJG9bJ3VwZF9zZXJ2aWNlcyddPSR3cGRiLT5xdWVyeSgiVVBEQVRFICR0cyBTRVQgZGVsZXRlZD0xLCBzeW5jPTAgV0hFUkUgSUQgSU4gKCRpbikiKTsgfQogICAgICAvLyA1LiBQcml2ZXJjaWFtIHBvbGl0aWtvcyBwZXJrdXJpbWEKICAgICAgZGVsZXRlX29wdGlvbignY21wbHpfdHJhbnNpZW50cycpOwogICAgICB1cGRhdGVfb3B0aW9uKCdjbXBsel9nZW5lcmF0ZV9uZXdfY29va2llcG9saWN5X3NuYXBzaG90Jyx0aW1lKCksZmFsc2UpOwogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ2NtcGx6X3VwZGF0ZV9jb29raWVfcG9saWN5X3NuYXBzaG90JykpIHsgY21wbHpfdXBkYXRlX2Nvb2tpZV9wb2xpY3lfc25hcHNob3QoKTsgJG9bJ3NuYXBzaG90J109J2F0bmF1amludGEnOyB9CiAgICAgICRvWydsaWtvX3JvZG9tdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0YyBXSEVSRSBzaG93T25Qb2xpY3k9MSBBTkQgZGVsZXRlZD0wIik7CiAgICB9CiAgICBpZigkZj09PSdCJyl7CiAgICAgICRvWydzZXJ2aWNlc19saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbmFtZSxsYW5ndWFnZSxkZWxldGVkIEZST00gJHRzIFdIRVJFIGRlbGV0ZWQ9MCBPUkRFUiBCWSBuYW1lIixBUlJBWV9BKTsKICAgICAgJG9bJ2Nvb2tpZXNfcm9kb21pJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHRjIFdIRVJFIHNob3dPblBvbGljeT0xIEFORCBkZWxldGVkPTAiKTsKICAgICAgJG9bJ3ltX2xpa28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdGMgV0hFUkUgKG5hbWUgTElLRSAnXF95bSUnIE9SIG5hbWUgTElLRSAnXF9jbGNrJScgT1IgbmFtZSBMSUtFICdcX2Nsc2slJykgQU5EIGRlbGV0ZWQ9MCIpOwogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvc2xhcHVrdS1wb2xpdGlrYS8nKSxhcnJheSgndGltZW91dCc9PjQ1LCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIENocm9tZS8xNTInLCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICAgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgICAgJHR4PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MoJGIpKSk7CiAgICAgICRvWydwb2xpdGlrYSddPWFycmF5KCdrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwKICAgICAgICAneWFuZGV4Jz0+c3Vic3RyX2NvdW50KCR0eCwnWWFuZGV4JyksJ2NsYXJpdHknPT5zdHJpcG9zKCR0eCwnQ2xhcml0eScpIT09ZmFsc2U/MTowLAogICAgICAgICdhZHNlbnNlJz0+c3Vic3RyX2NvdW50KCR0eCwnQWRzZW5zZScpLCd3b29jb21tZXJjZSc9PnN1YnN0cl9jb3VudCgkdHgsJ1dvb0NvbW1lcmNlJyksCiAgICAgICAgJ2FuYWx5dGljcyc9PnN1YnN0cl9jb3VudCgkdHgsJ0dvb2dsZSBBbmFseXRpY3MnKSk7CiAgICAgIGlmKHByZWdfbWF0Y2goJy/ErmTEl3RpIHNsYXB1a2FpKC57MCw2MDB9KS9zdScsJHR4LCRtKSkgJG9bJ3NreXJpdXNfNl9wcmFkemlhJ109dHJpbSgkbVsxXSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-081620';
const GKEY='ps_bkW';
const PHASES=["A", "B"];
const OUT='analize/s1675_x.json';
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
