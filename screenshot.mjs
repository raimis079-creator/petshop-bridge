process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIGoyIOKAlCBkYXJiYWxhdWtpcyB2My40MSBERVBMT1kgacWhIG1lZGlhIChmYXrElyBEKSArIHBhdGlrcmEgKGZhesSXIFQpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY3NmonXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkRj0kX0dFVFsncHNfczE2NzZqJ107ICRvPWFycmF5KCd2Jz0+J1MxNjc2IGonLCdmYXplJz0+JEYpOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCc7ICRiaz13cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAuYmFrX3MxNjc2Yic7CiAgaWYoJEY9PT0nRCcpewogICAgJG1pZD1pc3NldCgkX0dFVFsnZF9kbF92MzQxMV90eHQnXSk/KGludCkkX0dFVFsnZF9kbF92MzQxX3R4dCddOjA7ICRtZj0kbWlkP2dldF9hdHRhY2hlZF9maWxlKCRtaWQpOicnOyAkb1snbWVkaWEnXT1hcnJheSgkbWlkLCRtZj9iYXNlbmFtZSgkbWYpOidOxJZSQScpOwogICAgJGtvZGFzPSRtZiYmZmlsZV9leGlzdHMoJG1mKT9nemRlY29kZShiYXNlNjRfZGVjb2RlKHRyaW0oZmlsZV9nZXRfY29udGVudHMoJG1mKSkpKTpmYWxzZTsKICAgICRvWydzZW5hc19tZDUnXT1tZDVfZmlsZSgkZik7ICRvWyduYXVqYXNfbWQ1J109JGtvZGFzP21kNSgka29kYXMpOm51bGw7CiAgICBpZigkb1snc2VuYXNfbWQ1J10hPT0nNTg2ZGE5MzhlZGY5ZTBiMmY2NzA1YmM3MTc4NmI5ODcnKXsgJG9bJ1NUT1AnXT0nZ3l2YXMgbmUgdjMuNDEnOyB9CiAgICBlbHNlaWYoJG9bJ25hdWphc19tZDUnXSE9PScyM2E5MTFjNDM5OTRiMTU0YzU0MzkwZGU3ZDMyM2Q4NCcpeyAkb1snU1RPUCddPSduYXVqYXMgbWQ1JzsgfQogICAgZWxzZWlmKEB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk9PT1mYWxzZSl7ICRvWydTVE9QJ109J1NJTlRBS1NFJzsgfQogICAgZWxzZSB7IGNvcHkoJGYsJGJrKTsgZmlsZV9wdXRfY29udGVudHMoJGYsJGtvZGFzKTsgJG9bJ2lyYXN5dGFfbWQ1J109bWQ1X2ZpbGUoJGYpOwogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX3BpbmdfczE2NzZqPScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkYz1pc193cF9lcnJvcigkcik/J0VSUic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOyAkb1sncGluZyddPSRjOwogICAgICBpZihpc193cF9lcnJvcigkcil8fCRjPj01MDApeyBjb3B5KCRiaywkZik7ICRvWydST0xMQkFDSyddPW1kNV9maWxlKCRmKTsgfSB9CiAgICBpZigkbWlkKSB7IHdwX2RlbGV0ZV9hdHRhY2htZW50KCRtaWQsdHJ1ZSk7ICRvWydtZWRpYV9pc3RyaW50YSddPTE7IH0KICB9CiAgaWYoJEY9PT0nVCcpewogICAgJG9bJ2d5dmFzX21kNSddPW1kNV9maWxlKCRmKTsgJG9bJ3ZlcnNpamEnXT1kZWZpbmVkKCdQZXRzaG9wX0RhcmJhbGF1a2lzOjpWRVJTSUpBJyk/UGV0c2hvcF9EYXJiYWxhdWtpczo6VkVSU0lKQTpudWxsOwogICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfRGFyYmFsYXVraXMnKTsKICAgIGZvcmVhY2goYXJyYXkoMzU5MDIpIGFzICRpZCl7ICR3PXdjX2dldF9vcmRlcigkaWQpOyAkbWY9JHJjLT5nZXRNZXRob2QoJ2Zha3RhaScpOyAkbWYtPnNldEFjY2Vzc2libGUodHJ1ZSk7ICRmaz0kbWYtPmludm9rZShudWxsLCR3KTsgJG1iPSRyYy0+Z2V0TWV0aG9kKCdidXNlbmEnKTsgJG1iLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkb1snYnVzZW5hXycuJGlkXT0kbWItPmludm9rZShudWxsLCRmayk7ICRvWyd0YWtlbGlzXycuJGlkXT1pc3NldCgkZmtbJ3Rha2VsaXMnXSk/JGZrWyd0YWtlbGlzJ106KGlzc2V0KCRma1snVCddKT8kZmtbJ1QnXTphcnJheV9rZXlzKCRmaykpOyAkbXQ9JHJjLT5nZXRNZXRob2QoJ21va190cnVtcGFpJyk7ICRtdC0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJG9bJ21va18nLiRpZF09JG10LT5pbnZva2UobnVsbCwkdyk7IH0KICAgICRvWyd3YXJuJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lPSd4JyIpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-083457';
const GKEY='ps_s1676j';
const PHASES=["D", "T"];
const OUT='analize/s1676_j2.json';
const DATA=["deploy/dl_v3411.txt"];
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
