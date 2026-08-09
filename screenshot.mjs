process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfaGQnXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnaGQ1eDInKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyksJ3ZlcnNpamEnPT5QZXRzaG9wX0thdGFsb2dhczo6VkVSU0lKQV07CiAgJGtlbGlhcz1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogICRvdXRbJ2ZhaWxvX2R5ZGlzJ109ZmlsZXNpemUoJGtlbGlhcyk7CiAgJG91dFsnZmFpbG9fbWQ1J109bWQ1X2ZpbGUoJGtlbGlhcyk7CiAgJGtvZGFzPWZpbGVfZ2V0X2NvbnRlbnRzKCRrZWxpYXMpOwogIC8vIGFyIGZhaWxlIHlyYSB0cnlzIHRoCiAgcHJlZ19tYXRjaF9hbGwoIi9zZWxmOjp0aFwoXHMqJyhbYS16MC05XSspJy8iLCRrb2RhcywkbSk7CiAgJG91dFsndGhfZmFpbGUnXT0kbVsxXTsKICAkb3V0WydvcGNhY2hlJ109ZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2dldF9zdGF0dXMnKT8neXJhJzonbmVyYSc7CiAgLy8gcmVhbHVzIHRoZWFkIEhUTUwKICBQZXRzaG9wX0thdGFsb2dhczo6a2VzYXNfbGF1aygpOwogICRkPVBldHNob3BfS2F0YWxvZ2FzOjpzdXJpbmt0aSgpOwogICRiYXppbmlzPVsna3J1dmEnPT4ncHJla3lib2plJywndmlldyc9Pid2aXNvc19rcnV2b2plJywnc2FuZCc9PicnLCdrYXQnPT4nJywnYnJhbmQnPT4nJywnbGlrdXRpcyc9PicnLCdtYXJ6YSc9PicnLCd0aXBhcyc9PicnLCdxJz0+JyddOwogICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0thdGFsb2dhcycsJ2xlbnRlbGUnKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgb2Jfc3RhcnQoKTsgJHItPmludm9rZShudWxsLGFycmF5X3NsaWNlKCRkWydwcmVrZXMnXSwwLDIpLCduJywnYXNjJywkYmF6aW5pcyk7ICRodG1sPW9iX2dldF9jbGVhbigpOwogIGlmKHByZWdfbWF0Y2goJy88dGhlYWQ+Lio/PFwvdGhlYWQ+L3MnLCRodG1sLCRtbSkpICRvdXRbJ1RIRUFEJ109JG1tWzBdOwogICRvdXRbJ3RoX2tpZWtpcyddPXN1YnN0cl9jb3VudCgkaHRtbCwnPHRoJyk7CiAgLy8gcGlybWEgZWlsdXRlCiAgaWYocHJlZ19tYXRjaCgnLzx0Ym9keT4uKj88XC90cj4vcycsJGh0bWwsJG0yKSkgJG91dFsnUElSTUFfRUlMVVRFJ109bWJfc3Vic3RyKCRtMlswXSwwLDE4MDApOwogICRvdXRbJ3RkX2tpZWtpc19waXJtb2plJ109aXNzZXQoJG0yWzBdKT9zdWJzdHJfY291bnQoJG0yWzBdLCc8dGQnKTowOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`hd ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP head diag', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/hd.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_hd=1&k=hd5x2`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,2000); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/hd.json', out);
}
main().catch(async e=>{ await putResult('analize/hd.json',{klaida:String(e)}); });
