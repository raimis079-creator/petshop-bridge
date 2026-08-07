// S638 — E0 recon: resolve(), Stock_Service, ps_sources, naudojimo vietos
const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const PROBE='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19lMHJlY29uJ10/PycnKSE9PSdTNjM4eCcpIHJldHVybjsKICBpZighKCBjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpIHx8ICgoJF9HRVRbJ2snXT8/JycpPT09J3BzMjAyNicpICkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvdXQgPSBhcnJheSgndic9PidFMFJFQ09OLVYxJyk7CgogIC8vIDEpIE1VLVBMVUdJTiBmYWlsYWkKICAkbXUgPSBXUE1VX1BMVUdJTl9ESVI7CiAgJG91dFsnbXVfZmFpbGFpJ10gPSBhcnJheV92YWx1ZXMoYXJyYXlfZGlmZihzY2FuZGlyKCRtdSksIGFycmF5KCcuJywnLi4nKSkpOwogICR3YW50ID0gYXJyYXkoJ2F2LXNvdXJjZS5waHAnLCdhdi1zdG9jay5waHAnLCdhdi1vcmRlci5waHAnLCdhdi1yZWR1Y2UucGhwJywnYXYtbGltaXQucGhwJywnYXYtZHJvcHNoaXAucGhwJyk7CiAgZm9yZWFjaCgkd2FudCBhcyAkZil7CiAgICAkcCA9ICRtdS4nLycuJGY7CiAgICBpZihmaWxlX2V4aXN0cygkcCkpewogICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgICAgJG91dFsnZmFpbGFpJ11bJGZdID0gYXJyYXkoJ2J5dGVzJz0+c3RybGVuKCRjKSwnc2hhJz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKCRjKSk7CiAgICB9IGVsc2UgeyAkb3V0WydmYWlsYWknXVskZl0gPSAnTkVSQSc7IH0KICB9CgogIC8vIDIpIHBzX3NvdXJjZXMgc2NoZW1hICsgcGF2eXpkemlhaQogICR0ID0gJHdwZGItPnByZWZpeC4ncHNfc291cmNlcyc7CiAgJG91dFsncHNfc291cmNlc195cmEnXSA9IChib29sKSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdCciKTsKICBpZigkb3V0Wydwc19zb3VyY2VzX3lyYSddKXsKICAgICRvdXRbJ3BzX3NvdXJjZXNfc2NoZW1hJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NICR0IiwgQVJSQVlfQSk7CiAgICAkb3V0Wydwc19zb3VyY2VzX2tpZWtpcyddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAgICRvdXRbJ3BzX3NvdXJjZXNfcGFnYWxfc2FsdGluaSddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc291cmNlLCBDT1VOVCgqKSBjIEZST00gJHQgR1JPVVAgQlkgc291cmNlIE9SREVSIEJZIGMgREVTQyIsIEFSUkFZX0EpOwogICAgJG91dFsncHNfc291cmNlc19wdnonXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkdCBPUkRFUiBCWSBpZCBMSU1JVCA2IiwgQVJSQVlfQSk7CiAgICAkb3V0WydkYXVnaWFzYWx0aW5pYWknXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIChTRUxFQ1QgcHJvZHVjdF9pZCBGUk9NICR0IEdST1VQIEJZIHByb2R1Y3RfaWQgSEFWSU5HIENPVU5UKCopPjEpIHgiKTsKICB9CgogIC8vIDMpIGtsYXNlcyBpciBtZXRvZGFpCiAgZm9yZWFjaChhcnJheSgnQVZfU291cmNlJywnUGV0c2hvcF9TdG9ja19TZXJ2aWNlJywnQVZfU3RvY2snLCdQZXRzaG9wX1NvdXJjZXMnLCdQZXRzaG9wX0Nvc3RfUmVzb2x2ZXInKSBhcyAkYyl7CiAgICAkb3V0WydrbGFzZXMnXVskY10gPSBjbGFzc19leGlzdHMoJGMpID8gZ2V0X2NsYXNzX21ldGhvZHMoJGMpIDogZmFsc2U7CiAgfQoKICAvLyA0KSBrYXMga3ZpZWNp0LAgcmVzb2x2ZSgpIOKAlCBwYWllc2thIHBsdWdpbit0aGVtZSBmYWlsdW9zZQogICRoaXRzID0gYXJyYXkoKTsKICAkZGlycyA9IGFycmF5KFdQX1BMVUdJTl9ESVIsIFdQTVVfUExVR0lOX0RJUiwgZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkpOwogIGZvcmVhY2goJGRpcnMgYXMgJGQpewogICAgaWYoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgJGl0ID0gbmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgZm9yZWFjaCgkaXQgYXMgJGYpewogICAgICBpZigkZi0+Z2V0RXh0ZW5zaW9uKCkhPT0ncGhwJykgY29udGludWU7CiAgICAgIGlmKCRmLT5nZXRTaXplKCkgPiA5MDAwMDApIGNvbnRpbnVlOwogICAgICAkYyA9IEBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgIGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICBpZihzdHJwb3MoJGMsJ0FWX1NvdXJjZTo6cmVzb2x2ZScpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCctPnJlc29sdmUoJykhPT1mYWxzZSAmJiBzdHJwb3MoJGMsJ0FWX1NvdXJjZScpIT09ZmFsc2UpewogICAgICAgICRuID0gc3Vic3RyX2NvdW50KCRjLCdBVl9Tb3VyY2U6OnJlc29sdmUnKTsKICAgICAgICBpZigkbj4wKSAkaGl0c1tdID0gYXJyYXkoJ2YnPT5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmLT5nZXRQYXRobmFtZSgpKSwnbic9PiRuKTsKICAgICAgfQogICAgfQogIH0KICAkb3V0WydyZXNvbHZlX25hdWRvamltYXMnXSA9ICRoaXRzOwoKICAvLyA1KSBzbmlwcGV0YWkgc3UgQVZfU291cmNlIC8gU3RvY2tfU2VydmljZQogICRzdCA9ICR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAkb3V0WydzbmlwcGV0YWlfc3VfcmVzb2x2ZSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NICRzdCBXSEVSRSBhY3RpdmU9MSBBTkQgKGNvZGUgTElLRSAnJUFWX1NvdXJjZSUnIE9SIGNvZGUgTElLRSAnJVN0b2NrX1NlcnZpY2UlJyBPUiBjb2RlIExJS0UgJyVwc19zb3VyY2VzJScpIiwgQVJSQVlfQSk7CgogIGhlYWRlcignQ29udGVudC1UeXBlOmFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(name,obj){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+name;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const body={message:'result '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  if(sha) body.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('putResult',name,r.status);
}
const out={version:'S638-V1',errors:[]};
// 1) snippetu 2384 / 2387 kodas
for(const id of [2384,2387]){
  try{
    const j=await(await fetch(BASE+'/'+id,{headers:{Authorization:AUTH}})).json();
    out['snip_'+id]={name:j.name,active:j.active,len:(j.code||'').length,b64:Buffer.from(j.code||'').toString('base64')};
  }catch(e){out.errors.push({id,e:String(e)});}
}
// 2) recon snippetas
try{
  const code=Buffer.from(PROBE,'base64').toString('utf8');
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP E0 Recon v1 (S638)',code,scope:'global',active:true,priority:10})});
  const j=await r.json(); out.recon_id=j.id;
  await new Promise(r=>setTimeout(r,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_e0recon=S638x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.recon=JSON.parse(t);}catch(e){out.recon_raw=t.slice(0,3000);}
  // isjungiam recon
  await fetch(BASE+'/'+j.id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
}catch(e){out.errors.push({step:'recon',e:String(e)});}
await putResult('s638_v1.json',out);
console.log('DONE');
