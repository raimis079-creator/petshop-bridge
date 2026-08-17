process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3Y5MTAnXSk/JF9HRVRbJ3BzX3Y5MTAnXTonJykhPT0nVjkxMCcpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidWOTEwJywndHMnPT5kYXRlKCdIOmk6cycpKTsKICRycz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0YWJsZV9uYW1lIHQsIGVuZ2luZSBlIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLnRhYmxlcyBXSEVSRSB0YWJsZV9zY2hlbWE9REFUQUJBU0UoKSIsIEFSUkFZX0EpOwogJGNudD1hcnJheSgpOyAkZW5nPWFycmF5KCk7CiBmb3JlYWNoKCRycyBhcyAkeCl7ICRlbmdbJHhbJ2UnXV09KGlzc2V0KCRlbmdbJHhbJ2UnXV0pPyRlbmdbJHhbJ2UnXV06MCkrMTsKICAgJGNudFskeFsndCddXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgeyR4Wyd0J119YCIpOyB9CiAkb1sndmFyaWtsaWFpJ109JGVuZzsgJG9bJ2NvdW50X3BvJ109JGNudDsKIC8vIFJBU1lNTyBURVNUQVM6IGlyYXNvbSBpIHBzX2F2X3p1cm5hbGFzIGlyIGlzdHJpbmFtCiAkej0kUC4ncHNfYXZfenVybmFsYXMnOwogaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR6JyIpPT09JHopewogICAkcj0kd3BkYi0+aW5zZXJ0KCR6LCBhcnJheSgnb3BlcmFjaWphJz0+J2lubm9kYl90ZXN0JywncHJvZHVjdF9pZCc9PjAsJ2xhdWthcyc9Pid0ZXN0JywnYnV2byc9PidhJywndGFwbyc9PidiJywncG9reXRpcyc9PjEsJ3ByaWV6YXN0aXMnPT4nUzkxMCcsJ3VzZXJfaWQnPT4wLCdzdWt1cnRhJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdhdHNhdWt0YSc9PjApKTsKICAgJGlkPSR3cGRiLT5pbnNlcnRfaWQ7CiAgICRvWydyYXN5bWFzJ109YXJyYXkoJ2luc2VydCc9PiRyLCdpZCc9PiRpZCwnZXJyJz0+JHdwZGItPmxhc3RfZXJyb3IpOwogICBpZigkaWQpeyAkb1sncmFzeW1hcyddWydwZXJza2FpdHl0YSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcHJpZXphc3RpcyBGUk9NIGAkemAgV0hFUkUgaWQ9JGlkIik7CiAgICAgICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gYCR6YCBXSEVSRSBpZD0kaWQiKTsKICAgICAgICAgICAgJG9bJ3Jhc3ltYXMnXVsnaXN0cmludGEnXT0oJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkemAgV0hFUkUgaWQ9JGlkIik9PTApOyB9CiB9IGVsc2UgJG9bJ3Jhc3ltYXMnXT0nbGVudGVsZXMgbmVyYSc7CiAvLyBMSUVUVVZJU0tPUyBSQUlERVMKICRvWydsdF9yYWlkZXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHBvc3RfdGl0bGUgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90aXRsZSBMSUtFICclxJclJyBBTkQgcG9zdF90eXBlPSdwcm9kdWN0JyBMSU1JVCAxIik7CiAvLyBUUkFOU0FLQ0lKQSAoSW5ub0RCIHBvenltaXMpCiAkd3BkYi0+cXVlcnkoIlNUQVJUIFRSQU5TQUNUSU9OIik7CiAkd3BkYi0+cXVlcnkoIklOU0VSVCBJTlRPIGAkemAgKG9wZXJhY2lqYSxwcm9kdWN0X2lkLGxhdWthcyxwcmllemFzdGlzLHVzZXJfaWQsc3VrdXJ0YSxhdHNhdWt0YSkgVkFMVUVTICgndHgnLDAsJ3QnLCdTOTEwJywwLCciLmN1cnJlbnRfdGltZSgnbXlzcWwnKS4iJywwKSIpOwogJHRpZD0kd3BkYi0+aW5zZXJ0X2lkOwogJHdwZGItPnF1ZXJ5KCJST0xMQkFDSyIpOwogJG9bJ3JvbGxiYWNrX3ZlaWtpYSddPSgoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHpgIFdIRVJFIGlkPSIuKGludCkkdGlkKT09PTApOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'V910'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP V910',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_v910=V910');
  const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('v910.json', Buffer.from(JSON.stringify(out)), 'v910');
