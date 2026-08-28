process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEZCVCBSZWNvbjMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2ZidHJlYzMnXSkgfHwgJF9HRVRbJ3BzX2ZidHJlYzMnXSE9PSdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nRkJUUkVDMycpOwogJGNhdHM9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogZm9yZWFjaCgkY2F0cyBhcyAkdCl7IGlmKHByZWdfbWF0Y2goJy9za2FuZXN0fHphaXNsfMW+YWlzbHxoaWdpZW58cGFwaWxkfGtyYWlrfG1haXN0L2l1JywkdC0+c2x1Zy4nICcuJHQtPm5hbWUpKSAkb1snY2F0cyddW109YXJyYXkoJHQtPnNsdWcsJHQtPm5hbWUsKGludCkkdC0+Y291bnQsKGludCkkdC0+cGFyZW50KTsgfQogZm9yZWFjaChhcnJheSgncGFfYmFsdHltdV9zYWx0aW5pcycsJ3BhX21vbm9wcm90ZWluJywncGFfc3BlY2lhbGlfbWl0eWJhJywncGFfYmVfZ3J1ZHUnKSBhcyAkdHgpewogICR0cz1nZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+JHR4LCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKICBpZihpc193cF9lcnJvcigkdHMpKXsgJG9bJ3RheCddWyR0eF09J0VSUic7IGNvbnRpbnVlOyB9CiAgZm9yZWFjaCgkdHMgYXMgJHQpICRvWyd0YXgnXVskdHhdW109YXJyYXkoJHQtPnNsdWcsKGludCkkdC0+Y291bnQpOwogfQogJHR4cz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHRheG9ub215IEZST00geyR3cGRiLT50ZXJtX3RheG9ub215fSBXSEVSRSB0YXhvbm9teSBMSUtFICdwYV8lJyIpOwogJG9bJ3Zpc29zX3BhJ109JHR4czsKICR6b25lcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpbnN0YW5jZV9pZCxtZXRob2RfaWQgRlJPTSB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV9zaGlwcGluZ196b25lX21ldGhvZHMgV0hFUkUgaXNfZW5hYmxlZD0xIixBUlJBWV9BKTsKIGZvcmVhY2goJHpvbmVzIGFzICR6KXsgaWYoJHpbJ21ldGhvZF9pZCddPT09J2ZyZWVfc2hpcHBpbmcnKXsgJHM9Z2V0X29wdGlvbignd29vY29tbWVyY2VfZnJlZV9zaGlwcGluZ18nLiR6WydpbnN0YW5jZV9pZCddLidfc2V0dGluZ3MnKTsgJG9bJ2ZyZWVfc2hpcCddWyR6WydpbnN0YW5jZV9pZCddXT0kczsgfSB9CiAkb1snZmJ0X3ByZWNoZWNrX2hpcG8nXT1hcnJheSgpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const VER='FBTREC3';
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP FBT Recon3',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  const r=await fx(WP+'/?ps_fbtrec3=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/fbtrec3.json', Buffer.from(JSON.stringify(out,null,1)), VER);
