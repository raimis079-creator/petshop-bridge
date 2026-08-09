process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfdjI5diddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICd2Mjl2NmInKSByZXR1cm47CiAgaWYoIWNsYXNzX2V4aXN0cygnUGV0c2hvcF9LYXRhbG9nYXMnKSl7IHdwX3NlbmRfanNvbihbJ2tsYWlkYSc9PiduZXJhIGtsYXNlcyddKTsgfQogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyksJ3ZlcnNpamEnPT5QZXRzaG9wX0thdGFsb2dhczo6VkVSU0lKQV07CiAgJG91dFsndmFyaWtsaWFpJ109WwogICAgJ2l2eWtpYWknPT5jbGFzc19leGlzdHMoJ1BldHNob3BfSXZ5a2lhaScpP1BldHNob3BfSXZ5a2lhaTo6VkVSU0lKQTonbmVyYScsCiAgICAncGFyZGF2aW1haSc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJkYXZpbWFpJyk/UGV0c2hvcF9QYXJkYXZpbWFpOjpWRVJTSUpBOiduZXJhJywKICAgICdwaWxudW1hcyc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9QaWxudW1hcycpP1BldHNob3BfUGlsbnVtYXM6OlZFUlNJSkE6J25lcmEnLAogIF07CiAgUGV0c2hvcF9LYXRhbG9nYXM6Omtlc2FzX2xhdWsoKTsKICAkZD1QZXRzaG9wX0thdGFsb2dhczo6c3VyaW5rdGkoKTsKICAkb3V0WydwcmVrdSddPWNvdW50KCRkWydwcmVrZXMnXSk7CiAgJHB2ej1udWxsOyBmb3JlYWNoKCRkWydwcmVrZXMnXSBhcyAkcil7IGlmKCRyWydwYmFsYXMnXSE9PW51bGwmJiRyWyd2MzAnXSE9PW51bGwpeyAkcHZ6PSRyOyBicmVhazsgfSB9CiAgaWYoJHB2eil7CiAgICAkb3V0WydwdnonXT1bJ2lkJz0+JHB2elsnaWQnXSwncGF2Jz0+bWJfc3Vic3RyKCRwdnpbJ24nXSwwLDMwKSwndjMwJz0+JHB2elsndjMwJ10sJ3YzNjUnPT4kcHZ6Wyd2MzY1J10sCiAgICAgICdkaWVudSc9PiRwdnpbJ2RpZW51J10sJ2FiYyc9PiRwdnpbJ2FiYyddLCdwYmFsYXMnPT4kcHZ6WydwYmFsYXMnXSwncHRydWtzdCc9PiRwdnpbJ3B0cnVrc3QnXV07CiAgICAkcD1QZXRzaG9wX0thdGFsb2dhczo6cGlsbnVtYXMoJHB2eik7CiAgICAkb3V0WydwaWxudW1vX3NhbHRpbmlzJ109JHBbJ3NhbHRpbmlzJ107ICRvdXRbJ3BpbG51bW9fcHJvYyddPSRwWydwcm9jJ107CiAgfQogICRlPVBldHNob3BfS2F0YWxvZ2FzOjplaWxlcygkZFsncHJla2VzJ10sJ3ByZWt5Ym9qZScpOwogICRvdXRbJ2VpbGVzJ109Wyd2aXNvcyc9PiRlWyd2aXNvc19rcnV2b2plJ10sJ2JhaWdpYXNpJz0+JGVbJ2JhaWdpYXNpJ10sJ25lZ3l2b3MnPT4kZVsnbmVneXZvcyddLCdza29sb3MnPT4kZVsnc2tvbG9zJ11dOwogIC8vIFRFSVNJTkdBUyAkZiBtYXN5dmFzCiAgJGJhemluaXM9WydrcnV2YSc9PidwcmVreWJvamUnLCd2aWV3Jz0+J3Zpc29zX2tydXZvamUnLCdzYW5kJz0+JycsJ2thdCc9PicnLCdicmFuZCc9PicnLCdsaWt1dGlzJz0+JycsJ21hcnphJz0+JycsJ3RpcGFzJz0+JycsJ3EnPT4nJ107CiAgZm9yZWFjaChbJ3Zpc29zX2tydXZvamUnLCdiYWlnaWFzaScsJ25lZ3l2b3MnLCdza29sb3MnXSBhcyAkdil7CiAgICAkZj0kYmF6aW5pczsgJGZbJ3ZpZXcnXT0kdjsKICAgICRvdXRbJ2ZpbHRyYXNfJy4kdl09Y291bnQoUGV0c2hvcF9LYXRhbG9nYXM6OmZpbHRydW90aSgkZFsncHJla2VzJ10sJGYpKTsKICB9CiAgLy8gYXIgZmlsdHJhcyBzdXRhbXBhIHN1IGVpbGVzIHNrYWljaXVtaQogICRvdXRbJ1NVVEFQSU1BUyddPVsKICAgICdiYWlnaWFzaSc9Pigkb3V0WydmaWx0cmFzX2JhaWdpYXNpJ109PT0kZVsnYmFpZ2lhc2knXSk/J0dFUkFJJzonTkVTVVRBTVBBJywKICAgICduZWd5dm9zJz0+KCRvdXRbJ2ZpbHRyYXNfbmVneXZvcyddPT09JGVbJ25lZ3l2b3MnXSk/J0dFUkFJJzonTkVTVVRBTVBBJywKICAgICdza29sb3MnPT4oJG91dFsnZmlsdHJhc19za29sb3MnXT09PSRlWydza29sb3MnXSk/J0dFUkFJJzonTkVTVVRBTVBBJywKICBdOwogIC8vIFJFQUxVUyBIVE1MOiBrdmllxI1pYW0gcHVzbGFwxK8gc3Ugb3V0cHV0IGJ1ZmZlcgogICRfR0VUWydwYWdlJ109J3BzLWthdGFsb2dhcyc7CiAgb2Jfc3RhcnQoKTsgUGV0c2hvcF9LYXRhbG9nYXM6OnB1c2xhcGlzKCk7ICRodG1sPW9iX2dldF9jbGVhbigpOwogICRvdXRbJ2h0bWxfaWxnaXMnXT1zdHJsZW4oJGh0bWwpOwogICRvdXRbJ0hUTUwnXT1bCiAgICAnc3R1bHBfcGFyZGF2aW1haSc9PnN0cnBvcygkaHRtbCwnPlBhcmRhdmltYWk8JykhPT1mYWxzZXx8c3RycG9zKCRodG1sLCdQYXJkYXZpbWFpJykhPT1mYWxzZSwKICAgICdzdHVscF91enRla3MnPT5zdHJwb3MoJGh0bWwsJ1XFvnRla3MnKSE9PWZhbHNlLAogICAgJ3N0dWxwX3BpbG51bWFzJz0+c3RycG9zKCRodG1sLCc+UGlsbnVtYXM8JykhPT1mYWxzZXx8c3RycG9zKCRodG1sLCdQaWxudW1hcycpIT09ZmFsc2UsCiAgICAnZWlsZV9iYWlnaWFzaSc9PnN0cnBvcygkaHRtbCwnQmFpZ2lhc2kgZ3JlacSNaWF1JykhPT1mYWxzZSwKICAgICdlaWxlX25lZ3l2b3MnPT5zdHJwb3MoJGh0bWwsJ05lZ3l2b3MgYXRzYXJnb3MnKSE9PWZhbHNlLAogICAgJ2VpbGVfc2tvbG9zJz0+c3RycG9zKCRodG1sLCdEdW9tZW7FsyBza29sb3MnKSE9PWZhbHNlLAogICAgJ2Nzc19wYXJkX2dyJz0+c3RycG9zKCRodG1sLCdwYXJkLWdyJykhPT1mYWxzZSwKICAgICdjc3NfcGlsbic9PnN0cnBvcygkaHRtbCwnLnBpbG4nKSE9PWZhbHNlLAogICAgJ2tsYWlkb3MnPT4oc3RyaXBvcygkaHRtbCwnZmF0YWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRodG1sLCdXYXJuaW5nOicpIT09ZmFsc2UpLAogIF07CiAgLy8ga29ydGVsZQogICRraWQ9JHB2ej8kcHZ6WydpZCddOjA7CiAgaWYoJGtpZCl7CiAgICBvYl9zdGFydCgpOyBQZXRzaG9wX0thdGFsb2dhczo6a29ydGVsZSgka2lkKTsgJGtoPW9iX2dldF9jbGVhbigpOwogICAgJG91dFsna29ydGVsZV9pbGdpcyddPXN0cmxlbigka2gpOwogICAgJG91dFsnS09SVEVMRSddPVsKICAgICAgJ2thaXBfc2VrYXNpJz0+c3RycG9zKCRraCwnS2FpcCBzZWthc2knKSE9PWZhbHNlLAogICAgICAncGlsbnVtYXNfYmxva2FzJz0+c3RycG9zKCRraCwnRHVvbWVuxbMgcGlsbnVtYXMnKSE9PWZhbHNlLAogICAgICAnanVvc3RhJz0+c3RycG9zKCRraCwnVmlza2FzLCBrYXMgdnlrbycpIT09ZmFsc2UsCiAgICAgICdzZW5hc190ZWtzdGFzJz0+c3RycG9zKCRraCwnSW1wb3J0xbMgaXIga2l0xbMgxaFhbHRpbmnFsyBrZWl0aW1haSDEjWlhIG5lcGF0ZW5rYScpIT09ZmFsc2UsCiAgICAgICdrbGFpZG9zJz0+KHN0cmlwb3MoJGtoLCdmYXRhbCcpIT09ZmFsc2V8fHN0cmlwb3MoJGtoLCdXYXJuaW5nOicpIT09ZmFsc2UpLAogICAgXTsKICB9CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`v29ver ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP v29 verifikacija', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/v29ver.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_v29v=1&k=v29v6b`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  out.http=resp.status;
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,2500); }
  const d=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.deakt=d.status;
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.aktyvus_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>`#${x.id}`);
  await putResult('analize/v29ver.json', out);
}
main().catch(async e=>{ await putResult('analize/v29ver.json',{klaida:String(e)}); });
