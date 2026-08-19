process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDc0J10pPyRfR0VUWydwc19oMDc0J106Jyc7CiBpZighaW5fYXJyYXkoJGEsYXJyYXkoJ1JVT1NUSScsJ0JVU0VOQScpLHRydWUpKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMzAwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nSDA3NCcsJ2EnPT4kYSk7CgogaWYoJGE9PT0nUlVPU1RJJyl7CiAgIC8qIDEuIGJhbmRvbW9qaSBwcmVrZSAqLwogICAkZXNhbWE9JHdwZGItPmdldF92YXIoIlNFTEVDVCBJRCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X25hbWU9J3BzLXRlc3Rhcy0xLWV1cicgQU5EIHBvc3RfdHlwZT0ncHJvZHVjdCcgTElNSVQgMSIpOwogICBpZigkZXNhbWEpeyAkaWQ9KGludCkkZXNhbWE7IH0KICAgZWxzZSB7CiAgICAgJGlkPXdwX2luc2VydF9wb3N0KGFycmF5KCdwb3N0X3RpdGxlJz0+J1RFU1RBUyBQYXlzZXJhIDEgRVVSJywncG9zdF9uYW1lJz0+J3BzLXRlc3Rhcy0xLWV1cicsCiAgICAgICAncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdF9jb250ZW50Jz0+J1RlY2huaW5pcyBtb2vEl2ppbW8gZ3JhbmRpbsSXcyB0ZXN0YXMuIEJ1cyBpxaF0cmludGEuJykpOwogICB9CiAgIGlmKCEkaWQgfHwgaXNfd3BfZXJyb3IoJGlkKSl7ICRvWydLTEFJREEnXT0ncHJla2VzIHN1a3VydGkgbmVwYXZ5a28nOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOwogICAkcC0+c2V0X3JlZ3VsYXJfcHJpY2UoJzEuMDAnKTsgJHAtPnNldF9wcmljZSgnMS4wMCcpOwogICAkcC0+c2V0X3ZpcnR1YWwodHJ1ZSk7ICRwLT5zZXRfbWFuYWdlX3N0b2NrKGZhbHNlKTsgJHAtPnNldF9zdG9ja19zdGF0dXMoJ2luc3RvY2snKTsKICAgJHAtPnNldF9jYXRhbG9nX3Zpc2liaWxpdHkoJ2hpZGRlbicpOyAgICAgICAvKiBuZW1hdG9tYSBrYXRhbG9nZSBpciBwYWllc2tvamUgKi8KICAgJHAtPnNldF90YXhfc3RhdHVzKCd0YXhhYmxlJyk7CiAgICRwLT5zYXZlKCk7CiAgIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfdGVzdGluZScsMSk7CiAgICRvWydwcmVrZSddPWFycmF5KCdpZCc9PiRpZCwndXJsJz0+Z2V0X3Blcm1hbGluaygkaWQpLAogICAgICdpX2tyZXBzZWxpJz0+d2NfZ2V0X2NoZWNrb3V0X3VybCgpLic/YWRkLXRvLWNhcnQ9Jy4kaWQsCiAgICAgJ2thaW5hJz0+JHAtPmdldF9wcmljZSgpLCd2aXJ0dWFsaSc9PiRwLT5pc192aXJ0dWFsKCk/MTowLCdtYXRvbWEnPT4kcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpKTsKCiAgIC8qIDIuIGRldGFsdXMgUGF5c2VyYSB6dXJuYWxhcyAqLwogICAkZT0oYXJyYXkpZ2V0X29wdGlvbigncGF5c2VyYV9wYXltZW50X2V4dHJhX3NldHRpbmdzJyk7CiAgICRvWydsb2dfbHlnaXNfYnV2byddPWlzc2V0KCRlWydsb2dfbGV2ZWwnXSk/JGVbJ2xvZ19sZXZlbCddOm51bGw7CiAgICRlWydsb2dfbGV2ZWwnXT0nZGVidWcnOwogICB1cGRhdGVfb3B0aW9uKCdwYXlzZXJhX3BheW1lbnRfZXh0cmFfc2V0dGluZ3MnLCRlKTsKCiAgIC8qIDMuIFRJS1JBUyByZXppbWFzICovCiAgICRtPShhcnJheSlnZXRfb3B0aW9uKCdwYXlzZXJhX3BheW1lbnRfbWFpbl9zZXR0aW5ncycpOwogICAkb1sndGVzdF9tb2RlX2J1dm8nXT1pc3NldCgkbVsndGVzdF9tb2RlJ10pPyRtWyd0ZXN0X21vZGUnXTpudWxsOwogICAkbVsndGVzdF9tb2RlJ109J25vJzsKICAgdXBkYXRlX29wdGlvbigncGF5c2VyYV9wYXltZW50X21haW5fc2V0dGluZ3MnLCRtKTsKCiAgIC8qIDQuIGJ1c2VuYSBQUklFUyAqLwogICAkb1sndXpzYWt5bXVfcHJpZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9d2Nfb3JkZXJzIik7CiAgICRvWydwYXNrdXRpbmlzX2lkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIE1BWChpZCkgRlJPTSB7JFB9d2Nfb3JkZXJzIik7CiAgICRvWydrbGFpZHVfcHJpZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfc2FyZ2FzX2tsYWlkb3MiKTsKIH0KCiBpZigkYT09PSdCVVNFTkEnKXsKICAgJG09KGFycmF5KWdldF9vcHRpb24oJ3BheXNlcmFfcGF5bWVudF9tYWluX3NldHRpbmdzJyk7CiAgICRlPShhcnJheSlnZXRfb3B0aW9uKCdwYXlzZXJhX3BheW1lbnRfZXh0cmFfc2V0dGluZ3MnKTsKICAgJG9bJ3BheXNlcmEnXT1hcnJheSgncHJvamVjdF9pZCc9Pmlzc2V0KCRtWydwcm9qZWN0X2lkJ10pPyRtWydwcm9qZWN0X2lkJ106bnVsbCwKICAgICAnc2xhcHRhem9kaXMnPT4hZW1wdHkoJG1bJ3Byb2plY3RfcGFzc3dvcmQnXSk/KCdZUkEgJy5zdHJsZW4oJG1bJ3Byb2plY3RfcGFzc3dvcmQnXSkuJyBzaW1iLicpOidUVVNDSUFTJywKICAgICAndGVzdF9tb2RlJz0+aXNzZXQoJG1bJ3Rlc3RfbW9kZSddKT8kbVsndGVzdF9tb2RlJ106bnVsbCwKICAgICAnbG9nX2xldmVsJz0+aXNzZXQoJGVbJ2xvZ19sZXZlbCddKT8kZVsnbG9nX2xldmVsJ106bnVsbCk7CiAgICRvWydjYWxsYmFjayddPWhvbWVfdXJsKCcvP3djLWFwaT1wYXlzZXJhX2NhbGxiYWNrJyk7CiAgICRvWyd1enNha3ltdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13Y19vcmRlcnMiKTsKICAgJG9bJ3Bhc2t1dGluaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLHBheW1lbnRfbWV0aG9kLHBheW1lbnRfbWV0aG9kX3RpdGxlLHRvdGFsX2Ftb3VudCxkYXRlX2NyZWF0ZWRfZ210CiAgICAgRlJPTSB7JFB9d2Nfb3JkZXJzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsIEFSUkFZX0EpOwogICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H074'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H074 paysera ruosa',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r1=await fetch(WP+'/?ps_h074=RUOSTI'); const t1=await r1.text();
  try{ out.ruosa=JSON.parse(t1); }catch(e){ out.r_zalias=t1.slice(0,300); }
  await new Promise(r=>setTimeout(r,2000));
  const r2=await fetch(WP+'/?ps_h074=BUSENA'); const t2=await r2.text();
  try{ out.busena=JSON.parse(t2); }catch(e){ out.b_zalias=t2.slice(0,300); }
  /* ar preke pasiekiama */
  if(out.ruosa && out.ruosa.preke){
    try{ const x=await fetch(out.ruosa.preke.url); const h=await x.text();
      out.prekes_psl={http:x.status, kaina:(h.match(/([\d,]+)\s*&euro;|([\d,]+)\s*€/)||['',''])[0].slice(0,20),
        i_krepseli:/add-to-cart/.test(h)?1:0}; }
    catch(e){ out.prekes_psl={kl:1}; }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h074.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h074 paysera ruosa');
