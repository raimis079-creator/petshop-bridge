process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfc2VrJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidTRUsnKTsKICAvKiBQcmVrZXMgc3UgVFZBUktJTkdBIHN0cnVrdHVyYSDigJQgcGlsbnVtYXMgMTAwICovCiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfQogICAgV0hFUkUgbWV0YV9rZXk9J19wc19waWxudW1hcycgQU5EIENBU1QobWV0YV92YWx1ZSBBUyBVTlNJR05FRCk+PTkwIExJTUlUIDMiKTsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfY29udGVudCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIElEPSVkIiwkcGlkKSk7CiAgICAkb3V0WydwdnonXVtdPWFycmF5KCdpZCc9PihpbnQpJHBpZCwncGF2Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJHBpZCksMCwzNCksCiAgICAgICdodG1sJz0+bWJfc3Vic3RyKCRjLDAsOTAwKSk7CiAgfQogIC8qIEtva2lvcyBhbnRyYXN0ZXMgZGF6bmF1c2lhaSBuYXVkb2phbW9zICovCiAgJHZpc2k9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfQogICAgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBMRU5HVEgocG9zdF9jb250ZW50KT4zMDAgTElNSVQgNDAwIik7CiAgJGFudHI9YXJyYXkoKTsKICBmb3JlYWNoKCR2aXNpIGFzICRjKXsKICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvPGgoWzEtNl0pW14+XSo+KC4qPyk8XC9oXDE+L2lzJywkYywkbSkpewogICAgICBmb3JlYWNoKCRtWzJdIGFzICRhKXsgJGE9dHJpbSh3cF9zdHJpcF9hbGxfdGFncygkYSkpOyBpZigkYSE9PScnKSAkYW50clsnaDonLiRhXT1pc3NldCgkYW50clsnaDonLiRhXSk/JGFudHJbJ2g6Jy4kYV0rMToxOyB9CiAgICB9CiAgICBpZihwcmVnX21hdGNoX2FsbCgnLzxzdHJvbmdbXj5dKj4oLio/KTxcL3N0cm9uZz4vaXMnLCRjLCRtMikpewogICAgICBmb3JlYWNoKCRtMlsxXSBhcyAkYSl7ICRhPXRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MoJGEpKTsgCiAgICAgICAgaWYoJGEhPT0nJyAmJiBtYl9zdHJsZW4oJGEpPDQ2KSAkYW50clsnYjonLiRhXT1pc3NldCgkYW50clsnYjonLiRhXSk/JGFudHJbJ2I6Jy4kYV0rMToxOyB9CiAgICB9CiAgfQogIGFyc29ydCgkYW50cik7CiAgJG91dFsnYW50cmFzdGVzJ109YXJyYXlfc2xpY2UoJGFudHIsMCwyMix0cnVlKTsKICAvKiBBciBwc2RwIGZ1bmtjaWpvcyB2ZWlraWEgaXIga2EgZ3JhemluYSAqLwogICRvdXRbJ3BzZHBfY2xlYW4nXT1mdW5jdGlvbl9leGlzdHMoJ3BzZHBfY2xlYW4nKTsKICAkb3V0Wydwc2RwX3NwbGl0J109ZnVuY3Rpb25fZXhpc3RzKCdwc2RwX3NwbGl0Jyk7CiAgaWYoJGlkcyAmJiBmdW5jdGlvbl9leGlzdHMoJ3BzZHBfc3BsaXQnKSl7CiAgICAkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfY29udGVudCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIElEPSVkIiwkaWRzWzBdKSk7CiAgICAkZD1wc2RwX3NwbGl0KGZ1bmN0aW9uX2V4aXN0cygncHNkcF9jbGVhbicpP3BzZHBfY2xlYW4oJGMpOiRjKTsKICAgICRvdXRbJ3NwbGl0X3B2eiddPWFycmF5KCk7CiAgICBpZihpc19hcnJheSgkZCkpIGZvcmVhY2goJGQgYXMgJHgpeyAkb3V0WydzcGxpdF9wdnonXVtdPWlzX2FycmF5KCR4KT9hcnJheSh0cmltKChzdHJpbmcpJHhbMF0pLG1iX3N1YnN0cih0cmltKHdwX3N0cmlwX2FsbF90YWdzKChzdHJpbmcpKCR4WzFdPz8nJykpKSwwLDYwKSk6Jz8nOyB9CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'sek', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function snip(name,code){
  const r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',
    headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name, code, scope:'global', active:true})});
  return await jsonSafe(r)||{};
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  const s=await snip('TEMP sek', PHP.replace(/^<\?php\s*/,''));
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_sek=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/sek.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'sek');
}
main().catch(e=>{});
