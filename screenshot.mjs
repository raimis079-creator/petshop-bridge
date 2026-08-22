process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyOCddKSA/ICRfR0VUWydwc19yMjI4J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyOCcpOwogJHQgPSAkd3BkYi0+cHJlZml4Lidwc19zYXJnYXNfa2xhaWRvcyc7CgogLyogMS4gUGlsbmkgc2lvIHJ5dG8gaXJhc2FpIOKAlCB2aXNpIHN0dWxwZWxpYWksIGJlIHRydW1waW5pbW8gKi8KICRvWydpcmFzYWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgIlNFTEVDVCAqIEZST00gJHQgV0hFUkUgemludXRlIExJS0UgJyVQYXNzaW5nIG51bGwlJyBPUkRFUiBCWSBsYWlrYXMgREVTQyBMSU1JVCA2IiwgQVJSQVlfQSk7CgogLyogMi4gS2EgV1AgYnJhbmR1b2x5cyBkYXJvIHRvc2UgZWlsdXRlc2UgKi8KICRvWydicmFuZHVvbHlzJ10gPSBhcnJheSgpOwogZm9yZWFjaChhcnJheSg3Mzc0LCAyMTk2KSBhcyAkbil7CiAgICRmID0gQUJTUEFUSC4nd3AtaW5jbHVkZXMvZnVuY3Rpb25zLnBocCc7CiAgICRlaWwgPSBAZmlsZSgkZik7CiAgIGlmKCRlaWwpewogICAgICRudW8gPSBtYXgoMSwgJG4tMTQpOwogICAgICR0ZWtzdGFzID0gJyc7CiAgICAgZm9yKCRpPSRudW87ICRpPD0kbiszOyAkaSsrKXsgaWYoaXNzZXQoJGVpbFskaS0xXSkpICR0ZWtzdGFzIC49ICRpLic6ICcucnRyaW0oJGVpbFskaS0xXSkuIlxuIjsgfQogICAgICRvWydicmFuZHVvbHlzJ11bJG5dID0gJHRla3N0YXM7CiAgIH0KIH0KCiAvKiAzLiBBciBzYXJnYXMgc2F1Z28gcGVkc2FrYSBhdHNraXJhbWUgc3R1bHBlbHlqZSAqLwogJG9bJ3N0dWxwZWxpYWknXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwoKIC8qIDQuIEtva2llIFVSTCBwYWdhdm8gc2lhIGtsYWlkYSAqLwogJG9bJ3VybCddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAiU0VMRUNUIHVybCwgQ09VTlQoKikgaywgU1VNKGtpZWspIHZpc28gRlJPTSAkdCBXSEVSRSB6aW51dGUgTElLRSAnJVBhc3NpbmcgbnVsbCUnCiAgICAgR1JPVVAgQlkgdXJsIE9SREVSIEJZIHZpc28gREVTQyBMSU1JVCAxMCIsIEFSUkFZX0EpOwoKIC8qIDUuIEFyIHRhaSBuYXVqaWVuYSwgYXIgc2VuaWFpIGthYm8gKi8KICRvWydpc3RvcmlqYSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAiU0VMRUNUIERBVEUobGFpa2FzKSBkLCBDT1VOVCgqKSBrLCBTVU0oa2llaykgdmlzbyBGUk9NICR0IFdIRVJFIHppbnV0ZSBMSUtFICclUGFzc2luZyBudWxsJScKICAgICBHUk9VUCBCWSBEQVRFKGxhaWthcykgT1JERVIgQlkgZCBERVNDIExJTUlUIDEwIiwgQVJSQVlfQSk7CgogLyogNi4gS2FzIHNpdW8gbWV0dSBrYWJpbmFzaSBhbnQgdG8sIGthcyBrdmllY2lhIHdwX2tzZXMgLyBzYW5pdGl6ZSAqLwogJG9bJ2xhaWthcyddID0gYXJyYXkoJ2RhYmFyJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCAndXRjJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpKTsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKIGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R228'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'ZZ R228 Null pedsakas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r228=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,500); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r228.json', Buffer.from(JSON.stringify(out,null,1)), 'r228 nakties ataskaita');
