process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdWQUwyJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQMEEtMicpOwogJHQ9JFAuJ3BzX2xhdWthaV9pdnlraWFpJzsgJGQ9JFAuJ3BzX2F0YXNrYWl0dV9kaWVub3MnOwogJG9bJ2RpZW5vc19sZW50ZWxlJ109JGQ7CiBpZiAoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRkJyIpPT09JGQpIHsKICAgJG9bJ2RpZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNyaXRpcywgQ09VTlQoKikgbiwgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpIEZST00gJGQgR1JPVVAgQlkgc3JpdGlzIiwgQVJSQVlfQSk7CiAgICRvWydkaWVub3NfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRkIik7CiB9IGVsc2UgeyAkb1snZGllbm9zJ109J05FUkEnOyB9CiAkb1snaXZ5a2lhaV9wYWdhbF9zcml0aSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNyaXRpcywgdGlwYXMsIENPVU5UKCopIG4gRlJPTSAkdCBHUk9VUCBCWSBzcml0aXMsIHRpcGFzIE9SREVSIEJZIG4gREVTQyBMSU1JVCAyMCIsIEFSUkFZX0EpOwogJG9bJ2xlbnRlbGVzJ109YXJyYXkoKTsKIGZvcmVhY2ggKChhcnJheSkkd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzXyUnIikgYXMgJHRiKSB7CiAgICRvWydsZW50ZWxlcyddW3N0cl9yZXBsYWNlKCRQLCcnLCR0YildPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0YiIpOwogfQogJG9bJ29wdF96YWxpdSddPWdldF9vcHRpb24oJ3BzX3N0YXRfemFsaXVfZGllbm9zJywnTkVFR1pJU1RVT0pBJyk7CiAkb1snb3B0X3ByYWR6aWEnXT1nZXRfb3B0aW9uKCdwc19zdGF0X3ByYWR6aWEnLCdORUVHWklTVFVPSkEnKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0A-2'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0b.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0a recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0b.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  // 1. isjungiam visus likusius TEMP snippetus
  const lst=await api('/wp-json/code-snippets/v1/snippets');
  let arr=[]; try{arr=JSON.parse(lst.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of arr){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); out.temp_isjungta.push(s.id); } }
  // 2. recon snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0B RECON',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,4500));
  try{ const r=await fetch(WP+'/?ps_p0=VAL2'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
