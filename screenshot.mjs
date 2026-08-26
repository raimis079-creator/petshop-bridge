process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFNpdW50b3MgdjE2IERlcGxveSArIFZpenVhbHVzCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc192MTYnXSkgfHwgJF9HRVRbJ3BzX3YxNiddIT09J1YxNjIwMjYwODI2JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJFQ9YXJyYXkoJ3YnPT4nVjE2RCcpOwogJE1VPVdQTVVfUExVR0lOX0RJUjsgJEJBSz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CiAkaz0kTVUuJy9wZXRzaG9wLWZha3Qtc2l1bnRvcy5waHAnOwogJGRhYmFyPW1kNV9maWxlKCRrKTsgJFRbJ21kNV9zZXJ2ZXJ5amUnXT0kZGFiYXI7CiBpZigkZGFiYXIhPT0nMDdmNTZmYzVmNWJkNWUxNDZkNjA0NTlmOGY1N2RiY2QnKXsKICAgJFRbJ2tsYWlkYSddPSdTVE9QOiBzZXJ2ZXJ5amUgbmUgdjEuNS4nOwogfSBlbHNlIHsKICAkdXJsPSdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS9zaXVudG9zX3YxNi5iNjQ/cmVmPWJiMWVkMWQwN2JjMmU0MjZhNjk1MGFkZWZiMTY1NTAwM2Y2MDUwMzcnOwogICRyPXdwX3JlbW90ZV9nZXQoJHVybCxhcnJheSgndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnJhdycsJ1VzZXItQWdlbnQnPT4ncGV0c2hvcC1icmlkZ2UnKSkpOwogICRvPWFycmF5KCk7CiAgaWYoaXNfd3BfZXJyb3IoJHIpKSAkb1sna2xhaWRhJ109JHItPmdldF9lcnJvcl9tZXNzYWdlKCk7CiAgZWxzZWlmKHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSE9PTIwMCkgJG9bJ2tsYWlkYSddPSdIVFRQICcud3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogIGVsc2V7CiAgICAka29kYXM9YmFzZTY0X2RlY29kZSh0cmltKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSksdHJ1ZSk7CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLFRPS0VOX1BBUlNFKTsgJG9bJ3NpbnRha3NlJ109J09LJzsgfQogICAgY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRvWydrbGFpZGEnXT0nUGFyc2VFcnJvcjogJy4kZS0+Z2V0TWVzc2FnZSgpLicgZWlsLicuJGUtPmdldExpbmUoKTsgfQogICAgaWYoZW1wdHkoJG9bJ2tsYWlkYSddKSl7CiAgICAgICRvWydiYWNrdXAnXT1AY29weSgkaywkQkFLLicvcGV0c2hvcC1mYWt0LXNpdW50b3MucGhwLmJha192MTZfJy5nbWRhdGUoJ1ltZF9IaXMnKSk/J09LJzonTkVQQVZZS08nOwogICAgICAkb1snaXJhc3l0YSddPWZpbGVfcHV0X2NvbnRlbnRzKCRrLCRrb2Rhcyk7IGNsZWFyc3RhdGNhY2hlKHRydWUsJGspOwogICAgICAkb1snbWQ1X3BvJ109bWQ1X2ZpbGUoJGspOyAkb1snc3V0YW1wYSddPSgkb1snbWQ1X3BvJ109PT0nYTliZTc1YzNjZTc4ODEwOTA5YmRhOTVlMGYzODc4ZTknKTsKICAgIH0KICB9CiAgJFRbJ2RlcGxveSddPSRvOwogfQogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const KEY='V1620260826'; const VER='V16D';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Siuntos v16 Deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const {chromium}=await import('playwright'); const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1600,height:1500},ignoreHTTPSErrors:true});
  const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  const d=await pg.goto(WP+'/?ps_v16='+KEY,{waitUntil:'domcontentloaded',timeout:60000});
  try{ out.deploy=JSON.parse((await pg.content()).replace(/<[^>]*>/g,'')); }catch(e){ out.raw=(await pg.content()).replace(/<[^>]*>/g,'').slice(0,400); }
  await miegok(2000);
  await pg.goto(WP+'/wp-admin/admin.php?page=ps-tarifai',{waitUntil:'networkidle',timeout:90000});
  await miegok(1500);
  out.eilutes=await pg.$$eval('table.widefat',ts=>{
    const t=ts[ts.length-1]; if(!t) return [];
    return Array.from(t.querySelectorAll('tbody tr')).map(r=>Array.from(r.querySelectorAll('td')).map(x=>x.textContent.trim()).join(' | '));
  }).catch(()=>[]);
  out.js=kl;
  out.put=await put('screenshots/e1b_tarifai_v16.png', await pg.screenshot({fullPage:true}), VER);
  await br.close();
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,500); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/v16.json', Buffer.from(JSON.stringify(out,null,1)), VER);
