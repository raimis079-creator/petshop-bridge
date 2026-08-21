process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxNSddKSA/ICRfR0VUWydwc19yMjE1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxNScpOwoKIC8qIC0tLS0gUS1aQi1TQUtOSVM6IGtpZWsgJmFtcDsgZ3Jpem8gcG8gbmFrdGllcyBpbXBvcnRvIC0tLS0gKi8KICRvWydhbXAnXSA9IGFycmF5KAogICAncGF2YWRpbmltdW9zZScgPT4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30KICAgICBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIEFORCBwb3N0X3RpdGxlIExJS0UgJyUmYW1wOyUnIiksCiAgICdwdWJsaXNoJyA9PiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfQogICAgIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICclJmFtcDslJyIpLAogICAnZXhjZXJwdCcgPT4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30KICAgICBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIEFORCBwb3N0X2V4Y2VycHQgTElLRSAnJSZhbXA7JSciKSwKICAgJ2NvbnRlbnQnID0+IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9CiAgICAgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgcG9zdF9jb250ZW50IExJS0UgJyUmYW1wOyUnIiksCiAgICdkdmlndWJpJyA9PiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfQogICAgIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJSZhbXA7YW1wOyUnIiksCiApOwogJG9bJ2FtcF9wYXZ5emR6aWFpJ10gPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChJRCwnIMK3ICcscG9zdF9zdGF0dXMsJyDCtyAnLHBvc3RfdGl0bGUpCiAgIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICclJmFtcDslJyBMSU1JVCAxMCIpOwogLyoga2FkYSBwYXNrdXRpbmlzIGtlaXRpbWFzIOKAlCBhciB0YWkgTkFVSkksIGFyIHNlbmkgbGlrdWNpYWkgKi8KICRvWydhbXBfa2Vpc3RhJ10gPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChJRCwnIMK3ICcscG9zdF9tb2RpZmllZCkKICAgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3RpdGxlIExJS0UgJyUmYW1wOyUnCiAgIE9SREVSIEJZIHBvc3RfbW9kaWZpZWQgREVTQyBMSU1JVCA4Iik7CgogLyogLS0tLSBET0QtMDM6IHNhcmdvIGtsYWlkdSBwYXJhc2FpIC0tLS0gKi8KICR0ID0gJHdwZGItPnByZWZpeC4ncHNfc2FyZ2FzX2tsYWlkb3MnOwogaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpID09PSAkdCl7CiAgICRzdCA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwogICAkb1snc2FyZ2FzX3N0dWxwZWxpYWknXSA9ICRzdDsKICAgJG9bJ3Nhcmdhc192aXNvJ10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogICAkb1snc2FyZ2FzX25hdWphdXNpJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMiIsIEFSUkFZX0EpOwogfSBlbHNlIHsgJG9bJ3NhcmdhcyddID0gJ25lcmEgbGVudGVsZXMnOyB9CgogLyogLS0tLSBPUFMtMTUgLyBkZXByZWNhdGVkOiBwb3N0aXQgcGx1Z2luYXMgLS0tLSAqLwogJGFrdCA9IChhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycsIGFycmF5KCkpOwogJG9bJ3BsdWdpbnUnXSA9IGNvdW50KCRha3QpOwogJG9bJ3Bvc3RpdCddID0gYXJyYXkoKTsKIGZvcmVhY2goJGFrdCBhcyAkcCl7CiAgIGlmKHN0cmlwb3MoJHAsJ3Bvc3RpdCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkcCwncG9zdC1pdCcpIT09ZmFsc2UpICRvWydwb3N0aXQnXVtdID0gJHA7CiB9CiAkb1sncGx1Z2luYWknXSA9ICRha3Q7CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R215'};
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
  const kunas=JSON.stringify({name:'ZZ R215 Degantys matavimas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r215=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,500); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r215.json', Buffer.from(JSON.stringify(out,null,1)), 'r215 degantys');
