process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIxMSddKSB8fCAkX0dFVFsncHNfaDIxMSddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvPWFycmF5KCd2Jz0+J0gyMTEnKTsKIC8qIDEuIHdjZG4gKFByaW50IEludm9pY2UgJiBEZWxpdmVyeSBOb3RlKSBidWtsbGUgKi8KICRvWyd3Y2RuX2FrdHl2dXMnXT0gY2xhc3NfZXhpc3RzKCdXb29Db21tZXJjZV9EZWxpdmVyeV9Ob3RlcycpIHx8IGZ1bmN0aW9uX2V4aXN0cygnd2Nkbl9nZXRfdGVtcGxhdGVfdHlwZScpOwogJHM9Z2V0X29wdGlvbignd2Nkbl9zZXR0aW5ncycsIG51bGwpOwogaWYoaXNfYXJyYXkoJHMpKXsgJG9bJ3djZG5fcmFrdGFpJ109YXJyYXlfc2xpY2UoYXJyYXlfa2V5cygkcyksMCw0MCk7ICRvWyd3Y2RuX3B2eiddPWFycmF5X2ludGVyc2VjdF9rZXkoJHMsIGFycmF5X2ZsaXAocHJlZ19ncmVwKCcvbnVtYmVyfHNlcmllc3xjcmVkaXR8aW52b2ljZS9pJywgYXJyYXlfa2V5cygkcykpKSk7IH0KIGVsc2UgewogICAkdmlzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRUZUKG9wdGlvbl92YWx1ZSwxMjApIHYgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3djZG4lJyBMSU1JVCAyNSIsIEFSUkFZX0EpOwogICAkb1snd2Nkbl9vcGNpam9zJ109JHZpczsKIH0KIC8qIDIuIEFWUE4gbnVtZXJhY2lqYSDigJQga3VyIGd5dmVuYSAqLwogJHJhZD1hcnJheSgpOwogZm9yZWFjaChnbG9iKFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy8qLnBocCcpIGFzICRmKXsKICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICBpZihzdHJpcG9zKCRjLCdBVlBOJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRjLCdLUi0nKSE9PWZhbHNlKXsgCiAgICAgcHJlZ19tYXRjaF9hbGwoJy8uezAsNjB9KEFWUE58S1ItKVteXG5dezAsNjB9LycsICRjLCAkbSk7CiAgICAgJHJhZFtiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbVswXSksMCw2KTsKICAgfQogfQogJG9bJ2F2cG5fZmFpbGFpJ109JHJhZDsKICRvWydhdnBuX29wY2lqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgTEVGVChvcHRpb25fdmFsdWUsODApIHYgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVhdnBuJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWlhcHYlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclbnVtZXJhY2lqJScgTElNSVQgMTUiLCBBUlJBWV9BKTsKIC8qIDMuIGNyZWRpdG5vdGUgdmVpa3NtbyBidXZpbWFzIFdDIHNhcmFzZSAqLwogJG9bJ3djX21hc2luaWFpJ109YXJyYXlfdmFsdWVzKHByZWdfZ3JlcCgnL3djZG58Y3JlZGl0L2knLCBhcnJheV9rZXlzKChhcnJheSlhcHBseV9maWx0ZXJzKCdidWxrX2FjdGlvbnMtd29vY29tbWVyY2VfcGFnZV93Yy1vcmRlcnMnLCBhcnJheSgpKSkpKTsKIC8qIDQuIF9wc193aXRoZHJhd2FsIGRhYmFydGluaWFpIHZhcnRvdG9qYWkgKi8KICR2PWFycmF5KCk7CiBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zLyoucGhwJykgYXMgJGYpeyBpZihzdHJwb3MoZmlsZV9nZXRfY29udGVudHMoJGYpLCdfcHNfd2l0aGRyYXdhbCcpIT09ZmFsc2UpICR2W109YmFzZW5hbWUoJGYpOyB9CiAkb1snd2l0aGRyYXdhbF92YXJ0b3RvamFpJ109JHY7CiAvKiA1LiBteS1hY2NvdW50IHV6c2FreW1vIHBlcnppdXJvcyBlbmRwb2ludGFzIHZlaWtpYT8gKi8KICRvWydteWFjY291bnRfcGFnZSddPXdjX2dldF9wYWdlX3Blcm1hbGluaygnbXlhY2NvdW50Jyk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const out={v:'H211'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H211 es recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h211=RUN');
    try{ out.DIEGIMAS=JSON.parse(await d.text()); }catch(e){ out.DIEGIMAS='klaida'; }
    await miegok(2000);
    const d2=await fetch(WP+'/?ps_h211=TEST');
    const t2=await d2.text();
    try{ out.TESTAI=JSON.parse(t2); }catch(e){ out.TESTAI='ne-json: '+t2.slice(0,400); }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h211.json', Buffer.from(JSON.stringify(out,null,1)), 'h211 es recon');
