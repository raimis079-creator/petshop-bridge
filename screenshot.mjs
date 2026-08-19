process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA5NiddKSA/ICRfR0VUWydwc19oMDk2J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMDk2Jyk7CiAkdXAgPSB3cF91cGxvYWRfZGlyKCk7ICRiZCA9IHRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSk7CgogLyogMS4ga3VyIGd5dmVuYSBmZWVkIGZhaWxhaSAqLwogJHJhc3RhID0gYXJyYXkoKTsKIGZvcmVhY2goYXJyYXkoJGJkLCAkYmQuJ3BldHNob3AtZmVlZHMvJywgJGJkLidmZWVkcy8nLCBBQlNQQVRIKSBhcyAkayl7CiAgIGlmKCFpc19kaXIoJGspKSBjb250aW51ZTsKICAgZm9yZWFjaChnbG9iKCRrLicqLnhtbCcpIGFzICRmKSAkcmFzdGFbXSA9IGFycmF5KCdrZWxpYXMnPT5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmKSwgJ0tCJz0+cm91bmQoZmlsZXNpemUoJGYpLzEwMjQpLCAnZGF0YSc9PmRhdGUoJ1ktbS1kIEg6aScsIGZpbGVtdGltZSgkZikpKTsKIH0KICRvWyd4bWxfZmFpbGFpJ10gPSAkcmFzdGE7CgogLyogMi4gZmVlZCBudXN0YXR5bWFpICovCiBmb3JlYWNoKGFycmF5KCdwZXRzaG9wX2ZlZWRzX3NldHRpbmdzJywncGV0c2hvcF9mZWVkc19vcHRpb25zJywncHNfZmVlZHNfc2V0dGluZ3MnKSBhcyAkayl7CiAgICR2ID0gZ2V0X29wdGlvbigkayk7IGlmKCR2ICE9PSBmYWxzZSkgJG9bJ251c3RhdHltYWknXVska10gPSBpc19hcnJheSgkdikgPyBhcnJheV9rZXlzKCR2KSA6IHN1YnN0cigoc3RyaW5nKSR2LDAsMjAwKTsKIH0KCiAvKiAzLiBHUkVQQVM6IGFyIGZlZWQnZSB5cmEgZHZpZ3VibyBrb2RhdmltbyAqLwogZm9yZWFjaCgkcmFzdGEgYXMgJHIpewogICAkZiA9IEFCU1BBVEguJHJbJ2tlbGlhcyddOwogICAkdCA9IEBmaWxlX2dldF9jb250ZW50cygkZiwgZmFsc2UsIG51bGwsIDAsIDMwMDAwMDApOwogICBpZigkdCA9PT0gZmFsc2UpIGNvbnRpbnVlOwogICAkb1snZ3JlcGFzJ11bJHJbJ2tlbGlhcyddXSA9IGFycmF5KAogICAgICdhbXBfYW1wJyAgICA9PiBzdWJzdHJfY291bnQoJHQsICcmYW1wO2FtcDsnKSwKICAgICAnY2RhdGFfYW1wJyAgPT4gcHJlZ19tYXRjaF9hbGwoJy88IVxbQ0RBVEFcW1teXF1dKiZhbXA7W15cXV0qXF1cXT4vJywgJHQpLAogICAgICdhbXBfdmlzbycgICA9PiBzdWJzdHJfY291bnQoJHQsICcmYW1wOycpLAogICAgICdpcmFzdScgICAgICA9PiBzdWJzdHJfY291bnQoJHQsICc8aXRlbScpICsgc3Vic3RyX2NvdW50KCR0LCAnPG9mZmVyJykgKyBzdWJzdHJfY291bnQoJHQsICc8cHJvZHVjdCcpLAogICApOwogICBpZihwcmVnX21hdGNoKCcvW148XSooRkFSTUlOQXxSZWFsIERvZylbXjxdKi91JywgJHQsICRtKSkgJG9bJ3Bhdnl6ZHlzJ11bJHJbJ2tlbGlhcyddXSA9IHN1YnN0cigkbVswXSwwLDE2MCk7CiB9CgogLyogNC4ga2FpcCBhdHJvZG8gcGF0cyBwYXZhZGluaW1hcyBpcyBEQiAqLwogJHBpZCA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3RpdGxlIExJS0UgJyUmYW1wOyUnIExJTUlUIDEiKTsKIGlmKCRwaWQpewogICAkcmF3ID0gJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X3RpdGxlIEZST00geyRQfXBvc3RzIFdIRVJFIElEPSVkIiwgJHBpZCkpOwogICAkb1sncGF2eXpkaW5lX3ByZWtlJ10gPSBhcnJheSgKICAgICAnaWQnID0+ICRwaWQsCiAgICAgJ0RCX3JhdycgICAgICAgICAgPT4gJHJhdywKICAgICAnZ2V0X3RoZV90aXRsZScgICA9PiBnZXRfdGhlX3RpdGxlKCRwaWQpLAogICAgICdkZWtvZHVvdGFfMXgnICAgID0+IGh0bWxfZW50aXR5X2RlY29kZSgkcmF3LCBFTlRfUVVPVEVTfEVOVF9IVE1MNSwgJ1VURi04JyksCiAgICAgJ2Rla29kdW90YV8yeCcgICAgPT4gaHRtbF9lbnRpdHlfZGVjb2RlKGh0bWxfZW50aXR5X2RlY29kZSgkcmF3LCBFTlRfUVVPVEVTfEVOVF9IVE1MNSwgJ1VURi04JyksIEVOVF9RVU9URVN8RU5UX0hUTUw1LCAnVVRGLTgnKSwKICAgKTsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H096'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  for(const p of ['/feed/google/','/feed/kaina24/','/feed/kainos/','/feed/kainos-lt/']){
    try{ const r=await fetch(WP+p); const t=await r.text();
      out['URL'+p]={http:r.status, KB:Math.round(t.length/1024),
        amp_amp:(t.match(/&amp;amp;/g)||[]).length, amp:(t.match(/&amp;/g)||[]).length,
        pavyzdys:(t.match(/[^<>]*(FARMINA|Real Dog)[^<>]*/)||[''])[0].slice(0,150)};
    }catch(e){ out['URL'+p]={klaida:String(e).slice(0,80)}; }
  }
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H096 feed esybiu patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h096=GO'); const tt=await rr.text();
  try{ out.SERVERIS=JSON.parse(tt); }catch(e){ out.SERVERIS={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h096.json', Buffer.from(JSON.stringify(out,null,1)), 'h096 feed esybiu patikra');
