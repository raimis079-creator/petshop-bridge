process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBob29rIGRpYWdub3N0aWthICovCmFkZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX2JlZm9yZV9hZGRfdG9fY2FydF9idXR0b24nLCBmdW5jdGlvbigpewogIGdsb2JhbCAkcHJvZHVjdDsKICAkcGlkPSgkcHJvZHVjdCBpbnN0YW5jZW9mIFdDX1Byb2R1Y3QpPyRwcm9kdWN0LT5nZXRfaWQoKTpnZXRfdGhlX0lEKCk7CiAgZWNobyAnPCEtLVBTRElBRzpiYXRjYjpwaWQ9Jy4kcGlkLic6Z2FsaW1hPScuKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXMnKSYmUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OmdhbGltYSgkcGlkKT8nVCc6J04nKS4nOm9wdD0nLmNvdW50KChhcnJheSlnZXRfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9za3UnLGFycmF5KCkpKS4nLS0+JzsKfSw1KTsKYWRkX2FjdGlvbignd29vY29tbWVyY2VfYmVmb3JlX2FkZF90b19jYXJ0X2Zvcm0nLCBmdW5jdGlvbigpeyBlY2hvICc8IS0tUFNESUFHOmJhdGNmLS0+JzsgfSw1KTsKYWRkX2FjdGlvbignd29vY29tbWVyY2Vfc2luZ2xlX3Byb2R1Y3Rfc3VtbWFyeScsIGZ1bmN0aW9uKCl7IGVjaG8gJzwhLS1QU0RJQUc6c3BzLS0+JzsgfSwzNSk7CmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZjE5J10pPyRfR0VUWydwc19mMTknXTonJykhPT0nVEcnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidGMTlERy0xLjAnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkc2VuYT1nZXRfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9za3UnLG51bGwpOwogICAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwciBPTiBwci5wb3N0X2lkPXAuSUQgQU5EIHByLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBwci5tZXRhX3ZhbHVlPjAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBwLklEIERFU0MgTElNSVQgMSIpOwogICAgdXBkYXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfc2t1JyxhcnJheSgkcGlkKSxmYWxzZSk7CiAgICAkb1sncGlkJ109JHBpZDsKICAgICRvWydrYXRhbG9nb192ZXJzaWphJ109UGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OlZFUlNJSkE7CiAgICAkb1snaG9va191enNpcmVnaXN0cmF2ZXMnXT1oYXNfYWN0aW9uKCd3b29jb21tZXJjZV9iZWZvcmVfYWRkX3RvX2NhcnRfYnV0dG9uJyxhcnJheSgnUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXMnLCdwYXNpcmlua2ltYXMnKSk7CiAgICAkZz13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzbmMnLHRpbWUoKSxnZXRfcGVybWFsaW5rKCRwaWQpKSxhcnJheSgndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSkpOwogICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOwogICAgJG9bJ21hcmtlcmlhaSddPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KCdiYXRjYicsJ2JhdGNmJywnc3BzJykgYXMgJG0pICRvWydtYXJrZXJpYWknXVskbV09cHJlZ19tYXRjaCgnL1BTRElBRzonLiRtLidbXi1dKi8nLCRoLCRtbSk/KGlzc2V0KCRtbVswXSk/JG1tWzBdOidUJyk6J05FU0FVTkEnOwogICAgJG9bJ3Bhc2lyaW5raW1hcyddPXN0cnBvcygkaCwncHNfcHJlbl9pbnRlcnZhbGFzJykhPT1mYWxzZT8nVCc6J04nOwogICAgJG9bJ2lsZ2lzJ109c3RybGVuKCRoKTsKICAgIGlmKCRzZW5hPT09bnVsbCkgZGVsZXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfc2t1Jyk7IGVsc2UgdXBkYXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfc2t1Jywkc2VuYSxmYWxzZSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='f19_diag-092058';
const GKEY='ps_f19';
const PHASES=["TG"];
const OUT='analize/f19_diag.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
