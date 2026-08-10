process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYWtjMyddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdhazVyN3EnKSByZXR1cm47CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidBS0MzJyk7CiAgJHA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOwogICRlaWw9ZXhwbG9kZSgiXG4iLCRjKTsKICAkb3V0Wyd6Yl9yZXByaWNlX2tvbnRla3N0YXMnXT1hcnJheSgpOwogIGZvcigkaT0xMDkwOyRpPDEyMDAgJiYgJGk8Y291bnQoJGVpbCk7JGkrKyl7CiAgICAkb3V0Wyd6Yl9yZXByaWNlX2tvbnRla3N0YXMnXVskaSsxXT1ydHJpbShtYl9zdWJzdHIoJGVpbFskaV0sMCwxNjApKTsKICB9CiAgLyogS3VyIFpCIHJlcHJpY2UgZnVua2NpamEgcHJhc2lkZWRhICovCiAgJG91dFsnZnVua2Npam9zJ109YXJyYXkoKTsKICBmb3JlYWNoKCRlaWwgYXMgJGk9PiRlKXsKICAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvblxzK1thLXpfXSoocmVwcmljZXxwcmljZXxrYWluKS9pJywkZSkpICRvdXRbJ2Z1bmtjaWpvcyddWyRpKzFdPXRyaW0obWJfc3Vic3RyKCRlLDAsMTIwKSk7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'akc3', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'akc3');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={VERSIJA:'AKC3'};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP akc3', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_akc3=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw=(await resp.text()).slice(0,400); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.name);
  await putJson('analize/akc3.json', out);
}
main().catch(async e=>{ await putJson('analize/akc3.json',{klaida:String(e).slice(0,300)}); });
