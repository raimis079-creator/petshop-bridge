process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdWQUwxJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQMEEtMScpOwogJG11ID0gV1BNVV9QTFVHSU5fRElSOwogJGYgID0gJG11LicvcGV0c2hvcC1zdGF0aXN0aWthLnBocCc7CiBpZiAoZmlsZV9leGlzdHMoJGYpKSB7CiAgICRrID0gZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAkb1snc3RhdCddID0gYXJyYXkoJ0InPT5zdHJsZW4oJGspLCAnbWQ1Jz0+bWQ1KCRrKSk7CiAgIGlmIChwcmVnX21hdGNoKCcvVmVyc2lvbjpccyooWzAtOS5dKykvJywgJGssICRtKSkgJG9bJ3N0YXQnXVsndmVyJ109JG1bMV07CiAgIGlmIChwcmVnX21hdGNoKCcvWkFMSVVfRElFTk9TXHMqPVxzKihbXjtdKyk7LycsICRrLCAkbSkpICRvWydzdGF0J11bJ1pBTElVX0RJRU5PUyddPXRyaW0oJG1bMV0pOwogICAkcCA9IHN0cnBvcygkaywgJ2Z1bmN0aW9uIHZhbHl0aScpOwogICAkb1sndmFseXRpX2JvZHknXSA9ICgkcCE9PWZhbHNlKSA/IHN1YnN0cigkaywgJHAsIDE0MDApIDogJ05FUkFTVEEnOwogfSBlbHNlIHsgJG9bJ3N0YXQnXT0nRkFJTE8gTkVSQSc7IH0KICRvWydraXRpX3RyeW5lamFpJ109YXJyYXkoKTsKIGZvcmVhY2ggKChhcnJheSlAc2NhbmRpcigkbXUpIGFzICRmZikgewogICBpZiAoc3Vic3RyKCRmZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAka2sgPSBAZmlsZV9nZXRfY29udGVudHMoJG11LicvJy4kZmYpOwogICBpZiAoJGtrICYmIHByZWdfbWF0Y2goJy9ERUxFVEVccytGUk9NW147XXswLDE2MH1pdnlraWFpL2knLCAka2spKSAkb1sna2l0aV90cnluZWphaSddW109JGZmOwogfQogJHQ9JFAuJ3BzX2xhdWthaV9pdnlraWFpJzsgJGQ9JFAuJ3BzX2xhdWthaV9kaWVub3MnOwogaWYgKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdCciKT09PSR0KSB7CiAgICRvWydpdnlraWFpJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzcml0aXMsIENPVU5UKCopIG4sIE1JTihsYWlrYXMpIG51bywgTUFYKGxhaWthcykgaWtpIEZST00gJHQgR1JPVVAgQlkgc3JpdGlzIiwgQVJSQVlfQSk7CiAgICRvWydpdnlraWFpX3Zpc28nXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiB9IGVsc2UgeyAkb1snaXZ5a2lhaSddPSdMRU5URUxFUyBORVJBJzsgfQogaWYgKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckZCciKT09PSRkKSB7CiAgICRvWydkaWVub3MnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNyaXRpcywgQ09VTlQoKikgbiwgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpIEZST00gJGQgR1JPVVAgQlkgc3JpdGlzIiwgQVJSQVlfQSk7CiB9IGVsc2UgeyAkb1snZGllbm9zJ109J0xFTlRFTEVTIE5FUkEnOyB9CiAkbnMgPSB3cF9uZXh0X3NjaGVkdWxlZCgncHNfc3RhdF92YWx5bWFzJyk7CiAkb1snY3Jvbl9wc19zdGF0X3ZhbHltYXMnXSA9ICRucyA/IGdtZGF0ZSgnWS1tLWQgSDppJywgJG5zKS4nIFVUQycgOiAnTkVVWlJFR0lTVFJVT1RBJzsKICRvWydrbGFzZV95cmEnXSA9IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9TdGF0aXN0aWthJykgPyAxIDogMDsKICRvWydhZ3JlZ195cmEnXSAgPSBmaWxlX2V4aXN0cygkbXUuJy9wZXRzaG9wLWF0YXNrYWl0dS1hZ3JlZ2F2aW1hcy5waHAnKSA/IDEgOiAwOwogJG9bJ3NyaXR5c19rb2RlJ109YXJyYXkoKTsKIGZvcmVhY2ggKChhcnJheSlAc2NhbmRpcigkbXUpIGFzICRmZikgewogICBpZiAoc3Vic3RyKCRmZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAka2sgPSBAZmlsZV9nZXRfY29udGVudHMoJG11LicvJy4kZmYpOwogICBpZiAoJGtrICYmIHByZWdfbWF0Y2hfYWxsKCIvJ3NyaXRpcydccyo9PlxzKicoW2Etel9dKyknLyIsICRraywgJG1tKSkgewogICAgIGZvcmVhY2ggKGFycmF5X3VuaXF1ZSgkbW1bMV0pIGFzICRzKSB7ICRvWydzcml0eXNfa29kZSddWyRzXSA9IGlzc2V0KCRvWydzcml0eXNfa29kZSddWyRzXSkgPyAkb1snc3JpdHlzX2tvZGUnXVskc10uJywnLiRmZiA6ICRmZjsgfQogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'P0A-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0a.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0a recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0a.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  // 1. isjungiam visus likusius TEMP snippetus
  const lst=await api('/wp-json/code-snippets/v1/snippets');
  let arr=[]; try{arr=JSON.parse(lst.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of arr){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); out.temp_isjungta.push(s.id); } }
  // 2. recon snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0A RECON',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,4500));
  try{ const r=await fetch(WP+'/?ps_p0=VAL1'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
