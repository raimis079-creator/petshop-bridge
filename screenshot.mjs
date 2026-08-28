process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEZCVCBSZWNvbjIKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2ZidHJlYzInXSkgfHwgJF9HRVRbJ3BzX2ZidHJlYzInXSE9PSdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nRkJUUkVDMicpOwogJGZpbGVzPWFycmF5KAogICdmYnQnPT5XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1mYnQvcGV0c2hvcC1mYnQucGhwJywKICAncnlzaWFpJz0+V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXNpYWkucGhwJywKICAnYXZzb3VyY2UnPT5XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF2LXNvdXJjZS5waHAnLAogKTsKIGZvcmVhY2goJGZpbGVzIGFzICRrPT4kZil7ICRjPUBmaWxlX2dldF9jb250ZW50cygkZik7ICRvWydsZW4nXVska109JGM9PT1mYWxzZT8tMTpzdHJsZW4oJGMpOyAkb1snYjY0J11bJGtdPSRjPT09ZmFsc2U/Jyc6YmFzZTY0X2VuY29kZSgkYyk7IH0KICRvcHRzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLG9wdGlvbl92YWx1ZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF9mYnQlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19yeXNpYWklJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwZXRzaG9wX3J5c2lhaSUnIixBUlJBWV9BKTsKIGZvcmVhY2goJG9wdHMgYXMgJHIpeyAkb1snb3B0cyddWyRyWydvcHRpb25fbmFtZSddXT1zdWJzdHIoJHJbJ29wdGlvbl92YWx1ZSddLDAsMjAwMCk7IH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='FBTREC2';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP FBT Recon2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  const r=await fx(WP+'/?ps_fbtrec2=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/fbtrec2.json', Buffer.from(JSON.stringify(out,null,1)), VER);
