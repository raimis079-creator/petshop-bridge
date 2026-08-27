process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFNFTyBtZWNoYW5pem1hcwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfc20nXSkgfHwgJF9HRVRbJ3BzX3NtJ10hPT0nR08nKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAkb1snc25pcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHByaW9yaXR5IEZST00geyRwfXNuaXBwZXRzIFdIRVJFIChjb2RlIExJS0UgJyUzMDElJyBPUiBjb2RlIExJS0UgJyV3cF9yZWRpcmVjdCUnIE9SIGNvZGUgTElLRSAnJXRlbXBsYXRlX3JlZGlyZWN0JScgT1IgbmFtZSBMSUtFICclZWRpcmVjdCUnIE9SIG5hbWUgTElLRSAnJVNFTyUnKSBBTkQgbmFtZSBOT1QgTElLRSAnVEVNUCUnIE9SREVSIEJZIGFjdGl2ZSBERVNDIixBUlJBWV9BKTsKICRvWydwbHVnaW5haSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnLGFycmF5KCkpLGZ1bmN0aW9uKCR4KXsgcmV0dXJuIHByZWdfbWF0Y2goJy9yZWRpcmVjdHxzZW98cmFuay9pJywkeCk7IH0pKTsKICRtdT1hcnJheSgpOyBmb3JlYWNoKHNjYW5kaXIoV1BNVV9QTFVHSU5fRElSKSBhcyAkZil7IGlmKHN1YnN0cigkZiwtNCk9PT0nLnBocCcgJiYgcHJlZ19tYXRjaCgnL3JlZGlyfHNlb3wzMDEvaScsJGYpKSAkbXVbXT0kZjsgfSAkb1snbXUnXT0kbXU7CiAkb1snZHJhZnRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9zdGF0dXMsQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgR1JPVVAgQlkgcG9zdF9zdGF0dXMiLEFSUkFZX0EpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRwfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const VER='SM';
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP SEO patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_sm=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/seo3.json', Buffer.from(JSON.stringify(out,null,1)), VER);
