process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEsxIERpc3BhdGNoIHNhbHRpbmlzIHYxLjAgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJHYgPSBpc3NldCgkX0dFVFsncHNfYmlzJ10pID8gJF9HRVRbJ3BzX2JpcyddIDogJyc7CiAgaWYgKCR2ICE9PSAnSzEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbyA9IGFycmF5KCd2Jz0+J0sxLXYxLjAnKTsKICB0cnkgewogICAgJHJjID0gbmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcpOwogICAgJGYgPSAkcmMtPmdldEZpbGVOYW1lKCk7CiAgICAkTCA9IGZpbGUoJGYpOwogICAgZm9yZWFjaCAoYXJyYXkoJ2Zsb3dzJywnZW5xdWV1ZScsJ2NoZWNrX2VsaWdpYmlsaXR5JykgYXMgJG0pIHsKICAgICAgJHJtID0gbmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnLCAkbSk7CiAgICAgICRhID0gJHJtLT5nZXRTdGFydExpbmUoKTsgJGIgPSAkcm0tPmdldEVuZExpbmUoKTsKICAgICAgJG9bJG1dID0gaW1wbG9kZSgnJywgYXJyYXlfc2xpY2UoJEwsICRhLTEsIG1pbigkYi0kYSsxLCAxMjApKSk7CiAgICB9CiAgICAkb1snZWlsdWNpdV9mYWlsZSddID0gY291bnQoJEwpOwogICAgJG9bJ2Zsb3dzX2dyYXppbmEnXSA9IGFycmF5X2tleXMoKGFycmF5KSBQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpmbG93cygpKTsKICB9IGNhdGNoIChUaHJvd2FibGUgJGUpIHsgJG9bJ0ZBVEFMJ10gPSAkZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='K1-133310';
const GKEY='ps_bis';
const PHASES=["K1"];
const OUT='analize/k1.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
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
