process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZ2knXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnYWs1cjdxJykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J0dJMScpOwogICRvdXRbJ3BhcnRpanVfbW9kdWxpcyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJ0aWpvcycpP1BldHNob3BfUGFydGlqb3M6OlZFUlNJSkE6J25lcmEnOwogICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BhcnRpam9zJzsKICBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyR0fSciKT09PSR0KXsKICAgICRvdXRbJ3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyR0fSIpOwogICAgJG91dFsndmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdH0iKTsKICAgICRvdXRbJ3N1X2xpa3VjaXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHR9IFdIRVJFIGxpa3V0aXM+MCIpOwogICAgJG91dFsnc3VfZGF0YSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdH0gV0hFUkUgZ2VyaWF1c2lhX2lraSBJUyBOT1QgTlVMTCBBTkQgZ2VyaWF1c2lhX2lraTw+JyciKTsKICAgICRvdXRbJ2lyYXNhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHR9IE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsIEFSUkFZX0EpOwogIH0gZWxzZSB7ICRvdXRbJ2xlbnRlbGUnXT0nbmVyYSc7IH0KICAvKiBBciBrYXRhbG9nYXMgdHVyaSBlaWxlIHRydW1wb21zIGRhdG9tcyAqLwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9LYXRhbG9nYXMnKSl7CiAgICAkcmVmPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfS2F0YWxvZ2FzJyk7CiAgICAkbT0kcmVmLT5nZXRNZXRob2QoJ2VpbGVzJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJG91dFsna2F0YWxvZ29fZWlsZXMnXT0neml1cmV0aSBrb2RhJzsKICB9CiAgLyogQXIgeXJhIG1ldG9kYWkgYXJ0ZWphbmNpb21zIGRhdG9tcyAqLwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJ0aWpvcycpKXsKICAgICRvdXRbJ3BhcnRpanVfbWV0b2RhaSddPWdldF9jbGFzc19tZXRob2RzKCdQZXRzaG9wX1BhcnRpam9zJyk7CiAgfQogIC8qIEthdGVnb3JpamEgcGFyZHVvdHV2ZWplICovCiAgZm9yZWFjaChhcnJheSgnZ2VyaWF1c2lhLWlraScsJ3RydW1wb3MtZGF0b3MnLCdwYXNpdWx5bWFpJykgYXMgJHNsKXsKICAgICR0dD1nZXRfdGVybV9ieSgnc2x1ZycsJHNsLCdwcm9kdWN0X2NhdCcpOwogICAgJG91dFsna2F0ZWdvcmlqb3MnXVskc2xdPSR0dD9hcnJheSgnaWQnPT4kdHQtPnRlcm1faWQsJ2NvdW50Jz0+JHR0LT5jb3VudCk6J25lcmEnOwogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'gi1', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'gi1');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP gi1', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_gi=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putJson('analize/gi1.json', out);
}
main().catch(async e=>{ await putJson('analize/gi1.json',{klaida:String(e).slice(0,300)}); });
