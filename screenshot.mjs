process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfdmZwJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidWRlAnKTsKICAkcD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtdmYtaW1wb3J0LnBocCc7CiAgaWYoZmlsZV9leGlzdHMoJHApKXsKICAgICRlaWw9ZXhwbG9kZSgiXG4iLGZpbGVfZ2V0X2NvbnRlbnRzKCRwKSk7CiAgICBmb3IoJGk9NTE1OyRpPDU5NSAmJiAkaTxjb3VudCgkZWlsKTskaSsrKXsgJG91dFsndmZfa29kYXMnXVskaSsxXT1ydHJpbShtYl9zdWJzdHIoJGVpbFskaV0sMCwxNTApKTsgfQogIH0KICAvKiBTbmlwcGV0IDU2NSAqLwogICRzPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPTU2NSIsIEFSUkFZX0EpOwogIGlmKCRzKXsKICAgICRvdXRbJ3NuaXBwZXQ1NjUnXT1hcnJheSgnbmFtZSc9PiRzWyduYW1lJ10sJ2FjdGl2ZSc9PiRzWydhY3RpdmUnXSk7CiAgICAkYz1leHBsb2RlKCJcbiIsJHNbJ2NvZGUnXSk7CiAgICBmb3JlYWNoKCRjIGFzICRpPT4kZSl7CiAgICAgIGlmKHByZWdfbWF0Y2goJy9wdWJsaXNofGRyYWZ0fHBvc3Rfc3RhdHVzfHRodW1ibmFpbHxwb3N0X2NvbnRlbnQvJywkZSkpewogICAgICAgICRvdXRbJ3NuaXBwZXQ1NjVfZWlsJ11bJGkrMV09dHJpbShtYl9zdWJzdHIoJGUsMCwxNDApKTsKICAgICAgfQogICAgfQogICAgaWYoaXNzZXQoJG91dFsnc25pcHBldDU2NV9laWwnXSkpICRvdXRbJ3NuaXBwZXQ1NjVfZWlsJ109YXJyYXlfc2xpY2UoJG91dFsnc25pcHBldDU2NV9laWwnXSwwLDIwLHRydWUpOwogIH0KICAvKiBJc2p1bmdpYW0gcGFrYWJpbnRhIFRFTVAgKi8KICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0xIik7CiAgJG91dFsndGVtcF9pc2p1bmd0YSddPSR3cGRiLT5yb3dzX2FmZmVjdGVkOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'vfp', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP vfp', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_vfp=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/vfp.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'vfp');
}
main().catch(e=>{});
