process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJBIERlcGxveSB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykhPT0nREVQMicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0JBLURFUExPWS12MS4wJyk7CiAgdHJ5ewogICAgJGZhaWxhaT1hcnJheSgKICAgICAgJ21vZHVsaXMnPT5hcnJheSgnc3JjJz0+J2RlcGxveS9wZXRzaG9wLXBlcnppdXJ1LXByaW1pbmltYXMucGhwLmI2NCcsJ2RzdCc9PldQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcGVyeml1cnUtcHJpbWluaW1hcy5waHAnLCdtZDUnPT4nMzA5MWMxNGU3NWUzNDg5ZDIzMTI0MTZiMjQ1NGY0YTcnKSwKICAgICAgJ3NhYmxvbmFzJz0+YXJyYXkoJ3NyYyc9PidkZXBsb3kvYnJvd3NlLWFiYW5kb25lZC5waHAuYjY0JywnZHN0Jz0+V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS90ZW1wbGF0ZXMvZW1haWxzL2Jyb3dzZS1hYmFuZG9uZWQucGhwJywnbWQ1Jz0+J2I4OTEwOTIzNmZkNmI4OWJlMWQ3NWY4ZjkxMzViMmRjJyksCiAgICApOwogICAgZm9yZWFjaCgkZmFpbGFpIGFzICRrPT4kZil7CiAgICAgICR1cmw9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluLycuJGZbJ3NyYyddLic/dj0nLiRmWydtZDUnXS4nLScudGltZSgpOwogICAgICAkcj13cF9yZW1vdGVfZ2V0KCR1cmwsYXJyYXkoJ3RpbWVvdXQnPT4zMCwnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHIpKXsgJG9bJGtdPSdQQVJTSVVOVElNTyBLTEFJREE6ICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCk7IGNvbnRpbnVlOyB9CiAgICAgICRrb2Rhcz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSk7CiAgICAgIGlmKG1kNSgka29kYXMpIT09JGZbJ21kNSddKXsgJG9bJGtdPSdNRDUgTkVTVVRBTVBBOiAnLm1kNSgka29kYXMpOyBjb250aW51ZTsgfQogICAgICBpZihAdG9rZW5fZ2V0X2FsbCgka29kYXMsIFRPS0VOX1BBUlNFKT09PWZhbHNlKXsgJG9bJGtdPSdTSU5UQUtTRVMgS0xBSURBJzsgY29udGludWU7IH0KICAgICAgaWYoZmlsZV9leGlzdHMoJGZbJ2RzdCddKSl7CiAgICAgICAgJGJkaXI9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRiZGlyKSkgd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgICAgY29weSgkZlsnZHN0J10sICRiZGlyLicvJy5iYXNlbmFtZSgkZlsnZHN0J10pLicuYmFrX2JhXycuZ21kYXRlKCdZbWRfSGlzJykpOwogICAgICB9CiAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRmWydkc3QnXSwgJGtvZGFzKTsKICAgICAgJG9bJGtdPWFycmF5KCdpcmFzeXRhJz0+bWQ1X2ZpbGUoJGZbJ2RzdCddKT09PSRmWydtZDUnXT8nT0snOidNRDUgS0xBSURBJywnZHlkaXMnPT5maWxlc2l6ZSgkZlsnZHN0J10pKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo='; const VER='BA-DEPLOY-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS BA Deploy v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=DEP2',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/ba_deploy.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
