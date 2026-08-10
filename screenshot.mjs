process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYWtjNSddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdhazVyN3EnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9YXJyYXkoJ1ZFUlNJSkEnPT4nQUtDNScpOwogICRiPWdldF90ZXJtX2J5KCduYW1lJywnQW1icm9zaWEnLCdwYV9icmVuZGFzJyk7CiAgJG91dFsncGFfYnJlbmRhc190ZXJtaW5hcyddPSAkYiA/IGFycmF5KCdpZCc9PiRiLT50ZXJtX2lkLCdjb3VudCc9PiRiLT5jb3VudCwnc2x1Zyc9PiRiLT5zbHVnKSA6ICduZXJhJzsKICAvKiBLb2tpYXMgYnJlbmR1IHRha3Nvbm9taWphcyB0dXJpbSAqLwogICRvdXRbJ3Rha3Nvbm9taWpvcyddPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgncGFfYnJlbmRhcycsJ3Byb2R1Y3RfYnJhbmQnLCdwd2ItYnJhbmQnLCdicmFuZCcpIGFzICR0KXsKICAgICRvdXRbJ3Rha3Nvbm9taWpvcyddWyR0XT0gdGF4b25vbXlfZXhpc3RzKCR0KSA/IChpbnQpd3BfY291bnRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+JHQsJ2hpZGVfZW1wdHknPT5mYWxzZSkpIDogJ25lcmEnOwogIH0KICAvKiBBbWJyb3NpYSBwcmVrZXMgaXIganUgYnJlbmRvIHRlcm1pbmFpICovCiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVtYnJvc2lhJScgTElNSVQgNSIpOwogICRvdXRbJ2FtYnJvc2lhX3ByZWtlcyddPWFycmF5KCk7CiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJGU9YXJyYXkoJ2lkJz0+KGludCkkcGlkLCdwYXYnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkcGlkKSwwLDQwKSk7CiAgICBmb3JlYWNoKGFycmF5KCdwYV9icmVuZGFzJywncHJvZHVjdF9icmFuZCcpIGFzICR0KXsKICAgICAgaWYoIXRheG9ub215X2V4aXN0cygkdCkpIGNvbnRpbnVlOwogICAgICAkdHQ9d3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwkdCxhcnJheSgnZmllbGRzJz0+J2FsbCcpKTsKICAgICAgJGVbJHRdPSBpc193cF9lcnJvcigkdHQpID8gJ2tsYWlkYScgOiBhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeC0+dGVybV9pZC4nOicuJHgtPm5hbWU7fSwkdHQpOwogICAgfQogICAgJG91dFsnYW1icm9zaWFfcHJla2VzJ11bXT0kZTsKICB9CiAgLyogVGllc2lvZ2luaXMgZ2V0X3Bvc3RzIHRlc3RhcyAqLwogIGlmKCRiKXsKICAgICRxPWdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsCiAgICAgICdub19mb3VuZF9yb3dzJz0+dHJ1ZSwndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3BhX2JyZW5kYXMnLCdmaWVsZCc9Pid0ZXJtX2lkJywndGVybXMnPT5hcnJheSgkYi0+dGVybV9pZCkpKSkpOwogICAgJG91dFsnZ2V0X3Bvc3RzX3BhX2JyZW5kYXMnXT1jb3VudCgkcSk7CiAgICAkcTI9Z2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9Pi0xLCdmaWVsZHMnPT4naWRzJywKICAgICAgJ25vX2ZvdW5kX3Jvd3MnPT50cnVlLCd0YXhfcXVlcnknPT5hcnJheShhcnJheSgndGF4b25vbXknPT4ncGFfYnJlbmRhcycsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PiRiLT50ZXJtX2lkKSkpKTsKICAgICRvdXRbJ2dldF9wb3N0c19iZV9tYXN5dm8nXT1jb3VudCgkcTIpOwogICAgJG91dFsnc3FsX3RpZXNpb2dpYWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyCiAgICAgICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZAogICAgICAgIEpPSU4geyR3cGRiLT5wb3N0c30gcCBPTiBwLklEPXRyLm9iamVjdF9pZCBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICAgV0hFUkUgdHQudGVybV9pZD0lZCIsICRiLT50ZXJtX2lkKSk7CiAgfQogIC8qIEFyIFBldHNob3BfQWtjaWpvczo6YXRyaW5rdGkgdmVpa2lhICovCiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FrY2lqb3MnKSAmJiAkYil7CiAgICAkYT1hcnJheSgnaWQnPT4wLCd0YWlraW55c190aXBhcyc9PidicmVuZGFzJywndGFpa2lueXMnPT5hcnJheSgnYnJlbmRhaSc9PmFycmF5KCRiLT50ZXJtX2lkKSksCiAgICAgICdpc2ltdHlzJz0+YXJyYXkoKSwnbWV0b2Rhcyc9Pidwcm9jJywncmVpa3NtZSc9PjE1LCdwcmlvcml0ZXRhcyc9PjEwKTsKICAgICRvdXRbJ2F0cmlua3RpJ109Y291bnQoUGV0c2hvcF9Ba2Npam9zOjphdHJpbmt0aSgkYSkpOwogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'akc5', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'akc5');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP akc5', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_akc5=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw=(await resp.text()).slice(0,400); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putJson('analize/akc5.json', out);
}
main().catch(async e=>{ await putJson('analize/akc5.json',{klaida:String(e).slice(0,300)}); });
