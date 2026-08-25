process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2OSddKSB8fCAkX0dFVFsncHNfaDI2OSddIT09J1JVTjIwMjYwODI1QycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjlBJyk7IGdsb2JhbCAkd3BkYjsKIC8vIDEpIGthaXAgc2FyZ2FzIGltYSBrbGFpZGFzCiAkZj0nL2hvbWUvZ3l2dW5haTIvYmFja3Vwcy9wcy1iYWNrdXAtd2F0Y2gucGhwJzsKIGlmKGZpbGVfZXhpc3RzKCRmKSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJFRbJ3dhdGNoX2R5ZGlzJ109c3RybGVuKCRzKTsKICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkcykgYXMgJG49PiRsKXsgaWYocHJlZ19tYXRjaCgnL2Vycm9yX2xvZ3xkZWJ1Z1wubG9nfGxvZ3NcL3xnbG9iXCh8Zm9wZW58ZmlsZVwofGtsYWlkfGRlcHJlY2F0ZWR8ZmF0YWx8d2FybmluZ3xub3RpY2V8XCRMT0d8TE9HQVMvaScsJGwpKSAkVFsnd2F0Y2gnXVtdPSgkbisxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7IH0gfQogLy8gMikgNTE0IHR1cmlueXMg4oCUIGFyIHRpa3JhaSByZWFkLW9ubHkKICRyPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsbmFtZSxjb2RlLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPSVkIiw1MTQpKTsKICRUWydzNTE0J109YXJyYXkoJ2FjdGl2ZSc9PiRyLT5hY3RpdmUsJ2xlbic9PnN0cmxlbigkci0+Y29kZSksJ3Jhc3l0b2phaSc9PmFycmF5KCkpOwogZm9yZWFjaChleHBsb2RlKCJcbiIsJHItPmNvZGUpIGFzICRuPT4kbCl7IGlmKHByZWdfbWF0Y2goJy91cGRhdGVfcG9zdF9tZXRhfHdwX3VwZGF0ZV9wb3N0fC0+c2F2ZVwofFwkd3BkYi0+KHVwZGF0ZXxpbnNlcnR8ZGVsZXRlfHF1ZXJ5KXxmaWxlX3B1dHxkZWxldGVfcG9zdF9tZXRhfHdwX3NldF9vYmplY3RfdGVybXMvJywkbCkpICRUWydzNTE0J11bJ3Jhc3l0b2phaSddW109KCRuKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxMjApKTsgfQogJFRbJ3M1MTQnXVsncGlybW9zJ109aW1wbG9kZSgnIHwgJyxhcnJheV9tYXAoZm4oJHgpPT50cmltKG1iX3N1YnN0cigkeCwwLDgwKSksYXJyYXlfc2xpY2UoZXhwbG9kZSgiXG4iLCRyLT5jb2RlKSwwLDEyKSkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSw1KTsK'; const SHA='61db6827a123456d4d7cfe862fd451f87716b138';
const MD5={"petshop-rinkiniai.php": "5f79ff63ffe2e57cee87129b41e0ca32"};
const out={v:'H269A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H267 v1 (log+snippet recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h269=RUN20260825C',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  const de=await fetch(SNIP+'/514',{method:'POST',headers:A,body:JSON.stringify({id:514,active:false})}); out.s514_off=de.status;
  const chk=await fetch(SNIP+'/514',{headers:A}); const cj=JSON.parse(await chk.text()); out.s514_active_po=cj.active;
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h269run.json', Buffer.from(JSON.stringify(out,null,1)), 'H269A');
