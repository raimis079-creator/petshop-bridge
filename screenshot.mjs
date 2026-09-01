process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY3ZSBXZWJQIHRhaXN5a2zEl3MgxK8gdXBsb2Fkcy8uaHRhY2Nlc3MgKG1vZF9yZXdyaXRlIG5laW5oZXJpdHVvamEpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdGSVgnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU2N2UnKTsgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgdHJ5ewogICAgJHVwPXdwX3VwbG9hZF9kaXIoKVsnYmFzZWRpciddOyAkYms9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJzsKICAgIGZvcmVhY2goYXJyYXkoJ3VwbG9hZHMnPT4kdXAuJy8uaHRhY2Nlc3MnLCd3cGNvbnRlbnQnPT5XUF9DT05URU5UX0RJUi4nLy5odGFjY2VzcycpIGFzICRrPT4kcCl7IGlmKGZpbGVfZXhpc3RzKCRwKSl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgJG9bJGsuJ19wcmllcyddPWFycmF5KCdCJz0+c3RybGVuKCRjKSwndGlrX3NwX2tvbWVudGFyYWknPT5wcmVnX21hdGNoKCd+XlxzKiMgQkVHSU4gU2hvcnRQaXhlbFdlYnBbXHNcU10qIyBFTkQgU2hvcnRQaXhlbFdlYnBccyokficsJGMpPT09MSk7IGNvcHkoJHAsJGJrLidodGFjY2Vzc18nLiRrLicuYmFrX1MxNTY3Jyk7IH0gZWxzZSAkb1skay4nX3ByaWVzJ109J25lcmEnOyB9CiAgICBpZighKCRvWyd1cGxvYWRzX3ByaWVzJ11bJ3Rpa19zcF9rb21lbnRhcmFpJ10/P2ZhbHNlKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbigndXBsb2Fkcy8uaHRhY2Nlc3MgdHVyaSBraXTEhSB0dXJpbsSvIOKAlCBTVE9QJyk7CiAgICAkYmxrPSIjIEJFR0lOIFBldHNob3AgV2ViUCAoUzE1NjcsIDIwMjYtMDktMDEpXG4jIE5hcnN5a2xlaSwgcHJpaW1hbmNpYWkgaW1hZ2Uvd2VicCwgdmlldG9qZSB4LmpwZ3xwbmcgYXRpZHVvZGFtYXMgc2FsaWEgZXNhbnRpcyB4LndlYnAgKGplaSB5cmEpLlxuIyBUYWlzeWtsZXMgY2lhLCBuZSByb290IC5odGFjY2VzczogbW9kX3Jld3JpdGUgTkVpbmhlcml0dW9qYSBpIGthdGFsb2d1cyBzdSBzYXZvIC5odGFjY2Vzcy5cbjxJZk1vZHVsZSBtb2RfcmV3cml0ZS5jPlxuUmV3cml0ZUVuZ2luZSBPblxuUmV3cml0ZUNvbmQgJXtIVFRQX0FDQ0VQVH0gaW1hZ2Uvd2VicFxuUmV3cml0ZUNvbmQgJXtSRVFVRVNUX0ZJTEVOQU1FfSBeKC4rKVxcLihqcGU/Z3xwbmcpJCBbTkNdXG5SZXdyaXRlQ29uZCAlMS53ZWJwIC1mXG5SZXdyaXRlUnVsZSBeKC4rKVxcLihqcGU/Z3xwbmcpJCAkMS53ZWJwIFtUPWltYWdlL3dlYnAsTF1cbjwvSWZNb2R1bGU+XG48SWZNb2R1bGUgbW9kX2hlYWRlcnMuYz5cbjxGaWxlc01hdGNoIFwiXFwuKGpwZT9nfHBuZykkXCI+XG5IZWFkZXIgYXBwZW5kIFZhcnkgQWNjZXB0XG48L0ZpbGVzTWF0Y2g+XG48L0lmTW9kdWxlPlxuQWRkVHlwZSBpbWFnZS93ZWJwIC53ZWJwXG4jIEVORCBQZXRzaG9wIFdlYlBcbiI7CiAgICBmaWxlX3B1dF9jb250ZW50cygkdXAuJy8uaHRhY2Nlc3MnLCRibGspOyAkb1sndXBsb2Fkc19wbyddPXN0cmxlbigkYmxrKTsKICAgIGlmKCgkb1snd3Bjb250ZW50X3ByaWVzJ11bJ3Rpa19zcF9rb21lbnRhcmFpJ10/P2ZhbHNlKSkgeyB1bmxpbmsoV1BfQ09OVEVOVF9ESVIuJy8uaHRhY2Nlc3MnKTsgJG9bJ3dwY29udGVudF9wbyddPSdpc3RyaW50YXMgKHRpayBTUCBrb21lbnRhcmFpKSc7IH0KICAgIC8vIHJvb3QgLmh0YWNjZXNzOiBQZXRzaG9wIFdlYlAgYmxva2FzIHBhbGlla2FtYXMgKG5ldmVpa2lhIHVwbG9hZHMsIGJldCBuZWtlbmtpYSkg4oCUIHBhxb55bWltIGtvbWVudGFydT8gcGFsaWVrYW0ga2FpcCB5cmEuCiAgICAvLyB0ZXN0YXMKICAgICR1PWhvbWVfdXJsKCcvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDgvcmluay1rb21wb3ppY2lqYS0zNTI5MS0xNzg4MTczMzU3LmpwZycpOwogICAgZm9yZWFjaChhcnJheSgnd2VicCc9PidpbWFnZS93ZWJwLGltYWdlLyonLCdubyc9PidpbWFnZS8qJywnY2hyb21lJz0+J2ltYWdlL2F2aWYsaW1hZ2Uvd2VicCxpbWFnZS9hcG5nLGltYWdlL3N2Zyt4bWwsaW1hZ2UvKiwqLyo7cT0wLjgnKSBhcyAkaz0+JGFjYyl7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT4xNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+JGFjYykpKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOyAkb1snc2VydmUnXVska109YXJyYXkod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpLCRoWydjb250ZW50LXR5cGUnXT8/bnVsbCxzdHJsZW4oJGIpLHN1YnN0cigkYiwwLDQpPT09J1JJRkYnPydSSUZGKHdlYnApJzpiaW4yaGV4KHN1YnN0cigkYiwwLDMpKSwkaFsndmFyeSddPz9udWxsKTsgfQogICAgJGc9d3BfcmVtb3RlX2hlYWQoaG9tZV91cmwoJy93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wOC9yaW5rLWtvbXBvemljaWphLTM1MjkxLTE3ODgxNzMzNTctMzAweDMwMC5qcGcnKSxhcnJheSgndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4naW1hZ2UvKicpKSk7ICRvWydqcGdfbm9fYWNjZXB0X2NvZGUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyk7CiAgICBmb3JlYWNoKGFycmF5KGhvbWVfdXJsKCcvJyksaG9tZV91cmwoJy9wcm9kdWN0L3JveWFsLWNhbmluLWNhdC1mdXNzeS1leGlnZW50LTEwLWtnLXNhdXNhcy1wYXNhcmFzLWlzcmFua2lvbXMta2F0ZW1zLycpLGhvbWVfdXJsKCcvd3AtY29udGVudC9wbHVnaW5zL3BldHNob3AtZm9udHMvZm9udHMvT3BlblNhbnMtUmVndWxhci1sdC53b2ZmMicpKSBhcyAkdXUpeyAkb1snc3ZlaWthdGEnXVtdPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoJHV1LGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-130416';
const GKEY='ps_seo';
const PHASES=["FIX"];
const OUT='analize/s1567e.json';
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
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
