process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYXR0ciddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdhdDVrMm4nKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogIC8vIGt1ciBneXZlbmEgYXR0ciBlbmdpbmUKICAkc249JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVOR1RIKGNvZGUpIGxlbiBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJWF0dHJfZW5naW5lJScgT1IgbmFtZSBMSUtFICcldHJpYnV0JSciLCBBUlJBWV9BKTsKICAkb3V0WydzbmlwcGV0YWknXT0kc247CiAgJG11PVtdOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmKXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgIGlmKHN0cnBvcygkYywnYXR0cl9lbmdpbmUnKSE9PWZhbHNlfHxzdHJwb3MoJGMsJ3BhX2JhbHR5bXVfc2FsdGluaXMnKSE9PWZhbHNlKSAkbXVbYmFzZW5hbWUoJGYpXT1maWxlc2l6ZSgkZik7CiAgfQogICRvdXRbJ211X2ZhaWxhaSddPSRtdTsKICAkb3V0Wydjcm9uJ109d3BfbmV4dF9zY2hlZHVsZWQoJ3BldHNob3BfYXR0cl9lbmdpbmVfcnVuJyk/ZGF0ZSgnWS1tLWQgSDppJyx3cF9uZXh0X3NjaGVkdWxlZCgncGV0c2hvcF9hdHRyX2VuZ2luZV9ydW4nKSk6J25lcmEnOwogICRvdXRbJ2hvb2tfeXJhJ109aGFzX2FjdGlvbigncGV0c2hvcF9hdHRyX2VuZ2luZV9ydW4nKT8ndGFpcCc6J25lJzsKICAvLyBhdHJpYnV0dSBwYWRlbmdpbWFzCiAgZm9yZWFjaChbJ3BhX2d5dnVub19ydXNpcycsJ3BhX3Bha3VvdGVzX2R5ZGlzJywncGFfYW16aXVzJywncGFfdmVpc2xlc19keWRpcycsJ3BhX2JhbHR5bXVfc2FsdGluaXMnLCdwYV9iZV9ncnVkdScsJ3BhX3NwZWNpYWxpX21pdHliYScsJ3BhX21vbm9wcm90ZWluJ10gYXMgJHQpewogICAgJG91dFsncGFkZW5naW1hcyddWyR0XT0gdGF4b25vbXlfZXhpc3RzKCR0KQogICAgICA/IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCB0ci5vYmplY3RfaWQpIEZST00geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIElOTkVSIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSckdCcgSU5ORVIgSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9dHIub2JqZWN0X2lkIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpCiAgICAgIDogJ05FUkEgVEFLU09OT01JSk9TJzsKICB9CiAgJG91dFsncHVibGlzaF92aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgLy8gYnJlbmRhaQogICRvdXRbJ2JyZW5kYWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnRlcm1fdGF4b25vbXl9IFdIRVJFIHRheG9ub215PSdwcm9kdWN0X2JyYW5kJyIpOwogICRvdXRbJ2JlX2JyZW5kbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgSU5ORVIgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIFdIRVJFIHRyLm9iamVjdF9pZD1wLklEKSIpOwogIC8vIHBhc2t1dGluaXMgcnVuCiAgJG91dFsnYXR0cl9wYXNrdXRpbmlzJ109Z2V0X29wdGlvbigncGV0c2hvcF9hdHRyX2VuZ2luZV9sYXN0Jyk7CiAgJG91dFsnYXR0cl9zdGF0aXN0aWthJ109Z2V0X29wdGlvbigncGV0c2hvcF9hdHRyX2VuZ2luZV9zdGF0cycpOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'attr', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP attr recon', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/attr.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_attr=1&k=at5k2n`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/attr.json', out);
}
main().catch(async e=>{ await putResult('analize/attr.json',{klaida:String(e)}); });
