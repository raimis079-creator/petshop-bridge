process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI5IGtyZXBzZWxpbyB6eW1lcyByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2tyJ10pfHwkX0dFVFsncHNfa3InXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNTI5LVJFQycpOwogIHRyeXsKICAgIC8vIDEuIEt1ciBrYXRhbG9nbyBzbHVva3NuaXMgZGVkYSBwcmVudW1lcmF0b3MgenltZSBpIGtyZXBzZWxpCiAgICAkZmFpbGFpPWdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKTsKICAgIGZvcmVhY2goJGZhaWxhaSBhcyAkZmYpewogICAgICAkYz1maWxlX2dldF9jb250ZW50cygkZmYpOwogICAgICBpZihzdHJwb3MoJGMsJ2NhcnRfaXRlbV9kYXRhJykhPT1mYWxzZXx8c3RycG9zKCRjLCd3b29jb21tZXJjZV9hZGRfY2FydF9pdGVtJykhPT1mYWxzZSl7CiAgICAgICAgcHJlZ19tYXRjaF9hbGwoIi9bJ1wiXShfP3BzX1thLXpfXSpwcmVuW2Etel9dKnxwcmVuW2Etel9dKylbJ1wiXS8iLCRjLCRtKTsKICAgICAgICBpZihzdHJwb3MoYmFzZW5hbWUoJGZmKSwncHJlbicpIT09ZmFsc2V8fCRtWzFdKQogICAgICAgICAgJG9bJ2NhcnQnXVtiYXNlbmFtZSgkZmYpXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1bMV0pLDAsMTApOwogICAgICB9CiAgICAgIGlmKHN0cnBvcygkYywnd29vY29tbWVyY2VfY2hlY2tvdXQnKSE9PWZhbHNlJiZzdHJwb3MoYmFzZW5hbWUoJGZmKSwncHJlbicpIT09ZmFsc2UpCiAgICAgICAgJG9bJ2NoZWNrb3V0X2thYmxpYWknXVtiYXNlbmFtZSgkZmYpXT10cnVlOwogICAgfQogICAgLy8gMi4gcGV0c2hvcC1wcmVudW1lcmF0YS5waHA6IGthaXAgcGF6eW1pIHBpcm1hIHV6c2FreW1hIC8gY2FydCBpbnRlZ3JhY2lqYQogICAgJHBjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcHJlbnVtZXJhdGEucGhwJyk7CiAgICBwcmVnX21hdGNoX2FsbCgiL2FkZF8oPzphY3Rpb258ZmlsdGVyKVwoXHMqWydcIl0oW2Etel9cL10rKVsnXCJdLyIsJHBjLCRoKTsKICAgICRvWyd2YXJpa2xpb19rYWJsaWFpJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV91bmlxdWUoJGhbMV0pLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RycG9zKCR4LCdjYXJ0JykhPT1mYWxzZXx8c3RycG9zKCR4LCdjaGVja291dCcpIT09ZmFsc2V8fHN0cnBvcygkeCwnb3JkZXInKSE9PWZhbHNlfHxzdHJwb3MoJHgsJ3BheW1lbnQnKSE9PWZhbHNlfHxzdHJwb3MoJHgsJ3RoYW5reW91JykhPT1mYWxzZTt9KSk7CiAgICBwcmVnX21hdGNoX2FsbCgiL1snXCJdKF9wc19wcmVuW2Etel9dKilbJ1wiXS8iLCRwYywkbW0pOwogICAgJG9bJ3ZhcmlrbGlvX21ldGEnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtbVsxXSkpOwogICAgLy8gMy4gS2F0YWxvZ28gc2x1b2tzbmlzIChwcmVrZXMgcHVzbGFwaW8gUHJlbnVtZXJ1b3RpKSDigJQga3VyaXMgZmFpbGFzCiAgICBmb3JlYWNoKCRmYWlsYWkgYXMgJGZmKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGZmKTsKICAgICAgaWYoc3RycG9zKCRjLCdQcmVudW1lcnVvdGknKSE9PWZhbHNlfHxzdHJwb3MoJGMsJ3ByZW51bWVydW90aScpIT09ZmFsc2UpCiAgICAgICAgJG9bJ3ByZW51bWVydW90aV9mYWlsdW9zZSddW109YmFzZW5hbWUoJGZmKTsKICAgIH0KICAgIC8vIDQuIEFyIHlyYSB0YWlzeWtsaXUgcHVzbGFwaXMKICAgICRwZz1nZXRfcGFnZV9ieV9wYXRoKCdwcmVudW1lcmF0b3MtdGFpc3lrbGVzJyk7CiAgICAkb1sndGFpc3lrbGl1X3BzbCddPSRwZz9hcnJheSgnaWQnPT4kcGctPklELCdzdGF0dXMnPT4kcGctPnBvc3Rfc3RhdHVzKTonTkVSQSc7CiAgICAvLyA1LiBhcG1va2V0YSgpIOKAlCBrYSBkYXJvIChha3R5dmF2aW1vIGthYmx5cykKICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9QcmVudW1lcmF0YScsJ2FwbW9rZXRhJyk7CiAgICAkb1snYXBtb2tldGFfcGFyJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRwKXtyZXR1cm4gJHAtPmdldE5hbWUoKTt9LCRybS0+Z2V0UGFyYW1ldGVycygpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-195308';
const GKEY='ps_kr';
const PHASES=["GO"];
const OUT='analize/s1529_recon.json';
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
