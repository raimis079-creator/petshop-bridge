process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcGFkJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BkNHc3eicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgLy8gcHJla2nFsyB0aXBhaSBwYWdhbCBrYXRlZ29yaWrEhSAodGEgcGF0aSBsb2dpa2Ega2FpcCB2Mi44KQogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIik7CiAgJHRpcGFpPVsnbWFpc3Rhcyc9PltdLCdza2FuZXN0YWknPT5bXSwncGFwaWxkYWknPT5bXSwnYWtzZXN1YXJhaSc9PltdXTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgICR0PScnOwogICAgZm9yZWFjaCh3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKSBhcyAkbil7ICR0Lj0nICcubWJfc3RydG9sb3dlcigkbik7IH0KICAgICR0PWljb252KCdVVEYtOCcsJ0FTQ0lJLy9UUkFOU0xJVCcsJHQpOwogICAgaWYoc3RycG9zKCR0LCdtYWlzdGFzJykhPT1mYWxzZXx8c3RycG9zKCR0LCdrb25zZXJ2JykhPT1mYWxzZXx8c3RycG9zKCR0LCdwYXNhcicpIT09ZmFsc2V8fHN0cnBvcygkdCwnZWRhbGFzJykhPT1mYWxzZSkgJHRpcGFpWydtYWlzdGFzJ11bXT0kaWQ7CiAgICBlbHNlaWYoc3RycG9zKCR0LCdza2FuZXN0JykhPT1mYWxzZXx8c3RycG9zKCR0LCdrcmFtdGFsJykhPT1mYWxzZSkgJHRpcGFpWydza2FuZXN0YWknXVtdPSRpZDsKICAgIGVsc2VpZihzdHJwb3MoJHQsJ3ZpdGFtaW4nKSE9PWZhbHNlfHxzdHJwb3MoJHQsJ3BhcGlsZCcpIT09ZmFsc2UpICR0aXBhaVsncGFwaWxkYWknXVtdPSRpZDsKICAgIGVsc2UgJHRpcGFpWydha3Nlc3VhcmFpJ11bXT0kaWQ7CiAgfQogIGZvcmVhY2goJHRpcGFpIGFzICR2YXJkYXM9PiRzYXIpewogICAgaWYoISRzYXIpeyAkb3V0WyR2YXJkYXNdPVsnbic9PjBdOyBjb250aW51ZTsgfQogICAgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkc2FyKSk7CiAgICAkcGFrPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCB0ci5vYmplY3RfaWQpIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBJTk5FUiBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3BhX3Bha3VvdGVzX2R5ZGlzJyBXSEVSRSB0ci5vYmplY3RfaWQgSU4gKCRpbikiKTsKICAgICRzdj0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcG9zdF9pZCkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J193ZWlnaHQnIEFORCBtZXRhX3ZhbHVlPD4nJyBBTkQgbWV0YV92YWx1ZTw+JzAnIEFORCBwb3N0X2lkIElOICgkaW4pIik7CiAgICAkbWF0PShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBwb3N0X2lkKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2xlbmd0aCcgQU5EIG1ldGFfdmFsdWU8PicnIEFORCBwb3N0X2lkIElOICgkaW4pIik7CiAgICAkZWFuPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBwb3N0X2lkKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBJTiAoJ19lYW4nLCdfZ2xvYmFsX3VuaXF1ZV9pZCcpIEFORCBtZXRhX3ZhbHVlPD4nJyBBTkQgcG9zdF9pZCBJTiAoJGluKSIpOwogICAgJHJ1cz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdHIub2JqZWN0X2lkKSBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSU5ORVIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwYV9neXZ1bm9fcnVzaXMnIFdIRVJFIHRyLm9iamVjdF9pZCBJTiAoJGluKSIpOwogICAgJGZvdG89KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHBvc3RfaWQpIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfdGh1bWJuYWlsX2lkJyBBTkQgbWV0YV92YWx1ZTw+JycgQU5EIHBvc3RfaWQgSU4gKCRpbikiKTsKICAgICRnYWw9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHBvc3RfaWQpIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHJvZHVjdF9pbWFnZV9nYWxsZXJ5JyBBTkQgbWV0YV92YWx1ZTw+JycgQU5EIHBvc3RfaWQgSU4gKCRpbikiKTsKICAgICRuPWNvdW50KCRzYXIpOwogICAgJHByPWZ1bmN0aW9uKCR4KXVzZSgkbil7IHJldHVybiAkbj9yb3VuZCgkeCoxMDAvJG4pOjA7IH07CiAgICAkb3V0WyR2YXJkYXNdPVsnbic9PiRuLAogICAgICAncGFrdW90ZXNfZHlkaXMnPT4iJHBhayAoIi4kcHIoJHBhaykuIiUpIiwKICAgICAgJ3ByZWtlc19zdm9yaXMnPT4iJHN2ICgiLiRwcigkc3YpLiIlKSIsCiAgICAgICdtYXRtZW55cyc9PiIkbWF0ICgiLiRwcigkbWF0KS4iJSkiLAogICAgICAnZWFuJz0+IiRlYW4gKCIuJHByKCRlYW4pLiIlKSIsCiAgICAgICdneXZ1bm9fcnVzaXMnPT4iJHJ1cyAoIi4kcHIoJHJ1cykuIiUpIiwKICAgICAgJ3BhZ3JfbnVvdHJhdWthJz0+IiRmb3RvICgiLiRwcigkZm90bykuIiUpIiwKICAgICAgJ2dhbGVyaWphJz0+IiRnYWwgKCIuJHByKCRnYWwpLiIlKSJdOwogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`padengimas ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP padengimas', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/padengimas.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_pad=1&k=pd4w7z`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,1500); }
  const d=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.deakt=d.status;
  await putResult('analize/padengimas.json', out);
}
main().catch(async e=>{ await putResult('analize/padengimas.json',{klaida:String(e)}); });
