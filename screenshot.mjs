process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI2IHByb2dub3plcyByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3JlYyddKT8kX0dFVFsncHNfcmVjJ106JycpOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNTI2LVJFQycpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIC8vIDEuIHBzX3N1YnNjcmlwdGlvbnMgc3RydWt0dXJvcwogICAgJG9bJ3N1Yl9zdHVscGVsaWFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMiKTsKICAgICRvWydpdGVtX3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9uX2l0ZW1zIik7CiAgICAkb1snc3RhdHVzYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHN0YXR1cyBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMiKTsKICAgIC8vIDIuIFZhcmlrbGlvIGtvbnN0YW50b3MvbWV0b2RhaQogICAgJHI9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9QcmVudW1lcmF0YScpOwogICAgJG9bJ2tvbnN0YW50b3MnXT0kci0+Z2V0Q29uc3RhbnRzKCk7CiAgICAkb1snbWV0b2RhaSddPWFycmF5X3ZhbHVlcyhhcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+Z2V0TmFtZSgpO30sJHItPmdldE1ldGhvZHMoUmVmbGVjdGlvbk1ldGhvZDo6SVNfU1RBVElDKSkpOwogICAgLy8gMy4gU2FyZ2FzIOKAlCBrYWlwIHJlZ2lzdHJ1b2phbWkgcGF0aWtyaW5pbWFpCiAgICAkc2Y9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1zYXJnYXMucGhwJzsKICAgICRzYz1maWxlX2dldF9jb250ZW50cygkc2YpOwogICAgcHJlZ19tYXRjaF9hbGwoJy9hcHBseV9maWx0ZXJzXChccypbXCciXShbYS16X10rKVtcJyJdLycsJHNjLCRtMSk7CiAgICBwcmVnX21hdGNoX2FsbCgnL2RvX2FjdGlvblwoXHMqW1wnIl0oW2Etel9dKylbXCciXS8nLCRzYywkbTIpOwogICAgcHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhbYS16X10rKVwoLycsJHNjLCRtMyk7CiAgICAkb1snc2FyZ2FzJ109YXJyYXkoJ2ZpbHRyYWknPT5hcnJheV91bmlxdWUoJG0xWzFdKSwnYWN0aW9uJz0+YXJyYXlfdW5pcXVlKCRtMlsxXSksJ2Z1bmtjaWpvcyc9PmFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbTNbMV0pLDAsMjUpLCdkeWRpcyc9PnN0cmxlbigkc2MpKTsKICAgIC8vIDQuIFJ5dGFzIOKAlCByYXBvcnRvIGVpbHVjaXUgcmVnaXN0cmFjaWphCiAgICAkcmY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXRhcy5waHAnOwogICAgaWYoZmlsZV9leGlzdHMoJHJmKSl7ICRyYz1maWxlX2dldF9jb250ZW50cygkcmYpOwogICAgICBwcmVnX21hdGNoX2FsbCgnL2FwcGx5X2ZpbHRlcnNcKFxzKltcJyJdKFthLXpfXSspW1wnIl0vJywkcmMsJG4xKTsKICAgICAgJG9bJ3J5dGFzJ109YXJyYXkoJ2ZpbHRyYWknPT5hcnJheV91bmlxdWUoJG4xWzFdKSwnZHlkaXMnPT5zdHJsZW4oJHJjKSk7CiAgICB9IGVsc2UgJG9bJ3J5dGFzJ109J05FUkEnOwogICAgLy8gNS4gTGlrdWNpdSBsYXVrYWkgcGFnYWwgc2FuZGVsaSDigJQgcGF2eXpkeXMgMzUwOTgKICAgIGZvcmVhY2goYXJyYXkoMzUwOTgpIGFzICRwaWQpewogICAgICAkb1sncHJla2VfJy4kcGlkXT1hcnJheSgKICAgICAgICAnc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksCiAgICAgICAgJ19zdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwKICAgICAgICAnX293bl9zdG9ja19xdHknPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwKICAgICAgICAnd2Nfc3RvY2snPT4oJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCkpPyRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTpudWxsLAogICAgICAgICdtYW5hZ2UnPT4kcD8kcC0+Z2V0X21hbmFnZV9zdG9jaygpOm51bGwpOwogICAgfQogICAgLy8gNi4gUGV0c2hvcCBsYW5nYWkgbWVudSBzbHVnIChrdXIga2FiaW50aSBzdWJtZW51KQogICAgJG9bJ2ZsYWcnXT1nZXRfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9panVuZ3RhJyk7CiAgICAkb1snYWt0eXZpdV9wbGFudSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMgV0hFUkUgc3RhdHVzPSdhY3RpdmUnIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-191236';
const GKEY='ps_rec';
const PHASES=["GO"];
const OUT='analize/s1526_recon.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
