process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFNwYWx2dSBBdWRpdGFzIHYxLjAgKCsgc2tlbGJpbWFzIGlyIEViaSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX3NwJ10gPz8gJycpICE9PSAnU1AxJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89Wyd2Jz0+J1NQMSddOwoKIC8qIDEpIFBhc2tlbGJ0aSBza3JhbmR6aXVzIDUwMCBnICovCiAkcD1nZXRfcG9zdCgxODYzNik7CiAkb1snc2tyYW5kemlhaSddPVsnaWQnPT4xODYzNiwnYnV2byc9PiRwPyRwLT5wb3N0X3N0YXR1czpudWxsLCdwYXYnPT4kcD8kcC0+cG9zdF90aXRsZTpudWxsXTsKIGlmKCRwICYmICRwLT5wb3N0X3N0YXR1cz09PSdkcmFmdCcpewogICB3cF91cGRhdGVfcG9zdChbJ0lEJz0+MTg2MzYsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnXSk7CiAgIGNsZWFuX3Bvc3RfY2FjaGUoMTg2MzYpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKDE4NjM2KTsKICAgJG9bJ3NrcmFuZHppYWknXVsndGFwbyddPWdldF9wb3N0X3N0YXR1cygxODYzNik7CiAgICRvWydza3JhbmR6aWFpJ11bJ2xpa3V0aXMnXT1nZXRfcG9zdF9tZXRhKDE4NjM2LCdfc3RvY2snLHRydWUpOwogICAkb1snc2tyYW5kemlhaSddWydzdG9ja19zdGF0dXMnXT1nZXRfcG9zdF9tZXRhKDE4NjM2LCdfc3RvY2tfc3RhdHVzJyx0cnVlKTsKICAgJG9bJ3NrcmFuZHppYWknXVsna2FpbmEnXT1nZXRfcG9zdF9tZXRhKDE4NjM2LCdfcHJpY2UnLHRydWUpOwogfSBlbHNlICRvWydza3JhbmR6aWFpJ11bJ3RhcG8nXT0nbmVrZWlzdGEnOwoKIC8qIDIpIEViaSBrYW11b2xpdWthaSAqLwogJHQ9Z2V0X3Rlcm1fYnkoJ25hbWUnLCdFYmknLCdwcm9kdWN0X2JyYW5kJyk7CiAkb1snZWJpJ109W107CiBmb3JlYWNoKFsxNTMwMCwxNTMwM10gYXMgJHBpZCl7CiAgICRlPVsnaWQnPT4kcGlkLCdidXZvJz0+d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKV07CiAgIGlmKCR0KXsgd3Bfc2V0X29iamVjdF90ZXJtcygkcGlkLFsoaW50KSR0LT50ZXJtX2lkXSwncHJvZHVjdF9icmFuZCcsZmFsc2UpOwogICAgIGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7CiAgICAgJGVbJ3BvJ109d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsgfQogICAkb1snZWJpJ11bXT0kZTsKIH0KIGlmKCR0KXsgd3BfdXBkYXRlX3Rlcm1fY291bnRfbm93KFsoaW50KSR0LT50ZXJtX2lkXSwncHJvZHVjdF9icmFuZCcpOwogICAkb1snZWJpX2NvdW50J109KGludClnZXRfdGVybSgkdC0+dGVybV9pZCktPmNvdW50OyB9CgogLyogMykgVklTSSBwYV9zcGFsdmEgdGVybWluYWkgc3UgVklTQSB0ZXJtIG1ldGEgKi8KICR0ZXJtcz1nZXRfdGVybXMoWyd0YXhvbm9teSc9PidwYV9zcGFsdmEnLCdoaWRlX2VtcHR5Jz0+ZmFsc2VdKTsKICRvWydzcGFsdm9zJ109W107CiBpZighaXNfd3BfZXJyb3IoJHRlcm1zKSkgZm9yZWFjaCgkdGVybXMgYXMgJHR0KXsKICAgJG1ldGE9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgbWV0YV9rZXksIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnRlcm1tZXRhfSBXSEVSRSB0ZXJtX2lkPSVkIiwkdHQtPnRlcm1faWQpLCBBUlJBWV9BKTsKICAgJG1tPVtdOyBmb3JlYWNoKCRtZXRhIGFzICRyKSAkbW1bJHJbJ21ldGFfa2V5J11dPW1iX3N1YnN0cigoc3RyaW5nKSRyWydtZXRhX3ZhbHVlJ10sMCwxMjApOwogICAkb1snc3BhbHZvcyddW109WydpZCc9PiR0dC0+dGVybV9pZCwnbmFtZSc9PiR0dC0+bmFtZSwnc2x1Zyc9PiR0dC0+c2x1ZywKICAgICAgICAgICAgICAgICAgICAnY291bnQnPT4kdHQtPmNvdW50LCdtZXRhJz0+JG1tXTsKIH0KIC8qIDQpIGt1ciBzYXVnb21hIHN3YXRjaCBzcGFsdmEgLSB2aXNpIHRlcm1tZXRhIHJha3RhaSBzaWFpIHRha3Nvbm9taWphaSAqLwogJG9bJ21ldGFfcmFrdGFpJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAiU0VMRUNUIHRtLm1ldGFfa2V5LCBDT1VOVCgqKSBuIEZST00geyR3cGRiLT50ZXJtbWV0YX0gdG0KICAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10bS50ZXJtX2lkIEFORCB0dC50YXhvbm9teT0ncGFfc3BhbHZhJwogICAgR1JPVVAgQlkgdG0ubWV0YV9rZXkgT1JERVIgQlkgbiBERVNDIiwgQVJSQVlfQSk7CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='SPALVOS-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(7000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Spalvu Auditas v1.0 (+ skelbimas ir Ebi)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_sp=SP1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'sp');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1500); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/spalvos_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
