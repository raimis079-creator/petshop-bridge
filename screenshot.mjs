process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfa2F0MiddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdkcTdtM3onKSByZXR1cm47CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidLQVQyJyk7CiAgJHQ9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogICRvdXRbJ3Zpc28nXT1pc193cF9lcnJvcigkdCk/J2tsJzpjb3VudCgkdCk7CiAgJHNhcj1hcnJheSgpOwogIGZvcmVhY2goJHQgYXMgJHgpewogICAgJHNhcltdPWFycmF5KCdpZCc9PiR4LT50ZXJtX2lkLCduYW1lJz0+JHgtPm5hbWUsJ3BhcmVudCc9PiR4LT5wYXJlbnQsJ2NvdW50Jz0+JHgtPmNvdW50LCdzbHVnJz0+JHgtPnNsdWcpOwogIH0KICAkb3V0Wyd0dXNjaW9zJ109Y291bnQoYXJyYXlfZmlsdGVyKCRzYXIsZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnY291bnQnXT09MDt9KSk7CiAgJG91dFsnc2FrbmluZXMnXT1jb3VudChhcnJheV9maWx0ZXIoJHNhcixmdW5jdGlvbigkeCl7cmV0dXJuICR4WydwYXJlbnQnXT09MDt9KSk7CiAgLyogTWVkaXM6IGtpZWsgbHlnaXUgKi8KICAkbHlnaWFpPWFycmF5KCk7CiAgZm9yZWFjaCgkc2FyIGFzICR4KXsgJGw9Y291bnQoZ2V0X2FuY2VzdG9ycygkeFsnaWQnXSwncHJvZHVjdF9jYXQnKSk7ICRseWdpYWlbJGxdPWlzc2V0KCRseWdpYWlbJGxdKT8kbHlnaWFpWyRsXSsxOjE7IH0KICAkb3V0WydseWdpYWknXT0kbHlnaWFpOwogICRvdXRbJ3B2el90dXNjaW9zJ109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ25hbWUnXS4nICgnLiR4Wydjb3VudCddLicpJzt9LAogICAgYXJyYXlfZmlsdGVyKCRzYXIsZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnY291bnQnXT09MDt9KSksMCwxMik7CiAgLyogQnJlbmRhaSAqLwogICRiPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9icmFuZCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogICRvdXRbJ2JyZW5kdSddPWlzX3dwX2Vycm9yKCRiKT8na2wnOmNvdW50KCRiKTsKICAkb3V0WydicmVuZHVfbmV0dXNjaXUnXT1pc193cF9lcnJvcigkYik/MDpjb3VudChhcnJheV9maWx0ZXIoJGIsZnVuY3Rpb24oJHgpe3JldHVybiAkeC0+Y291bnQ+MDt9KSk7CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'k2', content:b64}; if(sha) body.sha=sha;
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
  const s=await snip('TEMP k2', PHP.replace(/^<\?php\s*/,''));
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_kat2=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/kat2.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'k2');
}
main().catch(e=>{});
