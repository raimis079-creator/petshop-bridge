process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY3YyBodGFjY2VzcyBmaXggKCQxKSArIGtsYWlkb3MgcHJpZcW+YXN0aXMgKyBzZXJ2ZSB0ZXN0YXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J0ZJWCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTY3YycpOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsKICB0cnl7CiAgICAkaHQ9QUJTUEFUSC4nLmh0YWNjZXNzJzsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGh0KTsgJG9bJ21kNV9wcmllcyddPW1kNSgkYyk7CiAgICAkYmFkPSdSZXdyaXRlUnVsZSBeKC4rKVwuKGpwZT9nfHBuZykkIC53ZWJwIFtUPWltYWdlL3dlYnAsTF0nOyAkZ29vZD0nUmV3cml0ZVJ1bGUgXiguKylcLihqcGU/Z3xwbmcpJCAkMS53ZWJwIFtUPWltYWdlL3dlYnAsTF0nOwogICAgaWYoc3Vic3RyX2NvdW50KCRjLCRiYWQpPT09MSl7ICRjPXN0cl9yZXBsYWNlKCRiYWQsJGdvb2QsJGMpOyBmaWxlX3B1dF9jb250ZW50cygkaHQsJGMpOyAkb1snZml4ZWQnXT10cnVlOyB9IGVsc2UgeyAkb1snZml4ZWQnXT1zdWJzdHJfY291bnQoJGMsJGdvb2QpPT09MT8namF1IGdlcmFpJzonaW5rYXJhcyBuZXJhc3Rhcyc7IH0KICAgICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkaHQpOyAkb1snd3BfYmxrJ109c3RycG9zKCRjLCcjIEJFR0lOIFdvcmRQcmVzcycpIT09ZmFsc2U7ICRvWydob21lJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogICAgLy8ga2xhaWRvcyBwcmllxb5hc3RpczogMjAyNi8wNSBsb2dvCiAgICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZmw9JHVwWydiYXNlZGlyJ10uJy8yMDI2LzA1L2xvZ28tMTAweDEwMC5qcGcnOyAkb1snZl9leGlzdHMnXT1maWxlX2V4aXN0cygkZmwpOyAkb1snZGlyX3dyaXRhYmxlJ109aXNfd3JpdGFibGUoZGlybmFtZSgkZmwpKTsgJG9bJ2Rpcl9vd25lciddPWZ1bmN0aW9uX2V4aXN0cygncG9zaXhfZ2V0cHd1aWQnKT8ocG9zaXhfZ2V0cHd1aWQoZmlsZW93bmVyKGRpcm5hbWUoJGZsKSkpWyduYW1lJ10/P2ZpbGVvd25lcihkaXJuYW1lKCRmbCkpKTpmaWxlb3duZXIoZGlybmFtZSgkZmwpKTsgJG9bJ3Byb2NfdXNlciddPWZ1bmN0aW9uX2V4aXN0cygncG9zaXhfZ2V0ZXVpZCcpPyhwb3NpeF9nZXRwd3VpZChwb3NpeF9nZXRldWlkKCkpWyduYW1lJ10/PycnKTpnZXRfY3VycmVudF91c2VyKCk7ICRvWydkaXJfcGVybXMnXT1zdWJzdHIoc3ByaW50ZignJW8nLGZpbGVwZXJtcyhkaXJuYW1lKCRmbCkpKSwtNCk7CiAgICAkaW09QGltYWdlY3JlYXRlZnJvbWpwZWcoJGZsKTsgJHRtcD0kZmwuJy53ZWJwLnRtcCc7ICRvaz1AaW1hZ2V3ZWJwKCRpbSwkdG1wLDgyKTsgJG9bJ2ltYWdld2VicCddPSRvazsgJG9bJ2VyciddPWVycm9yX2dldF9sYXN0KClbJ21lc3NhZ2UnXT8/bnVsbDsgaWYoJG9rKXsgJG9bJ3RtcF9CJ109ZmlsZXNpemUoJHRtcCk7ICRvWydyZW5hbWUnXT1AcmVuYW1lKCR0bXAsJGZsLicud2VicC50ZXN0Jyk7IEB1bmxpbmsoJGZsLicud2VicC50ZXN0Jyk7IEB1bmxpbmsoJHRtcCk7IH0gaW1hZ2VkZXN0cm95KCRpbSk7CiAgICAvLyBwYXZlaWtzbMSXbGlvIGR5ZGlzIG1hxb5hcz8gaW1hZ2V3ZWJwIHJlaWthbGF1amEgPj0gPyAKICAgICRvWydzeiddPWdldGltYWdlc2l6ZSgkZmwpOwogICAgLy8gc2VydmUgdGVzdGFzIHN1IHJlYWxpdSB3ZWJwCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X21pbWVfdHlwZSBJTiAoJ2ltYWdlL2pwZWcnLCdpbWFnZS9wbmcnKSBBTkQgcG9zdF9wYXJlbnQgSU4gKFNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcpIE9SREVSIEJZIElEIERFU0MgTElNSVQgNDAiKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD1nZXRfYXR0YWNoZWRfZmlsZSgkaWQpOyAkdz1wcmVnX3JlcGxhY2UoJ35cLihqcGU/Z3xwbmcpJH5pJywnLndlYnAnLCRwKTsgaWYoZmlsZV9leGlzdHMoJHApJiZmaWxlX2V4aXN0cygkdykpeyAkdT13cF9nZXRfYXR0YWNobWVudF91cmwoJGlkKTsgJG9bJ3Rlc3QnXT1hcnJheSgndXJsJz0+JHUsJ29yaWdfa2InPT5yb3VuZChmaWxlc2l6ZSgkcCkvMTAyNCksJ3dlYnBfa2InPT5yb3VuZChmaWxlc2l6ZSgkdykvMTAyNCkpOwogICAgICBmb3JlYWNoKGFycmF5KCd3ZWJwJz0+J2ltYWdlL3dlYnAsaW1hZ2UvKicsJ25vJz0+J2ltYWdlLyonKSBhcyAkaz0+JGFjYyl7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT4xNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+JGFjYykpKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOyAkb1snc2VydmUnXVska109YXJyYXkod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpLCRoWydjb250ZW50LXR5cGUnXT8/bnVsbCxzdHJsZW4oJGIpLHN1YnN0cigkYiwwLDQpPT09J1JJRkYnPydSSUZGKHdlYnApJzpiaW4yaGV4KHN1YnN0cigkYiwwLDMpKSwkaFsndmFyeSddPz9udWxsKTsgfSBicmVhazsgfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-125850';
const GKEY='ps_seo';
const PHASES=["FIX"];
const OUT='analize/s1567c.json';
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
