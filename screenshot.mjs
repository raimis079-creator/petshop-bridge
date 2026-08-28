process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFpvbHV4IEthdGVtcyBQb3JhIHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX3ByJ10gPz8gJycpICE9PSAnUFIxJyApIHJldHVybjsKICRvPVsndic9PidQUjEnXTsKIC8qIDM1MTEyIChTKSBpciAzNTExNCAoTSkgLSBhYmkgbmF1am9zLCB0YSBwYXRpIHByZWtlLCBza2lyaWFzaSB0aWsgZHlkaXMuCiAgICAjMTU3NDYgbGlla2EgYXRza2lyYWk6IGpvIGthaW5hIG5lc3V0YW1wYSBuZWkgc3UgUywgbmVpIHN1IE0uICovCiBmb3JlYWNoKFszNTExMiwzNTExNF0gYXMgJHBpZCl7CiAgICRwPWdldF9wb3N0KCRwaWQpOwogICBpZighJHAgfHwgJHAtPnBvc3RfdHlwZSE9PSdwcm9kdWN0Jyl7ICRvWydlaWwnXVtdPVsnaWQnPT4kcGlkLCd2ZWlrc21hcyc9PidORVJBJ107IGNvbnRpbnVlOyB9CiAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3BzX2R5ZHppb19zZWltYScsJ3pvbHV4LXNlcGV0eXMta2F0ZW1zJyk7CiAgICRvWydlaWwnXVtdPVsnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw0NiksCiAgICAgJ3NlaW1hJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKSwKICAgICAnZHlkaXMnPT53cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3BhX2R5ZGlzJyxbJ2ZpZWxkcyc9PiduYW1lcyddKV07CiB9CiAvKiBrb250cm9sZToga3VyaW9zIG5hdWpvcyBwcmVrZXMgTElFS0EgYmUgc2VpbW9zICovCiAkdmllbmk9W107CiBmb3JlYWNoKFszNTEwMiwzNTEwNCwzNTEwNiwzNTEwOCwzNTExMCwzNTExMiwzNTExNCwzNTExNiwzNTExOCwzNTEyMCwzNTEyMiwzNTEyNCwzNTEyNiwKICAgICAgICAgIDM1MTI4LDM1MTMwLDM1MTMyLDM1MTM0LDM1MTM2LDM1MTM4LDM1MTQwLDM1MTQyLDM1MTQ0LDM1MTQ2LDM1MTQ3XSBhcyAkcGlkKXsKICAgaWYoIWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSkpewogICAgICRwPWdldF9wb3N0KCRwaWQpOyAkdmllbmlbXT1bJ2lkJz0+JHBpZCwncGF2Jz0+JHA/bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNTIpOic/J107CiAgIH0KIH0KICRvWydiZV9zZWltb3MnXT0kdmllbmk7CiAvKiBzZWltdSBzdXZlc3RpbmUgKi8KIGdsb2JhbCAkd3BkYjsKICRvWydzZWltb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICJTRUxFQ1QgbWV0YV92YWx1ZSBBUyBzZWltYSwgQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cG9zdG1ldGF9CiAgICAgV0hFUkUgbWV0YV9rZXk9J19wc19keWR6aW9fc2VpbWEnIEdST1VQIEJZIG1ldGFfdmFsdWUgT1JERVIgQlkgbWV0YV92YWx1ZSIsIEFSUkFZX0EpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='PORA-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Zolux Katems Pora v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_pr=PR1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'pr');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/pora_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
