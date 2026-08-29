process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIENyb24gQWxpYXJtdSBSZWNvbiB2Mi4wIChyeXRhcytpbXBvcnRhczcpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19jciddKT8kX0dFVFsncHNfY3InXTonJykgIT09ICdSRUNPTjInKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidDUk9OLVIyJywnbGFpa2FzJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLicgVVRDJyk7CiAgJHA9JHdwZGItPnByZWZpeDsKCiAgLy8gMS4gcnl0YXMucGhwIHNhbHRpbmlzCiAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXRhcy5waHAnOwogICRvWydyeXRhc195cmEnXT1maWxlX2V4aXN0cygkZik7CiAgaWYoJG9bJ3J5dGFzX3lyYSddKXsgJHNyYz1maWxlX2dldF9jb250ZW50cygkZik7ICRvWydyeXRhc19keWRpcyddPXN0cmxlbigkc3JjKTsgJG9bJ3J5dGFzX2I2NCddPWJhc2U2NF9lbmNvZGUoJHNyYyk7IH0KCiAgLy8gMi4gV1AgQWxsIEltcG9ydAogICR0PSRwLidwbXhpX2ltcG9ydHMnOwogIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdCciKT09PSR0KXsKICAgICRvWydpbXBvcnRhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUscmVnaXN0ZXJlZF9vbixleGVjdXRpbmcsdHJpZ2dlcmVkLHByb2Nlc3NpbmcsaW1wb3J0ZWQsY3JlYXRlZCx1cGRhdGVkLHNraXBwZWQsZGVsZXRlZCxjYW5jZWxlZCxmYWlsZWQscGF0aCBGUk9NIGAkdGAgT1JERVIgQlkgaWQiLCBBUlJBWV9BKTsKICB9CiAgJHRoPSRwLidwbXhpX2hpc3RvcnknOwogIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdGgnIik9PT0kdGgpewogICAgJG9bJ2lzdG9yaWphJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaW1wb3J0X2lkLGRhdGUsc3VtbWFyeSBGUk9NIGAkdGhgIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMjAiLCBBUlJBWV9BKTsKICB9CgogIC8vIDMuIHBzX3NoaXBtZW50cwogICRzPSRwLidwc19zaGlwbWVudHMnOwogICRvWydzaF9zdHVscGVsaWFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkc2AiKTsKICAkb1snc2hfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkc2AiKTsKICAkb1snc2hfcGFnYWxfc3RhdHVzYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgayBGUk9NIGAkc2AgR1JPVVAgQlkgc3RhdHVzIiwgQVJSQVlfQSk7CiAgJG9bJ3NoX3Bhc2t1dGluZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gYCRzYCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLCBBUlJBWV9BKTsKCiAgLy8gNC4gZXZlbnRfbG9nIHBhZ2FsIHZhcmRhCiAgJGU9JHAuJ3BzX2V2ZW50X2xvZyc7CiAgJG9bJ2V2X3BhZ2FsX3ZhcmRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZXZlbnRfbmFtZSwgQ09VTlQoKikgaywgTUFYKGVtaXR0ZWRfYXQpIHBhc2sgRlJPTSBgJGVgIEdST1VQIEJZIGV2ZW50X25hbWUgT1JERVIgQlkgcGFzayBERVNDIiwgQVJSQVlfQSk7CiAgJG9bJ2V2X3BhZ2FsX3N0YXR1c2EnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIENPVU5UKCopIGsgRlJPTSBgJGVgIEdST1VQIEJZIHN0YXR1cyIsIEFSUkFZX0EpOwoKICAvLyA1LiBzYXJnbyBidWtsZQogICRvWydyeXRhc19zYXJnYXNfcGFzayddPWdldF9vcHRpb24oJ3BzX3J5dGFzX3Nhcmdhc19wYXNrJyk7CiAgJG9bJ3J5dGFzX3JpYm9zJ109Z2V0X29wdGlvbigncHNfcnl0YXNfcmlib3MnKTsKICAkb1snc2FyZ2FzX3Bhc3RhcyddPWdldF9vcHRpb24oJ3BzX3Nhcmdhc19wYXN0YXMnKTsKCiAgLy8gNi4gVkYgZmV0Y2hlciBmYWlsYXMKICAkdmY9V1BfQ09OVEVOVF9ESVIuJy9wZXRzaG9wLXhtbC12Zi1mZXRjaGVyLnBocCc7CiAgaWYoZmlsZV9leGlzdHMoJHZmKSl7ICRvWyd2Zl9mZXRjaGVyX2I2NCddPWJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJHZmKSk7IH0KICAkdXA9d3BfdXBsb2FkX2RpcigpOwogIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtdmYtY2FjaGUueG1sJykgYXMgJHgpeyAkcHRoPSR1cFsnYmFzZWRpciddLicvJy4keDsKICAgIGlmKGZpbGVfZXhpc3RzKCRwdGgpKSAkb1sndmZfY2FjaGUnXT1hcnJheSgnbXRpbWUnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJyxmaWxlbXRpbWUoJHB0aCkpLCdrYic9PnJvdW5kKGZpbGVzaXplKCRwdGgpLzEwMjQpKTsgfQoKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDk5KTsK'; const VER='CRONREC-v2.0'; const out={v:VER};
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Cron Aliarmu Recon v2.0 (rytas)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; out.snip_id=sid;
  await miegok(9000);
  const d=await fx(WP+'/?ps_cr=RECON2',{headers:UA},'recon2');
  const txt=await d.text(); out.http=d.status;
  try{ out.rez=JSON.parse(txt); }catch(e){ out.zalias=txt.slice(0,3000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/cron_recon2.json', Buffer.from(JSON.stringify(out)), VER);
console.log('ok');
