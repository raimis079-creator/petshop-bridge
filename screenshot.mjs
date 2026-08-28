process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFZhcmlhY2lqdSBLYWludSBQYXRpa3JhIHYxLjEgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX2tuJ10gPz8gJycpICE9PSAnS04xJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89Wyd2Jz0+J0tOMSddOwogLyogVklTT1MgdmFyaWFjaWpvcyBiZSBrYWlub3MgLSBuZSB0aWsgdGEgdmllbmEgKi8KICRiZT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICJTRUxFQ1Qgdi5JRCwgdi5wb3N0X3BhcmVudCBGUk9NIHskd3BkYi0+cG9zdHN9IHYKICAgICBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9di5JRCBBTkQgbS5tZXRhX2tleT0nX3JlZ3VsYXJfcHJpY2UnCiAgICBXSEVSRSB2LnBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCB2LnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICBBTkQgKG0ubWV0YV92YWx1ZSBJUyBOVUxMIE9SIG0ubWV0YV92YWx1ZT0nJykiLCBBUlJBWV9BKTsKICRvWydyYXN0YV9iZV9rYWlub3MnXT1jb3VudCgkYmUpOwogJG9bJ2VpbCddPVtdOwogZm9yZWFjaCgkYmUgYXMgJGIpewogICAkdmlkPShpbnQpJGJbJ0lEJ107ICRwaWQ9KGludCkkYlsncG9zdF9wYXJlbnQnXTsKICAgLyoga2FpbmEgaXMgQlJPTElVIHZhcmlhY2lqdSAtIGRhem5pYXVzaWEgcmVpa3NtZSAqLwogICAka2Fpbm9zPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgbS5tZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQKICAgICAgIFdIRVJFIHAucG9zdF9wYXJlbnQ9JWQgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0X3ZhcmlhdGlvbicgQU5EIHAuSUQ8PiVkCiAgICAgICAgIEFORCBtLm1ldGFfa2V5PSdfcmVndWxhcl9wcmljZScgQU5EIG0ubWV0YV92YWx1ZTw+JyciLCRwaWQsJHZpZCkpOwogICAkZT1bJ3ZpZCc9PiR2aWQsJ3BpZCc9PiRwaWQsJ2Jyb2xpdV9rYWlub3MnPT5hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRrYWlub3MpKV07CiAgIGlmKCEka2Fpbm9zKXsgJGVbJ3ZlaWtzbWFzJ109J1BSQUxFSVNUQSAtIGJyb2xpYWkgaXJnaSBiZSBrYWlub3MnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgJGM9YXJyYXlfY291bnRfdmFsdWVzKCRrYWlub3MpOyBhcnNvcnQoJGMpOyAkaz0oc3RyaW5nKWFycmF5X2tleV9maXJzdCgkYyk7CiAgIHVwZGF0ZV9wb3N0X21ldGEoJHZpZCwnX3JlZ3VsYXJfcHJpY2UnLCRrKTsKICAgdXBkYXRlX3Bvc3RfbWV0YSgkdmlkLCdfcHJpY2UnLCRrKTsKICAgV0NfUHJvZHVjdF9WYXJpYWJsZTo6c3luYygkcGlkKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkcGlkKTsgY2xlYW5fcG9zdF9jYWNoZSgkcGlkKTsKICAgJGVbJ3ZlaWtzbWFzJ109J0lSQVNZVEEnOyAkZVsna2FpbmEnXT0kazsKICAgJGVbJ3BhdGlrcmEnXT1nZXRfcG9zdF9tZXRhKCR2aWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKTsKICAgJG9bJ2VpbCddW109JGU7CiB9CiAvKiBnYWx1dGluZSBrb250cm9sZSAqLwogJG9bJ2xpa29fYmVfa2Fpbm9zJ109KGludCkkd3BkYi0+Z2V0X3ZhcigKICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHYKICAgICBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9di5JRCBBTkQgbS5tZXRhX2tleT0nX3JlZ3VsYXJfcHJpY2UnCiAgICBXSEVSRSB2LnBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCB2LnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICBBTkQgKG0ubWV0YV92YWx1ZSBJUyBOVUxMIE9SIG0ubWV0YV92YWx1ZT0nJykiKTsKICRvWyd2YXJpYWNpanVfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='KAINA-v1.1'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Variaciju Kainu Patikra v1.1',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_kn=KN1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'kn');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/kaina_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
