process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZml4NSddKSB8fCAkX0dFVFsncHNfZml4NSddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidGSVg1Jyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHQ9JHdwZGItPnByZWZpeC4ncHNfdGlla2ltYXNfZWlsJzsKICRUWydpc3RyaW50YSddPSR3cGRiLT5kZWxldGUoJHQsIGFycmF5KCdvcmRlcl9pZCc9PjM1MDY2KSwgYXJyYXkoJyVkJykpOwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRsaWtvPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIG9yZGVyX2lkPTM1MDY2Iik7CiAkVFsnbGlrb19laWx1Y2l1J109JGxpa287CiBpZighJGxpa28peyAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX3RpZWtpbWFzX2xhdWtpYScpOyB9CiAkby0+YWRkX29yZGVyX25vdGUoJ1RpZWtpbW8gZWlsdXTElyAoUHJpbnMpIGnFoWltdGEg4oCUIHRlc3RpbsSXcyBixatrbMSXcyBhdHN0YXR5bWFzLicsIGZhbHNlLCB0cnVlKTsKICRvLT5zYXZlKCk7CiAkb289d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRyZT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnZWlsZScpOyAkcmUtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcnY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ3Z5a2R5bWFzJyk7ICRydi0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRUWydwbyddPWFycmF5KCdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCwkb28pLCd2eWtkeW1hcyc9PiRydi0+aW52b2tlKG51bGwsJG9vKSwKICAgJ2xhdWtpYV9tZXRhJz0+JG9vLT5nZXRfbWV0YSgnX3BzX3RpZWtpbWFzX2xhdWtpYScpKTsKICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldHJhbnNpZW50JXBzX3J5dGFzJSciKTsKICRUWydwYXJ0aWpvc19laWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQiLEFSUkFZX0EpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'FIX5'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v14 (35066 atstatymas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_fix5=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/fix5.json', Buffer.from(JSON.stringify(out,null,1)), 'FIX5');
