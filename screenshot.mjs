process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfbTUnXSkgfHwgJF9HRVRbJ3BzX201J10hPT0nTTUyMDI2MDgyNicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJE1VPVdQTVVfUExVR0lOX0RJUjsgJFBMPVdQX1BMVUdJTl9ESVI7CiAkVD1hcnJheSgndic9PidNNScsJ3RzJz0+Z21kYXRlKCdjJykpOwogZm9yZWFjaChhcnJheSgKICAncGV0c2hvcC1mYWt0LXNpdW50b3MucGhwJz0+JE1VLCdwZXRzaG9wLWZha3QtZ3JhemluaW1haS5waHAnPT4kTVUsCiAgJ3BldHNob3AtYXRhc2thaXR1LWFncmVnYXZpbWFzLnBocCc9PiRNVSwncGV0c2hvcC1hbmFsaXRpa2EucGhwJz0+JE1VLAogICdwZXRzaG9wLWlzbGFpZG9zLnBocCc9PiRNVSwncGV0c2hvcC1mYWt0LWF0c2FyZ29zLnBocCc9PiRNVSwKICAncGV0c2hvcC1mYWt0LWthaW5vcy5waHAnPT4kTVUsJ3BldHNob3AtZGltLWtsaWVudGFpLnBocCc9PiRNVSwKICAncGV0c2hvcC1zaXVudHUtbGFpc2thaS5waHAnPT4kTVUsJ3BldHNob3Ata2F0YWxvZ2FzLnBocCc9PiRNVSwKICAncGV0c2hvcC1sYXVrYWkucGhwJz0+JE1VLCdwZXRzaG9wLXJlYy12YXJpa2xpcy5waHAnPT4kTVUsCiApIGFzICRmPT4kZCl7ICRwPSRkLicvJy4kZjsgJFRbJ211J11bJGZdPWZpbGVfZXhpc3RzKCRwKT9hcnJheShtZDVfZmlsZSgkcCksKGludClmaWxlc2l6ZSgkcCkpOidORVJBJzsgfQogJHA9JFBMLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtcHJpY2luZy5waHAnOwogJFRbJ3ByaWNpbmcnXT1maWxlX2V4aXN0cygkcCk/YXJyYXkobWQ1X2ZpbGUoJHApLChpbnQpZmlsZXNpemUoJHApKTonTkVSQSc7CiAkVFsnbGVudGVsZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9QcmljaW5nJyk/KGZ1bmN0aW9uKCl7ICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfUHJpY2luZycpOyAkbz0kci0+bmV3SW5zdGFuY2VXaXRob3V0Q29uc3RydWN0b3IoKTsKICAgcmV0dXJuIGFycmF5KCdkZWZhdWx0Jz0+JG8tPmdldF9kZWZhdWx0X21hcmt1cCgpLCdzYXVzYXMnPT4kby0+Z2V0X21hcmt1cF90YWJsZSgpWydzYXVzYXMtbWFpc3Rhcy1zdW5pbXMnXT8/bnVsbCk7IH0pKCk6Jz8nOwogJFRbJ2lzdG9yaWphJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfZmFrdF9rYWlub3MgV0hFUkUgc2FsdGluaXM9J3ByaWVzX3YxNDAnIik7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='M5';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP MD5',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'s');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_m5=M520260826',{},'r'); const t=await d.text();
  try{ await put('deploy/m5.json', Buffer.from(t,'utf8'), VER); out.ok=1; }catch(e){}
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/m5run.json', Buffer.from(JSON.stringify(out,null,1)), VER);
