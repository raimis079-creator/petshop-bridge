process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2NCddKSA/ICRfR0VUWydwc19oMTY0J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2NCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogJGVpbD1AZmlsZSgkZik7CiAkb1snZWlsdWNpdSddPWNvdW50KCRlaWwpOwogJG9bJ21kNSddPUBtZDVfZmlsZSgkZik7CiAvKiAxLiBrdXIgc2thaXRvbWFzIHZpZXcgLyBxLCBrdXIgZm9ybXVvamFtYSBhbnRyYXN0ZSAiZmlsdHJ1IG5lcmEiICovCiAkc3JpdHlzPWFycmF5KAogICAndmlld19za2FpdHltYXMnID0+ICIvXFxcJF9HRVRcXFsndmlldydcXF18J3ZpZXcnXFxzKj0+fFxcXCR2aWV3XFxzKj0vIiwKICAgJ2ZpbHRydV9hbnRyYXN0ZSc9PiAiL2ZpbHRyxbMgbsSXcmF8ZmlsdHJ1IG5lcmF8dmlzb3Mga3LFq3Zvc3x2aXNvcyBrcnV2b3MvdSIsCiAgICdpc3ZhbHl0aScgICAgICAgPT4gIi9JxaF2YWx5dGl8SXN2YWx5dGl8aXN2YWx5dGlcXCh8Y2xlYXJGaWx0ZXJzfHBzX2lzdmFseXRpL3UiLAogICAnZWlsZXNfbWFzeXZhcycgID0+ICIvemVtaWF1X3JpYm9zfCdlaWxlcyd8ZWlsZXNcXChcXCl8RUlMRVMvdSIsCiApOwogZm9yZWFjaCgkc3JpdHlzIGFzICR2YXJkYXM9PiRyZSl7CiAgICRoPWFycmF5KCk7CiAgIGZvcmVhY2goJGVpbCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCRyZSwkbCkpICRoW109JGkrMTsgfQogICAkb1snZWlsXycuJHZhcmRhc109JGg7CiB9CiAvKiBpc3RyYXVrb3MgKi8KICRpbWs9ZnVuY3Rpb24oJG51bywkaWtpKSB1c2UoJGVpbCl7CiAgICRudW89bWF4KDEsJG51byk7ICRpa2k9bWluKGNvdW50KCRlaWwpLCRpa2kpOwogICByZXR1cm4gaW1wbG9kZSgiXG4iLCBhcnJheV9tYXAoZnVuY3Rpb24oJGspdXNlKCRlaWwpe3JldHVybiAoJGsrMSkuJzogJy5ydHJpbSgkZWlsWyRrXSk7fSwgcmFuZ2UoJG51by0xLCRpa2ktMSkpKTsKIH07CiBmb3JlYWNoKGFycmF5KCdmaWx0cnVfYW50cmFzdGUnLCdpc3ZhbHl0aScpIGFzICRzKXsKICAgJGg9JG9bJ2VpbF8nLiRzXTsKICAgaWYoJGgpeyAkb1snaXNrXycuJHNdPSRpbWsoJGhbMF0tMjUsJGhbMF0rMzUpOyB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H164'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H164 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h164=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h164.json', Buffer.from(JSON.stringify(out,null,1)), 'h164 Monge merge APPLY');
