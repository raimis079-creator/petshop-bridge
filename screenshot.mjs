process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYWtjOCddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdhazVyN3EnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9YXJyYXkoJ1ZFUlNJSkEnPT4nQUtDOCcpOwogICRhPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2FrY2lqb3MgV0hFUkUgaWQ9MSIsIEFSUkFZX0EpOwogICRvdXRbJ2FrY2lqYSddPSRhOwogIC8qIEFyIHlyYSBrZWxpIEFtYnJvc2lhIHRlcm1pbmFpICovCiAgZm9yZWFjaChhcnJheSgncHJvZHVjdF9icmFuZCcsJ3BhX2JyZW5kYXMnKSBhcyAkdCl7CiAgICBpZighdGF4b25vbXlfZXhpc3RzKCR0KSkgY29udGludWU7CiAgICAkdHQ9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9PiR0LCdoaWRlX2VtcHR5Jz0+ZmFsc2UsJ3NlYXJjaCc9PidBbWJyb3NpYScpKTsKICAgICRvdXRbJ3Rlcm1pbmFpJ11bJHRdPWlzX3dwX2Vycm9yKCR0dCk/J2tsYWlkYSc6YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXsKICAgICAgcmV0dXJuIGFycmF5KCdpZCc9PiR4LT50ZXJtX2lkLCduYW1lJz0+JHgtPm5hbWUsJ3NsdWcnPT4keC0+c2x1ZywnY291bnQnPT4keC0+Y291bnQpO30sJHR0KTsKICB9CiAgLyogS2llayBBbWJyb3NpYSBwcmVrdSBwdWJsaXNoIHZzIGRyYWZ0ICovCiAgJGI9Z2V0X3Rlcm1fYnkoJ25hbWUnLCdBbWJyb3NpYScsJ3Byb2R1Y3RfYnJhbmQnKTsKICBpZigkYil7CiAgICBmb3JlYWNoKGFycmF5KCdwdWJsaXNoJywnZHJhZnQnLCdhbnknKSBhcyAkc3QpewogICAgICAkcT1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4kc3QsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLAogICAgICAgICdub19mb3VuZF9yb3dzJz0+dHJ1ZSwndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfYnJhbmQnLCdmaWVsZCc9Pid0ZXJtX2lkJywndGVybXMnPT5hcnJheSgkYi0+dGVybV9pZCkpKSkpOwogICAgICAkb3V0WydhbWJyb3NpYV8nLiRzdF09Y291bnQoJHEpOwogICAgfQogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'akc8', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'akc8');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP akc8', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_akc8=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw=(await resp.text()).slice(0,400); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putJson('analize/akc8.json', out);
}
main().catch(async e=>{ await putJson('analize/akc8.json',{klaida:String(e).slice(0,300)}); });
