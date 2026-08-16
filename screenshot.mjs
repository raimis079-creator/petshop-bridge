process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'S893-FINAL'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const KODAS_B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2QnXSk/JF9HRVRbJ3BzX2QnXTonJykhPT0nUzg5M0ZJTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgQHNldF90aW1lX2xpbWl0KDYwMCk7CiAkUD0kd3BkYi0+cHJlZml4OyAkTFQ9JFAuJ3djX3Byb2R1Y3RfYXR0cmlidXRlc19sb29rdXAnOyAkbz1hcnJheSgpOwoKIC8qIGxpa3VzaXUgYnJ1a3NuaW5pdSByYWt0dSBpc3ZhbHltYXMgKi8KICRsaWtvPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3Byb2R1Y3RfYXR0cmlidXRlcycgQU5EIChtZXRhX3ZhbHVlIExJS0UgJyVwYV9iZS1ncnVkdSUnIE9SIG1ldGFfdmFsdWUgTElLRSAnJXBhX3NwZWNpYWxpLW1pdHliYSUnIE9SIG1ldGFfdmFsdWUgTElLRSAnJXBhX2JhbHR5bXUtc2FsdGluaXMlJykiKTsKICRnZXJvcz1hcnJheSgpOyBmb3JlYWNoKHdjX2dldF9hdHRyaWJ1dGVfdGF4b25vbWllcygpIGFzICRhKXsgJGdlcm9zWydwYV8nLiRhLT5hdHRyaWJ1dGVfbmFtZV09MTsgfQogJG9bJ2xpa3VzaW9zJ109YXJyYXkoKTsKIGZvcmVhY2goJGxpa28gYXMgJHBpZCl7CiAgJHBpZD0oaW50KSRwaWQ7ICRtPWdldF9wb3N0X21ldGEoJHBpZCwnX3Byb2R1Y3RfYXR0cmlidXRlcycsdHJ1ZSk7IGlmKCFpc19hcnJheSgkbSkpIGNvbnRpbnVlOwogICRpbmZvPWFycmF5KCdpZCc9PiRwaWQsJ3RpcGFzJz0+Z2V0X3Bvc3RfdHlwZSgkcGlkKSwnc3RhdHVzYXMnPT5nZXRfcG9zdF9zdGF0dXMoJHBpZCksJ2J1dm8nPT5hcnJheV9rZXlzKCRtKSwndmVpa3NtYWknPT5hcnJheSgpKTsKICAka2Vpc3RhPWZhbHNlOwogIGZvcmVhY2goYXJyYXlfa2V5cygkbSkgYXMgJGspewogICBpZihzdHJwb3MoJGssJ3BhXycpIT09MCB8fCBpc3NldCgkZ2Vyb3NbJGtdKSkgY29udGludWU7CiAgICR0aWtzbGFzPXN0cl9yZXBsYWNlKCctJywnXycsJGspOwogICAkdD13cF9nZXRfcG9zdF90ZXJtcygkcGlkLCR0aWtzbGFzLGFycmF5KCdmaWVsZHMnPT4naWRzJykpOwogICBpZihpc3NldCgkZ2Vyb3NbJHRpa3NsYXNdKSAmJiAhaXNfd3BfZXJyb3IoJHQpICYmICR0ICYmICFpc3NldCgkbVskdGlrc2xhc10pKXsKICAgICAkbVskdGlrc2xhc109YXJyYXkoJ25hbWUnPT4kdGlrc2xhcywndmFsdWUnPT4nJywncG9zaXRpb24nPT4wLCdpc192aXNpYmxlJz0+MSwnaXNfdmFyaWF0aW9uJz0+MCwnaXNfdGF4b25vbXknPT4xKTsKICAgICAkaW5mb1sndmVpa3NtYWknXVtdPSdwZXJ2YWRpbnRhICcuJGs7CiAgIH0gZWxzZSB7ICRpbmZvWyd2ZWlrc21haSddW109J2lzdHJpbnRhICcuJGs7IH0KICAgdW5zZXQoJG1bJGtdKTsgJGtlaXN0YT10cnVlOwogIH0KICBpZigka2Vpc3RhKXsgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcHJvZHVjdF9hdHRyaWJ1dGVzJywkbSk7ICRpbmZvWyd0YXBvJ109YXJyYXlfa2V5cygkbSk7CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgICBpZigkcHIgJiYgZnVuY3Rpb25fZXhpc3RzKCd3Y19nZXRfY29udGFpbmVyJykpewogICAgICB0cnl7IHdjX2dldF9jb250YWluZXIoKS0+Z2V0KCdBdXRvbWF0dGljXFxXb29Db21tZXJjZVxcSW50ZXJuYWxcXFByb2R1Y3RBdHRyaWJ1dGVzTG9va3VwXFxMb29rdXBEYXRhU3RvcmUnKS0+Y3JlYXRlX2RhdGFfZm9yX3Byb2R1Y3QoJHByKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fQogICAgfQogIH0KICAkb1snbGlrdXNpb3MnXVtdPSRpbmZvOwogfQogJG9bJ2JydWtzbmluaWFpX3BvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHJvZHVjdF9hdHRyaWJ1dGVzJyBBTkQgKG1ldGFfdmFsdWUgTElLRSAnJXBhX2JlLWdydWR1JScgT1IgbWV0YV92YWx1ZSBMSUtFICclcGFfc3BlY2lhbGktbWl0eWJhJScpIik7CgogLyoga29uc2VydnUgZmlsdHJ1IGJ1c2VuYSAqLwogZm9yZWFjaChhcnJheSg3Mz0+J0tvbnNlcnZhaSBzdW5pbXMnLDc5PT4nS29uc2VydmFpIGthdGVtcycpIGFzICRraWQ9PiRrcCl7CiAgJGVpbD1hcnJheSgpOwogIGZvcmVhY2goZ2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9PidwYV9zcGVjaWFsaV9taXR5YmEnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKSBhcyAkdCl7CiAgIGlmKGlzX3dwX2Vycm9yKCR0KSkgY29udGludWU7CiAgICRuPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoCiAgICAgIlNFTEVDVCBDT1VOVChESVNUSU5DVCBsLnByb2R1Y3Rfb3JfcGFyZW50X2lkKSBGUk9NIHskTFR9IGwKICAgICAgSk9JTiB7JFB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1sLnByb2R1Y3Rfb3JfcGFyZW50X2lkCiAgICAgIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkCiAgICAgIFdIRVJFIGwudGVybV9pZD0lZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQudGVybV9pZD0lZCIsICR0LT50ZXJtX2lkLCAka2lkKSk7CiAgIGlmKCRuKSAkZWlsWyR0LT5uYW1lXT0kbjsKICB9CiAgYXJzb3J0KCRlaWwpOyAkb1snbWl0eWJhXycuJGtpZF09YXJyYXkoJ2thdCc9PiRrcCwndGVybWluYWknPT4kZWlsKTsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
try{
  const sid=await snip('TEMP S893 FIN', Buffer.from(KODAS_B64,'base64').toString('utf8'));
  await new Promise(r=>setTimeout(r,6000));
  const r0=await fetch(WP+'/?ps_d=S893FIN'); const t0=await r0.text();
  try{ out.php=JSON.parse(t0); }catch(e){ out.php_raw=t0.slice(0,500); }
  await off(sid);
  const K='/kategorija/katems/maistas-katems/konservai-katems/';
  const S='/kategorija/sunims/maistas-sunims/konservai-sunims/';
  const testai={
   'katems (be filtro)':K,
   'katems Odai ir kailiui':K+'?filter_speciali_mityba=odai-ir-kailiui',
   'katems Slapimo takams':K+'?filter_speciali_mityba=slapimo-takams',
   'katems Jautriam virskinimui':K+'?filter_speciali_mityba=jautriam-virskinimui',
   'katems Monoproteinas':K+'?filter_monoprotein=taip',
   'sunims (be filtro)':S,
   'sunims Hipoalerginis':S+'?filter_speciali_mityba=hipoalerginis',
   'sunims 800 g':S+'?filter_pakuotes_dydis=800-g'
  };
  out.puslapiai={};
  for(const [pav,u] of Object.entries(testai)){
    try{ const r=await fetch(WP+u); const h=await r.text();
      out.puslapiai[pav]={http:r.status,
        nerasta:/Produkt[uų] nerasta/i.test(h)?'TAIP':'ne',
        prekiu:(h.match(/class="[^"]*product-small[^"]*"/g)||[]).length,
        rezultatu:(h.match(/Rodoma[^<]{0,60}|Rodomi[^<]{0,60}|Showing[^<]{0,60}/)||[])[0]||''};
    }catch(e){ out.puslapiai[pav]='err'; }
  }
}catch(e){ out.bendra=String(e).slice(0,400); }
await put('screenshots/ata2.json', Buffer.from(JSON.stringify(out)), 'S893 final');
console.log('ok');
