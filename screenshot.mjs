process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIwNSddKSkgcmV0dXJuOwogJHI9JF9HRVRbJ3BzX2gyMDUnXTsKIGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAkbz1hcnJheSgndic9PidIMjA1JywncmV6aW1hcyc9PiRyKTsKIC8qIGthbmRpZGF0YWk6IFRJSyBRUSBwYXZhZGluaW1haSwgVElLIG5lYWt0eXZ1cyAqLwogJGthbmQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJ1FRICUnIEFORCBhY3RpdmU9MCBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwogJG9bJ2thbmRpZGF0YWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnaWQnXS4nIMK3ICcuJHhbJ25hbWUnXTt9LCAka2FuZCk7CiAkYmxvZ2k9YXJyYXkoKTsKIGZvcmVhY2goJGthbmQgYXMgJGspewogICBpZigoaW50KSRrWydhY3RpdmUnXSE9PTApICRibG9naVtdPSRrWydpZCddLicgYWt0eXZ1cyc7CiAgIGlmKHN0cnBvcygka1snbmFtZSddLCdRUSAnKSE9PTApICRibG9naVtdPSRrWydpZCddLicgbmUgUVEnOwogfQogJG9bJ3NhdWdpa2xpcyddPSRibG9naT8oJ1NUT1A6ICcuaW1wbG9kZSgnLCAnLCRibG9naSkpOidPSyc7CiBpZigkcj09PSdBUFBMWScgJiYgISRibG9naSAmJiAka2FuZCl7CiAgICRpZHM9aW1wbG9kZSgnLCcsIGFycmF5X21hcCgnaW50dmFsJywgYXJyYXlfY29sdW1uKCRrYW5kLCdpZCcpKSk7CiAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHQgV0hFUkUgaWQgSU4gKCRpZHMpIEFORCBuYW1lIExJS0UgJ1FRICUnIEFORCBhY3RpdmU9MCIpOwogICAkb1snaXN0cmludGEnXT0kd3BkYi0+cm93c19hZmZlY3RlZDsKICAgLyogc2F2ZSBpcmdpIOKAlCB2YWx5dG9qYXMgVlYsIGphdSBuZWJlcmVpa2FsaW5nYXMgKi8KICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkdCBXSEVSRSBuYW1lPSdWViBWYWx5dG9qYXMgSDIwNSciKTsKICAgJG9bJ3ZhbHl0b2phc19pc3RyaW50YXMnXT0kd3BkYi0+cm93c19hZmZlY3RlZDsKIH0KICRvWydsaWtvX3FxJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdRUSAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOwogZXhpdDsKfSk7Cg==';
const out={v:'H205'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'VV Valytojas H205',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d1=await fetch(WP+'/?ps_h205=DRY');
    try{ out.DRY=JSON.parse(await d1.text()); }catch(e){ out.DRY='klaida'; }
    if(out.DRY && out.DRY.saugiklis==='OK'){
      const d2=await fetch(WP+'/?ps_h205=APPLY');
      try{ out.APPLY=JSON.parse(await d2.text()); }catch(e){ out.APPLY='klaida'; }
    }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h205.json', Buffer.from(JSON.stringify(out,null,1)), 'h205 qq valymas');
