process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2FrNXI3cScpIHJldHVybjsKICAvKiBWQUxZTUFTOiB0ZXN0aW5lcyBwYXJ0aWpvcyAqLwogIGlmIChpc3NldCgkX0dFVFsncHNfdmFsX3Rlc3QnXSkpIHsKICAgIGdsb2JhbCAkd3BkYjsKICAgICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BhcnRpam9zJzsKICAgICRwcmllcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxwcm9kdWN0X2lkLHBhc3RhYmEsZ2VyaWF1c2lhX2lraSBGUk9NIHskdH0gV0hFUkUgcGFzdGFiYSBJTiAoJ0dJLVRFU1QnLCdHSS1QQVMnKSIsIEFSUkFZX0EpOwogICAgJG49JHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHR9IFdIRVJFIHBhc3RhYmEgSU4gKCdHSS1URVNUJywnR0ktUEFTJykiKTsKICAgICRsaWtvPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHByb2R1Y3RfaWQsZ2VyaWF1c2lhX2lraSxraWVraXNfbGlrbyxwYXN0YWJhIEZST00geyR0fSIsIEFSUkFZX0EpOwogICAgLyogUGVyc2thaWNpdW9qYW0gcGFsaWVzdGFzIHByZWtlcyAqLwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1BhcnRpam9zJykgJiYgbWV0aG9kX2V4aXN0cygnUGV0c2hvcF9QYXJ0aWpvcycsJ3BlcnNrYWljaXVvdGlfc2F2aWthaW5hJykpewogICAgICBmb3JlYWNoKCRwcmllcyBhcyAkcCl7IHRyeXsgUGV0c2hvcF9QYXJ0aWpvczo6cGVyc2thaWNpdW90aV9zYXZpa2FpbmEoKGludCkkcFsncHJvZHVjdF9pZCddKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fSB9CiAgICB9CiAgICB3cF9zZW5kX2pzb24oYXJyYXkoJ2lzdHJpbnRhJz0+JG4sJ2J1dm8nPT4kcHJpZXMsJ2xpa29fbGVudGVsZWplJz0+JGxpa28pKTsKICB9CiAgLyogUkVDT046IGlzIGtvIHN1ZGFyeXRvcyBkdW9tZW51IHNrb2xvcyAqLwogIGlmIChpc3NldCgkX0dFVFsncHNfc2tvbG9zJ10pKSB7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J1NLMScpOwogICAgJGVpbD0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICJTRUxFQ1QgcC5JRCwgbS5tZXRhX3ZhbHVlIHRydWtzdGEKICAgICAgICAgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3BzX3BpbG51bWFzX3RydWtzdGEnCiAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIsIEFSUkFZX0EpOwogICAgJHNrPWFycmF5KCk7ICR2aXNvPTA7CiAgICBmb3JlYWNoKCRlaWwgYXMgJGUpewogICAgICBpZih0cmltKChzdHJpbmcpJGVbJ3RydWtzdGEnXSk9PT0nJykgY29udGludWU7CiAgICAgICR2aXNvKys7CiAgICAgIGZvcmVhY2goZXhwbG9kZSgnLCcsIChzdHJpbmcpJGVbJ3RydWtzdGEnXSkgYXMgJHgpewogICAgICAgICR4PXRyaW0oJHgpOyBpZigkeD09PScnKSBjb250aW51ZTsKICAgICAgICAkc2tbJHhdPWlzc2V0KCRza1skeF0pPyRza1skeF0rMToxOwogICAgICB9CiAgICB9CiAgICBhcnNvcnQoJHNrKTsKICAgICRvdXRbJ3ByZWtpdV9zdV9za29sb21pcyddPSR2aXNvOwogICAgJG91dFsncGFnYWxfbGF1a2EnXT0kc2s7CiAgICAvKiBQaWxudW1vIGtsYXNlIOKAlCBrb2tpdXMgbGF1a3VzIHRpa3JpbmEgKi8KICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QaWxudW1hcycpKXsKICAgICAgJG91dFsncGlsbnVtb19tZXRvZGFpJ109Z2V0X2NsYXNzX21ldGhvZHMoJ1BldHNob3BfUGlsbnVtYXMnKTsKICAgICAgJHI9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9QaWxudW1hcycpOwogICAgICAkb3V0Wydrb25zdGFudG9zJ109JHItPmdldENvbnN0YW50cygpOwogICAgfQogICAgLyogQmFsbyBwYXNpc2tpcnN0eW1hcyAqLwogICAgJG91dFsnYmFsYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICJTRUxFQ1QgQ0FTRSBXSEVOIENBU1QobWV0YV92YWx1ZSBBUyBVTlNJR05FRCk+PTEwMCBUSEVOICcxMDAnCiAgICAgICAgICAgICAgICAgICBXSEVOIENBU1QobWV0YV92YWx1ZSBBUyBVTlNJR05FRCk+PTkwIFRIRU4gJzkwLTk5JwogICAgICAgICAgICAgICAgICAgV0hFTiBDQVNUKG1ldGFfdmFsdWUgQVMgVU5TSUdORUQpPj03MCBUSEVOICc3MC04OScKICAgICAgICAgICAgICAgICAgIFdIRU4gQ0FTVChtZXRhX3ZhbHVlIEFTIFVOU0lHTkVEKT49NTAgVEhFTiAnNTAtNjknCiAgICAgICAgICAgICAgICAgICBFTFNFICc8NTAnIEVORCBncnAsIENPVU5UKCopIGMKICAgICAgICAgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3BpbG51bWFzJyBHUk9VUCBCWSBncnAiLCBBUlJBWV9BKTsKICAgIHdwX3NlbmRfanNvbigkb3V0KTsKICB9Cn0pOwo=','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'sk1', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'sk1');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP sk1', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  let resp=await fetch(`${WP}/?ps_val_test=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  out.valymas=await jsonSafe(resp);
  await pause(1000);
  resp=await fetch(`${WP}/?ps_skolos=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  out.skolos=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putJson('analize/sk1.json', out);
}
main().catch(async e=>{ await putJson('analize/sk1.json',{klaida:String(e).slice(0,300)}); });
