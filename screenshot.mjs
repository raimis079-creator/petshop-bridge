process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUyIEFuYWxpdGlrYSBEZXBsb3kKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2UyZCddKSB8fCAkX0dFVFsncHNfZTJkJ10hPT0nRTJEMjAyNjA4MjYnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkVD1hcnJheSgndic9PidFMkQxJywndHMnPT5nbWRhdGUoJ2MnKSk7CiAkTVU9V1BNVV9QTFVHSU5fRElSOyAkQkFLPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICRrPSRNVS4nL3BldHNob3AtYW5hbGl0aWthLnBocCc7CiAkVFsnYnV2byddPWZpbGVfZXhpc3RzKCRrKT9tZDVfZmlsZSgkayk6bnVsbDsKICR1cmw9J2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95L3BldHNob3AtYW5hbGl0aWthLmI2ND9yZWY9JzsKICRyPXdwX3JlbW90ZV9nZXQoJHVybCxhcnJheSgndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnJhdycsJ1VzZXItQWdlbnQnPT4ncGV0c2hvcC1icmlkZ2UnKSkpOwogJG89YXJyYXkoKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSkgJG9bJ2tsYWlkYSddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOwogZWxzZWlmKHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSE9PTIwMCkgJG9bJ2tsYWlkYSddPSdIVFRQICcud3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogZWxzZXsKICAgJGtvZGFzPWJhc2U2NF9kZWNvZGUodHJpbSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpLHRydWUpOwogICB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLFRPS0VOX1BBUlNFKTsgJG9bJ3NpbnRha3NlJ109J09LJzsgfQogICBjYXRjaChQYXJzZUVycm9yICRlKXsgJG9bJ2tsYWlkYSddPSdQYXJzZUVycm9yOiAnLiRlLT5nZXRNZXNzYWdlKCkuJyBlaWwuJy4kZS0+Z2V0TGluZSgpOyB9CiAgIGlmKGVtcHR5KCRvWydrbGFpZGEnXSkpewogICAgIGlmKGZpbGVfZXhpc3RzKCRrKSkgQGNvcHkoJGssJEJBSy4nL3BldHNob3AtYW5hbGl0aWthLnBocC5iYWtfJy5nbWRhdGUoJ1ltZF9IaXMnKSk7CiAgICAgJG9bJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkaywka29kYXMpOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrKTsKICAgICAkb1snbWQ1X3BvJ109bWQ1X2ZpbGUoJGspOyAkb1snc3V0YW1wYSddPSgkb1snbWQ1X3BvJ109PT0nJyk7CiAgIH0KIH0KICRUWydkZXBsb3knXT0kbzsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const KEY='E2D20260826'; const VER='E2D1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E2 Analitika Deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_e2d='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/e2_dep.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,900); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e2_deprun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
