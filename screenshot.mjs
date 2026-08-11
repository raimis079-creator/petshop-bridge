process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfc2F2J10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidTQVYnKTsKICAvKiBQcmVrZXMgYmUgSk9LSU9TIHNhdmlrYWlub3MgbWV0YSAqLwogICRvdXRbJ2JlX2pva2lvcyddPShpbnQpJHdwZGItPmdldF92YXIoCiAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgICAgQU5EIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00geyR3cGRiLT5wb3N0bWV0YX0gbSBXSEVSRSBtLnBvc3RfaWQ9cC5JRAogICAgICAgICAgICAgQU5EIG0ubWV0YV9rZXkgSU4gKCdfY29zdF9wcmljZScsJ192Zl9jb3N0JywnX3piX2Nvc3QnKSBBTkQgbS5tZXRhX3ZhbHVlPjApIik7CiAgLyogU3UgYmVudCB2aWVuYSAqLwogICRvdXRbJ3N1X2JlbnRfdmllbmEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKAogICAgIlNFTEVDVCBDT1VOVChESVNUSU5DVCBwLklEKSBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklECiAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICAgQU5EIG0ubWV0YV9rZXkgSU4gKCdfY29zdF9wcmljZScsJ192Zl9jb3N0JywnX3piX2Nvc3QnKSBBTkQgbS5tZXRhX3ZhbHVlPjAiKTsKICAvKiBQaWxudW1vIHNrYWljaXVzICovCiAgJG91dFsncGlsbnVtYXNfYmVfc2F2aWthaW5vcyddPShpbnQpJHdwZGItPmdldF92YXIoCiAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19waWxudW1hc19rb2RhaScgQU5EIG1ldGFfdmFsdWUgTElLRSAnJXxzYXZpa2FpbmF8JSciKTsKICAvKiBLYXRhbG9nbyB2ZXJzaWphICovCiAgJG91dFsna2F0YWxvZ2FzX3YnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfS2F0YWxvZ2FzJyk/UGV0c2hvcF9LYXRhbG9nYXM6OlZFUlNJSkE6J25lcmEnOwogIC8qIFBhdnl6ZHppYWk6IDUgcHJla2VzIGlzIOKAnmJlIHNhdmlrYWlub3MiIHBhZ2FsIGthdGFsb2dvIGxvZ2lrYSAqLwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9LYXRhbG9nYXMnKSl7CiAgICAkZD1QZXRzaG9wX0thdGFsb2dhczo6c3VyaW5rdGkoKTsKICAgICRiZT1hcnJheSgpOyAkc3V2Zj0wOwogICAgZm9yZWFjaCgkZFsncHJla2VzJ10gYXMgJHIpewogICAgICBpZigkclsnc3QnXSE9PSdwdWJsaXNoJykgY29udGludWU7CiAgICAgIGlmKCRyWydjb3N0J109PT1udWxsKXsKICAgICAgICAkYmVbXT0kclsnaWQnXTsKICAgICAgICAkdmY9Z2V0X3Bvc3RfbWV0YSgkclsnaWQnXSwnX3ZmX2Nvc3QnLHRydWUpOwogICAgICAgICR6Yj1nZXRfcG9zdF9tZXRhKCRyWydpZCddLCdfemJfY29zdCcsdHJ1ZSk7CiAgICAgICAgJGNwPWdldF9wb3N0X21ldGEoJHJbJ2lkJ10sJ19jb3N0X3ByaWNlJyx0cnVlKTsKICAgICAgICBpZigoJHZmPjApfHwoJHpiPjApfHwoJGNwPjApKSAkc3V2ZisrOwogICAgICAgIGlmKGNvdW50KCRiZSk8PTUpewogICAgICAgICAgJG91dFsncHZ6J11bXT1hcnJheSgnaWQnPT4kclsnaWQnXSwncGF2Jz0+bWJfc3Vic3RyKCRyWyduJ10sMCwzMiksJ3NhbmQnPT4kclsnc2FuZCddLAogICAgICAgICAgICAnX3ZmX2Nvc3QnPT4kdmYsJ196Yl9jb3N0Jz0+JHpiLCdfY29zdF9wcmljZSc9PiRjcCk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICAkb3V0WydrYXRhbG9nb19iZV9zYXZpa2Fpbm9zJ109Y291bnQoJGJlKTsKICAgICRvdXRbJ2lzX2p1X3R1cmlfbWV0YSddPSRzdXZmOwogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'sav', content:b64}; if(sha) body.sha=sha;
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
    body:JSON.stringify({name:'TEMP sav', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_sav=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/sav.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'sav');
}
main().catch(e=>{});
