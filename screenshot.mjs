process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYXR0cjInXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnYXQycDl3JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkb3V0PVsnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpXTsKICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLW04LWZvb2QucGhwJzsKICBpZihmaWxlX2V4aXN0cygkZikpewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgJG91dFsnZmFpbGFzJ109WydkeWRpcyc9PmZpbGVzaXplKCRmKSwnbXRpbWUnPT5kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkZikpXTsKICAgIC8vIGFudHJhc3RlCiAgICAkb3V0WydhbnRyYXN0ZSddPWltcGxvZGUoIlxuIixhcnJheV9zbGljZShleHBsb2RlKCJcbiIsJGMpLDAsMzApKTsKICAgIC8vIGt1ciBhdHRyX2VuZ2luZQogICAgJGxpbmVzPWV4cGxvZGUoIlxuIiwkYyk7ICRoaXRzPVtdOwogICAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRMKXsKICAgICAgaWYoc3RycG9zKCRMLCdhdHRyX2VuZ2luZScpIT09ZmFsc2V8fHN0cnBvcygkTCwnYWRkX2FjdGlvbicpIT09ZmFsc2UmJnN0cnBvcygkTCwncHJvZHVjdCcpIT09ZmFsc2UpCiAgICAgICAgJGhpdHNbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkTCwwLDE1MCkpOwogICAgfQogICAgJG91dFsna2FibGl1a2FpJ109YXJyYXlfc2xpY2UoJGhpdHMsMCwyNSk7CiAgICAvLyBrb2tpdXMgYXRyaWJ1dHVzIHJhc28KICAgIHByZWdfbWF0Y2hfYWxsKCIvJyhwYV9bYS16X10rKScvIiwkYywkbSk7CiAgICAkb3V0WydyYXNvX2F0cmlidXR1cyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsKICAgIC8vIGFyIHlyYSBob29rIGkgcHJvZHVrdG8gaXNzYXVnb2ppbWEKICAgICRvdXRbJ2FudF9pc3NhdWdvamltbyddPShzdHJwb3MoJGMsJ3dvb2NvbW1lcmNlX3VwZGF0ZV9wcm9kdWN0JykhPT1mYWxzZXx8c3RycG9zKCRjLCdzYXZlX3Bvc3RfcHJvZHVjdCcpIT09ZmFsc2UpPydUQUlQJzonTkUnOwogIH0gZWxzZSB7ICRvdXRbJ2ZhaWxhcyddPSduZXJhc3Rhcyc7IH0KICAkb3V0Wydob29rYWlfYXR0ciddPVtdOwogIGdsb2JhbCAkd3BfZmlsdGVyOwogIGlmKGlzc2V0KCR3cF9maWx0ZXJbJ3BldHNob3BfYXR0cl9lbmdpbmVfcnVuJ10pKXsKICAgIGZvcmVhY2goJHdwX2ZpbHRlclsncGV0c2hvcF9hdHRyX2VuZ2luZV9ydW4nXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicyl7CiAgICAgIGZvcmVhY2goJGNicyBhcyAkaz0+JHYpeyAkb3V0Wydob29rYWlfYXR0ciddW109JHByLic6ICcuKGlzX3N0cmluZygkdlsnZnVuY3Rpb24nXSk/JHZbJ2Z1bmN0aW9uJ106J2Nsb3N1cmUnKTsgfQogICAgfQogIH0KICAvLyBwcmVrZXMgc3VrdXJ0b3MgcGVyIHBhc2t1dGluZXMgMzAgZC4gaXIganUgYXRyaWJ1dGFpCiAgJG5hdWpvcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgcG9zdF9kYXRlPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzMCBEQVkpIExJTUlUIDIwMCIpOwogICRvdXRbJ25hdWpvc18zMGQnXT1jb3VudCgkbmF1am9zKTsKICBpZigkbmF1am9zKXsKICAgICRpbj1pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJG5hdWpvcykpOwogICAgZm9yZWFjaChbJ3BhX2d5dnVub19ydXNpcycsJ3BhX3Bha3VvdGVzX2R5ZGlzJywncGFfYmFsdHltdV9zYWx0aW5pcyddIGFzICR0KXsKICAgICAgJG91dFsnbmF1anVfcGFkZW5naW1hcyddWyR0XT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdHIub2JqZWN0X2lkKSBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBJTk5FUiBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0nJHQnIFdIRVJFIHRyLm9iamVjdF9pZCBJTiAoJGluKSIpOwogICAgfQogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'attr2', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP attr2', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/attr2.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_attr2=1&k=at2p9w`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/attr2.json', out);
}
main().catch(async e=>{ await putResult('analize/attr2.json',{klaida:String(e)}); });
