process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEwMiddKSA/ICRfR0VUWydwc19oMTAyJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTAyJyk7CiAkciA9ICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgSUQsIHBvc3RfdGl0bGUsIHBvc3RfZXhjZXJwdCBGUk9NIHskUH1wb3N0cwogICBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICBBTkQgcG9zdF9leGNlcnB0IExJS0UgJyUmbHQ7cCZndDslJyBPUkRFUiBCWSBJRCBMSU1JVCAxIiwgQVJSQVlfQSk7CiBpZigkcil7CiAgICRvWydpZCddID0gKGludCkkclsnSUQnXTsKICAgJG9bJ3VybCddID0gZ2V0X3Blcm1hbGluaygkclsnSUQnXSk7CiAgICRvWydleGNlcnB0X0RCJ10gPSBtYl9zdWJzdHIoJHJbJ3Bvc3RfZXhjZXJwdCddLDAsMTgwKTsKICAgJG9bJ3BvX2ZpbHRybyddID0gbWJfc3Vic3RyKGFwcGx5X2ZpbHRlcnMoJ3dvb2NvbW1lcmNlX3Nob3J0X2Rlc2NyaXB0aW9uJywgJHJbJ3Bvc3RfZXhjZXJwdCddKSwwLDIyMCk7CiB9CiAkb1sna2lla19zdV9sdF9wJ10gICA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfZXhjZXJwdCBMSUtFICclJmx0OyUnIik7CiAkb1sna2lla19zdV90aWtydV9wJ109IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfZXhjZXJwdCBMSUtFICclPHA+JSciKTsKICRvWydraWVrX2JlX2h0bWwnXSAgID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF9leGNlcnB0PD4nJyBBTkQgcG9zdF9leGNlcnB0IE5PVCBMSUtFICclPCUnIEFORCBwb3N0X2V4Y2VycHQgTk9UIExJS0UgJyUmbHQ7JSciKTsKICRvWydleGNlcnB0X3Zpc28nXSAgID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF9leGNlcnB0PD4nJyIpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H102'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H102 excerpt vaizdas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h102=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,500)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  if(out.D && out.D.url){
    const r=await fetch(out.D.url); const h=await r.text();
    const m=h.match(/<div[^>]*class="[^"]*product-short-description[^"]*"[^>]*>([\s\S]{0,500}?)<\/div>/i)
         || h.match(/<div[^>]*woocommerce-product-details__short-description[^>]*>([\s\S]{0,500}?)<\/div>/i);
    out.HTML_blokas = m ? m[1].replace(/\s+/g,' ').slice(0,330) : 'bloko nerasta';
    out.ar_matosi_zyme = /&lt;p&gt;|&amp;lt;/.test(h) ? 'TAIP — lankytojas mato zymas' : 'ne';
    out.http=r.status;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h102.json', Buffer.from(JSON.stringify(out,null,1)), 'h102 excerpt vaizdas');
