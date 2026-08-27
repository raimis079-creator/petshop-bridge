process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEU1IHJlY29uCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19yYzInXSkgfHwgJF9HRVRbJ3BzX3JjMiddIT09J0dPJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwogZm9yZWFjaChhcnJheSgncHNfYWtjaWpvcycsJ3BzX2FrY2lqdV9wcmVrZXMnLCdwc19mYWt0X2F0c2FyZ29zX2QnLCdwc190aWVraW1hcycsJ3BzX3RpZWtpbWFzX2VpbCcsJ3BzX3BhcnRpam9zJywncHNfc291cmNlcycpIGFzICR0KXsgJGY9JHAuJHQ7ICRvWyR0XT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJGYnIik9PT0kZiA/ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSBgJGZgIikgOiAnTkVSQSc7IH0KICRvWydha2NfYnVzZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGJ1c2VuYSxDT1VOVCgqKSBuIEZST00geyRwfXBzX2FrY2lqb3MgR1JPVVAgQlkgYnVzZW5hIixBUlJBWV9BKTsKICRvWydha2NfcHZ6J109JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRwfXBzX2FrY2lqb3MgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICRvWydha2NwX3B2eiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskcH1wc19ha2NpanVfcHJla2VzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAkb1snYXRzX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfZmFrdF9hdHNhcmdvc19kIE9SREVSIEJZIGRhdGEgREVTQywgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICRvWydhdHNfZGllbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGF0YSxDT1VOVCgqKSBuLFNVTSh2ZXJ0ZV9jdCkgdixTVU0oc3RvY2tvdXQpIHNvIEZST00geyRwfXBzX2Zha3RfYXRzYXJnb3NfZCBHUk9VUCBCWSBkYXRhIE9SREVSIEJZIGRhdGEgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICRvWydzb3VyY2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19zb3VyY2VzIExJTUlUIDEwIixBUlJBWV9BKTsKICRvWyd0aWVrX2xlYWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxMRUZUKG9wdGlvbl92YWx1ZSwyMDApIHYgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVsZWFkJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfdGllayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2FiYyUnIixBUlJBWV9BKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskcH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='RC2';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  /* 1. isjungiam senus TEMP */
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  /* 2. kuriam recon snippeta */
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E5 recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_rc2=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/rc2.json', Buffer.from(JSON.stringify(out,null,1)), VER);
