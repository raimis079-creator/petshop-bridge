process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIE1vbm8gQXVkaXQgdjEgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX21vbm8xMCddID8/ICcnKSAhPT0gJ0dPJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvPVsndic9PidNT05PQVVEMSddOwoKICRxID0gbmV3IFdQX1F1ZXJ5KFsKICAgJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLAogICAndGF4X3F1ZXJ5Jz0+WydyZWxhdGlvbic9PidBTkQnLAogICAgIFsndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT4nbWFpc3Rhcy1zdW5pbXMnXSwKICAgICBbJ3RheG9ub215Jz0+J3BhX21vbm9wcm90ZWluJywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+Wyd0YWlwJ11dLAogICBdLAogXSk7CiAkaWRzPSRxLT5wb3N0czsgJG9bJ3Zpc28nXT1jb3VudCgkaWRzKTsKCiAkcGFnYWxfYnJhbmQ9W107ICRwYWdhbF9nYW09W107ICRlaWw9W107CiBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICRiID0gd3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgJGIgPSBpc193cF9lcnJvcigkYil8fGVtcHR5KCRiKSA/ICctJyA6ICRiWzBdOwogICAkZ2FtID0gZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfbGVnYWN5X21hbnVmYWN0dXJlcicsdHJ1ZSkgPzogJy0nOwogICAkcGFnYWxfYnJhbmRbJGJdID0gKCRwYWdhbF9icmFuZFskYl0gPz8gMCkrMTsKICAgJHBhZ2FsX2dhbVskZ2FtXSA9ICgkcGFnYWxfZ2FtWyRnYW1dID8/IDApKzE7CiAgICRlaWxbXSA9IFsnaWQnPT4kcGlkLCduJz0+Z2V0X3RoZV90aXRsZSgkcGlkKSwnYnJhbmQnPT4kYiwnZ2FtJz0+JGdhbV07CiB9CiBhcnNvcnQoJHBhZ2FsX2JyYW5kKTsgYXJzb3J0KCRwYWdhbF9nYW0pOwogJG9bJ3BhZ2FsX2JyYW5kJ109JHBhZ2FsX2JyYW5kOwogJG9bJ3BhZ2FsX2dhbWludG9qYSddPSRwYWdhbF9nYW07CgogLy8gSm9zaURvZyAvIEpvc2VyYSBwanV2aXMgKyBzdWRldGlzCiAkaXRhcnQ9W107CiBmb3JlYWNoKCRlaWwgYXMgJHIpewogICBpZihwcmVnX21hdGNoKCcvam9zaXxqb3NlcmEvaScsICRyWyduJ10uJyAnLiRyWydicmFuZCddLicgJy4kclsnZ2FtJ10pKXsKICAgICAkYyA9IGdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLCAkclsnaWQnXSk7CiAgICAgJHBvcyA9IG1iX3N0cmlwb3MoJGMsJ1N1ZMSXdGlzJyk7CiAgICAgJHJbJ3N1ZGV0aXMnXSA9ICRwb3MhPT1mYWxzZSA/IG1iX3N1YnN0cihzdHJpcF90YWdzKCRjKSwkcG9zLDI2MCkgOiBtYl9zdWJzdHIoc3RyaXBfdGFncygkYyksMCwyMDApOwogICAgICRpdGFydFtdPSRyOwogICB9CiB9CiAkb1snam9zaV9qb3NlcmEnXSA9IGFycmF5X3NsaWNlKCRpdGFydCwwLDQwKTsKICRvWydqb3NpX2pvc2VyYV9raWVraXMnXSA9IGNvdW50KCRpdGFydCk7CiAkb1sndmlzb3NfMjE5J10gPSAkZWlsOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='MONOAUD1'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Mono Audit v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(8000);
  const r=await fx(WP+'/?ps_mono10=GO',{headers:{'Cache-Control':'no-cache'}},'db');
  const t=await r.text(); try{ out.db=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,1500); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/mono_audit.json', Buffer.from(JSON.stringify(out,null,1)), VER);
