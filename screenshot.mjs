process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMTQnXSkgPyAkX0dFVFsncHNfcjIxNCddIDogJyc7CiBpZigkciAhPT0gJ0RSWScgJiYgJHIgIT09ICdBUFBMWScpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICR0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogJG8gPSBhcnJheSgndic9PidSMjE0JywncmV6aW1hcyc9PiRyKTsKCiBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIikgIT09ICR0KXsKICAgJG9bJ2tsYWlkYSddPSduZXJhIHNuaXBwZXR1IGxlbnRlbGVzJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7CiB9CgogLyogS2FuZGlkYXRhaTogVElLIFRFTVAqIElSIFRJSyBuZWFrdHl2dXMuIEFrdHl2dXMgVEVNUCBwYWxpZWthbWFzCiAgICBzYW1vbmluZ2FpIOKAlCBqaXMgZ2FsaSBidXRpIHNpbyBwYXRpZXMgYmFuZHltbyBzbmlwcGV0YXMuICovCiAka2FuZCA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgIlNFTEVDVCBpZCwgbmFtZSwgYWN0aXZlLCBMRU5HVEgoY29kZSkgQVMgaWxnaXMgRlJPTSAkdAogICAgIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwoKICRvWyd2aXNvX2xlbnRlbGVqZSddICAgPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogJG9bJ2FrdHl2dXNfcHJpZXMnXSAgICA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGFjdGl2ZT0xIik7CiAkb1sndGVtcF92aXNvJ10gICAgICAgID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICRvWyd0ZW1wX2FrdHl2dXMnXSAgICAgPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTEiKTsKICRvWydrYW5kaWRhdHUnXSAgICAgICAgPSBjb3VudCgka2FuZCk7CiAkb1sncGF2eXpkemlhaSddICAgICAgID0gYXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXsKICAgcmV0dXJuICR4WydpZCddLicgwrcgJy5tYl9zdWJzdHIoJHhbJ25hbWUnXSwwLDYwKS4nIMK3ICcuJHhbJ2lsZ2lzJ10uJyBCJzsKIH0sICRrYW5kKSwgMCwgMTIpOwoKIC8qIFNhdWdpa2xpczogamVpIGthbmRpZGF0dSB0YXJwZSBhdHNpcmFzdHUgYmVudCB2aWVuYXMgYWt0eXZ1cyBhcmJhCiAgICBuZS1URU1QIOKAlCBzdG9qYW0uIFRpa3JpbmFtIGRhciBrYXJ0YSBwYWNpdXMgZHVvbWVuaXMsIG5lIHV6a2xhdXNhLiAqLwogJGJsb2dpID0gMDsKIGZvcmVhY2goJGthbmQgYXMgJGspewogICBpZigoaW50KSRrWydhY3RpdmUnXSAhPT0gMCkgeyAkYmxvZ2krKzsgfQogICBpZihzdHJwb3MoJGtbJ25hbWUnXSwgJ1RFTVAnKSAhPT0gMCkgeyAkYmxvZ2krKzsgfQogfQogJG9bJ3NhdWdpa2xpcyddID0gJGJsb2dpID09PSAwID8gJ09LJyA6ICdTVE9QICgnLiRibG9naS4nKSc7CgogaWYoJHIgPT09ICdBUFBMWScgJiYgJG9bJ3NhdWdpa2xpcyddID09PSAnT0snICYmICRrYW5kKXsKICAgLyogMS4gQXRzYXJnaW5lIGtvcGlqYSBpIGZhaWxhIFBSSUVTIHRyeW5pbWEgKi8KICAgJGJkaXIgPSBXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CiAgIGlmKCFpc19kaXIoJGJkaXIpKSBAd3BfbWtkaXJfcCgkYmRpcik7CiAgICRpZHMgPSBhcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gKGludCkkeFsnaWQnXTsgfSwgJGthbmQpOwogICAkcGlsbmkgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgV0hFUkUgaWQgSU4gKCIuaW1wbG9kZSgnLCcsJGlkcykuIikiLCBBUlJBWV9BKTsKICAgJGZhaWxhcyA9ICRiZGlyLicvdGVtcC1zbmlwcGV0cy0nLmdtZGF0ZSgnWW1kLUhpcycpLicuanNvbic7CiAgICRvWydrb3BpamEnXSA9IGZpbGVfcHV0X2NvbnRlbnRzKCRmYWlsYXMsIHdwX2pzb25fZW5jb2RlKCRwaWxuaSwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSkpICE9PSBmYWxzZQogICAgID8gYXJyYXkoJ2ZhaWxhcyc9PmJhc2VuYW1lKCRmYWlsYXMpLCAnZHlkaXMnPT5maWxlc2l6ZSgkZmFpbGFzKSwgJ2lyYXN1Jz0+Y291bnQoJHBpbG5pKSkKICAgICA6ICdORVBBVllLTyc7CgogICAvKiAyLiBUcmluYW0gVElLIGplaSBrb3BpamEgdGlrcmFpIGd1bGFzaSBkaXNrZSAqLwogICBpZihpc19hcnJheSgkb1sna29waWphJ10pICYmICRvWydrb3BpamEnXVsnaXJhc3UnXSA9PT0gY291bnQoJGthbmQpKXsKICAgICAkaXN0cmludGEgPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICR0IFdIRVJFIGlkIElOICgiLmltcGxvZGUoJywnLCRpZHMpLiIpIEFORCBhY3RpdmU9MCBBTkQgbmFtZSBMSUtFICdURU1QJSciKTsKICAgICAkb1snaXN0cmludGEnXSA9IChpbnQpJGlzdHJpbnRhOwogICB9IGVsc2UgewogICAgICRvWydpc3RyaW50YSddID0gJ1BSQUxFSVNUQSDigJQga29waWphIG5lcGF2eWtvJzsKICAgfQoKICAgJG9bJ3Zpc29fcG8nXSAgICAgID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAgJG9bJ2FrdHl2dXNfcG8nXSAgID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgYWN0aXZlPTEiKTsKICAgJG9bJ3RlbXBfcG8nXSAgICAgID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICAgJG9bJ2FrdHl2dXNfbmVwYWxpZXN0aSddID0gKCRvWydha3R5dnVzX3BvJ10gPT09ICRvWydha3R5dnVzX3ByaWVzJ10pID8gJ1RBSVAnIDogJ05FIOKAlCBQQVRJS1JJTlRJJzsKIH0KCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKIGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R214'};
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
  const kunas=JSON.stringify({name:'ZZ R214 Snippetu valymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d1=await fetch(WP+'/?ps_r214=DRY'); try{ out.DRY=JSON.parse(await d1.text()); }catch(e){ out.DRY='klaida'; }
    if(out.DRY && out.DRY.saugiklis==='OK' && out.DRY.kandidatu>0){
      const d2=await fetch(WP+'/?ps_r214=APPLY'); try{ out.APPLY=JSON.parse(await d2.text()); }catch(e){ out.APPLY='klaida'; }
    }
    /* sio snippeto vardas NE TEMP, tad jo valymas nepalietė — deaktyvuojam ir trinam ranka veliau */
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r214.json', Buffer.from(JSON.stringify(out,null,1)), 'r214 snippetu valymas');
