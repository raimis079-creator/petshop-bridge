process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEVsbmlvIFJhZ3UgUGF0aWtyYSB2MS4wICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19lbCddID8/ICcnKSAhPT0gJ0VMMScgKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRvPVsndic9PidFTDEnXTsKICRyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9zdGF0dXMgRlJPTSB7JHdwZGItPnBvc3RzfQogICBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1czw+J3RyYXNoJwogICBBTkQgKHBvc3RfdGl0bGUgTElLRSAnJWxuaW8gcmFnbyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWFuaWVsaWF1cyByYWdvJScpCiAgIE9SREVSIEJZIHBvc3RfdGl0bGUiLCBBUlJBWV9BKTsKIGZvcmVhY2goJHIgYXMgJiR4KXsKICAgJHhbJ3NrdSddPWdldF9wb3N0X21ldGEoJHhbJ0lEJ10sJ19za3UnLHRydWUpOwogICAkeFsna2FpbmEnXT1nZXRfcG9zdF9tZXRhKCR4WydJRCddLCdfcmVndWxhcl9wcmljZScsdHJ1ZSk7CiAgICR4WydzdG9jayddPWdldF9wb3N0X21ldGEoJHhbJ0lEJ10sJ19zdG9jaycsdHJ1ZSk7CiAgICR4WydzZWltYSddPWdldF9wb3N0X21ldGEoJHhbJ0lEJ10sJ19wc19keWR6aW9fc2VpbWEnLHRydWUpOwogICAkZD13cF9nZXRfb2JqZWN0X3Rlcm1zKCR4WydJRCddLCdwYV9keWRpcycsWydmaWVsZHMnPT4nbmFtZXMnXSk7CiAgICR4WydkeWRpcyddPWlzX3dwX2Vycm9yKCRkKT9bXTokZDsKIH0KICRvWydwcmVrZXMnXT0kcjsgJG9bJ3NrJ109Y291bnQoJHIpOwogJG9bJ3NrdV80MDA1MDAnXT0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgKICAgIlNFTEVDVCBwb3N0X2lkIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19za3UnIEFORCBtZXRhX3ZhbHVlIExJS0UgJXMiLCc0MDA1MDAlJykpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='EL-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Elnio Ragu Patikra v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_el=EL1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'el');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/elnias_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
