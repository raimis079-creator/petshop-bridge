process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIHNha29zIGxhbmdhcyB2Mi4yICsgbGlrdWNpYWkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdTSycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1NBS0EtMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmVudW1lcmF0b3MtbGFuZ2FzLnBocCc7CiAgICAkb1snbGFuZ2FzJ109YXJyYXkoJ21kNSc9Pm1kNV9maWxlKCRmKSwnZHlkaXMnPT5maWxlc2l6ZSgkZiksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpKSk7CiAgICAvLyBzYWtvcyBFMkUgbGlrdWNpYWkKICAgICR0PVBldHNob3BfUHJlbnVtZXJhdGE6OnQoKTsgJHRlPVBldHNob3BfUHJlbnVtZXJhdGE6OnRlKCk7ICRqdD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjp0YWJsZSgpOwogICAgJG9bJ3N1YnMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHR9Iik7CiAgICAkb1snc3Vic19laWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxlbWFpbCxzdGF0dXMgRlJPTSB7JHR9IExJTUlUIDEwIixBUlJBWV9BKTsKICAgICRvWydpdnlraWFpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR0ZX0iKTsKICAgICRvWydqb2JzX3Rlc3QnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JGp0fSBXSEVSRSByZWNpcGllbnRfZW1haWwgTElLRSAnJUBneXZ1bmFpLmx0JyBBTkQgY3JlYXRlZF9hdD49JzIwMjYtMDgtMzAnIik7CiAgICAkb1snam9ic19laWwnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHJlY2lwaWVudF9lbWFpbCBGUk9NIHskanR9IFdIRVJFIHJlY2lwaWVudF9lbWFpbCBMSUtFICclQGd5dnVuYWkubHQnIEFORCBjcmVhdGVkX2F0Pj0nMjAyNi0wOC0zMCcgTElNSVQgMTAiKTsKICAgICRvWydvcGNpamEnXT1nZXRfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9za3UnLG51bGwpOwogICAgJG9bJ2Npa2xhc19sb2cnXT1nZXRfb3B0aW9uKCdwc19wcmVuX2Npa2xhc19sb2cnLG51bGwpOwogICAgLy8gdGVzdGluaWFpIHV6c2FreW1haSBzaWFuZGllbiAoYmUgX3BzIG1ldGEgbmVpc3ZhbHl0aT8pCiAgICAkb3JkPXdjX2dldF9vcmRlcnMoYXJyYXkoJ2xpbWl0Jz0+MjAsJ2RhdGVfY3JlYXRlZCc9Pic+PScuZ21kYXRlKCdZLW0tZCcpLCdyZXR1cm4nPT4naWRzJykpOwogICAgJG9bJ3NpYW5kaWVuX3V6c2FreW1haSddPSRvcmQ7CiAgICAvLyB0ZXN0aW5pYWkgdmFydG90b2phaQogICAgJG9bJ3Rlc3RfdXNlcnMnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHVzZXJfbG9naW4gRlJPTSB7JHdwZGItPnVzZXJzfSBXSEVSRSB1c2VyX2xvZ2luIExJS0UgJ2YxOXQlJyBPUiB1c2VyX2VtYWlsIExJS0UgJyV0ZXN0JUBneXZ1bmFpLmx0JyBMSU1JVCAxMCIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='f19_saka-094334';
const GKEY='ps_f19';
const PHASES=["SK"];
const OUT='analize/f19_saka_1788083014.json';
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
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
