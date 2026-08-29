process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFNCMCBTYWJsb251IHNpc3RlbW9zIHp2YWxneWJhIHYxLjAgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykgIT09ICdTQjAnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTQjAtdjEuMCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIC8qIHJlbmRlcigpIHNhbHRpbmlzICovCiAgICAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnLCdyZW5kZXInKTsKICAgICRMPWZpbGUoJHJtLT5nZXRGaWxlTmFtZSgpKTsKICAgICRvWydyZW5kZXJfc3JjJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkTCwkcm0tPmdldFN0YXJ0TGluZSgpLTEsbWluKCRybS0+Z2V0RW5kTGluZSgpLSRybS0+Z2V0U3RhcnRMaW5lKCkrMSwxMTApKSk7CgogICAgLyogc2FibG9udSBrYXRhbG9nYWkgKi8KICAgICRrYW5kPWFycmF5KAogICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL3RlbXBsYXRlcy9lbWFpbCcsCiAgICAgIFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvc2FibG9uYWknLAogICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1lc3Avc2FibG9uYWknLAogICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1lc3AvdGVtcGxhdGVzJywKICAgICAgV1BNVV9QTFVHSU5fRElSLicvc2FibG9uYWknLAogICAgICBXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtc2FibG9uYWknLAogICAgKTsKICAgIGZvcmVhY2goJGthbmQgYXMgJGQpeyBpZihpc19kaXIoJGQpKSAkb1sna2F0YWxvZ2FpJ11bJGRdPWFycmF5X3ZhbHVlcyhhcnJheV9kaWZmKHNjYW5kaXIoJGQpLGFycmF5KCcuJywnLi4nKSkpOyB9CgogICAgLyogZmlsdHJhaSwga3VyaWUga2VpY2lhIGtlbGl1ICovCiAgICAkb1snZmlsdHJhaSddPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wX2VtYWlsX3RlbXBsYXRlX3BhdGgnLCdwZXRzaG9wX2VtYWlsX2Zsb3dzJywncGV0c2hvcF9lbWFpbF9zdWJqZWN0JywncGV0c2hvcF9lbWFpbF9ib2R5JykgYXMgJGYpewogICAgICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAgICAgJG9bJ2ZpbHRyYWknXVskZl09IGlzc2V0KCR3cF9maWx0ZXJbJGZdKSA/IGNvdW50KCR3cF9maWx0ZXJbJGZdLT5jYWxsYmFja3MpIDogMDsKICAgIH0KCiAgICAvKiB2aWVubyBzYWJsb25vIHR1cmlueXMgKG1hem8pICovCiAgICBmb3JlYWNoKCRrYW5kIGFzICRkKXsKICAgICAgaWYoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgICBmb3JlYWNoKGFycmF5KCd3aW4tYmFjay02MC5waHAnLCdvcmRlci1zaGlwcGVkLnBocCcsJ3JlZmlsbC5waHAnKSBhcyAkZm4pewogICAgICAgIGlmKGZpbGVfZXhpc3RzKCRkLicvJy4kZm4pKXsgJG9bJ3B2el9zYWJsb25hcyddPWFycmF5KCdmYWlsYXMnPT4kZC4nLycuJGZuLCd0dXJpbnlzJz0+c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRkLicvJy4kZm4pLDAsMjUwMCkpOyBicmVhayAyOyB9CiAgICAgIH0KICAgIH0KCiAgICAvKiBhZG1pbiBtZW5pdSBwdXNsYXBpYWkgKi8KICAgICRvWydtdV9wbHVnaW5zJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihzY2FuZGlyKFdQTVVfUExVR0lOX0RJUiksZnVuY3Rpb24oJGYpe3JldHVybiBzdWJzdHIoJGYsLTQpPT09Jy5waHAnO30pKTsKCiAgICAvKiBhbmFsaXRpa29zIHBhcmVuZ3RpcyAqLwogICAgJFQ9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfam9icyc7CiAgICAkb1snam9ic19hbmFsaXRpa2EnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIHZpc28sCiAgICAgICBTVU0oc2VudF9hdCBJUyBOT1QgTlVMTCkgaXNzaXVzdGEsIFNVTShkZWxpdmVyZWRfYXQgSVMgTk9UIE5VTEwpIHByaXN0YXR5dGEsCiAgICAgICBTVU0ob3BlbmVkX2F0IElTIE5PVCBOVUxMKSBhdGlkYXJ5dGEsIFNVTShjbGlja2VkX2F0IElTIE5PVCBOVUxMKSBwYXNwYXVzdGEsCiAgICAgICBTVU0oc3RhdHVzPSdza2lwcGVkJykgcHJhbGVpc3RhIEZST00gYCRUYCIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='SB0-135703';
const GKEY='ps_bis';
const PHASES=["SB0"];
const OUT='analize/sb0.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
