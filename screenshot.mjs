process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxNiddKSA/ICRfR0VUWydwc19yMjE2J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxNicpOwoKICRkaXIgPSBXUF9QTFVHSU5fRElSLicvcG9zdGl0JzsKICRvWyd5cmEnXSA9IGlzX2RpcigkZGlyKTsKIGlmKCFmdW5jdGlvbl9leGlzdHMoJ2dldF9wbHVnaW5fZGF0YScpKSByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvcGx1Z2luLnBocCc7CiAkcGYgPSAkZGlyLicvcG9zdGl0LnBocCc7CiBpZihmaWxlX2V4aXN0cygkcGYpKXsKICAgJGQgPSBnZXRfcGx1Z2luX2RhdGEoJHBmLCBmYWxzZSwgZmFsc2UpOwogICAkb1snaW5mbyddID0gYXJyYXkoJ05hbWUnPT4kZFsnTmFtZSddLCdWZXJzaW9uJz0+JGRbJ1ZlcnNpb24nXSwnQXV0aG9yJz0+JGRbJ0F1dGhvciddLAogICAgICdQbHVnaW5VUkknPT4kZFsnUGx1Z2luVVJJJ10sJ0Rlc2NyaXB0aW9uJz0+bWJfc3Vic3RyKHN0cmlwX3RhZ3MoJGRbJ0Rlc2NyaXB0aW9uJ10pLDAsMzAwKSk7CiAgICRvWydpZGllZ3RhcyddID0gZ21kYXRlKCdZLW0tZCBIOmknLCBmaWxlbXRpbWUoJHBmKSk7CiB9CgogLyogZmFpbHUgc2thaWNpdXMgaXIgZHlkaXMgKi8KICRraWVrPTA7ICRkeWRpcz0wOwogJGl0ID0gQG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKEBuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOwogaWYoJGl0KXsgZm9yZWFjaCgkaXQgYXMgJGYpeyBpZigkZi0+aXNGaWxlKCkpeyAka2llaysrOyAkZHlkaXMrPSRmLT5nZXRTaXplKCk7IH0gfSB9CiAkb1snZmFpbHUnXSA9ICRraWVrOyAkb1snZHlkaXNfa2InXSA9IHJvdW5kKCRkeWRpcy8xMDI0KTsKCiAvKiBzYXZvcyBsZW50ZWxlcyAqLwogJGxlbnQgPSAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9JXBvc3RpdCUnIik7CiAkb1snbGVudGVsZXMnXSA9IGFycmF5KCk7CiBmb3JlYWNoKChhcnJheSkkbGVudCBhcyAkdCl7ICRvWydsZW50ZWxlcyddWyR0XSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdGAiKTsgfQoKIC8qIG9wY2lqb3MgKi8KICRvWydvcGNpam9zJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgTEVOR1RIKG9wdGlvbl92YWx1ZSkgaWxnaXMKICAgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVwb3N0aXQlJyBMSU1JVCAzMCIsIEFSUkFZX0EpOwoKIC8qIHNhdmkgaXJhc3UgdGlwYWkgKi8KICRvWydpcmFzdV90aXBhaSddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF90eXBlLCBwb3N0X3N0YXR1cywgQ09VTlQoKikgawogICBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZSBMSUtFICclcG9zdGl0JScgR1JPVVAgQlkgcG9zdF90eXBlLCBwb3N0X3N0YXR1cyIsIEFSUkFZX0EpOwoKIC8qIGFyIHR1cmlueXMgbmF1ZG9qYSBzaG9ydGNvZGUgKi8KICRzYyA9IGFycmF5KCk7CiBmb3JlYWNoKGFycmF5KCdwb3N0aXQnLCdwb3N0X2l0JywncG9zdC1pdCcsJ3N0aWNreV9ub3RlJykgYXMgJHMpewogICAkc2NbJHNdID0gKGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9zdGF0dXMhPSd0cmFzaCcgQU5EIHBvc3RfY29udGVudCBMSUtFICVzIiwKICAgICAnJVsnLiRzLiclJykpOwogfQogJG9bJ3Nob3J0Y29kZSddID0gJHNjOwoKIC8qIHJlZ2lzdHJ1b3RpIHNob3J0Y29kZSdhaSBpciB3aWRnZXQnYWkgKi8KIGdsb2JhbCAkc2hvcnRjb2RlX3RhZ3MsICR3cF93aWRnZXRfZmFjdG9yeTsKICRvWydyZWdpc3RydW90aV9zYyddID0gYXJyYXkoKTsKIGZvcmVhY2goKGFycmF5KSRzaG9ydGNvZGVfdGFncyBhcyAkdGFnPT4kY2IpewogICAkdiA9IGlzX2FycmF5KCRjYikgPyAoaXNfb2JqZWN0KCRjYlswXSk/Z2V0X2NsYXNzKCRjYlswXSk6JGNiWzBdKSA6IChpc19zdHJpbmcoJGNiKT8kY2I6J2Nsb3N1cmUnKTsKICAgaWYoc3RyaXBvcygkdGFnLCdwb3N0aXQnKSE9PWZhbHNlIHx8IHN0cmlwb3MoKHN0cmluZykkdiwncG9zdGl0JykhPT1mYWxzZSkgJG9bJ3JlZ2lzdHJ1b3RpX3NjJ11bJHRhZ109JHY7CiB9CiAkb1snd2lkZ2V0YWknXSA9IGFycmF5KCk7CiBpZigkd3Bfd2lkZ2V0X2ZhY3RvcnkpeyBmb3JlYWNoKCR3cF93aWRnZXRfZmFjdG9yeS0+d2lkZ2V0cyBhcyAkaz0+JHcpeyBpZihzdHJpcG9zKCRrLCdwb3N0aXQnKSE9PWZhbHNlKSAkb1snd2lkZ2V0YWknXVtdPSRrOyB9IH0KCiAvKiBwb3N0bWV0YSAqLwogJG9bJ3Bvc3RtZXRhJ10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleSBMSUtFICclcG9zdGl0JSciKTsKCiAvKiBhciBrYWJpbmFzaSBhbnQgZnJvbnRpbmlvIGlzdmVkaW1vICovCiAka2FibGl1a2FpID0gYXJyYXkoKTsKIGZvcmVhY2goYXJyYXkoJ3dwX2Zvb3RlcicsJ3dwX2hlYWQnLCd0aGVfY29udGVudCcsJ3dwX2VucXVldWVfc2NyaXB0cycpIGFzICRoKXsKICAgZ2xvYmFsICR3cF9maWx0ZXI7CiAgIGlmKGVtcHR5KCR3cF9maWx0ZXJbJGhdKSkgY29udGludWU7CiAgIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpewogICAgIGZvcmVhY2goJGNicyBhcyAkY2IpewogICAgICAgJGYgPSAkY2JbJ2Z1bmN0aW9uJ107CiAgICAgICAkdiA9IGlzX2FycmF5KCRmKSA/IChpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6KHN0cmluZykkZlswXSkgOiAoaXNfc3RyaW5nKCRmKT8kZjonY2xvc3VyZScpOwogICAgICAgaWYoc3RyaXBvcygkdiwncG9zdGl0JykhPT1mYWxzZSkgJGthYmxpdWthaVskaF1bXSA9ICR2LicgKHByICcuJHByLicpJzsKICAgICB9CiAgIH0KIH0KICRvWydrYWJsaXVrYWknXSA9ICRrYWJsaXVrYWk7CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R216'};
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
  const kunas=JSON.stringify({name:'ZZ R216 Postit recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r216=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,500); }
    /* ar postit kazka piesia frontinėje puseje */
    for(const [v,k] of [['pradzia','/'],['preke','/product/test-konservu-deze-400-be-vistienos/']]){
      const q=await fetch(WP+k); const h=await q.text();
      out[v]={postit_html:(h.match(/postit/gi)||[]).length};
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r216.json', Buffer.from(JSON.stringify(out,null,1)), 'r216 postit');
