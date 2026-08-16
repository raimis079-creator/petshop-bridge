process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'KONS-DIAG-8'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'kons diag',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const KODAS_B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2QnXSkgPyAkX0dFVFsncHNfZCddIDogJycpICE9PSAnS09OU1Y4JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyBAc2V0X3RpbWVfbGltaXQoNjAwKTsKICRvPWFycmF5KCd2ZXJzaWphJz0+J0tPTlMtRElBRy04Jyk7ICRQPSR3cGRiLT5wcmVmaXg7CiAkTFQ9JFAuJ3djX3Byb2R1Y3RfYXR0cmlidXRlc19sb29rdXAnOwoKIC8qIDEuIEFyIGxvb2t1cCBsZW50ZWxlIGVnemlzdHVvamEgaXIgaWp1bmd0YSAqLwogJHlyYT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0hPVyBUQUJMRVMgTElLRSAlcyIsJExUKSk7CiAkb1snbG9va3VwJ109YXJyYXkoJ2xlbnRlbGUnPT4keXJhPyR5cmE6J05FUkEnLAogICAnaWp1bmd0YSc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2F0dHJpYnV0ZV9sb29rdXBfZW5hYmxlZCcpLAogICAnZGlyZWN0X3VwZGF0ZXMnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9hdHRyaWJ1dGVfbG9va3VwX2RpcmVjdF91cGRhdGVzJyksCiAgICdyZWdlbmVyYXRpb25faW5fcHJvZ3Jlc3MnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9hdHRyaWJ1dGVfbG9va3VwX3JlZ2VuZXJhdGlvbl9pbl9wcm9ncmVzcycpLAogICAnbGFzdF9wcm9kdWN0c19wYWdlJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfYXR0cmlidXRlX2xvb2t1cF9sYXN0X3Byb2R1Y3RzX3BhZ2UnKSwKICAgJ29wdGltaXplZF91cGRhdGVzJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfYXR0cmlidXRlX2xvb2t1cF9vcHRpbWl6ZWRfdXBkYXRlcycpKTsKIGlmKCR5cmEpewogICAkb1snbG9va3VwJ11bJ2VpbHVjaXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JExUfSIpOwogICAkb1snbG9va3VwJ11bJ3Byb2R1a3R1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHByb2R1Y3RfaWQpIEZST00geyRMVH0iKTsKICAgJG9bJ2xvb2t1cCddWydwYWdhbF90YXgnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0YXhvbm9teSwgQ09VTlQoKikgYywgQ09VTlQoRElTVElOQ1QgcHJvZHVjdF9pZCkgcCBGUk9NIHskTFR9IEdST1VQIEJZIHRheG9ub215IE9SREVSIEJZIGMgREVTQyIsIEFSUkFZX0EpOwogICAvKiBrb25rcmV0dXMgdGVybWluYXMgMjkxICovCiAgICRvWydsb29rdXAnXVsnb2RhaV8yOTEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkLHByb2R1Y3Rfb3JfcGFyZW50X2lkLHRlcm1faWQsaXNfdmFyaWF0aW9uX2F0dHJpYnV0ZSxpbl9zdG9jayBGUk9NIHskTFR9IFdIRVJFIHRlcm1faWQ9MjkxIExJTUlUIDMwIiwgQVJSQVlfQSk7CiAgIC8qIDUgRG9saW5hIHByZWtlcyAqLwogICAkb1snbG9va3VwJ11bJ2RvbGluYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsdGF4b25vbXksdGVybV9pZCBGUk9NIHskTFR9IFdIRVJFIHByb2R1Y3RfaWQgSU4gKDE4ODUwLDE4ODI5LDE4ODMyLDE4ODI2LDE4ODIzKSBPUkRFUiBCWSBwcm9kdWN0X2lkIiwgQVJSQVlfQSk7CiAgIC8qIHBhbHlnaW5hbToga2llayB0ZXJtX3JlbGF0aW9uc2hpcHMgdHVyaSBwYV8gdnMgbG9va3VwICovCiAgICR0cj0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIFdIRVJFIHR0LnRheG9ub215IExJS0UgJ3BhXFxfJSciKTsKICAgJG9bJ2xvb2t1cCddWyd0ZXJtX3JlbGF0aW9uc2hpcHNfcGEnXT0kdHI7CiB9CgogLyogMi4gS29raWUgcXVlcnlfdmFyJ2FpIGF0cGF6aXN0YW1pICovCiAkb1snd2NfcXVlcnlfdmFycyddPWFycmF5KCk7CiBpZihjbGFzc19leGlzdHMoJ1dDX1F1ZXJ5JykpewogICAkb1snd2NfcXVlcnlfdmFycyddWydsYXllcmVkX25hdl9wb3N0X3R5cGUnXT1XQ19RdWVyeTo6Z2V0X2xheWVyZWRfbmF2X2Nob3Nlbl9hdHRyaWJ1dGVzKCk7CiB9CiAkYXQ9d2NfZ2V0X2F0dHJpYnV0ZV90YXhvbm9taWVzKCk7CiAkdmFyZGFpPWFycmF5KCk7CiBmb3JlYWNoKCRhdCBhcyAkYSl7ICR2YXJkYWlbXT1hcnJheSgnbmFtZSc9PiRhLT5hdHRyaWJ1dGVfbmFtZSwndGF4Jz0+d2NfYXR0cmlidXRlX3RheG9ub215X25hbWUoJGEtPmF0dHJpYnV0ZV9uYW1lKSwKICAgJ2ZpbHRlcl92YXInPT4nZmlsdGVyXycuJGEtPmF0dHJpYnV0ZV9uYW1lKTsgfQogJG9bJ2ZpbHRlcl92YXJhaSddPSR2YXJkYWk7CgogLyogMy4gWUlUSCB2ZXJzaWphIC8gYXIgbmF1ZG9qYSBsb29rdXAgKi8KICRvWyd5aXRoX3ZlciddPWdldF9vcHRpb24oJ3lpdGhfd2Nhbl92ZXJzaW9uJyk7CiAkb1sneWl0aF9zdXBwb3J0c19sb29rdXAnXT1jbGFzc19leGlzdHMoJ1lJVEhfV0NBTl9RdWVyeScpPydrbGFzZSB5cmEnOiduZXJhJzsKCiAvKiA0LiBUaWtyYSBXUF9RdWVyeSBzdSBsb29rdXAga2VsaXUgKGthaXAgV0MgZmlsdHJ1b2phKSAqLwogaWYoJHlyYSl7CiAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBwcm9kdWN0X29yX3BhcmVudF9pZCBGUk9NIHskTFR9IFdIRVJFIHRheG9ub215PSdwYV9zcGVjaWFsaV9taXR5YmEnIEFORCB0ZXJtX2lkPTI5MSIpOwogICAkb1snbG9va3VwX29kYWlfaWRzJ109YXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpOwogICAkaWRzMj0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIG9iamVjdF9pZCBGUk9NIHskUH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgV0hFUkUgdHQudGF4b25vbXk9J3BhX3NwZWNpYWxpX21pdHliYScgQU5EIHR0LnRlcm1faWQ9MjkxIik7CiAgICRvWyd0cl9vZGFpX2lkc19zayddPWNvdW50KCRpZHMyKTsKICAgJG9bJ3NraXJ0dW1hc190cl9taW51c19sb29rdXAnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfZGlmZihhcnJheV9tYXAoJ2ludHZhbCcsJGlkczIpLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSkpLDAsNDApOwogfQoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMTMxKTsK';
try{
  const kodas=Buffer.from(KODAS_B64,'base64').toString('utf8');
  const sid=await snip('TEMP KONS DIAG 8', kodas);
  out.snippet_id=sid;
  await new Promise(r=>setTimeout(r,5000));
  const r=await fetch(WP+'/?ps_d=KONSV8');
  const txt=await r.text();
  out.http=r.status;
  try{ out.data=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,3000); out.parse_err=String(e).slice(0,200); }
  await off(sid);
  const BASE='/kategorija/katems/maistas-katems/konservai-katems/';
  out.url_bandymai={};
  const kand=[BASE, BASE+'?filter_speciali_mityba=odai-ir-kailiui', BASE+'?filter_speciali-mityba=odai-ir-kailiui', BASE+'?pa_speciali_mityba=odai-ir-kailiui', BASE+'?filter_baltymu_saltinis=lasisa', BASE+'?filter_be_grudu=be-grudu'];
  for(const u of kand){
    try{ const r2=await fetch(WP+u); const h=await r2.text();
      out.url_bandymai[u]={http:r2.status,
        nerasta:/Produkt[uų] nerasta/i.test(h)?1:0,
        prekiu:(h.match(/class="[^"]*product-small[^"]*"/g)||[]).length,
        aktyvus:(h.match(/yith-wcan-active-filter[\s\S]{0,120}/)||[])[0]||''};
    }catch(e){ out.url_bandymai[u]='err '+String(e).slice(0,80); }
  }
}catch(e){ out.bendra=String(e).slice(0,400); }
await irasyk();
console.log('ok');
