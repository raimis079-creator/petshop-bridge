process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcHViMiddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdkcTdtM3onKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9YXJyYXkoJ1ZFUlNJSkEnPT4nUFVCMicpOwoKICAvKiAxLiBXUCBBbGwgSW1wb3J0IHByb2ZpbGl1IG51c3RhdHltYWkgKi8KICAkdD0kd3BkYi0+cHJlZml4LidwbXhpX2ltcG9ydHMnOwogIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JHR9JyIpPT09JHQpewogICAgJGltcD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLHR5cGUsb3B0aW9ucyBGUk9NIHskdH0gT1JERVIgQlkgaWQiLCBBUlJBWV9BKTsKICAgIGZvcmVhY2goJGltcCBhcyAkaSl7CiAgICAgICRvPUB1bnNlcmlhbGl6ZSgkaVsnb3B0aW9ucyddKTsKICAgICAgJG91dFsnaW1wb3J0YWknXVtdPWFycmF5KAogICAgICAgICdpZCc9PihpbnQpJGlbJ2lkJ10sJ25hbWUnPT4kaVsnbmFtZSddLAogICAgICAgICdzdGF0dXMnPT5pc19hcnJheSgkbykmJmlzc2V0KCRvWydzdGF0dXMnXSk/JG9bJ3N0YXR1cyddOic/JywKICAgICAgICAnaXNfa2VlcF9mb3JtZXJfcG9zdHMnPT5pc19hcnJheSgkbykmJmlzc2V0KCRvWydpc19rZWVwX2Zvcm1lcl9wb3N0cyddKT8kb1snaXNfa2VlcF9mb3JtZXJfcG9zdHMnXTonPycsCiAgICAgICAgJ2NyZWF0ZV9uZXdfcmVjb3Jkcyc9PmlzX2FycmF5KCRvKSYmaXNzZXQoJG9bJ2NyZWF0ZV9uZXdfcmVjb3JkcyddKT8kb1snY3JlYXRlX25ld19yZWNvcmRzJ106Jz8nLAogICAgICAgICdpc191cGRhdGVfc3RhdHVzJz0+aXNfYXJyYXkoJG8pJiZpc3NldCgkb1snaXNfdXBkYXRlX3N0YXR1cyddKT8kb1snaXNfdXBkYXRlX3N0YXR1cyddOic/JywKICAgICAgICAndXBkYXRlX2FsbF9kYXRhJz0+aXNfYXJyYXkoJG8pJiZpc3NldCgkb1sndXBkYXRlX2FsbF9kYXRhJ10pPyRvWyd1cGRhdGVfYWxsX2RhdGEnXTonPycsCiAgICAgICk7CiAgICB9CiAgfSBlbHNlIHsgJG91dFsnaW1wb3J0YWknXT0nbmVyYSBsZW50ZWxlcyc7IH0KCiAgLyogMi4gS3VyIGtvZGUgbnVzdGF0b21hcyBwdWJsaXNoICovCiAgJHJhc3RhPWFycmF5KCk7CiAgZm9yZWFjaChzY2FuZGlyKFdQX1BMVUdJTl9ESVIpIGFzICRkaXIpewogICAgaWYoJGRpclswXT09PScuJ3x8c3RyaXBvcygkZGlyLCdwZXRzaG9wJyk9PT1mYWxzZSkgY29udGludWU7CiAgICAkZD1XUF9QTFVHSU5fRElSLicvJy4kZGlyOwogICAgaWYoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCkpOwogICAgZm9yZWFjaCgkaXQgYXMgJGYpewogICAgICBpZighJGYtPmlzRmlsZSgpfHwkZi0+Z2V0RXh0ZW5zaW9uKCkhPT0ncGhwJykgY29udGludWU7CiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kZSl7CiAgICAgICAgaWYocHJlZ19tYXRjaCgnL3Bvc3Rfc3RhdHVzfHdwX3B1Ymxpc2hfcG9zdHxwbXhpX3NhdmVkX3Bvc3R8d3BfYWxsX2ltcG9ydC8nLCRlKSl7CiAgICAgICAgICAkcmFzdGFbc3RyX3JlcGxhY2UoV1BfUExVR0lOX0RJUi4nLycsJycsJGYtPmdldFBhdGhuYW1lKCkpXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRlLDAsMTMwKSk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgfQogIC8qIG11LXBsdWdpbnMgaXJnaSAqLwogIGZvcmVhY2goc2NhbmRpcihXUE1VX1BMVUdJTl9ESVIpIGFzICRmKXsKICAgIGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZik7CiAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRlKXsKICAgICAgaWYocHJlZ19tYXRjaCgnL3Bvc3Rfc3RhdHVzfHdwX3B1Ymxpc2hfcG9zdHxwbXhpX3NhdmVkX3Bvc3QvJywkZSkpewogICAgICAgICRyYXN0YVsnbXUvJy4kZl1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkZSwwLDEzMCkpOwogICAgICB9CiAgICB9CiAgfQogIGZvcmVhY2goJHJhc3RhIGFzICRrPT4kdil7ICRyYXN0YVska109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCR2KSwwLDEyKTsgfQogICRvdXRbJ2tvZGUnXT0kcmFzdGE7CgogIC8qIDMuIFNuaXBwZXQnYWkgc3UgcHVibGlzaCAqLwogICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJXBvc3Rfc3RhdHVzJScgT1IgY29kZSBMSUtFICclcG14aV9zYXZlZF9wb3N0JSciLCBBUlJBWV9BKTsKICAkb3V0WydzbmlwcGV0YWknXT0kc247CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'p2', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP p2', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_pub2=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/pub2.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'p2');
}
main().catch(e=>{});
