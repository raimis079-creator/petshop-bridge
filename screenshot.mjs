process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIHgg4oCUIFRpZWvEl2rFsyBmaXppbmnFsyBsaWt1xI1pxbMgxK9rxJdsaW1hcyBpxaEgUmFpbWlvIEV4Y2VsIChWRi9aQikuIFI6IERSWSAoYXRpdGlraW1hcywgzqMpIMK3IEE6IEFQUExZIHBlciBQZXRzaG9wX1BhcnRpam9zOjpwcmlpbXRpIChrZWxpYSBfb3duX3N0b2NrX3F0eSBwYXRzKS4gQ1NWOiBza3U7a2lla2lzO3NhdmlrYWluYTtnZXJpYXVzaWFfaWtpO2xhcGFzLiBJZGVtcG90ZW5jaWphOiBwc19zMTYzNnhfZG9uZS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzZ4J10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX3MxNjM2eCddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjM2IHgnLCdmJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogIHRyeXsKICAkY3N2PWd6ZGVjb2RlKGJhc2U2NF9kZWNvZGUoJ0g0c0lBQWIrbm1vQy8yMlh5WElrS1F4QTcvTXhoRGEyNEZSMjIxMnplT3h4dFIzUmZYSEUzT2YvcnlNQm1VQm0zWW9uSWJRaHNnUWtDUkY2SkNoWUNGd281ZlA1dDh1THJpa1ZxcXZINjg4M3dLSWE3SHlzNkpzcFlDem9jbCt6THFpUTQxVEIwd2VDRkVUVkVONkpMeWdyQ1FWaEpXckhyeVFmQ2ZhenV6TlBIeUg2UXN0WkllTnkrdlg2L0lJV2d5ZlhkbDJQTGw5L1B0OUExeFltYnVocXU3QjRSWDVEcHNXTDF1L05kZ0RIbTliYnBSMEhZK05ic3lYWjhVYk1sRjlNS1FwcW5hV3YzMCtiM285ZS92RjZBd0RXMHlpNm5IZUdRUU1zekM3N25aSFdBQW9IUjJPdllOZnpnNFhLaUYxM3BESWlPNE1jRGhhcG5vdU9lTERBRmxUdnBVWjhpU3RKV1dPZzdQSzBMMXNUTWppWjlLeU9oWEgyTjJZcVVxSkxjVUlLanNpckZ3Y1UxTmtEaXBydDVQenNoalpjMlpmSnV0WThEU1BxaEhEeUttbWQ3THd3STdLdHVMSnp3cEltRk13Y2hvbFpvV1JGVnBQa21BWmlheFl0U1o3VUpKbzFjSG5TazJ5bnNrdWpGWElOZ3BKRG1oaTFzaTk2MWVNMHU1TFZZN0Yyd3pneDgzanBqb3l4QlJaSHNKbHFzS28zRVBjaTQ2UW12YUduYUxPSWVSY2NUSjZvYVcwSG5zdVRvN1FMa2laN3lTTGpPR2NsMTM1UVYvek9FS0M2NTZkb2xYbU5kckMvdjE4ZUxxTFoweDUyd0J2N3F6SlkySWV4c0tCUFF6cHpKdlo0ZVdnRFZnZndZSTluOXYwTys3TXozQWFac3RzZGU3Y2Y5eGhTcTFDL0UyL0w1SCtyTXpLUEdmbFBCWEdBenlNQXZPQVRDREQwTkNyKzlkQ3h2NFBsb3RyZXNFRHRreDM3TTM0QjFPblBiUXhObEpSU054MW94d3diVGs0bXZHdXppM0hIQXRCdEIrZGx4clJOVjFnd1E4Mm9YbzNFSysvcWxDZmNIUmR4Z2pPbURhZmhvV3dlU3Iwbk82V2Rwc2x2NUI1T3FEZG94OUw4VTlPUUZseHJubDJjb2tGL2w0Wks5WHBSbUdqYzZheWJHdFVYYndxYm9OSEZZL3ZlcUwwWTUveUhMUlhSU1pvb053c3pmVUNySWJhQ0F3OHNBK2N3c045d0dKMm5PTjNIdVdQUnJ0bENlZFdZSS9TbUlWeG9iWUpjcjlWRXVVM2hzQVg0ZXZ1d1ovcHFjU2VYWmNGU3NTWWZGeHloYTY5R2ttSDlXdk1kLzNoSHBpOUtLZVVXdS9lcndDWm5OU1NMZ0FQNTdpWk9Bdi9GT2xiMTAreTRvd3FrVnM3dnJnNEJuUTl2Z2xyVjRHSTRDdXpGU0g0NUk4R1hGamZtZG9OT2t2WU4wa2J4TGtBVE1KNURUR1RHK291TFJ3R3huRU5wRW1rakpvOHRBdXB4L2RyUkJ5TWR1ZlI3ZHVRV1lNU3pIWHQ0d21xZmxVdjB4NE1Kb2hhUVFqaTZTcEJxQlZNNFprUWxhaXkxWWJ0a2hCRFVtT2ZZdmt0R1JvajVDN1BRS1NHYndCOXp1QW5PcDNkQlBGWlEwNjBDejZkSU5JZ3ZFYWt6Yk5uUkJGNzZyT2paSlJzLzJ2bjl0NzMvMjIvWmZqOVFWaDlLYXFzWDFIODUrb3o1c1ZRdnlENytxVjNhZjRYdEd3bWJ3bjlJUWYrSXhMR3kveTNUa3V6UDBsanEyMmVEdHkwMUVpeDVyUFNyZWxwRjJsVC9COGxFcC9OOURRQUEnKSk7IGlmKCRjc3Y9PT1mYWxzZSl7ICRvWydTVE9QJ109J2NzdiBneic7ICRKKCRvKTsgfQogICRlaWw9YXJyYXlfZmlsdGVyKGFycmF5X21hcCgndHJpbScsZXhwbG9kZSgiXG4iLCRjc3YpKSk7CiAgJHNrPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBtLm1ldGFfdmFsdWUgc2t1LCBwbS5wb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIHBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXBtLnBvc3RfaWQgQU5EIHBvLnBvc3RfdHlwZSBJTigncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBXSEVSRSBwbS5tZXRhX2tleT0nX3NrdScgQU5EIHBtLm1ldGFfdmFsdWU8PicnIixPQkpFQ1QpOwogICRtYXA9YXJyYXkoKTsgZm9yZWFjaCgkc2sgYXMgJHIpeyAkbWFwWyhzdHJpbmcpJHItPnNrdV09KGludCkkci0+cG9zdF9pZDsgfQogICRkb25lPShhcnJheSlnZXRfb3B0aW9uKCdwc19zMTYzNnhfZG9uZScsYXJyYXkoKSk7CiAgJHBsYW49YXJyYXkoKTsgJG5lcmFzdGE9YXJyYXkoKTsgJGJlX3Nhdj1hcnJheSgpOyAkcT0wOwogIGZvcmVhY2goJGVpbCBhcyAkbCl7ICRjPWV4cGxvZGUoJzsnLCRsKTsgaWYoY291bnQoJGMpPDUpIGNvbnRpbnVlOyBsaXN0KCRza3UsJGssJHNhdiwkZ2ksJGxwKT1hcnJheV9tYXAoJ3RyaW0nLCRjKTsKICAgICRrPShpbnQpJGs7IGlmKCRrPD0wKSBjb250aW51ZTsKICAgIGlmKCFpc3NldCgkbWFwWyRza3VdKSl7ICRuZXJhc3RhW109JHNrdTsgY29udGludWU7IH0KICAgICRzYXY9KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsJHNhdik7IGlmKCRzYXY8PTApeyAkYmVfc2F2W109JHNrdTsgY29udGludWU7IH0KICAgICRwbGFuW109YXJyYXkoJ3BpZCc9PiRtYXBbJHNrdV0sJ3NrdSc9PiRza3UsJ2snPT4kaywnc2F2Jz0+JHNhdiwnZ2knPT4kZ2ksJ2xwJz0+c3RydG91cHBlcigkbHApKTsgJHErPSRrOwogIH0KICAkb1snZWlsdWNpdSddPWNvdW50KCRlaWwpOyAkb1sncGxhbmUnXT1jb3VudCgkcGxhbik7ICRvWydxX3N1bWEnXT0kcTsgJG9bJ25lcmFzdGEnXT0kbmVyYXN0YTsgJG9bJ2JlX3NhdmlrYWlub3MnXT0kYmVfc2F2OyAkb1snamF1X3BhZGFyeXRhJ109Y291bnQoJGRvbmUpOwogIGlmKCRmPT09J1InKXsgJG9bJ3B2eiddPWFycmF5X3NsaWNlKCRwbGFuLDAsOCk7ICRKKCRvKTsgfQogIGlmKCRmPT09J0EnKXsKICAgICRyZXM9YXJyYXkoJ29rJz0+MCwncHJhbGVpc3RhX2RvbmUnPT4wLCdrbGFpZG9zJz0+YXJyYXkoKSk7CiAgICBmb3JlYWNoKCRwbGFuIGFzICR4KXsgaWYoaW5fYXJyYXkoJHhbJ3BpZCddLCRkb25lLHRydWUpKXsgJHJlc1sncHJhbGVpc3RhX2RvbmUnXSsrOyBjb250aW51ZTsgfQogICAgICAkcj1QZXRzaG9wX1BhcnRpam9zOjpwcmlpbXRpKCR4WydwaWQnXSxhcnJheSgna2lla2lzJz0+JHhbJ2snXSwnc2F2aWthaW5hJz0+KHN0cmluZykkeFsnc2F2J10sJ3ZhbGl1dGEnPT4nRVVSJywna3Vyc2FzJz0+MSwnZ2VyaWF1c2lhX2lraSc9PiR4WydnaSddLCd0aWVrZWphcyc9PiR4WydscCddLCdnYXV0YSc9PmN1cnJlbnRfdGltZSgnWS1tLWQnKSwncGFzdGFiYSc9PidGaXppbmlzIGxpa3V0aXMgKFJhaW1pbyBFeGNlbCwgUzE2MzYpJykpOwogICAgICBpZihpc193cF9lcnJvcigkcikpeyAkcmVzWydrbGFpZG9zJ11bXT0keFsnc2t1J10uJzogJy4kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgaWYoY291bnQoJHJlc1sna2xhaWRvcyddKT45KSBicmVhazsgY29udGludWU7IH0KICAgICAgJGRvbmVbXT0keFsncGlkJ107ICRyZXNbJ29rJ10rKzsKICAgICAgaWYoJHJlc1snb2snXSU1MD09PTApIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNjM2eF9kb25lJywkZG9uZSxmYWxzZSk7CiAgICB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTYzNnhfZG9uZScsJGRvbmUsZmFsc2UpOwogICAgJG9bJ2FwcGx5J109JHJlczsKICAgICRvWydvd25fc3RvY2tfc3VtYSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBTVU0obWV0YV92YWx1ZSswKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIEFORCBwb3N0X2lkIElOIChTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3NrdScpIik7CiAgICAkSigkbyk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-181014';
const GKEY='ps_s1636x';
const PHASES=["R"];
const OUT='analize/s1637_xR.json';
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
