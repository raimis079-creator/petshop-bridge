process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMzUnXSkgPyAkX0dFVFsncHNfcjIzNSddIDogJyc7CiBpZigkciAhPT0gJ0RSWScgJiYgJHIgIT09ICdBUFBMWScpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICR0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogJG8gPSBhcnJheSgndic9PidSMjM1JywncmV6aW1hcyc9PiRyKTsKCiAkb1sncHJpZXMnXSA9IGFycmF5KAogICAndmlzbycgICAgPT4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKSwKICAgJ2FrdHl2dXMnID0+IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGFjdGl2ZT0xIiksCiAgICd6eicgICAgICA9PiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJ1paICUnIiksCiAgICd6el9ha3R5dnVzJyA9PiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJ1paICUnIEFORCBhY3RpdmU9MSIpLAogKTsKIC8qIEthcyBkYXIgYWt0eXZ1IGlzIFpaIOKAlCBwYXJvZG9tIHZhcmR1LCBrYWQgbWF0eXR1c2ksIGthIGxpZWNpYW0gKi8KICRvWyd6el9ha3R5dnVzX3ZhcmRhaSddID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBDT05DQVQoaWQsJyDCtyAnLG5hbWUpIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdaWiAlJyBBTkQgYWN0aXZlPTEiKTsKCiAvKiAxIHppbmdzbmlzOiBnYXVkeWtsZSBpc2p1bmdpYW0gKG5lIHRyaW5hbSBzaWFtZSB6aW5nc255amUpICovCiBpZigkciA9PT0gJ0FQUExZJyl7CiAgICR3cGRiLT5xdWVyeSgiVVBEQVRFICR0IFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1paICUnIEFORCBhY3RpdmU9MSIpOwogICAkb1snaXNqdW5ndGFfenonXSA9ICR3cGRiLT5yb3dzX2FmZmVjdGVkOwogfQoKIC8qIDIgemluZ3NuaXM6IGthbmRpZGF0YWkgdHJ5bmltdWkg4oCUIFRJSyBaWiwgVElLIG5lYWt0eXZ1cyAqLwogJGthbmQgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgbmFtZSwgYWN0aXZlIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdaWiAlJyBBTkQgYWN0aXZlPTAgT1JERVIgQlkgaWQiLCBBUlJBWV9BKTsKICRvWydrYW5kaWRhdHUnXSA9IGNvdW50KCRrYW5kKTsKICRvWydrYW5kaWRhdGFpJ10gPSBhcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gJHhbJ2lkJ10uJyDCtyAnLm1iX3N1YnN0cigkeFsnbmFtZSddLDAsNTUpOyB9LCAka2FuZCk7CgogLyogU2F1Z2lrbGlzOiBraWVrdmllbmFzIGthbmRpZGF0YXMgZGFyIGthcnRhIHRpa3JpbmFtYXMgYXRza2lyYWkgKi8KICRibG9naSA9IGFycmF5KCk7CiBmb3JlYWNoKCRrYW5kIGFzICRrKXsKICAgaWYoKGludCkka1snYWN0aXZlJ10gIT09IDApICAgICAgICAgICAgICAkYmxvZ2lbXSA9ICRrWydpZCddLicgYWt0eXZ1cyc7CiAgIGlmKHN0cnBvcygka1snbmFtZSddLCAnWlogJykgIT09IDApICAgICAgJGJsb2dpW10gPSAka1snaWQnXS4nIG5lIFpaJzsKIH0KICRvWydzYXVnaWtsaXMnXSA9ICRibG9naSA/ICdTVE9QOiAnLmltcGxvZGUoJywgJywgJGJsb2dpKSA6ICdPSyc7CgogaWYoJHIgPT09ICdBUFBMWScgJiYgJG9bJ3NhdWdpa2xpcyddID09PSAnT0snICYmICRrYW5kKXsKICAgJGJkaXIgPSBXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CiAgIGlmKCFpc19kaXIoJGJkaXIpKSBAd3BfbWtkaXJfcCgkYmRpcik7CiAgICRpZHMgPSBhcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gKGludCkkeFsnaWQnXTsgfSwgJGthbmQpOwogICAkcGlsbmkgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgV0hFUkUgaWQgSU4gKCIuaW1wbG9kZSgnLCcsJGlkcykuIikiLCBBUlJBWV9BKTsKICAgJGZhaWxhcyA9ICRiZGlyLicvenotc25pcHBldHMtJy5nbWRhdGUoJ1ltZC1IaXMnKS4nLmpzb24nOwogICAkb2sgPSBmaWxlX3B1dF9jb250ZW50cygkZmFpbGFzLCB3cF9qc29uX2VuY29kZSgkcGlsbmksIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpKTsKICAgJG9bJ2tvcGlqYSddID0gJG9rICE9PSBmYWxzZSA/IGFycmF5KCdmYWlsYXMnPT5iYXNlbmFtZSgkZmFpbGFzKSwnZHlkaXMnPT5maWxlc2l6ZSgkZmFpbGFzKSwnaXJhc3UnPT5jb3VudCgkcGlsbmkpKSA6ICdORVBBVllLTyc7CgogICBpZihpc19hcnJheSgkb1sna29waWphJ10pICYmICRvWydrb3BpamEnXVsnaXJhc3UnXSA9PT0gY291bnQoJGthbmQpKXsKICAgICAkb1snaXN0cmludGEnXSA9IChpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkdCBXSEVSRSBpZCBJTiAoIi5pbXBsb2RlKCcsJywkaWRzKS4iKSBBTkQgYWN0aXZlPTAgQU5EIG5hbWUgTElLRSAnWlogJSciKTsKICAgfSBlbHNlIHsKICAgICAkb1snaXN0cmludGEnXSA9ICdQUkFMRUlTVEEg4oCUIGtvcGlqYSBuZXBhdnlrbyc7CiAgIH0KCiAgICRvWydwbyddID0gYXJyYXkoCiAgICAgJ3Zpc28nICAgID0+IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IiksCiAgICAgJ2FrdHl2dXMnID0+IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGFjdGl2ZT0xIiksCiAgICAgJ3p6JyAgICAgID0+IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIG5hbWUgTElLRSAnWlogJSciKSwKICAgKTsKICAgLyogQWt0eXZ1cyB0dXJpIGJ1dGkgNzMgbWludXMgdGllIFpaLCBrdXJpdW9zIGthIHRpayBpc2p1bmdlbSAqLwogICAkb1snYWt0eXZ1c190aWtyaW5pbWFzJ10gPSAoJG9bJ3BvJ11bJ2FrdHl2dXMnXSA9PT0gJG9bJ3ByaWVzJ11bJ2FrdHl2dXMnXSAtIChpbnQpJG9bJ2lzanVuZ3RhX3p6J10pCiAgICAgPyAnVEFJUCDigJQgdmVpa2lhbnR5cyBuZXBhbGllc3RpJyA6ICdORSDigJQgUEFUSUtSSU5USSc7CiAgIGRlbGV0ZV9vcHRpb24oJ3BzX3IyMzBfcGFnYXV0YScpOwogICAkb1snZ2F1ZHlrbGVzX2R1b21lbnlzJ10gPSAnaXN2YWx5dGknOwogfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R235'};
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
  /* siam darbui naudojam VIENA snippeta, vardu NE ZZ — kad pats savęs neistrintų */
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ Valytojas R235',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d1=await fetch(WP+'/?ps_r235=DRY'); try{ out.DRY=JSON.parse(await d1.text()); }catch(e){ out.DRY='klaida'; }
    if(out.DRY && out.DRY.saugiklis==='OK'){
      const d2=await fetch(WP+'/?ps_r235=APPLY'); try{ out.APPLY=JSON.parse(await d2.text()); }catch(e){ out.APPLY='klaida'; }
    }
    await miegok(2000);
    /* svetaines sveikata po valymo */
    for(const [v,k] of [['pradzia','/'],['parduotuve','/parduotuve/']]){
      const q=await fetch(WP+k); const h=await q.text();
      out[v]={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    }
    /* pats valytojas — isjungiam */
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.valytojas_isjungtas=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r235.json', Buffer.from(JSON.stringify(out,null,1)), 'r235 zz valymas');
