process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFZhcmlhY2lqdSBQYXRpa3JhIHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX3BhdCddID8/ICcnKSAhPT0gJ1BBVDEnICkgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkaWRzPWpzb25fZGVjb2RlKGJhc2U2NF9kZWNvZGUoJ1d6RTBPVFkzTENBeE5EazNNQ3dnTVRRNU56a3NJREUwT1RnM0xDQXhOVEEwTWl3Z01UVXhOVGdzSURFMU1UWXhMQ0F4TlRFMk5Td2dNVFV6TURBc0lERTFNekF6TENBeE5UTTFOeXdnTVRVek5qY3NJREUxTkRFeUxDQXhOVFF5TlN3Z01UVTBPRFFzSURFMU5UUXpMQ0F4TlRVNE1pd2dNVFU1T1RBc0lERTFPVGt6TENBeE5qQXpOaXdnTVRZd016a3NJREUyTVRnNUxDQXhOek13TlN3Z01UYzVNVElzSURFNE56STFMQ0F4T0Rjek1Dd2dNVGt5TkRrc0lERTVNalV6TENBeE9USTJNaXdnTVRreU5qVXNJREU1TWpZNFhRPT0nKSx0cnVlKTsKICRvPVsndic9PidQQVQxJywnZWlsJz0+W10sJ2JsJz0+W11dOwogZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAkdGlwYXM9d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X3R5cGUnLFsnZmllbGRzJz0+J3NsdWdzJ10pOwogICAkdnM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCBwb3N0X3BhcmVudD0lZCBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIiwkcGlkKSk7CiAgICR0ZXY9d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwYV9zcGFsdmEnLFsnZmllbGRzJz0+J3NsdWdzJ10pOwogICAkcmVnPWdldF9wb3N0X21ldGEoJHBpZCwnX3Byb2R1Y3RfYXR0cmlidXRlcycsdHJ1ZSk7CiAgICRibG9naT0wOyAkYmVrYWlub3M9MDsgJHNsdWdhaT1bXTsKICAgZm9yZWFjaCgkdnMgYXMgJHZpZCl7CiAgICAgJHM9Z2V0X3Bvc3RfbWV0YSgkdmlkLCdhdHRyaWJ1dGVfcGFfc3BhbHZhJyx0cnVlKTsgJHNsdWdhaVtdPSRzOwogICAgIGlmKCEkcyB8fCAhaW5fYXJyYXkoJHMsKGFycmF5KSR0ZXYsdHJ1ZSkpICRibG9naSsrOwogICAgIGlmKGdldF9wb3N0X21ldGEoJHZpZCwnX3JlZ3VsYXJfcHJpY2UnLHRydWUpPT09JycpICRiZWthaW5vcysrOwogICB9CiAgICRlPVsncGlkJz0+JHBpZCwndGlwYXMnPT4kdGlwYXM/JHRpcGFzWzBdOic/JywndmFyaWFjaWp1Jz0+Y291bnQoJHZzKSwKICAgICAgICd0ZXZvX3Rlcm1pbnUnPT5jb3VudCgoYXJyYXkpJHRldiksJ2Jsb2dpX3NsdWdhaSc9PiRibG9naSwnYmVfa2Fpbm9zJz0+JGJla2Fpbm9zLAogICAgICAgJ2lzX3ZhcmlhdGlvbic9Pihpc19hcnJheSgkcmVnKSYmaXNzZXQoJHJlZ1sncGFfc3BhbHZhJ10pKT8oaW50KSRyZWdbJ3BhX3NwYWx2YSddWydpc192YXJpYXRpb24nXTpudWxsLAogICAgICAgJ3Rldm9fbWFuYWdlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfbWFuYWdlX3N0b2NrJyx0cnVlKSwKICAgICAgICd0ZXZvX3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpLAogICAgICAgJ3ByaWNlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLHRydWUpXTsKICAgaWYoJGVbJ3RpcGFzJ10hPT0ndmFyaWFibGUnfHwkZVsndmFyaWFjaWp1J109PT0wfHwkYmxvZ2l8fCRiZWthaW5vc3x8JGVbJ2lzX3ZhcmlhdGlvbiddIT09MSkgJG9bJ2JsJ11bXT0kZTsKICAgJG9bJ2VpbCddW109JGU7CiB9CiAkb1snc3VtYSddPVsncHJla2l1Jz0+Y291bnQoJG9bJ2VpbCddKSwKICAgJ3ZhcmlhYmxlJz0+Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd0aXBhcyddPT09J3ZhcmlhYmxlJzt9KSksCiAgICd2YXJpYWNpanUnPT5hcnJheV9zdW0oYXJyYXlfY29sdW1uKCRvWydlaWwnXSwndmFyaWFjaWp1JykpLAogICAnYmxvZ3Vfc2x1Z3UnPT5hcnJheV9zdW0oYXJyYXlfY29sdW1uKCRvWydlaWwnXSwnYmxvZ2lfc2x1Z2FpJykpLAogICAnYmVfa2Fpbm9zJz0+YXJyYXlfc3VtKGFycmF5X2NvbHVtbigkb1snZWlsJ10sJ2JlX2thaW5vcycpKSwKICAgJ3Byb2JsZW1pc2tvcyc9PmNvdW50KCRvWydibCddKV07CiAvLyBuYXVqaSB0ZXJtaW5haQogZm9yZWFjaChbJ09yYW7FvmluxJcnLCdSb8W+aW7ElycsJ0p1b2RhJywnR2VsdG9uYSddIGFzICRuKXsKICAgJHQ9Z2V0X3Rlcm1fYnkoJ25hbWUnLCRuLCdwYV9zcGFsdmEnKTsKICAgJG9bJ25hdWppX3Rlcm1pbmFpJ11bXT0kdD9bJ25hbWUnPT4kdC0+bmFtZSwnc2x1Zyc9PiR0LT5zbHVnLCdjb3VudCc9PiR0LT5jb3VudCwKICAgICAgICdoZXgnPT5nZXRfdGVybV9tZXRhKCR0LT50ZXJtX2lkLCdwcm9kdWN0X2F0dHJpYnV0ZV9jb2xvcicsdHJ1ZSldOlsnbmFtZSc9PiRuLCdORVJBJz0+MV07CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg=='; const VER='PAT-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Variaciju Patikra v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_pat=PAT1',{headers:UA},'pat'); const dt=await d.text();
  let J=null; try{ J=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1200); }
  if(J){ out.suma=J.suma; out.nauji_terminai=J.nauji_terminai; out.problemiskos=J.bl;
         await put('analize/varkur_patikra.json', Buffer.from(JSON.stringify(J,null,1)), VER); }
  // frontend: ar prekes puslapis rodo spalvu pasirinkima
  const p1=J&&J.eil&&J.eil[0]?J.eil[0].pid:0;
  if(p1){ const h=await fx(WP+'/?p='+p1,{headers:UA},'fe'); const t=await h.text();
    out.frontend={pid:p1,http:h.status,baitu:t.length,
      turi_spalva:/attribute_pa_spalva|pa_spalva/.test(t),
      fatal:/Fatal error|Parse error/.test(t)}; }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/patikra_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
