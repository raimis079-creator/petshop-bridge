process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEs1IEthbXBhbmlqdSBMYW5nYXMgZW5xdWV1ZSBFMkUgdjEuMCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoKGlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnKSAhPT0gJ0s1JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG8gPSBhcnJheSgndic9PidLNS12MS4wJyk7CiAgZ2xvYmFsICR3cGRiOwogIHRyeSB7CiAgICAkSz0nUGV0c2hvcF9LYW1wYW5panVfTGFuZ2FzJzsKICAgIGlmICghY2xhc3NfZXhpc3RzKCRLKSkgeyAkb1snU1RPUCddPSdsYW5nYXMgbmV1enNpa3JvdmUnOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgJERBVEE9J2UyZScuZ21kYXRlKCdIaXMnKTsgJENUPSR3cGRiLT5wcmVmaXguJ3BzX2NvbnNlbnRfbG9nJzsKICAgICRBPSdwcy5rNS5hQGV4YW1wbGUuaW52YWxpZCc7ICRCPSdwcy5rNS5iQGV4YW1wbGUuaW52YWxpZCc7CgogICAgLyogQ29uc2VudF9Mb2cgbWV0b2RhaSAoaW5mb3JtYWNpamFpKSAqLwogICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfQ29uc2VudF9Mb2cnKTsgJG1tPWFycmF5KCk7CiAgICBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtZSl7IGlmKCRtZS0+Y2xhc3M9PT0nUGV0c2hvcF9Db25zZW50X0xvZycpICRtbVtdPSgkbWUtPmlzU3RhdGljKCk/J3N0YXRpYyAnOicnKS4kbWUtPmdldE5hbWUoKTsgfQogICAgJG9bJ2NvbnNlbnRfbG9nX21ldG9kYWknXT0kbW07CgogICAgJHU9d3BfdXBsb2FkX2RpcigpOyAka2F0PXRyYWlsaW5nc2xhc2hpdCgkdVsnYmFzZWRpciddKS4ncHMtaW1wb3J0JzsgaWYoIWlzX2Rpcigka2F0KSkgd3BfbWtkaXJfcCgka2F0KTsKICAgICRjc3Y9JGthdC4nL19lMmVfazUuY3N2JzsgZmlsZV9wdXRfY29udGVudHMoJGNzdiwiZW1haWxcbiRBXG4kQlxuIik7CgogICAgLyogc3V0aWtpbWFzIFRJSyBBIGFkcmVzdWkgKi8KICAgICRub3c9Y3VycmVudF90aW1lKCdteXNxbCcsMSk7CiAgICAkd3BkYi0+aW5zZXJ0KCRDVCwgYXJyYXkoJ2N1c3RvbWVyX2lkJz0+MCwnZW1haWwnPT4kQSwnZmllbGQnPT4nbWFya2V0aW5nX2NvbnNlbnQnLCdmcm9tX3ZhbHVlJz0+JycsJ3RvX3ZhbHVlJz0+J3RydWUnLCdzb3VyY2UnPT4nZTJlX3Rlc3QnLCdpcCc9PicnLCd1c2VyX2FnZW50Jz0+J2UyZScsJ2NoYW5nZWRfYXQnPT4kbm93KSk7CiAgICAkb1snY29uc2VudF9pbnNlcnRfaWQnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CiAgICAkb1snaGFzX2NvbnNlbnQnXT1hcnJheSgnQSc9PihpbnQpUGV0c2hvcF9Db250YWN0X1BvbGljeTo6aGFzX2NvbnNlbnQoJEEpLCdCJz0+KGludClQZXRzaG9wX0NvbnRhY3RfUG9saWN5OjpoYXNfY29uc2VudCgkQikpOwoKICAgICRvWydkcnknXT0kSzo6ZHJ5KCdmb3VuZGluZ19hY3RpdmF0aW9uJywnY3N2Ol9lMmVfazUuY3N2JywkREFUQSk7CiAgICAkb1snYmFuZ2EnXT0kSzo6YmFuZ2EoJ2ZvdW5kaW5nX2FjdGl2YXRpb24nLCdjc3Y6X2UyZV9rNS5jc3YnLDUsdHJ1ZSwwLCREQVRBKTsKICAgICRvWydiYW5nYV9rYXJ0b3RpbmUnXT0kSzo6YmFuZ2EoJ2ZvdW5kaW5nX2FjdGl2YXRpb24nLCdjc3Y6X2UyZV9rNS5jc3YnLDUsdHJ1ZSwwLCREQVRBKTsKICAgICRvWydidXNlbmEnXT0kSzo6YnVzZW5hKCdmb3VuZGluZ19hY3RpdmF0aW9uJywkREFUQSk7CgogICAgJFQ9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6dGFibGUoKTsKICAgICRvWydlaWx1dGUnXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGpvYl9rZXksZmxvdyxmbG93X2NsYXNzLHJlY2lwaWVudF9lbWFpbCxzdGF0dXMsc2NoZWR1bGVkX2F0IEZST00gYCRUYCBXSEVSRSBqb2Jfa2V5IExJS0UgJXMgTElNSVQgMSIsJ2thbXBfJy4kREFUQS4nXyUnKSxBUlJBWV9BKTsKCiAgICAvKiBWQUxZTUFTICovCiAgICAkb1snaXN0cmludGFfam9icyddPShpbnQpJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSBgJFRgIFdIRVJFIGpvYl9rZXkgTElLRSAlcyIsJ2thbXBfJy4kREFUQS4nXyUnKSk7CiAgICAkb1snaXN0cmludGFfY29uc2VudCddPShpbnQpJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSBgJENUYCBXSEVSRSBzb3VyY2U9JXMgQU5EIGVtYWlsPSVzIiwnZTJlX3Rlc3QnLCRBKSk7CiAgICBAdW5saW5rKCRjc3YpOwogICAgZGVsZXRlX29wdGlvbigncHNfa2FtcGFuaWphX3Bhc2t1dGluZV9iYW5nYV9mb3VuZGluZ19hY3RpdmF0aW9uJyk7CiAgICAkb1snbGlrb19qb2JzJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gYCRUYCBXSEVSRSBqb2Jfa2V5IExJS0UgJXMiLCdrYW1wXycuJERBVEEuJ18lJykpOwogICAgJG9bJ2xpa29fY29uc2VudCddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkQ1RgIFdIRVJFIHNvdXJjZT0lcyIsJ2UyZV90ZXN0JykpOwogICAgJG9bJ2Nzdl9saWtvJ109ZmlsZV9leGlzdHMoJGNzdik/J1RBSVAnOiduZSc7CiAgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='K5-134030';
const GKEY='ps_bis';
const PHASES=["K5"];
const OUT='analize/k5.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
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
