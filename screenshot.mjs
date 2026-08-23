process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjNSddKSB8fCAkX0dFVFsncHNfcmVjNSddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nUkVDNScpOwogZm9yZWFjaChhcnJheSgnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfcGlja3VwX21ldGhvZF8zJywnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfY291cmllcl9tZXRob2RfMicsJ3dvb19saXRodWFuaWFwb3N0X2xwZXhwcmVzc190ZXJtaW5hbF8xMicpIGFzICRrKXsKICAgJFRbJ251c3RhdHltYWknXVska109Z2V0X29wdGlvbignd29vY29tbWVyY2VfJy4kay4nX3NldHRpbmdzJyk7CiB9CiAkVFsnd2NfdGF4J109YXJyYXkoJ2NhbGMnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jYWxjX3RheGVzJyksJ2luY2wnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9wcmljZXNfaW5jbHVkZV90YXgnKSwnc2hpcF90YXgnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9zaGlwcGluZ190YXhfY2xhc3MnKSk7CiBmb3JlYWNoKGFycmF5KCdscGV4cHJlc3NfdGVybWluYWxzJywndW5pc2VuZF90ZXJtaW5hbHMnKSBhcyAkdGIpewogICAkdD0kd3BkYi0+cHJlZml4Lid3b29fbGl0aHVhbmlhcG9zdF8nLiR0YjsKICAgJFRbJ2xlbnQnXVskdGJdWydjb2xzJ109JHdwZGItPmdldF9jb2woIkRFU0NSSUJFICR0IiwwKTsKICAgJFRbJ2xlbnQnXVskdGJdWydraWVrJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgICRUWydsZW50J11bJHRiXVsncHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICR0IExJTUlUIDIiLEFSUkFZX0EpOwogfQogJFRbJ3Nhc2snXT1hcnJheSgnYXZwbic9PmdldF9vcHRpb24oJ3BldHNob3BfYXZwbl9jb3VudGVyJyksJ2lhcHYnPT5nZXRfb3B0aW9uKCdwZXRzaG9wX2lhcHZfY291bnRlcicpKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'REC5'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v5 (siuntimo nustatymai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec5=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/rec5.json', Buffer.from(JSON.stringify(out,null,1)), 'REC5');
